'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/shared/Layout';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Verificar el estado del pago desde los parámetros de la URL
        const success = searchParams.get('success') === 'true';
        const error = searchParams.get('error');
        const details = searchParams.get('details');
        
        if (success) {
          // Pago exitoso - obtener información de la transacción
          const transactionId = searchParams.get('transactionId');
          const purchaseId = searchParams.get('purchaseId');
          const amount = searchParams.get('amount');
          const currency = searchParams.get('currency') || 'CLP';
          const buyOrder = searchParams.get('buyOrder');
          const authorizationCode = searchParams.get('authorizationCode');
          
          setPaymentResult({
            success: true,
            message: '¡Pago realizado exitosamente!',
            details: 'Tu compra ha sido procesada correctamente con Transbank.',
            transactionId,
            purchaseId,
            amount,
            currency,
            buyOrder,
            authorizationCode
          });
        } else {
          // Error en el pago
          let errorMessage = 'Error en el pago';
          let errorDetails = 'Ha ocurrido un error durante el proceso de pago.';
          
          if (error === 'not_authorized') {
            errorMessage = 'Pago no autorizado';
            errorDetails = 'La transacción no fue autorizada por Transbank.';
          } else if (error === 'transbank_error') {
            errorMessage = 'Error de Transbank';
            errorDetails = 'Hubo un problema al comunicarse con Transbank.';
          } else if (error === 'sdk_error') {
            errorMessage = 'Error del sistema';
            errorDetails = 'El sistema de pagos no está disponible.';
          } else if (error === 'purchase_error') {
            errorMessage = 'Error al registrar compra';
            errorDetails = 'El pago fue exitoso pero hubo un error al registrar tu compra.';
          }
          
          if (details) {
            errorDetails = decodeURIComponent(details);
          }
          
          setPaymentResult({
            success: false,
            message: errorMessage,
            details: errorDetails
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentResult({
          success: false,
          message: 'Error al verificar el pago',
          details: 'No se pudo verificar el estado de tu pago.'
        });
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const handleBackToExplore = () => {
    router.push('/explore');
  };

  const handleGoToProfile = () => {
    router.push('/profile?tab=purchases');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white">Verificando pago...</h2>
            <p className="text-gray-400 mt-2">Por favor espera un momento</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 text-center">
            
            {paymentResult?.success ? (
              <>
                {/* Éxito */}
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xl text-green-400 mb-6">
                  {paymentResult.message}
                </p>
                <p className="text-gray-300 mb-8">
                  {paymentResult.details}
                </p>

                {/* Información adicional */}
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-green-300 mb-4">✅ Transacción Completada</h3>
                  
                  {/* Detalles de la transacción */}
                  <div className="space-y-2 mb-4">
                    {paymentResult.transactionId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">ID Transacción:</span>
                        <span className="text-green-300 font-mono">{paymentResult.transactionId}</span>
                      </div>
                    )}
                    {paymentResult.purchaseId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">ID Compra:</span>
                        <span className="text-green-300 font-mono">{paymentResult.purchaseId}</span>
                      </div>
                    )}
                    {paymentResult.buyOrder && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">Orden de Compra:</span>
                        <span className="text-green-300 font-mono">{paymentResult.buyOrder}</span>
                      </div>
                    )}
                    {paymentResult.authorizationCode && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">Código Autorización:</span>
                        <span className="text-green-300 font-mono">{paymentResult.authorizationCode}</span>
                      </div>
                    )}
                    {paymentResult.amount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-200">Monto:</span>
                        <span className="text-green-300 font-semibold">
                          ${parseInt(paymentResult.amount).toLocaleString()} {paymentResult.currency || 'CLP'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-green-200 text-sm">
                    Tu contenido digital ya está disponible en tu perfil. 
                    Puedes descargarlo desde la sección "Mis Compras".
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                  <button
                    onClick={handleGoToProfile}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    🛒 Ver Mis Compras
                  </button>
                  <button
                    onClick={handleBackToExplore}
                    className="w-full px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-500 hover:text-white transition-colors"
                  >
                    Explorar Más Contenido
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Error */}
                <div className="text-6xl mb-6">😞</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Error en el Pago
                </h1>
                <p className="text-xl text-red-400 mb-6">
                  {paymentResult?.message || 'Ha ocurrido un error'}
                </p>
                <p className="text-gray-300 mb-8">
                  {paymentResult?.details || 'Por favor intenta nuevamente o contacta con soporte.'}
                </p>

                {/* Información de ayuda */}
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-red-300 mb-2">🔄 ¿Qué puedes hacer?</h3>
                  <ul className="text-red-200 text-sm text-left space-y-1">
                    <li>• Verifica que tu tarjeta tenga fondos suficientes</li>
                    <li>• Revisa que los datos de tu tarjeta sean correctos</li>
                    <li>• Intenta nuevamente en unos minutos</li>
                    <li>• Contacta a tu banco si el problema persiste</li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                  <button
                    onClick={() => router.back()}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    🔄 Intentar Nuevamente
                  </button>
                  <button
                    onClick={handleBackToExplore}
                    className="w-full px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-500 hover:text-white transition-colors"
                  >
                    Volver al Marketplace
                  </button>
                </div>
              </>
            )}

            {/* Información de soporte */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                ¿Necesitas ayuda? Contacta a nuestro equipo de soporte en{' '}
                <a href="mailto:soporte@takopi.com" className="text-purple-400 hover:text-purple-300">
                  soporte@takopi.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
