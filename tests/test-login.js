#!/usr/bin/env node

const fetch = require('node-fetch');

async function testLogin() {
  console.log('🔍 Probando login con la base de datos...\n');

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tech@artist.com',
        password: 'password123'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login exitoso!');
      console.log('Usuario:', data.user.username);
      console.log('Email:', data.user.email);
      console.log('Rol:', data.user.role);
      console.log('Token generado:', data.token ? 'Sí' : 'No');
    } else {
      console.log('❌ Error en login:');
      console.log('Status:', response.status);
      console.log('Error:', data.error);
    }

  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error('Mensaje:', error.message);
  }
}

// Ejecutar test
testLogin();
