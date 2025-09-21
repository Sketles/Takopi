/**
 * Script para crear el usuario de pruebas automatizadas
 * Usuario: PruebasAutomaticas@takopi.cl
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema simplificado del Usuario para Node.js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  roles: { type: [String], default: ['buyer'] },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: null },
  banner: { type: String, default: null },
  socialLinks: {
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  preferences: {
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'es' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    console.log('🔗 Conectando a MongoDB...');

    // Conectar a MongoDB
    const mongoUri = 'mongodb://localhost:27017/takopi_dev';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB conectado');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'PruebasAutomaticas@takopi.cl' });

    if (existingUser) {
      console.log('ℹ️ El usuario de pruebas ya existe');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Creado: ${existingUser.createdAt}`);
      return;
    }

    // Crear usuario de pruebas
    console.log('👤 Creando usuario de pruebas...');

    const hashedPassword = await bcrypt.hash('test12345', 12);

    const testUser = new User({
      username: 'PruebasAutomaticas',
      email: 'PruebasAutomaticas@takopi.cl',
      password: hashedPassword,
      bio: 'Usuario dedicado exclusivamente a pruebas automatizadas del sistema Takopi',
      roles: ['creator', 'buyer'],
      isVerified: true,
      avatar: null,
      banner: null,
      socialLinks: {
        website: 'https://takopi.com',
        twitter: '@takopi',
        instagram: '@takopi'
      },
      preferences: {
        theme: 'dark',
        language: 'es',
        notifications: {
          email: false,
          push: false,
          marketing: false
        }
      }
    });

    await testUser.save();

    console.log('✅ Usuario de pruebas creado exitosamente:');
    console.log(`   Username: ${testUser.username}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   ID: ${testUser._id}`);
    console.log(`   Password: test12345`);

  } catch (error) {
    console.error('❌ Error creando usuario de pruebas:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestUser();
}

module.exports = createTestUser;
