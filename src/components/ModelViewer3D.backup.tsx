'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../styles/model-viewer.css';
import { configureModelViewerEnvironment } from '@/config/model-viewer';

// Variable global para trackear si model-viewer ya fue cargado
let modelViewerLoaded = false;
let modelViewerLoadingPromise: Promise<void> | null = null;

// Componente wrapper para el web component model-viewer
function ModelViewerWrapper({ children, onLoad, onError, ...rest }: any) {
  const modelViewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(modelViewerLoaded);

  // Cargar el web component dinámicamente solo una vez globalmente
  useEffect(() => {
    let isMounted = true;

    const loadModelViewer = async () => {
      // Si ya está cargado, solo actualizar el estado
      if (modelViewerLoaded) {
        if (isMounted) setIsLoaded(true);
        return;
      }

      // Si ya hay una carga en progreso, esperar a que termine
      if (modelViewerLoadingPromise) {
        try {
          await modelViewerLoadingPromise;
          if (isMounted) setIsLoaded(true);
        } catch (error) {
          console.error('Error loading model-viewer:', error);
          if (isMounted) {
            onError?.(new CustomEvent('error', { detail: { message: 'Failed to load model-viewer' } }));
          }
        }
        return;
      }

      // Crear nueva promesa de carga
      modelViewerLoadingPromise = (async () => {
        try {
          // Configurar el entorno de model-viewer para reducir advertencias
          configureModelViewerEnvironment();

          // Importación dinámica compatible con Turbopack
          await import('@google/model-viewer');
          modelViewerLoaded = true;
        } catch (error) {
          console.error('Error loading model-viewer:', error);
          modelViewerLoadingPromise = null; // Permitir reintentos
          throw error;
        }
      })();

      try {
        await modelViewerLoadingPromise;
        if (isMounted) setIsLoaded(true);
      } catch (error) {
        if (isMounted) {
          onError?.(new CustomEvent('error', { detail: { message: 'Failed to load model-viewer' } }));
        }
      }
    };

    loadModelViewer();

    return () => {
      isMounted = false;
    };
  }, [onError]);

  // Adjuntar listeners a eventos del web component
  useEffect(() => {
    if (!isLoaded) return;

    const el = modelViewerRef.current;
    if (!el) return;

    const handleLoad = () => {
      try { console.log('🟢 model-viewer event: load'); } catch { }
      onLoad?.();
    };
    const handleError = (e: CustomEvent) => {
      try { console.log('🔴 model-viewer event: error', e?.detail); } catch { }
      onError?.(e);
    };

    el.addEventListener('load', handleLoad as any);
    el.addEventListener('error', handleError as any);

    // Polling para detectar cuando el modelo está listo
    // model-viewer a veces no dispara el evento 'load' correctamente
    const checkInterval = setInterval(() => {
      // Verificar si el modelo está renderizado (tiene un modelViewer interno con scene)
      if (el.loaded || el.modelIsVisible || (el as any).model) {
        console.log('🟢 model-viewer cargado (detectado por polling)');
        clearInterval(checkInterval);
        onLoad?.();
      }
    }, 500);

    // Limpiar después de 30 segundos máximo
    const maxTimeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 30000);

    return () => {
      el.removeEventListener('load', handleLoad as any);
      el.removeEventListener('error', handleError as any);
      clearInterval(checkInterval);
      clearTimeout(maxTimeout);
    };
  }, [onLoad, onError, isLoaded]);

  // No renderizar hasta que model-viewer esté cargado
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Cargando visor 3D...</p>
        </div>
      </div>
    );
  }

  return React.createElement('model-viewer', {
    ref: modelViewerRef,
    ...rest
  }, children);
}

interface ModelViewer3DProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  className?: string;
  fallbackImage?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

// Interfaz para las props del ModelViewer (web component)
interface ModelViewerProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  'auto-rotate'?: boolean;
  'camera-controls'?: boolean;
  loading?: string;
  reveal?: string;
  'shadow-intensity'?: number;
  exposure?: number;
  'environment-image'?: string;
  'skybox-image'?: string;
  poster?: string;
  onLoad?: () => void;
  onError?: (event: CustomEvent) => void;
  children?: React.ReactNode;
}

