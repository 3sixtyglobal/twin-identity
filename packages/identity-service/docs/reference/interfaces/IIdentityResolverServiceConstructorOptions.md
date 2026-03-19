# Interface: IIdentityResolverServiceConstructorOptions

Options for the identity resolver service constructor.

## Properties

### fallbackResolverConnectorType? {#fallbackresolverconnectortype}

> `optional` **fallbackResolverConnectorType?**: `string`

Fallback connector type to use if the namespace connector is not available.

#### Default

```ts
universal
```

***

### config? {#config}

> `optional` **config?**: [`IIdentityResolverServiceConfig`](IIdentityResolverServiceConfig.md)

The configuration for the identity service.
