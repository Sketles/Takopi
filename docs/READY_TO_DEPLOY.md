# 🚀 LISTO PARA DEPLOY - Guía Final

## ✅ CONFIGURACIÓN LOCAL COMPLETADA

### Base de Datos - Neon Postgres
- ✅ Conectado a: `ep-spring-cherry-ac9fenm4` (São Paulo)
- ✅ Schema sincronizado (8 tablas)
- ✅ Datos iniciales poblados (3 usuarios, 5 contenidos)
- ✅ `npx prisma studio` para ver datos

### Almacenamiento - Vercel Blob
- ✅ Blob Store: **TakopiBlob**
- ✅ Token configurado en `.env`
- ✅ Listo para uploads

### Build
- ✅ `npm run build` exitoso
- ✅ Sin errores críticos
- ✅ 40 rutas generadas

---

## 🔐 GENERAR SECRETOS SEGUROS

### Para Producción (NO uses los de desarrollo)

Ejecuta estos comandos en tu terminal:

```bash
# Generar JWT_SECRET
openssl rand -base64 32

# Generar NEXTAUTH_SECRET  
openssl rand -base64 32
```

**Guarda ambos secretos** - los necesitarás para Vercel.

---

## 🌐 CONFIGURAR VARIABLES EN VERCEL

### Paso 1: Ve a tu proyecto en Vercel

