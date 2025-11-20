'use client';

import Layout from '@/components/shared/Layout';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface PrintConfig {
  modelFile: File | null;
  modelUrl: string;
  material: string;
  color: string;
  quality: string;
  infill: number;
  scale: number;
  copies: number;
  supports: boolean;
}

export default function PrintingConfigPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<PrintConfig>({
    modelFile: null,
    modelUrl: '',
    material: 'PLA',
    color: '#FF6B6B',
    quality: 'normal',
    infill: 20,
    scale: 100,
    copies: 1,
    supports: true
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  // Cargar model-viewer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').then(() => {
        setModelViewerLoaded(true);
      });
    }
  }, []);

  // Materiales con estilos 3D (Misma lógica que la landing)
  const materials = [
    {
      id: 'PLA',
      name: 'PLA+',
      price: 8000,
      desc: 'Estándar, rígido',
      color: 'from-green-400 to-emerald-600',
      sphereStyle: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-900 shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)]'
    },
    {
      id: 'ABS',
      name: 'ABS+',
      price: 10000,
      desc: 'Resistente, mate',
      color: 'from-red-400 to-orange-600',
      sphereStyle: 'bg-gradient-to-br from-red-400 via-orange-500 to-red-900 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4)] brightness-90'
    },
    {
      id: 'PETG',
      name: 'PETG',
      price: 12000,
      desc: 'Duradero, brillante',
      color: 'from-blue-400 to-cyan-600',
      sphereStyle: 'bg-gradient-to-br from-blue-300/80 via-cyan-500/80 to-blue-900/90 backdrop-blur-md shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)] border border-white/20'
    },
    {
      id: 'Resina',
      name: 'Resina 8K',
      price: 25000,
      desc: 'Ultra detalle',
      color: 'from-purple-400 to-pink-600',
      sphereStyle: 'bg-gradient-to-br from-purple-300 via-pink-500 to-purple-900 shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden after:content-[""] after:absolute after:top-1 after:left-2 after:w-4 after:h-2 after:bg-white/40 after:blur-sm after:rotate-[-45deg] after:rounded-full'
    },
    {
      id: 'TPU',
      name: 'TPU 95A',
      price: 15000,
      desc: 'Flexible, goma',
      color: 'from-yellow-400 to-amber-600',
      sphereStyle: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-900 shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)]'
    }
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#1ABC9C',
    '#FFFFFF', '#000000', '#808080'
  ];

  const qualities = [
    { id: 'draft', name: 'Borrador', time: '2-4h', desc: '0.3mm - Rápido' },
    { id: 'normal', name: 'Normal', time: '4-8h', desc: '0.2mm - Balanceado' },
    { id: 'high', name: 'Alta', time: '8-16h', desc: '0.1mm - Detallado' }
  ];

  // Calcular precio estimado
  useEffect(() => {
    if (!config.modelFile) return;

    setIsCalculating(true);
    setTimeout(() => {
      const baseMaterial = materials.find(m => m.id === config.material)?.price || 10000;
      const qualityMultiplier = config.quality === 'draft' ? 0.8 : config.quality === 'high' ? 1.3 : 1;
      const infillMultiplier = 1 + (config.infill / 100);
      const scaleMultiplier = Math.pow(config.scale / 100, 3);
      const supportsMultiplier = config.supports ? 1.2 : 1;

      const price = baseMaterial * qualityMultiplier * infillMultiplier * scaleMultiplier * supportsMultiplier * config.copies;

      setEstimatedPrice(Math.round(price));
      setEstimatedTime(qualities.find(q => q.id === config.quality)?.time || '4-8h');
      setIsCalculating(false);
    }, 500);
  }, [config]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfig({ ...config, modelFile: file, modelUrl: URL.createObjectURL(file) });
      setModelLoaded(true);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/impresion-3d/configurar');
      return;
    }
    console.log('Proceeding to checkout with config:', config);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 pb-20">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <Link
                href="/impresion-3d"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Catálogo
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">
                Configurador <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Inteligente</span>
              </h1>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-purple-500 animate-pulse'}`}></div>
              <span className="text-sm font-medium text-gray-300">
                {modelLoaded ? 'Modelo Cargado' : 'Esperando Modelo'}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - 3D Viewer & Upload */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden group">
                {!modelLoaded ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-300"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.obj,.glb,.gltf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sube tu Archivo 3D</h3>
                    <p className="text-gray-400 mb-8">Arrastra o selecciona tu archivo .STL, .OBJ o .GLB</p>
                    <div className="flex gap-3">
                      {['STL', 'OBJ', 'GLB'].map(ext => (
                        <span key={ext} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-500 font-mono">
                          .{ext}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 3D Viewer */}
                    {modelViewerLoaded ? (
                      <model-viewer
                        src={config.modelUrl}
                        alt="Modelo 3D"
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        exposure="0.8"
                        style={{ width: '100%', height: '100%', backgroundColor: '#00000000' }}
                        className="w-full h-full"
                      ></model-viewer>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                      </div>
                    )}

                    {/* Viewer Controls Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        Cambiar Archivo
                      </button>
                    </div>

                    {/* File Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                          <p className="font-medium text-white truncate max-w-[200px]">{config.modelFile?.name}</p>
                          <p className="text-xs text-gray-400">{(config.modelFile!.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Listo para imprimir
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Configuration Options */}
              {modelLoaded && (
                <div className="space-y-8 animate-fade-in-up">
                  {/* Material Selection */}
                  <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">1</span>
                      Material
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {materials.map(material => (
                        <button
                          key={material.id}
                          onClick={() => setConfig({ ...config, material: material.id })}
                          className={`relative group p-4 rounded-2xl border transition-all duration-300 ${config.material === material.id
                              ? 'bg-white/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                              : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                        >
                          <div className="flex justify-center mb-3">
                            <div className={`w-12 h-12 rounded-full ${material.sphereStyle} transition-transform duration-300 group-hover:scale-110`}></div>
                          </div>
                          <div className="text-center">
                            <p className={`font-bold text-sm ${config.material === material.id ? 'text-white' : 'text-gray-300'}`}>
                              {material.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{material.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Color Selection */}
                  <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</span>
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setConfig({ ...config, color })}
                          className={`w-10 h-10 rounded-full transition-all duration-300 ${config.color === color
                              ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-white scale-110'
                              : 'hover:scale-110 hover:ring-2 hover:ring-white/20'
                            }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Print Settings Grid */}
                  <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">3</span>
                      Ajustes de Impresión
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Quality */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <label className="block text-sm font-medium text-gray-400 mb-3">Calidad</label>
                        <div className="flex gap-2">
                          {qualities.map(quality => (
                            <button
                              key={quality.id}
                              onClick={() => setConfig({ ...config, quality: quality.id })}
                              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${config.quality === quality.id
                                  ? 'bg-purple-600 text-white shadow-lg'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                              {quality.name}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {qualities.find(q => q.id === config.quality)?.desc}
                        </p>
                      </div>

                      {/* Infill Slider */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-400">Relleno</label>
                          <span className="text-sm font-bold text-purple-400">{config.infill}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={config.infill}
                          onChange={(e) => setConfig({ ...config, infill: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                          <span>Ligero</span>
                          <span>Sólido</span>
                        </div>
                      </div>

                      {/* Scale Slider */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-400">Escala</label>
                          <span className="text-sm font-bold text-purple-400">{config.scale}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="5"
                          value={config.scale}
                          onChange={(e) => setConfig({ ...config, scale: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>

                      {/* Copies & Supports */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Copias</label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setConfig({ ...config, copies: Math.max(1, config.copies - 1) })}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >-</button>
                            <span className="font-bold text-lg w-8 text-center">{config.copies}</span>
                            <button
                              onClick={() => setConfig({ ...config, copies: config.copies + 1 })}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >+</button>
                          </div>
                        </div>

                        <button
                          onClick={() => setConfig({ ...config, supports: !config.supports })}
                          className={`rounded-2xl p-4 border transition-all flex flex-col items-center justify-center gap-2 ${config.supports
                              ? 'bg-purple-500/20 border-purple-500/50 text-white'
                              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                          <span className="text-sm font-medium">Soportes</span>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${config.supports ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.supports ? 'left-6' : 'left-1'}`}></div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Right Column - Summary Panel */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

                  <h2 className="text-2xl font-bold mb-6 relative z-10">Resumen de Orden</h2>

                  {!modelLoaded ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                      <div className="text-4xl mb-4 opacity-50">🧾</div>
                      <p className="text-gray-500 text-sm">Sube un modelo para<br />ver la cotización</p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative z-10 animate-fade-in">
                      {/* Price Card */}
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                        <p className="text-gray-400 text-sm mb-1">Total Estimado</p>
                        {isCalculating ? (
                          <div className="h-10 bg-white/10 rounded-lg animate-pulse w-3/4"></div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white tracking-tight">
                              ${estimatedPrice.toLocaleString('es-CL')}
                            </span>
                            <span className="text-gray-500 font-medium">CLP</span>
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-sm text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg w-fit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Tiempo aprox: {estimatedTime}
                        </div>
                      </div>

                      {/* Specs List */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-gray-400">Material</span>
                          <span className="font-medium text-white">{materials.find(m => m.id === config.material)?.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-gray-400">Calidad</span>
                          <span className="font-medium text-white capitalize">{config.quality}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-gray-400">Escala</span>
                          <span className="font-medium text-white">{config.scale}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-gray-400">Relleno</span>
                          <span className="font-medium text-white">{config.infill}%</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
                      >
                        Continuar al Pago
                      </button>

                      {/* Trust Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 text-center">
                        <div className="bg-white/5 rounded-lg p-2">
                          🔒 Pago Seguro
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          🚚 Envíos a todo Chile
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

