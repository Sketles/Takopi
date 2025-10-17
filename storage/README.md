# 📁 Sistema de Storage Local - Takopi

## 🎯 ¿Por qué usar Storage Local?

Este sistema te permite **desarrollar sin base de datos** y migrar fácilmente después. Es perfecto para:

- ✅ **Prototipos rápidos** sin configuración compleja
- ✅ **Testing fácil** sin dependencias externas  
- ✅ **Desarrollo offline** sin necesidad de MongoDB
- ✅ **Migración simple** a base de datos después

## 📂 Estructura de Carpetas

```
storage/
├── users/           # Usuarios del sistema
├── content/         # Contenido (modelos 3D, texturas, música)
├── purchases/       # Compras realizadas
├── likes/           # Likes de usuarios
├── follows/         # Relaciones de seguimiento
└── uploads/         # Archivos subidos
```

## 🔧 Configuración

### Modo Storage Local (Recomendado para desarrollo)
```bash
# En .env.local
STORAGE_MODE=local
```

### Modo MongoDB (Para producción)
```bash
# En .env.local
STORAGE_MODE=mongodb
MONGODB_URI=mongodb://localhost:27017/takopi_dev
```

## 🚀 Uso del Sistema

### 1. APIs Disponibles

#### Storage Local:
- `POST /api/auth/login-storage` - Login con archivos
- `GET /api/content/explore-storage` - Explorar contenido

#### MongoDB (original):
- `POST /api/auth/login` - Login con MongoDB
- `GET /api/content/explore` - Explorar contenido

### 2. Ejemplo de Uso

```typescript
import { userStorage, contentStorage } from '@/lib/storage';

// Crear un usuario
const newUser = await userStorage.create({
  username: 'nuevo_usuario',
  email: 'usuario@ejemplo.com',
  password: 'hash_de_password',
  role: 'user'
});

// Buscar contenido
const content = await contentStorage.findByCategory('arquitectura');

// Paginación
const { data, pagination } = await contentStorage.paginate(1, 10);
```

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo:

- **3 usuarios**: admin, creador1, usuario1
- **3 contenidos**: modelo 3D, texturas, música gratuita
- **Likes y follows** de ejemplo
- **1 compra** de ejemplo

## 🔄 Migración a MongoDB

Cuando estés listo para usar MongoDB:

1. **Cambiar configuración**:
   ```bash
   STORAGE_MODE=mongodb
   ```

2. **Las APIs se cambian automáticamente**:
   - `/api/auth/login-storage` → `/api/auth/login`
   - `/api/content/explore-storage` → `/api/content/explore`

3. **Los datos se mantienen** en MongoDB

## 🎨 Ventajas del Sistema

### ✅ Para Desarrollo:
- **Sin configuración** de base de datos
- **Datos visibles** en archivos JSON
- **Fácil debugging** y testing
- **Desarrollo rápido**

### ✅ Para Producción:
- **Migración automática** a MongoDB
- **Misma interfaz** de programación
- **Escalabilidad** real
- **Backup** automático

## 🔍 Flujo Típico de Desarrollo

1. **Prototipo** → Storage Local (archivos)
2. **Testing** → Storage Local (fácil)
3. **Producción** → MongoDB (escalable)

¡Perfecto para el desarrollo ágil! 🚀
