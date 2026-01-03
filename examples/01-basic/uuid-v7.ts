/**
 * Basic UUID v7 generation
 *
 * UUID v7 is a time-sortable UUID with millisecond precision.
 * Format: same as v4, but encodes timestamp in first 48 bits
 */

import { uid } from '@oxog/uid';

// Generate a UUID v7
const id = uid.uuid.v7();
console.log('UUID v7:', id);
// Output: 018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b

// Generate with specific timestamp
const customTimestamp = Date.now();
const id2 = uid.uuid.v7({ timestamp: customTimestamp });
console.log('UUID v7 (custom timestamp):', id2);

// Extract timestamp from UUID v7
const timestamp = uid.uuid.parse(id)?.timestamp;
console.log('Timestamp:', timestamp);
// Output: Date object with generation time
