// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDidVerifiableCredential } from "@twin.org/standards-w3c-did";

/**
 * Request to verify a verifiable credential.
 */
export interface IIdentityVerifiableCredentialVerifyDocumentRequest {
	/**
	 * The body parameters.
	 */
	body: IDidVerifiableCredential;
}
