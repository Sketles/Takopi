'use client';

import Layout from '@/components/shared/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function Printing3DLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: '🖨️',
      title: 'Impresión Profesional',
      description: 'Tecnología FDM y Resina de última generación para acabados perfectos'
    },
    {
      icon: '🎨',
      title: 'Múltiples Materiales',
      description: 'PLA, ABS, PETG, Resina, TPU y más opciones para tu proyecto'
    },
    {
      icon: '📐',
      title: 'Sin Límites de Tamaño',
      description: 'Desde miniaturas hasta piezas de 30cm, imprimimos cualquier tamaño'
    },
    {
      icon: '🚚',
      title: 'Envío a Domicilio',
      description: 'Despacho a todo Chile o retira en nuestra ubicación'
    }
  ];

  const materials = [
    { name: 'PLA', color: 'from-green-400 to-emerald-600', uses: 'Decoración, prototipos, miniaturas' },
    { name: 'ABS', color: 'from-blue-400 to-cyan-600', uses: 'Piezas funcionales, resistencia térmica' },
    { name: 'PETG', color: 'from-purple-400 to-pink-600', uses: 'Durabilidad, uso exterior' },
    { name: 'Resina', color: 'from-orange-400 to-red-600', uses: 'Alta precisión, joyería, miniaturas' },
    { name: 'TPU', color: 'from-yellow-400 to-amber-600', uses: 'Piezas flexibles, protección' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Hero Section con Animación */}
        <div className="relative overflow-hidden">
          {/* Background Animated */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.4),transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Floating 3D Printer Icon */}
          <div className="absolute top-1/4 right-10 text-8xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>
            🖨️
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="text-purple-300 text-sm font-semibold">Próximamente Q3 2025</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Impresión 3D
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Convierte tus modelos digitales en piezas físicas de alta calidad.
                <span className="text-purple-400 font-semibold"> Elige, configura y recibe en tu casa.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link
                  href="/impresion-3d/configurar"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center gap-3"
                >
                  <span>Comenzar Impresión</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  ¿Cómo Funciona?
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">5+</div>
                  <div className="text-sm text-gray-400">Materiales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">24h</div>
                  <div className="text-sm text-gray-400">Producción</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-1">100%</div>
                  <div className="text-sm text-gray-400">Calidad</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">Chile</div>
                  <div className="text-sm text-gray-400">Todo el país</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="como-funciona" className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ¿Cómo Funciona?
                </span>
              </h2>
              <p className="text-gray-300 text-lg">Simple, rápido y profesional</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-500"></div>

                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-purple-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-400 font-bold text-sm border border-purple-500/30">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Materiales Disponibles
                </span>
              </h2>
              <p className="text-gray-300 text-lg">Elige el material perfecto para tu proyecto</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  {/* Material color indicator */}
                  <div className={`w-full h-2 bg-gradient-to-r ${material.color} rounded-full mb-4`}></div>

                  <h3 className="text-2xl font-bold text-white mb-2">{material.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{material.uses}</p>

                  {/* Hover badge */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-2 py-1 bg-purple-600 rounded-full text-xs text-white font-semibold">
                      Disponible
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Proceso de Impresión
                </span>
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { step: '1', title: 'Sube tu Modelo', desc: 'Carga tu archivo 3D (.STL, .OBJ, .GLB)', icon: '📤' },
                { step: '2', title: 'Configura', desc: 'Elige material, color, calidad y tamaño', icon: '⚙️' },
                { step: '3', title: 'Cotización Automática', desc: 'Precio calculado en tiempo real según especificaciones', icon: '💰' },
                { step: '4', title: 'Paga Seguro', desc: 'Pago con Transbank Webpay Plus', icon: '💳' },
                { step: '5', title: 'Impresión', desc: 'Tu pieza se imprime con seguimiento en tiempo real', icon: '🖨️' },
                { step: '6', title: 'Recibe', desc: 'Despacho a domicilio o retiro en tienda', icon: '📦' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="flex-1 p-6 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 group-hover:border-purple-500/50 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative overflow-hidden p-12 bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>

              <div className="relative z-10 text-center space-y-6">
                <div className="text-6xl mb-4 animate-bounce">🚀</div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  ¿Listo para Imprimir?
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  Transforma tus ideas digitales en realidad física
                </p>
                <Link
                  href="/impresion-3d/configurar"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/20"
                >
                  <span>Configurar Mi Impresión</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                {/* Info adicional */}
                <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sin compromiso
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cotización gratis
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Soporte 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

