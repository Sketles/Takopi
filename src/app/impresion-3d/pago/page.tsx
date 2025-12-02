'use client';

import Layout from '@/components/shared/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/shared/Toast';

interface PrintConfig {
  material: string;
  quality: string;
  price: number;
  estimatedTime: string;
  infill: number;
  scale: number;
  copies: number;
  supports: boolean;
  color: string;
  modelUrl: string;
  productId?: string;
  productTitle?: string;
  fileName?: string;
}

interface ShippingData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  additionalInfo: string;
  shippingMethod: 'chilexpress' | 'mercadoenvios' | '';
}

export default function PaymentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [config, setConfig] = useState<PrintConfig | null>(null);
  const [shipping, setShipping] = useState<ShippingData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'transfer' | ''>('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Cargar datos guardados
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/impresion-3d/pago');
      return;
    }

    const savedConfig = sessionStorage.getItem('printConfig');
    const savedShipping = sessionStorage.getItem('shippingData');

    if (!savedConfig || !savedShipping) {
      addToast({ type: 'error', title: 'Error', message: 'No se encontraron datos de la orden' });
      router.push('/impresion-3d/configurar');
      return;
    }

    try {
      setConfig(JSON.parse(savedConfig));
      setShipping(JSON.parse(savedShipping));
    } catch (error) {
      console.error('Error parsing saved data:', error);
      router.push('/impresion-3d/configurar');
    }
  }, [user, router]);

  const getShippingCost = () => {
    if (!shipping?.shippingMethod) return 0;
    return shipping.shippingMethod === 'chilexpress' ? 3990 : 2490;
  };

  const getTotalAmount = () => {
    if (!config) return 0;
    return config.price + getShippingCost();
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      addToast({ type: 'error', title: 'Error', message: 'Por favor selecciona un método de pago' });
      return;
    }

    if (!acceptTerms) {
      addToast({ type: 'error', title: 'Error', message: 'Debes aceptar los términos y condiciones' });
      return;
    }

    if (!config || !shipping || !user) {
      addToast({ type: 'error', title: 'Error', message: 'Faltan datos para procesar el pago' });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'webpay') {
        // Crear transacción con Webpay
        const response = await fetch('/api/webpay/create-print', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('takopi_token')}`
          },
          body: JSON.stringify({
            amount: getTotalAmount(),
            printConfig: config,
            shippingData: shipping,
            userId: user._id
          })
        });

        const data = await response.json();

        if (data.success && data.url && data.token) {
          // Guardar información de la transacción
          sessionStorage.setItem('pendingTransaction', JSON.stringify({
            token: data.token,
            buyOrder: data.buyOrder,
            amount: getTotalAmount()
          }));

          // Redireccionar a Webpay
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.url;
          
          const tokenInput = document.createElement('input');
          tokenInput.type = 'hidden';
          tokenInput.name = 'token_ws';
          tokenInput.value = data.token;
          
          form.appendChild(tokenInput);
          document.body.appendChild(form);
          form.submit();
        } else {
          throw new Error(data.error || 'Error al crear la transacción');
        }
      } else if (paymentMethod === 'transfer') {
        // Simular proceso de transferencia
        addToast({ type: 'info', title: 'Procesando', message: 'Procesando orden con transferencia bancaria...' });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Guardar orden como pendiente de transferencia
        const orderData = {
          config,
          shipping,
          amount: getTotalAmount(),
          paymentMethod: 'transfer',
          status: 'pending_transfer',
          createdAt: new Date().toISOString()
        };

        sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
        router.push('/impresion-3d/confirmacion?method=transfer');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      addToast({ type: 'error', title: 'Error al procesar pago', message: error instanceof Error ? error.message : 'Error al procesar el pago' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !config || !shipping) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 pb-20">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
          <div className="absolute top-0 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-purple-600/20 rounded-full blur-[100px] sm:blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-blue-600/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <Link
              href="/impresion-3d/envio"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Datos de Envío
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Finalizar <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Pedido</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">Último paso para completar tu impresión 3D</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Step 1 - Completed */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">Configuración</span>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-white/10"></div>

              {/* Step 2 - Completed */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">Envío</span>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-white/10"></div>

              {/* Step 3 - Current */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                  <span className="text-xs sm:text-sm font-bold">3</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white">Pago</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 order-2 lg:order-1">
              {/* Payment Method Selection */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Método de Pago
                </h3>

                <div className="space-y-3">
                  {/* Webpay Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('webpay')}
                    className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === 'webpay'
                        ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'border-white/10 bg-black/30 hover:border-white/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {/* Webpay Logo */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white p-2 sm:p-3 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 200 80" className="w-full h-full">
                          {/* Transbank Webpay colors: Red #E3000F */}
                          <rect x="0" y="10" width="200" height="60" fill="#E3000F" rx="6"/>
                          <text x="100" y="50" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">
                            Webpay
                          </text>
                        </svg>
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-base sm:text-lg">Webpay Plus</h4>
                          {paymentMethod === 'webpay' && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Pago seguro con tarjetas de débito y crédito</p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-3">
                          <div className="flex items-center gap-1">
                            {/* Credit cards icons */}
                            <span className="text-xs text-gray-500">💳 Visa</span>
                            <span className="text-xs text-gray-500">• Mastercard</span>
                            <span className="text-xs text-gray-500">• RedCompra</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Instantáneo
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Transfer Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === 'transfer'
                        ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'border-white/10 bg-black/30 hover:border-white/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {/* Bank Transfer Icon */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-2 sm:p-3 flex items-center justify-center flex-shrink-0">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-base sm:text-lg">Transferencia Bancaria</h4>
                          {paymentMethod === 'transfer' && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Recibirás los datos bancarios por correo</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Confirmación en 24-48 horas
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Manual
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-white/20 bg-transparent appearance-none checked:bg-purple-500 checked:border-purple-500 cursor-pointer transition-all"
                    />
                    {acceptTerms && (
                      <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      Acepto los{' '}
                      <Link href="/terminos" className="text-purple-400 hover:underline">
                        términos y condiciones
                      </Link>
                      {' '}y las{' '}
                      <Link href="/privacidad" className="text-purple-400 hover:underline">
                        políticas de privacidad
                      </Link>
                      {' '}de Takopi.
                    </p>
                  </div>
                </label>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !paymentMethod || !acceptTerms}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] disabled:shadow-none relative overflow-hidden group"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Procesando pago...</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm sm:text-base">Pagar ${getTotalAmount().toLocaleString('es-CL')} CLP</span>
                    </span>
                  </>
                )}
              </button>

              {/* Security badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SSL Encryption</span>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                {/* Order Details */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Resumen del Pedido</h3>

                  {/* Print Configuration */}
                  <div className="space-y-4 mb-6">
                    <div className="pb-4 border-b border-white/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Configuración de Impresión</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Material:</span>
                          <span className="text-white font-medium">{config.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Calidad:</span>
                          <span className="text-white font-medium">{config.quality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Copias:</span>
                          <span className="text-white font-medium">{config.copies}x</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="pb-4 border-b border-white/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Envío</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Método:</span>
                          <span className="text-white font-medium">
                            {shipping.shippingMethod === 'chilexpress' ? 'Chilexpress' : 'Mercado Envíos Flex'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Destino:</span>
                          <span className="text-white font-medium">{shipping.city}, {shipping.region}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Impresión 3D</span>
                        <span className="text-white">${config.price.toLocaleString('es-CL')} CLP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Envío</span>
                        <span className="text-white">${getShippingCost().toLocaleString('es-CL')} CLP</span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-3 sm:py-4 bg-purple-500/10 rounded-xl px-3 sm:px-4 border border-purple-500/20">
                    <span className="text-base sm:text-lg font-bold text-white">Total a Pagar</span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      ${getTotalAmount().toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">¿Necesitas ayuda?</p>
                      <p className="text-xs text-gray-400">
                        Contáctanos en{' '}
                        <a href="mailto:soporte@takopi.cl" className="text-purple-400 hover:underline">
                          soporte@takopi.cl
                        </a>
                      </p>
                    </div>
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
