# Changelog

## [0.9.1-next.3](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.9.1-next.2...identity-cli-v0.9.1-next.3) (2026-07-09)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.2 to 0.9.1-next.3
    * @twin.org/identity-connector-iota bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.9.1-next.1...identity-cli-v0.9.1-next.2) (2026-06-29)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.1 to 0.9.1-next.2
    * @twin.org/identity-connector-iota bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.9.1-next.0...identity-cli-v0.9.1-next.1) (2026-06-26)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update dependencies ([c4d9393](https://github.com/iotaledger/twin-identity/commit/c4d939309ffea6937fe938f6097fd811677ab220))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correct vault usage in cli commands ([#106](https://github.com/iotaledger/twin-identity/issues/106)) ([d81671d](https://github.com/iotaledger/twin-identity/commit/d81671d994390c9db7ded82e5f42b4bc521603fc))
* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([47d361a](https://github.com/iotaledger/twin-identity/commit/47d361ae333fe39885df96b40abcb6cd22c3f67d))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.0 to 0.9.1-next.1
    * @twin.org/identity-connector-iota bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.9.0...identity-cli-v0.9.0) (2026-06-25)


### Features

* release to production ([dabf4c5](https://github.com/iotaledger/twin-identity/commit/dabf4c5bb19e04c09bfbc8533f23dc9d42b35e4c))
* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))
* release to production ([#161](https://github.com/iotaledger/twin-identity/issues/161)) ([ad151fa](https://github.com/iotaledger/twin-identity/commit/ad151facfcaadc1d183d935a6db525379d48002f))

## [0.9.0-next.1](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.9.0-next.0...identity-cli-v0.9.0-next.1) (2026-06-23)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update dependencies ([c4d9393](https://github.com/iotaledger/twin-identity/commit/c4d939309ffea6937fe938f6097fd811677ab220))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correct vault usage in cli commands ([#106](https://github.com/iotaledger/twin-identity/issues/106)) ([d81671d](https://github.com/iotaledger/twin-identity/commit/d81671d994390c9db7ded82e5f42b4bc521603fc))
* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([47d361a](https://github.com/iotaledger/twin-identity/commit/47d361ae333fe39885df96b40abcb6cd22c3f67d))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.0-next.0 to 0.9.0-next.1
    * @twin.org/identity-connector-iota bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.36](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.35...identity-cli-v0.0.3-next.36) (2026-06-17)


### Features

* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))


### Bug Fixes

* use async getStore in tests ([47d361a](https://github.com/iotaledger/twin-identity/commit/47d361ae333fe39885df96b40abcb6cd22c3f67d))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.35 to 0.0.3-next.36
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.35 to 0.0.3-next.36

## [0.0.3-next.35](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.34...identity-cli-v0.0.3-next.35) (2026-06-01)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.34 to 0.0.3-next.35
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.34 to 0.0.3-next.35

## [0.0.3-next.34](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.33...identity-cli-v0.0.3-next.34) (2026-06-01)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update dependencies ([c4d9393](https://github.com/iotaledger/twin-identity/commit/c4d939309ffea6937fe938f6097fd811677ab220))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correct vault usage in cli commands ([#106](https://github.com/iotaledger/twin-identity/issues/106)) ([d81671d](https://github.com/iotaledger/twin-identity/commit/d81671d994390c9db7ded82e5f42b4bc521603fc))
* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.33 to 0.0.3-next.34
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.33 to 0.0.3-next.34

## [0.0.3-next.33](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.32...identity-cli-v0.0.3-next.33) (2026-06-01)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update dependencies ([c4d9393](https://github.com/iotaledger/twin-identity/commit/c4d939309ffea6937fe938f6097fd811677ab220))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correct vault usage in cli commands ([#106](https://github.com/iotaledger/twin-identity/issues/106)) ([d81671d](https://github.com/iotaledger/twin-identity/commit/d81671d994390c9db7ded82e5f42b4bc521603fc))
* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.32 to 0.0.3-next.33
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.32 to 0.0.3-next.33

## [0.0.3-next.32](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.31...identity-cli-v0.0.3-next.32) (2026-06-01)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.31 to 0.0.3-next.32
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.31 to 0.0.3-next.32

## [0.0.3-next.31](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.30...identity-cli-v0.0.3-next.31) (2026-05-28)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.30 to 0.0.3-next.31
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.30 to 0.0.3-next.31

## [0.0.3-next.30](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.29...identity-cli-v0.0.3-next.30) (2026-05-28)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.29 to 0.0.3-next.30
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.29 to 0.0.3-next.30

## [0.0.3-next.29](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.28...identity-cli-v0.0.3-next.29) (2026-05-22)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.28 to 0.0.3-next.29
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.28 to 0.0.3-next.29

## [0.0.3-next.28](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.27...identity-cli-v0.0.3-next.28) (2026-05-21)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.27 to 0.0.3-next.28
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.27 to 0.0.3-next.28

## [0.0.3-next.27](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.26...identity-cli-v0.0.3-next.27) (2026-05-21)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.26 to 0.0.3-next.27
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.26 to 0.0.3-next.27

## [0.0.3-next.26](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.25...identity-cli-v0.0.3-next.26) (2026-05-21)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.25 to 0.0.3-next.26
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.25 to 0.0.3-next.26

## [0.0.3-next.25](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.24...identity-cli-v0.0.3-next.25) (2026-05-20)


### Features

* update dependencies ([c4d9393](https://github.com/iotaledger/twin-identity/commit/c4d939309ffea6937fe938f6097fd811677ab220))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.24 to 0.0.3-next.25
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.24 to 0.0.3-next.25

## [0.0.3-next.24](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.23...identity-cli-v0.0.3-next.24) (2026-05-13)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.23 to 0.0.3-next.24
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.23 to 0.0.3-next.24

## [0.0.3-next.23](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.22...identity-cli-v0.0.3-next.23) (2026-05-12)


### Features

* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.22 to 0.0.3-next.23
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.22 to 0.0.3-next.23

## [0.0.3-next.22](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.21...identity-cli-v0.0.3-next.22) (2026-05-07)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.21 to 0.0.3-next.22
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.21 to 0.0.3-next.22

## [0.0.3-next.21](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.20...identity-cli-v0.0.3-next.21) (2026-05-07)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.20 to 0.0.3-next.21
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.20 to 0.0.3-next.21

## [0.0.3-next.20](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.19...identity-cli-v0.0.3-next.20) (2026-04-29)


### Features

* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.19 to 0.0.3-next.20
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.19 to 0.0.3-next.20

## [0.0.3-next.19](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.18...identity-cli-v0.0.3-next.19) (2026-04-29)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.18 to 0.0.3-next.19
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.18 to 0.0.3-next.19

## [0.0.3-next.18](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.17...identity-cli-v0.0.3-next.18) (2026-02-27)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.17 to 0.0.3-next.18
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.17 to 0.0.3-next.18

## [0.0.3-next.17](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.16...identity-cli-v0.0.3-next.17) (2026-02-24)


### Features

* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.16 to 0.0.3-next.17
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.16 to 0.0.3-next.17

## [0.0.3-next.16](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.15...identity-cli-v0.0.3-next.16) (2026-02-13)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.15 to 0.0.3-next.16
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.14...identity-cli-v0.0.3-next.15) (2026-02-12)


### Bug Fixes

* correct vault usage in cli commands ([#106](https://github.com/iotaledger/twin-identity/issues/106)) ([d81671d](https://github.com/iotaledger/twin-identity/commit/d81671d994390c9db7ded82e5f42b4bc521603fc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.14 to 0.0.3-next.15
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.14 to 0.0.3-next.15

## [0.0.3-next.14](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.13...identity-cli-v0.0.3-next.14) (2026-02-10)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.13 to 0.0.3-next.14
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.13 to 0.0.3-next.14

## [0.0.3-next.13](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.12...identity-cli-v0.0.3-next.13) (2026-01-21)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.12 to 0.0.3-next.13
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.11...identity-cli-v0.0.3-next.12) (2026-01-19)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.11 to 0.0.3-next.12
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.10...identity-cli-v0.0.3-next.11) (2026-01-15)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.10 to 0.0.3-next.11
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.9...identity-cli-v0.0.3-next.10) (2026-01-15)


### Bug Fixes

* expiration date coerced to full date time ([83e94e3](https://github.com/iotaledger/twin-identity/commit/83e94e3fc2b982fbb41f87a177e0e79a7f2e4079))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.9 to 0.0.3-next.10
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.8...identity-cli-v0.0.3-next.9) (2026-01-14)


### Bug Fixes

* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.8 to 0.0.3-next.9
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.7...identity-cli-v0.0.3-next.8) (2026-01-14)


### Features

* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.7 to 0.0.3-next.8
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.6...identity-cli-v0.0.3-next.7) (2026-01-13)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.6 to 0.0.3-next.7
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.5...identity-cli-v0.0.3-next.6) (2025-11-26)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.5 to 0.0.3-next.6
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.4...identity-cli-v0.0.3-next.5) (2025-11-20)


### Bug Fixes

* remove unused address index params in CLI ([c4c0cc1](https://github.com/iotaledger/twin-identity/commit/c4c0cc18e17804380cf52330e1b9de8716cc193d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.4 to 0.0.3-next.5
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.3...identity-cli-v0.0.3-next.4) (2025-11-17)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.3 to 0.0.3-next.4
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.2...identity-cli-v0.0.3-next.3) (2025-11-17)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.2 to 0.0.3-next.3
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.1...identity-cli-v0.0.3-next.2) (2025-11-14)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.1 to 0.0.3-next.2
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.1 to 0.0.3-next.2

## [0.0.3-next.1](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.3-next.0...identity-cli-v0.0.3-next.1) (2025-11-11)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.0 to 0.0.3-next.1
    * @twin.org/identity-connector-iota bumped from 0.0.3-next.0 to 0.0.3-next.1

## [0.0.2-next.10](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.9...identity-cli-v0.0.2-next.10) (2025-10-27)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.9 to 0.0.2-next.10
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.9 to 0.0.2-next.10

## [0.0.2-next.9](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.8...identity-cli-v0.0.2-next.9) (2025-10-09)


### Features

* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.8 to 0.0.2-next.9
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.8 to 0.0.2-next.9

## [0.0.2-next.8](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.7...identity-cli-v0.0.2-next.8) (2025-09-25)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.7 to 0.0.2-next.8
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.7 to 0.0.2-next.8

## [0.0.2-next.7](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.6...identity-cli-v0.0.2-next.7) (2025-09-23)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.6 to 0.0.2-next.7
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.6 to 0.0.2-next.7

## [0.0.2-next.6](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.5...identity-cli-v0.0.2-next.6) (2025-09-23)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.5 to 0.0.2-next.6
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.5 to 0.0.2-next.6

## [0.0.2-next.5](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.4...identity-cli-v0.0.2-next.5) (2025-09-15)


### Features

* add addressIndex option to all commands ([a644674](https://github.com/iotaledger/twin-identity/commit/a644674017d1a8fe5d8685950316bec922a9b195))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.4 to 0.0.2-next.5
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.4 to 0.0.2-next.5

## [0.0.2-next.4](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.3...identity-cli-v0.0.2-next.4) (2025-09-12)


### Features

* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.3 to 0.0.2-next.4
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.3 to 0.0.2-next.4

## [0.0.2-next.3](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.2...identity-cli-v0.0.2-next.3) (2025-08-29)


### Features

* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.2 to 0.0.2-next.3
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.2 to 0.0.2-next.3

## [0.0.2-next.2](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.1...identity-cli-v0.0.2-next.2) (2025-08-20)


### Features

* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.1 to 0.0.2-next.2
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.1 to 0.0.2-next.2

## [0.0.2-next.1](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.2-next.0...identity-cli-v0.0.2-next.1) (2025-08-18)


### Features

* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* correctly display mainnet explorer urls ([45a9f3c](https://github.com/iotaledger/twin-identity/commit/45a9f3cc041cce7b40a86e98df306931a95f48ea))
* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.0 to 0.0.2-next.1
    * @twin.org/identity-connector-iota bumped from 0.0.2-next.0 to 0.0.2-next.1

## 0.0.1 (2025-07-08)


### Features

* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from ^0.0.0 to ^0.0.1
    * @twin.org/identity-connector-iota bumped from ^0.0.0 to ^0.0.1

## [0.0.1-next.57](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.56...identity-cli-v0.0.1-next.57) (2025-07-08)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.56 to 0.0.1-next.57
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.56 to 0.0.1-next.57

## [0.0.1-next.56](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.55...identity-cli-v0.0.1-next.56) (2025-06-30)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.55 to 0.0.1-next.56
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.55 to 0.0.1-next.56

## [0.0.1-next.55](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.54...identity-cli-v0.0.1-next.55) (2025-06-26)


### Features

* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))
* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Bug Fixes

* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.54 to 0.0.1-next.55
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.54 to 0.0.1-next.55

## [0.0.1-next.54](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.53...identity-cli-v0.0.1-next.54) (2025-06-26)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.53 to 0.0.1-next.54
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.53 to 0.0.1-next.54

## [0.0.1-next.53](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.52...identity-cli-v0.0.1-next.53) (2025-06-23)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.52 to 0.0.1-next.53
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.52 to 0.0.1-next.53

## [0.0.1-next.52](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.51...identity-cli-v0.0.1-next.52) (2025-06-20)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.51 to 0.0.1-next.52
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.51 to 0.0.1-next.52

## [0.0.1-next.51](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.50...identity-cli-v0.0.1-next.51) (2025-06-19)


### Features

* support mainnet for alias extraction ([1114e0f](https://github.com/iotaledger/twin-identity/commit/1114e0f518070ef930d7d6ed73a616cce647206c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.50 to 0.0.1-next.51
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.50 to 0.0.1-next.51

## [0.0.1-next.50](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.49...identity-cli-v0.0.1-next.50) (2025-06-19)


### Features

* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.49 to 0.0.1-next.50
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.49 to 0.0.1-next.50

## [0.0.1-next.49](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.48...identity-cli-v0.0.1-next.49) (2025-06-18)


### Features

* verification method output JWK and hex on CLI ([49db9da](https://github.com/iotaledger/twin-identity/commit/49db9da2371eafdcd7176ce44303961b9b8b8380))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.48 to 0.0.1-next.49
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.48 to 0.0.1-next.49

## [0.0.1-next.48](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.47...identity-cli-v0.0.1-next.48) (2025-06-17)


### Features

* add mainnet support ([af56a38](https://github.com/iotaledger/twin-identity/commit/af56a382837896cd4e13d5814c0924c46658b99c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.47 to 0.0.1-next.48
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.47 to 0.0.1-next.48

## [0.0.1-next.47](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.46...identity-cli-v0.0.1-next.47) (2025-06-12)


### Features

* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.46 to 0.0.1-next.47
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.46 to 0.0.1-next.47

## [0.0.1-next.46](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.45...identity-cli-v0.0.1-next.46) (2025-05-20)


### Features

* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.45 to 0.0.1-next.46
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.45 to 0.0.1-next.46

## [0.0.1-next.45](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.44...identity-cli-v0.0.1-next.45) (2025-05-06)


### Features

* iota rebased release ([5d14674](https://github.com/iotaledger/twin-identity/commit/5d146744ca9eed622ef7eb34a7fa935216f9e975))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.44 to 0.0.1-next.45
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.44 to 0.0.1-next.45

## [0.0.1-next.44](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.43...identity-cli-v0.0.1-next.44) (2025-04-30)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.43 to 0.0.1-next.44
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.43 to 0.0.1-next.44

## [0.0.1-next.43](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.42...identity-cli-v0.0.1-next.43) (2025-04-25)


### Bug Fixes

* explorer urls in CLI ([82a745d](https://github.com/iotaledger/twin-identity/commit/82a745d536e8fe42554e7ad92a7468a653fc0cfb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.42 to 0.0.1-next.43
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.42 to 0.0.1-next.43

## [0.0.1-next.42](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.41...identity-cli-v0.0.1-next.42) (2025-04-17)


### Features

* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.41 to 0.0.1-next.42
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.41 to 0.0.1-next.42

## [0.0.1-next.41](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.40...identity-cli-v0.0.1-next.41) (2025-04-09)


### Miscellaneous Chores

* **identity-cli:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.40 to 0.0.1-next.41
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.40 to 0.0.1-next.41

## [0.0.1-next.40](https://github.com/iotaledger/twin-identity/compare/identity-cli-v0.0.1-next.39...identity-cli-v0.0.1-next.40) (2025-03-28)


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.39 to 0.0.1-next.40
    * @twin.org/identity-connector-iota bumped from 0.0.1-next.39 to 0.0.1-next.40

## v0.0.1-next.39

- Initial Release
