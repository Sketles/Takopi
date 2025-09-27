#!/usr/bin/env node

/**
 * Script para debuggear la API directamente
 * Ejecutar con: node scripts/debug-api.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Script de Debug de API');
console.log('========================');

// Verificar si el archivo de la API existe
const apiFile = path.join(__dirname, '..', 'src', 'app', 'api', 'user', 'profile', 'route.ts');
console.log('📁 Verificando archivo API:', apiFile);

if (fs.existsSync(apiFile)) {
  console.log('✅ Archivo API existe');
  
  // Leer el contenido del archivo
  const content = fs.readFileSync(apiFile, 'utf8');
  
  // Verificar si contiene nuestros logs
  if (content.includes('🚀🚀🚀 API Profile - FUNCIÓN PUT INICIADA 🚀🚀🚀')) {
    console.log('✅ Logs de debug encontrados en el archivo');
  } else {
    console.log('❌ Logs de debug NO encontrados en el archivo');
  }
  
  // Verificar si contiene la función PUT
  if (content.includes('export async function PUT')) {
    console.log('✅ Función PUT encontrada');
  } else {
    console.log('❌ Función PUT NO encontrada');
  }
  
  // Verificar si contiene la actualización de location
  if (content.includes('updateData.location = location')) {
    console.log('✅ Actualización de location encontrada');
  } else {
    console.log('❌ Actualización de location NO encontrada');
  }
  
} else {
  console.log('❌ Archivo API NO existe');
}

console.log('');
console.log('🔧 Soluciones posibles:');
console.log('1. Reiniciar el servidor completamente');
console.log('2. Limpiar caché de Next.js: rm -rf .next');
console.log('3. Verificar que no hay errores de sintaxis');
console.log('4. Verificar que el archivo se está guardando correctamente');
