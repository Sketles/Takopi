// Configuración para optimizar model-viewer y reducir advertencias

export const MODEL_VIEWER_CONFIG = {
  // Configuración de rendimiento
  performance: {
    loading: 'eager' as const,
    reveal: 'auto' as const,
    bounds: 'tight' as const,
    interpolationDecay: 200,
    minCameraOrbit: 'auto auto auto',
    maxCameraOrbit: 'auto auto auto',
  },
  
  // Configuración de interacción
  interaction: {
    cameraControls: true,
    interactionPrompt: 'auto' as const,
    interactionPromptStyle: 'basic' as const,
    interactionPromptThreshold: 1500,
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
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      // Configurar parámetros de WebGL para mejor rendimiento
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
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
