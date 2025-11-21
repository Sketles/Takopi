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

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <svg className="w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Tu Box está vacío
          </h1>
          <p className="text-gray-400 mb-8 text-lg font-light">
            Inicia sesión para guardar tus creaciones favoritas y proceder al pago
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
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
    <div className="min-h-screen bg-[#050505] py-12 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[0%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[0%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Mi Box
                </h1>
                <p className="text-gray-400 text-lg font-light mt-1">
                  {getCartSummary().isEmpty ? 'Tu carrito está vacío' : getCartSummaryText()}
                </p>
              </div>
            </div>

            {/* Acciones rápidas */}
            {!getCartSummary().isEmpty && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearCart}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${showClearConfirm
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {showClearConfirm ? '¿Confirmar?' : 'Vaciar Box'}
                </button>
                <Link
                  href="/explore"
                  className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Seguir Explorando
                </Link>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-400 text-lg font-light">Cargando tu Box...</p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-32 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Tu Box está vacío
            </h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg font-light">
              Explora las increíbles creaciones de la comunidad y guarda tus favoritas aquí.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar Creaciones
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="group bg-[#111] hover:bg-[#161616] rounded-2xl border border-white/5 p-4 transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]">
                  <div className="flex gap-5">
                    {/* Imagen del producto */}
                    <div className="w-28 h-28 bg-white/5 rounded-xl flex-shrink-0 overflow-hidden relative group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-white font-bold text-lg whitespace-nowrap">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            {getContentTypeIcon(item.contentType)} 
                            <span className="capitalize">{item.contentType}</span>
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="truncate">
                            por <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                              {item.authorUsername && !item.authorUsername.startsWith('data:')
                                ? item.authorUsername
                                : item.author || 'Usuario'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleViewProduct(item)}
                          className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Detalles
                        </button>
                        
                        <button
                          onClick={() => handleRemoveItem(item.contentId, item.title)}
                          className="text-sm font-medium text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-1.5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg -mr-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            <div className="lg:col-span-4">
              <div className="bg-[#111] border border-white/10 rounded-3xl p-6 sticky top-24 shadow-2xl shadow-black/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Resumen del Pedido
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({itemCount} productos)</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Impuestos estimados</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-medium text-white">Total</span>
                    <div className="text-right">
                      <span className="block text-3xl font-bold text-white tracking-tight">{formatPrice(totalPrice)}</span>
                      <span className="text-xs text-gray-500">CLP</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!canProceedToCheckout()}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Proceder al Pago
                  </button>

                  <p className="text-xs text-center text-gray-500 px-4">
                    Al proceder, aceptas nuestros Términos de Servicio y Política de Privacidad.
                  </p>
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
          isOwner={selectedProduct.authorId === (user as any)?.userId}
          currentUserId={(user as any)?.userId}
          source="box"
        />
      )}
    </div>
  );
}
