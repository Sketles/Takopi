# MVP Takopi – Descripción Completa de la Plataforma

> **Contexto general**
> 
> Estoy desarrollando "**Takopi**", una plataforma web tipo marketplace digital hecha en Next.js, orientada a la venta y compra de **recursos digitales creativos**: modelos 3D, avatares, texturas, ilustraciones, assets para videojuegos, etc.
> 
> Quiero que tengas una visión global y coherente de **toda la página** (frontend) y su comportamiento, para ayudarme a refinar, corregir y extender el código.

---

## 1. Propósito y Propuesta de Valor de Takopi

* Takopi es un **marketplace especializado** en contenido digital creativo (sobre todo 3D, arte digital y texturas) donde:
  * **Creadores** pueden subir, gestionar y vender sus productos digitales.
  * **Compradores** pueden explorar, filtrar, visualizar y comprar esos productos.

* Propuesta de valor principal:
  * Un entorno simple, moderno y ordenado para **encontrar recursos listos para usar** en proyectos de videojuegos, animación, impresión 3D, etc.
  * Flujo de compra claro, con integración de pagos (Transbank en modo sandbox por ahora).
  * Panel básico de usuario para gestionar **biblioteca de compras** y **publicaciones**.

---

## 2. Tipos de Usuario y Roles (Nivel Interfaz)

### 2.1. Visitante No Autenticado

**Puede:**
- Ver el **landing / home**.
- Explorar el catálogo de productos.
- Abrir páginas de detalle de producto.

**No puede:**
- Comprar.
- Descargar.
- Publicar productos.
- Al intentar una acción de compra, se le redirige a login/registro.

### 2.2. Usuario Autenticado Comprador

**Acceso a:**
- Comprar productos.
- Ver su **historial de compras**.
- Descargar los archivos adquiridos.
- Administrar datos básicos de perfil.

### 2.3. Usuario Autenticado Creador/Vendedor

**Además de lo anterior:**
- Publicar nuevos productos.
- Editar / despublicar sus productos.
- Ver métricas simples (cantidad de ventas, precio, estado).

### 2.4. (Opcional / Futuro) Rol Admin

**Panel con herramientas de moderación:**
- Revisión de productos.
- Gestión de usuarios.
- Para este MVP, basta con asumir que existe un usuario admin con capacidades extendidas, pero no es la prioridad de UI.

---

## 3. Estructura General de la Página / Navegación

### Layout Principal (Todas las Páginas Comparten)

#### Header Fijo

**Elementos:**
- Logo "Takopi" (texto o imagen).
- Menú principal:
  - Home / Explorar
  - Categorías
  - Sobre Takopi (landing informativa opcional)

**A la derecha:**
- Icono/botón de **buscar**.
- Botón "Iniciar sesión" / "Registrarse" cuando no está logueado.
- Cuando está logueado: avatar o inicial del usuario con menú desplegable:
  - "Mi cuenta"
  - "Mis compras"
  - "Mis productos" (si es creador)
  - "Cerrar sesión"
- Icono de **carrito** con contador de items.

#### Footer

**Links a:**
- Términos y condiciones.
- Política de privacidad.
- FAQ / Ayuda.
- Redes sociales de Takopi (placeholders).
- Copyright simple.

---

## 4. Páginas Principales y Comportamiento Esperado

### 4.1. Home / Landing Principal

**Objetivo:** Presentar Takopi y llevar al usuario a **explorar el catálogo**.

#### Secciones (de arriba hacia abajo):

##### 1. Hero Principal

- Fondo con imagen/ilustración relacionada a 3D / arte digital.
- Título claro: ejemplo "Marketplace de recursos 3D y arte digital".
- Subtítulo: breve descripción de lo que ofrece Takopi.
- Botón principal: "Explorar recursos".
- Botón secundario: "Publicar mis assets" (si el usuario está logueado como creador; si no, lleva al registro).

##### 2. Sección de Categorías Destacadas

- Tarjetas grandes con iconos:
  - Modelos 3D
  - Avatares
  - Texturas
  - Ilustraciones / Concept art
