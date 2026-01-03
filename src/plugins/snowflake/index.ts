/**
 * Snowflake plugin for generating Twitter-style distributed unique IDs.
 * @module plugins/snowflake
 */

import type { UidPlugin, UidKernel, SnowflakeConfig, SnowflakeParsed } from '../../types.js';
import { UidError } from '../../types.js';

/**
 * Default epoch (2021-01-01 00:00:00 UTC).
 */
const DEFAULT_EPOCH = 1609459200000;

/**
 * Snowflake state.
 */
interface SnowflakeState {
  config: SnowflakeConfig | null;
  sequence: number;
  lastTime: number;
}

/**
 * Global state for snowflake generation.
 */
const state: SnowflakeState = {
  config: null,
  sequence: 0,
  lastTime: 0
};

/**
 * Validate Snowflake configuration.
 *
 * @param config - Configuration to validate
 * @throws {UidError} If configuration is invalid
 */
function validateSnowflakeConfig(config: SnowflakeConfig): void {
  if (!Number.isInteger(config.workerId) || config.workerId < 0 || config.workerId > 31) {
    throw new UidError(
      'INVALID_SIZE',
      'workerId must be an integer between 0 and 31'
    );
  }

  if (
    !Number.isInteger(config.datacenterId) ||
    config.datacenterId < 0 ||
    config.datacenterId > 31
  ) {
    throw new UidError(
      'INVALID_SIZE',
      'datacenterId must be an integer between 0 and 31'
    );
  }
}

/**
 * Generate a Snowflake ID.
 *
 * @param _kernel - Kernel instance (not used, kept for interface)
 * @param config - Snowflake configuration
 * @returns Snowflake ID as string
 *
 * @example
 * ```ts
 * generateSnowflake(kernel, { workerId: 1, datacenterId: 1 });
 * // '1234567890123456789'
 * ```
 */
function generateSnowflake(_kernel: UidKernel, config: SnowflakeConfig): string {
  const epoch = config.epoch ?? DEFAULT_EPOCH;
  const now = Date.now();

  // Check for clock moving backwards
  if (now < state.lastTime) {
    throw new UidError(
      'CLOCK_BACKWARDS',
      `Clock moved backwards. Refusing to generate ID for ${state.lastTime - now}ms`
    );
  }

  // Same millisecond
  if (now === state.lastTime) {
    // Increment sequence
    state.sequence = (state.sequence + 1) & 0xfff;

    // Sequence overflow - wait for next millisecond
    if (state.sequence === 0) {
      while (Date.now() <= now) {
        // Busy wait
      }
    }
  } else {
    // New millisecond - reset sequence
    state.sequence = 0;
  }

  state.lastTime = now;

  // Build snowflake
  const timestamp = BigInt(now - epoch);
  const datacenterId = BigInt(config.datacenterId & 0x1f);
  const workerId = BigInt(config.workerId & 0x1f);
  const sequence = BigInt(state.sequence);

  // Layout: 41 bits timestamp | 5 bits datacenter | 5 bits worker | 12 bits sequence
  const snowflake = (timestamp << 22n) | (datacenterId << 17n) | (workerId << 12n) | sequence;

  return snowflake.toString();
}

/**
 * Parse a Snowflake ID.
 *
 * @param id - Snowflake ID string
 * @param epoch - Epoch used for generation
 * @returns Parsed snowflake data
 *
 * @example
 * ```ts
 * parseSnowflake('1234567890123456789', 1609459200000);
 * // { timestamp: Date, workerId: 1, datacenterId: 1, sequence: 0 }
 * ```
 */
function parseSnowflake(id: string, epoch = DEFAULT_EPOCH): SnowflakeParsed {
  const snowflake = BigInt(id);

  const timestamp = Number((snowflake >> 22n) & 0x1ffffffffffn);
  const datacenterId = Number((snowflake >> 17n) & 0x1fn);
  const workerId = Number((snowflake >> 12n) & 0x1fn);
  const sequence = Number(snowflake & 0xfffn);

  return {
    timestamp: new Date(timestamp + epoch),
    datacenterId,
    workerId,
    sequence
  };
}

/**
 * Validate a Snowflake ID string.
 *
 * @param id - String to validate
 * @returns True if valid snowflake
 */
function isValidSnowflake(id: string): boolean {
  // Must be a numeric string, fits in 64 bits
  return /^\d{1,20}$/.test(id);
}

/**
 * Snowflake API interface.
 */
export interface SnowflakeApi {
  /**
   * Generate a Snowflake ID.
   * Must call configure() first.
   *
   * @returns Snowflake ID string
   *
   * @example
   * ```ts
   * uid.snowflake.configure({ workerId: 1, datacenterId: 1 });
   * uid.snowflake(); // '1234567890123456789'
   * ```
   */
  (): string;

  /**
   * Configure Snowflake generation.
   * Must be called before generating IDs.
   *
   * @param config - Snowflake configuration
   *
   * @example
   * ```ts
   * uid.snowflake.configure({
   *   workerId: 1,
   *   datacenterId: 1,
   *   epoch: 1609459200000
   * });
   * ```
   */
  configure: (config: SnowflakeConfig) => void;

  /**
   * Generate a Snowflake ID as BigInt.
   * Must call configure() first.
   *
   * @returns Snowflake ID as BigInt
   *
   * @example
   * ```ts
   * uid.snowflake.bigint(); // 1234567890123456789n
   * ```
   */
  bigint: () => bigint;

  /**
   * Parse a Snowflake ID.
   *
   * @param id - Snowflake ID string
   * @returns Parsed snowflake data
   *
   * @example
   * ```ts
   * uid.snowflake.parse('1234567890123456789');
   * // { timestamp: Date, workerId: 1, datacenterId: 1, sequence: 0 }
   * ```
   */
  parse: (id: string) => SnowflakeParsed;

  /**
   * Validate a Snowflake ID string.
   *
   * @param id - Snowflake ID string to validate
   * @returns True if valid Snowflake
   *
   * @example
   * ```ts
   * uid.snowflake.isValid('1234567890123456789'); // true
   * ```
   */
  isValid: (id: string) => boolean;
}

/**
 * Create the Snowflake plugin.
 *
 * @example
 * ```ts
 * import { snowflakePlugin } from '@oxog/uid/plugins';
 *
 * kernel.use(snowflakePlugin);
 * ```
 */
export const snowflakePlugin: UidPlugin = {
  name: 'snowflake',
  version: '1.0.0',

  install(kernel) {
    // Reset state for new kernel instance
    state.config = null;
    state.sequence = 0;
    state.lastTime = 0;

    const api = (() => {
      if (!state.config) {
        throw new UidError(
          'NOT_CONFIGURED',
          'Snowflake not configured. Call configure() first.'
        );
      }
      return generateSnowflake(kernel, state.config);
    }) as SnowflakeApi;

    api.configure = (config: SnowflakeConfig) => {
      validateSnowflakeConfig(config);
      state.config = config;
    };

    api.bigint = () => {
      if (!state.config) {
        throw new UidError(
          'NOT_CONFIGURED',
          'Snowflake not configured. Call configure() first.'
        );
      }
      return BigInt(generateSnowflake(kernel, state.config));
    };

    api.parse = (id: string) => {
      return parseSnowflake(id, state.config?.epoch ?? DEFAULT_EPOCH);
    };

    api.isValid = isValidSnowflake;

    kernel.registerApi('snowflake', api);
  }
};
