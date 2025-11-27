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

// Domain types - Align with Prisma models
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  avatar?: string;
  bio?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  contentCount: number;
  purchaseCount: number;
  followersCount: number;
  followingCount: number;
  collectionsCount: number;
  totalLikes: number;
}

export interface PurchaseFile {
  id: string;
  url: string;
  fileName: string;
  size: number;
  createdAt: Date;
}

export interface UserPurchase {
  id: string;
  contentId: string;
  content: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    contentType: 'MODEL_3D' | 'MUSIC' | 'DIGITAL_ART' | 'OTHER';
    category?: string;
    price: number;
    currency: string;
    isFree: boolean;
    author: {
      id: string;
      username: string;
      avatar?: string;
    };
  };
  files: PurchaseFile[];
  purchaseDate: Date;
  expiresAt?: Date;
}

export interface UserCreation {
  id: string;
  title: string;
  description?: string;
  contentType: 'MODEL_3D' | 'MUSIC' | 'DIGITAL_ART' | 'OTHER';
  category?: string;
  coverImage?: string;
  price: number;
  currency: string;
  isFree: boolean;
  views: number;
  downloads: number;
  license?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
