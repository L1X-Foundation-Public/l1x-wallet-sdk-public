import { JSONRPCClient } from "json-rpc-2.0";
import fetch from 'cross-fetch';
import { JSONRPCOption } from "../types/general.ts";

/**
 * Represents a client for making JSON-RPC requests to a specified endpoint.
 * This class handles sending JSON-RPC requests over HTTP and receiving responses.
 *
 * @class
 */
class JSONRPCLib {
  /**
   * The endpoint URL to which JSON-RPC requests will be sent.
   */
  endpoint: string = "";

  /**
   * The underlying JSON-RPC client used to manage requests and responses.
   */
  client: JSONRPCClient;

  /**
   * Options for configuring the JSON-RPC client's behavior.
   */
  options: JSONRPCOption;

  /**
   * Constructs a new instance of the JSONRPCLib class.
   *
   * @param {string} _endpoint - The endpoint URL to send JSON-RPC requests to.
   * @param {JSONRPCOption} _options - Options for configuring the JSON-RPC client's behavior.
   */
  constructor(_endpoint: string, _options: JSONRPCOption) {
    /**
     * Initializes the endpoint URL for sending JSON-RPC requests.
     */
    this.endpoint = _endpoint;

    /**
     * Builds and initializes the underlying JSON-RPC client.
     */
    this.client = this.buildClient();

    /**
     * Stores the provided options for configuring the client's behavior.
     */
    this.options = _options;
  }

  /**
   * Builds and configures the JSON-RPC client instance for making requests.
   *
   * @returns {JSONRPCClient} - The initialized JSON-RPC client instance.
   */
  buildClient() {
    const client: JSONRPCClient = new JSONRPCClient((jsonRPCRequest) => {
      return fetch(this.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonRPCRequest),
      }).then(async (response) => {
        
        if (response.status === 200) {
          // Use client.receive when a JSON-RPC response is received.
          return response
            .json()
            .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .catch((error) => {

        return Promise.reject(new Error(error.message));
      });
    });

    return client;
  }

  /**
   * Sends a JSON-RPC request to the specified method with the provided parameters.
   *
   * @param {string} _method - The JSON-RPC method to call.
   * @param {any} _params - The parameters to include in the JSON-RPC request.
   * @returns {Promise<any>} - A Promise that resolves to the JSON-RPC response.
   */
  async request(_method: string, _params: any) {
    return await this.client.request(
      this.options.namespace + _method,
      _params
    );
  }
}

export default JSONRPCLib;