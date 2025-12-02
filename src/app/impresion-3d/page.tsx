'use client';

import Layout from '@/components/shared/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function Printing3DLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeMaterial, setActiveMaterial] = useState(0);

  const features = [
    {
      icon: '🖨️',
      title: 'Impresión Profesional',
      description: 'Tecnología FDM y Resina de última generación. Calibración láser para tolerancias de ±0.1mm.',
      detail: 'Utilizamos granjas de impresoras Bambu Lab X1 Carbon y Formlabs para asegurar consistencia industrial.'
    },
    {
      icon: '🎨',
      title: 'Múltiples Materiales',
      description: 'PLA, ABS, PETG, Resina, TPU, Nylon-CF y más. Asesoría experta para tu aplicación.',
      detail: 'Desde prototipos visuales hasta piezas finales de ingeniería con fibra de carbono.'
    },
    {
      icon: '📐',
      title: 'Sin Límites de Tamaño',
      description: 'Volumen de construcción hasta 300x300x400mm en una pieza. Ensamblaje para gran formato.',
      detail: 'Técnicas avanzadas de corte y unión para proyectos de escala humana.'
    },
    {
      icon: '🚚',
      title: 'Envío a Domicilio',
      description: 'Despacho a todo Chile en 24-48hrs. Empaque seguro anti-impacto.',
      detail: 'Seguimiento en tiempo real de tu pedido desde la producción hasta tu puerta.'
    }
  ];

  const materials = [
    { 
      name: 'PLA+', 
      type: 'Estándar',
      description: 'El estándar de oro para prototipos y figuras. Biodegradable, rígido y con excelente acabado superficial.',
      finish: 'Semi-brillante',
      techSpecs: { temp: '60°C', strength: 7, flexibility: 3, detail: 9 },
      bestFor: ['Prototipos rápidos', 'Figuras decorativas', 'Maquetas arquitectónicas'],
      color: 'from-green-400 to-emerald-600',
      sphereStyle: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)]'
    },
    { 
      name: 'PETG', 
      type: 'Ingeniería',
      description: 'Lo mejor de dos mundos: la facilidad del PLA con la resistencia del ABS. Resistente a químicos y humedad.',
      finish: 'Brillante / Translucido',
      techSpecs: { temp: '80°C', strength: 8, flexibility: 5, detail: 8 },
      bestFor: ['Piezas mecánicas', 'Contenedores de líquidos', 'Uso exterior'],
      color: 'from-blue-400 to-cyan-600',
      sphereStyle: 'bg-gradient-to-br from-blue-300/80 via-cyan-500/80 to-blue-900/90 backdrop-blur-md shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] border border-white/20'
    },
    { 
      name: 'ABS+', 
      type: 'Industrial',
      description: 'Material robusto y duradero. Soporta altas temperaturas y puede ser post-procesado (lijado/pintado) fácilmente.',
      finish: 'Mate',
      techSpecs: { temp: '100°C', strength: 9, flexibility: 4, detail: 7 },
      bestFor: ['Piezas automotrices', 'Carcasas electrónicas', 'Engranajes'],
      color: 'from-red-400 to-orange-600',
      sphereStyle: 'bg-gradient-to-br from-red-400 via-orange-500 to-red-900 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4)] brightness-90'
    },
    { 
      name: 'TPU 95A', 
      type: 'Flexible',
      description: 'Elastómero termoplástico flexible y resistente a la abrasión. Ideal para piezas que necesitan absorber impactos.',
      finish: 'Gomoso / Suave',
      techSpecs: { temp: '50°C', strength: 6, flexibility: 10, detail: 6 },
      bestFor: ['Fundas de celular', 'Sellos y juntas', 'Amortiguadores'],
      color: 'from-yellow-400 to-amber-600',
      sphereStyle: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)]'
    },
    { 
      name: 'Resina 8K', 
      type: 'Alta Precisión',
      description: 'Fotopolímero curado por luz UV. Ofrece el nivel de detalle más alto posible, invisible al ojo humano.',
      finish: 'Liso Perfecto',
      techSpecs: { temp: '45°C', strength: 5, flexibility: 2, detail: 10 },
      bestFor: ['Joyería', 'Miniaturas D&D', 'Odontología'],
      color: 'from-purple-400 to-pink-600',
      sphereStyle: 'bg-gradient-to-br from-purple-300 via-pink-500 to-purple-900 shadow-[inset_-10px_-10px_30px_rgba(255,255,255,0.2),0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden after:content-[""] after:absolute after:top-2 after:left-4 after:w-8 after:h-4 after:bg-white/40 after:blur-md after:rotate-[-45deg] after:rounded-full'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        {/* Hero Section */}
        <div className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
          
          {/* Orbs */}
          <div className="absolute top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-600/30 rounded-full blur-[80px] sm:blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 sm:mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-300">Servicio de Impresión Activo</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Materializa tus<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Ideas Digitales</span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Servicio de impresión 3D industrial al alcance de todos. 
              Calidad premium, materiales de ingeniería y atención personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/impresion-3d/configurar"
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Cotizar Ahora
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
              <button 
                onClick={() => document.getElementById('materiales')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all font-medium backdrop-blur-sm"
              >
                Explorar Materiales
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {[
                { label: 'Precisión', value: '±0.1mm' },
                { label: 'Materiales', value: '12+' },
                { label: 'Tiempo Entrega', value: '24h' },
                { label: 'Envíos', value: 'Todo Chile' }
              ].map((stat, i) => (
                <div key={i} className="text-center border-r last:border-r-0 border-white/10">
                  <div className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Section - The Core Update */}
        <section id="materiales" className="py-16 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Catálogo de Materiales</h2>
              <p className="text-base sm:text-xl text-gray-400 max-w-2xl">
                Seleccionamos cuidadosamente los mejores polímeros para cada aplicación. 
                Desde prototipado rápido hasta piezas de uso final.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 sm:gap-12">
              {/* Material Selector List */}
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                {materials.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMaterial(index)}
                    className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 border ${
                      activeMaterial === index 
                        ? 'bg-white/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <h3 className={`text-lg sm:text-xl font-bold ${activeMaterial === index ? 'text-white' : 'text-gray-400'}`}>
                        {material.name}
                      </h3>
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full ${
                        activeMaterial === index ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-gray-500'
                      }`}>
                        {material.type}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm line-clamp-2 ${activeMaterial === index ? 'text-gray-300' : 'text-gray-500'}`}>
                      {material.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Material Detail View */}
              <div className="lg:col-span-8">
                <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-8 md:p-12 overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br ${materials[activeMaterial].color} opacity-10 blur-[80px] sm:blur-[100px] transition-all duration-700`}></div>

                  <div className="relative z-10 grid md:grid-cols-2 gap-8 sm:gap-12 items-center h-full">
                    {/* 3D Sphere Representation */}
                    <div className="flex justify-center items-center">
                      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 transition-all duration-500">
                        {/* The Sphere */}
                        <div 
                          className={`w-full h-full rounded-full transition-all duration-700 ${materials[activeMaterial].sphereStyle}`}
                        ></div>
                        
                        {/* Floating Elements */}
                        <div className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-3 sm:h-4 bg-black/50 blur-xl rounded-full"></div>
                      </div>
                    </div>

                    {/* Specs & Info */}
                    <div className="space-y-5 sm:space-y-8">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-2">{materials[activeMaterial].name}</h3>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                          {materials[activeMaterial].description}
                        </p>
                      </div>

                      {/* Properties Bars */}
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          { label: 'Resistencia', value: materials[activeMaterial].techSpecs.strength },
                          { label: 'Flexibilidad', value: materials[activeMaterial].techSpecs.flexibility },
                          { label: 'Detalle', value: materials[activeMaterial].techSpecs.detail }
                        ].map((prop, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span className="text-gray-400">{prop.label}</span>
                              <span className="text-gray-500">{prop.value}/10</span>
                            </div>
                            <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${materials[activeMaterial].color} transition-all duration-1000 ease-out`}
                                style={{ width: `${prop.value * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Specs Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
                        <div>
                          <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Acabado</div>
                          <div className="font-medium text-sm sm:text-base">{materials[activeMaterial].finish}</div>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Temp. Max</div>
                          <div className="font-medium text-sm sm:text-base">{materials[activeMaterial].techSpecs.temp}</div>
                        </div>
                      </div>

                      {/* Best For Tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {materials[activeMaterial].bestFor.map((tag, i) => (
                          <span key={i} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 sm:py-32 bg-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Flujo de Trabajo</h2>
              <p className="text-gray-400 text-sm sm:text-base">De tu archivo digital a la pieza física en 3 pasos</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

              {[
                { title: 'Cotización Instantánea', desc: 'Sube tu STL/OBJ y obtén precio en segundos.', icon: '1' },
                { title: 'Fabricación', desc: 'Nuestras granjas inician la producción 24/7.', icon: '2' },
                { title: 'Entrega', desc: 'Control de calidad y despacho inmediato.', icon: '3' }
              ].map((step, i) => (
                <div key={i} className="relative z-10 text-center group">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-[#0a0a0a] border border-purple-500/30 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6 group-hover:scale-110 group-hover:border-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    {step.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">¿Tienes un proyecto en mente?</h2>
            <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12 px-4">
              No importa si es una sola pieza o una producción en serie. 
              Tenemos la capacidad para hacerlo realidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link
                href="/impresion-3d/configurar"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                Comenzar Proyecto
              </Link>
              <a
                href="mailto:contacto@takopi.cl"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-transparent border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition-colors"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

