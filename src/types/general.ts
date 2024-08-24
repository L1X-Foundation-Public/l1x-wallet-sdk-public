export type ClusterType = "mainnet" | "testnet" | "devnet";

export type ClusterProvider = {
  clusterAddress: string;
  endpoint: string;
};

export interface ProviderAttrib {
  clusterType: ClusterType;
  endpoint?: string;
}

export enum ValueTransformOption {
  BYTES_TO_HEX = "BYTES_TO_HEX",
  BYTES_TO_STRING = "BYTES_TO_STRING",
  BYTES_TO_JSON = "BYTES_TO_JSON",
}

export interface JSONRPCOption {
  namespace?: string;
}

export enum FTStateChangingFunction {
  TRANSFER = "ft_transfer",
  APPROVE = "ft_approve",
  TRANSFER_FROM = "ft_transfer_from",
  MINT = "ft_mint",
}

export enum FTReadOnlyFunction {
  NAME = "ft_name",
  SYMBOL = "ft_symbol",
  DECIMALS = "ft_decimals",
  TOTAL_SUPPLY = "ft_total_supply",
  BALANCE_OF = "ft_balance_of",
  ALLOWANCE = "ft_allowance",
}

export enum NFTStateChangingFunction {
  MINT_TO = "nft_mint_id_to",
  BURN = "nft_burn",
  APPROVE = "nft_approve",
  SET_APPROVAL_FOR_ALL = "nft_set_approval_for_all",
  TRANSFER_FROM = "nft_transfer_from",
}

export enum NFTReadOnlyFunction {
  NAME = "nft_name",
  SYMBOL = "nft_symbol",
  ICON = "nft_icon",
  URI = "nft_token_uri",
  METADATA = "nft_metadata",
  MINTED_TOTAL = "nft_minted_total",
  BALANCE_OF = "nft_balance_of",
  OWNED_TOKENS = "nft_owned_tokens",
  OWNER_OF = "nft_owner_of",
}

export interface TxNativeTokenTransfer {
  address: string;
  amount: string;
}

export enum AccessType {
  PRIVATE = 0,
  PUBLIC = 1,
  RESTICTED = 2,
}

export enum ContractType {
  L1XVM = 0,
  EVM = 1,
  XTALK = 2,
}

export interface TxSmartContractDeploymentV2 {
  access_type: AccessType;
  contract_type: ContractType;
  contract_code: Uint8Array;
  deposit: number;
  salt: string;
}

export interface TxSmartContractInitV2 {
  contract_code_address: string;
  arguments: any;
  deposit: number;
}

export interface TxSmartContractFunctionCallV2 {
  contract_instance_address: string;
  function_name: string;
  arguments: any;
  deposit: number;
}

export interface TxCreateStakingPool {
  contract_instance_address: string;
  min_stake: string;
  max_stake: string;
  min_pool_balance: string;
  max_pool_balance: string;
  staking_period: string;
}

export interface TxStake {
  pool_address: string;
  amount: string;
}

export interface TxUnStake {
  pool_address: string;
  amount: string;
}

export interface L1XVMTransaction {
  NativeTokenTransfer: TxNativeTokenTransfer;
  SmartContractDeployment: TxSmartContractDeploymentV2,
  SmartContractInit: TxSmartContractInitV2,
  SmartContractFunctionCall: TxSmartContractFunctionCallV2,
  CreateStakingPool: TxCreateStakingPool,
  Stake: TxStake,
  UnStake: TxUnStake,
};
