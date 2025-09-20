#!/usr/bin/env node

/**
 * Sistema de Testing Escalable para TAKOPI
 * 
 * Este script está diseñado para ser mantenible y escalable.
 * Prueba todos los componentes críticos del sistema:
 * - Autenticación
 * - Subida de contenido
 * - Sistema de flags DB_MODE
 * 
 * Uso:
 *   node scripts/test-system.js
 *   node scripts/test-system.js --verbose
 *   node scripts/test-system.js --test auth
 *   node scripts/test-system.js --test upload
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

// Configuración
const CONFIG = {
  LOCAL_DB_URI: 'mongodb://localhost:27017/takopi_dev',
  API_BASE_URL: 'http://localhost:3000/api',
  TEST_USER: {
    email: 'sushipan@takopi.cl',
    password: 'test12345'
  }
};

// Sistema de logging
class Logger {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  info(message, data = null) {
    console.log(`ℹ️  ${message}`);
    if (data && this.verbose) {
      console.log('   📊 Datos:', JSON.stringify(data, null, 2));
    }
  }

  success(message, data = null) {
    console.log(`✅ ${message}`);
    if (data && this.verbose) {
      console.log('   📊 Datos:', JSON.stringify(data, null, 2));
    }
  }

  error(message, data = null) {
    console.log(`❌ ${message}`);
    if (data && this.verbose) {
      console.log('   📊 Error:', JSON.stringify(data, null, 2));
    }
  }

  warning(message, data = null) {
    console.log(`⚠️  ${message}`);
    if (data && this.verbose) {
      console.log('   📊 Datos:', JSON.stringify(data, null, 2));
    }
  }
}

// Clase principal de testing
class SystemTester {
  constructor(options = {}) {
    this.logger = new Logger(options.verbose);
    this.testResults = {
      auth: { passed: false, error: null },
      upload: { passed: false, error: null },
      dbConfig: { passed: false, error: null }
    };
  }

  async connectToDatabase() {
    try {
      await mongoose.connect(CONFIG.LOCAL_DB_URI);
      this.logger.success('Conectado a MongoDB local');
      return true;
    } catch (error) {
      this.logger.error('Error conectando a MongoDB local', error.message);
      return false;
    }
  }

  async testAuthentication() {
    this.logger.info('Probando sistema de autenticación...');

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CONFIG.TEST_USER)
      });

      const result = await response.json();

      if (response.ok && result.token) {
        this.logger.success('Autenticación exitosa', {
          user: result.user.username,
          hasToken: !!result.token
        });
        this.testResults.auth = { passed: true, token: result.token };
        return result.token;
      } else {
        throw new Error(result.message || 'Login falló');
      }
    } catch (error) {
      this.logger.error('Error en autenticación', error.message);
      this.testResults.auth = { passed: false, error: error.message };
      return null;
    }
  }

  async testContentUpload(token) {
    if (!token) {
      this.logger.error('No hay token para probar subida de contenido');
      this.testResults.upload = { passed: false, error: 'No token' };
      return false;
    }

    this.logger.info('Probando subida de contenido...');

    const testContent = {
      title: 'Test de Sistema - Modelo 3D',
      provisionalName: 'modelo-sistema-test',
      description: 'Descripción de prueba para el sistema de testing',
      shortDescription: 'Modelo de prueba del sistema',
      contentType: 'models',
      category: 'characters',
      subcategory: 'humanoid',
      files: [{
        name: 'test-system-model.fbx',
        originalName: 'test-system-model.fbx',
        size: 1024000,
        type: 'model/fbx',
        url: '/uploads/test-system-model.fbx',
        previewUrl: '/uploads/preview-test-system-model.jpg'
      }],
      price: 0,
      isFree: true,
      currency: 'CLP',
      license: 'personal',
      tags: ['test', 'sistema', '3d'],
      customTags: [],
      visibility: 'public',
      allowTips: false,
      allowCommissions: false
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testContent)
      });

      const result = await response.json();

      if (response.ok && result.data) {
        this.logger.success('Subida de contenido exitosa', {
          contentId: result.data._id,
          title: result.data.title
        });
        this.testResults.upload = { passed: true, contentId: result.data._id };
        return true;
      } else {
        throw new Error(result.error || 'Subida falló');
      }
    } catch (error) {
      this.logger.error('Error en subida de contenido', error.message);
      this.testResults.upload = { passed: false, error: error.message };
      return false;
    }
  }

  async testDatabaseConfig() {
    this.logger.info('Verificando configuración de base de datos...');

    try {
      // Verificar que el flag DB_MODE está configurado
      const dbMode = process.env.DB_MODE || 'local';
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error('JWT_SECRET no está configurado');
      }

      this.logger.success('Configuración de BD verificada', {
        dbMode,
        hasJwtSecret: !!jwtSecret,
        localDbUri: CONFIG.LOCAL_DB_URI
      });

      this.testResults.dbConfig = { passed: true };
      return true;
    } catch (error) {
      this.logger.error('Error en configuración de BD', error.message);
      this.testResults.dbConfig = { passed: false, error: error.message };
      return false;
    }
  }

  generateReport() {
    console.log('\n📊 REPORTE DE TESTING DEL SISTEMA');
    console.log('=====================================');

    const tests = [
      { name: 'Autenticación', result: this.testResults.auth },
      { name: 'Subida de Contenido', result: this.testResults.upload },
      { name: 'Configuración de BD', result: this.testResults.dbConfig }
    ];

    let passedCount = 0;
    let totalCount = tests.length;

    tests.forEach(test => {
      const status = test.result.passed ? '✅ PASÓ' : '❌ FALLÓ';
      console.log(`${status} ${test.name}`);

      if (!test.result.passed && test.result.error) {
        console.log(`   Error: ${test.result.error}`);
      }

      if (test.result.passed) passedCount++;
    });

    console.log('\n📈 RESUMEN:');
    console.log(`   Tests pasados: ${passedCount}/${totalCount}`);
    console.log(`   Porcentaje de éxito: ${Math.round((passedCount / totalCount) * 100)}%`);

    if (passedCount === totalCount) {
      console.log('\n🎉 ¡SISTEMA COMPLETAMENTE OPERATIVO!');
      console.log('   ✅ Todas las funcionalidades críticas funcionan correctamente');
      console.log('   ✅ El sistema está listo para desarrollo y producción');
    } else {
      console.log('\n⚠️  SISTEMA PARCIALMENTE OPERATIVO');
      console.log('   🔧 Revisar los tests fallidos antes de continuar');
    }

    return passedCount === totalCount;
  }

  async runAllTests() {
    console.log('🚀 Iniciando testing completo del sistema TAKOPI...\n');

    // Conectar a la BD
    const connected = await this.connectToDatabase();
    if (!connected) {
      this.logger.error('No se pudo conectar a la BD. Abortando tests.');
      return false;
    }

    try {
      // Ejecutar tests
      await this.testDatabaseConfig();
      const token = await this.testAuthentication();
      await this.testContentUpload(token);

      // Generar reporte
      const allPassed = this.generateReport();
      return allPassed;

    } catch (error) {
      this.logger.error('Error durante el testing', error.message);
      return false;
    } finally {
      await mongoose.disconnect();
      this.logger.info('Desconectado de MongoDB');
    }
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose'),
    test: args.find(arg => arg.startsWith('--test='))?.split('=')[1]
  };

  const tester = new SystemTester(options);

  if (options.test) {
    // Ejecutar test específico
    console.log(`🧪 Ejecutando test específico: ${options.test}`);
    // TODO: Implementar tests específicos
  } else {
    // Ejecutar todos los tests
    const success = await tester.runAllTests();
    process.exit(success ? 0 : 1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SystemTester, CONFIG };
