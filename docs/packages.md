# Identity Packages

## identity-models

The package serves as a foundational component for identity integration in this repository. Its primary purpose is to provide shared models and contracts that keep payload structures consistent across services, connectors, and clients. By doing so, it reduces integration drift and helps teams build interoperable identity flows on top of standards such as [W3C DID Core](https://www.w3.org/TR/did-core/).

- [README](../packages/identity-models/README.md)
- [Examples](../packages/identity-models/docs/examples.md)
- [Changelog](../packages/identity-models/docs/changelog.md)

## identity-connector-entity-storage

This package is designed to persist and retrieve identity records through an entity storage layer with predictable behaviour. It plays a key role in making identity lifecycle operations reliable across environments where storage semantics need to remain clear and reusable.

- [README](../packages/identity-connector-entity-storage/README.md)
- [Examples](../packages/identity-connector-entity-storage/docs/examples.md)
- [Changelog](../packages/identity-connector-entity-storage/docs/changelog.md)

## identity-service

The package addresses service-side identity orchestration by defining contracts and REST endpoint boundaries that can be consumed consistently by multiple clients and connectors. This approach supports maintainability and semantic clarity when identity capabilities are exposed through backend services.

- [README](../packages/identity-service/README.md)
- [Examples](../packages/identity-service/docs/examples.md)
- [Changelog](../packages/identity-service/docs/changelog.md)

## identity-rest-client

This package focuses on application-side integration with identity APIs by providing a reusable client layer for shared service contracts. It helps ensure that request and response handling remains aligned across consumer applications, reducing duplication and improving interoperability.

- [README](../packages/identity-rest-client/README.md)
- [Examples](../packages/identity-rest-client/docs/examples.md)
- [Changelog](../packages/identity-rest-client/docs/changelog.md)

## identity-connector-iota

The package provides network integration for identity and DID operations on IOTA infrastructure. It bridges repository-level abstractions and network-level execution, and aligns with standards-oriented identity practices described by [W3C DID Core](https://www.w3.org/TR/did-core/) and [IOTA Identity](https://wiki.iota.org/identity.rs/welcome/).

- [README](../packages/identity-connector-iota/README.md)
- [Examples](../packages/identity-connector-iota/docs/examples.md)
- [Changelog](../packages/identity-connector-iota/docs/changelog.md)

## identity-connector-universal

This package provides DID resolution through the [Universal Resolver](https://dev.uniresolver.io/) ecosystem so identity data can be handled across multiple DID methods without tightly coupling to one network implementation. Its role is to strengthen interoperability for standards-based identity workflows.

- [README](../packages/identity-connector-universal/README.md)
- [Examples](../packages/identity-connector-universal/docs/examples.md)
- [Changelog](../packages/identity-connector-universal/docs/changelog.md)
