// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	ArrayHelper,
	BaseError,
	BitString,
	Coerce,
	Compression,
	CompressionType,
	Converter,
	GeneralError,
	Guards,
	Is,
	JsonHelper,
	NotFoundError,
	ObjectHelper,
	RandomHelper,
	Url,
	Urn
} from "@twin.org/core";
import {
	JsonLdHelper,
	JsonLdProcessor,
	type IJsonLdContextDefinitionRoot,
	type IJsonLdNodeObject
} from "@twin.org/data-json-ld";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { DocumentHelper, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	DidContexts,
	DidTypes,
	DidVerificationMethodType,
	type IDidVerifiableCredential,
	JwsAlgorithms,
	ProofHelper,
	ProofTypes,
	type IDidDocument,
	type IDidDocumentVerificationMethod,
	type IDidService,
	type IDidVerifiableCredentialV1,
	type IDidVerifiablePresentationV1,
	type IProof,
	type IDidVerifiablePresentation
} from "@twin.org/standards-w3c-did";
import {
	VaultConnectorFactory,
	VaultConnectorHelper,
	VaultKeyType,
	type IVaultConnector
} from "@twin.org/vault-models";
import { Jwk, Jwt, type IJwk, type IJwtHeader, type IJwtPayload } from "@twin.org/web";
import type { IdentityDocument } from "./entities/identityDocument.js";
import type { IEntityStorageIdentityConnectorConstructorOptions } from "./models/IEntityStorageIdentityConnectorConstructorOptions.js";

/**
 * Class for performing identity operations using entity storage.
 */
export class EntityStorageIdentityConnector implements IIdentityConnector {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<EntityStorageIdentityConnector>();

	/**
	 * The namespace supported by the identity connector.
	 */
	public static readonly NAMESPACE: string = "entity-storage";

	/**
	 * The size of the revocation bitmap in bits (16Kb).
	 * @internal
	 */
	private static readonly _REVOCATION_BITS_SIZE: number = 131072;

	/**
	 * The entity storage for identities.
	 * @internal
	 */
	protected readonly _didDocumentEntityStorage: IEntityStorageConnector<IdentityDocument>;

	/**
	 * The vault for the keys.
	 * @internal
	 */
	protected readonly _vaultConnector: IVaultConnector;

	/**
	 * Create a new instance of EntityStorageIdentityConnector.
	 * @param options The options for the identity connector.
	 */
	constructor(options?: IEntityStorageIdentityConnectorConstructorOptions) {
		this._didDocumentEntityStorage = EntityStorageConnectorFactory.get(
			options?.didDocumentEntityStorageType ?? "identity-document"
		);
		this._vaultConnector = VaultConnectorFactory.get(options?.vaultConnectorType ?? "vault");
	}

	/**
	 * Build the key name to access the specified key in the vault.
	 * @param identity The identity of the user to access the vault keys.
	 * @param key The key to access in the vault.
	 * @returns The vault key.
	 * @internal
	 */
	public static buildVaultKey(identity: string, key: string): string {
		return `${identity}/${key}`;
	}

