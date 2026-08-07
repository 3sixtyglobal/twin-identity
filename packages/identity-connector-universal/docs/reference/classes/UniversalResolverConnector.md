# Class: UniversalResolverConnector

Class for performing identity operations on a universal resolver.

## Implements

- `IIdentityResolverConnector`
- `IHealthProviderComponent`

## Constructors

### Constructor

> **new UniversalResolverConnector**(`options`): `UniversalResolverConnector`

Create a new instance of UniversalResolverConnector.

#### Parameters

##### options

[`IUniversalResolverConnectorConstructorOptions`](../interfaces/IUniversalResolverConnectorConstructorOptions.md)

The options for the identity connector.

#### Returns

`UniversalResolverConnector`

## Properties

### NAMESPACE {#namespace}

> `readonly` `static` **NAMESPACE**: `string` = `"universal"`

The namespace supported by the identity connector.

***

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IIdentityResolverConnector.className`

***

### health() {#health}

> **health**(): `Promise`\<`IHealth`[]\>

Returns the health status of the component.

#### Returns

`Promise`\<`IHealth`[]\>

The health status of the component.

#### Implementation of

`IHealthProviderComponent.health`

***

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

#### Implementation of

`IIdentityResolverConnector.resolveDocument`
