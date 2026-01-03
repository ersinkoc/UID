/**
 * Numeric-only IDs
 *
 * Generate IDs using only digits.
 */

import { uid } from '@oxog/uid';

// Create numeric ID
const numericId = uid.nanoid.custom({
  alphabet: '0123456789',
  size: 12
});

console.log('Numeric ID:', numericId);
// Output: 123456789012

// Note: Numeric IDs have less entropy per character
// Use longer lengths for better uniqueness
