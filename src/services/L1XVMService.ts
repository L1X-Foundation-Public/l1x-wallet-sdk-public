
import JSONRPCLib from "../lib/JSONRPCLib.ts";
import L1XWalletService from "./L1XWalletService.ts";
import L1XCoreStubService from "./L1XCoreStubService.ts";
import { convertToJSONString } from "../utils/json.ts";
import { VMDeployArg, VMInitArg, VMReadOnlyCallArg, VMStateChangeCallArg } from "../types/method_request.ts";
import { hexToStr, strToHex, hexToPlainByteArray, uint8ArrayToPlainByteArray, remove0xPrefix } from "../utils/general.ts";
import { SignedTransactionPayload, StateChangingFunctionCallResponse, TransactionResponse, VMDeployResponse, VMInitResponse } from "../types/method_response.ts";
import { ProviderAttrib } from "../types/general.ts";


import * as ethers from "ethers";
// import { Sha256 } from "@aws-crypto/sha256-js";
// import { getRandomPositiveInteger } from "../utils/number";

/**
 * Service class for interacting with L1X Virtual Machine functionality.
 *
 * @class
 * @see {@link JSONRPCLib}
 * @see {@link L1XCoreStubService}
 * @see {@link ProviderAttrib}
 */
class L1XVMService {
  /**
   * The JSON-RPC client used for communication with the L1X core.
   */
  #client: JSONRPCLib;

  /**
   * Represents an instance of the L1XCoreStubService, which provides access to core L1X functionality.
   */
  #core: L1XCoreStubService;

  /**
   * Represents the options for  cluster provider information associated with the L1XProvider.
   *
   * @type {ProviderAttrib}
   * @memberof L1XProvider
   * @instance
   * @see {@link ProviderAttrib}
   */
  #options: ProviderAttrib;

  /**
   * Creates an instance of L1XTokenFTService.
   *
   * @param {JSONRPCLib} _client - The JSON-RPC client used for making requests.
   * @param {L1XCoreStubService} _core - The core service used for additional functionality.
   * @param {ProviderAttrib} _options - The options for cluster provider information.
   */
  constructor(_client: JSONRPCLib, _core: L1XCoreStubService, _options: ProviderAttrib) {
    this.#client = _client;
    this.#core = _core;
    this.#options = _options;
  }

  
  /**
   * Handles fallback values for data.
   *
   * @param {any} data - The data to be checked for fallback.
   * @param {any} [fallbackValue] - The fallback value to be used if data is falsy.
   * @returns {any} The original data if not falsy, otherwise the fallback value.
   */
  #handleFallbackValue(data: any, fallbackValue?: any) {
    fallbackValue = fallbackValue || null;

    if (data === 0) {
      return data;
    }

