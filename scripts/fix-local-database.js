const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

async function fixLocalDatabase() {
  try {
    console.log('🔧 Corrigiendo configuración de base de datos local...\n');

    // 1. Corregir archivo .env.local
    console.log('1️⃣ Corrigiendo archivo .env.local...');

    const envContent = `# ==============================================
# CONFIGURACIÓN PARA DESARROLLO LOCAL
# ==============================================

# Modo de base de datos (local por defecto para desarrollo)
DB_MODE=local

# MongoDB Local (para desarrollo)
MONGODB_URI_LOCAL=mongodb://localhost:27017/takopi_dev

# MongoDB Atlas (solo si cambias DB_MODE=atlas)
MONGODB_ATLAS_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99     

# MongoDB de producción (solo para NODE_ENV=production)
MONGODB_URI=mongodb://localhost:27017/takopi_dev

# ==============================================
# JWT Y AUTENTICACIÓN
# ==============================================
JWT_SECRET=takopi_jwt_secret_development_2025
NEXTAUTH_SECRET=takopi_nextauth_secret_development_2025
NEXTAUTH_URL=http://localhost:3000

# ==============================================
# CONFIGURACIÓN DE ENTORNO
# ==============================================
NODE_ENV=development`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Archivo .env.local corregido');

    // 2. Conectar a MongoDB local
    console.log('\n2️⃣ Conectando a MongoDB local...');
    const mongoUri = 'mongodb://localhost:27017/takopi_dev';
    console.log(`🔗 URI: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB local');

    // 3. Eliminar TODO el contenido
    console.log('\n3️⃣ Eliminando TODO el contenido...');
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
    const contentResult = await Content.deleteMany({});
    console.log(`✅ Eliminados ${contentResult.deletedCount} elementos de contenido`);

    // 4. Verificar que esté vacía
    const remainingContent = await Content.find({});
    console.log(`📊 Contenido restante: ${remainingContent.length} elementos`);

    // 5. Limpiar archivos de uploads
    console.log('\n4️⃣ Limpiando archivos de uploads...');
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
    }

    // 6. Estado final
    console.log('\n📊 Estado final:');
    const finalContent = await Content.find({});
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});

    console.log(`   📁 Contenido: ${finalContent.length} elementos`);
    console.log(`   👥 Usuarios: ${users.length} usuarios`);

    if (finalContent.length === 0) {
      console.log('\n🎉 ¡Base de datos local completamente limpia!');
      console.log('✨ Solo quedan los usuarios de relleno originales');
      console.log('🔧 Configuración corregida para usar MongoDB local');
    } else {
      console.log('\n⚠️ Aún hay contenido en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solución: Asegúrate de que MongoDB local esté corriendo:');
      console.log('   npm run dev:local');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Desconectado de MongoDB');
    }
  }
}

fixLocalDatabase();
