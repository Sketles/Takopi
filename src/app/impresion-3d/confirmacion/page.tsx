'use client';

import Layout from '@/components/shared/Layout';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionResult {
  success: boolean;
  vci?: string;
  amount?: number;
  status?: string;
  buyOrder?: string;
  sessionId?: string;
  cardNumber?: string;
  accountingDate?: string;
  transactionDate?: string;
  authorizationCode?: string;
  paymentTypeCode?: string;
  responseCode?: number;
  installmentsAmount?: number;
  installmentsNumber?: number;
}

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const verifyTransaction = async () => {
      // Primero verificar si vienen parámetros directos de la redirección
      const success = searchParams.get('success');
      const token = searchParams.get('token_ws');
      const paymentMethod = searchParams.get('method');
      const error = searchParams.get('error');

      // Si viene directamente de Transbank con éxito
      if (success === 'true' && token) {
        const transactionData = {
          success: true,
          status: searchParams.get('status') || 'AUTHORIZED',
          amount: parseInt(searchParams.get('amount') || '0'),
          buyOrder: searchParams.get('buyOrder') || '',
          authorizationCode: searchParams.get('authorizationCode') || '',
          cardNumber: searchParams.get('cardNumber') || '',
          transactionDate: searchParams.get('transactionDate') || '',
        };
        
        setResult(transactionData);
        
        // Limpiar datos de sesión
        sessionStorage.removeItem('printConfig');
        sessionStorage.removeItem('shippingData');
        sessionStorage.removeItem('pendingTransaction');
        
        setIsVerifying(false);
        return;
      }

      // Si viene con error
      if (success === 'false' || error) {
        setResult({ 
          success: false,
          status: error || 'ERROR'
        });
        setIsVerifying(false);
        return;
      }

      // Si es transferencia bancaria
      if (paymentMethod === 'transfer') {
        const savedOrder = sessionStorage.getItem('pendingOrder');
        if (savedOrder) {
          setOrderData(JSON.parse(savedOrder));
          setResult({ success: true, status: 'pending_transfer' });
        }
        setIsVerifying(false);
        return;
      }

      // Caso antiguo: verificar con la API (ya no debería usarse)
      if (token && !success) {
        setResult({ 
          success: false,
          status: 'VERIFICACION_REQUERIDA'
        });
        setIsVerifying(false);
        return;
      }

      // Si no hay nada, mostrar error
      setResult({ success: false });
      setIsVerifying(false);
    };

    verifyTransaction();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Verificando transacción...</h2>
            <p className="text-gray-400 text-sm sm:text-base">Por favor espera un momento</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isSuccess = result?.success && (result?.status === 'AUTHORIZED' || result?.status === 'pending_transfer');
  const isTransfer = result?.status === 'pending_transfer';

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 pb-20">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
          {isSuccess && (
            <>
              <div className="absolute top-0 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-green-600/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-blue-600/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
            </>
          )}
          {!isSuccess && (
            <div className="absolute top-1/4 left-1/3 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-red-600/20 rounded-full blur-[100px] sm:blur-[120px]"></div>
          )}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-8">
          {/* Success State */}
          {isSuccess && (
            <div className="text-center mb-8 sm:mb-12 animate-fade-in">
              {/* Success Icon */}
              <div className="relative inline-flex mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                {isTransfer ? '¡Orden Recibida!' : '¡Pago Exitoso!'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-2">
                {isTransfer 
                  ? 'Tu pedido está pendiente de confirmación de pago'
                  : 'Tu pedido de impresión 3D ha sido confirmado'
                }
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {isTransfer
                  ? 'Recibirás los datos bancarios por correo electrónico'
                  : `Orden #${result?.buyOrder || 'N/A'}`
                }
              </p>
            </div>
          )}

          {/* Error State */}
          {!isSuccess && (
            <div className="text-center mb-8 sm:mb-12 animate-fade-in">
              <div className="relative inline-flex mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Pago Rechazado</h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
                No se pudo procesar tu pago. Por favor, intenta nuevamente.
              </p>

              <Link
                href="/impresion-3d/pago"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Intentar Nuevamente
              </Link>
            </div>
          )}

          {/* Transaction Details (Success only) */}
          {isSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Payment Info */}
              {!isTransfer && (
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Detalles del Pago
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b border-white/5">
                      <span className="text-gray-400">Monto Pagado</span>
                      <span className="text-white font-bold">${result?.amount?.toLocaleString('es-CL')} CLP</span>
                    </div>
                    {result?.cardNumber && (
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-gray-400">Tarjeta</span>
                        <span className="text-white">**** **** **** {result.cardNumber}</span>
                      </div>
                    )}
                    {result?.authorizationCode && (
                      <div className="flex justify-between pb-2 border-b border-white/5">
                        <span className="text-gray-400">Código Autorización</span>
                        <span className="text-white font-mono">{result.authorizationCode}</span>
                      </div>
                    )}
                    {result?.transactionDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fecha</span>
                        <span className="text-white">{new Date(result.transactionDate).toLocaleString('es-CL')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Próximos Pasos
                </h3>

                <ol className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                  <li className="flex gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-gray-300">
                      {isTransfer 
                        ? 'Recibirás un correo con los datos bancarios para realizar la transferencia'
                        : 'Recibirás un correo de confirmación con los detalles de tu pedido'
                      }
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-gray-300">
                      {isTransfer
                        ? 'Una vez confirmado el pago, comenzaremos la impresión de tu modelo'
                        : 'Comenzaremos la impresión de tu modelo en las próximas 24 horas'
                      }
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-gray-300">
                      Te notificaremos cuando tu pedido esté listo y en camino
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-gray-300">
                      Recibirás tu impresión 3D en {isTransfer ? '5-7' : '3-5'} días hábiles
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Actions */}
          {isSuccess && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/profile"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-xl font-bold text-sm sm:text-base text-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Ver Mis Pedidos
              </Link>
              <Link
                href="/impresion-3d"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm sm:text-base text-center hover:bg-white/10 transition-all"
              >
                Hacer Otro Pedido
              </Link>
            </div>
          )}

          {/* Contact Support */}
          {isSuccess && (
            <div className="mt-8 sm:mt-12 bg-white/5 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-gray-400 text-sm sm:text-base mb-2">¿Tienes preguntas sobre tu pedido?</p>
              <a 
                href="mailto:soporte@takopi.cl" 
                className="text-purple-400 hover:underline font-medium text-sm sm:text-base"
              >
                Contáctanos en soporte@takopi.cl
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-white">Cargando...</div>
        </div>
      </Layout>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
