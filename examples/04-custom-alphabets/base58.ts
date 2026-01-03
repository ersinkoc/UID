/**
 * Base58 encoded IDs
 *
 * Generate IDs using Base58 encoding (no confusing characters).
 */

import { uid } from '@oxog/uid';

// Use the short plugin's base58 method
import { shortPlugin } from '@oxog/uid/plugins';
uid.use(shortPlugin);

const base58Id = uid.short.base58(11);
console.log('Base58 ID:', base58Id);
// Output: xK9Bz2LmQaP

// Base58 excludes: 0, O, I, l (confusing characters)
const hasNoConfusing = !/[0OIl]/.test(base58Id);
console.log('No confusing chars:', hasNoConfusing);
// Output: true
