# 📋 INFORME TÉCNICO ESTRUCTURADO - TAKOPI RESPONSIVE

> **Fecha:** 2 de diciembre de 2025  
> **Propósito:** Auditoría completa del estado responsive del proyecto para servir como guía de refactor.

---

## 1. Resumen del Proyecto

### Estructura General
```
takopi/
├── src/
│   ├── app/                    # Next.js 15 App Router (páginas + API routes)
│   │   ├── page.tsx            # Landing page (Home)
│   │   ├── explore/            # Marketplace/catálogo
│   │   ├── profile/            # Perfil del usuario
│   │   ├── upload/             # Subir contenido
│   │   ├── box/                # Carrito de compras
│   │   ├── checkout/           # Proceso de pago
│   │   ├── impresion-3d/       # Servicio de impresión 3D
│   │   ├── takopi-ia/          # Generador 3D con IA
│   │   ├── user/[userId]/      # Perfil público de usuarios
│   │   ├── search/             # Búsqueda
│   │   ├── auth/               # Login/Register
│   │   └── api/                # Backend API routes
│   ├── components/
│   │   ├── shared/             # Layout, Header, Footer, ContentCard, Toast
│   │   ├── product/            # ProductModal, ProductMediaTabs, MusicPlayer
│   │   ├── profile/            # Componentes de perfil
│   │   ├── landing/            # FeaturesGrid, ProfitCalculator, etc.
│   │   ├── search/             # Componentes de búsqueda
│   │   └── ModelViewer3D.tsx   # Visor 3D Google model-viewer
│   ├── contexts/               # AuthContext, CartContext
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Prisma, blob, logger
│   └── types/                  # TypeScript types
├── prisma/                     # Schema y migraciones
└── public/                     # Assets estáticos
```

### Tecnologías Encontradas
- **Framework:** Next.js 15.5.3 (App Router + Turbopack)
- **React:** 19
- **CSS:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **UI Components:** Headless UI (@headlessui/react)
- **Iconos:** Heroicons (@heroicons/react)
- **Visor 3D:** Google model-viewer (@google/model-viewer)
- **Base de Datos:** PostgreSQL (Neon) + Prisma 6.19
- **Autenticación:** NextAuth.js + JWT
- **Storage:** Vercel Blob

---

## 2. Listado de Páginas y Componentes Clave

### 2.1 Home / Landing Page
- **Ruta:** `/`
- **Archivo:** `src/app/page.tsx`
- **Componentes principales:**
  - `Layout` → `src/components/shared/Layout.tsx`
  - `Header` → `src/components/shared/Header.tsx`
  - `Footer` → `src/components/shared/Footer.tsx`
  - `FeaturesGrid` → `src/components/landing/FeaturesGrid.tsx`
  - `ProfitCalculator` → `src/components/landing/ProfitCalculator.tsx`
  - `PrintingService` → `src/components/landing/PrintingService.tsx`
  - `SocialProof` → `src/components/landing/SocialProof.tsx`
  - `FAQ` → `src/components/landing/FAQ.tsx`
  - `ParticleBackground` (inline)
- **Descripción:** Landing page con hero animado, partículas, secciones de features, calculadora de ganancias, servicio de impresión 3D y social proof.

### 2.2 Explore / Marketplace
- **Ruta:** `/explore`
- **Archivo:** `src/app/explore/page.tsx`
- **Componentes principales:**
  - `Layout`, `ParticleBackground` (inline)
  - `TrendingCarousel` → `src/app/explore/TrendingCarousel.tsx`
  - `ExploreFilters` → `src/app/explore/ExploreFilters.tsx`
  - `ContentGrid` → `src/app/explore/ContentGrid.tsx`
  - `ContentCard` → `src/components/shared/ContentCard.tsx`
  - `ProductModal` → `src/components/product/ProductModal.tsx`
- **Descripción:** Catálogo de contenido con filtros por categoría, precio, ordenamiento. Grid de cards con modales de producto.

### 2.3 Perfil de Usuario (propio)
- **Ruta:** `/profile`
- **Archivo:** `src/app/profile/page.tsx` (974 líneas)
- **Componentes principales:**
  - `Layout`
  - `ProfileEditor` → `src/components/profile/ProfileEditor.tsx`
  - `InlineEditor` → `src/components/profile/InlineEditor.tsx`
  - `RoleSelector` → `src/components/profile/RoleSelector.tsx`
  - `ContentCard` → `src/components/shared/ContentCard.tsx`
  - `ProductModal`, `ProductEditModal`
  - `PurchasesSection` → `src/components/profile/PurchasesSection.tsx`
  - `CollectionsModal` → `src/components/profile/CollectionsModal.tsx`
  - `FollowersModal` → `src/components/profile/FollowersModal.tsx`
