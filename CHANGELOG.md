# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-03

### Added

- **Core Kernel**: Micro-kernel architecture with plugin system
  - Plugin registration and lifecycle management
  - Dependency resolution between plugins
  - Shared context for inter-plugin communication
  - Custom random byte generator support

- **UUID Plugin**: RFC 4122 UUID v4 and RFC 9562 UUID v7 generation
  - `uuid()` / `uuid.v4()` - Random UUID v4
  - `uuid.v7()` - Time-sortable UUID v7
  - `uuid.isValid()` - UUID validation
  - `uuid.parse()` - UUID parsing with version and variant detection

- **ULID Plugin**: Universally Unique Lexicographically Sortable Identifiers
  - `ulid()` - Standard ULID generation
  - `ulid.monotonic()` - Monotonically increasing ULIDs
  - `ulid.isValid()` - ULID validation
  - `ulid.timestamp()` - Timestamp extraction

- **NanoID Plugin**: URL-friendly unique identifiers
  - `nanoid()` - Default 21-character NanoID
  - `nanoid(size)` - Custom size NanoID
  - `nanoid.custom()` - Custom alphabet and size
  - `nanoid.urlSafe()` - Explicit URL-safe generation

- **CUID2 Plugin**: Collision-resistant unique identifiers
  - `cuid2()` - Default 24-character CUID2
  - `cuid2(options)` - Custom length and fingerprint
  - `cuid2.isValid()` - CUID2 validation

- **Snowflake Plugin**: Twitter-style distributed unique IDs
  - `snowflake.configure()` - Worker/datacenter configuration
  - `snowflake()` - String ID generation
  - `snowflake.bigint()` - BigInt ID generation
  - `snowflake.parse()` - ID parsing with timestamp extraction
  - `snowflake.isValid()` - Snowflake validation

- **Short ID Plugin**: Human-readable compact identifiers
  - `short()` - Default Base58 short ID
  - `short.youtube()` - YouTube-style Base64 URL-safe IDs
  - `short.base62()` - Alphanumeric only IDs
  - `short.base58()` - No confusing characters (0OIl excluded)

- **Utilities**
  - `encodeBase()` / `decodeBase()` - Base encoding utilities
  - `bytesToHex()` / `hexToBytes()` - Hex conversion
  - `bytesToNumber()` / `numberToBytes()` - Number conversion
  - `validateAlphabet()` - Alphabet validation

- **TypeScript Support**
  - Full TypeScript types with generics
  - Dual ESM/CJS module support
  - Tree-shakable exports

- **Documentation**
  - Interactive website at uid.oxog.dev
  - Live playground with all ID types
  - Comprehensive API documentation

### Security

- Cryptographically secure random generation using Web Crypto API
- Automatic fallback to Node.js crypto module
- No external dependencies (zero-dependency)

[1.0.0]: https://github.com/ersinkoc/uid/releases/tag/v1.0.0
