'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import '../styles/model-viewer.css';
import { configureModelViewerEnvironment, getOptimizedModelViewerProps } from '@/config/model-viewer';

// Componente wrapper para el web component model-viewer
const ModelViewerWrapper = dynamic(
  () => Promise.resolve(function ModelViewerWrapper({ children, onLoad, onError, ...rest }: any) {
    const modelViewerRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Cargar el web component dinámicamente solo una vez
    useEffect(() => {
      let isMounted = true;

      const loadModelViewer = async () => {
        try {
          // Configurar el entorno de model-viewer para reducir advertencias
          configureModelViewerEnvironment();

          await import('@google/model-viewer');

          if (isMounted) {
            setIsLoaded(true);
          }
        } catch (error) {
          console.error('Error loading model-viewer:', error);
        }
      };

      loadModelViewer();

      return () => {
        isMounted = false;
      };
    }, []);

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
      return <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Cargando visor 3D...</div>
      </div>;
    }


    return React.createElement('model-viewer', {
      ref: modelViewerRef,
      ...rest
    }, children);
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-300">Cargando visor 3D...</p>
        </div>
      </div>
    )
  }
);

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
    console.error('❌ Error cargando modelo 3D:', {
      src,
      message: errorDetail?.message || 'Unknown error',
      type: event.type
    });
    setIsLoading(false);
    setHasError(true);
    onError?.(errorDetail?.message || 'Error cargando modelo 3D');
  };

  // Si no hay soporte de WebGL, hay error o no hay src, mostrar imagen de fallback
  if (!isWebGLSupported || hasError || !src) {
    return (
      <div
        className={`relative flex items-center justify-center bg-gray-900/70 rounded-lg border border-gray-600 ${className}`}
        style={{ width, height }}
      >
        <img
          src={fallbackImage}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-30"
        />
        <div className="relative z-10 text-center">
          <p className="text-sm text-gray-300">
            {!isWebGLSupported ? 'WebGL no soportado' : 'No se pudo visualizar el modelo'}
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
        <div className="absolute top-16 right-4 z-20 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-gray-600 min-w-[200px] controls-panel">
          <h3 className="text-white text-sm font-semibold mb-3">Controles 3D</h3>

          {/* Auto Rotate Toggle */}
          <div className="mb-3">
            <label className="flex items-center justify-between text-gray-300 text-xs">
              <span>Rotación automática</span>
              <button
                onClick={() => setCurrentRotation(!currentRotation)}
                className={`w-8 h-4 rounded-full transition-colors ${currentRotation ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${currentRotation ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
              </button>
            </label>
          </div>

          {/* Shadow Intensity */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs block mb-1">
              Intensidad de sombras: {currentShadows.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={currentShadows}
              onChange={(e) => setCurrentShadows(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Exposure */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs block mb-1">
              Exposición: {currentExposure.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={currentExposure}
              onChange={(e) => setCurrentExposure(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setCurrentRotation(autoRotate);
              setCurrentShadows(1.5);
              setCurrentExposure(1.5);
            }}
            className="w-full px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
          >
            Resetear
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-600 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-300">Cargando modelo 3D...</p>
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
        autoRotate={currentRotation}
        cameraControls={cameraControls}
        onLoad={handleLoad}
        onError={handleError}
      >
        {/* Sin poster para evitar superposición negra */}
      </ModelViewerWrapper>
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
