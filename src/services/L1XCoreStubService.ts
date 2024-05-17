import { keccak256 } from "js-sha3";

import {
  ClusterProvider,
  GetAccountStateArg,
  GetBlockByNumberArg,
  GetCurrentNonceArg,
  GetEventsArg,
  GetStakeArg,
  GetTransactionReceiptArg,
  GetTransactionsByAccountArg,
  NativeTokenTransferArg,
  RawPayloadArg,
  ValueTransformOption,
} from "../types/index.ts";

import {
  GetAccountStateResponse,
  GetBlockNumberResponse,
  GetChainStateResponse,
  GetEventsResponse,
  GetTransactionReceiptResponse,
  NativeTokenTransferResponse,
  SignedTransactionPayload,
  TransactionResponse,
} from "../types/method_response.ts";

import JSONRPCLib from "../lib/JSONRPCLib.ts";
import {
  arrayToUint8Array,
  hexToPlainByteArray,
  hexToStr,
  remove0xPrefix,
  uint8ArrayToHex,
  uint8ArrayToPlainByteArray,
} from "../utils/general.ts";

import L1XWalletService from "./L1XWalletService.ts";
import { L1X_NATIVE_COIN_DECIMAL } from "../constants/index.ts";
import { convertExponentialToString } from "../utils/number.ts";
import { convertStringToJSON } from "../utils/json.ts";

/**
 * Represents a service for interacting with L1X core functionality through JSON-RPC communication.
 * This service provides methods for querying chain state, account state, transaction receipts, events, and more.
 *
 * @class
 * @see {@link JSONRPCLib}
 * @see {@link L1XWalletService}
 */
class L1XCoreStubService {
  /**
   * The JSON-RPC client used for communication with the L1X core.
   */
  #client: JSONRPCLib;

  /**
   * A boolean indicating whether the client is connected to the L1X core.
   */
  isClientConnected: boolean = false;

  /**
   * Constructs a new instance of the L1XCoreStubService class.
   *
   * @param {JSONRPCLib} _client - The JSON-RPC client for communication with the L1X core.
   */
  constructor(_client: JSONRPCLib) {
    /**
     * Initializes the JSON-RPC client for L1X core communication.
     */
    this.#client = _client;

    /**
     * Sets the client's connected status to true.
     */
    this.isClientConnected = true;
  }

  // Private methods

  /**
   * Handles fallback values for data, providing a default if data is undefined or null.
   *
   * @param {any} data - The data to handle fallback for.
   * @param {any} fallbackValue - The fallback value to use if data is undefined or null.
   * @returns {any} - The original data or the fallback value if data is undefined or null.
   * @private
   */
  #handleFallbackValue(data: any, fallbackValue?: any) {
    fallbackValue = fallbackValue || null;

    if (data === 0) {
      return data;
    }

