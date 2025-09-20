#!/usr/bin/env node

// Test para probar login con usuario Sushipan
const http = require('http');

async function testSushipanLogin() {
  console.log('🔍 Probando login con usuario Sushipan...\n');

  const postData = JSON.stringify({
    email: 'sushipan@gmail.com',
    password: 'test12345' // Contraseña correcta
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📊 Respuesta del servidor:');
      console.log('Status:', res.statusCode);

      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Login exitoso!');
          console.log('Usuario:', response.user.username);
          console.log('Email:', response.user.email);
          console.log('Rol:', response.user.role);
          console.log('Token generado:', response.token ? 'Sí' : 'No');
        } else {
          console.log('❌ Error en login:');
          console.log('Error:', response.error);
        }
      } catch (e) {
        console.log('❌ Error parseando respuesta:');
        console.log('Raw data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error de conexión:', error.message);
  });

  req.write(postData);
  req.end();
}

// Esperar un poco para que el servidor inicie
setTimeout(() => {
  testSushipanLogin();
}, 3000);
