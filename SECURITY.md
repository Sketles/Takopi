# 🔒 GUÍA DE SEGURIDAD - TAKOPI

## 🚨 IMPORTANTE: Credenciales de Transbank

### ⚠️ NUNCA hagas esto:
- ❌ Subir credenciales reales al repositorio
- ❌ Hardcodear API keys en el código
- ❌ Compartir credenciales por chat/email
- ❌ Usar credenciales de producción en desarrollo

### ✅ SÍ haz esto:
- ✅ Usar variables de entorno (`.env.local`)
- ✅ Mantener `.env.local` en `.gitignore`
- ✅ Usar credenciales de integración para desarrollo
- ✅ Rotar credenciales regularmente

## 📋 CONFIGURACIÓN SEGURA

### 1. Variables de Entorno Requeridas

```bash
# Desarrollo/Integración
TBK_COMMERCE_CODE=597055555532
TBK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# Producción (solo cuando esté listo)
TBK_COMMERCE_CODE_PROD=tu_commerce_code_real
TBK_API_KEY_PROD=tu_api_key_real_super_secreta
```

### 2. Pasos para Configurar

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env.local
   ```

2. **Edita `.env.local` con tus credenciales:**
   ```bash
   # Para desarrollo
   TBK_COMMERCE_CODE=597055555532
   TBK_API_KEY=tu_api_key_de_integracion
   
   # Para producción (más adelante)
   TBK_COMMERCE_CODE_PROD=tu_commerce_code_real
   TBK_API_KEY_PROD=tu_api_key_real
   ```

3. **Verifica que `.env.local` esté en `.gitignore`:**
   ```bash
   echo ".env.local" >> .gitignore
   ```

## 🏗️ AMBIENTES

### Desarrollo/Integración
- ✅ Usa credenciales de Transbank Sandbox
- ✅ No hay riesgo de transacciones reales
- ✅ Ideal para testing y desarrollo

### Producción
- ⚠️ Usa credenciales REALES de Transbank
- ⚠️ Transacciones REALES con dinero REAL
- ⚠️ Solo usar cuando esté 100% listo

## 🔐 MEJORES PRÁCTICAS

### 1. Gestión de Credenciales
```typescript
// ✅ BUENO - Variables de entorno
const apiKey = process.env.TBK_API_KEY;

// ❌ MALO - Hardcodeado
const apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
```

### 2. Logging Seguro
```typescript
// ✅ BUENO - Logging parcial
console.log('API Key:', apiKey.slice(0, 4) + '***');

// ❌ MALO - Logging completo
console.log('API Key:', apiKey);
```

### 3. Validación de Ambiente
```typescript
// ✅ BUENO - Validación estricta
if (process.env.NODE_ENV === 'production') {
  if (!process.env.TBK_API_KEY_PROD) {
    throw new Error('Credenciales de producción requeridas');
  }
}
```

## 🚀 DESPLIEGUE SEGURO

### Vercel
```bash
# Configurar variables de entorno en Vercel
vercel env add TBK_COMMERCE_CODE_PROD
vercel env add TBK_API_KEY_PROD
```

### Docker
```dockerfile
# En Dockerfile
ENV TBK_COMMERCE_CODE_PROD=${TBK_COMMERCE_CODE_PROD}
ENV TBK_API_KEY_PROD=${TBK_API_KEY_PROD}
```

### Servidor VPS
```bash
# En el servidor
export TBK_COMMERCE_CODE_PROD="tu_commerce_code"
export TBK_API_KEY_PROD="tu_api_key"
```

## 🆘 EN CASO DE EMERGENCIA

### Si se comprometen las credenciales:
1. **Inmediatamente** revoca las credenciales en Transbank
2. Genera nuevas credenciales
3. Actualiza todas las variables de entorno
4. Revisa logs por actividad sospechosa

### Contacto de Emergencia:
- **Transbank Soporte**: soporte@transbank.cl
- **Documentación**: https://www.transbankdevelopers.cl/

## 📚 RECURSOS ADICIONALES

- [Documentación Transbank](https://www.transbankdevelopers.cl/)
- [Guía de Seguridad OWASP](https://owasp.org/www-project-top-ten/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**⚠️ RECUERDA: La seguridad es responsabilidad de todos. Si ves algo sospechoso, repórtalo inmediatamente.**
