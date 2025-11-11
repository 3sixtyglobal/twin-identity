// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Verifiable Credential Authentication Generator.
 */
export interface IVerifiableCredentialAuthenticationGeneratorConfig {
	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @default 60 (1 minute)
	 */
	tokenTtlInSeconds?: number;

	/**
	 * The context id to use as the base for the verification method e.g. node/organization.
	 * @default node
	 */
	contextId?: string;

	/**
	 * The id of the identity method to use when creating/verifying tokens.
	 */
	verificationMethodId: string;
}
