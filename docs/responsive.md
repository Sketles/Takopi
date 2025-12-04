Actúa como un desarrollador senior experto en Next.js (App Router), React y Tailwind CSS, especializado en diseño responsive profesional.

Antes de hacer cualquier cambio, **lee y comprende completamente el archivo `responsive.md` de este proyecto**. Ese archivo contiene las reglas globales obligatorias para el refactor responsive de Takopi.

Tu objetivo es trabajar **solo en la siguiente página o componente**:
- Archivo principal: <ruta del archivo>
- Contexto: <qué muestra esta página>

### 🎯 Objetivo del refactor
- Mantener el diseño original de la versión desktop (1080x1920) lo más parecido posible.
- Convertir la página en completamente responsive sin romper la lógica ni el estilo general.
- Adaptarse correctamente a: mobile, tablet, laptop y desktop.
- Garantizar que botones, modales, diálogos, formularios, grids, cards y visores 3D funcionen bien en mobile.
- Evitar desbordes horizontales, solapamiento de elementos y tamaños fijos innecesarios.

### ❌ Cambios NO permitidos (refactor NO invasivo)
- NO modificar funciones, lógica, hooks, handleSubmit, llamadas a APIs, server actions ni validaciones.
- NO cambiar textos, contenido, copy, ni la semántica.
- NO alterar rutas, estructura de archivos ni comportamientos.
- NO introducir librerías nuevas.

### ✅ Cambios permitidos
- Ajustar layout mediante clases Tailwind:
  - `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `max-w-*`, etc.
  - Breakpoints: `sm:`, `md:`, `lg:`, `xl:`.
- Agregar o ajustar **contenedores responsivos** (`max-w-6xl mx-auto px-4`).
- Reemplazar `absolute` problemáticos por `flex`/`grid` si corresponde.
- Reordenar elementos **solo en mobile** cuando sea estrictamente necesario.
- Convertir layouts 2 columnas → 1 columna en mobile.

### 📐 Instrucciones de estilo responsive
- Mobile-first.
- Evitar anchos fijos grandes.
- Para visores 3D o iframes usar un contenedor con `w-full aspect-video`.
- Cards y grids deben usar:
  - `grid-cols-1`
  - `md:grid-cols-2`
  - `lg:grid-cols-3` o superior si corresponde.
- Tipografía escalada:
  - `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`

### 🗂️ Orden del trabajo dentro de esta página
1. Revisar contenedor principal.
2. Corregir layout (grid/flex).
3. Adaptar componentes críticos (cards, formularios, secciones de producto, visor 3D si existe).
4. Modales, dropdowns y diálogos.
5. Espaciado fino (padding/margins).

### 🧪 Checklist final
Antes de entregar la versión final, asegúrate de que:
- No exista scroll horizontal.
- No haya elementos superpuestos.
- Mobile sea totalmente usable.
- Tablet tenga composición limpia.
- Desktop mantenga el diseño original.
- Visores 3D e iframes escalen correctamente.
- Modales funcionan bien en mobile.

### 📦 Resultado esperado
1. Explicación breve de los cambios.
2. Código final del archivo `<ruta del archivo>` completamente refactorizado para responsive.