	/**
	 * Verify the document in storage.
	 * @param didDocument The did document that was stored.
	 * @param vaultConnector The vault connector to use for verification.
	 * @internal
	 */
	public static async verifyDocument(
		didDocument: IdentityDocument,
		vaultConnector: IVaultConnector
	): Promise<void> {
		const stringifiedDocument = JsonHelper.canonicalize(didDocument.document);
		const docBytes = Converter.utf8ToBytes(stringifiedDocument);

		const verified = await vaultConnector.verify(
			EntityStorageIdentityConnector.buildVaultKey(didDocument.id, "did"),
			docBytes,
			Converter.base64ToBytes(didDocument.signature)
		);

		if (!verified) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"signatureVerificationFailed"
			);
		}
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return EntityStorageIdentityConnector.CLASS_NAME;
	}

	/**
	 * Create a new document.
	 * @param controller The controller of the identity who can make changes.
	 * @returns The created document.
	 */
	public async createDocument(controller: string): Promise<IDidDocument> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);

		try {
			const did = `did:${EntityStorageIdentityConnector.NAMESPACE}:${Converter.bytesToHex(RandomHelper.generate(32), true)}`;

			await this._vaultConnector.createKey(
				EntityStorageIdentityConnector.buildVaultKey(did, "did"),
				VaultKeyType.Ed25519
			);

			const bitString = new BitString(EntityStorageIdentityConnector._REVOCATION_BITS_SIZE);
			const compressed = await Compression.compress(bitString.getBits(), CompressionType.Gzip);

			const didDocument: IDidDocument = {
				"@context": DidContexts.Context,
				id: did,
				service: [
					{
						id: `${did}#revocation`,
						type: "BitstringStatusList",
						serviceEndpoint: `data:application/octet-stream;base64,${Converter.bytesToBase64Url(compressed)}`
					}
				]
			};

			await this.updateDocument(controller, didDocument);

			return didDocument;
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"createDocumentFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(documentId), documentId);

		try {
			const didDocument = await this._didDocumentEntityStorage.get(documentId);
			if (Is.empty(didDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}

			await this._didDocumentEntityStorage.remove(documentId);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.arrayOneOf<DidVerificationMethodType>(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verificationMethodType),
			verificationMethodType,
			Object.values(DidVerificationMethodType)
		);

		let tempKeyId;
		try {
			const didIdentityDocument = await this._didDocumentEntityStorage.get(documentId);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);

			const didDocument = didIdentityDocument.document;

			let methodKeyPublic;
			if (Is.stringValue(verificationMethodId)) {
				// If there is a verification method id, we will try to get the key from the vault.
				try {
					// If there is an existing key, we will use it.
					const existingKey = await this._vaultConnector.getKey(
						EntityStorageIdentityConnector.buildVaultKey(didDocument.id, verificationMethodId)
					);
					methodKeyPublic = existingKey.publicKey;
				} catch {}
			}

			if (Is.empty(methodKeyPublic)) {
				// If there is no existing key, we will create a new one with a temporary name.
				tempKeyId = `temp-vm-${Converter.bytesToBase64Url(RandomHelper.generate(16))}`;
				methodKeyPublic = await this._vaultConnector.createKey(
					EntityStorageIdentityConnector.buildVaultKey(didDocument.id, tempKeyId),
					VaultKeyType.Ed25519
				);
			}

			const jwkParams: IJwk = {
				alg: "EdDSA",
				kty: "OKP",
				crv: "Ed25519",
				x: Converter.bytesToBase64Url(methodKeyPublic)
			};

			const kid = await Jwk.generateKid(jwkParams);

			const methodId = `${documentId}#${verificationMethodId ?? kid}`;

			if (Is.stringValue(tempKeyId)) {
				// If we created a temporary key, we will rename it to the final method id.
				await this._vaultConnector.renameKey(
					EntityStorageIdentityConnector.buildVaultKey(didDocument.id, tempKeyId),
					EntityStorageIdentityConnector.buildVaultKey(didDocument.id, verificationMethodId ?? kid)
				);
				tempKeyId = undefined;
			}

			const methods = this.getAllMethods(didDocument);
			const existingMethodIndex = methods.findIndex(m => {
				if (Is.string(m.method)) {
					return m.method === methodId;
				}
				return m.method.id === methodId;
			});

			if (existingMethodIndex !== -1) {
				const methodArray =
					didDocument[methods[existingMethodIndex].arrayKey as keyof IDidDocument];

				if (Is.array(methodArray)) {
					methodArray.splice(existingMethodIndex, 1);
				}
			}

			const didVerificationMethod: IDidDocumentVerificationMethod = {
				id: methodId,
				controller: documentId,
				type: "JsonWebKey",
				publicKeyJwk: {
					...jwkParams,
					kid
				}
			};

			didDocument[verificationMethodType] ??= [];
			didDocument[verificationMethodType]?.push(didVerificationMethod);

			await this.updateDocument(controller, didDocument);

			return didVerificationMethod;
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"addVerificationMethodFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const didIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			const methods = this.getAllMethods(didDocument);
			const existingMethodIndex = methods.findIndex(m => {
				if (Is.string(m.method)) {
					return m.method === verificationMethodId;
				}
				return m.method.id === verificationMethodId;
			});

			if (existingMethodIndex !== -1) {
				const methodArray =
					didDocument[methods[existingMethodIndex].arrayKey as keyof IDidDocument];

				if (Is.array(methodArray)) {
					methodArray.splice(existingMethodIndex, 1);
					if (methodArray.length === 0) {
						delete didDocument[methods[existingMethodIndex].arrayKey as keyof IDidDocument];
					}
				}
			} else {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"verificationMethodNotFound",
					verificationMethodId
				);
			}

			await this.updateDocument(controller, didDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"removeVerificationMethodFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(serviceId), serviceId);
		if (Is.array(serviceType)) {
			Guards.arrayValue<string>(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(serviceType),
				serviceType
			);
		} else {
			Guards.stringValue(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(serviceType),
				serviceType
			);
		}
		if (Is.array(serviceEndpoint)) {
			Guards.arrayValue<string>(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(serviceEndpoint),
				serviceEndpoint
			);
		} else {
			Guards.stringValue(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(serviceEndpoint),
				serviceEndpoint
			);
		}

		try {
			const didIdentityDocument = await this._didDocumentEntityStorage.get(documentId);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			const fullServiceId = serviceId.includes("#") ? serviceId : `${documentId}#${serviceId}`;

			if (Is.array(didDocument.service)) {
				const existingServiceIndex = didDocument.service.findIndex(s => s.id === fullServiceId);
				if (existingServiceIndex !== -1) {
					didDocument.service?.splice(existingServiceIndex, 1);
				}
			}

			const didService: IDidService = {
				id: fullServiceId,
				type: serviceType,
				serviceEndpoint
			};

			didDocument.service ??= [];
			didDocument.service.push(didService);

			await this.updateDocument(controller, didDocument);

			return didService;
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"addServiceFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(serviceId), serviceId);

		try {
			const idParts = DocumentHelper.parseId(serviceId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(EntityStorageIdentityConnector.CLASS_NAME, "missingDid", serviceId);
			}

			const didIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			if (Is.array(didDocument.service)) {
				const existingServiceIndex = didDocument.service.findIndex(s => s.id === serviceId);
				if (existingServiceIndex !== -1) {
					didDocument.service?.splice(existingServiceIndex, 1);
					if (didDocument.service?.length === 0) {
						delete didDocument.service;
					}
				}
			} else {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"serviceNotFound",
					serviceId
				);
			}

			await this.updateDocument(controller, didDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"removeServiceFailed",
				undefined,
				error
			);
		}
	}

	/**
	 * Add an alias to the alsoKnownAs property on the document.
	 * If the alias is already present the operation is a no-op.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to update.
	 * @param alias The alias to add. Must be a Url or Urn (typically another DID).
	 * @returns Nothing.
	 * @throws GeneralError if the alias is not a Url or Urn.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async addAlsoKnownAs(
		controller: string,
		documentId: string,
		alias: string
	): Promise<void> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(alias), alias);
		if (!Url.tryParseExact(alias) && !Urn.tryParseExact(alias)) {
			throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "invalidAlias", { alias });
		}

		try {
			const didIdentityDocument = await this._didDocumentEntityStorage.get(documentId);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			const existing = Is.array(didDocument.alsoKnownAs) ? didDocument.alsoKnownAs : [];
			if (existing.includes(alias)) {
				return;
			}

			didDocument.alsoKnownAs = [...existing, alias];

			await this.updateDocument(controller, didDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"addAlsoKnownAsFailed",
				undefined,
				error
			);
		}
	}

	/**
	 * Remove an alias from the alsoKnownAs property on the document.
	 * If the alias is not present the operation is a no-op.
	 * @param controller The controller of the identity who can make changes.
	 * @param documentId The id of the document to update.
	 * @param alias The alias to remove. Must be a Url or Urn.
	 * @returns Nothing.
	 * @throws GeneralError if the alias is not a Url or Urn.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async removeAlsoKnownAs(
		controller: string,
		documentId: string,
		alias: string
	): Promise<void> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(documentId), documentId);
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(alias), alias);
		if (!Url.tryParseExact(alias) && !Urn.tryParseExact(alias)) {
			throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "invalidAlias", { alias });
		}

		try {
			const didIdentityDocument = await this._didDocumentEntityStorage.get(documentId);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			if (!Is.array(didDocument.alsoKnownAs) || !didDocument.alsoKnownAs.includes(alias)) {
				return;
			}

			const filtered = didDocument.alsoKnownAs.filter(a => a !== alias);
			if (filtered.length === 0) {
				delete didDocument.alsoKnownAs;
			} else {
				didDocument.alsoKnownAs = filtered;
			}

			await this.updateDocument(controller, didDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"removeAlsoKnownAsFailed",
				undefined,
				error
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
	 * @param options.jwtHeaderFields Additional fields to add to the JWT header.
	 * @param options.jwtPayloadFields Additional fields to add to the JWT payload.
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
			jwtHeaderFields?: { [id: string]: string };
			jwtPayloadFields?: { [id: string]: string };
		}
	): Promise<{
		verifiableCredential: IDidVerifiableCredentialV1;
		jwt: string;
	}> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.object<IJsonLdNodeObject>(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(subject),
			subject
		);
		if (!Is.undefined(options?.revocationIndex)) {
			Guards.number(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(options.revocationIndex),
				options.revocationIndex
			);
		}
		if (!Is.undefined(options?.expirationDate)) {
			Guards.date(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(options.expirationDate),
				options.expirationDate
			);
		}

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const issuerIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(issuerIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				issuerIdentityDocument,
				this._vaultConnector
			);
			const issuerDidDocument = issuerIdentityDocument.document;

			const methods = this.getAllMethods(issuerDidDocument);
			const methodAndArray = methods.find(m => {
				if (Is.string(m.method)) {
					return m.method === verificationMethodId;
				}
				return m.method.id === verificationMethodId;
			});

			if (!methodAndArray) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const verificationDidMethod = methodAndArray.method;
			if (!Is.stringValue(verificationDidMethod.publicKeyJwk?.x)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					method: verificationMethodId
				});
			}

			const revocationService = issuerDidDocument.service?.find(s => s.id.endsWith("#revocation"));

			const subjectClone = ObjectHelper.clone(subject);

			const credContext = ObjectHelper.extractProperty<IJsonLdContextDefinitionRoot>(subjectClone, [
				"@context"
			]);
			const credId = ObjectHelper.extractProperty<string>(subjectClone, ["@id", "id"], false);

			const verifiableCredential: IDidVerifiableCredentialV1 = {
				"@context": (JsonLdProcessor.combineContexts(DidContexts.ContextVCv1, credContext) ??
					DidContexts.ContextVCv1) as [typeof DidContexts.ContextVCv1],
				id,
				type: DidTypes.VerifiableCredential,
				credentialSubject: subjectClone,
				issuer: issuerDidDocument.id,
				issuanceDate: new Date(Date.now()).toISOString(),
				expirationDate: Is.date(options?.expirationDate)
					? options?.expirationDate.toISOString()
					: undefined,
				credentialStatus:
					revocationService && !Is.undefined(options?.revocationIndex)
						? {
								id: revocationService.id,
								type: Is.array(revocationService.type)
									? revocationService.type[0]
									: revocationService.type,
								revocationBitmapIndex: options.revocationIndex.toString()
							}
						: undefined
			};

			const jwtHeader: IJwtHeader = {
				...options?.jwtHeaderFields,
				kid: verificationDidMethod.id,
				typ: "JWT",
				alg: JwsAlgorithms.EdDSA
			};

			const jwtVc = ObjectHelper.pick(ObjectHelper.clone(verifiableCredential), [
				"@context",
				"type",
				"credentialSubject",
				"credentialStatus"
			]);

			// Add the proof to the VC after extracting the jwt data
			// as the jwt does not include the proof
			verifiableCredential.proof = await this.createProof(
				controller,
				verificationMethodId,
				ProofTypes.DataIntegrityProof,
				JsonLdHelper.toNodeObject(verifiableCredential)
			);

			// As we are adding the receipt to the data we update the JSON-LD context
			const proofContext = verifiableCredential.proof["@context"];
			if (!Is.empty(proofContext)) {
				verifiableCredential["@context"] = (JsonLdProcessor.combineContexts(
					verifiableCredential["@context"],
					proofContext
				) ?? verifiableCredential["@context"]) as IDidVerifiableCredentialV1["@context"];
				delete verifiableCredential.proof["@context"];
			}

			if (Is.array(jwtVc.credentialSubject)) {
				jwtVc.credentialSubject = jwtVc.credentialSubject.map(c => {
					ObjectHelper.propertyDelete(c, "id");
					return c;
				});
			} else {
				ObjectHelper.propertyDelete(jwtVc.credentialSubject, "id");
			}

			const jwtPayload: IJwtPayload = {
				...options?.jwtPayloadFields,
				iss: idParts.id,
				nbf: Math.floor(Date.now() / 1000),
				jti: verifiableCredential.id,
				sub: credId,
				vc: jwtVc
			};

			if (Is.date(options?.expirationDate)) {
				jwtPayload.exp = Math.floor(options.expirationDate.getTime() / 1000);
			}

			const signature = await Jwt.encodeWithSigner(jwtHeader, jwtPayload, async (header, payload) =>
				VaultConnectorHelper.jwtSigner(
					this._vaultConnector,
					EntityStorageIdentityConnector.buildVaultKey(idParts.id, idParts.fragment ?? ""),
					header,
					payload
				)
			);

			return {
				verifiableCredential,
				jwt: signature
			};
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"createVerifiableCredentialFailed",
				undefined,
				error
			);
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
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(credential),
				credential
			);
			Guards.objectValue<IDidVerifiableCredential>(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(credential.proof),
				credential.proof
			);
			const { proof, ...doc } = credential;
			await this.verifyProof(
				JsonLdHelper.toNodeObject(doc),
				ArrayHelper.fromObjectOrArray(proof)[0]
			);
			return {
				revoked: false,
				verifiableCredential: doc
			};
		}
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(credential), credential);

		try {
			const jwtDecoded = await Jwt.decode(credential);

			const jwtHeader = jwtDecoded.header;
			const jwtPayload = jwtDecoded.payload;
			const jwtSignature = jwtDecoded.signature;

			if (
				Is.undefined(jwtHeader) ||
				Is.undefined(jwtPayload) ||
				Is.undefined(jwtPayload.iss) ||
				Is.undefined(jwtSignature)
			) {
				throw new NotFoundError(EntityStorageIdentityConnector.CLASS_NAME, "jwkSignatureFailed");
			}

			const issuerDocumentId = jwtPayload.iss;
			const issuerIdentityDocument = await this._didDocumentEntityStorage.get(issuerDocumentId);
			if (Is.undefined(issuerIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				issuerIdentityDocument,
				this._vaultConnector
			);
			const issuerDidDocument = issuerIdentityDocument.document;

			const methods = this.getAllMethods(issuerDidDocument);
			const methodAndArray = methods.find(m => {
				if (Is.string(m.method)) {
					return m.method === jwtHeader.kid;
				}
				return m.method.id === jwtHeader.kid;
			});

			if (!methodAndArray) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "methodMissing", {
					method: jwtHeader.kid
				});
			}

			const didMethod = methodAndArray.method;
			if (!Is.stringValue(didMethod.publicKeyJwk?.x)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					method: jwtHeader.kid
				});
			}

			await Jwt.verifySignature(credential, await Jwk.toCryptoKey(didMethod.publicKeyJwk));

			const verifiableCredential = jwtPayload.vc as IDidVerifiableCredentialV1;
			if (Is.object(verifiableCredential)) {
				if (Is.string(jwtPayload.jti)) {
					verifiableCredential.id = jwtPayload.jti;
				}
				verifiableCredential.issuer = issuerDocumentId;
				if (Is.number(jwtPayload.nbf)) {
					verifiableCredential.issuanceDate = new Date(jwtPayload.nbf * 1000).toISOString();
				}
				if (Is.array(verifiableCredential.credentialSubject)) {
					verifiableCredential.credentialSubject = verifiableCredential.credentialSubject.map(c => {
						ObjectHelper.propertySet(c, "id", jwtPayload.sub);
						return c;
					});
				} else if (Is.object(verifiableCredential.credentialSubject)) {
					ObjectHelper.propertySet(verifiableCredential.credentialSubject, "id", jwtPayload.sub);
				}
			}

			const credentialStatus = verifiableCredential.credentialStatus;
			let revoked = false;
			if (Is.object(credentialStatus)) {
				revoked = await this.checkRevocation(
					issuerDidDocument,
					credentialStatus.revocationBitmapIndex
				);
			} else if (Is.arrayValue(credentialStatus)) {
				for (let i = 0; i < credentialStatus.length; i++) {
					revoked = await this.checkRevocation(
						issuerDidDocument,
						credentialStatus[i].revocationBitmapIndex
					);
					if (revoked) {
						break;
					}
				}
			}

			return {
				revoked,
				verifiableCredential: revoked ? undefined : verifiableCredential
			};
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"checkingVerifiableCredentialFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(issuerDocumentId),
			issuerDocumentId
		);
		Guards.arrayValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(credentialIndices),
			credentialIndices
		);

		try {
			const issuerIdentityDocument = await this._didDocumentEntityStorage.get(issuerDocumentId);
			if (Is.undefined(issuerIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				issuerIdentityDocument,
				this._vaultConnector
			);
			const issuerDidDocument = issuerIdentityDocument.document;

			const revocationService = issuerDidDocument.service?.find(s => s.id.endsWith("#revocation"));
			if (
				revocationService &&
				Is.string(revocationService.serviceEndpoint) &&
				revocationService.type === "BitstringStatusList"
			) {
				const revocationParts = revocationService.serviceEndpoint.split(",");
				if (revocationParts.length === 2) {
					const compressedRevocationBytes = Converter.base64UrlToBytes(revocationParts[1]);
					const decompressed = await Compression.decompress(
						compressedRevocationBytes,
						CompressionType.Gzip
					);

					const bitString = BitString.fromBits(
						decompressed,
						EntityStorageIdentityConnector._REVOCATION_BITS_SIZE
					);

					for (const credentialIndex of credentialIndices) {
						bitString.setBit(credentialIndex, true);
					}

					const compressed = await Compression.compress(bitString.getBits(), CompressionType.Gzip);
					revocationService.serviceEndpoint = `data:application/octet-stream;base64,${Converter.bytesToBase64Url(compressed)}`;
				}
			}

			await this.updateDocument(controller, issuerDidDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"revokeVerifiableCredentialsFailed",
				undefined,
				error
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
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(issuerDocumentId),
			issuerDocumentId
		);
		Guards.arrayValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(credentialIndices),
			credentialIndices
		);

		try {
			const issuerIdentityDocument = await this._didDocumentEntityStorage.get(issuerDocumentId);
			if (Is.undefined(issuerIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					issuerDocumentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				issuerIdentityDocument,
				this._vaultConnector
			);
			const issuerDidDocument = issuerIdentityDocument.document;

			const revocationService = issuerDidDocument.service?.find(s => s.id.endsWith("#revocation"));
			if (
				revocationService &&
				Is.string(revocationService.serviceEndpoint) &&
				revocationService.type === "BitstringStatusList"
			) {
				const revocationParts = revocationService.serviceEndpoint.split(",");
				if (revocationParts.length === 2) {
					const compressedRevocationBytes = Converter.base64UrlToBytes(revocationParts[1]);
					const decompressed = await Compression.decompress(
						compressedRevocationBytes,
						CompressionType.Gzip
					);

					const bitString = BitString.fromBits(
						decompressed,
						EntityStorageIdentityConnector._REVOCATION_BITS_SIZE
					);

					for (const credentialIndex of credentialIndices) {
						bitString.setBit(credentialIndex, false);
					}

					const compressed = await Compression.compress(bitString.getBits(), CompressionType.Gzip);
					revocationService.serviceEndpoint = `data:application/octet-stream;base64,${Converter.bytesToBase64Url(compressed)}`;
				}
			}

			await this.updateDocument(controller, issuerDidDocument);
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"unrevokeVerifiableCredentialsFailed",
				undefined,
				error
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
	 * @param options.jwtHeaderFields Additional fields to add to the JWT header.
	 * @param options.jwtPayloadFields Additional fields to add to the JWT payload.
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
		options?: {
			expirationDate?: Date;
			jwtHeaderFields?: { [id: string]: string };
			jwtPayloadFields?: { [id: string]: string };
		}
	): Promise<{
		verifiablePresentation: IDidVerifiablePresentationV1;
		jwt: string;
	}> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		if (Is.array(types)) {
			Guards.arrayValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(types), types);
		} else if (Is.string(types)) {
			Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(types), types);
		}
		Guards.arrayValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verifiableCredentials),
			verifiableCredentials
		);
		if (!Is.undefined(options?.expirationDate)) {
			Guards.date(
				EntityStorageIdentityConnector.CLASS_NAME,
				nameof(options.expirationDate),
				options.expirationDate
			);
		}

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const holderIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(holderIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				holderIdentityDocument,
				this._vaultConnector
			);
			const holderDidDocument = holderIdentityDocument.document;

			const methods = this.getAllMethods(holderDidDocument);
			const methodAndArray = methods.find(m => {
				if (Is.string(m.method)) {
					return m.method === verificationMethodId;
				}
				return m.method.id === verificationMethodId;
			});

			if (!methodAndArray) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const didMethod = methodAndArray.method;
			if (!Is.stringValue(didMethod.publicKeyJwk?.x)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					method: verificationMethodId
				});
			}

			const finalTypes: string[] = [DidTypes.VerifiablePresentation];
			if (Is.array(types)) {
				finalTypes.push(...types);
			} else if (Is.stringValue(types)) {
				finalTypes.push(types);
			}

			const combinedContext =
				JsonLdProcessor.combineContexts(DidContexts.ContextVCv1, contexts) ??
				DidContexts.ContextVCv1;

			const verifiablePresentation: IDidVerifiablePresentationV1 = {
				"@context": combinedContext as [typeof DidContexts.ContextVCv1],
				id: presentationId,
				type: finalTypes,
				verifiableCredential: verifiableCredentials,
				holder: idParts.id
			};

			const jwtHeader: IJwtHeader = {
				...options?.jwtHeaderFields,
				kid: didMethod.id,
				typ: "JWT",
				alg: JwsAlgorithms.EdDSA
			};

			const jwtVp = ObjectHelper.pick(ObjectHelper.clone(verifiablePresentation), [
				"@context",
				"type",
				"verifiableCredential"
			]);

			// Add the proof to the VP after extracting the jwt data
			// as the jwt does not include the proof
			verifiablePresentation.proof = await this.createProof(
				controller,
				verificationMethodId,
				ProofTypes.DataIntegrityProof,
				JsonLdHelper.toNodeObject(verifiablePresentation)
			);

			const jwtPayload: IJwtPayload = {
				...options?.jwtPayloadFields,
				iss: verifiablePresentation.holder,
				nbf: Math.floor(Date.now() / 1000),
				vp: jwtVp
			};

			if (Is.date(options?.expirationDate)) {
				jwtPayload.exp = Math.floor(options.expirationDate.getTime() / 1000);
			}

			const signature = await Jwt.encodeWithSigner(jwtHeader, jwtPayload, async (header, payload) =>
				VaultConnectorHelper.jwtSigner(
					this._vaultConnector,
					EntityStorageIdentityConnector.buildVaultKey(idParts.id, idParts.fragment ?? ""),
					header,
					payload
				)
			);

			return {
				verifiablePresentation,
				jwt: signature
			};
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"createVerifiablePresentationFailed",
				undefined,
				error
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
		verifiablePresentation?: IDidVerifiablePresentationV1;
		issuers?: IDidDocument[];
	}> {
		if (Is.object(presentation)) {
			const { proof, ...doc } = presentation as IDidVerifiablePresentationV1;
			const proofEntry = ArrayHelper.fromObjectOrArray(proof)[0];
			Guards.objectValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(proofEntry), proofEntry);
			await this.verifyProof(JsonLdHelper.toNodeObject(doc), proofEntry);
			return { revoked: false, verifiablePresentation: doc };
		}

		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(presentation),
			presentation
		);

		const presentationJwt = presentation;

		try {
			const jwtDecoded = await Jwt.decode(presentationJwt);

			const jwtHeader = jwtDecoded.header;
			const jwtPayload = jwtDecoded.payload;
			const jwtSignature = jwtDecoded.signature;

			if (
				Is.undefined(jwtHeader) ||
				Is.undefined(jwtPayload) ||
				Is.undefined(jwtPayload.iss) ||
				Is.undefined(jwtSignature)
			) {
				throw new NotFoundError(EntityStorageIdentityConnector.CLASS_NAME, "jwkSignatureFailed");
			}

			const holderDocumentId = jwtPayload.iss;
			const holderIdentityDocument = await this._didDocumentEntityStorage.get(holderDocumentId);
			if (Is.undefined(holderIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					holderDocumentId
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				holderIdentityDocument,
				this._vaultConnector
			);

			const issuers: IDidDocument[] = [];
			const tokensRevoked: boolean[] = [];
			const verifiablePresentation = jwtPayload?.vp as IDidVerifiablePresentationV1;
			if (
				Is.object<IDidVerifiablePresentationV1>(verifiablePresentation) &&
				Is.array(verifiablePresentation.verifiableCredential)
			) {
				for (const vcJwt of verifiablePresentation.verifiableCredential) {
					let revoked = true;
					if (Is.stringValue(vcJwt)) {
						const jwt = await Jwt.decode(vcJwt);

						if (Is.string(jwt.payload?.iss)) {
							const issuerDocumentId = jwt.payload.iss;
							verifiablePresentation.holder = issuerDocumentId;

							const issuerDidDocument = await this._didDocumentEntityStorage.get(issuerDocumentId);
							if (Is.undefined(issuerDidDocument)) {
								throw new NotFoundError(
									EntityStorageIdentityConnector.CLASS_NAME,
									"documentNotFound",
									issuerDocumentId
								);
							}
							await EntityStorageIdentityConnector.verifyDocument(
								issuerDidDocument,
								this._vaultConnector
							);
							issuers.push({
								"@context": DidContexts.Context,
								...issuerDidDocument
							});

							const vc = jwt.payload.vc as IDidVerifiableCredentialV1;
							if (Is.object<IDidVerifiableCredentialV1>(vc)) {
								const credentialStatus = vc.credentialStatus;
								if (Is.object(credentialStatus)) {
									revoked = await this.checkRevocation(
										{
											"@context": DidContexts.Context,
											...issuerDidDocument
										},
										credentialStatus.revocationBitmapIndex
									);
								} else if (Is.arrayValue(credentialStatus)) {
									for (let i = 0; i < credentialStatus.length; i++) {
										revoked = await this.checkRevocation(
											{
												"@context": DidContexts.Context,
												...issuerDidDocument
											},
											credentialStatus[i].revocationBitmapIndex
										);
										if (revoked) {
											break;
										}
									}
								}
							}
						}
					} else {
						revoked = false;
					}
					tokensRevoked.push(revoked);
				}
			}

			return {
				revoked: tokensRevoked.some(Boolean),
				verifiablePresentation,
				issuers
			};
		} catch (error) {
			if (BaseError.isErrorMessage(error, /revoked/i)) {
				return {
					revoked: true
				};
			}

			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"checkingVerifiablePresentationFailed",
				undefined,
				error
			);
		}
	}

	/**
	 * Create a proof for arbitrary data with the specified verification method.
	 * This method uses async signing to ensure the private key never leaves the vault,
	 * with algorithm validation to ensure key type compatibility.
	 * @param controller The controller of the identity who can make changes.
	 * @param verificationMethodId The verification method id to use.
	 * @param proofType The type of proof to create.
	 * @param unsecureDocument The unsecure document to create the proof for.
	 * @returns The proof.
	 * @throws NotFoundError if the identity or method is not found.
	 * @throws GeneralError if algorithm doesn't match key type or proof creation fails.
	 */
	public async createProof(
		controller: string,
		verificationMethodId: string,
		proofType: ProofTypes,
		unsecureDocument: IJsonLdNodeObject
	): Promise<IProof> {
		Guards.stringValue(EntityStorageIdentityConnector.CLASS_NAME, nameof(controller), controller);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(verificationMethodId),
			verificationMethodId
		);
		Guards.arrayOneOf<ProofTypes>(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(proofType),
			proofType,
			Object.values(ProofTypes)
		);
		Guards.object<IJsonLdNodeObject>(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(unsecureDocument),
			unsecureDocument
		);

		try {
			const idParts = DocumentHelper.parseId(verificationMethodId);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"missingDid",
					verificationMethodId
				);
			}

			const didIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			const methods = this.getAllMethods(didDocument);
			const methodAndArray = methods.find(m => {
				if (Is.string(m.method)) {
					return m.method === verificationMethodId;
				}
				return m.method.id === verificationMethodId;
			});

			if (!methodAndArray) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "methodMissing", {
					method: verificationMethodId
				});
			}

			const didMethod = methodAndArray.method;
			if (!Is.stringValue(didMethod.publicKeyJwk?.x)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					method: verificationMethodId
				});
			}

			const vaultKey = EntityStorageIdentityConnector.buildVaultKey(
				didDocument.id,
				idParts.fragment ?? ""
			);
			const keyType = await this._vaultConnector.getKeyType(vaultKey);

			if (Is.undefined(keyType)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "privateKeyMissing", {
					keyId: vaultKey
				});
			}

			const unsignedProof = ProofHelper.createUnsignedProof(proofType, verificationMethodId);

			const signedProof = await ProofHelper.createProofWithSigner(
				proofType,
				unsecureDocument,
				unsignedProof,
				async (data, algorithm) => this.signWithVault(vaultKey, keyType, data, algorithm)
			);

			return signedProof;
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"createProofFailed",
				undefined,
				error
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
		Guards.object<IJsonLdNodeObject>(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(document),
			document
		);
		Guards.object<IProof>(EntityStorageIdentityConnector.CLASS_NAME, nameof(proof), proof);
		Guards.stringValue(
			EntityStorageIdentityConnector.CLASS_NAME,
			nameof(proof.verificationMethod),
			proof.verificationMethod
		);

		try {
			const idParts = DocumentHelper.parseId(proof.verificationMethod);
			if (Is.empty(idParts.fragment)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"missingDid",
					proof.verificationMethod
				);
			}

			const didIdentityDocument = await this._didDocumentEntityStorage.get(idParts.id);
			if (Is.undefined(didIdentityDocument)) {
				throw new NotFoundError(
					EntityStorageIdentityConnector.CLASS_NAME,
					"documentNotFound",
					idParts.id
				);
			}
			await EntityStorageIdentityConnector.verifyDocument(
				didIdentityDocument,
				this._vaultConnector
			);
			const didDocument = didIdentityDocument.document;

			const methods = this.getAllMethods(didDocument);

			const methodAndArray = methods.find(m => {
				if (Is.string(m.method)) {
					return m.method === proof.verificationMethod;
				}
				return m.method.id === proof.verificationMethod;
			});

			if (!methodAndArray) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "methodMissing", {
					method: proof.verificationMethod
				});
			}

			const didMethod = methodAndArray.method;
			if (!Is.stringValue(didMethod.publicKeyJwk?.x)) {
				throw new GeneralError(EntityStorageIdentityConnector.CLASS_NAME, "publicKeyJwkMissing", {
					method: proof.verificationMethod
				});
			}

			const result = await ProofHelper.verifyProof(document, proof, didMethod.publicKeyJwk);
			return result;
		} catch (error) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"verifyProofFailed",
				undefined,
				error
			);
		}
	}

	/**
	 * Signs data using the vault connector with algorithm validation.
	 * @param vaultKey The vault key identifier.
	 * @param keyType The type of the key.
	 * @param data The data to sign.
	 * @param algorithm The signing algorithm.
	 * @returns The signature bytes.
	 * @throws GeneralError if algorithm doesn't match key type.
	 * @internal
	 */
	private async signWithVault(
		vaultKey: string,
		keyType: VaultKeyType,
		data: Uint8Array,
		algorithm: string
	): Promise<Uint8Array> {
		if (algorithm === JwsAlgorithms.EdDSA && keyType !== VaultKeyType.Ed25519) {
			throw new GeneralError(
				EntityStorageIdentityConnector.CLASS_NAME,
				"algorithmKeyTypeMismatch",
				{
					algorithm,
					expectedKeyType: VaultKeyType.Ed25519,
					actualKeyType: keyType,
					keyId: vaultKey
				}
			);
		}
		return this._vaultConnector.sign(vaultKey, data);
	}

	/**
	 * Get all the methods from a document.
	 * @param document The document to get the methods from.
	 * @returns The methods.
	 * @internal
	 */
	private getAllMethods(
		document: IDidDocument
	): { arrayKey: string; method: Partial<IDidDocumentVerificationMethod> }[] {
		const methods: {
			arrayKey: string;
			method: Partial<IDidDocumentVerificationMethod>;
		}[] = [];

		const methodTypes: DidVerificationMethodType[] = Object.values(DidVerificationMethodType);

		for (const methodType of methodTypes) {
			const mt = document[methodType];
			if (Is.arrayValue(mt)) {
				methods.push(
					...mt.map(m => ({
						arrayKey: methodType,
						method: Is.string(m) ? { id: m } : m
					}))
				);
			}
		}

		return methods;
	}

	/**
	 * Check if a revocation index is revoked.
	 * @param document The document to check.
	 * @param revocationBitmapIndex The revocation index to check.
	 * @returns True if the index is revoked.
	 * @internal
	 */
	private async checkRevocation(
		document: IDidDocument,
		revocationBitmapIndex?: unknown
	): Promise<boolean> {
		if (Is.stringValue(revocationBitmapIndex)) {
			const revocationIndex = Coerce.number(revocationBitmapIndex);
			if (Is.number(revocationIndex)) {
				const revocationService = document.service?.find(s => s.id.endsWith("#revocation"));
				if (
					revocationService &&
					Is.string(revocationService.serviceEndpoint) &&
					revocationService.type === "BitstringStatusList"
				) {
					const revocationParts = revocationService.serviceEndpoint.split(",");
					if (revocationParts.length === 2) {
						const compressedRevocationBytes = Converter.base64UrlToBytes(revocationParts[1]);
						const decompressed = await Compression.decompress(
							compressedRevocationBytes,
							CompressionType.Gzip
						);

						const bitString = BitString.fromBits(
							decompressed,
							EntityStorageIdentityConnector._REVOCATION_BITS_SIZE
						);

						return bitString.getBit(revocationIndex);
					}
				}
			}
		}
		return false;
	}

	/**
	 * Update the document in storage.
	 * @param controller The controller of the document.
	 * @param didDocument The did document to store.
	 * @internal
	 */
	private async updateDocument(controller: string, didDocument: IDidDocument): Promise<void> {
		const stringifiedDocument = JsonHelper.canonicalize(didDocument);
		const docBytes = Converter.utf8ToBytes(stringifiedDocument);

		const signature = await this._vaultConnector.sign(
			EntityStorageIdentityConnector.buildVaultKey(didDocument.id, "did"),
			docBytes
		);

		await this._didDocumentEntityStorage.set({
			id: didDocument.id,
			document: didDocument,
			signature: Converter.bytesToBase64(signature),
			controller
		});
	}
}
