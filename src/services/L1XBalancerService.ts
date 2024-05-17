import * as ethers from "ethers";
// import { isHexString } from "ethers/lib/utils";
import { FunctionFragment } from "@ethersproject/abi/lib/fragments.ts";

import JSONRPCLib from "../lib/JSONRPCLib.ts";
import { ProviderAttrib } from "../types/general.ts";
import { EVMDeployArg, EVMReadOnlyCallArg, EVMStateChangeCallArg, RawPayloadArg, VMInitArg, VMStateChangeCallArg } from "../types/method_request.ts";
import { EVMDeployResponse, SignedTransactionPayload, StateChangingFunctionCallResponse, TransactionResponse, VMInitResponse } from "../types/method_response.ts";
import { hexToPlainByteArray, hexToStr, remove0xPrefix, strToHex, uint8ArrayToHex, uint8ArrayToPlainByteArray } from "../utils/general.ts";
import { convertToJSONString } from "../utils/json.ts";
import L1XCoreStubService from "./L1XCoreStubService.ts";
import L1XVMService from "./L1XVMService.ts";
import L1XWalletService from "./L1XWalletService.ts";


class L1XBalancerService {
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
   * Creates an instance of L1XTokenFTService.
   *
   * @param {JSONRPCLib} _client - The JSON-RPC client used for making requests.
   * @param {L1XCoreStubService} _core - The core service used for additional functionality.
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

  async init(attrib: VMInitArg): Promise<VMInitResponse> {
    return this.#vm.init(attrib);
  }

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

    console.log(_functionAttrib,"_functionAttrib")
     
    

    return this.makeStateChangingVMFunctionCall(_functionAttrib);
  }

  /**
   * Asynchronously makes a state-changing function call to a smart contract.
   *
   * @param {VMStateChangeCallArg} attrib - The arguments for the state-changing call.
   * @returns {Promise<StateChangingFunctionCallResponse>} A Promise that resolves to the response of the call.
   * @see {@link VMStateChangeCallArg}
   * @see {@link StateChangingFunctionCallResponse}
   */
  async makeStateChangingVMFunctionCall(attrib: VMStateChangeCallArg): Promise<TransactionResponse> {
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

    if(attrib.attrib.is_argument_object){
      attrib.attrib.arguments = convertToJSONString(attrib.attrib.arguments);
    }
    
    if(ethers.utils.isHexString(attrib.attrib.function)) {
      attrib.attrib.function = strToHex(attrib.attrib.function);
    }

    if(ethers.utils.isHexString(attrib.attrib.arguments)) {
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

  async makeReadOnlyCall(attrib: EVMReadOnlyCallArg): Promise<any> {

    // Silence Warning
    console.warn = function(){};

    
    if(remove0xPrefix(attrib.attrib.contract_address?.trim())?.length <= 0){
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
    let iface  = new ethers.utils.Interface(attrib.attrib.abi);

    try
    {
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
     

   
    let _response = await this.makeStateChangingVMFunctionCall(_functionAttrib);


    await new Promise((resolve,reject) => setTimeout(resolve,5000));

   
    let _eventResponse:any =  await this.#client.request("getEvents", {
      request: {
        tx_hash: _response.hash,
        timestamp:0
      },
    });

    let _stringData = null;
    let _parsedJSONData = null;
    let _finalReponse = [];

    for(let _eventData of _eventResponse.events_data){
      try
      {
        _stringData =  hexToStr(uint8ArrayToHex(_eventData));
      }
      catch(error){
        // console.log("Unable to Convert Event Data from Hex to String");
      }

      if(_stringData == null){
        return false;
      }

      try
      {
        _parsedJSONData = JSON.parse(_stringData);
      }
      catch(error){
        // console.log("Unable to Parse JSON from string ");
      }

      if(_parsedJSONData == null){
        return false;
      }

      try
      {
        if (attrib.attrib.function == "queryJoin") {
          _finalReponse.push(
              ethers.utils.defaultAbiCoder.decode(
                  attrib.attrib.abi.find((item) => item.name === "queryJoin").outputs, 
                  ethers.utils.hexDataSlice(_parsedJSONData.data, 4) // Remove the function selector (first 4 bytes)
              )
          );
        }
        else if (attrib.attrib.function == "queryExit") {
            const _data = ethers.utils.defaultAbiCoder.decode([
                "uint256",
                "uint256[]",
                "uint256",
                "uint256",
                "uint256",
                "uint256",
            ], ethers.utils.hexDataSlice(_parsedJSONData.data, 4));
            console.log("🚀 ~ L1XEVMService ~ makeReadOnlyCall ~ _data:", _data);
            _finalReponse.push(_data);
        }
        else {
            _finalReponse.push(iface.decodeFunctionResult(_functionAbi, _parsedJSONData.data));
        }
      }
      catch(error){
        // console.log("Unable to Decode Function Result");
      }
    }
    

    return _finalReponse;
  }
}


export default L1XBalancerService;