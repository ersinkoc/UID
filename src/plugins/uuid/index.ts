/**
 * UUID plugin for generating RFC 4122 UUID v4 and RFC 9562 UUID v7.
 * @module plugins/uuid
 */

import type { UidPlugin, UidKernel, UuidOptions, UuidParsed } from '../../types.js';
import { toHex, byteToHex } from '../../utils.js';

/**
 * Generate a UUID v4 (random UUID).
 *
 * @param kernel - Kernel instance for random bytes
 * @returns UUID v4 string
 *
 * @example
 * ```ts
 * generateV4(kernel); // '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
function generateV4(kernel: UidKernel): string {
  const bytes = kernel.random(16);

  // Version 4 (random)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Variant RFC4122
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}

/**
 * Generate a UUID v7 (time-sortable UUID).
 *
 * @param kernel - Kernel instance for random bytes
 * @param timestamp - Custom timestamp in milliseconds (default: Date.now())
 * @returns UUID v7 string
 *
 * @example
 * ```ts
 * generateV7(kernel); // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'
 * generateV7(kernel, 1609459200000); // With custom timestamp
 * ```
 */
function generateV7(kernel: UidKernel, timestamp?: number): string {
  const ts = BigInt(timestamp ?? Date.now());
  const random = kernel.random(10);

  const bytes = new Uint8Array(16);

  // Timestamp: 48 bits (big-endian)
  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number((ts >> BigInt(i * 8)) & 0xffn);
  }

  // Version and variant
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // Version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122

  // Random bits
  bytes[6] = (bytes[6] & 0xf0) | (random[0] & 0x0f);
  bytes[7] = random[1];
  bytes[8] = (bytes[8] & 0xc0) | (random[2] & 0x3f);
  bytes.set(random.slice(3), 9);

  return formatUuid(bytes);
}

/**
 * Format a 16-byte array as a UUID string.
 *
 * @param bytes - 16 bytes
 * @returns Formatted UUID string
 */
function formatUuid(bytes: Uint8Array): string {
  const hex = toHex(bytes);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

/**
 * Parse a UUID string into bytes and metadata.
 *
 * @param id - UUID string
 * @returns Parsed UUID or null if invalid
 */
function parseUuid(id: string): UuidParsed | null {
  if (!isValidUuid(id)) {
    return null;
  }

  const hex = id.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  // Get version from bits 4-7 of byte 6
  const version = (bytes[6] >> 4) & 0x0f;

  // Get variant from bits 6-7 of byte 8
  const variantBits = bytes[8] >> 6;
  let variant: UuidParsed['variant'];
  if (variantBits === 0b00) variant = 'NCS';
  else if (variantBits === 0b10) variant = 'Microsoft';
  else if (variantBits === 0b11) variant = 'Future';
  else variant = 'RFC4122';

  const result: UuidParsed = {
    version,
    variant,
    bytes
  };

  // Extract timestamp for v7
  if (version === 7) {
    let timestamp = 0n;
    for (let i = 0; i < 6; i++) {
      timestamp = (timestamp << 8n) | BigInt(bytes[i]);
    }
    result.timestamp = new Date(Number(timestamp));
  }

  return result;
}

/**
 * Extract timestamp from a UUID v7.
 *
 * @param id - UUID v7 string
 * @returns Date object or null if not v7
 */
function extractTimestampV7(id: string): Date | null {
  const parsed = parseUuid(id);
  if (parsed?.version === 7) {
    return parsed.timestamp ?? null;
  }
  return null;
}

/**
 * Validate a UUID string.
 */
function isValidUuid(id: string): boolean {
  const pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return pattern.test(id);
}

/**
 * UUID API interface.
 */
export interface UuidApi {
  /**
   * Generate a UUID v4.
   *
   * @returns UUID v4 string
   *
   * @example
   * ```ts
   * uid.uuid(); // '550e8400-e29b-41d4-a716-446655440000'
   * ```
   */
  (): string;

  /**
   * Generate a UUID v4 (random UUID).
   *
   * @returns UUID v4 string
   *
   * @example
   * ```ts
   * uid.uuid.v4(); // '550e8400-e29b-41d4-a716-446655440000'
   * ```
   */
  v4: () => string;

  /**
   * Generate a UUID v7 (time-sortable UUID).
   *
   * @param options - Generation options
   * @returns UUID v7 string
   *
   * @example
   * ```ts
   * uid.uuid.v7(); // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'
   * uid.uuid.v7({ timestamp: Date.now() });
   * ```
   */
  v7: (options?: UuidOptions) => string;

  /**
   * Validate a UUID string.
   *
   * @param id - UUID string to validate
   * @returns True if valid UUID
   *
   * @example
   * ```ts
   * uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000'); // true
   * uid.uuid.isValid('invalid'); // false
   * ```
   */
  isValid: (id: string) => boolean;

  /**
   * Parse a UUID string.
   *
   * @param id - UUID string to parse
   * @returns Parsed UUID or null if invalid
   *
   * @example
   * ```ts
   * uid.uuid.parse('550e8400-e29b-41d4-a716-446655440000');
   * // { version: 4, variant: 'RFC4122', bytes: Uint8Array }
   * ```
   */
  parse: (id: string) => UuidParsed | null;
}

/**
 * Create the UUID plugin.
 *
 * @example
 * ```ts
 * import { uuidPlugin } from '@oxog/uid/plugins';
 *
 * kernel.use(uuidPlugin);
 * ```
 */
export const uuidPlugin: UidPlugin = {
  name: 'uuid',
  version: '1.0.0',

  install(kernel) {
    const api: UuidApi = (() => generateV4(kernel)) as UuidApi;

    api.v4 = () => generateV4(kernel);
    api.v7 = (opts) => generateV7(kernel, opts?.timestamp);
    api.isValid = isValidUuid;
    api.parse = parseUuid;

    kernel.registerApi('uuid', api);
  }
};
