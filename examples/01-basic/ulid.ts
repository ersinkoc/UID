/**
 * Basic ULID generation
 *
 * ULID is a 128-bit, URL-safe, time-sortable identifier.
 * Format: 26 characters, Crockford Base32 encoded
 */

import { uid } from '@oxog/uid';

// Generate a ULID
const id = uid.ulid();
console.log('ULID:', id);
// Output: 01ARZ3NDEKTSV4RRFFQ69G5FAV

// Generate with custom timestamp
const customTimestamp = Date.now();
const id2 = uid.ulid({ timestamp: customTimestamp });
console.log('ULID (custom timestamp):', id2);

// Generate monotonic ULID (guaranteed increasing)
const monotonicId = uid.ulid.monotonic();
console.log('Monotonic ULID:', monotonicId);

// Validate a ULID
const isValid = uid.ulid.isValid(id);
console.log('Is valid:', isValid);
// Output: true

// Extract timestamp
const timestamp = uid.ulid.timestamp(id);
console.log('Timestamp:', timestamp);
// Output: Date object
