# @twin.org/identity-connector-entity-storage- Changelog

## [0.10.1-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.10.1-next.2...identity-connector-entity-storage-v0.10.1-next.3) (2026-09-23)


### Bug Fixes

* check vp holder ([#241](https://github.com/iotaledger/twin-identity/issues/241)) ([e752a45](https://github.com/iotaledger/twin-identity/commit/e752a45bd2949c4d9c9cc4882379304879f9ef45))
* identity controller check ([#240](https://github.com/iotaledger/twin-identity/issues/240)) ([6bb8bc4](https://github.com/iotaledger/twin-identity/commit/6bb8bc448d8fcd96280062eeb37abb08b2a28081))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.10.1-next.2 to 0.10.1-next.3

## [0.10.1-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.10.1-next.1...identity-connector-entity-storage-v0.10.1-next.2) (2026-09-23)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.10.1-next.1 to 0.10.1-next.2

## [0.10.1-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.10.1-next.0...identity-connector-entity-storage-v0.10.1-next.1) (2026-09-18)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add own-DID resolution caching to EntityStorageIdentityConnector ([#216](https://github.com/iotaledger/twin-identity/issues/216)) ([a4c170b](https://github.com/iotaledger/twin-identity/commit/a4c170be83d00f2bf53d70056321d53a3b22f940))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* did resolver caching ([#220](https://github.com/iotaledger/twin-identity/issues/220)) ([fdcbf65](https://github.com/iotaledger/twin-identity/commit/fdcbf65fb6f9deef82e8c32a98835edaf6608e90))
* ensure credential subject exists ([3847e82](https://github.com/iotaledger/twin-identity/commit/3847e8250ac5abd1fffcd1a72d3157f32d08478c))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* health and key removal ([#191](https://github.com/iotaledger/twin-identity/issues/191)) ([8504101](https://github.com/iotaledger/twin-identity/commit/8504101a7a08b2a042a4e59f666c245308527088))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* improve entity schemas ([53156b6](https://github.com/iotaledger/twin-identity/commit/53156b6491d740eb6bc3b5d5abea7d2987e08701))
* increase resolve timeout ([523e5b6](https://github.com/iotaledger/twin-identity/commit/523e5b6375dbac06278d309bec8ca383a8e81807))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* enforce credentialStatus, validity period and assertionMethod scope on object-form verification ([#215](https://github.com/iotaledger/twin-identity/issues/215)) ([8e6eb92](https://github.com/iotaledger/twin-identity/commit/8e6eb920564e0fe4ebdc984bdf682b7779f747d0))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* proof verification ([#186](https://github.com/iotaledger/twin-identity/issues/186)) ([6e926be](https://github.com/iotaledger/twin-identity/commit/6e926be25c333ea7df6ead503a9b99e4e46286fe))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.10.1-next.0 to 0.10.1-next.1

## [0.10.0](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.10.0...identity-connector-entity-storage-v0.10.0) (2026-09-16)


### Features

* release to production ([dabf4c5](https://github.com/iotaledger/twin-identity/commit/dabf4c5bb19e04c09bfbc8533f23dc9d42b35e4c))
* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))
* release to production ([#161](https://github.com/iotaledger/twin-identity/issues/161)) ([ad151fa](https://github.com/iotaledger/twin-identity/commit/ad151facfcaadc1d183d935a6db525379d48002f))
* release to production ([#179](https://github.com/iotaledger/twin-identity/issues/179)) ([062816b](https://github.com/iotaledger/twin-identity/commit/062816b110776b7e60f89b04142d42c6f24890a8))
* release to production ([#210](https://github.com/iotaledger/twin-identity/issues/210)) ([aec2d45](https://github.com/iotaledger/twin-identity/commit/aec2d45ed55b8bf96638dee835f54629170943ad))
* release to production [skip ci] ([#232](https://github.com/iotaledger/twin-identity/issues/232)) ([0d53444](https://github.com/iotaledger/twin-identity/commit/0d5344411ef65c0dd94bdae6bd4935a5c01e4a41))

## [0.9.3-next.4](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.3-next.3...identity-connector-entity-storage-v0.9.3-next.4) (2026-09-09)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.3-next.3 to 0.9.3-next.4

## [0.9.3-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.3-next.2...identity-connector-entity-storage-v0.9.3-next.3) (2026-09-07)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.3-next.2 to 0.9.3-next.3

## [0.9.3-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.3-next.1...identity-connector-entity-storage-v0.9.3-next.2) (2026-09-04)


### Features

* did resolver caching ([#220](https://github.com/iotaledger/twin-identity/issues/220)) ([fdcbf65](https://github.com/iotaledger/twin-identity/commit/fdcbf65fb6f9deef82e8c32a98835edaf6608e90))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.3-next.1 to 0.9.3-next.2

## [0.9.3-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.3-next.0...identity-connector-entity-storage-v0.9.3-next.1) (2026-08-26)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add own-DID resolution caching to EntityStorageIdentityConnector ([#216](https://github.com/iotaledger/twin-identity/issues/216)) ([a4c170b](https://github.com/iotaledger/twin-identity/commit/a4c170be83d00f2bf53d70056321d53a3b22f940))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* ensure credential subject exists ([3847e82](https://github.com/iotaledger/twin-identity/commit/3847e8250ac5abd1fffcd1a72d3157f32d08478c))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* health and key removal ([#191](https://github.com/iotaledger/twin-identity/issues/191)) ([8504101](https://github.com/iotaledger/twin-identity/commit/8504101a7a08b2a042a4e59f666c245308527088))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* increase resolve timeout ([523e5b6](https://github.com/iotaledger/twin-identity/commit/523e5b6375dbac06278d309bec8ca383a8e81807))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* enforce credentialStatus, validity period and assertionMethod scope on object-form verification ([#215](https://github.com/iotaledger/twin-identity/issues/215)) ([8e6eb92](https://github.com/iotaledger/twin-identity/commit/8e6eb920564e0fe4ebdc984bdf682b7779f747d0))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* proof verification ([#186](https://github.com/iotaledger/twin-identity/issues/186)) ([6e926be](https://github.com/iotaledger/twin-identity/commit/6e926be25c333ea7df6ead503a9b99e4e46286fe))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.3-next.0 to 0.9.3-next.1

## [0.9.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2...identity-connector-entity-storage-v0.9.2) (2026-08-24)


### Features

* release to production ([dabf4c5](https://github.com/iotaledger/twin-identity/commit/dabf4c5bb19e04c09bfbc8533f23dc9d42b35e4c))
* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))
* release to production ([#161](https://github.com/iotaledger/twin-identity/issues/161)) ([ad151fa](https://github.com/iotaledger/twin-identity/commit/ad151facfcaadc1d183d935a6db525379d48002f))
* release to production ([#179](https://github.com/iotaledger/twin-identity/issues/179)) ([062816b](https://github.com/iotaledger/twin-identity/commit/062816b110776b7e60f89b04142d42c6f24890a8))
* release to production ([#210](https://github.com/iotaledger/twin-identity/issues/210)) ([aec2d45](https://github.com/iotaledger/twin-identity/commit/aec2d45ed55b8bf96638dee835f54629170943ad))

## [0.9.2-next.10](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.9...identity-connector-entity-storage-v0.9.2-next.10) (2026-08-20)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.9 to 0.9.2-next.10

## [0.9.2-next.9](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.8...identity-connector-entity-storage-v0.9.2-next.9) (2026-08-14)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* ensure credential subject exists ([3847e82](https://github.com/iotaledger/twin-identity/commit/3847e8250ac5abd1fffcd1a72d3157f32d08478c))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* health and key removal ([#191](https://github.com/iotaledger/twin-identity/issues/191)) ([8504101](https://github.com/iotaledger/twin-identity/commit/8504101a7a08b2a042a4e59f666c245308527088))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* increase resolve timeout ([523e5b6](https://github.com/iotaledger/twin-identity/commit/523e5b6375dbac06278d309bec8ca383a8e81807))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* proof verification ([#186](https://github.com/iotaledger/twin-identity/issues/186)) ([6e926be](https://github.com/iotaledger/twin-identity/commit/6e926be25c333ea7df6ead503a9b99e4e46286fe))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.8 to 0.9.2-next.9

## [0.9.2-next.8](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.7...identity-connector-entity-storage-v0.9.2-next.8) (2026-08-14)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* ensure credential subject exists ([3847e82](https://github.com/iotaledger/twin-identity/commit/3847e8250ac5abd1fffcd1a72d3157f32d08478c))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* health and key removal ([#191](https://github.com/iotaledger/twin-identity/issues/191)) ([8504101](https://github.com/iotaledger/twin-identity/commit/8504101a7a08b2a042a4e59f666c245308527088))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* proof verification ([#186](https://github.com/iotaledger/twin-identity/issues/186)) ([6e926be](https://github.com/iotaledger/twin-identity/commit/6e926be25c333ea7df6ead503a9b99e4e46286fe))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.7 to 0.9.2-next.8

## [0.9.2-next.7](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.6...identity-connector-entity-storage-v0.9.2-next.7) (2026-08-14)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.6 to 0.9.2-next.7

## [0.9.2-next.6](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.5...identity-connector-entity-storage-v0.9.2-next.6) (2026-08-11)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.5 to 0.9.2-next.6

## [0.9.2-next.5](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.4...identity-connector-entity-storage-v0.9.2-next.5) (2026-08-10)


### Features

* ensure credential subject exists ([3847e82](https://github.com/iotaledger/twin-identity/commit/3847e8250ac5abd1fffcd1a72d3157f32d08478c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.4 to 0.9.2-next.5

## [0.9.2-next.4](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.3...identity-connector-entity-storage-v0.9.2-next.4) (2026-08-07)


### Features

* health and key removal ([#191](https://github.com/iotaledger/twin-identity/issues/191)) ([8504101](https://github.com/iotaledger/twin-identity/commit/8504101a7a08b2a042a4e59f666c245308527088))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.3 to 0.9.2-next.4

## [0.9.2-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.2...identity-connector-entity-storage-v0.9.2-next.3) (2026-08-03)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.2 to 0.9.2-next.3

## [0.9.2-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.1...identity-connector-entity-storage-v0.9.2-next.2) (2026-07-30)


### Bug Fixes

* proof verification ([#186](https://github.com/iotaledger/twin-identity/issues/186)) ([6e926be](https://github.com/iotaledger/twin-identity/commit/6e926be25c333ea7df6ead503a9b99e4e46286fe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.1 to 0.9.2-next.2

## [0.9.2-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.2-next.0...identity-connector-entity-storage-v0.9.2-next.1) (2026-07-29)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.2-next.0 to 0.9.2-next.1

## [0.9.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1...identity-connector-entity-storage-v0.9.1) (2026-07-27)


### Features

* release to production ([dabf4c5](https://github.com/iotaledger/twin-identity/commit/dabf4c5bb19e04c09bfbc8533f23dc9d42b35e4c))
* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))
* release to production ([#161](https://github.com/iotaledger/twin-identity/issues/161)) ([ad151fa](https://github.com/iotaledger/twin-identity/commit/ad151facfcaadc1d183d935a6db525379d48002f))
* release to production ([#179](https://github.com/iotaledger/twin-identity/issues/179)) ([062816b](https://github.com/iotaledger/twin-identity/commit/062816b110776b7e60f89b04142d42c6f24890a8))

## [0.9.1-next.5](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1-next.4...identity-connector-entity-storage-v0.9.1-next.5) (2026-07-17)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.4 to 0.9.1-next.5

## [0.9.1-next.4](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1-next.3...identity-connector-entity-storage-v0.9.1-next.4) (2026-07-09)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.3 to 0.9.1-next.4

## [0.9.1-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1-next.2...identity-connector-entity-storage-v0.9.1-next.3) (2026-07-09)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1-next.1...identity-connector-entity-storage-v0.9.1-next.2) (2026-06-29)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.1-next.0...identity-connector-entity-storage-v0.9.1-next.1) (2026-06-26)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.0...identity-connector-entity-storage-v0.9.0) (2026-06-25)


### Features

* release to production ([dabf4c5](https://github.com/iotaledger/twin-identity/commit/dabf4c5bb19e04c09bfbc8533f23dc9d42b35e4c))
* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))
* release to production ([#161](https://github.com/iotaledger/twin-identity/issues/161)) ([ad151fa](https://github.com/iotaledger/twin-identity/commit/ad151facfcaadc1d183d935a6db525379d48002f))

## [0.9.0-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.9.0-next.0...identity-connector-entity-storage-v0.9.0-next.1) (2026-06-23)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))
* common connector tests ([4f9642c](https://github.com/iotaledger/twin-identity/commit/4f9642ceb09843870909fc6819bf69fb20ef952a))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.36](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.35...identity-connector-entity-storage-v0.0.3-next.36) (2026-06-17)


### Features

* add vault signing ([#153](https://github.com/iotaledger/twin-identity/issues/153)) ([9458e4c](https://github.com/iotaledger/twin-identity/commit/9458e4c96ce19e0fc704905dfb3aac04dc6cf237))


### Bug Fixes

* use async getStore in tests ([cfc0d87](https://github.com/iotaledger/twin-identity/commit/cfc0d873532e8ab2010f86f05bffaad3bbaf5786))
* use async getStore in tests ([3424c81](https://github.com/iotaledger/twin-identity/commit/3424c81cf7407ede4a89a026072720d52bf689b2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.35 to 0.0.3-next.36

## [0.0.3-next.35](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.34...identity-connector-entity-storage-v0.0.3-next.35) (2026-06-01)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.34 to 0.0.3-next.35

## [0.0.3-next.34](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.33...identity-connector-entity-storage-v0.0.3-next.34) (2026-06-01)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.33 to 0.0.3-next.34

## [0.0.3-next.33](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.32...identity-connector-entity-storage-v0.0.3-next.33) (2026-06-01)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))
* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))
* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))
* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))
* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))
* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.32 to 0.0.3-next.33

## [0.0.3-next.32](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.31...identity-connector-entity-storage-v0.0.3-next.32) (2026-06-01)


### Bug Fixes

* identity subject type property ([#146](https://github.com/iotaledger/twin-identity/issues/146)) ([fe71dc6](https://github.com/iotaledger/twin-identity/commit/fe71dc66972120b42f1ff0e1dc8732cb48e1dd2a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.31 to 0.0.3-next.32

## [0.0.3-next.31](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.30...identity-connector-entity-storage-v0.0.3-next.31) (2026-05-28)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.30 to 0.0.3-next.31

## [0.0.3-next.30](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.29...identity-connector-entity-storage-v0.0.3-next.30) (2026-05-28)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.29 to 0.0.3-next.30

## [0.0.3-next.29](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.28...identity-connector-entity-storage-v0.0.3-next.29) (2026-05-22)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.28 to 0.0.3-next.29

## [0.0.3-next.28](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.27...identity-connector-entity-storage-v0.0.3-next.28) (2026-05-21)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.27 to 0.0.3-next.28

## [0.0.3-next.27](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.26...identity-connector-entity-storage-v0.0.3-next.27) (2026-05-21)


### Features

* add optional jwt payload and headers to vc and vp tokens ([#135](https://github.com/iotaledger/twin-identity/issues/135)) ([aa1de0f](https://github.com/iotaledger/twin-identity/commit/aa1de0f63be95ff62bae3c699aabc85ea93d74c2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.26 to 0.0.3-next.27

## [0.0.3-next.26](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.25...identity-connector-entity-storage-v0.0.3-next.26) (2026-05-21)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.25 to 0.0.3-next.26

## [0.0.3-next.25](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.24...identity-connector-entity-storage-v0.0.3-next.25) (2026-05-20)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.24 to 0.0.3-next.25

## [0.0.3-next.24](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.23...identity-connector-entity-storage-v0.0.3-next.24) (2026-05-13)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.23 to 0.0.3-next.24

## [0.0.3-next.23](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.22...identity-connector-entity-storage-v0.0.3-next.23) (2026-05-12)


### Features

* typescript 6 update ([e8806ad](https://github.com/iotaledger/twin-identity/commit/e8806ad6858c37be3c0f54c41cf654023773bef3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.22 to 0.0.3-next.23

## [0.0.3-next.22](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.21...identity-connector-entity-storage-v0.0.3-next.22) (2026-05-07)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.21 to 0.0.3-next.22

## [0.0.3-next.21](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.20...identity-connector-entity-storage-v0.0.3-next.21) (2026-05-07)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.20 to 0.0.3-next.21

## [0.0.3-next.20](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.19...identity-connector-entity-storage-v0.0.3-next.20) (2026-04-29)


### Features

* expanded cli methods ([#121](https://github.com/iotaledger/twin-identity/issues/121)) ([80a52b7](https://github.com/iotaledger/twin-identity/commit/80a52b779237cd633d1f2813fa976585cef6e551))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.19 to 0.0.3-next.20

## [0.0.3-next.19](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.18...identity-connector-entity-storage-v0.0.3-next.19) (2026-04-29)


### Features

* add addAlsoKnownAs to identity connector ([#117](https://github.com/iotaledger/twin-identity/issues/117)) ([aa27cff](https://github.com/iotaledger/twin-identity/commit/aa27cff88e61e7c8c6e32aeb437fb01c6ee9f57a))


### Bug Fixes

* linting ([08dd93e](https://github.com/iotaledger/twin-identity/commit/08dd93e7b6ba3877c9cd051533f08aff39733a5b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.18 to 0.0.3-next.19

## [0.0.3-next.18](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.17...identity-connector-entity-storage-v0.0.3-next.18) (2026-02-27)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.17 to 0.0.3-next.18

## [0.0.3-next.17](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.16...identity-connector-entity-storage-v0.0.3-next.17) (2026-02-24)


### Features

* implement async proof signing with vault security ([#110](https://github.com/iotaledger/twin-identity/issues/110)) ([9651c24](https://github.com/iotaledger/twin-identity/commit/9651c2492d63eca6545735f5638d3191e25bd185))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.16 to 0.0.3-next.17

## [0.0.3-next.16](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.15...identity-connector-entity-storage-v0.0.3-next.16) (2026-02-13)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.14...identity-connector-entity-storage-v0.0.3-next.15) (2026-02-12)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.14 to 0.0.3-next.15

## [0.0.3-next.14](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.13...identity-connector-entity-storage-v0.0.3-next.14) (2026-02-10)


### Features

* add proof to vc in entity storage connector ([2a968a1](https://github.com/iotaledger/twin-identity/commit/2a968a1a011cbafb8a0997234e069c91c4eaa793))
* add proof to vcs and verify vs documents ([#103](https://github.com/iotaledger/twin-identity/issues/103)) ([b60bf0c](https://github.com/iotaledger/twin-identity/commit/b60bf0cb7d453d67574c5c0e4f769e67cf7cd6d1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.13 to 0.0.3-next.14

## [0.0.3-next.13](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.12...identity-connector-entity-storage-v0.0.3-next.13) (2026-01-21)


### Features

* update contexts ([#100](https://github.com/iotaledger/twin-identity/issues/100)) ([7c17f98](https://github.com/iotaledger/twin-identity/commit/7c17f983110b2fc5db1b19531d0b2a7c53e02aaa))


### Bug Fixes

* use nameof for property guards ([9d571cf](https://github.com/iotaledger/twin-identity/commit/9d571cffae8838035fcbca8966795783013e1a99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.11...identity-connector-entity-storage-v0.0.3-next.12) (2026-01-19)


### Features

* remove auth generator ([#98](https://github.com/iotaledger/twin-identity/issues/98)) ([a8969e8](https://github.com/iotaledger/twin-identity/commit/a8969e85a5a2804abfc787406e2d12eb168dd978))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.10...identity-connector-entity-storage-v0.0.3-next.11) (2026-01-15)


### Features

* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* add exp to jwt payload in entity storage vc ([41f0fbd](https://github.com/iotaledger/twin-identity/commit/41f0fbd641b4fd1fe3b23f1a16f4748e09b31f50))
* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))
* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))
* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.9...identity-connector-entity-storage-v0.0.3-next.10) (2026-01-15)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.8...identity-connector-entity-storage-v0.0.3-next.9) (2026-01-14)


### Bug Fixes

* update vault key naming convention to use document ID prefix ([#94](https://github.com/iotaledger/twin-identity/issues/94)) ([ab125c1](https://github.com/iotaledger/twin-identity/commit/ab125c1b7eb189b5dceaddc69e5e53e33a0886db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.7...identity-connector-entity-storage-v0.0.3-next.8) (2026-01-14)


### Features

* update namespaces and contexts ([#90](https://github.com/iotaledger/twin-identity/issues/90)) ([0c34d64](https://github.com/iotaledger/twin-identity/commit/0c34d64add8cca77856fa2d0357e774d72fbbfc1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.6...identity-connector-entity-storage-v0.0.3-next.7) (2026-01-13)


### Bug Fixes

* associate vault keys with document not controller ([#86](https://github.com/iotaledger/twin-identity/issues/86)) ([6430f4b](https://github.com/iotaledger/twin-identity/commit/6430f4b559315a1fe99b60c6db1c661d317bc243))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.5...identity-connector-entity-storage-v0.0.3-next.6) (2025-11-26)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.4...identity-connector-entity-storage-v0.0.3-next.5) (2025-11-20)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.3...identity-connector-entity-storage-v0.0.3-next.4) (2025-11-17)


### Features

* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.2...identity-connector-entity-storage-v0.0.3-next.3) (2025-11-17)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.1...identity-connector-entity-storage-v0.0.3-next.2) (2025-11-14)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.1 to 0.0.3-next.2

## [0.0.3-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.3-next.0...identity-connector-entity-storage-v0.0.3-next.1) (2025-11-11)


### Features

* add context id features ([#62](https://github.com/iotaledger/twin-identity/issues/62)) ([e02ecca](https://github.com/iotaledger/twin-identity/commit/e02ecca9c45a849104bfbf7bc18a1f44e6eea8a1))
* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))
* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))
* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.3-next.0 to 0.0.3-next.1

## [0.0.2-next.10](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.9...identity-connector-entity-storage-v0.0.2-next.10) (2025-10-27)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.9 to 0.0.2-next.10

## [0.0.2-next.9](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.8...identity-connector-entity-storage-v0.0.2-next.9) (2025-10-09)


### Features

* add validate-locales ([04d74b4](https://github.com/iotaledger/twin-identity/commit/04d74b4d1ebe42672e8ca75a7bdb8e3556afd0be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.8 to 0.0.2-next.9

## [0.0.2-next.8](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.7...identity-connector-entity-storage-v0.0.2-next.8) (2025-09-25)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.7 to 0.0.2-next.8

## [0.0.2-next.7](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.6...identity-connector-entity-storage-v0.0.2-next.7) (2025-09-23)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.6 to 0.0.2-next.7

## [0.0.2-next.6](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.5...identity-connector-entity-storage-v0.0.2-next.6) (2025-09-23)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.5 to 0.0.2-next.6

## [0.0.2-next.5](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.4...identity-connector-entity-storage-v0.0.2-next.5) (2025-09-15)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.4 to 0.0.2-next.5

## [0.0.2-next.4](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.3...identity-connector-entity-storage-v0.0.2-next.4) (2025-09-12)


### Features

* add expiration date option to vc creation ([73e05e1](https://github.com/iotaledger/twin-identity/commit/73e05e1ae61112c7e056889969751f4ff82d9f29))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.3 to 0.0.2-next.4

## [0.0.2-next.3](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.2...identity-connector-entity-storage-v0.0.2-next.3) (2025-08-29)


### Features

* eslint migration to flat config ([fd6246d](https://github.com/iotaledger/twin-identity/commit/fd6246d566280b6d5d10a108eb1e92c4b510f2f2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.2 to 0.0.2-next.3

## [0.0.2-next.2](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.1...identity-connector-entity-storage-v0.0.2-next.2) (2025-08-20)


### Features

* update framework core ([c824497](https://github.com/iotaledger/twin-identity/commit/c82449709af0215eb7af496cf687c93fb30b5ae0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.1 to 0.0.2-next.2

## [0.0.2-next.1](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.2-next.0...identity-connector-entity-storage-v0.0.2-next.1) (2025-08-18)


### Features

* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))
* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.2-next.0 to 0.0.2-next.1

## 0.0.1 (2025-07-08)


### Features

* release to production ([8450ad7](https://github.com/iotaledger/twin-identity/commit/8450ad727e0c4d665f2ce483e41798c2ff5b7d55))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from ^0.0.0 to ^0.0.1

## [0.0.1-next.57](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.56...identity-connector-entity-storage-v0.0.1-next.57) (2025-07-08)


### Features

* add identity remove ([eebc13f](https://github.com/iotaledger/twin-identity/commit/eebc13f4c2cd994d2d9cce4da2128fb346c80ba7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.56 to 0.0.1-next.57

## [0.0.1-next.56](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.55...identity-connector-entity-storage-v0.0.1-next.56) (2025-06-30)


### Features

* re-use vault keys if available ([5a848d7](https://github.com/iotaledger/twin-identity/commit/5a848d7520829d9c891ec889fd773fbc0ee77ba5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.55 to 0.0.1-next.56

## [0.0.1-next.55](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.54...identity-connector-entity-storage-v0.0.1-next.55) (2025-06-26)


### Features

* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))
* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))
* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.54 to 0.0.1-next.55

## [0.0.1-next.54](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.53...identity-connector-entity-storage-v0.0.1-next.54) (2025-06-26)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.53 to 0.0.1-next.54

## [0.0.1-next.53](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.52...identity-connector-entity-storage-v0.0.1-next.53) (2025-06-23)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.52 to 0.0.1-next.53

## [0.0.1-next.52](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.51...identity-connector-entity-storage-v0.0.1-next.52) (2025-06-20)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.51 to 0.0.1-next.52

## [0.0.1-next.51](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.50...identity-connector-entity-storage-v0.0.1-next.51) (2025-06-19)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.50 to 0.0.1-next.51

## [0.0.1-next.50](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.49...identity-connector-entity-storage-v0.0.1-next.50) (2025-06-19)


### Features

* use new generateKid method ([f0fe779](https://github.com/iotaledger/twin-identity/commit/f0fe779323b675575bb9f80aa74f1957dc57a094))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.49 to 0.0.1-next.50

## [0.0.1-next.49](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.48...identity-connector-entity-storage-v0.0.1-next.49) (2025-06-18)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.48 to 0.0.1-next.49

## [0.0.1-next.48](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.47...identity-connector-entity-storage-v0.0.1-next.48) (2025-06-17)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.47 to 0.0.1-next.48

## [0.0.1-next.47](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.46...identity-connector-entity-storage-v0.0.1-next.47) (2025-06-12)


### Features

* identity key separator use slash ([1319d0d](https://github.com/iotaledger/twin-identity/commit/1319d0d07164a36b3ec279e6421b8835ffefc3d3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.46 to 0.0.1-next.47

## [0.0.1-next.46](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.45...identity-connector-entity-storage-v0.0.1-next.46) (2025-05-20)


### Features

* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.45 to 0.0.1-next.46

## [0.0.1-next.45](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.44...identity-connector-entity-storage-v0.0.1-next.45) (2025-05-06)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.44 to 0.0.1-next.45

## [0.0.1-next.44](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.43...identity-connector-entity-storage-v0.0.1-next.44) (2025-04-30)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.43 to 0.0.1-next.44

## [0.0.1-next.43](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.42...identity-connector-entity-storage-v0.0.1-next.43) (2025-04-25)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.42 to 0.0.1-next.43

## [0.0.1-next.42](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.41...identity-connector-entity-storage-v0.0.1-next.42) (2025-04-17)


### Features

* use shared store mechanism ([#27](https://github.com/iotaledger/twin-identity/issues/27)) ([ce41f3f](https://github.com/iotaledger/twin-identity/commit/ce41f3fc3da1b206ec06da7ea5b2c968f788804d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.41 to 0.0.1-next.42

## [0.0.1-next.41](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.40...identity-connector-entity-storage-v0.0.1-next.41) (2025-04-09)


### Miscellaneous Chores

* **identity-connector-entity-storage:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.40 to 0.0.1-next.41

## [0.0.1-next.40](https://github.com/iotaledger/twin-identity/compare/identity-connector-entity-storage-v0.0.1-next.39...identity-connector-entity-storage-v0.0.1-next.40) (2025-03-28)


### Bug Fixes

* Import path and bump version ([#21](https://github.com/iotaledger/twin-identity/issues/21)) ([ccea845](https://github.com/iotaledger/twin-identity/commit/ccea845bf32562267280bc1b3dde1c9af1a00360))
* Install sdk-wasm ([#20](https://github.com/iotaledger/twin-identity/issues/20)) ([75ec14e](https://github.com/iotaledger/twin-identity/commit/75ec14e072f8c219863a1c028a3b0783802086e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/identity-models bumped from 0.0.1-next.39 to 0.0.1-next.40

## v0.0.1-next.39

- Initial Release
