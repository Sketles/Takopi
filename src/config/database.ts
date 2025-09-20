// Configuración de base de datos con soporte para desarrollo local y producción
export const databaseConfig = {
  // Configuración por entorno
  development: {
    // MongoDB Local (para desarrollo)
    local: {
      uri: 'mongodb://localhost:27017/takopi_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },

    // MongoDB Atlas (para testing con datos reales)
    atlas: {
      uri: process.env.MONGODB_ATLAS_URI || 'mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    }
  },

  production: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};

// Switch para cambiar entre BD local y Atlas en desarrollo
export const DB_MODE = {
  LOCAL: 'local',      // MongoDB local en puerto 27017
  ATLAS: 'atlas',      // MongoDB Atlas (producción)
  AUTO: 'auto'         // Automático según disponibilidad
} as const;

// Configuración actual del entorno
export const currentEnvironment = process.env.NODE_ENV || 'development';

// Función para obtener la configuración de BD actual
export function getDatabaseConfig() {
  const dbMode = process.env.DB_MODE || 'local'; // Por defecto usar BD local

  if (currentEnvironment === 'production') {
    return {
      uri: databaseConfig.production.uri,
      options: databaseConfig.production.options,
      mode: 'production'
    };
  }

  // En desarrollo, usar el modo especificado
  if (dbMode === 'atlas') {
    return {
      uri: databaseConfig.development.atlas.uri,
      options: databaseConfig.development.atlas.options,
      mode: 'atlas'
    };
  }

  // Por defecto usar BD local
  return {
    uri: databaseConfig.development.local.uri,
    options: databaseConfig.development.local.options,
    mode: 'local'
  };
}

// Función para verificar si MongoDB local está disponible
export async function isLocalMongoAvailable(): Promise<boolean> {
  try {
    const mongoose = await import('mongoose');
    await mongoose.connect(databaseConfig.development.local.uri, {
      ...databaseConfig.development.local.options,
      serverSelectionTimeoutMS: 2000, // Timeout rápido para verificar
    });
    await mongoose.disconnect();
    return true;
  } catch (error) {
    return false;
  }
}

// Función para auto-detectar el mejor modo de BD
export async function getAutoDatabaseConfig() {
  const isLocalAvailable = await isLocalMongoAvailable();

  if (isLocalAvailable) {
    console.log('✅ MongoDB local detectado, usando BD local para desarrollo');
    return {
      uri: databaseConfig.development.local.uri,
      options: databaseConfig.development.local.options,
      mode: 'local'
    };
  } else {
    console.log('⚠️  MongoDB local no disponible, usando MongoDB Atlas para desarrollo');
    return {
      uri: databaseConfig.development.atlas.uri,
      options: databaseConfig.development.atlas.options,
      mode: 'atlas'
    };
  }
}
