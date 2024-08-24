import { L1XProvider } from "../../src/index";

jest.setTimeout(30000);

describe("Testing L1X Core Features", () => {

    let l1xProvider: L1XProvider = new L1XProvider({
        clusterType: "testnet",
        endpoint: "http://3.104.231.143:50051"
    })

    let private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";
    let wrong_private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b64893385";
    let no_balance_private_key = "c3ac00baeb537a2987f89e2e0221e4c1f724a7bf440704cb26b759d9226042da";

    let block_number = "472510";
    let wrong_block_number = "0";

    let address = ""; //Derived Key
    let wrong_address = "75104938baa47c54a86004ef998cc76c2e";

    let transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acbec3af0";
    let wrong_transaction_hash = "1f1796e1af9a252f324fc895d0767e0656577f05e8c096fdcd91fa3acb";

    let transaction_hash_receipt_function = "";
    let wrong_transaction_hash_receipt_function = "afa7e2a6708db3d2cf09096769b6b28755d09023cc66d8815c2449318b";

    let timestamp = 1692705981;
    let wrong_timestamp = 16927059;

    let no_of_transactions = 10;
    let wrong_no_of_transactions = 0;

    let starting_from = 0;
    let wrong_starting_from = 100000000000;

    let pool_address = "346fb07c43e88b58c058e8d6c4bf2f5080a01999";
    let wrong_pool_address = "f060c5232a76cd8cfb931c1e199cfd5dc2e4ee07";

    // /* DONE -------------
    // Working Functions ----------------
    describe('L1XProvider v1.0.0 > importByPrivateKey', () => {
        it("Should return correct response for a valid private key", async () => {
            let _response = await l1xProvider.wallet.importByPrivateKey(private_key);

            address = _response.address;

            console.log("Account Imported",address);

            expect(_response).toEqual(expect.objectContaining({
                private_key: expect.any(String),
                public_key: expect.any(String),
                public_key_bytes: expect.any(Uint8Array),
                address: expect.any(String),
                address_with_prefix: expect.any(String),
            }));
        });


        it('Should throw an error for an invalid private key', async () => {
            await expect(async () => await l1xProvider.wallet.importByPrivateKey(wrong_private_key)).rejects.toThrowError(
                //'Expected private key to be an Uint8Array with length 32'
                expect.any(Error)
            );
        });
    });

   

    describe('L1XProvider v1.0.0 > getAccountState', () => {
        it("Should return correct account details for correct wallet address", async () => {
            let _response = await l1xProvider.core.getAccountState({
                address: address
            });

            console.log(_response,address,"getAccountState > address")

            expect(_response).toEqual(expect.objectContaining({
                account_state: {
                    balance: expect.any(String),
                    balance_formatted: expect.any(String),
                    nonce: expect.any(Number),
                    account_type: expect.any(Number)
                }
            }));
        });


        it('Should throw an error for an invalid wallet address', async () => {
            await expect(async () => await l1xProvider.core.getAccountState({ address: wrong_address })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });
    });




    describe('L1XProvider v1.0.0 > transfer - (Native Coin Transfer)', () => {

        let txHash: string = transaction_hash;

        it("Amount should get transferred successfully of all parameters passed correctly", async () => {
            let beforeTransfer = await l1xProvider.core.getAccountState({
                address: "056f0b117d94638f4999a6b7b1b3d3685c73b49d"
            });

            console.log(private_key,"private_key");
            console.log(beforeTransfer,"beforeTransfer > getAccountState > 056f0b117d94638f4999a6b7b1b3d3685c73b49d");

            let _response = await l1xProvider.core.transfer({
                receipient_address: "056f0b117d94638f4999a6b7b1b3d3685c73b49d",
                value: 1,
                private_key: private_key
            })

            transaction_hash_receipt_function = _response.hash;

            console.log(_response,"l1xProvider.core.transfer");

            await new Promise((r) => setTimeout(r, 5000));

            txHash = _response.hash;
            expect(_response).toEqual(expect.objectContaining({
                hash: expect.any(String)
            }));

            let afterTransfer = await l1xProvider.core.getAccountState({
                address: "056f0b117d94638f4999a6b7b1b3d3685c73b49d"
            }); 

            
            console.log(afterTransfer,"afterTransfer > getAccountState > 056f0b117d94638f4999a6b7b1b3d3685c73b49d");

            expect(parseInt(beforeTransfer.account_state.balance)).toBeLessThan(parseInt(afterTransfer.account_state.balance));
        });

      

        it('Should throw an error for an invalid amount', async () => {
            await expect(async () => await l1xProvider.core.transfer({
                receipient_address: "056f0b117d94638f4999a6b7b1b3d3685c73b49d",
                value: -100,
                private_key: private_key
            })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });

        it('Should throw an error for an invalid receipient address', async () => {
            await expect(async () => await l1xProvider.core.transfer({
                receipient_address: wrong_address,
                value: 1,
                private_key: private_key
            })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });

        it('Should throw an error for an invalid private Key', async () => {
            await expect(async () => await l1xProvider.core.transfer({
                receipient_address: address,
                value: 1,
                private_key: wrong_private_key
            })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });

        it('Should throw an error for an insuffient balance', async () => {
            await expect(async () => await l1xProvider.core.transfer({
                receipient_address: address,
                value: 1,
                private_key: no_balance_private_key
            })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });

        it('Should throw an error for an invalid fee limit', async () => {
            await expect(async () => await l1xProvider.core.transfer({
                receipient_address: address,
                value: 1,
                private_key: no_balance_private_key,
                fee_limit: 70000000000000000000000000000000
            })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });
    });


    
    describe('L1XProvider v1.0.0 > getBlockByNumber', () => {
        it("Should return a successful response", async () => {
            let _response = await l1xProvider.core.getBlockByNumber({
                block_number: block_number
            });

            console.log(_response,"getBlockByNumber");
            
            expect(_response).toEqual(expect.objectContaining({
                block: {
                    number: expect.any(String),
                    hash: expect.any(String),
                    parent_hash: expect.any(String),
                    timestamp: expect.any(Number),
                    transactions: expect.any(Array),
                    block_type: expect.any(Number),
                    cluster_address: expect.any(String)
                }
            }));
        });


        it('Should throw an error for an invalid block number', async () => {
            await expect(async () => await l1xProvider.core.getBlockByNumber({ block_number: wrong_block_number })).rejects.toThrowError(
                //   'block fetch error: Failed to get block: block_state : block_header_data 379: Unable to read row'
                expect.any(Error)
            );
        });
    });

    
    describe('L1XProvider v1.0.0 > getCurrentNonce', () => {
        it("Should return active nonce for correct wallet address", async () => {
            let _response = await l1xProvider.core.getCurrentNonce({
                address: address,
            });
            console.log("🚀 ~ file: l1x_core.test.ts:72 ~ it ~ _response:", _response)

            expect(_response).toEqual(expect.any(Number));
        });


        it('Should throw an error for an invalid wallet address', async () => {
            await expect(async () => await l1xProvider.core.getCurrentNonce({ address: wrong_address })).rejects.toThrowError(
                //   'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });
    });


    describe('L1XProvider v1.0.0 > getChainState', () => {
        it("Should return a successful response", async () => {
            let _response = await l1xProvider.core.getChainState();

            expect(_response).toEqual(expect.objectContaining({
                cluster_address: expect.any(String),
                head_block_number: expect.any(String),
                head_block_hash: expect.any(String),
            }));
        });
    });


    describe('L1XProvider v1.0.0 > getEvents', () => {
        it("Should return all the events is correct timestamp and transaction hash is passed", async () => {
            let _response = await l1xProvider.core.getEvents({
                "tx_hash": transaction_hash,
                "timestamp": timestamp
            });

            expect(_response).toEqual(expect.arrayContaining([]));
        });


        it('Should throw an error for invalid transaction hash', async () => {
            await expect(async () => await l1xProvider.core.getEvents({
                "tx_hash": wrong_transaction_hash,
                "timestamp": timestamp
            })).rejects.toThrowError(
                //   'parse error: Invalid hash str length: 58'
                expect.any(Error)
            );
        });


        it('Should return empty array for an invalid timestamp', async () => {
            let _response = await l1xProvider.core.getEvents({
                "tx_hash": transaction_hash,
                "timestamp": wrong_timestamp
            });

            expect(_response).toEqual(expect.arrayContaining([]));
        });
    });


    describe('L1XProvider v1.0.0 > getTransactionsByAccount', () => {
        it("Should return list of transactions if all the values passed correctly", async () => {
            let _response = await l1xProvider.core.getTransactionsByAccount({
                "address": address,
                "number_of_transactions": no_of_transactions,
                "starting_from": starting_from
            });


            expect(_response).toEqual(
                expect.arrayContaining(
                    [
                        expect.objectContaining({
                            "transaction": {
                                "tx_type": expect.any(Number),
                                "transaction": expect.any(Object)
                            },
                            "from": expect.any(String),
                            "transaction_hash": expect.any(String),
                            "block_number": expect.any(Number),
                            "block_hash": expect.any(String),
                            "fee_used": expect.any(String),
                            "timestamp": expect.any(Number)
                        })
                    ]
                )
            )
        });


        it('Should throw an error for an invalid wallet address', async () => {
            await expect(async () => await l1xProvider.core.getTransactionsByAccount({
                "address": wrong_address,
                "number_of_transactions": no_of_transactions,
                "starting_from": starting_from
            })).rejects.toThrowError(
                // 'invalid address: Invalid address length 17'
                expect.any(Error)
            );
        });


        it('Should return an empty array for invalid number of transactions', async () => {
            let _response = await l1xProvider.core.getTransactionsByAccount({
                "address": address,
                "number_of_transactions": wrong_no_of_transactions,
                "starting_from": starting_from
            });

            expect(_response).toEqual([])
        });


        it('Should throw an error for an invalid starting from', async () => {
            await expect(async () => await l1xProvider.core.getTransactionsByAccount({
                "address": address,
                "number_of_transactions": no_of_transactions,
                "starting_from": wrong_starting_from
            })).rejects.toThrowError(
                // 'Invalid params'
                expect.any(Error)
            );
        });
    });


    describe('L1XProvider v1.0.0 > getTransactionReceipt', () => {
        it("Should return correct response for valid transaction hash", async () => {
            let _response = await l1xProvider.core.getTransactionReceipt({
                hash: transaction_hash_receipt_function
            }); 

            console.log(_response,"L1XProvider v1.0.0 > getTransactionReceipt");

            expect(_response).toEqual(expect.objectContaining(
                {
                    "transaction": {
                        "tx_type": expect.any(Number),
                        "transaction": expect.any(Object)
                    },
                    "from": expect.any(String),
                    "transaction_hash": expect.any(String),
                    "block_number": expect.any(Number),
                    "block_hash": expect.any(String),
                    "fee_used": expect.any(String),
                    "timestamp": expect.any(Number)
                }
            ));
        });


        it('Should throw an error for an invalid transaction hash', async () => {
            await expect(async () => await l1xProvider.core.getTransactionReceipt({ hash: wrong_transaction_hash_receipt_function })).rejects.toThrowError(
                // 'parse error: Invalid hash str length: 58'
                expect.any(Error)
            );
        });
    });


    
    // */


    /*
    // Not Working --------------------
    describe('L1XProvider v1.0.0 > getTransactionReceipt', () => {
        it("Should return correct response for valid parameters", async () => {
            let _response = await l1xProvider.core.getStake({
                "pool_address": pool_address,
                "account_address": address
            });

            expect(_response).toEqual(expect.objectContaining(
                {
                    "hash": expect.any(String)
                }
            ));
        });


        it('Should throw an error for an invalid pool address', async () => {
            await expect(async () => await l1xProvider.core.getStake({
                "pool_address": wrong_pool_address,
                "account_address": address
            })).rejects.toThrowError(
                "Invalid params"
            );
        });


        it('Should throw an error for an invalid wallet address', async () => {
            await expect(async () => await l1xProvider.core.getStake({
                "pool_address": pool_address,
                "account_address": wrong_address
            })).rejects.toThrowError(
                "Invalid params"
            );
        });
    });
    */


    
});

