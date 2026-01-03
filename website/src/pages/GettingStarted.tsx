import { CodeBlock } from '../components/CodeBlock';
import { Download, Rocket, Settings, Zap, CheckCircle2, BookOpen } from 'lucide-react';

interface GettingStartedProps {
  isDark: boolean;
}

export function GettingStarted({ isDark }: GettingStartedProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />
        <div className="relative container-custom max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Quick Start Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Getting Started with @oxog/uid
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate unique IDs in seconds with our zero-dependency, type-safe library.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom max-w-4xl py-16">
        {/* Installation */}
        <section className="mb-16 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Installation</h2>
              <p className="text-gray-600 dark:text-gray-400">Install via npm, yarn, or pnpm</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <CodeBlock code={`npm install @oxog/uid`} language="bash" filename="npm" isDark={isDark} />
            <CodeBlock code={`yarn add @oxog/uid`} language="bash" filename="yarn" isDark={isDark} />
            <CodeBlock code={`pnpm add @oxog/uid`} language="bash" filename="pnpm" isDark={isDark} />
          </div>
        </section>

        {/* Basic Usage */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Basic Usage</h2>
              <p className="text-gray-600 dark:text-gray-400">Start generating IDs immediately</p>
            </div>
          </div>

          <CodeBlock
            code={`import { uid } from '@oxog/uid';

// UUID v4 (random)
const id1 = uid.uuid();
console.log(id1); // '550e8400-e29b-41d4-a716-446655440000'

// UUID v7 (time-sortable)
const id2 = uid.uuid.v7();
console.log(id2); // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'

// ULID (sortable)
const id3 = uid.ulid();
console.log(id3); // '01ARZ3NDEKTSV4RRFFQ69G5FAV'

// NanoID (URL-safe)
const id4 = uid.nanoid();
console.log(id4); // 'V1StGXR8_Z5jdHi6B-myT'`}
            isDark={isDark}
          />
        </section>

        {/* Core vs Optional Plugins */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Plugin System</h2>
              <p className="text-gray-600 dark:text-gray-400">Core plugins are loaded by default</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-primary-200 dark:border-primary-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Core Plugins (Default)
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  UUID v4/v7
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  ULID
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  NanoID
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Optional Plugins
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  CUID2
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Snowflake
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Short IDs
                </li>
              </ul>
            </div>
          </div>

          <CodeBlock
            code={`import { uid } from '@oxog/uid';
import { cuid2Plugin, snowflakePlugin, shortPlugin } from '@oxog/uid/plugins';

// Load optional plugins
uid.use(cuid2Plugin);
uid.use(snowflakePlugin);
uid.use(shortPlugin);

// Use CUID2
const cuid = uid.cuid2();

// Use Snowflake (needs configuration)
uid.snowflake.configure({
  workerId: 1,
  datacenterId: 1
});
const snowflake = uid.snowflake();

// Use Short ID
const shortId = uid.short();`}
            isDark={isDark}
          />
        </section>

        {/* Validation */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Validation & Parsing</h2>
              <p className="text-gray-600 dark:text-gray-400">Built-in validation for all ID formats</p>
            </div>
          </div>

          <CodeBlock
            code={`// Validate UUID
const isValidUuid = uid.uuid.isValid('550e8400-e29b-41d4-a716-446655440000');
console.log(isValidUuid); // true

// Validate ULID
const isValidUlid = uid.ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV');
console.log(isValidUlid); // true

// Parse UUID
const parsed = uid.uuid.parse('550e8400-e29b-41d4-a716-446655440000');
console.log(parsed);
// { version: 4, variant: 'RFC4122', bytes: Uint8Array }`}
            isDark={isDark}
          />
        </section>

        {/* Custom Alphabets */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Customization</h2>
              <p className="text-gray-600 dark:text-gray-400">Custom alphabets and sizes</p>
            </div>
          </div>

          <CodeBlock
            code={`// Generate hexadecimal IDs
const hexId = uid.nanoid.custom({
  alphabet: '0123456789abcdef',
  size: 16
});
console.log(hexId); // 'a3f8b2c1e9d4f7a0'

// Generate numeric-only IDs
const numericId = uid.nanoid.custom({
  alphabet: '0123456789',
  size: 12
});
console.log(numericId); // '123456789012'`}
            isDark={isDark}
          />
        </section>
      </div>
    </div>
  );
}
