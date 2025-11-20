# Documentación Completa de Takopi
## Guía de Aprendizaje para Estudiantes

---

## Índice

1. [¿Qué es Takopi? - El MVP](#1-qué-es-takopi---el-mvp)
2. [Arquitectura Técnica del Proyecto](#2-arquitectura-técnica-del-proyecto)
3. [Base de Datos y Almacenamiento](#3-base-de-datos-y-almacenamiento)
4. [Sistema de Autenticación](#4-sistema-de-autenticación)
5. [Integración de Pagos (Transbank)](#5-integración-de-pagos-transbank)
6. [Estructura de Tablas y Relaciones](#6-estructura-de-tablas-y-relaciones)
7. [Flujos Principales de la Aplicación](#7-flujos-principales-de-la-aplicación)
8. [Glosario de Términos Técnicos](#8-glosario-de-términos-técnicos)

---

## 1. ¿Qué es Takopi? - El MVP

### 1.1 Propósito de la Plataforma

**Takopi** es un **marketplace digital especializado** en la venta y compra de recursos creativos digitales. Piensa en ella como una tienda en línea donde artistas, diseñadores 3D, músicos y creadores pueden:

- **Vender** sus trabajos digitales (modelos 3D, texturas, ilustraciones, música, etc.)
- **Comprar** recursos para sus propios proyectos
- **Contratar servicios** como impresión 3D o comisiones personalizadas
- **Interactuar socialmente** con otros creadores (seguir, comentar, dar like)

### 1.2 ¿A Quién Está Dirigida?

Takopi tiene **dos tipos principales de usuarios**:

#### Creadores/Vendedores
- Artistas 3D que venden modelos para videojuegos
- Diseñadores de texturas y materiales
- Ilustradores digitales
- Músicos que venden pistas y efectos de sonido
- Diseñadores que ofrecen trabajos a medida (comisiones)

#### Compradores/Exploradores
- Desarrolladores de videojuegos buscando assets
- Estudiantes de diseño que necesitan recursos
- Empresas pequeñas buscando contenido digital
- Personas que quieren imprimir modelos 3D

### 1.3 Funcionalidades Principales (Ya Implementadas)

#### A. Sistema de Publicación Rediseñado

El proceso para subir un nuevo producto está dividido en **3 pasos simples**:

1. **Información Básica**
   - Título del producto
   - Tipo de contenido (modelos 3D, texturas, música, etc.)
   - Categoría específica
   - Descripción breve

2. **Archivos y Detalles**
   - Subida de archivos del producto (modelo .FBX, textura .PNG, etc.)
   - Imagen de portada
   - Precio (o marcar como gratis)
   - Etiquetas (tags) para búsqueda

3. **Publicación**
   - Vista previa en tiempo real del producto
   - Botón "Publicar" para hacerlo visible en el marketplace
   - Opción de guardar como borrador

**Mejora clave**: Antes el proceso tenía 6 pasos confusos. Ahora es más rápido y claro.

**Detalles técnicos de la mejora**:
- **Eliminación de campos obsoletos**: Se removieron opciones no utilizadas como el toggle de "propinas" y la opción interna de "aceptar comisiones" (ahora las comisiones son un tipo de producto independiente).
- **Interfaz reorganizada**: Completamente coherente con el tema oscuro negro/morado de Takopi.
- **Mini vista previa en tiempo real**: El producto se actualiza visualmente conforme editas portada, título, descripción y precio.
- **Optimización móvil**: Distribución fluida y mayor accesibilidad en smartphones y tablets.

Esta reestructuración reduce fricciones, acelera la publicación y mejora la claridad del proceso tanto para creadores casuales como profesionales.

#### B. Biblioteca de Compras Segura

Cuando compras un producto en Takopi, este **queda guardado permanentemente** en tu biblioteca personal, incluso si el creador:

- Elimina el producto del marketplace
- Despublica el contenido
- Borra su cuenta

**¿Cómo funciona?**
- Cada compra crea un registro separado en la base de datos (`Purchase` table)
- Los archivos comprados se "congelan" en tu biblioteca personal
- Puedes descargarlos cuantas veces quieras

**Arquitectura robusta implementada**:
- **Separación producto listado vs producto comprado**: El sistema diferencia el producto público en venta del producto adquirido por un comprador.
- **Protección permanente**: Cuando un creador elimina o despublica un producto, los compradores previos **retienen acceso permanente** al archivo adquirido.
- **Tabla dedicada**: Cada compra se registra en una tabla independiente (`purchases / user_library`), con referencia estable que no depende de la visibilidad del producto original.
- **Política de archivos seguros**: Los archivos en Vercel Blob asociados a compras activas **nunca se eliminan**, incluso si el creador borra su publicación.

Esto protege tu inversión como comprador y permite a los creadores gestionar libremente sus listados sin afectar adquisiciones previas.

#### C. Servicio de Impresión 3D

Esta es una **funcionalidad única** que diferencia a Takopi de otros marketplaces:

**Flujo completo**:
1. Encuentras un modelo 3D que te gusta
2. Haces clic en "Imprimir en 3D"
3. El sistema calcula automáticamente:
   - Costo del modelo digital
   - Costo de impresión (basado en tamaño y material)
   - Costo de envío a tu dirección
4. Pagas todo junto
5. Recibes el modelo impreso en tu casa

**Ventaja**: No necesitas tener una impresora 3D propia. Takopi gestiona todo el proceso.

**Detalles de implementación**:
- **Botón especializado**: Nuevo botón "Imprimir en 3D" disponible en tarjetas y páginas de detalle de productos 3D.
- **Visor integrado**: Envío automático del archivo 3D al visor especializado dentro del sitio.
- **Cotización en tiempo real**: El sistema calcula automáticamente costo de impresión, costo de envío y valor digital del modelo.
- **Precio unificado**: Presentación de un total consolidado (modelo + impresión + envío).
- **Registro híbrido**: La transacción se registra como compra híbrida (producto digital + servicio físico), manteniendo historial y acceso en la biblioteca del usuario.

Esta funcionalidad convierte a Takopi en una plataforma de ciclo completo: creación, descarga, impresión física y entrega.

#### D. Sistema de Comisiones Personalizadas

Los artistas pueden ofrecer **trabajos a medida** directamente en la plataforma:

**¿Qué son las comisiones?**
- Trabajos creativos personalizados (ejemplo: "Necesito un logo personalizado")
- El cliente solicita algo específico
- El artista y el cliente negocian los detalles
- Se trabaja en el proyecto
- Se entrega el resultado final

**Características del sistema**:
- **Chat interno dedicado**: Comunicación entre cliente y artista integrada dentro de Takopi (no necesitas usar WhatsApp o Instagram)
- **Estados claros del flujo de trabajo**:
  - **Abierta**: La comisión está disponible para solicitudes
  - **En progreso**: El artista está trabajando en el proyecto
  - **En revisión**: El cliente revisa el trabajo entregado
  - **Finalizada**: Proyecto completado y aprobado
  - **Cancelada**: Comisión cancelada por cualquiera de las partes
- **Revisiones controladas**: El artista define cuántas correcciones permite
- **Entregas parciales**: Sistema para mostrar avances antes de la entrega final
- **Protección para ambos**: Todo queda registrado en Takopi (mensajes, archivos, acuerdos)

**Configuración del servicio**:
- Estilos de trabajo aceptados
- Precio base o rango de precios
- Tipos de trabajo específicos
- Tiempos estimados de entrega
- Requisitos y políticas del artista

**Ventajas sobre modelos informales** (Instagram, WhatsApp):
- Sin pérdida de mensajes o archivos
- Claridad total en precios acordados
- Plazos definidos y visibles
- Entregas organizadas y trazables
- Protección legal y respaldo de transacciones

**Ejemplo real**:
> Un músico ofrece "Composición de música original para videojuegos - $50.000 CLP"
> 
> Un desarrollador lo contrata, explica su proyecto en el chat interno
> 
> El músico envía 2 demos preliminares como entregas parciales
> 
> Después de 1 revisión, entrega la pista final
> 
> El desarrollador aprueba, paga y descarga el archivo WAV
> 
> Ambos dejan reseñas y la transacción queda registrada permanentemente

**Tipos de trabajos soportados**:
- Ilustraciones y arte digital personalizado
- Composiciones musicales originales
- Modelos 3D a medida
- Diseño de logos y branding
- Texturas y materiales específicos
- Animaciones y motion graphics

Esta categoría formaliza el trabajo artístico personalizado, resolviendo problemas comunes de modelos informales y proporcionando un entorno profesional para servicios creativos.

#### E. Interacciones Sociales

Takopi no es solo una tienda, también es una **red social para creadores**:

- **Seguir a creadores**: Recibe notificaciones de sus nuevos productos
- **Dar like**: Marca tus productos favoritos
- **Comentar**: Deja feedback o preguntas en los productos
- **Pins**: Guarda productos para ver más tarde
- **Perfiles públicos**: Cada creador tiene su página con estadísticas

**Métricas que se muestran**:
- Número de publicaciones
- Total de likes recibidos
- Seguidores y seguidos
- Productos más populares

**Mejoras implementadas en el sistema social**:
- **Registro correcto de autoría**: Los comentarios ahora registran correctamente el `authorId`, enlazando cada interacción con el usuario real.
- **Sistema robusto de likes y pins**: Reestructuración basada en relaciones directas (`userId` ↔ `contentId`), con actualización correcta de contadores incluso en perfiles de terceros.
- **Perfiles públicos precisos**: Métricas reales que reflejan el número exacto de creaciones, likes recibidos, pins públicos, seguidores y seguidos.
- **Botón "Seguir" funcional**: Actualización correcta de la relación en la base de datos con reflejo inmediato del estado en la interfaz.

Estas mejoras consolidan a Takopi como una **plataforma social creativa**, no solo un marketplace transaccional.

#### F. Carrito "Box"

El carrito de compras (llamado "Box" en Takopi) permite:

- Agregar múltiples productos antes de pagar
- Ver el subtotal actualizado en tiempo real
- Eliminar items antes de finalizar
- Proceder al checkout de Transbank

**Diseño actualizado**: 
- Migración completa al tema negro/morado de Takopi
- Interfaz más limpia y clara con mejor organización del contenido
- Funciones esenciales reforzadas para una experiencia de compra fluida
- Coherencia visual y funcional con el resto del sitio

#### G. Sección "Explorar" con Carrusel

La página principal de exploración incluye:

- **Carrusel animado dinámico**: Muestra productos recientes con movimiento automático fluido
- **Diseño responsivo**: Funciona perfectamente en celular, tablet y computador
- **Deslizamiento continuo**: Transiciones suaves entre productos destacados
- **Información relevante**: Cada tarjeta muestra título, precio, creador y portada
- Filtros por categoría, precio y ordenamiento

**Impacto**: El carrusel mejora notablemente la visibilidad del contenido y la experiencia del usuario al explorar nuevos trabajos creativos.

---

## 2. Arquitectura Técnica del Proyecto

### 2.1 Stack Tecnológico (¿Qué herramientas usamos?)

Takopi está construido con tecnologías modernas de desarrollo web:

#### Frontend (Lo que ve el usuario)

- **Next.js 15**: Framework de React para crear páginas web
  - ¿Por qué Next.js? Porque permite:
    - Renderizado en el servidor (las páginas cargan más rápido)
    - Rutas automáticas (cada archivo en `src/app/` es una página)
    - Optimización de imágenes y rendimiento
    - Deploy sencillo en Vercel

- **React 19**: Biblioteca para crear interfaces interactivas
  - Componentes reutilizables (botones, tarjetas, formularios)
  - Hooks para manejar estado (`useState`, `useEffect`)
  - Context API para compartir datos globales (usuario logueado, carrito)

- **TypeScript**: JavaScript con tipos
  - Previene errores antes de ejecutar el código
  - Autocompletado inteligente en el editor
  - Código más mantenible

- **Tailwind CSS v4**: Framework de estilos
  - Clases utilitarias (`bg-black`, `text-purple-500`)
  - Tema personalizado negro/morado
  - Diseño responsivo con breakpoints (`sm:`, `md:`, `lg:`)

#### Backend (Lo que el usuario no ve)

- **Next.js API Routes**: Endpoints HTTP dentro de Next.js
  - Rutas en `src/app/api/`
  - Ejemplos:
    - `/api/auth/login` - Iniciar sesión
    - `/api/content/explore` - Obtener productos
    - `/api/purchase` - Procesar compra

- **Prisma ORM**: Herramienta para comunicarse con la base de datos
  - Define modelos de datos (User, Content, Purchase)
  - Genera queries SQL automáticamente
  - Migraciones de base de datos

### 2.2 Infraestructura (¿Dónde vive todo?)

#### Deploy: Vercel
- Plataforma en la nube que aloja Takopi
- Deploy automático cuando haces push a GitHub
- URLs de producción y preview
- CDN global (la página carga rápido en cualquier parte del mundo)

#### Base de Datos: Neon (PostgreSQL)
- Base de datos SQL en la nube
- Compatible con Prisma
- Escalable y rápida
- Ubicada en servidores cercanos para menor latencia

#### Almacenamiento de Archivos: Vercel Blob
- Servicio para guardar archivos grandes
- Similar a AWS S3 o Google Cloud Storage
- Permite subir modelos 3D, imágenes, música, etc.

---

## 3. Base de Datos y Almacenamiento

### 3.1 ¿Por Qué Necesitamos Dos Sistemas?

Esta es una pregunta fundamental que muchos estudiantes tienen:

#### ❌ Enfoque Incorrecto (Solo Base de Datos)

Imagina que guardas todo en PostgreSQL:

```
Tabla: productos
- id: 1
- nombre: "Modelo 3D de Casa"
- archivo_fbx: [BLOB DE 50MB]  ❌ MAL
- imagen_portada: [BLOB DE 5MB]  ❌ MAL
```

**Problemas**:
1. **Lentitud brutal**: Consultar la tabla se vuelve extremadamente lento
2. **Límites de tamaño**: PostgreSQL no está diseñado para archivos gigantes
3. **Costo**: Las bases de datos SQL cobran por almacenamiento a un precio alto
4. **Transferencia ineficiente**: Cada descarga satura la conexión a la BD

#### ✅ Enfoque Correcto (Base de Datos + Blob Storage)

```
Tabla: productos
- id: 1
- nombre: "Modelo 3D de Casa"
- archivo_url: "https://blob.vercel.com/abc123.fbx"  ✅ BIEN
- portada_url: "https://blob.vercel.com/xyz456.png"  ✅ BIEN

Vercel Blob:
- abc123.fbx → 50MB
- xyz456.png → 5MB
```

**Ventajas**:
1. **Rapidez**: La BD solo guarda metadata (texto, URLs)
2. **Escalabilidad**: Blob storage maneja archivos de cualquier tamaño
3. **Economía**: Blob storage es mucho más barato para archivos
4. **CDN**: Los archivos se distribuyen globalmente (descargas rápidas)
5. **Separación de responsabilidades**: Cada sistema hace lo que mejor sabe hacer

### 3.2 Flujo Completo de Subida de Archivo

Veamos paso a paso qué pasa cuando un creador sube un modelo 3D:

```
Usuario selecciona archivo casa.fbx (50MB)
      ↓
Frontend valida el archivo (tipo, tamaño)
      ↓
Se envía a /api/upload
      ↓
Backend recibe el archivo
      ↓
Se sube a Vercel Blob
      ↓
Blob devuelve URL: https://blob.vercel.com/abc123.fbx
      ↓
Backend guarda en PostgreSQL:
  INSERT INTO content (title, file_url) 
  VALUES ('Casa 3D', 'https://blob.vercel.com/abc123.fbx')
      ↓
Frontend muestra "¡Archivo subido con éxito!"
```

### 3.3 Políticas de Eliminación (¡Importante!)

Cuando un creador elimina un producto:

1. **Si el producto NO tiene compras**:
   - Se elimina el registro de la BD
   - Se elimina el archivo del Blob
   - Desaparece completamente

2. **Si el producto SÍ tiene compras**:
   - Se marca como `isListed: false` (despublicado)
   - El archivo NO se elimina del Blob
   - Los compradores mantienen acceso en su biblioteca
   - El producto desaparece del marketplace público

Esto se implementa con **soft delete** (borrado lógico):

```sql
-- No hacemos esto:
DELETE FROM content WHERE id = 123;  ❌

-- Hacemos esto:
UPDATE content 
SET isListed = false, deletedAt = NOW() 
WHERE id = 123;  ✅
```

---

## 4. Sistema de Autenticación

### 4.1 ¿Qué es la Autenticación?

**Autenticación** = Verificar que eres quien dices ser

Cuando inicias sesión, el sistema:
1. Verifica tu email y contraseña
2. Te da un "pase especial" (token)
3. Usas ese pase en cada petición para probar tu identidad

### 4.2 Tecnología: JWT (JSON Web Tokens)

Un **JWT** es como un carnet de identidad digital:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Partes de un JWT**:
1. **Header** (Cabecera): Tipo de token y algoritmo de encriptación
2. **Payload** (Carga útil): Datos del usuario (id, email, rol)
3. **Signature** (Firma): Garantiza que el token no fue modificado

### 4.3 Flujo de Login

```
1. Usuario ingresa email y contraseña
   ↓
2. POST /api/auth/login
   {
     email: "artista@ejemplo.com",
     password: "miContraseña123"
   }
   ↓
3. Backend verifica:
   - ¿Existe el usuario?
   - ¿La contraseña es correcta? (usando bcrypt para comparar hash)
   ↓
4. Si es correcto, genera JWT:
   const token = jwt.sign(
     { userId: '123', email: 'artista@ejemplo.com', role: 'creator' },
     SECRET_KEY,
     { expiresIn: '7d' }  // Token válido por 7 días
   )
   ↓
5. Devuelve token al frontend
   {
     success: true,
     token: "eyJhbGc...",
     user: { id: '123', username: 'Artista' }
   }
   ↓
6. Frontend guarda token en localStorage
   ↓
7. En cada petición futura, envía el token:
   Authorization: Bearer eyJhbGc...
```

### 4.4 Middleware de Protección

Algunas rutas requieren autenticación (ejemplo: comprar, publicar).

**Middleware** = Función que se ejecuta ANTES del endpoint

```typescript
// Ejemplo simplificado
async function requireAuth(request) {
  // 1. Obtener token del header
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  // 2. Verificar token
  if (!token) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }
  
  try {
    // 3. Decodificar y validar
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 4. Agregar usuario al request
    request.user = decoded;
    
    // 5. Continuar al endpoint
    return next();
  } catch {
    return Response.json({ error: 'Token inválido' }, { status: 401 });
  }
}
```

### 4.5 Encriptación de Contraseñas (bcrypt)

**NUNCA** se guardan contraseñas en texto plano:

```
❌ MAL:
users
- email: user@ejemplo.com
- password: "miContraseña123"

✅ BIEN:
users
- email: user@ejemplo.com
- password: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."  (hash)
```

**¿Cómo funciona bcrypt?**

```typescript
// Al registrarse:
const password = "miContraseña123";
const hashedPassword = await bcrypt.hash(password, 10);
// Guarda en BD: "$2b$10$N9qo8u..."

// Al iniciar sesión:
const inputPassword = "miContraseña123";
const storedHash = "$2b$10$N9qo8u...";
const isValid = await bcrypt.compare(inputPassword, storedHash);
// isValid = true ✅
```

**Importante**: Incluso si un hacker roba la base de datos, NO puede recuperar las contraseñas originales.

---

## 5. Integración de Pagos (Transbank)

### 5.1 ¿Qué es Transbank?

**Transbank** es el sistema de pagos más usado en Chile. Procesa transacciones con:
- Tarjetas de débito
- Tarjetas de crédito
- Webpay (plataforma web de Transbank)

### 5.2 Modo Sandbox (Desarrollo)

Takopi usa **Transbank Sandbox** para pruebas:

- Transacciones simuladas (no se cobra dinero real)
- Tarjetas de prueba provistas por Transbank
- Ambiente seguro para desarrollar

**Tarjetas de prueba**:
```
Tarjeta de débito:
- Número: 4051 8856 0000 0002
- CVV: 123
- Fecha: Cualquier fecha futura
- RUT: 11.111.111-1

Resultado: APROBADA ✅
```

### 5.3 Flujo Completo de Pago

```
1. Usuario agrega productos al carrito
   Carrito: [Modelo 3D ($5.000), Textura ($2.000)]
   Total: $7.000
   ↓
2. Hace clic en "Proceder al pago"
   ↓
3. POST /api/webpay/create
   Backend crea transacción en Transbank:
   {
     amount: 7000,
     returnUrl: "https://takopi.com/webpay/return",
     buyOrder: "ORDER-12345"
   }
   ↓
4. Transbank devuelve:
   {
     token: "abc123xyz",
     url: "https://webpay3gint.transbank.cl/..."
   }
   ↓
5. Usuario es redirigido a Transbank
   → Ingresa datos de tarjeta
   → Confirma pago
   ↓
6. Transbank procesa el pago
   → Si APROBADO: redirige a returnUrl?token=abc123xyz
   → Si RECHAZADO: redirige a returnUrl?token=abc123xyz
   ↓
7. GET /api/webpay/return?token=abc123xyz
   Backend consulta a Transbank:
   "¿Qué pasó con el token abc123xyz?"
   ↓
8. Transbank responde:
   {
     status: "AUTHORIZED",
     amount: 7000,
     authorizationCode: "123456"
   }
   ↓
9. Si AUTHORIZED:
   - Crear registros en tabla purchases
   - Vaciar carrito
   - Enviar email de confirmación
   - Mostrar página "Pago exitoso"
   ↓
10. Usuario puede descargar productos en "Mis compras"
```

### 5.4 Webhooks (Notificaciones Automáticas)

Aunque actualmente no está implementado en Takopi, es importante conocer el concepto:

**Webhook** = URL que Transbank llama cuando algo sucede

```
Transbank → POST https://takopi.com/api/webhooks/payment
{
  "status": "AUTHORIZED",
  "buyOrder": "ORDER-12345",
  "amount": 7000
}
```

Esto permite:
- Confirmar pagos de forma asíncrona
- Manejar timeouts
- Procesar notificaciones tardías

### 5.5 Seguridad en Pagos

**Nunca**:
- Guardes números de tarjeta
- Proceses pagos directamente en el frontend
- Expongas claves secretas de Transbank

**Siempre**:
- Usa HTTPS (candado en el navegador)
- Valida montos en el backend
- Registra todas las transacciones
- Implementa timeouts para evitar compras duplicadas

---

## 6. Estructura de Tablas y Relaciones

### 6.1 Diagrama de Relaciones (ERD Simplificado)

```
┌─────────┐       1:N        ┌─────────┐       N:M        ┌─────────┐
│  User   │─────────────────>│ Content │<─────────────────│  Like   │
│         │                   │         │                   │         │
│ id      │                   │ id      │                   │ userId  │
│ email   │                   │ title   │                   │contentId│
│ username│                   │ price   │                   └─────────┘
│ role    │                   │authorId │
└─────────┘                   └─────────┘
     │                             │
     │ 1:N                         │ 1:N
     ↓                             ↓
┌─────────┐                   ┌─────────┐
│ Follow  │                   │Purchase │
│         │                   │         │
│followerId                   │ userId  │
│followingId                  │contentId│
└─────────┘                   │ amount  │
                               │ status  │
                               └─────────┘
```

### 6.2 Tabla: User (Usuarios)

```sql
CREATE TABLE "User" (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,          -- Hash bcrypt
  role          TEXT DEFAULT 'Explorer', -- 'Explorer', 'Artist', 'Maker'
  avatar        TEXT,                   -- URL de imagen
  banner        TEXT,                   -- URL de banner
  bio           TEXT,
  location      TEXT,
  isActive      BOOLEAN DEFAULT true,
  createdAt     TIMESTAMP DEFAULT NOW(),
  updatedAt     TIMESTAMP DEFAULT NOW()
);
```

**Campos clave**:
- `id`: Identificador único (UUID)
- `email`: Email único para login
- `password`: Hash de contraseña (NUNCA texto plano)
- `role`: Define permisos (Explorer = comprador, Artist = vendedor)
- `avatar`/`banner`: URLs de imágenes en Blob
- `isActive`: Permite deshabilitar cuentas sin borrarlas

**Ejemplo de registro**:
```
{
  id: "user_abc123",
  email: "artista@ejemplo.com",
  username: "ArtistaPro",
  password: "$2b$10$N9qo8uLOickgx2...",
  role: "Artist",
  avatar: "https://blob.vercel.com/avatar-123.png",
  bio: "Creador de modelos 3D para videojuegos",
  isActive: true,
  createdAt: "2025-01-15T10:00:00Z"
}
```

### 6.3 Tabla: Content (Productos/Contenido)

```sql
CREATE TABLE "Content" (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  contentType     TEXT NOT NULL,      -- 'modelos3d', 'texturas', 'musica'
  category        TEXT,
  price           FLOAT DEFAULT 0,
  currency        TEXT DEFAULT 'CLP',
  isFree          BOOLEAN DEFAULT false,
  coverImage      TEXT,               -- URL en Blob
  files           JSONB,              -- Array de objetos { name, url, size }
  tags            TEXT[],
  status          TEXT DEFAULT 'draft', -- 'draft', 'published'
  isPublished     BOOLEAN DEFAULT false,
  isListed        BOOLEAN DEFAULT true,  -- Para soft delete
  authorId        TEXT REFERENCES "User"(id),
  likes           INT DEFAULT 0,
  views           INT DEFAULT 0,
  downloads       INT DEFAULT 0,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW(),
  deletedAt       TIMESTAMP
);
```

**Campos clave**:
- `contentType`: Categoría principal (modelos3d, texturas, música)
- `files`: JSON con array de archivos
  ```json
  [
    {
      "name": "casa.fbx",
      "url": "https://blob.vercel.com/abc.fbx",
      "size": 50000000,
      "type": "model/fbx"
    }
  ]
  ```
- `isListed`: Si `false`, el producto está despublicado pero NO borrado
- `authorId`: Relación con la tabla User (quien creó el producto)

**Ejemplo de registro**:
```
{
  id: "content_xyz789",
  title: "Casa Medieval 3D",
  description: "Modelo 3D de casa medieval optimizado para videojuegos",
  contentType: "modelos3d",
  category: "arquitectura",
  price: 5000,
  currency: "CLP",
  isFree: false,
  coverImage: "https://blob.vercel.com/cover-xyz.png",
  files: [
    {
      "name": "casa.fbx",
      "url": "https://blob.vercel.com/casa-xyz.fbx",
      "size": 45000000
    }
  ],
  tags: ["medieval", "low-poly", "juego"],
  status: "published",
  isPublished: true,
  authorId: "user_abc123",
  likes: 25,
  views: 150,
  createdAt: "2025-01-20T14:00:00Z"
}
```

### 6.4 Tabla: Purchase (Compras)

```sql
CREATE TABLE "Purchase" (
  id              TEXT PRIMARY KEY,
  userId          TEXT REFERENCES "User"(id),
  contentId       TEXT REFERENCES "Content"(id),
  sellerId        TEXT REFERENCES "User"(id),
  amount          FLOAT NOT NULL,
  currency        TEXT DEFAULT 'CLP',
  status          TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'failed'
  transactionId   TEXT,                    -- ID de Transbank
  downloadCount   INT DEFAULT 0,
  lastDownloadAt  TIMESTAMP,
  createdAt       TIMESTAMP DEFAULT NOW()
);
```

**Campos clave**:
- `userId`: Quién compró
- `contentId`: Qué producto compró
- `sellerId`: Quién vendió (para futuras comisiones)
- `transactionId`: ID de Transbank para tracking
- `downloadCount`: Cuántas veces ha descargado el comprador

**Importante**: Esta tabla **nunca se borra**. Garantiza acceso permanente a compras.

**Ejemplo de registro**:
```
{
  id: "purchase_def456",
  userId: "user_comprador_123",
  contentId: "content_xyz789",
  sellerId: "user_abc123",
  amount: 5000,
  currency: "CLP",
  status: "completed",
  transactionId: "TBK-987654321",
  downloadCount: 3,
  lastDownloadAt: "2025-01-22T16:30:00Z",
  createdAt: "2025-01-21T12:00:00Z"
}
```

### 6.5 Tabla: Comment (Comentarios)

```sql
CREATE TABLE "Comment" (
  id          TEXT PRIMARY KEY,
  contentId   TEXT REFERENCES "Content"(id),
  authorId    TEXT REFERENCES "User"(id),
  text        TEXT NOT NULL,
  parentId    TEXT REFERENCES "Comment"(id),  -- Para respuestas
  createdAt   TIMESTAMP DEFAULT NOW()
);
```

**Relaciones**:
- Un producto puede tener muchos comentarios (1:N)
- Un comentario puede tener respuestas (self-referencing)

**Ejemplo de comentarios anidados**:
```
Comentario 1:
  id: "comment_aaa",
  contentId: "content_xyz789",
  authorId: "user_cliente_456",
  text: "¡Excelente modelo! Funciona perfecto en Unity",
  parentId: null

    → Respuesta 1.1:
      id: "comment_bbb",
      contentId: "content_xyz789",
      authorId: "user_abc123",  (el creador)
      text: "¡Gracias! Me alegra que te sirva",
      parentId: "comment_aaa"
```

### 6.6 Tabla: Like (Me gusta)

```sql
CREATE TABLE "Like" (
  id          TEXT PRIMARY KEY,
  userId      TEXT REFERENCES "User"(id),
  contentId   TEXT REFERENCES "Content"(id),
  createdAt   TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, contentId)  -- Un usuario solo puede dar like 1 vez
);
```

**Relación N:M** (muchos a muchos):
- Un usuario puede dar like a muchos productos
- Un producto puede recibir likes de muchos usuarios

**Constraint UNIQUE**: Evita likes duplicados

**Query para contar likes de un producto**:
```sql
SELECT COUNT(*) FROM "Like" WHERE contentId = 'content_xyz789';
-- Resultado: 25
```

### 6.7 Tabla: Follow (Seguir)

```sql
CREATE TABLE "Follow" (
  id            TEXT PRIMARY KEY,
  followerId    TEXT REFERENCES "User"(id),  -- Quién sigue
  followingId   TEXT REFERENCES "User"(id),  -- A quién sigue
  createdAt     TIMESTAMP DEFAULT NOW(),
  UNIQUE(followerId, followingId)
);
```

**Ejemplo**:
```
Usuario A sigue a Usuario B:
{
  id: "follow_123",
  followerId: "user_A",
  followingId: "user_B",
  createdAt: "2025-01-15T10:00:00Z"
}
```

**Query útiles**:
```sql
-- ¿A quién sigue el usuario A?
SELECT followingId FROM "Follow" WHERE followerId = 'user_A';

-- ¿Quién sigue al usuario B?
SELECT followerId FROM "Follow" WHERE followingId = 'user_B';

-- ¿Cuántos seguidores tiene el usuario B?
SELECT COUNT(*) FROM "Follow" WHERE followingId = 'user_B';
```

---

## 7. Flujos Principales de la Aplicación

### 7.1 Flujo de Registro de Usuario

```
1. Usuario va a /auth/register
   ↓
2. Llena formulario:
   - Username: "NuevoArtista"
   - Email: "nuevo@ejemplo.com"
   - Contraseña: "segura123"
   - Checkbox: "Soy creador" ✓
   ↓
3. POST /api/auth/register
   {
     username: "NuevoArtista",
     email: "nuevo@ejemplo.com",
     password: "segura123",
     role: "Artist"
   }
   ↓
4. Backend valida:
   - ¿Email ya existe? → Error
   - ¿Username ya existe? → Error
   - ¿Contraseña muy corta? → Error
   ↓
5. Hash de contraseña:
   password = "$2b$10$..."
   ↓
6. Crear usuario en DB:
   INSERT INTO "User" (id, email, username, password, role)
   VALUES ('user_new123', 'nuevo@ejemplo.com', 'NuevoArtista', '$2b$10$...', 'Artist')
   ↓
7. Generar JWT:
   token = jwt.sign({ userId: 'user_new123', role: 'Artist' }, SECRET)
   ↓
8. Responder al frontend:
   {
     success: true,
     token: "eyJhbGc...",
     user: { id: 'user_new123', username: 'NuevoArtista' }
   }
   ↓
9. Frontend guarda token en localStorage
   ↓
10. Redirigir a /profile
```

### 7.2 Flujo de Publicación de Producto

```
1. Usuario (Artist) va a /upload
   ↓
2. Llena formulario en 3 pasos:

   PASO 1: Información Básica
   - Título: "Espada Épica 3D"
   - Tipo: Modelos 3D
   - Categoría: Armas
   - Descripción: "Espada low-poly para videojuegos"
   ↓
   
   PASO 2: Archivos
   - Sube archivo: espada.fbx (30MB)
     → POST /api/upload
     → Blob devuelve URL
   - Sube portada: espada-cover.png (2MB)
     → POST /api/upload
     → Blob devuelve URL
   - Precio: 3000 CLP
   - Tags: ["espada", "arma", "fantasy"]
   ↓
   
   PASO 3: Vista Previa
   - Se muestra tarjeta del producto
   - Botón "Publicar"
   ↓

3. POST /api/content
   {
     title: "Espada Épica 3D",
     contentType: "modelos3d",
     category: "armas",
     description: "Espada low-poly...",
     price: 3000,
     files: [{ name: "espada.fbx", url: "https://blob.../espada.fbx" }],
     coverImage: "https://blob.../cover.png",
     tags: ["espada", "arma", "fantasy"],
     status: "published"
   }
   + Header: Authorization: Bearer eyJhbGc...
   ↓

4. Backend:
   - Decodifica token → userId
   - Valida campos obligatorios
   - Crea registro en DB:
     INSERT INTO "Content" (id, title, ..., authorId)
     VALUES ('content_new789', 'Espada Épica 3D', ..., 'user_new123')
   ↓

5. Responde:
   {
     success: true,
     contentId: "content_new789"
   }
   ↓

6. Frontend redirige a /product/content_new789
   ✅ Producto visible en el marketplace
```

### 7.3 Flujo de Compra Completo

```
1. Usuario explora /explore
   ↓
2. Ve "Espada Épica 3D - $3.000"
   ↓
3. Clic en "Agregar al carrito"
   → Se guarda en Context/localStorage
   ↓
4. Va a /box (carrito)
   Carrito:
   - Espada Épica 3D: $3.000
   - Casa Medieval: $5.000
   Total: $8.000
   ↓
5. Clic en "Proceder al pago"
   ↓
6. POST /api/webpay/create
   {
     items: [
       { id: "content_new789", price: 3000 },
       { id: "content_xyz789", price: 5000 }
     ],
     totalAmount: 8000
   }
   + Header: Authorization: Bearer ...
   ↓
7. Backend:
   - Valida usuario autenticado
   - Crea orden interna:
     INSERT INTO "Order" (userId, totalAmount, status)
     VALUES ('user_cliente_456', 8000, 'pending')
   - Llama a Transbank:
     POST https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions
     {
       buy_order: "ORDER-123",
       amount: 8000,
       return_url: "https://takopi.com/webpay/return"
     }
   - Transbank responde:
     {
       token: "tbk_token_abc",
       url: "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
     }
   ↓
8. Backend responde:
   {
     success: true,
     redirectUrl: "https://webpay3gint.transbank.cl/...?token=tbk_token_abc"
   }
   ↓
9. Frontend redirige a Transbank
   → Usuario ingresa tarjeta
   → Transbank procesa pago
   ↓
10. Transbank redirige de vuelta:
    GET https://takopi.com/webpay/return?token=tbk_token_abc
    ↓
11. GET /api/webpay/confirm?token=tbk_token_abc
    Backend consulta a Transbank:
    "¿Qué pasó con este token?"
    ↓
12. Transbank responde:
    {
      status: "AUTHORIZED",
      amount: 8000,
      buy_order: "ORDER-123"
    }
    ↓
13. Si AUTHORIZED:
    - Actualizar orden:
      UPDATE "Order" SET status = 'completed'
    - Crear registros de compra:
      INSERT INTO "Purchase" (userId, contentId, amount, status)
      VALUES ('user_cliente_456', 'content_new789', 3000, 'completed')
      
      INSERT INTO "Purchase" (userId, contentId, amount, status)
      VALUES ('user_cliente_456', 'content_xyz789', 5000, 'completed')
    - Vaciar carrito
    - Incrementar contador de ventas del creador
    ↓
14. Redirigir a /payment/success
    ✅ "¡Pago exitoso! Descarga tus productos en Mis Compras"
    ↓
15. Usuario va a /profile → pestaña "Mis compras"
    → Ve sus 2 productos
    → Botón "Descargar" disponible
```

### 7.4 Flujo de Descarga de Producto Comprado

```
1. Usuario va a /profile → Mis compras
   ↓
2. Lista de compras:
   - Espada Épica 3D
     Fecha: 21/01/2025
     [Descargar]
   ↓
3. Clic en "Descargar"
   ↓
4. POST /api/download
   {
     purchaseId: "purchase_def456"
   }
   + Header: Authorization: Bearer ...
   ↓
5. Backend valida:
   - ¿Usuario autenticado?
   - ¿Esta compra pertenece a este usuario?
   - Query:
     SELECT * FROM "Purchase" 
     WHERE id = 'purchase_def456' AND userId = 'user_cliente_456'
   ↓
6. Si válido:
   - Obtener URL del archivo:
     SELECT files FROM "Content" WHERE id = 'content_new789'
   - Incrementar contador:
     UPDATE "Purchase" 
     SET downloadCount = downloadCount + 1, lastDownloadAt = NOW()
     WHERE id = 'purchase_def456'
   - Generar URL firmada (signed URL) válida por 1 hora:
     signedUrl = blob.generateSignedUrl(fileUrl, expiresIn: 3600)
   ↓
7. Responde:
   {
     success: true,
     downloadUrl: "https://blob.vercel.com/espada.fbx?signature=xyz&expires=1234567890"
   }
   ↓
8. Frontend inicia descarga automática:
   window.location.href = downloadUrl
   ↓
9. Navegador descarga archivo
   ✅ espada.fbx guardado en carpeta Descargas
```

---

## 8. Glosario de Términos Técnicos

### A

**API (Application Programming Interface)**
- Interfaz para que sistemas se comuniquen
- Ejemplo: Frontend llama a `/api/content/explore` para obtener productos

**Authentication (Autenticación)**
- Proceso de verificar identidad de un usuario
- Usa email + contraseña o token JWT

**Authorization (Autorización)**
- Verificar si un usuario tiene permiso para hacer algo
- Ejemplo: Solo el creador puede editar su producto

### B

**Backend**
- Parte del servidor que procesa lógica y datos
- No visible para el usuario
- En Takopi: API Routes de Next.js

**Blob Storage**
- Almacenamiento de archivos binarios grandes
- En Takopi: Vercel Blob
- Similar a AWS S3

**bcrypt**
- Algoritmo para encriptar contraseñas
- Hace imposible recuperar la contraseña original del hash

### C

**CDN (Content Delivery Network)**
- Red de servidores distribuidos globalmente
- Acelera la entrega de archivos
- Vercel usa CDN automáticamente

**CRUD (Create, Read, Update, Delete)**
- Operaciones básicas en base de datos
- Create: Crear producto
- Read: Ver producto
- Update: Editar producto
- Delete: Eliminar producto

**Context API**
- Sistema de React para compartir datos globalmente
- En Takopi: AuthContext (usuario logueado), CartContext (carrito)

### D

**Deploy**
- Proceso de publicar la aplicación en internet
- Takopi se deploya en Vercel automáticamente con cada push a GitHub

**Database (Base de Datos)**
- Sistema para almacenar datos estructurados
- En Takopi: Neon PostgreSQL

### E

**Endpoint**
- URL específica de una API
- Ejemplos:
  - `/api/auth/login` - Iniciar sesión
  - `/api/content/123` - Obtener producto con ID 123

**Environment Variables (Variables de Entorno)**
- Configuraciones secretas que no se suben a GitHub
- Ejemplos:
  - `DATABASE_URL` - URL de conexión a Neon
  - `JWT_SECRET` - Clave secreta para tokens
  - `BLOB_READ_WRITE_TOKEN` - Clave de Vercel Blob

### F

**Frontend**
- Parte visible de la aplicación (interfaz de usuario)
- En Takopi: Páginas React/Next.js

**Foreign Key (Clave Foránea)**
- Campo que referencia a otra tabla
- Ejemplo: `Content.authorId` → `User.id`

### H

**Hash**
- Resultado de aplicar un algoritmo de encriptación
- Unidireccional (no se puede revertir)
- Ejemplo: "miContraseña" → "$2b$10$N9qo..."

**HTTP Methods (Métodos HTTP)**
- GET: Obtener datos
- POST: Crear datos
- PUT: Actualizar datos
- DELETE: Eliminar datos

### J

**JSON (JavaScript Object Notation)**
- Formato de datos en texto
- Ejemplo:
  ```json
  {
    "title": "Modelo 3D",
    "price": 5000,
    "tags": ["3d", "juego"]
  }
  ```

**JWT (JSON Web Token)**
- Token de autenticación en formato JSON firmado
- Se envía en el header `Authorization: Bearer <token>`

### M

**Middleware**
- Función que se ejecuta entre la petición y la respuesta
- Ejemplo: Verificar token antes de acceder a un endpoint protegido

**Migration (Migración)**
- Cambios en la estructura de la base de datos
- Ejemplo: Agregar columna `banner` a tabla `User`

### O

**ORM (Object-Relational Mapping)**
- Herramienta para interactuar con BD usando objetos
- En Takopi: Prisma
- En lugar de escribir SQL, escribes:
  ```typescript
  await prisma.user.create({ data: { email, username } })
  ```

### P

**Payload**
- Datos principales en una petición o token
- En JWT: `{ userId: '123', email: 'user@ejemplo.com' }`

**Postgres/PostgreSQL**
- Sistema de base de datos SQL
- Usado por Takopi vía Neon

**Primary Key (Clave Primaria)**
- Campo único que identifica cada registro
- Ejemplo: `User.id`

### R

**REST API**
- Arquitectura para APIs basada en HTTP
- Usa métodos GET, POST, PUT, DELETE
- Endpoints representan recursos: `/api/products`, `/api/users`

**Response (Respuesta)**
- Datos que el backend devuelve al frontend
- Incluye status code (200, 404, 500) y body (JSON)

### S

**Sandbox**
- Ambiente de pruebas aislado
- Transbank Sandbox: Pagos simulados sin dinero real

**Soft Delete (Borrado Lógico)**
- Marcar registros como eliminados sin borrarlos
- Ejemplo: `isListed = false` en lugar de `DELETE`

**SQL (Structured Query Language)**
- Lenguaje para consultar bases de datos
- Ejemplo:
  ```sql
  SELECT * FROM "Content" WHERE price < 5000;
  ```

### T

**Token**
- Credencial de autenticación (como un pase)
- En Takopi: JWT
- Se envía en cada petición autenticada

**TypeScript**
- JavaScript con tipos
- Previene errores en tiempo de desarrollo
- Ejemplo:
  ```typescript
  function suma(a: number, b: number): number {
    return a + b;
  }
  suma("hola", 5); // ❌ Error: "hola" no es number
  ```

### U

**UUID (Universally Unique Identifier)**
- Identificador único generado aleatoriamente
- Ejemplo: `user_abc123def456`
- Casi imposible que se repita

### V

**Validation (Validación)**
- Verificar que los datos sean correctos
- Ejemplo: Email debe tener formato válido, precio debe ser > 0

**Vercel**
- Plataforma de hosting para Next.js
- Deploy automático desde GitHub
- Incluye CDN global

### W

**Webhook**
- URL que recibe notificaciones automáticas
- Ejemplo: Transbank notifica cuando un pago se completa

---

## Conclusión

Esta documentación cubre los aspectos fundamentales de Takopi. Ahora deberías entender:

✅ Qué es Takopi y qué problemas resuelve  
✅ Cómo está construida técnicamente (stack completo)  
✅ Por qué necesitamos base de datos Y blob storage  
✅ Cómo funciona la autenticación con JWT  
✅ Cómo se procesan los pagos con Transbank  
✅ La estructura de las tablas principales y sus relaciones  
✅ Los flujos completos de las operaciones críticas  

**Las nuevas funcionalidades implementadas consolidan a Takopi como un ecosistema creativo completo**, capaz de cubrir:

- ✨ **Publicación simplificada** con flujo de 3 pasos intuitivo
- 🔒 **Compra y biblioteca seguras** con protección permanente de archivos adquiridos
- 🖨️ **Servicios físicos** como impresión 3D integrada
- 🎨 **Trabajo creativo personalizado** mediante sistema de comisiones profesional
- 👥 **Interacción social robusta** con likes, comentarios, seguimientos y métricas reales
- 🎭 **Experiencia estética coherente** en toda la plataforma (tema negro/morado)

Estas mejoras no solo aumentan la calidad técnica del sistema, sino que **elevan considerablemente la experiencia de usuario** y amplían el alcance del proyecto hacia nuevos modelos de uso y monetización, diferenciando a Takopi como una plataforma integral para creadores digitales.

**Próximos pasos sugeridos**:
1. Lee el código fuente comenzando por `src/app/page.tsx` (página principal)
2. Explora `src/app/api/` para ver los endpoints
3. Revisa `prisma/schema.prisma` para ver el modelo de datos completo
4. Prueba crear un producto en ambiente de desarrollo
5. Simula una compra usando las tarjetas de prueba de Transbank
6. Experimenta con el flujo de comisiones y el chat interno
7. Prueba la funcionalidad de impresión 3D con modelos de ejemplo

**Recursos adicionales**:
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de Prisma: https://www.prisma.io/docs
- Documentación de Transbank: https://www.transbankdevelopers.cl/
- Vercel Blob Storage: https://vercel.com/docs/storage/vercel-blob

---

## Resumen de Nuevas Funcionalidades (Changelog Ejecutivo)

### 🚀 Flujo de Publicación Rediseñado
- Reducción de 6 pasos a 3 secciones lógicas
- Vista previa en tiempo real del producto
- Eliminación de campos obsoletos y reorganización de interfaz
- Optimización completa para dispositivos móviles

### 🔐 Biblioteca de Compras Estable
- Arquitectura que separa producto listado de producto comprado
- Acceso permanente a archivos adquiridos, independiente de acciones del creador
- Tabla dedicada `purchases` con referencias estables
- Política de no eliminación de archivos con compras activas

### 🖨️ Impresión 3D Integrada
- Cotización automática (modelo + impresión + envío)
- Visor 3D integrado en el sitio
- Registro de transacciones híbridas (digital + físico)
- Gestión completa del ciclo: compra digital → impresión → entrega

### 🎨 Sistema de Comisiones Profesional
- Nuevo tipo de producto para trabajos personalizados
- Chat interno dedicado cliente-artista
- Estados claros: Abierta → En progreso → En revisión → Finalizada → Cancelada
- Control de revisiones y entregas parciales
- Formalización de servicios creativos con protección para ambas partes

### 👥 Sistema Social Mejorado
- Registro correcto de autoría en comentarios (`authorId`)
- Sistema robusto de likes/pins con actualización de contadores
- Perfiles públicos con métricas reales y precisas
- Funcionalidad completa de seguimiento entre usuarios

### 🛒 Carrito "Box" Modernizado
- Migración al tema negro/morado
- Interfaz limpia y organizada
- Coherencia visual con toda la plataforma

### 🎡 Carrusel Dinámico en Explorar
- Animación fluida con movimiento automático
- Diseño responsivo multiplataforma
- Mejora significativa en visibilidad de contenido

---

**Última actualización**: 20 de diciembre de 2025  
**Autor**: Equipo Takopi  
**Versión del documento**: 2.0
