const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/upload/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar y reemplazar el bloque problemático
const oldCode = `    try {
      // 1. Subir archivos (Simulado por ahora, implementar lógica real de upload)
      // TODO: Implementar subida real a Vercel Blob o S3
      const uploadedFiles = files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        url: \`/uploads/\${f.name}\` // Placeholder URL
      }));

      // 2. Preparar payload
      const payload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        contentType: formData.contentType,
        category: formData.category || formData.contentType,
        price: formData.price,
        currency: 'CLP',
        isFree: formData.isFree,
        tags: formData.tags,
        license: formData.license,
        visibility: formData.visibility,
        coverImage: coverPreview || '/placeholder-cover.jpg',
        files: uploadedFiles,
        allowTips: false,
        allowCommissions: false
      };

      // 3. Obtener token de autenticación
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // 4. Llamar a la API
      const response = await fetch('/api/content', {`;

const newCode = `    try {
      // 1. Obtener token de autenticación
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // 2. Subir archivos a Vercel Blob
      const formDataToUpload = new FormData();
      
      // Agregar archivos principales
      files.forEach(file => {
        formDataToUpload.append('files', file);
      });
      
      // Agregar imagen de portada si existe
      if (coverImage) {
        formDataToUpload.append('coverImage', coverImage);
      }
      
      // Agregar tipo de contenido
      formDataToUpload.append('contentType', formData.contentType);
      
      // Subir archivos a Vercel Blob
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${token}\`
        },
        body: formDataToUpload
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir archivos');
      }
      
      console.log('✅ Archivos subidos a Vercel Blob:', uploadResult.data);
      
      // 3. Preparar payload con URLs reales de Vercel Blob
      const payload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        contentType: formData.contentType,
        category: formData.category || formData.contentType,
        price: formData.price,
        currency: 'CLP',
        isFree: formData.isFree,
        tags: formData.tags,
        license: formData.license,
        visibility: formData.visibility,
        coverImage: uploadResult.data.coverImage || coverPreview || '/placeholder-cover.jpg',
        files: uploadResult.data.files, // URLs reales de Vercel Blob con originalName
        allowTips: false,
        allowCommissions: false
      };

      // 4. Crear contenido en la base de datos
      const response = await fetch('/api/content', {`;

// Hacer el reemplazo
if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Archivo actualizado correctamente');
} else {
    console.error('❌ No se encontró el código a reemplazar');
    process.exit(1);
}
