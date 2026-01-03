# @oxog/uid - Implementation Tasks

## Phase 1: Project Setup

### 1.1 Initialize Package
- [ ] Create package.json with proper exports and metadata
- [ ] Create tsconfig.json with strict mode settings
- [ ] Create tsup.config.ts for bundling
- [ ] Create vitest.config.ts with 100% coverage thresholds
- [ ] Create .gitignore
- [ ] Create .npmrc
- [ ] Create LICENSE (MIT)

### 1.2 Create Directory Structure
- [ ] Create src/ directory
- [ ] Create src/kernel/ directory
- [ ] Create src/plugins/ directory
- [ ] Create src/plugins/uuid/ directory
- [ ] Create src/plugins/ulid/ directory
- [ ] Create src/plugins/nanoid/ directory
- [ ] Create src/plugins/cuid2/ directory
- [ ] Create src/plugins/snowflake/ directory
- [ ] Create src/plugins/short/ directory
- [ ] Create tests/ directory
- [ ] Create examples/ directory

## Phase 2: Core Implementation

### 2.1 Type Definitions
- [ ] Create src/types.ts with all interfaces
  - [ ] UidOptions
  - [ ] UidContext
  - [ ] UidPlugin
  - [ ] UidKernel
  - [ ] RandomSource
  - [ ] All algorithm-specific types

### 2.2 Kernel - Random Bytes
- [ ] Create src/kernel/random.ts
  - [ ] Implement createRandomSource()
  - [ ] Browser crypto detection
  - [ ] Node.js crypto detection
  - [ ] Error handling for no crypto support

### 2.3 Kernel - Base Encoding
- [ ] Create src/kernel/encoding.ts
  - [ ] Implement encodeBase()
  - [ ] Implement decodeBase()
  - [ ] Implement toHex() helper
  - [ ] Implement fromHex() helper
  - [ ] Implement toBase32() helper
  - [ ] Implement toBase64() helper
  - [ ] Implement toBase64Url() helper

### 2.4 Kernel - Validation
- [ ] Create src/kernel/validation.ts
  - [ ] Implement validateAlphabet()
  - [ ] Implement validateSize()
  - [ ] Implement createValidator() factory

### 2.5 Kernel - Main Class
- [ ] Create src/kernel/kernel.ts
  - [ ] Implement UidKernel class
  - [ ] Implement use() method
  - [ ] Implement unregister() method
  - [ ] Implement list() method
  - [ ] Implement has() method
  - [ ] Implement random() method
  - [ ] Implement registerApi() method
  - [ ] Implement getApi() method
  - [ ] Implement lifecycle management

### 2.6 Shared Utilities
- [ ] Create src/utils.ts
  - [ ] Implement byteToHex() helper
  - [ ] Implement hexToByte() helper
  - [ ] Implement numberToBytes() helper
  - [ ] Implement bytesToNumber() helper

## Phase 3: Plugin Implementation

### 3.1 UUID Plugin
- [ ] Create src/plugins/uuid/v4.ts
  - [ ] Implement generateUuidV4()
  - [ ] Implement formatUuid()

- [ ] Create src/plugins/uuid/v7.ts
  - [ ] Implement generateUuidV7()
  - [ ] Implement extractTimestampV7()

- [ ] Create src/plugins/uuid/validator.ts
  - [ ] Implement uuid regex patterns
  - [ ] Implement createUuidValidator()
  - [ ] Implement parseUuid()

- [ ] Create src/plugins/uuid/index.ts
  - [ ] Create uuid plugin object
  - [ ] Install with kernel
  - [ ] Export UuidApi interface

### 3.2 ULID Plugin
- [ ] Create src/plugins/ulid/generator.ts
  - [ ] Implement generateUlid()
  - [ ] Implement generateMonotonicUlid()
  - [ ] Implement encodeTime()
  - [ ] Implement decodeTime()

- [ ] Create src/plugins/ulid/validator.ts
  - [ ] Implement ulid regex pattern
  - [ ] Implement createUlidValidator()

- [ ] Create src/plugins/ulid/index.ts
  - [ ] Create ulid plugin object
  - [ ] Install with kernel
  - [ ] Export UlidApi interface

### 3.3 NanoID Plugin
- [ ] Create src/plugins/nanoid/generator.ts
  - [ ] Implement generateNanoid()
  - [ ] Implement with custom alphabet
  - [ ] Implement URL-safe variant

- [ ] Create src/plugins/nanoid/index.ts
  - [ ] Create nanoid plugin object
  - [ ] Install with kernel
  - [ ] Export NanoidApi interface

