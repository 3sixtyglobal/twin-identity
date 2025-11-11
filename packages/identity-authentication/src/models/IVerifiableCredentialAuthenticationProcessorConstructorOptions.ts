// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IVerifiableCredentialAuthenticationProcessorConfig } from "./IVerifiableCredentialAuthenticationProcessorConfig.js";

/**
 * Options for the verifiable credential authentication processor constructor.
 */
export interface IVerifiableCredentialAuthenticationProcessorConstructorOptions {
	/**
	 * The type of identity connector to use.
	 * @default identity
	 */
	identityConnectorType?: string;

	/**
	 * The type of logging component to use.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the verifiable credential authentication processor.
	 */
	config?: IVerifiableCredentialAuthenticationProcessorConfig;
}
