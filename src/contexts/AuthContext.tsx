'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
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

  // Función para verificar si el token es válido
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  // Verificar si hay usuario guardado al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('takopi_user');
      const savedToken = localStorage.getItem('takopi_token');
      
      if (savedUser && savedToken) {
        // Verificar si el token sigue siendo válido
        const isValid = await verifyToken(savedToken);
        
        if (isValid) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token expirado, limpiar datos
          console.log('Token expirado, limpiando datos de autenticación');
          localStorage.removeItem('takopi_user');
          localStorage.removeItem('takopi_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('takopi_user', JSON.stringify(userData.user));
        localStorage.setItem('takopi_token', userData.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('takopi_user', JSON.stringify(userData.user));
        localStorage.setItem('takopi_token', userData.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    // Limpiar estado del usuario
    setUser(null);

    // Limpiar localStorage completamente (más seguridad)
    localStorage.removeItem('takopi_user');
    localStorage.removeItem('takopi_token');
    localStorage.removeItem('takopi_debug_logs'); // Limpiar logs de debug también

    // Redirigir a la página principal
    window.location.href = '/';
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
