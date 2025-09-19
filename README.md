# Takopi - Creative Digital Marketplace

## 🚀 The Future of Digital Commerce

Takopi is a revolutionary digital ecosystem that combines creative commerce, urban culture, and cutting-edge technology. We're building the next-generation marketplace for 3D models, digital assets, and creative communities.

## ✨ Key Features

- **3D Model Marketplace**: Buy and sell models with clear licensing (Personal, Indie, Pro)
- **Pinterest-Style Discovery**: Visual discovery with affinity algorithms
- **Creator Profiles**: Role-based profiles (Artist, Explorer, Buyer, Maker)
- **Cultural Mapping**: Community-driven mapping of urban tribes and events
- **Mystery Orbs**: Surprise bundles that reveal after purchase
- **AI Chatbot**: Intelligent assistant for queries and support
- **3D Printing**: On-demand printing service with real-time tracking

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS v4
- **Base de Datos**: MongoDB Atlas (próximamente)
- **Autenticación**: NextAuth.js (próximamente)
- **IA**: OpenAI API (próximamente)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── auth/              # Autenticación
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── feed/              # Feed principal
│   ├── profile/           # Perfiles de usuario
│   ├── explore/           # Página de exploración
│   ├── cultural-map/      # Mapa cultural
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   └── shared/            # Componentes compartidos
│       ├── Header.tsx     # Navegación principal
│       ├── Footer.tsx     # Pie de página
│       └── Layout.tsx     # Layout global
├── lib/                   # Utilidades y configuraciones
├── types/                 # Tipos de TypeScript
└── hooks/                 # Custom hooks (próximamente)
```

## 🏃‍♂️ Cómo Ejecutar

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📄 Páginas Disponibles

- **`/`** - Página principal con información del proyecto
- **`/feed`** - Feed principal con modelos 3D
- **`/auth/login`** - Página de inicio de sesión
- **`/auth/register`** - Página de registro
- **`/profile`** - Perfil de usuario
- **`/explore`** - Explorar contenido
- **`/cultural-map`** - Mapa cultural

## 🎯 Estado Actual (Fase 1-2)

### ✅ Completado
- [x] Estructura básica del proyecto
- [x] Componentes de navegación (Header, Footer, Layout)
- [x] Páginas de autenticación (Login, Register)
- [x] Página principal con información del proyecto
- [x] Feed principal con grid de modelos
- [x] Página de perfil de usuario
- [x] Página de exploración
- [x] Página del mapa cultural
- [x] Diseño responsivo y moderno
- [x] Sin errores de linting

### 🔄 Próximos Pasos
- [ ] Configurar MongoDB Atlas
- [ ] Implementar autenticación real
- [ ] Agregar visor 3D con `<model-viewer>`
- [ ] Implementar sistema de checkout
- [ ] Integrar chatbot con OpenAI
- [ ] Implementar mapa interactivo con Leaflet
- [ ] Agregar sistema de orbes

## 📚 Documentación Adicional

- [Plan APT](./NEURONAL/PLAN_APT.md) - Planificación del proyecto de tesis
- [Guía de Implementación](./NEURONAL/takopi_guia_corta_para_cursor_gpt_5_generacion_por_fases_escalable.md)
- [Contexto del Proyecto](./NEURONAL/neuronal.md)

## 🌟 Vision

Takopi is revolutionizing how creators, makers, and digital artists connect, collaborate, and commercialize their work in the digital age.

---

*Built with ❤️ by the Takopi Team - 2025*