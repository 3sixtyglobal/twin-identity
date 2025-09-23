// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Verifiable Credential Authentication Processor.
 */
export interface IVerifiableCredentialAuthenticationProcessorConfig {
	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @default 60 (1 minute)
	 */
	tokenTtlInSeconds?: number;
}
