# 🧪 Pruebas Automatizadas de Takopi

Sistema de pruebas automatizadas para verificar el funcionamiento completo de la aplicación Takopi.

## 📋 Pruebas Disponibles

### 1. **Prueba de Navegación** (`test:nav`)
- ✅ Carga de página de inicio
- 🔐 Login automático con usuario de prueba
- 🔍 Navegación a página de Explorar
- 👤 Navegación a página de Perfil
- 📤 Navegación a página de Upload

### 2. **Prueba de Upload** (`test:upload`)
- 📤 Subida de contenido para todas las 7 categorías:
  - 👤 Avatares (archivo .glb)
  - 🧩 Modelos 3D (archivo .blend)
  - 🎵 Música (archivo .mp3)
  - 🖼️ Texturas (archivo .png)
  - 🎬 Animaciones (archivo .mp4)
  - 📺 OBS (archivo .html)
  - 📦 Colecciones (archivo .zip)

### 3. **Prueba Completa** (`test:all`)
- Ejecuta todas las pruebas en secuencia
- Genera reporte completo con estadísticas

## 🚀 Cómo Usar

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Preparar Entorno de Pruebas
```bash
npm run setup:tests
```

Este comando:
- ✅ Crea el usuario `PruebasAutomaticas@takopi.cl`
- ✅ Verifica que la aplicación esté corriendo
- ✅ Confirma que los archivos de prueba existen

### 3. Ejecutar Pruebas

#### Todas las Pruebas
```bash
npm run test:all
```

#### Prueba Específica
```bash
# Solo navegación
npm run test:nav

# Solo upload
npm run test:upload
```

### Ejecutar desde Línea de Comandos
```bash
# Todas las pruebas
node tests/run-automated-tests.js

# Prueba específica
node tests/run-automated-tests.js nav
node tests/run-automated-tests.js upload
```

## 📁 Archivos de Prueba

Los archivos de ejemplo se encuentran en `tests/sample-files/`:
- `test-avatar.glb` - Mock para avatares
- `test-model.blend` - Mock para modelos 3D
- `test-music.mp3` - Mock para música
- `test-texture.png` - Mock para texturas
- `test-animation.mp4` - Mock para animaciones
- `test-obs.html` - Mock para widgets OBS
- `test-collection.zip` - Mock para colecciones

## ⚙️ Configuración

### Usuario de Prueba
Las pruebas usan el usuario:
- **Email:** `PruebasAutomaticas@takopi.cl`
- **Password:** `test12345`

### Requisitos
- ✅ Aplicación corriendo en `http://localhost:3000`
- ✅ Base de datos configurada
- ✅ Usuario de prueba existente
- ✅ Puppeteer instalado

## 📊 Interpretación de Resultados

### ✅ Prueba Exitosa
- La funcionalidad funciona correctamente
- No hay errores en la consola
- Se completa el flujo esperado

### ❌ Prueba Fallida
- Error en la funcionalidad
- Timeout o elemento no encontrado
- Error en el proceso

### 📈 Estadísticas
- **Total de pruebas:** Número total ejecutado
- **Pasaron:** Pruebas exitosas
- **Fallaron:** Pruebas con errores
- **Tasa de éxito:** Porcentaje de éxito

## 🔧 Solución de Problemas

### Error: "No se pudo hacer login"
- Verificar que el usuario `PruebasAutomaticas@takopi.cl` existe
- Verificar que la contraseña es `test12345`
- Verificar que la aplicación está corriendo

### Error: "Elemento no encontrado"
- Verificar que la aplicación cargó correctamente
- Verificar que no hay errores en la consola del navegador
- Aumentar el timeout si es necesario

### Error: "Puppeteer no encontrado"
```bash
npm install puppeteer --save-dev
```

## 📝 Logs y Debugging

Las pruebas ejecutan en modo visual (no headless) para que puedas ver:
- ✅ Navegación entre páginas
- ✅ Formularios siendo llenados
- ✅ Archivos siendo subidos
- ✅ Errores en tiempo real

Para debugging, revisa:
1. Consola del terminal (logs de las pruebas)
2. Consola del navegador (errores de JavaScript)
3. Network tab (errores de API)

## 🎯 Objetivo

Estas pruebas automatizadas te permiten:
- ✅ Verificar que toda la aplicación funciona
- ✅ Detectar regresiones rápidamente
- ✅ Ahorrar tiempo en pruebas manuales
- ✅ Tener confianza en los deployments

¡No más pruebas manuales tediosas! 🚀
