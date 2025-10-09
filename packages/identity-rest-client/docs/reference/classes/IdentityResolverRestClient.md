# Class: IdentityResolverRestClient

Client for performing identity through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IIdentityResolverComponent`

## Constructors

### Constructor

> **new IdentityResolverRestClient**(`config`): `IdentityResolverRestClient`

Create a new instance of IdentityClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`IdentityResolverRestClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### identityResolve()

> **identityResolve**(`documentId`): `Promise`\<`IDidDocument`\>

Resolve an identity.

#### Parameters

##### documentId

`string`

The id of the document to resolve.

#### Returns

`Promise`\<`IDidDocument`\>

The resolved document.

#### Implementation of

`IIdentityResolverComponent.identityResolve`
