# Interface: IIdentityServiceConfig

Configuration for the Identity Service.

## Properties

### defaultNamespace? {#defaultnamespace}

> `optional` **defaultNamespace?**: `string`

The default connector namespace to use for identity operations. If not provided, the first registered connector is used.

***

### healthIntervalMs? {#healthintervalms}

> `optional` **healthIntervalMs?**: `number`

The minimum interval in ms between full application-level health checks (DID create, resolve, remove).

#### Default

```ts
300000
```
