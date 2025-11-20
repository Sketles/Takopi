'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

// Evitar pre-render estático
export const dynamic = 'force-dynamic';

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  contentType: string;
  author: string;
  coverImage?: string;
}

function CheckoutContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [total, setTotal] = useState(0);

  // Parse items from URL params
  useEffect(() => {
    try {
      const itemsParam = searchParams.get('items');
      const totalParam = searchParams.get('total');

      if (itemsParam) {
        // Formato JSON (para compatibilidad con compras individuales)
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        setItems(parsedItems);

        // Use total from URL or calculate from items
        if (totalParam) {
          setTotal(parseInt(totalParam));
        } else {
          setTotal(parsedItems.reduce((sum: number, item: CheckoutItem) => sum + item.price, 0));
        }
      } else {
        // Formato múltiple parámetros (desde Box/carrito)
        const parsedItems: CheckoutItem[] = [];
        let index = 0;

        while (true) {
          const contentId = searchParams.get(`items[${index}][contentId]`);
          const title = searchParams.get(`items[${index}][title]`);
          const price = searchParams.get(`items[${index}][price]`);

          if (!contentId || !title || !price) break;

          parsedItems.push({
            id: contentId,
            title: title,
            price: parseInt(price),
            currency: 'CLP',
            contentType: 'producto',
            author: 'Usuario',
            coverImage: '/placeholder-content.jpg'
          });

          index++;
        }

        if (parsedItems.length > 0) {
          setItems(parsedItems);
          setTotal(parsedItems.reduce((sum, item) => sum + item.price, 0));
        }
      }
    } catch (error) {
      console.error('Error parsing checkout items:', error);
      setItems([]);
      setTotal(0);
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!user) {
      setError('Debes estar logueado para realizar una compra');
      return;
    }

    if (items.length === 0) {
      setError('No hay items para comprar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar que el token existe
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        // Limpiar datos de usuario y redirigir
        localStorage.removeItem('takopi_user');
        localStorage.removeItem('takopi_token');
        router.push('/auth/login');
        return;
      }

      // Por simplicidad, procesamos solo el primer item
      // En una implementación real, se procesarían todos los items
      const firstItem = items[0];

      // Si el total es 0, es un producto gratuito
      if (total === 0) {
        // Para productos gratuitos, crear directamente la compra sin Webpay
        const response = await fetch('/api/webpay/create-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentId: firstItem.id,
            userId: user._id
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Si es error de token, manejar específicamente
          if (response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('takopi_user');
            localStorage.removeItem('takopi_token');
            router.push('/auth/login');
            return;
          }
          throw new Error(data.error || 'Error al procesar la compra gratuita');
        }

        if (data.success) {
          // Limpiar carrito después de compra exitosa
          clearCart();
          // Redirigir a página de éxito
          router.push('/payment/result?success=true&type=free');
        } else {
          throw new Error('Error al procesar la compra gratuita');
        }
      } else {
        // Para productos de pago, usar Webpay como antes
        const response = await fetch('/api/webpay/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: total,
            contentId: firstItem.id,
            userId: user._id
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Si es error de token, manejar específicamente
          if (response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('takopi_user');
            localStorage.removeItem('takopi_token');
            router.push('/auth/login');
            return;
          }
          throw new Error(data.error || 'Error al crear la transacción');
        }

        if (data.success && data.url && data.token) {
          // Crear formulario y enviar automáticamente a Transbank
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.url;
          form.style.display = 'none';

          const tokenInput = document.createElement('input');
          tokenInput.type = 'hidden';
          tokenInput.name = 'token_ws';
          tokenInput.value = data.token;

          form.appendChild(tokenInput);
          document.body.appendChild(form);
          form.submit();
        } else {
          console.error('Respuesta del servidor:', data);
          throw new Error(`Respuesta inválida del servidor. Faltan campos requeridos: ${JSON.stringify({
            success: data.success,
            hasUrl: !!data.url,
            hasToken: !!data.token
          })}`);
        }
      }

    } catch (err: any) {
      console.error('Error en el pago:', err);
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    router.push('/box');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <div className="text-xl font-light tracking-wider">Verificando sesión...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-center p-8 bg-[#0f0f0f] border border-white/5 rounded-3xl shadow-2xl max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h1>
            <p className="text-gray-400 mb-8">Debes iniciar sesión para completar tu compra de forma segura.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {total === 0 ? '🎁 Obtener Gratis' : '🛒 Finalizar Compra'}
            </h1>
            <p className="text-white/40 text-lg">Revisa tus items y completa tu pedido</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 flex items-start gap-4 animate-fade-in">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold mb-1">Ha ocurrido un error</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Items del carrito (8 columnas) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-sm">1</span>
                  Items en tu pedido
                </h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                        <p className="text-white/40 text-sm mb-2">por {item.author}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/60 uppercase tracking-wider">
                            {item.contentType}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center text-right">
                        <p className="font-bold text-xl text-white">
                          {item.price === 0 ? 'Gratis' : `$${item.price.toLocaleString()}`}
                        </p>
                        <p className="text-white/30 text-xs">{item.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de seguridad */}
              <div className={`p-6 rounded-3xl border flex items-start gap-4 ${total === 0
                ? 'bg-green-500/5 border-green-500/10'
                : 'bg-blue-500/5 border-blue-500/10'
                }`}>
                <div className={`p-3 rounded-xl ${total === 0 ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${total === 0 ? 'text-green-400' : 'text-blue-400'}`}>
                    {total === 0 ? 'Descarga Segura' : 'Pago Seguro Encriptado'}
                  </h3>
                  <p className={`text-sm ${total === 0 ? 'text-green-400/60' : 'text-blue-400/60'}`}>
                    {total === 0
                      ? 'Este producto es gratuito. No se requiere información de pago.'
                      : 'Tus datos están protegidos con encriptación SSL de 256 bits. No almacenamos información de tarjetas.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen de compra (5 columnas) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl sticky top-32">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-sm">2</span>
                  Resumen
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{total === 0 ? 'Gratis' : `$${total.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Comisión de servicio</span>
                    <span>$0</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-white font-medium">Total a pagar</span>
                    <div className="text-right">
                      <span className={`text-3xl font-bold ${total === 0 ? 'text-green-400' : 'text-white'}`}>
                        {total === 0 ? 'Gratis' : `$${total.toLocaleString()}`}
                      </span>
                      <p className="text-white/30 text-xs mt-1">CLP (Pesos Chilenos)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    disabled={loading || items.length === 0}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 ${total === 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25'
                      : 'bg-white text-black hover:bg-gray-100 hover:shadow-white/10'
                      }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        <span>Procesando...</span>
                      </>
                    ) : total === 0 ? (
                      <>
                        <span>🎁</span>
                        <span>Obtener Gratis</span>
                      </>
                    ) : (
                      <>
                        <span>💳</span>
                        <span>Pagar con Webpay</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBackToCart}
                    className="w-full py-4 px-6 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    Volver al carrito
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="/webpay-logo.png" alt="Webpay" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <div className="text-xs text-white/50 text-center">
                    Pagos procesados por Transbank
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
