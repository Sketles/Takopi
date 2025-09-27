# 📋 Contexto de Arquitectura - Takopi

## 🎯 Visión General del Proyecto

**Takopi** es una plataforma de comercio digital creativo que combina marketplace de contenido 3D, cultura urbana y tecnología de vanguardia. Es un ecosistema digital revolucionario para modelos 3D, activos digitales y comunidades creativas.

### Características Principales
- **Marketplace 3D**: Compra y venta de modelos con licencias claras (Personal, Indie, Pro)
- **Descubrimiento Estilo Pinterest**: Descubrimiento visual con algoritmos de afinidad
- **Perfiles de Creadores**: Perfiles basados en roles (Artista, Explorador, Comprador, Maker)
- **Mapeo Cultural**: Mapeo comunitario de tribus urbanas y eventos
- **Orbes Misteriosos**: Paquetes sorpresa que se revelan después de la compra
- **Chatbot IA**: Asistente inteligente para consultas y soporte
- **Impresión 3D**: Servicio de impresión bajo demanda con seguimiento en tiempo real

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend:
├── Next.js 15.5.3 (App Router)
├── React 19.1.0
├── TypeScript 5
├── TailwindCSS v4
└── Geist Fonts (Google Fonts)

Backend:
├── Next.js API Routes
├── MongoDB (Atlas + Local)
├── Mongoose ODM
├── JWT Authentication
└── bcryptjs (Password Hashing)

File Handling:
├── Multer (File Upload)
├── Node.js File System
└── Public Directory Structure

Development:
├── ESLint 9
├── PostCSS
├── Cross-env
└── Puppeteer (Testing)
```

### Configuración de Base de Datos

```typescript
// Soporte Multi-Entorno
DB_MODE:
├── 'local' → mongodb://localhost:27017/takopi_dev
├── 'atlas' → MongoDB Atlas (Producción)
└── 'auto' → Auto-detección según disponibilidad

