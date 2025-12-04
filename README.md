<div align="center">

<img src="public/icons/takopi-logo.svg" alt="Takopi Logo" width="120" />

# TAKOPI

### Marketplace de Contenido Digital + IA Generativa 3D

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Plataforma integral para creadores: compra, vende y genera contenido digital con IA.**

[🚀 Demo en Vivo](https://takopi-nine.vercel.app) · [📖 Documentación](#-arquitectura) · [🐛 Reportar Bug](https://github.com/Sketles/Takopi/issues)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es Takopi?](#-qué-es-takopi)
- [Features Principales](#-features-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Arquitectura](#-arquitectura)
- [Roadmap](#️-roadmap)
- [Contribuir](#-contribuir)

---

## 🎯 ¿Qué es Takopi?

**Takopi** es un marketplace chileno de contenido digital que conecta creadores con compradores, ofreciendo una experiencia completa: desde la exploración y compra de assets hasta la generación de modelos 3D con inteligencia artificial y servicio de impresión 3D física.

### 🎪 Para Quién

| Audiencia | Uso Principal |
|-----------|---------------|
| 🎮 **Streamers** | Overlays, alertas, widgets OBS, música de fondo |
| 🗿 **Artistas 3D** | Modelos, texturas PBR, avatares, props |
| 🎵 **Productores** | Samples, loops, stems, presets |
| 🎬 **Editores** | LUTs, presets, scripts, transiciones |
| 🎨 **Diseñadores** | Ilustraciones, iconos, UI kits, mockups |
| 🕹️ **Game Devs** | Assets 3D, sprites, animaciones, shaders |

---

## ✨ Features Principales

### 🛒 Marketplace

<table>
<tr>
<td width="50%">

**Exploración Avanzada**
- Catálogo visual con filtros por categoría, precio y popularidad
- Búsqueda inteligente con sugerencias
- Previsualizadores integrados (3D, audio, imagen)
- Sistema de likes, comentarios y colecciones

</td>
<td width="50%">

**Compra Segura**
- Carrito de compras persistente
- Pagos con Transbank Webpay Plus (Chile)
- Descarga inmediata post-compra
- Historial completo de transacciones

</td>
</tr>
</table>

### 🎨 Creadores

- **Upload múltiple**: Sube varios archivos a la vez
- **Previsualización automática**: Modelos 3D, audio, texturas
- **Sistema de licencias**: Personal, Comercial, Streaming
- **Dashboard de ventas**: Estadísticas en tiempo real
- **Perfil público**: Portfolio con bio, ubicación y redes

### 🖨️ Impresión 3D

Servicio integrado de impresión física con despacho a domicilio:

- **Materiales**: PLA, ABS, PETG, Resina
- **Configuración**: Calidad, escala, color, relleno
- **Cotización automática** según volumen y material
- **Tracking completo**: Estados en tiempo real (Confirmado → Imprimiendo → Enviado → Entregado)
- **Integración Webpay**: Pago seguro del servicio

### 🤖 Takopi-IA (Generación 3D)

<table>
<tr>
<td width="60%">

**Generación con IA**
- 🔤 **Text-to-3D**: Describe tu modelo y la IA lo crea
- 🖼️ **Image-to-3D**: Sube una imagen y conviértela en modelo 3D
- ⚙️ **Refinamiento**: Mejora modelos existentes
- 🎨 **Retexturizado**: Cambia texturas con prompts

</td>
<td width="40%">

**Tecnología**
- Powered by Meshy AI
- Modelos GLB de alta calidad
- Múltiples estilos artísticos
- Descarga directa

</td>
</tr>
</table>

---

## 🎭 Tipos de Contenido

| Categoría | Formatos | Aplicaciones |
|-----------|----------|--------------|
| 🗿 **Modelos 3D** | GLB, GLTF, FBX, OBJ, STL | Blender, Unity, Unreal, Impresión 3D |
| 👤 **Avatares** | GLB, VRM | VTubing, VRChat, Metaverso |
| 🎵 **Audio** | MP3, WAV, FLAC, OGG | Música, SFX, Loops, Stems |
| 🖼️ **Texturas** | PNG, JPG, EXR, HDR | PBR Maps, HDRIs, Ilustraciones |
| 🎬 **Animaciones** | FBX, BVH, GLB | Motion Capture, Rigging |
| 📦 **Otros** | ZIP, Scripts, Presets | Plugins, Configuraciones |

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15.5    │  React 19      │  TailwindCSS v4            │
│  App Router      │  TypeScript 5  │  Framer Motion              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes  │  Clean Architecture  │  JWT Auth         │
│  Prisma 6.19 ORM     │  PostgreSQL (Neon)   │  Vercel Blob      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      INTEGRACIONES                               │
├─────────────────────────────────────────────────────────────────┤
│  💳 Transbank Webpay Plus    │  Pagos seguros (Chile)           │
│  🤖 Meshy AI API             │  Generación 3D con IA            │
│  📦 Vercel Blob Storage      │  Almacenamiento de archivos      │
│  🎲 Google Model Viewer      │  Visualización 3D interactiva    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- PostgreSQL (o cuenta en [Neon](https://neon.tech))

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/Sketles/Takopi.git
cd takopi

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Sincronizar base de datos
npx prisma db push
npx prisma generate

# 5. Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variables de Entorno

```bash
# ═══════════════════════════════════════════════════════════════
# DATABASE (PostgreSQL - Neon)
# ═══════════════════════════════════════════════════════════════
POSTGRES_PRISMA_URL="postgresql://..."      # URL con connection pooling
POSTGRES_URL_NON_POOLING="postgresql://..." # URL directa (migraciones)

# ═══════════════════════════════════════════════════════════════
# AUTENTICACIÓN
# ═══════════════════════════════════════════════════════════════
JWT_SECRET="tu-secret-super-seguro-min-32-chars"
NEXTAUTH_SECRET="otro-secret-para-nextauth"
NEXTAUTH_URL="http://localhost:3000"

# ═══════════════════════════════════════════════════════════════
# STORAGE (Vercel Blob)
# ═══════════════════════════════════════════════════════════════
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# ═══════════════════════════════════════════════════════════════
# PAGOS (Transbank - Chile)
# ═══════════════════════════════════════════════════════════════
TRANSBANK_COMMERCE_CODE="597055555532"       # Código de integración
TRANSBANK_API_KEY="579B532A..."              # API Key de integración
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# ═══════════════════════════════════════════════════════════════
# IA GENERATIVA (Meshy)
# ═══════════════════════════════════════════════════════════════
MESHY_API_KEY="msy_..."
```

---

## 🏗️ Arquitectura

```
takopi/
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── content/       # CRUD de contenido
│   │   │   ├── webpay/        # Pagos Transbank
│   │   │   ├── ai/            # Generación IA
│   │   │   └── user/          # Usuarios, compras, etc.
│   │   ├── explore/           # Marketplace
│   │   ├── profile/           # Dashboard usuario
│   │   ├── impresion-3d/      # Servicio de impresión
│   │   ├── takopi-ia/         # Generador IA
│   │   └── ...
│   ├── components/            # Componentes React
│   │   ├── shared/            # Layout, Navbar, Toast, etc.
│   │   ├── product/           # Cards, Modal, Panel
│   │   ├── profile/           # Secciones de perfil
│   │   └── ui/                # Componentes base
│   ├── contexts/              # Estado global (Auth, Cart)
│   ├── features/              # Clean Architecture
│   │   ├── auth/              # Domain + Data
│   │   ├── content/
│   │   ├── purchase/
│   │   └── ...
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilidades (prisma, auth, blob)
│   └── types/                 # TypeScript types
└── testing/                   # E2E tests (Playwright)
```

### Clean Architecture

```
┌─────────────────────────────────────────────┐
│              API Routes                      │
│         (src/app/api/...)                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Use Cases                       │
│    (src/features/*/application/)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             Repositories                     │
│       (src/features/*/data/)                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Prisma / External                  │
│              (src/lib/)                     │
└─────────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Marketplace con previsualizadores (3D, audio, texturas)
- [x] Sistema de autenticación JWT
- [x] Pagos con Transbank Webpay Plus
- [x] Carrito de compras persistente
- [x] Upload y gestión de contenido
- [x] Sistema de likes, comentarios y colecciones
- [x] Perfiles de usuario con roles
- [x] Clean Architecture
- [x] **Impresión 3D** con tracking de órdenes
- [x] **Takopi-IA** (Text-to-3D, Image-to-3D)
- [x] Deploy en Vercel con PostgreSQL (Neon)

### 🔄 En Progreso

- [ ] Notificaciones en tiempo real
- [ ] Sistema de reviews y valoraciones
- [ ] Estadísticas avanzadas para creadores
- [ ] Mejoras de UX/UI responsive

### 🔮 Próximamente

- [ ] Sistema de comisiones personalizadas
- [ ] Chat entre usuarios
- [ ] API pública para desarrolladores
- [ ] App móvil (React Native)
- [ ] Suscripciones premium
- [ ] Internacionalización (EN, PT)

---

## 🧪 Testing

```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar en modo visual
npm run test:e2e:headed
```

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y propietario de Takopi.

---

<div align="center">

### 💜 Hecho con amor en Chile 🇨🇱

**Takopi** - Donde los creadores brillan

[Website](https://takopi-nine.vercel.app) · [GitHub](https://github.com/Sketles/Takopi)

</div>
