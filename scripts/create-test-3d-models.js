const fs = require('fs');
const path = require('path');

// Función para crear un modelo GLB simple (cubo)
function createSimpleGLB() {
  // Este es un GLB muy simple (solo un cubo básico)
  // En producción, usarías herramientas como Blender para crear modelos reales
  const glbData = Buffer.from([
    // GLB Header (12 bytes)
    0x67, 0x6C, 0x54, 0x46, // "glTF"
    0x02, 0x00, 0x00, 0x00, // Version 2
    0x00, 0x00, 0x00, 0x00, // Total length (se calculará)

    // JSON Chunk Header (8 bytes)
    0x00, 0x00, 0x00, 0x00, // Chunk length
    0x4E, 0x4F, 0x53, 0x4A, // "JSON"

    // JSON Content (minimal glTF)
    0x7B, 0x22, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22, 0x3A, 0x7B, 0x22, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x22, 0x3A, 0x22, 0x32, 0x2E, 0x30, 0x22, 0x7D, 0x7D,
    // {"asset":{"version":"2.0"}}

    // Binary Chunk Header (8 bytes)
    0x00, 0x00, 0x00, 0x00, // Chunk length
    0x00, 0x00, 0x00, 0x00  // "BIN\0"
  ]);

  return glbData;
}

// Función para crear un archivo GLB más realista (usando datos de ejemplo)
function createRealisticGLB() {
  // Este es un GLB más realista con geometría de cubo
  const jsonData = {
    "asset": {
      "version": "2.0",
      "generator": "Takopi Test Generator"
    },
    "scene": 0,
    "scenes": [{
      "nodes": [0]
    }],
    "nodes": [{
      "mesh": 0
    }],
    "meshes": [{
      "primitives": [{
        "attributes": {
          "POSITION": 0
        },
        "indices": 1
      }]
    }],
    "buffers": [{
      "byteLength": 192
    }],
    "bufferViews": [{
      "buffer": 0,
      "byteOffset": 0,
      "byteLength": 96
    }, {
      "buffer": 0,
      "byteOffset": 96,
      "byteLength": 96
    }],
    "accessors": [{
      "bufferView": 0,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 24,
      "type": "VEC3"
    }, {
      "bufferView": 1,
      "byteOffset": 0,
      "componentType": 5123,
      "count": 36,
      "type": "SCALAR"
    }]
  };

  const jsonString = JSON.stringify(jsonData);
  const jsonBuffer = Buffer.from(jsonString, 'utf8');

  // Padding para alineación de 4 bytes
  const padding = (4 - (jsonBuffer.length % 4)) % 4;
  const paddedJsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(padding)]);

  // Datos binarios (vértices y índices de un cubo)
  const binaryData = Buffer.from([
    // Vértices del cubo (8 vértices * 3 componentes * 4 bytes = 96 bytes)
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,  // Cara frontal
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,      // Cara trasera

    // Índices del cubo (12 triángulos * 3 índices * 2 bytes = 72 bytes)
    0, 1, 2, 2, 3, 0,  // Cara frontal
    4, 7, 6, 6, 5, 4,  // Cara trasera
    0, 4, 5, 5, 1, 0,  // Cara izquierda
    2, 6, 7, 7, 3, 2,  // Cara derecha
    0, 3, 7, 7, 4, 0,  // Cara superior
    1, 5, 6, 6, 2, 1   // Cara inferior
  ]);

  // Crear GLB
  const totalLength = 12 + 8 + paddedJsonBuffer.length + 8 + binaryData.length;

  const glbBuffer = Buffer.alloc(totalLength);
  let offset = 0;

  // Header GLB
  glbBuffer.writeUInt32LE(0x46546C67, offset); offset += 4; // "glTF"
  glbBuffer.writeUInt32LE(2, offset); offset += 4; // Version
  glbBuffer.writeUInt32LE(totalLength, offset); offset += 4; // Total length

  // JSON Chunk
  glbBuffer.writeUInt32LE(paddedJsonBuffer.length, offset); offset += 4; // Chunk length
  glbBuffer.write('JSON', offset); offset += 4; // Chunk type
  paddedJsonBuffer.copy(glbBuffer, offset); offset += paddedJsonBuffer.length;

  // Binary Chunk
  glbBuffer.writeUInt32LE(binaryData.length, offset); offset += 4; // Chunk length
  glbBuffer.write('BIN\0', offset); offset += 4; // Chunk type
  binaryData.copy(glbBuffer, offset);

  return glbBuffer;
}

async function createTestModels() {
  try {
    console.log('🎨 Creando modelos 3D de prueba...\n');

    const modelsDir = path.join(process.cwd(), 'public', 'models');

    // Crear directorio si no existe
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Crear modelos de prueba
    const models = [
      { name: 'cubo-simple.glb', data: createSimpleGLB() },
      { name: 'cubo-realista.glb', data: createRealisticGLB() },
      { name: 'robot-basico.glb', data: createRealisticGLB() },
      { name: 'personaje-tpose.glb', data: createRealisticGLB() }
    ];

    for (const model of models) {
      const filePath = path.join(modelsDir, model.name);
      fs.writeFileSync(filePath, model.data);
      console.log(`✅ Creado: ${model.name} (${model.data.length} bytes)`);
    }

    // Crear archivos de entorno (opcionales)
    console.log('\n🌍 Creando archivos de entorno...');

    // Crear un archivo HDR simple (placeholder)
    const hdrContent = `#?RADIANCE
FORMAT=32-bit_rle_rgbe
EXPOSURE=1.0

-Y 1 +X 1
R255G255B255`;

    fs.writeFileSync(path.join(modelsDir, 'environment.hdr'), hdrContent);
    fs.writeFileSync(path.join(modelsDir, 'skybox.hdr'), hdrContent);

    console.log('✅ Creados archivos de entorno (environment.hdr, skybox.hdr)');

    console.log('\n🎉 ¡Modelos 3D de prueba creados exitosamente!');
    console.log('📁 Ubicación: public/models/');
    console.log('🚀 Los modelos están listos para usar con Model Viewer');

  } catch (error) {
    console.error('❌ Error creando modelos 3D:', error);
  }
}

createTestModels();
