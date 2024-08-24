import JSONRPCLib from "../../lib/JSONRPCLib.ts";
import L1XWalletService from "../L1XWalletService.ts";
import L1XCoreStubService from "../L1XCoreStubService.ts";

import { DEFAULT_BASE_CONTRACT_ADDRESS } from "../../constants/index.ts";
import { convertToJSONString } from "../../utils/json.ts";
import {
  FTTokenApproveArg,
  FTTokenCreateArg,
  FTTokenGetAllowanceArg,
  FTTokenGetAttributeArg,
  FTTokenGetBalanceArg,
  FTTokenMintArg,
  FTTokenPrepareQueryPayloadArg,
  FTTokenTransferArg,
  FTTokenTransferFromArg,
  RawPayloadArg,
  RawTokenReadOnlyArg,
} from "../../types/method_request.ts";

import {
  hexToStr,
  strToHex,
  hexToPlainByteArray,
  uint8ArrayToPlainByteArray,
  remove0xPrefix,
} from "../../utils/general.ts";

import {
  convertExponentialToString,
  normalizedValue,
} from "../../utils/number.ts";

import {
  FTTokenCreateResponse,
  FTTokenGetAllowanceResponse,
  FTTokenGetAttributeResponse,
  FTTokenGetBalanceResponse,
  // GetAccountStateResponse,
  StateChangingFunctionCallResponse,
} from "../../types/method_response.ts";

import {
  ClusterProvider,
  FTReadOnlyFunction,
  FTStateChangingFunction,
  ProviderAttrib,
  TxSmartContractFunctionCallV2,
  TxSmartContractInitV2,
} from "../../types/general.ts";
import L1XVMService from "../L1XVMService.ts";

/**
 * A service class for interacting with fungible token (FT) related functionality.
 */
class L1XTokenFTService {
  /**
   * The JSON-RPC client used for communication with the L1X core.
   */
  #client: JSONRPCLib;

  /**
   * Represents an instance of the L1XCoreStubService, which provides access to core L1X functionality.
   */
  #core: L1XCoreStubService;

  /**
   * Represents an instance of the L1XVMService, which provides access to core L1X functionality.
   */
  #vm: L1XVMService;

  /**
   * Represents a default base contract address for fungible tokens (FT).
   */
  #defaultBaseContractAddress: string = "";

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
    this.#options = _options;
    this.#vm = _vm;

    // Set FT Address

