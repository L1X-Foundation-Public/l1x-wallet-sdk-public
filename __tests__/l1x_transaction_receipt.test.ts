import { L1XProvider } from "../src/index";
import { generateRandomString } from "../src/utils/general";

jest.setTimeout(30000);

describe("Testing L1X Transaction Receipt", () => {

    let l1xProvider: L1XProvider = new L1XProvider({
        clusterType: "testnet",
    })

    let private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";
    let wrong_private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b64893385";
    let no_balance_private_key = "c3ac00baeb537a2987f89e2e0221e4c1f724a7bf440704cb26b759d9226042da";

    let block_number = "1";
    let wrong_block_number = "0";

    let address = "75104938baa47c54a86004ef998cc76c2e616289";
    let wrong_address = "75104938baa47c54a86004ef998cc76c2e";

    let transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acbec3af0";
    let wrong_transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acb";

    let transaction_hash_receipt_function = "afa7e2a6708db3d2cf09096769b6b28755d09023cc66d8815c2449318b8b6edf";
    let wrong_transaction_hash_receipt_function = "afa7e2a6708db3d2cf09096769b6b28755d09023cc66d8815c2449318b";

    let timestamp = 1692705981;
    let wrong_timestamp = 16927059;

    let no_of_transactions = 10;
    let wrong_no_of_transactions = 0;

    let starting_from = 0;
    let wrong_starting_from = 100000000000;

    let pool_address = "346fb07c43e88b58c058e8d6c4bf2f5080a01999";
    let wrong_pool_address = "f060c5232a76cd8cfb931c1e199cfd5dc2e4ee07";

    // describe('L1XProvider v1.0.0 > transfer - (Native Coin Transfer)', () => {

    //     let txHash: string = "";

    //     it("Amount should get transferred successfully of all parameters passed correctly", async () => {
    //         let _response = await l1xProvider.core.transfer({
    //             receipient_address: "056f0b117d94638f4999a6b7b1b3d3685c73b49d",
    //             value: 1,
    //             private_key: private_key
    //         })

    //         await new Promise((r) => setTimeout(r, 5000));

    //         txHash = _response.hash;
    //         expect(_response).toEqual(expect.objectContaining({
    //             hash: expect.any(String)
    //         }));

    //         console.log("🚀 ~ file: l1x_transaction_receipt.test.ts:55 ~ expect ~ _response:", _response)

    //         let _receipt_response = await l1xProvider.core.getTransactionReceipt({
    //             hash: txHash
    //         });
    //         console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:58 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
    //     });
    // });

    // // /* DONE -------------
    // describe('L1XProvider v1.0.0 > FT Create', () => {
    //     let _tokenAddress = "";
    //     let _tokenName = generateRandomString(10);
    //     let _tokenSymbol = generateRandomString(10);

    //     let _tokenAttrib = {
    //         name: _tokenName,
    //         symbol: _tokenSymbol,
    //         decimals: 18,
    //         initial_supply: 10000 * 10 ** 18,
    //     };

    //     let txHash: string = "";

    //     it("Amount should get transferred successfully of all parameters passed correctly", async () => {
    //         let _response = await l1xProvider.tokens.FT.create({
    //             attrib: _tokenAttrib,
    //             private_key: private_key,
    //             fee_limit: 1000,
    //         });

    //         await new Promise((r) => setTimeout(r, 8000));

    //         console.log("Create Token > Response", _response);

    //         let _tokenHash = _response["hash"];
    //         _tokenAddress = _response["contract_address"];

    //         expect(_response).toEqual(
    //             expect.objectContaining({
    //                 contract_address: expect.any(String),
    //                 hash: expect.any(String),
    //             })
    //         );

    //         let _receipt_response = await l1xProvider.core.getTransactionReceipt({
    //             hash: _tokenHash
    //         });
    //         console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:101 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
    //     });



    //     it("Mint basic test ", async () => {
    //         let _response = await l1xProvider.tokens.FT.mint({
    //             attrib: {
    //                 contract_address: _tokenAddress,
    //                 recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //                 value: 10,
    //             },
    //             private_key: private_key,
    //             fee_limit: 1,
    //         });

    //         await new Promise((r) => setTimeout(r, 4000));

    //         console.log("Mint basic test ", _response);
    //         expect(_response).toEqual(
    //             expect.objectContaining({
    //                 hash: expect.any(String),
    //             })
    //         );

    //         let _tokenHash = _response["hash"];

    //         let _receipt_response = await l1xProvider.core.getTransactionReceipt({
    //             hash: _tokenHash
    //         });
    //         console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:131 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
    //     });

    //     it("Approve Basic Test ", async () => {
    //         let _response = await l1xProvider.tokens.FT.approve({
    //             attrib: {
    //                 contract_address: _tokenAddress,
    //                 spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //                 value: 100,
    //             },
    //             private_key: private_key,
    //             fee_limit: 1,
    //         });

    //         await new Promise((r) => setTimeout(r, 4000));

    //         console.log("Approve Basic Test ", _response);
    //         expect(_response).toEqual(
    //             expect.objectContaining({
    //                 hash: expect.any(String),
    //             })
    //         );

    //         let _tokenHash = _response["hash"];

    //         let _receipt_response = await l1xProvider.core.getTransactionReceipt({
    //             hash: _tokenHash
    //         });
    //         console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:159 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
    //     });

    //     it("Transfer From Basic Test", async () => {
    //         let _response = await l1xProvider.tokens.FT.transferFrom({
    //             attrib: {
    //                 contract_address: _tokenAddress,
    //                 from_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //                 to_address: "85bc6b9c071a1b14299af1852df6e3a3ed9dd158",
    //                 value: 100,
    //             },
    //             private_key: private_key,
    //             fee_limit: 1,
    //         });

    //         console.log("Transfer From Basic Test", _response);
    //         expect(_response).toEqual(
    //             expect.objectContaining({
    //                 hash: expect.any(String),
    //             })
    //         );

    //         await new Promise((r) => setTimeout(r, 4000));

    //         let _tokenHash = _response["hash"];

    //         let _receipt_response = await l1xProvider.core.getTransactionReceipt({
    //             hash: _tokenHash
    //         });
    //         console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:188 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
    //     });
    // });

    describe('L1XProvider v1.0.0 > NFT Create', () => {

        let wallet: any = {};

        let _tokenAddress = "";
        let _tokenName = generateRandomString(10);
        let _tokenSymbol = generateRandomString(10);
        
        console.log("🚀 ~ file: l1x_transaction_receipt.test.ts:203 ~ describe ~ _tokenName:", _tokenName)
        console.log("🚀 ~ file: l1x_transaction_receipt.test.ts:205 ~ describe ~ _tokenSymbol:", _tokenSymbol)

        beforeAll(async () => {
            wallet = await l1xProvider.wallet.importByPrivateKey(
                private_key
            );
        });


        it("NFT Creation ", async () => {
            let _response = await l1xProvider.tokens.NFT.create({
                attrib: {
                    name: _tokenName,
                    symbol: _tokenSymbol,
                },
                private_key: private_key,
                fee_limit: 1,
            });

            console.log("L1XProvider > NFT > Create Token", _response);

            _tokenAddress = _response["contract_address"];

            expect(_response).toEqual(
                expect.objectContaining({
                    contract_address: expect.any(String),
                    hash: expect.any(String),
                })
            );

            await new Promise((r) => setTimeout(r, 4000));

            let _tokenHash = _response["hash"];

            let _receipt_response = await l1xProvider.core.getTransactionReceipt({
                hash: _tokenHash
            });
            console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:235 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
        });

        it("Minting Token ", async () => {
            let _response = await l1xProvider.tokens.NFT.mintTo({
                attrib: {
                    contract_address: _tokenAddress, // _collectionAddress,
                    recipient_address: wallet.address,
                    token_id: 1
                },
                private_key: private_key,
                fee_limit: 1,
            });

            await new Promise((r) => setTimeout(r, 4000));

            console.log("Minting Token " + _tokenAddress, _response);

            expect(_response).toEqual(
                expect.objectContaining({
                    hash: expect.any(String),
                })
            );

            let _tokenHash = _response["hash"];

            let _receipt_response = await l1xProvider.core.getTransactionReceipt({
                hash: _tokenHash
            });
            console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:264 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
        });

        it("Transfer From", async () => {
            let _response = await l1xProvider.tokens.NFT.transferFrom({
                attrib: {
                    contract_address: _tokenAddress,
                    recipient_address: wallet.address,
                    token_id: 1,
                },
                private_key: private_key,
                fee_limit: 1
            });

            await new Promise((r) => setTimeout(r, 4000));

            console.log("L1XProvider > NFT > Transfer From", _response);

            expect(_response).toEqual(
                expect.objectContaining({
                    hash: expect.any(String),
                })
            );

            let _tokenHash = _response["hash"];

            let _receipt_response = await l1xProvider.core.getTransactionReceipt({
                hash: _tokenHash
            });
            console.log("🚀 ~ file: l1x_core_transaction_receipt.test.ts:293 ~ it ~ _receipt_response:", JSON.stringify(_receipt_response))
        });
    });
    // */
});