- Cada tarjeta actúa como filtro rápido (redirige a la vista de catálogo filtrada por esa categoría).

##### 3. Productos Destacados / Recientes

- Grid de productos:
  - Imagen de portada.
  - Nombre del producto.
  - Precio.
  - Etiquetas básicas (ej: ".FBX", "4K", "PBR", etc.).
- Cada tarjeta lleva a la **página de detalle del producto**.

##### 4. Sección "Cómo Funciona"

**3 pasos para compradores:**
1. Crea tu cuenta.
2. Explora y compra recursos.
3. Descarga y úsalos en tus proyectos.

**3 pasos para creadores:**
1. Sube tus assets.
2. Define precios y licencias.
3. Recibe pagos cuando vendas.

##### 5. Llamado Final

- Bloque de CTA (call to action):
  - "¿Eres creador? Comienza a vender en Takopi."
  - Botón: "Crear cuenta" o "Ir a panel de creador".

---

### 4.2. Vista de Catálogo / Explorador de Productos

**Objetivo:** Permitir filtrar/buscar productos y navegar fácilmente.

#### Componentes:

##### Barra Superior de Filtros y Búsqueda

- Input de búsqueda por texto (nombre del producto, tags).
- Dropdown de categorías (modelos 3D, texturas, avatares, ilustraciones, etc.).
- Filtro por rango de precio (slider o min/max).
- Ordenar por: "Más recientes", "Más vendidos", "Precio asc/desc".

##### Grid de Resultados

- Tarjetas de producto, consistentes con las del Home:
  - Imagen de portada.
  - Nombre.
  - Precio.
  - Autor.
  - Tag principal o formato.

##### Paginación o Carga Progresiva (Infinite Scroll)

- Control para navegar entre páginas de resultados o cargar más.

#### Comportamiento:

- Cada cambio de filtro/búsqueda actualiza la lista.
- Al hacer clic en un producto se abre la **vista de detalle**.

---

### 4.3. Página de Detalle de Producto

**Objetivo:** Ver información completa y motivar la compra.

#### Secciones:

##### 1. Header de Producto

- Nombre del producto.
- Nombre del creador (clicable para ver más productos del mismo creador).
- Precio.

##### 2. Visualización Principal

- Imagen grande del producto (o carrusel de imágenes).
- (Opcional / futuro) Visor 3D embebido.

##### 3. Información Técnica

- Formatos disponibles (.FBX, .OBJ, .PNG, etc.).
- Resolución (por ejemplo, texturas 4K).
- Tamaño aproximado del archivo.
- Software compatible (ej: Blender, Unity, Unreal, etc).

##### 4. Descripción

- Texto informativo redactado por el creador:
  - Qué incluye el paquete.
  - Uso recomendado.
  - Restricciones (licencia).

##### 5. Botones de Acción

- Si el usuario no ha comprado:
  - Botón principal: "Agregar al carrito".
- Si ya ha comprado:
  - Botón: "Descargar archivo(s)".
- Opción "Agregar a favoritos" para guardarlo en una lista personal.

##### 6. Sección "Más Productos del Creador" o "Productos Relacionados"

- Grid pequeño con otros items similares.

---

### 4.4. Carrito de Compras

**Objetivo:** Revisar y confirmar productos antes de pagar.

#### Contenido:

##### Lista de Productos Agregados

- Imagen miniatura.
- Nombre.
- Precio unitario.
- Botón "Eliminar del carrito".

##### Resumen de Costos

- Subtotal.
- Impuestos / comisiones (si aplica).
- Total final.

##### Botones

- "Seguir comprando".
- "Proceder al pago" (lleva al flujo de checkout / Transbank sandbox).

##### Validaciones

- Si el usuario no está logueado y quiere pagar, se redirige a login/registro.

---

### 4.5. Checkout / Pago (Transbank Sandbox)

**Objetivo:** Simular el flujo de pago real.

#### Proceso:

##### Pantalla de Resumen