- **Descripción:** Perfil con banner, avatar, bio, ubicación, creaciones, compras, colecciones, seguidores.

### 2.4 Perfil Público de Usuario
- **Ruta:** `/user/[userId]`
- **Archivo:** `src/app/user/[userId]/page.tsx`
- **Componentes principales:** Similar a profile pero en modo lectura
- **Descripción:** Perfil público de otros usuarios con sus creaciones y estadísticas.

### 2.5 Upload (Crear Contenido)
- **Ruta:** `/upload`
- **Archivo:** `src/app/upload/page.tsx` (893 líneas)
- **Componentes principales:**
  - `CardPreview` → `src/components/CardPreview.tsx`
  - `ParticlesBackground` → `src/components/shared/ParticlesBackground.tsx`
  - `MediaViewer` → `src/components/shared/MediaViewer.tsx`
  - Framer Motion (`motion`, `AnimatePresence`)
- **Descripción:** Formulario multi-step para subir contenido (modelo 3D, música, texturas, etc.)

### 2.6 Box (Carrito)
- **Ruta:** `/box`
- **Archivo:** `src/app/box/page.tsx`
- **Componentes principales:** `ProductModal`, items del carrito
- **Descripción:** Lista de productos agregados al carrito con total y botón de checkout.

### 2.7 Impresión 3D Landing
- **Ruta:** `/impresion-3d`
- **Archivo:** `src/app/impresion-3d/page.tsx`
- **Componentes principales:** `Layout`, comparador de materiales
- **Descripción:** Landing del servicio de impresión con features, materiales, specs técnicas.

### 2.8 Takopi IA (Generador 3D)
- **Ruta:** `/takopi-ia`
- **Archivo:** `src/app/takopi-ia/page.tsx` (1062 líneas)
- **Componentes principales:**
  - `Layout`
  - `ModelViewer3D` → `src/components/ModelViewer3D.tsx`
  - `AIModelViewer` (inline)
- **Descripción:** Generador de modelos 3D por IA (text-to-3D, image-to-3D) con visor 3D integrado.

### 2.9 ProductModal (Componente Crítico)
- **Archivo:** `src/components/product/ProductModal.tsx` (409 líneas)
- **Subcomponentes:**
  - `ProductMediaTabs` → `src/components/product/ProductMediaTabs.tsx`
  - `PurchasePanel` → `src/components/product/PurchasePanel.tsx`
  - `DescriptionClamp` → `src/components/product/DescriptionClamp.tsx`
  - `CommentsSection` → `src/components/product/CommentsSection.tsx`
- **Descripción:** Modal fullscreen/responsive para ver detalles del producto, visor 3D, compra, comentarios.

---

## 3. Diagnóstico de la Maquetación Actual

### 3.1 Home / Landing (`src/app/page.tsx`)

**Layout actual:**
- `flex`, `relative`, `absolute` para overlays
- Breakpoints: `md:text-9xl`, `md:text-6xl`, `md:text-2xl`, `sm:flex-row`

**PROBLEMAS detectados:**
1. ❌ **Hero con altura fija:** `min-h-[90vh]` puede causar overflow en mobile landscape.
2. ❌ **Tipografía gigante sin escala intermedia:** `text-7xl md:text-9xl` salta de golpe, falta `sm:` y `lg:`.
3. ❌ **Gradientes y blurs con tamaños fijos:** `w-96 h-96` en elementos decorativos no escalan.
4. ⚠️ **Botones CTA:** `flex-col sm:flex-row` está bien pero los botones tienen padding fijo que puede ser grande en mobile muy pequeño.

**Ejemplos concretos:**
- Línea 280: `text-7xl md:text-9xl` → falta breakpoint intermedio `sm:text-8xl`.
- Línea 258: `w-96 h-96` blur decorativo fijo → debería ser responsive o `hidden` en mobile.

---

### 3.2 Explore (`src/app/explore/page.tsx`)

**Layout actual:**
- `grid`, `flex`, `relative`, `absolute`
- Breakpoints: `md:text-8xl`

**PROBLEMAS detectados:**
1. ❌ **Título gigante sin escalas:** `text-6xl md:text-8xl` salta mucho.
2. ❌ **Filtros horizontales pueden desbordar:** Los botones de categoría son `flex-wrap` pero sin scroll horizontal como alternativa.
3. ⚠️ **Canvas de partículas:** `fixed inset-0` puede afectar performance en mobile.