export default function ModelViewer3D({
  src,
  alt = 'Modelo 3D',
  width = '100%',
  height = '400px',
  autoRotate = true,
  cameraControls = true,
  className = '',
  fallbackImage = '/placeholders/placeholder-3d.svg',
  onLoad,
  onError
}: ModelViewer3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Controls State
  const [currentRotation, setCurrentRotation] = useState(autoRotate);
  const [currentShadows, setCurrentShadows] = useState(1.5);
  const [currentExposure, setCurrentExposure] = useState(1.5);

  // Animation State
  const [animations, setAnimations] = useState<string[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const modelViewerRef = useRef<any>(null);

  // Resetear estado cuando cambie el src
  useEffect(() => {
    console.log('🔄 ModelViewer3D: src cambió, reseteando estado...', src?.substring(0, 60));
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Log inicial para debug
  useEffect(() => {
    console.log('🧩 ModelViewer3D inicializado:', { src, alt, width, height });
  }, [src, alt, width, height]);

  // Verificar soporte de WebGL
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setIsWebGLSupported(!!gl);
      } catch (e) {
        setIsWebGLSupported(false);
      }
    };

    checkWebGLSupport();
  }, []);

  // Timeout para detectar si el modelo no carga
  useEffect(() => {
    if (!isLoading || !src) return;
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ ModelViewer3D: Timeout de carga (15s), el modelo puede estar tardando mucho:', src?.substring(0, 60));
      }
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, src]);

  const handleLoad = () => {
    console.log('✅ ModelViewer3D: Modelo cargado exitosamente!', src?.substring(0, 80));
    setIsLoading(false);
    setHasError(false);

    // Extract animations
    const viewer = modelViewerRef.current;
    if (viewer && viewer.availableAnimations && viewer.availableAnimations.length > 0) {
      setAnimations(viewer.availableAnimations);
      setSelectedAnimation(viewer.availableAnimations[0]);
    } else {
      setAnimations([]);
    }

    onLoad?.();
  };

  const handleError = (event: CustomEvent) => {
    const errorDetail = event.detail;
    console.error('❌ ModelViewer3D error:', errorDetail);
    console.error('❌ URL que falló:', src);
    setIsLoading(false);
    setHasError(true);
    onError?.(errorDetail?.message || 'Error cargando modelo 3D');
  };

  // Si no hay soporte de WebGL, hay error o no hay src, mostrar estado de carga
  if (!isWebGLSupported || hasError || !src) {
    return (
      <div
        className={`relative flex items-center justify-center bg-[#0a0a0a] rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">
            {!isWebGLSupported ? 'WebGL no soportado' : hasError ? 'Error al cargar modelo' : 'Cargando modelo 3D...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Controls Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 p-2 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white transition-colors controls-toggle shadow-lg backdrop-blur-sm"
        title="Herramientas de Inspección"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-16 right-4 z-20 bg-[#0f0f0f]/95 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[260px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-purple-400">⚡</span>
            Inspector 3D
          </h3>

          {/* Animación */}
          <div className="mb-4 pb-4 border-b border-white/5">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 flex justify-between items-center">
              Animación
              {animations.length > 0 && <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">{animations.length} clips</span>}
            </p>

            {/* Play/Pause & Auto-Rotate */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${isPlaying ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
              </button>

              <button
                onClick={() => setCurrentRotation(!currentRotation)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentRotation ? 'bg-blue-600/80 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                title="Rotación automática"
              >
                ↻ Girar
              </button>
            </div>

            {/* Animation Selector */}
            {animations.length > 0 && (
              <div className="mb-3">
                <select
                  value={selectedAnimation || ''}
                  onChange={(e) => setSelectedAnimation(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
                >
                  {animations.map(anim => (
                    <option key={anim} value={anim}>{anim}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed Slider */}
            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex justify-between">
                <span>Velocidad</span>
                <span className="text-white">{animationSpeed}x</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
              />
            </div>
          </div>

          {/* Iluminación */}
          <div className="mb-4 pb-4 border-b border-white/5">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Iluminación (PBR)</p>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { name: 'Studio', exp: 1, shad: 1 },
                { name: 'Bright', exp: 1.5, shad: 0.5 },
                { name: 'Dark', exp: 0.7, shad: 2 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setCurrentExposure(preset.exp);
                    setCurrentShadows(preset.shad);
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-gray-300 border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Manual Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-[10px] block mb-1 flex justify-between">
                  <span>Exposición</span>
                  <span className="text-white">{currentExposure.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={currentExposure}
                  onChange={(e) => setCurrentExposure(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[10px] block mb-1 flex justify-between">
                  <span>Sombras</span>
                  <span className="text-white">{currentShadows.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={currentShadows}
                  onChange={(e) => setCurrentShadows(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setCurrentRotation(autoRotate);
              setCurrentShadows(1.5);
              setCurrentExposure(1.5);
              setAnimationSpeed(1);
              setIsPlaying(true);
            }}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-all duration-300"
          >
            ↻ Resetear todo
          </button>
        </div>
      )}

      {/* Model Viewer - key fuerza re-mount cuando cambia src */}
      <ModelViewerWrapper
        key={src}
        ref={modelViewerRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent'
        }}
        auto-rotate={currentRotation}
        camera-controls={cameraControls}
        loading="eager"
        reveal="auto"
        shadow-intensity={currentShadows}
        exposure={currentExposure}
        poster={fallbackImage}
        onLoad={handleLoad}
        onError={handleError}
        // Animation props
        autoplay={isPlaying}
        time-scale={animationSpeed}
        animation-name={selectedAnimation}
      />
    </div>
  );
}

// Componente específico para vista previa en cards
export function ModelViewerPreview({ src, alt = 'Vista previa 3D' }: { src: string; alt?: string }) {
  return (
    <ModelViewer3D
      src={src}
      alt={alt}
      width="100%"
      height="200px"
      autoRotate={true}
      cameraControls={false}
      className="rounded-lg overflow-hidden"
    />
  );
}

// Componente específico para modal
export function ModelViewerModal({
  src,
  alt = 'Modelo 3D completo',
  width = "100%",
  height = "520px",
  autoRotate = true,
  cameraControls = true
}: {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
}) {
  return (
    <ModelViewer3D
      src={src}
      alt={alt}
      width={width}
      height={height}
      autoRotate={autoRotate}
      cameraControls={cameraControls}
      className="rounded-xl overflow-hidden"
    />
  );
}
