import { ClusterProvider, ProviderAttrib } from "../types/index.ts";
import JSONRPCLib from "../lib/JSONRPCLib.ts";
import L1XCoreStubService from "../services/L1XCoreStubService.ts";
import L1XTokenService from "../services/L1XTokenService.ts";
import L1XWalletService from "../services/L1XWalletService.ts";
import { getClusterProvider } from "../utils/config.ts";
import L1XVMService from "../services/L1XVMService.ts";
import L1XEVMService from "../services/L1XEVMService.ts";
import L1XBalancerService from "../services/L1XBalancerService.ts";

/**
 * Represents the L1XProvider class, which serves as a central interface for interacting with various L1X services and functionality.
 * This class encapsulates access to core services, wallet management, and token-related operations.
 *
 * @class
 * @see {@link L1XProvider}
 */
export default class L1XProvider {
  /**
   * Represents an instance of the L1XCoreStubService, which provides access to core L1X functionality.
   *
   * @type {L1XCoreStubService}
   * @memberof L1XProvider
   * @instance
   * @see {@link L1XCoreStubService}
   */
  #core: L1XCoreStubService;

  /**
   * Represents an instance of the L1XWalletService, which manages L1X wallet-related operations.
   *
   * @type {L1XWalletService}
   * @memberof L1XProvider
   * @instance
   * @see {@link L1XWalletService}
   */
  #wallet: L1XWalletService;

  /**
   * Represents an instance of the L1XTokenService, which facilitates token-related operations using L1X services.
   *
   * @type {L1XTokenService}
   * @memberof L1XProvider
   * @instance
   * @see {@link L1XTokenService}
   */
  #tokens: L1XTokenService;

  /**
   * Represents an instance of the L1XVMService, which facilitates VM operations using L1X services.
   *
   * @type {L1XVMService}
   * @memberof L1XProvider
   * @instance
   * @see {@link L1XVMService}
   */
  #vm: L1XVMService;

  #evm: L1XEVMService;

  #balancer: L1XBalancerService;

  /**
   * Represents the cluster provider information associated with the L1XProvider.
   *
   * @type {ClusterProvider}
   * @memberof L1XProvider
   * @instance
   * @see {@link ClusterProvider}
   */
  #providerAttrib: ClusterProvider;

  /**
   * Represents the options for  cluster provider information associated with the L1XProvider.
   *
   * @type {ClusterProvider}
   * @memberof L1XProvider
   * @instance
   * @see {@link ClusterProvider}
   */
  #options: ProviderAttrib;

  /**
   * Constructs a new instance of the L1XProvider class.
   *
   * @param {ProviderAttrib} defaultOpts - The default options for initializing the provider.
   * @constructor
   */
  constructor(defaultOpts: ProviderAttrib) {
    /**
     * Initializes the cluster provider based on the provided default options.
     */
    this.#options = defaultOpts;

    this.#providerAttrib = getClusterProvider(defaultOpts);


    /**
     * Creates a JSONRPCLib instance for communication with the L1X service using the provider's endpoint.
     */
    let jsonRPCClient = new JSONRPCLib(this.#providerAttrib.endpoint, {
      namespace: "l1x_",
    });

    /**
     * Initializes the L1XCoreStubService instance for core L1X functionality using the JSON-RPC client.
     */
    this.#core = new L1XCoreStubService(jsonRPCClient);

    /**
     * Initializes the L1XTokenService instance for token-related operations using the JSON-RPC client and L1XCoreStubService instance.
     */
    this.#tokens = new L1XTokenService(jsonRPCClient, this.core, this.#options);

    /**
     * Initializes the L1XWalletService instance for managing L1X wallet-related operations.
     */
    this.#wallet = new L1XWalletService();

     /**
     * Initializes the L1XVMService instance for managing L1X VM operations.
     */
    this.#vm = new L1XVMService(jsonRPCClient, this.core, this.#options);

    this.#evm = new L1XEVMService(jsonRPCClient, this.core, this.#vm, this.#options);

    this.#balancer = new L1XBalancerService(jsonRPCClient, this.core, this.#vm, this.#options);
  }

  /**
   * The core service used for additional functionality.
   *
   * @type {L1XCoreStubService}
   * @see {@link L1XCoreStubService}
   */
  get providerAttribute(): ClusterProvider {
    return this.#providerAttrib;
  }

  /**
   * The core service used for additional functionality.
   *
   * @type {L1XCoreStubService}
   * @see {@link L1XCoreStubService}
   */
  get options(): ProviderAttrib {
    return this.#options;
  }

  /**
   * The core service used for additional functionality.
   *
   * @type {L1XCoreStubService}
   * @see {@link L1XCoreStubService}
   */
  get core(): L1XCoreStubService {
    return this.#core;
  }

  /**
   * The wallet service used for managing wallets, private keys, and signatures.
   *
   * @type {L1XWalletService}
   * @see {@link L1XWalletService}
   */
  get wallet(): L1XWalletService {
    return this.#wallet;
  }

  /**
   * The token service for managing L1X tokens, both fungible and non-fungible.
   *
   * @type {L1XTokenService}
   * @see {@link L1XTokenService}
   */
  get tokens(): L1XTokenService {
    return this.#tokens;
  }

  /**
   * The vm service for managing L1X VM.
   *
   * @type {L1XVMService}
   * @see {@link L1XVMService}
   */
  get vm(): L1XVMService {
    return this.#vm;
  }

  get evm(): L1XEVMService {
    return this.#evm;
  }

  get balancer(): L1XBalancerService {
    return this.#balancer;
  }
}
