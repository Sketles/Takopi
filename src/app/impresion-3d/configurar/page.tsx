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

  const materials = [
    { id: 'PLA', name: 'PLA', price: 8000, color: 'from-green-400 to-emerald-600', desc: 'Ideal para decoración' },
    { id: 'ABS', name: 'ABS', price: 10000, color: 'from-blue-400 to-cyan-600', desc: 'Resistente al calor' },
    { id: 'PETG', name: 'PETG', price: 12000, color: 'from-purple-400 to-pink-600', desc: 'Duradero y flexible' },
    { id: 'Resina', name: 'Resina', price: 25000, color: 'from-orange-400 to-red-600', desc: 'Alta precisión' },
    { id: 'TPU', name: 'TPU', price: 15000, color: 'from-yellow-400 to-amber-600', desc: 'Flexible y elástico' }
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#1ABC9C'
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
    // Aquí iría la lógica para proceder al checkout
    console.log('Proceeding to checkout with config:', config);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/impresion-3d"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Configurar Impresión 3D
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Personaliza tu impresión y obtén una cotización instantánea</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Visor 3D - Columna Izquierda */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload / Visor */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden">
                {!modelLoaded ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-96 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-900/20 transition-all duration-300 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.obj,.glb,.gltf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📤</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sube tu Modelo 3D</h3>
                    <p className="text-gray-400 mb-6">Arrastra o haz clic para seleccionar</p>
                    <div className="flex gap-3 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full">.STL</span>
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full">.OBJ</span>
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full">.GLB</span>
                      <span className="px-3 py-1 bg-gray-700/50 rounded-full">.GLTF</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96 bg-gray-900/50">
                    {/* Visor 3D */}
                    {modelViewerLoaded ? (
                      <model-viewer
                        src={config.modelUrl}
                        alt="Modelo 3D"
                        auto-rotate
                        camera-controls
                        style={{ width: '100%', height: '100%' }}
                        className="w-full h-full"
                      ></model-viewer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                          <p className="text-gray-400">Cargando visor 3D...</p>
                        </div>
                      </div>
                    )}

                    {/* Botón para cambiar modelo */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Cambiar Modelo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.obj,.glb,.gltf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Info del modelo */}
                {modelLoaded && config.modelFile && (
                  <div className="p-4 bg-gray-800/40 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{config.modelFile.name}</p>
                        <p className="text-gray-400 text-sm">{(config.modelFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div className="text-green-400 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cargado
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Opciones de Configuración */}
              {modelLoaded && (
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 space-y-6">
                  {/* Material */}
                  <div>
                    <label className="block text-white font-semibold mb-3">Material</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {materials.map(material => (
                        <button
                          key={material.id}
                          onClick={() => setConfig({ ...config, material: material.id })}
                          className={`p-4 rounded-xl border-2 transition-all ${config.material === material.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                          <div className={`w-full h-2 bg-gradient-to-r ${material.color} rounded-full mb-2`}></div>
                          <p className="text-white font-semibold text-sm">{material.name}</p>
                          <p className="text-gray-400 text-xs">{material.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-white font-semibold mb-3">Color</label>
                    <div className="flex gap-3 flex-wrap">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setConfig({ ...config, color })}
                          className={`w-12 h-12 rounded-xl transition-all ${config.color === color ? 'ring-4 ring-purple-500 scale-110' : 'hover:scale-105'
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Calidad */}
                  <div>
                    <label className="block text-white font-semibold mb-3">Calidad de Impresión</label>
                    <div className="grid grid-cols-3 gap-3">
                      {qualities.map(quality => (
                        <button
                          key={quality.id}
                          onClick={() => setConfig({ ...config, quality: quality.id })}
                          className={`p-4 rounded-xl border-2 transition-all ${config.quality === quality.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                          <p className="text-white font-semibold mb-1">{quality.name}</p>
                          <p className="text-gray-400 text-xs mb-1">{quality.desc}</p>
                          <p className="text-purple-400 text-xs font-medium">{quality.time}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relleno */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Relleno: {config.infill}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={config.infill}
                      onChange={(e) => setConfig({ ...config, infill: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Menos material</span>
                      <span>Más resistente</span>
                    </div>
                  </div>

                  {/* Escala */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Escala: {config.scale}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="5"
                      value={config.scale}
                      onChange={(e) => setConfig({ ...config, scale: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Copias y Soportes */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-3">Copias</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={config.copies}
                        onChange={(e) => setConfig({ ...config, copies: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-3">Soportes</label>
                      <button
                        onClick={() => setConfig({ ...config, supports: !config.supports })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${config.supports
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                      >
                        {config.supports ? '✓ Activado' : 'Desactivado'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel de Resumen - Columna Derecha */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 space-y-6">
                <h2 className="text-2xl font-bold text-white">Resumen</h2>

                {!modelLoaded ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-gray-400">Sube un modelo para ver el resumen</p>
                  </div>
                ) : (
                  <>
                    {/* Precio */}
                    <div className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
                      <p className="text-gray-300 text-sm mb-2">Precio Estimado</p>
                      {isCalculating ? (
                        <div className="animate-pulse flex items-center gap-2">
                          <div className="h-8 bg-gray-700 rounded w-32"></div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-white">
                            ${estimatedPrice.toLocaleString('es-CL')}
                          </span>
                          <span className="text-gray-400">CLP</span>
                        </div>
                      )}
                      <p className="text-purple-300 text-sm mt-2">⏱️ Tiempo: {estimatedTime}</p>
                    </div>

                    {/* Detalles */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Material:</span>
                        <span className="text-white font-medium">{config.material}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Calidad:</span>
                        <span className="text-white font-medium capitalize">{config.quality}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Relleno:</span>
                        <span className="text-white font-medium">{config.infill}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Escala:</span>
                        <span className="text-white font-medium">{config.scale}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Copias:</span>
                        <span className="text-white font-medium">{config.copies}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Soportes:</span>
                        <span className="text-white font-medium">{config.supports ? 'Sí' : 'No'}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Proceder al Pago
                    </button>

                    {/* Info adicional */}
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pago seguro con Transbank
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Despacho a todo Chile
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Seguimiento en tiempo real
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

