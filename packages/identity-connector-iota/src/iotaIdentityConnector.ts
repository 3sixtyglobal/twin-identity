// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	Credential,
	EdDSAJwsVerifier,
	FailFast,
	IdentityClient,
	IdentityClientReadOnly,
	IotaDID,
	IotaDocument,
	Jwk,
	JwkMemStore,
	JwkType,
	JwsAlgorithm,
	JwsSignatureOptions,
	Jwt,
	JwtCredentialValidationOptions,
	JwtCredentialValidator,
	JwtPresentationOptions,
	JwtPresentationValidationOptions,
	JwtPresentationValidator,
	KeyIdMemStore,
	MethodDigest,
	MethodScope,
	OnChainIdentity,
	Presentation,
	Resolver,
	RevocationBitmap,
	Service,
	Storage,
	StorageSigner,
	SubjectHolderRelationship,
	Timestamp,
	VerificationMethod,
	type ControllerToken,
	type DIDUrl,
	type ICredential,
	type IJwkParams,
	type IPresentation
} from "@iota/identity-wasm/node/index.js";
import type {
	Transaction,
	TransactionBuilder,
	TransactionOutput
} from "@iota/iota-interaction-ts/node/transaction_internal.js";
import {
	BaseError,
	Converter,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	ObjectHelper,
	RandomHelper,
	Url,
	Urn
} from "@twin.org/core";
import type { IJsonLdContextDefinitionRoot, IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { Iota } from "@twin.org/dlt-iota";
import { Did, DocumentHelper, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	DidVerificationMethodType,
	ProofHelper,
	ProofTypes,
	type IDidDocument,
	type IDidDocumentVerificationMethod,
	type IDidService,
	type IDidVerifiableCredentialV1,
	type IDidVerifiablePresentationV1,
	type IProof
} from "@twin.org/standards-w3c-did";
import { VaultConnectorFactory, VaultKeyType, type IVaultConnector } from "@twin.org/vault-models";
import { Jwk as JwkHelper } from "@twin.org/web";
import { NetworkConstants } from "./constants/networkConstants.js";
import type { IIotaIdentityConnectorConfig } from "./models/IIotaIdentityConnectorConfig.js";
import type { IIotaIdentityConnectorConstructorOptions } from "./models/IIotaIdentityConnectorConstructorOptions.js";

/**
 * Class for performing identity operations on IOTA.
 */
export class IotaIdentityConnector implements IIdentityConnector {
	/**
	 * The namespace supported by the identity connector.
	 */
	public static readonly NAMESPACE: string = "iota";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IotaIdentityConnector>();

	/**
	 * The vault for the keys.
	 * @internal
	 */
	private readonly _vaultConnector: IVaultConnector;

	/**
	 * The configuration to use for IOTA operations.
	 * @internal
	 */
	private readonly _config: IIotaIdentityConnectorConfig;

	/**
	 * The wallet address index to use for funding.
	 * @internal
	 */
	private readonly _walletAddressIndex: number;

	/**
	 * Gas budget for transactions.
	 * @internal
	 */
	private readonly _gasBudget: number;

	/**
	 * Standard gas price in nanos per computation unit.
	 * (1 Nano = 0.000000001 IOTA)
	 * @internal
	 */
	private readonly _standardGasPrice: bigint;

	/**
	 * Create a new instance of IotaIdentityConnector.
	 * @param options The options for the identity connector.
	 */
	constructor(options: IIotaIdentityConnectorConstructorOptions) {
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IIotaIdentityConnectorConfig>(
			IotaIdentityConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.object<IIotaIdentityConnectorConfig["clientOptions"]>(
			IotaIdentityConnector.CLASS_NAME,
			nameof(options.config.clientOptions),
			options.config.clientOptions
		);
		this._vaultConnector = VaultConnectorFactory.get(options.vaultConnectorType ?? "vault");

		this._config = options.config;

		this._gasBudget = this._config.gasBudget ?? 1_000_000_000;
		this._walletAddressIndex = options.config.walletAddressIndex ?? 0;
		this._standardGasPrice = BigInt(this._config.standardGasPrice ?? 1000);

		Iota.populateConfig(this._config);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IotaIdentityConnector.CLASS_NAME;
	}

	/**
	 * Create a new document.
	 * @param controller The controller of the identity who can make changes.
	 * @returns The created document.
	 */
	public async createDocument(controller: string): Promise<IDidDocument> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);

		try {
			const identityClient = await this.getIdentityClient(controller);
			const networkHrp = identityClient.network();
			const document = new IotaDocument(networkHrp);

			const revocationBitmap = new RevocationBitmap();
			const revocationServiceId = document.id().join("#revocation");
			document.insertService(revocationBitmap.toService(revocationServiceId));

			const executionResult = await this.executeIdentityTransaction(
				controller,
				identityClient.createIdentity(document).finish() as unknown as TransactionBuilder<
					Transaction<unknown>
				>
			);

			const did = this.extractDidFromExecutionResult(executionResult, networkHrp); // Both regular and gas station transactions now use waitForTransactionConfirmation
			// so the DID should be immediately resolvable after transaction confirmation
			const resolved = await identityClient.resolveDid(did);

			const docJson = resolved.toJSON() as { doc: IDidDocument };

			return docJson.doc;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"createDocumentFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Remove a document.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to remove.
	 * @returns Nothing.
	 */
	public async removeDocument(controller: string, documentId: string): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);

		try {
			const identityClient = await this.getIdentityClient(controller);

			const idParts = DocumentHelper.parseId(documentId).id.split(":");
			const onChain = await OnChainIdentity.getById(
				`0x${idParts[idParts.length - 1]}`,
				identityClient
			);
			if (Is.undefined(onChain)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", documentId);
			}

			const controllerToken = await onChain.getControllerToken(identityClient);
			if (Is.undefined(controllerToken)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", documentId);
			}

			const deleteBuilder = onChain
				.deleteDid(controllerToken)
				.withGasBudget(BigInt(this._gasBudget));

			if (Is.object(this._config.gasStation)) {
				await this.executeGasStationTransaction(controller, deleteBuilder, "update");
			}

			await deleteBuilder.buildAndExecute(identityClient);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"removeDocumentFailed",
				undefined,
				error
			);
		}
	}

	/**
	 * Add a verification method to the document in JSON Web key Format.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to add the verification method to.
	 * @param verificationMethodType The type of the verification method to add.
	 * @param verificationMethodId The id of the verification method, if undefined uses the kid of the generated JWK.
	 * @returns The verification method.
	 * @throws NotFoundError if the id can not be resolved.
	 * @throws NotSupportedError if the platform does not support multiple keys.
	 */
	public async addVerificationMethod(
		controller: string,
		documentId: string,
		verificationMethodType: DidVerificationMethodType,
		verificationMethodId?: string
	): Promise<IDidDocumentVerificationMethod> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.arrayOneOf<DidVerificationMethodType>(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verificationMethodType),
			verificationMethodType,
			Object.values(DidVerificationMethodType)
		);

		let tempKeyId;
		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(documentId));
			if (Is.undefined(document)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", documentId);
			}

			const identity = await identityClient.getIdentity(Did.parse(documentId).id);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					identityOnChain
				);
			}

			let methodKeyPublic;
			if (Is.stringValue(verificationMethodId)) {
				// If there is a verification method id, we will try to get the key from the vault.
				try {
					// If there is an existing key, we will use it.
					const existingKey = await this._vaultConnector.getKey(
						this.buildVaultKey(documentId, verificationMethodId)
					);
					methodKeyPublic = existingKey.publicKey;
				} catch {}
			}

			if (Is.empty(methodKeyPublic)) {
				// If there is no existing key, we will create a new one with a temporary name.
				tempKeyId = `temp-vm-${Converter.bytesToBase64Url(RandomHelper.generate(16))}`;
				methodKeyPublic = await this._vaultConnector.createKey(
					this.buildVaultKey(documentId, tempKeyId),
					VaultKeyType.Ed25519
				);
			}

			const jwkParams = await JwkHelper.fromEd25519Public(methodKeyPublic);
			const jwk = new Jwk(jwkParams as IJwkParams);

			const methodId = `#${verificationMethodId ?? (await JwkHelper.generateKid(jwkParams))}`;

			if (Is.stringValue(tempKeyId)) {
				// If we created a temporary key, we will rename it to the final method id.
				await this._vaultConnector.renameKey(
					this.buildVaultKey(documentId, tempKeyId),
					this.buildVaultKey(documentId, methodId.slice(1))
				);
				tempKeyId = undefined;
			}

			const method = VerificationMethod.newFromJwk(document.id(), jwk, methodId);
			const methods = document.methods();
			const existingMethod = methods.find(m => m.id().toString() === method.id().toString());

			if (existingMethod) {
				document.removeMethod(method.id());
			}

			if (verificationMethodType === "verificationMethod") {
				document.insertMethod(method, MethodScope.VerificationMethod());
			} else if (verificationMethodType === "authentication") {
				document.insertMethod(method, MethodScope.Authentication());
			} else if (verificationMethodType === "assertionMethod") {
				document.insertMethod(method, MethodScope.AssertionMethod());
			} else if (verificationMethodType === "keyAgreement") {
				document.insertMethod(method, MethodScope.KeyAgreement());
			} else if (verificationMethodType === "capabilityDelegation") {
				document.insertMethod(method, MethodScope.CapabilityDelegation());
			} else if (verificationMethodType === "capabilityInvocation") {
				document.insertMethod(method, MethodScope.CapabilityInvocation());
			}

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);

			return method.toJSON() as IDidDocumentVerificationMethod;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"addVerificationMethodFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		} finally {
			if (Is.stringValue(tempKeyId)) {
				// If we created a temporary key and it is still in use, we will remove it from the vault.
				try {
					await this._vaultConnector.removeKey(tempKeyId);
				} catch {}
			}
		}
	}

	/**
	 * Remove a verification method from the document.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The id of the verification method.
	 * @returns Nothing.
	 * @throws NotFoundError if the id can not be resolved.
	 * @throws NotSupportedError if the platform does not support multiple revocable keys.
	 */
	public async removeVerificationMethod(
		controller: string,
		verificationMethodId: string
	): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(document)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const methods = document.methods();
			const method = methods.find(m => m.id().toString() === verificationMethodId);
			if (!method) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"verificationMethodNotFound",
					verificationMethodId
				);
			}

			document.removeMethod(method.id());

			const identity = await identityClient.getIdentity(Did.parse(idParts.id).id);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					verificationMethodId
				);
			}

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"removeVerificationMethodFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Add a service to the document.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to add the service to.
	 * @param serviceId The id of the service.
	 * @param serviceType The type of the service.
	 * @param serviceEndpoint The endpoint for the service.
	 * @returns The service.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async addService(
		controller: string,
		documentId: string,
		serviceId: string,
		serviceType: string | string[],
		serviceEndpoint: string | string[]
	): Promise<IDidService> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(serviceId), serviceId);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(serviceType), serviceType);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(serviceEndpoint), serviceEndpoint);

		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(documentId));
			if (Is.undefined(document)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", documentId);
			}

			const identity = await identityClient.getIdentity(Did.parse(documentId).id);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					identityOnChain
				);
			}

			const service = new Service({
				id: `${document.id().toString()}#${serviceId}`,
				type: serviceType,
				serviceEndpoint
			});

			document.insertService(service);

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);

			return service.toJSON() as unknown as IDidService;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"addServiceFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Remove a service from the document.
	 * @param controller The controller of the identity who can make changes.
	 * @param serviceId The id of the service.
	 * @returns Nothing.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async removeService(controller: string, serviceId: string): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(serviceId), serviceId);

		try {
			const idParts = DocumentHelper.parseId(serviceId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "missingDid", serviceId);
			}

			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(document)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const services = document.service();
			const service = services.find(s => s.id().toString() === serviceId);

			if (!service) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "serviceNotFound", serviceId);
			}

			document.removeService(service.id());

			const identity = await identityClient.getIdentity(Did.parse(idParts.id).id);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "identityNotFound", idParts.id);
			}

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"removeServiceFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Create a verifiable credential for a verification method.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The verification method id to use.
	 * @param id The id of the credential.
	 * @param subject The credential subject to store in the verifiable credential.
	 * @param options Additional options for creating the verifiable credential.
	 * @param options.revocationIndex The bitmap revocation index of the credential, if undefined will not have revocation status.
	 * @param options.expirationDate The date the verifiable credential is valid until.
	 * @returns The created verifiable credential and its token.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async createVerifiableCredential(
		controller: string,
		verificationMethodId: string,
		id: string | undefined,
		subject: IJsonLdNodeObject,
		options?: {
			revocationIndex?: number;
			expirationDate?: Date;
		}
	): Promise<{
		verifiableCredential: IDidVerifiableCredentialV1;
		jwt: string;
	}> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.objectValue(IotaIdentityConnector.CLASS_NAME, nameof(subject), subject);
		if (!Is.undefined(options?.revocationIndex)) {
			Guards.number(
				IotaIdentityConnector.CLASS_NAME,
				nameof(options.revocationIndex),
				options.revocationIndex
			);
		}

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const identityClient = await this.getIdentityClient();
			const issuerDocument = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(issuerDocument)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const methods = issuerDocument.methods();
			const method = methods.find(m => m.id().toString() === verificationMethodId);
			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const subjectClone = ObjectHelper.clone(subject);

			const credContext = ObjectHelper.extractProperty(subjectClone, "@context", true);
			const credType = ObjectHelper.extractProperty(subjectClone, ["@type", "type"], false);

			const finalTypes = [];
			if (Is.stringValue(credType)) {
				finalTypes.push(credType);
			}

			const verificationMethodKey = await this._vaultConnector.getKey(
				this.buildVaultKey(idParts.id, idParts.fragment)
			);

			if (Is.undefined(verificationMethodKey)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "verificationKeyMissing", {
					method: verificationMethodId
				});
			}

			if (Is.undefined(verificationMethodKey.publicKey)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "publicKeyJwkMethodMissing", {
					method: verificationMethodId
				});
			}

			const jwkMemStore = new JwkMemStore();

			const jwkResult = await JwkHelper.fromEd25519Private(verificationMethodKey.privateKey);
			const jwkParams = jwkResult as IJwkParams;

			const keyId = await jwkMemStore.insert(new Jwk(jwkParams));
			const keyIdMemStore = new KeyIdMemStore();
			const methodDigest = new MethodDigest(method);
			await keyIdMemStore.insertKeyId(methodDigest, keyId);

			const storage = new Storage(jwkMemStore, keyIdMemStore);

			const subjectId = subjectClone.id;
			if (
				Is.stringValue(subjectId) &&
				!Url.tryParseExact(subjectId) &&
				!Urn.tryParseExact(subjectId)
			) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "invalidSubjectId", { subjectId });
			}

			const unsignedVc = new Credential({
				issuer: idParts.id,
				credentialSubject: subjectClone,
				type: finalTypes,
				id,
				context: credContext as ICredential["context"],
				expirationDate: Is.date(options?.expirationDate)
					? Timestamp.parse(options.expirationDate?.toISOString())
					: undefined
			});

			if (!Is.undefined(options?.revocationIndex)) {
				Object.assign(unsignedVc, {
					credentialStatus: {
						id: `${issuerDocument.id().toString()}#revocation`,
						type: RevocationBitmap.type(),
						revocationBitmapIndex: options.revocationIndex.toString()
					}
				});
			}

			const credentialJwt = await issuerDocument.createCredentialJwt(
				storage,
				`#${idParts.fragment}`,
				unsignedVc,
				new JwsSignatureOptions()
			);

			const validatedCredential = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				credentialJwt,
				issuerDocument,
				new JwtCredentialValidationOptions(),
				FailFast.FirstError
			);

			return {
				verifiableCredential: decoded.credential().toJSON() as IDidVerifiableCredentialV1,
				jwt: credentialJwt.toString()
			};
		} catch (error) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "createVerifiableCredentialFailed", {
				error: BaseError.fromError(error)
			});
		}
	}

	/**
	 * Check a verifiable credential is valid.
	 * @param credentialJwt The credential to verify.
	 * @returns The credential stored in the jwt and the revocation status.
	 */
	public async checkVerifiableCredential(credentialJwt: string): Promise<{
		revoked: boolean;
		verifiableCredential?: IDidVerifiableCredentialV1;
	}> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(credentialJwt), credentialJwt);

		try {
			const iotaClient = Iota.createClient(this._config);
			// @ts-expect-error IotaClient has a mismatch with the library types
			const identityClientReadOnly = await IdentityClientReadOnly.create(iotaClient);
			const resolver = new Resolver({ client: identityClientReadOnly });
			const jwt = new Jwt(credentialJwt);
			const issuerDocumentId = JwtCredentialValidator.extractIssuerFromJwt(jwt);
			const issuerDocument = await resolver.resolve(issuerDocumentId.toString());

			if (Is.undefined(issuerDocument)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId.toString()
				);
			}

			const validatedCredential = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				jwt,
				issuerDocument,
				new JwtCredentialValidationOptions(),
				FailFast.FirstError
			);
			const credential = decoded.credential();

			return {
				revoked: false,
				verifiableCredential: credential.toJSON() as IDidVerifiableCredentialV1
			};
		} catch (error) {
			if (BaseError.isErrorMessage(error, /revoked/i)) {
				return {
					revoked: true
				};
			}
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"checkingVerifiableCredentialFailed",
				{
					error: BaseError.fromError(error)
				}
			);
		}
	}

	/**
	 * Revoke verifiable credential(s).
	 * @param controller The controller of the identity who can make changes.
	 * @param issuerDocumentId The id of the document to update the revocation list for.
	 * @param credentialIndices The revocation bitmap index or indices to revoke.
	 * @returns Nothing.
	 */
	public async revokeVerifiableCredentials(
		controller: string,
		issuerDocumentId: string,
		credentialIndices: number[]
	): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(issuerDocumentId),
			issuerDocumentId
		);
		Guards.array(IotaIdentityConnector.CLASS_NAME, nameof(credentialIndices), credentialIndices);

		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(issuerDocumentId));

			if (Is.undefined(document)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId
				);
			}

			const serviceId = `${document.id().toString()}#revocation`;
			const revocationService = document.service().find(s => s.id().toString() === serviceId);

			if (Is.undefined(revocationService)) {
				const revocationBitmap = new RevocationBitmap();
				const service = revocationBitmap.toService(serviceId as unknown as DIDUrl);
				document.insertService(service);
			}

			document.revokeCredentials("revocation", credentialIndices);

			const aliasId = Did.parse(issuerDocumentId).id;
			const identity = await identityClient.getIdentity(aliasId);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					issuerDocumentId
				);
			}

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"revokeVerifiableCredentialsFailed",
				{
					error: BaseError.fromError(error)
				}
			);
		}
	}

	/**
	 * Unrevoke verifiable credential(s).
	 * @param controller The controller of the identity who can make changes.
	 * @param issuerDocumentId The id of the document to update the revocation list for.
	 * @param credentialIndices The revocation bitmap index or indices to un revoke.
	 * @returns Nothing.
	 */
	public async unrevokeVerifiableCredentials(
		controller: string,
		issuerDocumentId: string,
		credentialIndices: number[]
	): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(issuerDocumentId),
			issuerDocumentId
		);
		Guards.array(IotaIdentityConnector.CLASS_NAME, nameof(credentialIndices), credentialIndices);

		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await identityClient.resolveDid(IotaDID.parse(issuerDocumentId));

			if (Is.undefined(document)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId
				);
			}

			const serviceId = `${document.id().toString()}#revocation`;
			const revocationService = document.service().find(s => s.id().toString() === serviceId);

			if (Is.undefined(revocationService)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"revocationServiceNotFound",
					serviceId
				);
			}

			document.unrevokeCredentials("revocation", credentialIndices);

			const aliasId = Did.parse(issuerDocumentId).id;
			const identity = await identityClient.getIdentity(aliasId);
			const identityOnChain = identity.toFullFledged();

			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					issuerDocumentId
				);
			}

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(controller, identityOnChain, document, controllerToken);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"unrevokeVerifiableCredentialsFailed",
				{
					error: BaseError.fromError(error)
				}
			);
		}
	}

	/**
	 * Create a verifiable presentation from the supplied verifiable credentials.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The method to associate with the presentation.
	 * @param presentationId The id of the presentation.
	 * @param contexts The contexts for the data stored in the verifiable credential.
	 * @param types The types for the data stored in the verifiable credential.
	 * @param verifiableCredentials The credentials to use for creating the presentation in jwt format.
	 * @param options Additional options for creating the verifiable presentation.
	 * @param options.expirationDate The date the verifiable presentation is valid until.
	 * @returns The created verifiable presentation and its token.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async createVerifiablePresentation(
		controller: string,
		verificationMethodId: string,
		presentationId: string | undefined,
		contexts: IJsonLdContextDefinitionRoot | undefined,
		types: string | string[] | undefined,
		verifiableCredentials: (string | IDidVerifiableCredentialV1)[],
		options?: { expirationDate?: Date }
	): Promise<{
		verifiablePresentation: IDidVerifiablePresentationV1;
		jwt: string;
	}> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		if (Is.array(types)) {
			Guards.arrayValue(IotaIdentityConnector.CLASS_NAME, nameof(types), types);
		} else if (Is.string(types)) {
			Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(types), types);
		}
		Guards.arrayValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verifiableCredentials),
			verifiableCredentials
		);
		if (!Is.undefined(options?.expirationDate)) {
			Guards.date(
				IotaIdentityConnector.CLASS_NAME,
				"options.expirationDate",
				options?.expirationDate
			);
		}

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const identityClient = await this.getIdentityClient();
			const issuerDocument = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(issuerDocument)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const methods = issuerDocument.methods();
			const method = methods.find(m => m.id().toString() === verificationMethodId);

			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const didMethod = method.toJSON() as IDidDocumentVerificationMethod;

			if (Is.undefined(didMethod.publicKeyJwk)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "publicKeyJwkMethodMissing", {
					method: verificationMethodId
				});
			}

			const finalTypes = [];
			if (Is.array(types)) {
				finalTypes.push(...types);
			} else if (Is.stringValue(types)) {
				finalTypes.push(types);
			}

			const credentials = [];
			for (const cred of verifiableCredentials) {
				if (Is.stringValue(cred)) {
					credentials.push(cred);
				} else {
					credentials.push(new Credential(cred as unknown as ICredential));
				}
			}

			const unsignedVp = new Presentation({
				context: contexts as IPresentation["context"],
				id: presentationId,
				verifiableCredential: credentials,
				type: finalTypes,
				holder: idParts.id
			});

			const verificationMethodKey = await this._vaultConnector.getKey(
				this.buildVaultKey(idParts.id, idParts.fragment)
			);

			if (Is.undefined(verificationMethodKey)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "verificationKeyMissing", {
					method: verificationMethodId
				});
			}

			const jwkParams = {
				alg: didMethod.publicKeyJwk.alg,
				kty: didMethod.publicKeyJwk.kty as JwkType,
				crv: didMethod.publicKeyJwk.crv,
				x: didMethod.publicKeyJwk.x,
				d: Converter.bytesToBase64Url(verificationMethodKey.privateKey)
			} as IJwkParams;

			const jwkMemStore = new JwkMemStore();
			const jwk = new Jwk(jwkParams);
			const publicKeyJwk = jwk.toPublic();
			if (!publicKeyJwk) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					jwk: jwk.kid()
				});
			}
			const keyId = await jwkMemStore.insert(jwk);
			const keyIdMemStore = new KeyIdMemStore();
			const methodDigest = new MethodDigest(method);

			await keyIdMemStore.insertKeyId(methodDigest, keyId);

			const storage = new Storage(jwkMemStore, keyIdMemStore);
			const presentationJwt = await issuerDocument.createPresentationJwt(
				storage,
				`#${method.id().fragment()?.toString()}`,
				unsignedVp,
				new JwsSignatureOptions(),
				new JwtPresentationOptions({
					expirationDate: Is.date(options?.expirationDate)
						? Timestamp.parse(options.expirationDate?.toISOString())
						: undefined
				})
			);
			const validatedCredential = new JwtPresentationValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				presentationJwt,
				issuerDocument,
				new JwtPresentationValidationOptions()
			);

			return {
				verifiablePresentation: decoded.presentation().toJSON() as IDidVerifiablePresentationV1,
				jwt: presentationJwt.toString()
			};
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"createVerifiablePresentationFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Check a verifiable presentation is valid.
	 * @param presentationJwt The presentation to verify.
	 * @returns The presentation stored in the jwt and the revocation status.
	 */
	public async checkVerifiablePresentation(presentationJwt: string): Promise<{
		revoked: boolean;
		verifiablePresentation?: IDidVerifiablePresentationV1;
		issuers?: IDidDocument[];
	}> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(presentationJwt), presentationJwt);

		try {
			const iotaClient = Iota.createClient(this._config);
			// @ts-expect-error IotaClient has a mismatch with the library types
			const identityClientReadOnly = await IdentityClientReadOnly.create(iotaClient);
			const resolver = new Resolver<IotaDocument>({ client: identityClientReadOnly });
			const jwt = new Jwt(presentationJwt);
			const holderId = JwtPresentationValidator.extractHolder(jwt);
			const holderDocument = await resolver.resolve(holderId.toString());

			if (Is.undefined(holderDocument)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"documentNotFound",
					holderId.toString()
				);
			}

			const validatedCredential = new JwtPresentationValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				jwt,
				holderDocument,
				new JwtPresentationValidationOptions()
			);
			const presentation = decoded.presentation();

			const credentialValidator = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const validationOptions = new JwtCredentialValidationOptions({
				subjectHolderRelationship: [holderId.toString(), SubjectHolderRelationship.AlwaysSubject]
			});

			const jwtCredentials: Jwt[] = decoded
				.presentation()
				.verifiableCredential()
				.map(credential => {
					const jwtCredential = credential.tryIntoJwt();
					if (jwtCredential) {
						return jwtCredential;
					}
					return null;
				})
				.filter(Boolean) as Jwt[];

			const issuers: string[] = [];

			for (const jwtCredential of jwtCredentials) {
				const issuer = JwtCredentialValidator.extractIssuerFromJwt(jwtCredential);
				issuers.push(issuer.toString());
			}

			const resolvedIssuers = await resolver.resolveMultiple(issuers);

			for (let i = 0; i < jwtCredentials.length; i++) {
				credentialValidator.validate(
					jwtCredentials[i],
					resolvedIssuers[i],
					validationOptions,
					FailFast.FirstError
				);
			}

			const jsonIssuers: unknown[] = [];

			for (let issuer of resolvedIssuers) {
				if (!("toJSON" in issuer)) {
					issuer = issuer.toCoreDocument();
				}
				jsonIssuers.push(issuer.toJSON());
			}

			return {
				revoked: false,
				verifiablePresentation: presentation.toJSON() as IDidVerifiablePresentationV1,
				issuers: jsonIssuers as IDidDocument[]
			};
		} catch (error) {
			if (BaseError.isErrorMessage(error, /revoked/i)) {
				return {
					revoked: true
				};
			}

			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"checkingVerifiablePresentationFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Create a proof for arbitrary data with the specified verification method.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The verification method id to use.
	 * @param proofType The type of proof to create.
	 * @param unsecureDocument The unsecure document to create the proof for.
	 * @returns The proof.
	 */
	public async createProof(
		controller: string,
		verificationMethodId: string,
		proofType: ProofTypes,
		unsecureDocument: IJsonLdNodeObject
	): Promise<IProof> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.arrayOneOf<ProofTypes>(
			IotaIdentityConnector.CLASS_NAME,
			nameof(proofType),
			proofType,
			Object.values(ProofTypes)
		);
		Guards.object<IJsonLdNodeObject>(
			IotaIdentityConnector.CLASS_NAME,
			nameof(unsecureDocument),
			unsecureDocument
		);

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const identityClient = await this.getIdentityClient();
			const document = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(document)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const methods = document.methods();
			const method = methods.find(m => m.id().toString() === verificationMethodId);

			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const keyId = this.buildVaultKey(idParts.id, idParts.fragment);
			const verificationMethodKey = await this._vaultConnector.getKey(keyId);

			if (Is.undefined(verificationMethodKey)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "privateKeyMissing", { keyId });
			}

			const unsignedProof = ProofHelper.createUnsignedProof(proofType, verificationMethodId);

			const jwk = await JwkHelper.fromEd25519Private(verificationMethodKey.privateKey);
			const signedProof = await ProofHelper.createProof(
				proofType,
				unsecureDocument,
				unsignedProof,
				jwk
			);
			return signedProof;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"createProofFailed",
				{ controller, verificationMethodId, proofType },
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Verify proof for arbitrary data with the specified verification method.
	 * @param document The document to verify.
	 * @param proof The proof to verify.
	 * @returns True if the proof is verified.
	 */
	public async verifyProof(document: IJsonLdNodeObject, proof: IProof): Promise<boolean> {
		Guards.object<IJsonLdNodeObject>(IotaIdentityConnector.CLASS_NAME, nameof(document), document);
		Guards.object<IProof>(IotaIdentityConnector.CLASS_NAME, nameof(proof), proof);
		Guards.stringValue(
			IotaIdentityConnector.CLASS_NAME,
			nameof(proof.verificationMethod),
			proof.verificationMethod
		);

		try {
			const idParts = DocumentHelper.parseId(proof.verificationMethod);

			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"missingDid",
					proof.verificationMethod
				);
			}

			const identityClient = await this.getIdentityClient();
			const resolvedDocument = await identityClient.resolveDid(IotaDID.parse(idParts.id));

			if (Is.undefined(resolvedDocument)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", idParts.id);
			}

			const methods = resolvedDocument.methods();
			const method = methods.find(m => m.id().toString() === proof.verificationMethod);

			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: proof.verificationMethod
				});
			}

			const didMethod = method.toJSON() as IDidDocumentVerificationMethod;
			if (Is.undefined(didMethod.publicKeyJwk)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "publicKeyJwkMethodMissing", {
					method: proof.verificationMethod
				});
			}

			const result = await ProofHelper.verifyProof(document, proof, didMethod.publicKeyJwk);
			return result;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"verifyProofFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Get an identity client.
	 * @param controller The controller to get the client for.
	 * @returns The identity client.
	 * @internal
	 */
	private async getIdentityClient(controller?: string): Promise<IdentityClient> {
		const iotaClient = Iota.createClient(this._config);
		// @ts-expect-error IotaClient has a mismatch with the library types
		const identityClientReadOnly = await IdentityClientReadOnly.create(iotaClient);
		if (Is.undefined(controller)) {
			const jwkMemStore = new JwkMemStore();
			const keyIdMemStore = new KeyIdMemStore();
			const storage = new Storage(jwkMemStore, keyIdMemStore);

			// Create a proper no-op signer with valid but empty keys
			const noOpJwkParams: IJwkParams = {
				kty: JwkType.Okp,
				crv: "Ed25519",
				alg: JwsAlgorithm.EdDSA,
				x: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // Base64 encoded empty 32-byte array
				d: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
			};
			const noOpJwk = new Jwk(noOpJwkParams);
			const signer = new StorageSigner(storage, "", noOpJwk);
			return IdentityClient.create(identityClientReadOnly, signer);
		}

		const seed = await Iota.getSeed(this._config, this._vaultConnector, controller);

		const kp = Iota.getKeyPair(
			seed,
			this._config.coinType ?? Iota.DEFAULT_COIN_TYPE,
			0,
			this._walletAddressIndex,
			false
		);

		const jwkMemStore = new JwkMemStore();
		const keyIdMemStore = new KeyIdMemStore();
		const storage = new Storage(jwkMemStore, keyIdMemStore);

		const jwkParams: IJwkParams = {
			kty: JwkType.Okp,
			crv: "Ed25519",
			alg: JwsAlgorithm.EdDSA,
			x: Converter.bytesToBase64Url(kp.publicKey),
			d: Converter.bytesToBase64Url(kp.privateKey)
		};

		const jwk = new Jwk(jwkParams);
		const publicKeyJwk = jwk.toPublic();
		if (!publicKeyJwk) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
				jwk: jwk.kid()
			});
		}
		const keyId = await jwkMemStore.insert(jwk);
		const signer = new StorageSigner(storage, keyId, publicKeyJwk);
		return IdentityClient.create(identityClientReadOnly, signer);
	}

	/**
	 * Extract DID from execution result, handling both regular and gas station transaction formats.
	 * @param executionResult The transaction execution result.
	 * @param networkHrp The network HRP for DID construction.
	 * @returns The extracted DID.
	 * @throws GeneralError if the execution result format is unexpected.
	 * @internal
	 */
	private extractDidFromExecutionResult(
		executionResult: TransactionOutput<Transaction<OnChainIdentity>>,
		networkHrp: string
	): IotaDID {
		if (Is.function(executionResult.output?.didDocument?.bind(executionResult.output))) {
			return executionResult.output.didDocument().id();
		}

		if (Is.arrayValue(executionResult.response?.objectChanges)) {
			const resultNetworkHrp = ObjectHelper.propertyGet<string>(executionResult, "networkHrp");
			const did = this.tryExtractDidFromObjectChanges(
				executionResult.response.objectChanges,
				resultNetworkHrp ?? networkHrp
			);

			if (did) {
				return did;
			}
		}

		throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "didExtractionFailed", {
			resultType: typeof executionResult,
			availableKeys: Object.keys(executionResult ?? {}),
			hasOutput: Is.object(executionResult.output),
			hasResponse: Is.object(executionResult.response),
			hasObjectChanges: Is.arrayValue(executionResult.response?.objectChanges),
			gasStationConfig: Is.object(this._config.gasStation)
		});
	}

	/**
	 * Attempts to extract DID from transaction object changes.
	 * @param objectChanges The object changes from the transaction response.
	 * @param transactionDigest The transaction digest for logging.
	 * @returns The DID if found, undefined otherwise.
	 * @internal
	 */
	private tryExtractDidFromObjectChanges(
		objectChanges: unknown[],
		networkHrp?: string
	): IotaDID | undefined {
		const identityObject = objectChanges.find(change => {
			if (!Is.object(change)) {
				return false;
			}

			const changeType = ObjectHelper.propertyGet<string>(change, "type");
			const objectType = ObjectHelper.propertyGet<string>(change, "objectType");

			if (
				changeType === "created" &&
				Is.stringValue(objectType) &&
				objectType.includes("::identity::Identity")
			) {
				return true;
			}

			return false;
		});

		if (Is.object(identityObject)) {
			const objectId = ObjectHelper.propertyGet<string>(identityObject, "objectId");

			if (Is.stringValue(objectId)) {
				if (Is.stringValue(networkHrp)) {
					return this.constructDid(networkHrp, objectId);
				}

				return IotaDID.parse(`did:iota:${objectId}`);
			}
		}

		return undefined;
	}

	/**
	 * Constructs a DID following the IOTA DID Method Specification v2.0.
	 * For mainnet, omits network identifier (canonical format).
	 * For testnet/devnet, includes network identifier.
	 * @param networkHrp The network HRP.
	 * @param objectId The object ID.
	 * @returns The constructed DID.
	 * @internal
	 */
	private constructDid(networkHrp: string, objectId: string): IotaDID {
		if (networkHrp === NetworkConstants.MAINNET_NETWORK_ID) {
			return IotaDID.parse(`did:iota:${objectId}`);
		}

		return IotaDID.parse(`did:iota:${networkHrp}:${objectId}`);
	}

	/**
	 * Execute identity transaction with conditional gas station support.
	 * @param controller The controller identity.
	 * @param transactionBuilder The finished transaction builder from createIdentity().finish().
	 * @returns The execution result.
	 * @internal
	 */
	private async executeIdentityTransaction(
		controller: string,
		transactionBuilder: TransactionBuilder<Transaction<unknown>>
	): Promise<TransactionOutput<Transaction<OnChainIdentity>>> {
		if (Is.object(this._config.gasStation)) {
			return this.executeGasStationTransaction(controller, transactionBuilder, "identity");
		}

		const identityClient = await this.getIdentityClient(controller);

		const buildResult = await transactionBuilder.build(identityClient);

		if (Is.arrayValue(buildResult) && buildResult.length === 3 && Is.uint8Array(buildResult[0])) {
			const [txBytes, signatures, createIdentity] = buildResult;

			if (Is.arrayValue(signatures)) {
				const iotaClient = Iota.createClient(this._config);

				const txResponse = await iotaClient.executeTransactionBlock({
					transactionBlock: txBytes,
					signature: signatures,
					options: {
						showEffects: true,
						showEvents: true,
						showObjectChanges: true
					}
				});

				const confirmedTx = await Iota.waitForTransactionConfirmation(
					iotaClient,
					txResponse.digest,
					this._config
				);

				if (!confirmedTx) {
					throw new GeneralError(
						IotaIdentityConnector.CLASS_NAME,
						"transactionConfirmationTimeout",
						undefined,
						txResponse.digest
					);
				}

				const result = {
					output: createIdentity,
					response: txResponse,
					networkHrp: identityClient.network()
				};

				return result as unknown as TransactionOutput<Transaction<OnChainIdentity>>;
			}
		}

		throw new GeneralError(
			IotaIdentityConnector.CLASS_NAME,
			"transactionBuildFailed",
			{
				buildResultType: typeof buildResult,
				isArray: Is.arrayValue(buildResult),
				length: Is.arrayValue(buildResult) ? buildResult.length : 0,
				hasUint8Array: Is.arrayValue(buildResult) && Is.uint8Array(buildResult[0])
			},
			Iota.extractPayloadError(buildResult)
		);
	}

	/**
	 * Get address for the given controller.
	 * @param controller The controller to get the address for.
	 * @returns The controller address.
	 * @internal
	 */
	private async getControllerAddress(controller: string): Promise<string> {
		const seed = await Iota.getSeed(this._config, this._vaultConnector, controller);
		const addresses = Iota.getAddresses(
			seed,
			this._config.coinType ?? Iota.DEFAULT_COIN_TYPE,
			0,
			this._walletAddressIndex,
			1,
			false
		);
		return addresses[0];
	}

	/**
	 * Execute document update transaction with conditional gas station support.
	 * @param controller The controller identity.
	 * @param identityOnChain The on-chain identity to update.
	 * @param document The document to update.
	 * @param controllerToken The controller token.
	 * @returns The execution result.
	 * @internal
	 */
	private async executeDocumentUpdate(
		controller: string,
		identityOnChain: OnChainIdentity,
		document: IotaDocument,
		controllerToken: ControllerToken
	): Promise<TransactionOutput<Transaction<OnChainIdentity>>> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(identityOnChain), identityOnChain);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(document), document);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(controllerToken), controllerToken);

		const updateBuilder = identityOnChain
			.updateDidDocument(document.clone(), controllerToken)
			.withGasBudget(BigInt(this._gasBudget));

		if (Is.object(this._config.gasStation)) {
			return this.executeGasStationTransaction(controller, updateBuilder, "update");
		}

		const identityClient = await this.getIdentityClient(controller);
		return updateBuilder.buildAndExecute(identityClient) as unknown as TransactionOutput<
			Transaction<OnChainIdentity>
		>;
	}

	/**
	 * Execute a transaction with gas station sponsoring (consolidated method).
	 * @param controller The controller identity.
	 * @param builder The transaction builder (either finished identity builder or update builder).
	 * @param operationType The type of operation for error messaging and result formatting.
	 * @returns The execution result.
	 * @internal
	 */
	private async executeGasStationTransaction(
		controller: string,
		builder: TransactionBuilder<Transaction<unknown>>,
		operationType: "identity" | "update"
	): Promise<TransactionOutput<Transaction<OnChainIdentity>>> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(builder), builder);

		try {
			const identityClient = await this.getIdentityClient(controller);

			// Get address for gas station, as the controller remains the sender
			const controllerAddress = await this.getControllerAddress(controller);

			const gasReservation = await Iota.reserveGas(this._config, this._gasBudget);

			const gasCoinsWithStringVersions = gasReservation.gasCoins.map(coin => ({
				objectId: coin.objectId,
				version: String(coin.version),
				digest: coin.digest
			}));

			const gasConfiguredBuilder = builder
				.withSender(controllerAddress)
				.withGasBudget(BigInt(this._gasBudget))
				.withGasOwner(gasReservation.sponsorAddress)
				.withGasPayment(gasCoinsWithStringVersions)
				.withGasPrice(this._standardGasPrice);

			const buildResult = await gasConfiguredBuilder.build(identityClient);

			if (Is.arrayValue(buildResult) && buildResult.length === 3 && Is.uint8Array(buildResult[0])) {
				const [txBytes, signatures] = buildResult;
				const iotaClient = Iota.createClient(this._config);

				const confirmedResponse = await Iota.executeAndConfirmGasStationTransaction(
					this._config,
					iotaClient,
					gasReservation.reservationId,
					txBytes,
					signatures[0],
					{
						waitForConfirmation: true,
						showEffects: true,
						showEvents: true,
						showObjectChanges: true
					}
				);

				if (operationType === "identity") {
					// For identity creation, include the output and network HRP
					const createIdentity = buildResult[2];
					const result = {
						output: createIdentity,
						response: confirmedResponse,
						networkHrp: identityClient.network()
					};
					return result as unknown as TransactionOutput<Transaction<OnChainIdentity>>;
				}

				return confirmedResponse as unknown as TransactionOutput<Transaction<OnChainIdentity>>;
			}

			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"gasStationTransactionBuildFailed",
				{
					buildResultType: typeof buildResult,
					isArray: Is.arrayValue(buildResult),
					length: Is.arrayValue(buildResult) ? buildResult.length : 0
				},
				Iota.extractPayloadError(buildResult)
			);
		} catch (error) {
			const errorMessage =
				operationType === "identity"
					? "gasStationTransactionFailed"
					: "gasStationDocumentUpdateFailed";

			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				errorMessage,
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Build the key name to access the specified key in the vault.
	 * @param identity The identity of the user to access the vault keys.
	 * @returns The vault key.
	 * @internal
	 */
	private buildVaultKey(identity: string, key: string): string {
		return `${identity}/${key}`;
	}
}
