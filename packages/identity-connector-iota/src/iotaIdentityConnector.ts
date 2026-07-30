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
	Jwt,
	JwtCredentialValidationOptions,
	JwtCredentialValidator,
	JwtPresentationValidationOptions,
	JwtPresentationValidator,
	KeyIdMemStore,
	MethodScope,
	type OnChainIdentity,
	Resolver,
	RevocationBitmap,
	Service,
	Storage,
	StorageSigner,
	SubjectHolderRelationship,
	VerificationMethod,
	type ControllerToken,
	type DIDUrl,
	type ICredential,
	type IJwkParams
} from "@iota/identity-wasm/node/index.js";
import type {
	Transaction,
	TransactionBuilder,
	TransactionOutput
} from "@iota/iota-interaction-ts/node/transaction_internal.js";
import {
	ArrayHelper,
	AsyncCache,
	BaseError,
	Converter,
	GeneralError,
	Guards,
	HealthStatus,
	Is,
	NotFoundError,
	ObjectHelper,
	RandomHelper,
	Url,
	Urn,
	type IHealth
} from "@twin.org/core";
import {
	JsonLdHelper,
	JsonLdProcessor,
	type IJsonLdContextDefinitionRoot,
	type IJsonLdNodeObject
} from "@twin.org/data-json-ld";
import { Iota, VaultJwtSigner } from "@twin.org/dlt-iota";
import { Did, DocumentHelper, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	DidContexts,
	DidTypes,
	DidVerificationMethodType,
	JwsAlgorithms,
	type IDidVerifiableCredential,
	type IDidVerifiableCredentialV1,
	type IDidVerifiablePresentationV1,
	ProofHelper,
	ProofTypes,
	type IDidDocument,
	type IDidDocumentVerificationMethod,
	type IDidService,
	type IDidVerifiablePresentation,
	type IProof
} from "@twin.org/standards-w3c-did";
import {
	VaultConnectorFactory,
	VaultConnectorHelper,
	VaultKeyType,
	type IVaultConnector
} from "@twin.org/vault-models";
import {
	FetchHelper,
	HttpMethod,
	Jwk as JwkHelper,
	Jwt as JwtHelper,
	type IJwtHeader,
	type IJwtPayload
} from "@twin.org/web";
import { NetworkConstants } from "./constants/networkConstants.js";
import type { IIotaIdentityConnectorConfig } from "./models/IIotaIdentityConnectorConfig.js";
import type { IIotaIdentityConnectorConstructorOptions } from "./models/IIotaIdentityConnectorConstructorOptions.js";

