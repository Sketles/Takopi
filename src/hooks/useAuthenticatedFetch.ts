'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para realizar peticiones HTTP autenticadas
 * 
 * Centraliza:
 * - Obtención del token de localStorage
 * - Headers de autorización
 * - Manejo de errores 401 (redirect a login)
 * - Redirect automático si no está autenticado
 * 
 * @example
 * const { authFetch, getToken, isAuthenticated } = useAuthenticatedFetch();
 * 
 * // Fetch autenticado
 * const response = await authFetch('/api/user/profile');
 * 
 * // Solo obtener token
 * const token = getToken();
 * 
 * // Verificar auth antes de acción
 * if (!isAuthenticated) {
 *   redirectToLogin('/my-redirect-path');
 *   return;
 * }
 */
export function useAuthenticatedFetch() {
  const { user } = useAuth();
  const router = useRouter();

  /**
   * Obtiene el token de localStorage
   */
  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('takopi_token');
  }, []);

  /**
   * Verifica si el usuario está autenticado
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!user && !!getToken();
  }, [user, getToken]);

  /**
   * Redirige a login con URL de retorno
   */
  const redirectToLogin = useCallback((returnUrl?: string) => {
    const redirect = returnUrl || window.location.pathname;
    router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
  }, [router]);

  /**
   * Verifica autenticación y redirige si no está autenticado
   * @returns true si está autenticado, false si redirigió
   */
  const requireAuth = useCallback((returnUrl?: string): boolean => {
    if (!isAuthenticated()) {
      redirectToLogin(returnUrl);
      return false;
    }
    return true;
  }, [isAuthenticated, redirectToLogin]);

  /**
   * Crea headers con autorización
   */
  const getAuthHeaders = useCallback((additionalHeaders?: HeadersInit): HeadersInit => {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };
    
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }, [getToken]);

  /**
   * Fetch autenticado con manejo automático de 401
   */
  const authFetch = useCallback(async <T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null; status: number }> => {
    const token = getToken();
    
    if (!token) {
      return { data: null, error: 'No autenticado', status: 401 };
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      // Si 401, el token expiró o es inválido
      if (response.status === 401) {
        // Limpiar datos de auth
        localStorage.removeItem('takopi_token');
        localStorage.removeItem('takopi_user');
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      const data = await response.json();

      if (!response.ok) {
        return { 
          data: null, 
          error: data.error || `Error ${response.status}`, 
          status: response.status 
        };
      }

      return { data, error: null, status: response.status };
    } catch (error) {
      console.error('❌ AuthFetch error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Error de conexión', 
        status: 0 
      };
    }
  }, [getToken]);

  /**
   * POST autenticado
   */
  const authPost = useCallback(async <T = unknown>(
    url: string,
    body: unknown
  ): Promise<{ data: T | null; error: string | null; status: number }> => {
    return authFetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [authFetch]);

  /**
   * PUT autenticado
   */
  const authPut = useCallback(async <T = unknown>(
    url: string,
    body: unknown
  ): Promise<{ data: T | null; error: string | null; status: number }> => {
    return authFetch<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [authFetch]);

  /**
   * DELETE autenticado
   */
  const authDelete = useCallback(async <T = unknown>(
    url: string
  ): Promise<{ data: T | null; error: string | null; status: number }> => {
    return authFetch<T>(url, {
      method: 'DELETE',
    });
  }, [authFetch]);

  return {
    // Estado
    user,
    isAuthenticated,
    
    // Utilidades
    getToken,
    getAuthHeaders,
    redirectToLogin,
    requireAuth,
    
    // Fetch methods
    authFetch,
    authPost,
    authPut,
    authDelete,
  };
}

/**
 * Hook simplificado para protección de rutas
 * Redirige automáticamente si no está autenticado
 * 
 * @example
 * // En un componente de página protegida
 * const { isReady, user } = useRequireAuth();
 * 
 * if (!isReady) return <Loading />;
 * // Aquí user está garantizado que existe
 */
export function useRequireAuth(returnUrl?: string) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirigir si no está autenticado y ya terminó de cargar
  if (!isLoading && !user) {
    const redirect = returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
  }

  return {
    isReady: !isLoading && !!user,
    isLoading,
    user,
  };
}