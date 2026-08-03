// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@twin.org/api-models";
import {
	setupTestEnv,
	TEST_CLIENT_OPTIONS,
	TEST_MNEMONIC_NAME,
	TEST_NETWORK
} from "./setupTestEnv.js";
import { IotaIdentityConnector } from "../src/iotaIdentityConnector.js";

describe("IotaIdentityConnector Health", () => {
	let identityConnector: IotaIdentityConnector;

	beforeAll(async () => {
		await setupTestEnv();

		identityConnector = new IotaIdentityConnector({
			config: {
				clientOptions: TEST_CLIENT_OPTIONS,
				vaultMnemonicId: TEST_MNEMONIC_NAME,
				network: TEST_NETWORK
			}
		});
	});

	test("can get health status", async () => {
		const health = await identityConnector.health(0);

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

		const health = await badConnector.health(0);

		expect(health).toBeDefined();
		expect(health.length).toBeGreaterThan(0);
		expect(health[0].source).toEqual(IotaIdentityConnector.CLASS_NAME);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
