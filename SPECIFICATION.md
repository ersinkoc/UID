# @oxog/uid - Package Specification

## 1. Overview

**@oxog/uid** is a zero-dependency unique identifier generation library for Node.js and browsers. It implements multiple ID generation algorithms through a micro-kernel plugin architecture.

### 1.1 Identity

| Property | Value |
|----------|-------|
| Package Name | `@oxog/uid` |
| Version | 1.0.0 |
| License | MIT |
| Author | Ersin Koç |
| Repository | https://github.com/ersinkoc/uid |
| Documentation | https://uid.oxog.dev |

### 1.2 Design Principles

1. **Zero Runtime Dependencies** - All algorithms implemented from scratch
2. **Micro-Kernel Architecture** - Plugin-based extensibility
3. **Type Safety** - Full TypeScript with strict mode
4. **Cross-Platform** - Works in Node.js >=18 and modern browsers
5. **LLM-Native** - Optimized for both humans and AI assistants
6. **100% Test Coverage** - Every line tested

## 2. Architecture

### 2.1 Micro-Kernel Design

```
┌─────────────────────────────────────────────┐
│                 User API                    │
│  uid.uuid() · uid.ulid() · uid.nanoid()    │
├─────────────────────────────────────────────┤
│           Plugin Registry API                │
│  use() · unregister() · list() · create()  │
├──────────┬──────────┬──────────┬────────────┤
│   UUID   │   ULID   │ Nanoid   │  Custom    │
│  Plugin  │  Plugin  │  Plugin  │  Plugin    │
├──────────┴──────────┴──────────┴────────────┤
│              Micro Kernel                    │
│   Random · Encoding · Validation · Core    │
└─────────────────────────────────────────────┘
```

### 2.2 Core Responsibilities

The micro-kernel provides:

- **Random Byte Generation** - Cross-platform crypto-random source
- **Base Encoding** - hex, base32, base64, custom alphabets
- **Validation Framework** - Common validation utilities
- **Plugin Registry** - Registration and lifecycle management

### 2.3 Plugin System

Each algorithm is implemented as a plugin with:

```typescript
interface UidPlugin<TContext = UidContext> {
  name: string;           // Unique identifier (kebab-case)
  version: string;        // Semantic version
  dependencies?: string[]; // Required plugins
  install: (kernel: UidKernel<TContext>) => void;
  onInit?: (context: TContext) => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
  onError?: (error: Error) => void;
}
```

## 3. Algorithms

### 3.1 UUID v4 (Random)

**Specification:** RFC 4122
**Format:** `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
**Bits:** 128 bits (122 random + 6 version/variant)

```typescript
// Example: 550e8400-e29b-41d4-a716-446655440000
uid.uuid();
uid.uuid.v4();
uid.uuid.isValid(id);
uid.uuid.parse(id);
```

### 3.2 UUID v7 (Time-Sortable)

**Specification:** RFC 9562
**Format:** Same as v4 layout
**Bits:** 128 bits (48 timestamp + 74 random + 6 version/variant)

```typescript
// Example: 018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b
uid.uuid.v7();
uid.uuid.v7({ timestamp: Date.now() });
uid.uuid.v7.timestamp(id);
```

### 3.3 ULID

**Specification:** ulid/spec
**Format:** Crockford Base32, 26 characters
**Bits:** 128 bits (48 timestamp + 80 random)

```typescript
// Example: 01ARZ3NDEKTSV4RRFFQ69G5FAV
uid.ulid();
uid.ulid.monotonic();
uid.ulid({ timestamp: Date.now() });
uid.ulid.timestamp(id);
uid.ulid.isValid(id);
```

### 3.4 NanoID

**Specification:** Custom, URL-safe
**Format:** Variable length, default 21 chars
**Alphabet:** `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_`

```typescript
// Example: V1StGXR8_Z5jdHi6B-myT
uid.nanoid();
uid.nanoid(10);
uid.nanoid.custom({ alphabet, size });
uid.nanoid.urlSafe(12);
```

### 3.5 CUID2

**Specification:** Parallel CUID
**Format:** Prefix + random, 24-32 characters
**Encoding:** base36 (lowercase)

```typescript
// Example: clh3am5yk0000qj1f8b9g2n7p
uid.cuid2();
uid.cuid2({ length: 32, fingerprint: 'host-id' });
uid.cuid2.isValid(id);
```

### 3.6 Snowflake

**Specification:** Twitter Snowflake (modified)
**Format:** 64-bit integer as string
**Bits:** 41 timestamp + 5 datacenter + 5 worker + 12 sequence

```typescript
// Example: 1234567890123456789
uid.snowflake.configure({ workerId, datacenterId, epoch });
uid.snowflake();
uid.snowflake.bigint();
uid.snowflake.parse(id);
```

### 3.7 Short IDs

**Specification:** Base58/Base62 encoding
**Format:** Variable length, default 11 chars

```typescript
// Example: dQw4w9WgXcQ
uid.short();
uid.short(8);
uid.short.youtube(); // Base64 URL-safe
uid.short.base62(10);
uid.short.base58(8);
```

## 4. API Design

### 4.1 Predictable Naming

All APIs follow consistent patterns:

- `{type}()` - Generate ID
- `{type}.isValid()` - Validate ID
- `{type}.parse()` - Parse/extract components
- `{type}.{variant}()` - Specific variant (v4, v7, monotonic)

### 4.2 Core API

```typescript
import { uid, createUid } from '@oxog/uid';

