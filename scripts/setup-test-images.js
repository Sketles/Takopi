const fs = require('fs');
const path = require('path');

console.log('🖼️ Configurando imágenes de prueba...');

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Copiar next.svg como imagen de prueba
const sourceFile = path.join(__dirname, '..', 'public', 'next.svg');
const targetFiles = [
  'Sophia.jpg',
  'medieval_stone_01.jpg',
  'scifi_metal_01.jpg'
];

targetFiles.forEach(filename => {
  const targetPath = path.join(uploadsDir, filename);
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetPath);
    console.log(`✅ Copiado: ${filename}`);
  } else {
    console.log(`❌ No se encontró: ${sourceFile}`);
  }
});

console.log('\n📁 Imágenes de prueba configuradas:');
console.log('   • Sophia.jpg (para texturas de Sushipan)');
console.log('   • medieval_stone_01.jpg (para texturas medievales)');
console.log('   • scifi_metal_01.jpg (para texturas sci-fi)');

console.log('\n🧪 Para probar el modal:');
console.log('   1. Ve a http://localhost:3000/explore');
console.log('   2. Busca las texturas que subiste');
console.log('   3. Haz clic en la imagen para abrir el modal');
console.log('   4. ¡Debería mostrar la imagen y todos los detalles!');

console.log('\n💡 Nota: Si subes imágenes reales, reemplaza estos archivos');
console.log('   con tus imágenes .jpg/.png en public/uploads/');
