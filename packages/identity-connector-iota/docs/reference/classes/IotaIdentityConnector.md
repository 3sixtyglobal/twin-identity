# Class: IotaIdentityConnector

Class for performing identity operations on IOTA.

This connector integrates with the TWIN Vault system to ensure secure
key management. Private keys are stored in the vault and signing operations
are delegated to the vault connector to prevent key exposure.

Security Implementation:
- Verifiable Credentials: JWT signing delegated to VaultConnectorHelper
- Verifiable Presentations: JWT signing delegated to VaultConnectorHelper
- Data Integrity Proofs: Async signing delegated to vault via signWithVault method

## See

 - VaultConnectorHelper for JWT signing implementation
 - signWithVault for Data Integrity Proof signing implementation

## Implements

- `IIdentityConnector`

## Constructors

### Constructor

> **new IotaIdentityConnector**(`options`): `IotaIdentityConnector`

Create a new instance of IotaIdentityConnector.

#### Parameters

##### options

[`IIotaIdentityConnectorConstructorOptions`](../interfaces/IIotaIdentityConnectorConstructorOptions.md)

The options for the identity connector.

#### Returns

`IotaIdentityConnector`

## Properties

### NAMESPACE {#namespace}

> `readonly` `static` **NAMESPACE**: `string` = `"iota"`

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

`IIdentityConnector.className`

***

### createDocument() {#createdocument}

> **createDocument**(`controller`): `Promise`\<`IDidDocument`\>

Create a new document.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

#### Returns

`Promise`\<`IDidDocument`\>

The created document.

#### Implementation of

`IIdentityConnector.createDocument`

***

### removeDocument() {#removedocument}

> **removeDocument**(`controller`, `documentId`): `Promise`\<`void`\>

Remove a document.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### documentId

`string`

The id of the document to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IIdentityConnector.removeDocument`

***

### addVerificationMethod() {#addverificationmethod}

> **addVerificationMethod**(`controller`, `documentId`, `verificationMethodType`, `verificationMethodId?`): `Promise`\<`IDidDocumentVerificationMethod`\>

Add a verification method to the document in JSON Web key Format.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### documentId

`string`

The id of the document to add the verification method to.

##### verificationMethodType

`DidVerificationMethodType`

The type of the verification method to add.

##### verificationMethodId?

`string`

The id of the verification method, if undefined uses the kid of the generated JWK.

#### Returns

`Promise`\<`IDidDocumentVerificationMethod`\>

The verification method.

#### Throws

NotFoundError if the id can not be resolved.

#### Throws

NotSupportedError if the platform does not support multiple keys.

#### Implementation of

`IIdentityConnector.addVerificationMethod`

***

### removeVerificationMethod() {#removeverificationmethod}

> **removeVerificationMethod**(`controller`, `verificationMethodId`): `Promise`\<`void`\>

Remove a verification method from the document.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### verificationMethodId

`string`

The id of the verification method.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Throws

NotFoundError if the id can not be resolved.

#### Throws

NotSupportedError if the platform does not support multiple revocable keys.

#### Implementation of

`IIdentityConnector.removeVerificationMethod`

***

### addService() {#addservice}

> **addService**(`controller`, `documentId`, `serviceId`, `serviceType`, `serviceEndpoint`): `Promise`\<`IDidService`\>

Add a service to the document.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### documentId

`string`

The id of the document to add the service to.

##### serviceId

`string`

The id of the service.

##### serviceType

`string` \| `string`[]

The type of the service.

##### serviceEndpoint

`string` \| `string`[]

The endpoint for the service.

#### Returns

`Promise`\<`IDidService`\>

The service.

#### Throws

NotFoundError if the id can not be resolved.

#### Implementation of

`IIdentityConnector.addService`

***

### removeService() {#removeservice}

> **removeService**(`controller`, `serviceId`): `Promise`\<`void`\>

Remove a service from the document.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### serviceId

`string`

The id of the service.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Throws

NotFoundError if the id can not be resolved.

#### Implementation of

`IIdentityConnector.removeService`

***

### createVerifiableCredential() {#createverifiablecredential}

> **createVerifiableCredential**(`controller`, `verificationMethodId`, `id`, `subject`, `options?`): `Promise`\<\{ `verifiableCredential`: `IDidVerifiableCredential`; `jwt`: `string`; \}\>

Create a verifiable credential for a verification method.
The credential is signed using the vault connector to ensure the private key
never leaves the secure vault environment.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### verificationMethodId

`string`

The verification method id to use.

##### id

`string` \| `undefined`

The id of the credential.

##### subject

`IJsonLdNodeObject`

The credential subject to store in the verifiable credential.

##### options?

Additional options for creating the verifiable credential.

###### revocationIndex?

`number`

The bitmap revocation index of the credential, if undefined will not have revocation status.

###### expirationDate?

`Date`

The date the verifiable credential is valid until.

#### Returns

`Promise`\<\{ `verifiableCredential`: `IDidVerifiableCredential`; `jwt`: `string`; \}\>

The created verifiable credential and its token.

#### Throws

NotFoundError if the id can not be resolved.

#### Throws

GeneralError if signature operation fails.

#### Implementation of

`IIdentityConnector.createVerifiableCredential`

***

### checkVerifiableCredential() {#checkverifiablecredential}

> **checkVerifiableCredential**(`credential`): `Promise`\<\{ `revoked`: `boolean`; `verifiableCredential?`: `IDidVerifiableCredential`; \}\>

Check a verifiable credential is valid.

#### Parameters

##### credential

`string` \| `IDidVerifiableCredential`

The credential to verify.

#### Returns

`Promise`\<\{ `revoked`: `boolean`; `verifiableCredential?`: `IDidVerifiableCredential`; \}\>

The credential stored in the jwt and the revocation status.

#### Implementation of

`IIdentityConnector.checkVerifiableCredential`

***

### revokeVerifiableCredentials() {#revokeverifiablecredentials}

> **revokeVerifiableCredentials**(`controller`, `issuerDocumentId`, `credentialIndices`): `Promise`\<`void`\>

Revoke verifiable credential(s).

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### issuerDocumentId

`string`

The id of the document to update the revocation list for.

##### credentialIndices

`number`[]

The revocation bitmap index or indices to revoke.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IIdentityConnector.revokeVerifiableCredentials`

