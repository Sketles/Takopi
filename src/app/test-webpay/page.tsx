'use client';

import { useState } from 'react';
import Layout from '@/components/shared/Layout';

export default function TestWebpayPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPayment = async (amount: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/webpay/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          contentId: 'test-content-123',
          userId: 'test-user-456'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la transacción');
      }

      if (data.success && data.url && data.token) {
        // Crear formulario y enviar automáticamente a Webpay
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
        
        setResult({
          message: 'Redirigiendo a Webpay...',
          url: data.url,
          token: data.token,
          buyOrder: data.buyOrder
        });
        
        form.submit();
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (err: any) {
      console.error('Error en el test:', err);
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              🧪 Test Webpay Plus
            </h1>
            
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Modo de Prueba</h3>
              <p className="text-yellow-200 text-sm">
                Esta página usa una API de prueba que simula la respuesta de Webpay. 
                No se realizarán transacciones reales.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Información de prueba */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Tarjetas de Prueba</h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-300 mb-2">💳 Visa</h3>
                    <div className="text-blue-200 text-sm space-y-1">
                      <p><strong>Número:</strong> 4051 8856 0044 6623</p>
                      <p><strong>CVV:</strong> 123</p>
                      <p><strong>Expiración:</strong> Cualquier fecha futura</p>
                      <p><strong>RUT:</strong> 11.111.111-1</p>
                      <p><strong>Clave:</strong> 123</p>
                    </div>
                  </div>

                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-300 mb-2">💳 Redcompra</h3>
                    <div className="text-green-200 text-sm space-y-1">
                      <p><strong>Número:</strong> 4051 8842 3993 7763</p>
                      <p><strong>CVV:</strong> 123</p>
                      <p><strong>Expiración:</strong> Cualquier fecha futura</p>
                      <p><strong>RUT:</strong> 11.111.111-1</p>
                      <p><strong>Clave:</strong> 123</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Importante</h3>
                  <p className="text-yellow-200 text-sm">
                    Estas son tarjetas de prueba para el ambiente de integración. 
                    No se realizarán cargos reales.
                  </p>
                </div>
              </div>

              {/* Botones de prueba */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Probar Pagos</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => testPayment(1000)}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Procesando...' : '💳 Probar $1.000 CLP'}
                  </button>

                  <button
                    onClick={() => testPayment(5000)}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Procesando...' : '💳 Probar $5.000 CLP'}
                  </button>

                  <button
                    onClick={() => testPayment(19990)}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Procesando...' : '💳 Probar $19.990 CLP'}
                  </button>
                </div>

                {error && (
                  <div className="mt-6 bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {result && (
                  <div className="mt-6 bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg">
                    <p className="font-semibold">Resultado:</p>
                    <p className="text-sm mb-2">{result.message}</p>
                    <details className="text-xs">
                      <summary className="cursor-pointer">Ver detalles técnicos</summary>
                      <pre className="mt-2 bg-black/20 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>

            {/* Información técnica */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Información Técnica</h3>
              <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-gray-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Ambiente:</strong> Integración (Sandbox)</p>
                    <p><strong>Comercio:</strong> 597055555532</p>
                    <p><strong>URL:</strong> https://webpay3gint.transbank.cl</p>
                  </div>
                  <div>
                    <p><strong>Return URL:</strong> /webpay/return</p>
                    <p><strong>Commit URL:</strong> /api/webpay/commit</p>
                    <p><strong>Result URL:</strong> /payment/result</p>
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
