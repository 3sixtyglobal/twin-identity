# TWIN Identity

The identity-connector-iota package enables identity workflows on IOTA infrastructure, including DID-oriented operations that align with standards-based identity practices. It acts as the network connector layer between repository-level abstractions and IOTA-specific implementation details.

## Installation

```shell
npm install @twin.org/identity-connector-iota
```

## Docker

To perform testing of this component it may be necessary to launch a local instance of the gas station to communicate with.

```shell
docker run -d --name twin-gas-station-test -p 6379:6379 -p 9527:9527 -p 9184:9184 -e IOTA_NODE_URL="https://api.testnet.iota.cafe" -e GAS_STATION_AUTH="qEyCL6d9BKKFl/tfDGAKeGFkhUlf7FkqiGV7Xw4JUsI=" -e GAS_STATION_KEYPAIR="..." twinfoundation/twin-gas-station-test:latest
```

To generate `GAS_STATION_KEYPAIR` see <https://github.com/iotaledger/twin-dlt/blob/main/packages/dlt-iota/README.md>

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
