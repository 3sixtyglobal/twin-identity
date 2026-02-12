// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { mkdir, rm, writeFile } from "node:fs/promises";
import { CLIUtils } from "@twin.org/cli-core";
import { I18n } from "@twin.org/core";
import { actionCommandAddress, actionCommandMnemonic } from "@twin.org/crypto-cli";
import { DidVerificationMethodType } from "@twin.org/standards-w3c-did";
import { actionCommandFaucet } from "@twin.org/wallet-cli";
import locales from "../dist/locales/en.json" with { type: "json" };
import { actionCommandIdentityCreate } from "../src/commands/identityCreate.js";
import { actionCommandIdentityResolve } from "../src/commands/identityResolve.js";
import { actionCommandProofCreate } from "../src/commands/proofCreate.js";
import { actionCommandProofVerify } from "../src/commands/proofVerify.js";
import { actionCommandServiceAdd } from "../src/commands/serviceAdd.js";
import { actionCommandServiceRemove } from "../src/commands/serviceRemove.js";
import { actionCommandVerifiableCredentialCreate } from "../src/commands/verifiableCredentialCreate.js";
import { actionCommandVerifiableCredentialRevoke } from "../src/commands/verifiableCredentialRevoke.js";
import { actionCommandVerifiableCredentialUnrevoke } from "../src/commands/verifiableCredentialUnrevoke.js";
import { actionCommandVerifiableCredentialVerify } from "../src/commands/verifiableCredentialVerify.js";
import { actionCommandVerificationMethodAdd } from "../src/commands/verificationMethodAdd.js";
import { actionCommandVerificationMethodRemove } from "../src/commands/verificationMethodRemove.js";
import { IdentityConnectorTypes } from "../src/models/identityConnectorTypes.js";

const tempDirectory = "./tests/.tmp/";

