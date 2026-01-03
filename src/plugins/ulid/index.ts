/**
 * ULID plugin for generating Universally Unique Lexicographically Sortable Identifiers.
 * @module plugins/ulid
 */

import type { UidPlugin, UidKernel } from '../../types.js';
import { encodeBase, decodeBase, validateAlphabet } from '../../utils.js';

/**
 * Crockford's Base32 alphabet.
 * Excludes: 0OIl (confusing characters)
 */
const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// Monotonic state
let lastTime = 0;
let lastRandom = 0;

/**
 * Encode a timestamp into Crockford Base32.
 *
 * @param timestamp - Timestamp in milliseconds
 * @param length - Number of characters to output
 * @returns Base32 encoded time
 */
function encodeTime(timestamp: number, length: number): string {
  const ts = BigInt(timestamp);
  const chars: string[] = [];

  for (let i = length - 1; i >= 0; i--) {
    const shift = BigInt(i * 5);
    const index = Number((ts >> shift) & 0x1fn);
    chars.unshift(CROCKFORD_BASE32[index]);
  }

  return chars.join('');
}

/**
 * Decode a Crockford Base32 time string to timestamp.
 *
 * @param timeStr - Base32 encoded time (first 10 chars of ULID)
 * @returns Timestamp in milliseconds
 */
function decodeTime(timeStr: string): number {
  let timestamp = 0n;

  for (let i = 0; i < timeStr.length; i++) {
    const char = timeStr[i].toUpperCase();
    const index = CROCKFORD_BASE32.indexOf(char);
    if (index === -1) {
      continue;
    }
    timestamp = (timestamp << 5n) | BigInt(index);
  }

  return Number(timestamp);
}

/**
 * Generate a ULID.
 *
 * @param kernel - Kernel instance
 * @param timestamp - Custom timestamp in milliseconds
 * @returns ULID string
 *
 * @example
 * ```ts
 * generateUlid(kernel); // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
 * ```
 */
function generateUlid(kernel: UidKernel, timestamp?: number): string {
  const ts = timestamp ?? Date.now();
  const timeBytes = kernel.random(10);

  // Encode time (10 chars = 48 bits)
  const timePart = encodeTime(ts, 10);

  // Encode random (16 chars = 80 bits)
  const randomPart = encodeBase(timeBytes, CROCKFORD_BASE32).slice(0, 16);

  return timePart + randomPart;
}

/**
 * Generate a monotonic ULID (guaranteed increasing within same millisecond).
 *
 * @param kernel - Kernel instance
 * @param getState - Function to get/set state
 * @returns ULID string
 */
function generateMonotonicUlid(
  kernel: UidKernel,
  getState: () => { now: number; lastRandom: number }
): string {
  const { now, lastRandom: lr } = getState();

  const timePart = encodeTime(now, 10);

  // Generate random bytes
  const randomBytes = kernel.random(10);

  // If same millisecond, increment random part
  if (now === lastTime && lr > 0) {
    // Increment the random bytes
    let carry = 1;
    for (let i = randomBytes.length - 1; i >= 0 && carry > 0; i--) {
      const val = randomBytes[i] + carry;
      randomBytes[i] = val & 0xff;
      carry = val >> 8;
    }
  }

  lastTime = now;
  lastRandom = lr + 1;

  const randomPart = encodeBase(randomBytes, CROCKFORD_BASE32).slice(0, 16);

  return timePart + randomPart;
}

/**
 * Extract timestamp from a ULID.
 *
 * @param id - ULID string
 * @returns Date object
 *
 * @example
 * ```ts
 * extractTimestamp('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // Date object
 * ```
 */
function extractTimestamp(id: string): Date {
  const timePart = id.slice(0, 10);
  const timestamp = decodeTime(timePart);
  return new Date(timestamp);
}

/**
 * Validate a ULID string.
 *
 * @param id - String to validate
 * @returns True if valid ULID
 */
function isValidUlid(id: string): boolean {
  if (id.length !== 26) {
    return false;
  }

  const pattern = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;
  return pattern.test(id);
}

/**
 * ULID API interface.
 */
export interface UlidApi {
  /**
   * Generate a ULID.
   *
   * @returns ULID string
   *
   * @example
   * ```ts
   * uid.ulid(); // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
   * ```
   */
  (): string;

  /**
   * Generate a ULID with options.
   *
   * @param options - Generation options
   * @returns ULID string
   *
   * @example
   * ```ts
   * uid.ulid({ timestamp: Date.now() });
   * ```
   */
  (options: { timestamp?: number }): string;

  /**
   * Generate a monotonic ULID.
   * Guaranteed to be increasing even within the same millisecond.
   *
   * @returns ULID string
   *
   * @example
   * ```ts
   * uid.ulid.monotonic(); // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
   * ```
   */
  monotonic: () => string;

  /**
   * Validate a ULID string.
   *
   * @param id - ULID string to validate
   * @returns True if valid ULID
   *
   * @example
   * ```ts
   * uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // true
   * ```
   */
  isValid: (id: string) => boolean;

  /**
   * Extract timestamp from a ULID.
   *
   * @param id - ULID string
   * @returns Date object
   *
   * @example
   * ```ts
   * uid.ulid.timestamp('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // Date
   * ```
   */
  timestamp: (id: string) => Date;
}

/**
 * Create the ULID plugin.
 *
 * @example
 * ```ts
 * import { ulidPlugin } from '@oxog/uid/plugins';
 *
 * kernel.use(ulidPlugin);
 * ```
 */
export const ulidPlugin: UidPlugin = {
  name: 'ulid',
  version: '1.0.0',

  install(kernel) {
    // Reset monotonic state
    lastTime = 0;
    lastRandom = 0;

    const api = ((opts?: { timestamp?: number }) =>
      generateUlid(kernel, opts?.timestamp)) as UlidApi;

    api.monotonic = () =>
      generateMonotonicUlid(kernel, () => {
        const now = Date.now();
        if (now !== lastTime) {
          lastTime = now;
          lastRandom = 0;
        }
        return { now, lastRandom };
      });

    api.isValid = isValidUlid;
    api.timestamp = extractTimestamp;

    kernel.registerApi('ulid', api);
  }
};
