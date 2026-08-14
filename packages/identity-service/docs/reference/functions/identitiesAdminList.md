# Function: identitiesAdminList()

> **identitiesAdminList**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`IIdentityProfileAdminListResponse`\>

Get the list of identity profiles including private properties as an admin.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes stored in the ComponentFactory.

### request

`IIdentityProfileAdminListRequest`

The request.

## Returns

`Promise`\<`IIdentityProfileAdminListResponse`\>

The response object with additional http response properties.
