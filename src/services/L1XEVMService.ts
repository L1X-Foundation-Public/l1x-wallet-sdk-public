import * as ethers from "ethers";
import { FunctionFragment } from "@ethersproject/abi/lib/fragments.ts";

// import { convertToJSONString } from "../utils/json.ts";
import JSONRPCLib from "../lib/JSONRPCLib.ts";
import { ProviderAttrib } from "../types/general.ts";
import { EVMDeployArg, EVMReadOnlyCallArg, EVMStateChangeCallArg, RawPayloadArg, VMInitArg, VMStateChangeCallArg } from "../types/method_request.ts";
import { EVMDeployResponse, StateChangingFunctionCallResponse, VMInitResponse } from "../types/method_response.ts";
import { hexToPlainByteArray, hexToStr, remove0xPrefix, strToHex, uint8ArrayToHex, uint8ArrayToPlainByteArray } from "../utils/general.ts";
import L1XCoreStubService from "./L1XCoreStubService.ts";
import L1XVMService from "./L1XVMService.ts";
import L1XWalletService from "./L1XWalletService.ts";

/**
 * Service class for interacting with L1XEVM functionality.
 *
 * @class
 * @see {@link JSONRPCLib}
 * @see {@link L1XCoreStubService}
 * @see {@link L1XVMService}
 * @see {@link ProviderAttrib}
 */
class L1XEVMService {
  /**
   * The JSON-RPC client used for communication with the L1X core.
   */
  #client: JSONRPCLib;

  /**
   * Represents an instance of the L1XCoreStubService, which provides access to core L1X functionality.
   */
  #core: L1XCoreStubService;


  #vm: L1XVMService;

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
   * Creates an instance of L1XEVMService.
   *
   * @param {JSONRPCLib} _client - The JSON-RPC client used for making requests.
   * @param {L1XCoreStubService} _core - The core service used for additional functionality.
   * @param {L1XVMService} _vm - The L1XVMService instance for handling Virtual Machine functionality.
   * @param {ProviderAttrib} _options - The options for cluster provider information.
   */
  constructor(_client: JSONRPCLib, _core: L1XCoreStubService, _vm: L1XVMService, _options: ProviderAttrib) {
    this.#client = _client;
    this.#core = _core;
    this.#vm = _vm;
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
   * Asynchronously deploys a smart contract on the EVM.
   *
   * @param {EVMDeployArg} attrib - The deployment arguments.
   * @returns {Promise<EVMDeployResponse>} A Promise that resolves to the response of the deployment.
   * @see {@link EVMDeployArg}
   * @see {@link EVMDeployResponse}
   */
  async deploy(attrib:EVMDeployArg) : Promise<EVMDeployResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    let _txFeeLimit: number = attrib?.fee_limit || 1;
    let _nextNonce: number = 1;

    // Get Current Nonce
    try {
      let currentNonce: number = await this.#core.getCurrentNonce({
        address: wallet.address,
      });

