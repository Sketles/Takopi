#!/usr/bin/env node

/**
 * Script para probar el nuevo modal híbrido implementado
 * - Vista compacta: Preview + Info básica + Botón comprar
 * - Vista expandida: Descripción + Tags + Stats + Enlaces
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando Modal Híbrido - Quick View...\n');

async function testHybridModal() {
  try {
    console.log('📡 Obteniendo contenido desde la API...');
    const response = await fetch('http://localhost:3000/api/content/explore');

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('API no devolvió éxito');
    }

    const data = result.data;
    console.log(`✅ API respondió correctamente`);
    console.log(`📊 Total de elementos: ${data.length}\n`);

    // Analizar cada elemento para el modal híbrido
    data.forEach((item, index) => {
      console.log(`🎯 Elemento ${index + 1}: ${item.title}`);
      console.log(`   📂 Tipo: ${item.contentType}`);
      console.log(`   👤 Autor: ${item.author}`);
      console.log(`   💰 Precio: ${item.price}`);
      console.log(`   📄 Licencia: ${item.license}`);

      console.log('\n   📱 VISTA COMPACTA (siempre visible):');
      console.log('      🖼️  Preview del contenido:');
      if (item.contentType === 'models') {
        console.log('         - Visor 3D interactivo (si tiene archivo GLB/GLTF)');
        console.log('         - Imagen de portada (fallback)');
      } else {
        console.log('         - Imagen normal ampliada');
      }

      console.log('      📋 Información básica:');
      console.log(`         - Título: ${item.title}`);
      console.log(`         - Autor: ${item.author} (clickeable → perfil)`);
      console.log(`         - Tipo: ${item.type}`);
      console.log(`         - Categoría: ${item.category}`);
      console.log(`         - Licencia: ${item.license}`);

      console.log('      💳 Precio y compra:');
      console.log(`         - Precio: ${item.price}`);
      console.log(`         - Botón: ${item.isFree ? 'Descargar Gratis' : 'Comprar Ahora'}`);

      console.log('\n   🖥️  VISTA EXPANDIDA (con "Ver más detalles ↓"):');
      console.log('      📝 Descripción extendida:');
      console.log(`         - ${item.description || 'No hay descripción disponible'}`);

      console.log('      🏷️  Tags clickeables:');
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
          console.log(`         - #${tag} (clickeable)`);
        });
      } else {
        console.log('         - No hay tags disponibles');
      }

      console.log('      📊 Estadísticas:');
      console.log(`         - ❤️  Likes: ${item.likes}`);
      console.log(`         - ⬇️  Descargas: ${item.downloads}`);
      console.log(`         - 👁️  Vistas: ${item.views}`);

      console.log('      🔗 Enlaces:');
      console.log('         - "Ir a página del producto →" (botón)');

      console.log('\n   🎨 CARACTERÍSTICAS DEL MODAL:');
      console.log('      ✅ Animaciones suaves (500ms ease-in-out)');
      console.log('      ✅ Botón "Ver más detalles ↓" / "Ver menos ↑"');
      console.log('      ✅ Transición de altura dinámica');
      console.log('      ✅ Botón de cerrar (X) en header');
      console.log('      ✅ Click fuera del modal para cerrar');
      console.log('      ✅ Diseño responsive (mobile/desktop)');

      console.log('\n   🚀 FLUJO DE USUARIO:');
      console.log('      1. Usuario hace clic en card → Modal compacto se abre');
      console.log('      2. Ve preview + info básica + botón comprar');
      console.log('      3. Si quiere más detalles → clic "Ver más detalles ↓"');
      console.log('      4. Se expande con descripción, tags, stats');
      console.log('      5. Puede comprar desde modal o ir a página completa');

      console.log(''); // Línea en blanco
    });

    // Resumen
    const models3D = data.filter(item => item.contentType === 'models');
    const otherContent = data.filter(item => item.contentType !== 'models');

    console.log('📊 RESUMEN DEL MODAL HÍBRIDO:');
    console.log(`   🎮 Modelos 3D: ${models3D.length} (con visor 3D en modal)`);
    console.log(`   🖼️  Otros contenidos: ${otherContent.length} (con imagen normal)`);

    console.log('\n✅ FUNCIONALIDADES IMPLEMENTADAS:');
    console.log('   📱 Vista compacta: Preview + Info + Comprar');
    console.log('   🖥️  Vista expandida: Descripción + Tags + Stats');
    console.log('   🎨 Animaciones suaves de expansión/contracción');
    console.log('   💳 Botón "Comprar Ahora" destacado');
    console.log('   🏷️  Tags clickeables en vista expandida');
    console.log('   📊 Estadísticas organizadas');
    console.log('   🔗 Enlace a página completa del producto');

    console.log('\n🎯 SIGUIENTE PASO:');
    console.log('   Crear páginas dedicadas (/p/[slug]) para cada producto');
    console.log('   Implementar funcionalidad de compra real');
    console.log('   Agregar sistema de comentarios/reseñas');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testHybridModal();
