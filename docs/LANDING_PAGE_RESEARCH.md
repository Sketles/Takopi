# 🎮 Landing Page Takopi — Research & Strategy

> **Objetivo:** Crear una página de inicio **dopaminérgica**, **interactiva** y **scroll-storytelling** que introduzca Takopi como marketplace digital con impresión 3D. Moderna, intuitiva, gamificada. Diseño 2025.

---

## 📐 Arquitectura de Scroll Storytelling

### Principio: **Revelación Progresiva por Scroll**
Cada sección se revela con animaciones al hacer scroll, contando la historia de Takopi paso a paso.

```
┌─────────────────────────────────────┐
│ 1. HERO (fullscreen)                │ → Impacto visual + CTA
├─────────────────────────────────────┤
│ 2. ¿QUÉ ES TAKOPI? (scroll reveal)  │ → Concepto en 3 features
├─────────────────────────────────────┤
│ 3. PARA VENDEDORES (interactive)    │ → Calculadora de ganancias
├─────────────────────────────────────┤
│ 4. PARA COMPRADORES (preview)       │ → Preview de contenido 3D
├─────────────────────────────────────┤
│ 5. IMPRESIÓN 3D (feature highlight) │ → Del digital al físico
├─────────────────────────────────────┤
│ 6. SOCIAL LAYER (animated)          │ → Comunidad + interacción
├─────────────────────────────────────┤
│ 7. TIPOS DE USUARIOS (cards)        │ → Creadores/Coleccionistas/Fabricantes
├─────────────────────────────────────┤
│ 8. MÉTRICAS (counters animados)     │ → Social proof (usuarios, descargas)
├─────────────────────────────────────┤
│ 9. ONBOARDING (steps)               │ → Cómo empezar en 3 pasos
├─────────────────────────────────────┤
│ 10. MVP BENEFITS (bento grid)       │ → Features rápidas
├─────────────────────────────────────┤
│ 11. FAQ (accordion)                 │ → Preguntas comunes
├─────────────────────────────────────┤
│ 12. FOOTER CTA (sticky bottom)      │ → Registro final
└─────────────────────────────────────┘
```

---

## 🎨 Diseño Visual — Principios 2025

### **Paleta Dopaminérgica**
```css
/* Colores vibrantes con contraste alto */
--primary: #FF006B;        /* Rosa brillante */
--secondary: #00D9FF;      /* Cyan eléctrico */
--accent: #FFD600;         /* Amarillo neón */
--bg-dark: #0A0E27;        /* Azul oscuro profundo */
--bg-card: #1A1F3A;        /* Cards con glassmorphism */
--text-primary: #FFFFFF;
--text-secondary: #A0AEC0;
```

### **Tipografía**
- **Headings:** Inter/Poppins (Bold 700-900)
- **Body:** Inter (Regular 400, Medium 500)
- **Accents:** Chillax/Clash Display (para números/features)

### **Efectos Visuales**
- ✨ **Glassmorphism** en cards (`backdrop-filter: blur(16px)`)
- 🌈 **Gradientes animados** en fondos
- 💫 **Partículas flotantes** (Three.js/GSAP)
- 🎭 **Parallax scroll** en imágenes
- 🔮 **Bento Grid** para features
- 🌟 **Hover states** con scale + glow

---

## 🧩 Secciones Detalladas

### 1️⃣ **HERO — Primera Impresión**

**Objetivo:** Impacto inmediato + entendimiento del concepto en 5 segundos.

**Elementos:**
- **Fondo:** Gradiente animado + partículas 3D flotantes
- **Headline:** "Crea, Compra, Imprime. Todo en un lugar."
- **Subheadline:** "El marketplace digital que conecta creadores con compradores. Modelos 3D, música, arte digital y servicio de impresión."
- **CTA Principal:** "Explorar Contenido" (botón grande, glow effect)
- **CTA Secundario:** "Subir tu Obra" (outline button)
- **Visual:** Model viewer 3D interactivo rotando (ejemplo de producto destacado)

**Interacciones:**
- Modelo 3D rotable con mouse hover
- Botones con ripple effect
- Parallax suave en el fondo al mover el mouse

**Copy Example:**
```
🎨 CREA, COMPRA, IMPRIME
Todo en un solo lugar.

El marketplace digital donde creadores venden modelos 3D,
música y arte digital. Y los compradores pueden imprimir
sus modelos en 3D físico.

[Explorar Contenido →]  [Subir tu Obra]
```

