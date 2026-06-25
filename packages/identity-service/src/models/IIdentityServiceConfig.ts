// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Identity Service.
 */
export interface IIdentityServiceConfig {
	/**
	 * The default connector namespace to use for identity operations. If not provided, the first registered connector is used.
	 */
	defaultNamespace?: string;
}
