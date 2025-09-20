const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

async function testFrontendUpload() {
  try {
    console.log('🧪 Probando exactamente lo que envía el frontend...\n');

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

    // Simular exactamente lo que envía el frontend
    console.log('\n2️⃣ Simulando datos del frontend...');

    const frontendData = {
      title: 'Mi Textura de Prueba',
      provisionalName: 'Proyecto sin título #123',
      description: 'Esta es una descripción de prueba para mi textura',
      shortDescription: 'Descripción corta',
      contentType: 'textures',
      category: 'materials',
      subcategory: 'stone',
      files: [{
        name: 'mi-textura.jpg',
        originalName: 'mi-textura.jpg',
        size: 2048,
        type: 'image/jpeg'
      }],
      coverImage: '',
      additionalImages: [],
      notes: 'Notas de prueba',
      externalLinks: '',
      price: '1500',
      isFree: false,
      license: 'personal',
      customLicense: '',
      tags: ['test', 'textura'],
      customTags: ['test', 'textura'],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false
    };

    console.log('📤 Datos del frontend:', JSON.stringify(frontendData, null, 2));

    const uploadResponse = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(frontendData)
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

testFrontendUpload();
