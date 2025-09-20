const fs = require('fs');
const path = require('path');

console.log('🖼️ Creando imágenes de prueba...');

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Crear archivos de texto simulando imágenes (para demostración)
const testImages = [
  { name: 'Sophia.jpg', content: 'Imagen de Sophia - Textura de prueba' },
  { name: 'medieval_stone_01.jpg', content: 'Textura de piedra medieval' },
  { name: 'scifi_metal_01.jpg', content: 'Textura de metal sci-fi' }
];

testImages.forEach(image => {
  const filePath = path.join(uploadsDir, image.name);
  fs.writeFileSync(filePath, image.content);
  console.log(`✅ Creado: ${image.name}`);
});

console.log('\n📁 Archivos creados en public/uploads/');
console.log('   • Sophia.jpg');
console.log('   • medieval_stone_01.jpg');
console.log('   • scifi_metal_01.jpg');

console.log('\n💡 Nota: Estos son archivos de texto simulando imágenes.');
console.log('   Para imágenes reales, necesitarías subir archivos .jpg/.png reales.');
console.log('   El modal funcionará con cualquier archivo que esté en public/uploads/');

console.log('\n🧪 Para probar:');
console.log('   1. Ve a http://localhost:3000/explore');
console.log('   2. Busca las texturas "Sophia" o "medieval_stone_01"');
console.log('   3. Haz clic en la imagen para abrir el modal');
console.log('   4. El modal debería mostrar la información correctamente');