// Default instance
uid.uuid();
uid.ulid();
uid.nanoid();

// Custom instance
const custom = createUid({
  plugins: ['uuid', 'ulid'],
  random: (size) => new Uint8Array(size)
});

// Plugin management
uid.use(plugin);
uid.unregister(name);
uid.list();
```

### 4.3 Type Safety

Full TypeScript support with:

- Strict mode enabled
- All public APIs typed
- JSDoc comments with examples
- `.d.ts` files generated

## 5. Cross-Platform Random

### 5.1 Detection Strategy

```typescript
function getRandomBytes(size: number): Uint8Array {
  // Browser or Node.js 19+
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(size);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  // Node.js <19
  const { randomBytes } = require('crypto');
  return new Uint8Array(randomBytes(size));
}
```

### 5.2 Fallback Safety

- Never uses `Math.random()` (insecure)
- Throws in environments without crypto support
- Clear error message for unsupported environments

## 6. Encoding Support

### 6.1 Built-in Encodings

| Encoding | Characters | Usage |
|----------|------------|-------|
| hex | 0-9a-f | UUID display |
| base32 | A-Z2-7 | ULID (Crockford) |
| base64 | A-Za-z0-9+/ | Short IDs |
| base64url | A-Za-z0-9-_ | URL-safe IDs |
| base58 | A-Za-z0-9 (no 0OIl) | Human-readable |
| base62 | A-Za-z0-9 | Compact IDs |

### 6.2 Custom Alphabets

```typescript
uid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});
```

## 7. Validation Framework

### 7.1 Validation Rules

Each algorithm provides:

- `isValid(id)` - Format validation
- Type checking
- Length validation
- Character set validation

### 7.2 Error Codes

| Code | Meaning |
|------|---------|
| INVALID_ALPHABET | Duplicate chars or < 2 chars |
| INVALID_SIZE | Size out of range |
| NOT_CONFIGURED | Plugin needs configuration |
| CLOCK_BACKWARDS | System clock issue |

## 8. Module Format

### 8.1 Dual Package

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./plugins": {
      "import": { "types": "./dist/plugins/index.d.ts", "default": "./dist/plugins/index.js" },
      "require": { "types": "./dist/plugins/index.d.cts", "default": "./dist/plugins/index.cjs" }
    }
  }
}
```

### 8.2 Build Configuration

- **tsup** for bundling
- ESM + CJS output
- Declaration maps
- Source maps
- Tree-shakeable

## 9. Testing Strategy

### 9.1 Coverage Requirements

```
Lines:      100%
Functions:  100%
Branches:   100%
Statements: 100%
```

