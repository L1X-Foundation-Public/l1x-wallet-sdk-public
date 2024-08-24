import { L1XProvider } from "../src/index";
import fs from "fs/promises";
import DIDAbi from "./evm_abi";
import VaultAbi from "./Vault_abi";
import BalancerQuery_abi from "./BalancerQuery_abi";
import { StablePoolEncoder } from "@balancer-labs/sdk";
import { parseEther } from "ethers/lib/utils";
import { ethers} from "ethers";

jest.setTimeout(30000);


describe("Testing L1X VM Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    // clusterType: "testnet",
    // endpoint:"http://13.215.240.95:50051"
    clusterType: "mainnet",
    endpoint:"https://v2-mainnet-rpc.l1x.foundation"
  });

  let private_key = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";
  let contract_init_address = "1e1ec9cd126a6d4941e9dc7D3761f2279EeFb309";

  /*
    TODO: Need to Work on this
  describe("Testing Contract Deploy", () => {
    it("Should return correct response", async () => {
      let _response = await l1xProvider.evm.deploy({
        attrib: {
          byte_code: (await fs.readFile("./__tests__/evm_deploycode.txt")).toString(),
        },
        private_key: private_key,
        fee_limit: 1,
      });

      contract_init_address = _response.contract_address;

      console.log("Contract Deployed: ", _response);

      expect(_response).toEqual(
        expect.objectContaining({
          contract_address: expect.any(String),
          hash: expect.any(String),
        })
      );
    });
  }); */

  // describe("Testing Contract Init", () => {
  //   it("Should return correct response", async () => {
  //     let _response = await l1xProvider.evm.init({
  //       attrib: {
  //         base_contract_address: "604df657c9dd8de7a1e0acf6590bb7c0516740ee",
  //         arguments: {}
  //       },
  //       private_key: private_key,
  //       fee_limit: 1,
  //     });

  //     contract_init_address = _response.contract_address;

  //     console.log("Contract Init: ", _response);

  //     expect(_response).toEqual(
  //       expect.objectContaining({
  //         contract_address: expect.any(String),
  //         hash: expect.any(String),
  //       })
  //     );
  //   });
  // });


  describe("Testing Contract State Changing Calls", () => {
    it("Should return correct response", async () => {

      let private_key = "458843432d1ea8dd06e8fb5701636803973220dd6f261573fdcea5acead4b847";
      let contract_init_address_pool = "8ABBA8B2fc8C46b409a405F1E61fF5441Dd2F22F";

      let _responseData1 = await l1xProvider.balancer.makeReadOnlyCall({
          attrib: {
              arguments: {
                  poolId: "0x1022f150ae8526432725580c170f5520b94e318c000000000000000000000000",
                  sender: ethers.constants.AddressZero,
                  recipient: ethers.constants.AddressZero,
                  request: {
                      assets: [
                        '0x0bDf101013CA6937ef1ED0D596203d6f895cfDea',
                        '0x0da081312d1eC2fA835927c36f91bF2D57e4b422',
                        '0x1022f150Ae8526432725580C170F5520b94E318c'
                      ],
                      maxAmountsIn: [
                          ethers.constants.MaxUint256,
                          ethers.constants.MaxUint256,
                          ethers.constants.MaxUint256
                      ],
                      fromInternalBalance: false,
                      userData: StablePoolEncoder.joinExactTokensInForBPTOut([parseEther('25'),parseEther('50')], 0)
                  }
              },
              contract_address: contract_init_address_pool,
              function: "queryJoin",
              abi: BalancerQuery_abi
          },
          private_key: private_key,
          fee_limit: 10000
      })
      console.log("🚀 ~ file: contract_init_address_pool ========================== :", (_responseData1?.[0]?.bptOut)?.toString())
      console.log("🚀 ~ file: contract_init_address_pool ========================== :", _responseData1)
      return;


      const didDocument = {
        context: ['https://www.w3.org/ns/did/v1'],
        id: 'did:ethr:0x123297897894634756546546',
        controller: '0x12345654345453453435435cdefghi',
      };

      console.log(didDocument,"didDocument");
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

     
      
      // await new Promise((resolve,reject) => setTimeout(resolve,5000));

      // let _responseData = await l1xProvider.evm.makeReadOnlyCall({
      //   attrib:{
      //     arguments:{
      //       did: didDocument.id,
      //     },
      //     contract_address: contract_init_address,
      //     function: "fetchDID",
      //     abi: DIDAbi
      //   },
      //   private_key: private_key,
      //   fee_limit: 1,
      // })
      
      // console.log("Data : ",_responseData);



      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });
  });

  return;

  describe("Testing Contract ReadOnly Calls", () => {
    it("Should return correct response", async () => {
      let _response = await l1xProvider.vm.makeReadOnlyCall({
        attrib: {
          arguments: {
            token: "BNB",
            value: "10000",
            duration: "180",
          },
          contract_address: contract_init_address,
          function: "get_token_rewards",
        },
      });

      console.log("Contract ReadOnly Call: ", _response);

      expect(_response).toEqual(expect.any(String));
    });
  });

 
});
