import mongoose from 'mongoose';
import { getDatabaseConfig, getAutoDatabaseConfig } from '@/config/database';

// Cache para la conexión
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Función principal de conexión
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const config = getDatabaseConfig();

    console.log(`🔗 Conectando a MongoDB (modo: ${config.mode})`);
    console.log(`📍 URI: ${config.uri.replace(/\/\/.*@/, '//***:***@')}`); // Ocultar credenciales

    cached.promise = mongoose.connect(config.uri, config.options).then((mongoose) => {
      console.log(`✅ MongoDB conectado exitosamente (modo: ${config.mode})`);
      return mongoose;
    }).catch((error) => {
      console.error('❌ Error conectando a MongoDB:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Función para conexión automática (detecta el mejor modo)
async function connectToDatabaseAuto() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const config = await getAutoDatabaseConfig();

    console.log(`🔗 Conectando a MongoDB (modo automático: ${config.mode})`);
    console.log(`📍 URI: ${config.uri.replace(/\/\/.*@/, '//***:***@')}`); // Ocultar credenciales

    cached.promise = mongoose.connect(config.uri, config.options).then((mongoose) => {
      console.log(`✅ MongoDB conectado exitosamente (modo automático: ${config.mode})`);
      return mongoose;
    }).catch((error) => {
      console.error('❌ Error conectando a MongoDB:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Función para desconectar
async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Función para limpiar cache (útil para testing)
function clearConnectionCache() {
  cached.conn = null;
  cached.promise = null;
}

export {
  connectToDatabase,
  connectToDatabaseAuto,
  disconnectFromDatabase,
  clearConnectionCache
};

// Exportar la función por defecto (mantener compatibilidad)
export default connectToDatabase;