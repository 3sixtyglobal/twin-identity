// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Did } from "../../src/types/did.js";

describe("Did", () => {
	test("Can fail when the string is empty", () => {
		expect(() => Did.parse("")).toThrow(
			expect.objectContaining({
				message: "guard.stringEmpty"
			})
		);
	});

	test("Can fail when the string is not a valid urn", () => {
		expect(() => Did.parse("aaa")).toThrow(
			expect.objectContaining({
				message: "guard.urn"
			})
		);
	});

	test("Can fail when the string is not a valid urn value", () => {
		expect(() => Did.parse("did:")).toThrow(
			expect.objectContaining({
				message: "guard.urn"
			})
		);
	});

	test("Can fail when the string has too few parts", () => {
		expect(() => Did.parse("did:iota")).toThrow(
			expect.objectContaining({
				message: "guard.didPartsTooFew"
			})
		);
	});

	test("Can fail when the string is not a did", () => {
		expect(() => Did.parse("dod:iota:111111")).toThrow(
			expect.objectContaining({
				message: "guard.didInvalidStart"
			})
		);
	});

	test("Can succeed when we have a method and a value", () => {
		expect(Did.parse("did:iota:111111")).toEqual({ method: "iota", id: "111111" });
	});

	test("Can succeed when we have a method, network and a value", () => {
		expect(Did.parse("did:iota:testnet:111111")).toEqual({
			method: "iota",
			network: "testnet",
			id: "111111"
		});
	});
});
