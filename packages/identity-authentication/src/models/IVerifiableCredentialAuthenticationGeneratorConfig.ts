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
	 * The id of the identity method to use when creating/verifying tokens.
	 */
	verificationMethodId: string;
}
