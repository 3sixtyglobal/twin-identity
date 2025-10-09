// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { IdentityRestClient } from "../src/identityRestClient";

describe("IdentityRestClient", () => {
	test("Can create an instance", async () => {
		const client = new IdentityRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
