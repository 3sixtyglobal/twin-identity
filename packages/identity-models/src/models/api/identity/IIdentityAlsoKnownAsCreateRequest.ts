// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to create an alias for an identity.
 */
export interface IIdentityAlsoKnownAsCreateRequest {
	/**
	 * The path parameters.
	 */
	pathParams: {
		/**
		 * The identity to create the alias for.
		 */
		identity: string;
	};

	/**
	 * The data for the request.
	 */
	body: {
		/**
		 * The alias to create for the identity.
		 */
		alias: string;
	};
}
