import JSONRPCLib from "../lib/JSONRPCLib.ts";
import { ProviderAttrib } from "../types/index.ts";
import L1XCoreStubService from "./L1XCoreStubService.ts";
import L1XVMService from "./L1XVMService.ts";
import L1XTokenFTService from "./tokens/L1XTokenFTService.ts";
import L1XTokenNFTService from "./tokens/L1XTokenNFTService.ts";

/**
 * A service class for managing L1X token-related services.
 *
 * @class
 * @see {@link L1XTokenFTService}
 * @see {@link L1XTokenNFTService}
 */
class L1XTokenService {
  /**
   * The service for interacting with fungible tokens (FT).
   *
   * @type {L1XTokenFTService}
   * @memberof L1XTokenService
   * @instance
   * @see {@link L1XTokenFTService}
   */
  #FT: L1XTokenFTService;

  /**
   * The service for interacting with non-fungible tokens (NFT).
   *
   * @type {L1XTokenNFTService}
   * @memberof L1XTokenService
   * @instance
   * @see {@link L1XTokenNFTService}
   */
  #NFT: L1XTokenNFTService;

 
  /**
   * Creates an instance of L1XTokenService.
   *
   * @param {JSONRPCLib} _client - The JSON-RPC client used for making requests.
   * @param {L1XCoreStubService} _core - The core service used for additional functionality.
   * @constructor
   */
  constructor(_client: JSONRPCLib, _core: L1XCoreStubService, _vm: L1XVMService, _options: ProviderAttrib) {
    // Initialize the FT and NFT services
    this.#FT = new L1XTokenFTService(_client, _core, _vm, _options);
    this.#NFT = new L1XTokenNFTService(_client, _core, _vm, _options);
  }

  /**
   * The service for interacting with fungible tokens (FT).
   *
   * @type {L1XTokenFTService}
   * @see {@link L1XTokenFTService}
   */
  get FT(): L1XTokenFTService {
    return this.#FT;
  }

  /**
   * The service for interacting with non-fungible tokens (NFT).
   *
   * @type {L1XTokenNFTService}
   * @see {@link L1XTokenNFTService}
   */
  get NFT(): L1XTokenNFTService {
    return this.#NFT;
  }
}

export default L1XTokenService;
