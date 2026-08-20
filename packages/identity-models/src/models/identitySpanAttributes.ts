// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The span attribute keys for the identity domain.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IdentitySpanAttributes = {
	/**
	 * The id of the identity document the operation is for.
	 */
	Id: "identity.id",

	/**
	 * The id of the verification method the operation is for.
	 */
	VerificationMethodId: "identity.verification-method-id",

	/**
	 * The id of the service the operation is for.
	 */
	ServiceId: "identity.service-id"
} as const;

/**
 * Union type of all identity span attribute key string values.
 */
export type IdentitySpanAttributes =
	(typeof IdentitySpanAttributes)[keyof typeof IdentitySpanAttributes];
