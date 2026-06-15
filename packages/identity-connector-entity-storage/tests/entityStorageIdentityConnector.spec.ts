// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, ObjectHelper, RandomHelper } from "@twin.org/core";
import { Bip39 } from "@twin.org/crypto";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import { SchemaOrgDataTypes } from "@twin.org/standards-schema-org";
import {
	DidContexts,
	DidTypes,
	type DidVerificationMethodType,
	type IDidCredentialStatus,
	type IDidService,
	type IDidVerifiableCredential,
	type IProof,
	ProofTypes,
	VerifiableCredentialHelper
} from "@twin.org/standards-w3c-did";
import {
	EntityStorageVaultConnector,
	type VaultKey,
	type VaultSecret,
	initSchema as initSchemaVault
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { Jwt } from "@twin.org/web";
import type { IdentityDocument } from "../src/entities/identityDocument.js";
import { EntityStorageIdentityConnector } from "../src/entityStorageIdentityConnector.js";
import { EntityStorageIdentityResolverConnector } from "../src/entityStorageIdentityResolverConnector.js";
import { initSchema as initSchemaIdentity } from "../src/schema.js";

let testIdentityDocument: IdentityDocument;
let testDocumentKey: VaultKey;
let testDocumentVerificationMethodKey: VaultKey;
let testDocumentVerificationMethodId: string;
let testServiceId: string;
let testVcJwt: string;
let testVc: IDidVerifiableCredential;
let testVpJwt: string;

let didDocumentEntityStorage: MemoryEntityStorageConnector<IdentityDocument>;
let vaultKeyEntityStorageConnector: MemoryEntityStorageConnector<VaultKey>;
let vaultSecretEntityStorageConnector: MemoryEntityStorageConnector<VaultSecret>;

export const TEST_IDENTITY_ID = "test-identity";
export const TEST_MNEMONIC_NAME = "test-mnemonic";
export const TEST_CONTROLLER = "test-controller";

describe("EntityStorageIdentityConnector", () => {
	beforeEach(() => {
		initSchemaVault();
		initSchemaIdentity();
		SchemaOrgDataTypes.registerRedirects();

		didDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>(),
			config: { storageKey: "identity-document" }
		});

		vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-keys" }
		});

		vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("identity-document", () => didDocumentEntityStorage);
		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		Date.now = vi.fn(() => new Date("2024-01-31T16:00:45.490Z").getTime());

		let randomCounter = 1;
		RandomHelper.generate = vi
			.fn()
			.mockImplementation(length => new Uint8Array(length).fill(randomCounter++));

		Bip39.randomMnemonic = vi
			.fn()
			.mockImplementation(
				() =>
					"elder blur tip exact organ pipe other same minute grace conduct father brother prosper tide icon pony suggest joy provide dignity domain nominee liquid"
			);
	});

	afterEach(async () => {
		await didDocumentEntityStorage.teardown();
		await vaultKeyEntityStorageConnector.teardown();
		await vaultSecretEntityStorageConnector.teardown();
	});

	test("can create a document", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const testDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const keyStore = await vaultKeyEntityStorageConnector.getStore();
		testDocumentKey = keyStore?.[0] ?? ({} as VaultKey);

		expect(testDocument.id.slice(0, 21)).toEqual("did:entity-storage:0x");
		expect(testDocument.service).toBeDefined();
		expect((testDocument.service?.[0] as IDidService)?.id).toEqual(`${testDocument.id}#revocation`);

		const revocationService = testDocument.service?.[0];
		expect(revocationService).toBeDefined();
		expect(revocationService?.id).toEqual(`${testDocument.id}#revocation`);
		expect(revocationService?.type).toEqual("BitstringStatusList");
		expect(revocationService?.serviceEndpoint).toEqual(
			"data:application/octet-stream;base64,H4sIAAAAAAAAA-3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAIC3AYbSVKsAQAAA"
		);

		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to resolve a document with no id", async () => {
		const identityResolverConnector = new EntityStorageIdentityResolverConnector();
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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityResolverConnector = new EntityStorageIdentityResolverConnector();

		const doc = await identityResolverConnector.resolveDocument(testIdentityDocument.id);
		expect(doc.id.slice(0, 21)).toEqual("did:entity-storage:0x");
		expect(doc.service).toBeDefined();
		expect((doc.service?.[0] as IDidService)?.id).toEqual(`${doc.id}#revocation`);
	});

	test("can fail to add a verification method with no document id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addVerificationMethod(
				TEST_IDENTITY_ID,
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

	test("can fail to add a verification method with incorrect verification method type", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addVerificationMethod(
				TEST_IDENTITY_ID,
				"aaa",
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

	test("can add a verification method as assertion method", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();
		const verificationMethod = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"assertionMethod",
			"my-verification-id"
		);

		expect(verificationMethod).toBeDefined();
		expect(verificationMethod?.id).toEqual(`${testIdentityDocument.id}#my-verification-id`);

		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);

		const testDocument = testIdentityDocument.document;
		expect(testDocument?.assertionMethod).toBeDefined();

		testDocumentVerificationMethodId = verificationMethod?.id ?? "";

		const keyStore = await vaultKeyEntityStorageConnector.getStore();
		testDocumentVerificationMethodKey = keyStore?.[1] ?? ({} as VaultKey);
	});

	test("can fail to remove a verification method with no verification method id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.removeVerificationMethod(TEST_IDENTITY_ID, undefined as unknown as string)
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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.removeVerificationMethod(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId
		);

		const testDocument = testIdentityDocument.document;
		expect(testDocument?.verificationMethod).toBeUndefined();

		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to add a service with no document id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addService(
				TEST_IDENTITY_ID,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addService(
				TEST_IDENTITY_ID,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addService(
				TEST_IDENTITY_ID,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addService(
				TEST_IDENTITY_ID,
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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		const service = await identityConnector.addService(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"linked-domain",
			"LinkedDomains",
			"https://bar.example.com/"
		);

		expect(service).toBeDefined();
		expect(service?.type).toEqual("LinkedDomains");
		expect(service?.serviceEndpoint).toEqual("https://bar.example.com/");

		testServiceId = service?.id ?? "";
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to remove a service with no service id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.removeService(TEST_IDENTITY_ID, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "serviceId",
				value: "undefined"
			}
		});
	});

	test("can remove a service", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.removeService(TEST_IDENTITY_ID, testServiceId);

		const testDocument = (await didDocumentEntityStorage.getStore())[0].document;

		const service = (testDocument.service as IDidService[])?.find(
			s => s.id === `${testDocument.id}#linked-domain`
		);
		expect(service).toBeUndefined();
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to add alsoKnownAs with no alias", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addAlsoKnownAs(
				TEST_IDENTITY_ID,
				testIdentityDocument.id,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.addAlsoKnownAs(TEST_IDENTITY_ID, testIdentityDocument.id, "not a uri")
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "entityStorageIdentityConnector.invalidAlias",
			properties: { alias: "not a uri" }
		});
	});

	test("can add an alias to alsoKnownAs", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.addAlsoKnownAs(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"did:example:linked"
		);

		const testDocument = (await didDocumentEntityStorage.getStore())[0].document;
		expect(testDocument.alsoKnownAs).toContain("did:example:linked");
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("addAlsoKnownAs is idempotent for duplicates", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.addAlsoKnownAs(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"did:example:linked"
		);

		const testDocument = (await didDocumentEntityStorage.getStore())[0].document;
		const aliases = Is.array(testDocument.alsoKnownAs) ? testDocument.alsoKnownAs : [];
		const occurrences = aliases.filter(a => a === "did:example:linked").length;
		expect(occurrences).toBe(1);
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to remove alsoKnownAs with no alias", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.removeAlsoKnownAs(
				TEST_IDENTITY_ID,
				testIdentityDocument.id,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.removeAlsoKnownAs(TEST_IDENTITY_ID, testIdentityDocument.id, "not a uri")
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "entityStorageIdentityConnector.invalidAlias",
			properties: { alias: "not a uri" }
		});
	});

	test("can remove an alias from alsoKnownAs", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.removeAlsoKnownAs(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"did:example:linked"
		);

		const testDocument = (await didDocumentEntityStorage.getStore())[0].document;
		expect(testDocument.alsoKnownAs).toBeUndefined();
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("removeAlsoKnownAs is a no-op when alias is not present", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.removeAlsoKnownAs(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			"did:example:missing"
		);

		const testDocument = (await didDocumentEntityStorage.getStore())[0].document;
		expect(testDocument.alsoKnownAs).toBeUndefined();
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to create a verifiable credential with no verification method id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.createVerifiableCredential(
				TEST_IDENTITY_ID,
				undefined as unknown as string,
				undefined,
				undefined as unknown as IJsonLdNodeObject,
				undefined
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

	test("can fail to create a verifiable credential with no credential", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.createVerifiableCredential(
				TEST_IDENTITY_ID,
				"foo",
				"UniversityDegreeCredential",
				undefined as unknown as IJsonLdNodeObject,
				undefined
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.objectUndefined",
			properties: {
				property: "subject",
				value: "undefined"
			}
		});
	});

	test("can create a verifiable credential", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const issuerDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const vm = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			issuerDocument.id,
			"assertionMethod",
			"my-verification-id"
		);

		const holderDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const result = await identityConnector.createVerifiableCredential(
			TEST_IDENTITY_ID,
			vm.id,
			"https://example.com/credentials/3732",
			{
				"@context": "https://schema.org",
				"@type": "Person",
				id: holderDocument.id,
				name: "Jane Doe"
			},
			{ revocationIndex: 5 }
		);

		expect(result.verifiableCredential["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org",
			"https://w3id.org/security/data-integrity/v2"
		]);
		expect(result.verifiableCredential.id).toEqual("https://example.com/credentials/3732");
		expect(result.verifiableCredential.type).toContain(DidTypes.VerifiableCredential);

		const subject = Is.array(result.verifiableCredential.credentialSubject)
			? result.verifiableCredential.credentialSubject[0]
			: result.verifiableCredential.credentialSubject;
		expect(subject?.["@type"]).toEqual("Person");
		expect((subject?.id as string).startsWith("did:entity-storage")).toBeTruthy();
		expect(subject?.name).toEqual("Jane Doe");
		expect(
			(result.verifiableCredential.issuer as string)?.startsWith("did:entity-storage")
		).toBeTruthy();
		expect(result.verifiableCredential.issuanceDate).toBeDefined();
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.id?.startsWith(
				"did:entity-storage"
			)
		).toBeTruthy();
		expect((result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.type).toEqual(
			"BitstringStatusList"
		);
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.revocationBitmapIndex
		).toEqual("5");
		expect(result.jwt.split(".").length).toEqual(3);
		expect(result.verifiableCredential.proof).toBeDefined();

		testVcJwt = result.jwt;
		testVc = result.verifiableCredential;
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can create a verifiable credential with custom jwt header fields", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const issuerDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);
		const vm = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			issuerDocument.id,
			"assertionMethod",
			"my-verification-id"
		);
		const holderDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const result = await identityConnector.createVerifiableCredential(
			TEST_IDENTITY_ID,
			vm.id,
			"https://example.com/credentials/3733",
			{
				"@context": "https://schema.org",
				"@type": "Person",
				id: holderDocument.id,
				name: "Jane Doe"
			},
			{ jwtHeaderFields: { "x-custom": "header-value" } }
		);

		expect(result.jwt.split(".").length).toEqual(3);
		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.header).toMatchObject({ "x-custom": "header-value", typ: "JWT", alg: "EdDSA" });
		expect(decoded.header?.kid).toBeDefined();

		const check = await identityConnector.checkVerifiableCredential(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiableCredential).toBeDefined();
	});

	test("can create a verifiable credential with custom jwt payload fields", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const issuerDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);
		const vm = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			issuerDocument.id,
			"assertionMethod",
			"my-verification-id"
		);
		const holderDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const result = await identityConnector.createVerifiableCredential(
			TEST_IDENTITY_ID,
			vm.id,
			"https://example.com/credentials/3734",
			{
				"@context": "https://schema.org",
				"@type": "Person",
				id: holderDocument.id,
				name: "Jane Doe"
			},
			{ jwtPayloadFields: { "x-custom": "payload-value" } }
		);

		expect(result.jwt.split(".").length).toEqual(3);
		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.payload).toMatchObject({ "x-custom": "payload-value" });
		expect(decoded.payload?.iss).toBeDefined();
		expect(decoded.payload?.nbf).toBeDefined();
		expect(decoded.payload?.vc).toBeDefined();

		const check = await identityConnector.checkVerifiableCredential(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiableCredential).toBeDefined();
	});

	test("standard jwt header fields take precedence over custom fields in verifiable credential", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const issuerDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);
		const vm = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			issuerDocument.id,
			"assertionMethod",
			"my-verification-id"
		);
		const holderDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const result = await identityConnector.createVerifiableCredential(
			TEST_IDENTITY_ID,
			vm.id,
			"https://example.com/credentials/3735",
			{
				"@context": "https://schema.org",
				"@type": "Person",
				id: holderDocument.id,
				name: "Jane Doe"
			},
			{ jwtHeaderFields: { alg: "RS256", typ: "at+JWT", kid: "evil-kid" } }
		);

		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.header?.alg).toEqual("EdDSA");
		expect(decoded.header?.typ).toEqual("JWT");
		expect(decoded.header?.kid).toEqual(vm.id);

		const check = await identityConnector.checkVerifiableCredential(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiableCredential).toBeDefined();
	});

	test("standard jwt payload fields take precedence over custom fields in verifiable credential", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		const issuerDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);
		const vm = await identityConnector.addVerificationMethod(
			TEST_IDENTITY_ID,
			issuerDocument.id,
			"assertionMethod",
			"my-verification-id"
		);
		const holderDocument = await identityConnector.createDocument(TEST_IDENTITY_ID);

		const result = await identityConnector.createVerifiableCredential(
			TEST_IDENTITY_ID,
			vm.id,
			"https://example.com/credentials/3736",
			{
				"@context": "https://schema.org",
				"@type": "Person",
				id: holderDocument.id,
				name: "Jane Doe"
			},
			{ jwtPayloadFields: { iss: "evil-issuer", jti: "evil-id" } }
		);

		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.payload?.iss).toEqual(issuerDocument.id);
		expect(decoded.payload?.jti).toEqual("https://example.com/credentials/3736");

		const check = await identityConnector.checkVerifiableCredential(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiableCredential).toBeDefined();
	});

	test("can fail to validate a verifiable credential with no jwt", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.checkVerifiableCredential(testVcJwt);

		expect(result.revoked).toBeFalsy();
		expect(result.verifiableCredential?.["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org"
		]);
		expect(result.verifiableCredential?.id).toEqual("https://example.com/credentials/3732");
		expect(result.verifiableCredential?.type).toContain(DidTypes.VerifiableCredential);
		const subject = Is.array(result.verifiableCredential?.credentialSubject)
			? result.verifiableCredential?.credentialSubject[0]
			: result.verifiableCredential?.credentialSubject;
		expect(subject?.["@type"]).toEqual("Person");
		expect((subject?.id as string).startsWith("did:entity-storage")).toBeTruthy();
		expect(subject?.name).toEqual("Jane Doe");
		expect(
			(result.verifiableCredential?.issuer as string)?.startsWith("did:entity-storage")
		).toBeTruthy();
		if (result.verifiableCredential) {
			const issuanceDate = VerifiableCredentialHelper.getValidFrom(result.verifiableCredential);
			expect(issuanceDate).toBeDefined();
		}
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.id?.startsWith(
				"did:entity-storage"
			)
		).toBeTruthy();
		expect((result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.type).toEqual(
			"BitstringStatusList"
		);
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.revocationBitmapIndex
		).toEqual("5");
	});

	test("can validate a verifiable credential document", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.checkVerifiableCredential(testVc);

		expect(result.revoked).toBeFalsy();
		expect(result.verifiableCredential?.["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org",
			"https://w3id.org/security/data-integrity/v2"
		]);
		expect(result.verifiableCredential?.id).toEqual("https://example.com/credentials/3732");
		expect(result.verifiableCredential?.type).toContain(DidTypes.VerifiableCredential);
		const subject = Is.array(result.verifiableCredential?.credentialSubject)
			? result.verifiableCredential?.credentialSubject[0]
			: result.verifiableCredential?.credentialSubject;
		expect(subject?.["@type"]).toEqual("Person");
		expect((subject?.id as string).startsWith("did:entity-storage")).toBeTruthy();
		expect(subject?.name).toEqual("Jane Doe");
		expect(
			(result.verifiableCredential?.issuer as string)?.startsWith("did:entity-storage")
		).toBeTruthy();
		if (result.verifiableCredential) {
			const issuanceDate = VerifiableCredentialHelper.getValidFrom(result.verifiableCredential);
			expect(issuanceDate).toBeDefined();
		}
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.id?.startsWith(
				"did:entity-storage"
			)
		).toBeTruthy();
		expect((result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.type).toEqual(
			"BitstringStatusList"
		);
		expect(
			(result.verifiableCredential?.credentialStatus as IDidCredentialStatus)?.revocationBitmapIndex
		).toEqual("5");
	});

	test("can fail to revoke a verifiable credential with no documentId", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.revokeVerifiableCredentials(
				TEST_IDENTITY_ID,
				undefined as unknown as string,
				undefined as unknown as number[]
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
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.revokeVerifiableCredentials(
				TEST_IDENTITY_ID,
				testIdentityDocument.id,
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

	test("can revoke a verifiable credential", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);

		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.revokeVerifiableCredentials(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			[5]
		);

		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
		const testDocument = testIdentityDocument.document;

		expect(testDocument.service).toBeDefined();
		const revokeService = testDocument.service?.find(
			s => s.id === `${testIdentityDocument.id}#revocation`
		);
		expect(revokeService).toBeDefined();
		expect(revokeService?.serviceEndpoint).toEqual(
			"data:application/octet-stream;base64,H4sIAAAAAAAAA-3BIQEAAAACIKf4f6UzLEADAAAAAAAAAAAAAAAAAAAAvA1-s-l1AEAAAA"
		);

		const result = await identityConnector.checkVerifiableCredential(testVcJwt);
		expect(result.revoked).toBeTruthy();
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to unrevoke a verifiable credential with no documentId", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.unrevokeVerifiableCredentials(
				TEST_IDENTITY_ID,
				undefined as unknown as string,
				undefined as unknown as number[]
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
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.unrevokeVerifiableCredentials(
				TEST_IDENTITY_ID,
				testIdentityDocument.id,
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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);

		const identityConnector = new EntityStorageIdentityConnector();

		await identityConnector.unrevokeVerifiableCredentials(
			TEST_IDENTITY_ID,
			testIdentityDocument.id,
			[5]
		);

		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
		const testDocument = testIdentityDocument.document;

		const revokeService = testDocument.service?.find(s => s.id === `${testDocument.id}#revocation`);
		expect(revokeService).toBeDefined();
		expect(revokeService?.serviceEndpoint).toEqual(
			"data:application/octet-stream;base64,H4sIAAAAAAAAA-3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAIC3AYbSVKsAQAAA"
		);

		const result = await identityConnector.checkVerifiableCredential(testVcJwt);
		expect(result.revoked).toBeFalsy();
		testIdentityDocument = ObjectHelper.clone((await didDocumentEntityStorage.getStore())?.[0]);
	});

	test("can fail to create a verifiable presentation with no presentation method id", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_IDENTITY_ID,
				undefined as unknown as string,
				undefined,
				undefined,
				undefined,
				undefined as unknown as string[],
				undefined
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

	test("can fail to create a verifiable presentation with no verifiable credentials", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_IDENTITY_ID,
				"verificationMethodId",
				undefined,
				["vp"],
				undefined,
				undefined as unknown as string[],
				undefined
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.array",
			properties: {
				property: "verifiableCredentials",
				value: "undefined"
			}
		});
	});

	test("can fail to create a verifiable presentation with invalid expiry", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

		await expect(
			identityConnector.createVerifiablePresentation(
				TEST_IDENTITY_ID,
				"foo",
				"presentationId",
				{ "@context": "" },
				["types"],
				["verifiableCredentials"],
				{
					expirationDate: "foo" as unknown as Date
				}
			)
		).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.date",
			properties: {
				property: "options.expirationDate",
				value: "foo"
			}
		});
	});

	test("can create a verifiable presentation", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{ expirationDate: new Date(Date.now() + 14400000) }
		);

		expect(result.verifiablePresentation["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org"
		]);
		expect(result.verifiablePresentation.type).toEqual([DidTypes.VerifiablePresentation, "Person"]);
		expect(result.verifiablePresentation.verifiableCredential).toBeDefined();
		expect(
			(result.verifiablePresentation.verifiableCredential as IDidVerifiableCredential[])[0]
		).toEqual(testVcJwt);
		expect(result.verifiablePresentation.holder?.startsWith("did:entity-storage")).toBeTruthy();
		expect(result.jwt.split(".").length).toEqual(3);
		testVpJwt = result.jwt;
	});

	test("can create a verifiable presentation with custom jwt header fields", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{
				expirationDate: new Date(Date.now() + 14400000),
				jwtHeaderFields: { "x-custom": "header-value" }
			}
		);

		expect(result.jwt.split(".").length).toEqual(3);
		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.header).toMatchObject({ "x-custom": "header-value", typ: "JWT", alg: "EdDSA" });
		expect(decoded.header?.kid).toBeDefined();

		const check = await identityConnector.checkVerifiablePresentation(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiablePresentation).toBeDefined();
	});

	test("can create a verifiable presentation with custom jwt payload fields", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{
				expirationDate: new Date(Date.now() + 14400000),
				jwtPayloadFields: { "x-custom": "payload-value" }
			}
		);

		expect(result.jwt.split(".").length).toEqual(3);
		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.payload).toMatchObject({ "x-custom": "payload-value" });
		expect(decoded.payload?.iss).toBeDefined();
		expect(decoded.payload?.nbf).toBeDefined();
		expect(decoded.payload?.vp).toBeDefined();

		const check = await identityConnector.checkVerifiablePresentation(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiablePresentation).toBeDefined();
	});

	test("standard jwt header fields take precedence over custom fields in verifiable presentation", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{
				expirationDate: new Date(Date.now() + 14400000),
				jwtHeaderFields: { alg: "RS256", typ: "at+JWT", kid: "evil-kid" }
			}
		);

		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.header?.alg).toEqual("EdDSA");
		expect(decoded.header?.typ).toEqual("JWT");
		expect(decoded.header?.kid).toEqual(testDocumentVerificationMethodId);

		const check = await identityConnector.checkVerifiablePresentation(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiablePresentation).toBeDefined();
	});

	test("standard jwt payload fields take precedence over custom fields in verifiable presentation", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		const result = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{
				expirationDate: new Date(Date.now() + 14400000),
				jwtPayloadFields: { iss: "evil-issuer" }
			}
		);

		const decoded = await Jwt.decode(result.jwt);
		expect(decoded.payload?.iss).toEqual(testIdentityDocument.id);

		const check = await identityConnector.checkVerifiablePresentation(result.jwt);
		expect(check.revoked).toBeFalsy();
		expect(check.verifiablePresentation).toBeDefined();
	});

	test("can fail to validate a verifiable presentation with no jwt", async () => {
		const identityConnector = new EntityStorageIdentityConnector();

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
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);

		const identityConnector = new EntityStorageIdentityConnector();

		const jwtResult = await identityConnector.checkVerifiablePresentation(testVpJwt);

		expect(jwtResult.revoked).toBeFalsy();
		expect(jwtResult.verifiablePresentation?.["@context"]).toEqual([
			DidContexts.ContextVCv1,
			"https://schema.org"
		]);
		expect(jwtResult.verifiablePresentation?.type).toEqual([
			DidTypes.VerifiablePresentation,
			"Person"
		]);
		expect(jwtResult.verifiablePresentation?.verifiableCredential).toBeDefined();
		expect(jwtResult.verifiablePresentation?.holder?.startsWith("did:entity-storage")).toBeTruthy();
		expect(jwtResult.issuers).toBeDefined();
		expect(jwtResult.issuers?.length).toEqual(1);
		expect(jwtResult.issuers?.[0].id).toEqual(testIdentityDocument.id);

		const createResult = await identityConnector.createVerifiablePresentation(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			"presentationId",
			"https://schema.org",
			["Person"],
			[testVcJwt],
			{ expirationDate: new Date(Date.now() + 14400000) }
		);

		const objectResult = await identityConnector.checkVerifiablePresentation(
			createResult.verifiablePresentation
		);

		expect(objectResult.revoked).toBeFalsy();
		expect(objectResult.verifiablePresentation?.["@context"]).toBeDefined();
		expect(objectResult.verifiablePresentation?.type).toContain(DidTypes.VerifiablePresentation);
	});

	test("can fail to create a proof with no verificationMethodId", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.createProof(
				TEST_IDENTITY_ID,
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
		const identityConnector = new EntityStorageIdentityConnector();
		await expect(
			identityConnector.createProof(
				TEST_IDENTITY_ID,
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

	test("can create a proof", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

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
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecuredDocument
		);

		expect(proof).toEqual({
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1",
				"https://w3id.org/security/data-integrity/v2"
			],
			type: "DataIntegrityProof",
			cryptosuite: "eddsa-jcs-2022",
			created: "2024-01-31T16:00:45.490Z",
			verificationMethod:
				"did:entity-storage:0x0101010101010101010101010101010101010101010101010101010101010101#my-verification-id",
			proofPurpose: "assertionMethod",
			proofValue:
				"z3jMZJzQWavDziHmQDSwcb7MJw6fP3Gnhtg5coU3KwzxGW3dZh9NCYm3QuRUktronz2fHtQHdB4RZkJfE7vU7hjFv"
		});
	});

	test("should use vault signing without exposing private key", async () => {
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);
		await didDocumentEntityStorage.set(testIdentityDocument);

		const identityConnector = new EntityStorageIdentityConnector();

		// eslint-disable-next-line @typescript-eslint/dot-notation
		const vaultConnector = identityConnector["_vaultConnector"];
		const getKeyTypeSpy = vi.spyOn(vaultConnector, "getKeyType");
		const signSpy = vi.spyOn(vaultConnector, "sign");

		const unsecuredDocument = {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			type: ["VerifiableCredential", "AlumniCredential"],
			issuer: testIdentityDocument.id,
			issuanceDate: "2023-01-01T00:00:00Z",
			validFrom: "2023-01-01T00:00:00Z",
			credentialSubject: {
				id: "did:example:test",
				description: "Verifies secure vault delegation pattern"
			}
		};

		const proof = await identityConnector.createProof(
			TEST_IDENTITY_ID,
			testDocumentVerificationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecuredDocument
		);

		expect(getKeyTypeSpy).toHaveBeenCalledTimes(1);
		expect(signSpy).toHaveBeenCalledTimes(1);
		expect(proof).toBeDefined();
		expect(proof.type).toBe("DataIntegrityProof");

		getKeyTypeSpy.mockRestore();
		signSpy.mockRestore();
	});

	test("can fail to verify a proof with no document", async () => {
		const identityConnector = new EntityStorageIdentityConnector();
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
		const identityConnector = new EntityStorageIdentityConnector();
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

	test("can verify a proof", async () => {
		await didDocumentEntityStorage.set(testIdentityDocument);
		await vaultKeyEntityStorageConnector.set(testDocumentKey);
		await vaultKeyEntityStorageConnector.set(testDocumentVerificationMethodKey);

		const identityConnector = new EntityStorageIdentityConnector();

		const unsecuredDocument: IDidVerifiableCredential & IJsonLdNodeObject = {
			"@context": [
				"https://www.w3.org/ns/credentials/v2",
				"https://www.w3.org/ns/credentials/examples/v2"
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

		const signedProof: IProof = {
			"@context": [
				"https://w3id.org/security/data-integrity/v2",
				"https://w3id.org/security/data-integrity/v2"
			],
			type: "DataIntegrityProof",
			cryptosuite: "eddsa-jcs-2022",
			created: "2024-01-31T16:00:45.490Z",
			verificationMethod:
				"did:entity-storage:0x0101010101010101010101010101010101010101010101010101010101010101#my-verification-id",
			proofPurpose: "assertionMethod",
			proofValue:
				"z4uVZbk4nnoB1HByK8SqAWFhgnP6UBNj5Td4oqYcwjHG9Znx27kVJQQFiuq2mgxr2kKPyGsLW9rDQ3mhHRnfba1pS"
		};

		const verified = await identityConnector.verifyProof(unsecuredDocument, signedProof);
		expect(verified).toBeTruthy();
	});
});
