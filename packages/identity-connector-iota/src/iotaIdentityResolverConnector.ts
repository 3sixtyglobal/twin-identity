// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	IdentityClientReadOnly,
	type IotaDocument,
	Resolver
} from "@iota/identity-wasm/node/index.js";
import { HealthStatus, type IHealth, type IHealthProviderComponent } from "@twin.org/api-models";
import { GeneralError, Guards, Is, LruCache, NotFoundError, ObjectHelper } from "@twin.org/core";
import { Iota } from "@twin.org/dlt-iota";
import type { IIdentityResolverConnector } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import type { IDidDocument } from "@twin.org/standards-w3c-did";
import type { IIotaIdentityConnectorConfig } from "./models/IIotaIdentityConnectorConfig.js";
import type { IIotaIdentityResolverConnectorConfig } from "./models/IIotaIdentityResolverConnectorConfig.js";
import type { IIotaIdentityResolverConnectorConstructorOptions } from "./models/IIotaIdentityResolverConnectorConstructorOptions.js";

/**
 * Class for performing identity operations on IOTA.
 */
export class IotaIdentityResolverConnector
	implements IIdentityResolverConnector, IHealthProviderComponent
{
	/**
	 * The namespace supported by the identity connector.
	 */
	public static readonly NAMESPACE: string = "iota";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IotaIdentityResolverConnector>();

	/**
	 * The configuration to use for IOTA operations.
	 * @internal
	 */
	private readonly _config: IIotaIdentityResolverConnectorConfig;

	/**
	 * TTL in ms for caching resolved DID documents. 0 disables caching.
	 * @internal
	 */
	private readonly _didResolutionCacheTtlMs: number;

	/**
	 * Maximum number of DID documents retained in cache.
	 * @internal
	 */
	private readonly _didResolutionCacheCapacity: number;

	/**
	 * Maximum wait time for resolution cache getOrSet mutex acquisition in milliseconds.
	 * @internal
	 */
	private readonly _didResolutionCacheMutexTimeoutMs?: number;

	/**
	 * LRU cache for resolved DID documents. Undefined when caching is disabled (ttl is 0).
	 * @internal
	 */
	private readonly _didResolutionCache?: LruCache<IDidDocument>;

	/**
	 * Create a new instance of IotaIdentityResolverConnector.
	 * @param options The options for the identity connector.
	 */
	constructor(options: IIotaIdentityResolverConnectorConstructorOptions) {
		Guards.object(IotaIdentityResolverConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IIotaIdentityResolverConnectorConfig>(
			IotaIdentityResolverConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.object<IIotaIdentityConnectorConfig["clientOptions"]>(
			IotaIdentityResolverConnector.CLASS_NAME,
			nameof(options.config.clientOptions),
			options.config.clientOptions
		);

		this._config = options.config;

		this._didResolutionCacheTtlMs = this._config.didResolutionCacheTtlMs ?? 30_000;
		this._didResolutionCacheCapacity = this._config.didResolutionCacheCapacity ?? 1000;
		this._didResolutionCacheMutexTimeoutMs = this._config.didResolutionCacheMutexTimeoutMs;
		this._didResolutionCache =
			this._didResolutionCacheTtlMs > 0
				? new LruCache<IDidDocument>({
						capacity: this._didResolutionCacheCapacity,
						ttiMs: this._didResolutionCacheTtlMs,
						mutexTimeoutMs: this._didResolutionCacheMutexTimeoutMs
					})
				: undefined;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IotaIdentityResolverConnector.CLASS_NAME;
	}

	/**
	 * Stop the service.
	 * Destroys in-memory resources owned by this component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns A promise that resolves when the service has stopped.
	 */
	public async stop(nodeLoggingComponentType?: string): Promise<void> {
		this._didResolutionCache?.destroy();
	}

	/**
	 * Returns the health status of the component.
	 * @returns The health status of the component.
	 */
	public async health(): Promise<IHealth[]> {
		const nodeEndpoint = (this._config.clientOptions as { url?: string }).url;

		try {
			const iotaClient = Iota.createClient(this._config);
			const version = await iotaClient.getRpcApiVersion();

			if (!Is.stringValue(version)) {
				return [
					{
						source: IotaIdentityResolverConnector.CLASS_NAME,
						status: HealthStatus.Error,
						description: "healthDescription",
						message: "nodeHealthCheckFailed",
						data: { endpoint: nodeEndpoint }
					}
				];
			}

			return [
				{
					source: IotaIdentityResolverConnector.CLASS_NAME,
					status: HealthStatus.Ok,
					description: "healthDescription",
					data: { endpoint: nodeEndpoint }
				}
			];
		} catch {
			return [
				{
					source: IotaIdentityResolverConnector.CLASS_NAME,
					status: HealthStatus.Error,
					description: "healthDescription",
					message: "nodeHealthCheckFailed",
					data: { endpoint: nodeEndpoint }
				}
			];
		}
	}

	/**
	 * Resolve a document from its id, cached for didResolutionCacheTtlMs
	 * (0 disables caching and resolves fresh every call).
	 * @param documentId The id of the document to resolve.
	 * @returns The resolved document.
	 * @throws NotFoundError if the id can not be resolved.
	 */
	public async resolveDocument(documentId: string): Promise<IDidDocument> {
		Guards.stringValue(IotaIdentityResolverConnector.CLASS_NAME, nameof(documentId), documentId);

		if (Is.undefined(this._didResolutionCache)) {
			return this.clientResolveDocument(documentId);
		}

		const document = await this._didResolutionCache.getOrSet(documentId, async () =>
			this.clientResolveDocument(documentId)
		);

		// Return a deep clone, not the cached instance itself, so a caller mutating the document
		// it receives cannot corrupt the entry shared with every other caller.
		return ObjectHelper.clone(document);
	}

	/**
	 * Resolve a document from its id, bypassing the cache.
	 * @param documentId The id of the document to resolve.
	 * @returns The resolved document.
	 * @throws NotFoundError if the id can not be resolved.
	 * @internal
	 */
	private async clientResolveDocument(documentId: string): Promise<IDidDocument> {
		try {
			const client = Iota.createClient(this._config);
			const identityClientReadOnly = await IdentityClientReadOnly.create(
				// @ts-expect-error IotaClient has a mismatch with the library types
				client,
				this._config?.identityPkgId
			);
			const resolver = new Resolver<IotaDocument>({
				client: identityClientReadOnly
			});
			const resolvedDocument = await resolver.resolve(documentId);

			if (Is.undefined(resolvedDocument)) {
				throw new NotFoundError(
					IotaIdentityResolverConnector.CLASS_NAME,
					"documentNotFound",
					documentId
				);
			}

			const doc = resolvedDocument.toJSON() as { doc: IDidDocument };

			return doc.doc;
		} catch (error) {
			throw new GeneralError(
				IotaIdentityResolverConnector.CLASS_NAME,
				"resolveDocumentFailed",
				{ documentId },
				Iota.extractPayloadError(error)
			);
		}
	}
}
