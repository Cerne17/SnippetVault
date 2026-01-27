import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginDto, RegisterDto } from '../types/auth';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        refreshUser();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginDto) => {
    const response = await authService.login(data);
    localStorage.setItem('token', response.access_token);
    await refreshUser();
  };

  const register = async (data: RegisterDto) => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.access_token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
