// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IVerifiableCredentialAuthenticationGeneratorConfig } from "./IVerifiableCredentialAuthenticationGeneratorConfig";

/**
 * Options for the verifiable credential authentication generator constructor.
 */
export interface IVerifiableCredentialAuthenticationGeneratorConstructorOptions {
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
	 * The configuration for the verifiable credential authentication generator.
	 */
	config: IVerifiableCredentialAuthenticationGeneratorConfig;
}
