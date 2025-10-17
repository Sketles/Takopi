# 📁 Guía de Manejo de Archivos - Takopi

## 🎯 Principio Fundamental

**NUNCA guardes archivos grandes en JSON**. Solo guarda las **rutas/URLs** a los archivos.

## ✅ Estructura Correcta

### En JSON (storage/*.json)
```json
{
  "_id": "content_1",
  "title": "Modelo 3D de Casa",
  "coverImage": "/uploads/covers/cover-casa.jpg",  ← Solo la ruta
  "files": [
    "/uploads/content/modelos3d/casa.glb",        ← Solo la ruta
    "/uploads/content/texturas/pared.jpg"         ← Solo la ruta
  ]
}
```

### En Carpetas (archivos reales)
```
public/
└── uploads/
    ├── covers/              # Imágenes de portada
    │   └── cover-casa.jpg   # ← Archivo real aquí
    ├── content/
    │   ├── modelos3d/       # Modelos 3D
    │   │   └── casa.glb     # ← Archivo real aquí
    │   ├── texturas/        # Texturas
    │   │   └── pared.jpg    # ← Archivo real aquí
    │   ├── musica/          # Audio
    │   │   └── track.mp3    # ← Archivo real aquí
    │   └── avatares/        # Avatares
    │       └── avatar.glb   # ← Archivo real aquí
    └── users/               # Avatares de usuarios
        └── avatar-user.jpg  # ← Archivo real aquí
```

## 📦 Tipos de Archivos

### 1. Imágenes de Portada
**Ubicación**: `public/uploads/covers/`
**Formatos**: `.jpg`, `.png`, `.webp`
**Tamaño máximo**: 5MB
**Guardar en JSON**: Solo la ruta

```json
{
  "coverImage": "/uploads/covers/cover-1234567890.jpg"
}
```

### 2. Modelos 3D
**Ubicación**: `public/uploads/content/modelos3d/`
**Formatos**: `.glb`, `.gltf`
**Tamaño máximo**: 50MB
**Guardar en JSON**: Solo la ruta

```json
{
  "files": [
    "/uploads/content/modelos3d/file-1234567890.glb"
  ]
}
```

### 3. Texturas
**Ubicación**: `public/uploads/content/texturas/`
**Formatos**: `.jpg`, `.png`, `.exr`
**Tamaño máximo**: 10MB por archivo
**Guardar en JSON**: Solo la ruta

```json
{
  "files": [
    "/uploads/content/texturas/texture-wood.jpg",
    "/uploads/content/texturas/texture-metal.png"
  ]
}
```

### 4. Audio
**Ubicación**: `public/uploads/content/musica/`
**Formatos**: `.mp3`, `.wav`, `.ogg`
**Tamaño máximo**: 20MB
**Guardar en JSON**: Solo la ruta

```json
{
  "files": [
    "/uploads/content/musica/track-1234567890.mp3"
  ]
}
```

### 5. Avatares de Usuarios
**Ubicación**: `public/uploads/users/`
**Formatos**: `.jpg`, `.png`
**Tamaño máximo**: 2MB
**Guardar en JSON**: Solo la ruta

```json
{
  "avatar": "/uploads/users/avatar-user123.jpg"
}
```

## 🔧 Cómo Funciona el Upload

### Flujo de Subida de Archivos

```
1. Usuario sube archivo
   ↓
2. API /api/upload recibe archivo
   ↓
3. Multer procesa el archivo
   ↓
4. Archivo se guarda en /public/uploads/[tipo]/
   ↓
5. Se genera nombre único: file-[timestamp]-[random].ext
   ↓
6. Se devuelve la ruta: /uploads/content/modelos3d/file-123.glb
   ↓
7. Frontend guarda solo la ruta en el JSON
   ↓
8. JSON se guarda en /storage/content/index.json
```

### Ejemplo Completo

**Paso 1: Subir archivo**
```typescript
// Frontend
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'modelos3d');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const { url } = await response.json();
// url = "/uploads/content/modelos3d/file-1234567890.glb"
```

**Paso 2: Crear contenido con la ruta**
```typescript
// Frontend
const contentData = {
  title: 'Mi Modelo 3D',
  description: 'Descripción...',
  files: [url],  // ← Solo la ruta, NO el archivo
  coverImage: coverUrl,
  // ... más datos
};

await fetch('/api/content', {
  method: 'POST',
  body: JSON.stringify(contentData)
});
```

**Paso 3: Se guarda en JSON**
```json
// storage/content/index.json
{
  "_id": "content_123",
  "title": "Mi Modelo 3D",
  "files": [
    "/uploads/content/modelos3d/file-1234567890.glb"
  ],
  "coverImage": "/uploads/covers/cover-1234567890.jpg"
}
```

**Paso 4: Servir el archivo**
```typescript
// Next.js sirve automáticamente desde /public
// URL: http://localhost:3000/uploads/content/modelos3d/file-1234567890.glb
```

## ⚠️ Errores Comunes

### ❌ INCORRECTO: Guardar archivo en JSON
```json
{
  "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." // ← MAL!
}
```

### ✅ CORRECTO: Guardar ruta en JSON
```json
{
  "file": "/uploads/content/modelos3d/casa.glb" // ← BIEN!
}
```

## 🗂️ Organización de Archivos

### Por Tipo de Contenido
```
public/uploads/content/
├── modelos3d/       # Modelos 3D (.glb, .gltf)
├── texturas/        # Texturas (.jpg, .png, .exr)
├── musica/          # Audio (.mp3, .wav)
├── animaciones/     # Animaciones (.fbx, .glb)
├── avatares/        # Avatares 3D (.glb)
└── colecciones/     # Colecciones mixtas
```

### Por Usuario (opcional)
```
public/uploads/users/
├── user_123/
│   ├── avatar.jpg
│   └── banner.jpg
└── user_456/
    └── avatar.jpg
```

## 🔄 Migración a MongoDB

Cuando cambies a `LOCAL=false`:
- ✅ Los archivos **siguen en `/public/uploads`**
- ✅ Solo las **rutas** se guardan en MongoDB
- ✅ **No cambia nada** en el manejo de archivos

```json
// MongoDB document
{
  "_id": ObjectId("..."),
  "title": "Modelo 3D",
  "files": [
    "/uploads/content/modelos3d/casa.glb"  // ← Misma ruta
  ]
}
```

## 💾 Backup de Archivos

### Archivos a respaldar:
```bash
# Datos (JSON)
/storage/

# Archivos subidos
/public/uploads/
```

### Script de backup:
```bash
# Backup de datos
tar -czf backup-data.tar.gz storage/

# Backup de archivos
tar -czf backup-uploads.tar.gz public/uploads/
```

## 🎯 Resumen

| **Qué**              | **Dónde se guarda**                    | **Qué va en JSON**        |
|----------------------|----------------------------------------|---------------------------|
| Imágenes             | `/public/uploads/covers/`              | Ruta: `/uploads/...`      |
| Modelos 3D           | `/public/uploads/content/modelos3d/`   | Ruta: `/uploads/...`      |
| Texturas             | `/public/uploads/content/texturas/`    | Ruta: `/uploads/...`      |
| Audio                | `/public/uploads/content/musica/`      | Ruta: `/uploads/...`      |
| Avatares             | `/public/uploads/users/`               | Ruta: `/uploads/...`      |
| Datos (metadata)     | `/storage/content/index.json`          | Todo el objeto            |

**Regla de Oro**: Si es un archivo binario (imagen, audio, 3D), guarda solo la ruta en JSON.

---

**¡Archivos organizados correctamente!** 🚀

