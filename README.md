# @oxog/uid

> Zero-dependency unique ID generation with multiple algorithms and custom alphabets

A comprehensive unique identifier generation library implementing **UUID v4/v7**, **ULID**, **NanoID**, **CUID2**, **Snowflake IDs**, and **short IDs**. Features cryptographically secure random generation, time-sortable IDs, custom alphabet support, and collision-resistant algorithms. Works in both Node.js and browsers with **zero runtime dependencies**.

## Features

- **Zero Runtime Dependencies** - All algorithms implemented from scratch
- **Multiple Algorithms** - UUID v4/v7, ULID, NanoID, CUID2, Snowflake, Short IDs
- **Cryptographically Secure** - Uses crypto.getRandomValues() or crypto.randomBytes()
- **Type-Safe** - Full TypeScript with strict mode
- **Cross-Platform** - Works in Node.js >=18 and modern browsers
- **Micro-Kernel Architecture** - Plugin-based extensibility
- **Custom Alphabets** - Create ID generators with any character set
- **Time-Sortable IDs** - UUID v7, ULID, Snowflake with timestamp ordering

## Installation

```bash
npm install @oxog/uid
```

## Quick Start

```typescript
import { uid } from '@oxog/uid';

// UUID v4 (random)
uid.uuid();     // '550e8400-e29b-41d4-a716-446655440000'
uid.uuid.v4();  // Same as above

// UUID v7 (time-sortable)
uid.uuid.v7();  // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'

// ULID (sortable, Crockford Base32)
uid.ulid();     // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
uid.ulid.monotonic(); // Guaranteed increasing

// NanoID (URL-safe, customizable)
uid.nanoid();   // 'V1StGXR8_Z5jdHi6B-myT' (21 chars)
uid.nanoid(10); // 'IRFa-VaY2b' (10 chars)
```

## Optional Plugins

```typescript
import { uid } from '@oxog/uid';
import { cuid2Plugin, snowflakePlugin, shortPlugin } from '@oxog/uid/plugins';

// Load optional plugins
uid.use(cuid2Plugin);
uid.use(snowflakePlugin);
uid.use(shortPlugin);

// CUID2 (collision-resistant)
uid.cuid2(); // 'clh3am5yk0000qj1f8b9g2n7p'

// Snowflake (distributed 64-bit IDs)
uid.snowflake.configure({ workerId: 1, datacenterId: 1 });
uid.snowflake(); // '1234567890123456789'

// Short IDs (YouTube-style)
uid.short(); // 'dQw4w9WgXcQ'
```

## API Reference

### UUID

Generate RFC 4122 UUID v4 (random) or RFC 9562 UUID v7 (time-sortable).

```typescript
// Generate UUID v4
uid.uuid();
uid.uuid.v4();

// Generate UUID v7
uid.uuid.v7();
uid.uuid.v7({ timestamp: Date.now() });

// Validate
uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000'); // true

// Parse
const parsed = uid.uuid.parse('550e8400-e29b-41d4-a716-446655440000');
// { version: 4, variant: 'RFC4122', bytes: Uint8Array }
```

### ULID

Generate Universally Unique Lexicographically Sortable Identifier.

```typescript
// Generate ULID
uid.ulid();
uid.ulid({ timestamp: Date.now() });

// Monotonic (guaranteed increasing)
uid.ulid.monotonic();

// Validate
uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // true

// Extract timestamp
const timestamp = uid.ulid.timestamp('01ARZ3NDEKTSV4RRFFQ69G5FAV');
```

### NanoID

Compact, URL-friendly unique ID with customizable alphabet.

```typescript
// Default (21 chars)
uid.nanoid();

// Custom size
uid.nanoid(10);

// Custom alphabet
uid.nanoid.custom({ alphabet: 'abc123', size: 8 });

// URL-safe (explicit)
uid.nanoid.urlSafe(12);
```

### CUID2

Next-generation collision-resistant ID.

```typescript
// Default (24 chars)
uid.cuid2();

// Custom length (24-32)
uid.cuid2({ length: 32 });

// With fingerprint
uid.cuid2({ fingerprint: 'my-machine-id' });

// Validate
uid.cuid2.isValid('clh3am5yk0000qj1f8b9g2n7p'); // true
```

### Snowflake

Twitter-style 64-bit distributed unique IDs.

```typescript
// Configure once
uid.snowflake.configure({
  workerId: 1,        // 0-31
  datacenterId: 1,    // 0-31
  epoch: 1609459200000  // Custom epoch (default: 2021-01-01)
});

// Generate
uid.snowflake();       // '1234567890123456789' (as string)
uid.snowflake.bigint(); // 1234567890123456789n (as BigInt)

// Parse
const parsed = uid.snowflake.parse('1234567890123456789');
// { timestamp: Date, workerId: 1, datacenterId: 1, sequence: 0 }
```

### Short IDs

Human-readable short IDs using Base58 or Base62 encoding.

```typescript
// Default (Base58, 11 chars)
uid.short();

// Custom size
uid.short(8);

// YouTube-style (Base64 URL-safe)
uid.short.youtube();

// Base62 (alphanumeric only)
uid.short.base62(10);

// Base58 (no confusing chars: 0OIl)
uid.short.base58(8);
```

### Custom Alphabets

Create ID generators with any custom alphabet.

```typescript
const customId = uid.nanoid.custom({
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // No confusing chars
  size: 8
});

customId(); // 'K9BZ2LMN'

// Hex IDs
const hexId = uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 32
});

hexId(); // 'a3f8b2c1e9d4f7a0b5c6d7e8f9a0b1c2'
```

## Custom Instance

Create a custom UID instance with specific plugins and configuration.

```typescript
import { createUid } from '@oxog/uid';

const myUid = createUid({
  plugins: ['uuid', 'ulid'],
  random: (size) => {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return bytes;
  }
});

myUid.uuid();
myUid.ulid();
```

## Plugin Management

```typescript
import { uid } from '@oxog/uid';
import { snowflakePlugin } from '@oxog/uid/plugins';

// Register plugin
uid.use(snowflakePlugin);

// List registered plugins
uid.list(); // ['uuid', 'ulid', 'nanoid', 'snowflake']

// Unregister plugin
uid.unregister('snowflake');
```

## License

MIT © Ersin Koç

## Links

- **Documentation**: https://uid.oxog.dev
- **GitHub**: https://github.com/ersinkoc/uid
