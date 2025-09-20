#!/usr/bin/env node

/**
 * Script para crear .env.local automáticamente
 * Configura el entorno para usar MongoDB local por defecto
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Creando archivo .env.local para desarrollo...');

const envContent = `# ==============================================
# CONFIGURACIÓN PARA DESARROLLO LOCAL
# ==============================================

# Modo de base de datos (local por defecto para desarrollo)
DB_MODE=local

# MongoDB Atlas (solo si cambias DB_MODE=atlas)
MONGODB_ATLAS_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

# MongoDB de producción (solo para NODE_ENV=production)
MONGODB_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

# ==============================================
# JWT Y AUTENTICACIÓN
# ==============================================
JWT_SECRET=takopi_jwt_secret_development_2025
NEXTAUTH_SECRET=takopi_nextauth_secret_development_2025
NEXTAUTH_URL=http://localhost:3000

# ==============================================
# CONFIGURACIÓN DE ENTORNO
# ==============================================
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📍 Ubicación:', envPath);
  console.log('\n💡 Configuración:');
  console.log('   - DB_MODE=local (MongoDB local en puerto 27017)');
  console.log('   - Para cambiar a Atlas: cambia DB_MODE=atlas');
  console.log('   - Para auto-detección: cambia DB_MODE=auto');
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message);
}
