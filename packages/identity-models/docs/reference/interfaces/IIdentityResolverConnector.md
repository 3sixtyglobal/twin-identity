# Interface: IIdentityResolverConnector

Interface describing an identity connector.

## Extends

- `IComponent`

## Methods

### resolveDocument() {#resolvedocument}

> **resolveDocument**(`documentId`): `Promise`\<`IDidDocument`\>

Resolve a document from its id.

#### Parameters

##### documentId

`string`

The id of the document to resolve.

#### Returns

`Promise`\<`IDidDocument`\>

The resolved document.

#### Throws

NotFoundError if the id can not be resolved.
