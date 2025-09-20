#!/usr/bin/env node

// Test para probar diferentes contraseñas con usuario Sushipan
const http = require('http');

const passwords = [
  'password123',
  'sushipan',
  'Sushipan',
  'SUSHIPAN',
  'sushipan123',
  'Sushipan123',
  '123456',
  'admin',
  'test',
  'password'
];

async function testPassword(password) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: 'sushipan@gmail.com',
      password: password
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
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ ¡Contraseña correcta!`);
            console.log(`   Contraseña: ${password}`);
            console.log(`   Usuario: ${response.user.username}`);
            resolve({ success: true, password, user: response.user });
          } else if (response.error === 'Credenciales inválidas') {
            console.log(`❌ Contraseña incorrecta: ${password}`);
            resolve({ success: false, password });
          } else {
            console.log(`⚠️  Error con ${password}: ${response.error}`);
            resolve({ success: false, password, error: response.error });
          }
        } catch (e) {
          console.log(`⚠️  Error parseando respuesta para ${password}:`, data.substring(0, 100));
          resolve({ success: false, password, error: 'Parse error' });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de conexión con ${password}:`, error.message);
      resolve({ success: false, password, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function testAllPasswords() {
  console.log('🔍 Probando diferentes contraseñas para sushipan@gmail.com...\n');

  for (const password of passwords) {
    const result = await testPassword(password);
    if (result.success) {
      console.log('\n🎉 ¡Login exitoso!');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre intentos
  }

  console.log('\n❌ Ninguna contraseña funcionó. Puede que necesites:');
  console.log('   1. Verificar la contraseña en MongoDB Atlas');
  console.log('   2. Crear un nuevo usuario');
  console.log('   3. Verificar que el servidor esté funcionando correctamente');
}

// Esperar un poco para que el servidor inicie
setTimeout(() => {
  testAllPasswords();
}, 3000);
