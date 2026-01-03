import { useState } from 'react';
import { Copy, Check, Play, RefreshCw } from 'lucide-react';

type Algorithm = 'uuid' | 'uuid-v7' | 'ulid' | 'nanoid' | 'cuid2' | 'short';

interface PlaygroundProps {
  isDark?: boolean;
}

const algorithms = [
  { id: 'uuid', name: 'UUID v4', desc: 'RFC 4122 random UUID', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'uuid-v7', name: 'UUID v7', desc: 'RFC 9562 time-sortable', gradient: 'from-purple-500 to-violet-500' },
  { id: 'ulid', name: 'ULID', desc: 'Crockford Base32, sortable', gradient: 'from-green-500 to-emerald-500' },
  { id: 'nanoid', name: 'NanoID', desc: 'URL-safe, 21 chars', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'cuid2', name: 'CUID2', desc: 'Collision-resistant', gradient: 'from-red-500 to-pink-500' },
  { id: 'short', name: 'Short ID', desc: 'Base58, 11 chars', gradient: 'from-pink-500 to-rose-500' },
];

export function Playground({ isDark: _isDark }: PlaygroundProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>('uuid');
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIds = () => {
    setIsGenerating(true);
    // Simulate async generation
    setTimeout(() => {
      const generated: string[] = [];
      for (let i = 0; i < count; i++) {
        generated.push(generateMockId(algorithm));
      }
      setIds(generated);
      setIsGenerating(false);
    }, 100);
  };

  const generateMockId = (algo: Algorithm): string => {
    const hex = () => Math.random().toString(16).slice(2);
    const base32 = () => '0123456789ABCDEFGHJKMNPQRSTVWXYZ'[Math.floor(Math.random() * 32)];
    const base58 = () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)];

    switch (algo) {
      case 'uuid':
        return [
          hex().padStart(8, '0'),
          hex().padStart(4, '0'),
          '4' + hex().slice(1, 4),
          '8' + hex().slice(1, 4),
          hex().padStart(12, '0'),
        ].join('-');

      case 'uuid-v7':
        return [
          hex().padStart(8, '0'),
          hex().padStart(4, '0'),
          '7' + hex().slice(1, 4),
          '8' + hex().slice(1, 4),
          hex().padStart(12, '0'),
        ].join('-');

      case 'ulid':
        return Array(26).fill(0).map(() => base32()).join('');

      case 'nanoid':
        return Array(21).fill(0).map(() =>
          'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjwW'[Math.floor(Math.random() * 64)]
        ).join('');

      case 'cuid2':
        return 'clh' + Array(21).fill(0).map(() => hex()[0]).join('');

      case 'short':
        return Array(11).fill(0).map(() => base58()).join('');

      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(ids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedAlgo = algorithms.find((a) => a.id === algorithm)!;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />
        <div className="relative container-custom max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Play className="w-4 h-4" />
            <span>Interactive Demo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ID Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Try out different ID generation algorithms and see the output in real-time.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom max-w-4xl py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Algorithm Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className={`p-2 rounded-lg bg-gradient-to-br ${selectedAlgo.gradient}`}>
                <Play className="w-5 h-5 text-white" />
              </span>
              Select Algorithm
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {algorithms.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id as Algorithm)}
                  className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                    algorithm === algo.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${algo.gradient} mb-3 group-hover:scale-110 transition-transform`}>
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">{algo.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{algo.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Options
            </h2>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{count}</span> IDs
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1</span>
                <span>100</span>
              </div>

              <button
                onClick={generateIds}
                disabled={isGenerating}
                className={`mt-6 w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate IDs
                  </>
                )}
              </button>
            </div>

            {/* Info Card */}
            <div className={`mt-6 p-5 rounded-2xl border bg-gradient-to-br ${selectedAlgo.gradient} bg-opacity-10 border-opacity-20`}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedAlgo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedAlgo.desc}</p>
            </div>
          </div>
        </div>

        {/* Output */}
        {ids.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {ids.length} {selectedAlgo.name} ID{ids.length !== 1 ? 's' : ''} Generated
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
              <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                {ids.map((id, i) => (
                  <div key={i} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    {id}
                  </div>
                ))}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
