// Tipos TypeScript para el sistema de carrito

export interface CartItem {
  id: string;
  contentId: string;
  title: string;
  price: number;
  coverImage: string;
  author: string;
  authorUsername: string;
  contentType: string;
  category: string;
  isFree: boolean;
  addedAt: number; // timestamp
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartContextType {
  // Estado
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  
  // Acciones
  addToCart: (item: CartItem) => void;
  removeFromCart: (contentId: string) => void;
  clearCart: () => void;
  updateQuantity: (contentId: string, quantity: number) => void;
  isInCart: (contentId: string) => boolean;
  
  // Utilidades
  getCartItem: (contentId: string) => CartItem | undefined;
  calculateTotal: () => number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
