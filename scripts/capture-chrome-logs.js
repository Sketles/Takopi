#!/usr/bin/env node

/**
 * Script para capturar logs de Chrome de manera más sencilla
 * Ejecutar con: node scripts/capture-chrome-logs.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Capturando logs de Chrome...');
console.log('📝 Instrucciones:');
console.log('1. Abre Chrome');
console.log('2. Ve a la página que quieres debuggear');
console.log('3. Abre DevTools (F12)');
console.log('4. Ve a la pestaña Console');
console.log('5. Ejecuta el comando: copy(console._commandLineAPI._console._messages)');
console.log('6. Pega el contenido aquí y presiona Ctrl+C para salir');
console.log('');
console.log('💡 Alternativamente, puedes usar:');
console.log('   - Right-click en cualquier log → "Save as..."');
console.log('   - O usar la función "Copy all" en el menú contextual');
console.log('');
console.log('🚀 El script está listo para capturar logs...');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Función para guardar logs
function saveLogs(logData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(logsDir, `chrome-logs-${timestamp}.json`);
  
  try {
    fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
    console.log(`✅ Logs guardados en: ${filename}`);
  } catch (error) {
    console.error('❌ Error al guardar logs:', error.message);
  }
}

// Capturar entrada del usuario
process.stdin.setEncoding('utf8');
let inputData = '';

console.log('📋 Pega los logs aquí (Ctrl+C para salir):');

process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  if (inputData.trim()) {
    try {
      const logs = JSON.parse(inputData);
      saveLogs(logs);
    } catch (error) {
      // Si no es JSON válido, guardar como texto
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = path.join(logsDir, `chrome-logs-${timestamp}.txt`);
      fs.writeFileSync(filename, inputData);
      console.log(`✅ Logs guardados como texto en: ${filename}`);
    }
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Saliendo...');
  process.exit(0);
});
