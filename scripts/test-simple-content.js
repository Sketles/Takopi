const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando modelo Content simplificado...\n');

async function testSimpleContent() {
  try {
    // Conectar a MongoDB
    console.log('📍 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev');
    console.log('✅ Conectado a MongoDB');

    // Definir esquema simplificado
    const ContentFileSchema = new mongoose.Schema({
      name: { type: String, required: true },
      originalName: { type: String, required: true },
      size: { type: Number, required: true },
      type: { type: String, required: true },
      url: { type: String, required: true },
      previewUrl: { type: String }
    }, { _id: false });

    const ContentSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      contentType: { type: String, required: true },
      category: { type: String, required: true },
      files: [ContentFileSchema],
      price: { type: Number, default: 0 },
      isFree: { type: Boolean, default: true },
      currency: { type: String, default: 'CLP' },
      license: { type: String, default: 'personal' },
      tags: [String],
      customTags: [String],
      visibility: { type: String, default: 'public' },
      allowTips: { type: Boolean, default: false },
      allowCommissions: { type: Boolean, default: false },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      authorUsername: { type: String, required: true },
      status: { type: String, default: 'published' }
    }, {
      timestamps: true
    });

    const Content = mongoose.model('Content', ContentSchema);

    // Crear un documento de prueba
    console.log('🧪 Creando documento de prueba...');
    const testContent = new Content({
      title: 'Test Modelo 3D Simple',
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

    console.log('\n✅ El modelo Content simplificado funciona correctamente');

  } catch (error) {
    console.error('❌ Error en el modelo Content simplificado:', error);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

testSimpleContent();
