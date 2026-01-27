import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    primaryColor: string;
    toggleThemeMode: () => void;
    setPrimaryColor: (color: string) => void;
    unlockedColors: { name: string; hex: string; threshold: number }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COLORS = [
    { name: 'Purple', hex: '#8b5cf6', threshold: 0 },
    { name: 'Orange', hex: '#f97316', threshold: 0 },
    { name: 'Blue', hex: '#3b82f6', threshold: 5 },
    { name: 'Green', hex: '#10b981', threshold: 10 },
    { name: 'Red', hex: '#ef4444', threshold: 20 },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { user, refreshUser } = useAuth();
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');
    const [primaryColor, setPrimaryColorState] = useState('#8b5cf6');

    // Initialize from user prefs or localStorage
    useEffect(() => {
        if (user?.preferences) {
            setThemeMode(user.preferences.themeMode);
            setPrimaryColorState(user.preferences.primaryColor);
        } else {
            const savedMode = localStorage.getItem('themeMode') as ThemeMode;
            const savedColor = localStorage.getItem('primaryColor');
            if (savedMode) setThemeMode(savedMode);
            if (savedColor) setPrimaryColorState(savedColor);
        }
    }, [user]);

    // Apply theme classes and variables to document
    useEffect(() => {
        const root = window.document.documentElement;
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--color-primary-dynamic', primaryColor);
        localStorage.setItem('primaryColor', primaryColor);
    }, [primaryColor]);

    const toggleThemeMode = async () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);

        if (user) {
            await authService.updatePreferences({ themeMode: newMode, primaryColor });
            refreshUser();
        }
    };

    const setPrimaryColor = async (color: string) => {
        setPrimaryColorState(color);

        if (user) {
            await authService.updatePreferences({ themeMode, primaryColor: color });
            refreshUser();
        }
    };

    const unlockedColors = THEME_COLORS.filter(color =>
        (user?.insightPoints || 0) >= color.threshold || color.threshold === 0
    );

    return (
        <ThemeContext.Provider value={{
            themeMode,
            primaryColor,
            toggleThemeMode,
            setPrimaryColor,
            unlockedColors
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
