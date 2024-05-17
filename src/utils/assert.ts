/**
 * Custom assertion function that logs an error and throws an exception if the assertion fails.
 * @param fileName - The name of the file or context where the assertion is made.
 * @param error - The error or assertion message to be logged and thrown.
 * @throws {Error} - Throws an error with the given assertion message.
 * @example
 * ```typescript
 * assert("myFile.js", "Assertion failed: Value should be greater than 10");
 * ```
 */
export default function assert(fileName: string, error: unknown | string) {
    console.error(`[${fileName}]: ${JSON.stringify(error)}`);
    throw new Error(`[${fileName}]: ${JSON.stringify(error)}`);
  }