/**
 * Short ID plugin for generating human-readable compact IDs.
 * @module plugins/short
 */

import type { UidPlugin, UidKernel } from '../../types.js';
import { encodeBase } from '../../utils.js';

/**
 * Base62 alphabet (alphanumeric only).
 */
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Base58 alphabet (no confusing chars: 0OIl).
 * Used by Bitcoin and other cryptocurrencies.
 */
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Base64 URL-safe alphabet.
 * Used by YouTube for video IDs.
 */
const BASE64_URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Default size for short IDs.
 */
const DEFAULT_SIZE = 11;

/**
 * Generate a short ID.
 *
 * @param kernel - Kernel instance
 * @param size - ID length
 * @param alphabet - Alphabet to use
 * @returns Short ID string
 *
 * @example
 * ```ts
 * generateShort(kernel, 11, BASE58); // 'xK9Bz2LmQaP'
 * ```
 */
function generateShort(kernel: UidKernel, size: number, alphabet: string): string {
  // Calculate bytes needed for the desired size
  const bitsPerChar = Math.log2(alphabet.length);
  const totalBits = size * bitsPerChar;
  const bytesNeeded = Math.ceil(totalBits / 8);

  const bytes = kernel.random(bytesNeeded);
  const encoded = encodeBase(bytes, alphabet);

  // Pad or trim to exact size
  if (encoded.length < size) {
    return encoded.padEnd(size, alphabet[0]);
  }
  return encoded.slice(0, size);
}

/**
 * Validate a short ID string.
 *
 * @param id - String to validate
 * @param alphabet - Alphabet used
 * @returns True if valid
 */
function isValidShort(id: string, alphabet: string): boolean {
  if (id.length === 0) {
    return false;
  }

  const pattern = new RegExp(`^[${escapeRegex(alphabet)}]+$`);
  return pattern.test(id);
}

/**
 * Escape special regex characters.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Short ID API interface.
 */
export interface ShortApi {
  /**
   * Generate a short ID with default settings (Base58, 11 chars).
   *
   * @returns Short ID string
   *
   * @example
   * ```ts
   * uid.short(); // 'dQw4w9WgXcQ'
   * ```
   */
  (): string;

  /**
   * Generate a short ID with custom size.
   *
   * @param size - ID length (default: 11)
   * @returns Short ID string
   *
   * @example
   * ```ts
   * uid.short(8); // 'xK9Bz2Lm'
   * ```
   */
  (size: number): string;

  /**
   * Generate a YouTube-style short ID (Base64 URL-safe, 11 chars).
   *
   * @returns Short ID string
   *
   * @example
   * ```ts
   * uid.short.youtube(); // 'dQw4w9WgXcQ'
   * ```
   */
  youtube: () => string;

  /**
   * Generate a Base62 short ID (alphanumeric only).
   *
   * @param size - ID length (default: 10)
   * @returns Short ID string
   *
   * @example
   * ```ts
   * uid.short.base62(10); // 'a9K2mZ3xLp'
   * ```
   */
  base62: (size?: number) => string;

  /**
   * Generate a Base58 short ID (no confusing chars: 0OIl).
   * This is the default.
   *
   * @param size - ID length (default: 8)
   * @returns Short ID string
   *
   * @example
   * ```ts
   * uid.short.base58(8); // 'xK9Bz2Lm'
   * ```
   */
  base58: (size?: number) => string;
}

/**
 * Create the Short ID plugin.
 *
 * @example
 * ```ts
 * import { shortPlugin } from '@oxog/uid/plugins';
 *
 * kernel.use(shortPlugin);
 * ```
 */
export const shortPlugin: UidPlugin = {
  name: 'short',
  version: '1.0.0',

  install(kernel) {
    const api = ((size?: number) =>
      generateShort(kernel, size ?? DEFAULT_SIZE, BASE58)) as ShortApi;

    api.youtube = () => generateShort(kernel, 11, BASE64_URL);
    api.base62 = (size = 10) => generateShort(kernel, size, BASE62);
    api.base58 = (size = 8) => generateShort(kernel, size, BASE58);

    kernel.registerApi('short', api);
  }
};