---

### 2️⃣ **¿QUÉ ES TAKOPI?** — Concepto en 3 Features

**Objetivo:** Explicar el core value en 3 bloques visuales.

**Estructura:** Bento Grid (3 cards horizontales)

**Cards:**

1. **💎 Marketplace Digital**
   - Icon: Cubo 3D girando
   - Text: "Compra y vende modelos 3D, música original, texturas, arte digital."
   - Visual: Grid de productos animados

2. **🖨️ Impresión 3D Integrada**
   - Icon: Impresora 3D animada
   - Text: "Convierte archivos digitales en objetos físicos. Pedí, configurá, imprimí."
   - Visual: Modelo digital → Modelo físico (morphing animation)

3. **🌐 Comunidad Creativa**
   - Icon: Usuarios conectados
   - Text: "Seguí creadores, armá colecciones, comentá, descubrí."
   - Visual: Avatares animados + likes/comments flotantes

**Animación:** Fade-in staggered al hacer scroll (0.1s delay entre cards)

---

### 3️⃣ **PARA VENDEDORES** — Calculadora de Ganancias

**Objetivo:** Mostrar el potencial de ingresos de forma **interactiva**.

**Elementos:**
- **Slider Input:** "¿Cuántos productos querés vender por mes?"
  - Range: 1 a 100 productos
  - Default: 10
- **Price Input:** "Precio promedio por producto"
  - Default: $15.000 CLP
- **Output Animado:**
  ```
  💰 Ganancia mensual estimada: $120.000 CLP
  📊 Comisión Takopi (15%): $18.000 CLP
  ✅ Tu ganancia neta: $102.000 CLP
  ```
- **Counter animado** (números suben con easing)

**Interacción:**
- Sliders con feedback visual
- Números que se actualizan con animación (countUp.js style)
- Confetti explosion al llegar a $1M+ 🎉

**Copy:**
```
💸 CALCULA TUS GANANCIAS

Deslizá para ver cuánto podrías ganar vendiendo en Takopi.

[Slider: Productos por mes] [Input: Precio promedio]

💰 Ganancia mensual: $XXX.XXX
🎯 Comisión Takopi (15%): $XX.XXX
✅ Tu ganancia neta: $XXX.XXX

[Empezar a Vender →]
```

---

### 4️⃣ **PARA COMPRADORES** — Preview de Contenido

**Objetivo:** Mostrar la **experiencia de exploración** de productos.

**Elementos:**
- **Carrusel Horizontal Infinito** (auto-scroll lento)
  - Cards de productos reales de la DB (con ModelViewer3D, MusicPlayer, TextureViewer)
  - Hover → Card crece + muestra precio + CTA "Ver Detalles"
- **Filtros Rápidos:** "Modelos 3D | Música | Texturas | Arte Digital"
  - Click → Filtra el carrusel en tiempo real

**Interacciones:**
- Hover en card → Preview interactivo (3D rota, música reproduce, textura anima)
- Click → Abre ProductModal (reutilizar componente existente)
- Scroll hijacking: Carrusel sigue el scroll del usuario

**Copy:**
```
🛍️ DESCUBRÍ CONTENIDO DE CALIDAD

Miles de creadores vendiendo modelos 3D, música,
texturas y más. Todo listo para descargar.

[Filtros: 🎨 Todo | 🧊 3D | 🎵 Música | 🖼️ Texturas]

[Carrusel de productos con previews interactivos]

[Explorar Marketplace →]
```

---

### 5️⃣ **IMPRESIÓN 3D** — Feature Highlight

**Objetivo:** Explicar el **diferencial clave** de Takopi.

**Estructura:** Split screen (50/50)

**Izquierda (Visual):**
- Animación de morfeo: Modelo 3D digital → Objeto físico impreso
- Video/GIF de impresora 3D en acción
- Timeline animado: "Elegí → Configurá → Imprimí → Recibí"

**Derecha (Texto):**
```
🖨️ DEL DIGITAL AL FÍSICO

¿Te gustó un modelo 3D? Imprimilo en físico.

✅ Elegí el modelo que querés imprimir
🎨 Personalizá tamaño, color y material
📦 Lo enviamos a tu casa
🚀 Impresión profesional con PLA/PETG/Resina

[Configurar Impresión →]
```

