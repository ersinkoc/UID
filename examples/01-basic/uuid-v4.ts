/**
 * Basic UUID v4 generation
 *
 * UUID v4 is a random UUID that provides 122 bits of randomness.
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */

import { uid } from '@oxog/uid';

// Generate a UUID v4
const id = uid.uuid();
console.log('UUID v4:', id);
// Output: 550e8400-e29b-41d4-a716-446655440000

// You can also use the v4() method explicitly
const id2 = uid.uuid.v4();
console.log('UUID v4 (explicit):', id2);

// Validate a UUID
const isValid = uid.uuid.isValid(id);
console.log('Is valid:', isValid);
// Output: true

// Parse a UUID to get details
const parsed = uid.uuid.parse(id);
console.log('Parsed:', parsed);
// Output: { version: 4, variant: 'RFC4122', bytes: Uint8Array }
