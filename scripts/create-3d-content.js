const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function create3DContent() {
  try {
    console.log('🎨 Creando contenido 3D de prueba...\n');

    // Conectar a MongoDB local
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev';
    console.log('🔗 Conectando a MongoDB local...');

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB local');

    // Definir esquema de Content (usando el esquema correcto)
    const ContentFileSchema = new mongoose.Schema({
      name: String,
      originalName: String,
      size: Number,
      type: String,
      url: String,
      previewUrl: String
    });

    const ContentSchema = new mongoose.Schema({
      title: String,
      provisionalName: String,
      description: String,
      shortDescription: String,
      contentType: String,
      category: String,
      subcategory: String,
      files: [ContentFileSchema],
      coverImage: String,
      additionalImages: [String],
      notes: String,
      externalLinks: String,
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
      author: mongoose.Schema.Types.ObjectId,
      authorUsername: String,
      status: String,
      likes: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    });

    const Content = mongoose.model('Content', ContentSchema);

    // Obtener un usuario para asignar como autor
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      role: String
    }));

    const user = await User.findOne({});
    if (!user) {
      console.log('❌ No se encontró ningún usuario en la base de datos');
      return;
    }

    console.log(`👤 Usando usuario: ${user.username}`);

    // Crear contenido 3D de prueba
    const contentData = [
      {
        title: "Robot Futurista Pro",
        provisionalName: "Robot Futurista Pro",
        description: "Un robot futurista completamente modelado en 3D, perfecto para juegos de ciencia ficción. Incluye animaciones de T-Pose y texturas de alta calidad.",
        shortDescription: "Robot futurista para juegos de ciencia ficción",
        contentType: "models",
        category: "Personajes",
        subcategory: "Robots",
        files: [{
          name: "robot-futurista.glb",
          originalName: "robot-futurista.glb",
          size: 2048000,
          type: "model/gltf-binary",
          url: "/models/robot-basico.glb",
          previewUrl: "/models/robot-basico.glb"
        }],
        price: 15990,
        isFree: false,
        currency: "CLP",
        license: "commercial",
        tags: ["robot", "futurista", "3d", "personaje", "juego"],
        visibility: "public",
        allowTips: true,
        allowCommissions: false,
        author: user._id,
        authorUsername: user.username,
        status: "published",
        likes: Math.floor(Math.random() * 100),
        downloads: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 200)
      },
      {
        title: "Personaje en T-Pose",
        provisionalName: "Personaje en T-Pose",
        description: "Modelo de personaje humano en posición T-Pose, ideal para animaciones y rigging. Compatible con la mayoría de software 3D.",
        shortDescription: "Personaje humano en T-Pose para animaciones",
        contentType: "models",
        category: "Personajes",
        subcategory: "Humanos",
        files: [{
          name: "personaje-tpose.glb",
          originalName: "personaje-tpose.glb",
          size: 1536000,
          type: "model/gltf-binary",
          url: "/models/personaje-tpose.glb",
          previewUrl: "/models/personaje-tpose.glb"
        }],
        price: 0,
        isFree: true,
        currency: "CLP",
        license: "personal",
        tags: ["personaje", "tpose", "humano", "animacion", "rigging"],
        visibility: "public",
        allowTips: true,
        allowCommissions: false,
        author: user._id,
        authorUsername: user.username,
        status: "published",
        likes: Math.floor(Math.random() * 150),
        downloads: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 300)
      },
      {
        title: "Cubo Realista Premium",
        provisionalName: "Cubo Realista Premium",
        description: "Un cubo 3D de alta calidad con texturas realistas y materiales avanzados. Perfecto para demostraciones y prototipos.",
        shortDescription: "Cubo 3D con texturas realistas",
        contentType: "models",
        category: "Objetos",
        subcategory: "Geometría",
        files: [{
          name: "cubo-realista.glb",
          originalName: "cubo-realista.glb",
          size: 512000,
          type: "model/gltf-binary",
          url: "/models/cubo-realista.glb",
          previewUrl: "/models/cubo-realista.glb"
        }],
        price: 2990,
        isFree: false,
        currency: "CLP",
        license: "commercial",
        tags: ["cubo", "geometria", "realista", "texturas", "materiales"],
        visibility: "public",
        allowTips: false,
        allowCommissions: false,
        author: user._id,
        authorUsername: user.username,
        status: "published",
        likes: Math.floor(Math.random() * 80),
        downloads: Math.floor(Math.random() * 30),
        views: Math.floor(Math.random() * 150)
      }
    ];

    // Crear el contenido
    for (const data of contentData) {
      const content = new Content(data);
      await content.save();
      console.log(`✅ Creado: ${data.title}`);
    }

    console.log('\n🎉 ¡Contenido 3D de prueba creado exitosamente!');
    console.log('📊 Total de modelos 3D creados:', contentData.length);

    // Verificar el contenido creado
    const totalContent = await Content.find({ contentType: 'models' });
    console.log(`📁 Total de modelos 3D en la base de datos: ${totalContent.length}`);

  } catch (error) {
    console.error('❌ Error creando contenido 3D:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

create3DContent();
