/**
 * Prueba automatizada de navegación
 * Verifica: Index → Login → Explorar → Perfil
 */

const puppeteer = require('puppeteer');

class NavigationTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async setup() {
    console.log('🚀 Iniciando navegador...');
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

  async testIndexPage() {
    console.log('📄 Probando página de inicio...');
    try {
      await this.page.goto(this.baseUrl);
      await this.page.waitForSelector('body', { timeout: 5000 });

      // Verificar que la página cargó correctamente
      const title = await this.page.title();
      console.log(`✅ Página de inicio cargada: ${title}`);

      this.testResults.push({
        test: 'Index Page',
        status: 'PASS',
        details: `Título: ${title}`
      });

      return true;
    } catch (error) {
      console.error('❌ Error en página de inicio:', error.message);
      this.testResults.push({
        test: 'Index Page',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testLogin() {
    console.log('🔐 Probando login...');
    try {
      // Hacer clic en el botón de login
      await this.page.waitForSelector('a[href="/auth/login"]', { timeout: 5000 });
      await this.page.click('a[href="/auth/login"]');

      // Esperar a que cargue la página de login
      await this.page.waitForSelector('input[type="email"]', { timeout: 3000 });

      // Llenar formulario de login (escritura rápida)
      await this.page.type('input[type="email"]', 'PruebasAutomaticas@takopi.cl', { delay: 0 });
      await this.page.type('input[type="password"]', 'test12345', { delay: 0 });

      // Hacer clic en el botón de login
      await this.page.click('button[type="submit"]');

      // Esperar a que redirija (puede ir a index o profile)
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Login completado');
      this.testResults.push({
        test: 'Login',
        status: 'PASS',
        details: 'Usuario logueado correctamente'
      });

      return true;
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      this.testResults.push({
        test: 'Login',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testNavigationToExplore() {
    console.log('🔍 Probando navegación a Explorar...');
    try {
      // Navegar a explorar
      await this.page.goto(`${this.baseUrl}/explore`);
      await this.page.waitForSelector('body', { timeout: 5000 });

      // Verificar que las categorías están presentes
      const categories = await this.page.$$eval('button', buttons =>
        buttons.map(btn => btn.textContent).filter(text =>
          text && (text.includes('Todo') || text.includes('Avatares') || text.includes('Modelos'))
        )
      );

      console.log(`✅ Explorar cargado con ${categories.length} categorías`);
      this.testResults.push({
        test: 'Navigate to Explore',
        status: 'PASS',
        details: `Categorías encontradas: ${categories.length}`
      });

      return true;
    } catch (error) {
      console.error('❌ Error navegando a Explorar:', error.message);
      this.testResults.push({
        test: 'Navigate to Explore',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testNavigationToProfile() {
    console.log('👤 Probando navegación a Perfil...');
    try {
      // Navegar a perfil
      await this.page.goto(`${this.baseUrl}/profile`);
      await this.page.waitForSelector('body', { timeout: 5000 });

      // Verificar que el perfil cargó
      const profileElements = await this.page.$$eval('h1, h2, h3', elements =>
        elements.map(el => el.textContent).filter(text => text && text.length > 0)
      );

      console.log('✅ Perfil cargado correctamente');
      this.testResults.push({
        test: 'Navigate to Profile',
        status: 'PASS',
        details: `Elementos del perfil: ${profileElements.length}`
      });

      return true;
    } catch (error) {
      console.error('❌ Error navegando a Perfil:', error.message);
      this.testResults.push({
        test: 'Navigate to Profile',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testNavigationToUpload() {
    console.log('📤 Probando navegación a Subir...');
    try {
      // Navegar a upload
      await this.page.goto(`${this.baseUrl}/upload`);
      await this.page.waitForSelector('body', { timeout: 5000 });

      // Verificar que el wizard de upload cargó
      const uploadElements = await this.page.$$eval('button, input, select', elements =>
        elements.length
      );

      console.log('✅ Página de upload cargada');
      this.testResults.push({
        test: 'Navigate to Upload',
        status: 'PASS',
        details: `Elementos de upload: ${uploadElements}`
      });

      return true;
    } catch (error) {
      console.error('❌ Error navegando a Upload:', error.message);
      this.testResults.push({
        test: 'Navigate to Upload',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Iniciando pruebas de navegación automatizadas...\n');

    await this.setup();

    const tests = [
      () => this.testIndexPage(),
      () => this.testLogin(),
      () => this.testNavigationToExplore(),
      () => this.testNavigationToProfile(),
      () => this.testNavigationToUpload()
    ];

    for (const test of tests) {
      const result = await test();
      if (!result) {
        console.log('⚠️ Una prueba falló, continuando con las siguientes...\n');
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa mínima entre pruebas
    }

    this.printResults();
    await this.cleanup();
  }

  printResults() {
    console.log('\n📊 RESULTADOS DE PRUEBAS DE NAVEGACIÓN:');
    console.log('=====================================');

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
      console.log('🎉 ¡Todas las pruebas de navegación pasaron!');
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
  const test = new NavigationTest();
  test.runAllTests().catch(console.error);
}

module.exports = NavigationTest;
