'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay usuario guardado al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('takopi_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular autenticación (en producción sería una llamada a API)
    if (email && password) {
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email: email,
        role: 'Explorer'
      };

      setUser(mockUser);
      localStorage.setItem('takopi_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, role: string): Promise<boolean> => {
    // Simular registro (en producción sería una llamada a API)
    if (username && email && password) {
      const mockUser: User = {
        id: '1',
        username: username,
        email: email,
        role: role
      };

      setUser(mockUser);
      localStorage.setItem('takopi_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('takopi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
