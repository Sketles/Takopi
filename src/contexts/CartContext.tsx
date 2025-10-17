'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartState, CartContextType } from '@/types/cart';

// Acciones del reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_QUANTITY'; payload: { contentId: string; quantity: number } }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Estado inicial
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Función para calcular totales
const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;
  return { total, itemCount };
};

// Reducer del carrito
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.contentId === newItem.contentId);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Si ya existe, no agregar duplicado
        newItems = state.items;
      } else {
        // Agregar nuevo item
        newItems = [...state.items, newItem];
      }
      
      const { total, itemCount } = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.contentId !== action.payload);
      const { total, itemCount } = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    
    case 'UPDATE_QUANTITY': {
      const { contentId, quantity } = action.payload;
      if (quantity <= 0) {
        // Si cantidad es 0 o menor, remover item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: contentId });
      }
      
      // Para este proyecto, los items no tienen cantidad (cada item es único)
      // Solo actualizar si el item existe
      const itemExists = state.items.some(item => item.contentId === contentId);
      if (itemExists) {
        return state; // No hay cambios necesarios
      }
      return state;
    }
    
    case 'LOAD_CART': {
      const { total, itemCount } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        total,
        itemCount,
      };
    }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider del contexto
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('takopi_cart');
      if (savedCart) {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        
        // Filtrar items antiguos (más de 7 días)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const validItems = cartItems.filter(item => item.addedAt > sevenDaysAgo);
        
        dispatch({ type: 'LOAD_CART', payload: validItems });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('takopi_cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, isLoading]);

  // Escuchar cambios en localStorage desde otras tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'takopi_cart' && e.newValue) {
        try {
          const cartItems: CartItem[] = JSON.parse(e.newValue);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        } catch (error) {
          console.error('Error syncing cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Funciones del contexto
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (contentId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: contentId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateQuantity = (contentId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { contentId, quantity } });
  };

  const isInCart = (contentId: string): boolean => {
    return state.items.some(item => item.contentId === contentId);
  };

  const getCartItem = (contentId: string): CartItem | undefined => {
    return state.items.find(item => item.contentId === contentId);
  };

  const calculateTotal = (): number => {
    return state.items.reduce((sum, item) => sum + item.price, 0);
  };

  const value: CartContextType = {
    // Estado
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    isLoading,
    
    // Acciones
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    isInCart,
    
    // Utilidades
    getCartItem,
    calculateTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el contexto
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
