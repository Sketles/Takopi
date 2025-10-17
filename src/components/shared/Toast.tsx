'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Toast as ToastType, ToastContextType } from '@/types/cart';

// Context para notificaciones
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider del contexto
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: Omit<ToastType, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastType = {
      ...toast,
      id,
      duration: toast.duration || 4000, // 4 segundos por defecto
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remover después de la duración
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook para usar notificaciones
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Componente para mostrar las notificaciones
function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

// Componente individual de notificación
function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 300); // Esperar animación de salida
  };

  const getToastStyles = () => {
    const baseStyles = "relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 transform";
    const visibleStyles = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";

    switch (toast.type) {
      case 'success':
        return `${baseStyles} ${visibleStyles} bg-green-900/80 border-green-500/50 text-green-100`;
      case 'error':
        return `${baseStyles} ${visibleStyles} bg-red-900/80 border-red-500/50 text-red-100`;
      case 'warning':
        return `${baseStyles} ${visibleStyles} bg-yellow-900/80 border-yellow-500/50 text-yellow-100`;
      case 'info':
      default:
        return `${baseStyles} ${visibleStyles} bg-blue-900/80 border-blue-500/50 text-blue-100`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse"></div>
      
      <div className="relative p-4 flex items-start gap-3 min-w-[300px] max-w-[400px]">
        {/* Icono */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-xs mt-1 opacity-90 leading-relaxed">
              {toast.message}
            </p>
          )}
          
          {/* Acción opcional */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Cerrar notificación"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Barra de progreso (si tiene duración) */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div 
            className="h-full bg-white/40 transition-all ease-linear"
            style={{ 
              width: '100%',
              animation: `toast-progress ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}

// CSS para la animación de la barra de progreso
const toastStyles = `
  @keyframes toast-progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastStyles;
  document.head.appendChild(style);
}
