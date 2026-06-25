// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to remove an alias from an identity.
 */
export interface IIdentityAlsoKnownAsRemoveRequest {
	/**
	 * The path parameters.
	 */
	pathParams: {
		/**
		 * The identity to remove the alias from.
		 */
		identity: string;

		/**
		 * The alias to remove.
		 */
		alias: string;
	};
}
