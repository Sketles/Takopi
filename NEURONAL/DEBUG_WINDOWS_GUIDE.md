# 🔧 Guía de Debug en Windows/Cursor

## 🚨 Problema Solucionado

El error que tenías era porque el script de Next.js no funciona bien con PowerShell en Windows. Ya está corregido.

## 🚀 Cómo Ejecutar Debug Ahora

### Opción 1: Panel de Debug (Recomendado)

1. **Presiona** `Ctrl+Shift+D` para abrir el panel de Debug
2. **Selecciona** una de estas opciones:
   - `Next.js: debug full stack` (Recomendado)
   - `Next.js: debug Windows (Alternative)`
3. **Haz click** en el botón ▶️ verde
4. **Se abrirá automáticamente** Chrome para debug

### Opción 2: Terminal

```bash
# Ahora funciona en Windows
npm run dev:debug

# O modo normal
npm run dev
```

## 🔧 Cambios Realizados

### 1. **.vscode/launch.json** - Corregido
- ✅ Usa `runtimeExecutable: "npm"` en lugar de script directo
- ✅ Configuración compatible con Windows
- ✅ Opción alternativa para Windows

### 2. **package.json** - Mejorado
- ✅ Usa `cross-env` para compatibilidad con Windows
- ✅ Script `dev:debug` funciona en PowerShell

### 3. **cross-env** - Instalado
- ✅ Paquete instalado para compatibilidad multiplataforma
- ✅ Maneja variables de entorno en Windows

## 🧪 Para Probar Ahora

### Método 1 - Debug Panel:
1. **Presiona** `Ctrl+Shift+D`
2. **Selecciona** `Next.js: debug full stack`
3. **Click** ▶️
4. **Espera** a que se abra Chrome automáticamente

### Método 2 - Terminal:
1. **Abre terminal** (`Ctrl+``)
2. **Ejecuta**: `npm run dev:debug`
3. **Abre** http://localhost:3000 en Chrome
4. **Presiona** `F12` para DevTools

## 🔍 Ver Logs del Banner

1. **Ejecuta** en modo debug
2. **Abre** DevTools (`F12`)
3. **Ve a** la pestaña "Console"
4. **Ve a** `/profile`
5. **Click** en el banner
6. **Selecciona** una imagen
7. **Click** en Guardar
8. **Revisa** los logs con emoji 🖼️

## 📊 Logs Esperados

```
🖼️ Banner Debug: Starting update with: data:image/...
🖼️ Banner Debug: Server response: {user: {...}}
🖼️ Banner Debug: Updated profile banner to: data:image/...
🖼️ Banner Debug: Current banner state: data:image/...
```

## ❌ Si Aún Tienes Problemas

### Problema: "Cannot find path"
**Solución**: Asegúrate de estar en la carpeta correcta del proyecto

### Problema: "SyntaxError"
**Solución**: Usa la configuración "Next.js: debug Windows (Alternative)"

### Problema: No se abre Chrome
**Solución**: Abre manualmente http://localhost:3000 y presiona F12

## 🎯 Configuraciones Disponibles

1. **Next.js: debug full stack** - Usa npm run dev:debug
2. **Next.js: debug server-side** - Solo servidor
3. **Next.js: debug client-side** - Solo navegador
4. **Next.js: debug Windows (Alternative)** - Script directo

## 🚀 ¡Listo!

Ahora el debug debería funcionar perfectamente en Windows. Si tienes algún problema, usa la configuración "Next.js: debug Windows (Alternative)".
