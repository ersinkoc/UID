/**
 * Creating a custom UID instance
 *
 * You can create a custom instance with specific plugins
 * and configuration.
 */

import { createUid } from '@oxog/uid';
import { uuidPlugin, ulidPlugin } from '@oxog/uid/plugins';

// Create instance with specific plugins
const myUid = createUid({
  plugins: ['uuid', 'ulid'], // This would filter which plugins to load
  random: (size) => {
    // Custom random source
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return bytes;
  }
});

// Load plugins manually
myUid.use(uuidPlugin);
myUid.use(ulidPlugin);

// Use the custom instance
const uuid = myUid.uuid();
const ulid = myUid.ulid();

console.log('Custom UUID:', uuid);
console.log('Custom ULID:', ulid);
