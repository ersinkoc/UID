/**
 * UUID validation and parsing
 *
 * Validate UUIDs and extract information from them.
 */

import { uid } from '@oxog/uid';

const validUuid = '550e8400-e29b-41d4-a716-446655440000';
const invalidUuid = 'not-a-uuid';

// Validate UUIDs
console.log('Valid UUID check:', uid.uuid.isValid(validUuid));
// Output: true

console.log('Invalid UUID check:', uid.uuid.isValid(invalidUuid));
// Output: false

// Parse UUID v4
const v4Id = uid.uuid.v4();
const parsedV4 = uid.uuid.parse(v4Id);
console.log('UUID v4 parsed:', {
  version: parsedV4?.version,
  variant: parsedV4?.variant
});
// Output: { version: 4, variant: 'RFC4122' }

// Parse UUID v7 (includes timestamp)
const v7Id = uid.uuid.v7();
const parsedV7 = uid.uuid.parse(v7Id);
console.log('UUID v7 parsed:', {
  version: parsedV7?.version,
  timestamp: parsedV7?.timestamp
});
// Output: { version: 7, timestamp: Date }
