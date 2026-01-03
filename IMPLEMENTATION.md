# @oxog/uid - Implementation Architecture

## 1. Directory Structure

```
@oxog/uid/
├── src/
│   ├── kernel/              # Micro-kernel core
│   │   ├── kernel.ts        # Main kernel class
│   │   ├── random.ts        # Cross-platform random bytes
│   │   ├── encoding.ts      # Base encoding utilities
│   │   └── validation.ts    # Validation framework
│   ├── plugins/             # Plugin implementations
│   │   ├── uuid/
│   │   │   ├── index.ts     # UUID plugin & API
│   │   │   ├── v4.ts        # UUID v4 generator
│   │   │   └── v7.ts        # UUID v7 generator
│   │   ├── ulid/
│   │   │   ├── index.ts     # ULID plugin & API
│   │   │   └── generator.ts # ULID generator
│   │   ├── nanoid/
│   │   │   ├── index.ts     # NanoID plugin & API
│   │   │   └── generator.ts # NanoID generator
│   │   ├── cuid2/
│   │   │   ├── index.ts     # CUID2 plugin & API
│   │   │   └── generator.ts # CUID2 generator
│   │   ├── snowflake/
│   │   │   ├── index.ts     # Snowflake plugin & API
│   │   │   └── generator.ts # Snowflake generator
│   │   └── short/
│   │       ├── index.ts     # Short ID plugin & API
│   │       └── generator.ts # Short ID generator
│   ├── types.ts             # Shared TypeScript types
│   ├── utils.ts             # Shared utilities
│   └── index.ts             # Main export
├── tests/                   # Test files
│   ├── kernel/              # Kernel tests
│   ├── plugins/             # Plugin tests
│   └── integration/         # Integration tests
├── examples/                # Usage examples
│   ├── 01-basic/
│   ├── 02-plugins/
│   ├── 03-validation/
│   ├── 04-custom-alphabets/
│   ├── 05-distributed/
│   ├── 06-integrations/
│   └── 07-real-world/
├── website/                 # Documentation website
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── public/
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── package.json
└── README.md
```

## 2. Core Architecture

### 2.1 Kernel Class

The `UidKernel` class manages plugins and provides core utilities:

```typescript
export class UidKernel<TContext extends UidContext = UidContext> {
  private plugins: Map<string, UidPlugin<TContext>>;
  private context: TContext;
  private randomSource: RandomSource;

  constructor(options?: UidOptions) {
    this.plugins = new Map();
    this.context = this.createContext();
    this.randomSource = options?.random || this.getDefaultRandom();
  }

  // Plugin management
  use(plugin: UidPlugin<TContext>): this;
  unregister(name: string): boolean;
  list(): string[];
  has(name: string): boolean;

  // Core utilities
  random(size: number): Uint8Array;
  encode(bytes: Uint8Array, alphabet: string): string;
  decode(str: string, alphabet: string): Uint8Array;

  // Lifecycle
  private async init(): Promise<void>;
  private async destroy(): Promise<void>;
}
```

### 2.2 Random Byte Generation

Cross-platform random bytes with environment detection:

```typescript
export function createRandomSource(): RandomSource {
  // Try browser API or Node.js 19+
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return (size: number) => {
      const bytes = new Uint8Array(size);
      globalThis.crypto!.getRandomValues(bytes);
      return bytes;
    };
  }

  // Node.js <19 fallback
  if (typeof process?.versions?.node === 'string') {
    const { randomBytes } = require('crypto');
    return (size: number) => new Uint8Array(randomBytes(size));
  }

  throw new Error('No cryptographically secure random source available');
}
```

### 2.3 Base Encoding

Generic base encoding for any alphabet:

