export interface GetAccountStateResponse {
  account_state: {
    balance: string;
    balance_formatted: string;
    nonce: number;
    account_type: number;  
  } 
}

export interface GetChainStateResponse {
  cluster_address: string;
  head_block_number: string;
  head_block_hash: string;
}

export interface GetTransactionReceiptResponse {
  transaction: {
    tx_type: string;
    transaction: Object,
  };
  status?: boolean;
  timestamp: number;
  block_number: number;
  block_hash: string;
  from: string;
  transaction_hash: string;
  fee_used: number;
}

export interface GetBlockNumberResponse {
  block: {
    number: string;
    hash: string;
    parent_hash: string;
    timestamp: number;
    transactions: Array<any>;
    block_type: number,
    cluster_address: string
  }
}

export interface GetEventsResponse {
  events_data: Array<any>;
}

export interface TransactionResponse {
  hash: string;
}

export interface NativeTokenTransferResponse {
  hash: string;
}
export interface SignedTransactionPayload {
  nonce: string;
  transaction_type: any,
  fee_limit:string,
  signature:Array<any>,
  verifying_key:Array<any>
}

export interface FTTokenCreateResponse {
  contract_address: string;
  hash: string;
}

export interface FTTokenTransferResponse {
  hash: string;
}

export interface FTTokenApproveResponse {
  hash: string;
}

export interface FTTokenTransferFromResponse {
  hash: string;
}

export interface FTTokenGetAttributeResponse {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
}
export interface FTTokenGetBalanceResponse {
  value: string;
  decimals: number;
  normalized_value: string;
}

export interface FTTokenGetAllowanceResponse {
  value: string;
  decimals: number;
  normalized_value: string;
}

export interface NFTTokenGetAttributeResponse {
  name: string;
  symbol: string;
  icon: string;
  uri: string;
  decimals: number;
  total_minted: string;
}

export interface NFTTokenTransferResponse {
  address: string;
  hash: string;
}

export interface NFTTokenCreateResponse {
  contract_address: string;
  hash: string;
}

export interface StateChangingFunctionCallResponse {
  hash: string;
}

export interface NFTTokenGetBalanceResponse {
  value: string;
}

export interface NFTTokenOwnedTokensResponse {
  token_ids: Array<any>;
}

export interface NFTTokenOwnerOfResponse {
  owner_address: string;
}

export interface NFTTokenUriOfResponse {
  token_uri: string;
}


export interface VMInitResponse {
  contract_address: string;
  hash: string;
}

export interface VMDeployResponse {
  contract_address: string;
  hash: string;
}

export interface WalletImportByPrivateKeyResponse {
  private_key: string,
  public_key: string,
  public_key_bytes: Uint8Array,
  address: string,
  address_with_prefix: string
}

export interface EVMDeployResponse {
  contract_address: string;
  hash: string;
}

