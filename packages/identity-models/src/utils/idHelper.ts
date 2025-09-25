// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Urn } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";

/**
 * Helper methods for Ids.
 */
export class IdHelper {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IdHelper>();

	/**
	 * Parse and id in to it's constituent parts.
	 * @param id The id to parse.
	 * @returns The parsed id.
	 * @throws GeneralError if the id is not valid.
	 */
	public static parseId(id: string): {
		method: string;
		network?: string | undefined;
		id: string;
	} {
		Urn.guard(IdHelper.CLASS_NAME, nameof(id), id);

		const didUrn = Urn.fromValidString(id);
		const didParts = didUrn.parts();

		if (didParts[0] !== "did") {
			throw new GeneralError(IdHelper.CLASS_NAME, "invalidDocumentId", { id });
		}

		if (didParts.length === 3) {
			return {
				method: didParts[1],
				id: didParts[2]
			};
		} else if (didParts.length === 4) {
			return {
				method: didParts[1],
				network: didParts[2],
				id: didParts[3]
			};
		}

		throw new GeneralError(IdHelper.CLASS_NAME, "invalidDocumentId", { id });
	}
}
