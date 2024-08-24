import { L1XProvider } from "../src";
import { Config } from "./config";
import fs from "fs/promises";

jest.setTimeout(300000);

let l1xProvider = new L1XProvider({
  clusterType: "mainnet",
  // endpoint:"http://127.0.0.1:50051" // L1X-Testnet-Core-v2
  endpoint:"https://v2-mainnet-rpc.l1x.foundation"// L1X-Testnet-Core-v2
});

let contract_init_address = "064f94b8c543e8128468c5f09bbcfd9175df77b2";
let private_key = "6668446bbea04c0b5a6cf6d96667fbfd88a91c960c7218f2e27d11ce07bcee8f" || "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";

// (async() => {

//   console.log(await l1xProvider.wallet.importByPrivateKey(private_key));
// })();

describe("L1X > VM > Deploy", () => {
  test("Happy flow", async () => {

    // console.log(await l1xProvider.core.getAccountState({
    //   address: "21f05ed3e1be2b2067a251125fef50db2f97f91a"
    // }));
    // return;

    let _response = await l1xProvider.vm.deploy({
      attrib: {
        base_contract_bytes: await fs.readFile("./__tests__/l1x_ft.o"),
        access_type: "PUBLIC",
      },
      private_key: private_key,
      fee_limit: 1000000000
    });
    console.log("🚀 ~ test ~ _response:", _response)
    expect(_response).toEqual(expect.objectContaining({
      contract_address: expect.any(String),
      hash: expect.any(String),
    }));
  });
});


// describe("L1X > VM > Init", () => {
//   test("Happy flow", async () => {
//     let _response = await l1xProvider.vm.init({
//       attrib:{
//         base_contract_address: "59b03cf360183cad99694d070c7891d2f205eb31",
//         arguments: {}
//       },
//       private_key: private_key,
//       fee_limit: 1000
//     });
//     console.log("🚀 ~ test ~ _response:", _response)
//     expect(_response).toEqual(expect.any(String));
//   });
// });

// describe("L1X > VM > makeReadOnlyCall", () => {
  // test("Happy flow", async () => {
  //   // let _response = await l1xProvider.vm.makeReadOnlyCall({
  //   //   attrib: {
  //   //     arguments: {
  //   //       wallet_address: "78e044394595d4984f66c1b19059bc14ecc24063",
  //   //     },
  //   //     contract_address: contract_init_address,
  //   //     function: "get_node_counter",
  //   //   },
  //   // });
  //   // console.log("🚀 ~ test ~ _response:", _response)
  //   // expect(_response).toEqual(expect.any(String));

  //   let _response = await l1xProvider.tokens.NFT.getAttribute({
  //     contract_address:"32a86f8a2f0b77ee16f7859ccd2010ab640f15ac"
  //   });
  //   console.log("🚀 ~ test ~ _response:", _response)
  //   expect(_response).toEqual(expect.any(String));
  // });

  // test("Should throw error for invalid parameter 'function'", async () => {
  //   await expect(
  //     l1xProvider.vm.makeReadOnlyCall({
  //       attrib: {
  //         arguments: {
  //           token: "BNB",
  //           value: "10000",
  //           duration: "180",
  //         },
  //         contract_address: contract_init_address,
  //         function: "INVALID_FUNCTION_NAME",
  //       },
  //     })
  //   ).rejects.toThrow();
  // });

  // test("Should throw error for invalid parameter 'contract_address'", async () => {
  //   await expect(
  //     l1xProvider.vm.makeReadOnlyCall({
  //       attrib: {
  //         arguments: {
  //           token: "BNB",
  //           value: "10000",
  //           duration: "180",
  //         },
  //         contract_address: "INVALID_CONTRACT_ADDRESS",
  //         function: "get_token_rewards",
  //       },
  //     })
  //   ).rejects.toThrow();
  // });
// });


// describe("L1X > VM > makeStateChangingFunctionCall", () => {
  
//   test("Happy flow", async () => {

//     console.log(Config.private_key,"Config.private_key");

