const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const FormData = require('form-data');

async function testRealFileUpload() {
  try {
    console.log('🧪 Probando subida real de archivos...\n');

    // Primero necesitamos obtener un token válido
    console.log('1️⃣ Obteniendo token de autenticación...');

    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    // Crear un archivo de prueba
    console.log('\n2️⃣ Creando archivo de prueba...');
    const testImagePath = 'public/uploads/test-image.jpg';

    // Crear un archivo de imagen simple (1x1 pixel rojo en base64)
    const redPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(redPixelBase64, 'base64');
    fs.writeFileSync(testImagePath, imageBuffer);
    console.log('✅ Archivo de prueba creado:', testImagePath);

    // Probar subida de archivo
    console.log('\n3️⃣ Probando subida de archivo...');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
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

    if (uploadResponse.ok) {
      console.log('✅ Archivo subido exitosamente');
      console.log('📁 Datos del archivo:', uploadResult.data);

      // Verificar que el archivo existe físicamente
      const uploadedFilePath = `public${uploadResult.data.url}`;
      if (fs.existsSync(uploadedFilePath)) {
        console.log('✅ Archivo existe físicamente en:', uploadedFilePath);

        // Probar acceso directo
        const directAccessResponse = await fetch(`http://localhost:3000${uploadResult.data.url}`);
        if (directAccessResponse.ok) {
          console.log('✅ Archivo accesible directamente via URL');
        } else {
          console.log('❌ Archivo no accesible directamente');
        }
      } else {
        console.log('❌ Archivo no existe físicamente');
      }
    } else {
      console.log('❌ Error al subir archivo:', uploadResult.error);
    }

    // Limpiar archivo de prueba
    console.log('\n4️⃣ Limpiando archivo de prueba...');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('✅ Archivo de prueba eliminado');
    }

    console.log('\n🎉 ¡Prueba completada!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testRealFileUpload();
