#!/usr/bin/env node

/**
 * Script para verificar el contenido subido en la base de datos
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Definir el esquema de User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
  avatar: String,
  banner: String,
  bio: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

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
    previewUrl: String
  }],
  coverImage: String,
  additionalImages: [String],
  price: Number,
  isFree: Boolean,
  currency: String,
  license: String,
  customLicense: String,
  tags: [String],
  customTags: [String],
  visibility: String,
  allowTips: Boolean,
  allowCommissions: Boolean,
  externalLinks: String,
  notes: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorUsername: String,
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  status: { type: String, default: 'draft' },
  moderated: { type: Boolean, default: false },
  moderatedAt: Date,
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderationNotes: String
}, {
  timestamps: true
});

async function checkUploadedContent() {
  try {
    console.log('🔍 Verificando contenido subido en la base de datos...\n');

    // Conectar a la base de datos usando la misma configuración que la app
    const dbMode = process.env.DB_MODE || 'local';
    let mongoUri;

    if (dbMode === 'atlas') {
      mongoUri = 'mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99';
    } else {
      mongoUri = 'mongodb://localhost:27017/takopi_dev';
    }

    console.log(`📍 Conectando a MongoDB (modo: ${dbMode})`);
    console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@'));

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener los modelos
    const User = mongoose.model('User', userSchema);
    const Content = mongoose.model('Content', contentSchema);

    // Buscar todo el contenido
    const allContent = await Content.find({}).populate('author', 'username email').sort({ createdAt: -1 });

    console.log(`📊 Total de contenido encontrado: ${allContent.length}\n`);

    if (allContent.length === 0) {
      console.log('❌ No se encontró ningún contenido subido.');
      return;
    }

    // Mostrar cada contenido
    allContent.forEach((content, index) => {
      console.log(`📄 Contenido #${index + 1}:`);
      console.log(`   ID: ${content._id}`);
      console.log(`   Título: ${content.title}`);
      console.log(`   Tipo: ${content.contentType}`);
      console.log(`   Categoría: ${content.category}`);
      console.log(`   Precio: ${content.isFree ? 'Gratis' : `$${content.price} ${content.currency}`}`);
      console.log(`   Autor: ${content.authorUsername} (${content.author?.email || 'N/A'})`);
      console.log(`   Estado: ${content.status}`);
      console.log(`   Archivos: ${content.files ? content.files.length : 0} archivo(s)`);

      if (content.files && content.files.length > 0) {
        console.log(`   Detalles de archivos:`);
        content.files.forEach((file, fileIndex) => {
          console.log(`     ${fileIndex + 1}. ${file.name} (${file.originalName})`);
          console.log(`        Tipo: ${file.type}`);
          console.log(`        Tamaño: ${(file.size / 1024).toFixed(2)} KB`);
          console.log(`        URL: ${file.url}`);
        });
      }

      console.log(`   Tags: ${content.tags ? content.tags.join(', ') : 'N/A'}`);
      console.log(`   Creado: ${content.createdAt}`);
      console.log(`   Actualizado: ${content.updatedAt}`);
      console.log('   ' + '─'.repeat(50));
    });

    // Estadísticas
    const stats = {
      total: allContent.length,
      byType: {},
      byStatus: {},
      byAuthor: {}
    };

    allContent.forEach(content => {
      stats.byType[content.contentType] = (stats.byType[content.contentType] || 0) + 1;
      stats.byStatus[content.status] = (stats.byStatus[content.status] || 0) + 1;
      stats.byAuthor[content.authorUsername] = (stats.byAuthor[content.authorUsername] || 0) + 1;
    });

    console.log('\n📈 Estadísticas:');
    console.log('   Por tipo de contenido:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`     ${type}: ${count}`);
    });

    console.log('   Por estado:');
    Object.entries(stats.byStatus).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });

    console.log('   Por autor:');
    Object.entries(stats.byAuthor).forEach(([author, count]) => {
      console.log(`     ${author}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar la verificación
checkUploadedContent();