1. Abre [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **Takopi**
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Agregar Variables

Agrega **TODAS** estas variables. Para cada una:
- Marca: ✅ **Production** ✅ **Preview** ✅ **Development**

#### 🗄️ Database (Neon Postgres)

```bash
POSTGRES_URL
postgresql://neondb_owner:npg_SQsIKyJuP82k@ep-spring-cherry-ac9fenm4-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_PRISMA_URL
postgresql://neondb_owner:npg_SQsIKyJuP82k@ep-spring-cherry-ac9fenm4-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

POSTGRES_URL_NON_POOLING
postgresql://neondb_owner:npg_SQsIKyJuP82k@ep-spring-cherry-ac9fenm4.sa-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_USER
neondb_owner

POSTGRES_HOST
ep-spring-cherry-ac9fenm4-pooler.sa-east-1.aws.neon.tech

POSTGRES_PASSWORD
npg_SQsIKyJuP82k

POSTGRES_DATABASE
neondb
```

#### 📦 Blob Storage (TakopiBlob)

```bash
BLOB_READ_WRITE_TOKEN
vercel_blob_rw_GXY4jVwVB9Jmk81J_DtnUHflhVKUs7k7D1AMlNpuVhGK4UJ
```

#### 🔐 Auth (USAR SECRETOS GENERADOS ARRIBA)

```bash
JWT_SECRET
<pega_el_secreto_que_generaste_con_openssl>

NEXTAUTH_SECRET
<pega_el_segundo_secreto_que_generaste>

NEXT_PUBLIC_BASE_URL
https://takopi.vercel.app

NEXTAUTH_URL
https://takopi.vercel.app
```

**⚠️ IMPORTANTE**: Reemplaza `takopi.vercel.app` con tu URL real de Vercel cuando la tengas.

#### 💳 Transbank (Sandbox para testing)

```bash
TRANSBANK_COMMERCE_CODE
597055555532

TRANSBANK_API_KEY
579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

TRANSBANK_ENVIRONMENT
integration
```

**Para producción real**: Obtén credenciales en [Transbank Developers](https://www.transbankdevelopers.cl/) y cambia `TRANSBANK_ENVIRONMENT` a `production`.

---

## 📤 HACER DEPLOY

### Opción 1: Push desde Git (Recomendado)

```bash
# Asegúrate de estar en la rama correcta
git status

# Agrega todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: production ready with Neon + Vercel Blob"

# Push a GitHub
git push origin main
```

Vercel detectará el push y deployará automáticamente 🚀

### Opción 2: Deploy Manual desde Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Click en **"Deployments"**
3. Click en **"Deploy"** → **"Deploy from Git"**

---

## ✅ VERIFICAR DEPLOY

### 1. Esperar Build

En Vercel Dashboard verás:
- 🔵 Building...
- ✅ Ready (cuando termine)

Si hay errores:
- Click en el deployment
- Ve a **"Build Logs"**
- Revisa los errores

### 2. Probar en Producción

Abre tu URL de Vercel: `https://tu-proyecto.vercel.app`

**Checklist**:
- [ ] Homepage carga correctamente
- [ ] `/auth/login` muestra formulario
- [ ] Login con `admin@takopi.dev` / `password123`
- [ ] `/explore` muestra contenido
- [ ] `/search` funciona
- [ ] Profile del usuario funciona

### 3. Probar Upload (Blob)

1. Login con credenciales seed
2. Ve a `/upload`
3. Sube un archivo de prueba
4. Verifica que se suba a Vercel Blob (debe funcionar automáticamente)

### 4. Probar Transbank (Sandbox)

1. Agrega contenido al carrito
2. Ve a checkout
3. Click en "Pagar con Webpay"
4. Usa tarjeta de prueba de Transbank
5. Verifica que la transacción se complete

---

## 🐛 TROUBLESHOOTING

### Build falla en Vercel

**Síntoma**: Deploy muestra error en build

**Solución**:
1. Ve a Deployments → Click en el deployment fallido
2. Lee los logs
3. Verifica que **TODAS** las variables de entorno estén configuradas
4. Común: Falta `POSTGRES_PRISMA_URL` o `BLOB_READ_WRITE_TOKEN`

### "Database connection failed"

**Solución**:
1. Verifica que las URLs de Neon estén correctas en Vercel
2. Asegúrate de usar `POSTGRES_PRISMA_URL` (con pooling)
3. Revisa que las credenciales no tengan espacios extras

### "BLOB_READ_WRITE_TOKEN invalid"

**Solución**:
1. Ve a Vercel Dashboard → Storage → Blob → TakopiBlob
2. Regenera el token si es necesario
3. Actualiza en Environment Variables

### "Missing JWT_SECRET"

**Solución**:
1. Genera secreto: `openssl rand -base64 32`
2. Agrégalo en Vercel Environment Variables
3. Redeploy

### Login no funciona en producción

**Solución**:
1. Verifica que `NEXTAUTH_URL` sea `https://tu-dominio.vercel.app`
2. Verifica que `NEXT_PUBLIC_BASE_URL` coincida
3. Asegúrate de que ambas sean HTTPS (no HTTP)

---

## 📊 COMANDOS POST-DEPLOY

### Si necesitas ejecutar comandos en producción

```bash
# Descargar variables de entorno de Vercel
vercel env pull

# Ver base de datos en producción
npx prisma studio

# Re-sincronizar schema (solo si cambiaste modelos)
npx prisma db push

# Re-poblar datos (solo si DB está vacía)
npx prisma db seed
```

---

## 🎉 SIGUIENTE NIVEL

### Optimizaciones Opcionales

1. **Dominio Custom**
   - Vercel Settings → Domains
   - Agrega tu dominio propio

2. **Analytics**
   - Vercel Analytics (automático)
   - Google Analytics

3. **Monitoring**
   - Sentry para error tracking
   - Vercel Logs para monitoreo

4. **Transbank Producción**
   - Solicita credenciales en Transbank
   - Actualiza variables de entorno
   - Cambia `TRANSBANK_ENVIRONMENT` a `production`

5. **Performance**
   - Revisar Lighthouse score
   - Optimizar imágenes
   - Configurar CDN para Blob

---

## 📝 RESUMEN EJECUTIVO

### ✅ Completado
- Neon Postgres configurado y sincronizado
- Vercel Blob configurado (TakopiBlob)
- Build local exitoso
- Variables de entorno documentadas
- 3 usuarios seed creados
- 5 contenidos seed creados

### 📤 Listo para Deploy
1. Generar secretos JWT (`openssl rand -base64 32`)
2. Configurar variables en Vercel
3. Push a GitHub
4. Verificar deploy

### 🎯 Credenciales Seed
```
admin@takopi.dev / password123
artist@takopi.dev / password123
maker@takopi.dev / password123
```

---

**Última actualización**: 18 Noviembre 2025  
**Status**: 🟢 Production Ready  
**Database**: Neon Postgres (sa-east-1)  
**Storage**: Vercel Blob (TakopiBlob)  
**Build**: ✅ Exitoso  

¡Estás listo para deploy! 🚀