```typescript
export function encodeBase(bytes: Uint8Array, alphabet: string): string {
  if (alphabet.length < 2) {
    throw new Error('Alphabet must have at least 2 characters');
  }

  const result: string[] = [];
  let num = 0n;
  const bits = BigInt(bytes.length * 8);

  for (const byte of bytes) {
    num = (num << 8n) | BigInt(byte);
  }

  const base = BigInt(alphabet.length);
  while (num > 0n) {
    result.unshift(alphabet[Number(num % base)]);
    num /= base;
  }

  return result.join('');
}

export function decodeBase(str: string, alphabet: string): Uint8Array {
  const charIndex = new Map<string, number>();
  for (let i = 0; i < alphabet.length; i++) {
    charIndex.set(alphabet[i], i);
  }

  let num = 0n;
  const base = BigInt(alphabet.length);

  for (const char of str) {
    const idx = charIndex.get(char);
    if (idx === undefined) {
      throw new Error(`Invalid character: ${char}`);
    }
    num = num * base + BigInt(idx);
  }

  // Convert to bytes
  const hex = num.toString(16).padStart(Math.ceil(str.length * Math.log2(base.length) / 8) * 2, '0');
  return new Uint8Array(hex.match(/.{2}/g)?.map(b => parseInt(b, 16)) ?? []);
}
```

### 2.4 Validation Framework

Common validation utilities:

```typescript
export function validateAlphabet(alphabet: string): void {
  if (alphabet.length < 2) {
    throw new Error('Alphabet must have at least 2 characters');
  }

  const unique = new Set(alphabet);
  if (unique.size !== alphabet.length) {
    throw new Error('Alphabet must not contain duplicate characters');
  }
}

export function validateSize(size: number, min: number, max: number): void {
  if (!Number.isInteger(size) || size < min || size > max) {
    throw new Error(`Size must be an integer between ${min} and ${max}`);
  }
}

export function createValidator(pattern: RegExp): (id: string) => boolean {
  return (id: string) => pattern.test(id);
}
```

## 3. Plugin Implementations

### 3.1 UUID Plugin

**File:** `src/plugins/uuid/index.ts`

```typescript
import type { UidPlugin, UidKernel } from '../../types';

export interface UuidApi {
  (): string;                    // Generate UUID v4
  v4: () => string;              // Generate UUID v4
  v7: (options?: { timestamp?: number }) => string;
  isValid: (id: string) => boolean;
  parse: (id: string) => UuidParsed | null;
}

export function createUuidPlugin(): UidPlugin {
  return {
    name: 'uuid',
    version: '1.0.0',
    install(kernel) {
      const api: UuidApi = (() => this.v4()) as UuidApi;
      api.v4 = () => generateUuidV4(kernel);
      api.v7 = (opts) => generateUuidV7(kernel, opts?.timestamp);
      api.isValid = createUuidValidator();
      api.parse = parseUuid;

      kernel.registerApi('uuid', api);
    }
  };
}
```

**UUID v4 Generator:**

```typescript
function generateUuidV4(kernel: UidKernel): string {
  const bytes = kernel.random(16);

  // Version 4 (random)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Variant RFC4122
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}

function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}
```

**UUID v7 Generator:**

```typescript
function generateUuidV7(kernel: UidKernel, timestamp?: number): string {
  const ts = timestamp ?? Date.now();
  const millis = BigInt(ts);
  const random = kernel.random(10);

  // Build UUID v7: 48 bits timestamp + 12 bits random + 62 bits random
  const bytes = new Uint8Array(16);

  // Timestamp (48 bits)
  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number((millis >> BigInt(i * 8)) & 0xffn);
  }

  // Version and variant
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // Version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122

  // Random bits
  bytes.set(random.slice(0, 6), 6);
  bytes.set(random.slice(6), 10);

  return formatUuid(bytes);
}
```

### 3.2 ULID Plugin

**File:** `src/plugins/ulid/index.ts`

