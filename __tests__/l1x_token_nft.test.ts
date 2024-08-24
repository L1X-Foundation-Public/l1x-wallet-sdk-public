import { L1XProvider } from "../src/index";
import { generateRandomString } from "../src/utils/general";

jest.setTimeout(30000);

describe("Testing L1X Tokens NFT Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "mainnet",
    endpoint:"https://v2-mainnet-rpc.l1x.foundation"
  });

  let wallet: any = {};
  let privateKey = "6668446bbea04c0b5a6cf6d96667fbfd88a91c960c7218f2e27d11ce07bcee8f";
  let spenderAddress = "d67065eedf8be48b3d62c22db022701e82f9a284";

  beforeAll(async () => {
    l1xProvider = new L1XProvider({
      clusterType: "mainnet",
      endpoint:"https://v2-mainnet-rpc.l1x.foundation"
    });

    wallet = await l1xProvider.wallet.importByPrivateKey(
      privateKey
    );
  });

  let _baseContract = "da545570e466ce8d98622917e4d6c07233f04d9a";

  let _tokenAddress = "";
  let tokenAddress = "";
  let _tokenName = generateRandomString(10);
  let _tokenSymbol = generateRandomString(10);
  let _tokenIcon = "ipfs://"+generateRandomString(10);
  let _baseUri = "ipfs://"+generateRandomString(10)+"/"; // collection base uri
  let _tokenUri = "asjgdjkashdkasdashkj"; // token id based cid
  let _tokenUriById = _tokenUri+"1.json";


  describe("L1XProvider > NFT > Create Token", () => {

    // it("Get Current Nonce ", async () => {
    //   let _response = await l1xProvider.core.getCurrentNonce({
    //     address: wallet.address,
    //   });

    //   console.log("Get Current Nonce > Response", _response);
    //   expect(_response).toEqual(expect.any(Number));
    // });



    it("NFT Creation ", async () => {
      let _response = await l1xProvider.tokens.NFT.create({
        attrib: {
          baseContract: _baseContract,
          name: _tokenName,
          symbol: _tokenSymbol,
          icon: _tokenIcon,
          uri: _baseUri
        },
        private_key: privateKey,
        fee_limit: 10000,
      });
      console.log("🚀 ~ it ~ -----------", {
        attrib: {
          baseContract: _baseContract,
          name: _tokenName,
          symbol: _tokenSymbol,
          icon: _tokenIcon,
          uri: _baseUri,
          decimals: 18
        },
        private_key: privateKey,
        fee_limit: 10000,
      })

      await new Promise((r) => setTimeout(r, 4000));

      console.log("L1XProvider > NFT > Create Token", _response);

      _tokenAddress = _response["contract_address"];
      console.log("🚀 ~ it ~ _tokenAddress:", _tokenAddress)
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
          icon: _tokenIcon,
          uri: _baseUri,
          decimals: 18
        }
      );
    });






    it("Minting Token ", async () => {
      let _response = await l1xProvider.tokens.NFT.mintTo({
        attrib: {
          contract_address: _tokenAddress, // _collectionAddress,
          recipient_address: wallet.address,
          token_id: 2,
          token_uri: _tokenUri
        },
        private_key: privateKey,
        fee_limit: 17888888888888888,
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("Minting Token " + _tokenAddress, _response);

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });


    it("Token Details ", async () => {
      let _response = await l1xProvider.tokens.NFT.getTokenUri({
        contract_address: _tokenAddress,
        token_id: 2
      });

      console.log("Get Attribute Details " + _tokenAddress, _response);

      expect(_response).toEqual(
        {
          token_uri: _tokenUri
        }
      );
    });

    // it("Checking Owner of Minted token", async () => {
    //   let _response = await l1xProvider.tokens.NFT.getOwnerOfTokenId({
    //     contract_address: _tokenAddress,
    //     token_id: 1
    //   });

    //   console.log("Owner of Minted token " + _tokenAddress, _response);

    //   expect(_response).toEqual({
    //     owner_address: wallet.address,
    //   });
    // });


    // it("Checking Ids owned by user", async () => {
    //   let _response = await l1xProvider.tokens.NFT.getOwnedTokens({
    //     contract_address: "3ea1eed6d04b5453e25f1bf73b303d8a84fff121",
    //     address: "0ddc4369204d7eb9d0c48b44e09c9a44ca3b2000"
    //   });

    //   console.log("Owner of Minted token " + _tokenAddress, _response);

    //   // expect(_response).toEqual({
    //   //   owner_address: wallet.address,
    //   // });
    // });

    // it("Get Balance", async () => {
    //   let _response = await l1xProvider.tokens.NFT.getBalance({
    //     contract_address: '06574632e929dbd78949443e1cba52c2c52ab6a7',
    //     address: '75104938baa47c54a86004ef998cc76c2e616289'
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

    // it("Approve", async () => {
    //   let _response = await l1xProvider.tokens.NFT.approve({
    //     attrib: {
    //       contract_address: tokenAddress,
    //       spender_address: wallet.address,//spenderAddress,
    //       token_id: "1",
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("L1XProvider > NFT > Approve NFT", _response);

    //   let _hash = _response["hash"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

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

    // it("Set apporoval all", async () => {
    //   let _response = await l1xProvider.tokens.NFT.setApprovalForAll({
    //     attrib: {
    //       contract_address: tokenAddress,
    //       operator_address: wallet.address,
    //       approved: true,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("L1XProvider > NFT > Approval all", _response);

    //   //_tokenAddress = _response["hash"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });


    // it("Transfer From", async () => {
    //   let _response = await l1xProvider.tokens.NFT.transferFrom({
    //     attrib: {
    //       contract_address: tokenAddress,
    //       recipient_address: wallet.address,
    //       token_id: 1,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("L1XProvider > NFT > Transfer From", _response);

    //   _tokenAddress = _response["hash"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });


    // it("NFT Burn", async () => {
    //   let _response = await l1xProvider.tokens.NFT.burn({
    //     attrib: {
    //       contract_address: tokenAddress,
    //       token_id: "1",
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("L1XProvider > NFT > NFT Burn", _response);

    //   _tokenAddress = _response["hash"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });


  });
});
