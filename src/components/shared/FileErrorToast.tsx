'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export interface FileErrorToast {
  id: string;
  title: string;
  message: string;
  suggestion?: string;
  type?: 'error' | 'warning' | 'success' | 'info';
}

interface FileErrorToastProps {
  toast: FileErrorToast;
  onDismiss: (id: string) => void;
}

export function FileErrorToastItem({ toast, onDismiss }: FileErrorToastProps) {
  const { id, title, message, suggestion, type = 'error' } = toast;
  
  const styles = {
    error: {
      bg: 'bg-gradient-to-r from-red-950/80 to-red-900/60',
      border: 'border-red-500/40',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20',
      titleColor: 'text-red-200',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-950/80 to-amber-900/60',
      border: 'border-yellow-500/40',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      titleColor: 'text-yellow-200',
    },
    success: {
      bg: 'bg-gradient-to-r from-green-950/80 to-emerald-900/60',
      border: 'border-green-500/40',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
      icon: CheckCircleIcon,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20',
      titleColor: 'text-green-200',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-950/80 to-indigo-900/60',
      border: 'border-blue-500/40',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      titleColor: 'text-blue-200',
    },
  };
  
  const style = styles[type];
  const Icon = style.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`
        group relative overflow-hidden
        ${style.bg} ${style.border} ${style.glow}
        backdrop-blur-xl border rounded-2xl
        p-4 pr-10 max-w-sm w-80
      `}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${style.bg.includes('red') ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' : style.bg.includes('yellow') ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500' : style.bg.includes('green') ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-500' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500'}`} />
      
      {/* Close button */}
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
      </button>
      
      {/* Content */}
      <div className="flex gap-3 items-start">
        <div className={`flex-shrink-0 p-2 rounded-xl ${style.iconBg}`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-sm font-semibold ${style.titleColor} truncate`}>
            {title}
          </p>
          <p className="text-xs text-gray-300/80 mt-0.5 line-clamp-2">
            {message}
          </p>
          {suggestion && (
            <p className="text-xs text-purple-300/80 mt-1.5 flex items-center gap-1.5 bg-purple-500/10 rounded-lg px-2 py-1">
              <span>💡</span>
              <span>{suggestion}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface FileErrorToastContainerProps {
  toasts: FileErrorToast[];
  onDismiss: (id: string) => void;
}

export function FileErrorToastContainer({ toasts, onDismiss }: FileErrorToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <FileErrorToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook para manejar toasts de error de archivos
import { useState, useCallback } from 'react';

export function useFileErrorToasts() {
  const [toasts, setToasts] = useState<FileErrorToast[]>([]);
  
  const addToast = useCallback((toast: Omit<FileErrorToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
    
    return id;
  }, []);
  
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  return {
    toasts,
    addToast,
    dismissToast,
    clearToasts,
  };
}
