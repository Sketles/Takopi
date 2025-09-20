#!/usr/bin/env node

/**
 * Script para probar el formulario de subida con datos completos
 * y debuggear qué está pasando
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

// Datos de prueba completos
const testFormData = {
  title: "Test de Modelo 3D Completo",
  provisionalName: "modelo-test-completo",
  description: "Descripción completa del modelo 3D de prueba con todas las características",
  shortDescription: "Modelo 3D de prueba",
  contentType: "models",
  category: "characters",
  subcategory: "humanoid",
  files: [{
    name: "test-model-complete.fbx",
    originalName: "test-model-complete.fbx",
    size: 2048000,
    type: "model/fbx",
    url: "/uploads/test-model-complete.fbx",
    previewUrl: "/uploads/preview-test-model-complete.jpg"
  }],
  price: "0",
  isFree: true,
  currency: "CLP",
  license: "personal",
  customLicense: "",
  tags: ["test", "modelo", "3d", "completo"],
  customTags: [],
  visibility: "public",
  allowTips: false,
  allowCommissions: false,
  externalLinks: "",
  notes: "Notas de prueba para el modelo",
  coverImage: null,
  additionalImages: []
};

async function testUploadForm() {
  console.log('🧪 Probando formulario de subida con datos completos...\n');

  try {
    // 1. Primero hacer login para obtener el token
    console.log('🔐 Haciendo login...');
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

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(`Login falló: ${loginResult.message}`);
    }

    console.log('✅ Login exitoso');
    console.log('   Usuario:', loginResult.user.username);
    console.log('   Token recibido:', loginResult.token ? 'Sí' : 'No');

    // 2. Ahora probar el envío del formulario
    console.log('\n📤 Enviando formulario de subida...');
    console.log('📊 Datos a enviar:', JSON.stringify(testFormData, null, 2));

    const uploadResponse = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      },
      body: JSON.stringify(testFormData)
    });

    console.log('📥 Respuesta de la API:', uploadResponse.status, uploadResponse.statusText);

    const uploadResult = await uploadResponse.json();
    console.log('📊 Resultado completo:', JSON.stringify(uploadResult, null, 2));

    if (uploadResponse.ok) {
      console.log('\n🎉 ¡Formulario de subida exitoso!');
      console.log('   ID del contenido:', uploadResult.data._id);
      console.log('   Título:', uploadResult.data.title);
      console.log('   Estado:', uploadResult.data.status);
    } else {
      console.log('\n❌ Error en el formulario de subida:');
      console.log('   Error:', uploadResult.error);
      console.log('   Mensaje:', uploadResult.message);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Ejecutar la prueba
testUploadForm();
