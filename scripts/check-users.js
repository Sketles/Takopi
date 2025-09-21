const mongoose = require('mongoose');
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

async function checkUsers() {
  try {
    await connectDB();

    console.log('🔍 Buscando todos los usuarios...');
    const users = await User.find({}).select('username email role');

    console.log(`📊 Total de usuarios: ${users.length}`);

    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

checkUsers();