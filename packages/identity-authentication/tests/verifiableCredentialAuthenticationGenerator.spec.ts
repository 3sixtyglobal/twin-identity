// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdKeys, ContextIdStore, type IContextIds } from "@twin.org/context";
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
import { HeaderHelper, HeaderTypes, type IHttpHeaders } from "@twin.org/web";
import { IdentityAuthenticationContexts } from "../src/models/identityAuthenticationContexts.js";
import { IdentityAuthenticationTypes } from "../src/models/identityAuthenticationTypes.js";
import type { IIdentityAuthenticationActionRequest } from "../src/models/IIdentityAuthenticationActionRequest.js";
import { VerifiableCredentialAuthenticationGenerator } from "../src/verifiableCredentialAuthenticationGenerator.js";
import { VerifiableCredentialAuthenticationProcessor } from "../src/verifiableCredentialAuthenticationProcessor.js";

let identityConnector: IIdentityConnector;
let testOrganizationIdentity: string;
let token: string;

describe("VerifiableCredentialAuthenticationGenerator", () => {
	beforeAll(async () => {
		initSchemaIdentity();
		initSchemaVault();

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
		testOrganizationIdentity = doc.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			doc.id,
			"verificationMethod",
			"key-1"
		);
	});

	it("should create a token for the request", async () => {
		const authenticationRequest: IIdentityAuthenticationActionRequest = {
			"@context": IdentityAuthenticationContexts.Namespace,
			type: IdentityAuthenticationTypes.ActionRequest,
			requester: testOrganizationIdentity,
			action: "urn:action:action-1",
			data: {
				foo: "bar"
			}
		};

		const generator = new VerifiableCredentialAuthenticationGenerator({
			config: {
				verificationMethodId: "key-1"
			}
		});

		const headers: IHttpHeaders = {};

		await ContextIdStore.run({ organization: testOrganizationIdentity }, async () => {
			await generator.addAuthentication(headers, {
				contextId: ContextIdKeys.Organization,
				subject: authenticationRequest as unknown as IJsonLdNodeObject
			});
		});

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

		const processorState: { [id: string]: unknown } = {
			verifiableCredential: { contextId: ContextIdKeys.User }
		};
		const contextIds: IContextIds = {};

		await ContextIdStore.run({ organization: testOrganizationIdentity }, async () => {
			await processor.pre(
				{ headers },
				{},
				{
					operationId: "op-1",
					path: "/test",
					processorFeatures: ["verifiableCredential"]
				},
				contextIds,
				processorState
			);
		});

		expect(contextIds[ContextIdKeys.User]).toEqual(testOrganizationIdentity);

		expect(processorState.verifiableCredentialJsonLd).toEqual({
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://schema.twindev.org/identity-authentication"
			],
			credentialSubject: {
				action: "urn:action:action-1",
				requester: testOrganizationIdentity,
				data: {
					foo: "bar"
				}
			},
			issuanceDate: expect.any(String),
			issuer: testOrganizationIdentity,
			type: ["VerifiableCredential", "ActionRequest"]
		});
		expect(processorState.verifiableCredentialSubject).toEqual({
			action: "urn:action:action-1",
			requester: testOrganizationIdentity,
			data: {
				foo: "bar"
			}
		});
	});
});
