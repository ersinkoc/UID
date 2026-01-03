import { ArrowRight, Zap, Shield, Code2, Layers, Sparkles, TrendingUp, Cpu, Check } from 'lucide-react';
import { Link } from '../components/Link';
import { CodeBlock } from '../components/CodeBlock';

interface HomeProps {
  onPageChange: (page: string) => void;
  isDark?: boolean;
}

const features = [
  {
    icon: Zap,
    title: 'Zero Dependencies',
    description: 'All algorithms implemented from scratch. No uuid, no nanoid - pure TypeScript.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Cryptographically Secure',
    description: 'Uses crypto.getRandomValues() or crypto.randomBytes() for secure random generation.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Code2,
    title: 'Type-Safe',
    description: 'Full TypeScript with strict mode enabled. Comprehensive type definitions included.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'Multiple Algorithms',
    description: 'UUID v4/v7, ULID, NanoID, CUID2, Snowflake, and Short IDs in one package.',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const algorithms = [
  { name: 'UUID v4', desc: 'RFC 4122 random UUID', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { name: 'UUID v7', desc: 'RFC 9562 time-sortable', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { name: 'ULID', desc: 'Crockford Base32, sortable', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { name: 'NanoID', desc: 'URL-safe, customizable', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  { name: 'CUID2', desc: 'Collision-resistant', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  { name: 'Snowflake', desc: 'Twitter-style 64-bit', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
];

export function Home({ onPageChange }: HomeProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />

        <div className="relative container-custom py-24 lg:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Zero-Dependency Unique ID Generation</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up">
              The Ultimate
              <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unique ID Library
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Comprehensive unique identifier library implementing UUID v4/v7, ULID, NanoID,
              CUID2, Snowflake IDs, and short IDs with custom alphabet support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                onClick={() => onPageChange('getting-started')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg shadow-primary-500/25 transition-all duration-200 hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                onClick={() => onPageChange('api')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Code2 className="w-5 h-5" />
                View API
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {[
                { label: 'Algorithms', value: '6+' },
                { label: 'Bundle Size', value: '<5KB' },
                { label: 'Dependencies', value: '0' },
                { label: 'Type Safe', value: '100%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Example Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                <Code2 className="w-4 h-4" />
                Quick Start
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Generate IDs in Seconds
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Get started with just a few lines of code. All algorithms are available
                through the same clean, intuitive API.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Import and use immediately',
                  'Choose from 6 different algorithms',
                  'Customizable alphabets and sizes',
                  'Built-in validation and parsing'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Code */}
            <CodeBlock
              code={`import { uid } from '@oxog/uid';

// UUID v4 (random)
uid.uuid();     // '550e8400-e29b-41d4-a716-446655440000'

// UUID v7 (time-sortable)
uid.uuid.v7();  // '018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b'

// ULID (sortable)
uid.ulid();     // '01ARZ3NDEKTSV4RRFFQ69G5FAV'

// NanoID (URL-safe)
uid.nanoid();   // 'V1StGXR8_Z5jdHi6B-myT'`}
              filename="typescript"
              language="typescript"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose @oxog/uid?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Built for modern applications with performance, security, and developer experience in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Install the package and start generating unique IDs in seconds.
            </p>
          </div>

          <CodeBlock
            code={`npm install @oxog/uid`}
            language="bash"
            filename="terminal"
          />
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Supported Algorithms
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              All major ID generation algorithms in one package. Choose the one that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {algorithms.map((algo, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg group"
              >
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${algo.color} mb-3 group-hover:scale-105 transition-transform`}>
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm font-semibold">{algo.name}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{algo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Generating Unique IDs Today
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join developers who trust @oxog/uid for their unique ID generation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              onClick={() => onPageChange('getting-started')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-primary-600 bg-white hover:bg-gray-50 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5" />
              Get Started
            </Link>
            <a
              href="https://github.com/ersinkoc/uid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              <Code2 className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
