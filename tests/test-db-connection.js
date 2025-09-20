#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// Configuración de MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99';

async function testConnection() {
  console.log('🔍 Probando conexión a MongoDB Atlas...\n');

  let client;
  try {
    // Conectar a MongoDB
    console.log('📡 Conectando a:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales
    client = new MongoClient(MONGODB_URI);

    await client.connect();
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');

    // Probar la base de datos
    const db = client.db('Takopi_BaseDatos');
    console.log('✅ Base de datos "Takopi_BaseDatos" accesible');

    // Probar la colección de usuarios
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`✅ Colección "users" accesible - ${userCount} usuarios encontrados`);

    // Listar usuarios si existen
    if (userCount > 0) {
      console.log('\n📋 Usuarios en la base de datos:');
      const users = await usersCollection.find({}).limit(5).toArray();
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - Rol: ${user.role}`);
      });
    }

    // Probar ping
    const pingResult = await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping exitoso:', pingResult);

  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error('   Tipo:', error.name);
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);

    if (error.code === 'ENOTFOUND') {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Verificar que la URL de MongoDB Atlas sea correcta');
      console.error('   2. Verificar que la contraseña sea correcta');
      console.error('   3. Verificar que el cluster esté activo en MongoDB Atlas');
      console.error('   4. Verificar la conexión a internet');
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. El cluster de MongoDB Atlas puede estar pausado');
      console.error('   2. Verificar la configuración de red en MongoDB Atlas');
    }

    if (error.code === 18) {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Credenciales incorrectas (usuario/contraseña)');
      console.error('   2. Usuario no tiene permisos para acceder a la base de datos');
    }

  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar test
testConnection().catch(console.error);
