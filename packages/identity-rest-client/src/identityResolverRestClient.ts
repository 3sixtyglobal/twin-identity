// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig } from "@twin.org/api-models";
import { Urn } from "@twin.org/core";
import type {
	IIdentityResolverComponent,
	IIdentityResolveRequest,
	IIdentityResolveResponse
} from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import type { IDidDocument } from "@twin.org/standards-w3c-did";

/**
 * Client for performing identity through to REST endpoints.
 */
export class IdentityResolverRestClient
	extends BaseRestClient
	implements IIdentityResolverComponent
{
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IdentityResolverRestClient>();

	/**
	 * Create a new instance of IdentityClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<IdentityResolverRestClient>(), config, "identity");
	}

	/**
	 * Resolve an identity.
	 * @param documentId The id of the document to resolve.
	 * @returns The resolved document.
	 */
	public async identityResolve(documentId: string): Promise<IDidDocument> {
		Urn.guard(IdentityResolverRestClient.CLASS_NAME, nameof(documentId), documentId);

		const response = await this.fetch<IIdentityResolveRequest, IIdentityResolveResponse>(
			"/:identity",
			"GET",
			{
				pathParams: {
					identity: documentId
				}
			}
		);

		return response.body;
	}
}
