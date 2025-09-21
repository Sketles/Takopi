/**
 * Script para verificar que el logo de OBS sea accesible
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando logo de OBS...\n');

const logoPath = path.join(process.cwd(), 'public', 'logos', 'OBS_Studio_logo.png');

console.log('📁 Ruta del logo:', logoPath);

if (fs.existsSync(logoPath)) {
  const stats = fs.statSync(logoPath);
  console.log('✅ Logo encontrado:');
  console.log(`   - Tamaño: ${stats.size} bytes`);
  console.log(`   - Modificado: ${stats.mtime}`);
  console.log(`   - URL esperada: /logos/OBS_Studio_logo.png`);
} else {
  console.log('❌ Logo NO encontrado en:', logoPath);
}

console.log('\n🔧 Configuración del componente:');
console.log('   - contentType: "obs" o "obs-widgets"');
console.log('   - customLogo: "/logos/OBS_Studio_logo.png"');
console.log('   - gradient: "from-gray-500 to-blue-500"');

console.log('\n🎯 Para probar:');
console.log('   1. Ve a http://localhost:3000/profile');
console.log('   2. Busca una creación de OBS');
console.log('   3. Revisa la consola del navegador');
console.log('   4. Deberías ver logs del componente DefaultCover');
