// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The LD Contexts concerning Identity Authentication.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IdentityAuthenticationContexts = {
	/**
	 * The Namespace.
	 */
	Namespace: "https://schema.twindev.org/identity-authentication"
} as const;

/**
 * The LD Contexts concerning Identity Authentication.
 */
export type IdentityAuthenticationContexts =
	(typeof IdentityAuthenticationContexts)[keyof typeof IdentityAuthenticationContexts];