//     let signedTx = await l1xProvider.vm.getSignedPayloadForStateChangingFunctionCall({
//       attrib: {
//         arguments: {"wallet_address":"78e044394595d4984f66c1b19059bc14ecc24063","uuid":uuid(),"payout_schedule":[{"month":1,"year":2024,"payoutAmount":"20000000000000000000","cliff":false},{"month":2,"year":2024,"payoutAmount":"200000000000000","cliff":false},{"month":3,"year":2024,"payoutAmount":"200000000000000","cliff":false},{"month":4,"year":2024,"payoutAmount":"200000000000000","cliff":false}],"bonus_payout_schedule":[{"month":1,"year":2024,"payoutAmount":"2000000000000","cliff":false},{"month":2,"year":2024,"payoutAmount":"2000000000000","cliff":false},{"month":3,"year":2024,"payoutAmount":"2000000000000","cliff":false}],"source":"public","amount_vested":"10000000000000000000000","tier":"silver"},
//         contract_address: contract_init_address,
//         function: "store_payout_schedule",
//         is_argument_object: true,
//       },
//       private_key: Config.private_key,
//       fee_limit: 10000,
//     });

//     let response = await l1xProvider.core.broadcastTransaction(signedTx);


//     console.log("🚀 ~ test ~ response:", response)
//     expect(response).toEqual(
//       expect.objectContaining({
//         hash: expect.any(String),
//       })
//     );
//   });

//   test("Should throw error for invalid parameter - contract_address", async () => {
//     await expect(
//       l1xProvider.vm.makeStateChangingFunctionCall({
//         attrib: {
//           arguments: {
//             token: "BNB",
//             new_percentage: "113940",
//             duration: "180",
//           },
//           contract_address: "INVALID_CONTRACT_ADDRESS",
//           function: "update_token_rewards_percentage",
//           is_argument_object: true,
//         },
//         private_key: Config.private_key,
//         fee_limit: 1,
//       })
//     ).rejects.toThrow();
//   });

//   // test("Should throw error for invalid parameter - function", async () => {
//   //   await expect(
//   //     l1xProvider.vm.makeStateChangingFunctionCall({
//   //       attrib: {
//   //         arguments: {
//   //           token: "BNB",
//   //           new_percentage: "113940",
//   //           duration: "180",
//   //         },
//   //         contract_address: contract_init_address,
//   //         function: "INVALID_FUNCTION",
//   //         is_argument_object: true,
//   //       },
//   //       private_key: Config.private_key,
//   //       fee_limit: 1,
//   //     })
//   //   ).rejects.toThrow();
//   // });

//   test("Should throw error for invalid parameter - private_key", async () => {
//     await expect(
//       l1xProvider.vm.makeStateChangingFunctionCall({
//         attrib: {
//           arguments: {
//             token: "BNB",
//             new_percentage: "113940",
//             duration: "180",
//           },
//           contract_address: contract_init_address,
//           function: "update_token_rewards_percentage",
//           is_argument_object: true,
//         },
//         private_key: "INVALID_PRIMARY_KEY",
//         fee_limit: 1,
//       })
//     ).rejects.toThrow();
//   });
// });

// describe("L1X > VM > init", () => {
//   let base_contract_address = "1e6c0451505da3afeb1ed547b0cbfeefa40bfd15";
//   test("Happy flow", async () => {
//     let response = await l1xProvider.vm.init({
//       attrib: {
//         arguments: {},
//         base_contract_address,
//       },
//       private_key: Config.private_key,
//       fee_limit: 1,
//     });
//     expect(response).toEqual(
//       expect.objectContaining({
//         contract_address: expect.any(String),
//         hash: expect.any(String),
//       })
//     );
//   });

//   test("Should throw error for invalid parameter - 'base_contract_address'", async () => {
//     await expect(
//       l1xProvider.vm.init({
//         attrib: {
//           arguments: {},
//           base_contract_address: "INVALID_BASE_CONTRACT_ADDRESS",
//         },
//         private_key: Config.private_key,
//         fee_limit: 1,
//       })
//     ).rejects.toThrow();
//   });

//   test("Should throw error for invalid parameter - 'private_key'", async () => {
//     await expect(
//       l1xProvider.vm.init({
//         attrib: {
//           arguments: {},
//           base_contract_address,
//         },
//         private_key: "INVALID_PRIVATE_KEY",
//         fee_limit: 1,
//       })
//     ).rejects.toThrow();
//   });
// });
