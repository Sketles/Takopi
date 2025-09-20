const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function forceCleanDatabase() {
  try {
    console.log('🧹 Limpieza forzada de base de datos local...\n');

    // Conectar a MongoDB local
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev';
    console.log('🔗 Conectando a MongoDB local...');

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB local');

    // Eliminar TODA la colección de contenido
    console.log('\n🗑️ Eliminando TODA la colección de contenido...');
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
    const contentResult = await Content.deleteMany({});
    console.log(`✅ Eliminados ${contentResult.deletedCount} elementos de contenido`);

    // Verificar que esté vacía
    const remainingContent = await Content.find({});
    console.log(`📊 Contenido restante: ${remainingContent.length} elementos`);

    // Limpiar archivos de uploads
    console.log('\n🗑️ Limpiando archivos subidos...');
    const fs = require('fs');
    const path = require('path');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`   🗑️ Eliminado: ${file}`);
        } catch (error) {
          console.log(`   ❌ Error eliminando ${file}: ${error.message}`);
        }
      }

      console.log(`✅ Eliminados ${deletedCount} archivos de uploads`);
    } else {
      console.log('ℹ️ Directorio uploads no existe');
    }

    // Verificar usuarios de relleno
    console.log('\n👥 Verificando usuarios de relleno...');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});
    console.log(`✅ ${users.length} usuarios de relleno mantenidos`);

    // Estado final
    console.log('\n📊 Estado final de la base de datos:');
    const finalContent = await Content.find({});
    console.log(`   📁 Contenido: ${finalContent.length} elementos`);
    console.log(`   👥 Usuarios: ${users.length} usuarios`);

    if (finalContent.length === 0) {
      console.log('\n🎉 ¡Base de datos completamente limpia!');
      console.log('✨ Solo quedan los usuarios de relleno originales');
    } else {
      console.log('\n⚠️ Aún hay contenido en la base de datos');
      console.log('📋 Elementos restantes:', finalContent.map(c => `- ${c.title} (${c.author})`).join('\n'));
    }

  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

forceCleanDatabase();
