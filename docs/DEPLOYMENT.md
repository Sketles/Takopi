# Takopi - Marketplace Digital

Plataforma Next.js 15 para compartir y vender contenido digital (modelos 3D, música, texturas, avatares, etc.) con integración de Transbank para pagos.

## 🚀 Stack Tecnológico

- **Next.js 15.5.3** - Framework React con App Router
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **TailwindCSS v4** - Estilos
- **Prisma** - ORM para base de datos
- **Vercel Postgres** - Base de datos SQL en producción
- **Vercel Blob** - Almacenamiento de archivos
- **Transbank SDK** - Pasarela de pagos (Chile)
- **JWT + bcryptjs** - Autenticación

## 📁 Arquitectura

El proyecto sigue Clean Architecture con separación en capas:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── (pages)/           # Páginas de la aplicación
├── features/              # Módulos por dominio
│   ├── auth/
│   │   ├── domain/       # Entidades e interfaces
│   │   ├── application/  # Casos de uso
│   │   └── data/         # Repositorios e implementaciones
│   ├── content/
│   ├── payment/
│   └── ...
├── lib/                   # Utilidades compartidas
│   ├── prisma.ts         # Cliente Prisma
│   └── blob.ts           # Helpers Vercel Blob
└── config/               # Configuración
    └── env.ts            # Variables de entorno
```

## 🔧 Instalación Local

### Prerrequisitos

- Node.js 18+
- PostgreSQL (local o conexión a Vercel Postgres)
- Cuenta en Vercel (para Blob Storage)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd takopi
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia `.env.example` a `.env` y configura:

```bash
# Database (Vercel Postgres)
POSTGRES_URL="postgres://user:password@localhost:5432/takopi"
POSTGRES_PRISMA_URL="postgres://user:password@localhost:5432/takopi?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://user:password@localhost:5432/takopi"

# Blob Storage (obtener de Vercel Dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"

# Auth
JWT_SECRET="tu-secreto-jwt-cambiar-en-produccion"
NEXTAUTH_SECRET="tu-secreto-nextauth-cambiar-en-produccion"

# Transbank (sandbox por defecto)
TRANSBANK_COMMERCE_CODE="597055555532"
TRANSBANK_API_KEY="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
TRANSBANK_ENVIRONMENT="development"
```

4. **Generar cliente Prisma**
```bash
npx prisma generate
```

5. **Crear base de datos y tablas**
```bash
npx prisma db push
```

6. **Poblar base de datos con datos iniciales**
```bash
npx prisma db seed
```

Esto creará 3 usuarios de prueba:
- `admin@takopi.dev` / `password123`
- `artist@takopi.dev` / `password123`
- `maker@takopi.dev` / `password123`

7. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment en Vercel

### 1. Crear Base de Datos Postgres

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Storage → Create → Postgres
3. Copia las variables de entorno generadas

### 2. Crear Blob Storage

1. Storage → Create → Blob
2. Copia el `BLOB_READ_WRITE_TOKEN`

### 3. Deploy desde GitHub

1. Conecta tu repositorio en Vercel
2. Configura las variables de entorno en Vercel Dashboard:
   - Todas las variables de `.env.example`
   - Las URLs de Postgres (auto-generadas por Vercel)
   - El token de Blob Storage
   - Tus secretos JWT (usa valores seguros en producción)
   - Credenciales Transbank de producción

3. Deploy automático al hacer push a `main`

### 4. Ejecutar Migraciones y Seed

Después del primer deploy:

```bash
# Desde tu terminal local (conectado a producción)
vercel env pull
npx prisma db push
npx prisma db seed
```

O desde Vercel CLI:

```bash
vercel env pull
npx prisma generate
npx prisma db push
```

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios (Explorer, Artist, Buyer, Maker)
- **Content**: Contenido digital (modelos 3D, música, texturas, etc.)
- **Comment**: Comentarios en contenido
- **Like**: Likes a contenido
- **Follow**: Seguidores entre usuarios
- **Purchase**: Compras de contenido
- **Transaction**: Transacciones de Webpay

### Comandos Útiles

```bash
# Ver studio de Prisma (GUI)
npx prisma studio

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Resetear DB (solo desarrollo)
npx prisma migrate reset
```

## 💳 Transbank (Pagos)

### Modo Sandbox (Desarrollo)

Usa las credenciales incluidas en `.env.example`:
- Código de comercio: `597055555532`
- API Key: `579B532A...` (ver .env.example)

### Modo Producción

1. Obtén tus credenciales en [Transbank Portal](https://www.transbankdevelopers.cl/)
2. Actualiza en Vercel:
   - `TRANSBANK_COMMERCE_CODE=tu_codigo`
   - `TRANSBANK_API_KEY=tu_api_key`
   - `TRANSBANK_ENVIRONMENT=production`

## 📦 Scripts

```bash
npm run dev        # Desarrollo local
npm run build      # Build para producción
npm run start      # Servidor producción local
npm run lint       # ESLint
```

## 🔐 Seguridad

- ✅ JWT para autenticación
- ✅ Passwords hasheados con bcrypt
- ✅ Validación de tipos de archivo en uploads
- ✅ Variables de entorno para secrets
- ⚠️ Cambiar `JWT_SECRET` y `NEXTAUTH_SECRET` en producción
- ⚠️ Usar credenciales Transbank de producción

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Table does not exist"
```bash
npx prisma db push
```

### Upload falla en Vercel
Verifica que `BLOB_READ_WRITE_TOKEN` esté configurado correctamente.

### Transbank devuelve error
- En desarrollo: Verifica usar modo sandbox
- En producción: Verifica credenciales y que `returnUrl` sea HTTPS

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

## 👥 Contribución

Este proyecto está en desarrollo activo. Para contribuir, contacta al equipo.
