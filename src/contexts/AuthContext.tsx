'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  banner?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser?: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para verificar si el token es válido
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return true;
      } else {
        console.log('Token verification failed with status:', response.status);
        return false;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Token verification timeout');
      } else {
        console.error('Token verification error:', error);
      }
      // En caso de error de red, asumir que el token es inválido
      return false;
    }
  };

  // Verificar si hay usuario guardado al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('takopi_user');
        const savedToken = localStorage.getItem('takopi_token');

        if (savedUser && savedToken) {
          // Validar que sea JSON válido antes de parsear
          if (!savedUser.startsWith('{') && !savedUser.startsWith('[')) {
            console.warn('Datos de usuario corruptos, limpiando sesión');
            localStorage.removeItem('takopi_user');
            localStorage.removeItem('takopi_token');
            setIsLoading(false);
            return;
          }

          // Verificar si el token sigue siendo válido
          const isValid = await verifyToken(savedToken);

          if (isValid) {
            try {
              const userData = JSON.parse(savedUser);
              // Verificar si el token tiene información básica del usuario
              if (!userData.username) {
                // Token incompleto, limpiar sesión para forzar nuevo login
                console.log('Token incompleto detectado, limpiando sesión...');
                localStorage.removeItem('takopi_user');
                localStorage.removeItem('takopi_token');
              } else {
                setUser(userData);
              }
            } catch (error) {
              console.error('Error parseando datos de usuario:', error);
              localStorage.removeItem('takopi_user');
              localStorage.removeItem('takopi_token');
            }
          } else {
            // Token expirado, limpiar datos
            console.log('Token expirado, limpiando datos de autenticación');
            localStorage.removeItem('takopi_user');
            localStorage.removeItem('takopi_token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        // En caso de error, limpiar datos y continuar sin autenticación
        localStorage.removeItem('takopi_user');
        localStorage.removeItem('takopi_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
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

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('takopi_user', JSON.stringify(data.user));
        localStorage.setItem('takopi_token', data.token);
        return true;
      } else {
        // Lanzar error con el mensaje del servidor
        throw new Error(data.error || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error; // Re-lanzar para que el componente pueda mostrarlo
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

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('takopi_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUser }}>
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
