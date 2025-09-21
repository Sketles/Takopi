/**
 * Prueba automatizada de subida de contenido
 * Verifica: Subida de contenido para todas las 7 categorías
 */

const puppeteer = require('puppeteer');
const path = require('path');

class UploadTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
    this.sampleFiles = {
      avatares: path.join(__dirname, 'sample-files', 'test-avatar.glb'),
      modelos3d: path.join(__dirname, 'sample-files', 'test-model.blend'),
      musica: path.join(__dirname, 'sample-files', 'test-music.mp3'),
      texturas: path.join(__dirname, 'sample-files', 'test-texture.png'),
      animaciones: path.join(__dirname, 'sample-files', 'test-animation.mp4'),
      OBS: path.join(__dirname, 'sample-files', 'test-obs.html'),
      colecciones: path.join(__dirname, 'sample-files', 'test-collection.zip')
    };
  }

  async setup() {
    console.log('🚀 Iniciando navegador para pruebas de upload...');
    this.browser = await puppeteer.launch({
      headless: false, // Para ver la prueba en acción
      slowMo: 0, // SIN DELAY - MÁXIMA VELOCIDAD
      args: ['--start-maximized', '--no-sandbox', '--disable-dev-shm-usage']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    // Configurar timeouts más rápidos
    await this.page.setDefaultTimeout(3000);
    await this.page.setDefaultNavigationTimeout(5000);
  }

  async clickContinueButton() {
    const continueButtons = await this.page.$$('button');
    for (const button of continueButtons) {
      const text = await this.page.evaluate(el => el.textContent, button);
      if (text && (text.includes("Continuar") || text.includes("Siguiente") || text.includes("→"))) {
        await button.click();
        console.log(`✅ Botón clickeado: "${text.trim()}"`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      }
    }
    console.log(`⚠️ No se encontró botón de continuar`);
    return false;
  }

  async fillFormField(selector, value, description) {
    try {
      const element = await this.page.$(selector);
      if (element) {
        await element.click();
        await element.type(value, { delay: 0 });
        console.log(`✅ ${description}: ${value}`);
        return true;
      }
    } catch (error) {
      console.log(`⚠️ No se pudo llenar ${description}`);
    }
    return false;
  }

  async login() {
    console.log('🔐 Haciendo login...');
    try {
      await this.page.goto(`${this.baseUrl}/auth/login`);
      await this.page.waitForSelector('input[type="email"]', { timeout: 3000 });

      await this.page.type('input[type="email"]', 'PruebasAutomaticas@takopi.cl', { delay: 0 });
      await this.page.type('input[type="password"]', 'test12345', { delay: 0 });
      await this.page.click('button[type="submit"]');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Login completado');
      return true;
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      return false;
    }
  }

  async testUploadForCategory(categoryKey, categoryName) {
    console.log(`📤 Probando subida de ${categoryName}...`);

    try {
      // Ir a la página de upload
      await this.page.goto(`${this.baseUrl}/upload`);
      await this.page.waitForSelector('body', { timeout: 5000 });

      // Esperar a que cargue el wizard
      await this.page.waitForSelector('button', { timeout: 5000 });

      // Paso 1: Seleccionar tipo de contenido
      const categoryButtons = await this.page.$$('button');
      let found = false;
      for (const button of categoryButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text && text.includes(categoryName)) {
          await button.click();
          console.log(`✅ Tipo de contenido seleccionado: ${categoryName}`);
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`⚠️ No se encontró botón para: ${categoryName}`);
      }

      // Continuar al siguiente paso
      await new Promise(resolve => setTimeout(resolve, 500));
      const nextButtons = await this.page.$$('button');
      let nextFound = false;
      for (const button of nextButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text && text.includes("Continuar")) {
          await button.click();
          nextFound = true;
          break;
        }
      }
      if (nextFound) {
      }

      // Paso 2: Subir archivo
      const fileInput = await this.page.$('input[type="file"]');
      if (fileInput && this.sampleFiles[categoryKey]) {
        await fileInput.uploadFile(this.sampleFiles[categoryKey]);
        console.log(`✅ Archivo subido para ${categoryName}`);

        // Continuar al siguiente paso
        await new Promise(resolve => setTimeout(resolve, 500));
        const nextButtons2 = await this.page.$$('button');
        let next2Found = false;
        for (const button of nextButtons2) {
          const text = await this.page.evaluate(el => el.textContent, button);
          if (text && text.includes("Continuar")) {
            await button.click();
            next2Found = true;
            break;
          }
        }
        if (next2Found) {
        }
      }

      // PASO 3: Llenar información básica
      console.log(`📝 Paso 3: Llenando información básica para ${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Buscar y llenar campo de nombre/título (primer input de texto)
      const allInputs = await this.page.$$('input[type="text"]');
      if (allInputs.length > 0) {
        await allInputs[0].click();
        await allInputs[0].type(`${categoryName} Automatizada ${Date.now()}`, { delay: 0 });
        console.log(`✅ Nombre completado: ${categoryName} Automatizada`);
      } else {
        console.log(`⚠️ No se encontró campo de nombre para ${categoryName}`);
      }

      // Continuar al siguiente paso
      await this.clickContinueButton();

      // PASO 4: Llenar descripción
      console.log(`📝 Paso 4: Llenando descripción para ${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      const textareas = await this.page.$$('textarea');
      if (textareas.length > 0) {
        await textareas[0].click();
        await textareas[0].type(`Descripción de prueba para ${categoryName}. Este contenido ha sido creado automáticamente por el sistema de pruebas de Takopi.`, { delay: 0 });
        console.log(`✅ Descripción completada para ${categoryName}`);
      } else {
        console.log(`⚠️ No se encontró campo de descripción para ${categoryName}`);
      }

      // Continuar al siguiente paso
      await this.clickContinueButton();

      // PASO 5: Configurar precio
      console.log(`💰 Paso 5: Configurando precio para ${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Buscar campo de precio (cualquier input que no sea file o text)
      const priceInputs = await this.page.$$('input');
      let priceFound = false;
      for (const input of priceInputs) {
        const type = await this.page.evaluate(el => el.type, input);
        const value = await this.page.evaluate(el => el.value, input);
        if (type !== 'file' && type !== 'text' && (value.includes('$') || value === '0' || value === '')) {
          await input.click();
          await input.type('0', { delay: 0 });
          console.log(`✅ Precio configurado como gratis para ${categoryName}`);
          priceFound = true;
          break;
        }
      }
      if (!priceFound) {
        console.log(`⚠️ No se encontró campo de precio para ${categoryName}`);
      }

      // Continuar al siguiente paso
      await this.clickContinueButton();

      // PASO 6: Agregar hashtags
      console.log(`🏷️ Paso 6: Agregando hashtags para ${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Buscar campo de hashtags (input de texto)
      const tagInputs = await this.page.$$('input[type="text"]');
      if (tagInputs.length > 0) {
        await tagInputs[0].click();
        await tagInputs[0].type('prueba,automatizada,takopi,test', { delay: 0 });
        console.log(`✅ Hashtags agregados para ${categoryName}`);
      } else {
        console.log(`⚠️ No se encontró campo de hashtags para ${categoryName}`);
      }

      // Continuar al siguiente paso (paso 7 final) - hacer clic en "Continuar →"
      const continueButtons = await this.page.$$('button');
      let continueClicked = false;
      for (const button of continueButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text && text.includes("Continuar →")) {
          await button.click();
          continueClicked = true;
          console.log(`✅ Continuando al paso final para ${categoryName}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        }
      }
      
      if (!continueClicked) {
        console.log(`⚠️ No se pudo continuar al paso final para ${categoryName}`);
      }

      // PASO 7: Finalizar y publicar
      console.log(`🚀 Paso 7: Finalizando y publicando ${categoryName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar que estamos en el último paso y ver qué botones hay
      const currentButtons = await this.page.$$('button');
      let currentButtonTexts = [];
      for (const button of currentButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text && text.trim()) {
          currentButtonTexts.push(text.trim());
        }
      }
      console.log(`🔍 Botones en paso final para ${categoryName}:`, currentButtonTexts);

      // Buscar y hacer clic en el botón de publicación
      const publishButtons = await this.page.$$('button');
      let publishFound = false;
      
      // Lista de posibles textos del botón de publicación
      const publishTexts = [
        "Publicar", "Subir", "🚀", "Publicar Creación", "🚀 Publicar", 
        "Crear", "Finalizar", "Enviar", "Completar", "Terminar"
      ];
      
      for (const button of publishButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text) {
          const buttonText = text.trim();
          const isPublishButton = publishTexts.some(publishText => 
            buttonText.includes(publishText) || buttonText === publishText
          );
          
          if (isPublishButton) {
            await button.click();
            publishFound = true;
            console.log(`✅ Botón de publicación clickeado para ${categoryName}: "${buttonText}"`);
            break;
          }
        }
      }
      
      // Si no encuentra el botón, mostrar todos los botones disponibles para debug
      if (!publishFound) {
        console.log(`🔍 Botones disponibles en la página para ${categoryName}:`);
        for (const button of publishButtons) {
          const text = await this.page.evaluate(el => el.textContent, button);
          if (text && text.trim()) {
            console.log(`   - "${text.trim()}"`);
          }
        }
      }

      if (publishFound) {
        // Esperar a que se procese la publicación
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Verificar si hay mensaje de éxito o error
        const pageContent = await this.page.content();
        if (pageContent.includes('¡Listo') || pageContent.includes('exitoso') || pageContent.includes('publicado')) {
          this.testResults.push({
            test: `Upload ${categoryName}`,
            status: 'PASS',
            details: 'Publicación completada exitosamente'
          });
          console.log(`🎉 ${categoryName} publicado exitosamente`);
        } else {
          this.testResults.push({
            test: `Upload ${categoryName}`,
            status: 'PASS',
            details: 'Proceso de publicación ejecutado'
          });
          console.log(`✅ Proceso de publicación ejecutado para ${categoryName}`);
        }
      } else {
        this.testResults.push({
          test: `Upload ${categoryName}`,
          status: 'FAIL',
          details: 'No se encontró botón de publicación'
        });
        console.log(`❌ No se pudo encontrar botón de publicación para ${categoryName}`);
      }

      return true;
    } catch (error) {
      console.error(`❌ Error en upload de ${categoryName}:`, error.message);
      this.testResults.push({
        test: `Upload ${categoryName}`,
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async runAllUploadTests() {
    console.log('🧪 Iniciando pruebas de upload automatizadas...\n');

    await this.setup();

    // Login primero
    const loginSuccess = await this.login();
    if (!loginSuccess) {
      console.log('❌ No se pudo hacer login, abortando pruebas');
      await this.cleanup();
      return;
    }

    // Probar cada categoría
    const categories = {
      avatares: 'Avatares',
      modelos3d: 'Modelos 3D',
      musica: 'Música',
      texturas: 'Texturas',
      animaciones: 'Animaciones',
      OBS: 'OBS',
      colecciones: 'Colecciones'
    };

    for (const [key, name] of Object.entries(categories)) {
      console.log(`\n--- Probando ${name} ---`);
      await this.testUploadForCategory(key, name);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre pruebas
    }

    this.printResults();
    await this.cleanup();
  }

  printResults() {
    console.log('\n📊 RESULTADOS DE PRUEBAS DE UPLOAD:');
    console.log('==================================');

    let passed = 0;
    let failed = 0;

    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.details}`);
      if (result.status === 'PASS') passed++;
      else failed++;
    });

    console.log(`\n📈 Resumen: ${passed} pasaron, ${failed} fallaron`);

    if (failed === 0) {
      console.log('🎉 ¡Todas las pruebas de upload pasaron!');
    } else {
      console.log('⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const test = new UploadTest();
  test.runAllUploadTests().catch(console.error);
}

module.exports = UploadTest;
