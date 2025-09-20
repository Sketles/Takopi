const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const FormData = require('form-data');

async function debugUploadProcess() {
  try {
    console.log('🔍 Diagnosticando proceso de subida...\n');

    // 1. Verificar directorio de uploads
    console.log('1️⃣ Verificando directorio de uploads...');
    const uploadsDir = 'public/uploads';
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Directorio public/uploads no existe');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    console.log(`✅ Directorio existe con ${files.length} archivos:`);
    files.forEach(file => console.log(`   - ${file}`));

    // 2. Verificar que el servidor esté corriendo
    console.log('\n2️⃣ Verificando servidor...');
    try {
      const response = await fetch('http://localhost:3000/api/content/explore');
      if (response.ok) {
        console.log('✅ Servidor corriendo');
      } else {
        console.log('❌ Servidor no responde correctamente');
        return;
      }
    } catch (error) {
      console.log('❌ Servidor no disponible:', error.message);
      return;
    }

    // 3. Obtener token de autenticación
    console.log('\n3️⃣ Obteniendo token...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sushipan@takopi.cl',
        password: 'test12345'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.token) {
      console.log('❌ Error al obtener token:', loginData);
      return;
    }
    console.log('✅ Token obtenido');

    // 4. Crear archivo de prueba
    console.log('\n4️⃣ Creando archivo de prueba...');
    const testFileName = 'debug-test-image.png';
    const testFilePath = `${uploadsDir}/${testFileName}`;
    
    // Crear un PNG simple (1x1 pixel transparente)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, // bit depth, color type, etc.
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, // compressed data
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, // checksum
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, // IEND chunk
      0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testFilePath, pngData);
    console.log(`✅ Archivo de prueba creado: ${testFilePath}`);

    // 5. Probar subida via API
    console.log('\n5️⃣ Probando subida via API...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: testFileName,
      contentType: 'image/png'
    });

    const uploadResponse = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const uploadResult = await uploadResponse.json();
    console.log('📊 Respuesta de upload:', uploadResult);

    if (uploadResponse.ok) {
      console.log('✅ Upload exitoso');
      
      // 6. Verificar que el archivo se creó
      const uploadedFilePath = `public${uploadResult.data.url}`;
      if (fs.existsSync(uploadedFilePath)) {
        console.log(`✅ Archivo subido existe: ${uploadedFilePath}`);
        
        // 7. Probar acceso directo
        const directResponse = await fetch(`http://localhost:3000${uploadResult.data.url}`);
        if (directResponse.ok) {
          console.log('✅ Archivo accesible directamente');
        } else {
          console.log('❌ Archivo no accesible directamente');
        }
      } else {
        console.log('❌ Archivo subido no existe físicamente');
      }
    } else {
      console.log('❌ Error en upload:', uploadResult);
    }

    // 8. Limpiar archivos de prueba
    console.log('\n8️⃣ Limpiando archivos de prueba...');
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('✅ Archivo de prueba eliminado');
    }

    console.log('\n🎯 Diagnóstico completado');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

debugUploadProcess();
