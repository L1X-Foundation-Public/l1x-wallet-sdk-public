export interface NFTTokenTransferFromVMFunctionParams{
    from: string,
    to: string,
    id: string,
}

export interface NFTTokenMintToVMFunctionParams{
    to: string,
    id: string,
    token_uri: string
}

export interface NFTTokenBurnVMFunctionParams{
    id: string,
}

export interface NFTTokenApproveVMFunctionParams{
    spender: string,
    id: string,
}

export interface NFTTokenSetApprovalForAllVMFunctionParams{
    operator: string,
    approved: boolean,
}