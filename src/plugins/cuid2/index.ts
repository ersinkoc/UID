/**
 * CUID2 plugin for generating collision-resistant IDs.
 * @module plugins/cuid2
 */

import type { UidPlugin, UidKernel, Cuid2Options } from '../../types.js';
import { validateSize } from '../../utils.js';

/**
 * Letters for the first character.
 * Ensures IDs start with a letter.
 */
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Default alphabet (base36).
 */
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Default length for CUID2.
 */
const DEFAULT_LENGTH = 24;

/**
 * Minimum length for CUID2.
 */
const MIN_LENGTH = 24;

/**
 * Maximum length for CUID2.
 */
const MAX_LENGTH = 32;

/**
 * Create a machine fingerprint.
 * Different for each machine/process for additional uniqueness.
 *
 * @returns Fingerprint string (4 characters)
 */
function createFingerprint(): string {
  // Browser: use random
  if (typeof window !== 'undefined') {
    const random = new Uint8Array(2);
    globalThis.crypto.getRandomValues(random);
    return Array.from(random)
      .map(b => ALPHABET[b % 36])
      .join('');
  }

  // Node.js: use process info
  if (typeof process !== 'undefined') {
    const pid = process.pid ? (process.pid % 1000).toString(36) : '0';
    const hostname = (process.env.HOSTNAME || process.env.COMPUTERNAME || 'node').slice(
      0,
      3
    );
    return hostname + pid;
  }

  // Fallback: random
  return Math.random().toString(36).slice(2, 6);
}

/**
 * Generate a CUID2.
 *
 * @param kernel - Kernel instance
 * @param length - ID length (default: 24)
 * @param fingerprint - Machine fingerprint
 * @returns CUID2 string
 *
 * @example
 * ```ts
 * generateCuid2(kernel, 24, 'abc1'); // 'clh3am5yk0000qj1f8b9g2n7p'
 * ```
 */
function generateCuid2(
  kernel: UidKernel,
  length = DEFAULT_LENGTH,
  fingerprint = createFingerprint()
): string {
  validateSize(length, MIN_LENGTH, MAX_LENGTH);

  // First letter (ensures ID starts with letter)
  const firstLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  // Timestamp (base36, ~8 chars for current timestamps)
  const timestamp = Date.now().toString(36);

  // Random part
  const randomLength = Math.max(8, length - firstLetter.length - timestamp.length - fingerprint.length);
  const randomBytes = kernel.random(Math.ceil(randomLength * 0.75));
  let randomStr = '';
  for (const byte of randomBytes) {
    randomStr += ALPHABET[byte % 36];
    if (randomStr.length >= randomLength) break;
  }

  // Combine and trim to length
  const id = firstLetter + timestamp + randomStr + fingerprint;
  return id.slice(0, length);
}

/**
 * Validate a CUID2 string.
 *
 * @param id - String to validate
 * @returns True if valid CUID2
 */
function isValidCuid2(id: string): boolean {
  if (id.length < MIN_LENGTH || id.length > MAX_LENGTH) {
    return false;
  }

  // Must start with a letter
  if (!/^[a-z]/.test(id)) {
    return false;
  }

  // Must only contain base36 characters
  return /^[a-z0-9]+$/i.test(id);
}

/**
 * CUID2 API interface.
 */
export interface Cuid2Api {
  /**
   * Generate a CUID2 with default length (24).
   *
   * @returns CUID2 string
   *
   * @example
   * ```ts
   * uid.cuid2(); // 'clh3am5yk0000qj1f8b9g2n7p'
   * ```
   */
  (): string;

  /**
   * Generate a CUID2 with options.
   *
   * @param options - Generation options
   * @returns CUID2 string
   *
   * @example
   * ```ts
   * uid.cuid2({ length: 32, fingerprint: 'my-host' });
   * ```
   */
  (options?: Cuid2Options): string;

  /**
   * Validate a CUID2 string.
   *
   * @param id - CUID2 string to validate
   * @returns True if valid CUID2
   *
   * @example
   * ```ts
   * uid.cuid2.isValid('clh3am5yk0000qj1f8b9g2n7p'); // true
   * ```
   */
  isValid: (id: string) => boolean;
}

/**
 * Create the CUID2 plugin.
 *
 * @example
 * ```ts
 * import { cuid2Plugin } from '@oxog/uid/plugins';
 *
 * kernel.use(cuid2Plugin);
 * ```
 */
export const cuid2Plugin: UidPlugin = {
  name: 'cuid2',
  version: '1.0.0',

  install(kernel) {
    let fingerprint = createFingerprint();

    const api = ((opts?: Cuid2Options) => {
      const length = opts?.length ?? DEFAULT_LENGTH;
      const fp = opts?.fingerprint ?? fingerprint;
      return generateCuid2(kernel, length, fp);
    }) as Cuid2Api;

    api.isValid = isValidCuid2;

    // Initialize fingerprint
    api.onInit = (context) => {
      const fp = context.config.get('cuid2-fingerprint');
      if (typeof fp === 'string') {
        fingerprint = fp;
      }
    };

    kernel.registerApi('cuid2', api);
  }
};
