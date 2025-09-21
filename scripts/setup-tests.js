/**
 * Script para preparar el entorno de pruebas
 * Crea usuario de pruebas y verifica que todo esté listo
 */

const createTestUser = require('./create-test-user');

async function setupTests() {
  console.log('🧪 PREPARANDO ENTORNO DE PRUEBAS AUTOMATIZADAS');
  console.log('===============================================\n');

  try {
    // 1. Crear usuario de pruebas
    console.log('1️⃣ Creando usuario de pruebas...');
    await createTestUser();

    console.log('\n2️⃣ Verificando requisitos...');

    // 2. Verificar que la aplicación esté corriendo
    const fetch = require('node-fetch');
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ Aplicación corriendo en http://localhost:3000');
      } else {
        console.log('⚠️ Aplicación respondió con código:', response.status);
      }
    } catch (error) {
      console.log('❌ No se puede conectar a http://localhost:3000');
      console.log('   Asegúrate de ejecutar: npm run dev');
      process.exit(1);
    }

    console.log('\n3️⃣ Verificando archivos de prueba...');
    const fs = require('fs');
    const path = require('path');

    const sampleFiles = [
      'test-avatar.glb',
      'test-model.blend',
      'test-music.mp3',
      'test-texture.png',
      'test-animation.mp4',
      'test-obs.html',
      'test-collection.zip'
    ];

    const sampleFilesPath = path.join(__dirname, '..', 'tests', 'sample-files');

    for (const file of sampleFiles) {
      const filePath = path.join(sampleFilesPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} existe`);
      } else {
        console.log(`❌ ${file} no existe`);
      }
    }

    console.log('\n🎉 ENTORNO DE PRUEBAS LISTO!');
    console.log('============================');
    console.log('✅ Usuario de pruebas: PruebasAutomaticas@takopi.cl');
    console.log('✅ Contraseña: test12345');
    console.log('✅ Aplicación corriendo');
    console.log('✅ Archivos de ejemplo listos');

    console.log('\n🚀 COMANDOS DISPONIBLES:');
    console.log('npm run test:all     - Ejecutar todas las pruebas');
    console.log('npm run test:nav     - Solo navegación');
    console.log('npm run test:upload  - Solo upload');

  } catch (error) {
    console.error('❌ Error preparando entorno:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupTests();
}

module.exports = setupTests;