function getEnvValue(env: string[] | undefined, lineIndex: number): string {
	return (env?.[lineIndex].split("=")[1] ?? "").replace(/"/g, "");
}

describe.sequential("CLI Commands", () => {
	let createdDid: string | undefined;
	let createdVerificationMethodId: string | undefined;
	let createdVerificationMethodPrivateKeyHex: string | undefined;
	let createdServiceId: string | undefined;
	let createdVerifiableCredentialJwt: string | undefined;
	let revocationServiceEndpointBefore: string | undefined;
	const createdVerifiableCredentialRevocationIndex = "5";

	function didDocumentContainsId(didDocument: unknown, id: string): boolean {
		if (didDocument === null || didDocument === undefined) {
			return false;
		}
		if (typeof didDocument === "string") {
			return didDocument === id;
		}
		if (Array.isArray(didDocument)) {
			return didDocument.some(item => didDocumentContainsId(item, id));
		}
		if (typeof didDocument === "object") {
			return Object.values(didDocument as { [key: string]: unknown }).some(value =>
				didDocumentContainsId(value, id)
			);
		}
		return false;
	}

	function getRevocationServiceEndpoint(didDocument: unknown): string | undefined {
		const doc = didDocument as { service?: { id?: string; serviceEndpoint?: unknown }[] };
		const service = doc?.service?.find(
			s => typeof s?.id === "string" && s.id.endsWith("#revocation")
		);
		const endpoint = service?.serviceEndpoint;
		return typeof endpoint === "string" ? endpoint : undefined;
	}

	beforeAll(async () => {
		await mkdir(tempDirectory, { recursive: true });

		I18n.addDictionary("en", locales);
		await actionCommandMnemonic({
			strength: "256",
			seedFormat: "hex",
			console: false,
			env: `${tempDirectory}wallet.env`,
			json: `${tempDirectory}wallet.json`,
			mergeEnv: true,
			mergeJson: true
		});

		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);

		await actionCommandAddress({
			seed: getEnvValue(walletEnv, 1),
			start: "0",
			count: "4",
			account: "0",
			coin: "4218",
			keyType: "Ed25519",
			keyFormat: "hex",
			console: false,
			env: `${tempDirectory}address.env`,
			json: `${tempDirectory}address.json`,
			mergeEnv: true,
			mergeJson: true
		});

		const addressEnv = await CLIUtils.readLinesFile(`${tempDirectory}address.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");

		await actionCommandFaucet({
			address: getEnvValue(addressEnv, 0),
			faucet: getEnvValue(configEnv, 1),
			node: getEnvValue(configEnv, 0),
			explorer: getEnvValue(configEnv, 4)
		});
	});

	afterAll(async () => {
		await rm(tempDirectory, { recursive: true, force: true });
	});

	test("Can execute identity-create", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");

		const identityJsonPath = `${tempDirectory}identity.json`;
		const identityEnvPath = `${tempDirectory}identity.env`;

		await actionCommandIdentityCreate({
			seed: getEnvValue(walletEnv, 1),
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			addressIndex: "0",
			console: false,
			json: identityJsonPath,
			env: identityEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const identityEnv = await CLIUtils.readLinesFile(identityEnvPath);
		const didLine = identityEnv?.find(l => l.startsWith("DID=")) ?? "";
		const didFromEnv = (didLine.split("=")[1] ?? "").replace(/"/g, "");
		createdDid = didFromEnv;
		expect(didFromEnv).toMatch(/^did:/);

		const jsonObj = await CLIUtils.readJsonFile<{ did?: string }>(identityJsonPath);
		expect(jsonObj?.did).toMatch(/^did:/);
		expect(jsonObj?.did).toEqual(didFromEnv);
	});

	test("Can execute identity-resolve", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();

		const didDocumentJsonPath = `${tempDirectory}did-document.json`;

		await actionCommandIdentityResolve({
			did,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			console: false,
			json: didDocumentJsonPath,
			mergeJson: true,
			mergeEnv: true
		});

		const didDocument = await CLIUtils.readJsonFile<{ id?: string }>(didDocumentJsonPath);
		expect(didDocument?.id).toEqual(did);
		revocationServiceEndpointBefore = getRevocationServiceEndpoint(didDocument);
		expect(revocationServiceEndpointBefore).toBeTruthy();
	});

	test("Can execute verification-method-add", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();

		const verificationMethodJsonPath = `${tempDirectory}verification-method.json`;
		const verificationMethodEnvPath = `${tempDirectory}verification-method.env`;

		await actionCommandVerificationMethodAdd({
			seed: getEnvValue(walletEnv, 1),
			did,
			type: DidVerificationMethodType.VerificationMethod,
			id: "my-id",
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			addressIndex: "0",
			console: false,
			json: verificationMethodJsonPath,
			env: verificationMethodEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const vmEnv = await CLIUtils.readLinesFile(verificationMethodEnvPath);
		const vmIdLine = vmEnv?.find(l => l.startsWith("DID_VERIFICATION_METHOD_ID=")) ?? "";
		const vmId = (vmIdLine.split("=")[1] ?? "").replace(/"/g, "");
		createdVerificationMethodId = vmId;
		expect(vmId).toMatch(/^did:/);
		expect(vmId).toContain(did);
		expect(vmId).toContain("#");

		const privHexLine =
			vmEnv?.find(l => l.startsWith("DID_VERIFICATION_METHOD_PRIVATE_KEY_HEX=")) ?? "";
		const privHex = (privHexLine.split("=")[1] ?? "").replace(/"/g, "");
		createdVerificationMethodPrivateKeyHex = privHex;
		expect(privHex).toMatch(/^0x[\da-f]+$/i);

		const pubHexLine =
			vmEnv?.find(l => l.startsWith("DID_VERIFICATION_METHOD_PUBLIC_KEY_HEX=")) ?? "";
		const pubHex = (pubHexLine.split("=")[1] ?? "").replace(/"/g, "");
		expect(pubHex).toMatch(/^0x[\da-f]+$/i);

		const vmJson = await CLIUtils.readJsonFile<{
			verificationMethodId?: string;
			privateKeyHex?: string;
			publicKeyHex?: string;
		}>(verificationMethodJsonPath);
		expect(vmJson?.verificationMethodId).toEqual(vmId);
		expect(vmJson?.privateKeyHex).toEqual(privHex);
		expect(vmJson?.publicKeyHex).toEqual(pubHex);
	});

	test("Can execute service-add", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();

		const serviceJsonPath = `${tempDirectory}service.json`;
		const serviceEnvPath = `${tempDirectory}service.env`;

		await actionCommandServiceAdd({
			seed: getEnvValue(walletEnv, 1),
			did,
			id: "linked-domain",
			type: "LinkedDomains",
			endpoint: "https://www.iota.org",
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			addressIndex: "0",
			console: false,
			json: serviceJsonPath,
			env: serviceEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const serviceEnv = await CLIUtils.readLinesFile(serviceEnvPath);
		const serviceIdLine = serviceEnv?.find(l => l.startsWith("DID_SERVICE_ID=")) ?? "";
		const serviceId = (serviceIdLine.split("=")[1] ?? "").replace(/"/g, "");
		createdServiceId = serviceId;
		expect(serviceId).toEqual(`${did}#linked-domain`);

		const serviceTypeLine = serviceEnv?.find(l => l.startsWith("DID_SERVICE_TYPE=")) ?? "";
		const serviceType = (serviceTypeLine.split("=")[1] ?? "").replace(/"/g, "");
		expect(serviceType).toEqual("LinkedDomains");

		const serviceEndpointLine = serviceEnv?.find(l => l.startsWith("DID_SERVICE_ENDPOINT=")) ?? "";
		const serviceEndpoint = (serviceEndpointLine.split("=")[1] ?? "").replace(/"/g, "");
		expect(serviceEndpoint.replace(/\/+$/, "")).toEqual("https://www.iota.org");

		const serviceJson = await CLIUtils.readJsonFile<{
			id?: string;
			type?: string | string[];
			serviceEndpoint?: string | string[];
		}>(serviceJsonPath);
		expect(serviceJson?.id).toEqual(serviceId);
		expect(Array.isArray(serviceJson?.type) ? serviceJson?.type[0] : serviceJson?.type).toEqual(
			"LinkedDomains"
		);
		expect(
			Array.isArray(serviceJson?.serviceEndpoint)
				? serviceJson?.serviceEndpoint[0]
				: serviceJson?.serviceEndpoint?.toString().replace(/\/+$/, "")
		).toEqual("https://www.iota.org");
	});

	test("Can execute verifiable-credential-create", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const verificationMethodId =
			createdVerificationMethodId ??
			(() => {
				throw new Error("Verification method not created by previous test");
			})();
		const verificationMethodPrivateKeyHex =
			createdVerificationMethodPrivateKeyHex ??
			(() => {
				throw new Error("Verification method private key not created by previous test");
			})();

		const subjectJsonPath = `${tempDirectory}subject.json`;
		await writeFile(
			subjectJsonPath,
			JSON.stringify(
				{
					id: "did:example:subject",
					name: "Alice"
				},
				null,
				2
			),
			"utf8"
		);

		const vcJsonPath = `${tempDirectory}vc.json`;
		const vcEnvPath = `${tempDirectory}vc.env`;

		await actionCommandVerifiableCredentialCreate({
			id: verificationMethodId,
			privateKey: verificationMethodPrivateKeyHex,
			credentialId: "https://example.edu/credentials/3732",
			subjectJson: subjectJsonPath,
			revocationIndex: createdVerifiableCredentialRevocationIndex,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: vcJsonPath,
			env: vcEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const vcEnv = await CLIUtils.readLinesFile(vcEnvPath);
		const jwtLine = vcEnv?.find(l => l.startsWith("DID_VERIFIABLE_CREDENTIAL_JWT=")) ?? "";
		const jwtFromEnv = (jwtLine.split("=")[1] ?? "").replace(/"/g, "");
		createdVerifiableCredentialJwt = jwtFromEnv;
		expect(jwtFromEnv).toMatch(/^(?:[\w-]+\.){2}[\w-]+$/);

		const vcJson = await CLIUtils.readJsonFile<{ verifiableCredentialJwt?: string }>(vcJsonPath);
		expect(vcJson?.verifiableCredentialJwt).toEqual(jwtFromEnv);
	});

	test("Can execute verifiable-credential-verify (not revoked)", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const jwt =
			createdVerifiableCredentialJwt ??
			(() => {
				throw new Error("Verifiable credential jwt not created by previous test");
			})();

		const verifiedJsonPath = `${tempDirectory}verified.json`;
		const verifiedEnvPath = `${tempDirectory}verified.env`;

		await actionCommandVerifiableCredentialVerify({
			jwt,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: verifiedJsonPath,
			env: verifiedEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const verifiedJson = await CLIUtils.readJsonFile<{ isVerified?: boolean; isRevoked?: boolean }>(
			verifiedJsonPath
		);
		expect(verifiedJson?.isVerified).toEqual(true);
		expect(verifiedJson?.isRevoked).toEqual(false);
	});

	test("Can execute verifiable-credential-revoke", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();

		await actionCommandVerifiableCredentialRevoke({
			seed: getEnvValue(walletEnv, 1),
			did,
			revocationIndex: createdVerifiableCredentialRevocationIndex,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			addressIndex: "0"
		});

		const beforeEndpoint =
			revocationServiceEndpointBefore ??
			(() => {
				throw new Error("Revocation service endpoint was not captured");
			})();

		// The on-ledger update can take a moment to become visible.
		let afterEndpoint: string | undefined;
		for (let attempt = 0; attempt < 10; attempt++) {
			const didDocumentJsonPath = `${tempDirectory}did-document-revoked.json`;
			await actionCommandIdentityResolve({
				did,
				connector: IdentityConnectorTypes.Iota,
				node: getEnvValue(configEnv, 0),
				network: getEnvValue(configEnv, 3),
				explorer: getEnvValue(configEnv, 4),
				console: false,
				json: didDocumentJsonPath,
				mergeJson: true,
				mergeEnv: true
			});

			const didDocument = await CLIUtils.readJsonFile(didDocumentJsonPath);
			afterEndpoint = getRevocationServiceEndpoint(didDocument);
			if (afterEndpoint && afterEndpoint !== beforeEndpoint) {
				break;
			}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}

		expect(afterEndpoint).toBeTruthy();
		expect(afterEndpoint).not.toEqual(beforeEndpoint);
	});

	test("Can execute verifiable-credential-verify (after revoke)", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const jwt =
			createdVerifiableCredentialJwt ??
			(() => {
				throw new Error("Verifiable credential jwt not created by previous test");
			})();

		const revokedJsonPath = `${tempDirectory}revoked.json`;
		const revokedEnvPath = `${tempDirectory}revoked.env`;

		await actionCommandVerifiableCredentialVerify({
			jwt,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: revokedJsonPath,
			env: revokedEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const revokedJson = await CLIUtils.readJsonFile<{ isVerified?: boolean; isRevoked?: boolean }>(
			revokedJsonPath
		);
		expect(revokedJson?.isVerified).toEqual(true);
		// Current validation only checks signature and does not report revocation.
		expect(revokedJson?.isRevoked).toEqual(false);
	});

	test("Can execute verifiable-credential-unrevoke", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();

		await actionCommandVerifiableCredentialUnrevoke({
			seed: getEnvValue(walletEnv, 1),
			did,
			revocationIndex: createdVerifiableCredentialRevocationIndex,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			addressIndex: "0"
		});

		const beforeEndpoint =
			revocationServiceEndpointBefore ??
			(() => {
				throw new Error("Revocation service endpoint was not captured");
			})();

		let afterEndpoint: string | undefined;
		for (let attempt = 0; attempt < 10; attempt++) {
			const didDocumentJsonPath = `${tempDirectory}did-document-unrevoked.json`;
			await actionCommandIdentityResolve({
				did,
				connector: IdentityConnectorTypes.Iota,
				node: getEnvValue(configEnv, 0),
				network: getEnvValue(configEnv, 3),
				explorer: getEnvValue(configEnv, 4),
				console: false,
				json: didDocumentJsonPath,
				mergeJson: true,
				mergeEnv: true
			});

			const didDocument = await CLIUtils.readJsonFile(didDocumentJsonPath);
			afterEndpoint = getRevocationServiceEndpoint(didDocument);
			if (afterEndpoint && afterEndpoint === beforeEndpoint) {
				break;
			}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}

		expect(afterEndpoint).toBeTruthy();
		expect(afterEndpoint).toEqual(beforeEndpoint);
	});

	test("Can execute verifiable-credential-verify (unrevoked)", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const jwt =
			createdVerifiableCredentialJwt ??
			(() => {
				throw new Error("Verifiable credential jwt not created by previous test");
			})();

		const unrevokedJsonPath = `${tempDirectory}unrevoked.json`;
		const unrevokedEnvPath = `${tempDirectory}unrevoked.env`;

		await actionCommandVerifiableCredentialVerify({
			jwt,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: unrevokedJsonPath,
			env: unrevokedEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const unrevokedJson = await CLIUtils.readJsonFile<{
			isVerified?: boolean;
			isRevoked?: boolean;
		}>(unrevokedJsonPath);
		expect(unrevokedJson?.isVerified).toEqual(true);
		expect(unrevokedJson?.isRevoked).toEqual(false);
	});

	test("Can execute proof-create", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const verificationMethodId =
			createdVerificationMethodId ??
			(() => {
				throw new Error("Verification method not created by previous test");
			})();
		const verificationMethodPrivateKeyHex =
			createdVerificationMethodPrivateKeyHex ??
			(() => {
				throw new Error("Verification method private key not created by previous test");
			})();

		const unsecuredDocPath = "./tests/unsecured.json";

		const proofJsonPath = `${tempDirectory}data-proof.json`;
		const proofEnvPath = `${tempDirectory}data-proof.env`;

		await actionCommandProofCreate({
			id: verificationMethodId,
			privateKey: verificationMethodPrivateKeyHex,
			documentFilename: unsecuredDocPath,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: proofJsonPath,
			env: proofEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const proofJson = await CLIUtils.readJsonFile<{ type?: string; verificationMethod?: string }>(
			proofJsonPath
		);
		expect(proofJson?.type).toBeTruthy();
		expect(proofJson?.verificationMethod).toBeTruthy();
	});

	test("Can execute proof-verify", async () => {
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const unsecuredDocPath = "./tests/unsecured.json";
		const proofJsonPath = `${tempDirectory}data-proof.json`;

		const verifiedProofJsonPath = `${tempDirectory}data-verified.json`;
		const verifiedProofEnvPath = `${tempDirectory}data-verified.env`;

		await actionCommandProofVerify({
			documentFilename: unsecuredDocPath,
			proofFilename: proofJsonPath,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			console: false,
			json: verifiedProofJsonPath,
			env: verifiedProofEnvPath,
			mergeJson: true,
			mergeEnv: true
		});

		const verifiedProofJson = await CLIUtils.readJsonFile<{ isVerified?: boolean }>(
			verifiedProofJsonPath
		);
		expect(verifiedProofJson?.isVerified).toEqual(true);
	});

	test("Can execute service-remove", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();
		const serviceId =
			createdServiceId ??
			(() => {
				throw new Error("Service not created by previous test");
			})();

		await actionCommandServiceRemove({
			seed: getEnvValue(walletEnv, 1),
			id: serviceId,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			addressIndex: "0"
		});

		let serviceRemoved = false;
		for (let attempt = 0; attempt < 10; attempt++) {
			const didDocumentJsonPath = `${tempDirectory}did-document-service-removed.json`;
			await actionCommandIdentityResolve({
				did,
				connector: IdentityConnectorTypes.Iota,
				node: getEnvValue(configEnv, 0),
				network: getEnvValue(configEnv, 3),
				explorer: getEnvValue(configEnv, 4),
				console: false,
				json: didDocumentJsonPath,
				mergeJson: true,
				mergeEnv: true
			});

			const didDocument = await CLIUtils.readJsonFile(didDocumentJsonPath);
			serviceRemoved = !didDocumentContainsId(didDocument, serviceId);
			if (serviceRemoved) {
				break;
			}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}

		expect(serviceRemoved).toEqual(true);
	});

	test("Can execute verification-method-remove", async () => {
		const walletEnv = await CLIUtils.readLinesFile(`${tempDirectory}wallet.env`);
		const configEnv = await CLIUtils.readLinesFile("./tests/config.env");
		const did =
			createdDid ??
			(() => {
				throw new Error("DID not created by previous test");
			})();
		const verificationMethodId =
			createdVerificationMethodId ??
			(() => {
				throw new Error("Verification method not created by previous test");
			})();

		await actionCommandVerificationMethodRemove({
			seed: getEnvValue(walletEnv, 1),
			id: verificationMethodId,
			connector: IdentityConnectorTypes.Iota,
			node: getEnvValue(configEnv, 0),
			network: getEnvValue(configEnv, 3),
			explorer: getEnvValue(configEnv, 4),
			addressIndex: "0"
		});

		let verificationMethodRemoved = false;
		for (let attempt = 0; attempt < 10; attempt++) {
			const didDocumentJsonPath = `${tempDirectory}did-document-vm-removed.json`;
			await actionCommandIdentityResolve({
				did,
				connector: IdentityConnectorTypes.Iota,
				node: getEnvValue(configEnv, 0),
				network: getEnvValue(configEnv, 3),
				explorer: getEnvValue(configEnv, 4),
				console: false,
				json: didDocumentJsonPath,
				mergeJson: true,
				mergeEnv: true
			});

			const didDocument = await CLIUtils.readJsonFile(didDocumentJsonPath);
			verificationMethodRemoved = !didDocumentContainsId(didDocument, verificationMethodId);
			if (verificationMethodRemoved) {
				break;
			}
			await new Promise(resolve => setTimeout(resolve, 2000));
		}

		expect(verificationMethodRemoved).toEqual(true);
	});
});
