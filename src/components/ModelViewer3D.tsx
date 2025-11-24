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

    return () => {
      el.removeEventListener('load', handleLoad as any);
      el.removeEventListener('error', handleError as any);
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
  const [currentRotation, setCurrentRotation] = useState(autoRotate);
  const [currentShadows, setCurrentShadows] = useState(1.5);
  const [currentExposure, setCurrentExposure] = useState(1.5);

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

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (event: CustomEvent) => {
    const errorDetail = event.detail;
    // Silently handle error to avoid console spam for 404s
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
        className="absolute top-4 right-4 z-20 p-2 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white transition-colors controls-toggle"
        title="Controles del visor 3D"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-16 right-4 z-20 bg-[#0f0f0f]/95 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[240px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Controles 3D
          </h3>

          {/* Animación */}
          <div className="mb-4 pb-4 border-b border-white/5">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Animación</p>
            <label className="flex items-center justify-between text-gray-300 text-xs">
              <span>Rotación automática</span>
              <button
                onClick={() => setCurrentRotation(!currentRotation)}
                className={`relative w-10 h-5 rounded-full transition-all duration-300 ${currentRotation ? 'bg-purple-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${currentRotation ? 'translate-x-5' : 'translate-x-0'} shadow-lg`} />
              </button>
            </label>
          </div>

          {/* Iluminación y Sombras */}
          <div className="mb-4 pb-4 border-b border-white/5">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Iluminación</p>
            
            {/* Shadow Intensity */}
            <div className="mb-3">
              <label className="text-gray-300 text-xs block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Sombras
                </span>
                <span className="text-white font-medium">{currentShadows.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={currentShadows}
                onChange={(e) => setCurrentShadows(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>

            {/* Exposure */}
            <div>
              <label className="text-gray-300 text-xs block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Brillo
                </span>
                <span className="text-white font-medium">{currentExposure.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={currentExposure}
                onChange={(e) => setCurrentExposure(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setCurrentRotation(autoRotate);
              setCurrentShadows(1.5);
              setCurrentExposure(1.5);
            }}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-all duration-300"
          >
            ↻ Resetear valores
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400 font-medium">Cargando modelo 3D...</p>
          </div>
        </div>
      )}

      {/* Model Viewer */}
      <ModelViewerWrapper
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