- Lista de items.
- Total a pagar.
- Datos básicos de facturación (por ahora lo mínimo necesario).

##### Botón: "Pagar con Transbank (sandbox)"

#### Comportamiento:

- Redirección a la URL de Transbank sandbox.
- Respuesta de éxito o fallo.

**Si éxito:**
- Se registra la compra en la base de datos.
- Se habilitan las descargas de los productos en la cuenta del usuario.
- Se muestra una página de "Pago exitoso":
  - Botón para ir a "Mis compras".

**Si error:**
- Mensaje de error y opción de reintentar.

---

### 4.6. Autenticación: Login / Registro

#### Página de Login

**Campos:**
- Email
- Contraseña

**Acciones:**
- Botón "Iniciar sesión".
- Enlace: "¿No tienes cuenta? Regístrate".

#### Página de Registro

**Datos mínimos:**
- Nombre de usuario / alias.
- Email.
- Contraseña.
- Checkbox "Soy creador y quiero vender" (define rol/flag).

**Botón:** "Crear cuenta".

#### Lógica:

- Tras login/registro exitoso:
  - Redirigir al Home o a la página que originó la acción (por ejemplo, si venía de "Comprar").

---

### 4.7. Sección "Mi Cuenta"

#### Módulos:

##### 1. Perfil

- Ver / editar nombre, alias, email (solo en ciertos campos).

##### 2. Mis Compras

- Lista de productos comprados.
- Botón "Descargar".
- Fecha de compra.

##### 3. Mis Favoritos (Si Está Implementado)

- Lista de productos marcados como favoritos.

---

### 4.8. Panel de Creador / Mis Productos

**Disponible solo si el usuario tiene flag de creador.**

#### Listado de Productos Propios

**Información mostrada:**
- Nombre.
- Estado (publicado / borrador / despublicado).
- Precio.
- Contador simple de ventas.

**Botones:**
- Editar.
- Despublicar.

#### Formulario de Nuevo Producto

**Campos:**
- Nombre del producto.
- Categoría (3D, texturas, avatares, etc.).
- Descripción.
- Precio.
- Campos técnicos básicos (formatos, resolución, etc.).
- Upload de archivo(s) o link controlado.
- Upload de imagen de portada.

**Botón:** "Publicar".

#### Validaciones:

- Campos obligatorios.
- Límites de tamaño de archivo (según lo que se esté manejando actualmente).

---

## 5. Requisitos Técnicos y de Código

### Stack Tecnológico

- **Framework:** Next.js (versión moderna, con app router)
- **Frontend:** React, componentes funcionales, hooks
- **Estilo:** Tailwind CSS, CSS Modules o Styled Components (asumir Tailwind si no se especifica)

### Gestión de Estado

**Uso de context / hooks personalizados para:**
- Gestión de usuario autenticado (auth context)
- Gestión del carrito de compras (cart context)

### Backend / API

**Endpoints para:**
- CRUD de productos
- Manejo de usuarios
- Registro de compras
- Integración Transbank (sandbox)

### Persistencia

- **Base de datos:** SQL (Neon / Postgres) o la que ya esté configurada
- **Carrito:** Local storage para visitantes no logueados, sincronizado con la cuenta al iniciar sesión

---

## 6. Instrucciones para la IA

> A partir de este MVP de Takopi:
>
> * Mantén **consistencia** entre las páginas (nombres de componentes, props, rutas).
> * Cuando propongas código:
>   * Respeta el flujo descrito (home → catálogo → detalle → carrito → checkout).
>   * Usa componentes reutilizables donde tenga sentido (tarjeta de producto, layout, header, footer).
> * Si ves que algo está ambiguo, propón una solución razonable pero **no inventes lógica de negocio rara** (manténlo simple y alineado al concepto de marketplace digital).
> * Asegúrate de que el código sea legible, modular, y con comentarios cortos pero claros.

---

**Este documento sirve como referencia base para entender toda la estructura y funcionalidad de Takopi, asegurando consistencia en el desarrollo y facilitando la colaboración con asistentes de IA.**
