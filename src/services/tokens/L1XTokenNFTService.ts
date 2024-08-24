import { DEFAULT_BASE_CONTRACT_ADDRESS } from "../../constants/index.ts";
import {
  NFTApproveArg,
  NFTReadOnlyFunction,
  NFTSetApprovalForAllArg,
  NFTStateChangingFunction,
  NFTTokenBurnArg,
  NFTTokenCreateArg,
  NFTTokenGetAttributeArg,
  NFTTokenGetBalanceArg,
  NFTTokenMintToArg,
  NFTTokenOwnedByAddressArg,
  NFTTokenOwnerOfArg,
  NFTTokenPrepareQueryPayloadArg,
  NFTTokenTransferArg,
  NFTTokenUriOfArg,
  ProviderAttrib,
  RawPayloadArg,
  RawTokenReadOnlyArg,
  TxSmartContractFunctionCallV2,
  TxSmartContractInitV2,
} from "../../types/index.ts";
import {
  NFTTokenApproveVMFunctionParams,
  NFTTokenBurnVMFunctionParams,
  NFTTokenMintToVMFunctionParams,
  NFTTokenSetApprovalForAllVMFunctionParams,
  NFTTokenTransferFromVMFunctionParams,
} from "../../types/l1x_nft_vm_contract.ts";
import {
  GetAccountStateResponse,
  NFTTokenCreateResponse,
  NFTTokenGetAttributeResponse,
  NFTTokenGetBalanceResponse,
  NFTTokenOwnedTokensResponse,
  NFTTokenOwnerOfResponse,
  NFTTokenUriOfResponse,
  StateChangingFunctionCallResponse,
} from "../../types/method_response.ts";
import JSONRPCLib from "../../lib/JSONRPCLib.ts";
import {
  hexToStr,
  strToHex,
  hexToPlainByteArray,
  uint8ArrayToPlainByteArray,
  remove0xPrefix,
} from "../../utils/general.ts";
import { convertToJSONString } from "../../utils/json.ts";
import { convertExponentialToString } from "../../utils/number.ts";
import L1XCoreStubService from "../L1XCoreStubService.ts";
import L1XWalletService from "../L1XWalletService.ts";
import L1XVMService from "../L1XVMService.ts";

/**
 * Represents a service for working with non-fungible tokens (NFTs).
 */
class L1XTokenNFTService {
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
   * Represents a default base contract address for non fungible tokens (NFT).
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
   * Create an instance of L1XTokenNFTService.
   * @param _client - JSONRPC client.
   * @param _core - L1XCoreStubService instance.
   */
  constructor(_client: JSONRPCLib, _core: L1XCoreStubService, _vm: L1XVMService,_options: ProviderAttrib) {
    this.#client = _client;
    this.#core = _core;
    this.#options = _options;
    this.#vm = _vm;

    // Set NFT Address

    this.#defaultBaseContractAddress = DEFAULT_BASE_CONTRACT_ADDRESS[this.#options.clusterType == "mainnet" ? "MAINNET": "TESTNET"].NFT;
  }

  /**
   * Handles fallback value.
   * @param data - Data to handle.
   * @param fallbackValue - Fallback value if data is falsy.
   * @returns Handled value.
   */
  #handleFallbackValue(data: any, fallbackValue?: any) {
    fallbackValue = fallbackValue || null;

    if (data === 0) {
      return data;
    }

