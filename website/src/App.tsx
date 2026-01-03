import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { GettingStarted } from './pages/GettingStarted';
import { ApiReference } from './pages/ApiReference';
import { Examples } from './pages/Examples';
import { Plugins } from './pages/Plugins';
import { Playground } from './pages/Playground';

type Page = 'home' | 'getting-started' | 'api' | 'examples' | 'plugins' | 'playground';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handlePageChange = (newPage: string) => {
    setPage(newPage as Page);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home onPageChange={handlePageChange} isDark={isDark} />;
      case 'getting-started':
        return <GettingStarted isDark={isDark} />;
      case 'api':
        return <ApiReference isDark={isDark} />;
      case 'examples':
        return <Examples isDark={isDark} />;
      case 'plugins':
        return <Plugins isDark={isDark} />;
      case 'playground':
        return <Playground isDark={isDark} />;
      default:
        return <Home onPageChange={handlePageChange} isDark={isDark} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentPage={page} onPageChange={handlePageChange} isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