**Interacciones:**
- Hover en cada paso del timeline → Tooltip con detalles
- Botón "Ver Ejemplo" → Abre modal con configurador 3D

---

### 6️⃣ **SOCIAL LAYER** — Comunidad e Interacción

**Objetivo:** Mostrar que Takopi es una **red social** de creadores.

**Elementos:**
- **Grid de Avatares Animados:** Usuarios destacados con hover effect
- **Feed en Vivo:** Comments/Likes apareciendo en tiempo real (simulados con animación)
- **Estadísticas Sociales:**
  ```
  👥 1,250 Creadores Activos
  ❤️ 45K Likes este mes
  💬 8.2K Comentarios
  ```

**Interacciones:**
- Avatares con hover → Muestra username + bio
- Animación de "likes" subiendo (burbujas flotantes)
- Click en "Ver Comunidad" → Redirect a `/explore`

**Copy:**
```
🌐 CONECTÁ CON CREADORES

Seguí a tus artistas favoritos, comentá sus obras,
armá colecciones personalizadas.

[Grid de avatares con hover]

👥 1,250 creadores | ❤️ 45K likes | 💬 8.2K comentarios

[Explorar Comunidad →]
```

---

### 7️⃣ **TIPOS DE USUARIOS** — Cards de Roles

**Objetivo:** Segmentar audiencias y mostrar beneficios específicos.

**Estructura:** 3 Cards (Bento Grid)

**Card 1: 🎨 CREADORES**
```
Subí tus modelos 3D, música, texturas.
Vendé sin intermediarios. Retirá tus ganancias.

✅ Comisión justa (15%)
✅ Control total de precios
✅ Analytics de ventas

[Empezar a Vender]
```

**Card 2: 🛍️ COLECCIONISTAS**
```
Descargá contenido digital premium.
Imprimí modelos 3D en físico.

✅ Descargas ilimitadas
✅ Soporte de creadores
✅ Colecciones personalizadas

[Explorar Marketplace]
```

**Card 3: 🖨️ FABRICANTES**
```
Ofrecé tu servicio de impresión 3D.
Conectá con compradores directamente.

✅ Pedidos automáticos
✅ Gestión de cotizaciones
✅ Pagos seguros

[Registrar Servicio] (Coming Soon)
```

**Animación:** Cards aparecen con stagger + bounce effect

---

### 8️⃣ **MÉTRICAS** — Social Proof Animado

**Objetivo:** Credibilidad con **números reales** que suben al hacer scroll.

**Elementos:**
- **Counter Animado** (countUp.js o Framer Motion):
  ```
  📊 30 Productos Disponibles
  👥 10 Creadores Activos
  💰 $1.2M en Ventas (simulado para impacto)
  🖨️ 150 Impresiones Realizadas (simulado)
  ```

**Interacción:**
- Números suben desde 0 al entrar en viewport
- Iconos con glow effect

**Copy:**
```
📈 TAKOPI EN NÚMEROS

[Iconos animados + Counters]

30    Productos Digitales
10    Creadores Verificados
$1.2M Transacciones Totales
150   Impresiones 3D

[Unirme Ahora →]
```

---

### 9️⃣ **ONBOARDING** — Cómo Empezar en 3 Pasos

**Objetivo:** Reducir fricción mostrando lo **simple** que es empezar.

**Estructura:** Timeline horizontal con iconos grandes

**Pasos:**

1. **📝 REGISTRATE**
   - "Creá tu cuenta gratis en 30 segundos."
   - Icon: Usuario + checkmark

2. **🎨 EXPLORÁ O SUBÍ**
   - "Buscá contenido o subí tus creaciones."
   - Icon: Upload arrow + lupa

3. **🚀 COMPRÁ O VENDÉ**
   - "Descargá, imprimí o empezá a ganar."
   - Icon: Carrito + billete

**Interacción:**
- Hover en cada paso → Card se expande con más detalles
- Animación de línea conectando los pasos (draw effect)

**Copy:**
```
🚀 EMPEZÁ EN 3 PASOS

1️⃣ Registrate gratis
2️⃣ Explorá o subí contenido
3️⃣ Comprá, vendé o imprimí

[Crear Cuenta Gratis →]
```

---

### 🔟 **MVP BENEFITS** — Bento Grid de Features

**Objetivo:** Mostrar **todo lo que podés hacer** de forma visual.

