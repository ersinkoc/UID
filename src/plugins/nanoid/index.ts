/**
 * NanoID plugin for generating URL-friendly unique IDs.
 * @module plugins/nanoid
 */

import type { UidPlugin, UidKernel, NanoidOptions } from '../../types.js';
import { validateAlphabet, validateSize } from '../../utils.js';

/**
 * Default URL-safe alphabet.
 * 64 characters: A-Z, a-z, 0-9, -, _
 */
const DEFAULT_ALPHABET =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjwW';

/**
 * Default size for NanoID.
 * 21 chars = ~126 bits of entropy
 */
const DEFAULT_SIZE = 21;

/**
 * Generate a NanoID.
 *
 * @param kernel - Kernel instance
 * @param size - ID length
 * @param alphabet - Custom alphabet
 * @returns NanoID string
 *
 * @example
 * ```ts
 * generateNanoid(kernel, 21); // 'V1StGXR8_Z5jdHi6B-myT'
 * generateNanoid(kernel, 10, 'abc123'); // 'a1b2c3a1b2'
 * ```
 */
function generateNanoid(
  kernel: UidKernel,
  size: number,
  alphabet = DEFAULT_ALPHABET
): string {
  validateAlphabet(alphabet);
  validateSize(size, 1, 256);

  const alphabetSize = alphabet.length;
  const mask = (2 << (31 - Math.clz32(alphabetSize - 1))) - 1;
  const step = Math.ceil((256 * size) / alphabetSize);

  const bytes = kernel.random(step);
  let id = '';

  let bytesRead = 0;
  while (id.length < size) {
    const byte = bytes[bytesRead++];

    // Skip bytes that are too large for uniform distribution
    if (byte < 256 - (256 % alphabetSize)) {
      id += alphabet[byte % alphabetSize];
    }

    // Refill bytes if needed
    if (bytesRead >= bytes.length && id.length < size) {
      const moreBytes = kernel.random(step);
      bytes.set(moreBytes);
      bytesRead = 0;
    }
  }

  return id;
}

/**
 * Validate a NanoID string.
 * Since alphabet can be custom, we only check length and characters.
 *
 * @param id - String to validate
 * @param alphabet - Alphabet used (default: URL-safe)
 * @returns True if valid format
 */
function isValidNanoid(id: string, alphabet = DEFAULT_ALPHABET): boolean {
  if (id.length === 0) {
    return false;
  }

  const pattern = new RegExp(`^[${escapeRegex(alphabet)}]+$`);
  return pattern.test(id);
}

/**
 * Escape special regex characters in alphabet.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * NanoID API interface.
 */
export interface NanoidApi {
  /**
   * Generate a NanoID with default size (21).
   *
   * @returns NanoID string
   *
   * @example
   * ```ts
   * uid.nanoid(); // 'V1StGXR8_Z5jdHi6B-myT'
   * ```
   */
  (): string;

  /**
   * Generate a NanoID with custom size.
   *
   * @param size - ID length (default: 21)
   * @returns NanoID string
   *
   * @example
   * ```ts
   * uid.nanoid(10); // 'IRFa-VaY2b'
   * ```
   */
  (size: number): string;

  /**
   * Generate a NanoID with custom alphabet and size.
   *
   * @param options - Generation options
   * @returns NanoID string
   *
   * @example
   * ```ts
   * uid.nanoid.custom({ alphabet: 'abc123', size: 10 });
   * ```
   */
  custom: (options: NanoidOptions) => string;

  /**
   * Generate a URL-safe NanoID.
   * Same as default, but explicit intent.
   *
   * @param size - ID length (default: 21)
   * @returns URL-safe NanoID string
   *
   * @example
   * ```ts
   * uid.nanoid.urlSafe(12); // 'Uakgb_J5m9g-'
   * ```
   */
  urlSafe: (size?: number) => string;
}

/**
 * Create the NanoID plugin.
 *
 * @example
 * ```ts
 * import { nanoidPlugin } from '@oxog/uid/plugins';
 *
 * kernel.use(nanoidPlugin);
 * ```
 */
export const nanoidPlugin: UidPlugin = {
  name: 'nanoid',
  version: '1.0.0',

  install(kernel) {
    const api = ((size?: number) =>
      generateNanoid(kernel, size ?? DEFAULT_SIZE)) as NanoidApi;

    api.custom = (opts: NanoidOptions) => {
      const size = opts.size ?? DEFAULT_SIZE;
      const alphabet = opts.alphabet ?? DEFAULT_ALPHABET;
      return generateNanoid(kernel, size, alphabet);
    };

    api.urlSafe = (size = DEFAULT_SIZE) => generateNanoid(kernel, size);

    kernel.registerApi('nanoid', api);
  }
};
