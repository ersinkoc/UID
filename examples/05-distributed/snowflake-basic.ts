/**
 * Basic Snowflake ID generation
 *
 * Snowflake IDs are time-sortable, 64-bit distributed unique IDs.
 * Used by Twitter, Instagram, Discord, etc.
 */

import { uid } from '@oxog/uid';
import { snowflakePlugin } from '@oxog/uid/plugins';

uid.use(snowflakePlugin);

// Configure Snowflake
uid.snowflake.configure({
  workerId: 1, // 0-31
  datacenterId: 1, // 0-31
  epoch: 1609459200000 // Custom epoch (2021-01-01)
});

// Generate Snowflake ID
const snowflake = uid.snowflake();
console.log('Snowflake ID:', snowflake);
// Output: 1234567890123456789

// Generate as BigInt
const bigSnowflake = uid.snowflake.bigint();
console.log('Snowflake (BigInt):', bigSnowflake);
// Output: 1234567890123456789n

// Parse Snowflake
const parsed = uid.snowflake.parse(snowflake);
console.log('Parsed:', {
  timestamp: parsed.timestamp,
  workerId: parsed.workerId,
  datacenterId: parsed.datacenterId,
  sequence: parsed.sequence
});
