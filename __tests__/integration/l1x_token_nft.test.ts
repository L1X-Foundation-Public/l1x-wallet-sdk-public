import { L1XProvider } from "../../src/index";
import { generateRandomString } from "../../src/utils/general";

jest.setTimeout(30000);

describe("Testing L1X Tokens NFT Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "testnet",
  });

  let wallet:any = {};
  let privateKey = "6d657bbe6f7604fb53bc22e0b5285d3e2ad17f64441b2dc19b648933850f9b46";

  beforeAll(async () => {
    l1xProvider = new L1XProvider({
      clusterType: "testnet",
    });

    wallet = await l1xProvider.wallet.importByPrivateKey(
      privateKey
    );
  });

  let _tokenAddress = "";
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

      console.log("Get Attribute Details "+_tokenAddress,_response);

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

      console.log("Minting Token "+_tokenAddress,_response);

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

      console.log("Owner of Minted token "+_tokenAddress,_response);

      expect(_response).toEqual({
        owner_address: wallet.address,
      });
    });
    


    


   

   
  });
});
