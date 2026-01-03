import { CodeBlock } from '../components/CodeBlock';
import { Code2, Hash, Clock, Zap, Shield, Layers } from 'lucide-react';

interface ApiReferenceProps {
  isDark: boolean;
}

const algorithms = [
  {
    id: 'uuid',
    name: 'UUID',
    icon: Hash,
    gradient: 'from-blue-500 to-cyan-500',
    desc: 'RFC 4122 UUID v4 (random) or RFC 9562 UUID v7 (time-sortable)',
    methods: [
      { name: 'uid.uuid()', desc: 'Generate UUID v4' },
      { name: 'uid.uuid.v4()', desc: 'Generate UUID v4 (alias)' },
      { name: 'uid.uuid.v7()', desc: 'Generate UUID v7' },
      { name: 'uid.uuid.v7({ timestamp })', desc: 'Generate UUID v7 with custom timestamp' },
      { name: 'uid.uuid.isValid(id)', desc: 'Validate UUID string' },
      { name: 'uid.uuid.parse(id)', desc: 'Parse UUID to components' },
    ],
    code: `// Generate UUID v4
uid.uuid();
uid.uuid.v4();

// Generate UUID v7
uid.uuid.v7();
uid.uuid.v7({ timestamp: Date.now() });

// Validate
uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000'); // true

// Parse
const parsed = uid.uuid.parse('550e8400-e29b-41d4-a716-446655440000');
// { version: 4, variant: 'RFC4122', bytes: Uint8Array }`,
  },
  {
    id: 'ulid',
    name: 'ULID',
    icon: Layers,
    gradient: 'from-green-500 to-emerald-500',
    desc: 'Universally Unique Lexicographically Sortable Identifier',
    methods: [
      { name: 'uid.ulid()', desc: 'Generate ULID' },
      { name: 'uid.ulid({ timestamp })', desc: 'Generate ULID with custom timestamp' },
      { name: 'uid.ulid.monotonic()', desc: 'Generate monotonic ULID (guaranteed increasing)' },
      { name: 'uid.ulid.isValid(id)', desc: 'Validate ULID string' },
      { name: 'uid.ulid.timestamp(id)', desc: 'Extract timestamp from ULID' },
    ],
    code: `// Generate ULID
uid.ulid();
uid.ulid({ timestamp: Date.now() });

// Monotonic (guaranteed increasing)
uid.ulid.monotonic();

// Validate
uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'); // true

// Extract timestamp
const timestamp = uid.ulid.timestamp('01ARZ3NDEKTSV4RRFFQ69G5FAV');`,
  },
  {
    id: 'nanoid',
    name: 'NanoID',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500',
    desc: 'Compact, URL-friendly unique ID with customizable alphabet',
    methods: [
      { name: 'uid.nanoid()', desc: 'Generate 21-character NanoID' },
      { name: 'uid.nanoid(size)', desc: 'Generate NanoID with custom size' },
      { name: 'uid.nanoid.custom({ alphabet, size })', desc: 'Generate with custom alphabet and size' },
      { name: 'uid.nanoid.urlSafe(size)', desc: 'Generate URL-safe NanoID' },
    ],
    code: `// Default (21 chars)
uid.nanoid();

// Custom size
uid.nanoid(10);

// Custom alphabet
uid.nanoid.custom({ alphabet: 'abc123', size: 8 });

// URL-safe (explicit)
uid.nanoid.urlSafe(12);`,
  },
  {
    id: 'cuid2',
    name: 'CUID2',
    icon: Shield,
    gradient: 'from-red-500 to-pink-500',
    desc: 'Next-generation collision-resistant ID',
    methods: [
      { name: 'uid.cuid2()', desc: 'Generate 24-character CUID2' },
      { name: 'uid.cuid2({ length })', desc: 'Generate with custom length (24-32)' },
      { name: 'uid.cuid2({ fingerprint })', desc: 'Generate with custom fingerprint' },
      { name: 'uid.cuid2.isValid(id)', desc: 'Validate CUID2 string' },
    ],
    code: `// Default (24 chars)
uid.cuid2();

// Custom length (24-32)
uid.cuid2({ length: 32 });

// With fingerprint
uid.cuid2({ fingerprint: 'my-machine-id' });

// Validate
uid.cuid2.isValid('clh3am5yk0000qj1f8b9g2n7p'); // true`,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    icon: Clock,
    gradient: 'from-purple-500 to-violet-500',
    desc: 'Twitter-style 64-bit distributed unique IDs',
    methods: [
      { name: 'uid.snowflake.configure({ workerId, datacenterId, epoch })', desc: 'Configure Snowflake generator' },
      { name: 'uid.snowflake()', desc: 'Generate Snowflake ID as string' },
      { name: 'uid.snowflake.bigint()', desc: 'Generate Snowflake ID as BigInt' },
      { name: 'uid.snowflake.parse(id)', desc: 'Parse Snowflake ID to components' },
    ],
    code: `// Configure
uid.snowflake.configure({
  workerId: 1,        // 0-31
  datacenterId: 1,    // 0-31
  epoch: 1609459200000 // Custom epoch
});

// Generate
uid.snowflake();       // '1234567890123456789'
uid.snowflake.bigint(); // 1234567890123456789n

// Parse
const parsed = uid.snowflake.parse('1234567890123456789');
// { timestamp: Date, workerId: 1, datacenterId: 1, sequence: 0 }`,
  },
  {
    id: 'short',
    name: 'Short IDs',
    icon: Code2,
    gradient: 'from-pink-500 to-rose-500',
    desc: 'Human-readable short IDs using Base58 or Base62 encoding',
    methods: [
      { name: 'uid.short()', desc: 'Generate 11-character Base58 ID' },
      { name: 'uid.short(size)', desc: 'Generate with custom size' },
      { name: 'uid.short.youtube()', desc: 'Generate YouTube-style Base64 URL-safe ID' },
      { name: 'uid.short.base62(size)', desc: 'Generate Base62 (alphanumeric only)' },
      { name: 'uid.short.base58(size)', desc: 'Generate Base58 (no confusing chars)' },
    ],
    code: `// Default (Base58, 11 chars)
uid.short();

// Custom size
uid.short(8);

// YouTube-style (Base64 URL-safe)
uid.short.youtube();

// Base62 (alphanumeric only)
uid.short.base62(10);

// Base58 (no confusing chars)
uid.short.base58(8);`,
  },
];

export function ApiReference({ isDark }: ApiReferenceProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />
        <div className="relative container-custom max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Code2 className="w-4 h-4" />
            <span>API Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            API Reference
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete API documentation for all ID generation algorithms.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-8 sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {algorithms.map((algo) => (
              <a
                key={algo.id}
                href={`#${algo.id}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  algo.id === 'uuid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <algo.icon className="w-4 h-4" />
                {algo.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* API Sections */}
      <div className="container-custom max-w-5xl py-16 space-y-20">
        {algorithms.map((algo, index) => {
          const Icon = algo.icon;
          return (
            <section id={algo.id} key={algo.id} className="scroll-mt-32 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${algo.gradient} shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{algo.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{algo.desc}</p>
                </div>
              </div>

              {/* Methods Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {algo.methods.map((method, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <code className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">
                      {method.name}
                    </code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{method.desc}</p>
                  </div>
                ))}
              </div>

              {/* Code Example */}
              <CodeBlock code={algo.code} isDark={isDark} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
