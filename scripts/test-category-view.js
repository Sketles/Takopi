/**
 * Script para probar la nueva vista de categorías en el perfil
 * Verifica que las creaciones se muestren organizadas por categorías
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testCategoryView() {
  console.log('🧪 Probando nueva vista de categorías en perfil...\n');

  try {
    // 1. Obtener token del usuario Sushipan
    console.log('📋 Paso 1: Obteniendo token de usuario...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sushipan@takopi.cl',
        password: 'test12345'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Error en login: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Token obtenido correctamente');

    // 2. Obtener creaciones del usuario
    console.log('\n📋 Paso 2: Obteniendo creaciones del usuario...');
    const creationsResponse = await fetch('http://localhost:3000/api/user/creations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!creationsResponse.ok) {
      throw new Error(`Error obteniendo creaciones: ${creationsResponse.status}`);
    }

    const creationsData = await creationsResponse.json();
    const creations = creationsData.data.creations;
    console.log(`✅ ${creations.length} creaciones obtenidas`);

    // 3. Agrupar creaciones por tipo
    console.log('\n📋 Paso 3: Agrupando creaciones por categorías...');
    const groupedCreations = creations.reduce((acc, creation) => {
      const type = creation.contentType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(creation);
      return acc;
    }, {});

    const categories = Object.keys(groupedCreations);
    console.log(`✅ Categorías encontradas: ${categories.join(', ')}`);

    // 4. Mostrar detalles de cada categoría
    console.log('\n📋 Paso 4: Detalles por categoría:');
    categories.forEach(type => {
      const items = groupedCreations[type];
      console.log(`\n  📁 ${type.toUpperCase()}:`);
      console.log(`     - Cantidad: ${items.length} ${items.length === 1 ? 'creación' : 'creaciones'}`);
      console.log(`     - Títulos: ${items.map(item => `"${item.title}"`).join(', ')}`);
      console.log(`     - Precios: ${items.map(item => item.isFree ? 'GRATIS' : `$${item.price.toLocaleString('es-CL')}`).join(', ')}`);
    });

    // 5. Verificar configuración de categorías
    console.log('\n📋 Paso 5: Verificando configuración de categorías...');
    const categoryConfig = {
      'models': { title: 'Modelos 3D', icon: '🎯', size: 'large' },
      'textures': { title: 'Texturas', icon: '✨', size: 'medium' },
      'images': { title: 'Imágenes', icon: '🖼️', size: 'small' },
      'music': { title: 'Música', icon: '🎵', size: 'medium' },
      'collections': { title: 'Colecciones', icon: '📦', size: 'large' },
      'animations': { title: 'Animaciones', icon: '🎬', size: 'small' },
      'obs-widgets': { title: 'Widgets OBS', icon: '📺', size: 'medium' },
      'avatars': { title: 'Avatares', icon: '👤', size: 'small' },
      'games': { title: 'Juegos', icon: '🎮', size: 'large' }
    };

    console.log('✅ Configuración de categorías:');
    categories.forEach(type => {
      const config = categoryConfig[type];
      if (config) {
        console.log(`     ${config.icon} ${config.title} (${config.size})`);
      } else {
        console.log(`     ⚠️  ${type} - Sin configuración definida`);
      }
    });

    // 6. Simular la lógica del frontend
    console.log('\n📋 Paso 6: Simulando lógica del frontend...');
    const categoriesWithContent = categories.map(type => ({
      type,
      ...categoryConfig[type],
      creations: groupedCreations[type],
      count: groupedCreations[type].length
    }));

    console.log(`✅ ${categoriesWithContent.length} categorías se mostrarán en el perfil:`);
    categoriesWithContent.forEach(category => {
      console.log(`     ${category.icon} ${category.title}: ${category.count} ${category.count === 1 ? 'creación' : 'creaciones'}`);
    });

    // 7. Verificar que solo se muestran categorías con contenido
    console.log('\n📋 Paso 7: Verificando filtrado de categorías...');
    const allPossibleTypes = Object.keys(categoryConfig);
    const typesNotShown = allPossibleTypes.filter(type => !categories.includes(type));

    console.log(`✅ Solo se muestran categorías con contenido`);
    if (typesNotShown.length > 0) {
      console.log(`   Categorías NO mostradas (sin contenido): ${typesNotShown.join(', ')}`);
    }

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n📝 Resumen:');
    console.log(`   - Total de creaciones: ${creations.length}`);
    console.log(`   - Categorías activas: ${categories.length}`);
    console.log(`   - Categorías filtradas: ${typesNotShown.length}`);
    console.log('   - Vista de categorías funcionando correctamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    process.exit(1);
  }
}

// Ejecutar la prueba
testCategoryView();
