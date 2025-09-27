#!/usr/bin/env node

/**
 * Capturador automático de logs de Chrome
 * Ejecutar con: node scripts/auto-chrome-logs.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔗 Capturador Automático de Logs de Chrome');
console.log('==========================================');

// Función para obtener las pestañas de Chrome
async function getChromeTabs() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tabs = JSON.parse(data);
          resolve(tabs);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

// Función para conectar con una pestaña
async function connectToTab(tab) {
  const WebSocket = require('ws');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  
  ws.on('open', function() {
    console.log(`🔗 Conectado a pestaña: ${tab.title}`);
    
    // Habilitar Runtime para capturar logs
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.enable'
    }));
    
    // Habilitar Console para capturar console.log
    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.enable'
    }));
  });
  
  ws.on('message', function(data) {
    try {
      const message = JSON.parse(data);
      
      // Capturar console.log, console.error, etc.
      if (message.method === 'Runtime.consoleAPICalled') {
        const logEntry = message.params;
        const level = logEntry.type;
        const timestamp = new Date().toLocaleTimeString();
        const args = logEntry.args.map(arg => {
          if (arg.type === 'string') return arg.value;
          if (arg.type === 'number') return arg.value;
          if (arg.type === 'boolean') return arg.value;
          if (arg.type === 'undefined') return 'undefined';
          if (arg.type === 'null') return 'null';
          if (arg.type === 'object') return JSON.stringify(arg.value);
          return arg.description || 'unknown';
        });
        
        // Mostrar en Cursor Debug Console
        const logMessage = `[${timestamp}] [CHROME ${level.toUpperCase()}] ${args.join(' ')}`;
        
        switch (level) {
          case 'error':
            console.error(logMessage);
            break;
          case 'warning':
            console.warn(logMessage);
            break;
          default:
            console.log(logMessage);
        }
      }
      
      // Capturar errores de JavaScript
      if (message.method === 'Runtime.exceptionThrown') {
        const error = message.params.exceptionDetails;
        const timestamp = new Date().toLocaleTimeString();
        console.error(`[${timestamp}] [CHROME EXCEPTION] ${error.text}`);
        if (error.stackTrace) {
          error.stackTrace.forEach(frame => {
            console.error(`  at ${frame.functionName} (${frame.url}:${frame.lineNumber})`);
          });
        }
      }
      
    } catch (e) {
      // Ignorar errores de parsing
    }
  });
  
  ws.on('close', function() {
    console.log('🔌 Desconectado de la pestaña');
  });
  
  ws.on('error', function(error) {
    console.error('❌ Error de conexión:', error.message);
  });
  
  return ws;
}

// Función principal
async function main() {
  console.log('📋 Instrucciones:');
  console.log('1. Asegúrate de que Chrome esté corriendo con: chrome.exe --remote-debugging-port=9222');
  console.log('2. Ve a tu página web (http://localhost:3001)');
  console.log('3. Los logs aparecerán aquí automáticamente');
  console.log('4. Presiona Ctrl+C para salir');
  console.log('');
  
  try {
    const tabs = await getChromeTabs();
    console.log(`🔍 Encontradas ${tabs.length} pestañas de Chrome`);
    
    // Buscar pestaña de localhost
    const localhostTab = tabs.find(tab => 
      tab.url && tab.url.includes('localhost:3001')
    );
    
    if (localhostTab) {
      console.log(`🎯 Conectando a pestaña localhost: ${localhostTab.title}`);
      await connectToTab(localhostTab);
    } else {
      console.log('⚠️ No se encontró pestaña de localhost:3001');
      console.log('📋 Pestañas disponibles:');
      tabs.forEach((tab, index) => {
        console.log(`  ${index + 1}. ${tab.title} - ${tab.url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Solución:');
    console.log('1. Cierra Chrome completamente');
    console.log('2. Ejecuta: chrome.exe --remote-debugging-port=9222');
    console.log('3. Ve a http://localhost:3001');
    console.log('4. Ejecuta este script otra vez');
  }
}

// Manejar salida limpia
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando capturador de logs...');
  process.exit(0);
});

// Verificar dependencia ws
try {
  require('ws');
} catch (e) {
  console.log('📦 Instalando dependencia ws...');
  const { exec } = require('child_process');
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
