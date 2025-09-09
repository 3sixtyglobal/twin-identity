// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { UniversalResolverConnector } from "../src/universalResolverConnector";

describe("UniversalResolverConnector", () => {
	test("can construct and resolve an identity", async () => {
		const resolver = new UniversalResolverConnector({
			config: { endpoint: "http://localhost:8180" }
		});

		// We will need to create an identity to check for once the iota connector is ready
		const document = await resolver.resolveDocument(
			"did:iota:testnet:0xd5bca38bae48da76a364b1f17e0c5ccafdb3be33f94860fff2883fe56b3eb583"
		);
		expect(document.id).toEqual(
			"did:iota:testnet:0xd5bca38bae48da76a364b1f17e0c5ccafdb3be33f94860fff2883fe56b3eb583"
		);
	});
});