// Variables de Entorno
MONGODB_URI=mongodb+srv://takopi_app:password@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos
JWT_SECRET=clave_jwt_super_secreta
NEXTAUTH_SECRET=clave_nextauth_super_secreta
NEXTAUTH_URL=http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
takopi/
├── 📁 src/                           # Código fuente principal
│   ├── 📁 app/                       # Next.js App Router
│   │   ├── 📄 layout.tsx            # Layout raíz con AuthProvider
│   │   ├── 📄 page.tsx              # Página principal
│   │   ├── 📄 globals.css           # Estilos globales TailwindCSS
│   │   │
│   │   ├── 📁 api/                  # API Routes (Backend)
│   │   │   ├── 📁 auth/             # Autenticación
│   │   │   │   ├── 📁 login/        # POST /api/auth/login
│   │   │   │   └── 📁 register/     # POST /api/auth/register
│   │   │   │
│   │   │   ├── 📁 content/          # Gestión de contenido
│   │   │   │   ├── 📄 route.ts      # CRUD contenido
│   │   │   │   ├── 📁 explore/      # GET /api/content/explore
│   │   │   │   └── 📁 [id]/         # GET/PUT /api/content/[id]
│   │   │   │
│   │   │   ├── 📁 upload/           # Subida de archivos
│   │   │   │   └── 📄 route.ts      # POST /api/upload
│   │   │   │
│   │   │   ├── 📁 user/             # Gestión de usuarios
│   │   │   │   ├── 📁 profile/      # GET/PUT /api/user/profile
│   │   │   │   ├── 📁 creations/    # GET /api/user/creations
│   │   │   │   └── 📁 stats/        # GET /api/user/stats
│   │   │   │
│   │   │   └── 📁 files/            # Servir archivos
│   │   │       └── 📁 [...path]/    # GET /api/files/[...path]
│   │   │
│   │   ├── 📁 auth/                 # Páginas de autenticación
│   │   │   ├── 📁 login/            # /auth/login
│   │   │   └── 📁 register/         # /auth/register
│   │   │
│   │   ├── 📁 explore/              # Exploración de contenido
│   │   │   └── 📄 page.tsx          # /explore
│   │   │
│   │   ├── 📁 profile/              # Perfil de usuario
│   │   │   └── 📄 page.tsx          # /profile
│   │   │
│   │   ├── 📁 upload/               # Subida de contenido
│   │   │   └── 📄 page.tsx          # /upload
│   │   │
│   │   └── 📁 test-model/           # Testing 3D
│   │       └── 📄 page.tsx          # /test-model
│   │
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 auth/                 # Componentes de autenticación
│   │   │   └── 📄 ProtectedRoute.tsx
│   │   │
│   │   ├── 📁 profile/              # Componentes de perfil
│   │   │   ├── 📄 InlineEditor.tsx
│   │   │   ├── 📄 ProfileEditor.tsx
│   │   │   └── 📄 RoleSelector.tsx
│   │   │
│   │   ├── 📁 shared/               # Componentes compartidos
│   │   │   ├── 📄 Header.tsx        # Navegación principal
│   │   │   ├── 📄 Footer.tsx        # Pie de página
│   │   │   ├── 📄 Layout.tsx        # Layout wrapper
│   │   │   └── 📄 DefaultCover.tsx  # Portadas por defecto
│   │   │
│   │   ├── 📄 CardPreview.tsx       # Preview de contenido
│   │   ├── 📄 ModelViewer3D.tsx     # Visor 3D
│   │   ├── 📄 ProductDetailModal.tsx # Modal de detalles
│   │   ├── 📄 ProductDetailProfile.tsx # Detalles en perfil
│   │   └── 📄 ProductEditor.tsx     # Editor de productos
│   │
│   ├── 📁 contexts/                 # Contextos React
│   │   └── 📄 AuthContext.tsx       # Contexto de autenticación
│   │
│   ├── 📁 models/                   # Modelos de MongoDB
│   │   ├── 📄 User.ts               # Modelo de Usuario
│   │   └── 📄 Content.ts            # Modelo de Contenido
│   │
│   ├── 📁 config/                   # Configuraciones
│   │   ├── 📄 database.ts           # Config BD multi-entorno
│   │   └── 📄 env.ts                # Variables de entorno
│   │
│   ├── 📁 lib/                      # Utilidades
│   │   ├── 📄 mongodb.ts            # Conexión MongoDB
│   │   └── 📄 multer.ts             # Configuración Multer
│   │
│   └── 📁 middleware/               # Middleware
│       └── 📄 auth.ts               # Middleware de autenticación
│
├── 📁 public/                       # Archivos estáticos
│   ├── 📁 models/                   # Modelos 3D de ejemplo
│   │   ├── 📄 cubo-realista.glb
│   │   ├── 📄 personaje-tpose.glb
│   │   └── 📄 robot-basico.glb
│   │
│   ├── 📁 placeholders/             # Imágenes placeholder
│   │   ├── 📄 placeholder-3d.jpg
│   │   ├── 📄 placeholder-avatar.jpg
│   │   └── 📄 placeholder-texture.jpg
│   │
│   └── 📁 uploads/                  # Archivos subidos por usuarios
│       ├── 📁 content/              # Contenido por tipo
│       │   ├── 📁 avatares/         # Archivos .glb/.vrm
│       │   ├── 📁 modelos3d/        # Archivos .glb/.gltf
│       │   ├── 📁 musica/           # Archivos .mp3/.wav
│       │   ├── 📁 texturas/         # Archivos .png/.jpg
│       │   ├── 📁 animaciones/      # Archivos .mp4
│       │   ├── 📁 OBS/              # Archivos .html/.js
│       │   └── 📁 colecciones/      # Archivos .zip
│       │
│       ├── 📁 covers/               # Imágenes de portada
│       ├── 📁 temp/                 # Archivos temporales
│       └── 📁 users/                # Archivos de usuario
│
├── 📁 scripts/                      # Scripts de automatización
│   ├── 📄 setup-local-db.js         # Configurar BD local
│   ├── 📄 seed-local-data.js        # Datos de prueba
│   ├── 📄 create-user.js            # Crear usuario
│   ├── 📄 create-env-local.js       # Crear .env.local
│   └── 📄 deploy-vercel.js          # Deploy a Vercel
│
├── 📁 tests/                        # Testing automatizado
│   ├── 📄 automated-navigation-test.js
│   ├── 📄 automated-upload-test.js
│   ├── 📄 run-automated-tests.js
│   └── 📁 sample-files/             # Archivos de prueba
│
├── 📁 Sushinapan/                   # Documentación del proyecto
│   ├── 📄 DESARROLLO_BD_GUIA.md
│   ├── 📄 ESCALABILIDAD_HOSTING.md
│   ├── 📄 PLAN_APT.md
│   ├── 📄 SETUP_ENV.md
│   └── 📄 SISTEMA_ARCHIVOS.md
│
├── 📄 package.json                  # Dependencias y scripts
├── 📄 next.config.ts                # Configuración Next.js
├── 📄 tailwind.config.js            # Configuración TailwindCSS
├── 📄 tsconfig.json                 # Configuración TypeScript
└── 📄 .env.local                    # Variables de entorno (local)
```

---

## 🔧 Funcionalidades y Servicios

### 1. Sistema de Autenticación

```typescript
// AuthContext.tsx - Gestión de estado global
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// API Endpoints:
POST /api/auth/login     # Autenticación con JWT
POST /api/auth/register  # Registro de nuevos usuarios
```

**Características:**
- Autenticación JWT con expiración configurable
- Encriptación de contraseñas con bcryptjs (saltRounds: 12)
- Validación de email único y username único
- Roles de usuario: Explorer, Artist, Buyer, Maker
- Persistencia en localStorage
- Protección de rutas con ProtectedRoute

### 2. Gestión de Contenido

```typescript
// Modelo Content.ts
interface IContent {
  // Información básica
  title: string;
  description: string;
  contentType: 'avatares' | 'modelos3d' | 'musica' | 'texturas' | 'animaciones' | 'OBS' | 'colecciones';
  
