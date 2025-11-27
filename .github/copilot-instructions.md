# Takopi - Marketplace Digital

## Descripción del Proyecto

Takopi es un marketplace de contenido digital (modelos 3D, música, arte digital) con servicio de impresión 3D integrado. Los creadores suben contenido, los usuarios compran y descargan, y opcionalmente pueden solicitar impresión física de modelos 3D.

## Stack Tecnológico

- **Framework:** Next.js 15.5.3 (App Router + Turbopack)
- **Lenguaje:** TypeScript 5
- **Base de Datos:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma 6.19.0
- **Autenticación:** NextAuth.js
- **Almacenamiento:** Vercel Blob Storage
- **Pagos:** Transbank Webpay Plus (Chile)
- **Deployment:** Vercel
- **Testing:** Playwright

## URLs y Repositorio

- **Producción:** `https://takopi-nine.vercel.app`
- **GitHub:** `https://github.com/Sketles/Takopi`
- **Rama principal:** `master`
- **Rama de desarrollo:** `developer`

## Comandos Principales

```bash
# Desarrollo
npm run dev              # Inicia dev server (http://localhost:3000)

# Base de datos
npx prisma migrate dev   # Aplica migraciones en desarrollo
npx prisma db push       # Sincroniza schema sin migración
npx prisma studio        # UI para explorar DB

# Producción
npm run build            # Build para producción
npm start                # Inicia servidor producción
```

## Estructura del Proyecto

```
takopi/
├── src/
│   ├── app/              # Next.js App Router (páginas + API routes)
│   ├── components/       # Componentes React reutilizables
│   ├── features/         # Features con Clean Architecture (domain/data)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilidades (prisma client, logger, blob)
│   └── types/            # TypeScript types globales
├── prisma/
│   └── schema.prisma     # Schema de base de datos
└── public/               # Assets estáticos
```

## Instrucciones Especializadas

Este proyecto usa múltiples archivos de instrucciones especializadas. Revisa estos archivos según el contexto:

- **Base de Datos:** `.github/database.instructions.md` - Schemas Prisma, relaciones, edge cases críticos
- **Clean Architecture:** `.github/clean-architecture.instructions.md` - UseCases, Repositories, patrón del proyecto
- **UI/Diseño:** `.github/ui-design.instructions.md` - Sistema de diseño, componentes reutilizables

## Principios de Desarrollo

### Arquitectura
1. **Clean Architecture:** Usa UseCases → Repository → Prisma (NUNCA Prisma directo en API routes)
2. **Server Components por defecto:** Usa `'use client'` solo cuando sea necesario (hooks, eventos, estado)
3. **Rutas absolutas:** SIEMPRE usa `@/` para imports (ej: `@/components/...`, `@/features/...`)

### TypeScript
4. **TypeScript First:** Todo el código debe tener tipos explícitos
5. **No usar `any`:** Prefiere `unknown` o tipos específicos
6. **Prisma types:** Usa tipos generados de Prisma, NO los redefinas

### Base de Datos
7. **Prisma DB-First:** La base de datos es la fuente de verdad
8. **Email normalizado:** SIEMPRE lowercase y trim() antes de queries a User
9. **Soft deletes:** Usa `deletedAt` para eliminación lógica cuando aplique

### Error Handling
10. **API routes:** Siempre maneja errores con try/catch y NextResponse
11. **Status codes:** Usa códigos HTTP correctos (404, 400, 401, 500)
12. **Logs:** Usa console.error con prefijo emoji para errores (❌, ⚠️, ✅)

## Traps Comunes (NO COMETER ESTOS ERRORES)

### Base de Datos
- ❌ **Purchase.amount** → ✅ **Purchase.price** (el campo correcto es `price`)
- ❌ **User.name** → ✅ **User.username** (no existe campo `name`)
- ❌ **Content.author** directo → ✅ **Content.author.username** (es relación, no string)
- ❌ Email sin normalizar → ✅ `email.toLowerCase().trim()` antes de queries

### Arquitectura
- ❌ Prisma directo en API routes → ✅ Usar UseCases y Repositories
- ❌ `import prisma from '@/lib/prisma'` en routes → ✅ Inyectar via Repository
- ❌ Lógica de negocio en API routes → ✅ Lógica en UseCases

### TypeScript
- ❌ `any` → ✅ Tipos específicos o `unknown`
- ❌ Imports relativos `../../` → ✅ `@/components/...`
- ❌ `'use client'` innecesario → ✅ Solo cuando uses hooks/eventos

### Storage
- ❌ Filesystem local (`fs`) → ✅ Vercel Blob Storage (`@vercel/blob`)
- ❌ Guardar archivos en `/public` → ✅ Upload a Blob, guardar URL en DB

## Variables de Entorno Críticas

```bash
# Database (Neon PostgreSQL)
POSTGRES_PRISMA_URL=          # Connection pooling URL
POSTGRES_URL_NON_POOLING=     # Direct connection URL

# NextAuth
NEXTAUTH_SECRET=              # Secret para JWT
NEXTAUTH_URL=                 # URL de la app

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=        # Token para uploads

# Transbank Webpay (Chile)
TRANSBANK_COMMERCE_CODE=      # Código de comercio
TRANSBANK_API_KEY=            # API key
TRANSBANK_RETURN_URL=         # URL de retorno post-pago
```

**NUNCA hardcodees estas variables, siempre usa `process.env.VARIABLE_NAME`**
