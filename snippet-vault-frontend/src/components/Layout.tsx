import { Outlet, Link } from 'react-router-dom';
import { Code2, Plus, LogIn, LogOut, User, Sun, Moon, Palette, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InsightProgress from './InsightProgress';

export default function Layout() {
  const { user, logout } = useAuth();
  const { themeMode, toggleThemeMode, setPrimaryColor } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg transition-colors">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">SnippetVault</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
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
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