**Ejemplos concretos:**
- `TrendingCarousel`: Puede tener overflow horizontal no controlado.
- Botones de categoría: `gap-3 mb-12` sin padding lateral adaptativo.

---

### 3.3 Profile (`src/app/profile/page.tsx`)

**Layout actual:**
- Muy complejo (974 líneas), usa `flex`, `grid`, estados condicionales.
- Breakpoints dispersos.

**PROBLEMAS detectados:**
1. ❌ **Banner con altura fija probable:** Falta revisar si usa `h-[Xpx]` fijo.
2. ❌ **Grid de creaciones:** Posible falta de breakpoints para tablets.
3. ❌ **Modales anidados:** `ProfileEditor`, `CollectionsModal` tienen sus propios problemas responsive.

---

### 3.4 Upload (`src/app/upload/page.tsx`)

**Layout actual:**
- Multi-step wizard, usa Framer Motion.
- Mezcla `flex`, posiciones absolutas para preview.

**PROBLEMAS detectados:**
1. ❌ **893 líneas sin separación clara:** Difícil mantener.
2. ⚠️ **CardPreview flotante:** Puede superponerse en tablets.
3. ❌ **Dropzone con tamaños fijos:** Posible overflow.

---

### 3.5 ProductModal (`src/components/product/ProductModal.tsx`)

**Layout actual:**
- Modal fullscreen con `h-[100dvh] sm:h-[90vh]`
- Grid de 2 columnas: visor 3D + panel de compra

**PROBLEMAS detectados:**
1. ⚠️ **h-[100dvh]:** Bien para mobile, pero la transición a `sm:h-[90vh]` puede causar saltos.
2. ❌ **Panel lateral puede comprimirse:** El visor 3D y el panel de compra compiten por espacio.
3. ❌ **Contenido scrollable:** Puede haber conflictos de scroll entre modal y contenido interno.

**Ejemplo concreto:**
- Línea 173: `<div className="relative w-full max-w-7xl ... h-[100dvh] sm:h-[90vh]">` → Bien estructurado pero los componentes hijos no respetan siempre.

---

### 3.6 Header (`src/components/shared/Header.tsx`)

**Layout actual:**
- `fixed top-0 left-0 right-0 z-50`
- Nav con pills centradas, mobile menu con hamburger

**PROBLEMAS detectados:**
1. ✅ **Bien estructurado:** Usa `hidden md:flex` y `md:hidden` correctamente.
2. ⚠️ **Pills centradas con `absolute left-1/2 -translate-x-1/2`:** Puede causar overflow si el texto es largo.
3. ⚠️ **Mobile menu:** Funciona pero podría tener mejor animación.

---

### 3.7 ContentCard (`src/components/shared/ContentCard.tsx`)

**Layout actual:**
- Card con `aspect-[4/3]` para imagen
- Badges flotantes con `absolute`

**PROBLEMAS detectados:**
1. ⚠️ **Badges pueden superponerse:** Like y Pin buttons están a `right-4` y `right-16`, pueden chocar en cards pequeñas.
2. ✅ **Aspect ratio:** Bien implementado con `aspect-[4/3]`.

---

### 3.8 ModelViewer3D (`src/components/ModelViewer3D.tsx`)

**Layout actual:**
- Web component `<model-viewer>` envuelto en contenedor
- Panel de controles con `absolute`

**PROBLEMAS detectados:**
1. ❌ **Altura fija en variante modal:** `height = "520px"` fijo rompe en mobile.
2. ❌ **Panel de controles:** `min-w-[260px]` puede desbordar en móviles pequeños.
3. ⚠️ **Controles de animación:** Muchos sliders que pueden ser difíciles de usar en touch.

---

### 3.9 Takopi IA (`src/app/takopi-ia/page.tsx`)

**Layout actual:**
- 1062 líneas, panel de visor 3D + panel de controles
- Layout split vertical/horizontal

**PROBLEMAS detectados:**
1. ❌ **Archivo muy grande:** Difícil de mantener.
2. ❌ **Split layout:** Puede no adaptarse bien a tablets en portrait.
3. ⚠️ **Historial de generaciones:** Scroll horizontal/vertical puede conflictuar.

---

## 4. Mapa de Breakpoints Actuales

### Breakpoints Usados en el Proyecto
| Breakpoint | Prefijo | Uso Detectado |
|------------|---------|---------------|
| 640px | `sm:` | ✅ Frecuente |
| 768px | `md:` | ✅ Muy frecuente |
| 1024px | `lg:` | ✅ Frecuente |
| 1280px | `xl:` | ⚠️ Poco usado |
| 1536px | `2xl:` | ❌ Casi no usado |

