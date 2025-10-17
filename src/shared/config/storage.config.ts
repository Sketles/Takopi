// Configuración de Storage - Clean Architecture
// Este archivo controla si usamos local storage o MongoDB

export const STORAGE_CONFIG = {
  LOCAL: process.env.LOCAL === 'true', // Flag principal
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev',
};

// Funciones helper para verificar el modo
export const isLocalMode = (): boolean => STORAGE_CONFIG.LOCAL;
export const isMongoMode = (): boolean => !STORAGE_CONFIG.LOCAL;

// Información del modo actual
export const getStorageInfo = () => {
  return {
    mode: STORAGE_CONFIG.LOCAL ? 'local' : 'mongodb',
    description: STORAGE_CONFIG.LOCAL 
      ? '📁 Usando archivos locales en /storage' 
      : '🗄️ Usando MongoDB',
    uri: STORAGE_CONFIG.LOCAL 
      ? 'file://./storage' 
      : STORAGE_CONFIG.MONGODB_URI
  };
};

// Log de configuración al iniciar
if (typeof window === 'undefined') {
  console.log('🔧 Storage Configuration:', getStorageInfo());
}

