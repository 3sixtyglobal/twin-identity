// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to get the profile of another user as an admin.
 */
export interface IIdentityProfileAdminGetRequest {
	/**
	 * The path parameters.
	 */
	pathParams: {
		/**
		 * The identity of the user whose profile is to be retrieved.
		 */
		userIdentity: string;
	};

	/**
	 * The query parameters.
	 */
	query?: {
		/**
		 * The public properties to get for the profile, defaults to all, should be a comma separated list.
		 */
		publicPropertyNames?: string;

		/**
		 * The private properties to get for the profile, defaults to all, should be a comma separated list.
		 */
		privatePropertyNames?: string;
	};
}
