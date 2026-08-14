# Interface: IIdentityProfileAdminGetRequest

Request to get the profile of another user as an admin.

## Properties

### pathParams {#pathparams}

> **pathParams**: `object`

The path parameters.

#### userIdentity

> **userIdentity**: `string`

The identity of the user whose profile is to be retrieved.

***

### query? {#query}

> `optional` **query?**: `object`

The query parameters.

#### publicPropertyNames?

> `optional` **publicPropertyNames?**: `string`

The public properties to get for the profile, defaults to all, should be a comma separated list.

#### privatePropertyNames?

> `optional` **privatePropertyNames?**: `string`

The private properties to get for the profile, defaults to all, should be a comma separated list.
