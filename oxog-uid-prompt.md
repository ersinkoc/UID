# UID - Zero-Dependency NPM Package

## Package Identity

| Field | Value |
|-------|-------|
| **NPM Package** | `@oxog/uid` |
| **GitHub Repository** | `https://github.com/ersinkoc/uid` |
| **Documentation Site** | `https://uid.oxog.dev` |
| **License** | MIT |
| **Author** | Ersin Koç (ersinkoc) |

> **NO social media, Discord, email, or external links allowed.**

---

## Package Description

**One-line:** Zero-dependency unique ID generation with multiple algorithms and custom alphabets

A comprehensive unique identifier generation library implementing UUID v4/v7, ULID, NanoID, CUID2, Snowflake IDs, and short IDs. Features cryptographically secure random generation, time-sortable IDs, custom alphabet support, and collision-resistant algorithms. Works in both Node.js and browsers with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are **ABSOLUTE** and must be followed without exception.

### 1. ZERO RUNTIME DEPENDENCIES

```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```

- Implement EVERYTHING from scratch
- No uuid, no nanoid, no cuid - nothing
- Write your own random generators, encoders, validators
- If you think you need a dependency, you don't

**Allowed devDependencies only:**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

### 2. 100% TEST COVERAGE

- Every line of code must be tested
- Every branch must be tested
- Every function must be tested
- **All tests must pass** (100% success rate)
- Use Vitest for testing
- Coverage thresholds enforced in config

### 3. MICRO-KERNEL ARCHITECTURE

All packages MUST use plugin-based architecture:

```
┌─────────────────────────────────────────────┐
│                 User Code                    │
├─────────────────────────────────────────────┤
│           Plugin Registry API                │
│  use() · register() · unregister() · list() │
├──────────┬──────────┬──────────┬────────────┤
│   UUID   │   ULID   │ Snowflake│  Custom    │
│  Plugin  │  Plugin  │  Plugin  │  Plugin    │
├──────────┴──────────┴──────────┴────────────┤
│              Micro Kernel                    │
│   Random Source · Encoding · Validation     │
└─────────────────────────────────────────────┘
```

**Kernel responsibilities (minimal):**
- Plugin registration and lifecycle
- Cryptographic random byte generation (cross-platform)
- Base encoding utilities (hex, base32, base64, custom)
- ID validation framework

### 4. DEVELOPMENT WORKFLOW

Create these documents **FIRST**, before any code:

1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions  
3. **TASKS.md** - Ordered task list with dependencies

Only after all three documents are complete, implement code following TASKS.md sequentially.

### 5. TYPESCRIPT STRICT MODE

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### 6. LLM-NATIVE DESIGN

Package must be designed for both humans AND AI assistants:

- **llms.txt** file in root (< 2000 tokens)
- **Predictable API** naming (`uuid`, `ulid`, `nanoid`, `snowflake`, `short`)
- **Rich JSDoc** with @example on every public API
- **15+ examples** organized by category
- **README** optimized for LLM consumption

### 7. NO EXTERNAL LINKS

- ✅ GitHub repository URL
- ✅ Custom domain (uid.oxog.dev)
- ✅ npm package URL
- ❌ Social media (Twitter, LinkedIn, etc.)
- ❌ Discord/Slack links
- ❌ Email addresses
- ❌ Donation/sponsor links

---

## CORE FEATURES

### 1. UUID v4 (Random)

RFC 4122 compliant random UUID generation using cryptographically secure random bytes.

**API Example:**
```typescript
import { uid } from '@oxog/uid';

uid.uuid();     // '550e8400-e29b-41d4-a716-446655440000'
uid.uuid.v4();  // Same as above

// Validate
uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000'); // true

// Parse
uid.uuid.parse('550e8400-e29b-41d4-a716-446655440000'); 
// { version: 4, variant: 'RFC4122', bytes: Uint8Array }
```

### 2. UUID v7 (Time-Sortable)

RFC 9562 compliant time-based UUID with millisecond precision and random component.

**API Example:**
```typescript
uid.uuid.v7();  // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'

// Extract timestamp
uid.uuid.v7.timestamp('018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b');
// Date object

// Generate with specific timestamp
uid.uuid.v7({ timestamp: Date.now() });
```

