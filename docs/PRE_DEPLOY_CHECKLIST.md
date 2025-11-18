# ✅ Pre-Deployment Checklist - Takopi

Usa esta checklist antes de hacer deploy a Vercel.

---

## 📋 Local Development

### Instalación
- [ ] `npm install` ejecutado sin errores
- [ ] `npx prisma generate` completado
- [ ] `.env` creado con todas las variables
- [ ] Base de datos local o Vercel Postgres conectada

### Database
- [ ] `npx prisma db push` ejecutado exitosamente
- [ ] `npx prisma db seed` creó datos iniciales
- [ ] `npx prisma studio` muestra las tablas correctamente
- [ ] Al menos 3 usuarios creados
- [ ] Al menos 5 contenidos creados

### Build Local
- [ ] `npm run build` completa sin errores
- [ ] `npm run dev` inicia servidor correctamente
- [ ] Login funciona con credenciales seed
- [ ] Explorar muestra contenido
- [ ] Búsqueda devuelve resultados

---

## 🔐 Seguridad

### Variables de Entorno
- [ ] `JWT_SECRET` es único y seguro (min 32 chars)
- [ ] `NEXTAUTH_SECRET` es único y seguro (min 32 chars)
- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` está actualizado sin valores sensibles

### Credenciales Transbank
- [ ] Sandbox credentials para development
- [ ] Producción credentials obtenidas de Transbank
- [ ] `TRANSBANK_ENVIRONMENT` configurado correctamente

---

## 🌐 Vercel Setup

### Recursos Creados
- [ ] Vercel Postgres database creada
- [ ] Vercel Blob storage creada
- [ ] Variables de entorno copiadas de Vercel

### Environment Variables en Vercel
- [ ] `POSTGRES_URL`
- [ ] `POSTGRES_PRISMA_URL`
- [ ] `POSTGRES_URL_NON_POOLING`
- [ ] `POSTGRES_USER`
- [ ] `POSTGRES_HOST`
- [ ] `POSTGRES_PASSWORD`
- [ ] `POSTGRES_DATABASE`
- [ ] `BLOB_READ_WRITE_TOKEN`
- [ ] `JWT_SECRET` (generado con `openssl rand -base64 32`)
- [ ] `NEXTAUTH_SECRET` (generado con `openssl rand -base64 32`)
- [ ] `TRANSBANK_COMMERCE_CODE`
- [ ] `TRANSBANK_API_KEY`
- [ ] `TRANSBANK_ENVIRONMENT`

### Git Repository
- [ ] Repositorio conectado a Vercel
- [ ] Branch principal configurado (main/master)
- [ ] Auto-deploy activado

---

## 🗄️ Database Migration

### Pre-Deploy
- [ ] Schema Prisma está actualizado
- [ ] `npx prisma generate` ejecutado
- [ ] Migraciones pendientes verificadas

### Post-Deploy (Primera vez)
- [ ] `vercel env pull` ejecutado
- [ ] `npx prisma db push` en producción
- [ ] `npx prisma db seed` en producción
- [ ] Verificar datos en `npx prisma studio` (producción)

---

## 🚀 First Deploy

### Build
- [ ] Deploy iniciado desde Vercel dashboard
- [ ] Build completado sin errores
- [ ] No hay warnings críticos

### Verificación
- [ ] URL de producción accesible
- [ ] Homepage carga correctamente
- [ ] `/auth/login` muestra formulario
- [ ] `/explore` muestra contenido
- [ ] `/search` funciona

---

## 🧪 Testing en Producción

### Autenticación
- [ ] Registro de nuevo usuario funciona
- [ ] Login con usuario seed funciona
- [ ] JWT token se genera correctamente
- [ ] Logout funciona

### Contenido
- [ ] Explorar muestra contenido
- [ ] Detalle de contenido carga
- [ ] Búsqueda devuelve resultados
- [ ] Filtros funcionan

### Upload
- [ ] Upload de archivos a Vercel Blob funciona
- [ ] URLs de Blob son accesibles públicamente
- [ ] Imagen de portada se muestra
- [ ] Archivos se listan en contenido

### Social Features
- [ ] Dar like funciona
- [ ] Comentar funciona
- [ ] Seguir usuario funciona
- [ ] Contadores se actualizan

### Payments
- [ ] Webpay redirect funciona
- [ ] Sandbox transaction completa
- [ ] Return URL redirecciona correctamente
- [ ] Purchase se registra en DB

---

## 📊 Monitoring

### Logs
- [ ] Vercel Dashboard → Logs revisados
- [ ] No hay errores 500
- [ ] Queries Prisma funcionan
- [ ] Blob uploads exitosos

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Build size razonable

---

## 🔧 Troubleshooting Común

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Table does not exist"
```bash
npx prisma db push
```

### "BLOB_READ_WRITE_TOKEN invalid"
- Verificar token en Vercel Blob settings
- Regenerar si es necesario

### "Database connection failed"
- Verificar POSTGRES_PRISMA_URL
- Verificar POSTGRES_URL_NON_POOLING
- Revisar firewall/whitelist en Vercel

### "Transbank error"
- Verificar credenciales sandbox/production
- Verificar `returnUrl` es HTTPS
- Revisar logs de Transbank

---

## 📄 Documentación

### Archivos Creados
- [ ] `DEPLOYMENT.md` - Guía de deployment
- [ ] `MIGRATION_SUMMARY.md` - Resumen de migración
- [ ] `.env.example` - Template variables
- [ ] `prisma/seed.ts` - Datos iniciales
- [ ] Este checklist

### README Actualizado
- [ ] Instrucciones de instalación
- [ ] Comandos principales
- [ ] Estructura del proyecto
- [ ] Stack tecnológico

---

## ✨ Post-Deploy Tasks

### Configuración Adicional
- [ ] Configurar dominio custom (opcional)
- [ ] Configurar SSL (auto en Vercel)
- [ ] Configurar Analytics (opcional)
- [ ] Configurar Error tracking (Sentry)

### Content
- [ ] Crear contenido real de ejemplo
- [ ] Subir imágenes de portada
- [ ] Configurar categorías
- [ ] Poblar tags populares

### Marketing
- [ ] Configurar SEO metadata
- [ ] Configurar Open Graph images
- [ ] Configurar sitemap.xml
- [ ] Configurar robots.txt

---

## 🎯 Launch Checklist

### Critical
- [ ] Todas las variables de entorno configuradas
- [ ] Database seed ejecutado
- [ ] Login funciona
- [ ] Upload funciona
- [ ] Payments en modo correcto (sandbox/prod)

### Nice to Have
- [ ] Monitoring configurado
- [ ] Email notifications
- [ ] Admin panel
- [ ] Analytics

---

## 📞 Contactos

**Vercel Support**: https://vercel.com/support  
**Transbank Support**: https://www.transbankdevelopers.cl/  
**Prisma Docs**: https://www.prisma.io/docs

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0 - Production Ready
