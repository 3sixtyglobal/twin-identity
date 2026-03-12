# Interface: IIdentityVerifiablePresentationCreateRequest

Request to create a verifiable presentation.

## Properties

### pathParams {#pathparams}

> **pathParams**: `object`

The path parameters.

#### identity

> **identity**: `string`

The identity to create the verification presentation for.

#### verificationMethodId

> **verificationMethodId**: `string`

The verification method id to use.

***

### body {#body}

> **body**: `object`

The data for the request.

#### presentationId?

> `optional` **presentationId**: `string`

The id of the presentation.

#### contexts?

> `optional` **contexts**: `IJsonLdContextDefinitionRoot`

The context to use for the presentation.

#### types?

> `optional` **types**: `string` \| `string`[]

The types of the presentation.

#### verifiableCredentials

> **verifiableCredentials**: (`string` \| `IDidVerifiableCredential`)[]

The verifiable credentials to include in the presentation.

#### expirationDate?

> `optional` **expirationDate**: `string`

The expiration date/time for the presentation.
