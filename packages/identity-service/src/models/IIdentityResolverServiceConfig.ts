// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Identity Resolver Service.
 */
export interface IIdentityResolverServiceConfig {
	/**
	 * The default connector namespace to use for identity resolution. If not provided, the first registered connector is used.
	 */
	defaultNamespace?: string;
}
