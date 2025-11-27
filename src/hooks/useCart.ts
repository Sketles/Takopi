import { useCart as useCartContext } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';

/**
 * Hook personalizado para operaciones comunes del carrito
 * 
 * @returns {Object} Objeto con métodos y estado del carrito
 * @returns {CartItem[]} items - Array de items en el carrito
 * @returns {number} total - Total en dinero del carrito
 * @returns {number} itemCount - Cantidad total de items
 * @returns {boolean} isLoading - Si el carrito está cargando
 * @returns {(item: CartItem) => void} addProductToCart - Agregar producto al carrito
 * @returns {(contentId: string) => void} removeFromCart - Quitar producto del carrito
 * @returns {() => void} clearCart - Vaciar el carrito
 * @returns {(contentId: string) => boolean} isProductInCart - Verificar si producto está en carrito
 * 
 * @example
 * const { items, addProductToCart, total } = useCart();
 * 
 * const handleAddToCart = (product) => {
 *   addProductToCart(createCartItem(product));
 * };
 */
export function useCart() {
  const cart = useCartContext();

  // Helper para crear un CartItem desde un producto
  const createCartItem = (product: {
    id: string;
    title: string;
    price: number;
    author?: string;
    authorUsername?: string;
    contentType?: string;
    category?: string;
    coverImage?: string;
    isFree?: boolean;
  }): CartItem => {
    // Función para extraer el username del autor de forma segura
    const getAuthorUsername = (): string => {
      if (product.authorUsername && !product.authorUsername.startsWith('data:')) {
        return product.authorUsername;
      }
      
      if (product.author) {
        if (typeof product.author === 'string') {
          return product.author;
        }
        if (typeof product.author === 'object' && product.author.username) {
          return product.author.username;
        }
      }
      
      return 'Usuario';
    };

    return {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentId: product.id,
      title: product.title,
      price: product.price || 0,
      coverImage: product.coverImage || '/placeholder-content.jpg',
      author: typeof product.author === 'string' ? product.author : product.author?.username || '',
      authorUsername: getAuthorUsername(),
      contentType: product.contentType || '',
      category: product.category || '',
      isFree: product.isFree || false,
      addedAt: Date.now(),
    };
  };

  // Agregar producto al carrito (con validaciones)
  const addProductToCart = (product: {
    id: string;
    title: string;
    price: number;
    author?: string;
    authorUsername?: string;
    contentType?: string;
    category?: string;
    coverImage?: string;
    isFree?: boolean;
  }): { success: boolean; message: string } => {
    // Validaciones
    if (!product) {
      return { success: false, message: 'Producto no válido' };
    }

    if (!product.id) {
      return { success: false, message: 'Producto sin ID válido' };
    }

    // Verificar si ya está en el carrito
    if (cart.isInCart(product.id)) {
      return { success: false, message: 'Este producto ya está en tu Box' };
    }

    // Verificar si es el propio contenido del usuario
    // Nota: Esta validación requeriría acceso al usuario actual
    // Se implementará cuando se conecte con AuthContext

    // Crear y agregar el item
    const cartItem = createCartItem(product);
    cart.addToCart(cartItem);

    return { success: true, message: 'Producto agregado a tu Box' };
  };

  // Remover producto del carrito
  const removeProductFromCart = (contentId: string): boolean => {
    if (!contentId) return false;
    
    cart.removeFromCart(contentId);
    return true;
  };

  // Obtener item del carrito por ID de contenido
  const getProductFromCart = (contentId: string): CartItem | null => {
    return cart.getCartItem(contentId) || null;
  };

  // Verificar si un producto está en el carrito
  const isProductInCart = (contentId: string): boolean => {
    return cart.isInCart(contentId);
  };

  // Obtener resumen del carrito
  const getCartSummary = () => {
    return {
      itemCount: cart.itemCount,
      total: cart.total,
      items: cart.items,
      isEmpty: cart.itemCount === 0,
      hasItems: cart.itemCount > 0,
    };
  };

  // Formatear precio para mostrar
  const formatPrice = (price: number | undefined): string => {
    if (!price || isNaN(price)) return 'Precio no disponible';
    return `$${price.toLocaleString('es-CL')} CLP`;
  };

  // Obtener texto de resumen
  const getCartSummaryText = (): string => {
    if (cart.itemCount === 0) return 'Tu Box está vacío';
    if (cart.itemCount === 1) return '1 producto en tu Box';
    return `${cart.itemCount} productos en tu Box`;
  };

  // Validar si se puede proceder al checkout
  const canProceedToCheckout = (): boolean => {
    return cart.itemCount > 0 && !cart.isLoading;
  };

  // Obtener items para checkout (preparar datos para la API)
  const getItemsForCheckout = (): { contentId: string; title: string; price: number }[] => {
    return cart.items.map(item => ({
      contentId: item.contentId,
      title: item.title,
      price: item.price,
    }));
  };

  return {
    // Estado del carrito
    ...cart,
    
    // Funciones helper
    createCartItem,
    addProductToCart,
    removeProductFromCart,
    getProductFromCart,
    isProductInCart,
    getCartSummary,
    formatPrice,
    getCartSummaryText,
    canProceedToCheckout,
    getItemsForCheckout,
  };
}
