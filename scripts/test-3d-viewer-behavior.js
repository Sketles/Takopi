#!/usr/bin/env node

/**
 * Script para probar el comportamiento del visor 3D
 * - Cards: Solo imagen de portada
 * - Modal: Visor 3D para modelos 3D
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando comportamiento del visor 3D...\n');

async function test3DViewerBehavior() {
  try {
    console.log('📡 Obteniendo contenido desde la API...');
    const response = await fetch('http://localhost:3000/api/content/explore');

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ API respondió correctamente`);

    if (!result.success) {
      throw new Error('API no devolvió éxito');
    }

    const data = result.data;
    console.log(`📊 Total de elementos: ${data.length}\n`);

    // Analizar cada elemento
    data.forEach((item, index) => {
      console.log(`🎯 Elemento ${index + 1}: ${item.title}`);
      console.log(`   📂 Tipo: ${item.contentType}`);
      console.log(`   🖼️  Imagen: ${item.image}`);
      console.log(`   📁 Archivos: ${item.files ? item.files.length : 0}`);

      if (item.files && item.files.length > 0) {
        console.log('   📋 Archivos detallados:');
        item.files.forEach((file, fileIndex) => {
          console.log(`      ${fileIndex + 1}. ${file.name} (${file.type || 'sin tipo'})`);
          console.log(`         URL: ${file.url}`);
          if (file.previewUrl) {
            console.log(`         Preview: ${file.previewUrl}`);
          }
        });
      }

      // Determinar comportamiento esperado
      if (item.contentType === 'models') {
        console.log('   🎮 COMPORTAMIENTO ESPERADO:');
        console.log('      📱 Card: Imagen de portada (no visor 3D)');
        console.log('      🖥️  Modal: Visor 3D interactivo');

        const hasGLBFile = item.files && item.files.some(file =>
          file.name && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))
        );

        if (hasGLBFile) {
          console.log('      ✅ Tiene archivo GLB/GLTF para visor 3D');
        } else {
          console.log('      ⚠️  No tiene archivo GLB/GLTF');
        }
      } else {
        console.log('   🖼️  COMPORTAMIENTO ESPERADO:');
        console.log('      📱 Card: Imagen normal');
        console.log('      🖥️  Modal: Imagen normal');
      }

      console.log(''); // Línea en blanco
    });

    // Resumen
    const models3D = data.filter(item => item.contentType === 'models');
    const otherContent = data.filter(item => item.contentType !== 'models');

    console.log('📊 RESUMEN:');
    console.log(`   🎮 Modelos 3D: ${models3D.length}`);
    console.log(`   🖼️  Otros contenidos: ${otherContent.length}`);

    if (models3D.length > 0) {
      console.log('\n✅ Los modelos 3D deberían mostrar:');
      console.log('   📱 En las cards: Solo imagen de portada');
      console.log('   🖥️  En el modal: Visor 3D interactivo');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test3DViewerBehavior();
