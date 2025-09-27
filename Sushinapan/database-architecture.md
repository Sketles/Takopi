# Arquitectura de Base de Datos - Takopi

## Resumen General

Takopi utiliza **MongoDB** como base de datos principal con **Mongoose** como ODM (Object Document Mapper). La base de datos está diseñada para soportar un marketplace de contenido digital con funcionalidades de usuarios, contenido, y transacciones.

## Configuración de Base de Datos

- **Motor**: MongoDB
- **ODM**: Mongoose
- **Modos de Operación**:
  - `local`: MongoDB local en puerto 27017
  - `atlas`: MongoDB Atlas (cloud)
  - `auto`: Auto-detección del modo disponible

---

## Colecciones

### 1. **users** (Usuarios)

Tabla principal para almacenar información de usuarios del sistema.

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Identificador único del usuario |
| `username` | String | ✅ | ✅ | Nombre de usuario (3-30 caracteres) |
| `email` | String | ✅ | ✅ | Email del usuario (formato válido) |
| `password` | String | ✅ | ❌ | Contraseña hasheada (mín. 6 caracteres) |
| `role` | Enum | ✅ | ❌ | Rol del usuario: 'Explorer', 'Artist', 'Buyer', 'Maker' |
| `avatar` | String | ❌ | ❌ | URL del avatar del usuario |
| `banner` | String | ❌ | ❌ | URL del banner del usuario |
| `bio` | String | ❌ | ❌ | Biografía del usuario (máx. 500 caracteres) |
| `purchases` | [ObjectId] | ❌ | ❌ | Array de IDs de compras (ref: 'Order') |
| `models` | [ObjectId] | ❌ | ❌ | Array de IDs de modelos creados (ref: 'Model3D') |
| `likedModels` | [ObjectId] | ❌ | ❌ | Array de IDs de modelos que le gustaron (ref: 'Model3D') |
| `followers` | [ObjectId] | ❌ | ❌ | Array de IDs de seguidores (ref: 'User') |
| `following` | [ObjectId] | ❌ | ❌ | Array de IDs de usuarios que sigue (ref: 'User') |
| `isActive` | Boolean | ❌ | ❌ | Estado activo del usuario (default: true) |
| `createdAt` | Date | ✅ | ❌ | Fecha de creación (timestamp) |
| `updatedAt` | Date | ✅ | ❌ | Fecha de última actualización (timestamp) |

#### Índices
- `email` (único)
- `username` (único)
- `role`

---

### 2. **contents** (Contenido)

Tabla principal para almacenar contenido digital del marketplace.

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Identificador único del contenido |
| `title` | String | ✅ | ❌ | Título del contenido (máx. 100 caracteres) |
| `provisionalName` | String | ❌ | ❌ | Nombre provisional del contenido |
| `description` | String | ✅ | ❌ | Descripción completa (máx. 2000 caracteres) |
| `shortDescription` | String | ❌ | ❌ | Descripción corta (máx. 500 caracteres) |
| `contentType` | Enum | ✅ | ❌ | Tipo: 'avatares', 'modelos3d', 'musica', 'texturas', 'animaciones', 'OBS', 'colecciones' |
| `category` | String | ✅ | ❌ | Categoría principal del contenido |
| `subcategory` | String | ❌ | ❌ | Subcategoría del contenido |
| `files` | [ContentFile] | ❌ | ❌ | Array de archivos del contenido |
| `coverImage` | String | ❌ | ❌ | URL de la imagen de portada |
| `additionalImages` | [String] | ❌ | ❌ | Array de URLs de imágenes adicionales |
| `price` | Number | ✅ | ❌ | Precio del contenido (mín. 0) |
| `isFree` | Boolean | ✅ | ❌ | Si el contenido es gratuito |
| `currency` | String | ✅ | ❌ | Moneda del precio (default: 'CLP') |
| `license` | Enum | ✅ | ❌ | Licencia: 'personal', 'commercial', 'streaming', 'royalty-free', 'custom' |
| `customLicense` | String | ❌ | ❌ | Licencia personalizada |
| `tags` | [String] | ❌ | ❌ | Array de etiquetas predefinidas |
| `customTags` | [String] | ❌ | ❌ | Array de etiquetas personalizadas |
| `visibility` | Enum | ✅ | ❌ | Visibilidad: 'public', 'unlisted', 'draft' |
| `allowTips` | Boolean | ❌ | ❌ | Si permite propinas |
| `allowCommissions` | Boolean | ❌ | ❌ | Si permite comisiones |
| `author` | ObjectId | ✅ | ❌ | ID del autor (ref: 'User') |
| `authorUsername` | String | ✅ | ❌ | Username del autor (cache) |
| `views` | Number | ❌ | ❌ | Número de visualizaciones (default: 0) |
| `downloads` | Number | ❌ | ❌ | Número de descargas (default: 0) |
| `likes` | Number | ❌ | ❌ | Número de likes (default: 0) |
| `favorites` | Number | ❌ | ❌ | Número de favoritos (default: 0) |
| `status` | Enum | ✅ | ❌ | Estado: 'draft', 'published', 'archived', 'rejected' |
| `moderated` | Boolean | ❌ | ❌ | Si ha sido moderado |
| `moderatedAt` | Date | ❌ | ❌ | Fecha de moderación |
| `moderatedBy` | ObjectId | ❌ | ❌ | ID del moderador (ref: 'User') |
| `moderationNotes` | String | ❌ | ❌ | Notas de moderación |
| `publishedAt` | Date | ❌ | ❌ | Fecha de publicación |
| `createdAt` | Date | ✅ | ❌ | Fecha de creación (timestamp) |
| `updatedAt` | Date | ✅ | ❌ | Fecha de última actualización (timestamp) |

