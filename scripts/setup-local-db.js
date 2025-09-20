#!/usr/bin/env node

/**
 * Script para configurar MongoDB local para desarrollo
 * Este script te ayuda a configurar una base de datos local limpia
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando MongoDB local para desarrollo...\n');

// Verificar si MongoDB está instalado
function checkMongoInstallation() {
  try {
    execSync('mongod --version', { stdio: 'pipe' });
    console.log('✅ MongoDB está instalado');
    return true;
  } catch (error) {
    console.log('❌ MongoDB no está instalado o no está en el PATH');
    return false;
  }
}

// Crear archivo .env.local si no existe
function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    const envContent = `# Configuración para desarrollo local
DB_MODE=local
NODE_ENV=development

# JWT (desarrollo)
JWT_SECRET=takopi_jwt_secret_development_2025
NEXTAUTH_SECRET=takopi_nextauth_secret_development_2025
NEXTAUTH_URL=http://localhost:3000
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env.local creado');
  } else {
    console.log('ℹ️  Archivo .env.local ya existe');
  }
}

// Función para iniciar MongoDB local
function startMongoLocal() {
  console.log('\n🔄 Iniciando MongoDB local...');
  console.log('💡 Ejecuta este comando en una terminal separada:');
  console.log('   mongod --dbpath ./data/db');
  console.log('\n📝 O si tienes MongoDB como servicio:');
  console.log('   sudo systemctl start mongod  (Linux)');
  console.log('   brew services start mongodb-community  (macOS)');
  console.log('   net start MongoDB  (Windows)');
}

// Función para crear directorio de datos
function createDataDirectory() {
  const dataPath = path.join(process.cwd(), 'data', 'db');

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
    console.log('✅ Directorio de datos creado: ./data/db');
  } else {
    console.log('ℹ️  Directorio de datos ya existe');
  }
}

// Función principal
function main() {
  console.log('🔍 Verificando instalación de MongoDB...');

  if (!checkMongoInstallation()) {
    console.log('\n📥 Para instalar MongoDB:');
    console.log('   - Windows: https://www.mongodb.com/try/download/community');
    console.log('   - macOS: brew install mongodb-community');
    console.log('   - Linux: https://docs.mongodb.com/manual/installation/');
    console.log('\n🔄 Ejecuta este script nuevamente después de instalar MongoDB');
    return;
  }

  createEnvFile();
  createDataDirectory();
  startMongoLocal();

  console.log('\n🎉 ¡Configuración completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Inicia MongoDB local');
  console.log('2. Ejecuta: npm run seed:local');
  console.log('3. Ejecuta: npm run dev');
  console.log('\n💡 Para cambiar a MongoDB Atlas:');
  console.log('   Cambia DB_MODE=atlas en .env.local');
}

main();
