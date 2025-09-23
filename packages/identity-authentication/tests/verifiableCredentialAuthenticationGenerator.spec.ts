// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	initSchema as initSchemaIdentity,
	type IdentityDocument
} from "@twin.org/identity-connector-entity-storage";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { type IHttpHeaders, HeaderHelper, HeaderTypes } from "@twin.org/web";
import { IdentityAuthenticationContexts } from "../src/models/identityAuthenticationContexts";
import { IdentityAuthenticationTypes } from "../src/models/identityAuthenticationTypes";
import type { IIdentityAuthenticationActionRequest } from "../src/models/IIdentityAuthenticationActionRequest";
import { VerifiableCredentialAuthenticationGenerator } from "../src/verifiableCredentialAuthenticationGenerator";
import { VerifiableCredentialAuthenticationProcessor } from "../src/verifiableCredentialAuthenticationProcessor";

const MOCK_TIME = 1724327816272;
let identityConnector: IIdentityConnector;
let testIdentity: string;
let token: string;

describe("VerifiableCredentialAuthenticationGenerator", () => {
	beforeAll(async () => {
		initSchemaIdentity();
		initSchemaVault();

		Date.now = vi.fn().mockImplementation(() => MOCK_TIME);

		EntityStorageConnectorFactory.register(
			"vault-key",
			() =>
				new MemoryEntityStorageConnector<VaultKey>({
					entitySchema: nameof<VaultKey>()
				})
		);
		const secretEntityStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>()
		});
		EntityStorageConnectorFactory.register("vault-secret", () => secretEntityStorage);

		const vaultConnector = new EntityStorageVaultConnector();
		VaultConnectorFactory.register("vault", () => vaultConnector);

		const identityDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>()
		});
		EntityStorageConnectorFactory.register(
			"identity-document",
			() => identityDocumentEntityStorage
		);

		identityConnector = new EntityStorageIdentityConnector();
		IdentityConnectorFactory.register("identity", () => identityConnector);

		const doc = await identityConnector.createDocument("test-controller");
		testIdentity = doc.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			doc.id,
			"verificationMethod",
			"key-1"
		);
	});

	it("should create a token for the request", async () => {
		const authenticationRequest: IIdentityAuthenticationActionRequest = {
			"@context": IdentityAuthenticationContexts.ContextRoot,
			type: IdentityAuthenticationTypes.ActionRequest,
			nodeIdentity: testIdentity,
			action: "urn:action:action-1"
		};

		const generator = new VerifiableCredentialAuthenticationGenerator({
			config: {
				verificationMethodId: "key-1"
			}
		});

		await generator.start(testIdentity, undefined);

		const headers: IHttpHeaders = {};

		await generator.addAuthentication(
			headers,
			authenticationRequest as unknown as IJsonLdNodeObject
		);

		const header = headers[HeaderTypes.Authorization] as string;
		expect(header.startsWith("Bearer ")).toBeTruthy();

		token = HeaderHelper.extractBearer(header);
		expect(token.split(".").length).toEqual(3);
	});

	it("should decode a token successfully", async () => {
		const processor = new VerifiableCredentialAuthenticationProcessor();

		const headers: IHttpHeaders = {
			[HeaderTypes.Authorization]: HeaderHelper.createBearer(token)
		};

		const processorState: { [id: string]: unknown } = {};
		await processor.pre(
			{ headers },
			{},
			{
				operationId: "op-1",
				path: "/test",
				processorFeatures: ["verifiableCredential"]
			},
			{},
			processorState
		);

		expect(processorState.verifiableCredential).toEqual({
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://schema.twindev.org/identity-authentication"
			],
			credentialSubject: {
				action: "urn:action:action-1",
				nodeIdentity: testIdentity
			},
			issuanceDate: "2024-08-22T11:56:56.000Z",
			issuer: testIdentity,
			type: ["VerifiableCredential", "ActionRequest"]
		});
		expect(processorState.verifiableCredentialIssuer).toEqual(testIdentity);
		expect(processorState.verifiableCredentialSubject).toEqual({
			action: "urn:action:action-1",
			nodeIdentity: testIdentity
		});
	});
});
