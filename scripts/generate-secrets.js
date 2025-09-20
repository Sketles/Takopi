#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generador de Claves Seguras para Takopi\n');

// Generar JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('');

// Generar NextAuth Secret
const nextAuthSecret = crypto.randomBytes(32).toString('hex');
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log('');

// Generar una contraseña segura para MongoDB
const mongoPassword = crypto.randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
console.log('NUEVA_PASSWORD_MONGODB:');
console.log(mongoPassword);
console.log('');

console.log('📋 Para usar estas claves:');
console.log('1. Crea un archivo .env.local en la raíz del proyecto');
console.log('2. Copia las claves generadas arriba');
console.log('3. Reemplaza en tu archivo .env.local:');
console.log('');
console.log('MONGODB_URI=mongodb+srv://takopi_app:TU_NUEVA_PASSWORD@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99');
console.log('JWT_SECRET=' + jwtSecret);
console.log('NEXTAUTH_SECRET=' + nextAuthSecret);
console.log('');
console.log('⚠️  IMPORTANTE: Nunca subas el archivo .env.local a Git!');
console.log('✅ El archivo .env.template se puede subir como ejemplo');
