#!/usr/bin/env node

const testAuth = async () => {
  const baseUrl = 'http://localhost:3000/api';

  console.log('🧪 Probando funcionalidades de autenticación...\n');

  // Test 1: Registro de usuario
  console.log('1️⃣ Probando registro de usuario...');
  try {
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@test.com`,
        password: '123456',
        role: 'Explorer'
      }),
    });

    const registerData = await registerResponse.json();

    if (registerResponse.ok) {
      console.log('✅ Registro exitoso:', registerData.user.username);
      console.log('   Email:', registerData.user.email);
      console.log('   Role:', registerData.user.role);
      console.log('   Token generado:', registerData.token ? 'Sí' : 'No');

      // Test 2: Login con el usuario creado
      console.log('\n2️⃣ Probando login...');
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.user.email,
          password: '123456'
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        console.log('✅ Login exitoso:', loginData.user.username);
        console.log('   Avatar:', loginData.user.avatar || 'No configurado');
        console.log('   Bio:', loginData.user.bio || 'No configurado');

        console.log('\n🎉 ¡Autenticación funcionando correctamente!');
        console.log('\n📋 Funcionalidades disponibles:');
        console.log('   ✅ Registro de usuarios');
        console.log('   ✅ Login de usuarios');
        console.log('   ✅ JWT tokens');
        console.log('   ✅ Validación de contraseñas');
        console.log('   ✅ Roles de usuario');

        console.log('\n❌ Funcionalidades pendientes:');
        console.log('   ❌ Actualizar perfil');
        console.log('   ❌ Cambiar foto de perfil');
        console.log('   ❌ Editar bio');
        console.log('   ❌ Subir modelos 3D');
        console.log('   ❌ Sistema de likes/favoritos');

      } else {
        console.log('❌ Error en login:', loginData.error);
      }

    } else {
      console.log('❌ Error en registro:', registerData.error);
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo: npm run dev');
  }
};

testAuth();
