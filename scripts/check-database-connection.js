const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión a base de datos...\n');

    // Mostrar variables de entorno
    console.log('📋 Variables de entorno:');
    console.log(`   DB_MODE: ${process.env.DB_MODE}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI}`);
    console.log(`   MONGODB_URI_LOCAL: ${process.env.MONGODB_URI_LOCAL}`);

    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev';
    console.log(`\n🔗 Conectando a: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado exitosamente');

    // Verificar colecciones
    console.log('\n📊 Colecciones en la base de datos:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   📁 Total de colecciones: ${collections.length}`);

    for (const collection of collections) {
      console.log(`   - ${collection.name}`);
    }

    // Verificar contenido
    console.log('\n📋 Contenido en la base de datos:');
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
    const content = await Content.find({}).limit(5);
    console.log(`   📁 Elementos de contenido: ${content.length}`);

    if (content.length > 0) {
      console.log('   📝 Primeros 5 elementos:');
      content.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} - ${item.author} (${item.contentType})`);
      });
    }

    // Verificar usuarios
    console.log('\n👥 Usuarios en la base de datos:');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({}).limit(5);
    console.log(`   👤 Total de usuarios: ${users.length}`);

    if (users.length > 0) {
      console.log('   📝 Primeros 5 usuarios:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} - ${user.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

checkDatabaseConnection();
