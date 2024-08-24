import { L1XVMTransaction } from "./general.ts"

export interface GetAccountStateArg {
    address: string
}

export interface GetTransactionReceiptArg {
    hash: string
}

export interface GetTransactionsByAccountArg {
    address: string,
    number_of_transactions: number,
    starting_from: number,

}

export interface GetBlockByNumberArg {
    block_number: string,
}

export interface NativeTokenTransferArg {
    receipient_address: string,
    value: number,
    private_key:string,
    fee_limit?:number,
    broadcast?:boolean,
    nonce?:number
}





export interface GetStakeArg {
    pool_address: string,
    account_address: string,
}

export interface GetCurrentNonceArg {
    address: string,
}

export interface GetEventsArg {
    tx_hash: string,
    timestamp: number,
}

export interface RawPayloadArg{
    nonce: string,
    transaction_type: Object,
    fee_limit:string,
    signature?:Array<any>,
    verifying_key?:Array<any>,
}

export interface RawTokenReadOnlyArg{
    call: {
        contract_address: Array<number>,
        function_name: Array<number>,
        arguments: Array<number>
    }
}

export interface FTTokenCreateArg {
    attrib: {
        baseContract: string,
        name: string,
        decimals: number,
        symbol: string,
        initial_supply: number
    }
    private_key:string,
    fee_limit?:number
}

export interface FTTokenTransferArg {
    attrib: {
        contract_address: string,
        recipient_address: string,
        value: number,
    }
    private_key:string,
    fee_limit?:number
}

export interface FTTokenMintArg {
    attrib: {
        contract_address: string,
        recipient_address: string,
        value: number,
    }
    private_key:string,
    fee_limit?:number
}



export interface FTTokenApproveArg {
    attrib: {
        contract_address: string,
        spender_address: string,
        value: number,
    }
    private_key:string,
    fee_limit?:number
}

export interface FTTokenTransferFromArg {
    attrib: {
        contract_address: string,
        from_address: string,
        to_address: string,
        value: number,
    }
    private_key:string,
    fee_limit?:number
}

export interface FTTokenGetAttributeArg {
    contract_address: string
}

export interface FTTokenPrepareQueryPayloadArg {
    contract_address: string,
    function: string,
    arguments: any
}

export interface FTTokenGetBalanceArg {
    contract_address: string,
    address: string
}

export interface FTTokenGetAllowanceArg {
    contract_address: string,
    owner_address: string
    spender_address: string
}

export interface NFTTokenPrepareQueryPayloadArg {
    contract_address: string,
    function: string,
    arguments: any
}

export interface NFTTokenGetAttributeArg {
    contract_address: string
}

export interface NFTTokenTransferArg {
    attrib: {
        contract_address: string,
        recipient_address: string,
        token_id: number,
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTTokenMintToArg {
    attrib: {
        contract_address: string,
        recipient_address: string,
        token_id: number,
        token_uri: string
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTTokenBurnArg {
    attrib: {
        contract_address: string,
        token_id: string,
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTApproveArg {
    attrib: {
        contract_address: string,
        spender_address: string,
        token_id: string,
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTSetApprovalForAllArg {
    attrib: {
        contract_address: string,
        operator_address: string,
        approved: boolean,
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTTokenCreateArg {
    attrib: {
        baseContract: string,
        name: string,
        symbol: string,
        icon?: string,
        uri: string
    }
    private_key:string,
    fee_limit?:number
}

export interface NFTTokenGetBalanceArg {
    contract_address: string,
    address: string
}

export interface NFTTokenOwnedByAddressArg {
    contract_address: string,
    address: string
}

export interface NFTTokenOwnerOfArg {
    contract_address: string,
    token_id: number
}

export interface NFTTokenUriOfArg {
    contract_address: string,
    token_id: number
}



export interface VMInitArg {
    attrib: {
        base_contract_address: string,
        arguments: Object,
        deposit?: number
    }
    private_key:string,
    fee_limit?:number,
    nonce?:number
}

export interface VMDeployArg {
    attrib: {
        base_contract_bytes: Buffer,
        access_type?: "PRIVATE" | "PUBLIC",
        deposit?: number
    }
    private_key:string,
    fee_limit?:number,
    nonce?:number
}

export interface VMStateChangeCallArg {
    attrib: {
        contract_address: string,
        function: string,
        arguments: any,
        is_argument_object: Boolean,
        deposit?: number
        
    }
    private_key:string,
    fee_limit?:number,
    nonce?:number
}

export interface VMReadOnlyCallArg {
    attrib: {
        contract_address: string,
        function: string,
        arguments: Object,
    }
}

export interface VMGetTransactionEventsArgs {
    tx_hash: string;
    timestamp: number;
}

export interface VMGetTransactionEventsResponse {
    events_data: []
}

export interface EVMDeployArg{
    attrib: {
        byte_code: string
    }
    private_key:string,
    fee_limit?:number
}

export interface EVMStateChangeCallArg {
    attrib: {
        contract_address: string,
        function: string,
        arguments: any,
        abi: Array<any>
    }
    private_key:string,
    fee_limit?:number
}

export interface EVMReadOnlyCallArg {
    attrib: {
        contract_address: string,
        function: string,
        arguments: any,
        abi: Array<any>
    }
    private_key:string,
    fee_limit?:number
}

export interface EstimateFeelimitArg<K extends keyof L1XVMTransaction> {
    transaction: K;
    payload: L1XVMTransaction[K];
    private_key: string;
}