```typescript
const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function createUlidPlugin(): UidPlugin {
  let lastTime = 0;
  let lastRandom = 0;

  return {
    name: 'ulid',
    version: '1.0.0',
    install(kernel) {
      const api: UlidApi = (() => generateUlid(kernel)) as UlidApi;
      api.monotonic = () => generateMonotonicUlid(kernel, () => {
        const now = Date.now();
        if (now !== lastTime) {
          lastTime = now;
          lastRandom = 0;
        }
        return { now, lastRandom: ++lastRandom };
      });
      api.isValid = createUlidValidator();
      api.timestamp = extractUlidTimestamp;

      kernel.registerApi('ulid', api);
    }
  };
}

function generateUlid(kernel: UidKernel, timestamp?: number): string {
  const ts = timestamp ?? Date.now();
  const timeBytes = encodeTime(ts, 10);
  const randomBytes = kernel.random(10);

  return kernel.encode(timeBytes, CROCKFORD_BASE32) +
         kernel.encode(randomBytes, CROCKFORD_BASE32);
}

function encodeTime(timestamp: number, length: number): Uint8Array {
  const ts = BigInt(timestamp);
  const bytes = new Uint8Array(length);

  for (let i = length - 1; i >= 0; i--) {
    bytes[i] = Number((ts >> BigInt(i * 8)) & 0xffn);
  }

  return bytes;
}
```

### 3.3 NanoID Plugin

**File:** `src/plugins/nanoid/index.ts`

```typescript
const DEFAULT_ALPHABET = '_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DEFAULT_SIZE = 21;

export function createNanoidPlugin(): UidPlugin {
  return {
    name: 'nanoid',
    version: '1.0.0',
    install(kernel) {
      const api = ((size?: number) =>
        generateNanoid(kernel, size ?? DEFAULT_SIZE)
      ) as NanoidApi;

      api.custom = (opts) => {
        validateAlphabet(opts.alphabet);
        validateSize(opts.size, 1, 256);
        return generateNanoid(kernel, opts.size, opts.alphabet);
      };

      api.urlSafe = (size) => generateNanoid(kernel, size ?? DEFAULT_SIZE);

      kernel.registerApi('nanoid', api);
    }
  };
}

function generateNanoid(
  kernel: UidKernel,
  size: number,
  alphabet = DEFAULT_ALPHABET
): string {
  const bytes = kernel.random(size);
  const mask = (2 << (31 - Math.clz32(alphabet.length - 1))) - 1;
  const step = Math.ceil((256 * size) / alphabet.length);

  let id = '';
  let bytesRead = 0;

  while (id.length < size && bytesRead < bytes.length) {
    const randomByte = bytes[bytesRead++];
    if (randomByte < 256 - (256 % alphabet.length)) {
      id += alphabet[randomByte % alphabet.length];
    }
  }

  return id;
}
```

### 3.4 CUID2 Plugin

**File:** `src/plugins/cuid2/index.ts`

```typescript
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const DEFAULT_LENGTH = 24;

export function createCuid2Plugin(): UidPlugin {
  return {
    name: 'cuid2',
    version: '1.0.0',
    install(kernel) {
      let fingerprint = createFingerprint();

      const api = ((opts?: Cuid2Options) =>
        generateCuid2(kernel, opts?.length ?? DEFAULT_LENGTH, fingerprint)
      ) as Cuid2Api;

      api.isValid = createCuid2Validator();

      if (api.onInit) {
        api.onInit = (context) => {
          fingerprint = context.fingerprint ?? fingerprint;
        };
      }

      kernel.registerApi('cuid2', api);
    }
  };
}

function generateCuid2(
  kernel: UidKernel,
  length: number,
  fingerprint: string
): string {
  const firstLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const timestamp = Date.now().toString(36);
  const random = kernel.random(Math.ceil(length / 2));
  const randomStr = kernel.encode(random, '0123456789abcdefghijklmnopqrstuvwxyz');

  const id = firstLetter + timestamp + randomStr + fingerprint;
  return id.slice(0, length);
}

function createFingerprint(): string {
  if (typeof window !== 'undefined') {
    // Browser: use random
    return Math.random().toString(36).slice(2, 6);
  }
  // Node.js: could use hostname or machine-id
  return process.env.HOSTNAME?.slice(0, 4) || 'node';
}
```

### 3.5 Snowflake Plugin

**File:** `src/plugins/snowflake/index.ts`

