// Script para probar el sistema de storage local
const fs = require('fs');
const path = require('path');

console.log('🧪 Probando sistema de storage local...\n');

// Verificar que existe la carpeta storage
const storagePath = path.join(process.cwd(), 'storage');
if (!fs.existsSync(storagePath)) {
  console.log('❌ Error: La carpeta storage no existe');
  process.exit(1);
}

console.log('✅ Carpeta storage existe');

// Verificar estructura de carpetas
const requiredFolders = ['users', 'content', 'purchases', 'likes', 'follows', 'uploads'];
const missingFolders = [];

requiredFolders.forEach(folder => {
  const folderPath = path.join(storagePath, folder);
  if (!fs.existsSync(folderPath)) {
    missingFolders.push(folder);
  } else {
    console.log(`✅ Carpeta ${folder}/ existe`);
  }
});

if (missingFolders.length > 0) {
  console.log(`❌ Faltan carpetas: ${missingFolders.join(', ')}`);
  process.exit(1);
}

// Verificar archivos de datos
const dataFiles = [
  'users/index.json',
  'content/index.json', 
  'purchases/index.json',
  'likes/index.json',
  'follows/index.json'
];

console.log('\n📊 Verificando datos de ejemplo...');

dataFiles.forEach(file => {
  const filePath = path.join(storagePath, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${file}: ${Array.isArray(data) ? data.length : 1} registros`);
    } catch (error) {
      console.log(`❌ ${file}: Error al leer - ${error.message}`);
    }
  } else {
    console.log(`❌ ${file}: No existe`);
  }
});

// Verificar configuración
console.log('\n🔧 Verificando configuración...');
const envFile = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  if (envContent.includes('STORAGE_MODE=local')) {
    console.log('✅ STORAGE_MODE configurado como local');
  } else {
    console.log('⚠️  STORAGE_MODE no está configurado como local');
  }
} else {
  console.log('⚠️  Archivo .env.local no encontrado');
}

console.log('\n🎉 Sistema de storage local listo!');
console.log('\n📋 Próximos pasos:');
console.log('1. Reinicia el servidor: npm run dev');
console.log('2. Prueba el login con: admin@takopi.com / password');
console.log('3. Explora el contenido en /explore');
console.log('4. Los datos se guardan en /storage/*');