### 9.2 Test Categories

1. **Unit Tests** - Each function in isolation
2. **Integration Tests** - Plugin interactions
3. **Cross-Platform Tests** - Node.js and browser behavior
4. **Property-Based Tests** - Random input validation
5. **Collision Tests** - Uniqueness verification

### 9.3 Test Framework

- **vitest** as test runner
- **v8** for coverage
- Coverage enforced in CI

## 10. LLM-Native Features

### 10.1 Discovery

- `llms.txt` in root directory
- Optimized package.json keywords
- Predictable API naming
- Rich JSDoc with examples

### 10.2 Examples

15+ organized examples covering:

- Basic usage for each algorithm
- Plugin system usage
- Validation and parsing
- Custom alphabets
- Distributed systems
- Real-world integrations

## 11. Performance Targets

| Metric | Target |
|--------|--------|
| Core bundle size | < 5KB gzipped |
| Full bundle size | < 10KB gzipped |
| UUID generation | < 1μs |
| ULID generation | < 1μs |
| NanoID generation | < 1μs |
| Snowflake generation | < 1μs |

## 12. Security Considerations

### 12.1 Cryptographic Randomness

- Always use crypto.getRandomValues() or crypto.randomBytes()
- Never use Math.random()
- Clear error when crypto unavailable

### 12.2 Uniqueness Guarantees

- UUID v4: 122 bits of randomness (5.3×10^36 possibilities)
- ULID: 80 bits of randomness
- NanoID: Variable, configurable
- Snowflake: Unique within configured epoch

### 12.3 Collision Resistance

- CUID2 designed for horizontal scaling
- Fingerprint support for additional uniqueness
- Monotonic ULID prevents same-ms collisions

## 13. Browser Support

### 13.1 Target Browsers

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

### 13.2 Feature Detection

```typescript
const hasCrypto = typeof globalThis.crypto?.getRandomValues === 'function';
```

## 14. Node.js Support

### 14.1 Versions

- Minimum: Node.js 18.0.0
- Tested on: 18.x, 20.x, 22.x

### 14.2 Conditional Requires

```typescript
// Only require crypto in Node.js
if (typeof process?.versions?.node === 'string') {
  const { randomBytes } = require('crypto');
}
```

## 15. Documentation Website

### 15.1 Tech Stack

- React 18 + TypeScript
- Vite for build
- Tailwind CSS for styling
- Prism React Renderer for syntax highlighting
- Lucide React for icons

### 15.2 Required Pages

1. Home - Hero, features, install, quick examples
2. Getting Started - Installation, basic usage
3. API Reference - Complete documentation
4. Examples - Organized by category
5. Plugins - Core, optional, custom
6. Playground - Interactive generator

### 15.3 Design Requirements

- IDE-style code blocks with line numbers
- Dark/light mode toggle
- Copy buttons with feedback
- Mobile responsive
- GitHub Pages deployable

## 16. Versioning

### 16.1 Semantic Versioning

- MAJOR: Breaking API changes
- MINOR: New features, backwards compatible
- PATCH: Bug fixes

### 16.2 Changelog

Maintain CHANGELOG.md with:

- Date of release
- Version number
- Added/Changed/Fixed entries

## 17. Release Process

### 17.1 Pre-Release Checklist

- [ ] All tests passing
- [ ] 100% coverage maintained
- [ ] Documentation updated
- [ ] Examples tested
- [ ] Website builds

### 17.2 Release Steps

1. Update version in package.json
2. Generate git tag
3. Build package
4. Run test:coverage
5. npm publish
6. Deploy website

## 18. Contributing

### 18.1 Development Workflow

1. Fork repository
2. Create feature branch
3. Write tests first
4. Implement feature
5. Ensure 100% coverage
6. Submit PR

### 18.2 Code Style

- Prettier for formatting
- ESLint for linting
- TypeScript strict mode
- No runtime dependencies

## 19. License

MIT License - Free for commercial and personal use.

## 20. Support

- GitHub Issues: https://github.com/ersinkoc/uid/issues
- Documentation: https://uid.oxog.dev
