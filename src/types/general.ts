export type ClusterType = 'mainnet' | 'testnet';

export type ClusterProvider  = {
  clusterAddress: string;
  endpoint: string;
}

export interface ProviderAttrib {
  clusterType: ClusterType;
  endpoint?: string;
}

export enum ValueTransformOption {
  BYTES_TO_HEX = "BYTES_TO_HEX",
  BYTES_TO_STRING = "BYTES_TO_STRING",
  BYTES_TO_JSON = "BYTES_TO_JSON"
}

export interface JSONRPCOption {
  namespace? : string
}


export enum FTStateChangingFunction {
  TRANSFER = 'ft_transfer',
  APPROVE = 'ft_approve',
  TRANSFER_FROM = 'ft_transfer_from',
  MINT = 'ft_mint'
} 

export enum FTReadOnlyFunction {
  NAME = 'ft_name',
  SYMBOL = 'ft_symbol',
  DECIMALS = 'ft_decimals',
  TOTAL_SUPPLY = 'ft_total_supply',
  BALANCE_OF = 'ft_balance_of',
  ALLOWANCE = 'ft_allowance'
} 

export enum NFTStateChangingFunction {
  MINT_TO = 'nft_mint_id_to',
  BURN = 'nft_burn',
  APPROVE = 'nft_approve',
  SET_APPROVAL_FOR_ALL = 'nft_set_approval_for_all',
  TRANSFER_FROM = 'nft_transfer_from',
}

export enum NFTReadOnlyFunction {
  NAME = 'nft_name',
  SYMBOL = 'nft_symbol',
  MINTED_TOTAL = "nft_minted_total",
  BALANCE_OF = 'nft_balance_of',
  OWNED_TOKENS = 'nft_owned_tokens',
  OWNER_OF = 'nft_owner_of'
} 