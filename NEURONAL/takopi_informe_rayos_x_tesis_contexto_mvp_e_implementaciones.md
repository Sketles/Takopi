# TAKOPI — Informe “Rayos X” para Tesis
**Versión:** 1.1  · **Fecha:** 19/09/2025  · **Autora:** Sushi (Pía)  
**Propósito del documento:** dejar, en un solo lugar, una especificación clara y accionable para **Cursor/IA generadora de código** y para el **comité de tesis**, con foco en: contexto, páginas/flows, **MVP**, e **implementaciones** (Webpay sandbox + Mercado Pago test), más documentación técnica base.

---

## 0) Contexto global
**Qué es:** Takopi es un **e‑commerce de assets creativos** (modelos 3D/arte digital) con **exploración visual tipo Pinterest**, **chatbot** de apoyo y **checkout en modo prueba**.  
**Para qué:** demostrar capacidades de **arquitectura web moderna**, **UX visual**, **integración de pagos** y **documentación técnica** en un proyecto de título.  
**Alcance de tesis:** **NO producción**; todo pago se ejecuta en **sandbox/test**.  
**Usuarios objetivo:** estudiantes/creadores 3D y compradores curiosos; Chile/LatAm.  
**Métrica norte (académica):** flujo end‑to‑end funcional (explorar → carrito → pago de prueba → confirmación), claridad de la arquitectura y calidad de la documentación.

---

## 1) Descripción general de la app y su mapa
### 1.1 Páginas / secciones
- **Home (Landing):** hero + valor + CTA (Explorar/Publicar), grilla destacada, colecciones/top autores.
- **Explorar:** masonry grid infinito; filtros (categoría/licencia/precio/tags), orden por relevancia/recientes/ventas.
- **Detalle de Producto:** galería (a futuro visor 3D), licencia/compatibilidad, autor/ratings, relacionados; **Añadir al carrito**.
- **Carrito:** listado, subtotal, aplicar cupón (futuro), ir a **Checkout**.
- **Checkout:** resumen orden → redirección a **Webpay sandbox** (principal) o **Mercado Pago test** (bandera “Internacional demo”).
- **Éxito / Fracaso / Pendiente:** páginas de retorno pos‑pago con detalle de estado.
- **Autenticación (básica):** sign‑up/login minimal para asociar órdenes y favoritos (opcional en MVP).
- **Panel de Creador (MVP 2):** subir producto, metadatos con ayuda de IA, estado de publicación.
- **Chatbot:** FAQ, guía de compra, onboarding para publicar (copy de prompts y flujos guiados).

### 1.2 Features (snapshot)
- **Exploración visual:** grid tipo Pinterest (masonry), vista rápida (modal), favoritos.
- **Catálogo y búsqueda:** por texto (hoy) y tags; búsqueda por imagen (futuro).
- **Carrito/Orden:** persistencia simple; backend valida precios/montos.
- **Pagos de prueba:** Webpay sandbox (CL) y Mercado Pago test (demo internacional).
- **Chatbot:** respuestas rápidas (FAQ, estado de compra simulado) y sugerencias de exploración.

---

## 2) MVP (definición exacta)
**Objetivo del MVP:** demostrar un flujo completo **explorar → detalle → carrito → pago de prueba → retorno/confirmación** con arquitectura clara.

### 2.1 Alcance (MoSCoW)
- **Must (sí o sí):** Home, Explorar, Detalle, Carrito, Checkout (Webpay sandbox), páginas de retorno (éxito/fracaso), modelos de datos mínimos, endpoints internos, seed de productos.
- **Should:** favoritos, logs/alertas básicas, simple analytics (pageviews), chatbot FAQ básico.
- **Could:** bandera para **Mercado Pago test**, vista rápida (modal), colecciones destacadas.
- **Won’t (tesis):** producción real de pagos, visor 3D, panel creador completo, notificaciones email reales.

### 2.2 Criterios de aceptación (CA)
1. **Navegación**: desde Home puedo llegar a Explorar, ver productos, entrar a un detalle y añadir al carrito.  
2. **Checkout (Webpay sandbox)**: al confirmar, soy redirigido a Webpay (sandbox), simulo pago, retorno a **/pagos/webpay/retorno** y veo **/pagos/webpay/final** con estado `AUTHORIZED` o `FAILED` según tarjeta de prueba.  
3. **Integridad de orden**: monto validado en backend, orden registrada como `paid` solo tras confirmación.  
4. **Demo negativa**: existe un caso preparado con tarjeta de prueba para **rechazo**.

---

## 3) Implementaciones (clave para la tesis)
> **Modo general**: todo operará en **TEST/SANDBOX** y con **feature flags**.

### 3.1 Pagos — Transbank Webpay Plus (**sandbox**)  
**Variables sugeridas**
```
TBK_ENV=integration
TBK_COMMERCE_CODE=597055555532       # ejemplo
TBK_API_KEY_ID=597055555532          # según producto sandbox
TBK_API_KEY_SECRET=xxxxx             # clave sandbox
TBK_RETURN_URL=https://tu-dominio.test/pagos/webpay/retorno
TBK_FINAL_URL=https://tu-dominio.test/pagos/webpay/final
```
**Rutas backend**
- `POST /api/pay/checkout` → crea transacción (token + url Webpay)
- `GET  /pagos/webpay/retorno` → recibe `token_ws`, valida y confirma (commit)
- `GET  /pagos/webpay/final` → muestra resultado + resumen de orden

