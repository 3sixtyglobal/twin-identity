// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The span names for the identity domain.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const IdentitySpanNames = {
	/**
	 * Create an identity.
	 */
	Create: "identity/create",

	/**
	 * Remove an identity.
	 */
	Remove: "identity/remove",

	/**
	 * Create a verification method.
	 */
	VerificationMethodCreate: "identity/verification-method-create",

	/**
	 * Remove a verification method.
	 */
	VerificationMethodRemove: "identity/verification-method-remove",

	/**
	 * Create a service.
	 */
	ServiceCreate: "identity/service-create",

	/**
	 * Remove a service.
	 */
	ServiceRemove: "identity/service-remove",

	/**
	 * Add an also known as alias.
	 */
	AlsoKnownAsAdd: "identity/also-known-as-add",

	/**
	 * Remove an also known as alias.
	 */
	AlsoKnownAsRemove: "identity/also-known-as-remove",

	/**
	 * Create a verifiable credential.
	 */
	VerifiableCredentialCreate: "identity/verifiable-credential-create",

	/**
	 * Verify a verifiable credential.
	 */
	VerifiableCredentialVerify: "identity/verifiable-credential-verify",

	/**
	 * Revoke a verifiable credential.
	 */
	VerifiableCredentialRevoke: "identity/verifiable-credential-revoke",

	/**
	 * Unrevoke a verifiable credential.
	 */
	VerifiableCredentialUnrevoke: "identity/verifiable-credential-unrevoke",

	/**
	 * Create a verifiable presentation.
	 */
	VerifiablePresentationCreate: "identity/verifiable-presentation-create",

	/**
	 * Verify a verifiable presentation.
	 */
	VerifiablePresentationVerify: "identity/verifiable-presentation-verify",

	/**
	 * Create a proof.
	 */
	ProofCreate: "identity/proof-create",

	/**
	 * Verify a proof.
	 */
	ProofVerify: "identity/proof-verify"
} as const;

/**
 * Union type of all identity span name string values.
 */
export type IdentitySpanNames = (typeof IdentitySpanNames)[keyof typeof IdentitySpanNames];
