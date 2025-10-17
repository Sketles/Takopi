'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import { useCart } from '@/hooks/useCart';

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  contentType: string;
  author: string;
  coverImage?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
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
            userId: user.id || user._id || user.userId
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
            userId: user.id || user._id || user.userId
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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h1>
            <p className="text-gray-300 mb-6">Debes iniciar sesión para realizar una compra</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              {total === 0 ? '🎁 Obtener Gratis' : '🛒 Finalizar Compra'}
            </h1>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Items del carrito */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Items en tu carrito</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                      {item.coverImage && (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="text-gray-400 text-sm">por {item.author}</p>
                        <p className="text-gray-400 text-sm">Tipo: {item.contentType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-400">
                          {item.currency} {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de compra */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  {total === 0 ? 'Resumen del producto' : 'Resumen de compra'}
                </h2>
                <div className="bg-slate-700/50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({items.length} items):</span>
                    <span>{total === 0 ? 'GRATIS' : `CLP ${total.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Comisión de servicio:</span>
                    <span>{total === 0 ? 'GRATIS' : 'CLP 0'}</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total:</span>
                    <span className={total === 0 ? 'text-green-400' : ''}>
                      {total === 0 ? 'GRATIS' : `CLP ${total.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button
                      onClick={handlePayment}
                      disabled={loading || items.length === 0}
                      className={`w-full px-6 py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        total === 0 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </div>
                      ) : total === 0 ? (
                        '🎁 Obtener Gratis'
                      ) : (
                        '💳 Pagar con Webpay'
                      )}
                    </button>

                    <button
                      onClick={handleBackToCart}
                      className="w-full px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-500 hover:text-white transition-colors"
                    >
                      Volver al carrito
                    </button>
                  </div>
                </div>

                {/* Información de seguridad */}
                <div className={`mt-6 p-4 rounded-lg ${
                  total === 0 
                    ? 'bg-green-500/20 border border-green-500/50' 
                    : 'bg-blue-500/20 border border-blue-500/50'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    total === 0 ? 'text-green-300' : 'text-blue-300'
                  }`}>
                    {total === 0 ? '🎁 Producto Gratuito' : '🔒 Pago Seguro'}
                  </h3>
                  <p className={`text-sm ${
                    total === 0 ? 'text-green-200' : 'text-blue-200'
                  }`}>
                    {total === 0 
                      ? 'Este producto es completamente gratuito. No se requiere pago ni información de tarjeta.'
                      : 'Tu pago será procesado de forma segura por Transbank. No almacenamos información de tarjetas de crédito.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
