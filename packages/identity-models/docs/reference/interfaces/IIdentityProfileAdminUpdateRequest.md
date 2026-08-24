# Interface: IIdentityProfileAdminUpdateRequest

Request to update the profile of another user as an admin.

## Properties

### pathParams {#pathparams}

> **pathParams**: `object`

The path parameters.

#### userIdentity

> **userIdentity**: `string`

The identity of the user whose profile is to be updated.

***

### body {#body}

> **body**: `object`

The data for the request.

#### publicProfile?

> `optional` **publicProfile?**: `IJsonLdDocument`

The public profile data.

#### privateProfile?

> `optional` **privateProfile?**: `IJsonLdDocument`

The private profile data.