### 3. ULID (Sortable, Crockford Base32)

Universally Unique Lexicographically Sortable Identifier. 128-bit, time-based, Crockford Base32 encoded.

**API Example:**
```typescript
uid.ulid();     // '01ARZ3NDEKTSV4RRFFQ69G5FAV'

// Monotonic (guaranteed increasing within same ms)
uid.ulid.monotonic();

// Extract timestamp
uid.ulid.timestamp('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // Date

// Validate
uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // true
```

### 4. NanoID (URL-Safe)

Compact, URL-friendly unique ID with customizable alphabet and length.

**API Example:**
```typescript
uid.nanoid();           // 'V1StGXR8_Z5jdHi6B-myT' (21 chars default)
uid.nanoid(10);         // 'IRFa-VaY2b' (10 chars)

// Custom alphabet
uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});  // 'a3f8b2c1e9d4f7a0'

// URL-safe (default alphabet)
uid.nanoid.urlSafe(12);  // 'Uakgb_J5m9g-'
```

### 5. CUID2 (Secure, Collision-Resistant)

Next-generation collision-resistant ID optimized for horizontal scaling.

**API Example:**
```typescript
uid.cuid2();    // 'clh3am5yk0000qj1f8b9g2n7p'

// Custom length (24-32 chars)
uid.cuid2({ length: 32 });

// With fingerprint for extra uniqueness
uid.cuid2({ fingerprint: 'my-machine-id' });

// Validate
uid.cuid2.isValid('clh3am5yk0000qj1f8b9g2n7p'); // true
```

### 6. Snowflake IDs

Twitter-style 64-bit distributed unique IDs. Time-sortable, includes worker/datacenter ID.

**API Example:**
```typescript
// Configure once
uid.snowflake.configure({
  workerId: 1,        // 0-31
  datacenterId: 1,    // 0-31
  epoch: 1609459200000  // Custom epoch (default: 2021-01-01)
});

uid.snowflake();      // '1234567890123456789' (as string)
uid.snowflake.bigint(); // 1234567890123456789n (as BigInt)

// Parse snowflake
uid.snowflake.parse('1234567890123456789');
// { timestamp: Date, workerId: 1, datacenterId: 1, sequence: 0 }
```

### 7. Short IDs (YouTube-Style)

Human-readable short IDs using Base58 or Base62 encoding.

**API Example:**
```typescript
uid.short();           // 'dQw4w9WgXcQ' (11 chars, Base58)
uid.short(8);          // 'xK9Bz2Lm' (8 chars)

// YouTube-style (Base64 URL-safe)
uid.short.youtube();   // 'dQw4w9WgXcQ'

// Base62 (alphanumeric only)
uid.short.base62(10);  // 'a9K2mZ3xLp'

// Base58 (no confusing chars: 0OIl)
uid.short.base58(8);   // 'xK9Bz2Lm'
```

### 8. Custom Alphabets

Create ID generators with any custom alphabet.

**API Example:**
```typescript
// Create custom generator
const customId = uid.custom({
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // No confusing chars
  size: 8
});

customId();  // 'K9BZ2LMN'

// Hex IDs
const hexId = uid.custom({
  alphabet: '0123456789abcdef',
  size: 32
});

hexId();  // 'a3f8b2c1e9d4f7a0b5c6d7e8f9a0b1c2'
```

---

## PLUGIN SYSTEM

### Plugin Interface

```typescript
/**
 * Plugin interface for extending UID functionality.
 * 
 * @typeParam TContext - Shared context type between plugins
 */
export interface UidPlugin<TContext = UidContext> {
  /** Unique plugin identifier (kebab-case) */
  name: string;
  
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  
  /** Other plugins this plugin depends on */
  dependencies?: string[];
  
  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: UidKernel<TContext>) => void;
  
  /**
   * Called after all plugins are installed.
   * @param context - Shared context object
   */
  onInit?: (context: TContext) => void | Promise<void>;
  
  /**
   * Called when plugin is unregistered.
   */
  onDestroy?: () => void | Promise<void>;
  
  /**
   * Called on error in this plugin.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}
```

### Core Plugins (Always Loaded)

