import { L1XProvider } from "../src/index";

describe("Testing L1X VM Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "mainnet",
  });

  let private_key = "";
  let contract_init_address = "2092b9b5fbaa7a924fae9547e6997832300fe15c";

  describe("Testing Contract Init", () => {
    it("Should return correct response", async () => {
      let _response = await l1xProvider.vm.init({
        attrib: {
          arguments: {},
          base_contract_address: "1e6c0451505da3afeb1ed547b0cbfeefa40bfd15",
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
  });

  return;

  describe("Testing Contract ReadOnly Calls",  () => {
    it("Should return correct response", async () => {

      let _response = await l1xProvider.vm.makeReadOnlyCall({
        attrib: {
          arguments: {
            "token": "BNB", 
            "value":"10000",
            "duration":"180"
          },
          contract_address: contract_init_address,
          function:"get_token_rewards"
        },
      });

      console.log("Contract ReadOnly Call: ", _response);

      expect(_response).toEqual(expect.any(String));
    });
  });

  describe("Testing Contract State Changing Calls",  () => {
    it("Should return correct response", async () => {

      let _response = await l1xProvider.vm.makeStateChangingFunctionCall({
        attrib: {
          arguments: {
            "token": "BNB", 
            "new_percentage":"113940",
            "duration":"180"
          },
          contract_address: contract_init_address,
          function:"update_token_rewards_percentage"
        },
        private_key: private_key,
        fee_limit: 1,
      });

      console.log("Contract State Changing Call: ", _response);

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    }); 
  });
});
