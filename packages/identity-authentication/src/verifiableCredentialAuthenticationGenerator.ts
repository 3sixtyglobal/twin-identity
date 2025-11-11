// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAuthenticationGenerator } from "@twin.org/api-models";
import { ContextIdHelper, ContextIdStore } from "@twin.org/context";
import { Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import {
	DocumentHelper,
	IdentityConnectorFactory,
	type IIdentityConnector
} from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import { HeaderHelper, HeaderTypes, type IHttpHeaders } from "@twin.org/web";
import type { IVerifiableCredentialAuthenticationGeneratorConfig } from "./models/IVerifiableCredentialAuthenticationGeneratorConfig.js";
import type { IVerifiableCredentialAuthenticationGeneratorConstructorOptions } from "./models/IVerifiableCredentialAuthenticationGeneratorConstructorOptions.js";

/**
 * Class performing verifiable credential authentication generation.
 */
export class VerifiableCredentialAuthenticationGenerator implements IAuthenticationGenerator {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<VerifiableCredentialAuthenticationGenerator>();

	/**
	 * Connector for identity operations.
	 * @internal
	 */
	private readonly _identityConnector: IIdentityConnector;

	/**
	 * The verification method ID for the connector to use.
	 * @internal
	 */
	private readonly _verificationMethodId: string;

	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @internal
	 */
	private readonly _tokenTtlInSeconds: number;

	/**
	 * Create a new instance of VerifiableCredentialAuthenticationGenerator.
	 * @param options The options for the service.
	 */
	constructor(options: IVerifiableCredentialAuthenticationGeneratorConstructorOptions) {
		Guards.object<IVerifiableCredentialAuthenticationGeneratorConstructorOptions>(
			VerifiableCredentialAuthenticationGenerator.CLASS_NAME,
			nameof(options),
			options
		);
		Guards.object<IVerifiableCredentialAuthenticationGeneratorConfig>(
			VerifiableCredentialAuthenticationGenerator.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			VerifiableCredentialAuthenticationGenerator.CLASS_NAME,
			nameof(options.config.verificationMethodId),
			options.config.verificationMethodId
		);

		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);

		this._verificationMethodId = options.config.verificationMethodId;
		this._tokenTtlInSeconds = options.config.tokenTtlInSeconds ?? 60;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return VerifiableCredentialAuthenticationGenerator.CLASS_NAME;
	}

	/**
	 * Adds authentication information to the request headers.
	 * @param requestHeaders The request headers to add authentication information to.
	 * @param authData Optional authentication data passed from the request.
	 * @param authData.contextId The context ID for the authentication.
	 * @param authData.subject The subject for the authentication.
	 * @returns A promise that resolves when the authentication information has been added.
	 */
	public async addAuthentication(
		requestHeaders: IHttpHeaders,
		authData: {
			contextId: string;
			subject?: IJsonLdNodeObject;
		}
	): Promise<void> {
		Guards.object<IHttpHeaders>(
			VerifiableCredentialAuthenticationGenerator.CLASS_NAME,
			nameof(requestHeaders),
			requestHeaders
		);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, authData.contextId);
		const contextId = contextIds[authData.contextId];

		const ttlMs = this._tokenTtlInSeconds * 1000;

		const credential = await this._identityConnector.createVerifiableCredential(
			contextId,
			DocumentHelper.joinId(contextId, this._verificationMethodId),
			undefined,
			authData.subject ?? {},
			{
				expirationDate: new Date(Date.now() + ttlMs)
			}
		);

		requestHeaders[HeaderTypes.Authorization] = HeaderHelper.createBearer(credential.jwt);
	}
}
