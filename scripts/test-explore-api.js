const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando API de exploración...\n');

async function testExploreAPI() {
  try {
    const baseUrl = 'http://localhost:3000';

    console.log('📍 Probando endpoint de exploración...');

    // Probar obtener todo el contenido
    const response = await fetch(`${baseUrl}/api/content/explore?limit=10`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ API funcionando correctamente');
      console.log(`📊 Total de elementos: ${result.data.length}`);
      console.log(`📄 Paginación: ${result.pagination.total} total, página ${result.pagination.page} de ${result.pagination.totalPages}`);

      if (result.data.length > 0) {
        console.log('\n🎨 Primeros elementos:');
        result.data.slice(0, 3).forEach((item, index) => {
          console.log(`\n${index + 1}. ${item.title}`);
          console.log(`   Autor: ${item.author}`);
          console.log(`   Tipo: ${item.type}`);
          console.log(`   Categoría: ${item.category}`);
          console.log(`   Precio: ${item.price}`);
          console.log(`   Likes: ${item.likes}`);
          console.log(`   Descargas: ${item.downloads}`);
          console.log(`   Tags: ${item.tags.slice(0, 3).join(', ')}${item.tags.length > 3 ? '...' : ''}`);
        });
      } else {
        console.log('\n⚠️  No hay contenido disponible en la base de datos');
      }

    } else {
      throw new Error(result.error || 'Error desconocido');
    }

    // Probar filtro por categoría
    console.log('\n🔍 Probando filtro por categoría...');
    const categoryResponse = await fetch(`${baseUrl}/api/content/explore?category=models&limit=5`);

    if (categoryResponse.ok) {
      const categoryResult = await categoryResponse.json();
      console.log(`✅ Filtro por categoría funcionando: ${categoryResult.data.length} modelos 3D encontrados`);
    }

    console.log('\n🎉 ¡API de exploración funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error probando API:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Asegúrate de que el servidor Next.js esté ejecutándose:');
      console.log('   npm run dev:local');
    }
  }
}

testExploreAPI();
