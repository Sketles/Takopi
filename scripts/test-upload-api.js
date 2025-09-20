const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

async function testUploadAPI() {
  try {
    console.log('🧪 Probando API de upload...\n');

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

    // Ahora probar el upload
    console.log('\n2️⃣ Probando upload de contenido...');

    const uploadData = {
      title: 'Test de Textura',
      description: 'Descripción de prueba para la textura',
      contentType: 'textures',
      category: 'materials',
      files: [{
        name: 'test-texture.jpg',
        originalName: 'test-texture.jpg',
        size: 1024,
        type: 'image/jpeg'
      }],
      price: 1500,
      isFree: false,
      license: 'personal',
      tags: ['test', 'textura'],
      customTags: [],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false,
      externalLinks: '',
      notes: 'Notas de prueba'
    };

    console.log('📤 Datos a enviar:', JSON.stringify(uploadData, null, 2));

    const uploadResponse = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(uploadData)
    });

    const uploadResult = await uploadResponse.json();

    console.log('📊 Status:', uploadResponse.status);
    console.log('📥 Respuesta:', JSON.stringify(uploadResult, null, 2));

    if (uploadResponse.ok) {
      console.log('✅ Upload exitoso!');
    } else {
      console.log('❌ Error en upload:', uploadResult.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUploadAPI();
