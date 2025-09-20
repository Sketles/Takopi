const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verificando estado del token en el navegador...\n');

console.log('📋 INSTRUCCIONES PARA EL USUARIO:');
console.log('=====================================');
console.log('1. Abre tu navegador en http://localhost:3000');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña "Console"');
console.log('4. Copia y pega este código:\n');

const debugCode = `
// Verificar token en localStorage
console.log('🔍 Verificando token...');
const token = localStorage.getItem('token');
console.log('Token encontrado:', token ? '✅ SÍ' : '❌ NO');
console.log('Token completo:', token);

// Verificar usuario en localStorage
const user = localStorage.getItem('user');
console.log('Usuario encontrado:', user ? '✅ SÍ' : '❌ NO');
console.log('Usuario completo:', user);

// Verificar si el token es válido
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expira:', new Date(payload.exp * 1000));
    console.log('Token válido:', new Date(payload.exp * 1000) > new Date() ? '✅ SÍ' : '❌ NO');
  } catch (e) {
    console.log('❌ Error al decodificar token:', e.message);
  }
}

// Probar API directamente
if (token) {
  fetch('/api/content', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => {
    console.log('Respuesta API:', response.status, response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('Datos API:', data);
  })
  .catch(error => {
    console.log('Error API:', error);
  });
}
`;

console.log(debugCode);
console.log('\n5. Presiona Enter para ejecutar');
console.log('6. Copia y pega aquí los resultados que aparezcan en la consola');
