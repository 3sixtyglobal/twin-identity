// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAuthenticationGenerator } from "@twin.org/api-models";
import { GeneralError, Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import {
	DocumentHelper,
	IdentityConnectorFactory,
	type IIdentityConnector
} from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import { HeaderHelper, HeaderTypes, type IHttpHeaders } from "@twin.org/web";
import type { IVerifiableCredentialAuthenticationGeneratorConfig } from "./models/IVerifiableCredentialAuthenticationGeneratorConfig";
import type { IVerifiableCredentialAuthenticationGeneratorConstructorOptions } from "./models/IVerifiableCredentialAuthenticationGeneratorConstructorOptions";

/**
 * Class performing verifiable credential authentication generation.
 */
export class VerifiableCredentialAuthenticationGenerator implements IAuthenticationGenerator {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<VerifiableCredentialAuthenticationGenerator>();

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
	 * The node identity.
	 * @internal
	 */
	private _nodeIdentity?: string;

	/**
	 * Create a new instance of VerifiableCredentialAuthenticationGenerator.
	 * @param options The options for the service.
	 */
	constructor(options: IVerifiableCredentialAuthenticationGeneratorConstructorOptions) {
		Guards.object<IVerifiableCredentialAuthenticationGeneratorConstructorOptions>(
			this.CLASS_NAME,
			nameof(options),
			options
		);
		Guards.object<IVerifiableCredentialAuthenticationGeneratorConfig>(
			this.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			this.CLASS_NAME,
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
	 * The component needs to be started when the node is initialized.
	 * @param nodeIdentity The identity of the node starting the component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(
		nodeIdentity: string,
		nodeLoggingComponentType: string | undefined
	): Promise<void> {
		this._nodeIdentity = nodeIdentity;
	}

	/**
	 * Adds authentication information to the request headers.
	 * @param requestHeaders The request headers to add authentication information to.
	 * @param authData Optional authentication data passed from the request.
	 * @returns A promise that resolves when the authentication information has been added.
	 */
	public async addAuthentication(
		requestHeaders: IHttpHeaders,
		authData: IJsonLdNodeObject
	): Promise<void> {
		Guards.object<IHttpHeaders>(this.CLASS_NAME, nameof(requestHeaders), requestHeaders);

		if (!this._nodeIdentity) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const ttlMs = this._tokenTtlInSeconds * 1000;

		const credential = await this._identityConnector.createVerifiableCredential(
			this._nodeIdentity,
			DocumentHelper.joinId(this._nodeIdentity, this._verificationMethodId),
			undefined,
			authData,
			{
				expirationDate: new Date(Date.now() + ttlMs)
			}
		);

		requestHeaders[HeaderTypes.Authorization] = HeaderHelper.createBearer(credential.jwt);
	}
}
