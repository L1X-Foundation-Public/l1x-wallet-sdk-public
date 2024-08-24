import { L1XProvider } from "../src/index";

const networkJSON = require("../../l1x-single-stake-contract/scripts/devnet/networkWise.json");

describe("Testing L1X VM Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "mainnet",
  });

  let private_key:string = process.env.SIGNER_PRIVATE_KEY || "";

  

  const REGISTRY_CONTRACT = "d2547013c0732a5577d10f1c4f5fe29bd8a4db9f";
  const STAKE_CONTRACT = "3c6613e3e59d22d7620e899265ace6b138c575e0";
  const SWAP_CONTRACT = "deeecb212320ecdea25579f57646759426ea81ad";

  let SWAP_BASE_ARG = {
    flow_contract_address: SWAP_CONTRACT,
    source_id: "0",
    chain: "",
    source_type: "swap",
    smart_contract_address: "",
    event_type: "",
    event_filters: ["eb09a887671b5b2c1c675cfb40497d7109408e5ee11bcabbc520c28255830bab"],
  };

  let SWAP_BASE_ARG_FULFILLED = {
    flow_contract_address: SWAP_CONTRACT,
    source_id: "1",
    chain: "",
    source_type: "swap",
    smart_contract_address: "",
    event_type: "",
    event_filters: ["a18d121c483b8599888954b079ef9ae82d3c03b62c381a1226c3621c4f60bf9d"],
  };

  let STAKE_BASE_ARG = {
    flow_contract_address: STAKE_CONTRACT,
    source_id: "0",
    chain: "",
    source_type: "stake",
    smart_contract_address: "",
    event_type: "stake",
    event_filters: ["f43429288ab550cebc13c9c43ad3f71d3c07628381c93e50044b08761fd035f0"],
  };

  // it("Get Transaction Hash", async () => {

  //   let _response = await l1xProvider.core.getTransactionReceipt({
  //     hash: "a31c077177b8b5a8d2694a2ef294aac09a816e5bf689a82d56052ad64ce437bd"
  //   });

  //     console.log("Get Transaction Response", JSON.stringify(_response.transaction.transaction));
  // });

  // return;

  // it("Get Total Events", async () => {

  //   let _response = await l1xProvider.vm.makeReadOnlyCall({
  //       attrib: {
  //         arguments: {},
  //         contract_address: SWAP_CONTRACT,
  //         function: "total_events",
  //       }
  //     });

  //     console.log("Get Resources Response", _response);
  // });

  // return;

  it("Get Payload Hash", async () => {

    let _response = await l1xProvider.vm.makeReadOnlyCall({
        attrib: {
          arguments: {"global_tx_id": "CD7A16388164B102FCB6F66A8FCAE537F0A17820699331C569B397E64A5B6682"},
          contract_address: SWAP_CONTRACT,
          function: "get_payload_hash_to_sign",
        }
      });

      console.log("Get Resources Response", _response);
  });

  return;

  it("Get Registered Sources", async () => {

    let _response = await l1xProvider.vm.makeReadOnlyCall({
        attrib: {
          arguments: {"from_index": "0"},
          contract_address: REGISTRY_CONTRACT,
          function: "get_sources_from",
        }
      });

      console.log("Get Resources Response", _response);
  });


  it("Register Sources ", async () => {
    
    // stake
    // swap_init
    // swap_fulfilled

    let _option = "swap_fulfilled";

    for (let network in networkJSON) {
      if (network == "HARDHAT") {
        continue;
      }

      // if (network != "AVAX") {
      //   continue;
      // }


      // Stake
      if(_option == "stake"){
        STAKE_BASE_ARG.chain = network;
        STAKE_BASE_ARG.smart_contract_address = networkJSON[network].STAKE_CONTRACT_ADDRESS.substring(2);

        let _response = await l1xProvider.vm.makeStateChangingFunctionCall({
          attrib: {
            arguments: STAKE_BASE_ARG,
            contract_address: REGISTRY_CONTRACT,
            function: "register_new_source",
          },
          private_key: private_key,
          fee_limit: 1,
        });

        await new Promise((resolve,reject) => setTimeout(resolve,3000));

        console.log("Stake Registered for " + network);
        console.log("Stake Response", _response);
      }
      

      // Swap Initiated 
      if(_option == "swap_init"){
        SWAP_BASE_ARG.chain = network;
        SWAP_BASE_ARG.smart_contract_address = networkJSON[network].SWAP_CONTRACT_ADDRESS.substring(2);

        let _responseSwap = await l1xProvider.vm.makeStateChangingFunctionCall({
          attrib: {
            arguments: SWAP_BASE_ARG,
            contract_address: REGISTRY_CONTRACT,
            function: "register_new_source",
          },
          private_key: private_key,
          fee_limit: 1,
        });

        await new Promise((resolve,reject) => setTimeout(resolve,5000));

        console.log("Swap Init Registered for " + network);
        console.log("Swap Init Response", _responseSwap);
      }  

      // Swap Fullfilled 

      if(_option == "swap_fulfilled"){
        SWAP_BASE_ARG_FULFILLED.chain = network;
        SWAP_BASE_ARG_FULFILLED.smart_contract_address = networkJSON[network].SWAP_CONTRACT_ADDRESS.substring(2);

        let _responseSwapFulfilled = await l1xProvider.vm.makeStateChangingFunctionCall({
          attrib: {
            arguments: SWAP_BASE_ARG_FULFILLED,
            contract_address: REGISTRY_CONTRACT,
            function: "register_new_source",
          },
          private_key: private_key,
          fee_limit: 1,
        });

        await new Promise((resolve,reject) => setTimeout(resolve,5000));

        console.log("Swap Registered for " + network);
        console.log("Swap Response", _responseSwapFulfilled);
      }
    }

    
  });
});