### 3.4 CUID2 Plugin
- [ ] Create src/plugins/cuid2/generator.ts
  - [ ] Implement generateCuid2()
  - [ ] Implement createFingerprint()
  - [ ] Implement with custom length

- [ ] Create src/plugins/cuid2/validator.ts
  - [ ] Implement cuid2 regex pattern
  - [ ] Implement createCuid2Validator()

- [ ] Create src/plugins/cuid2/index.ts
  - [ ] Create cuid2 plugin object
  - [ ] Install with kernel
  - [ ] Export Cuid2Api interface

### 3.5 Snowflake Plugin
- [ ] Create src/plugins/snowflake/generator.ts
  - [ ] Implement generateSnowflake()
  - [ ] Implement parseSnowflake()
  - [ ] Implement clock backwards detection
  - [ ] Implement sequence handling

- [ ] Create src/plugins/snowflake/validator.ts
  - [ ] Implement snowflake regex pattern

- [ ] Create src/plugins/snowflake/index.ts
  - [ ] Create snowflake plugin object
  - [ ] Install with kernel
  - [ ] Export SnowflakeApi interface

### 3.6 Short ID Plugin
- [ ] Create src/plugins/short/generator.ts
  - [ ] Implement generateShort()
  - [ ] Implement Base58 variant
  - [ ] Implement Base62 variant
  - [ ] Implement YouTube variant (Base64 URL)

- [ ] Create src/plugins/short/index.ts
  - [ ] Create short plugin object
  - [ ] Install with kernel
  - [ ] Export ShortApi interface

### 3.7 Custom ID Support
- [ ] Add custom() method to main export
  - [ ] Accept alphabet and size
  - [ ] Return generator function
  - [ ] Validate inputs

### 3.8 Plugin Exports
- [ ] Create src/plugins/index.ts
  - [ ] Export all core plugins
  - [ ] Export all optional plugins
  - [ ] Export plugin types

## Phase 4: Main Export

### 4.1 Index File
- [ ] Create src/index.ts
  - [ ] Export createUid() function
  - [ ] Export default uid instance
  - [ ] Export all types
  - [ ] Add JSDoc comments with examples

## Phase 5: Testing

### 5.1 Kernel Tests
- [ ] Create tests/kernel/random.test.ts
  - [ ] Test browser random source
  - [ ] Test Node.js random source
  - [ ] Test error handling

- [ ] Create tests/kernel/encoding.test.ts
  - [ ] Test encodeBase() with various alphabets
  - [ ] Test decodeBase() round-trip
  - [ ] Test toHex() / fromHex()
  - [ ] Test toBase32()
  - [ ] Test toBase64() / toBase64Url()

- [ ] Create tests/kernel/validation.test.ts
  - [ ] Test validateAlphabet()
  - [ ] Test validateSize()
  - [ ] Test error cases

- [ ] Create tests/kernel/kernel.test.ts
  - [ ] Test plugin registration
  - [ ] Test plugin unregistration
  - [ ] Test plugin listing
  - [ ] Test API registration
  - [ ] Test API retrieval

### 5.2 UUID Tests
- [ ] Create tests/plugins/uuid.test.ts
  - [ ] Test uuid.v4() format
  - [ ] Test uuid.v7() format
  - [ ] Test uuid.v7() with custom timestamp
  - [ ] Test uuid.isValid()
  - [ ] Test uuid.parse()
  - [ ] Test version detection
  - [ ] Test variant detection
  - [ ] Test timestamp extraction (v7)

### 5.3 ULID Tests
- [ ] Create tests/plugins/ulid.test.ts
  - [ ] Test ulid() format
  - [ ] Test ulid() with custom timestamp
  - [ ] Test ulid.monotonic()
  - [ ] Test ulid.isValid()
  - [ ] Test ulid.timestamp()
  - [ ] Test monotonic increasing
  - [ ] Test Crockford Base32 encoding

### 5.4 NanoID Tests
- [ ] Create tests/plugins/nanoid.test.ts
  - [ ] Test nanoid() default size
  - [ ] Test nanoid() with custom size
  - [ ] Test nanoid.custom()
  - [ ] Test nanoid.urlSafe()
  - [ ] Test alphabet validation
  - [ ] Test uniqueness

### 5.5 CUID2 Tests
- [ ] Create tests/plugins/cuid2.test.ts
  - [ ] Test cuid2() default
  - [ ] Test cuid2() with custom length
  - [ ] Test cuid2() with fingerprint
  - [ ] Test cuid2.isValid()
  - [ ] Test format validation

