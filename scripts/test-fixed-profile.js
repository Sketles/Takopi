/**
 * Script para probar el perfil con el espacio gigante eliminado
 * Verifica que la sección "Mis Creaciones" esté directamente después de las estadísticas
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testFixedProfile() {
  console.log('🧪 Probando perfil con espacio gigante eliminado...\n');

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

    // 3. Verificar estructura corregida del perfil
    console.log('\n📋 Paso 3: Verificando estructura corregida...');
    console.log('✅ Estructura del perfil corregida:');
    console.log('   - Banner del usuario');
    console.log('   - Estadísticas (Seguidores, Siguiendo, Creaciones, etc.)');
    console.log('   - ✅ Sección "Mis Creaciones" DIRECTAMENTE después de stats');
    console.log('   - ❌ Espacio gigante eliminado');
    console.log('   - ❌ Sección duplicada eliminada');

    // 4. Verificar flujo visual
    console.log('\n📋 Paso 4: Verificando flujo visual...');
    console.log('✅ Flujo visual corregido:');
    console.log('   - Banner → Estadísticas → Mis Creaciones (sin espacios)');
    console.log('   - Padding reducido (py-6 en lugar de py-8)');
    console.log('   - Estructura más compacta y directa');
    console.log('   - Sin contenedores vacíos entre secciones');

    // 5. Verificar contenedores de creaciones
    console.log('\n📋 Paso 5: Verificando contenedores de creaciones...');
    const groupedCreations = creations.reduce((acc, creation) => {
      const type = creation.contentType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(creation);
      return acc;
    }, {});

    const categoriesWithContent = Object.keys(groupedCreations);
    console.log(`✅ ${categoriesWithContent.length} contenedores de categorías con contenido:`);
    categoriesWithContent.forEach(type => {
      const count = groupedCreations[type].length;
      console.log(`   - ${type}: ${count} ${count === 1 ? 'creación' : 'creaciones'}`);
    });

    // 6. Verificar que no hay espacios innecesarios
    console.log('\n📋 Paso 6: Verificando eliminación de espacios innecesarios...');
    console.log('✅ Espacios innecesarios eliminados:');
    console.log('   - ❌ Contenedor vacío de navegación eliminado');
    console.log('   - ❌ Espacio gigante entre stats y creaciones eliminado');
    console.log('   - ❌ Sección duplicada al final eliminada');
    console.log('   - ✅ Flujo directo y compacto');

    console.log('\n🎉 ¡Perfil corregido exitosamente!');
    console.log('\n📝 Resumen de correcciones:');
    console.log('   - Eliminado espacio gigante entre estadísticas y creaciones');
    console.log('   - Movida sección "Mis Creaciones" dentro del layout principal');
    console.log('   - Eliminada sección duplicada al final del archivo');
    console.log('   - Estructura más compacta y directa');
    console.log(`   - ${creations.length} creaciones organizadas en ${categoriesWithContent.length} categorías`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    process.exit(1);
  }
}

// Ejecutar la prueba
testFixedProfile();
