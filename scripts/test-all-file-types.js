const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Probando todos los tipos de archivo...\n');

// Función para detectar tipo MIME (igual que en el frontend)
function detectMimeType(fileName, originalType = '') {
  let mimeType = originalType;

  if (!mimeType || mimeType === '') {
    const extension = fileName.toLowerCase().split('.').pop();

    const mimeTypes = {
      // === MODELOS 3D ===
      'blend': 'application/x-blender',
      'fbx': 'application/octet-stream',
      'obj': 'application/octet-stream',
      'dae': 'application/octet-stream',
      '3ds': 'application/octet-stream',
      'max': 'application/octet-stream',
      'ma': 'application/octet-stream',
      'mb': 'application/octet-stream',
      'gltf': 'model/gltf+json',
      'glb': 'model/gltf-binary',
      'usd': 'model/vnd.usd+zip',
      'usda': 'model/vnd.usd+ascii',
      'usdc': 'model/vnd.usd+zip',
      'ply': 'application/octet-stream',
      'stl': 'application/octet-stream',
      'x3d': 'model/x3d+xml',
      'collada': 'model/vnd.collada+xml',

      // === TEXTURAS ===
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'tga': 'image/x-tga',
      'exr': 'image/x-exr',
      'hdr': 'image/vnd.radiance',
      'psd': 'image/vnd.adobe.photoshop',
      'ai': 'application/postscript',
      'svg': 'image/svg+xml',

      // === MÚSICA ===
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'aac': 'audio/aac',
      'm4a': 'audio/mp4',
      'wma': 'audio/x-ms-wma',
      'mid': 'audio/midi',
      'midi': 'audio/midi',

      // === AVATARES ===
      'vrl': 'application/x-vrml',
      'vrm': 'model/gltf-binary',
      'avatar': 'application/octet-stream',

      // === ANIMACIONES ===
      'bvh': 'application/octet-stream',
      'c4d': 'application/octet-stream',
      'motion': 'application/octet-stream',

      // === OBS WIDGETS ===
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'lua': 'text/x-lua',
      'py': 'text/x-python',
      'widget': 'application/octet-stream',
      'obs': 'application/octet-stream',

      // === COLECCIONES ===
      'zip': 'application/zip',
      'rar': 'application/vnd.rar',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      'collection': 'application/octet-stream',
      'pack': 'application/octet-stream',

      // === VIDEOS ===
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'mkv': 'video/x-matroska',
      'webm': 'video/webm',
      'flv': 'video/x-flv',
      'wmv': 'video/x-ms-wmv',
      'm4v': 'video/x-m4v',
      '3gp': 'video/3gpp',
      'ogv': 'video/ogg',

      // === DOCUMENTOS ===
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      'md': 'text/markdown'
    };

    mimeType = mimeTypes[extension || ''] || 'application/octet-stream';
  }

  return mimeType;
}

async function testAllFileTypes() {
  try {
    // Conectar a MongoDB
    console.log('📍 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/takopi_dev');
    console.log('✅ Conectado a MongoDB\n');

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

    // Lista de archivos de prueba por categoría
    const testFiles = [
      // MODELOS 3D
      { name: 'modelo.blend', contentType: 'models', category: 'characters' },
      { name: 'modelo.fbx', contentType: 'models', category: 'characters' },
      { name: 'modelo.obj', contentType: 'models', category: 'characters' },
      { name: 'modelo.gltf', contentType: 'models', category: 'characters' },
      { name: 'modelo.glb', contentType: 'models', category: 'characters' },

      // TEXTURAS
      { name: 'textura.png', contentType: 'textures', category: 'materials' },
      { name: 'textura.jpg', contentType: 'textures', category: 'materials' },
      { name: 'textura.exr', contentType: 'textures', category: 'materials' },
      { name: 'textura.hdr', contentType: 'textures', category: 'materials' },

      // MÚSICA
      { name: 'cancion.mp3', contentType: 'music', category: 'ambient' },
      { name: 'cancion.wav', contentType: 'music', category: 'ambient' },
      { name: 'cancion.flac', contentType: 'music', category: 'ambient' },

      // AVATARES
      { name: 'avatar.vrm', contentType: 'avatars', category: 'anime' },
      { name: 'avatar.fbx', contentType: 'avatars', category: 'anime' },

      // ANIMACIONES
      { name: 'animacion.bvh', contentType: 'animations', category: 'character' },
      { name: 'animacion.fbx', contentType: 'animations', category: 'character' },

      // OBS WIDGETS
      { name: 'widget.html', contentType: 'obs', category: 'overlays' },
      { name: 'widget.css', contentType: 'obs', category: 'overlays' },
      { name: 'widget.js', contentType: 'obs', category: 'overlays' },

      // COLECCIONES
      { name: 'pack.zip', contentType: 'collections', category: 'mixed' },
      { name: 'pack.rar', contentType: 'collections', category: 'mixed' }
    ];

    console.log('🧪 Probando detección de tipos MIME...\n');

    let successCount = 0;
    let totalCount = testFiles.length;

    for (const testFile of testFiles) {
      const detectedType = detectMimeType(testFile.name, '');
      console.log(`📁 ${testFile.name.padEnd(20)} → ${detectedType.padEnd(30)} [${testFile.contentType}]`);

      // Crear documento de prueba
      const testContent = new Content({
        title: `Test ${testFile.name}`,
        description: `Descripción de prueba para ${testFile.name}`,
        contentType: testFile.contentType,
        category: testFile.category,
        files: [{
          name: testFile.name,
          originalName: testFile.name,
          size: 1024000,
          type: detectedType,
          url: `/uploads/${testFile.name}`
        }],
        price: 1000,
        isFree: false,
        currency: 'CLP',
        license: 'personal',
        tags: ['test', testFile.contentType],
        customTags: ['test'],
        visibility: 'public',
        allowTips: false,
        allowCommissions: false,
        author: new mongoose.Types.ObjectId(),
        authorUsername: 'testuser',
        status: 'published'
      });

      try {
        await testContent.save();
        console.log(`✅ ${testFile.name} - Guardado exitosamente`);
        successCount++;

        // Limpiar
        await Content.deleteOne({ _id: testContent._id });
      } catch (error) {
        console.log(`❌ ${testFile.name} - Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Resultados:`);
    console.log(`✅ Exitosos: ${successCount}/${totalCount}`);
    console.log(`❌ Fallidos: ${totalCount - successCount}/${totalCount}`);

    if (successCount === totalCount) {
      console.log('\n🎉 ¡Todos los tipos de archivo funcionan correctamente!');
    } else {
      console.log('\n⚠️  Algunos tipos de archivo necesitan revisión.');
    }

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

testAllFileTypes();