### 5.6 Snowflake Tests
- [ ] Create tests/plugins/snowflake.test.ts
  - [ ] Test configure()
  - [ ] Test snowflake() generation
  - [ ] Test snowflake.bigint()
  - [ ] Test snowflake.parse()
  - [ ] Test sequence increment
  - [ ] Test clock backwards error
  - [ ] Test uniqueness

### 5.7 Short ID Tests
- [ ] Create tests/plugins/short.test.ts
  - [ ] Test short() default
  - [ ] Test short() with custom size
  - [ ] Test short.youtube()
  - [ ] Test short.base58()
  - [ ] Test short.base62()
  - [ ] Test encoding correctness

### 5.8 Integration Tests
- [ ] Create tests/integration/cross-platform.test.ts
  - [ ] Test behavior consistency
  - [ ] Test random source selection

- [ ] Create tests/integration/collisions.test.ts
  - [ ] Test UUID uniqueness (large batch)
  - [ ] Test ULID uniqueness (large batch)
  - [ ] Test NanoID uniqueness (large batch)

- [ ] Create tests/integration/plugin-lifecycle.test.ts
  - [ ] Test plugin initialization
  - [ ] Test plugin dependencies
  - [ ] Test plugin destruction

### 5.9 Coverage Verification
- [ ] Run npm run test:coverage
- [ ] Verify 100% lines coverage
- [ ] Verify 100% functions coverage
- [ ] Verify 100% branches coverage
- [ ] Verify 100% statements coverage

## Phase 6: Examples

### 6.1 Basic Examples
- [ ] Create examples/01-basic/uuid-v4.ts
- [ ] Create examples/01-basic/uuid-v7.ts
- [ ] Create examples/01-basic/ulid.ts
- [ ] Create examples/01-basic/nanoid.ts
- [ ] Create examples/01-basic/README.md

### 6.2 Plugin Examples
- [ ] Create examples/02-plugins/optional-plugins.ts
- [ ] Create examples/02-plugins/custom-instance.ts
- [ ] Create examples/02-plugins/plugin-lifecycle.ts
- [ ] Create examples/02-plugins/README.md

### 6.3 Validation Examples
- [ ] Create examples/03-validation/uuid-validation.ts
- [ ] Create examples/03-validation/ulid-validation.ts
- [ ] Create examples/03-validation/custom-validation.ts
- [ ] Create examples/03-validation/README.md

### 6.4 Custom Alphabet Examples
- [ ] Create examples/04-custom-alphabets/hex-ids.ts
- [ ] Create examples/04-custom-alphabets/base58.ts
- [ ] Create examples/04-custom-alphabets/numeric-only.ts
- [ ] Create examples/04-custom-alphabets/README.md

### 6.5 Distributed Examples
- [ ] Create examples/05-distributed/snowflake-basic.ts
- [ ] Create examples/05-distributed/snowflake-cluster.ts
- [ ] Create examples/05-distributed/cuid2-scaling.ts
- [ ] Create examples/05-distributed/README.md

### 6.6 Integration Examples
- [ ] Create examples/06-integrations/express-ids.ts
- [ ] Create examples/06-integrations/react-keys.ts
- [ ] Create examples/06-integrations/database-pks.ts
- [ ] Create examples/06-integrations/README.md

### 6.7 Real-World Examples
- [ ] Create examples/07-real-world/url-shortener/complete.ts
- [ ] Create examples/07-real-world/transaction-ids/complete.ts
- [ ] Create examples/07-real-world/session-tokens/complete.ts
- [ ] Create examples/07-real-world/README.md

## Phase 7: LLM-Native Features

### 7.1 llms.txt
- [ ] Create llms.txt in root
  - [ ] Write package description
  - [ ] Add installation instructions
  - [ ] Add basic usage
  - [ ] Add API summary
  - [ ] Add common patterns
  - [ ] Add error reference
  - [ ] Keep under 2000 tokens

### 7.2 Package Metadata
- [ ] Update package.json
  - [ ] Add 8-12 keywords
  - [ ] Optimize description for search
  - [ ] Add proper exports

### 7.3 JSDoc Comments
- [ ] Verify all public APIs have JSDoc
- [ ] Verify all JSDoc has @example
- [ ] Verify examples are runnable

## Phase 8: Documentation Website

### 8.1 Website Setup
- [ ] Create website/ directory
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Tailwind CSS
- [ ] Install prism-react-renderer
- [ ] Install lucide-react

### 8.2 Website Structure
- [ ] Create website/src/pages/ directory
- [ ] Create website/src/components/ directory
- [ ] Create website/src/styles/ directory
- [ ] Create website/public/ directory

