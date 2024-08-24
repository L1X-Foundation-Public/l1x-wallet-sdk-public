import {
  AccessType,
  ContractType,
  L1XProvider,
  TxCreateStakingPool,
  TxSmartContractDeploymentV2,
  TxSmartContractFunctionCallV2,
  TxSmartContractInitV2,
  TxStake,
  TxUnStake,
} from "../src";
import fs from "fs/promises";

let l1xProvider = new L1XProvider({
  clusterType: "devnet",
  endpoint: "https://v2-devnet-rpc.l1x.foundation",
});

jest.setTimeout(300000);

const private_key =
  "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32";

describe.skip("Estimate fee for transaction", () => {
  const txNativeTokenTransfer = {
    address: "274e0e632c28fe12b630a23bb27c7f9181d965bc",
    amount: "1",
  };

  const txSmartContractFunctionCall: TxSmartContractFunctionCallV2 = {
    contract_instance_address: "92157ef2c70f54547517e63b68b987d16f53444e",
    function_name: "ft_increase_allowance",
    arguments: {
      spender_id: "efbcd50b3b9608ccc91c0dadad5270a73fbabd30",
      amount: "13435345345435",
    },
    deposit: 0,
  };

  const txSmartContractInit: TxSmartContractInitV2 = {
    contract_code_address: "92157ef2c70f54547517e63b68b987d16f53444e",
    arguments: {},
    deposit: 0,
  };

  const txSmartContractDeployment: TxSmartContractDeploymentV2 = {
    access_type: AccessType.PUBLIC,
    contract_type: ContractType.L1XVM,
    contract_code: [] as any,
    deposit: 0,
    salt: "abcd",
  };

  const txCreateStakingPool: TxCreateStakingPool = {
    contract_instance_address: "92157ef2c70f54547517e63b68b987d16f53444e",
    min_stake: "1",
    max_stake: "1",
    min_pool_balance: "1",
    max_pool_balance: "1",
    staking_period: "1",
  };

  const txStake: TxStake = {
    pool_address: "92157ef2c70f54547517e63b68b987d16f53444e",
    amount: "1",
  };

  const txUnStake: TxUnStake = {
    pool_address: "92157ef2c70f54547517e63b68b987d16f53444e",
    amount: "2",
  };

  test("get fee for native transfer call", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key: private_key,
      transaction: "NativeTokenTransfer",
      payload: txNativeTokenTransfer,
    });
    console.log(response)
    expect(response.fee);
  });

  test("get fee for state changing call", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "SmartContractFunctionCall",
      payload: txSmartContractFunctionCall,
    });
    expect(response.fee);
  });

  test("get fee for smart contract init call", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "SmartContractInit",
      payload: txSmartContractInit,
    });
    expect(response.fee);
  });

  test("get fee for smart contract deployment", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "SmartContractDeployment",
      payload: txSmartContractDeployment,
    });
    expect(response.fee);
  });

  test("get fee to create staking pool", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "CreateStakingPool",
      payload: txCreateStakingPool,
    });
    expect(response.fee);
  });

  test("get fee for stake", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "Stake",
      payload: txStake,
    });
    expect(response.fee);
  });

  test("get fee for unstake", async () => {
    let response = await l1xProvider.core.estimateFeelimit({
      private_key:
        "d8617a3e2f1ec5cb8a32da9eb41a93812de170d9c58a07e5301929f34be79a32",
      transaction: "UnStake",
      payload: txUnStake,
    });
    expect(response.fee);
  });
});

// make state changing call with estimated fee
describe("State changing call", () => {
  const tx: TxSmartContractFunctionCallV2 = {
    contract_instance_address: "015cf844c6e550137554d991fcbb3b4f239d5c72",
    function_name: "ft_mint",
    arguments: {
      recipient_id: "df15316b77bf2b2d61e4e1d9c0ebc3ac89129653",
      amount: "23525643654",
    },
    deposit: 0,
  };

  test("With estimated fee", async () => {
    const fee = (
      await l1xProvider.core.estimateFeelimit({
        transaction: "SmartContractFunctionCall",
        payload: tx,
        private_key: private_key,
      })
    )?.fee;
    console.log("fee", fee);
    const response = await l1xProvider.vm.makeStateChangingFunctionCall({
      attrib: {
        contract_address: tx.contract_instance_address,
        function: tx.function_name,
        arguments: tx.arguments,
        is_argument_object: true,
      },
      private_key: private_key,
      fee_limit: Number(fee),
    });
    console.log(response);
  });
});

describe("Smart contract init", () => {
  const tx: TxSmartContractInitV2 = {
    contract_code_address: "0373bb019d7d8fe613287f07e5406b2618f8fedf",
    arguments: {
      metadata: { name: "Test", decimals: 18, symbol: "TST", icon: "" },
      account_ids: ["df15316b77bf2b2d61e4e1d9c0ebc3ac89129653"],
      amounts: ["10000000000000000000000000000"],
    },
    deposit: 0,
  };

  test("Init contract call", async () => {
    const fee = (
      await l1xProvider.core.estimateFeelimit({
        transaction: "SmartContractInit",
        payload: tx,
        private_key: private_key,
      })
    )?.fee;
    console.log("contract init fee", fee);
    const response = await l1xProvider.vm.init({
      attrib: {
        base_contract_address: tx.contract_code_address,
        arguments: tx.arguments,
        // deposit: 0
      },
      private_key: private_key,
      fee_limit: Number(fee),
    });
    console.log(response);
  });
});

describe.only("Smart contract deploy", () => {
  const txinit: TxSmartContractInitV2 = {
    contract_code_address: "",
    arguments: {
      metadata: { name: "Test", decimals: 18, symbol: "TST", icon: "" },
      account_ids: ["df15316b77bf2b2d61e4e1d9c0ebc3ac89129653"],
      amounts: ["10000000000000000000000000000"],
    },
    deposit: 0,
  };

  test("Contract deployment", async () => {
    const contract_code = await fs.readFile("./__tests__/l1x_ft.o");
    const tx: TxSmartContractDeploymentV2 = {
      access_type: 1,
      contract_type: 0,
      contract_code: contract_code,
      deposit: 0,
      salt: "00000000000000000000000000000000",
    };
    const fee = (
      await l1xProvider.core.estimateFeelimit({
        transaction: "SmartContractDeployment",
        payload: tx,
        private_key: private_key,
      })
    )?.fee;
    console.log("Contract deploy fee", fee);
    const deployresponse = await l1xProvider.vm.deploy({
      attrib: {
        base_contract_bytes: contract_code,
        access_type: "PUBLIC",
      },
      private_key: private_key,
      fee_limit: Number(fee),
    });
    console.log("deploy result", deployresponse);

    await new Promise((resolve) => setTimeout(() => resolve(true), 3000));

    // init contract
    txinit.contract_code_address = deployresponse?.contract_address;
    const initfee = (
      await l1xProvider.core.estimateFeelimit({
        transaction: "SmartContractInit",
        payload: txinit,
        private_key: private_key,
      })
    )?.fee;
    console.log("contract init fee", fee);
    const response = await l1xProvider.vm.init({
      attrib: {
        base_contract_address: txinit.contract_code_address,
        arguments: txinit.arguments,
      },
      private_key: private_key,
      fee_limit: Number(fee),
    });
    console.log("init response", response);
  });
});

// l1xProvider.core.getTransactionReceipt({hash: "cca0ad352a8002bc5478d95a488e639acf8af06270fc460038e23cb1b54034ea"}).then(res => console.log(res))