    return data ? data : fallbackValue;
  }

  /**
   * Transforms data based on the specified option.
   *
   * @param {any} data - The data to transform.
   * @param {ValueTransformOption} option - The transformation option to apply.
   * @returns {any} - The transformed data.
   * @private
   */
  #transformValue(data: any, option: ValueTransformOption) {
    if (option == ValueTransformOption.BYTES_TO_HEX) {
      return uint8ArrayToHex(arrayToUint8Array(data));
    }

    if (option == ValueTransformOption.BYTES_TO_STRING) {
      return hexToStr(uint8ArrayToHex(arrayToUint8Array(data)));
    }

    if (option == ValueTransformOption.BYTES_TO_JSON) {
      return convertStringToJSON(hexToStr(uint8ArrayToHex(arrayToUint8Array(data))));
    }
    return data;
  }

  /**
   * Handles transformation of transaction types, applying necessary value transformations.
   *
   * @param {any} transaction - The transaction object to transform.
   * @returns {any} - The transformed transaction object.
   * @private
   */
  #handleTransactionTypeTransformation(transaction: any) {
    let transactionType = transaction["transaction"];
    if (transactionType["NativeTokenTransfer"]) {

      transactionType["NativeTokenTransfer"]['address'] = this.#transformValue(transactionType["NativeTokenTransfer"]['address'],ValueTransformOption.BYTES_TO_HEX);
    }
    else if (transactionType["SmartContractDeployment"]) {
      
      // access_type
      switch(transactionType["SmartContractDeployment"]['access_type']){
        case 0:
          transactionType["SmartContractDeployment"]['access_type'] = "PRIVATE";
          break;
        case 1:
          transactionType["SmartContractDeployment"]['access_type'] = "PUBLIC";
          break;
        case 2:
          transactionType["SmartContractDeployment"]['access_type'] = "RESTRICTED";
          break;
      }

      // contract_type
      switch(transactionType["SmartContractDeployment"]['contract_type']){
        case 0:
          transactionType["SmartContractDeployment"]['contract_type'] = "L1XVM";
          break;
        case 1:
          transactionType["SmartContractDeployment"]['contract_type'] = "EVM";
          break;
        case 2:
          transactionType["SmartContractDeployment"]['contract_type'] = "XTALK";
          break;
      }
      
      // contract_code
      transactionType["SmartContractDeployment"]['contract_code'] = this.#transformValue(transactionType["SmartContractDeployment"]['contract_code'], ValueTransformOption.BYTES_TO_HEX);

      // salt
      transactionType["SmartContractDeployment"]['salt'] = this.#transformValue(transactionType["SmartContractDeployment"]['salt'], ValueTransformOption.BYTES_TO_HEX);
    }

    // SmartContractInit
    else if (transactionType["SmartContractInit"]) {
      transactionType["SmartContractInit"]['address'] = this.#transformValue(transactionType["SmartContractInit"]['address'],ValueTransformOption.BYTES_TO_HEX);
      transactionType["SmartContractInit"]['arguments'] = this.#transformValue(transactionType["SmartContractInit"]['arguments'],ValueTransformOption.BYTES_TO_JSON);
    }

    // SmartContractFunctionCall
    else if (transactionType["SmartContractFunctionCall"]) {
      transactionType["SmartContractFunctionCall"]['contract_address'] = this.#transformValue(transactionType["SmartContractFunctionCall"]['contract_address'],ValueTransformOption.BYTES_TO_HEX);
      transactionType["SmartContractFunctionCall"]['function_name'] = this.#transformValue(transactionType["SmartContractFunctionCall"]['function_name'],ValueTransformOption.BYTES_TO_STRING);
      transactionType["SmartContractFunctionCall"]['arguments'] = this.#transformValue(transactionType["SmartContractFunctionCall"]['arguments'],ValueTransformOption.BYTES_TO_JSON);
    }
    
    // CreateStakingPool
    else if(transactionType["CreateStakingPool"]){
      transactionType["CreateStakingPool"]['contract_instance_address'] = this.#transformValue(transactionType["CreateStakingPool"]['contract_instance_address'],ValueTransformOption.BYTES_TO_HEX);
    }

    // Stake
    else if(transactionType["Stake"]){
      transactionType["Stake"]['pool_address'] = this.#transformValue(transactionType["Stake"]['pool_address'],ValueTransformOption.BYTES_TO_HEX);
    }

    // UnStake
    else if(transactionType["UnStake"]){
      transactionType["UnStake"]['pool_address'] = this.#transformValue(transactionType["UnStake"]['pool_address'],ValueTransformOption.BYTES_TO_HEX);
    }

    if(transaction['signature']){
      transaction['signature'] = this.#transformValue(transaction['signature'], ValueTransformOption.BYTES_TO_HEX);
    }

    if(transaction['verifying_key']){
      transaction['verifying_key'] = this.#transformValue(transaction['verifying_key'], ValueTransformOption.BYTES_TO_HEX);
    }

    transaction["transaction"] = transactionType;

    return transaction;
  }

  /**
   * Transforms the transaction entity to include required transformations.
   *
   * @param {any} data - The data of the transaction entity to transform.
   * @returns {GetTransactionReceiptResponse} - The transformed transaction entity.
   * @private
   */
  #transformTransactionEntity(data: any): GetTransactionReceiptResponse {

    /* 
       {
         transaction: { tx_type: 1, transaction: [Object] },
         from: [
           117,  16,  73,  56, 186, 164,
           124,  84, 168,  96,   4, 239,
           153, 140, 199, 108,  46,  97,
           98, 137
         ],
         transaction_hash: [
             3,  67, 254,  27,  12,  34,  96, 100,
           39, 142,  61, 143, 198,  47,  22,  10,
           38, 103,  21, 239, 172, 214, 109,  11,
           103, 174, 173, 173, 139,  36, 243, 128
         ],
         block_hash: [
           82, 197, 158,  73,  45, 153,  17,  48,
           36, 108, 233, 185,  52,  19, 227,  68,
           199,  49, 127,  20, 202, 113, 143, 255,
           222, 208,   8, 211, 123, 230,  55,  51
         ],
         block_number: 472058,
         fee_used: '1',
         timestamp: 1695717356464
     }
      
   
   */


    data["from"] = this.#transformValue(
      data["from"],
      ValueTransformOption.BYTES_TO_HEX
    );
    data["transaction_hash"] = this.#transformValue(
      data["transaction_hash"],
      ValueTransformOption.BYTES_TO_HEX
    );

    data["block_hash"] = this.#transformValue(
      data["block_hash"],
      ValueTransformOption.BYTES_TO_HEX
    );

    data["transaction"] = this.#handleTransactionTypeTransformation(
      data["transaction"]
    );

    return {
      transaction: data["transaction"],
      block_hash: this.#handleFallbackValue(data["block_hash"]),
      block_number: this.#handleFallbackValue(data["block_number"]),
      fee_used: this.#handleFallbackValue(data["fee_used"]),
      timestamp: this.#handleFallbackValue(data["timestamp"]),
      from: data["from"],
      transaction_hash: data["transaction_hash"],
    };
  }

  /**
   * Retrieves the current chain state.
   *
   * @returns {Promise<GetChainStateResponse>} - A promise that resolves to the current chain state.
   * @see {@link GetChainStateResponse}
   */
  async getChainState(): Promise<GetChainStateResponse> {
    let response = await this.#client.request("getChainState", {
      request: {},
    });

    return {
      cluster_address: this.#handleFallbackValue(response["cluster_address"]),
      head_block_hash: this.#handleFallbackValue(response["head_block_hash"]),
      head_block_number: this.#handleFallbackValue(
        response["head_block_number"]
      ),
    };
  }

  /**
   * Retrieves the state of a specific account.
   *
   * @param {GetAccountStateArg} attrib - The account state retrieval attributes.
   * @returns {Promise<GetAccountStateResponse>} - A promise that resolves to the account state.
   * @see {@link GetAccountStateArg}
   * @see {@link GetAccountStateResponse}
   */
  async getAccountState(
    attrib: GetAccountStateArg
  ): Promise<GetAccountStateResponse> {
    let response = await this.#client.request("getAccountState", {
      request: {
        address: remove0xPrefix(attrib.address),
      },
    });

    // Address is in Uint8Array
    response["address"] = this.#transformValue(
      response["address"],
      ValueTransformOption.BYTES_TO_HEX
    );

    let _preparedResponse: any = {
      account_state: {
        balance: this.#handleFallbackValue(response['account_state']["balance"]),
        nonce: this.#handleFallbackValue(response['account_state']["nonce"]),
        account_type: this.#handleFallbackValue(response['account_state']["account_type"])
      },
    };



    // Formatted by L1X Decimal
    _preparedResponse['account_state']['balance_formatted'] = parseInt(_preparedResponse['account_state']['balance']) / (10 ** L1X_NATIVE_COIN_DECIMAL);

    // Convert Exponential to String
    _preparedResponse['account_state']['balance_formatted'] = convertExponentialToString(_preparedResponse['account_state']['balance_formatted']);

    let _typedResponse: GetAccountStateResponse = {
      account_state: {
        balance: _preparedResponse['account_state']['balance'],
        nonce: parseInt(_preparedResponse['account_state']['nonce']),
        account_type: parseInt(_preparedResponse['account_state']['account_type']),
        balance_formatted: _preparedResponse['account_state']['balance_formatted']
      }
    }


    return _typedResponse;
  }

  /**
   * Retrieves the receipt of a specific transaction.
   *
   * @param {GetTransactionReceiptArg} attrib - The transaction receipt retrieval attributes.
   * @returns {Promise<GetTransactionReceiptResponse>} - A promise that resolves to the transaction receipt.
   * @see {@link GetTransactionReceiptArg}
   * @see {@link GetTransactionReceiptResponse}
   */
  async getTransactionReceipt(
    attrib: GetTransactionReceiptArg
  ): Promise<GetTransactionReceiptResponse> {
    
    let response = await this.#client.request("getTransactionReceipt", {
      request: {
        hash: remove0xPrefix(attrib.hash),
      },
    });


    return this.#transformTransactionEntity(response.transaction);
  }

  /**
   * Retrieves events based on the provided attributes.
   *
   * @param {GetEventsArg} attrib - The event retrieval attributes.
   * @returns {Promise<any>} - A promise that resolves to the retrieved events.
   * @see {@link GetEventsArg}
   */
  async getEvents(attrib: GetEventsArg): Promise<GetEventsResponse> {
    let _attrib = {
      ...attrib,
      tx_hash: remove0xPrefix(attrib?.tx_hash),
    }

    let response =  await this.#client.request("getEvents", {
      request: _attrib,
    });

    return response.events_data.map((event: any) => {
      return this.#transformValue(event, ValueTransformOption.BYTES_TO_HEX);
    });
  }

  /**
   * Retrieves transactions associated with a specific account.
   *
   * @param {GetTransactionsByAccountArg} attrib - The transaction retrieval attributes.
   * @returns {Promise<Array<GetTransactionReceiptResponse>>} - A promise that resolves to an array of transaction receipts.
   * @see {@link GetTransactionsByAccountArg}
   * @see {@link GetTransactionReceiptResponse}
   */
  async getTransactionsByAccount(
    attrib: GetTransactionsByAccountArg
  ): Promise<Array<GetTransactionReceiptResponse>> {
    let _attrib = {
      ...attrib,
      address: remove0xPrefix(attrib?.address)
    }

    let response = await this.#client.request("getTransactionsByAccount", {
      request: _attrib,
    });

    response = response.transactions.map((transactionEntity: any) => {
      return this.#transformTransactionEntity(transactionEntity);
    });

    return response;
  }

  /**
   * Retrieves the current nonce for a given account.
   *
   * @param {GetCurrentNonceArg} attrib - The attributes for nonce retrieval.
   * @returns {Promise<number>} - A promise that resolves to the current nonce.
   * @see {@link GetCurrentNonceArg}
   */
  async getCurrentNonce(attrib: GetCurrentNonceArg): Promise<number> {
    let response = await this.#client.request("getCurrentNonce", {
      request: {
        address: remove0xPrefix(attrib.address)
      },
    });

    return parseInt(response['nonce']);
  }

  /**
   * WIP: Retrieves stake information based on the provided attributes.
   *
   * @param {GetStakeArg} attrib - The attributes for stake retrieval.
   * @returns {Promise<any>} - A promise that resolves to the retrieved stake information.
   * @see {@link GetStakeArg}
   */
  async getStake(attrib: GetStakeArg) {
    let _attrib = {
      ...attrib,
      pool_address: remove0xPrefix(attrib?.pool_address),
      account_address: remove0xPrefix(attrib?.account_address),
    }

    return this.#client.request("getStake", {
      params: _attrib,
    });
  }

  /**
   * Retrieves information about a specific block using the block number.
   *
   * @param {GetBlockByNumberArg} attrib - The attributes for block retrieval.
   * @returns {Promise<GetBlockNumberResponse>} - A promise that resolves to the retrieved block information.
   * @see {@link GetBlockByNumberArg}
   * @see {@link GetBlockNumberResponse}
   */
  async getBlockByNumber(
    attrib: GetBlockByNumberArg
  ): Promise<GetBlockNumberResponse> {
    let response = await this.#client.request("getBlockByNumber", {
      request: {
        block_number: attrib.block_number,
      },
    });

    // console.log(response, "getBlockByNumber");

    return {
      block: {
        number: this.#handleFallbackValue(response["block"]["number"]),
        hash: this.#handleFallbackValue(response["block"]["hash"]),
        parent_hash: this.#handleFallbackValue(
          response["block"]["parent_hash"]
        ),
        timestamp: this.#handleFallbackValue(response["block"]["timestamp"]),
        transactions: this.#handleFallbackValue(
          response["block"]["transactions"]
        ),
        block_type: this.#handleFallbackValue(response["block"]["block_type"]),
        cluster_address: this.#handleFallbackValue(
          response["block"]["cluster_address"]
        ),
      },
    };
  }

  /**
   * Initiates a native token(L1X coin) transfer operation.
   *
   * @param {NativeTokenTransferArg} attrib - The attributes for token transfer.
   * @returns {Promise<any>} - A promise that resolves to the result of the token transfer.
   * @see {@link NativeTokenTransferArg}
   */
  async transfer(
    attrib: NativeTokenTransferArg
  ): Promise<TransactionResponse> {

    let txPayloadForRequest = await this.getSignedPayloadForTransfer(attrib);
    return await this.broadcastTransaction(txPayloadForRequest);
  }

  /**
   * Generates a signed transaction payload for a native token (L1X coin) transfer operation.
   *
   * @param {NativeTokenTransferArg} attrib - The attributes for the token transfer.
   * @returns {Promise<SignedTransactionPayload>} - A promise that resolves to the signed transaction payload.
   * @throws {Error} - Throws an error if there is an issue retrieving the current nonce.
   * @see {@link NativeTokenTransferArg}
   * @see {@link SignedTransactionPayload}
   */
  async getSignedPayloadForTransfer(attrib: NativeTokenTransferArg): Promise<SignedTransactionPayload> {
    // Create a new instance of the L1XWalletService
    let walletService = new L1XWalletService();

    // Import the wallet using the provided private key
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    // Set default values for transaction fee limit, next nonce, and transfer value
    let _txFeeLimit: number = attrib?.fee_limit || 1;
    let _txNonce: number | null = attrib?.nonce || null;
    let _txFeeLimitStr: string = _txFeeLimit.toString();

    let _nextNonce = 1;
    let _nextNonceStr = _nextNonce.toString();


    if(_txNonce == null){
     
      // Get the current nonce for the wallet's address
      try {
        let currentNonceResponse: GetAccountStateResponse =
          await this.getAccountState({
            address: wallet.address,
          });

        _nextNonce = currentNonceResponse['account_state']["nonce"] + 1;
        _nextNonceStr = _nextNonce.toString();

      } catch (e: any) {
        // Default to 1 if there is an issue retrieving the current nonce
        console.error("Error retrieving current nonce. Defaulting to 1.", e);
      }
    }
    else
    {
      _nextNonce = _txNonce;
      _nextNonceStr = _txNonce.toString();
    }
  

    

    // Convert Scientific to Decimal String 
    let _transferValue = convertExponentialToString(attrib.value);
    // let _transferValue = (attrib.value);

    // Construct the transaction payload for the request
    let txPayloadForRequest: SignedTransactionPayload = {
      nonce: _nextNonceStr,
      transaction_type: {
        NativeTokenTransfer: {
          address: hexToPlainByteArray(remove0xPrefix(attrib.receipient_address)),
          amount: _transferValue,
        },
      },
      fee_limit: _txFeeLimitStr,
      signature: [],
      verifying_key: [],
    };

    // Construct the transaction payload for signature
    let txPayloadForSignature: any = {
      nonce: _nextNonce,
      transaction_type: {
        NativeTokenTransfer: [
          hexToPlainByteArray(remove0xPrefix(attrib.receipient_address)),
          (_transferValue),
        ],
      },
      fee_limit: _txFeeLimit,
    };



    // Sign the payload
    txPayloadForRequest["signature"] = uint8ArrayToPlainByteArray(
      await walletService.signPayload(txPayloadForSignature, wallet.private_key)
    );

    txPayloadForRequest["verifying_key"] = uint8ArrayToPlainByteArray(
      wallet.public_key_bytes
    );

    return txPayloadForRequest;
  }

  /**  
    * Calculate Transaction Hash
    *
    * @param {SignedTransactionPayload} signedPayload - The signed transaction payload to calculate the hash for.
    * @returns {Promise<string>} - A promise that resolves to the calculated transaction hash.
    * @see {@link SignedTransactionPayload} 
    */
  async calculateTransactionHash(signedPayload: SignedTransactionPayload): Promise<string> {

    console.log("This method is DEPRECATED. Kindly use https://github.com/L1X-Foundation-Consensus/l1x-transaction-hash")
    if(signedPayload['transaction_type']['NativeTokenTransfer'] == null){
      throw new Error("Transaction Type = NativeTokenTransfer is only supported .");
    }

    let _txPayload = {
      nonce: parseInt(signedPayload.nonce),
      transaction_type: {
        NativeTokenTransfer: [
          signedPayload.transaction_type.NativeTokenTransfer.address,
          parseInt(signedPayload.transaction_type.NativeTokenTransfer.amount),
        ],
      },
      fee_limit: parseInt(signedPayload.fee_limit),
      signature: signedPayload.signature,
      verifying_key: signedPayload.verifying_key,
      eth_original_transaction: null,
    };

    // console.log(_txPayload,"_txPayload");

    

    const keccak256Instance = keccak256.arrayBuffer(Buffer.from(JSON.stringify(_txPayload)));
    return Buffer.from(keccak256Instance).toString('hex')

  }

  /**
   * Broadcasts a signed transaction payload to submit a native token (L1X coin) transfer.
   *
   * @param {SignedTransactionPayload} txPayload - The signed transaction payload to be broadcasted.
   * @returns {Promise<TransactionResponse>} - A promise that resolves to the transaction response containing the hash.
   * @see {@link SignedTransactionPayload}
   * @see {@link TransactionResponse}
   */
  async broadcastTransaction(txPayload: SignedTransactionPayload): Promise<TransactionResponse> {
    // Send a request to the client to submit the transaction
    let _response = await this.#client.request("submitTransaction", {
      request: txPayload,
    });

    // Extract the hash from the response and create a TransactionResponse object
    return {
      hash: _response.hash,
    };
  }
}

export default L1XCoreStubService;
