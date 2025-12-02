# 📱 Lista de Refactor Responsive - Takopi

> **Objetivo:** Convertir todas las páginas en completamente responsive manteniendo el diseño desktop original.  
> **Metodología:** Mobile-first con breakpoints Tailwind (sm → md → lg → xl → 2xl)  
> **Orden:** Por criticidad de uso + complejidad técnica

---

## 🎯 Criterios de Priorización

| Símbolo | Significado |
|---------|-------------|
| 🔴 | **CRÍTICO** — Alta frecuencia de uso, afecta conversiones |
| 🟡 | **IMPORTANTE** — Uso frecuente, UX principal |
| 🟢 | **ESTÁNDAR** — Flujos secundarios |
| 🔵 | **BAJO** — Páginas de soporte |

---

## 📋 Lista Ordenada por Prioridad

### 🔴 NIVEL CRÍTICO (Afecta conversiones y UX principal)

| # | Página | Archivo | Líneas | Complejidad | Elementos Críticos | Estado |
|---|--------|---------|--------|-------------|-------------------|--------|
| 1 | **Landing/Home** | `src/app/page.tsx` | ~343 | ⭐⭐⭐⭐ | Hero, FeaturesGrid, ProfitCalculator, FAQ, CTAs | ✅ |
| 2 | **Explore** | `src/app/explore/page.tsx` | ~380 | ⭐⭐⭐⭐ | Grid de contenido, filtros, TrendingCarousel | ✅ |
| 3 | **Upload** | `src/app/upload/page.tsx` | ~893 | ⭐⭐⭐⭐⭐ | Formulario multi-step, drag&drop, previews | ✅ |
| 4 | **Profile** | `src/app/profile/page.tsx` | ~974 | ⭐⭐⭐⭐⭐ | Banner, tabs, grids de contenido, modales | ✅ |
| 5 | **Login** | `src/app/auth/login/page.tsx` | ~260 | ⭐⭐ | Formulario centrado, inputs | ✅ |
| 6 | **Register** | `src/app/auth/register/page.tsx` | ~290 | ⭐⭐ | Formulario, selector de roles | ✅ |
| 6 | **Register** | `src/app/auth/register/page.tsx` | ~290 | ⭐⭐ | Formulario, selector de roles |

### 🟡 NIVEL IMPORTANTE (Flujos de compra y transacciones)

| # | Página | Archivo | Líneas | Complejidad | Elementos Críticos | Estado |
|---|--------|---------|--------|-------------|-------------------|--------|
| 7 | **Box (Carrito)** | `src/app/box/page.tsx` | ~395 | ⭐⭐⭐ | Lista de items, resumen, CTAs | ✅ |
| 8 | **Checkout** | `src/app/checkout/page.tsx` | ~454 | ⭐⭐⭐ | Resumen de compra, botón de pago | ✅ |
| 9 | **Payment Result** | `src/app/payment/result/page.tsx` | ~274 | ⭐⭐ | Estados de éxito/error | ✅ |
| 10 | **User Profile (Público)** | `src/app/user/[userId]/page.tsx` | ~434 | ⭐⭐⭐⭐ | Banner, stats, grid de contenido | ✅ |

### 🟢 NIVEL ESTÁNDAR (Features secundarios)

| # | Página | Archivo | Líneas | Complejidad | Elementos Críticos | Estado |
|---|--------|---------|--------|-------------|-------------------|--------|
| 11 | **Takopi IA** | `src/app/takopi-ia/page.tsx` | ~1062 | ⭐⭐⭐⭐⭐ | Visor 3D, panel de generación, historial | ✅ |
| 12 | **Search** | `src/app/search/page.tsx` | ~433 | ⭐⭐⭐ | Filtros, resultados, TagCloud | ✅ |
| 13 | **Impresión 3D Landing** | `src/app/impresion-3d/page.tsx` | ~350 | ⭐⭐⭐⭐ | Hero, catálogo materiales, animaciones | ✅ |
| 14 | **Configurar Impresión** | `src/app/impresion-3d/configurar/page.tsx` | ~450 | ⭐⭐⭐⭐ | Visor 3D, sliders, formulario | ✅ |

### 🔵 NIVEL BAJO (Flujos de nicho)

