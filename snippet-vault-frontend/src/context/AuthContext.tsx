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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            _id: decoded.sub,
            email: decoded.email,
            name: decoded.name || 'User', // Name might not be in token depending on backend implementation
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginDto) => {
    const response = await authService.login(data);
    localStorage.setItem('token', response.access_token);
    const decoded = jwtDecode<any>(response.access_token);
    setUser({
      _id: decoded.sub,
      email: decoded.email,
      name: decoded.name || 'User',
    });
  };

  const register = async (data: RegisterDto) => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.access_token);
    const decoded = jwtDecode<any>(response.access_token);
    setUser({
      _id: decoded.sub,
      email: decoded.email,
      name: decoded.name || 'User',
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
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
