import { ProviderAttrib, ClusterProvider } from "../types/index.ts";
import { CLUSTER_TYPE, DEFAULT_CLUSTER_ADDRESS, DEFAULT_CLUSTER_ENDPOINT } from "../constants/index.ts";

/**
 * Retrieves the cluster provider information based on the provided cluster options.
 * This function is used to determine the cluster's address and endpoint based on the cluster type.
 *
 * @param {ProviderAttrib} _clusterOpts - The cluster options to determine the cluster provider information.
 * @returns {ClusterProvider} - The cluster provider information containing the cluster's address and endpoint.
 */
export function getClusterProvider(_clusterOpts: ProviderAttrib): ClusterProvider {
    if (_clusterOpts.clusterType === CLUSTER_TYPE.MAINNET) {
        return {
            clusterAddress: DEFAULT_CLUSTER_ADDRESS.MAINNET,
            endpoint: _clusterOpts.endpoint || DEFAULT_CLUSTER_ENDPOINT.MAINNET,
        };
    } else if (_clusterOpts.clusterType === CLUSTER_TYPE.TESTNET) {
        return {
            clusterAddress: DEFAULT_CLUSTER_ADDRESS.TESTNET,
            endpoint: _clusterOpts.endpoint || DEFAULT_CLUSTER_ENDPOINT.TESTNET,
        };
    } else if (_clusterOpts.clusterType === CLUSTER_TYPE.TESTNET) {
        return {
            clusterAddress: DEFAULT_CLUSTER_ADDRESS.DEVNET,
            endpoint: _clusterOpts.endpoint || DEFAULT_CLUSTER_ENDPOINT.DEVNET,
        };
    } 
    else {
        // Default to testnet if the cluster type is not recognized
        return {
            clusterAddress: DEFAULT_CLUSTER_ADDRESS.TESTNET,
            endpoint: _clusterOpts.endpoint || DEFAULT_CLUSTER_ENDPOINT.TESTNET,
        };
    }
}