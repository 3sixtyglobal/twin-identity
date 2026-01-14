// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IdentityAuthenticationContexts } from "./identityAuthenticationContexts.js";
import type { IdentityAuthenticationTypes } from "./identityAuthenticationTypes.js";

/**
 * The JSON-LD definition for a action request.
 */
export interface IIdentityAuthenticationActionRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof IdentityAuthenticationContexts.Namespace;

	/**
	 * The type of the request.
	 */
	type: typeof IdentityAuthenticationTypes.ActionRequest;

	/**
	 * The identity of the entity making the request.
	 */
	requester: string;

	/**
	 * The action which can be checked to make sure it matches the specific operation.
	 */
	action?: string;

	/**
	 * Additional data for the action request, can be customised per request.
	 */
	data?: unknown;
}
