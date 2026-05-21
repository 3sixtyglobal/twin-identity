// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus, Is, Urn } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	DidContexts,
	DidTypes,
	ProofTypes,
	VerifiableCredentialHelper,
	type DidVerificationMethodType,
	type IDataIntegrityProof,
	type IDidService,
	type IDidVerifiableCredential,
	type IProof
} from "@twin.org/standards-w3c-did";
import type { VaultSecret } from "@twin.org/vault-connector-entity-storage";
import {
	setupTestEnv,
	TEST_CLIENT_OPTIONS,
	TEST_EXPLORER_URL,
	TEST_USER_IDENTITY,
	TEST_MNEMONIC_NAME,
	TEST_NETWORK
} from "./setupTestEnv.js";
import { IotaIdentityConnector } from "../src/iotaIdentityConnector.js";
import { IotaIdentityResolverConnector } from "../src/iotaIdentityResolverConnector.js";
import type { IIotaIdentityConnectorConfig } from "../src/models/IIotaIdentityConnectorConfig.js";

let testVcJwt: string;
let testVc: IDidVerifiableCredential;
let testDocumentId: string;
let testVerificationMethodId: string;
let identityConnector: IotaIdentityConnector;
let identityResolverConnector: IotaIdentityResolverConnector;
describe("IotaIdentityConnector", () => {
	beforeAll(async () => {
		await setupTestEnv();

		// Create a document and verification method for testing
		try {
			identityConnector = new IotaIdentityConnector({
				config: {
					clientOptions: TEST_CLIENT_OPTIONS,
					vaultMnemonicId: TEST_MNEMONIC_NAME,
					network: TEST_NETWORK
				}
			});

			identityResolverConnector = new IotaIdentityResolverConnector({
				config: {
					clientOptions: TEST_CLIENT_OPTIONS,
					vaultMnemonicId: TEST_MNEMONIC_NAME,
					network: TEST_NETWORK
				}
			});

			// Create a document
			const document = await identityConnector.createDocument(TEST_USER_IDENTITY);
			testDocumentId = document.id;
		} catch (error) {
			console.error("Error in beforeAll:", error);
		}
	});

	test("can fail to construct with no options", () => {
		expect(
			() =>
				new IotaIdentityConnector(undefined as unknown as { config: IIotaIdentityConnectorConfig })
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to construct with no config", () => {
		expect(
			() => new IotaIdentityConnector({} as unknown as { config: IIotaIdentityConnectorConfig })
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options.config",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to construct with no config.clientOptions", () => {
		expect(
			() =>
				new IotaIdentityConnector({ config: {} } as unknown as {
					config: IIotaIdentityConnectorConfig;
				})
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options.config.clientOptions",
					value: "undefined"
				}
			})
		);
	});

	test("can get health status", async () => {
		const health = await identityConnector.health();

		expect(health).toBeDefined();
		expect(health.length).toBeGreaterThan(0);
		expect(health[0].source).toEqual(IotaIdentityConnector.CLASS_NAME);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can get health status error when node is unreachable", async () => {
		const badConnector = new IotaIdentityConnector({
			config: {
				clientOptions: { url: "http://localhost:1" },
				vaultMnemonicId: TEST_MNEMONIC_NAME,
				network: TEST_NETWORK
			}
		});

		const health = await badConnector.health();

		expect(health).toBeDefined();
		expect(health.length).toBeGreaterThan(0);
		expect(health[0].source).toEqual(IotaIdentityConnector.CLASS_NAME);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});

	test("can create a document", async () => {
		const testDocument = await identityConnector.createDocument(TEST_USER_IDENTITY);
		testDocumentId = testDocument.id;

		// Check that the document ID starts with did:iota
		expect(testDocument.id.startsWith("did:iota")).toBeTruthy();

		// Ensure the document has the expected structure
		expect(testDocument.id).toBeDefined();
		expect(testDocument.service).toBeDefined();
		expect((testDocument.service?.[0] as IDidService)?.id).toEqual(`${testDocument.id}#revocation`);

		const didUrn = Urn.fromValidString(testDocument.id);
		const didParts = didUrn.parts();
		const objectId = didParts[didParts.length - 1];

		console.debug("DID Document", `${TEST_EXPLORER_URL}object/${objectId}?network=${TEST_NETWORK}`);
	});

	test("can delete a document", async () => {
		const testDocument = await identityConnector.createDocument(TEST_USER_IDENTITY);

		// Check that the document ID starts with did:iota
		expect(testDocument.id.startsWith("did:iota")).toBeTruthy();

		const didUrn = Urn.fromValidString(testDocument.id);
		const didParts = didUrn.parts();
		const objectId = didParts[didParts.length - 1];

		console.debug(
			"DID Document (Deleted)",
			`${TEST_EXPLORER_URL}object/${objectId}?network=${TEST_NETWORK}`
		);

		await identityConnector.removeDocument(TEST_USER_IDENTITY, testDocument.id);

		await expect(identityResolverConnector.resolveDocument(testDocument.id)).rejects.toMatchObject({
			name: "GeneralError",
			message: "iotaIdentityResolverConnector.resolveDocumentFailed",
			properties: {
				documentId: testDocument.id
			}
		});
	});

	test("should follow IOTA DID Method Specification v2.0 format", async () => {
		const testDocument = await identityConnector.createDocument(TEST_USER_IDENTITY);

		// Check DID format based on network
		const didParts = testDocument.id.split(":");

		if (TEST_NETWORK === "testnet" || TEST_NETWORK === "devnet") {
			// For testnet/devnet, DID should include network identifier
			// Format: did:iota:network:objectId
			expect(didParts).toHaveLength(4);
			expect(didParts[0]).toBe("did");
			expect(didParts[1]).toBe("iota");
			expect(didParts[2]).toBe(TEST_NETWORK);
			expect(didParts[3]).toMatch(/^0x[\da-f]{64}$/);
		} else {
			// For mainnet (when network ID is "6364aad5"), DID should omit network identifier
			// Format: did:iota:objectId
			expect(didParts).toHaveLength(3);
			expect(didParts[0]).toBe("did");
			expect(didParts[1]).toBe("iota");
			expect(didParts[2]).toMatch(/^0x[\da-f]{64}$/);
		}
	});

	test("can fail to resolve a document with no id", async () => {
		await expect(
			identityResolverConnector.resolveDocument(undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "documentId",
				value: "undefined"
			}
		});
	});

	test("can resolve a document id", async () => {
		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);

		expect(resolvedDocument).toBeDefined();
		expect(resolvedDocument.id).toEqual(testDocumentId);
		expect(resolvedDocument.service).toBeDefined();
		expect((resolvedDocument.service?.[0] as IDidService)?.id).toEqual(
			`${testDocumentId}#revocation`
		);
	});

	test("can fail to add a verification method with no document id", async () => {
		await expect(
			identityConnector.addVerificationMethod(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				undefined as unknown as DidVerificationMethodType,
				undefined
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "documentId",
				value: "undefined"
			}
		});
	});

	test("can fail to add a verification method with no document verification method type", async () => {
		await expect(
			identityConnector.addVerificationMethod(
				TEST_USER_IDENTITY,
				"foo",
				undefined as unknown as DidVerificationMethodType,
				undefined
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.arrayOneOf",
			properties: {
				property: "verificationMethodType",
				value: "undefined"
			}
		});
	});

	test("can add a verification method", async () => {
		const verificationMethodType = "authentication";
		const verificationMethodId = "testVerificationMethod";

		const addedMethod = await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			testDocumentId,
			verificationMethodType,
			verificationMethodId
		);

		expect(addedMethod).toBeDefined();
		expect(addedMethod.id).toEqual(`${testDocumentId}#${verificationMethodId}`);
		expect(addedMethod.type).toEqual("JsonWebKey2020");
		testVerificationMethodId = addedMethod.id;

		const keyStore =
			EntityStorageConnectorFactory.get<MemoryEntityStorageConnector<VaultSecret>>(
				"vault-key"
			).getStore();

		expect(keyStore?.[0].id).toEqual(`${testDocumentId}/${verificationMethodId}`);
	});

	test("can verify verification methods in a resolved document", async () => {
		const documentId = testDocumentId;

		const verificationMethodType = "verificationMethod";
		const verificationMethodId = "testVerificationMethod";

		await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			documentId,
			verificationMethodType,
			verificationMethodId
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(documentId);

		expect(resolvedDocument).toBeDefined();
		expect(resolvedDocument.id).toEqual(documentId);

		expect(resolvedDocument.verificationMethod).toBeDefined();
		expect(Array.isArray(resolvedDocument.verificationMethod)).toBeTruthy();
		expect(resolvedDocument.verificationMethod?.length).toBeGreaterThan(0);

		// Find our specific verification method
		const specificMethod = resolvedDocument.verificationMethod?.find(method => {
			if (Is.string(method)) {
				return method === `${documentId}#${verificationMethodId}`;
			}
			return method.id === `${documentId}#${verificationMethodId}`;
		});

		// Verify the specific method exists and has correct properties
		expect(specificMethod).toBeDefined();
		if (!Is.string(specificMethod)) {
			expect(specificMethod?.id).toEqual(`${documentId}#${verificationMethodId}`);
			expect(specificMethod?.type).toEqual("JsonWebKey2020");
			expect(specificMethod?.controller).toEqual(documentId);

			// Verify the method has the expected properties for a JWK
			expect(specificMethod?.publicKeyJwk).toBeDefined();
			if (specificMethod?.publicKeyJwk) {
				expect(specificMethod.publicKeyJwk.kty).toBeDefined();
				expect(specificMethod.publicKeyJwk.crv).toBeDefined();
				expect(specificMethod.publicKeyJwk.x).toBeDefined();
			}
		}

		// Check that the document has the expected service structure
		expect(resolvedDocument.service).toBeDefined();
		expect(Array.isArray(resolvedDocument.service)).toBeTruthy();

		const revocationService = resolvedDocument.service?.find(service =>
			service.id.endsWith("#revocation")
		);

		expect(revocationService).toBeDefined();
		expect(revocationService?.type).toEqual("RevocationBitmap2022");
	});

	test("can fail to remove a verification method with no verification method id", async () => {
		await expect(
			identityConnector.removeVerificationMethod(TEST_USER_IDENTITY, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "verificationMethodId",
				value: "undefined"
			}
		});
	});

	test("can remove a verification method", async () => {
		const verificationMethodType = "verificationMethod";
		const verificationMethodId = "methodToRemove";

		const addedMethod = await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			testDocumentId,
			verificationMethodType,
			verificationMethodId
		);

		expect(addedMethod).toBeDefined();
		expect(addedMethod.id).toEqual(`${testDocumentId}#${verificationMethodId}`);

		await identityConnector.removeVerificationMethod(
			TEST_USER_IDENTITY,
			`${testDocumentId}#${verificationMethodId}`
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);

		expect(resolvedDocument).toBeDefined();
		expect(resolvedDocument.id).toEqual(testDocumentId);

		const methodStillExists = resolvedDocument.verificationMethod?.some(method => {
			if (Is.string(method)) {
				return method === `${testDocumentId}#${verificationMethodId}`;
			}
			return method.id === `${testDocumentId}#${verificationMethodId}`;
		});

		expect(methodStillExists).toBeFalsy();
	});

	test("can fail to add a service with no document id", async () => {
		await expect(
			identityConnector.addService(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				undefined as unknown as string,
				undefined as unknown as string,
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "documentId",
				value: "undefined"
			}
		});
	});

	test("can fail to add a service with no service id", async () => {
		await expect(
			identityConnector.addService(
				TEST_USER_IDENTITY,
				"foo",
				undefined as unknown as string,
				undefined as unknown as string,
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "serviceId",
				value: "undefined"
			}
		});
	});

	test("can fail to add a service with no service type", async () => {
		await expect(
			identityConnector.addService(
				TEST_USER_IDENTITY,
				"foo",
				"foo",
				undefined as unknown as string,
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "serviceType",
				value: "undefined"
			}
		});
	});

	test("can fail to add a service with no service endpoint", async () => {
		await expect(
			identityConnector.addService(
				TEST_USER_IDENTITY,
				"foo",
				"foo",
				"foo",
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "serviceEndpoint",
				value: "undefined"
			}
		});
	});

	test("can add a service", async () => {
		const serviceId = "testService";
		const serviceType = "TestServiceType";
		const serviceEndpoint = "https://example.com/service";

		const addedService = await identityConnector.addService(
			TEST_USER_IDENTITY,
			testDocumentId,
			serviceId,
			serviceType,
			serviceEndpoint
		);

		expect(addedService).toBeDefined();
		expect(addedService.id).toEqual(`${testDocumentId}#${serviceId}`);
		expect(addedService.type).toEqual(serviceType);
		expect(addedService.serviceEndpoint).toEqual(serviceEndpoint);
	});

	test("can resolve a document with added service", async () => {
		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);

		expect(resolvedDocument).toBeDefined();
		expect(resolvedDocument.id).toEqual(testDocumentId);
		expect(resolvedDocument.service).toBeDefined();
		expect(Array.isArray(resolvedDocument.service)).toBeTruthy();

		const addedService = resolvedDocument.service?.find(
			service => service.id === `${testDocumentId}#testService`
		);

		expect(addedService).toBeDefined();
		expect(addedService?.type).toEqual("TestServiceType");
		expect(addedService?.serviceEndpoint).toEqual("https://example.com/service");
	});

	test("can fail to remove a service with no service id", async () => {
		await expect(
			identityConnector.removeService(TEST_USER_IDENTITY, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "serviceId",
				value: "undefined"
			}
		});
	});

	test("can add and remove a service", async () => {
		const documentId = testDocumentId;

		const serviceId = "testServiceToRemove";
		const serviceType = "TestServiceType";
		const serviceEndpoint = "https://example.com/service-to-remove";

		const addedService = await identityConnector.addService(
			TEST_USER_IDENTITY,
			documentId,
			serviceId,
			serviceType,
			serviceEndpoint
		);

		expect(addedService).toBeDefined();
		expect(addedService.id).toEqual(`${documentId}#${serviceId}`);

		await identityConnector.removeService(TEST_USER_IDENTITY, addedService.id);
	});

	test("throws error when removing non-existent service", async () => {
		const nonExistentServiceId = `${testDocumentId}#nonExistentService`;

		await expect(
			identityConnector.removeService(TEST_USER_IDENTITY, nonExistentServiceId)
		).rejects.toThrow(
			expect.objectContaining({
				name: "GeneralError",
				message: "iotaIdentityConnector.removeServiceFailed",
				source: "IotaIdentityConnector",
				cause: expect.objectContaining({
					message: "iotaIdentityConnector.serviceNotFound",
					name: "NotFoundError"
				})
			})
		);
	});

	test("can fail to add alsoKnownAs with no alias", async () => {
		await expect(
			identityConnector.addAlsoKnownAs(
				TEST_USER_IDENTITY,
				testDocumentId,
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "alias",
				value: "undefined"
			}
		});
	});

	test("can fail to add alsoKnownAs when alias is not a Url or Urn", async () => {
		await expect(
			identityConnector.addAlsoKnownAs(TEST_USER_IDENTITY, testDocumentId, "not a uri")
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "iotaIdentityConnector.invalidAlias",
			properties: { alias: "not a uri" }
		});
	});

	test("can add an alias to alsoKnownAs", async () => {
		await identityConnector.addAlsoKnownAs(
			TEST_USER_IDENTITY,
			testDocumentId,
			"did:example:linked"
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);
		expect(resolvedDocument.alsoKnownAs).toContain("did:example:linked");
	});

	test("addAlsoKnownAs is idempotent for duplicates", async () => {
		await identityConnector.addAlsoKnownAs(
			TEST_USER_IDENTITY,
			testDocumentId,
			"did:example:linked"
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);
		const aliases = Is.array(resolvedDocument.alsoKnownAs) ? resolvedDocument.alsoKnownAs : [];
		const occurrences = aliases.filter(a => a === "did:example:linked").length;
		expect(occurrences).toBe(1);
	});

	test("can fail to remove alsoKnownAs with no alias", async () => {
		await expect(
			identityConnector.removeAlsoKnownAs(
				TEST_USER_IDENTITY,
				testDocumentId,
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "alias",
				value: "undefined"
			}
		});
	});

	test("can fail to remove alsoKnownAs when alias is not a Url or Urn", async () => {
		await expect(
			identityConnector.removeAlsoKnownAs(TEST_USER_IDENTITY, testDocumentId, "not a uri")
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "iotaIdentityConnector.invalidAlias",
			properties: { alias: "not a uri" }
		});
	});

	test("removeAlsoKnownAs is a no-op when alias is not present", async () => {
		await identityConnector.removeAlsoKnownAs(
			TEST_USER_IDENTITY,
			testDocumentId,
			"did:example:missing"
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);
		expect(resolvedDocument.alsoKnownAs).toContain("did:example:linked");
	});

	test("can remove an alias from alsoKnownAs", async () => {
		await identityConnector.removeAlsoKnownAs(
			TEST_USER_IDENTITY,
			testDocumentId,
			"did:example:linked"
		);

		const resolvedDocument = await identityResolverConnector.resolveDocument(testDocumentId);
		expect(resolvedDocument.alsoKnownAs ?? []).not.toContain("did:example:linked");
	});

	test("can fail to create a verifiable credential with no verification method id", async () => {
		await expect(
			identityConnector.createVerifiableCredential(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				undefined,
				{},
				undefined
			)
		).rejects.toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.string",
				properties: {
					property: "verificationMethodId",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to create a verifiable credential with no subject", async () => {
		await expect(
			identityConnector.createVerifiableCredential(
				TEST_USER_IDENTITY,
				"did:iota:test#key-1",
				undefined,
				undefined as unknown as IJsonLdNodeObject,
				undefined
			)
		).rejects.toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "subject",
					value: "undefined"
				}
			})
		);
	});

	test("can create a verifiable credential", async () => {
		const did = testDocumentId;

		const verificationMethod = await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			did,
			"assertionMethod",
			"testVerificationMethod"
		);
		expect(verificationMethod).toBeDefined();
		expect(verificationMethod.id).toBeDefined();

		const result = await identityConnector.createVerifiableCredential(
			TEST_USER_IDENTITY,
			verificationMethod.id,
			"https://example.edu/credentials/3732",
			{
				"@context": ["https://schema.org"],
				id: did,
				name: "Jane Doe"
			},
			{
				revocationIndex: 123,
				expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
			}
		);

		expect(result).toBeDefined();
		expect(result.verifiableCredential).toBeDefined();

		expect(result.verifiableCredential.id).toEqual("https://example.edu/credentials/3732");
		expect(result.verifiableCredential.type).toContain("VerifiableCredential");
		expect(result.verifiableCredential.proof).toBeDefined();
		expect(result.verifiableCredential["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org/",
			DidContexts.ContextDataIntegrity
		]);
		const proofObj = Array.isArray(result.verifiableCredential.proof)
			? result.verifiableCredential.proof[0]
			: result.verifiableCredential.proof;
		expect((proofObj as IDataIntegrityProof)?.["@context"]).toBeUndefined();

		// Check credential subject
		const credentialSubject = result.verifiableCredential.credentialSubject;
		expect(credentialSubject).toBeDefined();
		if (credentialSubject && !Array.isArray(credentialSubject)) {
			expect(credentialSubject.id).toEqual(did);
			expect(credentialSubject.name).toEqual("Jane Doe");
		}

		expect(result.verifiableCredential.issuer).toEqual(did);
		const issuanceDate = VerifiableCredentialHelper.getValidFrom(result.verifiableCredential);
		const expirationDate = VerifiableCredentialHelper.getValidUntil(result.verifiableCredential);
		expect(issuanceDate).toBeDefined();
		expect(new Date(expirationDate ?? "").getFullYear()).toEqual(new Date().getFullYear() + 1);

		// Check credential status
		if (result.verifiableCredential.credentialStatus) {
			const status = Array.isArray(result.verifiableCredential.credentialStatus)
				? result.verifiableCredential.credentialStatus[0]
				: result.verifiableCredential.credentialStatus;

			expect(status.type).toEqual("RevocationBitmap2022");
			expect(status.revocationBitmapIndex).toEqual("123");
		}

		// Check JWT format
		expect(result.jwt).toBeDefined();
		expect(result.jwt.split(".").length).toEqual(3); // JWT has 3 parts separated by dots

		// Store the JWT for the next test
		testVcJwt = result.jwt;
		testVc = result.verifiableCredential;
	});

	test("can fail to validate a verifiable credential with no jwt", async () => {
		await expect(identityConnector.checkVerifiableCredential("")).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.stringEmpty",
			properties: {
				property: "credential",
				value: ""
			}
		});
	});

	test("can validate a verifiable credential jwt", async () => {
		const checkResult = await identityConnector.checkVerifiableCredential(testVcJwt);

		expect(checkResult).toBeDefined();
		expect(checkResult.revoked).toBeFalsy();
		expect(checkResult.verifiableCredential).toBeDefined();

		expect(checkResult.verifiableCredential?.id).toEqual("https://example.edu/credentials/3732");
		expect(checkResult.verifiableCredential?.type).toContain("VerifiableCredential");

		const checkedCredentialSubject = checkResult.verifiableCredential?.credentialSubject;

		expect(checkedCredentialSubject).toBeDefined();
		if (checkedCredentialSubject && !Array.isArray(checkedCredentialSubject)) {
			expect(checkedCredentialSubject.name).toEqual("Jane Doe");
		}

		// Check credential status in the check result
		if (checkResult.verifiableCredential?.credentialStatus) {
			const status = Array.isArray(checkResult.verifiableCredential.credentialStatus)
				? checkResult.verifiableCredential.credentialStatus[0]
				: checkResult.verifiableCredential.credentialStatus;

			expect(status.type).toEqual("RevocationBitmap2022");
			expect(status.revocationBitmapIndex).toEqual("123");
		}
	});

	test("can validate a verifiable credential document", async () => {
		const checkResult = await identityConnector.checkVerifiableCredential(testVc);

		expect(checkResult).toBeDefined();
		expect(checkResult.revoked).toBeFalsy();
		expect(checkResult.verifiableCredential).toBeDefined();

		expect(checkResult.verifiableCredential?.id).toEqual("https://example.edu/credentials/3732");
		expect(checkResult.verifiableCredential?.type).toContain("VerifiableCredential");

		const checkedCredentialSubject = checkResult.verifiableCredential?.credentialSubject;

		expect(checkedCredentialSubject).toBeDefined();
		if (checkedCredentialSubject && !Array.isArray(checkedCredentialSubject)) {
			expect(checkedCredentialSubject.name).toEqual("Jane Doe");
		}

		// Check credential status in the check result
		if (checkResult.verifiableCredential?.credentialStatus) {
			const status = Array.isArray(checkResult.verifiableCredential.credentialStatus)
				? checkResult.verifiableCredential.credentialStatus[0]
				: checkResult.verifiableCredential.credentialStatus;

			expect(status.type).toEqual("RevocationBitmap2022");
			expect(status.revocationBitmapIndex).toEqual("123");
		}
	});

	test("can fail to validate a verifiable credential with no jwt", async () => {
		await expect(identityConnector.checkVerifiableCredential("")).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.stringEmpty",
			properties: {
				property: "credential",
				value: ""
			}
		});
	});

	test("can fail to revoke a verifiable credential with no documentId", async () => {
		await expect(
			identityConnector.revokeVerifiableCredentials(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				[123]
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "issuerDocumentId",
				value: "undefined"
			}
		});
	});

	test("can fail to revoke a verifiable credential with no credentialIndices", async () => {
		await expect(
			identityConnector.revokeVerifiableCredentials(
				TEST_USER_IDENTITY,
				"did:iota:test",
				undefined as unknown as number[]
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.array",
			properties: {
				property: "credentialIndices",
				value: "undefined"
			}
		});
	});

	test("can unrevoke a verifiable credential", async () => {
		const didId = testDocumentId;

		const verificationMethod = await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			didId,
			"assertionMethod",
			"unrevocation-test-key"
		);
		expect(verificationMethod).toBeDefined();
		expect(verificationMethod.id).toBeDefined();

		const revocationIndex = 789;
		const result = await identityConnector.createVerifiableCredential(
			TEST_USER_IDENTITY,
			verificationMethod.id,
			"https://example.edu/credentials/unrevocation-test",
			{
				id: didId,
				name: "Unrevocation Test"
			},
			{
				revocationIndex
			}
		);

		expect(result).toBeDefined();
		expect(result.verifiableCredential).toBeDefined();
		expect(result.jwt).toBeDefined();
		const vcJwt = result.jwt;

		// Check that the credential is not revoked initially
		const initialCheck = await identityConnector.checkVerifiableCredential(vcJwt);
		expect(initialCheck.revoked).toBeFalsy();

		// Perform revocation operation
		await identityConnector.revokeVerifiableCredentials(TEST_USER_IDENTITY, didId, [
			revocationIndex
		]);

		// Wait for blockchain to process the operation
		await new Promise(resolve => setTimeout(resolve, 5000));

		// Perform unrevocation operation
		await identityConnector.unrevokeVerifiableCredentials(TEST_USER_IDENTITY, didId, [
			revocationIndex
		]);

		// Wait for blockchain to process the operation
		await new Promise(resolve => setTimeout(resolve, 5000));
	});

	test("can fail to unrevoke a verifiable credential with no documentId", async () => {
		await expect(
			identityConnector.unrevokeVerifiableCredentials(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				[123]
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "issuerDocumentId",
				value: "undefined"
			}
		});
	});

	test("can fail to unrevoke a verifiable credential with no credentialIndices", async () => {
		await expect(
			identityConnector.unrevokeVerifiableCredentials(
				TEST_USER_IDENTITY,
				"did:iota:test",
				undefined as unknown as number[]
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.array",
			properties: {
				property: "credentialIndices",
				value: "undefined"
			}
		});
	});

	test("handles errors when unrevoking a verifiable credential with non-existent document", async () => {
		// Use a non-existent document ID
		const nonExistentDocumentId =
			"did:iota:e678123a:0x0000000000000000000000000000000000000000000000000000000000000000";

		// Attempt to unrevoke the credential and expect an error
		await expect(
			identityConnector.unrevokeVerifiableCredentials(
				TEST_USER_IDENTITY,
				nonExistentDocumentId,
				[123]
			)
		).rejects.toThrow();
	});

	test("can fail to create a verifiable presentation with no verification method id", async () => {
		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_USER_IDENTITY,
				"",
				"http://example.com/12345",
				"https://schema.org",
				["Person"],
				[testVcJwt],
				{ expirationDate: new Date(Date.now() + 14400000) }
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.stringEmpty",
			properties: {
				property: "verificationMethodId",
				value: ""
			}
		});
	});

	test("can fail to create a verifiable presentation with no verifiable credentials", async () => {
		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_USER_IDENTITY,
				testVerificationMethodId,
				"http://example.com/12345",
				"https://schema.org",
				["Person"],
				[],
				{ expirationDate: new Date(Date.now() + 14400000) }
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "verifiableCredentials",
				value: []
			}
		});
	});

	test("can fail to create a verifiable presentation with invalid expiry", async () => {
		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_USER_IDENTITY,
				testVerificationMethodId,
				"http://example.com/12345",
				"https://schema.org",
				["Person"],
				[testVcJwt],
				{
					expirationDate: "foo" as unknown as Date
				}
			)
		).rejects.toHaveProperty("name", "GuardError");
	});

	test("can create a verifiable presentation", async () => {
		const result = await identityConnector.createVerifiablePresentation(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			"http://example.com/12345",
			DidContexts.ContextVCv1,
			["Person"],
			[testVcJwt],
			{ expirationDate: new Date(Date.now() + 14400000) }
		);

		expect(result.verifiablePresentation["@context"]).toEqual([
			DidContexts.ContextVCv1,
			DidContexts.ContextDataIntegrity
		]);
		expect(result.verifiablePresentation.type).toEqual([DidTypes.VerifiablePresentation, "Person"]);
		expect(result.verifiablePresentation.verifiableCredential).toBeDefined();
		expect((result.verifiablePresentation.verifiableCredential as string[])[0]).toEqual(testVcJwt);
		expect(result.verifiablePresentation.holder?.startsWith("did:iota")).toBeTruthy();
		expect(result.jwt.split(".").length).toEqual(3);
	});

	test("can fail to validate a verifiable presentation with no jwt", async () => {
		await expect(identityConnector.checkVerifiablePresentation("")).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.stringEmpty",
			properties: {
				property: "presentation",
				value: ""
			}
		});
	});

	test("can validate a verifiable presentation", async () => {
		const createResult = await identityConnector.createVerifiablePresentation(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			"http://example.com/12345",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{ expirationDate: new Date(Date.now() + 14400000) }
		);

		const vpJwt = createResult.jwt;
		const jwtResult = await identityConnector.checkVerifiablePresentation(vpJwt);

		expect(jwtResult.revoked).toBeFalsy();
		expect(jwtResult.verifiablePresentation).toBeDefined();
		expect(jwtResult.verifiablePresentation?.["@context"]).toBeDefined();
		expect(jwtResult.verifiablePresentation?.type).toBeDefined();
		expect(jwtResult.verifiablePresentation?.verifiableCredential).toBeDefined();
		expect(jwtResult.verifiablePresentation?.holder).toBeDefined();
		expect(jwtResult.issuers).toBeDefined();
		expect(jwtResult.issuers?.length).toBeGreaterThan(0);

		const vpObject = createResult.verifiablePresentation;
		const objectResult = await identityConnector.checkVerifiablePresentation(vpObject);

		expect(objectResult.revoked).toBeFalsy();
		expect(objectResult.verifiablePresentation).toBeDefined();
		expect(objectResult.verifiablePresentation?.["@context"]).toBeDefined();
		expect(objectResult.verifiablePresentation?.type).toBeDefined();
	});

	it("should create a proof for a document", async () => {
		const testDocument = {
			"@context": "https://www.w3.org/ns/did/v1",
			id: "did:example:123456789abcdefghi",
			name: "Test Document",
			description: "This is a test document for proof creation and verification"
		};
		const proof = await identityConnector.createProof(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			testDocument
		);

		expect(proof).toBeDefined();
		expect(proof.type).toBe(ProofTypes.DataIntegrityProof);
		expect(proof.verificationMethod).toBe(testVerificationMethodId);
		expect(proof.proofPurpose).toBe("assertionMethod");
		expect(proof.created).toBeDefined();

		// Check for signature based on proof type
		if (proof.type === ProofTypes.JsonWebSignature2020) {
			// For JsonWebSignature2020, we expect a jws property
			expect(proof.jws).toBeDefined();
		} else if (proof.type === ProofTypes.DataIntegrityProof) {
			// For DataIntegrityProof, we expect a proofValue property
			expect(proof.proofValue).toBeDefined();
		}
	});

	test("can fail to create a proof with no verificationMethodId", async () => {
		await expect(
			identityConnector.createProof(
				TEST_USER_IDENTITY,
				undefined as unknown as string,
				ProofTypes.DataIntegrityProof,
				undefined as unknown as IJsonLdNodeObject
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "verificationMethodId",
				value: "undefined"
			}
		});
	});

	test("can fail to create a proof with no document", async () => {
		await expect(
			identityConnector.createProof(
				TEST_USER_IDENTITY,
				"foo",
				ProofTypes.DataIntegrityProof,
				undefined as unknown as IJsonLdNodeObject
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.objectUndefined",
			properties: {
				property: "unsecureDocument",
				value: "undefined"
			}
		});
	});

	test("can fail to verify a proof with no bytes", async () => {
		await expect(
			identityConnector.verifyProof(
				undefined as unknown as IJsonLdNodeObject,
				undefined as unknown as IProof
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.objectUndefined",
			properties: {
				property: "document",
				value: "undefined"
			}
		});
	});

	test("can fail to verify a proof with no proof", async () => {
		await expect(
			identityConnector.verifyProof({}, undefined as unknown as IProof)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.objectUndefined",
			properties: {
				property: "proof",
				value: "undefined"
			}
		});
	});

	it("should verify a valid proof", async () => {
		const verificationMethodType = "assertionMethod";
		const verificationMethodId = "proofTestMethod";

		const document = await identityConnector.createDocument(TEST_USER_IDENTITY);
		const testDocumentId2 = document.id;

		const method = await identityConnector.addVerificationMethod(
			TEST_USER_IDENTITY,
			testDocumentId2,
			verificationMethodType,
			verificationMethodId
		);

		expect(method).toBeDefined();
		expect(method.id).toBeDefined();

		const unsecuredDocument: IDidVerifiableCredential & IJsonLdNodeObject = {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			id: "urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33",
			type: ["VerifiableCredential", "AlumniCredential"],
			name: "Alumni Credential",
			description: "A minimum viable example of an Alumni Credential.",
			issuer: "https://vc.example/issuers/5678",
			validFrom: "2023-01-01T00:00:00Z",
			credentialSubject: {
				id: "did:example:abcdefgh",
				alumniOf: "The School of Examples"
			}
		};

		const proof = await identityConnector.createProof(
			TEST_USER_IDENTITY,
			method.id,
			ProofTypes.DataIntegrityProof,
			unsecuredDocument
		);

		const isValid = await identityConnector.verifyProof(unsecuredDocument, proof);
		expect(isValid).toBeTruthy();
	});

	it("should fail to verify a tampered document", async () => {
		const unsecuredDocument: IDidVerifiableCredential & IJsonLdNodeObject = {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			id: "urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33",
			type: ["VerifiableCredential", "AlumniCredential"],
			name: "Alumni Credential",
			description: "A minimum viable example of an Alumni Credential.",
			issuer: "https://vc.example/issuers/5678",
			validFrom: "2023-01-01T00:00:00Z",
			credentialSubject: {
				id: "did:example:abcdefgh",
				alumniOf: "The School of Examples"
			}
		};

		const proof = await identityConnector.createProof(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecuredDocument
		);

		const tamperedDocument = { ...unsecuredDocument };
		tamperedDocument.name = "Tampered Document";

		const isValid = await identityConnector.verifyProof(tamperedDocument, proof);
		expect(isValid).toBeFalsy();
	});

	it("should fail to verify a tampered proof", async () => {
		const unsecuredDocument: IDidVerifiableCredential & IJsonLdNodeObject = {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			id: "urn:uuid:58172aac-d8ba-11ed-83dd-0b3aef56cc33",
			type: ["VerifiableCredential", "AlumniCredential"],
			name: "Alumni Credential",
			description: "A minimum viable example of an Alumni Credential.",
			issuer: "https://vc.example/issuers/5678",
			validFrom: "2023-01-01T00:00:00Z",
			credentialSubject: {
				id: "did:example:abcdefgh",
				alumniOf: "The School of Examples"
			}
		};

		const proof = await identityConnector.createProof(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecuredDocument
		);

		const tamperedProof = { ...proof };
		if (tamperedProof.type === "JsonWebSignature2020") {
			tamperedProof.jws += "tampered";
		} else if (tamperedProof.type === "DataIntegrityProof") {
			tamperedProof.proofValue += "tampered";
		}

		const isValid = await identityConnector.verifyProof(unsecuredDocument, tamperedProof);
		expect(isValid).toBeFalsy();
	});

	it("should use vault signing without exposing private key", async () => {
		// This test verifies that createProof uses the secure async signing pattern:
		// - getKeyType() is called once (for key type validation only)
		// - sign() is called once (privateKey stays in vault)
		// - Private key is never retrieved or exposed
		// eslint-disable-next-line @typescript-eslint/dot-notation
		const vaultConnector = identityConnector["_vaultConnector"];
		const getKeyTypeSpy = vi.spyOn(vaultConnector, "getKeyType");
		const signSpy = vi.spyOn(vaultConnector, "sign");

		const testDocument = {
			"@context": "https://www.w3.org/ns/did/v1",
			id: "did:example:123456789abcdefghi",
			name: "Test Document for Vault Security",
			description: "Verifies secure vault delegation pattern"
		};

		const proof = await identityConnector.createProof(
			TEST_USER_IDENTITY,
			testVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			testDocument
		);

		// Verify secure vault delegation pattern
		expect(getKeyTypeSpy).toHaveBeenCalledTimes(1);
		expect(signSpy).toHaveBeenCalledTimes(1);
		expect(proof).toBeDefined();
		expect(proof.type).toBe("DataIntegrityProof");

		getKeyTypeSpy.mockRestore();
		signSpy.mockRestore();
	});

	test("can handle methods without a controller", async () => {
		const connectorWithoutController = new IotaIdentityConnector({
			config: {
				clientOptions: TEST_CLIENT_OPTIONS,
				vaultMnemonicId: TEST_MNEMONIC_NAME,
				network: TEST_NETWORK
			}
		});

		expect(testVcJwt).toBeDefined();

		const checkResult = await connectorWithoutController.checkVerifiableCredential(testVcJwt);

		expect(checkResult).toBeDefined();
		expect(checkResult.revoked).toBeFalsy();
		expect(checkResult.verifiableCredential).toBeDefined();
	});
});
