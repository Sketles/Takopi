const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando subida de archivo .blend...\n');

async function testBlendUpload() {
  try {
    // 1. Primero hacer login para obtener token
    console.log('1️⃣ Haciendo login...');
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

    if (!loginResponse.ok) {
      console.error('❌ Error en login:', loginResponse.status, loginResponse.statusText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');
    console.log('👤 Usuario:', loginData.user.username);
    console.log('🔑 Token:', loginData.token ? `${loginData.token.substring(0, 50)}...` : 'No token');

    // 2. Simular datos de archivo .blend
    const blendFileData = {
      title: 'Modelo 3D de Prueba',
      provisionalName: 'Modelo 3D de Prueba',
      description: 'Un modelo 3D de prueba creado en Blender',
      shortDescription: 'Modelo 3D de prueba',
      contentType: 'models',
      category: 'characters',
      subcategory: '',
      files: [{
        name: 'modelo_prueba.blend',
        originalName: 'modelo_prueba.blend',
        size: 2048000, // 2MB
        type: 'application/x-blender' // Tipo MIME para .blend
      }],
      coverImage: null,
      additionalImages: [],
      price: '15000',
      isFree: false,
      license: 'personal',
      customLicense: '',
      tags: ['3d', 'blender', 'modelo'],
      customTags: ['3d', 'blender', 'modelo'],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false,
      externalLinks: '',
      notes: 'Archivo de prueba'
    };

    console.log('\n2️⃣ Enviando datos del modelo 3D...');
    console.log('📊 Datos:', JSON.stringify(blendFileData, null, 2));

    // 3. Enviar a la API
    const contentResponse = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(blendFileData)
    });

    console.log('\n3️⃣ Respuesta de la API:');
    console.log('📡 Status:', contentResponse.status, contentResponse.statusText);

    const contentData = await contentResponse.json();
    console.log('📄 Respuesta:', JSON.stringify(contentData, null, 2));

    if (contentResponse.ok) {
      console.log('\n✅ ¡Subida exitosa!');
      console.log('🆔 ID del contenido:', contentData.data._id);
    } else {
      console.log('\n❌ Error en la subida:');
      console.log('🚨 Error:', contentData.error);
    }

  } catch (error) {
    console.error('\n💥 Error general:', error);
  }
}

testBlendUpload();
