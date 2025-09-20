const mongoose = require('mongoose');

// Conectar a MongoDB local
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/takopi_dev');
    console.log('✅ Conectado a MongoDB local');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Definir esquema de usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
  avatar: { type: String },
  banner: { type: String },
  bio: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...\n');

    const users = await User.find({});

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('💡 Ejecuta: npm run seed:local');
      return;
    }

    console.log(`📊 Total de usuarios encontrados: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. Usuario:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   🔑 Role: ${user.role}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString('es-CL')}`);
      console.log('');
    });

    // Buscar específicamente el usuario que está intentando usar
    const targetUser = await User.findOne({ email: 'sushipan@takopi.cl' });

    if (targetUser) {
      console.log('✅ Usuario sushipan@takopi.cl encontrado:');
      console.log(`   👤 Username: ${targetUser.username}`);
      console.log(`   🔑 Role: ${targetUser.role}`);
    } else {
      console.log('❌ Usuario sushipan@takopi.cl NO encontrado');
      console.log('\n💡 Credenciales de prueba disponibles:');
      console.log('   📧 testuser: test@takopi.com');
      console.log('   📧 creator: creator@takopi.com');
      console.log('   📧 admin: admin@takopi.com');
      console.log('   🔑 Password para todos: password123');
    }

  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(checkUsers);
}

module.exports = { checkUsers };
