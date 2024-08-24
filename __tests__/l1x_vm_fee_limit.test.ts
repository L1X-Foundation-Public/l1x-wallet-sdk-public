import { parseEther } from "ethers/lib/utils";
import {
  AccessType,
  ContractType,
  L1XProvider,
  TxSmartContractInitV2,
} from "../src";

jest.setTimeout(30000);

let l1xProvider = new L1XProvider({
  clusterType: "devnet",
  endpoint: "https://testnet-prerelease-rpc.l1x.foundation",
});
const private_key =
  "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32";

describe("positive tests for all type of transactions", () => {
  test.only("state change call", async () => {
    const response = await l1xProvider.vm.makeStateChangingFunctionCall({
      attrib: {
        contract_address: "92157ef2c70f54547517e63b68b987d16f53444e",
        function: "ft_mint",
        arguments: {
          recipient_id: "0xfdf87120d9c9ef4be35fc474f9152ed62acfa69e",
          amount: "999",
        },
        is_argument_object: true,
        deposit: 0
      },
      private_key:
        "9646f6a102b90fa5268be997c00dec92f7b931ad54f7655b0bb9fa20be3035bc"
    });
    console.log(response);
  });

  // test("native transfer", async () => {
  //   const txNativeTokenTransfer = {
  //     address: "274e0e632c28fe12b630a23bb27c7f9181d965bc",
  //     amount: parseEther("0.01").toString(),
  //   };
  //   let response = await l1xProvider.core.estimateFeelimit({
  //     private_key: private_key,
  //     transaction: "NativeTokenTransfer",
  //     payload: txNativeTokenTransfer,
  //   });
  //   const fee_limit = response.fee;

  //   // get before balance
  //   let balance = await l1xProvider.core.getAccountState({
  //     address: "df15316b77bf2b2d61e4e1d9c0ebc3ac89129653",
  //   });

  //   // // native transfer
  //   let tx = await l1xProvider.core.transfer({
  //     receipient_address: txNativeTokenTransfer.address,
  //     value: Number(txNativeTokenTransfer.amount),
  //     private_key,
  //     fee_limit: Number(fee_limit),
  //   });

  //   await new Promise((resolve) => setTimeout(resolve, 3000));

  //   let afterBalance = await l1xProvider.core.getAccountState({
  //     address: "df15316b77bf2b2d61e4e1d9c0ebc3ac89129653",
  //   });

  //   expect(BigInt(afterBalance.account_state.balance)).toBeLessThanOrEqual(
  //     BigInt(balance.account_state.balance) -
  //       (BigInt(txNativeTokenTransfer.amount) + BigInt(fee_limit))
  //   );

  //   console.log({
  //     balance: balance.account_state.balance,
  //     afterBalance: afterBalance.account_state.balance,
  //   });
  // });

  test("initialize contract", async () => {
    const tx: TxSmartContractInitV2 = {
      contract_code_address: "b41a1a2d70a26971e61e50dd350e5b329019291a",
      arguments: {
        metadata: { name: `time_${new Date().toLocaleString()}`, decimals: 18, symbol: "TST", icon: "" },
        account_ids: ["df15316b77bf2b2d61e4e1d9c0ebc3ac89129653"],
        amounts: ["10000000000000000000000000000"],
      },
      deposit: 0,
    };

    const fee_limit = (
      await l1xProvider.core.estimateFeelimit({
        transaction: "SmartContractInit",
        payload: tx,
        private_key: private_key,
      })
    )?.fee;

    const response = await l1xProvider.vm.init({
      attrib: {
        base_contract_address: tx.contract_code_address,
        arguments: tx.arguments,
        deposit: 0
      },
      private_key: private_key,
      fee_limit: Number(fee_limit)
    });

    console.log(response);
  });
});
