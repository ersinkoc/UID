/**
 * Using optional plugins
 *
 * Core plugins (uuid, ulid, nanoid) are loaded by default.
 * Optional plugins (cuid2, snowflake, short) must be explicitly loaded.
 */

import { uid } from '@oxog/uid';
import { cuid2Plugin, snowflakePlugin, shortPlugin } from '@oxog/uid/plugins';

// Load optional plugins
uid.use(cuid2Plugin);
uid.use(snowflakePlugin);
uid.use(shortPlugin);

// Use CUID2
const cuid = uid.cuid2();
console.log('CUID2:', cuid);
// Output: clh3am5yk0000qj1f8b9g2n7p

// Use Snowflake (needs configuration)
uid.snowflake.configure({
  workerId: 1,
  datacenterId: 1,
  epoch: 1609459200000 // 2021-01-01
});
const snowflake = uid.snowflake();
console.log('Snowflake:', snowflake);
// Output: 1234567890123456789

// Use Short ID
const shortId = uid.short();
console.log('Short ID:', shortId);
// Output: dQw4w9WgXcQ
