// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { IdHelper } from "../../src/utils/idHelper";

describe("IdHelper", () => {
	test("Can fail when the string is empty", () => {
		expect(() => IdHelper.parseId("")).toThrowError("guard.stringEmpty");
	});

	test("Can fail when the string is not a valid urn", () => {
		expect(() => IdHelper.parseId("aaa")).toThrowError("guard.urn");
	});

	test("Can fail when the string is not a valid urn value", () => {
		expect(() => IdHelper.parseId("did:")).toThrowError("guard.urn");
	});

	test("Can fail when the string is not a valid urn value", () => {
		expect(() => IdHelper.parseId("did:iota")).toThrowError("idHelper.invalidDocumentId");
	});

	test("Can fail when the string is not a did", () => {
		expect(() => IdHelper.parseId("dod:iota")).toThrowError("idHelper.invalidDocumentId");
	});

	test("Can succeed when we have a method and a value", () => {
		expect(IdHelper.parseId("did:iota:111111")).toEqual({ method: "iota", id: "111111" });
	});

	test("Can succeed when we have a method, network and a value", () => {
		expect(IdHelper.parseId("did:iota:testnet:111111")).toEqual({
			method: "iota",
			network: "testnet",
			id: "111111"
		});
	});
});
