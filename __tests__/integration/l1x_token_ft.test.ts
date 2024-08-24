import { L1XProvider } from "../../src/index";
import { generateRandomString } from "../../src/utils/general";
import { convertExponentialToString } from "../../src/utils/number";

jest.setTimeout(30000);

describe("Testing L1X Tokens FT Features", () => {
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

  describe("L1XProvider > FT > Create Token", () => {
    let _tokenAddress = "";
    let _tokenName = generateRandomString(10);
    let _tokenSymbol = generateRandomString(10);
 
      
    let _tokenAttrib = {
      name: _tokenName,
      symbol: _tokenSymbol,
      decimals: 18,
      initial_supply: 10000 * 10 ** 18,
      // initial_supply: 1000,
    };

    it("Get Current Nonce ", async () => {
      

      let _response = await l1xProvider.core.getCurrentNonce({
        address: wallet.address,
      });

      expect(_response).toEqual(expect.any(Number));
    });

    it("Create Token > Response Structure Matches", async () => {
      let _response = await l1xProvider.tokens.FT.create({
        attrib: _tokenAttrib,
        private_key: privateKey,
        fee_limit: 1000,
      });

      await new Promise((r) => setTimeout(r, 4000));

      console.log("Create Token > Response", _response);

      _tokenAddress = _response["contract_address"];

      expect(_response).toEqual(
        expect.objectContaining({
          contract_address: expect.any(String),
          hash: expect.any(String),
        })
      );
    });

    it("Transfer Token From: "+wallet.address+" , To: 9dBD70551C88265F95ab4Cfb70463A0d2fef138d ", async () => {
      let _response = await l1xProvider.tokens.FT.transfer({
        attrib: {
          contract_address: _tokenAddress,
          recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
          value: 1,
        },
        private_key:privateKey,
        fee_limit: 1,
      });

      console.log(
        _response,
        "Transfer Token From: "+wallet.address+" ,"
      );

      expect(_response).toEqual(
        expect.objectContaining({
          hash: expect.any(String),
        })
      );
    });

    it("Get Balance for "+wallet.address, async () => {
      console.log(_tokenAddress, "_tokenAddress");

      let _response = await l1xProvider.tokens.FT.getBalance({
        contract_address: _tokenAddress,
        address: wallet.address,
      });

      console.log(
        _response,
        "Get Balance for "+wallet.address
      );

      expect(_response).toEqual(
        expect.objectContaining({
          value: expect.any(String),
          decimals: expect.any(Number),
          normalized_value: expect.any(String),
        })
      );
    });


    it("Get Attribute Details ", async () => {
      let _response = await l1xProvider.tokens.FT.getAttribute({
        contract_address: _tokenAddress,
      });

      console.log(_response, "Get Attribute Details");
      expect(_response).toEqual(
        expect.objectContaining({
          name: _tokenAttrib.name,
          symbol: _tokenAttrib.symbol,
          decimals: _tokenAttrib.decimals,
          total_supply: convertExponentialToString(_tokenAttrib.initial_supply),
        })
      );
    });

    it("Get Allowance for Owner: "+wallet.address+" , Spender: 9dBD70551C88265F95ab4Cfb70463A0d2fef138d ", async () => {
      let _response = await l1xProvider.tokens.FT.getAllowance({
        contract_address: _tokenAddress,
        owner_address: wallet.address,
        spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
      });

      expect(_response).toEqual(
        expect.objectContaining({
          value: expect.any(String),
          decimals: expect.any(Number),
          normalized_value: expect.any(String),
        })
      );
    });
  });
});