| # | Página | Archivo | Líneas | Complejidad | Elementos Críticos | Estado |
|---|--------|---------|--------|-------------|-------------------|--------|
| 15 | **Envío (Impresión)** | `src/app/impresion-3d/envio/page.tsx` | ~664 | ⭐⭐⭐ | Formulario de dirección, selección envío | ✅ |
| 16 | **Pago (Impresión)** | `src/app/impresion-3d/pago/page.tsx` | ~524 | ⭐⭐⭐ | Resumen, métodos de pago | ✅ |
| 17 | **Confirmación (Impresión)** | `src/app/impresion-3d/confirmacion/page.tsx` | ~334 | ⭐⭐ | Estado de transacción | ✅ |

---

## 🧩 Componentes Compartidos Críticos

Estos componentes se usan en múltiples páginas y deben revisarse en paralelo:

| Componente | Archivo | Usado en |
|------------|---------|----------|
| **Layout** | `src/components/shared/Layout.tsx` | Todas las páginas |
| **Header** | `src/components/shared/Header.tsx` | Navegación global |
| **Footer** | `src/components/shared/Footer.tsx` | Footer global |
| **ContentCard** | `src/components/shared/ContentCard.tsx` | Explore, Profile, Search |
| **ProductModal** | `src/components/product/ProductModal.tsx` | Detalles de producto |
| **MediaViewer** | `src/components/shared/MediaViewer.tsx` | Visores de contenido |
| **FeaturesGrid** | `src/components/landing/FeaturesGrid.tsx` | Landing |
| **ProfitCalculator** | `src/components/landing/ProfitCalculator.tsx` | Landing |
| **PrintingService** | `src/components/landing/PrintingService.tsx` | Landing |
| **SocialProof** | `src/components/landing/SocialProof.tsx` | Landing |
| **FAQ** | `src/components/landing/FAQ.tsx` | Landing |

---

## 📐 Breakpoints Tailwind a Usar

```
sm: 640px   → Mobile landscape
md: 768px   → Tablet
lg: 1024px  → Desktop pequeño
xl: 1280px  → Desktop
2xl: 1536px → Desktop grande
```

---

## ✅ Checklist Global por Página

- [ ] Sin scroll horizontal en ningún breakpoint
- [ ] Elementos no se superponen
- [ ] Touch targets mínimo 44x44px en mobile
- [ ] Tipografía escalada correctamente
- [ ] Grid de cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- [ ] Modales funcionan en mobile
- [ ] Formularios tienen inputs de ancho completo en mobile
- [ ] Visores 3D/iframes escalan correctamente
- [ ] CTAs visibles y accesibles

---

## 🚀 Plan de Ejecución

### Fase 1: Core (Semana 1)
1. ✅ Crear lista.md (HECHO)
2. ✅ Landing/Home (HECHO - 2 dic 2025)
3. ✅ Explore (HECHO - 2 dic 2025)
4. 🔲 Login/Register

### Fase 2: Discovery (Semana 2)
5. 🔲 Search
6. 🔲 ContentCard (componente)

### Fase 3: Creación (Semana 3)
7. 🔲 Upload
8. 🔲 Profile

### Fase 4: Conversión (Semana 4)
9. 🔲 Box
10. 🔲 Checkout
11. 🔲 Payment Result

### Fase 5: Features (Semana 5)
12. 🔲 User Profile público
13. 🔲 Takopi IA

### Fase 6: Impresión 3D (Semana 6)
14. 🔲 Landing Impresión
15. 🔲 Configurar
16. 🔲 Envío
17. 🔲 Pago
18. 🔲 Confirmación

---

## 📝 Notas del Análisis

### Problemas Detectados (a resolver)

1. **Anchos fijos:** Varias páginas usan `w-96`, `w-64` que rompen en mobile
2. **Grid columns:** Algunos grids no tienen breakpoints responsivos
3. **Modales:** Deben adaptarse a pantalla completa en mobile
4. **Hero sections:** Textos muy grandes para mobile
5. **Visores 3D:** Necesitan contenedores con `aspect-ratio` para escalar
6. **Formularios multi-columna:** Deben colapsar a 1 columna en mobile

### Patrones Recomendados

```tsx
// Contenedor responsive estándar
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Grid de cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

// Tipografía escalada
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">

// Visor 3D/iframe
<div className="w-full aspect-video lg:aspect-square">

// Formulario 2 columnas → 1 en mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

---

**Última actualización:** 2 de diciembre de 2025  
**Siguiente paso:** Refactorizar `src/app/page.tsx` (Landing/Home)