```typescript
const DEFAULT_EPOCH = 1609459200000; // 2021-01-01

export function createSnowflakePlugin(): UidPlugin {
  let config: SnowflakeConfig | null = null;
  let sequence = 0;
  let lastTime = 0;

  return {
    name: 'snowflake',
    version: '1.0.0',
    install(kernel) {
      const api: SnowflakeApi = (() => {
        if (!config) {
          throw new Error('Snowflake not configured. Call configure() first.');
        }
        return generateSnowflake(kernel, config);
      }) as SnowflakeApi;

      api.configure = (opts) => {
        validateSnowflakeConfig(opts);
        config = { ...opts, epoch: opts.epoch ?? DEFAULT_EPOCH };
      };

      api.bigint = () => {
        if (!config) throw new Error('Not configured');
        return BigInt(generateSnowflake(kernel, config));
      };

      api.parse = (id) => parseSnowflake(id, config?.epoch ?? DEFAULT_EPOCH);

      kernel.registerApi('snowflake', api);
    }
  };
}

function generateSnowflake(kernel: UidKernel, config: SnowflakeConfig): string {
  const now = Date.now();

  if (now < lastTime) {
    throw new Error('Clock moved backwards');
  }

  if (now === lastTime) {
    sequence = (sequence + 1) & 0xfff;
    if (sequence === 0) {
      // Wait for next millisecond
      while (Date.now() <= now) {}
    }
  } else {
    sequence = 0;
  }

  lastTime = now;

  const timestamp = BigInt(now - (config.epoch ?? DEFAULT_EPOCH));
  const workerId = BigInt(config.workerId & 0x1f);
  const datacenterId = BigInt(config.datacenterId & 0x1f);
  const seq = BigInt(sequence);

  const snowflake = (timestamp << 22n) | (datacenterId << 17n) | (workerId << 12n) | seq;
  return snowflake.toString();
}

function parseSnowflake(id: string, epoch: number): SnowflakeParsed {
  const snowflake = BigInt(id);
  const timestamp = Number((snowflake >> 22n) & 0x1ffffffffffn) + epoch;
  const datacenterId = Number((snowflake >> 17n) & 0x1fn);
  const workerId = Number((snowflake >> 12n) & 0x1fn);
  const sequence = Number(snowflake & 0xfffn);

  return {
    timestamp: new Date(timestamp),
    datacenterId,
    workerId,
    sequence
  };
}
```

### 3.6 Short ID Plugin

**File:** `src/plugins/short/index.ts`

```typescript
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE64_URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function createShortPlugin(): UidPlugin {
  return {
    name: 'short',
    version: '1.0.0',
    install(kernel) {
      const api = ((size?: number) =>
        generateShort(kernel, size ?? 11, BASE58)
      ) as ShortApi;

      api.youtube = () => generateShort(kernel, 11, BASE64_URL);
      api.base62 = (size) => generateShort(kernel, size ?? 10, BASE62);
      api.base58 = (size) => generateShort(kernel, size ?? 8, BASE58);

      kernel.registerApi('short', api);
    }
  };
}

function generateShort(kernel: UidKernel, size: number, alphabet: string): string {
  const bytesNeeded = Math.ceil(size * Math.log2(alphabet.length) / 8);
  const bytes = kernel.random(bytesNeeded);
  return kernel.encode(bytes, alphabet).slice(0, size);
}
```

## 4. Type Definitions

**File:** `src/types.ts`

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

/** Shared context between plugins */
export interface UidContext {
  /** Configuration storage */
  config: Map<string, unknown>;
  /** Event hooks */
  hooks: Map<string, Set<Function>>;
}

/** Plugin interface */
export interface UidPlugin<TContext = UidContext> {
  name: string;
  version: string;
  dependencies?: string[];
  install: (kernel: UidKernel<TContext>) => void;
  onInit?: (context: TContext) => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
  onError?: (error: Error) => void;
}

/** Kernel interface */
export interface UidKernel<TContext = UidContext> {
  use(plugin: UidPlugin<TContext>): this;
  unregister(name: string): boolean;
  list(): string[];
  has(name: string): boolean;
  random(size: number): Uint8Array;
  registerApi(name: string, api: unknown): void;
  getApi<T>(name: string): T | undefined;
}

