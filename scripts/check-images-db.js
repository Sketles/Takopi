const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Definir el esquema de Content
const contentSchema = new mongoose.Schema({
  title: String,
  provisionalName: String,
  description: String,
  shortDescription: String,
  contentType: String,
  category: String,
  subcategory: String,
  files: [{
    name: String,
    originalName: String,
    size: Number,
    type: String,
    url: String,
    previewUrl: String,
  }],
  coverImage: String,
  additionalImages: [String],
  notes: String,
  externalLinks: [{ title: String, url: String }],
  price: Number,
  isFree: Boolean,
  currency: String,
  license: String,
  customLicense: String,
  tags: [String],
  customTags: [String],
  visibility: { type: String, enum: ['public', 'unlisted', 'draft'], default: 'draft' },
  allowTips: Boolean,
  allowCommissions: Boolean,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorUsername: String,
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'pending', 'published', 'rejected'], default: 'draft' },
  moderated: { type: Boolean, default: false },
  moderatedAt: Date,
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderationNotes: String,
}, {
  timestamps: true
});

const Content = mongoose.model('Content', contentSchema);

async function checkImages() {
  try {
    // Conectar a la base de datos
    const dbMode = process.env.DB_MODE || 'local';
    const mongoUri = dbMode === 'local'
      ? 'mongodb://localhost:27017/takopi_dev'
      : process.env.MONGODB_URI;

    console.log(`🔌 Conectando a ${dbMode === 'local' ? 'MongoDB local' : 'MongoDB Atlas'}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a la base de datos');

    // Buscar contenido con archivos
    const contentWithFiles = await Content.find({
      files: { $exists: true, $not: { $size: 0 } }
    }).lean();

    console.log(`\n📊 Encontrados ${contentWithFiles.length} contenidos con archivos:`);

    for (const content of contentWithFiles) {
      console.log(`\n📁 Contenido: "${content.title || content.provisionalName}"`);
      console.log(`   Autor: ${content.authorUsername}`);
      console.log(`   Tipo: ${content.contentType}`);
      console.log(`   Archivos: ${content.files ? content.files.length : 0}`);

      if (content.files && content.files.length > 0) {
        content.files.forEach((file, index) => {
          console.log(`     ${index + 1}. ${file.name}`);
          console.log(`        Tipo: ${file.type}`);
          console.log(`        URL: ${file.url}`);
          console.log(`        Preview URL: ${file.previewUrl || 'No disponible'}`);
          console.log(`        Es imagen: ${file.type && file.type.startsWith('image/') ? 'SÍ' : 'NO'}`);
        });
      }

      // Verificar si hay imagen de portada
      if (content.coverImage) {
        console.log(`   🖼️ Imagen de portada: ${content.coverImage}`);
      }

      // Verificar si hay imágenes adicionales
      if (content.additionalImages && content.additionalImages.length > 0) {
        console.log(`   📸 Imágenes adicionales: ${content.additionalImages.length}`);
        content.additionalImages.forEach((img, index) => {
          console.log(`     ${index + 1}. ${img}`);
        });
      }
    }

    // Buscar contenido sin archivos
    const contentWithoutFiles = await Content.find({
      $or: [
        { files: { $exists: false } },
        { files: { $size: 0 } }
      ]
    }).lean();

    console.log(`\n📊 Encontrados ${contentWithoutFiles.length} contenidos sin archivos:`);
    contentWithoutFiles.forEach(content => {
      console.log(`   - "${content.title || content.provisionalName}" (${content.authorUsername})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

checkImages();
