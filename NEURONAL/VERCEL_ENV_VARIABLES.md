# 🔧 VARIABLES DE ENTORNO PARA VERCEL - TAKOPI

## 📋 **VARIABLES OBLIGATORIAS**

Estas son las variables que **DEBES** configurar en Vercel para que tu aplicación funcione:

### **1. MONGODB_URI** ⚠️ **CRÍTICA**
```
Key: MONGODB_URI
Value: mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99
```
**¿Qué es?** La conexión a tu base de datos MongoDB Atlas.

### **2. JWT_SECRET** ⚠️ **CRÍTICA**
```
Key: JWT_SECRET
Value: [GENERA_UNA_CLAVE_SECRETA_ÚNICA]
```
**¿Qué es?** Clave secreta para firmar tokens JWT de autenticación.
**⚠️ IMPORTANTE:** Cambia esto por una clave única y segura.

### **3. NEXTAUTH_SECRET** ⚠️ **CRÍTICA**
```
Key: NEXTAUTH_SECRET
Value: [GENERA_OTRA_CLAVE_SECRETA_ÚNICA]
```
**¿Qué es?** Clave secreta para NextAuth.js (autenticación).
**⚠️ IMPORTANTE:** Cambia esto por otra clave única y segura.

### **4. NEXTAUTH_URL** ⚠️ **CRÍTICA**
```
Key: NEXTAUTH_URL
Value: https://tu-app.vercel.app
```
**¿Qué es?** La URL de tu aplicación en Vercel.
**⚠️ IMPORTANTE:** Cambia `tu-app` por el nombre real de tu proyecto en Vercel.

### **5. NODE_ENV** ⚠️ **CRÍTICA**
```
Key: NODE_ENV
Value: production
```
**¿Qué es?** Define que la aplicación está en modo producción.

---

## 🔧 **VARIABLES OPCIONALES**

Estas son para funcionalidades avanzadas (puedes dejarlas vacías por ahora):

### **6. CLOUDINARY_CLOUD_NAME** (Opcional)
```
Key: CLOUDINARY_CLOUD_NAME
Value: [tu_cloudinary_cloud_name]
```

### **7. CLOUDINARY_API_KEY** (Opcional)
```
Key: CLOUDINARY_API_KEY
Value: [tu_cloudinary_api_key]
```

### **8. CLOUDINARY_API_SECRET** (Opcional)
```
Key: CLOUDINARY_API_SECRET
Value: [tu_cloudinary_api_secret]
```

### **9. STRIPE_PUBLIC_KEY** (Opcional)
```
Key: STRIPE_PUBLIC_KEY
Value: [tu_stripe_public_key]
```

### **10. STRIPE_SECRET_KEY** (Opcional)
```
Key: STRIPE_SECRET_KEY
Value: [tu_stripe_secret_key]
```

---

## 🚀 **PASOS PARA CONFIGURAR EN VERCEL**

### **Paso 1: Ir a Environment Variables**
1. En tu proyecto de Vercel, ve a **Settings**
2. Haz clic en **Environment Variables** (lo que ves en la imagen)

### **Paso 2: Agregar Variables Obligatorias**
Copia y pega estas variables una por una:

```
MONGODB_URI = mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

JWT_SECRET = [GENERA_UNA_CLAVE_SECRETA_ÚNICA]

NEXTAUTH_SECRET = [GENERA_OTRA_CLAVE_SECRETA_ÚNICA]

NEXTAUTH_URL = https://tu-app.vercel.app

NODE_ENV = production
```

### **Paso 3: Generar Claves Secretas**
Para las claves secretas, puedes usar:
- Un generador online de claves
- O ejecutar: `openssl rand -base64 32` en terminal
- O usar: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### **Paso 4: Redeploy**
Después de agregar las variables:
1. Ve a **Deployments**
2. Haz clic en **Redeploy** en el último deployment

---

## ⚠️ **IMPORTANTE - SEGURIDAD**

### **🔒 CAMBIAR CLAVES POR DEFECTO**
Las claves que tienes en el código son para desarrollo. **DEBES** cambiarlas en producción:

1. **JWT_SECRET**: Genera una nueva clave de 32+ caracteres
2. **NEXTAUTH_SECRET**: Genera otra clave diferente
3. **MONGODB_URI**: Verifica que la contraseña sea segura

### **🌐 CONFIGURAR DOMINIO**
- Cambia `tu-app.vercel.app` por tu dominio real
- Si usas dominio personalizado, actualiza `NEXTAUTH_URL`

---

## 🧪 **VERIFICAR CONFIGURACIÓN**

Después del deploy, verifica que:
1. ✅ La aplicación carga sin errores
2. ✅ Puedes registrarte e iniciar sesión
3. ✅ Puedes subir archivos
4. ✅ La base de datos se conecta correctamente

---

## 📞 **SI HAY PROBLEMAS**

1. **Error de conexión a BD**: Verifica `MONGODB_URI`
2. **Error de autenticación**: Verifica `JWT_SECRET` y `NEXTAUTH_SECRET`
3. **Error de URL**: Verifica `NEXTAUTH_URL` y `NODE_ENV`
4. **Revisa logs**: En Vercel → Functions → View Function Logs

¡Con estas variables tu aplicación Takopi funcionará perfectamente en Vercel! 🚀
