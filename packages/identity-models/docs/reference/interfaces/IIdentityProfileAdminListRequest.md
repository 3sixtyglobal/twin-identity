# Interface: IIdentityProfileAdminListRequest

Request to get a list of identities with public and private profile data as an admin.

## Properties

### query? {#query}

> `optional` **query?**: `object`

The query parameters.

#### publicFilters?

> `optional` **publicFilters?**: `string`

The public filters to apply to the list, comma separated list with colon between key and value for each pair e.g. prop1:value1,prop2:value2.

#### privateFilters?

> `optional` **privateFilters?**: `string`

The private filters to apply to the list, comma separated list with colon between key and value for each pair e.g. prop1:value1,prop2:value2.

#### publicPropertyNames?

> `optional` **publicPropertyNames?**: `string`

The public properties to get for the profile, defaults to all, should be a comma separated list.

#### privatePropertyNames?

> `optional` **privatePropertyNames?**: `string`

The private properties to get for the profile, defaults to none, should be a comma separated list.

#### cursor?

> `optional` **cursor?**: `string`

The cursor for paged requests.

#### limit?

> `optional` **limit?**: `string`

Number of items to return.
