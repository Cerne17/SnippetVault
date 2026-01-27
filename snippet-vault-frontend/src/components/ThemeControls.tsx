import { Sun, Moon, Palette, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ThemeControlsProps {
    isMobile?: boolean;
}

export default function ThemeControls({ isMobile }: ThemeControlsProps) {
    const { user } = useAuth();
    const { themeMode, toggleThemeMode, setPrimaryColor, primaryColor, unlockedColors } = useTheme();

    if (isMobile) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme Mode</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleThemeMode}
                        className="gap-2 bg-slate-50 dark:bg-slate-800"
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
                        {unlockedColors.map((color) => {
                            const isUnlocked = true; // Context already filters unlocked
                            return (
                                <button
                                    key={color.hex}
                                    onClick={() => setPrimaryColor(color.hex)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all relative ${isUnlocked ? 'hover:scale-110 cursor-pointer border-transparent' : 'opacity-40 grayscale cursor-not-allowed border-slate-200'
                                        }`}
                                    style={{ backgroundColor: color.hex, borderColor: primaryColor === color.hex ? 'white' : 'transparent' }}
                                    title={color.name}
                                >
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
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
                    {unlockedColors.map((color) => (
                        <button
                            key={color.hex}
                            onClick={() => setPrimaryColor(color.hex)}
                            title={`Switch to ${color.name}`}
                            className="w-4 h-4 rounded-full border-2 border-transparent transition-all hover:scale-125 cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                        >
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
