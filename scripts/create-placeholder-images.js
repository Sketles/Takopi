const fs = require('fs');
const path = require('path');

console.log('🖼️ Creando archivos placeholder faltantes...\n');

// Función para crear un SVG placeholder simple
function createSVGPlaceholder(width, height, text, filename) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1f2937"/>
  <rect x="10%" y="10%" width="80%" height="80%" fill="#374151" stroke="#6b7280" stroke-width="2" rx="8"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${text}</text>
  <text x="50%" y="65%" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">Placeholder</text>
</svg>`;

  const filePath = path.join(__dirname, '..', 'public', filename);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ Creado: ${filename}`);
}

// Crear placeholders
const placeholders = [
  { name: 'placeholder-3d.jpg', text: '3D Model' },
  { name: 'placeholder-texture.jpg', text: 'Texture' },
  { name: 'placeholder-music.jpg', text: 'Music' },
  { name: 'placeholder-avatar.jpg', text: 'Avatar' },
  { name: 'placeholder-animation.jpg', text: 'Animation' },
  { name: 'placeholder-widget.jpg', text: 'Widget' },
  { name: 'placeholder-collection.jpg', text: 'Collection' },
  { name: 'placeholder-game.jpg', text: 'Game' }
];

placeholders.forEach(placeholder => {
  createSVGPlaceholder(400, 400, placeholder.text, placeholder.name);
});

console.log('\n🎉 ¡Todos los placeholders creados exitosamente!');
console.log('\n📁 Archivos creados en /public/:');
placeholders.forEach(p => console.log(`   - ${p.name}`));
console.log('\n🔄 Reinicia el servidor para aplicar los cambios.');
