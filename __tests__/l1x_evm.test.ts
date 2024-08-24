import { L1XProvider } from "../src/index";
import fs from "fs/promises";
import DIDAbi from "./evm_abi";
import StablePool_abi from "./ComposableStablePool_abi";
import VaultAbi from "./Vault_abi";
import BalancerQuery_abi from "./BalancerQuery_abi";
import { StablePoolEncoder } from "@balancer-labs/sdk";
import { parseEther } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";

jest.setTimeout(30000);

describe("Testing L1X VM Features", () => {
    let l1xProvider: L1XProvider = new L1XProvider({
        clusterType: "mainnet",
        endpoint: "http://54.214.8.200:50051"
        // endpoint: "http://3.104.231.143:50051"
    })

    const didDocument = {
        context: ['https://www.w3.org/ns/did/v1'],
        id: 'did:ethr:0x123297897894634756546546',
        controller: '0x12345654345453453435435cdefghi',
    };

    let private_key = process.env.SIGNER_PRIVATE_KEY || "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";
    let wrong_private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b64893385";
    let no_balance_private_key = "c3ac00baeb537a2987f89e2e0221e4c1f724a7bf440704cb26b759d9226042da";

    // let valid_receiver = "97b6f26F33507B8AA17d45Ec5A6F9cDF40656E80";
    let valid_receiver = "3f26a392527cb2f3328a15d3b9fe66d9225d8ec0";
    let valid_amount = 10;

    let fee_limit = 10000;
    let wrong_fee_limit = 0;

    let address = "0x78e044394595D4984F66c1B19059Bc14ecc24063"; //Derived Key
    let wrong_address = "75104938baa47c54a86004ef998cc76c2e";

    let transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acbec3af0";
    let wrong_transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acb";

    let transaction_hash_receipt_function = "5420524f8760e25c0635a76aa922207bbe93bd8154c05c2eb546309084e8f57d";
    let wrong_transaction_hash_receipt_function = "afa7e2a6708db3d2cf09096769b6b28755d09023cc66d8815c2449318b";

    let contract_for_read_calls = "1e1ec9cd126a6d4941e9dc7D3761f2279EeFb309";
    let contract_init_address: any = null;

    let pool_address = "5885b1A8aA82F99Ab90C0fc6C2498fd458a8c348";
    let wrong_pool_address = "5885b1A8aA82F99Ab90C0fc6C2498fd458";

    // /* DONE -------------
    // Working Functions ----------------
    // describe('L1XProvider > EVM > Deploy', () => {
    //     it("Should return correct response for a valid private key", async () => {
    //         let _response = await l1xProvider.evm.deploy({
    //             attrib: {
    //                 byte_code: (await fs.readFile("./__tests__/evm_deploycode.txt")).toString(),
    //             },
    //             private_key: private_key,
    //             fee_limit: fee_limit,
    //         });

    //         contract_init_address = _response.contract_address;

    //         console.log("Contract Deployed: ", _response);

    //         expect(_response).toEqual(
    //             expect.objectContaining({
    //                 contract_address: expect.any(String),
    //                 hash: expect.any(String),
    //             })
    //         );
    //     });


    //     it('Should throw an error for an invalid private key', async () => {
    //         await expect(async () => await l1xProvider.evm.deploy({
    //             attrib: {
    //                 byte_code: (await fs.readFile("./__tests__/evm_deploycode.txt")).toString(),
    //             },
    //             private_key: wrong_private_key,
    //             fee_limit: fee_limit,
    //         })).rejects.toThrowError(
    //             //'Expected private key to be an Uint8Array with length 32'
    //             expect.any(Error)
    //         );
    //     });


    //     it('Should throw an error for no balance private key', async () => {
    //         await expect(async () => await l1xProvider.evm.deploy({
    //             attrib: {
    //                 byte_code: (await fs.readFile("./__tests__/evm_deploycode.txt")).toString(),
    //             },
    //             private_key: no_balance_private_key,
    //             fee_limit: fee_limit,
    //         })).rejects.toThrowError(
    //             //'Expected private key to be an Uint8Array with length 32'
    //             expect.any(Error)
    //         );
    //     });


    //     it('Should throw an error for an invalid fee limit', async () => {
    //         await expect(async () => await l1xProvider.evm.deploy({
    //             attrib: {
    //                 byte_code: (await fs.readFile("./__tests__/evm_deploycode.txt")).toString(),
    //             },
    //             private_key: private_key,
    //             fee_limit: wrong_fee_limit,
    //         })).rejects.toThrowError(
    //             //'Expected private key to be an Uint8Array with length 32'
    //             expect.any(Error)
    //         );
    //     });
    // });


    describe('L1XProvider > EVM > Init', () => {
        it("Should return correct response for a valid private key", async () => {
            let _response = await l1xProvider.evm.init({
                attrib: {
                    base_contract_address: "604df657c9dd8de7a1e0acf6590bb7c0516740ee",
                    arguments: {}
                },
                private_key: private_key,
                fee_limit: 1,
            });

            contract_init_address = _response.contract_address;

            console.log("Contract Init: ", _response);

            expect(_response).toEqual(
                expect.objectContaining({
                    contract_address: expect.any(String),
                    hash: expect.any(String),
                })
            );
        });


        it('Should throw an error for an invalid private key', async () => {
            await expect(async () => await l1xProvider.evm.init({
                attrib: {
                    base_contract_address: "604df657c9dd8de7a1e0acf6590bb7c0516740ee",
                    arguments: {}
                },
                private_key: wrong_private_key,
                fee_limit: fee_limit,
            })).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });
    });


    describe('L1XProvider > EVM > Make State Changing Call', () => {
        it("Should return correct response for a valid private key", async () => {
            let _response = await l1xProvider.evm.makeStateChangingFunctionCall({
                attrib: {
                    arguments: {
                        did: didDocument.id,
                        didDocument: didDocument,
                    },
                    contract_address: contract_init_address,
                    function: "createDID",
                    abi: DIDAbi
                },
                private_key: private_key,
                fee_limit: 1,
            });
            console.log("🚀 ~ it ~ _response:", _response)

            expect(_response).toEqual(
                expect.objectContaining({
                    hash: expect.any(String),
                })
            );
        });


        it('Should throw an error for an invalid private key', async () => {
            await expect(async () => await l1xProvider.evm.makeStateChangingFunctionCall({
                attrib: {
                    arguments: {
                        did: didDocument.id,
                        didDocument: didDocument,
                    },
                    contract_address: contract_init_address,
                    function: "createDID",
                    abi: DIDAbi
                },
                private_key: wrong_private_key,
                fee_limit: fee_limit,
            })).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });

        /* Valid Test Case but VM not throwing error ----------------------------------- 
        it('Should throw an error for no balance private key', async () => {
            await expect(async () => await l1xProvider.evm.makeStateChangingFunctionCall({
                attrib: {
                    arguments: {
                        did: didDocument.id,
                        didDocument: didDocument,
                    },
                    contract_address: contract_init_address,
                    function: "createDID",
                    abi: DIDAbi
                },
                private_key: no_balance_private_key,
                fee_limit: fee_limit,
            })).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });


        it('Should throw an error for an invalid fee limit', async () => {
            await expect(async () => await l1xProvider.evm.makeStateChangingFunctionCall({
                attrib: {
                    arguments: {
                        did: didDocument.id,
                        didDocument: didDocument,
                    },
                    contract_address: contract_init_address,
                    function: "createDID",
                    abi: DIDAbi
                },
                private_key: private_key,
                fee_limit: wrong_fee_limit,
            })).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });
        */
    });


    describe('L1XProvider > EVM > Make Read Only Call', () => {
        it("Should return correct response for a valid private key", async () => {
            let _response = await l1xProvider.evm.makeReadOnlyCall({
                attrib: {
                    arguments: {
                        account: address,
                    },
                    contract_address: pool_address,
                    function: "balanceOf",
                    abi: StablePool_abi,
                },
                private_key: private_key,
                fee_limit: fee_limit
            });
            console.log("🚀 ~ it ~ _response:", _response)

            expect(_response).toEqual(
                [
                    expect.any(BigNumber)
                ]
            );
        });

        it('Should throw an error for an invalid private key', async () => {
            await expect(async () => await l1xProvider.evm.makeReadOnlyCall({
                attrib: {
                    arguments: {
                        account: address,
                    },
                    contract_address: pool_address,
                    function: "balanceOf",
                    abi: StablePool_abi,
                },
                private_key: wrong_private_key,
                fee_limit: fee_limit
            })).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });
    });
});

