'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import Link from 'next/link';
import ProductModal from '@/components/product/ProductModal';
import { CartItem } from '@/types/cart';

export default function BoxPage() {
  const { user } = useAuth();
  const {
    items: cartItems,
    total: totalPrice,
    itemCount,
    isLoading,
    removeFromCart,
    clearCart,
    getCartSummary,
    getCartSummaryText,
    formatPrice,
    canProceedToCheckout,
    getItemsForCheckout
  } = useCart();
  const { addToast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    coverImage?: string;
    author?: string;
    contentType?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Funciones para manejar acciones
  const handleRemoveItem = (contentId: string, title: string) => {
    removeFromCart(contentId);
    addToast({
      type: 'success',
      title: 'Producto eliminado',
      message: `${title} fue removido de tu Box`
    });
  };

  const handleViewProduct = async (cartItem: CartItem) => {
    try {
      // Cargar datos completos del producto desde la API
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(`/api/content/${cartItem.contentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const product = await response.json();
        setSelectedProduct(product);
        setIsModalOpen(true);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo cargar los detalles del producto'
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al cargar el producto'
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (canProceedToCheckout()) {
      const items = getItemsForCheckout();
      // Redirigir al checkout con múltiples items
      const params = new URLSearchParams();
      items.forEach((item, index) => {
        params.append(`items[${index}][contentId]`, item.contentId);
        params.append(`items[${index}][title]`, item.title);
        params.append(`items[${index}][price]`, item.price.toString());
      });
      window.location.href = `/checkout?${params.toString()}`;
    }
  };

  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
      addToast({
        type: 'success',
        title: 'Box vaciado',
        message: 'Todos los productos fueron eliminados'
      });
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000); // Auto-cancelar después de 3 segundos
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'avatares': return '👤';
      case 'modelos3d': return '🎲';
      case 'musica': return '🎵';
      case 'texturas': return '🖼️';
      case 'animaciones': return '🎬';
      case 'OBS': return '📺';
      case 'colecciones': return '📦';
      default: return '📄';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-orange-500/30">
            <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Tu Box está vacío
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Inicia sesión para guardar tus creaciones favoritas y proceder al pago
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Mi Box
                </h1>
                <p className="text-gray-400 text-lg">
                  {getCartSummary().isEmpty ? 'Guarda tus creaciones favoritas' : getCartSummaryText()}
                </p>
              </div>
            </div>

            {/* Acciones rápidas */}
            {!getCartSummary().isEmpty && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearCart}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${showClearConfirm
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                >
                  {showClearConfirm ? 'Confirmar' : 'Vaciar Box'}
                </button>
                <Link
                  href="/explore"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Seguir Explorando
                </Link>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Cargando tu Box...</p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-orange-500/30">
              <svg className="w-20 h-20 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Tu Box está vacío
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Explora las increíbles creaciones de la comunidad y guarda tus favoritas aquí para comprarlas juntas
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar Creaciones
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-3 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                  <div className="flex gap-6">
                    {/* Imagen del producto */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap">
                            <span className="flex items-center gap-1 min-w-0 flex-shrink-0">
                              por <span className="text-purple-300 font-medium truncate max-w-[120px]">
                                {item.authorUsername && !item.authorUsername.startsWith('data:')
                                  ? item.authorUsername
                                  : item.author || 'Usuario'}
                              </span>
                            </span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                              {getContentTypeIcon(item.contentType)} {item.contentType}
                            </span>
                            <span className="flex-shrink-0">Agregado {formatDate(item.addedAt)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-bold text-xl">
                            {formatPrice(item.price)}
                          </p>
                          {item.isFree && (
                            <span className="text-green-400 text-sm font-medium">Gratis</span>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewProduct(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.contentId, item.title)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl font-medium hover:bg-red-600/30 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel de resumen */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resumen del Pedido
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Productos ({itemCount})</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Envío</span>
                    <span className="text-green-400">Gratis</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-orange-400">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!canProceedToCheckout()}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Proceder al Pago
                  </button>

                  <Link
                    href="/explore"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Seguir Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal del producto */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          isOwner={selectedProduct.author === user?.id}
          currentUserId={user?.id}
          source="box"
        />
      )}
    </div>
  );
}
