/**
 * Represents the main export of the L1XProvider module.
 * This module provides functionality related to the L1XProvider and its associated types.
 * @module L1XProvider
 */

/**
 * The default export of the L1XProvider module.
 * This is the main class representing the L1XProvider.
 * @class
 */
export { default as L1XProvider } from "./provider/index.ts";

/**
 * Re-exports all the types from the 'types' module of the L1XProvider.
 * These types are used in conjunction with the L1XProvider functionality.
 * @module L1XProvider
 */
export * from "./types/index.ts";