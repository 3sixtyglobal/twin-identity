// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The types of Identity Authentication data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IdentityAuthenticationTypes = {
	/**
	 * Represents action request.
	 */
	ActionRequest: "ActionRequest"
} as const;

/**
 * The types of Identity Authentication data.
 */
export type IdentityAuthenticationTypes =
	(typeof IdentityAuthenticationTypes)[keyof typeof IdentityAuthenticationTypes];