#### Subdocumento: ContentFile
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | String | ✅ | Nombre del archivo en el sistema |
| `originalName` | String | ✅ | Nombre original del archivo |
| `size` | Number | ✅ | Tamaño del archivo en bytes |
| `type` | String | ✅ | MIME type del archivo |
| `url` | String | ✅ | URL de acceso al archivo |
| `previewUrl` | String | ❌ | URL de preview del archivo |

#### Índices
- `author` + `status`
- `contentType` + `status`
- `category` + `subcategory`
- `tags`
- `price` + `isFree`
- `createdAt` (descendente)
- `views` (descendente)
- `likes` (descendente)

#### Virtuals
- `allTags`: Combina `tags` + `customTags`
- `isPublished`: `status === 'published' && visibility === 'public'`
- `formattedPrice`: Precio formateado con moneda

---

## Relaciones

### Relaciones Principales

```
users (1) ──────── (N) contents
  │                    │
  │                    │
  │                    └── author: ObjectId
  │
  └── purchases: [ObjectId] ──── (N) orders (futuro)
  └── models: [ObjectId] ─────── (N) contents
  └── likedModels: [ObjectId] ── (N) contents
  └── followers: [ObjectId] ──── (N) users
  └── following: [ObjectId] ──── (N) users
```

### Relaciones de Contenido

```
contents (1) ──────── (N) content_files
  │
  └── author: ObjectId ──── (1) users
```

---

## Esquemas de Validación

### Usuario
- **Username**: 3-30 caracteres, único
- **Email**: Formato válido, único, lowercase
- **Password**: Mínimo 6 caracteres
- **Role**: Enum con valores predefinidos
- **Bio**: Máximo 500 caracteres

### Contenido
- **Title**: Máximo 100 caracteres
- **Description**: Máximo 2000 caracteres
- **ShortDescription**: Máximo 500 caracteres
- **Price**: Número positivo
- **ContentType**: Enum con tipos predefinidos
- **License**: Enum con licencias predefinidas

---

## Middleware y Hooks

### Pre-save Hooks

#### Content Schema
1. **publishedAt**: Se establece automáticamente cuando `status` cambia a 'published'
2. **authorUsername**: Se actualiza automáticamente cuando cambia el `author`

### Post-save Hooks
- Actualización de cache de `authorUsername` cuando se modifica el autor

---

## Configuración de Conexión

### Variables de Entorno
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=secret_key_for_jwt
NEXTAUTH_SECRET=secret_key_for_nextauth
NEXTAUTH_URL=http://localhost:3000
```

### Modos de Operación
- **Desarrollo Local**: `mongodb://localhost:27017/takopi_dev`
- **Producción Atlas**: URI completa de MongoDB Atlas
- **Auto-detección**: Detecta automáticamente el modo disponible

---

## Consideraciones de Rendimiento

### Índices Optimizados
- Índices compuestos para consultas frecuentes
- Índices de texto para búsquedas
- Índices de fecha para ordenamiento temporal

### Estrategias de Cache
- `authorUsername` cacheado en contenido
- Virtuals para datos calculados
- Índices para consultas rápidas

### Escalabilidad
- Diseño preparado para sharding
- Referencias por ObjectId para relaciones
- Separación de datos de archivos y metadatos

---

## Migraciones Futuras

### Colecciones Planificadas
- **orders**: Órdenes de compra
- **transactions**: Transacciones de pago
- **reviews**: Reseñas de contenido
- **notifications**: Notificaciones de usuario
- **analytics**: Métricas de uso

### Mejoras de Esquema
- Soft deletes para contenido
- Versionado de contenido
- Historial de cambios
- Auditoría de modificaciones

---

*Documentación generada automáticamente basada en los modelos Mongoose del proyecto Takopi.*
