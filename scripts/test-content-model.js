const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando el modelo Content...\n');

async function testContentModel() {
  try {
    // Conectar a MongoDB
    console.log('📍 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev');
    console.log('✅ Conectado a MongoDB');

    // Definir el esquema de Content (igual que en el modelo)
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

    // Crear un documento de prueba
    console.log('🧪 Creando documento de prueba...');
    const testContent = new Content({
      title: 'Test Modelo 3D',
      provisionalName: 'Test Modelo 3D',
      description: 'Descripción de prueba',
      contentType: 'models',
      category: 'characters',
      files: [{
        name: 'test.blend',
        originalName: 'test.blend',
        size: 1024000,
        type: 'application/x-blender',
        url: '/uploads/test.blend'
      }],
      price: 9999,
      isFree: false,
      currency: 'CLP',
      license: 'personal',
      tags: ['3d', 'blend'],
      customTags: ['3d', 'blend'],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false,
      author: new mongoose.Types.ObjectId(),
      authorUsername: 'testuser',
      status: 'published'
    });

    console.log('💾 Guardando documento de prueba...');
    await testContent.save();
    console.log('✅ Documento guardado exitosamente:', testContent._id);

    // Limpiar
    await Content.deleteOne({ _id: testContent._id });
    console.log('🧹 Documento de prueba eliminado');

    console.log('\n✅ El modelo Content funciona correctamente');

  } catch (error) {
    console.error('❌ Error en el modelo Content:', error);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

testContentModel();
