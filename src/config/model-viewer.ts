// Configuración para optimizar model-viewer y reducir advertencias

export const MODEL_VIEWER_CONFIG = {
  // Configuración de rendimiento
  performance: {
    loading: 'eager' as const,
    reveal: 'auto' as const,
    bounds: 'tight' as const,
    interpolationDecay: 100, // Reducido para mejor respuesta
    minCameraOrbit: 'auto auto auto',
    maxCameraOrbit: 'auto auto auto',
    minFieldOfView: '10deg',
    maxFieldOfView: '90deg',
  },
  
  // Configuración de interacción
  interaction: {
    cameraControls: true,
    interactionPrompt: 'none' as const, // Desactivado para evitar overlay
    interactionPromptThreshold: 0,
    touchAction: 'pan-y',
    disableZoom: false,
  },
  
  // Configuración de iluminación
  lighting: {
    shadowIntensity: 1,
    exposure: 1,
    toneMapping: 'aces' as const,
  },
  
  // Configuración de AR
  ar: {
    enabled: true,
    modes: 'webxr scene-viewer quick-look',
    scale: 'auto' as const,
    placement: 'floor' as const,
  },
  
  // Configuración de rotación automática
  autoRotate: {
    enabled: false,
    delay: 3000,
  }
};

// Función para configurar el entorno global
export const configureModelViewerEnvironment = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Configurar variables globales para reducir advertencias
    (window as any).LIT_ENABLE_DEV_MODE = false;
    (window as any).MODEL_VIEWER_ENABLE_DEV_MODE = false;
    (window as any).MODEL_VIEWER_DEBUG = false;
    
    // Configurar WebGL para mejor rendimiento
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    }) || canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    
    if (gl) {
      // Configurar parámetros de WebGL para mejor rendimiento
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.frontFace(gl.CCW);
      
      // Habilitar extensiones útiles si están disponibles
      const extensions = [
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_etc',
        'EXT_texture_filter_anisotropic',
        'OES_texture_float',
        'OES_texture_half_float',
      ];
      
      extensions.forEach(ext => {
        try {
          gl.getExtension(ext);
        } catch (e) {
          // Silenciar errores de extensiones no soportadas
        }
      });
    }
  } catch (error) {
    console.warn('No se pudo configurar el entorno de model-viewer:', error);
  }
};

// Función para crear props optimizadas para model-viewer
export const getOptimizedModelViewerProps = (customProps: Record<string, any> = {}) => {
  return {
    ...MODEL_VIEWER_CONFIG.performance,
    ...MODEL_VIEWER_CONFIG.interaction,
    ...MODEL_VIEWER_CONFIG.lighting,
    ...MODEL_VIEWER_CONFIG.ar,
    autoRotate: MODEL_VIEWER_CONFIG.autoRotate.enabled,
    autoRotateDelay: MODEL_VIEWER_CONFIG.autoRotate.delay,
    ...customProps,
  };
};
