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

const ContentFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  previewUrl: { type: String }
}, { _id: false });

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  provisionalName: { type: String, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  shortDescription: { type: String, trim: true, maxlength: 500 },
  contentType: {
    type: String,
    required: true,
    enum: ['models', 'textures', 'music', 'avatars', 'animations', 'obs', 'collections']
  },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  files: [ContentFileSchema],
  coverImage: { type: String },
  additionalImages: [{ type: String }],
  price: { type: Number, required: true, min: 0, default: 0 },
  isFree: { type: Boolean, required: true, default: true },
  currency: { type: String, required: true, default: 'CLP' },
  license: {
    type: String,
    required: true,
    enum: ['personal', 'commercial', 'royalty-free', 'custom'],
    default: 'personal'
  },
  customLicense: { type: String, trim: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  customTags: [{ type: String, trim: true, lowercase: true }],
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'unlisted', 'draft'],
    default: 'public'
  },
  allowTips: { type: Boolean, default: false },
  allowCommissions: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorUsername: { type: String, required: true, trim: true },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived', 'rejected'],
    default: 'draft'
  },
  moderated: { type: Boolean, default: false },
  moderatedAt: { type: Date },
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderationNotes: { type: String, trim: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Content = mongoose.model('Content', ContentSchema);

async function testUploadForm() {
  try {
    console.log('🧪 Probando datos del formulario de subida...\n');

    // Buscar usuario sushipan
    const user = await User.findOne({ email: 'sushipan@takopi.cl' });
    if (!user) {
      console.log('❌ Usuario sushipan@takopi.cl no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.username}`);

    // Simular datos del formulario
    const formData = {
      title: 'Test Upload - Modelo 3D',
      provisionalName: 'Proyecto sin título #123',
      description: 'Este es un modelo 3D de prueba para verificar que el formulario funciona correctamente.',
      contentType: 'models',
      category: 'Modelos 3D',
      subcategory: 'Props',
      files: [
        {
          name: 'test_model.fbx',
          originalName: 'test_model.fbx',
          size: 1024000,
          type: 'application/octet-stream'
        }
      ],
      price: 15990,
      isFree: false,
      license: 'commercial',
      tags: ['3d', 'modelo', 'prop', 'unity', 'unreal'],
      customTags: ['test', 'ejemplo', 'verificación'],
      visibility: 'public',
      allowTips: true,
      allowCommissions: false
    };

    console.log('📝 Datos del formulario:');
    console.log(`   Título: ${formData.title}`);
    console.log(`   Tipo: ${formData.contentType}`);
    console.log(`   Precio: ${formData.price} CLP`);
    console.log(`   Tags: ${formData.tags.join(', ')}`);
    console.log(`   Custom Tags: ${formData.customTags.join(', ')}`);

    // Procesar archivos
    const processedFiles = formData.files.map(file => ({
      name: file.name,
      originalName: file.originalName || file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${file.name}`,
      previewUrl: file.type.startsWith('image/') ? `/uploads/${file.name}` : undefined
    }));

    // Crear contenido
    const contentData = {
      title: formData.title.trim(),
      provisionalName: formData.provisionalName?.trim(),
      description: formData.description.trim(),
      contentType: formData.contentType,
      category: formData.category.trim(),
      subcategory: formData.subcategory?.trim(),
      files: processedFiles,
      price: formData.price,
      isFree: formData.isFree,
      currency: 'CLP',
      license: formData.license,
      tags: [...formData.tags, ...formData.customTags].map(tag => tag.trim().toLowerCase()),
      customTags: formData.customTags.map(tag => tag.trim().toLowerCase()),
      visibility: formData.visibility,
      allowTips: formData.allowTips,
      allowCommissions: formData.allowCommissions,
      author: user._id,
      authorUsername: user.username,
      status: formData.visibility === 'draft' ? 'draft' : 'published'
    };

    console.log('\n🔄 Procesando datos...');
    console.log(`   Tags combinados: ${contentData.tags.join(', ')}`);
    console.log(`   Archivos procesados: ${contentData.files.length}`);

    // Guardar en base de datos
    const content = new Content(contentData);
    await content.save();

    console.log('\n✅ ¡Prueba exitosa!');
    console.log(`   📄 Contenido creado con ID: ${content._id}`);
    console.log(`   📊 Tags guardados: ${content.tags.length}`);
    console.log(`   💰 Precio: ${content.price} ${content.currency}`);

    // Limpiar el contenido de prueba
    await Content.findByIdAndDelete(content._id);
    console.log('🧹 Contenido de prueba eliminado');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(testUploadForm);
}

module.exports = { testUploadForm };
