# 🌱 Seeding - Pool de Assets

Este sistema permite generar usuarios y productos de prueba automáticamente.

## 📁 Estructura de Carpetas

```
seeding/
├── avatars/      → Fotos de perfil (.jpg, .png, .webp)
├── banners/      → Banners de usuario (.jpg, .png, .webp)
├── covers/       → Portadas de productos (.jpg, .png, .webp)
├── models/       → Modelos 3D (.glb, .gltf, .obj, .stl)
├── music/        → Archivos de audio (.mp3, .wav, .ogg)
├── textures/     → Texturas (.jpg, .png, .webp, .tiff)
├── gallery/      → Imágenes adicionales para galerías
└── usernames.txt → Lista de nombres de usuario (uno por línea)
```

## 🚀 Cómo Usar

### 1. Llena las carpetas con tus assets

Deja archivos en cada carpeta. El script los tomará al azar.

**Mínimo recomendado:**
- `avatars/`: 5+ imágenes
- `banners/`: 5+ imágenes  
- `covers/`: 10+ imágenes
- `models/`: 5+ archivos .glb
- `music/`: 5+ archivos .mp3
- `textures/`: 5+ imágenes
- `gallery/`: 10+ imágenes

### 2. Edita usernames.txt

Agrega los nombres de usuario que quieras (uno por línea).

### 3. Ejecuta el seed

```bash
# Generar 5 usuarios con 3 productos cada uno
npm run seed:generate -- --users 5 --products 3

# O solo especificar usuarios (3 productos por defecto)
npm run seed:generate -- --users 10
```

## 🎲 ¿Qué genera automáticamente el script?

| Tú provees | El script inventa |
|------------|------------------|
| Avatars (imágenes) | Emails (username@takopi.com) |
| Banners (imágenes) | Biografías coherentes |
| Covers (imágenes) | Contraseñas (password123) |
| Modelos 3D | Títulos según tipo de contenido |
| Música | Descripciones detalladas |
| Texturas | Tags relacionados |
| Usernames | Precios variados |
| | Ubicaciones de Chile |
| | Roles (Artist/Maker) |

## 📋 Tipos de Contenido

El script asigna tipos automáticamente según la carpeta:

- `models/` → contentType: `modelos3d`
- `music/` → contentType: `musica`
- `textures/` → contentType: `texturas`

Si hay archivos en múltiples carpetas, el script mezcla productos de diferentes tipos.

## ⚠️ Notas

- Los archivos se suben realmente a Vercel Blob
- Los usuarios se crean en la BD de producción/desarrollo
- El script valida que existan archivos antes de ejecutar
- Si no hay suficientes assets, reutiliza los existentes
