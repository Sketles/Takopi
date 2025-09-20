#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploy a Vercel - Takopi\n');

// Verificar que existe .env.local
if (!fs.existsSync('.env.local')) {
  console.log('❌ Error: No existe archivo .env.local');
  console.log('💡 Ejecuta primero: node setup-env.js');
  process.exit(1);
}

console.log('✅ Archivo .env.local encontrado');

// Verificar que Vercel CLI está instalado
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI instalado');
} catch (error) {
  console.log('❌ Vercel CLI no instalado');
  console.log('💡 Instala con: npm install -g vercel');
  process.exit(1);
}

console.log('\n📋 Pasos para deploy en Vercel:');
console.log('');
console.log('1️⃣  Instalar Vercel CLI (si no está instalado):');
console.log('   npm install -g vercel');
console.log('');
console.log('2️⃣  Login en Vercel:');
console.log('   vercel login');
console.log('');
console.log('3️⃣  Deploy inicial:');
console.log('   vercel');
console.log('');
console.log('4️⃣  Deploy a producción:');
console.log('   vercel --prod');
console.log('');
console.log('🔧 Configurar variables de entorno en Vercel Dashboard:');
console.log('');
console.log('   MONGODB_URI=mongodb+srv://takopi_app:TU_PASSWORD@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos');
console.log('   JWT_SECRET=410af87c264986629f0fc125baa3baf4612d37b0feae52c5303bf6f4cdc725f4d42a7a0c3d292dc641fa9de092b64647d095a3f3c81c620e42fa15c58b2d5e46');
console.log('   NEXTAUTH_SECRET=50ff547b385499f836f94bfab20337230e49ea1a44f87c8e096a3d7fdd5fb880');
console.log('   NEXTAUTH_URL=https://tu-dominio.vercel.app');
console.log('');
console.log('⚠️  IMPORTANTE para producción:');
console.log('   - Cambiar la contraseña de MongoDB');
console.log('   - Usar HTTPS (automático en Vercel)');
console.log('   - Configurar dominio personalizado');
console.log('');
console.log('🌐 URLs útiles:');
console.log('   - Vercel Dashboard: https://vercel.com/dashboard');
console.log('   - Documentación: https://vercel.com/docs');
console.log('   - Variables de entorno: https://vercel.com/docs/concepts/projects/environment-variables');

console.log('\n¿Quieres que ejecute el deploy automáticamente? (y/n)');

// En un entorno interactivo, podrías usar readline
// Por ahora, solo mostramos las instrucciones
console.log('\n💡 Para deploy automático, ejecuta manualmente los comandos de arriba');
