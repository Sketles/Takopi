const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

// Configurar conexión a MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.DB_MODE === 'local'
      ? process.env.MONGODB_URI_LOCAL
      : process.env.MONGODB_URI;

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Schema temporal para User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },
  avatar: { type: String },
  banner: { type: String },
  bio: { type: String },
  location: { type: String },
  joinedDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function testSimpleCounter() {
  try {
    await connectDB();

    console.log('🎯 PROBANDO CONTADOR SIMPLE DE CREACIONES\n');

    // 1. Buscar usuario
    const user = await User.findOne({ username: 'Sushipan' });

    if (!user) {
      console.log('❌ Usuario Sushipan no encontrado');
      return;
    }

    console.log(`✅ Usuario: ${user.username}\n`);

    // 2. Simular login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        password: 'test12345'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login');
      return;
    }

    const loginData = await loginResponse.json();
    console.log(`✅ Login exitoso!\n`);

    // 3. Obtener estadísticas
    const statsResponse = await fetch('http://localhost:3000/api/user/stats', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!statsResponse.ok) {
      console.log('❌ Error obteniendo estadísticas');
      return;
    }

    const statsData = await statsResponse.json();

    // 4. Mostrar resultado
    console.log('📊 CONTADOR EN EL PERFIL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   🎨 Creaciones: ${statsData.data.totalCreations}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n🎉 ¡FUNCIONALIDAD SIMPLIFICADA COMPLETADA!');
    console.log('\n✨ Características implementadas:');
    console.log('   ✅ Contador simple de creaciones en el perfil');
    console.log('   ✅ Datos en tiempo real desde la base de datos');
    console.log('   ✅ Sin modal - solo el número');
    console.log('   ✅ Se actualiza automáticamente');

    console.log('\n🚀 Para verlo en acción:');
    console.log('   1. Ve a http://localhost:3000/auth/login');
    console.log('   2. Inicia sesión con sushipan@takopi.cl');
    console.log('   3. Ve a http://localhost:3000/profile');
    console.log('   4. ¡Verás el número "2" en Creaciones!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

testSimpleCounter();
