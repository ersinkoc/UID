/**
 * Micro-kernel for plugin-based ID generation.
 * @module kernel/kernel
 */

import type {
  UidKernel,
  UidPlugin,
  UidOptions,
  UidContext,
  RandomSource
} from '../types.js';
import { createRandomSource } from './random.js';

/**
 * The UID micro-kernel class.
 *
 * Manages plugin registration, lifecycle, and provides core utilities
 * like random byte generation.
 *
 * @example
 * ```ts
 * const kernel = new UidKernel();
 * kernel.use(myPlugin);
 * ```
 *
 * @typeParam TContext - Shared context type between plugins
 */
export class Kernel<TContext extends UidContext = UidContext> implements UidKernel<TContext> {
  private readonly plugins: Map<string, UidPlugin<TContext>>;
  private readonly context: TContext;
  private readonly apis: Map<string, unknown>;
  private readonly random: RandomSource;
  private readonly debug: boolean;

  /**
   * Create a new Kernel instance.
   *
   * @param options - Kernel configuration options
   */
  constructor(options?: UidOptions) {
    this.plugins = new Map();
    this.apis = new Map();
    this.context = this.createContext();
    this.random = options?.random ?? createRandomSource();
    this.debug = options?.debug ?? false;
  }

  /**
   * Register a plugin with the kernel.
   *
   * @param plugin - Plugin to register
   * @returns This kernel instance for chaining
   *
   * @example
   * ```ts
   * kernel.use(uuidPlugin);
   * kernel.use(ulidPlugin);
   * ```
   */
  use(plugin: UidPlugin<TContext>): this {
    if (this.plugins.has(plugin.name)) {
      if (this.debug) {
        console.log(`[UID] Plugin "${plugin.name}" already registered, skipping`);
      }
      return this;
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(
            `Plugin "${plugin.name}" depends on "${dep}" which is not registered`
          );
        }
      }
    }

    if (this.debug) {
      console.log(`[UID] Registering plugin "${plugin.name}" v${plugin.version}`);
    }

    this.plugins.set(plugin.name, plugin);

    try {
      plugin.install(this);
    } catch (error) {
      this.plugins.delete(plugin.name);
      plugin.onError?.(error as Error);
      throw error;
    }

    return this;
  }

  /**
   * Unregister a plugin by name.
   *
   * @param name - Plugin name to unregister
   * @returns True if plugin was unregistered, false if not found
   *
   * @example
   * ```ts
   * kernel.unregister('snowflake');
   * ```
   */
  unregister(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return false;
    }

    if (this.debug) {
      console.log(`[UID] Unregistering plugin "${name}"`);
    }

    this.plugins.delete(name);
    this.apis.delete(name);

    plugin.onDestroy?.();

    return true;
  }

  /**
   * List all registered plugin names.
   *
   * @returns Array of plugin names
   *
   * @example
   * ```ts
   * kernel.list(); // ['uuid', 'ulid', 'nanoid']
   * ```
   */
  list(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Check if a plugin is registered.
   *
   * @param name - Plugin name to check
   * @returns True if plugin is registered
   *
   * @example
   * ```ts
   * kernel.has('uuid'); // true
   * kernel.has('snowflake'); // false
   * ```
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Generate cryptographically secure random bytes.
   *
   * @param size - Number of bytes to generate
   * @returns Random bytes
   *
   * @example
   * ```ts
   * const bytes = kernel.random(16);
   * ```
   */
  random(size: number): Uint8Array {
    return this.random(size);
  }

  /**
   * Register an API for a plugin.
   *
   * This is called by plugins during installation.
   *
   * @param name - API name (usually the plugin name)
   * @param api - API object/functions
   *
   * @example
   * ```ts
   * kernel.registerApi('uuid', {
   *   (): string,
   *   v4: () => string,
   *   v7: () => string
   * });
   * ```
   */
  registerApi(name: string, api: unknown): void {
    this.apis.set(name, api);
  }

  /**
   * Get a registered API.
   *
   * @param name - API name
   * @returns API object or undefined if not found
   *
   * @example
   * ```ts
   * const uuidApi = kernel.getApi<UuidApi>('uuid');
   * ```
   */
  getApi<T>(name: string): T | undefined {
    return this.apis.get(name) as T | undefined;
  }

  /**
   * Get the shared context object.
   *
   * @returns Shared context
   *
   * @example
   * ```ts
   * const context = kernel.getContext();
   * context.config.set('my-key', 'my-value');
   * ```
   */
  getContext(): TContext {
    return this.context;
  }

  /**
   * Initialize all plugins (call their onInit hooks).
   *
   * @returns Promise that resolves when all plugins are initialized
   *
   * @example
   * ```ts
   * await kernel.init();
   * ```
   */
  async init(): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (plugin.onInit) {
        if (this.debug) {
          console.log(`[UID] Initializing plugin "${name}"`);
        }
        await plugin.onInit(this.context);
      }
    }
  }

  /**
   * Destroy all plugins (call their onDestroy hooks).
   *
   * @returns Promise that resolves when all plugins are destroyed
   *
   * @example
   * ```ts
   * await kernel.destroy();
   * ```
   */
  async destroy(): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (this.debug) {
        console.log(`[UID] Destroying plugin "${name}"`);
      }
      await plugin.onDestroy?.();
    }
    this.plugins.clear();
    this.apis.clear();
  }

  /**
   * Create the initial context object.
   *
   * @returns New context instance
   */
  private createContext(): TContext {
    return {
      config: new Map(),
      hooks: new Map()
    } as TContext;
  }
}
