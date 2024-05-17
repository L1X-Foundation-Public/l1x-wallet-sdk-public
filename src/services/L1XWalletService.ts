import secp256k1 from "secp256k1";
import { Buffer } from "buffer";
// import { sha256 } from 'js-sha256';
import { Sha256 } from "@aws-crypto/sha256-js";
import { keccak256 } from "js-sha3";

import { strToUint8Array, uint8ArrayToHex } from "../utils/general.ts";
import { RawPayloadArg } from "../types/method_request.ts";
import { WalletImportByPrivateKeyResponse } from "../types/method_response.ts";

/**
 * A service class for managing L1X wallets, private keys, and signatures.
 *
 * @class
 * @see {@link RawPayloadArg}
 */
class L1XWalletService {
  
  /**
   * Imports a wallet using a private key and derives associated public key and address.
   *
   * @param {string} privateKey - The private key in hexadecimal format.
   * @returns {Promise<{private_key: string, public_key: string, public_key_bytes: Uint8Array, address: string, address_with_prefix: string}>}
   * - A promise that resolves to an object containing the private key, public key, public key bytes, address, and address with prefix.
   * @async
   * @see {@link RawPayloadArg}
   */
  async importByPrivateKey(privateKey: string) : Promise<WalletImportByPrivateKeyResponse>{
    // Convert the private key hex string to a buffer
    const privateKeyBuffer = strToUint8Array(privateKey);
    const pubKeyByteArray = secp256k1.publicKeyCreate(privateKeyBuffer);

    const publicKeyUnCompressed = Buffer.from(secp256k1.publicKeyConvert(pubKeyByteArray, false)).subarray(1)
    const publicKeyHash = keccak256.arrayBuffer(publicKeyUnCompressed);

    const address = Buffer.from(publicKeyHash.slice(-20)).toString("hex");
    const addressWithPrefix = "0x"+address;

    return {
      private_key: privateKey,
      public_key: Buffer.from(
        secp256k1.publicKeyCreate(privateKeyBuffer)
      ).toString("hex"),
      public_key_bytes: new Uint8Array(
        secp256k1.publicKeyCreate(privateKeyBuffer)
      ),
      address: address,
      address_with_prefix: addressWithPrefix
    };
  }

  /**
   * Signs a payload using a private key and returns the signature.
   *
   * @param {RawPayloadArg} rawPayload - The raw payload to be signed.
   * @param {string} privateKey - The private key in hexadecimal format.
   * @returns {Promise<Uint8Array>} - A promise that resolves to the signature of the payload.
   * @async
   * @see {@link RawPayloadArg}
   */
  async signPayload(rawPayload: any, privateKey: string) : Promise<Uint8Array> {
    let tmpPayload = JSON.parse(JSON.stringify(rawPayload));

    const privKeyEncodedViaBuffer = strToUint8Array(privateKey);

    const hash = new Sha256();
    hash.update(JSON.stringify(tmpPayload));

    // const txPayloadJSON = sha256(JSON.stringify(tmpPayload));

    // Encode the JSON string into a Uint8Array
    // const txPayloadByteArray = strToUint8Array(txPayloadJSON);
    const txPayloadByteArray = await hash.digest();
    const sigObj = secp256k1.ecdsaSign(
      txPayloadByteArray,
      privKeyEncodedViaBuffer
    );
    
    return sigObj.signature;
  }
  
  /**
   * Converts a Uint8Array to its hexadecimal representation.
   *
   * @param {Uint8Array} _data - The Uint8Array to be converted to hexadecimal.
   * @returns {Promise<string>} - A promise that resolves to the hexadecimal representation of the input Uint8Array.
   * @see {@link uint8ArrayToHex}
   */
  async toHex(_data : Uint8Array) : Promise<string>{
    // Utilize the provided utility function to convert Uint8Array to hexadecimal
    return uint8ArrayToHex(_data);
  }

  /**
   * Verifies the integrity of a payload using a given signature and public key.
   *
   * @param {string} _signature - The signature to be verified.
   * @param {Object} _payload - The payload object to be verified.
   * @param {string} _publicKey - The public key used for verification.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the signature is valid.
   * @see {@link strToUint8Array}
   * @see {@link Sha256}
   * @see {@link secp256k1}
   */
  async verifyPayload(_signature:string, _payload: Object , _publicKey: string) : Promise<boolean>{
    // Convert signature and public key from string to Uint8Array
    const signatureByteArray = strToUint8Array(_signature);
    const publicKeyByteArray = strToUint8Array(_publicKey);

    // Hash the JSON representation of the payload using SHA-256
    const hash = new Sha256();
    hash.update(JSON.stringify(_payload));
    const payloadByteArray = await hash.digest();

    // Use the secp256k1 library to verify the signature
    return secp256k1.ecdsaVerify(signatureByteArray,payloadByteArray,publicKeyByteArray);
  }
}

export default L1XWalletService;
