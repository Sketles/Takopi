const fs = require('fs');
const path = require('path');

console.log('🖼️ Creando imágenes simples para el modal...');

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Crear un archivo de imagen simple (base64 de un pixel rojo)
const redPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

// Crear archivos de imagen simples
const images = [
  'Sophia.jpg',
  'medieval_stone_01.jpg',
  'scifi_metal_01.jpg'
];

images.forEach(filename => {
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, redPixel);
  console.log(`✅ Creado: ${filename}`);
});

console.log('\n🎯 Para probar:');
console.log('1. Ve a http://localhost:3000/explore');
console.log('2. Busca las texturas "Sophia" o "medieval_stone_01"');
console.log('3. Haz clic en la imagen para abrir el modal');
console.log('4. ¡Ahora deberías ver las imágenes!');

console.log('\n💡 Estas son imágenes PNG simples (1x1 pixel)');
console.log('   pero funcionarán como imágenes válidas en el modal');