| Plugin | Description |
|--------|-------------|
| `uuid` | UUID v4 and v7 generation with validation and parsing |
| `ulid` | ULID generation with monotonic mode and timestamp extraction |
| `nanoid` | NanoID generation with custom alphabet support |

### Optional Plugins (Opt-in)

| Plugin | Description | Enable |
|--------|-------------|--------|
| `cuid2` | CUID2 secure collision-resistant IDs | `uid.use(cuid2Plugin)` |
| `snowflake` | Twitter-style distributed IDs | `uid.use(snowflakePlugin)` |
| `short` | Short IDs with Base58/62 encoding | `uid.use(shortPlugin)` |

---

## API DESIGN

### Main Export

```typescript
import { uid, createUid } from '@oxog/uid';

// Default instance (all core plugins loaded)
uid.uuid();     // UUID v4
uid.uuid.v7();  // UUID v7
uid.ulid();     // ULID
uid.nanoid();   // NanoID

// Create custom instance
const myUid = createUid({
  plugins: ['uuid', 'ulid'],  // Only specific plugins
  random: customRandomFn      // Custom random source
});

// Register optional plugin
import { snowflakePlugin } from '@oxog/uid/plugins';
uid.use(snowflakePlugin);
uid.snowflake();

// List registered plugins
uid.list();  // ['uuid', 'ulid', 'nanoid', 'snowflake']

// Unregister plugin
uid.unregister('snowflake');
```

### Type Definitions

```typescript
/** UID kernel configuration options */
export interface UidOptions {
  /** Plugins to load on initialization */
  plugins?: string[];
  
  /** Custom random byte generator */
  random?: (size: number) => Uint8Array;
  
  /** Enable debug logging */
  debug?: boolean;
}

/** UUID options */
export interface UuidOptions {
  /** Specific timestamp for v7 */
  timestamp?: number;
}

/** ULID options */
export interface UlidOptions {
  /** Use monotonic mode */
  monotonic?: boolean;
  /** Specific timestamp */
  timestamp?: number;
}

/** NanoID options */
export interface NanoidOptions {
  /** ID length (default: 21) */
  size?: number;
  /** Custom alphabet */
  alphabet?: string;
}

/** CUID2 options */
export interface Cuid2Options {
  /** ID length (24-32, default: 24) */
  length?: number;
  /** Machine fingerprint for extra uniqueness */
  fingerprint?: string;
}

/** Snowflake configuration */
export interface SnowflakeConfig {
  /** Worker ID (0-31) */
  workerId: number;
  /** Datacenter ID (0-31) */
  datacenterId: number;
  /** Custom epoch timestamp (default: 2021-01-01) */
  epoch?: number;
}

/** Parsed snowflake result */
export interface SnowflakeParsed {
  timestamp: Date;
  workerId: number;
  datacenterId: number;
  sequence: number;
}

/** Custom ID generator options */
export interface CustomOptions {
  /** Character set to use */
  alphabet: string;
  /** ID length */
  size: number;
}

/** Parsed UUID result */
export interface UuidParsed {
  version: number;
  variant: 'RFC4122' | 'NCS' | 'Microsoft' | 'Future';
  bytes: Uint8Array;
  timestamp?: Date;  // Only for v7
}
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Universal (Node.js + Browser) |
| Module Format | ESM + CJS |
| Node.js Version | >= 18 |
| TypeScript Version | >= 5.0 |
| Bundle Size (core) | < 5KB gzipped |
| Bundle Size (all plugins) | < 10KB gzipped |

### Cross-Platform Random

```typescript
// Kernel must detect environment and use appropriate random source
// Browser: crypto.getRandomValues()
// Node.js: crypto.randomBytes()

function getRandomBytes(size: number): Uint8Array {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    // Browser or Node.js 19+
    const bytes = new Uint8Array(size);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }
  // Node.js fallback
  const { randomBytes } = require('crypto');
  return new Uint8Array(randomBytes(size));
}
```

---

## LLM-NATIVE REQUIREMENTS

### 1. llms.txt File

Create `/llms.txt` in project root (< 2000 tokens):

```markdown
# UID

> Zero-dependency unique ID generation with multiple algorithms

## Install

```bash
npm install @oxog/uid
```

## Basic Usage