/** Random byte generator */
export type RandomSource = (size: number) => Uint8Array;
```

## 5. Main Export

**File:** `src/index.ts`

```typescript
import { UidKernel } from './kernel/kernel';
import { uuidPlugin } from './plugins/uuid';
import { ulidPlugin } from './plugins/ulid';
import { nanoidPlugin } from './plugins/nanoid';
import type { UidOptions } from './types';

/**
 * Create a custom UID instance with optional configuration.
 *
 * @example
 * ```ts
 * const myUid = createUid({
 *   plugins: ['uuid', 'ulid'],
 *   random: (size) => new Uint8Array(size)
 * });
 * ```
 */
export function createUid(options?: UidOptions): UidKernel {
  const kernel = new UidKernel(options);

  // Load core plugins
  kernel.use(uuidPlugin);
  kernel.use(ulidPlugin);
  kernel.use(nanoidPlugin);

  return kernel;
}

/**
 * Default UID instance with all core plugins loaded.
 *
 * @example
 * ```ts
 * import { uid } from '@oxog/uid';
 *
 * uid.uuid();   // '550e8400-e29b-41d4-a716-446655440000'
 * uid.ulid();   // '01ARZ3NDEKTSV4RRFFQ69G5FAV'
 * uid.nanoid(); // 'V1StGXR8_Z5jdHi6B-myT'
 * ```
 */
export const uid = createUid();

// Re-export types
export type * from './types';
```

## 6. Testing Strategy

### 6.1 Test Structure

```
tests/
├── kernel/
│   ├── kernel.test.ts       # Kernel functionality
│   ├── random.test.ts       # Random generation
│   ├── encoding.test.ts     # Base encoding
│   └── validation.test.ts   # Validation utilities
├── plugins/
│   ├── uuid.test.ts         # UUID tests
│   ├── ulid.test.ts         # ULID tests
│   ├── nanoid.test.ts       # NanoID tests
│   ├── cuid2.test.ts        # CUID2 tests
│   ├── snowflake.test.ts    # Snowflake tests
│   └── short.test.ts        # Short ID tests
└── integration/
    ├── cross-platform.test.ts # Cross-platform behavior
    ├── collisions.test.ts     # Collision resistance
    └── plugin-lifecycle.test.ts # Plugin system
```

### 6.2 Test Categories

**Unit Tests:**
- Each function in isolation
- Input validation
- Error handling
- Edge cases

**Integration Tests:**
- Plugin interactions
- API consistency
- Multi-instance scenarios

**Property-Based Tests:**
- Random input generation
- Format validation
- Encoding/decoding round-trips

### 6.3 Coverage Enforcement

**vitest.config.ts:**

```typescript
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
});
```

## 7. Build Configuration

### 7.1 TypeScript Configuration

**tsconfig.json:**

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
    "module": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests", "website"]
}
```

### 7.2 Build Configuration

**tsup.config.ts:**

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
  target: 'es2022'
});
```

## 8. Plugin System Details

### 8.1 Registration Flow

```
1. user calls uid.use(plugin)
2. kernel checks dependencies
3. kernel calls plugin.install(kernel)
4. plugin registers API
5. kernel calls plugin.onInit(context)
6. API available via uid.{name}
```

### 8.2 API Registration

Plugins register APIs through the kernel:

```typescript
kernel.registerApi('uuid', {
  (): string;
  v4: () => string;
  v7: (opts?) => string;
  isValid: (id) => boolean;
  parse: (id) => Parsed | null;
});
```

### 8.3 Dependency Resolution

```typescript
kernel.use(pluginB); // Depends on pluginA
// -> Automatically loads pluginA first
// -> Throws if pluginA not available
```

## 9. Performance Optimizations

### 9.1 Byte Reuse

Where possible, reuse byte arrays:

```typescript
const POOL_SIZE = 256;
let bytePool: Uint8Array | null = null;

