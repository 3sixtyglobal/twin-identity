# Class: DidContextIdHandler

Context ID handler that treats context identifiers as DIDs.

## Implements

- `IContextIdHandler`

## Constructors

### Constructor

> **new DidContextIdHandler**(): `DidContextIdHandler`

#### Returns

`DidContextIdHandler`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

The class name of the component.

#### Returns

`string`

The class name.

#### Implementation of

`IContextIdHandler.className`

***

### short() {#short}

> **short**(`value`): `string`

Get the short form of the DID which is the last part.

#### Parameters

##### value

`string`

The full context id value.

#### Returns

`string`

Short form string.

#### Implementation of

`IContextIdHandler.short`

***

### long() {#long}

> **long**(`value`): `string`

The long form version of the context ID, expanded from a short version.

#### Parameters

##### value

`string`

The short form context ID value.

#### Returns

`string`

The long form version of the context ID.

#### Implementation of

`IContextIdHandler.long`

***

### guard() {#guard}

> **guard**(`value`): `void`

Guard the value ensuring it is a valid DID.

#### Parameters

##### value

`string`

The value to guard.

#### Returns

`void`

#### Throws

GeneralError if the value is not a valid DID.

#### Implementation of

`IContextIdHandler.guard`