**Flujo**
1) Crear transacción con monto ordenado desde servidor.  
2) Redirigir a Webpay (sandbox) con `token`.  
3) Retorno con `token_ws` → confirmar con SDK → actualizar estado de la **Order**.  
4) Mostrar resultado (AUTHORIZED/FAILED) en página final.

**Notas**: montos calculados server‑side; **idempotencia** en confirmación; auditoría mínima de intentos.

### 3.2 Pagos — Mercado Pago (**modo test**, bandera “Internacional demo”)
**Variables sugeridas**
```
MP_INTEGRATION_MODE=test
MP_PUBLIC_KEY_TEST=APP_USR-xxxx
MP_ACCESS_TOKEN_TEST=TEST-xxxx
MP_SUCCESS_URL=https://tu-dominio.test/pagos/mp/exito
MP_FAILURE_URL=https://tu-dominio.test/pagos/mp/fallo
MP_PENDING_URL=https://tu-dominio.test/pagos/mp/pendiente
```
**Rutas backend**
- `POST /api/mp/checkout` → genera **preferencia** de pago
- `GET  /pagos/mp/exito|fallo|pendiente` → páginas de retorno

**Notas**: usar **cuentas de prueba** (seller/buyer) y **tarjetas de prueba**; no hay dinero real.

### 3.3 Infra y despliegue (SaaS/Freetiers sugeridos)
- **Hosting web**: Vercel (SSR/ISR). Alternativa: DO App Platform/Heroku si se requiere.
- **DB**: PostgreSQL (Railway/Supabase) o SQLite en dev.
- **Secretos**: `.env.local` (tesis); a futuro **Doppler**.
- **Observabilidad**: logs de servidor + errores capturados (Sentry opcional).
- **Analytics**: SimpleAnalytics (sin cookies) o alternativa free.

### 3.4 Seguridad & cumplimiento (tesis)
- **Checkout hospedado** (no capturamos tarjetas).  
- Cookies **httpOnly** para sesión (si se implementa auth).  
- **HTTPS** en dominios públicos (si se usa dominio).  
- TyC/Privacidad visibles (mínimos, académicos).

---

## 4) Especificación funcional por página
### 4.1 Home
- **Contenido**: hero + beneficios, carrusel de colecciones destacadas, CTA a Explorar/Publicar.  
- **AC**: carga < 2s con 12 ítems “destacados” precargados; links a Explorar y a un Producto.

### 4.2 Explorar
- **Contenido**: **masonry grid** infinito; filtros por categoría/licencia/precio; ordenar por relevancia/recientes.  
- **AC**: paginación/scroll infinito funcional; filtros combinables; al hacer click abre Detalle.

### 4.3 Detalle de Producto
- **Contenido**: galería, descripción, licencia, compatibilidad, autor, precio, relacionados.  
- **AC**: botón **Añadir al carrito** agrega ítem; si ya está, incrementa cantidad.

### 4.4 Carrito
- **Contenido**: lista ítems, subtotal, botón **Ir a pagar**.  
- **AC**: modificación de cantidad; validación de stock lógico (digital).

### 4.5 Checkout
- **Contenido**: resumen + botón **Pagar**.  
- **AC**: redirige a Webpay sandbox; tras volver, muestra estado consistente con respuesta.

### 4.6 Éxito / Fracaso / Pendiente
- **Contenido**: estado, `orderId`, monto, fecha, tips de siguiente paso.  
- **AC**: estados reproducibles con tarjetas de prueba.

### 4.7 Autenticación (opcional en MVP)
- **Contenido**: registro/login muy simple (email + password).  
- **AC**: órdenes asociadas a `userId` si existe sesión.

### 4.8 Chatbot
- **Contenido**: FAQ de pagos/test, guía de compra, prompts de búsqueda.  
- **AC**: respuestas preconfiguradas útiles; enlaces a secciones.

---

## 5) Datos y modelo (MVP)
| Tabla | Campos clave | Notas |
|---|---|---|
| **Product** | `id`, `name`, `slug`, `price`, `images[]`, `tags[]`, `license`, `authorId` | formato/compatibilidad a futuro |
| **User** | `id`, `email`, `role` | auth opcional en MVP |
| **Order** | `id`, `userId`, `amount`, `status(pending|paid|failed)`, `provider`, `providerRef` | timestamps |
| **OrderItem** | `orderId`, `productId`, `price`, `qty` | snapshot de precio |
| **Cart** | `userId|anonId`, `items[]` | persistencia simple + server |

**Notas**: normalizar lo justo; seed inicial de productos para demo.

---

