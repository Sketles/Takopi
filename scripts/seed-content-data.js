const mongoose = require('mongoose');
const path = require('path');

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/takopi_dev');
    console.log('✅ Conectado a MongoDB local');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Definir esquemas directamente
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

// Datos de ejemplo para publicaciones
const sampleContent = [
  {
    title: 'Pack de Texturas Medievales',
    description: 'Colección completa de texturas medievales en alta resolución para tus proyectos de juegos. Incluye piedra, madera, metal y telas con mapas normales y especulares.',
    contentType: 'textures',
    category: 'Texturas',
    subcategory: 'Medieval',
    files: [
      {
        name: 'medieval_stone_01.jpg',
        originalName: 'medieval_stone_01.jpg',
        size: 2048576,
        type: 'image/jpeg',
        url: '/uploads/medieval_stone_01.jpg'
      }
    ],
    price: 12990,
    isFree: false,
    currency: 'CLP',
    license: 'commercial',
    tags: ['medieval', 'textura', 'piedra', 'alta-resolución', 'game-asset'],
    customTags: ['medieval-pack', 'stone-texture'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: false,
    authorUsername: 'creator',
    status: 'published'
  },
  {
    title: 'Modelo 3D de Espada Épica',
    description: 'Espada medieval detallada lista para usar en Unity o Unreal Engine. Incluye texturas PBR y múltiples niveles de detalle.',
    contentType: 'models',
    category: 'Modelos 3D',
    subcategory: 'Armas',
    files: [
      {
        name: 'epic_sword.fbx',
        originalName: 'epic_sword.fbx',
        size: 5242880,
        type: 'application/octet-stream',
        url: '/uploads/epic_sword.fbx'
      }
    ],
    price: 25990,
    isFree: false,
    currency: 'CLP',
    license: 'commercial',
    tags: ['espada', 'medieval', 'arma', '3d', 'unity', 'unreal'],
    customTags: ['weapon', 'sword', 'game-ready'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: true,
    authorUsername: 'creator',
    status: 'published'
  },
  {
    title: 'Loop Musical Chill',
    description: 'Música relajante perfecta para streams, videos o juegos indie. Loop de 2 minutos con variaciones.',
    contentType: 'music',
    category: 'Música',
    subcategory: 'Ambiental',
    files: [
      {
        name: 'chill_loop.mp3',
        originalName: 'chill_loop.mp3',
        size: 3145728,
        type: 'audio/mpeg',
        url: '/uploads/chill_loop.mp3'
      }
    ],
    price: 0,
    isFree: true,
    currency: 'CLP',
    license: 'royalty-free',
    tags: ['música', 'chill', 'loop', 'ambiental', 'relajante'],
    customTags: ['background-music', 'streaming'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: false,
    authorUsername: 'testuser',
    status: 'published'
  },
  {
    title: 'Avatar VTuber Kawaii',
    description: 'Avatar femenino estilo anime perfecto para VTubers. Incluye expresiones faciales y animaciones básicas.',
    contentType: 'avatars',
    category: 'Avatares',
    subcategory: 'VTuber',
    files: [
      {
        name: 'kawaii_vtuber.vrm',
        originalName: 'kawaii_vtuber.vrm',
        size: 15728640,
        type: 'application/octet-stream',
        url: '/uploads/kawaii_vtuber.vrm'
      }
    ],
    price: 49990,
    isFree: false,
    currency: 'CLP',
    license: 'personal',
    tags: ['avatar', 'vtuber', 'anime', 'kawaii', 'femenino'],
    customTags: ['live2d', 'streaming', 'virtual-youtuber'],
    visibility: 'public',
    allowTips: false,
    allowCommissions: true,
    authorUsername: 'creator',
    status: 'published'
  },
  {
    title: 'Overlay Stream Gaming',
    description: 'Pack completo de overlays para streaming de videojuegos. Incluye alertas, webcam frame y widgets.',
    contentType: 'obs',
    category: 'OBS Widgets',
    subcategory: 'Gaming',
    files: [
      {
        name: 'gaming_overlay_pack.zip',
        originalName: 'gaming_overlay_pack.zip',
        size: 8388608,
        type: 'application/zip',
        url: '/uploads/gaming_overlay_pack.zip'
      }
    ],
    price: 19990,
    isFree: false,
    currency: 'CLP',
    license: 'commercial',
    tags: ['obs', 'overlay', 'streaming', 'gaming', 'widgets'],
    customTags: ['streaming-tools', 'broadcast'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: false,
    authorUsername: 'testuser',
    status: 'published'
  },
  {
    title: 'Animación de Baile Viral',
    description: 'Animación de baile popular perfecta para TikTok, Instagram Reels o contenido de redes sociales.',
    contentType: 'animations',
    category: 'Animaciones',
    subcategory: 'Baile',
    files: [
      {
        name: 'viral_dance.mp4',
        originalName: 'viral_dance.mp4',
        size: 25165824,
        type: 'video/mp4',
        url: '/uploads/viral_dance.mp4'
      }
    ],
    price: 39990,
    isFree: false,
    currency: 'CLP',
    license: 'commercial',
    tags: ['animación', 'baile', 'viral', 'tiktok', 'redes-sociales'],
    customTags: ['dance', 'social-media', 'trending'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: true,
    authorUsername: 'creator',
    status: 'published'
  },
  {
    title: 'Pack Completo Fantasy RPG',
    description: 'Colección masiva de assets para juegos de rol fantásticos. Incluye modelos 3D, texturas, sonidos y efectos.',
    contentType: 'collections',
    category: 'Colecciones',
    subcategory: 'RPG',
    files: [
      {
        name: 'fantasy_rpg_pack.zip',
        originalName: 'fantasy_rpg_pack.zip',
        size: 104857600,
        type: 'application/zip',
        url: '/uploads/fantasy_rpg_pack.zip'
      }
    ],
    price: 99990,
    isFree: false,
    currency: 'CLP',
    license: 'commercial',
    tags: ['rpg', 'fantasía', 'pack', 'colección', 'assets'],
    customTags: ['game-assets', 'fantasy', 'complete-pack'],
    visibility: 'public',
    allowTips: true,
    allowCommissions: false,
    authorUsername: 'creator',
    status: 'published'
  },
  {
    title: 'Texturas Sci-Fi Futuristas',
    description: 'Set de texturas futuristas para proyectos de ciencia ficción. Metal, cristal y energía en alta definición.',
    contentType: 'textures',
    category: 'Texturas',
    subcategory: 'Sci-Fi',
    files: [
      {
        name: 'scifi_metal_01.jpg',
        originalName: 'scifi_metal_01.jpg',
        size: 4194304,
        type: 'image/jpeg',
        url: '/uploads/scifi_metal_01.jpg'
      }
    ],
    price: 0,
    isFree: true,
    currency: 'CLP',
    license: 'royalty-free',
    tags: ['sci-fi', 'futurista', 'metal', 'cristal', 'textura'],
    customTags: ['futuristic', 'space', 'technology'],
    visibility: 'public',
    allowTips: false,
    allowCommissions: false,
    authorUsername: 'testuser',
    status: 'published'
  }
];

async function seedContent() {
  try {
    console.log('🌱 Iniciando seed de contenido...');

    // Buscar usuarios existentes
    const users = await User.find({});
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos. Ejecuta primero seed:local');
      process.exit(1);
    }

    // Limpiar contenido existente
    await Content.deleteMany({});
    console.log('🗑️ Contenido anterior eliminado');

    // Asignar usuarios a las publicaciones
    const userMap = {
      'testuser': users.find(u => u.username === 'testuser'),
      'creator': users.find(u => u.username === 'creator'),
      'admin': users.find(u => u.username === 'admin')
    };

    // Crear publicaciones
    const createdContent = [];
    for (const contentData of sampleContent) {
      const user = userMap[contentData.authorUsername];
      if (!user) {
        console.log(`⚠️ Usuario ${contentData.authorUsername} no encontrado, saltando...`);
        continue;
      }

      const content = new Content({
        ...contentData,
        author: user._id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 1000),
        downloads: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 50),
        favorites: Math.floor(Math.random() * 20)
      });

      await content.save();
      createdContent.push(content);
      console.log(`✅ Creado: ${content.title}`);
    }

    console.log(`🎉 ¡Seed completado! Se crearon ${createdContent.length} publicaciones`);
    console.log('\n📊 Resumen:');
    console.log(`- Modelos 3D: ${createdContent.filter(c => c.contentType === 'models').length}`);
    console.log(`- Texturas: ${createdContent.filter(c => c.contentType === 'textures').length}`);
    console.log(`- Música: ${createdContent.filter(c => c.contentType === 'music').length}`);
    console.log(`- Avatares: ${createdContent.filter(c => c.contentType === 'avatars').length}`);
    console.log(`- Animaciones: ${createdContent.filter(c => c.contentType === 'animations').length}`);
    console.log(`- OBS Widgets: ${createdContent.filter(c => c.contentType === 'obs').length}`);
    console.log(`- Colecciones: ${createdContent.filter(c => c.contentType === 'collections').length}`);

  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectDB().then(seedContent);
}

module.exports = { seedContent };
