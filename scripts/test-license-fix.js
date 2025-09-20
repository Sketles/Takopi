const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

async function testLicenseFix() {
  try {
    console.log('🧪 Probando fix de licencias...\n');

    // Primero necesitamos obtener un token válido
    console.log('1️⃣ Obteniendo token de autenticación...');

    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sushipan@takopi.cl',
        password: 'test12345'
      })
    });

    const loginData = await loginResponse.json();

    if (!loginData.token) {
      console.log('❌ Error al obtener token:', loginData);
      return;
    }

    console.log('✅ Token obtenido');

    // Probar con licencia 'streaming'
    console.log('\n2️⃣ Probando con licencia "streaming"...');

    const testData = {
      title: 'Test Streaming License',
      provisionalName: 'Test Streaming License',
      description: 'Prueba de licencia streaming',
      contentType: 'textures',
      category: 'materials',
      files: [{
        name: 'test-streaming.jpg',
        originalName: 'test-streaming.jpg',
        size: 10000,
        type: 'image/jpeg'
      }],
      price: '0',
      isFree: true,
      license: 'streaming', // ← Esta era la licencia problemática
      tags: ['test', 'streaming'],
      customTags: [],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false
    };

    const response = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ ¡Éxito! Licencia "streaming" aceptada');
      console.log('📊 Status:', response.status);
      console.log('📝 ID del contenido:', result.data._id);
    } else {
      console.log('❌ Error:', result.error);
      console.log('📊 Status:', response.status);
    }

    // Probar con licencia 'commercial'
    console.log('\n3️⃣ Probando con licencia "commercial"...');

    const testData2 = {
      title: 'Test Commercial License',
      provisionalName: 'Test Commercial License',
      description: 'Prueba de licencia commercial',
      contentType: 'textures',
      category: 'materials',
      files: [{
        name: 'test-commercial.jpg',
        originalName: 'test-commercial.jpg',
        size: 10000,
        type: 'image/jpeg'
      }],
      price: '5000',
      isFree: false,
      license: 'commercial',
      tags: ['test', 'commercial'],
      customTags: [],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false
    };

    const response2 = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(testData2)
    });

    const result2 = await response2.json();

    if (response2.ok) {
      console.log('✅ ¡Éxito! Licencia "commercial" aceptada');
      console.log('📊 Status:', response2.status);
      console.log('📝 ID del contenido:', result2.data._id);
    } else {
      console.log('❌ Error:', result2.error);
      console.log('📊 Status:', response2.status);
    }

    console.log('\n🎉 ¡Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

testLicenseFix();
