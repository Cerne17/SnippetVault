import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import ThemeControls from './ThemeControls';
import UserNavigation from './UserNavigation';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-900 dark:text-white">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-primary p-2 rounded-lg transition-colors">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">SnippetVault</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeControls />
              <UserNavigation />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-6">
              <ThemeControls isMobile />
              <UserNavigation isMobile onCloseMobileMenu={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