  // Archivos
  files: IContentFile[];
  coverImage?: string;
  
  // Monetización
  price: number;
  isFree: boolean;
  currency: string;
  license: 'personal' | 'commercial' | 'streaming' | 'royalty-free' | 'custom';
  
  // Metadatos
  tags: string[];
  visibility: 'public' | 'unlisted' | 'draft';
  status: 'draft' | 'published' | 'archived' | 'rejected';
  
  // Autor
  author: ObjectId;
  authorUsername: string;
  
  // Estadísticas
  views: number;
  downloads: number;
  likes: number;
  favorites: number;
}
```

**API Endpoints:**
```
GET    /api/content              # Listar contenido con filtros
POST   /api/content              # Crear nuevo contenido
GET    /api/content/[id]         # Obtener contenido específico
PUT    /api/content/[id]         # Actualizar contenido
GET    /api/content/explore      # Explorar contenido público
```

### 3. Sistema de Subida de Archivos

```typescript
// Configuración Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const contentType = req.body?.contentType || 'temp';
      const uploadPath = path.join(process.cwd(), 'public/uploads/content', contentType);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `file-${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, filename);
    }
  })
});
```

**Tipos de Contenido Soportados:**
- **Avatares**: .glb, .gltf, .vrm (máx 50MB)
- **Modelos 3D**: .glb, .gltf (máx 100MB)
- **Música**: .mp3, .wav, .ogg, .flac (máx 25MB)
- **Texturas**: .png, .jpg, .psd, .tiff (máx 10MB)
- **Animaciones**: .mp4, .webm, .mov (máx 100MB)
- **OBS**: .html, .js, .css (máx 5MB)
- **Colecciones**: .zip, .rar (máx 500MB)

### 4. Sistema de Usuarios

