'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Componente wrapper para el web component model-viewer
const ModelViewerWrapper = dynamic(
  () => Promise.resolve(function ModelViewerWrapper({ children, onLoad, onError, ...rest }: any) {
    const modelViewerRef = useRef<any>(null);

    // Cargar el web component dinámicamente
    useEffect(() => {
      const loadModelViewer = async () => {
        try {
          await import('@google/model-viewer');
        } catch (error) {
          console.error('Error loading model-viewer:', error);
        }
      };
      loadModelViewer();
    }, []);

    // Adjuntar listeners a eventos del web component
    useEffect(() => {
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
    }, [onLoad, onError]);

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
  fallbackImage = '/placeholders/placeholder-3d.jpg',
  onLoad,
  onError
}: ModelViewer3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

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
    try { console.log('✅ model-viewer cargado:', { src }); } catch { }
    onLoad?.();
  };

  const handleError = (event: CustomEvent) => {
    console.error('❌ Error cargando modelo 3D:', { src, detail: event.detail });
    setIsLoading(false);
    setHasError(true);
    onError?.(event.detail?.message || 'Error cargando modelo 3D');
  };

  // Si no hay soporte de WebGL o hay error, mostrar imagen de fallback
  if (!isWebGLSupported || hasError) {
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
        auto-rotate={autoRotate}
        camera-controls={cameraControls}
        loading="eager"
        reveal="auto"
        shadow-intensity={0}
        exposure={1.2}
        environment-image="/models/environment.hdr"
        camera-target="auto"
        camera-orbit="auto"
        autoplay
        poster="none"
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
