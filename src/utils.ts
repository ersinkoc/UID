/**
 * Shared utility functions for the @oxog/uid package.
 * @module utils
 */

import { UidError } from './types.js';

/**
 * Convert a byte to a hexadecimal string.
 *
 * @param byte - Byte value (0-255)
 * @returns Two-character hexadecimal string
 *
 * @example
 * ```ts
 * byteToHex(255); // 'ff'
 * byteToHex(16);  // '10'
 * ```
 */
export function byteToHex(byte: number): string {
  return byte.toString(16).padStart(2, '0');
}

/**
 * Convert a hexadecimal byte string to a number.
 *
 * @param hex - Two-character hexadecimal string
 * @returns Byte value (0-255)
 *
 * @example
 * ```ts
 * hexToByte('ff'); // 255
 * hexToByte('10'); // 16
 * ```
 */
export function hexToByte(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Convert a number to a byte array.
 *
 * @param num - Number to convert
 * @param bytes - Number of bytes to output
 * @returns Uint8Array representation
 *
 * @example
 * ```ts
 * numberToBytes(255n, 2); // Uint8Array [0, 255]
 * numberToBytes(0x1234n, 2); // Uint8Array [18, 52]
 * ```
 */
export function numberToBytes(num: bigint, bytes: number): Uint8Array {
  const result = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    result[i] = Number((num >> BigInt((bytes - 1 - i) * 8)) & 0xffn);
  }
  return result;
}

/**
 * Convert a byte array to a number.
 *
 * @param bytes - Uint8Array to convert
 * @returns BigInt representation
 *
 * @example
 * ```ts
 * bytesToNumber(new Uint8Array([0, 255])); // 255n
 * bytesToNumber(new Uint8Array([18, 52])); // 4692n
 * ```
 */
export function bytesToNumber(bytes: Uint8Array): bigint {
  let num = 0n;
  for (const byte of bytes) {
    num = (num << 8n) | BigInt(byte);
  }
  return num;
}

/**
 * Validate an alphabet string.
 *
 * @param alphabet - Alphabet to validate
 * @throws {UidError} If alphabet has duplicates or is too short
 *
 * @example
 * ```ts
 * validateAlphabet('abc');  // OK
 * validateAlphabet('aa');   // Throws: duplicate characters
 * validateAlphabet('a');    // Throws: too short
 * ```
 */
export function validateAlphabet(alphabet: string): void {
  if (alphabet.length < 2) {
    throw new UidError('INVALID_ALPHABET', 'Alphabet must have at least 2 characters');
  }

  const unique = new Set(alphabet);
  if (unique.size !== alphabet.length) {
    throw new UidError('INVALID_ALPHABET', 'Alphabet must not contain duplicate characters');
  }
}

/**
 * Validate a size parameter.
 *
 * @param size - Size to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @throws {UidError} If size is out of range
 *
 * @example
 * ```ts
 * validateSize(10, 1, 100);  // OK
 * validateSize(0, 1, 100);   // Throws: too small
 * validateSize(150, 1, 100); // Throws: too large
 * ```
 */
export function validateSize(size: number, min: number, max: number): void {
  if (!Number.isInteger(size) || size < min || size > max) {
    throw new UidError(
      'INVALID_SIZE',
      `Size must be an integer between ${min} and ${max}`
    );
  }
}

/**
 * Create a validator function from a regex pattern.
 *
 * @param pattern - Regular expression pattern
 * @returns Validator function
 *
 * @example
 * ```ts
 * const isHex = createValidator(/^[0-9a-f]+$/);
 * isHex('abc123'); // true
 * isHex('xyz');    // false
 * ```
 */
export function createValidator(pattern: RegExp): (id: string) => boolean {
  return (id: string) => pattern.test(id);
}

/**
 * Convert a byte array to a hexadecimal string.
 *
 * @param bytes - Bytes to convert
 * @returns Hexadecimal string
 *
 * @example
 * ```ts
 * toHex(new Uint8Array([0xde, 0xad, 0xbe, 0xef])); // 'deadbeef'
 * ```
 */
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert a hexadecimal string to a byte array.
 *
 * @param hex - Hexadecimal string
 * @returns Uint8Array
 *
 * @example
 * ```ts
 * fromHex('deadbeef'); // Uint8Array [222, 173, 190, 239]
 * ```
 */
export function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Encode bytes using a custom alphabet.
 *
 * @param bytes - Bytes to encode
 * @param alphabet - Character set to use
 * @returns Encoded string
 *
 * @example
 * ```ts
 * encodeBase(new Uint8Array([0, 1, 2]), 'abc'); // 'aaa'
 * ```
 */
export function encodeBase(bytes: Uint8Array, alphabet: string): string {
  validateAlphabet(alphabet);

  if (bytes.length === 0) {
    return '';
  }

  const result: string[] = [];
  let num = bytesToNumber(bytes);
  const base = BigInt(alphabet.length);

  while (num > 0n) {
    const index = num % base;
    result.unshift(alphabet[Number(index)]);
    num /= base;
  }

  return result.join('');
}

/**
 * Decode a string encoded with a custom alphabet.
 *
 * @param str - String to decode
 * @param alphabet - Character set used for encoding
 * @returns Decoded bytes
 *
 * @example
 * ```ts
 * decodeBase('aaa', 'abc'); // Uint8Array [0, 0, 0]
 * ```
 */
export function decodeBase(str: string, alphabet: string): Uint8Array {
  validateAlphabet(alphabet);

  const charIndex = new Map<string, bigint>();
  for (let i = 0; i < alphabet.length; i++) {
    charIndex.set(alphabet[i], BigInt(i));
  }

  let num = 0n;
  const base = BigInt(alphabet.length);

  for (const char of str) {
    const idx = charIndex.get(char);
    if (idx === undefined) {
      throw new UidError('INVALID_ALPHABET', `Invalid character: ${char}`);
    }
    num = num * base + idx;
  }

  // Convert to bytes
  const bitLength = str.length * Math.ceil(Math.log2(alphabet.length));
  const byteLength = Math.ceil(bitLength / 8);

  if (num === 0n) {
    return new Uint8Array(byteLength);
  }

  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }

  // Pad to expected length
  while (bytes.length < byteLength) {
    bytes.unshift(0);
  }

  return new Uint8Array(bytes);
}