```typescript
import { uid } from '@oxog/uid';

uid.uuid();     // '550e8400-e29b-41d4-a716-446655440000'
uid.ulid();     // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
uid.nanoid();   // 'V1StGXR8_Z5jdHi6B-myT'
```

## API Summary

### Kernel
- `createUid(options?)` - Create custom instance
- `use(plugin)` - Register plugin
- `unregister(name)` - Remove plugin
- `list()` - List plugins

### Core Plugins
- `uuid` - UUID v4/v7 generation
- `ulid` - ULID generation (Crockford Base32)
- `nanoid` - URL-safe IDs with custom alphabet

### Optional Plugins
- `cuid2` - Secure collision-resistant IDs
- `snowflake` - Twitter-style 64-bit IDs
- `short` - YouTube-style short IDs

## Common Patterns

### Generate Different ID Types
```typescript
uid.uuid();        // Standard UUID v4
uid.uuid.v7();     // Time-sortable UUID v7
uid.ulid();        // Sortable ULID
uid.nanoid(10);    // 10-char NanoID
```

### Custom Alphabet
```typescript
const hexId = uid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});
hexId();  // 'a3f8b2c1e9d4f7a0'
```

### Validate IDs
```typescript
uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000'); // true
uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // true
```

## Errors

| Code | Meaning | Solution |
|------|---------|----------|
| `INVALID_ALPHABET` | Alphabet has duplicates or < 2 chars | Use unique chars, min 2 |
| `INVALID_SIZE` | Size out of valid range | Check size limits |
| `SNOWFLAKE_NOT_CONFIGURED` | Missing workerId/datacenterId | Call snowflake.configure() |
| `CLOCK_BACKWARDS` | System clock moved backwards | Wait or handle error |

## Links

- Docs: https://uid.oxog.dev
- GitHub: https://github.com/ersinkoc/uid
```

### 2. API Naming Standards

Use predictable patterns LLMs can infer:

```typescript
// ✅ GOOD - Predictable
uid.uuid()              // Generate UUID
uid.uuid.v4()           // Generate UUID v4
uid.uuid.v7()           // Generate UUID v7
uid.uuid.isValid(id)    // Validate UUID
uid.uuid.parse(id)      // Parse UUID
uid.ulid()              // Generate ULID
uid.ulid.monotonic()    // Monotonic ULID
uid.ulid.timestamp(id)  // Extract timestamp
uid.nanoid()            // Generate NanoID
uid.nanoid(size)        // With size
uid.nanoid.custom(opts) // Custom alphabet
uid.use(plugin)         // Register plugin
uid.list()              // List plugins

// ❌ BAD - Unpredictable
uid.gen()               // What does it generate?
uid.u4()                // Abbreviation
uid.make()              // Vague
uid.v()                 // Too short
```

### 3. Organized Examples

```
examples/
├── 01-basic/
│   ├── uuid-v4.ts           # Basic UUID v4
│   ├── uuid-v7.ts           # Time-based UUID v7
│   ├── ulid.ts              # Basic ULID
│   ├── nanoid.ts            # Basic NanoID
│   └── README.md
├── 02-plugins/
│   ├── optional-plugins.ts  # Loading optional plugins
│   ├── custom-instance.ts   # Custom UID instance
│   ├── plugin-lifecycle.ts  # Plugin lifecycle hooks
│   └── README.md
├── 03-validation/
│   ├── uuid-validation.ts   # UUID validation & parsing
│   ├── ulid-validation.ts   # ULID validation
│   ├── custom-validation.ts # Custom ID validation
│   └── README.md
├── 04-custom-alphabets/
│   ├── hex-ids.ts           # Hexadecimal IDs
│   ├── base58.ts            # Base58 encoding
│   ├── numeric-only.ts      # Numbers only
│   └── README.md
├── 05-distributed/
│   ├── snowflake-basic.ts   # Basic Snowflake
│   ├── snowflake-cluster.ts # Multi-node setup
│   ├── cuid2-scaling.ts     # CUID2 for scaling
│   └── README.md
├── 06-integrations/
│   ├── express-ids.ts       # Express.js request IDs
│   ├── react-keys.ts        # React list keys
│   ├── database-pks.ts      # Database primary keys
│   └── README.md
└── 07-real-world/
    ├── url-shortener/       # URL shortener service
    ├── transaction-ids/     # Financial transaction IDs
    ├── session-tokens/      # Session management
    └── README.md
