const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

async function createUser() {
  try {
    console.log('👤 Creando usuario sushipan...\n');

    // Verificar si ya existe
    const existingUser = await User.findOne({ email: 'sushipan@takopi.cl' });
    if (existingUser) {
      console.log('⚠️ El usuario sushipan@takopi.cl ya existe');
      console.log(`   👤 Username: ${existingUser.username}`);
      console.log(`   🔑 Role: ${existingUser.role}`);
      return;
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash('test12345', 10);

    // Crear usuario
    const newUser = new User({
      username: 'sushipan',
      email: 'sushipan@takopi.cl',
      password: hashedPassword,
      role: 'creator',
      bio: 'Creador de contenido digital'
    });

    await newUser.save();

    console.log('✅ Usuario creado exitosamente:');
    console.log(`   📧 Email: ${newUser.email}`);
    console.log(`   👤 Username: ${newUser.username}`);
    console.log(`   🔑 Role: ${newUser.role}`);
    console.log(`   🔐 Password: test12345`);
    console.log('\n🎉 ¡Ahora puedes iniciar sesión con estas credenciales!');

  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️ El usuario ya existe (email o username duplicado)');
    } else {
      console.error('❌ Error creando usuario:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(createUser);
}

module.exports = { createUser };
