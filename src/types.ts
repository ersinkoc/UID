/**
 * Shared types for the @oxog/uid package.
 * @module types
 */

/**
 * UID kernel configuration options.
 *
 * @example
 * ```ts
 * const uid = createUid({
 *   plugins: ['uuid', 'ulid'],
 *   random: (size) => new Uint8Array(size),
 *   debug: true
 * });
 * ```
 */
export interface UidOptions {
  /** Plugins to load on initialization (default: all core plugins) */
  plugins?: string[];
  /** Custom random byte generator (default: auto-detected crypto) */
  random?: (size: number) => Uint8Array;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Shared context between plugins.
 * Used for storing configuration and event hooks.
 */
export interface UidContext {
  /** Configuration storage for plugins */
  config: Map<string, unknown>;
  /** Event hooks for lifecycle management */
  hooks: Map<string, Set<Function>>;
}

/**
 * Plugin interface for extending UID functionality.
 *
 * @example
 * ```ts
 * const myPlugin: UidPlugin = {
 *   name: 'my-algo',
 *   version: '1.0.0',
 *   install(kernel) {
 *     kernel.registerApi('myAlgo', () => kernel.random(16));
 *   }
 * };
 *
 * uid.use(myPlugin);
 * ```
 *
 * @typeParam TContext - Shared context type between plugins
 */
export interface UidPlugin<TContext = UidContext> {
  /** Unique plugin identifier (kebab-case) */
  name: string;
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  /** Other plugins this plugin depends on */
  dependencies?: string[];
  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: UidKernel<TContext>) => void;
  /**
   * Called after all plugins are installed.
   * @param context - Shared context object
   */
  onInit?: (context: TContext) => void | Promise<void>;
  /**
   * Called when plugin is unregistered.
   */
  onDestroy?: () => void | Promise<void>;
  /**
   * Called on error in this plugin.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * Kernel interface for plugin interaction.
 *
 * @typeParam TContext - Shared context type between plugins
 */
export interface UidKernel<TContext = UidContext> {
  /** Register a plugin */
  use(plugin: UidPlugin<TContext>): this;
  /** Unregister a plugin by name */
  unregister(name: string): boolean;
  /** List all registered plugin names */
  list(): string[];
  /** Check if a plugin is registered */
  has(name: string): boolean;
  /** Generate random bytes */
  random(size: number): Uint8Array;
  /** Register an API for a plugin */
  registerApi(name: string, api: unknown): void;
  /** Get a registered API */
  getApi<T>(name: string): T | undefined;
  /** Get the shared context */
  getContext(): TContext;
}

/**
 * Random byte generator function.
 *
 * @param size - Number of random bytes to generate
 * @returns Uint8Array of random bytes
 */
export type RandomSource = (size: number) => Uint8Array;

/**
 * UUID generation options.
 */
export interface UuidOptions {
  /** Specific timestamp for v7 (default: Date.now()) */
  timestamp?: number;
}

/**
 * Parsed UUID result.
 */
export interface UuidParsed {
  /** UUID version (4 or 7) */
  version: number;
  /** UUID variant */
  variant: 'RFC4122' | 'NCS' | 'Microsoft' | 'Future';
  /** Raw UUID bytes */
  bytes: Uint8Array;
  /** Timestamp (only for v7) */
  timestamp?: Date;
}

/**
 * ULID generation options.
 */
export interface UlidOptions {
  /** Use monotonic mode (guaranteed increasing within same ms) */
  monotonic?: boolean;
  /** Specific timestamp (default: Date.now()) */
  timestamp?: number;
}

/**
 * NanoID generation options.
 */
export interface NanoidOptions {
  /** ID length (default: 21) */
  size?: number;
  /** Custom alphabet (default: URL-safe) */
  alphabet?: string;
}

/**
 * CUID2 generation options.
 */
export interface Cuid2Options {
  /** ID length (24-32, default: 24) */
  length?: number;
  /** Machine fingerprint for extra uniqueness */
  fingerprint?: string;
}

/**
 * Snowflake configuration.
 */
export interface SnowflakeConfig {
  /** Worker ID (0-31) */
  workerId: number;
  /** Datacenter ID (0-31) */
  datacenterId: number;
  /** Custom epoch timestamp in milliseconds (default: 2021-01-01) */
  epoch?: number;
}

/**
 * Parsed snowflake result.
 */
export interface SnowflakeParsed {
  /** Timestamp from the snowflake */
  timestamp: Date;
  /** Worker ID from the snowflake */
  workerId: number;
  /** Datacenter ID from the snowflake */
  datacenterId: number;
  /** Sequence number from the snowflake */
  sequence: number;
}

/**
 * Custom ID generator options.
 */
export interface CustomOptions {
  /** Character set to use */
  alphabet: string;
  /** ID length */
  size: number;
}

/**
 * Error codes for UID operations.
 */
export type UidErrorCode =
  | 'INVALID_ALPHABET'
  | 'INVALID_SIZE'
  | 'NOT_CONFIGURED'
  | 'CLOCK_BACKWARDS'
  | 'NO_CRYPTO'
  | 'PLUGIN_NOT_FOUND'
  | 'DEPENDENCY_NOT_MET';

/**
 * Custom error class for UID operations.
 */
export class UidError extends Error {
  /** Error code */
  readonly code: UidErrorCode;

  /**
   * Create a new UidError.
   * @param code - Error code
   * @param message - Error message
   */
  constructor(code: UidErrorCode, message: string) {
    super(message);
    this.name = 'UidError';
    this.code = code;
  }
}
