import { L1XVMTransaction } from "../types/index.ts";
import {
  hexToPlainByteArray,
  isHexString,
  remove0xPrefix,
  strToHex,
  uint8ArrayToPlainByteArray,
} from "../utils/general.ts";

export class L1XTxService {
  protected generateNativeTransferPayload(
    payload: L1XVMTransaction["NativeTokenTransfer"]
  ) {
    let result: any = { ...payload };
    result.address = hexToPlainByteArray(remove0xPrefix(payload.address));
    return result;
  }

  protected generateSmartContractCallPayload(
    payload: L1XVMTransaction["SmartContractFunctionCall"]
  ) {
    const function_name = !isHexString(payload.function_name)
      ? strToHex(payload.function_name)
      : payload.function_name;
    let args;
    try {
      args = JSON.stringify(payload.arguments);
    } catch (error) {
      args = payload.arguments;
    }
    return {
      contract_instance_address: hexToPlainByteArray(
        remove0xPrefix(payload.contract_instance_address)
      ),
      function_name: hexToPlainByteArray(function_name),
      arguments: hexToPlainByteArray(strToHex(args)),
      deposit: String(payload.deposit),
    };
  }

  protected generateSmartContractInitPayload(
    payload: L1XVMTransaction["SmartContractInit"]
  ) {
    let args;
    try {
      args = JSON.stringify(payload.arguments);
    } catch (error) {
      args = payload.arguments;
    }
    return {
      contract_code_address: hexToPlainByteArray(
        remove0xPrefix(payload.contract_code_address)
      ),
      arguments: hexToPlainByteArray(strToHex(args)),
      deposit: payload.deposit.toString(),
    };
  }

  protected generateSmartContractDeploymentPayload(
    payload: L1XVMTransaction["SmartContractDeployment"]
  ) {
    return {
      access_type: payload.access_type,
      contract_type: payload.contract_type,
      contract_code: uint8ArrayToPlainByteArray(payload.contract_code),
      deposit: String(payload.deposit),
      salt: hexToPlainByteArray(strToHex(payload.salt)),
    };
  }

  protected generateCreateStakingPoolPayload(
    payload: L1XVMTransaction["CreateStakingPool"]
  ) {
    return {
      contract_instance_address: hexToPlainByteArray(
        remove0xPrefix(payload.contract_instance_address)
      ),
      min_stake: payload.min_stake,
      max_stake: payload.max_stake,
      min_pool_balance: payload.min_pool_balance,
      max_pool_balance: payload.max_pool_balance,
      staking_period: payload.staking_period,
    };
  }

  protected generateStakePayload(payload: L1XVMTransaction["Stake"]) {
    return {
      pool_address: hexToPlainByteArray(remove0xPrefix(payload.pool_address)),
      amount: payload.amount,
    };
  }

  protected generateUnStakePayload(payload: L1XVMTransaction["UnStake"]) {
    return {
      pool_address: hexToPlainByteArray(remove0xPrefix(payload.pool_address)),
      amount: payload.amount,
    };
  }
}
