/**
 * Basic NanoID generation
 *
 * NanoID is a compact, URL-friendly unique ID generator.
 * Default: 21 characters with URL-safe alphabet
 */

import { uid } from '@oxog/uid';

// Generate a NanoID with default size (21)
const id = uid.nanoid();
console.log('NanoID:', id);
// Output: V1StGXR8_Z5jdHi6B-myT

// Generate with custom size
const shortId = uid.nanoid(10);
console.log('Short NanoID:', shortId);
// Output: IRFa-VaY2b

// Generate with URL-safe alphabet (same as default)
const urlSafeId = uid.nanoid.urlSafe(12);
console.log('URL-safe NanoID:', urlSafeId);
// Output: Uakgb_J5m9g-

// Generate with custom alphabet
const customId = uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});
console.log('Custom NanoID:', customId);
// Output: a3f8b2c1e9d4f7a0
