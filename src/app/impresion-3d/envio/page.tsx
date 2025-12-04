'use client';

import Layout from '@/components/shared/Layout';
import ComunaAutocomplete from '@/components/shared/ComunaAutocomplete';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ShippingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    additionalInfo: '',
    shippingMethod: ''
  });

  const [orderSummary, setOrderSummary] = useState({
    material: 'PLA+',
    quality: 'Normal',
    price: 0,
    estimatedTime: '4-8h'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/impresion-3d/envio');
    }
  }, [user, router]);

  // Cargar datos de configuración desde sessionStorage
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('printConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setOrderSummary({
        material: config.material || 'PLA+',
        quality: config.quality || 'Normal',
        price: config.price || 0,
        estimatedTime: config.estimatedTime || '4-8h'
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name as keyof ShippingData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};

    if (!shippingData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^(\+?56)?[0-9]{9}$/.test(shippingData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido (ej: +56912345678)';
    }

    if (!shippingData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!shippingData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!shippingData.region) {
      newErrors.region = 'Selecciona una región';
    }

    if (!shippingData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es requerido';
    }

    if (!shippingData.shippingMethod) {
      newErrors.shippingMethod = 'Selecciona un método de envío';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Guardar datos de envío en sessionStorage
      sessionStorage.setItem('shippingData', JSON.stringify(shippingData));

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirigir a página de pago
      router.push('/impresion-3d/pago');
    } catch (error) {
      console.error('Error al procesar envío:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
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
              href="/impresion-3d/configurar"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Configuración
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Datos de <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Envío</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">Completa la información para recibir tu impresión 3D</p>
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

              {/* Step 2 - Current */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                  <span className="text-xs sm:text-sm font-bold">2</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white">Envío</span>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-white/10"></div>

              {/* Step 3 - Pending */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-gray-500">3</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">Pago</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Contacto</label>
                      <p className="text-white font-medium text-sm sm:text-base break-all">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">Recibirás actualizaciones del pedido en este correo</p>
                </div>

                {/* Personal Info */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información Personal
                  </h3>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre Completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez González"
                      className={`w-full bg-black/30 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono de Contacto <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      placeholder="+56 9 1234 5678"
                      className={`w-full bg-black/30 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Dirección de Envío
                  </h3>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                      Dirección <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      placeholder="Av. Libertador Bernardo O'Higgins 1234, Depto 567"
                      className={`w-full bg-black/30 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                        Comuna <span className="text-red-400">*</span>
                      </label>
                      <ComunaAutocomplete
                        value={shippingData.city}
                        onChange={(comuna, region, postalCode) => {
                          setShippingData(prev => ({
                            ...prev,
                            city: comuna,
                            region: region,
                            postalCode: postalCode || prev.postalCode
                          }));
                          // Limpiar errores
                          setErrors(prev => ({ ...prev, city: '', region: '', postalCode: '' }));
                        }}
                        error={errors.city}
                        placeholder="Ej: Quilicura, Las Condes..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Escribe y selecciona tu comuna
                      </p>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                        Código Postal <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={shippingData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Se autocompleta"
                          className={`w-full bg-black/30 border ${errors.postalCode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                        />
                        {shippingData.postalCode && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        {shippingData.postalCode ? 'Autocompletado ✓' : 'Se completará automáticamente'}
                      </p>
                    </div>
                  </div>

                  {/* Region - Now auto-filled */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">
                      Región <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={shippingData.region}
                        readOnly
                        placeholder="Se autocompleta al seleccionar comuna"
                        className={`w-full bg-black/50 border ${errors.region ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none cursor-not-allowed`}
                      />
                      {shippingData.region && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.region && <p className="text-red-400 text-sm mt-1">{errors.region}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      {shippingData.region ? 'Autocompletado ✓' : 'Se completará automáticamente'}
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-300 mb-2">
                      Información Adicional (Opcional)
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={shippingData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Ej: Casa color verde, portón negro. Tocar timbre 2 veces."
                      rows={3}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Referencias para el repartidor, horarios de entrega preferidos, etc.</p>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Método de Envío
                  </h3>

                  <div className="space-y-3">
                    {/* Chilexpress Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setShippingData({ ...shippingData, shippingMethod: 'chilexpress' });
                        setErrors({ ...errors, shippingMethod: '' });
                      }}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        shippingData.shippingMethod === 'chilexpress'
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                          : 'border-white/10 bg-black/30 hover:border-white/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {/* Chilexpress Logo */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-white p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 200 60" className="w-full h-full">
                            {/* Chilexpress brand colors: Red #E40520 */}
                            <rect x="0" y="0" width="200" height="60" fill="#E40520" rx="4"/>
                            <text x="100" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">
                              Chilexpress
                            </text>
                          </svg>
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-base sm:text-lg">Chilexpress</h4>
                            {shippingData.shippingMethod === 'chilexpress' && (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Entrega en 3-5 días hábiles</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                            <span className="flex items-center gap-1 text-green-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Seguimiento en tiempo real
                            </span>
                            <span className="flex items-center gap-1 text-blue-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Seguro incluido
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Costo de envío</p>
                          <p className="text-lg sm:text-xl font-bold text-white">$3.990</p>
                          <p className="text-xs text-gray-400">CLP</p>
                        </div>
                      </div>
                    </button>

                    {/* Mercado Envíos Flex Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setShippingData({ ...shippingData, shippingMethod: 'mercadoenvios' });
                        setErrors({ ...errors, shippingMethod: '' });
                      }}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        shippingData.shippingMethod === 'mercadoenvios'
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                          : 'border-white/10 bg-black/30 hover:border-white/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {/* Mercado Envíos Logo */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-white p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 200 60" className="w-full h-full">
                            {/* Mercado Libre brand colors: Yellow #FFE600 */}
                            <rect x="0" y="0" width="200" height="60" fill="#FFE600" rx="4"/>
                            <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="#2D3277"/>
                            <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#2D3277">
                              Mercado
                            </text>
                            <text x="70" y="42" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#2D3277">
                              Envíos Flex
                            </text>
                          </svg>
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-base sm:text-lg">Mercado Envíos Flex</h4>
                            {shippingData.shippingMethod === 'mercadoenvios' && (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Entrega en 5-7 días hábiles</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                            <span className="flex items-center gap-1 text-green-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Retiro flexible
                            </span>
                            <span className="flex items-center gap-1 text-yellow-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              Más económico
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Costo de envío</p>
                          <p className="text-lg sm:text-xl font-bold text-white">$2.490</p>
                          <p className="text-xs text-gray-400">CLP</p>
                        </div>
                      </div>
                    </button>

                    {errors.shippingMethod && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.shippingMethod}
                      </p>
                    )}
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-300 mb-1">Información de envío</p>
                        <p className="text-xs text-gray-400">
                          Los tiempos de entrega son estimados y pueden variar según tu ubicación. 
                          Recibirás un código de seguimiento por correo electrónico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] disabled:shadow-none relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        Continuar al Pago
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Resumen del Pedido</h3>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">Material</span>
                      <span className="font-medium text-white">{orderSummary.material}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">Calidad</span>
                      <span className="font-medium text-white">{orderSummary.quality}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">Tiempo estimado</span>
                      <span className="font-medium text-white">{orderSummary.estimatedTime}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">Subtotal impresión</span>
                      <span className="font-medium text-white">${orderSummary.price.toLocaleString('es-CL')} CLP</span>
                    </div>

                    {shippingData.shippingMethod && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">Envío ({shippingData.shippingMethod === 'chilexpress' ? 'Chilexpress' : 'Mercado Envíos Flex'})</span>
                        <span className="font-medium text-white">
                          ${(shippingData.shippingMethod === 'chilexpress' ? 3990 : 2490).toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-3 sm:py-4 bg-purple-500/10 rounded-xl px-3 sm:px-4 border border-purple-500/20">
                      <span className="text-base sm:text-lg font-bold text-white">Total</span>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ${(orderSummary.price + (shippingData.shippingMethod === 'chilexpress' ? 3990 : shippingData.shippingMethod === 'mercadoenvios' ? 2490 : 0)).toLocaleString('es-CL')} CLP
                      </span>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Pago Seguro</p>
                        <p className="text-xs text-gray-400">Protegemos tus datos con encriptación SSL</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Envío a todo Chile</p>
                        <p className="text-xs text-gray-400">Entrega en 5-7 días hábiles</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Garantía de Calidad</p>
                        <p className="text-xs text-gray-400">Impresión profesional verificada</p>
                      </div>
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
