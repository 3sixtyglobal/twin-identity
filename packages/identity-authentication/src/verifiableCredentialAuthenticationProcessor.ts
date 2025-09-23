// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IBaseRoute,
	IBaseRouteProcessor,
	IHttpRequestIdentity,
	IHttpResponse,
	IHttpServerRequest
} from "@twin.org/api-models";
import { GeneralError, Is } from "@twin.org/core";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import { VerifiableCredentialHelper } from "@twin.org/standards-w3c-did";
import { HeaderHelper, HeaderTypes } from "@twin.org/web";
import type { IVerifiableCredentialAuthenticationProcessorConstructorOptions } from "./models/IVerifiableCredentialAuthenticationProcessorConstructorOptions";

/**
 * Handle a JWT token in the authorization header and verify the credential.
 */
export class VerifiableCredentialAuthenticationProcessor implements IBaseRouteProcessor {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<VerifiableCredentialAuthenticationProcessor>();

	/**
	 * Connector for identity operations.
	 * @internal
	 */
	private readonly _identityConnector: IIdentityConnector;

	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @internal
	 */
	private readonly _tokenTtlInSeconds: number;

	/**
	 * Create a new instance of AuthCookiePreProcessor.
	 * @param options Options for the processor.
	 */
	constructor(options?: IVerifiableCredentialAuthenticationProcessorConstructorOptions) {
		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);
		this._tokenTtlInSeconds = options?.config?.tokenTtlInSeconds ?? 60;
	}

	/**
	 * Features supported by this processor.
	 * If a route has any of these features listed, this processor will be run for that route.
	 * If this is not implemented, the processor will run for all routes.
	 * @returns The features supported by this processor.
	 */
	public features(): string[] {
		return ["verifiableCredential"];
	}

	/**
	 * Pre process the REST request for the specified route.
	 * @param request The incoming request.
	 * @param response The outgoing response.
	 * @param route The route to process.
	 * @param requestIdentity The identity context for the request.
	 * @param processorState The state handed through the processors.
	 * @returns Nothing
	 */
	public async pre(
		request: IHttpServerRequest,
		response: IHttpResponse,
		route: IBaseRoute | undefined,
		requestIdentity: IHttpRequestIdentity,
		processorState: { [id: string]: unknown }
	): Promise<void> {
		try {
			// Only process if the route has the verifiableCredential feature
			if (
				Is.arrayValue(route?.processorFeatures) &&
				route?.processorFeatures.includes("verifiableCredential")
			) {
				const token = HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization]);

				const result = await this._identityConnector.checkVerifiableCredential(token);

				const verifiableCredential = result.verifiableCredential;
				if (Is.empty(verifiableCredential)) {
					throw new GeneralError(this.CLASS_NAME, "tokenNoCredential");
				}

				const issuer: string | undefined = Is.stringValue(verifiableCredential.issuer)
					? verifiableCredential.issuer
					: undefined;
				if (Is.empty(issuer)) {
					throw new GeneralError(this.CLASS_NAME, "tokenNoIssuer");
				}

				const issuanceDate = VerifiableCredentialHelper.getValidFrom(verifiableCredential);

				if (Is.empty(issuanceDate)) {
					throw new GeneralError(this.CLASS_NAME, "tokenMissingIssuanceDate", {
						issuer
					});
				}

				const tokenCreated = new Date(issuanceDate);
				const now = Date.now();
				const tokenTtlInMs = this._tokenTtlInSeconds * 1000;

				// If the token has expired then we should reject it
				if (tokenCreated.getTime() + tokenTtlInMs < now) {
					throw new GeneralError(this.CLASS_NAME, "tokenExpired", {
						issuer
					});
				}

				const subject = verifiableCredential.credentialSubject;
				if (Is.empty(subject)) {
					throw new GeneralError(this.CLASS_NAME, "tokenMissingSubject", {
						issuer
					});
				}

				processorState.verifiableCredentialIssuer = issuer;
				processorState.verifiableCredential = verifiableCredential;
				processorState.verifiableCredentialSubject = subject;
			}
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "tokenFailed", undefined, err);
		}
	}
}
