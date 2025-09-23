// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IdentityAuthenticationContexts } from "./identityAuthenticationContexts";
import type { IdentityAuthenticationTypes } from "./identityAuthenticationTypes";

/**
 * The JSON-LD definition for a action request.
 */
export interface IIdentityAuthenticationActionRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof IdentityAuthenticationContexts.ContextRoot;

	/**
	 * The type of the request.
	 */
	type: typeof IdentityAuthenticationTypes.ActionRequest;

	/**
	 * The node identity.
	 */
	nodeIdentity: string;

	/**
	 * The action.
	 */
	action: string;
}
