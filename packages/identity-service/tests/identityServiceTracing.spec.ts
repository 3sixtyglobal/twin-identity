// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, RandomHelper } from "@twin.org/core";
import { Bip39 } from "@twin.org/crypto";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	EntityStorageIdentityResolverConnector,
	type IdentityDocument,
	initSchema as initSchemaIdentity
} from "@twin.org/identity-connector-entity-storage";
import {
	IdentityConnectorFactory,
	IdentityResolverConnectorFactory,
	IdentitySpanAttributes,
	IdentitySpanNames
} from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import { DidVerificationMethodType } from "@twin.org/standards-w3c-did";
import {
	SpanHelper,
	SpanStatus,
	type ISpan,
	type ISpanOptions,
	type ITracingComponent
} from "@twin.org/tracing-models";
import {
	EntityStorageVaultConnector,
	type VaultKey,
	type VaultSecret,
	initSchema as initSchemaVault
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { IdentityService } from "../src/identityService.js";

const TEST_CONTROLLER = "test-controller";

function makeMockTracing(): { component: ITracingComponent; ended: ISpan[] } {
	const ended: ISpan[] = [];
	const component: ITracingComponent = {
		className: () => "MockTracing",
		startSpan: async (name: string, options?: ISpanOptions) => SpanHelper.startSpan(name, options),
		endSpan: async (span: ISpan, status?: SpanStatus) => {
			SpanHelper.endSpan(span, status);
			ended.push(span);
		},
		query: async () => ({ entities: [] }),
		getTrace: async () => []
	};
	return { component, ended };
}

describe("IdentityService - tracing", () => {
	let identityDocStorage: MemoryEntityStorageConnector<IdentityDocument>;
	let vaultKeyStorage: MemoryEntityStorageConnector<VaultKey>;
	let vaultSecretStorage: MemoryEntityStorageConnector<VaultSecret>;

	beforeAll(async () => {
		initSchemaVault();
		initSchemaIdentity();
	});

	beforeEach(() => {
		identityDocStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>(),
			config: { storageKey: "identity-document" }
		});
		vaultKeyStorage = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});
		vaultSecretStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("identity-document", () => identityDocStorage);
		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyStorage);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretStorage);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		IdentityConnectorFactory.register("entity-storage", () => new EntityStorageIdentityConnector());
		IdentityResolverConnectorFactory.register(
			"entity-storage",
			() => new EntityStorageIdentityResolverConnector()
		);

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

		vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
	});

	afterEach(async () => {
		await identityDocStorage.teardown();
		await vaultKeyStorage.teardown();
		await vaultSecretStorage.teardown();
	});

	describe("instrumented path", () => {
		test("identityCreate() records a span", async () => {
			const { component, ended } = makeMockTracing();
			ComponentFactory.register("test-tracing", () => component);

			await new IdentityService({ tracingComponentType: "test-tracing" }).identityCreate(
				undefined,
				TEST_CONTROLLER
			);

			const created = ended.filter(s => s.name === IdentitySpanNames.Create);
			expect(created).toHaveLength(1);
			expect(created[0].status).toEqual(SpanStatus.Ok);
		});

		test("verificationMethodCreate() records a span carrying the identity", async () => {
			const { component, ended } = makeMockTracing();
			ComponentFactory.register("test-tracing", () => component);

			const service = new IdentityService({ tracingComponentType: "test-tracing" });
			const document = await service.identityCreate(undefined, TEST_CONTROLLER);

			await service.verificationMethodCreate(
				document.id,
				DidVerificationMethodType.VerificationMethod,
				"my-method",
				TEST_CONTROLLER
			);

			const spans = ended.filter(s => s.name === IdentitySpanNames.VerificationMethodCreate);
			expect(spans).toHaveLength(1);
			expect(spans[0].attributes?.[IdentitySpanAttributes.Id]).toEqual(document.id);
		});

		test("serviceCreate() records a span carrying the identity", async () => {
			const { component, ended } = makeMockTracing();
			ComponentFactory.register("test-tracing", () => component);

			const service = new IdentityService({ tracingComponentType: "test-tracing" });
			const document = await service.identityCreate(undefined, TEST_CONTROLLER);

			await service.serviceCreate(
				document.id,
				`${document.id}#my-service`,
				"LinkedDomains",
				"https://example.com",
				TEST_CONTROLLER
			);

			const spans = ended.filter(s => s.name === IdentitySpanNames.ServiceCreate);
			expect(spans).toHaveLength(1);
			expect(spans[0].attributes?.[IdentitySpanAttributes.Id]).toEqual(document.id);
		});

		test("nests spans so an operation sits under the one enclosing it", async () => {
			const { component, ended } = makeMockTracing();
			ComponentFactory.register("test-tracing", () => component);

			const service = new IdentityService({ tracingComponentType: "test-tracing" });
			const document = await service.identityCreate(undefined, TEST_CONTROLLER);

			await service.verificationMethodCreate(
				document.id,
				DidVerificationMethodType.VerificationMethod,
				"nested-method",
				TEST_CONTROLLER
			);

			const create = ended.find(s => s.name === IdentitySpanNames.Create);
			const method = ended.find(s => s.name === IdentitySpanNames.VerificationMethodCreate);
			expect(create?.parentSpanId).toBeUndefined();
			expect(method?.parentSpanId).toBeUndefined();
		});

		test("a failure ends the span with an error and records the domain error", async () => {
			const { component, ended } = makeMockTracing();
			ComponentFactory.register("test-tracing", () => component);

			const service = new IdentityService({ tracingComponentType: "test-tracing" });

			await expect(
				service.verificationMethodCreate(
					"did:entity-storage:missing",
					DidVerificationMethodType.VerificationMethod,
					"my-method",
					TEST_CONTROLLER
				)
			).rejects.toThrow(GeneralError);

			const spans = ended.filter(s => s.name === IdentitySpanNames.VerificationMethodCreate);
			expect(spans).toHaveLength(1);
			expect(spans[0].status).toEqual(SpanStatus.Error);
			expect(spans[0].attributes?.["exception.message"]).toEqual(
				"identityService.verificationMethodCreateFailed"
			);
		});
	});

	describe("uninstrumented path", () => {
		test("operations behave unchanged with no tracing component configured", async () => {
			const service = new IdentityService();

			await expect(service.identityCreate(undefined, TEST_CONTROLLER)).resolves.toHaveProperty(
				"id"
			);
		});

		test("an unresolvable tracing component type is ignored", async () => {
			const service = new IdentityService({ tracingComponentType: "not-registered" });

			await expect(service.identityCreate(undefined, TEST_CONTROLLER)).resolves.toHaveProperty(
				"id"
			);
		});
	});
});
