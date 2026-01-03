import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { CodeBlock as CodeshineCodeBlock } from '@oxog/codeshine/react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  isDark?: boolean;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  isDark = true,
  showLineNumbers = true,
  highlightLines = []
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  // Use appropriate theme based on dark/light mode
  const theme = isDark ? 'github-dark' : 'github-light';

  return (
    <div className="code-block my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark
          ? 'bg-gray-800/50 border-gray-800'
          : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          {/* Language indicator */}
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${
            isDark
              ? 'bg-primary-900/30 text-primary-400'
              : 'bg-primary-100 text-primary-700'
          }`}>
            {filename || language}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
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
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="codeshine-wrapper">
        <CodeshineCodeBlock
          code={code}
          language={language}
          theme={theme}
          lineNumbers={showLineNumbers}
          highlightLines={highlightLines}
        />
      </div>
    </div>
  );
}
