// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDidVerifiableCredential } from "@twin.org/standards-w3c-did";

/**
 * Request to verify a verifiable credential.
 */
export interface IIdentityVerifiableCredentialVerifyRequest {
	/**
	 * The path parameters.
	 */
	query?: {
		/**
		 * The jwt to verify.
		 */
		jwt: string;
	};

	/**
	 * The body parameters.
	 */
	body?: {
		/**
		 * The verifiable credential to verify.
		 */
		credential: IDidVerifiableCredential;
	};
}
