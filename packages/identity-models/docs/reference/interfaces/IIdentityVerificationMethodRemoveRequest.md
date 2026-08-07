# Interface: IIdentityVerificationMethodRemoveRequest

Request to remove a verification method.

## Properties

### pathParams {#pathparams}

> **pathParams**: `object`

The path parameters.

#### identity

> **identity**: `string`

The identity to remove the verification method from.

#### verificationMethodId

> **verificationMethodId**: `string`

The verification method to remove.

***

### query? {#query}

> `optional` **query?**: `object`

The query parameters.

#### removeKeys?

> `optional` **removeKeys?**: `string`

Also remove any associated private key from the vault.
