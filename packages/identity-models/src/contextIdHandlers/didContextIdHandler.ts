// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IContextIdHandler } from "@twin.org/context";
import { Converter, HexHelper } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import { Did } from "../types/did.js";

/**
 * Context Id handler for testing as a DID.
 */
export class DidContextIdHandler implements IContextIdHandler {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<DidContextIdHandler>();

	/**
	 * Get the short form of the DID which is the last part.
	 * @param value The full context id value.
	 * @returns Short form string.
	 */
	public short(value: string): string {
		const parts = Did.parse(value);
		// If the ID part is hex, convert to base64 for a shorter representation.
		if (HexHelper.hasPrefix(parts.id) && HexHelper.isHex(parts.id, true)) {
			const bytes = Converter.hexToBytes(parts.id);
			return Converter.bytesToBase64(bytes);
		}
		return parts.id;
	}

	/**
	 * Guard the value ensuring length.
	 * @param value The value to guard.
	 * @throws GeneralError if the value is too short.
	 */
	public guard(value: string): void {
		Did.guard(DidContextIdHandler.CLASS_NAME, nameof(value), value);
	}
}
