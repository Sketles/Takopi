const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

// Definir esquemas
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

async function testSimpleAPI() {
  try {
    console.log('🧪 Probando API simplificada...\n');

    // Buscar usuario
    const user = await User.findOne({ email: 'sushipan@takopi.cl' });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario: ${user.username} (${user.email})`);

    // Generar token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`🔐 Token generado: ${token.substring(0, 50)}...`);

    // Datos de prueba simples
    const testData = {
      title: 'Test Simple API',
      description: 'Prueba de API simplificada',
      contentType: 'models',
      category: 'Test'
    };

    console.log('\n📤 Enviando petición a /api/content/test...');

    const response = await fetch('http://localhost:3000/api/content/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    console.log(`📥 Respuesta (${response.status}):`);
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ ¡API simplificada funcionando!');
      console.log('💡 El problema está en la API principal');
    } else {
      console.log('\n❌ Error en API simplificada');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(testSimpleAPI);
}

module.exports = { testSimpleAPI };