      _nextNonce = currentNonce + 1;
    } catch (e: any) {
      // Default to 1
      _nextNonce = 2;
    }

    let txPayloadForRequest: any = {
      nonce: _nextNonce.toString(),
      transaction_type: {
        SmartContractDeployment: {
          access_type: hexToPlainByteArray(strToHex("1")), //Public
          contract_type: hexToPlainByteArray(strToHex("1")), //EVM
          contract_code: hexToPlainByteArray(attrib.attrib.byte_code),
        },
      },
      fee_limit: _txFeeLimit.toString(),
    };

    let txPayloadForSignature: any = {
      nonce: _nextNonce,
      transaction_type: {
        SmartContractDeployment: [
          txPayloadForRequest.transaction_type['SmartContractDeployment'].access_type,
          txPayloadForRequest.transaction_type['SmartContractDeployment'].contract_type,
          txPayloadForRequest.transaction_type['SmartContractDeployment'].contract_code,
        ],
      },
      fee_limit: _txFeeLimit,
    };

  
    // Sign Payload

    txPayloadForRequest["signature"] = uint8ArrayToPlainByteArray(
      await walletService.signPayload(txPayloadForSignature, wallet.private_key)
    );

    txPayloadForRequest["verifying_key"] = uint8ArrayToPlainByteArray(
      wallet.public_key_bytes
    );

    let _response = await this.#client.request("submitTransaction", {
      request: txPayloadForRequest,
    });

    return {
      contract_address: this.#handleFallbackValue(_response["contract_address"]),
      hash: this.#handleFallbackValue(_response["hash"]),
    };
    
  }

  /**
   * Asynchronously initializes a smart contract using the L1XVMService.
   *
   * @param {VMInitArg} attrib - The initialization arguments.
   * @returns {Promise<VMInitResponse>} A Promise that resolves to the response of the initialization.
   * @see {@link VMInitArg}
   * @see {@link VMInitResponse}
   */
  async init(attrib: VMInitArg): Promise<VMInitResponse> {
    return this.#vm.init(attrib);
  }

  /**
   * Asynchronously makes a state-changing function call to a smart contract using the L1XVMService.
   *
   * @param {EVMStateChangeCallArg} attrib - The arguments for the state-changing call.
   * @returns {Promise<StateChangingFunctionCallResponse>} A Promise that resolves to the response of the call.
   * @see {@link EVMStateChangeCallArg}
   * @see {@link StateChangingFunctionCallResponse}
   */
  async makeStateChangingFunctionCall(attrib: EVMStateChangeCallArg): Promise<StateChangingFunctionCallResponse> {

    // Silence Warning
    console.warn = function(){};
    
    if(remove0xPrefix(attrib.attrib.contract_address)?.trim().length <= 0){
      throw new Error("contract_address is missing");
    }

    if(attrib.attrib.function.trim().length <= 0){
      throw new Error("function is missing");
    }

    // Find Function in given abi
    let _functionAbi:FunctionFragment | undefined = attrib.attrib.abi.find((_data:any) => {
      return _data.type == "function" &&  _data.name == attrib.attrib.function
    });

    if (!_functionAbi || !_functionAbi.inputs) {
      throw new Error("Unable to find function or its inputs in given abi");
    }

    // Find Function Arguments in given abi
    for(let argKey of Object.keys(attrib.attrib.arguments)){
      let _arg = _functionAbi.inputs.find((_data:any) => {
        return _data.name == argKey;
      })
      
      if(_arg == null){
        throw new Error(`Argument: ${argKey} does not exists for given function`);
      }
    }

    let _argBuilt:any = [];
    for(let inputArg of _functionAbi.inputs){
      _argBuilt.push(attrib.attrib.arguments[inputArg.name]);
    }

    let _byteCode:any = "";

  
    try
    {
      let iface  = new ethers.utils.Interface(attrib.attrib.abi);
      _byteCode =  iface.encodeFunctionData(attrib.attrib.function, _argBuilt);
    }
    catch(error){

    }

    // Remove 0x
    _byteCode = _byteCode.substring(2);
    
    let _functionAttrib:VMStateChangeCallArg = {
      attrib:{
        arguments: _byteCode,
        contract_address: remove0xPrefix(attrib.attrib.contract_address),
        function: "",
        is_argument_object: false
      },
      private_key: attrib.private_key,
      fee_limit: attrib.fee_limit
    }

    return this.#vm.makeStateChangingFunctionCall(_functionAttrib);
  }

  /**
   * Asynchronously makes a read-only call to a smart contract using the EVM.
   *
   * @param {EVMReadOnlyCallArg} attrib - The arguments for the read-only call.
   * @returns {Promise<any>} A Promise that resolves to the result of the read-only call.
   * @throws {Error} Throws an error if required parameters are missing or if function or its inputs are not found in the provided ABI.
   * @see {@link EVMReadOnlyCallArg}
   */
  async makeReadOnlyCall(attrib: EVMReadOnlyCallArg): Promise<any> {
    // Silence Warning
    console.warn = function(){};

    // Check if contract_address is provided
    if(remove0xPrefix(attrib.attrib.contract_address)?.trim().length <= 0){
      throw new Error("contract_address is missing");
    }

    // Check if function is provided
    if(attrib.attrib.function.trim().length <= 0){
      throw new Error("function is missing");
    }

    // Find Function in given abi
    let _functionAbi:FunctionFragment | undefined = attrib.attrib.abi.find((_data:any) => {
      return _data.type == "function" &&  _data.name == attrib.attrib.function
    });

    // Throw error if function or its inputs are not found in the ABI
    if (!_functionAbi || !_functionAbi.inputs) {
      throw new Error("Unable to find function or its inputs in given abi");
    }

    // Find Function Arguments in given abi
    for(let argKey of Object.keys(attrib.attrib.arguments)){
      let _arg = _functionAbi.inputs.find((_data:any) => {
        return _data.name == argKey;
      })
      
      // Throw error if argument is not found for the given function
      if(_arg == null){
        throw new Error(`Argument: ${argKey} does not exists for given function`);
      }
    }

    // Build arguments for function call
    let _argBuilt:any = [];
    for(let inputArg of _functionAbi.inputs){
      _argBuilt.push(attrib.attrib.arguments[inputArg.name]);
    }

    let _byteCode:any = "";
    let iface  = new ethers.utils.Interface(attrib.attrib.abi);

    try
    {
      // Encode function data
      _byteCode =  iface.encodeFunctionData(attrib.attrib.function, _argBuilt);
    }
    catch(error){

    }
    
    // Remove 0x
    _byteCode = _byteCode.substring(2);

    // Prepare arguments for state-changing function call
    let _functionAttrib:VMStateChangeCallArg = {
      attrib:{
        arguments: _byteCode,
        contract_address: remove0xPrefix(attrib.attrib.contract_address),
        function: "",
        is_argument_object: false
      },
      private_key: attrib.private_key,
      fee_limit: attrib.fee_limit
    }
     
    // Make state-changing function call
    let _response = await this.#vm.makeStateChangingFunctionCall(_functionAttrib);

    // Wait for 5 seconds before retrieving events
    await new Promise((resolve,reject) => setTimeout(resolve,5000));

    // Retrieve events for the transaction
    let _eventResponse:any =  await this.#client.request("getEvents", {
      request: {
        tx_hash: _response.hash,
        timestamp:0
      },
    });

    let _stringData = null;
    let _parsedJSONData = null;
    let _finalReponse = null;

    // Process events data
    for(let _eventData of _eventResponse.events_data){
      try
      {
        // Convert event data from Hex to String
        _stringData =  hexToStr(uint8ArrayToHex(_eventData));
      }
      catch(error){
        // console.log("Unable to Convert Event Data from Hex to String");
      }

      if(_stringData == null){
        continue;
      }

      try
      {
        // Parse JSON from string
        _parsedJSONData = JSON.parse(_stringData);
      }
      catch(error){
        // console.log("Unable to Parse JSON from string ");
      }

      if(_parsedJSONData == null){
        continue;
      }

      try
      {
        // Decode function result from event data
        _finalReponse = iface.decodeFunctionResult(attrib.attrib.function,_parsedJSONData.data)
        break;
      }
      catch(error){
        // console.log("Unable to Decode Function Result");
      }
    }
    

    return _finalReponse;
  }
}


export default L1XEVMService;