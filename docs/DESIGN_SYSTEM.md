# 🎨 Takopi Design System
## Sistema de Diseño Completo y Referencia UI/UX

> **Versión:** 1.0.0  
> **Última actualización:** 20 de Noviembre de 2025  
> **Propósito:** Este documento sirve como referencia completa del diseño visual, patrones de UI, animaciones, efectos y estilos de Takopi para mantener consistencia en futuras modificaciones y nuevas páginas.

---

## 📋 Tabla de Contenidos

1. [Paleta de Colores](#-paleta-de-colores)
2. [Tipografía](#-tipografía)
3. [Espaciado y Grid](#-espaciado-y-grid)
4. [Componentes de UI](#-componentes-de-ui)
5. [Efectos Visuales](#-efectos-visuales)
6. [Animaciones](#-animaciones)
7. [Patrones de Layout](#-patrones-de-layout)
8. [Iconografía](#-iconografía)
9. [Estados Interactivos](#-estados-interactivos)
10. [Código de Referencia](#-código-de-referencia)

---

## 🎨 Paleta de Colores

### Colores Principales

```css
/* Background Principal */
--bg-primary: #050505;        /* Negro absoluto para fondo principal */
--bg-secondary: #0a0a0a;      /* Negro ligeramente más claro */
--bg-tertiary: #0f0f0f;       /* Cards y elementos elevados */
--bg-elevated: #111111;       /* Elementos con más elevación */
--bg-hover: #161616;          /* Estado hover de cards */

/* Morado/Púrpura (Color Principal de Marca) */
--purple-50: rgba(168, 85, 247, 0.05);   /* Purple/5 - fondos sutiles */
--purple-100: rgba(168, 85, 247, 0.1);   /* Purple/10 - hover states */
--purple-200: rgba(168, 85, 247, 0.2);   /* Purple/20 - glows, overlays */
--purple-400: #a855f7;                    /* Purple-400 - textos accent */
--purple-500: #9333ea;                    /* Purple-500 - botones primarios */
--purple-600: #7e22ce;                    /* Purple-600 - botones hover */
--purple-900: #581c87;                    /* Purple-900 - fondos oscuros */

/* Gradientes Púrpura Principales */
--gradient-purple-main: linear-gradient(to right, #a855f7, #ec4899, #a855f7);
--gradient-purple-fuchsia: linear-gradient(to right, #a855f7 0%, #ec4899 50%, #7e22ce 100%);
--gradient-purple-blue: linear-gradient(to right, #7e22ce, #3b82f6);
--gradient-purple-pink: linear-gradient(to right, #a855f7, #ec4899);

/* Azul (Acento Secundario) */
--blue-400: #60a5fa;
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-900: #1e3a8a;

/* Blanco (Textos y elementos claros) */
--white: #ffffff;
--white-90: rgba(255, 255, 255, 0.9);
--white-80: rgba(255, 255, 255, 0.8);
--white-60: rgba(255, 255, 255, 0.6);
--white-40: rgba(255, 255, 255, 0.4);
--white-20: rgba(255, 255, 255, 0.2);
--white-10: rgba(255, 255, 255, 0.1);
--white-5: rgba(255, 255, 255, 0.05);

/* Grises (Jerarquía de información) */
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;          /* Textos secundarios */
--gray-500: #6b7280;          /* Textos terciarios */
--gray-600: #4b5563;
--gray-800: #1f2937;
--gray-900: #111827;

/* Colores de Estado */
--success: #10b981;           /* Verde - acciones exitosas */
--success-bg: rgba(16, 185, 129, 0.1);
--warning: #f59e0b;           /* Amarillo - advertencias */
--warning-bg: rgba(245, 158, 11, 0.1);
--error: #ef4444;             /* Rojo - errores */
--error-bg: rgba(239, 68, 68, 0.1);
--info: #3b82f6;              /* Azul - información */
--info-bg: rgba(59, 130, 246, 0.1);

/* Colores de Contenido (Badges de Categorías) */
--badge-avatares: #a855f7;    /* Púrpura */
--badge-modelos3d: #3b82f6;   /* Azul */
--badge-musica: #f59e0b;      /* Naranja/Amarillo */
--badge-texturas: #10b981;    /* Verde */
--badge-animaciones: #ef4444; /* Rojo */
--badge-obs: #8b5cf6;         /* Violeta */
--badge-colecciones: #ec4899; /* Rosa */

/* Overlay y Efectos */
--overlay-dark: rgba(0, 0, 0, 0.4);
--overlay-darker: rgba(0, 0, 0, 0.6);
--overlay-glass: rgba(0, 0, 0, 0.3);
--shimmer: rgba(255, 255, 255, 0.1);
```

### Uso de Gradientes

**Gradientes de Fondo para Secciones Hero:**
```css
background: linear-gradient(to bottom, rgba(88, 28, 135, 0.1), #0a0a0a, #0a0a0a);
background: linear-gradient(to bottom right, #581c87, #000000, #1e3a8a);
```

**Gradientes para Texto (bg-clip-text):**
```css
background: linear-gradient(to right, #a855f7, #ec4899, #7e22ce);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Glows y Halos:**
```css
box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
box-shadow: 0 0 50px rgba(168, 85, 247, 0.5);
text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
drop-shadow: drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
```

---

## ✍️ Tipografía

### Familia de Fuentes

```tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

**Aplicación:**
```html
<body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
```

### Escala Tipográfica

```css
/* Títulos Hero (Landing Pages) */
.text-hero {
  font-size: 6rem;        /* text-9xl en Tailwind */
  font-weight: 900;       /* font-black */
  line-height: 0.9;
  letter-spacing: -0.05em; /* tracking-tighter */
}

/* Títulos Principales (H1) */
.text-h1 {
  font-size: 3.75rem;     /* text-6xl */
  font-weight: 800;       /* font-extrabold */
  line-height: 1.1;
  letter-spacing: -0.025em; /* tracking-tight */
}

/* Títulos Secundarios (H2) */
.text-h2 {
  font-size: 2.25rem;     /* text-4xl */
  font-weight: 700;       /* font-bold */
  line-height: 1.2;
}

/* Títulos de Sección (H3) */
.text-h3 {
  font-size: 1.875rem;    /* text-3xl */
  font-weight: 700;
  line-height: 1.3;
}

/* Subtítulos */
.text-subtitle {
  font-size: 1.25rem;     /* text-xl */
  font-weight: 400;       /* font-normal o font-light */
  color: var(--gray-400);
}

/* Cuerpo de Texto */
.text-body {
  font-size: 1rem;        /* text-base */
  font-weight: 400;
  line-height: 1.6;
  color: var(--white-80);
}

/* Texto Pequeño */
.text-small {
  font-size: 0.875rem;    /* text-sm */
  font-weight: 500;       /* font-medium */
}

/* Uppercase Labels */
.text-label {
  font-size: 0.75rem;     /* text-xs */
  font-weight: 700;       /* font-bold */
  text-transform: uppercase;
  letter-spacing: 0.1em;  /* tracking-wider */
}
```

### Patrones de Uso

**Títulos con Gradiente:**
```tsx
<h1 className="text-7xl md:text-9xl font-black tracking-tighter">
  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]">
    TAKOPI
  </span>
</h1>
```

**Descripción con Jerarquía:**
```tsx
<p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
  Takopi es la plataforma definitiva para creadores...
</p>
```

---

## 📐 Espaciado y Grid

### Sistema de Espaciado

**Tailwind CSS Scale (usado consistentemente):**
```css
/* Padding y Margin */
p-2  = 0.5rem  (8px)
p-4  = 1rem    (16px)
p-6  = 1.5rem  (24px)
p-8  = 2rem    (32px)
p-10 = 2.5rem  (40px)
p-12 = 3rem    (48px)
p-16 = 4rem    (64px)
p-20 = 5rem    (80px)
p-24 = 6rem    (96px)
p-32 = 8rem    (128px)

/* Gaps en Grids y Flex */
gap-3  = 0.75rem  (12px)
gap-4  = 1rem     (16px)
gap-6  = 1.5rem   (24px)
gap-8  = 2rem     (32px)
gap-12 = 3rem     (48px)
```

### Layout Containers

```tsx
/* Container Principal (Max-Width) */
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenido */}
</div>

/* Container Estrecho (Formularios, Texto) */
<div className="max-w-3xl mx-auto px-4">
  {/* Contenido */}
</div>

/* Container Extra Ancho (Landing, Hero) */
<div className="max-w-[1600px] mx-auto px-4">
  {/* Contenido */}
</div>
```

### Grids Responsivos

**Grid de Contenido (Cards):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {/* ContentCard components */}
</div>
```

**Grid de Estadísticas:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-6 gap-4">
  {/* Stats */}
</div>
```

**Bento Grid (Landing):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
  <div className="md:col-span-2 row-span-2">{/* Large card */}</div>
  <div className="md:col-span-1 row-span-2">{/* Tall card */}</div>
  <div>{/* Small card */}</div>
  <div>{/* Small card */}</div>
</div>
```

---

## 🧩 Componentes de UI

### Botones

#### Botón Primario (CTA)
```tsx
<button className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
  <span className="relative flex items-center gap-2">
    Explorar Marketplace
    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" .../>
  </span>
</button>
```

#### Botón Secundario (Ghost)
```tsx
<button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-md">
  <span className="flex items-center justify-center gap-2">
    Servicio de Impresión 3D
    <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:shadow-[0_0_10px_#a855f7]"></div>
  </span>
</button>
```

#### Botón de Acción Pequeño
```tsx
<button className="px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105">
  {category}
</button>
```

#### Botón Ghost/Outline
```tsx
<button className="px-6 py-2.5 rounded-full font-medium text-sm bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300">
  {category}
</button>
```

### Cards (ContentCard)

**Estructura Base:**
```tsx
<div className="group relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
  {/* Image */}
  <div className="aspect-[4/3] overflow-hidden relative">
    <img 
      src={coverImage} 
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
    
    {/* Price Tag */}
    <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-sm font-bold text-white">
      {isFree ? 'GRATIS' : `$${price}`}
    </div>
  </div>

  {/* Content */}
  <div className="p-6">
    <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">{contentType}</span>
    <h3 className="font-bold text-xl text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">{title}</h3>
    <p className="text-sm text-gray-400">por <span className="text-white">{author}</span></p>
  </div>
</div>
```

### Badges y Pills

**Badge de Categoría:**
```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
  🎲 <span>Modelos 3D</span>
</span>
```

**Badge de Estado:**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 border-green-500/20 text-green-400">
  Publicado
</span>
```

**Pill Interactivo (Tags):**
```tsx
<button className="px-3 py-1.5 rounded-lg text-sm border bg-transparent border-white/10 text-gray-400 hover:border-white/30 transition-all">
  #{tag}
</button>
```

### Inputs y Forms

**Input de Texto:**
```tsx
<input
  type="text"
  name="title"
  placeholder="Título del proyecto"
  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
/>
```

**Textarea:**
```tsx
<textarea
  name="description"
  placeholder="Cuenta la historia de tu creación..."
  rows={6}
  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
/>
```

**Select/Dropdown:**
```tsx
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
>
  <option value="newest">✨ Más Recientes</option>
  <option value="popular">🔥 Más Populares</option>
</select>
```

**Switch (Headless UI):**
```tsx
<Switch
  checked={formData.isFree}
  onChange={(value) => handleSwitchChange('isFree', value)}
  className={`${formData.isFree ? 'bg-purple-600' : 'bg-gray-700'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
>
  <span className={`${formData.isFree ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
</Switch>
```

### Modales

**Modal Base (ProductModal ejemplo):**
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
  <div className="relative w-full max-w-7xl max-h-[90vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
    {/* Close Button */}
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
    >
      <XMarkIcon className="w-6 h-6" />
    </button>
    
    {/* Content */}
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
      {/* Left: Preview */}
      <div className="lg:col-span-7 bg-black p-8">
        {/* Media viewer */}
      </div>
      
      {/* Right: Details */}
      <div className="lg:col-span-5 p-8 overflow-y-auto">
        {/* Product info */}
      </div>
    </div>
  </div>
</div>
```

### Loading States

**Spinner:**
```tsx
<div className="flex flex-col items-center justify-center py-20">
  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
  <p className="text-gray-400 animate-pulse">Cargando contenido...</p>
</div>
```

**Skeleton Card:**
```tsx
<div className="h-96 bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
```

### Empty States

```tsx
<div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
  <div className="text-4xl mb-4 opacity-50">🔍</div>
  <p className="text-gray-400 text-lg">No se encontraron resultados</p>
  <Link href="/explore" className="text-purple-400 hover:underline mt-2 inline-block">
    Explorar contenido
  </Link>
</div>
```

---

## ✨ Efectos Visuales

### Glass Morphism (Efecto Vidrio)

```css
/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}

/* Glass Strong (más opaco) */
.glass-strong {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Uso en Tailwind:**
```tsx
<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
  {/* Glass content */}
</div>
```

### Blur Effects

**Background Blur (Glows):**
```tsx
{/* Purple glow top-left */}
<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

{/* Blue glow bottom-right */}
<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

{/* Animated pulse glow */}
<div className="w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
```

### Box Shadows

```css
/* Elevación suave */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

/* Shadow con color */
box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);

/* Shadow múltiple (más profundidad) */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.2);

/* Glow interno (inset) */
box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.2);
```

**En Tailwind:**
```tsx
<div className="shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
<div className="shadow-[0_0_20px_rgba(168,85,247,0.3)]">
<div className="shadow-2xl shadow-black/50">
```

### Gradientes de Overlay

**Overlay para imágenes:**
```tsx
{/* Gradiente de abajo hacia arriba */}
<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

{/* Gradiente de arriba hacia abajo */}
<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]"></div>

{/* Gradiente de esquina */}
<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent"></div>
```

### Borders y Outlines

**Border con glow:**
```tsx
<div className="border border-white/10 hover:border-purple-500/50 transition-colors">
  {/* Content */}
</div>
```

**Animated border (shimmer effect):**
```tsx
<div className="relative group">
  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
  <div className="relative bg-[#0f0f0f] rounded-2xl">
    {/* Content */}
  </div>
</div>
```

---

## 🎬 Animaciones

### Animaciones de Entrada (Fade In)

**Definidas en Tailwind Config o CSS:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: backwards;
}

/* Con delay */
.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}
```

**Uso:**
```tsx
<div className="animate-fade-in">
<div className="animate-fade-in-up delay-100">
<div className="animate-fade-in-up delay-200">
```

### Shimmer/Shine Effect

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.group-hover:animate-shimmer {
  animation: shimmer 1.5s ease-in-out;
}
```

**Uso en botones:**
```tsx
<button className="group relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
  <span className="relative">Texto del botón</span>
</button>
```

### Hover Transitions

**Scale (Agrandar):**
```tsx
<div className="hover:scale-105 transition-transform duration-300">
<div className="hover:scale-110 transition-transform duration-500">
```

**Translate (Mover):**
```tsx
<div className="hover:-translate-y-2 transition-transform duration-300">
<svg className="group-hover:translate-x-1 transition-transform">
```

**Rotate:**
```tsx
<div className="hover:rotate-3 transition-transform duration-300">
```

**Opacity:**
```tsx
<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
```

**Combined (múltiples propiedades):**
```tsx
<div className="transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)]">
```

### Animaciones de Spin (Loading)

```tsx
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
<div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
```

### Animaciones de Pulse

```tsx
{/* Indicador de estado online */}
<span className="relative flex h-2 w-2">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
</span>

{/* Glow pulsante */}
<div className="w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
```

### Particle Background Animation

```tsx
// Componente ParticleBackground con canvas
useEffect(() => {
  // Particle system con movimiento aleatorio
  class Particle {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    size = Math.random() * 2 + 0.5;
    speedX = Math.random() * 0.5 - 0.25;
    speedY = Math.random() * 0.5 - 0.25;
    alpha = Math.random() * 0.5 + 0.1;
    color = `rgba(147 + Math.random() * 50, 51 + Math.random() * 50, 234, ${this.alpha})`;
  }
}, []);
```

**Uso:**
```tsx
<div className="relative min-h-screen">
  <ParticleBackground />
  <div className="relative z-10">
    {/* Content on top */}
  </div>
</div>
```

### Framer Motion (para animaciones complejas)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

---

## 🏗️ Patrones de Layout

### Hero Section (Landing Page)

```tsx
<div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
  {/* Background Gradients */}
  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a]"></div>
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>

  <ParticleBackground />

  {/* Content */}
  <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-sm font-medium text-gray-300 tracking-wide">Marketplace V1.0 + Impresión 3D</span>
    </div>

    {/* Hero Title */}
    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
      <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]">
        TAKOPI
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
      Descripción de la plataforma...
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
      <button className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-all">
        Explorar Marketplace
      </button>
      <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-md">
        Servicio de Impresión 3D
      </button>
    </div>
  </div>
</div>
```

### Profile Banner Layout

```tsx
{/* Banner Section - Full Width & Immersive */}
<div className="relative h-[40vh] min-h-[300px] lg:h-[50vh] w-full overflow-hidden">
  {/* Banner Image */}
  <div className="absolute inset-0">
    <img src={banner} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
  </div>

  {/* Gradient Overlays */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
</div>

{/* Profile Info - Overlapping Banner */}
<div className="max-w-7xl mx-auto px-4 relative -mt-32 z-10">
  <div className="flex items-end gap-8">
    {/* Avatar */}
    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-[#050505]">
      <img src={avatar} className="w-full h-full rounded-full object-cover" />
    </div>

    {/* User Info */}
    <div className="flex-1 pb-2">
      <h1 className="text-4xl font-bold text-white tracking-tight">{username}</h1>
      <p className="text-gray-400">{bio}</p>
    </div>
  </div>
</div>
```

### Two-Column Layout (Product Detail)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 h-full">
  {/* Left Column: Preview (7/12) */}
  <div className="lg:col-span-7 bg-black p-8">
    <MediaViewer files={files} />
  </div>

  {/* Right Column: Details (5/12) */}
  <div className="lg:col-span-5 p-8 overflow-y-auto">
    <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
    <p className="text-gray-400 mb-6">{description}</p>
    {/* Actions, stats, etc. */}
  </div>
</div>
```

### Tabs Navigation

```tsx
<div className="flex justify-center">
  <div className="bg-[#0f0f0f] border border-white/5 rounded-full p-1 inline-flex">
    <button
      onClick={() => setActiveSection('creations')}
      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
        activeSection === 'creations'
          ? 'bg-white text-black shadow-lg'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      Mis Creaciones
    </button>
    <button
      onClick={() => setActiveSection('purchases')}
      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
        activeSection === 'purchases'
          ? 'bg-white text-black shadow-lg'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      Mis Compras
    </button>
  </div>
</div>
```

### Carousel/Slider

```tsx
<div className="relative">
  {/* Navigation Buttons */}
  <div className="flex gap-2 mb-4">
    <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">
      <ChevronLeftIcon className="w-5 h-5" />
    </button>
    <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">
      <ChevronRightIcon className="w-5 h-5" />
    </button>
  </div>

  {/* Scrollable Container */}
  <div
    ref={carouselRef}
    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    {items.map((item) => (
      <div key={item.id} className="min-w-[300px] md:min-w-[350px] snap-center">
        <ContentCard {...item} />
      </div>
    ))}
  </div>
</div>
```

---

## 🎨 Iconografía

### Heroicons (Primary Icon Library)

```tsx
import {
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CubeIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeSlashIcon,
  TagIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Uso
<CloudArrowUpIcon className="w-6 h-6 text-gray-400" />
```

### Emojis para Categorías

```tsx
const contentTypeIcons = {
  'avatares': '👤',
  'modelos3d': '🧩',
  'musica': '🎵',
  'texturas': '🖼️',
  'animaciones': '🎬',
  'OBS': '📺',
  'colecciones': '📦'
};
```

### SVG Inline (Custom Icons)

```tsx
{/* Shopping Bag */}
<svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
</svg>

{/* Search */}
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>

{/* Arrow Right */}
<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
</svg>
```

---

## 🎭 Estados Interactivos

### Hover States

**Card Hover:**
```tsx
<div className="border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
```

**Button Hover:**
```tsx
<button className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-300">
```

**Text Hover:**
```tsx
<a className="text-gray-400 hover:text-white transition-colors">
```

### Focus States

**Input Focus:**
```tsx
<input className="border border-white/10 focus:outline-none focus:border-purple-500 transition-colors" />
```

**Button Focus:**
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black">
```

### Active States

**Button Active:**
```tsx
<button className={`${isActive ? 'bg-white text-black' : 'bg-white/5 text-gray-400'} transition-all duration-300`}>
```

**Tab Active:**
```tsx
<button className={`${activeTab === 'tab1' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:bg-white/5'}`}>
```

### Disabled States

```tsx
<button 
  disabled={!canSubmit}
  className="bg-purple-600 text-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
>
  Submit
</button>
```

### Loading States

```tsx
<button disabled={isLoading} className="relative">
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  )}
  <span className={isLoading ? 'opacity-0' : ''}>Publicar</span>
</button>
```

---

## 💻 Código de Referencia

### Scrollbar Hide Utility

```css
/* globals.css */
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Alternative: Thin custom scrollbar */
.custom-scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.custom-scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}
```

### Line Clamp

```css
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Reusable Hook: useContentCard

```tsx
export const useContentCard = () => {
  const createCardProps = (content: any, options: any = {}) => {
    return {
      id: content.id,
      title: content.title,
      author: content.author,
      authorAvatar: content.authorAvatar,
      authorId: content.authorId,
      contentType: content.contentType,
      category: content.category,
      price: content.price,
      isFree: content.isFree,
      currency: content.currency,
      image: content.coverImage || content.image,
      coverImage: content.coverImage,
      description: content.description,
      shortDescription: content.shortDescription,
      tags: content.tags || [],
      likes: content.likes || 0,
      views: content.views || 0,
      downloads: content.downloads || 0,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      isLiked: content.isLiked || false,
      ...options
    };
  };

  return { createCardProps };
};
```

### Format Price Utility

```tsx
const formatPrice = (price: string | number, isFree: boolean, currency: string = 'CLP') => {
  if (isFree) return 'GRATIS';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (currency === 'CLP') {
    return `$${numPrice.toLocaleString('es-CL')} CLP`;
  }
  
  return `$${numPrice.toFixed(2)}`;
};
```

### Search Bar Component Pattern

```tsx
<div className="relative group">
  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
  <div className="relative bg-[#0f0f0f] rounded-2xl shadow-2xl flex items-center p-2 gap-2">
    <input
      type="text"
      placeholder="Buscar productos, creadores, etiquetas..."
      className="flex-1 bg-transparent border-none outline-none text-white px-4"
    />
    <button className="p-4 rounded-xl bg-purple-500 text-white">
      <SearchIcon className="w-6 h-6" />
    </button>
  </div>
</div>
```

---

## 📝 Notas Finales

### Principios de Diseño

1. **Dark First:** Todo el diseño se construye sobre un fondo oscuro (#050505 - #0a0a0a)
2. **Purple as Primary:** El morado/púrpura (#a855f7) es el color principal de marca
3. **Glass & Blur:** Uso extensivo de `backdrop-blur` y transparencias para crear profundidad
4. **Smooth Transitions:** Todas las interacciones usan `transition-all duration-300` o similar
5. **Rounded Corners:** Bordes redondeados generosos (`rounded-xl`, `rounded-2xl`, `rounded-3xl`)
6. **Hover Feedback:** Cada elemento interactivo debe tener feedback visual claro
7. **Typography Hierarchy:** Uso de Geist Sans con pesos específicos (font-black para títulos, font-light para descripciones)
8. **Spacing Consistency:** Uso del sistema de espaciado de Tailwind (múltiplos de 4px)

### Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape, tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Patrón de uso:**
```tsx
<div className="text-4xl md:text-6xl lg:text-8xl">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
```

### Performance Tips

- Usar `memo()` en componentes que se renderizan frecuentemente
- Lazy load de imágenes con `loading="lazy"`
- Usar `useMemo` para cálculos costosos
- Implementar skeleton loaders para mejorar perceived performance
- Optimizar imágenes con Next.js Image component cuando sea posible

### Accessibility

- Siempre incluir `alt` en imágenes
- Usar colores con suficiente contraste (WCAG AA minimum)
- Implementar navegación por teclado en modales
- Usar semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Incluir `aria-label` en iconos sin texto

---

## 🔄 Changelog

**v1.0.0 (20 Nov 2025)**
- Documentación inicial del Design System
- Extracción de patrones desde landing, explore, profile, upload, box
- Documentación completa de colores, tipografía, componentes y animaciones

---

## 📚 Referencias Rápidas

### Imports Comunes

```tsx
// Fonts
import { Geist, Geist_Mono } from 'next/font/google';

// Components
import Layout from '@/components/shared/Layout';
import ContentCard from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';

// Hooks
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import { useRouter } from 'next/navigation';

// Icons
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';

// Animation
import { motion, AnimatePresence } from 'framer-motion';
```

### Estructura de Página Típica

```tsx
'use client';

import Layout from '@/components/shared/Layout';
import { useState, useEffect } from 'react';

export default function MyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] text-white">
        {/* Hero Section */}
        <div className="relative pt-32 pb-16 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <h1 className="text-6xl font-bold mb-4">Page Title</h1>
            {/* More content */}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* Content here */}
        </div>
      </div>
    </Layout>
  );
}
```

---

**Fin del Documento de Design System v1.0.0**

Este documento es una referencia viva y debe actualizarse cuando se agreguen nuevos patrones o componentes al proyecto.