### 8.3 Core Components
- [ ] Create Layout.tsx
  - [ ] Header with navigation
  - [ ] Theme toggle
  - [ ] Footer with MIT license

- [ ] Create CodeBlock.tsx
  - [ ] Line numbers
  - [ ] Syntax highlighting
  - [ ] Copy button
  - [ ] Theme support

- [ ] Create Navigation.tsx
  - [ ] Responsive menu
  - [ ] Section links

- [ ] Create ThemeToggle.tsx
  - [ ] Dark/light mode
  - [ ] Persist to localStorage

### 8.4 Pages
- [ ] Create Home.tsx
  - [ ] Hero section
  - [ ] Feature list
  - [ ] Quick install
  - [ ] Code examples

- [ ] Create GettingStarted.tsx
  - [ ] Installation
  - [ ] Basic usage
  - [ ] Configuration

- [ ] Create ApiReference.tsx
  - [ ] UUID documentation
  - [ ] ULID documentation
  - [ ] NanoID documentation
  - [ ] CUID2 documentation
  - [ ] Snowflake documentation
  - [ ] Short ID documentation

- [ ] Create Examples.tsx
  - [ ] Organized by category
  - [ ] Code blocks with copy

- [ ] Create Plugins.tsx
  - [ ] Core plugins
  - [ ] Optional plugins
  - [ ] Custom plugin creation

- [ ] Create Playground.tsx
  - [ ] Interactive generator
  - [ ] Algorithm selector
  - [ ] Options panel

### 8.5 Website Assets
- [ ] Copy llms.txt to website/public/
- [ ] Create favicon
- [ ] Create CNAME with uid.oxog.dev

### 8.6 Website Styling
- [ ] Configure Tailwind
- [ ] Create dark theme
- [ ] Create light theme
- [ ] Make responsive
- [ ] Add animations

### 8.7 Website Build
- [ ] Test local build
- [ ] Optimize bundle size
- [ ] Configure GitHub Pages

## Phase 9: Final Documentation

### 9.1 README.md
- [ ] Create README.md
  - [ ] Package description
  - [ ] Installation
  - [ ] Quick examples
  - [ ] Feature list
  - [ ] Link to documentation
  - [ ] Optimize first 500 tokens

### 9.2 Additional Docs
- [ ] Create CHANGELOG.md
- [ ] Create CONTRIBUTING.md

## Phase 10: Build & Verification

### 10.1 Build Verification
- [ ] Run npm run build
- [ ] Verify dist/ files
- [ ] Verify .d.ts files
- [ ] Check bundle size

### 10.2 Test Verification
- [ ] Run npm run test
- [ ] Verify all tests pass
- [ ] Run npm run test:coverage
- [ ] Verify 100% coverage

### 10.3 Type Verification
- [ ] Run npm run typecheck
- [ ] Verify no TS errors

### 10.4 Lint Verification
- [ ] Run npm run lint
- [ ] Fix any issues

### 10.5 Website Verification
- [ ] Build website
- [ ] Test all pages
- [ ] Test copy buttons
- [ ] Test theme toggle
- [ ] Test mobile responsive

### 10.6 Examples Verification
- [ ] Run all examples
- [ ] Verify outputs
- [ ] Check for errors

## Phase 11: Release Preparation

### 11.1 Version Update
- [ ] Update package.json version
- [ ] Update CHANGELOG.md

### 11.2 Git
- [ ] Create .gitignore
- [ ] Initialize git
- [ ] Create initial commit

### 11.3 GitHub Actions
- [ ] Create .github/workflows/deploy.yml
  - [ ] Test on push
  - [ ] Build package
  - [ ] Build website
  - [ ] Deploy to Pages

### 11.4 Final Checks
- [ ] All dependencies correct (zero runtime)
- [ ] All tests passing
- [ ] 100% coverage maintained
- [ ] Documentation complete
- [ ] Website builds
- [ ] Examples work

## Task Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Core) → Phase 3 (Plugins) → Phase 4 (Export)
                                              ↓
                                      Phase 5 (Testing)
                                              ↓
                                      Phase 6 (Examples)
                                              ↓
                                      Phase 7 (LLM-Native)
                                              ↓
                                      Phase 8 (Website)
                                              ↓
                                      Phase 9 (Docs)
                                              ↓
                                      Phase 10 (Verification)
                                              ↓
                                      Phase 11 (Release)
```

## Estimated Task Count

- **Total Tasks**: ~250
- **Setup Tasks**: 15
- **Core Tasks**: 40
- **Plugin Tasks**: 50
- **Test Tasks**: 60
- **Example Tasks**: 25
- **Website Tasks**: 40
- **Documentation Tasks**: 20
