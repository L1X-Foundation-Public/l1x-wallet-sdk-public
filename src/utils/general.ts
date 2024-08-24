import { Buffer } from "buffer";

/**
 * Converts a hexadecimal string to a Uint8Array.
 * @param _strData - The hexadecimal string to convert.
 * @returns The Uint8Array representation of the hexadecimal string.
 */
export function strToUint8Array(_strData: string): Uint8Array {
  return new Uint8Array(Buffer.from(_strData, "hex"));
}

/**
 * Converts a hexadecimal string to a plain byte array.
 * @param _strData - The hexadecimal string to convert.
 * @returns The plain byte array representation of the hexadecimal string.
 */
export function hexToPlainByteArray(_strData: string): Array<any> {
  return Array.from(strToUint8Array(_strData));
}

/**
 * Converts a string to its hexadecimal representation.
 * @param _strData - The string to convert.
 * @returns The hexadecimal representation of the input string.
 */
export function strToHex(_strData: string): string {
  return Buffer.from(_strData, "utf-8").toString("hex");
}

/**
 * Converts a hexadecimal string to its string representation.
 * @param _hexData - The hexadecimal string to convert.
 * @returns The string representation of the input hexadecimal string.
 */
export function hexToStr(_hexData: string): string {
  return Buffer.from(_hexData, "hex").toString("utf-8");
}

/**
 * Converts a Uint8Array to a plain byte array.
 * @param _arrData - The Uint8Array to convert.
 * @returns The plain byte array representation of the Uint8Array.
 */
export function uint8ArrayToPlainByteArray(_arrData: Uint8Array): Array<any> {
  return Array.from(_arrData);
}

/**
 * Converts a Uint8Array to its hexadecimal representation.
 * @param _arrData - The Uint8Array to convert.
 * @returns The hexadecimal representation of the Uint8Array.
 */
export function uint8ArrayToHex(_arrData: Uint8Array): string {
  return Buffer.from(_arrData).toString("hex");
}

/**
 * Converts an array of values to a Uint8Array.
 * @param _arrData - The array of values to convert.
 * @returns The Uint8Array representation of the input array.
 */
export function arrayToUint8Array(_arrData: Array<any>): Uint8Array {
  return new Uint8Array(_arrData);
}

/**
 * Generates a random string of the specified length.
 * @param length - The length of the random string to generate.
 * @returns A random string of the specified length.
 */
export function generateRandomString(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

export function remove0xPrefix(inputString: string) {
  if (inputString?.startsWith("0x")) {
    return inputString.substring(2); // Removes the first two characters (0x)
  }
  return inputString; // If there is no "0x" prefix, return the original string
}

export function isHexString(str: string) {
  return /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;
}
