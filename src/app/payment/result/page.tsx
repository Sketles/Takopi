'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/shared/Layout';

// Evitar pre-render estático
export const dynamic = 'force-dynamic';

function PaymentResultContent() {
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
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-light tracking-wider text-white">Verificando pago...</h2>
            <p className="text-white/40 mt-2">Por favor espera un momento</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className={`absolute top-0 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[120px] pointer-events-none opacity-20 ${paymentResult?.success ? 'bg-green-500' : 'bg-red-500'}`} />

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-[#0f0f0f] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/5 shadow-2xl text-center animate-scale-in">

            {paymentResult?.success ? (
              <>
                {/* Éxito */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-bounce-small">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-lg sm:text-xl text-green-400 mb-2 font-medium">
                  {paymentResult.message}
                </p>
                <p className="text-white/60 mb-8 sm:mb-10 text-sm sm:text-base">
                  {paymentResult.details}
                </p>

                {/* Información adicional */}
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 text-left border border-white/5">
                  <h3 className="font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Detalles de la transacción
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    {paymentResult.transactionId && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/40">ID Transacción</span>
                        <span className="text-white font-mono truncate ml-2">{paymentResult.transactionId}</span>
                      </div>
                    )}
                    {paymentResult.purchaseId && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/40">ID Compra</span>
                        <span className="text-white font-mono truncate ml-2">{paymentResult.purchaseId}</span>
                      </div>
                    )}
                    {paymentResult.buyOrder && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/40">Orden de Compra</span>
                        <span className="text-white font-mono truncate ml-2">{paymentResult.buyOrder}</span>
                      </div>
                    )}
                    {paymentResult.authorizationCode && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/40">Código Autorización</span>
                        <span className="text-white font-mono">{paymentResult.authorizationCode}</span>
                      </div>
                    )}
                    <div className="h-px bg-white/10 my-2" />
                    {paymentResult.amount && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-white/40">Monto Total</span>
                        <span className="text-white font-bold text-base sm:text-lg">
                          ${parseInt(paymentResult.amount).toLocaleString()} {paymentResult.currency || 'CLP'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={handleGoToProfile}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-black rounded-xl font-bold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/5"
                  >
                    🛒 Ver Mis Compras
                  </button>
                  <button
                    onClick={handleBackToExplore}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white/5 text-white rounded-xl font-medium text-sm sm:text-base hover:bg-white/10 transition-colors border border-white/5"
                  >
                    Explorar Más Contenido
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Error */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-pulse">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                  Error en el Pago
                </h1>
                <p className="text-lg sm:text-xl text-red-400 mb-2 font-medium">
                  {paymentResult?.message || 'Ha ocurrido un error'}
                </p>
                <p className="text-white/60 mb-8 sm:mb-10 text-sm sm:text-base">
                  {paymentResult?.details || 'Por favor intenta nuevamente o contacta con soporte.'}
                </p>

                {/* Información de ayuda */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 text-left">
                  <h3 className="font-bold text-red-400 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className="text-red-400/80 text-xs sm:text-sm space-y-1.5 sm:space-y-2 list-disc list-inside">
                    <li>Verifica que tu tarjeta tenga fondos suficientes</li>
                    <li>Revisa que los datos de tu tarjeta sean correctos</li>
                    <li>Intenta nuevamente en unos minutos</li>
                    <li>Contacta a tu banco si el problema persiste</li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => router.back()}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-black rounded-xl font-bold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300"
                  >
                    🔄 Intentar Nuevamente
                  </button>
                  <button
                    onClick={handleBackToExplore}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white/5 text-white rounded-xl font-medium text-sm sm:text-base hover:bg-white/10 transition-colors border border-white/5"
                  >
                    Volver al Marketplace
                  </button>
                </div>
              </>
            )}

            {/* Información de soporte */}
            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-white/5">
              <p className="text-white/30 text-xs sm:text-sm">
                ¿Necesitas ayuda? Contacta a nuestro equipo de soporte en{' '}
                <a href="mailto:soporte@takopi.com" className="text-white/60 hover:text-white transition-colors underline">
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

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div>Cargando resultado...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
