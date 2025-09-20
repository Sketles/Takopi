# 🔐 Configuración de Variables de Entorno - Takopi

## 📋 Pasos para Configurar la Seguridad

### 1. Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

# JWT Configuration (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_jwt_secret_super_secreto_aqui_cambiar_en_produccion

# NextAuth Configuration (CAMBIAR EN PRODUCCIÓN)
NEXTAUTH_SECRET=tu_nextauth_secret_aqui_cambiar_en_produccion

# App Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 2. Generar Claves Seguras

#### Para JWT_SECRET:
```bash
# Opción 1: Usar Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: Usar OpenSSL
openssl rand -hex 64

# Opción 3: Generar online
# https://generate-secret.vercel.app/64
```

#### Para NEXTAUTH_SECRET:
```bash
# Usar NextAuth CLI
npx next-auth secret
```

### 3. Variables de Entorno por Ambiente

#### Desarrollo (`.env.local`):
```env
MONGODB_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99
JWT_SECRET=dev_jwt_secret_cambiar_en_produccion
NEXTAUTH_SECRET=dev_nextauth_secret_cambiar_en_produccion
NEXTAUTH_URL=http://localhost:3000
```

#### Producción (`.env.production`):
```env
MONGODB_URI=mongodb+srv://takopi_app:TU_PASSWORD_REAL@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99
JWT_SECRET=clave_jwt_super_secreta_de_produccion_64_caracteres_minimo
NEXTAUTH_SECRET=clave_nextauth_super_secreta_de_produccion
NEXTAUTH_URL=https://tu-dominio.com
```

### 4. Configuración en Vercel/Netlify

Si usas Vercel o Netlify, agrega estas variables en el dashboard:

```env
MONGODB_URI=mongodb+srv://takopi_app:TU_PASSWORD@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99
JWT_SECRET=clave_jwt_produccion
NEXTAUTH_SECRET=clave_nextauth_produccion
NEXTAUTH_URL=https://tu-dominio.com
```

### 5. Verificar Configuración

Ejecuta este comando para verificar que todo esté configurado:

```bash
npm run dev
```

Luego visita: `http://localhost:3000/api/test-db`

### 6. Archivos que NO Subir a Git

Asegúrate de que estos archivos estén en `.gitignore`:

```gitignore
# Variables de entorno
.env
.env.local
.env.production
.env.staging

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Archivos de configuración local
.DS_Store
.vscode/
.idea/
```

### 7. Seguridad Adicional

#### Para Producción:
- ✅ Cambiar todas las contraseñas por defecto
- ✅ Usar HTTPS siempre
- ✅ Configurar CORS apropiadamente
- ✅ Limitar rate limiting
- ✅ Usar secrets management (Vercel, AWS Secrets Manager)

#### Para Desarrollo:
- ✅ No committear archivos `.env`
- ✅ Usar contraseñas de desarrollo
- ✅ Rotar claves regularmente

## 🚨 IMPORTANTE

**NUNCA subas archivos `.env` a Git o repositorios públicos**

La contraseña actual `Suicidesurrender603` debe cambiarse en producción por una más segura.

## 📞 Soporte

Si tienes problemas con la configuración, verifica:
1. Que el archivo `.env.local` existe
2. Que las variables están escritas correctamente
3. Que no hay espacios extra
4. Que el servidor se reinició después de los cambios
