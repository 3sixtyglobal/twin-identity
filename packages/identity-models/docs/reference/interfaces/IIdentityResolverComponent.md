# Interface: IIdentityResolverComponent

Interface describing a contract which provides identity operations.

## Extends

- `IComponent`

## Indexable

\[`key`: `string`\]: `any`

All methods are optional, so we introduce an index signature to allow
any additional properties or methods, which removes the TypeScript error where
the class has no properties in common with the type.

## Methods

### identityResolve()

> **identityResolve**(`identity`): `Promise`\<`IDidDocument`\>

Resolve an identity.

#### Parameters

##### identity

`string`

The id of the document to resolve.

#### Returns

`Promise`\<`IDidDocument`\>

The resolved document.
