#!/usr/bin/env node

/**
 * Script para probar la API directamente
 * Ejecutar con: node scripts/test-api-directly.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Probando API directamente...');

// Leer el token del localStorage (necesitarás copiarlo manualmente)
const token = process.argv[2];

if (!token) {
  console.log('❌ Error: Necesitas proporcionar un token JWT');
  console.log('💡 Usa: node scripts/test-api-directly.js TU_TOKEN_AQUI');
  console.log('');
  console.log('📋 Para obtener el token:');
  console.log('1. Abre Chrome DevTools');
  console.log('2. Ve a Application > Local Storage > localhost:3001');
  console.log('3. Busca "takopi_user" y copia el token');
  process.exit(1);
}

// Datos de prueba
const testData = {
  username: 'takopi',
  bio: 'Hola',
  role: 'Artist',
  location: 'Madrid, España - TEST API'
};

// Función para hacer la petición
async function testAPI() {
  try {
    console.log('🚀 Enviando petición a la API...');
    console.log('📤 Datos:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Status:', response.status);
    console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.json();
    console.log('📥 Response:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ API funcionando correctamente');
      console.log('🔍 Location en respuesta:', responseData.user?.location);
    } else {
      console.log('❌ Error en la API:', responseData.error);
    }

  } catch (error) {
    console.error('❌ Error al hacer la petición:', error.message);
  }
}

// Ejecutar la prueba
testAPI();
