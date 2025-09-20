# 🔍 Guía de Debug en Cursor

## 🚀 Cómo Ejecutar en Modo Debug

### Opción 1: Desde el Panel de Cursor (Recomendado)

1. **Abre el panel de Debug:**
   - Presiona `Ctrl+Shift+D` (Windows/Linux) o `Cmd+Shift+D` (Mac)
   - O ve a `View > Run and Debug`

2. **Selecciona la configuración:**
   - En el dropdown superior, selecciona una de estas opciones:
     - `Next.js: debug full stack` (Recomendado)
     - `Next.js: debug server-side`
     - `Next.js: debug client-side`

3. **Inicia el debug:**
   - Haz click en el botón ▶️ verde
   - O presiona `F5`

### Opción 2: Desde Terminal

```bash
# Modo debug con logs
npm run dev:debug

# O modo normal
npm run dev
```

## 🔧 Configuraciones Disponibles

### 1. **Next.js: debug full stack** (Recomendado)
- Debug tanto servidor como cliente
- Se abre automáticamente Chrome para debug del frontend
- Logs completos en la consola integrada

### 2. **Next.js: debug server-side**
- Solo debug del servidor Next.js
- Logs de API y server-side
- Terminal integrado

### 3. **Next.js: debug client-side**
- Solo debug del frontend en Chrome
- Logs del navegador
- Requiere que el servidor ya esté corriendo

## 📊 Dónde Ver los Logs

### Console Logs del Frontend:
1. **En el navegador:**
   - Abre DevTools (`F12`)
   - Ve a la pestaña `Console`
   - Verás todos los `console.log()` del código React

2. **En Cursor:**
   - Ve a `View > Output`
   - Selecciona "Next.js" en el dropdown
   - Verás logs del servidor

### Server Logs:
1. **Terminal integrado de Cursor**
2. **Output panel** > "Next.js"
3. **Debug Console** (si usas modo debug)

## 🐛 Debugging del Banner

Para debuggear el problema del banner:

1. **Ejecuta en modo debug:**
   ```bash
   npm run dev:debug
   ```

2. **Abre DevTools en el navegador** (`F12`)

3. **Ve a la pestaña Console**

4. **Prueba subir un banner:**
   - Click en el banner
   - Selecciona una imagen
   - Click en Guardar

5. **Revisa los logs:**
   - Busca mensajes como "Banner file selected"
   - "Banner preview generated"
   - "Updating banner with"
   - "Banner update response"

## 🎯 Breakpoints

Para usar breakpoints:

1. **En el código:**
   - Haz click en el margen izquierdo del número de línea
   - Aparecerá un punto rojo

2. **Ejecuta en modo debug:**
   - El código se pausará en el breakpoint
   - Puedes inspeccionar variables
   - Usar Step Over, Step Into, etc.

## 🔍 Variables a Inspeccionar

Para el problema del banner, revisa:

```javascript
// En handleBannerUpdate
console.log('newBanner:', newBanner);
console.log('response:', response);
console.log('data.user.banner:', data.user.banner);

// En el componente
console.log('currentProfile.banner:', currentProfile.banner);
```

## 🚨 Troubleshooting

### Si no aparecen logs:
1. Verifica que estés en modo debug
2. Revisa que la consola del navegador esté abierta
3. Confirma que no hay filtros activos en la consola

### Si el debug no inicia:
1. Verifica que el puerto 3000 esté libre
2. Revisa que todas las dependencias estén instaladas
3. Intenta reiniciar Cursor

### Si no se conecta Chrome:
1. Cierra todas las ventanas de Chrome
2. Reinicia el debug
3. Verifica que no hay extensiones bloqueando

## 📝 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo normal
npm run dev

# Ejecutar en modo debug
npm run dev:debug

# Limpiar caché
npm run build
```

## 🎉 ¡Listo para Debuggear!

Con esta configuración podrás:
- ✅ Ver todos los logs en tiempo real
- ✅ Usar breakpoints para inspeccionar variables
- ✅ Debug tanto frontend como backend
- ✅ Identificar exactamente dónde falla el banner
