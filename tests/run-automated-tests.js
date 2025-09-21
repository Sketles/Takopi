#!/usr/bin/env node

/**
 * Ejecutor principal de pruebas automatizadas
 * Coordina todas las pruebas del sistema Takopi
 */

const NavigationTest = require('./automated-navigation-test');
const UploadTest = require('./automated-upload-test');

class TestRunner {
  constructor() {
    this.allResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  async runAllTests() {
    this.startTime = new Date();
    console.log('🚀 INICIANDO PRUEBAS AUTOMATIZADAS DE TAKOPI');
    console.log('==========================================\n');

    console.log(`⏰ Inicio: ${this.startTime.toLocaleString()}\n`);

    // Prueba 1: Navegación
    console.log('🧪 PRUEBA 1: NAVEGACIÓN Y AUTENTICACIÓN');
    console.log('========================================');
    const navTest = new NavigationTest();
    try {
      await navTest.runAllTests();
      this.allResults.push({
        suite: 'Navegación',
        status: 'COMPLETED',
        results: navTest.testResults
      });
    } catch (error) {
      console.error('❌ Error en pruebas de navegación:', error.message);
      this.allResults.push({
        suite: 'Navegación',
        status: 'ERROR',
        error: error.message
      });
    }

    console.log('\n⏳ Esperando 3 segundos antes de la siguiente prueba...\n');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Prueba 2: Upload
    console.log('🧪 PRUEBA 2: SUBIDA DE CONTENIDO');
    console.log('================================');
    const uploadTest = new UploadTest();
    try {
      await uploadTest.runAllUploadTests();
      this.allResults.push({
        suite: 'Upload',
        status: 'COMPLETED',
        results: uploadTest.testResults
      });
    } catch (error) {
      console.error('❌ Error en pruebas de upload:', error.message);
      this.allResults.push({
        suite: 'Upload',
        status: 'ERROR',
        error: error.message
      });
    }

    this.endTime = new Date();
    this.printFinalReport();
  }

  printFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE FINAL DE PRUEBAS AUTOMATIZADAS');
    console.log('='.repeat(60));

    console.log(`⏰ Inicio: ${this.startTime.toLocaleString()}`);
    console.log(`⏰ Fin: ${this.endTime.toLocaleString()}`);
    console.log(`⏱️ Duración: ${this.getDuration()}\n`);

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    this.allResults.forEach(suite => {
      console.log(`📋 SUITE: ${suite.suite}`);
      console.log(`Estado: ${suite.status}`);

      if (suite.results) {
        suite.results.forEach(test => {
          totalTests++;
          const status = test.status === 'PASS' ? '✅' : '❌';
          console.log(`  ${status} ${test.test}: ${test.details}`);
          if (test.status === 'PASS') totalPassed++;
          else totalFailed++;
        });
      } else if (suite.error) {
        console.log(`  ❌ Error: ${suite.error}`);
        totalFailed++;
      }
      console.log('');
    });

    console.log('📈 RESUMEN GENERAL:');
    console.log(`Total de pruebas: ${totalTests}`);
    console.log(`✅ Pasaron: ${totalPassed}`);
    console.log(`❌ Fallaron: ${totalFailed}`);
    console.log(`📊 Tasa de éxito: ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}%`);

    if (totalFailed === 0) {
      console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está funcionando correctamente.');
    } else {
      console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
    }

    console.log('\n' + '='.repeat(60));
  }

  getDuration() {
    if (!this.startTime || !this.endTime) return 'N/A';
    const duration = this.endTime - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

}

// Función para ejecutar pruebas individuales
async function runSpecificTest(testName) {
  const testRunner = new TestRunner();

  switch (testName.toLowerCase()) {
    case 'nav':
    case 'navegacion':
    case 'navigation':
      console.log('🧪 Ejecutando solo pruebas de navegación...\n');
      const navTest = new NavigationTest();
      await navTest.runAllTests();
      break;

    case 'upload':
      console.log('🧪 Ejecutando solo pruebas de upload...\n');
      const uploadTest = new UploadTest();
      await uploadTest.runAllUploadTests();
      break;

    default:
      console.log('❌ Prueba no reconocida. Usa: nav, upload, o all');
      process.exit(1);
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (command && command !== 'all') {
  runSpecificTest(command).catch(console.error);
} else {
  // Ejecutar todas las pruebas
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('💥 Error fatal en las pruebas:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
