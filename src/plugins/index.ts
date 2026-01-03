/**
 * Optional plugins for @oxog/uid.
 *
 * These plugins are not loaded by default and must be explicitly
 * registered using `uid.use()`.
 *
 * @example
 * ```ts
 * import { uid } from '@oxog/uid';
 * import { cuid2Plugin, snowflakePlugin, shortPlugin } from '@oxog/uid/plugins';
 *
 * // Register optional plugins
 * uid.use(cuid2Plugin);
 * uid.use(snowflakePlugin);
 * uid.use(shortPlugin);
 *
 * // Use the plugins
 * uid.cuid2();
 * uid.snowflake.configure({ workerId: 1, datacenterId: 1 });
 * uid.snowflake();
 * uid.short();
 * ```
 *
 * @module plugins
 */

export { cuid2Plugin } from './cuid2/index.js';
export type { Cuid2Api } from './cuid2/index.js';

export { snowflakePlugin } from './snowflake/index.js';
export type { SnowflakeApi } from './snowflake/index.js';

export { shortPlugin } from './short/index.js';
export type { ShortApi } from './short/index.js';

export { ulidPlugin } from './ulid/index.js';
export type { UlidApi } from './ulid/index.js';

export { nanoidPlugin } from './nanoid/index.js';
export type { NanoidApi } from './nanoid/index.js';

export { uuidPlugin } from './uuid/index.js';
export type { UuidApi } from './uuid/index.js';