### Archivos con más breakpoints
1. `src/components/product/ProductEditModal.tsx` - Bien estructurado
2. `src/components/shared/Header.tsx` - Bien estructurado
3. `src/components/landing/FeaturesGrid.tsx` - Usa `md:` para grid

### Incoherencias detectadas
1. **Landing page:** Salta de `text-7xl` a `md:text-9xl` sin `sm:` ni `lg:`.
2. **Explore page:** Similar problema con tipografía.
3. **Grids de cards:** Algunos usan `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, otros solo `md:`.
4. **Modales:** Inconsistencia en padding (`p-4 sm:p-6` vs `p-6 sm:p-8`).

### CSS plano adicional
- `src/app/globals.css`: Solo utilidades custom (scrollbar, animations).
- `src/styles/model-viewer.css`: Estilos específicos del visor 3D.
- **No hay `@media` queries en CSS plano.**

---

## 5. Análisis Específico del Visor 3D

### Componente Principal
- **Archivo:** `src/components/ModelViewer3D.tsx` (456 líneas)
- **Librería:** `@google/model-viewer` (web component)

### Implementación
```tsx
<model-viewer
  src={src}
  alt={alt}
  style={{ width: '100%', height: '100%' }}
  auto-rotate={currentRotation}
  camera-controls={cameraControls}
  shadow-intensity={currentShadows}
  exposure={currentExposure}
  poster={fallbackImage}
/>
```

### Variantes
- `ModelViewer3D` - Uso general
- `ModelViewerPreview` - Para cards (200px altura fija)
- `ModelViewerModal` - Para modales (520px altura fija) ← **PROBLEMA**

### Contenedores
```tsx
// ModelViewerModal
height = "520px" // ❌ FIJO

// Panel de controles
<div className="min-w-[260px]"> // ❌ Puede desbordar en mobile
```

### PROBLEMAS de Responsive del Visor 3D
1. ❌ **Alturas fijas:** `520px`, `200px`, `400px` hardcodeadas.
2. ❌ **Panel de controles con `min-w-[260px]`:** Desborda en pantallas <320px.
3. ❌ **No hay `aspect-ratio`:** Debería usar `aspect-video` o similar.
4. ⚠️ **Poster/fallback:** Los placeholders SVG tienen tamaño fijo interno.

### Archivos CSS relacionados
- `src/styles/model-viewer.css`: Contiene estilos pero no breakpoints.

---

## 6. Patrones de Diseño Actuales (Conservar)

### Paleta de Colores
- **Background principal:** `#0a0a0a` (casi negro)
- **Background secundario:** `#0f0f0f`
- **Acentos primarios:** Púrpura (`purple-400` a `purple-600`, `#a855f7`, `#7c3aed`)
- **Acentos secundarios:** Fuchsia, Cyan (para partículas)
- **Texto primario:** `text-white`
- **Texto secundario:** `text-gray-400`, `text-gray-500`
- **Bordes sutiles:** `border-white/5`, `border-white/10`
- **Overlays:** `bg-black/80`, `bg-white/5`

### Tipografía
- **Font family:** Geist Sans (--font-geist-sans), Geist Mono
- **Títulos hero:** `text-7xl` a `text-9xl`, `font-black`, `tracking-tighter`
- **Subtítulos:** `text-4xl` a `text-6xl`, `font-bold`
- **Body:** `text-xl`, `text-lg`, `font-light`

### Layouts Principales
1. **Layout en 2 columnas:** Visor + Panel (ProductModal, TakopiIA)
2. **Grid de cards:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (Explore, Profile)
3. **Navbar fixed:** Header con pills centradas
4. **Modales fullscreen:** `h-[100dvh] sm:h-[90vh]`
5. **Secciones landing:** `py-32 px-4` con `max-w-7xl mx-auto`

