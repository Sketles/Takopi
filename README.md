<div align="center">

<img src="public/icons/logo.png" alt="Takopi Logo" width="400" />

### Marketplace de Contenido Digital + IA Generativa 3D

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Plataforma integral para creadores: compra, vende y genera contenido digital con IA.**

[🚀 Demo en Vivo](https://takopi-nine.vercel.app) · [🐛 Reportar Bug](https://github.com/Sketles/Takopi/issues)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es Takopi?](#-qué-es-takopi)
- [Features Principales](#-features-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Instalación](#-instalación)
- [Testing](#-testing)

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

## 📄 Licencia

Este proyecto es privado y propietario de Takopi.

---

<div align="center">

#663399

</div>
