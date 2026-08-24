// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to remove the profile of another user as an admin.
 */
export interface IIdentityProfileAdminRemoveRequest {
	/**
	 * The path parameters.
	 */
	pathParams: {
		/**
		 * The identity of the user whose profile is to be removed.
		 */
		userIdentity: string;
	};
}