***

### unrevokeVerifiableCredentials() {#unrevokeverifiablecredentials}

> **unrevokeVerifiableCredentials**(`controller`, `issuerDocumentId`, `credentialIndices`): `Promise`\<`void`\>

Unrevoke verifiable credential(s).

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### issuerDocumentId

`string`

The id of the document to update the revocation list for.

##### credentialIndices

`number`[]

The revocation bitmap index or indices to un revoke.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IIdentityConnector.unrevokeVerifiableCredentials`

***

### createVerifiablePresentation() {#createverifiablepresentation}

> **createVerifiablePresentation**(`controller`, `verificationMethodId`, `presentationId`, `contexts`, `types`, `verifiableCredentials`, `options?`): `Promise`\<\{ `verifiablePresentation`: `IDidVerifiablePresentation`; `jwt`: `string`; \}\>

Create a verifiable presentation from the supplied verifiable credentials.
The presentation is signed using the vault connector to ensure the private key
never leaves the secure vault environment.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### verificationMethodId

`string`

The method to associate with the presentation.

##### presentationId

`string` \| `undefined`

The id of the presentation.

##### contexts

`IJsonLdContextDefinitionRoot` \| `undefined`

The contexts for the data stored in the verifiable credential.

##### types

`string` \| `string`[] \| `undefined`

The types for the data stored in the verifiable credential.

##### verifiableCredentials

(`string` \| `IDidVerifiableCredential`)[]

The credentials to use for creating the presentation in jwt format.

##### options?

Additional options for creating the verifiable presentation.

###### expirationDate?

`Date`

The date the verifiable presentation is valid until.

#### Returns

`Promise`\<\{ `verifiablePresentation`: `IDidVerifiablePresentation`; `jwt`: `string`; \}\>

The created verifiable presentation and its token.

#### Throws

NotFoundError if the id can not be resolved.

#### Throws

GeneralError if signature operation fails.

#### Implementation of

`IIdentityConnector.createVerifiablePresentation`

***

### checkVerifiablePresentation() {#checkverifiablepresentation}

> **checkVerifiablePresentation**(`presentationJwt`): `Promise`\<\{ `revoked`: `boolean`; `verifiablePresentation?`: `IDidVerifiablePresentation`; `issuers?`: `IDidDocument`[]; \}\>

Check a verifiable presentation is valid.

#### Parameters

##### presentationJwt

`string`

The presentation to verify.

#### Returns

`Promise`\<\{ `revoked`: `boolean`; `verifiablePresentation?`: `IDidVerifiablePresentation`; `issuers?`: `IDidDocument`[]; \}\>

The presentation stored in the jwt and the revocation status.

#### Implementation of

`IIdentityConnector.checkVerifiablePresentation`

***

### createProof() {#createproof}

> **createProof**(`controller`, `verificationMethodId`, `proofType`, `unsecureDocument`): `Promise`\<`IProof`\>

Create a proof for arbitrary data with the specified verification method.

This method uses async signing to ensure the private key never leaves the vault.
The signing operation is delegated to the vault connector through a callback,
with algorithm validation to ensure key type compatibility.

#### Parameters

##### controller

`string`

The controller of the identity who can make changes.

##### verificationMethodId

`string`

The verification method id to use.

##### proofType

`ProofTypes`

The type of proof to create.

##### unsecureDocument

`IJsonLdNodeObject`

The unsecure document to create the proof for.

#### Returns

`Promise`\<`IProof`\>

The proof.

#### Throws

NotFoundError if the id can not be resolved.

#### Throws

GeneralError if the proof creation fails or if there is an algorithm/key type mismatch.

#### Implementation of

`IIdentityConnector.createProof`

***

### verifyProof() {#verifyproof}

> **verifyProof**(`document`, `proof`): `Promise`\<`boolean`\>

Verify proof for arbitrary data with the specified verification method.

#### Parameters

##### document

`IJsonLdNodeObject`

The document to verify.

##### proof

`IProof`

The proof to verify.

#### Returns

`Promise`\<`boolean`\>

True if the proof is verified.

#### Implementation of

`IIdentityConnector.verifyProof`
