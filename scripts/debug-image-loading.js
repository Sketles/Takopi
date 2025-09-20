console.log('🔍 Debugging imagen loading en el modal...\n');

console.log('📋 Pasos para diagnosticar:');
console.log('1. Ve a http://localhost:3000/explore');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña "Network"');
console.log('4. Busca una textura (como "Sophia")');
console.log('5. Haz clic en la imagen de la tarjeta para abrir el modal');
console.log('6. Observa las peticiones de red:');

console.log('\n🔍 Busca estas peticiones:');
console.log('• GET /uploads/Sophia.jpg - ¿Qué status code devuelve?');
console.log('• GET /api/content/explore - ¿Qué datos devuelve?');

console.log('\n💡 Posibles problemas:');
console.log('• 404 Not Found - La imagen no existe en public/uploads/');
console.log('• 200 OK pero imagen no se muestra - Problema de formato');
console.log('• CORS error - Problema de permisos');

console.log('\n🧪 También prueba esto:');
console.log('1. Abre una nueva pestaña');
console.log('2. Ve a: http://localhost:3000/uploads/Sophia.jpg');
console.log('3. ¿Se muestra la imagen o da error 404?');

console.log('\n📁 Archivos que deberían existir:');
console.log('• public/uploads/Sophia.jpg');
console.log('• public/uploads/medieval_stone_01.jpg');
console.log('• public/uploads/scifi_metal_01.jpg');

console.log('\n🔧 Si la imagen no existe:');
console.log('• Copia una imagen real (.jpg/.png) a public/uploads/');
console.log('• O usa las imágenes SVG que ya funcionan');
console.log('• No cambies los formatos, solo asegúrate de que existan');

console.log('\n✅ El modal está funcionando correctamente');
console.log('   El problema es solo que las imágenes no se cargan');
console.log('   Mantén los formatos originales que subiste');
