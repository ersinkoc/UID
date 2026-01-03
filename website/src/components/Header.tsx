import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link } from './Link';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'api', label: 'API Reference' },
  { id: 'examples', label: 'Examples' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'playground', label: 'Playground' },
];

export function Header({ currentPage, onPageChange, isDark, onThemeToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link onClick={() => onPageChange('home')} className="flex items-center space-x-2">
              <code className="text-xl font-bold text-primary-600 dark:text-primary-400">@oxog/uid</code>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={
                  currentPage === item.id
                    ? 'px-3 py-2 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={
                  currentPage === item.id
                    ? 'block px-3 py-2 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