function getBytes(size: number): Uint8Array {
  if (size <= POOL_SIZE && bytePool) {
    return bytePool.slice(0, size);
  }
  return random(size);
}
```

### 9.2 String Building

Use array join for string concatenation:

```typescript
// ✅ GOOD
const parts: string[] = [];
for (let i = 0; i < n; i++) {
  parts.push(process(i));
}
return parts.join('');

// ❌ BAD
let result = '';
for (let i = 0; i < n; i++) {
  result += process(i);
}
return result;
```

## 10. Error Handling

### 10.1 Error Types

```typescript
export class UidError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'UidError';
  }
}

// Usage
throw new UidError('INVALID_ALPHABET', 'Alphabet must have unique characters');
```

### 10.2 Error Recovery

```typescript
try {
  return uid.snowflake();
} catch (error) {
  if (error instanceof UidError && error.code === 'NOT_CONFIGURED') {
    uid.snowflake.configure({ workerId: 1, datacenterId: 1 });
    return uid.snowflake();
  }
  throw error;
}
```

## 11. Browser Compatibility

### 11.1 Feature Detection

```typescript
const isBrowser = typeof window !== 'undefined';
const hasCrypto = typeof globalThis.crypto?.getRandomValues === 'function';
const isNode = typeof process?.versions?.node === 'string';
```

### 11.2 Conditional Builds

No conditional builds needed - use runtime detection:

```typescript
// Works in both environments without separate builds
const random = detectRandomSource();
```

## 12. Documentation Strategy

### 12.1 JSDoc Comments

Every public API has JSDoc:

```typescript
/**
 * Generate a UUID v4 (random UUID).
 *
 * @example
 * ```ts
 * import { uid } from '@oxog/uid';
 *
 * uid.uuid(); // '550e8400-e29b-41d4-a716-446655440000'
 * ```
 *
 * @returns A UUID v4 string in format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
function uuid(): string;
```

### 12.2 Example Organization

Examples organized by complexity:

1. **Basic** - Single function calls
2. **Plugins** - Plugin system usage
3. **Validation** - Validation and parsing
4. **Custom** - Custom alphabets
5. **Distributed** - Multi-node scenarios
6. **Integrations** - Framework integration
7. **Real-World** - Complete applications

## 13. Website Architecture

### 13.1 Component Structure

```
website/src/
├── pages/
│   ├── Home.tsx
│   ├── GettingStarted.tsx
│   ├── ApiReference.tsx
│   ├── Examples.tsx
│   ├── Plugins.tsx
│   └── Playground.tsx
├── components/
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CodeBlock.tsx
│   ├── ThemeToggle.tsx
│   └── Navigation.tsx
├── styles/
│   └── index.css
└── main.tsx
```

### 13.2 Code Block Component

IDE-style code blocks with:

- Line numbers
- Syntax highlighting
- Copy button
- Theme support

## 14. Continuous Integration

### 14.1 GitHub Actions

Single workflow file handles:

1. Run tests with coverage
2. Build package
3. Build website
4. Deploy to GitHub Pages

### 14.2 Quality Gates

- All tests must pass
- 100% coverage required
- TypeScript must compile
- ESLint must pass
- Build must succeed

## 15. Release Process

### 15.1 Pre-Release

- Update version in package.json
- Update CHANGELOG.md
- Run full test suite
- Build package and website

### 15.2 Release

```bash
git tag v1.0.0
git push origin v1.0.0
npm publish
```

## 16. Future Extensibility

### 16.1 Custom Plugins

Users can create custom plugins:

```typescript
const myPlugin: UidPlugin = {
  name: 'my-algorithm',
  version: '1.0.0',
  install(kernel) {
    kernel.registerApi('myAlgo', () => {
      const bytes = kernel.random(16);
      return kernel.encode(bytes, 'custom-alphabet');
    });
  }
};

uid.use(myPlugin);
uid.myAlgo();
```

### 16.2 Plugin Discovery

Future: Plugin registry or npm scope

```typescript
import { customPlugin } from '@oxog/uid-plugin-custom';
uid.use(customPlugin);
```

This architecture ensures maintainability, extensibility, and performance while maintaining zero runtime dependencies.
