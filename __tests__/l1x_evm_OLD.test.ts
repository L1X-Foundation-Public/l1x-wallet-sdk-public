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

      let private_key = "6913aeae91daf21a8381b1af75272fe6fae8ec4a21110674815c8f0691e32758";
      let contract_init_address_pool = "73BaA866bB86e10fe86CC0EaD0DdC919C5CC4b31";

      // const l1xEvmProvider = new ethers.providers.JsonRpcProvider("https://v2-mainnet-rpc.l1x.foundation");

      // const VaultContract = new ethers.Contract(
      //   '0x'+contract_init_address_pool,
      //   BalancerQuery_abi,
      //   l1xEvmProvider
      // );
  
  
      // const _responseData = await VaultContract.queryJoin(
      //   "0x7d3381fce4d28e8d37f43f94f29dc2114c8695a3000000000000000000000003",
      //   ethers.constants.AddressZero,
      //   ethers.constants.AddressZero,
      //   {
      //       assets: ["0x7D3381fce4d28e8D37F43F94F29DC2114c8695A3","0xE9cB626Df761654298a3aD4f2F1AE260B72793a2","0xfDB650b8Dd98BE1bd77eE26B1bAD0E44E94f07c5"],
      //       maxAmountsIn: [
      //           ethers.constants.MaxUint256,
      //           ethers.constants.MaxUint256,
      //           ethers.constants.MaxUint256
      //       ],
      //       fromInternalBalance: false,
      //       userData: StablePoolEncoder.joinExactTokensInForBPTOut([parseEther('25'),parseEther('50')], 0)
      //   }
      // );
      // console.log("🚀 ~ it ~ _responseData:", _responseData)

      // let _responseData1 = await l1xProvider.balancer.makeReadOnlyCall({
      //     attrib: {
      //         arguments: {
      //             poolId: "0x7d3381fce4d28e8d37f43f94f29dc2114c8695a3000000000000000000000003",
      //             sender: ethers.constants.AddressZero,
      //             recipient: ethers.constants.AddressZero,
      //             request: {
      //                 assets: ["0x7D3381fce4d28e8D37F43F94F29DC2114c8695A3","0xE9cB626Df761654298a3aD4f2F1AE260B72793a2","0xfDB650b8Dd98BE1bd77eE26B1bAD0E44E94f07c5"],
      //                 maxAmountsIn: [
      //                     ethers.constants.MaxUint256,
      //                     ethers.constants.MaxUint256,
      //                     ethers.constants.MaxUint256
      //                 ],
      //                 fromInternalBalance: false,
      //                 userData: StablePoolEncoder.joinExactTokensInForBPTOut([parseEther('25'),parseEther('50')], 0)
      //             }
      //         },
      //         contract_address: contract_init_address_pool,
      //         function: "queryJoin",
      //         abi: BalancerQuery_abi
      //     },
      //     private_key: private_key,
      //     fee_limit: 10000
      // })
      let _responseData1 = await l1xProvider.vm
        .makeReadOnlyCall({
          attrib: {
           contract_address: '61d636cb024e615874ac7085519d7b9b016b1d69',
           function: 'get_node_counter',
           arguments: { wallet_address: 'd7a546239E2Bb62Cb54475cbB814e1C0b7e6EF1d' }
          }
         })
      console.log("🚀 ~ file: contract_init_address_pool ========================== :", _responseData1)
      // console.log("🚀 ~ file: contract_init_address_pool ========================== :", _responseData1.bptOut.toString())
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