## 6) API (contratos mínimos para IA)
**REST (Next.js API Routes)**
- `GET  /api/products?query=&tags=&page=` → lista con filtros/paginación
- `GET  /api/products/:slug` → detalle
- `POST /api/cart` → `{items:[{productId,qty}]}` → `{ok:true, cart}`
- `POST /api/pay/checkout` → `{items, customer}` → `{token, url}` (Webpay)
- `GET  /api/pay/confirm?token_ws=` → `{status, orderId, amount, authorization_code}`
- `POST /api/mp/checkout` → `{items, customer}` → `{init_point|sandbox_init_point}` (MP test)

**Reglas**
- Precios verificados server‑side (no confiar en el front).  
- Idempotencia en confirmación; guardar `providerRef` (token/transactionId).  
- Log de auditoría mínimo.

---

## 7) Implementación UI (pautas para Cursor)
- **Stack**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.  
- **Patrones**: Server Components para páginas; Client Components para interacciones; `use server` para acciones; formularios con `react-hook-form` + `zod` (validaciones); componentes atómicos `Card`, `Button`, `Badge`.
- **Accesibilidad**: foco visible, labels, contraste AA; dark mode.

### 7.1 Estructura de carpetas (App Router)
```
app/
  (marketing)/
    page.tsx              # Home
  explorar/
    page.tsx
  producto/[slug]/
    page.tsx
  carrito/
    page.tsx
  checkout/
    page.tsx
  pagos/
    webpay/
      retorno/route.ts    # GET handler
      final/page.tsx
    mp/
      exito/page.tsx
      fallo/page.tsx
      pendiente/page.tsx
  api/
    products/route.ts
    products/[slug]/route.ts
    cart/route.ts
    pay/
      checkout/route.ts
    mp/
      checkout/route.ts
lib/
  core/                   # entidades y reglas
  usecases/               # casos de uso
  infra/                  # prisma, adapters (webpay/mp)
components/
styles/
```

---

## 8) Variables de entorno (matriz)
| Clave | Descripción | Ejemplo |
|---|---|---|
| `TBK_ENV` | ambiente Transbank | `integration` |
| `TBK_COMMERCE_CODE` | comercio sandbox | `597055555532` |
| `TBK_API_KEY_ID` | id sandbox | `597055555532` |
| `TBK_API_KEY_SECRET` | secreto sandbox | `xxxxx` |
| `TBK_RETURN_URL` | retorno Webpay | `https://.../pagos/webpay/retorno` |
| `TBK_FINAL_URL` | final Webpay | `https://.../pagos/webpay/final` |
| `MP_INTEGRATION_MODE` | modo MP | `test` |
| `MP_PUBLIC_KEY_TEST` | pk test | `APP_USR-xxxx` |
| `MP_ACCESS_TOKEN_TEST` | token test | `TEST-xxxx` |
| `MP_SUCCESS_URL` | éxito MP | `https://.../pagos/mp/exito` |
| `MP_FAILURE_URL` | fallo MP | `https://.../pagos/mp/fallo` |
| `MP_PENDING_URL` | pendiente MP | `https://.../pagos/mp/pendiente` |

---

## 9) Datos de prueba (para la demo)
- **Transbank (sandbox)**: usar **código de comercio** y **tarjetas de prueba** oficiales; escenario **aprobado** y **rechazado** preparados.  
- **Mercado Pago (test)**: crear **cuentas de prueba** (seller/buyer) y usar **tarjetas de prueba**; preparar casos de **aprobado/pendiente/fallo**.

---

## 10) Roadmap (8 semanas)
1) Setup stack + Home/Explorar/Detalle + seed.  
2) Prisma y queries; carrito server/client.  
3) Checkout Webpay (sandbox) end‑to‑end + páginas de retorno.  
4) Estados de **Order** y auditoría; demo “aprobado” y “rechazado”.  
5) Bandera **Mercado Pago test** + páginas de retorno.  
6) Chatbot FAQ + mejoras UX (masonry, filtros).  
7) Métricas básicas + hardening.  
8) Ensayo de defensa + documento final.

---

## 11) Pruebas (escenarios mínimos)
- **Happy path (Webpay)**: crear orden → pagar aprobado → `Order.status=paid`.  
- **Rejected**: tarjeta de prueba rechazada → `Order.status=failed`.  
- **Integrity**: manipular precio en front → backend recalcula y valida; si difiere, error.  
- **Retry**: reintentar confirmación con mismo `token_ws` → idempotencia.

---

## 12) Glosario
**Sandbox/Test**: entorno sin dinero real.  
**Checkout hospedado**: pago en página del proveedor; menor alcance PCI.  
**Idempotencia**: múltiples confirmaciones no cambian el resultado final.

---

## 13) Anexos
- Borradores de endpoints y esquemas (ver §§5–6).  
- Guion de demo para defensa.  
- Notas de estilo para Cursor (convenciones de nombres y layout).

> **Nota:** Este documento reorganiza y consolida el contenido del informe previo, añadiendo las **implementaciones de pagos en sandbox/test**, el **MVP** y una **estructura de carpetas** apta para que una IA (Cursor) scaffoldée el proyecto sin ambigüedades.

