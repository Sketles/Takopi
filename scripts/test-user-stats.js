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

// Schema temporal para Content
const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provisionalName: { type: String },
  description: { type: String },
  shortDescription: { type: String },
  contentType: { type: String, required: true },
  category: { type: String },
  subcategory: { type: String },
  files: [{
    name: String,
    originalName: String,
    size: Number,
    type: String,
    url: String,
    previewUrl: String
  }],
  coverImage: { type: String },
  additionalImages: [String],
  notes: { type: String },
  externalLinks: { type: String },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: true },
  currency: { type: String, default: 'CLP' },
  license: { type: String, enum: ['personal', 'commercial', 'streaming', 'royalty-free', 'custom'], default: 'personal' },
  customLicense: { type: String },
  tags: [String],
  customTags: [String],
  visibility: { type: String, enum: ['public', 'private', 'draft'], default: 'public' },
  allowTips: { type: Boolean, default: false },
  allowCommissions: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorUsername: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);
const Content = mongoose.model('Content', ContentSchema);

async function testUserStats() {
  try {
    await connectDB();

    console.log('🔍 Buscando usuario Sushipan...');
    const user = await User.findOne({ username: 'Sushipan' });

    if (!user) {
      console.log('❌ Usuario sushipan no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.username} (${user._id})`);

    // Obtener estadísticas del usuario
    const totalCreations = await Content.countDocuments({
      author: user._id,
      status: 'published'
    });

    console.log(`📊 Total de creaciones: ${totalCreations}`);

    // Obtener conteo por tipo de contenido
    const contentByType = await Content.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $group: { _id: '$contentType', count: { $sum: 1 } } }
    ]);

    console.log('📈 Creaciones por tipo:');
    contentByType.forEach(item => {
      console.log(`  - ${item._id}: ${item.count}`);
    });

    // Obtener likes totales
    const heartsReceived = await Content.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    const totalLikes = heartsReceived.length > 0 ? heartsReceived[0].totalLikes : 0;
    console.log(`❤️ Total de likes: ${totalLikes}`);

    // Mostrar algunas creaciones como ejemplo
    const sampleContent = await Content.find({
      author: user._id,
      status: 'published'
    }).limit(3).select('title contentType');

    console.log('\n📝 Ejemplos de creaciones:');
    sampleContent.forEach(item => {
      console.log(`  - "${item.title}" (${item.contentType})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

testUserStats();
