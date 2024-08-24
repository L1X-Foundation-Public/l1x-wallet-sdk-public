import { L1XProvider } from "../../src/index";
import { generateRandomString } from "../../src/utils/general";

jest.setTimeout(30000);

describe("Testing L1X Tokens NFT Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "testnet",
  });

  let wallet: any = {};
  let privateKey = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";
  let spenderAddress = "d67065eedf8be48b3d62c22db022701e82f9a284";

  beforeAll(async () => {
    l1xProvider = new L1XProvider({
      clusterType: "testnet",
    });

    wallet = await l1xProvider.wallet.importByPrivateKey(
      privateKey
    );
  });

  let _tokenAddress = "";
  let tokenAddress = "";
  let _tokenName = generateRandomString(10);
  let _tokenSymbol = generateRandomString(10);


  describe("L1XProvider > NFT > Create Token", () => {

    it("Get Current Nonce ", async () => {
      let _response = await l1xProvider.core.getCurrentNonce({
        address: wallet.address,
      });

      console.log("Get Current Nonce > Response", _response);
      expect(_response).toEqual(expect.any(Number));
    });



    it("NFT Creation ", async () => {
      let _response = await l1xProvider.tokens.NFT.create({
        attrib: {
          name: _tokenName,
          symbol: _tokenSymbol,
        },
        private_key: privateKey,
        fee_limit: 1,
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Create Token", _response);

      _tokenAddress = _response["contract_address"];
      tokenAddress = _response["contract_address"];

      expect(_response).toEqual(
        expect.objectContaining({
          contract_address: expect.any(String),
          hash: expect.any(String),
        })
      );
    });




    it("Attribute Matches ", async () => {
      let _response = await l1xProvider.tokens.NFT.getAttribute({
        contract_address: _tokenAddress,
      });

      console.log("Get Attribute Details " + _tokenAddress, _response);

      expect(_response).toEqual(
        {
          name: _tokenName,
          symbol: _tokenSymbol,
          total_minted: "0",
        }
      );
    });


    it("Minting Token ", async () => {
      let _response = await l1xProvider.tokens.NFT.mintTo({
        attrib: {
          contract_address: _tokenAddress, // _collectionAddress,
          recipient_address: wallet.address,
          token_id: 1
        },
        private_key: privateKey,
        fee_limit: 1,
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("Minting Token " + _tokenAddress, _response);

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });


    it("Checking Owner of Minted token", async () => {
      let _response = await l1xProvider.tokens.NFT.getOwnerOfTokenId({
        contract_address: _tokenAddress,
        token_id: 1
      });

      console.log("Owner of Minted token " + _tokenAddress, _response);

      expect(_response).toEqual({
        owner_address: wallet.address,
      });
    });

    it("Get Balance", async () => {
      let _response = await l1xProvider.tokens.NFT.getBalance({
        contract_address: '06574632e929dbd78949443e1cba52c2c52ab6a7',
        address: '75104938baa47c54a86004ef998cc76c2e616289'
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Get Balance", _response);

      _tokenAddress = _response["value"];

      expect(_response).toEqual(
        expect.objectContaining({
          value: expect.any(String),
        })
      );
    });

    it("Approve", async () => {
      let _response = await l1xProvider.tokens.NFT.approve({
        attrib: {
          contract_address: tokenAddress,
          spender_address: wallet.address,//spenderAddress,
          token_id: "1",
        },
        private_key: privateKey,
        fee_limit: 1
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Approve NFT", _response);

      let _hash = _response["hash"];

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });

    // it("Get balance with invalid contract address", async () => {
    //   let _response = await l1xProvider.tokens.NFT.getBalance({
    //     contract_address: "f9931c01b0631aefaacasdc881f24957c83d26db1779",
    //     address: "75104938baa47c54a86004ef998cc76c2e616289"
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("L1XProvider > NFT > Get Balance", _response);

    //   _tokenAddress = _response["value"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       value: expect.any(String),
    //     })
    //   );
    // });

    it("Set apporoval all", async () => {
      let _response = await l1xProvider.tokens.NFT.setApprovalForAll({
        attrib: {
          contract_address: tokenAddress,
          operator_address: wallet.address,
          approved: true,
        },
        private_key: privateKey,
        fee_limit: 1
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Approval all", _response);

      //_tokenAddress = _response["hash"];

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });


    it("Transfer From", async () => {
      let _response = await l1xProvider.tokens.NFT.transferFrom({
        attrib: {
          contract_address: tokenAddress,
          recipient_address: wallet.address,
          token_id: 1,
        },
        private_key: privateKey,
        fee_limit: 1
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Transfer From", _response);

      _tokenAddress = _response["hash"];

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });


    it("NFT Burn", async () => {
      let _response = await l1xProvider.tokens.NFT.burn({
        attrib: {
          contract_address: tokenAddress,
          token_id: "1",
        },
        private_key: privateKey,
        fee_limit: 1
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > NFT Burn", _response);

      _tokenAddress = _response["hash"];

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });


  });
});
