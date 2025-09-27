#!/usr/bin/env node

/**
 * Bridge automático entre Chrome DevTools y Cursor Debug Console
 * Ejecutar con: node scripts/chrome-debug-bridge.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔗 Iniciando Chrome Debug Bridge...');
console.log('📋 Esto conectará automáticamente Chrome DevTools con Cursor Debug Console');

// Función para ejecutar Chrome con debugging habilitado
function startChromeWithDebug() {
  const chromePath = 'chrome.exe'; // Windows
  const debugPort = 9222;
  const userDataDir = path.join(__dirname, '..', 'temp', 'chrome-debug');
  
  // Crear directorio temporal si no existe
  if (!fs.existsSync(path.dirname(userDataDir))) {
    fs.mkdirSync(path.dirname(userDataDir), { recursive: true });
  }
  
  const command = `"${chromePath}" --remote-debugging-port=${debugPort} --user-data-dir="${userDataDir}" --disable-web-security --disable-features=VizDisplayCompositor`;
  
  console.log(`🚀 Iniciando Chrome con debugging en puerto ${debugPort}...`);
  console.log(`📁 User data dir: ${userDataDir}`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error al iniciar Chrome:', error.message);
      return;
    }
    if (stderr) {
      console.log('⚠️ Chrome stderr:', stderr);
    }
    console.log('✅ Chrome iniciado correctamente');
  });
  
  return debugPort;
}

// Función para conectar con Chrome DevTools
function connectToChrome(port) {
  const WebSocket = require('ws');
  const ws = new WebSocket(`ws://localhost:${port}/devtools/page`);
  
  ws.on('open', function() {
    console.log('🔗 Conectado a Chrome DevTools');
    
    // Enviar comando para habilitar logs
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.enable'
    }));
    
    // Enviar comando para habilitar console
    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.enable'
    }));
  });
  
  ws.on('message', function(data) {
    try {
      const message = JSON.parse(data);
      
      // Capturar logs de console
      if (message.method === 'Runtime.consoleAPICalled') {
        const logEntry = message.params;
        const level = logEntry.type;
        const args = logEntry.args.map(arg => arg.value || arg.description || 'undefined');
        
        // Mostrar en Cursor Debug Console
        console.log(`[CHROME ${level.toUpperCase()}] ${args.join(' ')}`);
      }
      
      // Capturar errores
      if (message.method === 'Runtime.exceptionThrown') {
        const error = message.params.exceptionDetails;
        console.error(`[CHROME ERROR] ${error.text}`);
      }
      
    } catch (e) {
      // Ignorar errores de parsing
    }
  });
  
  ws.on('close', function() {
    console.log('🔌 Desconectado de Chrome DevTools');
  });
  
  ws.on('error', function(error) {
    console.error('❌ Error de conexión:', error.message);
  });
}

// Función principal
function main() {
  console.log('🎯 Chrome Debug Bridge iniciado');
  console.log('📝 Instrucciones:');
  console.log('1. Chrome se abrirá automáticamente');
  console.log('2. Ve a tu página web (http://localhost:3001)');
  console.log('3. Los logs de Chrome aparecerán aquí automáticamente');
  console.log('4. Presiona Ctrl+C para salir');
  console.log('');
  
  const port = startChromeWithDebug();
  
  // Esperar un poco para que Chrome se inicie
  setTimeout(() => {
    connectToChrome(port);
  }, 3000);
}

// Manejar salida limpia
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando Chrome Debug Bridge...');
  process.exit(0);
});

// Verificar dependencias
try {
  require('ws');
} catch (e) {
  console.log('📦 Instalando dependencia ws...');
  exec('npm install ws', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error al instalar ws:', error.message);
      return;
    }
    console.log('✅ Dependencia instalada, reiniciando...');
    main();
  });
  return;
}

// Iniciar
main();
