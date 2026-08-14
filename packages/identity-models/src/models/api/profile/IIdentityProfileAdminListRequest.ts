// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to get a list of identities with public and private profile data as an admin.
 */
export interface IIdentityProfileAdminListRequest {
	/**
	 * The query parameters.
	 */
	query?: {
		/**
		 * The public filters to apply to the list, comma separated list with colon between key and value for each pair e.g. prop1:value1,prop2:value2.
		 */
		publicFilters?: string;

		/**
		 * The private filters to apply to the list, comma separated list with colon between key and value for each pair e.g. prop1:value1,prop2:value2.
		 */
		privateFilters?: string;

		/**
		 * The public properties to get for the profile, defaults to all, should be a comma separated list.
		 */
		publicPropertyNames?: string;

		/**
		 * The private properties to get for the profile, defaults to none, should be a comma separated list.
		 */
		privatePropertyNames?: string;

		/**
		 * The cursor for paged requests.
		 */
		cursor?: string;

		/**
		 * Number of items to return.
		 */
		limit?: string;
	};
}
