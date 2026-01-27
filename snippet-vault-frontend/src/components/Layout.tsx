import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2, Plus, LogIn, LogOut, User, Sun, Moon, Palette, Lock, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InsightProgress from './InsightProgress';

export default function Layout() {
  const { user, logout } = useAuth();
  const { themeMode, toggleThemeMode, setPrimaryColor, primaryColor } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-primary p-2 rounded-lg transition-colors">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">SnippetVault</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {/* Theme & Color Controls */}
              <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleThemeMode}
                  title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
                >
                  {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>

                <div className="flex items-center gap-1.5 ml-2">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex items-center gap-1">
                    {[
                      { name: 'Purple', hex: '#8b5cf6', threshold: 0 },
                      { name: 'Orange', hex: '#f97316', threshold: 0 },
                      { name: 'Blue', hex: '#3b82f6', threshold: 5 },
                      { name: 'Green', hex: '#10b981', threshold: 10 },
                      { name: 'Red', hex: '#ef4444', threshold: 20 },
                    ].map((color) => {
                      const isUnlocked = (user?.insightPoints || 0) >= color.threshold || color.threshold === 0;
                      return (
                        <button
                          key={color.hex}
                          onClick={() => isUnlocked && setPrimaryColor(color.hex)}
                          disabled={!isUnlocked}
                          title={isUnlocked ? `Switch to ${color.name}` : `Unlock at ${color.threshold} Insights`}
                          className={`w-4 h-4 rounded-full border-2 transition-all relative ${isUnlocked
                            ? 'hover:scale-125 cursor-pointer border-transparent'
                            : 'opacity-40 grayscale cursor-not-allowed border-slate-200'
                            }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {!isUnlocked && <Lock className="absolute inset-0 w-2 h-2 m-auto text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {user ? (
                <>
                  <div className="hidden lg:block border-r border-slate-100 pr-6 h-10 my-auto">
                    <InsightProgress points={user.insightPoints} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline font-bold text-slate-900">{user.name}</span>
                  </div>
                  <Link to="/create">
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Snippet
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
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
            <div className="px-4 pt-2 pb-6 space-y-4">
              {user && (
                <div className="py-3 border-b border-slate-100 dark:border-slate-800">
                  <InsightProgress points={user.insightPoints} />
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme Mode</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleThemeMode}
                    className="gap-2"
                  >
                    {themeMode === 'light' ? (
                      <><Moon className="w-4 h-4" /> Dark Mode</>
                    ) : (
                      <><Sun className="w-4 h-4" /> Light Mode</>
                    )}
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Primary Color
                  </span>
                  <div className="flex items-center gap-3 py-1">
                    {[
                      { name: 'Purple', hex: '#8b5cf6', threshold: 0 },
                      { name: 'Orange', hex: '#f97316', threshold: 0 },
                      { name: 'Blue', hex: '#3b82f6', threshold: 5 },
                      { name: 'Green', hex: '#10b981', threshold: 10 },
                      { name: 'Red', hex: '#ef4444', threshold: 20 },
                    ].map((color) => {
                      const isUnlocked = (user?.insightPoints || 0) >= color.threshold || color.threshold === 0;
                      return (
                        <button
                          key={color.hex}
                          onClick={() => isUnlocked && setPrimaryColor(color.hex)}
                          disabled={!isUnlocked}
                          className={`w-8 h-8 rounded-full border-2 transition-all relative ${isUnlocked
                            ? 'hover:scale-110 cursor-pointer border-transparent'
                            : 'opacity-40 grayscale cursor-not-allowed border-slate-200'
                            }`}
                          style={{ backgroundColor: color.hex, borderColor: primaryColor === color.hex ? 'white' : 'transparent' }}
                        >
                          {!isUnlocked && <Lock className="absolute inset-0 w-3 h-3 m-auto text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {user ? (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                    </div>
                    <Link to="/create" onClick={() => setIsMenuOpen(false)} className="block">
                      <Button className="w-full gap-2">
                        <Plus className="w-4 h-4" />
                        New Snippet
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full gap-2 text-red-600" onClick={() => { logout(); setIsMenuOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
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
