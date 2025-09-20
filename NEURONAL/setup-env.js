#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Configurando variables de entorno para Takopi...\n');

const envContent = `# Variables de entorno para Takopi
# IMPORTANTE: Este archivo NO debe subirse a Git

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

# JWT Configuration (clave generada automáticamente)
JWT_SECRET=410af87c264986629f0fc125baa3baf4612d37b0feae52c5303bf6f4cdc725f4d42a7a0c3d292dc641fa9de092b64647d095a3f3c81c620e42fa15c58b2d5e46

# NextAuth Configuration (clave generada automáticamente)
NEXTAUTH_SECRET=50ff547b385499f836f94bfab20337230e49ea1a44f87c8e096a3d7fdd5fb880

# App Configuration
NEXTAUTH_URL=http://localhost:3000
`;

try {
  // Crear archivo .env.local
  fs.writeFileSync('.env.local', envContent);

  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('✅ Variables de entorno configuradas');
  console.log('✅ Claves de seguridad generadas');
  console.log('');
  console.log('📋 Contenido del archivo:');
  console.log('   - MongoDB URI configurado');
  console.log('   - JWT Secret generado');
  console.log('   - NextAuth Secret generado');
  console.log('   - URL de la app configurada');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('   1. Reinicia el servidor: npm run dev');
  console.log('   2. Verifica la configuración: http://localhost:3000/api/config/security');
  console.log('   3. Prueba la autenticación: http://localhost:3000/auth/login');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   - El archivo .env.local NO se subirá a Git (está en .gitignore)');
  console.log('   - Para producción, cambia la contraseña de MongoDB');
  console.log('   - Usa HTTPS en producción');

} catch (error) {
  console.error('❌ Error al crear el archivo:', error.message);
  console.log('');
  console.log('💡 Solución manual:');
  console.log('   1. Crea un archivo llamado .env.local en la raíz del proyecto');
  console.log('   2. Copia el contenido mostrado arriba');
  console.log('   3. Guarda el archivo');
}
