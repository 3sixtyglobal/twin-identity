# Interface: IIdentityVerifiableCredentialVerifyRequest

Request to verify a verifiable credential.

## Properties

### query?

> `optional` **query**: `object`

The path parameters.

#### jwt

> **jwt**: `string`

The jwt to verify.

***

### body?

> `optional` **body**: `object`

The body parameters.

#### credential

> **credential**: `IDidVerifiableCredential`

The verifiable credential to verify.
