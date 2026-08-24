# Interface: IIdentityProfileAdminListResponse

Response to get an admin list of identities including private profile data.

## Properties

### body {#body}

> **body**: `object`

The response payload.

#### items

> **items**: `object`[]

The identities.

#### cursor?

> `optional` **cursor?**: `string`

An optional cursor, when defined can be used to call find to get more entities.
