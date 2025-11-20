<div align="center">

# 🎨 Takopi

### Marketplace de Contenido Digital para Creadores

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Plataforma integral para comprar y vender contenido digital: modelos 3D, música, efectos de sonido, overlays para streaming, scripts, texturas, ilustraciones y más.**

</div>

---

## 🎯 ¿Qué es Takopi?

**Takopi** es un marketplace digital que conecta creadores de contenido con quienes necesitan recursos creativos de calidad. Desde streamers buscando overlays hasta modeladores 3D necesitando assets, Takopi centraliza todo en una plataforma moderna y fácil de usar.

### 🌟 Para Quién

- **🎮 Streamers**: Overlays, alertas, música, efectos de sonido, widgets para OBS
- **🎬 Editores**: LUTs, presets, scripts para Adobe/DaVinci, efectos, transiciones
- **🗿 Artistas 3D**: Modelos, texturas PBR, rigs, HDRIs, brushes
- **🎵 Músicos**: Samples, loops, presets, MIDI packs, stems
- **🎨 Diseñadores**: Ilustraciones, brushes, mockups, iconos, UI kits
- **🎮 Game Devs**: Assets 3D, sprites, música, shaders, animaciones

---

## 💼 Modelo de Negocio

1. **Comisión por Venta** (10-15% sobre transacciones)
2. **Comisiones Personalizadas**: Los creadores ofrecen trabajo a medida
3. **Suscripciones Premium**: Planes Indie, Pro y Studio para creadores
4. **Impresión 3D Local**: Impresión física de modelos con despacho a domicilio
5. **Publicidad**: Destacados y promoción de contenido

---

## ✨ Características Principales

### 🛒 Marketplace
- Exploración visual con filtros avanzados
- Previsualización 3D interactiva, reproductor de música, visor de texturas
- Carrito de compras inteligente con persistencia
- Pagos seguros con Transbank Webpay Plus
- Descarga inmediata post-compra

### 🎨 Para Creadores
- Upload fácil de múltiples tipos de contenido
- Dashboard con estadísticas de ventas
- Sistema de licencias flexible (Personal, Indie, Pro)
- Perfil público con portfolio
- Control total sobre precios

### 💳 Sistema de Pagos
- Integración con Transbank (Chile)
- Soporte para contenido gratuito
- Compras múltiples en un solo pago
- Historial completo de transacciones

---

## 🎭 Tipos de Contenido Soportados

| Tipo | Formatos | Uso |
|------|----------|-----|
| 🗿 **Modelos 3D** | GLB, GLTF, FBX, OBJ | Blender, Unity, Unreal |
| 🎵 **Audio** | MP3, WAV, FLAC | Música, SFX, loops, stems |
| 🖼️ **Texturas** | PNG, JPG, EXR | PBR, HDRIs, ilustraciones |
| 🎮 **Streaming** | HTML, CSS, PNG | Overlays, alertas, widgets OBS |
| 🎬 **Scripts** | JS, JSX, Python | Adobe, Blender, DaVinci |
| 🎨 **Diseño** | ABR, XMP, CUBE | Brushes, presets, LUTs |

---

## 🛠️ Stack Tecnológico

```typescript
Frontend:  Next.js 15 + React 19 + TypeScript + TailwindCSS v4
Backend:   Next.js API Routes + Clean Architecture
Pagos:     Transbank Webpay Plus
Storage:   Local JSON Files (almacenamiento en archivo)
3D Viewer: @google/model-viewer
Auth:      JWT + bcrypt
```

---

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar .env.local (opcional para producción)
JWT_SECRET=tu-secret-key
NEXTAUTH_SECRET=tu-nextauth-secret
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Ejecutar desarrollo
npm run dev

# Build de producción
npm run build
npm start

## 🧪 Pruebas E2E (Playwright)

Se incluyen tests E2E básicos para validar flujos de perfil y navegación de autor. Para ejecutarlos, instala dependencias y configura las variables de entorno.

```bash
# Instalar dependencias (incluye Playwright)
npm install

# Ejecutar tests E2E (headless)
npm run test:e2e

# Ejecutar tests E2E en modo headed (ver la UI)
npm run test:e2e:headed
```

Variables de entorno requeridas para pruebas E2E (ejemplo):

```
E2E_TEST_USER_EMAIL=test@example.com
E2E_TEST_USER_PASSWORD=password123
E2E_BASE_URL=http://localhost:3000
```

Nota: Los tests asumen que tu instancia local tiene datos de prueba adecuados (usuarios y contenido). Ajusta o prepara fixtures según sea necesario.

Los tests se encuentran en la carpeta `testing/e2e` y la configuración específica está en `testing/playwright.config.ts`.
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Roadmap

### ✅ Fase 1 - MVP (Completado)
- [x] Autenticación y perfiles de usuario
- [x] Marketplace con visualizadores integrados
- [x] Sistema de pagos con Transbank
- [x] Carrito de compras
- [x] Upload y gestión de contenido
- [x] Sistema de almacenamiento local (JSON)
- [x] Clean Architecture implementada
- [x] Sistema de likes y comentarios
- [x] Búsqueda y filtros básicos

### 🔄 Fase 2 - Comunidad (En Progreso)
- [ ] Sistema de seguimiento entre usuarios mejorado
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda semántica avanzada
- [ ] Sistema de reviews y valoraciones
- [ ] Estadísticas detalladas para creadores

### 🎨 Fase 3 - Comisiones (Q2 2025)
- [ ] Solicitud de trabajos personalizados
- [ ] Sistema de cotización y chat
- [ ] Pago protegido (escrow)
- [ ] Gestión de proyectos con hitos
- [ ] Portfolio de comisiones

### 🖨️ Fase 4 - Impresión 3D (Q3 2025)
- [ ] Servicio de impresión local
  - Múltiples materiales (PLA, ABS, PETG, Resina)
  - Cotización automática por volumen
  - Configuración de calidad y relleno
- [ ] Seguimiento en tiempo real con fotos
- [ ] Panel de administración de impresoras
- [ ] Despacho a domicilio o retiro en tienda

### 🌟 Fase 5 - Expansión (Q4 2025+)
- [ ] App móvil (React Native)
- [ ] Plugins para Blender/Adobe/OBS
- [ ] API pública para desarrolladores
- [ ] Suscripciones premium
- [ ] Internacionalización (EN, PT)

---

## 📖 Uso Rápido

### Para Creadores
1. Registrarse en `/auth/register`
2. Completar perfil (rol, biografía, ubicación)
3. Subir contenido en `/upload`
4. Configurar precio y licencia
5. Publicar y compartir

### Para Compradores
1. Explorar catálogo en `/explore`
2. Previsualizar contenido (3D, audio, imágenes)
3. Agregar al carrito (`/box`)
4. Pagar con Transbank
5. Descargar desde "Mis Compras"

---

## 🏗️ Arquitectura

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend (auth, content, payments)
│   ├── explore/           # Marketplace
│   ├── profile/           # Dashboard de usuario
│   ├── box/               # Carrito
│   └── checkout/          # Proceso de pago
├── components/            # Componentes React
├── contexts/              # Estado global (Auth, Cart)
├── hooks/                 # Custom hooks
├── features/              # Clean Architecture
│   ├── auth/
│   ├── content/
│   └── user/
└── types/                 # TypeScript interfaces
```

**Clean Architecture**: Domain → Application → Infrastructure

---

## 📞 Contacto

- **Email**: contacto@takopi.cl
- **Soporte**: soporte@takopi.cl

---

<div align="center">

**Hecho con 💜 en Chile 🇨🇱**

[⬆ Volver arriba](#-takopi)

</div>
