/**
 * Hexadecimal IDs
 *
 * Generate IDs using only hexadecimal characters.
 */

import { uid } from '@oxog/uid';

// Create hex ID using NanoID custom alphabet
const hexId = uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 32
});

console.log('Hex ID:', hexId);
// Output: a3f8b2c1e9d4f7a0b5c6d7e8f9a0b1c2

// Shorter hex ID
const shortHexId = uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});

console.log('Short Hex ID:', shortHexId);
// Output: a3f8b2c1e9d4f7a0