    return data ? data : fallbackValue;
  }

  /**
   * Makes a read-only call to a smart contract.
   * @param payload - Payload for the read-only call.
   * @returns Result of the call.
   */
  async #makeReadOnlyCall(payload: RawTokenReadOnlyArg): Promise<string> {
    let _response:any = {}
    try {
      _response = await this.#client.request("smartContractReadOnlyCall", {
        request: payload,
      });
      return hexToStr(_response["result"]).replace(/^"(.*)"$/, "$1");
    } catch (e) {
      console.log(
        "Error Occured while getting FT > " + payload.call.function_name,_response
      );
    }

    return "";
  }

  /**
   * Prepares the payload for a query.
   * @param attrib - Query attributes.
   * @returns Prepared query payload.
   */
  #prepareQueryPayload(
    attrib: NFTTokenPrepareQueryPayloadArg
  ): RawTokenReadOnlyArg {
    return {
      call: {
        contract_address: hexToPlainByteArray(attrib.contract_address),
        function_name: hexToPlainByteArray(strToHex(attrib.function)),
        arguments: hexToPlainByteArray(strToHex(JSON.stringify(attrib.arguments))),
      },
    };
  }

  /**
   * Makes a state-changing function call to the smart contract.
   * @param functionName - Name of the function to call.
   * @param attrib - Function call attributes.
   * @returns State-changing function call response.
   */
  async #makeStateChangingFunctionCall(
    functionName: NFTStateChangingFunction,
    attrib: any
  ): Promise<StateChangingFunctionCallResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    // Building Params based on function name
    let ftParams: any = {};
    if (functionName == NFTStateChangingFunction.TRANSFER_FROM) {
      let _params: NFTTokenTransferFromVMFunctionParams = {
        from: wallet.address,
        to: attrib.attrib.recipient_address,
        id: convertExponentialToString(attrib.attrib.token_id),
      };

      ftParams = _params;
    } else if (functionName == NFTStateChangingFunction.APPROVE) {
      let _params: NFTTokenApproveVMFunctionParams = {
        spender: attrib.attrib.spender_address,
        id: convertExponentialToString(attrib.attrib.token_id),
      };

      ftParams = _params;
    } else if (functionName == NFTStateChangingFunction.BURN) {
      let _params: NFTTokenBurnVMFunctionParams = {
        id: convertExponentialToString(attrib.attrib.token_id),
      };

      ftParams = _params;
    } else if (functionName == NFTStateChangingFunction.MINT_TO) {
      let _params: NFTTokenMintToVMFunctionParams = {
        to: attrib.attrib.recipient_address,
        id: convertExponentialToString(attrib.attrib.token_id),
        token_uri: attrib.attrib.token_uri
      };

      ftParams = _params;
    } else if (functionName == NFTStateChangingFunction.SET_APPROVAL_FOR_ALL) {
      let _params: NFTTokenSetApprovalForAllVMFunctionParams = {
        operator: attrib.attrib.operator_address,
        approved: attrib.attrib.approved,
      };

      ftParams = _params;
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
   * Gets attributes of an NFT.
   * @param attrib - Attributes for getting NFT attributes.
   * @returns NFT attributes.
   */
  async getAttribute(
    attrib: NFTTokenGetAttributeArg
  ): Promise<NFTTokenGetAttributeResponse> {
    // let queryNamePayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
    //   contract_address: remove0xPrefix(attrib.contract_address),
    //   function: NFTReadOnlyFunction.NAME,
    //   arguments: {},
    // });

    // let querySymbolPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
    //   contract_address: remove0xPrefix(attrib.contract_address),
    //   function: NFTReadOnlyFunction.SYMBOL,
    //   arguments: {},
    // });

    let queryMetadataPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: NFTReadOnlyFunction.METADATA,
      arguments: {},
    });

    let queryTotalMintedPayload: RawTokenReadOnlyArg =
      this.#prepareQueryPayload({
        contract_address: remove0xPrefix(attrib.contract_address),
        function: NFTReadOnlyFunction.MINTED_TOTAL,
        arguments: {},
      });

    let _tokenAttribResponse: NFTTokenGetAttributeResponse = {
      name: "",
      symbol: "",
      icon: "",
      uri: "",
      decimals: 0,
      total_minted: "",
    };

    let metadata: any = await this.#makeReadOnlyCall(
      queryMetadataPayload
    )

    metadata = JSON.parse(metadata)

    _tokenAttribResponse["name"] = metadata?.name;
    _tokenAttribResponse["symbol"] = metadata?.symbol;
    _tokenAttribResponse["icon"] = metadata?.icon;
    _tokenAttribResponse["uri"] = metadata?.uri;
    _tokenAttribResponse["decimals"] = metadata?.decimals;

    _tokenAttribResponse["total_minted"] = await this.#makeReadOnlyCall(
      queryTotalMintedPayload
    );

    return _tokenAttribResponse;
  }

  /**
   * Gets the balance of an NFT for a specific owner.
   * @param attrib - Attributes for getting NFT balance.
   * @returns NFT balance response.
   */
  async getBalance(
    attrib: NFTTokenGetBalanceArg
  ): Promise<NFTTokenGetBalanceResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: NFTReadOnlyFunction.BALANCE_OF,
      arguments: {
        owner: remove0xPrefix(attrib.address),
      },
    });

    let _tokenAttribResponse: NFTTokenGetBalanceResponse = {
      value: "",
    };

    let _balanceResponse = await this.#makeReadOnlyCall(queryPayload);

    _tokenAttribResponse["value"] = _balanceResponse;

    return _tokenAttribResponse;
  }

  /**
   * Gets the owned token ids of an NFT for a specific owner.
   * @param attrib - Attributes for getting NFT balance.
   * @returns NFT owned token ids response.
   */
  async getOwnedTokens(
    attrib: NFTTokenOwnedByAddressArg
  ): Promise<NFTTokenOwnedTokensResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: NFTReadOnlyFunction.OWNED_TOKENS,
      arguments: {
        owner: remove0xPrefix(attrib.address),
      },
    });

    let _tokenAttribResponse: NFTTokenOwnedTokensResponse = {
      token_ids: [],
    };

    let _balanceResponse: any = await this.#makeReadOnlyCall(queryPayload);
    _balanceResponse = JSON.parse(_balanceResponse);
    console.log(_balanceResponse, "_balanceResponse");

    // return _tokenAttribResponse;

    _tokenAttribResponse["token_ids"] = _balanceResponse;

    return _tokenAttribResponse;
  }

  /**
   * Gets the owner of a specific NFT token ID.
   * @param attrib - Attributes for getting owner of an NFT.
   * @returns Owner of the NFT token ID.
   */
  async getOwnerOfTokenId(
    attrib: NFTTokenOwnerOfArg
  ): Promise<NFTTokenOwnerOfResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: NFTReadOnlyFunction.OWNER_OF,
      arguments: {
        id: convertExponentialToString(attrib.token_id),
      },
    });

    let _tokenAttribResponse: NFTTokenOwnerOfResponse = {
      owner_address: "",
    };

    let _ownerOfResponse = await this.#makeReadOnlyCall(queryPayload);

    _tokenAttribResponse["owner_address"] = _ownerOfResponse;

    return _tokenAttribResponse;
  }

  /**
   * Gets the owner of a specific NFT token ID.
   * @param attrib - Attributes for getting owner of an NFT.
   * @returns Owner of the NFT token ID.
   */
  async getTokenUri(
    attrib: NFTTokenUriOfArg
  ): Promise<NFTTokenUriOfResponse> {
    let queryPayload: RawTokenReadOnlyArg = this.#prepareQueryPayload({
      contract_address: remove0xPrefix(attrib.contract_address),
      function: NFTReadOnlyFunction.URI,
      arguments: {
        id: convertExponentialToString(attrib.token_id),
      },
    });

    let _tokenAttribResponse: NFTTokenUriOfResponse = {
      token_uri: "",
    };

    let _ownerOfResponse = await this.#makeReadOnlyCall(queryPayload);

    _tokenAttribResponse["token_uri"] = _ownerOfResponse;

    return _tokenAttribResponse;
  }

  /**
   * Transfers an NFT from one address to another.
   * @param attrib - Attributes for transferring NFT.
   * @returns State-changing function call response.
   */
  async transferFrom(
    attrib: NFTTokenTransferArg
  ): Promise<StateChangingFunctionCallResponse> {

    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        recipient_address: remove0xPrefix(attrib?.attrib?.recipient_address),
        token_id: attrib?.attrib?.token_id,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      NFTStateChangingFunction.TRANSFER_FROM,
      _attrib
    );
  }

  /**
   * Mints an NFT and assigns it to an address.
   * @param attrib - Attributes for minting NFT.
   * @returns State-changing function call response.
   */
  async mintTo(
    attrib: NFTTokenMintToArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        recipient_address: remove0xPrefix(attrib?.attrib?.recipient_address),
        token_id: attrib?.attrib?.token_id,
        token_uri: attrib?.attrib?.token_uri
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      NFTStateChangingFunction.MINT_TO,
      _attrib
    );
  }

  /**
   * Burns an NFT.
   * @param attrib - Attributes for burning NFT.
   * @returns State-changing function call response.
   */
  async burn(
    attrib: NFTTokenBurnArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        token_id: attrib?.attrib?.token_id,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      NFTStateChangingFunction.BURN,
      _attrib
    );
  }

  /**
   * Approves an address to spend an NFT.
   * @param attrib - Attributes for approving NFT.
   * @returns State-changing function call response.
   */
  async approve(
    attrib: NFTApproveArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        spender_address: remove0xPrefix(attrib?.attrib?.spender_address),
        token_id: attrib?.attrib?.token_id,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      NFTStateChangingFunction.APPROVE,
      _attrib
    );
  }

  /**
   * Sets approval for all addresses to spend an NFT.
   * @param attrib - Attributes for setting approval for all.
   * @returns State-changing function call response.
   */
  async setApprovalForAll(
    attrib: NFTSetApprovalForAllArg
  ): Promise<StateChangingFunctionCallResponse> {
    let _attrib = {
      attrib: {
        contract_address: remove0xPrefix(attrib?.attrib?.contract_address),
        operator_address: remove0xPrefix(attrib?.attrib?.operator_address),
        approved: attrib?.attrib?.approved,
      },
      private_key:attrib?.private_key,
      fee_limit:attrib?.fee_limit
    }

    return this.#makeStateChangingFunctionCall(
      NFTStateChangingFunction.SET_APPROVAL_FOR_ALL,
      _attrib
    );
  }

  /**
   * Creates an NFT.
   * @param attrib - Attributes for creating NFT.
   * @returns NFT creation response.
   */
  async create(attrib: NFTTokenCreateArg): Promise<NFTTokenCreateResponse> {
    // Derive Wallet
    let walletService = new L1XWalletService();
    let wallet = await walletService.importByPrivateKey(attrib.private_key);

    // Initialize Params
    let nftParams = {
      metadata: {
        name: attrib?.attrib?.name,
        symbol: attrib?.attrib?.symbol,
        icon: attrib?.attrib?.icon,
        uri: attrib?.attrib?.uri,
        decimals: 18, // Hardcoded for now
      },
    };

    return this.#vm.init({
      attrib: {
        base_contract_address: attrib.attrib.baseContract,
        arguments: nftParams,
        deposit: 0
      },
      private_key: attrib.private_key
    });
  }
}

export default L1XTokenNFTService;