/**
 * Class for performing identity operations on IOTA.
 *
 * Private keys are stored in the vault and all signing operations are delegated
 * to the vault connector to prevent key exposure.
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
	 * The wallet account index to use for funding.
	 * @internal
	 */
	private readonly _walletAccountIndex: number;

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
	 * TTL in ms for caching DID documents resolved for this connector's own sign/mutate
	 * operations. 0 disables caching (see resolveOwnDidCached). Never applied to proof or
	 * credential verification of third-party claims.
	 * @internal
	 */
	private readonly _didResolutionCacheTtlMs: number;

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
		this._walletAccountIndex = options.config.walletAccountIndex ?? 0;
		this._walletAddressIndex = options.config.walletAddressIndex ?? 0;
		this._standardGasPrice = BigInt(this._config.standardGasPrice ?? 1000);
		this._didResolutionCacheTtlMs = this._config.didResolutionCacheTtlMs ?? 30_000;

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
	 * Returns the health status of the component.
	 * @returns The health status of the component.
	 */
	public async health(): Promise<IHealth[]> {
		const results: IHealth[] = [];
		const nodeEndpoint = (this._config.clientOptions as { url?: string }).url;

		try {
			const iotaClient = Iota.createClient(this._config);
			const version = await iotaClient.getRpcApiVersion();

			results.push({
				source: IotaIdentityConnector.CLASS_NAME,
				status: Is.stringValue(version) ? HealthStatus.Ok : HealthStatus.Error,
				description: "healthDescription",
				message: Is.stringValue(version) ? undefined : "nodeHealthCheckFailed",
				data: { endpoint: nodeEndpoint }
			});
		} catch {
			results.push({
				source: IotaIdentityConnector.CLASS_NAME,
				status: HealthStatus.Error,
				description: "healthDescription",
				message: "nodeHealthCheckFailed",
				data: { endpoint: nodeEndpoint }
			});
		}

		if (Is.stringValue(this._config.gasStation?.gasStationUrl)) {
			const gasStationEndpoint = this._config.gasStation.gasStationUrl;
			try {
				const response = await FetchHelper.fetch(
					IotaIdentityConnector.CLASS_NAME,
					gasStationEndpoint,
					HttpMethod.GET
				);

				const body = await response.text();
				const isHealthy = response.ok && body.trim() === "OK";

				results.push({
					source: `${IotaIdentityConnector.CLASS_NAME}GasStation`,
					status: isHealthy ? HealthStatus.Ok : HealthStatus.Error,
					description: "healthDescription",
					message: isHealthy ? undefined : "healthCheckFailed",
					data: { endpoint: gasStationEndpoint }
				});
			} catch {
				results.push({
					source: `${IotaIdentityConnector.CLASS_NAME}GasStation`,
					status: HealthStatus.Error,
					description: "healthDescription",
					message: "healthCheckFailed",
					data: { endpoint: gasStationEndpoint }
				});
			}
		}

		return results;
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
	 * @returns A promise that resolves when the document has been removed.
	 */
	public async removeDocument(controller: string, documentId: string): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);

		try {
			const identityClient = await this.getIdentityClient(controller);

			const identity = await identityClient.getIdentity(Did.parse(documentId).id);
			const onChain = identity.toFullFledged();
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
			} else {
				await deleteBuilder.buildAndExecute(identityClient);
			}

			AsyncCache.remove(this.ownDidCacheKey(documentId));
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
			const document = await this.resolveOwnDidCached(identityClient, documentId);

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
						VaultConnectorHelper.buildKeyName(documentId, verificationMethodId),
						"public"
					);
					methodKeyPublic = existingKey.publicKey;
				} catch {}
			}

			if (Is.empty(methodKeyPublic)) {
				// If there is no existing key, we will create a new one with a temporary name.
				tempKeyId = `temp-vm-${Converter.bytesToBase64Url(RandomHelper.generate(16))}`;
				methodKeyPublic = await this._vaultConnector.createKey(
					VaultConnectorHelper.buildKeyName(documentId, tempKeyId),
					VaultKeyType.Ed25519
				);
			}

			const jwkParams = await JwkHelper.fromEd25519Public(methodKeyPublic);
			const jwk = new Jwk(jwkParams as IJwkParams);

			const methodId = `#${verificationMethodId ?? (await JwkHelper.generateKid(jwkParams))}`;

			if (Is.stringValue(tempKeyId)) {
				// If we created a temporary key, we will rename it to the final method id.
				await this._vaultConnector.renameKey(
					VaultConnectorHelper.buildKeyName(documentId, tempKeyId),
					VaultConnectorHelper.buildKeyName(documentId, methodId.slice(1))
				);
				tempKeyId = undefined;
			}

			const method = VerificationMethod.newFromJwk(document.id(), jwk, methodId);
			const methods = document.methods();
			const existingMethod = methods.find(
				m => this.stringifyIdentityValue(m.id()) === this.stringifyIdentityValue(method.id())
			);

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

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				documentId
			);

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
					await this._vaultConnector.removeKey(
						VaultConnectorHelper.buildKeyName(documentId, tempKeyId)
					);
				} catch {}
			}
		}
	}

	/**
	 * Remove a verification method from the document.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The id of the verification method.
	 * @returns A promise that resolves when the verification method has been removed.
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
			const document = await this.resolveOwnDidCached(identityClient, idParts.id);

			const methods = document.methods();
			const method = methods.find(
				m => this.stringifyIdentityValue(m.id()) === verificationMethodId
			);
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

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				idParts.id
			);
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
			const document = await this.resolveOwnDidCached(identityClient, documentId);

			const identity = await identityClient.getIdentity(Did.parse(documentId).id);
			const identityOnChain = identity.toFullFledged();
			if (Is.undefined(identityOnChain)) {
				throw new NotFoundError(
					IotaIdentityConnector.CLASS_NAME,
					"identityNotFound",
					identityOnChain
				);
			}

			const documentIdValue = this.stringifyIdentityValue(document.id());
			const service = new Service({
				id: `${documentIdValue}#${serviceId}`,
				type: serviceType,
				serviceEndpoint
			});

			document.insertService(service);

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				documentId
			);

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
	 * @returns A promise that resolves when the service has been removed.
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
			const document = await this.resolveOwnDidCached(identityClient, idParts.id);

			const services = document.service();
			const service = services.find(s => this.stringifyIdentityValue(s.id()) === serviceId);

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

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				idParts.id
			);
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
	 * Add an alias to the alsoKnownAs property on the document.
	 * If the alias is already present the operation is a no-op.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to update.
	 * @param alias The alias to add. Must be a Url or Urn (typically another DID).
	 * @returns A promise that resolves when the alias has been added.
	 * @throws GeneralError if the alias is not a Url or Urn.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async addAlsoKnownAs(
		controller: string,
		documentId: string,
		alias: string
	): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(alias), alias);
		if (!Url.tryParseExact(alias) && !Urn.tryParseExact(alias)) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "invalidAlias", { alias });
		}

		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await this.resolveOwnDidCached(identityClient, documentId);

			const existing = document.alsoKnownAs();
			if (existing.includes(alias)) {
				return;
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

			document.setAlsoKnownAs([...existing, alias]);

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				documentId
			);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"addAlsoKnownAsFailed",
				undefined,
				Iota.extractPayloadError(error)
			);
		}
	}

	/**
	 * Remove an alias from the alsoKnownAs property on the document.
	 * If the alias is not present the operation is a no-op.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to update.
	 * @param alias The alias to remove. Must be a Url or Urn.
	 * @returns A promise that resolves when the alias has been removed.
	 * @throws GeneralError if the alias is not a Url or Urn.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async removeAlsoKnownAs(
		controller: string,
		documentId: string,
		alias: string
	): Promise<void> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(alias), alias);
		if (!Url.tryParseExact(alias) && !Urn.tryParseExact(alias)) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "invalidAlias", { alias });
		}

		try {
			const identityClient = await this.getIdentityClient(controller);
			const document = await this.resolveOwnDidCached(identityClient, documentId);

			const existing = document.alsoKnownAs();
			if (!existing.includes(alias)) {
				return;
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

			document.setAlsoKnownAs(existing.filter(a => a !== alias));

			const controllerToken = await identityOnChain.getControllerToken(identityClient);
			if (Is.empty(controllerToken)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "missingControllerToken");
			}

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				documentId
			);
		} catch (error) {
			throw new GeneralError(
				IotaIdentityConnector.CLASS_NAME,
				"removeAlsoKnownAsFailed",
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
	 * @param options.jwtHeaderFields Additional fields to include in the JWT header.
	 * @param options.jwtPayloadFields Additional fields to include in the JWT payload.
	 * @returns The created verifiable credential and its token.
	 * @throws NotFoundError if the id can not be resolved.
	 * @throws GeneralError if the signing operation fails.
	 */
	public async createVerifiableCredential(
		controller: string,
		verificationMethodId: string,
		id: string | undefined,
		subject: IJsonLdNodeObject,
		options?: {
			revocationIndex?: number;
			expirationDate?: Date;
			jwtHeaderFields?: { [id: string]: string };
			jwtPayloadFields?: { [id: string]: string };
		}
	): Promise<{
		verifiableCredential: IDidVerifiableCredential;
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
			const issuerDocument = await this.resolveOwnDidCached(identityClient, idParts.id);

			const methods = issuerDocument.methods();
			const method = methods.find(
				m => this.stringifyIdentityValue(m.id()) === verificationMethodId
			);
			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const subjectClone = ObjectHelper.clone(subject);

			const credContext = ObjectHelper.extractProperty<IJsonLdContextDefinitionRoot>(subjectClone, [
				"@context"
			]);

			const keyId = VaultConnectorHelper.buildKeyName(idParts.id, idParts.fragment);
			const keyType = await this._vaultConnector.getKeyType(keyId);

			if (Is.undefined(keyType)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "verificationKeyMissing", {
					method: verificationMethodId
				});
			}

			const subjectId = subjectClone.id;
			if (
				Is.stringValue(subjectId) &&
				!Url.tryParseExact(subjectId) &&
				!Urn.tryParseExact(subjectId)
			) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "invalidSubjectId", { subjectId });
			}

			// Build the credential structure manually to avoid exposing private key
			const credentialData: IDidVerifiableCredentialV1 = {
				"@context": (JsonLdProcessor.combineContexts(DidContexts.ContextVCv1, credContext) ??
					DidContexts.ContextVCv1) as [typeof DidContexts.ContextVCv1],
				type: DidTypes.VerifiableCredential,
				credentialSubject: subjectClone
			};

			if (!Is.undefined(options?.revocationIndex)) {
				const issuerDocumentIdValue = this.stringifyIdentityValue(issuerDocument.id());
				credentialData.credentialStatus = {
					id: `${issuerDocumentIdValue}#revocation`,
					type: RevocationBitmap.type(),
					revocationBitmapIndex: options.revocationIndex.toString()
				};
			}

			// Construct JWT header and payload
			const jwtHeader: IJwtHeader = {
				...options?.jwtHeaderFields,
				kid: verificationMethodId,
				typ: "JWT",
				alg: JwsAlgorithms.EdDSA
			};

			const jwtPayload: IJwtPayload = {
				...options?.jwtPayloadFields,
				iss: idParts.id,
				nbf: Math.floor(Date.now() / 1000),
				jti: id,
				sub: Is.stringValue(subjectId) ? subjectId : undefined,
				vc: credentialData
			};

			if (Is.date(options?.expirationDate)) {
				jwtPayload.exp = Math.floor(options.expirationDate.getTime() / 1000);
			}

			// Sign using vault connector - private key never leaves the vault
			const credentialJwt = await JwtHelper.encodeWithSigner(
				jwtHeader,
				jwtPayload,
				async (header, payload) =>
					VaultConnectorHelper.jwtSigner(this._vaultConnector, keyId, header, payload)
			);

			// Validate the credential JWT
			const validatedCredential = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				new Jwt(credentialJwt),
				issuerDocument,
				new JwtCredentialValidationOptions(),
				FailFast.FirstError
			);

			const vc = decoded.credential().toJSON() as IDidVerifiableCredential;

			vc.proof = await this.createProof(
				controller,
				verificationMethodId,
				ProofTypes.DataIntegrityProof,
				JsonLdHelper.toNodeObject(vc),
				issuerDocument
			);

			// Promote the proof's @context to the VC root so JSON-LD processors can resolve DataIntegrity terms (proofValue, cryptosuite, etc.)
			const proofContext = vc.proof["@context"];
			if (!Is.empty(proofContext)) {
				vc["@context"] = (JsonLdProcessor.combineContexts(vc["@context"], proofContext) ??
					vc["@context"]) as IDidVerifiableCredential["@context"];
				delete vc.proof["@context"];
			}

			return {
				verifiableCredential: vc,
				jwt: credentialJwt
			};
		} catch (error) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "createVerifiableCredentialFailed", {
				error: BaseError.fromError(error)
			});
		}
	}

	/**
	 * Check a verifiable credential is valid.
	 * @param credential The credential to verify.
	 * @returns The credential stored in the jwt and the revocation status.
	 */
	public async checkVerifiableCredential(credential: string | IDidVerifiableCredential): Promise<{
		revoked: boolean;
		verifiableCredential?: IDidVerifiableCredential;
	}> {
		if (Is.object(credential)) {
			Guards.objectValue<IDidVerifiableCredential>(
				IotaIdentityConnector.CLASS_NAME,
				nameof(credential),
				credential
			);
			Guards.objectValue<IDidVerifiableCredential>(
				IotaIdentityConnector.CLASS_NAME,
				nameof(credential.proof),
				credential.proof
			);
			const { proof, ...doc } = credential;
			const credentialVerified = await this.verifyProof(
				JsonLdHelper.toNodeObject(doc),
				ArrayHelper.fromObjectOrArray(proof)[0]
			);
			if (!credentialVerified) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "signatureVerificationFailed");
			}
			return {
				revoked: false,
				verifiableCredential: doc
			};
		}
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(credential), credential);

		try {
			const iotaClient = Iota.createClient(this._config);
			const identityClientReadOnly = await IdentityClientReadOnly.create(
				// @ts-expect-error IotaClient has a mismatch with the library types
				iotaClient,
				this._config?.identityPkgId
			);
			const resolver = new Resolver({ client: identityClientReadOnly });
			const jwt = new Jwt(credential);
			const issuerDocumentId = JwtCredentialValidator.extractIssuerFromJwt(jwt);
			const issuerDid = this.stringifyIdentityValue(issuerDocumentId);
			const issuerDocument = await resolver.resolve(issuerDid);

			if (Is.undefined(issuerDocument)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", issuerDid);
			}

			const validatedCredential = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				jwt,
				issuerDocument,
				new JwtCredentialValidationOptions(),
				FailFast.FirstError
			);
			const vc = decoded.credential().toJSON() as IDidVerifiableCredential;

			return {
				revoked: false,
				verifiableCredential: vc
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
	 * @returns A promise that resolves when the credentials have been revoked.
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
			const document = await this.resolveOwnDidCached(identityClient, issuerDocumentId);

			const serviceId = `${this.stringifyIdentityValue(document.id())}#revocation`;
			const revocationService = document
				.service()
				.find(s => this.stringifyIdentityValue(s.id()) === serviceId);

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

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				issuerDocumentId
			);
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
	 * @returns A promise that resolves when the credentials have been unrevoked.
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
			const document = await this.resolveOwnDidCached(identityClient, issuerDocumentId);

			const serviceId = `${this.stringifyIdentityValue(document.id())}#revocation`;
			const revocationService = document
				.service()
				.find(s => this.stringifyIdentityValue(s.id()) === serviceId);

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

			await this.executeDocumentUpdate(
				controller,
				identityOnChain,
				document,
				controllerToken,
				issuerDocumentId
			);
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
	 * @param options.jwtHeaderFields Additional fields to include in the JWT header.
	 * @param options.jwtPayloadFields Additional fields to include in the JWT payload.
	 * @returns The created verifiable presentation and its token.
	 * @throws NotFoundError if the id can not be resolved.
	 * @throws GeneralError if the signing operation fails.
	 */
	public async createVerifiablePresentation(
		controller: string,
		verificationMethodId: string,
		presentationId: string | undefined,
		contexts: IJsonLdContextDefinitionRoot | undefined,
		types: string | string[] | undefined,
		verifiableCredentials: (string | IDidVerifiableCredential)[],
		options?: {
			expirationDate?: Date;
			jwtHeaderFields?: { [id: string]: string };
			jwtPayloadFields?: { [id: string]: string };
		}
	): Promise<{
		verifiablePresentation: IDidVerifiablePresentation;
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
				nameof(options.expirationDate),
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
			const holderDocument = await this.resolveOwnDidCached(identityClient, idParts.id);

			const methods = holderDocument.methods();
			const method = methods.find(
				m => this.stringifyIdentityValue(m.id()) === verificationMethodId
			);

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

			const finalTypes: string[] = [DidTypes.VerifiablePresentation];
			if (Is.array(types)) {
				finalTypes.push(...types);
			} else if (Is.stringValue(types)) {
				finalTypes.push(types);
			}

			// Build context with base VC context while avoiding duplicates
			const combinedContext: IJsonLdContextDefinitionRoot =
				JsonLdProcessor.combineContexts(DidContexts.ContextVCv1, contexts) ??
				DidContexts.ContextVCv1;

			// Build the complete verifiable presentation first
			const verifiablePresentation: IDidVerifiablePresentationV1 = {
				"@context": combinedContext as IDidVerifiablePresentationV1["@context"],
				id: presentationId,
				type: finalTypes,
				verifiableCredential:
					verifiableCredentials as IDidVerifiablePresentationV1["verifiableCredential"],
				holder: idParts.id
			};

			const credentials = [];
			for (const cred of verifiableCredentials) {
				if (Is.stringValue(cred)) {
					credentials.push(cred);
				} else {
					credentials.push(new Credential(cred as unknown as ICredential));
				}
			}

			const keyId = VaultConnectorHelper.buildKeyName(idParts.id, idParts.fragment);
			const keyType = await this._vaultConnector.getKeyType(keyId);

			if (Is.undefined(keyType)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "verificationKeyMissing", {
					method: verificationMethodId
				});
			}

			// Construct JWT header and payload
			const jwtHeader: IJwtHeader = {
				...options?.jwtHeaderFields,
				kid: verificationMethodId,
				typ: "JWT",
				alg: JwsAlgorithms.EdDSA
			};

			const jwtVp = ObjectHelper.pick(ObjectHelper.clone(verifiablePresentation), [
				"@context",
				"type",
				"verifiableCredential"
			]);

			const jwtPayload: IJwtPayload = {
				...options?.jwtPayloadFields,
				iss: verifiablePresentation.holder,
				nbf: Math.floor(Date.now() / 1000),
				vp: jwtVp
			};
			if (Is.date(options?.expirationDate)) {
				jwtPayload.exp = Math.floor(options.expirationDate.getTime() / 1000);
			}

			// Sign using vault connector - private key never leaves the vault
			const presentationJwt = await JwtHelper.encodeWithSigner(
				jwtHeader,
				jwtPayload,
				async (header, payload) =>
					VaultConnectorHelper.jwtSigner(this._vaultConnector, keyId, header, payload)
			);

			// Validate the presentation JWT
			const validatedPresentation = new JwtPresentationValidator(new EdDSAJwsVerifier());
			validatedPresentation.validate(
				new Jwt(presentationJwt),
				holderDocument,
				new JwtPresentationValidationOptions()
			);

			verifiablePresentation.proof = await this.createProof(
				controller,
				verificationMethodId,
				ProofTypes.DataIntegrityProof,
				JsonLdHelper.toNodeObject(verifiablePresentation),
				holderDocument
			);

			// Promote the proof's @context to the VP root so JSON-LD processors can resolve DataIntegrity terms
			const proofContext = verifiablePresentation.proof["@context"];
			if (!Is.empty(proofContext)) {
				verifiablePresentation["@context"] = (JsonLdProcessor.combineContexts(
					verifiablePresentation["@context"],
					proofContext
				) ?? verifiablePresentation["@context"]) as IDidVerifiablePresentationV1["@context"];
				delete verifiablePresentation.proof["@context"];
			}

			return {
				verifiablePresentation,
				jwt: presentationJwt
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
	 * @param presentation The presentation to verify.
	 * @returns The presentation stored in the jwt and the revocation status.
	 */
	public async checkVerifiablePresentation(
		presentation: string | IDidVerifiablePresentation
	): Promise<{
		revoked: boolean;
		verifiablePresentation?: IDidVerifiablePresentation;
		issuers?: IDidDocument[];
	}> {
		if (Is.object(presentation)) {
			Guards.objectValue<IDidVerifiablePresentation>(
				IotaIdentityConnector.CLASS_NAME,
				nameof(presentation),
				presentation
			);
			Guards.objectValue(
				IotaIdentityConnector.CLASS_NAME,
				nameof(presentation.proof),
				presentation.proof
			);
			const { proof, ...doc } = presentation as IDidVerifiablePresentationV1;
			const proofEntry = ArrayHelper.fromObjectOrArray(proof)[0];
			Guards.objectValue(IotaIdentityConnector.CLASS_NAME, nameof(proof), proofEntry);
			const presentationVerified = await this.verifyProof(
				JsonLdHelper.toNodeObject(doc),
				proofEntry
			);
			if (!presentationVerified) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "signatureVerificationFailed");
			}
			return {
				revoked: false,
				verifiablePresentation: doc
			};
		}
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(presentation), presentation);
		const presentationJwt = presentation;

		try {
			const iotaClient = Iota.createClient(this._config);
			const identityClientReadOnly = await IdentityClientReadOnly.create(
				// @ts-expect-error IotaClient has a mismatch with the library types
				iotaClient,
				this._config?.identityPkgId
			);
			const resolver = new Resolver<IotaDocument>({ client: identityClientReadOnly });
			const jwt = new Jwt(presentationJwt);
			const holderId = JwtPresentationValidator.extractHolder(jwt);
			const holderDid = this.stringifyIdentityValue(holderId);
			const holderDocument = await resolver.resolve(holderDid);

			if (Is.undefined(holderDocument)) {
				throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", holderDid);
			}

			const validatedCredential = new JwtPresentationValidator(new EdDSAJwsVerifier());
			const decoded = validatedCredential.validate(
				jwt,
				holderDocument,
				new JwtPresentationValidationOptions()
			);
			const decodedPresentation = decoded.presentation();

			const credentialValidator = new JwtCredentialValidator(new EdDSAJwsVerifier());
			const validationOptions = new JwtCredentialValidationOptions({
				subjectHolderRelationship: [holderDid, SubjectHolderRelationship.AlwaysSubject]
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
				issuers.push(this.stringifyIdentityValue(issuer));
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
				verifiablePresentation: decodedPresentation.toJSON() as IDidVerifiablePresentation,
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
	 * @param resolvedDocument Optional already-resolved document for the DID, so a caller that just resolved it (e.g. createVerifiableCredential) skips a redundant re-resolve. Resolves it itself if omitted.
	 * @returns The proof.
	 * @throws NotFoundError if the id can not be resolved.
	 * @throws GeneralError if proof creation fails or the algorithm does not match the key type.
	 */
	public async createProof(
		controller: string,
		verificationMethodId: string,
		proofType: ProofTypes,
		unsecureDocument: IJsonLdNodeObject,
		resolvedDocument?: IotaDocument
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
		if (!Is.undefined(resolvedDocument)) {
			Guards.object<IotaDocument>(
				IotaIdentityConnector.CLASS_NAME,
				nameof(resolvedDocument),
				resolvedDocument
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

			let document = resolvedDocument;
			if (Is.undefined(document)) {
				const identityClient = await this.getIdentityClient();
				document = await this.resolveOwnDidCached(identityClient, idParts.id);
			}

			const methods = document.methods();
			const method = methods.find(
				m => this.stringifyIdentityValue(m.id()) === verificationMethodId
			);

			if (!method) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const keyId = VaultConnectorHelper.buildKeyName(idParts.id, idParts.fragment);
			const keyType = await this._vaultConnector.getKeyType(keyId);

			if (Is.undefined(keyType)) {
				throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "privateKeyMissing", { keyId });
			}

			const unsignedProof = ProofHelper.createUnsignedProof(proofType, verificationMethodId);

			const signedProof = await ProofHelper.createProofWithSigner(
				proofType,
				unsecureDocument,
				unsignedProof,
				async (data, algorithm) => this.signWithVault(keyId, keyType, data, algorithm)
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
			const method = methods.find(
				m => this.stringifyIdentityValue(m.id()) === proof.verificationMethod
			);

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
	 * Signs data using the vault connector with algorithm validation.
	 * @param keyId The vault key identifier.
	 * @param keyType The type of the key.
	 * @param data The data to sign.
	 * @param algorithm The signing algorithm.
	 * @returns The signature bytes.
	 * @throws GeneralError if algorithm doesn't match key type.
	 * @internal
	 */
	private async signWithVault(
		keyId: string,
		keyType: VaultKeyType,
		data: Uint8Array,
		algorithm: string
	): Promise<Uint8Array> {
		if (algorithm === JwsAlgorithms.EdDSA && keyType !== VaultKeyType.Ed25519) {
			throw new GeneralError(IotaIdentityConnector.CLASS_NAME, "algorithmKeyTypeMismatch", {
				algorithm,
				expectedKeyType: VaultKeyType.Ed25519,
				actualKeyType: keyType,
				keyId
			});
		}
		return this._vaultConnector.sign(keyId, data);
	}

	/**
	 * Stringify identity-wasm values with an explicit toString contract.
	 * @param value The identity value to stringify.
	 * @returns The string representation.
	 * @internal
	 */
	private stringifyIdentityValue(value: unknown): string {
		return (value as { toString: () => string }).toString();
	}

	/**
	 * Get an identity client.
	 * @param controller The controller to get the client for.
	 * @returns The identity client.
	 * @internal
	 */
	private async getIdentityClient(controller?: string): Promise<IdentityClient> {
		// Deliberately built fresh on every call, not memoized: IdentityClient.create() below
		// calls client.__destroy_into_raw() on the read-only client it's given (a wasm-bindgen
		// move, not a borrow) — reusing the same instance across calls passes an
		// already-destroyed handle into WASM on the second use ("null pointer passed to rust").
		const iotaClient = Iota.createClient(this._config);
		const identityClientReadOnly = await IdentityClientReadOnly.create(
			// @ts-expect-error IotaClient has a mismatch with the library types
			iotaClient,
			this._config?.identityPkgId
		);
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

		const signer = await VaultJwtSigner.create(
			this._vaultConnector,
			this._config,
			controller,
			this._walletAccountIndex,
			this._walletAddressIndex
		);
		return IdentityClient.create(identityClientReadOnly, signer);
	}

	/**
	 * Cache key for a DID resolved for this connector's own sign/mutate operations (role 1).
	 * Deliberately namespaced ("own") and never shared with proof/credential verification of
	 * third-party claims (role 2/3), which this connector never caches.
	 * @param did The DID being resolved.
	 * @returns The cache key.
	 * @internal
	 */
	private ownDidCacheKey(did: string): string {
		return `${IotaIdentityConnector.CLASS_NAME}:own:${this._config.network}:${did}`;
	}

	/**
	 * Resolve a DID for this connector's own sign/mutate operations, cached for
	 * didResolutionCacheTtlMs (0 disables caching and resolves fresh every call). Only ever used
	 * for the connector's own create/update/revoke paths — never for verifyProof or credential/
	 * presentation verification, which must stay uncached.
	 * @param identityClient The identity client to resolve with.
	 * @param did The DID to resolve.
	 * @returns The resolved document.
	 * @throws NotFoundError if the DID could not be resolved.
	 * @internal
	 */
	private async resolveOwnDidCached(
		identityClient: IdentityClient,
		did: string
	): Promise<IotaDocument> {
		// The empty check lives inside this callback, not after awaiting resolveOwnDidCached's
		// result, so a not-found DID throws (and is never cached) instead of settling as an
		// empty result. AsyncCache.exec tells "already resolved" apart from "still resolving"
		// purely by whether the stored result/error is nullish — caching an empty result would
		// leave that cache entry permanently indistinguishable from "in progress" for the rest
		// of its TTL, and any later caller queued behind it would await forever.
		const resolved = await AsyncCache.exec<IotaDocument>(
			this.ownDidCacheKey(did),
			this._didResolutionCacheTtlMs,
			async () => {
				const document = await identityClient.resolveDid(IotaDID.parse(did));
				if (Is.undefined(document)) {
					throw new NotFoundError(IotaIdentityConnector.CLASS_NAME, "documentNotFound", did);
				}
				return document;
			}
		);
		// Return a deep clone, not the cached instance itself: several role-1 callers mutate the
		// resolved document in place (insertMethod, setAlsoKnownAs, revokeCredentials, ...) before
		// evicting the cache entry on success. Without cloning, two calls against the same DID
		// overlapping within the TTL window would share and mutate the same object.
		return resolved.clone();
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
	 * @param networkHrp The network HRP for the DID.
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
	 * Execute document update transaction with conditional gas station support.
	 * @param controller The controller identity.
	 * @param identityOnChain The on-chain identity to update.
	 * @param document The document to update.
	 * @param controllerToken The controller token.
	 * @param did The DID being updated, so its role-1 cache entry can be evicted on success.
	 * @returns The execution result.
	 * @internal
	 */
	private async executeDocumentUpdate(
		controller: string,
		identityOnChain: OnChainIdentity,
		document: IotaDocument,
		controllerToken: ControllerToken,
		did: string
	): Promise<TransactionOutput<Transaction<OnChainIdentity>>> {
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(identityOnChain), identityOnChain);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(document), document);
		Guards.object(IotaIdentityConnector.CLASS_NAME, nameof(controllerToken), controllerToken);
		Guards.stringValue(IotaIdentityConnector.CLASS_NAME, nameof(did), did);

		const updateBuilder = identityOnChain
			.updateDidDocument(document.clone(), controllerToken)
			.withGasBudget(BigInt(this._gasBudget));

		// `did` is passed through from the caller — the exact string already used to populate the
		// role-1 cache via resolveOwnDidCached — rather than re-derived from `document.id()`, so
		// eviction is guaranteed to hit the same cache key that was populated.
		// Both branches are captured into `result` (instead of returning directly) so eviction
		// runs after either one succeeds, and a throw from either skips it automatically.
		let result: TransactionOutput<Transaction<OnChainIdentity>>;
		if (Is.object(this._config.gasStation)) {
			result = await this.executeGasStationTransaction(controller, updateBuilder, "update");
		} else {
			const identityClient = await this.getIdentityClient(controller);
			const executionResult = await updateBuilder.buildAndExecute(identityClient);
			result = executionResult as unknown as TransactionOutput<Transaction<OnChainIdentity>>;
		}

		AsyncCache.remove(this.ownDidCacheKey(did));

		return result;
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
			const controllerAddress = await Iota.getAddress(
				this._vaultConnector,
				this._config,
				controller,
				this._walletAccountIndex,
				this._walletAddressIndex
			);

			// Reserve exactly the budget this transaction will declare via
			// this._gasBudget (see the constructor), instead of letting Iota.reserveGas
			// re-derive its own default from this._config — otherwise the two can
			// diverge whenever gasBudget is left unset in config.
			const gasReservation = await Iota.reserveGas({
				...this._config,
				gasBudget: this._gasBudget
			});

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
}