**Grid Layout:** 6 cards (2 rows x 3 cols)

**Features:**

1. **💎 Contenido Premium**
   - "Modelos 3D, música, texturas, arte digital."

2. **🖨️ Impresión Física**
   - "Imprimí tus modelos 3D en casa o pedí impresión."

3. **💰 Vende Fácil**
   - "Subí, poné precio, retirá ganancias."

4. **🔒 Pagos Seguros**
   - "Transbank Webpay integrado."

5. **📦 Descargas Ilimitadas**
   - "Descargá tus compras cuantas veces quieras."

6. **🌐 Red Social**
   - "Seguí, comentá, armá colecciones."

**Animación:** Fade-in staggered + hover scale

---

### 1️⃣1️⃣ **FAQ** — Accordion Interactivo

**Objetivo:** Resolver dudas comunes antes del registro.

**Preguntas:**

**Q1: ¿Qué tipo de contenido puedo vender?**
A: Modelos 3D (.glb, .obj, .fbx), música (.mp3, .wav), texturas (.jpg, .png), arte digital.

**Q2: ¿Cuánto cuesta vender en Takopi?**
A: Registrarte es gratis. Cobramos 15% de comisión por venta.

**Q3: ¿Cómo funciona la impresión 3D?**
A: Elegís el modelo, configurás tamaño/color/material, y lo enviamos impreso a tu casa.

**Q4: ¿Puedo descargar mis compras varias veces?**
A: Sí, descargas ilimitadas de todo lo que compres.

**Q5: ¿Los pagos son seguros?**
A: Sí, usamos Transbank Webpay (estándar bancario chileno).

**Interacción:**
- Click → Accordion se expande con smooth animation
- Icon cambia (+ → −)

---

### 1️⃣2️⃣ **FOOTER CTA** — Registro Final

**Objetivo:** Última oportunidad de conversión antes del footer.

**Elementos:**
- **Headline:** "¿Listo para empezar?"
- **CTA Grande:** "Crear Cuenta Gratis" (botón con glow)
- **Sub-CTA:** "Ya tengo cuenta" → Login

**Copy:**
```
✨ UNITE A TAKOPI HOY

Creá, comprá, imprimí. Todo en un solo lugar.

[Crear Cuenta Gratis →]  [Ya tengo cuenta]
```

---

## 🎮 Gamificación y Dopamina

### **Elementos Dopaminérgicos**

1. **Scroll Progress Bar** (top de la página)
   - Barra que se llena a medida que scrolleas
   - Color gradiente animado

2. **Confetti Explosions**
   - Al completar acciones (ej: Calculadora de ganancias > $1M)
   - Al hacer hover en botones importantes

3. **Micro-interacciones**
   - Botones con ripple effect
   - Cards con bounce al hover
   - Iconos que giran/rotan al hover

4. **Loading States Divertidos**
   - Skeleton screens con shimmer effect
   - Spinners con branding Takopi

5. **Toast Notifications**
   - Mensajes de éxito con iconos animados
   - Sonidos sutiles (opcional)

6. **Achievements Visuales**
   - Badges al completar onboarding
   - "🎉 ¡Primera compra completada!"

---

## 🛠️ Stack Técnico Recomendado

### **Animaciones y Scroll**
- **Framer Motion** → Animaciones React declarativas
- **GSAP (GreenSock)** → Scroll-triggered animations complejas
- **Lenis Smooth Scroll** → Scroll suave y natural
- **React Intersection Observer** → Detección de viewport

### **3D y Visuales**
- **Three.js** → Partículas 3D en fondo
- **@google/model-viewer** → Previews de modelos 3D (ya lo tenés)
- **Canvas Confetti** → Efectos de confetti

### **UI Components**
- **Radix UI** → Headless components (Accordion, Slider, etc.)
- **Tailwind CSS** → Utility-first styling (ya lo tenés)
- **Lucide Icons** → Iconos modernos

### **Performance**
- **Next.js Image** → Lazy loading optimizado
- **Dynamic Imports** → Code splitting por sección
- **React.lazy** → Componentes pesados cargados on-demand

---

## 🎯 Conversión y CTAs

### **Jerarquía de CTAs**

**Primarios (botones grandes, color primario):**
- "Explorar Contenido"
- "Crear Cuenta Gratis"
- "Empezar a Vender"

**Secundarios (outline, color secundario):**
- "Subir tu Obra"
- "Ver Ejemplo"
- "Ya tengo cuenta"

