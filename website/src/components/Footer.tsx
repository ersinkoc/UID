import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <code className="font-semibold">@oxog/uid</code> — MIT License © 2025 Ersin Koç
            </p>
          </div>

          <a
            href="https://github.com/ersinkoc/uid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
