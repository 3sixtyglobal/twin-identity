# Class: IdHelper

Helper methods for Ids.

## Constructors

### Constructor

> **new IdHelper**(): `IdHelper`

#### Returns

`IdHelper`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### parseId()

> `static` **parseId**(`id`): `object`

Parse and id in to it's constituent parts.

#### Parameters

##### id

`string`

The id to parse.

#### Returns

`object`

The parsed id.

##### method

> **method**: `string`

##### network?

> `optional` **network**: `string`

##### id

> **id**: `string`

#### Throws

GeneralError if the id is not valid.