**Terciarios (links, sin botón):**
- "Explorar Comunidad"
- "Ver Documentación"

### **Principios de Optimización**

1. **Above the Fold:** CTA principal visible sin scroll
2. **Repetición:** CTAs cada 2-3 secciones
3. **Urgencia Sutil:** "Únete a 1,250 creadores" (social proof)
4. **Fricción Mínima:** "Gratis", "30 segundos", "Sin tarjeta"

---

## 📊 Métricas de Éxito (Tracking)

### **KPIs a Medir**

1. **Engagement:**
   - Scroll depth (¿llegan a sección 6+?)
   - Time on page
   - Clicks en ModelViewer 3D

2. **Conversión:**
   - % de visitors → registros
   - Clicks en CTAs primarios
   - Calculadora de ganancias usada

3. **Interacciones:**
   - Hover en cards
   - Expansión de FAQ
   - Clicks en carrusel de productos

**Herramientas:**
- Google Analytics 4
- Hotjar (heatmaps)
- Vercel Analytics

---

## 🚀 Plan de Implementación

### **Fase 1: Estructura Base (Semana 1)**
- [ ] Setup de scroll-triggered animations (GSAP + Framer Motion)
- [ ] Componentes Hero + Section Wrapper
- [ ] Scroll Progress Bar
- [ ] Bento Grid system

### **Fase 2: Secciones Core (Semana 2)**
- [ ] Hero con Model Viewer 3D
- [ ] ¿Qué es Takopi? (3 features)
- [ ] Calculadora de Ganancias (interactiva)
- [ ] Carrusel de Productos

### **Fase 3: Features Avanzadas (Semana 3)**
- [ ] Impresión 3D (split screen + animación)
- [ ] Social Layer (avatares + feed animado)
- [ ] Métricas con counters animados
- [ ] FAQ Accordion

### **Fase 4: Polish y Optimización (Semana 4)**
- [ ] Micro-interacciones (ripples, confetti)
- [ ] Performance optimization (lazy loading)
- [ ] Mobile responsive
- [ ] A/B testing de copy

---

## 🎨 Ejemplo de Código: Hero Section

```tsx
// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      {/* Partículas 3D de fondo */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <OrbitControls enableZoom={false} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* Agregar modelo 3D flotante aquí */}
        </Canvas>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-4 text-6xl font-bold text-white md:text-8xl">
            Crea, Compra, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006B] to-[#00D9FF]">Imprime</span>
          </h1>
          <p className="mb-8 text-xl text-[#A0AEC0] md:text-2xl">
            El marketplace digital que conecta creadores con compradores.<br />
            Modelos 3D, música, arte digital y servicio de impresión.
          </p>
          
          <div className="flex flex-col gap-4 md:flex-row md:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-gradient-to-r from-[#FF006B] to-[#FF4D94] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#FF006B]/50 transition-all hover:shadow-xl hover:shadow-[#FF006B]/70"
            >
              Explorar Contenido →
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border-2 border-[#00D9FF] px-8 py-4 text-lg font-semibold text-[#00D9FF] transition-all hover:bg-[#00D9FF] hover:text-[#0A0E27]"
            >
              Subir tu Obra
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#A0AEC0]"
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
```

---

## ✅ Checklist de Diseño

### **Antes de Publicar:**
- [ ] Scroll suave en todas las secciones
- [ ] Animaciones sin lag (60fps mínimo)
- [ ] Responsive en mobile/tablet/desktop
- [ ] Accesibilidad (alt text, ARIA labels, keyboard navigation)
- [ ] SEO optimizado (meta tags, schema.org)
- [ ] Performance (Lighthouse score > 90)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Todos los CTAs funcionan y redirigen correctamente
- [ ] Imágenes optimizadas (WebP, lazy loading)
- [ ] Contenido real (no lorem ipsum)

---

## 🎯 Próximos Pasos

1. **Revisar esta research** y confirmar secciones
2. **Crear componentes base** (HeroSection, BentoGrid, ScrollSection)
3. **Implementar sección por sección** (iterativo)
4. **Testing con usuarios reales** (feedback de scroll/UX)
5. **Optimización de conversión** (A/B testing de copy/CTAs)

---

**¿Todo claro, Sushi? ¿Empezamos con el Hero o quieres ajustar alguna sección?** 🚀
