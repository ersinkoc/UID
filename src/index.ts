/**
 * @oxog/uid - Zero-dependency unique ID generation
 *
 * A comprehensive unique identifier generation library implementing
 * UUID v4/v7, ULID, NanoID, CUID2, Snowflake IDs, and short IDs.
 *
 * @example
 * ```ts
 * import { uid, createUid } from '@oxog/uid';
 *
 * // Default instance (all core plugins loaded)
 * uid.uuid();     // '550e8400-e29b-41d4-a716-446655440000'
 * uid.uuid.v7();  // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'
 * uid.ulid();     // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
 * uid.nanoid();   // 'V1StGXR8_Z5jdHi6B-myT'
 *
 * // Create custom instance
 * const myUid = createUid({
 *   plugins: ['uuid', 'ulid'],
 *   random: (size) => new Uint8Array(size)
 * });
 * ```
 *
 * @module @oxog/uid
 */

import { Kernel } from './kernel/kernel.js';
import type { UidOptions, UidKernel } from './types.js';
import type { UuidApi } from './plugins/uuid/index.js';
import type { UlidApi } from './plugins/ulid/index.js';
import type { NanoidApi } from './plugins/nanoid/index.js';

// Import core plugins
import { uuidPlugin } from './plugins/uuid/index.js';
import { ulidPlugin } from './plugins/ulid/index.js';
import { nanoidPlugin } from './plugins/nanoid/index.js';

/**
 * UID instance with API accessors.
 */
export interface UidInstance extends UidKernel {
  /** UUID generation API */
  uuid: UuidApi;
  /** ULID generation API */
  ulid: UlidApi;
  /** NanoID generation API */
  nanoid: NanoidApi;
}

/**
 * Create a custom UID instance with optional configuration.
 *
 * @param options - Kernel configuration options
 * @returns UID instance with API accessors
 *
 * @example
 * ```ts
 * const myUid = createUid({
 *   plugins: ['uuid', 'ulid'],
 *   random: (size) => {
 *     const bytes = new Uint8Array(size);
 *     crypto.getRandomValues(bytes);
 *     return bytes;
 *   }
 * });
 *
 * myUid.uuid();
 * myUid.ulid();
 * ```
 */
export function createUid(options?: UidOptions): UidInstance {
  const kernel = new Kernel(options);

  // Load core plugins
  kernel.use(uuidPlugin);
  kernel.use(ulidPlugin);
  kernel.use(nanoidPlugin);

  // Create instance with API accessors
  const instance = kernel as unknown as UidInstance;

  // Define API getters
  Object.defineProperty(instance, 'uuid', {
    get: () => kernel.getApi<UuidApi>('uuid'),
    enumerable: true
  });

  Object.defineProperty(instance, 'ulid', {
    get: () => kernel.getApi<UlidApi>('ulid'),
    enumerable: true
  });

  Object.defineProperty(instance, 'nanoid', {
    get: () => kernel.getApi<NanoidApi>('nanoid'),
    enumerable: true
  });

  return instance;
}

/**
 * Default UID instance with all core plugins loaded.
 *
 * Provides access to:
 * - `uuid` - UUID v4/v7 generation
 * - `ulid` - ULID generation
 * - `nanoid` - NanoID generation
 *
 * @example
 * ```ts
 * import { uid } from '@oxog/uid';
 *
 * // UUID v4 (random)
 * uid.uuid(); // '550e8400-e29b-41d4-a716-446655440000'
 * uid.uuid.v4(); // Same as above
 *
 * // UUID v7 (time-sortable)
 * uid.uuid.v7(); // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'
 * uid.uuid.v7({ timestamp: Date.now() });
 *
 * // ULID
 * uid.ulid(); // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
 * uid.ulid.monotonic(); // Guaranteed increasing
 *
 * // NanoID
 * uid.nanoid(); // 'V1StGXR8_Z5jdHi6B-myT'
 * uid.nanoid(10); // 'IRFa-VaY2b'
 * uid.nanoid.custom({ alphabet: 'abc123', size: 8 });
 * ```
 */
export const uid = createUid();

// Re-export types
export type * from './types.js';
