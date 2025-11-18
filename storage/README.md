# 📁 Sistema de Storage Local - Takopi

## 🎯 Almacenamiento Local

El proyecto usa almacenamiento local basado en archivos JSON para desarrollo. Esto permite:

- ✅ **Desarrollo rápido** sin configuración de bases de datos
- ✅ **Testing simple** sin dependencias externas  
- ✅ **Portabilidad** - los datos están en el repositorio
- ✅ **Migración fácil** cuando implementes un backend escalable

## 📂 Estructura de Carpetas

```
storage/
├── users/           # Usuarios del sistema
├── content/         # Contenido (modelos 3D, texturas, música)
├── purchases/       # Compras realizadas
├── likes/           # Likes de usuarios
├── follows/         # Relaciones de seguimiento
├── comments/        # Comentarios
└── webpay_transactions/  # Transacciones de pago
```

## 🚀 Uso

Todo el sistema usa storage local automáticamente. Los archivos se guardan en:
- **Datos JSON**: `storage/<entidad>/` (usuarios, contenido, etc.)
- **Archivos subidos**: `public/uploads/` (imágenes, modelos 3D, etc.)

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


## 💾 Datos de Ejemplo

El sistema incluye datos de prueba:

- **3 usuarios**: admin, creador1, usuario1
- **3 contenidos**: modelo 3D, texturas, música gratuita
- **Likes y follows** de ejemplo
- **1 compra** de ejemplo

## 🔄 Próximos Pasos (Backend Escalable)

Cuando implementes un backend real:

1. **Reemplazar implementaciones locales** por servicios HTTP/APIs
2. **Las interfaces ya están definidas** - solo cambia la implementación
3. **Arquitectura limpia** permite migrar fácilmente
4. **Considera usar**: PostgreSQL, MongoDB, Supabase, Firebase, o tu backend custom

## 🎯 Ventajas del Sistema Actual

- ✅ **Sin configuración** de base de datos
- ✅ **Datos visibles** en archivos JSON  
- ✅ **Fácil debugging** y testing
- ✅ **Desarrollo rápido** sin dependencias externas
- ✅ **Arquitectura preparada** para escalar

---

**Nota**: Este es un sistema de desarrollo. Para producción, implementa un backend con base de datos real y autenticación segura.