### Efectos Visuales (Mantener)
- Glassmorphism: `backdrop-blur-md`, `bg-white/5`
- Glow effects: `shadow-[0_0_20px_rgba(168,85,247,0.3)]`
- Gradientes: `bg-gradient-to-r from-purple-400 to-purple-600`
- Bordes redondeados: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`
- Transiciones suaves: `transition-all duration-300`

### Elementos a NO cambiar
- Identidad visual púrpura/negro
- Efecto de partículas en fondo
- Cards con bordes glassmorphism
- Header flotante con pills
- Modales con overlay blur

---

## 7. Riesgos Actuales y Prioridades

### 🔴 CRÍTICOS (Rompen la experiencia)
1. **ProductModal / ModelViewer con alturas fijas** → Contenido cortado en mobile.
2. **Tipografía gigante sin escalas intermedias** → Texto desborda o es ilegible.
3. **Panel de controles del visor 3D con min-width fijo** → Desborda en móviles pequeños.
4. **Grids sin suficientes breakpoints** → Cards se comprimen demasiado en tablets.

### 🟡 IMPORTANTES (Afectan usabilidad)
5. **Elementos decorativos con tamaños fijos** → `w-96 h-96` blurs no escalan.
6. **Botones CTA con padding grande** → Difíciles de tocar en mobile.
7. **Archivos muy grandes** → `takopi-ia/page.tsx` (1062 líneas), difícil mantener.
8. **Inconsistencia en padding de modales** → Diferentes valores en diferentes modales.

### 🟢 OPCIONALES (Mejoras nice-to-have)
9. **Footer grid** → Funciona pero podría optimizarse para mobile.
10. **Animaciones de Framer Motion** → Verificar performance en dispositivos lentos.
11. **Canvas de partículas** → Considerar deshabilitar en mobile para performance.

### Orden de Prioridad para Refactor
1. 🔴 `ProductModal.tsx` + `ProductMediaTabs.tsx`
2. 🔴 `ModelViewer3D.tsx`
3. 🔴 `src/app/page.tsx` (Landing)
4. 🔴 `src/app/explore/page.tsx`
5. 🟡 `src/app/profile/page.tsx`
6. 🟡 `src/app/takopi-ia/page.tsx`
7. 🟡 `ContentCard.tsx`
8. 🟢 `Header.tsx` (ya está bien, solo ajustes menores)
9. 🟢 Landing components (FeaturesGrid, etc.)

---

## 8. Sugerencias de Estrategia de Refactor (Alto Nivel)

### 8.1 Normalizar Contenedores
- Crear clase base: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Aplicar consistentemente en todas las secciones

### 8.2 Sistema de Tipografía Responsiva
Definir escala progresiva:
```
text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
```
En lugar de saltos abruptos como `text-7xl md:text-9xl`.

### 8.3 Reemplazar Alturas Fijas por Fluidas
- Cambiar `h-[520px]` → `h-[50vh] md:h-[60vh] lg:h-[70vh]` o usar `aspect-ratio`
- Usar `min-h-[X]` en lugar de `h-[X]` donde sea posible

### 8.4 Grid System Consistente
Estandarizar:
```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```
Con gaps responsivos: `gap-4 sm:gap-6 lg:gap-8`

### 8.5 Componentes Layout Reutilizables
Crear:
- `<Section>` - Wrapper con max-width y padding estandarizado
- `<SectionTitle>` - Tipografía responsive para títulos
- `<CardGrid>` - Grid responsive para cards
- `<Modal>` - Base responsive para modales

### 8.6 Mobile-First Approach
Reescribir estilos siguiendo:
1. Estilos base para mobile (sin prefijo)
2. Agregar breakpoints `sm:`, `md:`, `lg:`, `xl:` progresivamente

### 8.7 Visor 3D Responsive
- Usar `aspect-video` o `aspect-square` en lugar de alturas fijas
- Panel de controles: `w-full md:w-[260px]` con collapsible en mobile
- Considerar controles simplificados para touch

### 8.8 Performance en Mobile
- Deshabilitar o reducir partículas en `sm:` y menores
- Lazy loading de componentes pesados (visor 3D)
- Reducir blur intensity en mobile

---

## 📋 Resumen Ejecutivo

| Área | Estado | Prioridad |
|------|--------|-----------|
| Header | ✅ Bien | Baja |
| Footer | ⚠️ Ajustes menores | Baja |
| Landing | ❌ Tipografía/escalas | Alta |
| Explore | ❌ Grid/tipografía | Alta |
| Profile | ⚠️ Complejo | Media |
| ProductModal | ❌ Alturas fijas | Crítica |
| ModelViewer3D | ❌ Alturas fijas | Crítica |
| ContentCard | ⚠️ Badges overlap | Media |
| Takopi IA | ❌ Layout split | Alta |
| Upload | ⚠️ Multi-step | Media |

**Tiempo estimado de refactor completo:** 3-5 días de trabajo enfocado, priorizando los elementos críticos primero.

---

> **Uso de este documento:** Entregar a otra IA como "receta" para ejecutar el refactor responsive paso a paso.