```typescript
// Modelo User.ts
interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'Explorer' | 'Artist' | 'Buyer' | 'Maker';
  avatar?: string;
  banner?: string;
  bio?: string;
  
  // Relaciones
  purchases: ObjectId[];
  models: ObjectId[];
  likedModels: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**API Endpoints:**
```
GET    /api/user/profile          # Obtener perfil del usuario
PUT    /api/user/profile          # Actualizar perfil
GET    /api/user/creations        # Obtener creaciones del usuario
GET    /api/user/stats            # Estadísticas del usuario
```

### 5. Sistema de Exploración

La página `/explore` implementa un sistema de descubrimiento tipo Pinterest con:
- Filtros por tipo de contenido
- Búsqueda por texto
- Ordenamiento por popularidad, fecha, precio
- Paginación infinita
- Preview en tiempo real

---

## 🔄 Flujos de Trabajo Principales

### 1. Flujo de Registro/Login
```
1. Usuario accede a /auth/register o /auth/login
2. Formulario valida datos en frontend
3. POST request a /api/auth/register o /api/auth/login
4. Backend valida datos y crea/autentica usuario
5. JWT token generado y devuelto
6. AuthContext actualiza estado global
7. Usuario redirigido a /profile o /explore
```

### 2. Flujo de Subida de Contenido
```
1. Usuario accede a /upload
2. Selecciona tipo de contenido
3. Sube archivos (drag & drop o selector)
4. Completa metadatos (título, descripción, precio, etc.)
5. POST request a /api/upload con FormData
6. Archivos guardados en public/uploads/content/[tipo]/
7. Metadatos guardados en MongoDB
8. Usuario redirigido a /profile para ver su creación
```

### 3. Flujo de Exploración
```
1. Usuario accede a /explore
2. Frontend hace GET request a /api/content/explore
3. Backend consulta MongoDB con filtros
4. Datos transformados y devueltos con paginación
5. Frontend renderiza grid de contenido
6. Click en item abre ProductDetailModal
7. Modal muestra preview (3D viewer, audio player, etc.)
```

### 4. Flujo de Autenticación en APIs
```
1. Request llega a API route protegida
2. Middleware extrae JWT del header Authorization
3. JWT verificado con jsonwebtoken
4. Si válido, request continúa con userId en contexto
5. Si inválido, response 401 Unauthorized
```

---

## 🗄️ Base de Datos

### Configuración Multi-Entorno
```typescript
// database.ts
export const DB_MODE = {
  LOCAL: 'local',      // MongoDB local en puerto 27017
  ATLAS: 'atlas',      // MongoDB Atlas (producción)
  AUTO: 'auto'         // Automático según disponibilidad
} as const;
```

### Colecciones Principales

#### users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['Explorer', 'Artist', 'Buyer', 'Maker']),
  avatar: String,
  banner: String,
  bio: String,
  purchases: [ObjectId],
  models: [ObjectId],
  likedModels: [ObjectId],
  followers: [ObjectId],
  following: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### contents
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  contentType: String (enum: ['avatares', 'modelos3d', 'musica', 'texturas', 'animaciones', 'OBS', 'colecciones']),
  files: [{
    name: String,
    originalName: String,
    size: Number,
    type: String,
    url: String,
    previewUrl: String
  }],
  coverImage: String,
  price: Number,
  isFree: Boolean,
  currency: String,
  license: String,
  tags: [String],
  visibility: String,
  status: String,
  author: ObjectId (ref: 'users'),
  authorUsername: String,
  views: Number,
  downloads: Number,
  likes: Number,
  favorites: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Índices para Performance
```javascript
// Users
{ email: 1 }
{ username: 1 }
{ role: 1 }

// Contents
{ author: 1, status: 1 }
{ contentType: 1, status: 1 }
{ category: 1, subcategory: 1 }
{ tags: 1 }
{ price: 1, isFree: 1 }
{ createdAt: -1 }
{ views: -1 }
{ likes: -1 }
```

---

## 🎨 Frontend y UI/UX

### Diseño System
- **Tipografía**: Geist Sans (principal), Geist Mono (código)
- **Colores**: Sistema de colores TailwindCSS con modo oscuro
- **Componentes**: Componentes reutilizables con TypeScript
- **Responsive**: Mobile-first design
- **Animaciones**: Transiciones suaves con TailwindCSS

### Componentes Clave

#### ModelViewer3D
```typescript
// Componente para visualizar modelos 3D
interface ModelViewer3DProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
  cameraControls?: boolean;
}
```

#### CardPreview
```typescript
// Componente para preview de contenido en grid
interface CardPreviewProps {
  content: {
    id: string;
    title: string;
    author: string;
    type: string;
    image: string;
    price: string;
    likes: number;
  };
  onClick: () => void;
}
```

#### ProductDetailModal
```typescript
// Modal para mostrar detalles completos del contenido
interface ProductDetailModalProps {
  content: IContent;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}
