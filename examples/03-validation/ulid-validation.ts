/**
 * ULID validation
 *
 * Validate ULIDs and extract timestamps.
 */

import { uid } from '@oxog/uid';

const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
const invalidUlid = 'not-a-ulid';

// Validate ULIDs
console.log('Valid ULID check:', uid.ulid.isValid(validUlid));
// Output: true

console.log('Invalid ULID check:', uid.ulid.isValid(invalidUlid));
// Output: false

// Extract timestamp from ULID
const ulid = uid.ulid();
const timestamp = uid.ulid.timestamp(ulid);
console.log('ULID:', ulid);
console.log('Timestamp:', timestamp);
// Output: Date object
