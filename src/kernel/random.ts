/**
 * Cross-platform random byte generation.
 * @module kernel/random
 */

import { UidError } from '../types.js';

/**
 * Detect the available cryptographically secure random source.
 *
 * @returns A random byte generator function
 * @throws {UidError} If no crypto source is available
 *
 * @example
 * ```ts
 * const random = createRandomSource();
 * const bytes = random(16); // 16 cryptographically secure random bytes
 * ```
 */
export function createRandomSource(): (size: number) => Uint8Array {
  // Browser or Node.js 19+
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return (size: number) => {
      const bytes = new Uint8Array(size);
      globalThis.crypto!.getRandomValues(bytes);
      return bytes;
    };
  }

  // Node.js <19 - require crypto module
  if (typeof process?.versions?.node === 'string') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { randomBytes } = require('crypto');
      return (size: number) => new Uint8Array(randomBytes(size));
    } catch {
      // crypto module not available
    }
  }

  throw new UidError(
    'NO_CRYPTO',
    'No cryptographically secure random source available. This environment is not supported.'
  );
}

/**
 * The default random source instance.
 * Created at module initialization.
 */
export const defaultRandomSource = createRandomSource();

/**
 * Generate cryptographically secure random bytes.
 *
 * This is a convenience function that uses the default random source.
 *
 * @param size - Number of bytes to generate
 * @returns Random bytes
 *
 * @example
 * ```ts
 * import { randomBytes } from '@oxog/uid/kernel';
 *
 * const bytes = randomBytes(16);
 * ```
 */
export function randomBytes(size: number): Uint8Array {
  return defaultRandomSource(size);
}