```

---

## 🚀 Scripts y Automatización

### Scripts de Desarrollo
```json
{
  "dev": "next dev",                    // Servidor de desarrollo
  "dev:local": "cross-env DB_MODE=local next dev",     // BD local
  "dev:atlas": "cross-env DB_MODE=atlas next dev",     // BD Atlas
  "dev:auto": "cross-env DB_MODE=auto next dev",       // Auto-detección
  "build": "next build",                // Build de producción
  "start": "next start",                // Servidor de producción
  "lint": "eslint"                      // Linting
}
```

### Scripts de Base de Datos
```json
{
  "setup:local-db": "node scripts/setup-local-db.js",     // Configurar BD local
  "seed:local": "node scripts/seed-local-data.js",        // Datos de prueba
  "create:user": "node scripts/create-user.js",           // Crear usuario
  "create:env": "node scripts/create-env-local.js",       // Crear .env.local
  "db:reset": "npm run seed:local",                       // Reset BD
  "db:reset-all": "npm run seed:local && npm run seed:content"
}
```

### Scripts de Testing
```json
{
  "test:all": "node tests/run-automated-tests.js all",    // Todos los tests
  "test:nav": "node tests/run-automated-tests.js nav",    // Test navegación
  "test:upload": "node tests/run-automated-tests.js upload" // Test subida
}
```

---

## 🔐 Seguridad

### Autenticación
- JWT tokens con expiración configurable
- Passwords hasheados con bcryptjs (saltRounds: 12)
- Validación de tokens en middleware
- Protección de rutas sensibles

### Validación de Archivos
- Tipos de archivo permitidos por categoría
- Límites de tamaño por tipo de contenido
- Sanitización de nombres de archivo
- Verificación de MIME types

### Variables de Entorno
- Todas las claves sensibles en variables de entorno
- Archivos .env en .gitignore
- Configuración separada por entorno

---

## 📊 Monitoreo y Logging

### Logs del Servidor
```typescript
// Ejemplo de logging en APIs
console.log(`📤 Subiendo ${files.length} archivos de tipo: ${contentType}`);
console.log(`✅ Archivo subido: ${uploadedFile.url}`);
console.log(`✅ MongoDB conectado exitosamente (modo: ${mode})`);
```

### Métricas de Performance
- Contador de views por contenido
- Estadísticas de descargas
- Sistema de likes/favorites
- Tracking de usuarios activos

---

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Variables de entorno en Vercel Dashboard
MONGODB_URI=mongodb+srv://...
JWT_SECRET=clave_super_secreta
NEXTAUTH_SECRET=clave_nextauth_secreta
NEXTAUTH_URL=https://tu-dominio.vercel.app

# Deploy automático desde main branch
npm run deploy:vercel
```

### Scripts de Deploy
```javascript
// deploy-vercel.js
// Script automatizado para deployment a Vercel
// Configura variables de entorno
// Ejecuta build de producción
// Deploy con configuración optimizada
```

---

## 🔮 Roadmap y Próximas Funcionalidades

### Fase Actual (Completada)
- ✅ Estructura base del proyecto
- ✅ Sistema de autenticación JWT
- ✅ CRUD de contenido
- ✅ Sistema de subida de archivos
- ✅ Exploración de contenido
- ✅ Perfiles de usuario
- ✅ Base de datos MongoDB

### Próximas Fases
- 🔄 Integración con OpenAI (Chatbot)
- 🔄 Sistema de pagos (Stripe)
- 🔄 Visor 3D mejorado (Three.js)
- 🔄 Sistema de comentarios y reviews
- 🔄 Notificaciones en tiempo real
- 🔄 Sistema de orbes misteriosos
- 🔄 Mapa cultural interactivo
- 🔄 API pública para desarrolladores

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar proyecto
npm install
npm run create:env
npm run dev

# Cambiar modo de BD
npm run dev:local    # BD local
npm run dev:atlas    # BD Atlas
npm run dev:auto     # Auto-detección

# Resetear BD
npm run db:reset
npm run db:reset-all
```

### Testing
```bash
# Ejecutar tests automatizados
npm run test:all
npm run test:nav
npm run test:upload

# Crear usuario de prueba
npm run create:test-user
```

### Producción
```bash
# Build y deploy
npm run build
npm run start

# Deploy a Vercel
npm run deploy:vercel
```

---

## 📞 Soporte y Documentación

### Archivos de Documentación
- `README.md` - Documentación principal del proyecto
- `Sushinapan/PLAN_APT.md` - Planificación del proyecto de tesis
- `Sushinapan/SETUP_ENV.md` - Guía de configuración de entorno
- `Sushinapan/SISTEMA_ARCHIVOS.md` - Documentación del sistema de archivos
- `Sushinapan/ESCALABILIDAD_HOSTING.md` - Guía de escalabilidad

### Recursos Externos
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [Model Viewer](https://modelviewer.dev/)

---

*Documentación generada automáticamente para contexto de IA - Takopi Project 2025*
