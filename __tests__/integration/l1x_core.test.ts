import { L1XProvider} from "../../src/index";

jest.setTimeout(30000);

describe("Testing L1X Core Features", () => {

    let l1xProvider:L1XProvider =  new L1XProvider({
        clusterType:"testnet",
    }) 

    beforeAll(async () => {
        l1xProvider =  new L1XProvider({
            clusterType:"mainnet",
        }) 
    })

   


    describe('L1XProvider > Wallet By Private Key', () => {
        it("Importing Wallet By Private Key ",async () =>{

            // let _response = await l1xProvider.wallet.importByPrivateKey("d03e4bf978a7f244174ba282ed55972c9dbc0ad1edd55a9a580b08c36a817c28");
            let _response = await l1xProvider.wallet.importByPrivateKey("6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46");

            console.log(_response,"_response");
            expect(_response).toEqual(expect.objectContaining({
                private_key:expect.any(String),
                public_key:expect.any(String),
                public_key_bytes:expect.any(Uint8Array),
                address:expect.any(String),
                address_with_prefix:expect.any(String),
            }));
        });

        // Todo Need write more testcases
       
    });



    describe('L1XProvider > getBlockByNumber', () => {
        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getBlockByNumber({
                block_number: "1"
            });
  
            console.log(_response,"L1XProvider > getBlockByNumber");

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

    });


    /* describe('L1XProvider > getCurrentNonce', () => {
        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getCurrentNonce({
                address: "0101010101010101010101010101010101010101",
            });
            
            expect(_response).toEqual(expect.any(Number));
        });

    }); */


    describe('L1XProvider > getChainState', () => {
        
        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getChainState();

            console.log("L1XProvider > getChainState",_response);
            
            expect(_response).toEqual(expect.objectContaining({
                cluster_address:expect.any(String),
                head_block_number:expect.any(String),
                head_block_hash:expect.any(String),
            }));
        });

    });


    describe('L1XProvider > getAccountState', () => {
        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getAccountState({
                address: "04618eB5452081a7D9b3EF3F7dF4ab51Cb8526B9"
            });

            console.log("L1XProvider > getAccountState",_response);

            expect(_response).toEqual(expect.objectContaining({
                account_state: {
                    balance: expect.any(String),
                    balance_formatted: expect.any(String),
                    nonce:expect.any(Number),
                    account_type: expect.any(Number)
                }
            }));
            
        });
    });

  

   





    describe('L1XProvider > Native Coin Transfer', () => {
       
        let txHash:string = "";

        it("Transfer 1 L1X token ",async () =>{

            let _response = await l1xProvider.core.transfer({
                receipient_address:"04618eB5452081a7D9b3EF3F7dF4ab51Cb8526B9",
                value: 1000 * (10 ** 18),
                private_key: "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46",
                fee_limit: 1
            });

            await new Promise((r) => setTimeout(r, 4000));

            console.log(_response,"Transfer 1 L1X token hash");

            txHash = _response.hash;
            expect(_response).toEqual(expect.objectContaining({
                hash:expect.any(String)
            }));
        });
        
        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getAccountState({
                address: "04618eB5452081a7D9b3EF3F7dF4ab51Cb8526B9"
            });

            console.log("L1XProvider > getAccountState",_response);

            expect(_response).toEqual(expect.objectContaining({
                account_state: {
                    balance: expect.any(String),
                    balance_formatted: expect.any(String),
                    nonce:expect.any(Number),
                    account_type: expect.any(Number)
                }
            }));
            
        });

        return;
      
        it("L1XProvider > getTransactionsByAccount",async () =>{
            let _response = await l1xProvider.core.getTransactionsByAccount({
                address: "137da5cfffa18adb4bd4ae4248dd9aa9355310a3",
                number_of_transactions: 1,
                starting_from: 0
            });

            console.log("L1XProvider > getTransactionsByAccount",_response)
            
            expect(_response).toEqual(expect.any(Array));
        });
    

        

        it("L1XProvider > getTransactionReceipt > Verifying Tx Hash: "+txHash,async () =>{
            
            console.log(txHash,"Verifying Tx Hash");
        
            await new Promise((r) => setTimeout(r, 4000));

            let _response = await l1xProvider.core.getTransactionReceipt({
                hash: txHash
            });

            console.log("L1XProvider > getTransactionReceipt > Verifying Tx Hash:",_response);

            expect(_response).toEqual(expect.objectContaining({
                transaction: {
                    transaction_type:expect.any(Object),
                },
                status:expect.any(Number),
                block_number:expect.any(String),
                block_hash: null,
                fee_used: expect.any(String)
            }));
        });

        it("L1XProvider > getEvents > Verifying Events ",async () =>{

            let _response = await l1xProvider.core.getEvents({
                tx_hash: txHash,
                timestamp: 0
            });

            expect(_response).toEqual(expect.objectContaining({
                events_data: []
            }));
        });

    });

    






    

    

    /* 
    // Not Applicable at the moment
    describe('L1XProvider > getStake', () => {
        it("Method Call Initiated",async () =>{
            let _response = await l1xProvider.core.getStake({
               account_address: "0101010101010101010101010101010101010101",
               pool_address: "0101010101010101010101010101010101010101"
            });
            expect(_response).not.toBeNull();
        });

        it("Response Structure Matches ",async () =>{
            let _response = await l1xProvider.core.getStake({
                account_address: "0101010101010101010101010101010101010101",
                pool_address: "0101010101010101010101010101010101010101"
            });
            
            expect(_response).toEqual("0");
        });

    }); */

    
});

