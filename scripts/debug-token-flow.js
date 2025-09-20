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

async function debugTokenFlow() {
  try {
    console.log('🔍 Diagnosticando flujo de autenticación...\n');

    // Buscar usuario sushipan
    const user = await User.findOne({ email: 'sushipan@takopi.cl' });
    if (!user) {
      console.log('❌ Usuario sushipan@takopi.cl no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   🆔 ID: ${user._id}`);
    console.log(`   👤 Username: ${user.username}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔑 Role: ${user.role}`);

    // Generar token con la misma lógica que la API
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`\n🔐 Token JWT generado:`);
    console.log(`   Token: ${token.substring(0, 50)}...`);
    console.log(`   Longitud: ${token.length} caracteres`);

    // Verificar token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      console.log(`\n✅ Token verificado:`);
      console.log(`   User ID: ${decoded.userId}`);
      console.log(`   Email: ${decoded.email}`);
      console.log(`   Username: ${decoded.username}`);
      console.log(`   Expira: ${new Date(decoded.exp * 1000).toLocaleString('es-CL')}`);
    } catch (error) {
      console.log('❌ Error verificando token:', error.message);
    }

    // Simular petición a la API de contenido
    console.log(`\n🧪 Simulando petición a /api/content...`);

    const testData = {
      title: 'Test de Subida',
      description: 'Descripción de prueba',
      contentType: 'models',
      category: 'Modelos 3D',
      files: [{
        name: 'test.fbx',
        originalName: 'test.fbx',
        size: 1024,
        type: 'application/octet-stream'
      }],
      price: 0,
      isFree: true,
      license: 'personal',
      tags: ['test'],
      customTags: [],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false
    };

    console.log(`   Datos de prueba:`, JSON.stringify(testData, null, 2));

    // Verificar que el usuario puede crear contenido
    const contentData = {
      ...testData,
      author: user._id,
      authorUsername: user.username,
      status: 'published'
    };

    const testContent = new Content(contentData);
    await testContent.save();

    console.log(`\n✅ Contenido de prueba creado exitosamente:`);
    console.log(`   🆔 Content ID: ${testContent._id}`);
    console.log(`   👤 Autor: ${testContent.authorUsername}`);
    console.log(`   🔗 Relación: ${testContent.author} -> ${user._id}`);

    // Limpiar
    await Content.findByIdAndDelete(testContent._id);
    console.log(`🧹 Contenido de prueba eliminado`);

    console.log(`\n💡 Instrucciones para el usuario:`);
    console.log(`1. Ve a http://localhost:3000/debug-token`);
    console.log(`2. Genera el token automáticamente`);
    console.log(`3. Ve a http://localhost:3000/upload`);
    console.log(`4. Prueba subir contenido`);
    console.log(`\n🔧 Si sigue fallando, verifica:`);
    console.log(`- Que el token esté en localStorage`);
    console.log(`- Que el JWT_SECRET sea el mismo en .env.local`);
    console.log(`- Que la API esté recibiendo el header Authorization`);

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(debugTokenFlow);
}

module.exports = { debugTokenFlow };