    this.#defaultBaseContractAddress = DEFAULT_BASE_CONTRACT_ADDRESS[this.#options.clusterType == "mainnet" ? "MAINNET": "TESTNET"].FT;
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
   * Makes a read-only call to a smart contract function.
   *
   * @param {RawTokenReadOnlyArg} payload - The payload for the read-only call.
   * @returns {Promise<string>} A Promise that resolves with the result of the call, converted from hex to string.
   */
  async #makeReadOnlyCall(payload: RawTokenReadOnlyArg): Promise<string> {
    try {
      let _response = await this.#client.request("smartContractReadOnlyCall", {
        request: payload,
      });
      return hexToStr(_response["result"]).replace(/^"(.*)"$/, "$1");
    } catch (e) {
      console.log(
        "Error Occured while getting FT > " + payload.call.function_name,
        e
      );
    }

    return "";
  }

  /**
   * Prepares the payload for a read-only query to a smart contract function.
   *
   * @param {FTTokenPrepareQueryPayloadArg} attrib - The attributes for preparing the payload.
   * @returns {RawTokenReadOnlyArg} The prepared payload for the read-only query.
   */
  #prepareQueryPayload(
    attrib: FTTokenPrepareQueryPayloadArg
  ): RawTokenReadOnlyArg {
    return {
      call: {
        contract_address: hexToPlainByteArray(attrib.contract_address),
        function_name: hexToPlainByteArray(strToHex(attrib.function)),
        arguments: hexToPlainByteArray(
          strToHex(convertToJSONString(attrib.arguments))
        ),
      },
    };
  }

  /**
   * Makes a state-changing function call to a smart contract.
   *
   * @param {FTStateChangingFunction} functionName - The name of the state-changing function to call.
   * @param {any} attrib - The attributes and arguments for the function call.
   * @returns {Promise<StateChangingFunctionCallResponse>} The response containing the address and hash of the transaction.
   */
  async #makeStateChangingFunctionCall(
    functionName: FTStateChangingFunction,
    attrib: any
  ): Promise<StateChangingFunctionCallResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    // Building Params based on function name
    let ftParams = {};
    if (functionName == FTStateChangingFunction.TRANSFER) {
      ftParams = {
        recipient_id: attrib.attrib.recipient_address,
        amount: convertExponentialToString(attrib.attrib.value),
      };
    } else if (functionName == FTStateChangingFunction.APPROVE) {
      ftParams = {
        spender_id: attrib.attrib.spender_address,
        amount: convertExponentialToString(attrib.attrib.value),
      };
    } else if (functionName == FTStateChangingFunction.TRANSFER_FROM) {
      ftParams = {
        sender_id: attrib.attrib.from_address,
        recipient_id: attrib.attrib.to_address,
        amount: convertExponentialToString(attrib.attrib.value),
      };
    } else if (functionName == FTStateChangingFunction.MINT) {
      ftParams = {
        recipient_id: attrib.attrib.recipient_address,
        amount: convertExponentialToString(attrib.attrib.value),
      };
    }

    return this.#vm.makeStateChangingFunctionCall({
      attrib: {
        contract_address: attrib.attrib.contract_address,
        function: functionName,
        arguments: ftParams,
        deposit: 0,
        is_argument_object: true
      },
      private_key: attrib.private_key
    });
  }

  /**
   * Gets the attributes of the fungible token.
   *
   * @param {FTTokenGetAttributeArg} attrib - The arguments for the attribute request.
   * @returns {Promise<FTTokenGetAttributeResponse>} The response containing token attributes.
   */
  async getAttribute(
    attrib: FTTokenGetAttributeArg
  ): Promise<FTTokenGetAttributeResponse> {
    let queryNamePayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.NAME,
      arguments: {},
    });

    let querySymbolPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.SYMBOL,
      arguments: {},
    });

    let queryDecimalPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.DECIMALS,
      arguments: {},
    });

    let queryTotalSupplyPayload: RawTokenReadOnlyArg =
      this.#prepareQueryPayload({
        contract_address: remove0xPrefix(attrib.contract_address),
        function: FTReadOnlyFunction.TOTAL_SUPPLY,
        arguments: {},
      });

    let _tokenAttribResponse: FTTokenGetAttributeResponse = {
      name: "",
      symbol: "",
      decimals: 0,
      total_supply: "",
    };

    _tokenAttribResponse["name"] = await this.#makeReadOnlyCall(
      queryNamePayload
    );
    _tokenAttribResponse["symbol"] = await this.#makeReadOnlyCall(
      querySymbolPayload
    );

    let _decimalResponse = await this.#makeReadOnlyCall(queryDecimalPayload);
    _tokenAttribResponse["decimals"] = parseInt(_decimalResponse);

    _tokenAttribResponse["total_supply"] = await this.#makeReadOnlyCall(
      queryTotalSupplyPayload
    );

    return _tokenAttribResponse;
  }

  /**
   * Gets the balance of a specified address.
   *
   * @param {FTTokenGetBalanceArg} attrib - The arguments for the balance request.
   * @returns {Promise<FTTokenGetBalanceResponse>} The response containing the balance information.
   */
  async getBalance(
    attrib: FTTokenGetBalanceArg
  ): Promise<FTTokenGetBalanceResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.BALANCE_OF,
      arguments: {
        account_id: remove0xPrefix(attrib.address),
      },
    });

    let queryDecimalPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.DECIMALS,
      arguments: {},
    });

    let _tokenAttribResponse: FTTokenGetBalanceResponse = {
      value: "",
      decimals: 0,
      normalized_value: "",
    };

    let _decimalResponse = await this.#makeReadOnlyCall(queryDecimalPayload);

    // console.log(queryDecimalPayload,"getBalance > _decimalResponse");
    let _balanceResponse = await this.#makeReadOnlyCall(queryPayload);

    _tokenAttribResponse["decimals"] = parseInt(_decimalResponse);
    _tokenAttribResponse["value"] = _balanceResponse;
    // _tokenAttribResponse["value"] = "";
    _tokenAttribResponse["normalized_value"] = normalizedValue(
      _tokenAttribResponse["value"],
      _tokenAttribResponse["decimals"]
    );

    return _tokenAttribResponse;
  }

  /**
   * Gets the allowance of a spender for a specified owner.
   *
   * @param {FTTokenGetAllowanceArg} attrib - The arguments for the allowance request.
   * @returns {Promise<FTTokenGetAllowanceResponse>} The response containing the allowance information.
   */
  async getAllowance(
    attrib: FTTokenGetAllowanceArg
  ): Promise<FTTokenGetAllowanceResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.ALLOWANCE,
      arguments: {
        owner_id: remove0xPrefix(attrib.owner_address),
        spender_id: remove0xPrefix(attrib.spender_address),
      },
    });

    let queryDecimalPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: FTReadOnlyFunction.DECIMALS,
      arguments: {},
    });

    let _tokenAttribResponse: FTTokenGetAllowanceResponse = {
      value: "",
      decimals: 0,
      normalized_value: "",
    };

    let _decimalResponse = await this.#makeReadOnlyCall(queryDecimalPayload);
    let _balanceResponse = await this.#makeReadOnlyCall(queryPayload);

    _tokenAttribResponse["decimals"] = parseInt(_decimalResponse);
    _tokenAttribResponse["value"] = _balanceResponse;
    _tokenAttribResponse["normalized_value"] = normalizedValue(
      _tokenAttribResponse["value"],
      _tokenAttribResponse["decimals"]
    );

    return _tokenAttribResponse;
  }

  /**
   * Transfers tokens from the sender's account to a recipient's account.
   *
   * @param {FTTokenTransferArg} attrib - The arguments for the transfer request.
   * @returns {Promise<FTTokenTransferResponse>} The response containing the transfer details.
   */
  async transfer(
    attrib: FTTokenTransferArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
          contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
          recipient_address: remove0xPrefix(attrib?.attrib?.recipient_address),
          value: attrib?.attrib?.value,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }
    
    return this.#makeStateChangingFunctionCall(
      FTStateChangingFunction.TRANSFER,
      _attrib
    );
  }

  /**
   * Approves a spender to spend tokens on behalf of the sender.
   *
   * @param {FTTokenApproveArg} attrib - The arguments for the approval request.
   * @returns {Promise<FTTokenApproveResponse>} The response containing the approval details.
   */
  async approve(
    attrib: FTTokenApproveArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
          contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
          spender_address: remove0xPrefix(attrib?.attrib?.spender_address),
          value: attrib?.attrib?.value,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }
    return this.#makeStateChangingFunctionCall(
      FTStateChangingFunction.APPROVE,
      _attrib
    );
  }

  /**
   * Transfers tokens from a sender to a recipient on behalf of a spender.
   *
   * @param {FTTokenTransferFromArg} attrib - The arguments for the transferFrom request.
   * @returns {Promise<FTTokenTransferFromResponse>} The response containing the transfer details.
   */
  async transferFrom(
    attrib: FTTokenTransferFromArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        from_address: remove0xPrefix(attrib?.attrib?.from_address),
        to_address: remove0xPrefix(attrib?.attrib?.to_address),
        value: attrib?.attrib?.value,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      FTStateChangingFunction.TRANSFER_FROM,
      _attrib
    );
  }

  /**
   * Mints new tokens and assigns them to a specified recipient.
   *
   * @param {FTTokenMintArg} attrib - The arguments for the mint request.
   * @returns {Promise<FTTokenTransferFromResponse>} The response containing the mint details.
   */
  async mint(
    attrib: FTTokenMintArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        recipient_address: remove0xPrefix(attrib?.attrib?.recipient_address),
        value: attrib?.attrib?.value,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    };

    return this.#makeStateChangingFunctionCall(
      FTStateChangingFunction.MINT,
      _attrib
    );
  }

  /**
   * Creates a new fungible token contract.
   *
   * @param {FTTokenCreateArg} attrib - The arguments for the create request.
   * @returns {Promise<FTTokenCreateResponse>} The response containing the contract creation details.
   */
  async create(attrib: FTTokenCreateArg): Promise<FTTokenCreateResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    // Initialize Params
    let ftParams = {
      metadata: {
        name: attrib.attrib.name,
        symbol: attrib.attrib.symbol,
        decimals: attrib.attrib.decimals,
      },
      account_ids: [wallet.address],
      amounts: [convertExponentialToString(attrib.attrib.initial_supply)],
    };

    return this.#vm.init({
      attrib: {
        base_contract_address: attrib.attrib.baseContract,
        arguments: ftParams,
        deposit: 0
      },
      private_key: attrib.private_key
    });
  }
}

export default L1XTokenFTService;
