#!/usr/bin/env node

/**
 * Script para verificar la configuración de variables de entorno
 * Ejecutar con: node scripts/verify-env.js
 */

console.log('🔍 Verificando configuración de variables de entorno...\n');

// Verificar variables de entorno
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const transbankVars = [
  'TBK_COMMERCE_CODE',
  'TBK_API_KEY'
];

const optionalVars = [
  'TBK_COMMERCE_CODE_PROD',
  'TBK_API_KEY_PROD',
  'APP_BASE_URL'
];

console.log('📋 Variables Requeridas:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 20 ? value.slice(0, 20) + '...' : value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
  }
});

console.log('\n🔒 Variables de Transbank:');
transbankVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.slice(0, 4)}***`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
  }
});

console.log('\n⚙️ Variables Opcionales:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? value.slice(0, 4) + '***' : value}`);
  } else {
    console.log(`ℹ️ ${varName}: No configurada (opcional)`);
  }
});

console.log('\n🌍 Ambiente:');
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

console.log('\n📊 Resumen:');
const missingRequired = requiredVars.filter(varName => !process.env[varName]);
const missingTransbank = transbankVars.filter(varName => !process.env[varName]);

if (missingRequired.length === 0 && missingTransbank.length === 0) {
  console.log('🎉 ¡Todas las variables requeridas están configuradas!');
} else {
  console.log('⚠️ Variables faltantes:');
  missingRequired.forEach(varName => console.log(`   ❌ ${varName}`));
  missingTransbank.forEach(varName => console.log(`   ❌ ${varName}`));
}

console.log('\n💡 Para configurar variables faltantes:');
console.log('   1. Edita tu archivo .env.local');
console.log('   2. Agrega las variables que faltan');
console.log('   3. Reinicia el servidor de desarrollo');
