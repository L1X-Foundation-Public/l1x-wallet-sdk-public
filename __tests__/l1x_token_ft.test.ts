import { parseEther } from "ethers/lib/utils";
import { L1XProvider } from "../src/index";
import { generateRandomString } from "../src/utils/general";
import { convertExponentialToString } from "../src/utils/number";

jest.setTimeout(30000);

describe("Testing L1X Tokens FT Features", () => {
  let l1xProvider: L1XProvider = new L1XProvider({
    clusterType: "mainnet",
    endpoint:"https://v2-mainnet-rpc.l1x.foundation"
  });

  let wallet: any = {};
  let privateKey = "6668446bbea04c0b5a6cf6d96667fbfd88a91c960c7218f2e27d11ce07bcee8f";

  beforeAll(async () => {
    l1xProvider = new L1XProvider({
      clusterType: "mainnet",
      endpoint:"https://v2-mainnet-rpc.l1x.foundation"
    });

    wallet = await l1xProvider.wallet.importByPrivateKey(privateKey);
  });

  describe("L1XProvider > FT > Create Token", () => {
    let _tokenAddress = "";
    let _tokenName = generateRandomString(10);
    let _tokenSymbol = generateRandomString(10);

    let _baseContract = "662e1b20c3020e930784fe44555ae6d52e818de3";

    let _tokenAttrib = {
      baseContract: _baseContract,
      name: _tokenName,
      symbol: _tokenSymbol,
      decimals: 18,
      initial_supply: 10000000000000000000,
    };
    console.log("🚀 ~ describe ~ _tokenAttrib:", _tokenAttrib)

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

    // it("Create Token With Missing Name", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: "",
    //       symbol: _tokenSymbol,
    //       decimals: 18,
    //       initial_supply: 10000 * 10 ** 18,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Missing Name", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Create Token With Invalid Decimals", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: "M",
    //       symbol: _tokenSymbol,
    //       decimals: 0,
    //       initial_supply: 10000 * 10 ** 18,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Invalid Decimals", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Create Token With Negative Initial Supply", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: _tokenName,
    //       symbol: _tokenSymbol,
    //       decimals: 18,
    //       initial_supply: -10000,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Negative Initial Supply", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Create Token With Insuffciant Balance", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: _tokenName,
    //       symbol: _tokenSymbol,
    //       decimals: 18,
    //       initial_supply: 10000,
    //     },
    //     private_key:
    //       "c3ac00baeb537a2987f89e2e0221e4c1f724a7bf440704cb26b759d9226042da",
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Insuffciant Balance", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Create Token With Maximum Decimals", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: _tokenName,
    //       symbol: _tokenSymbol,
    //       decimals: 1800000000,
    //       initial_supply: 10000,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Maximum Decimals", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Create Token With Maximum Initial Supply", async () => {
    //   let _response = await l1xProvider.tokens.FT.create({
    //     attrib: {
    //       baseContract: _baseContract,
    //       name: _tokenName,
    //       symbol: _tokenSymbol,
    //       decimals: 18,
    //       initial_supply: 10000000000000000000000000000000000000,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   await new Promise((r) => setTimeout(r, 4000));

    //   console.log("Create Token With Maximum Initial Supply", _response);

    //   _tokenAddress = _response["contract_address"];

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       contract_address: expect.any(String),
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Get Initial Owner Balance for " + wallet.address, async () => {
    //   let _response = await l1xProvider.tokens.FT.getBalance({
    //     contract_address: _tokenAddress,
    //     address: wallet.address,
    //   });

    //   console.log("Get Initial Owner Balance response", _response);

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       value: expect.any(String),
    //       decimals: expect.any(Number),
    //       normalized_value: expect.any(String),
    //     })
    //   );
    // });

    // it("Get Owner Balance After Transfer" + wallet.address, async () => {
    //   let _response = await l1xProvider.tokens.FT.getBalance({
    //     contract_address: _tokenAddress,
    //     address: wallet.address,
    //   });

    //   console.log("Get Owner Balance After Transfer", _response);

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       value: expect.any(String),
    //       decimals: expect.any(Number),
    //       normalized_value: expect.any(String),
    //     })
    //   );
    // });

    // it("Get Recipient Balance After Transfer" + wallet.address, async () => {
    //   let _response = await l1xProvider.tokens.FT.getBalance({
    //     contract_address: _tokenAddress,
    //     address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //   });

    //   console.log("Get Recipient Balance After Transfer", _response);

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       value: expect.any(String),
    //       decimals: expect.any(Number),
    //       normalized_value: expect.any(String),
    //     })
    //   );
    // });

    // it("Mint basic test ", async () => {
    //   console.log("🚀 ~ it ~ _tokenAddress:", _tokenAddress)

    //   let _response = await l1xProvider.tokens.FT.mint({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       recipient_address: "0ddc4369204d7eb9d0c48b44e09c9a44ca3b2000",
    //       value: 10000000000000,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1000,
    //   });

    //   console.log("Mint basic test ", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Mint zero value test ", async () => {
    //   let _response = await l1xProvider.tokens.FT.mint({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //       value: 0,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log("Mint zero value test ", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.mint({
    //       attrib: {
    //         contract_address: _tokenAddress + "123456",
    //         recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: 10,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Invalid Contract Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     expect(error.message).toMatch(
    //       "invalid address: Failed to convert bytes to Address"
    //     );
    //   }
    // });

    // it("Invalid Recipient Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.mint({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         recipient_address:
    //           "9dBD70551C88265F95ab4Cfb70463A0d2fef138d545646545646412345",
    //         value: 10,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Invalid Recipient Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     console.log(error.message);
    //     // Handle the error and assert the expected error message
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Negative Value Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.mint({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: -10,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Negative Value Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     console.log(error.message);
    //     // Handle the error and assert the expected error message
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Approve Basic Test ", async () => {
    //   let _response = await l1xProvider.tokens.FT.approve({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //       value: 100,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log("Approve Basic Test ", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Approve Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.approve({
    //       attrib: {
    //         contract_address: _tokenAddress + "12345",
    //         spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: 100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Approve Invalid Contract Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     console.log(error.message);
    //     expect(error.message).toMatch(
    //       "invalid address: Failed to convert bytes to Address"
    //     );
    //   }
    // });

    // it("Approve Negative Value Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.approve({
    //       attrib: {
    //         contract_address: _tokenAddress + "12345",
    //         spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: -100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Approve Negative Value Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     console.log(error.message);
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Approve Missing Spender Address Test ", async () => {
    //   let _response = await l1xProvider.tokens.FT.approve({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       spender_address: "",
    //       value: 100,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log("Approve Missing Spender Address Test ", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Approve Large Value Test ", async () => {
    //   let _response = await l1xProvider.tokens.FT.approve({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       spender_address: "",
    //       value: 100000000000000000000000000000000000000000000000000000000,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log("Approve Large Value Test ", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Approve Empty Input Object Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.approve({
    //       attrib: {
    //         contract_address: "",
    //         spender_address: "",
    //         value: 0,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Approve Empty Input Object Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     expect(error.message).toMatch(
    //       "invalid address: Failed to convert bytes to Address"
    //     );
    //   }
    // });

    // it("Transfer From Basic Test", async () => {
    //   let _response = await l1xProvider.tokens.FT.transferFrom({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       from_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //       to_address: "85bc6b9c071a1b14299af1852df6e3a3ed9dd158",
    //       value: 100,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log("Transfer From Basic Test", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("TransferFrom Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transferFrom({
    //       attrib: {
    //         contract_address: _tokenAddress + "1234",
    //         from_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         to_address: "85bc6b9c071a1b14299af1852df6e3a3ed9dd158",
    //         value: 100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });
    //     console.log("TransferFrom Invalid Contract Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     expect(error.message).toMatch(
    //       "invalid address: Failed to convert bytes to Address"
    //     );
    //   }
    // });

    // it("TransferFrom Invalid From Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transferFrom({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         from_address: "",
    //         to_address: "85bc6b9c071a1b14299af1852df6e3a3ed9dd158",
    //         value: 100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });
    //     console.log("TransferFrom Invalid From Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("TransferFrom Invalid To Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transferFrom({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         from_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         to_address: "",
    //         value: 100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });
    //     console.log("TransferFrom Invalid To Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("TransferFrom Negative Value Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transferFrom({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         from_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         to_address: "85bc6b9uiukcjxth43651b14299af1852df6e3a3ed9dd158",
    //         value: -100,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });
    //     console.log("TransferFrom Negative Value Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("TransferFrom Empty Object Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transferFrom({
    //       attrib: {
    //         contract_address: "",
    //         from_address: "",
    //         to_address: "",
    //         value: 0,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });
    //     console.log("TransferFrom Empty Object Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    it("Get Attribute ", async () => {
      let _response = await l1xProvider.tokens.FT.getAttribute({
        contract_address: _tokenAddress,
      });

      console.log("Get Attribute Details", _response);
      expect(_response).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          symbol: expect.any(String),
          decimals: expect.any(Number),
          total_supply: expect.any(String),
        })
      );
    });

    // it("Get Attribute Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getAttribute({
    //       contract_address: _tokenAddress + "12345",
    //     });

    //     console.log("Get Attribute Invalid Contract Address ", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("GetBalance Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getBalance({
    //       contract_address: _tokenAddress + "12345",
    //       address: wallet.address,
    //     });
    //     console.log("GetBalance Invalid Contract Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("GetBalance Invalid Wallet Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getBalance({
    //       contract_address: _tokenAddress,
    //       address: wallet.address + "12345",
    //     });
    //     console.log("GetBalance Invalid Wallet Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Get Allowance Basic Test", async () => {
    //   let _response = await l1xProvider.tokens.FT.getAllowance({
    //     contract_address: _tokenAddress,
    //     owner_address: wallet.address,
    //     spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //   });

    //   console.log("Get Allowance Basic Test", _response);
    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       value: expect.any(String),
    //       decimals: expect.any(Number),
    //       normalized_value: expect.any(String),
    //     })
    //   );
    // });

    // it("Get Allowance Invalid Contract Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getAllowance({
    //       contract_address: _tokenAddress + "12345",
    //       owner_address: wallet.address,
    //       spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //     });

    //     console.log("Get Allowance Invalid Contract Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Get Allowance Invalid Owner Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getAllowance({
    //       contract_address: _tokenAddress,
    //       owner_address: "",
    //       spender_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //     });

    //     console.log("Get Allowance Invalid Owner Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Get Allowance Invalid Spender Address Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getAllowance({
    //       contract_address: _tokenAddress,
    //       owner_address: wallet.address,
    //       spender_address: "",
    //     });

    //     console.log("Get Allowance Invalid Spender Address Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Get Allowance Empty Input Object Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.getAllowance({
    //       contract_address: "",
    //       owner_address: "",
    //       spender_address: "",
    //     });

    //     console.log("Get Allowance Empty Input Object Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Transfer Basic Test", async () => {
    //   let _response = await l1xProvider.tokens.FT.transfer({
    //     attrib: {
    //       contract_address: _tokenAddress,
    //       recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //       value: 1,
    //     },
    //     private_key: privateKey,
    //     fee_limit: 1,
    //   });

    //   console.log(_response, "Transfer Token From: " + wallet.address + " ,");

    //   expect(_response).toEqual(
    //     expect.objectContaining({
    //       hash: expect.any(String),
    //     })
    //   );
    // });

    // it("Transfer Invalid Contract Address", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transfer({
    //       attrib: {
    //         contract_address: _tokenAddress + "1234",
    //         recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: 1,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Transfer Invalid Contract Address", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     expect(error.message).toMatch(
    //       "invalid address: Failed to convert bytes to Address"
    //     );
    //   }
    // });

    // it("Transfer Invalid Recipiant Address", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transfer({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         recipient_address:
    //           "9dBD70551C88265F95ab4Cfb70463A0d2fef138d" + "1234",
    //         value: 1,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Transfer Invalid Recipiant Address", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Transfer Maximum Value Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transfer({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: 100000000000000000000000000000000000000000,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Transfer Maximum Value Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Transfer Empty Value Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transfer({
    //       attrib: {
    //         contract_address: _tokenAddress,
    //         recipient_address: "9dBD70551C88265F95ab4Cfb70463A0d2fef138d",
    //         value: 0,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Transfer Maximum Value Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });

    // it("Transfer Empty Input Object Test", async () => {
    //   try {
    //     let _response = await l1xProvider.tokens.FT.transfer({
    //       attrib: {
    //         contract_address: "",
    //         recipient_address: "",
    //         value: 0,
    //       },
    //       private_key: privateKey,
    //       fee_limit: 1,
    //     });

    //     console.log("Transfer Empty Input Object Test", _response);

    //     expect(true).toBe(false);
    //   } catch (error: any) {
    //     // expect(error.message).toMatch(
    //     //   "invalid address: Failed to convert bytes to Address"
    //     // );
    //   }
    // });
  });
});
