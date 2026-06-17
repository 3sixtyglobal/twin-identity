# Class: VerificationHelper

Helper methods for verification.

## Constructors

### Constructor

> **new VerificationHelper**(): `VerificationHelper`

#### Returns

`VerificationHelper`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### verifyJwt() {#verifyjwt}

> `static` **verifyJwt**\<`T`, `U`\>(`resolver`, `jwt`): `Promise`\<\{ `header`: `T`; `payload`: `U`; \}\>

Verify the JWT and return the decoded header and payload.

#### Type Parameters

##### T

`T` *extends* `JWTHeaderParameters`

##### U

`U` *extends* `JWTPayload`

#### Parameters

##### resolver

[`IIdentityResolverComponent`](../interfaces/IIdentityResolverComponent.md)

The resolver to use for finding the document.

##### jwt

`string`

The token to verify.

#### Returns

`Promise`\<\{ `header`: `T`; `payload`: `U`; \}\>

The decoded header and payload.

***

### verifyProof() {#verifyproof}

> `static` **verifyProof**(`resolver`, `secureDocument`): `Promise`\<`boolean`\>

Verify the proof for the document.

#### Parameters

##### resolver

[`IIdentityResolverComponent`](../interfaces/IIdentityResolverComponent.md)

The resolver to use for finding the document.

##### secureDocument

`IJsonLdNodeObject`

The secure document to verify.

#### Returns

`Promise`\<`boolean`\>

True if all proofs in the document are verified successfully.
