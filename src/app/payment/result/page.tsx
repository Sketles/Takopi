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
        // Simular verificación del estado del pago
        // En una implementación real, esto vendría de la API
        const success = searchParams.get('success') === 'true';
        const error = searchParams.get('error');
        
        if (success) {
          // Aquí se podría hacer una llamada a la API para verificar el estado real
          setPaymentResult({
            success: true,
            message: '¡Pago realizado exitosamente!',
            details: 'Tu compra ha sido procesada correctamente.'
          });
        } else {
          setPaymentResult({
            success: false,
            message: 'Error en el pago',
            details: error || 'Ha ocurrido un error durante el proceso de pago.'
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
                  <h3 className="font-semibold text-green-300 mb-2">✅ Transacción Completada</h3>
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