```

---

## WEBSITE REQUIREMENTS

### Tech Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Syntax Highlighting**: Prism React Renderer
- **Icons**: Lucide React
- **Domain**: uid.oxog.dev

### IDE-Style Code Blocks

All code blocks MUST have:
- Line numbers (muted, non-selectable)
- Syntax highlighting
- Header bar with filename/language
- Copy button with "Copied!" feedback
- Rounded corners, subtle border
- Dark/light theme support

### Theme System

- Dark mode (default)
- Light mode
- Toggle button in navbar
- Persist in localStorage
- Respect system preference on first visit

### Required Pages

1. **Home** - Hero, features, install, quick examples
2. **Getting Started** - Installation, basic usage
3. **API Reference** - Complete documentation for all ID types
4. **Examples** - Organized by category
5. **Plugins** - Core, optional, custom plugin creation
6. **Playground** - Interactive ID generator

### Footer

- Package name
- MIT License
- © 2025 Ersin Koç
- GitHub link only

---

## GITHUB ACTIONS

Single workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build package
        run: npm run build
      
      - name: Build website
        working-directory: ./website
        run: |
          npm ci
          npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## CONFIG FILES

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'website/',
        'examples/',
        '*.config.*',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
```

### package.json

```json
{
  "name": "@oxog/uid",
  "version": "1.0.0",
  "description": "Zero-dependency unique ID generation with multiple algorithms and custom alphabets",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./plugins": {
      "import": {
        "types": "./dist/plugins/index.d.ts",
        "default": "./dist/plugins/index.js"
      },
      "require": {
        "types": "./dist/plugins/index.d.cts",
        "default": "./dist/plugins/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test:coverage"
  },
  "keywords": [
    "uuid",
    "ulid",
    "nanoid",
    "cuid",
    "snowflake",
    "unique-id",
    "id-generator",
    "zero-dependency",
    "typescript",
    "micro-kernel",
    "plugin"
  ],
  "author": "Ersin Koç",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ersinkoc/uid.git"
  },
  "bugs": {
    "url": "https://github.com/ersinkoc/uid/issues"
  },
  "homepage": "https://uid.oxog.dev",
  "engines": {
    "node": ">=18"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

---

## IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] Create SPECIFICATION.md with complete spec
- [ ] Create IMPLEMENTATION.md with architecture
- [ ] Create TASKS.md with ordered task list
- [ ] All three documents reviewed and complete

### During Implementation
- [ ] Follow TASKS.md sequentially
- [ ] Write tests before or with each feature
- [ ] Maintain 100% coverage throughout
- [ ] JSDoc on every public API with @example
- [ ] Create examples as features are built

### Package Completion
- [ ] All tests passing (100%)
- [ ] Coverage at 100% (lines, branches, functions)
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Package builds without errors

### LLM-Native Completion
- [ ] llms.txt created (< 2000 tokens)
- [ ] llms.txt copied to website/public/
- [ ] README first 500 tokens optimized
- [ ] All public APIs have JSDoc + @example
- [ ] 15+ examples in organized folders
- [ ] package.json has 8-12 keywords
- [ ] API uses standard naming patterns

### Website Completion
- [ ] All pages implemented
- [ ] IDE-style code blocks with line numbers
- [ ] Copy buttons working
- [ ] Dark/Light theme toggle
- [ ] CNAME file with uid.oxog.dev
- [ ] Mobile responsive
- [ ] Footer with Ersin Koç, MIT, GitHub only

### Final Verification
- [ ] `npm run build` succeeds
- [ ] `npm run test:coverage` shows 100%
- [ ] Website builds without errors
- [ ] All examples run successfully
- [ ] README is complete and accurate

---

## BEGIN IMPLEMENTATION

Start by creating **SPECIFICATION.md** with the complete package specification based on everything above.

Then create **IMPLEMENTATION.md** with architecture decisions.

Then create **TASKS.md** with ordered, numbered tasks.

Only after all three documents are complete, begin implementing code by following TASKS.md sequentially.

**Remember:**
- This package will be published to npm
- It must be production-ready
- Zero runtime dependencies
- 100% test coverage
- Professionally documented
- LLM-native design
- Beautiful documentation website