    return data ? data : fallbackValue;
  }

  /**
   * Asynchronously makes a read-only call to a smart contract.
   *
   * @param {VMReadOnlyCallArg} attrib - The arguments for the read-only call.
   * @returns {Promise<string>} A Promise that resolves to the result of the call.
   * @see {@link VMReadOnlyCallArg}
   */
  async makeReadOnlyCall(attrib: VMReadOnlyCallArg): Promise<string> {
    let payload = {
      call: {
        contract_address: hexToPlainByteArray(remove0xPrefix(attrib.attrib.contract_address)),
        function_name: hexToPlainByteArray(strToHex(attrib.attrib.function)),
        arguments: hexToPlainByteArray(strToHex(convertToJSONString(attrib.attrib.arguments))),
      },
    };

    let _response = await this.#client.request("smartContractReadOnlyCall", {
      request: payload,
    });

    let _result = hexToStr(_response["result"]).replace(/^"(.*)"$/, "$1");

    return this.#handleFallbackValue(_result);
  }

  /**
   * Asynchronously makes a state-changing function call to a smart contract.
   *
   * @param {VMStateChangeCallArg} attrib - The arguments for the state-changing call.
   * @returns {Promise<StateChangingFunctionCallResponse>} A Promise that resolves to the response of the call.
   * @see {@link VMStateChangeCallArg}
   * @see {@link StateChangingFunctionCallResponse}
   */
  async makeStateChangingFunctionCall(attrib: VMStateChangeCallArg): Promise<TransactionResponse> {
    let txPayloadForRequest = await this.getSignedPayloadForStateChangingFunctionCall(attrib);
    return await this.#core.broadcastTransaction(txPayloadForRequest); 
  }

  /**
   * Asynchronously generates a signed transaction payload for a state-changing function call to a smart contract.
   *
   * @param {VMStateChangeCallArg} attrib - The arguments for the state-changing call.
   * @returns {Promise<SignedTransactionPayload>} A Promise that resolves to the signed transaction payload.
   * @see {@link VMStateChangeCallArg}
   * @see {@link SignedTransactionPayload}
   */
  
  async getSignedPayloadForStateChangingFunctionCall(attrib: VMStateChangeCallArg) : Promise<SignedTransactionPayload>{

    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    let _txFeeLimit: number = attrib?.fee_limit || 1;
    let _txNonce: number | null = attrib?.nonce || null;

    let _nextNonce = 1;
    let _nextNonceStr = _nextNonce.toString();

    // Get Current Nonce
    if(_txNonce == null){
     
      // Get the current nonce for the wallet's address
      try {
        let currentNonce: number = await this.#core.getCurrentNonce({
          address: wallet.address,
        });
  
        _nextNonce = currentNonce + 1;
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

    if(attrib.attrib.is_argument_object){
      attrib.attrib.arguments = convertToJSONString(attrib.attrib.arguments);
    }
    
    if(!ethers.utils.isHexString(attrib.attrib.function)) {
      attrib.attrib.function = strToHex(attrib.attrib.function);
    }

    if(!ethers.utils.isHexString(attrib.attrib.arguments)) {
      attrib.attrib.arguments = strToHex(attrib.attrib.arguments);
    }

    // Signature is Generated on different payload and request on another
    let txPayloadForSignature: any = {
      nonce: _nextNonce,
      transaction_type: {
        SmartContractFunctionCall: {
          contract_instance_address: hexToPlainByteArray(remove0xPrefix(attrib.attrib.contract_address)),
          function: hexToPlainByteArray(attrib.attrib.function),
          arguments: hexToPlainByteArray(attrib.attrib.arguments),
          // value: 0
        },
      },
      fee_limit: _txFeeLimit,
    };

    // Sign Payload
    let signature = uint8ArrayToPlainByteArray(
      await walletService.signPayload(txPayloadForSignature, wallet.private_key)
    );
    let verifyingKey = uint8ArrayToPlainByteArray(wallet.public_key_bytes);

    return {
      nonce: _nextNonce.toString(),
      transaction_type: {
        SmartContractFunctionCall: {
          contract_address:
            txPayloadForSignature["transaction_type"]["SmartContractFunctionCall"]["contract_instance_address"],
          function_name: txPayloadForSignature["transaction_type"]["SmartContractFunctionCall"]["function"],
          arguments: txPayloadForSignature["transaction_type"]["SmartContractFunctionCall"]["arguments"],
          // value:txPayloadForSignature["transaction_type"]["SmartContractFunctionCall"]["value"]
        },
      },
      fee_limit: _txFeeLimit.toString(),
      signature: signature,
      verifying_key: verifyingKey,
    }

  }

  /**
   * Asynchronously initializes a smart contract.
   *
   * @param {VMInitArg} attrib - The initialization arguments.
   * @returns {Promise<VMInitResponse>} A Promise that resolves to the response of the initialization.
   * @see {@link VMInitArg}
   * @see {@link VMInitResponse}
   */
  async init(attrib: VMInitArg): Promise<VMInitResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    let _txFeeLimit: number = attrib?.fee_limit || 1;
    let _txNonce: number | null = attrib?.nonce || null;

    let _nextNonce = 1;
    let _nextNonceStr = _nextNonce.toString();

    // Get Current Nonce
    if(_txNonce == null){
     
      // Get the current nonce for the wallet's address
      try {
        let currentNonce: number = await this.#core.getCurrentNonce({
          address: wallet.address,
        });
  
        _nextNonce = currentNonce + 1;
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

    // Initialize Params

    let initParams = attrib.attrib.arguments == null ? {} : attrib.attrib.arguments;

    // let initPararm = '{\\"metadata\\":{\\"name\\":\\"EiL9eeL4\\",\\"symbol\\":\\"EiL9eeL4\\",\\"decimals\\":18},\\"account_ids\\":[\\"177f88827a0d1fb1f10c44743be61dada9fdb318\\"],\\"amounts\\":[\\"10000000000000000000000\\"]}';
    let txPayloadForSignature: any = {
      nonce: _nextNonce,
      transaction_type: {
        SmartContractInit: [
          hexToPlainByteArray(remove0xPrefix(attrib.attrib.base_contract_address)),
          hexToPlainByteArray(strToHex(convertToJSONString(initParams))),
        ],
      },
      fee_limit: _txFeeLimit,
    };

    // Sign Payload

    let signature = uint8ArrayToPlainByteArray(
      await walletService.signPayload(txPayloadForSignature, wallet.private_key)
    );
    let verifyingKey = uint8ArrayToPlainByteArray(wallet.public_key_bytes);

    let response = await this.#client.request("submitTransaction", {
      request: {
        nonce: txPayloadForSignature["nonce"].toString(),
        transaction_type: {
          SmartContractInit: {
            address: txPayloadForSignature["transaction_type"]["SmartContractInit"][0],
            arguments: txPayloadForSignature["transaction_type"]["SmartContractInit"][1],
          },
        },
        fee_limit: txPayloadForSignature["fee_limit"].toString(),
        signature: signature,
        verifying_key: verifyingKey,
      },
    });

    return {
      contract_address: this.#handleFallbackValue(response["contract_address"]),
      hash: this.#handleFallbackValue(response["hash"]),
    };
  }

  async deploy(attrib: VMDeployArg): Promise<VMDeployResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    let _txFeeLimit: number = attrib?.fee_limit || 0;
    let _txFeeLimitStr: string = _txFeeLimit.toString();

    let _txNonce: number | null = attrib?.nonce || null;
    let _contractCode: Buffer = attrib?.attrib.base_contract_bytes ;
    
    let _nextNonce = 1;
    let _nextNonceStr = _nextNonce.toString();


    if(_txNonce == null){
     
      // Get the current nonce for the wallet's address
      try {
        let currentNonce: number = await this.#core.getCurrentNonce({
          address: wallet.address,
        });
  
        _nextNonce = currentNonce + 1;
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

    // Salt
    let salt = "00000000000000000000000000000000";

    // Construct the transaction payload for the request
    let txPayloadForRequest: SignedTransactionPayload = {
      nonce: _nextNonceStr,
      transaction_type: {
        SmartContractDeployment: {
          access_type: 0,
          contract_type: 0,
          contract_code: uint8ArrayToPlainByteArray(_contractCode),
          value: 0,
          salt: hexToPlainByteArray(strToHex(salt))
        }
      },
      fee_limit: _txFeeLimitStr,
      signature: [],
      verifying_key: [],
    };

    let transactionPayloadForSignature:SignedTransactionPayload  = JSON.parse(JSON.stringify(txPayloadForRequest));
    transactionPayloadForSignature['transaction_type']['SmartContractDeployment']['access_type'] = "PRIVATE";
    transactionPayloadForSignature['transaction_type']['SmartContractDeployment']['contract_type'] = "L1XVM";

    // Construct the transaction payload for signature
    let txPayloadForSignature: any = {
      nonce: _nextNonce,
      transaction_type: transactionPayloadForSignature.transaction_type,
      fee_limit: _txFeeLimit,
    };

    // console.log(JSON.stringify(txPayloadForSignature),"txPayloadForSignature");


    // Sign the payload
    txPayloadForRequest["signature"] = uint8ArrayToPlainByteArray(
      await walletService.signPayload(txPayloadForSignature, wallet.private_key)
    );

    txPayloadForRequest["verifying_key"] = uint8ArrayToPlainByteArray(
      wallet.public_key_bytes
    );

    // console.log(JSON.stringify(txPayloadForRequest),"txPayloadForRequest");

    let response = await this.#client.request("submitTransaction", {
      request: txPayloadForRequest
    });

    return {
      contract_address: this.#handleFallbackValue(response["contract_address"]),
      hash: this.#handleFallbackValue(response["hash"]),
    };
  }
}

export default L1XVMService;
