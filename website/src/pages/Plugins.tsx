import { CodeBlock } from '../components/CodeBlock';
import { Puzzle, CheckCircle2, Wrench, Sparkles, Zap } from 'lucide-react';

interface PluginsProps {
  isDark: boolean;
}

const corePlugins = [
  { name: 'UUID', desc: 'UUID v4/v7 generation', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'ULID', desc: 'Sortable ULID generation', gradient: 'from-green-500 to-emerald-500' },
  { name: 'NanoID', desc: 'URL-safe IDs', gradient: 'from-yellow-500 to-orange-500' },
];

const optionalPlugins = [
  { name: 'CUID2', desc: 'Collision-resistant IDs', gradient: 'from-red-500 to-pink-500' },
  { name: 'Snowflake', desc: 'Distributed 64-bit IDs', gradient: 'from-purple-500 to-violet-500' },
  { name: 'Short', desc: 'Base58/62 short IDs', gradient: 'from-pink-500 to-rose-500' },
];

export function Plugins({ isDark }: PluginsProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />
        <div className="relative container-custom max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Puzzle className="w-4 h-4" />
            <span>Plugin System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Plugins Architecture
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extend @oxog/uid functionality with a powerful plugin system.
          </p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-16 space-y-16">
        {/* Core Plugins */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Core Plugins</h2>
              <p className="text-gray-600 dark:text-gray-400">Loaded by default when you import @oxog/uid</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {corePlugins.map((plugin) => (
              <div
                key={plugin.name}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plugin.gradient} mb-4`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plugin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plugin.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-primary-700 dark:text-primary-300">No setup required:</strong> Core plugins are
              automatically available when you import from <code className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/40">@oxog/uid</code>.
            </p>
          </div>
        </section>

        {/* Optional Plugins */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Optional Plugins</h2>
              <p className="text-gray-600 dark:text-gray-400">Explicitly import and register these plugins</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {optionalPlugins.map((plugin) => (
              <div
                key={plugin.name}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plugin.gradient} mb-4`}>
                  <Puzzle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plugin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plugin.desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock
            code={`import { uid } from '@oxog/uid';
import { cuid2Plugin, snowflakePlugin, shortPlugin } from '@oxog/uid/plugins';

// Register optional plugins
uid.use(cuid2Plugin);
uid.use(snowflakePlugin);
uid.use(shortPlugin);

// Now you can use them
uid.cuid2();
uid.snowflake.configure({ workerId: 1, datacenterId: 1 });
uid.snowflake();
uid.short();`}
            isDark={isDark}
          />
        </section>

        {/* Creating Custom Plugins */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Creating Custom Plugins</h2>
              <p className="text-gray-600 dark:text-gray-400">Build your own plugins to extend functionality</p>
            </div>
          </div>

          <CodeBlock
            code={`import type { UidPlugin, UidKernel } from '@oxog/uid';

const myPlugin: UidPlugin = {
  name: 'my-algorithm',
  version: '1.0.0',
  install(kernel: UidKernel) {
    // Register your API
    kernel.registerApi('myAlgo', () => {
      const bytes = kernel.random(16);
      return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    });
  }
};

// Use your plugin
uid.use(myPlugin);
uid.getApi<() => string>('myAlgo')();`}
            isDark={isDark}
          />
        </section>

        {/* Plugin Management */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Puzzle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Plugin Management</h2>
              <p className="text-gray-600 dark:text-gray-400">List, check, and unregister plugins</p>
            </div>
          </div>

          <CodeBlock
            code={`// Register plugin
uid.use(snowflakePlugin);

// List all plugins
const plugins = uid.list();
console.log(plugins); // ['uuid', 'ulid', 'nanoid', 'snowflake']

// Check if plugin exists
const hasSnowflake = uid.has('snowflake');
console.log(hasSnowflake); // true

// Unregister plugin
uid.unregister('snowflake');`}
            isDark={isDark}
          />
        </section>
      </div>
    </div>
  );
}
