# TAKOPI — Guía Corta para Cursor & GPT‑5
**Objetivo:** que la IA **genere el proyecto por etapas** (fases), con **contratos estables** para escalar sin reescribir.  
**Stack propuesto:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Prisma + PostgreSQL (o SQLite dev).  
**Modo pagos:** **solo sandbox/test** (Webpay + Mercado Pago).  
**Principio:** *backward‑compatible*: cambios se añaden por **features** nuevas, no rompen contratos.

---

## 0) Convenciones
- **Monorepo** simple (web única).  
- **Naming**: kebab‑case para rutas, PascalCase para componentes, camelCase en TS.  
- **Módulos**: `lib/core` (entidades), `lib/usecases` (casos), `lib/infra` (adapters/SDK).  
- **Feature Flags**: `PAYMENTS_MODE`, `MP_DEMO`, `AUTH_ENABLED`.

---

## 1) Variables de entorno (matriz mínima)
| Clave | Ejemplo | Uso |
|---|---|---|
| `NODE_ENV` | `development` | runtime |
| `DATABASE_URL` | `postgres://...` | Prisma |
| `TBK_ENV` | `integration` | Webpay sandbox |
| `TBK_COMMERCE_CODE` | `597055555532` | Webpay sandbox |
| `TBK_API_KEY_ID` | `597055555532` | Webpay sandbox |
| `TBK_API_KEY_SECRET` | `xxxxx` | Webpay sandbox |
| `TBK_RETURN_URL` | `https://app.local/pagos/webpay/retorno` | retorno |
| `TBK_FINAL_URL` | `https://app.local/pagos/webpay/final` | final |
| `MP_INTEGRATION_MODE` | `test` | MP test |
| `MP_PUBLIC_KEY_TEST` | `APP_USR-xxxx` | MP test |
| `MP_ACCESS_TOKEN_TEST` | `TEST-xxxx` | MP test |
| `MP_SUCCESS_URL` | `https://app.local/pagos/mp/exito` | retorno |
| `MP_FAILURE_URL` | `https://app.local/pagos/mp/fallo` | retorno |
| `MP_PENDING_URL` | `https://app.local/pagos/mp/pendiente` | retorno |
| `PAYMENTS_MODE` | `test` | `off|test` |
| `AUTH_ENABLED` | `false` | login opcional |

---

## 2) Estructura de carpetas
```
app/
  (marketing)/page.tsx         # Home
  explorar/page.tsx
  producto/[slug]/page.tsx
  carrito/page.tsx
  checkout/page.tsx
  pagos/
    webpay/retorno/route.ts
    webpay/final/page.tsx
    mp/exito/page.tsx
    mp/fallo/page.tsx
    mp/pendiente/page.tsx
  api/
    products/route.ts
    products/[slug]/route.ts
    cart/route.ts
    pay/checkout/route.ts
    pay/confirm/route.ts       # opcional GET token_ws
    mp/checkout/route.ts
components/
lib/core/        # entidades (Product, Order)
lib/usecases/    # casos (CreateOrder, ConfirmPayment)
lib/infra/       # prisma, adapters (webpay, mp)
prisma/
styles/
```

---

## 3) Modelos de datos (Prisma)
- **Product**: `id, name, slug, price, images Json, tags String[], license, authorId, createdAt`  
- **Order**: `id, userId?, amount, status(enum: pending|paid|failed), provider(enum: webpay|mp), providerRef, createdAt`  
- **OrderItem**: `id, orderId, productId, price, qty`  
- **User** *(opcional en Fase 4)*: `id, email, passwordHash`

---

## 4) API (contratos estables)
- `GET /api/products?query=&tags=&page=` → `{items:[...], page, total}`  
- `GET /api/products/:slug` → `{product}`  
- `POST /api/cart` body: `{items:[{productId, qty}]}` → `{cart}`  
- `POST /api/pay/checkout` body: `{items, customer}` → `{url, token}` (Webpay)  
- `GET  /api/pay/confirm?token_ws=` → `{status, orderId, amount, authorization_code}`  
- `POST /api/mp/checkout` body: `{items, customer}` → `{init_point}`

**Reglas**: verificación de precios en servidor; idempotencia en confirmación; log mínimo.

---

## 5) Fases de generación (prompts listos)
### Fase 1 — Scaffold + Catálogo base
**Prompt IA:**
> Crea un proyecto Next.js (App Router, TS, Tailwind, shadcn/ui, Prisma). Genera páginas Home, Explorar, Producto/[slug], Carrito, Checkout. Implementa API `GET /api/products` y `GET /api/products/:slug` con Prisma y seed de 20 productos ficticios. Añade masonry grid básico en Explorar y detalle con botón “Añadir al carrito”. No agregues auth aún.

**AC:** build OK; Explorar lista; Detalle agrega al carrito en client state.

### Fase 2 — Carrito server‑side + Órdenes
**Prompt IA:**
> Implementa `POST /api/cart` para sincronizar items y calcular totales server‑side. Crea modelos `Order` y `OrderItem`. Implementa `CreateOrder` en `lib/usecases` que reciba items y devuelva `orderId` + `amount`.

**AC:** subtotal consistente; se crea Order `pending`.

### Fase 3 — Webpay (sandbox) end‑to‑end
**Prompt IA:**
> Agrega adapter `lib/infra/webpay.ts` con funciones `createTransaction(amount, orderId)` y `commit(token)`. Implementa `POST /api/pay/checkout` que usa `CreateOrder` y devuelve `{url, token}`. Crea rutas `/pagos/webpay/retorno` y `/pagos/webpay/final` que confirmen y muestren estado. Usa variables `TBK_*` y `PAYMENTS_MODE=test`.

**AC:** pago de prueba aprobado y rechazado reproducibles; `Order.status` actualizado.

### Fase 4 — Mercado Pago (test) via feature flag
**Prompt IA:**
> Agrega `MP_DEMO=true`. Implementa adapter `lib/infra/mp.ts` con `createPreference(order)`. Añade `POST /api/mp/checkout` y páginas `/pagos/mp/exito|fallo|pendiente`. No actives por defecto; sólo si `MP_DEMO=true`.

**AC:** init_point generado y retorno a páginas de estado.

### Fase 5 — Observabilidad y Chatbot básico
**Prompt IA:**
> Integra logger server (console + etiquetas) y captura de errores. Agrega página `/chatbot` con FAQ y respuestas estáticas sobre pagos de prueba y flujo de compra. En Home añade CTA a Explorar y chatbot.

**AC:** errores capturados; chatbot responde preguntas frecuentes.

### Fase 6 — Hardening + Extensiones
**Prompt IA:**
> Añade favoritos (tabla relacional simple) y filtros por tags/licencia/precio en `GET /api/products`. Prepara tests unitarios mínimos para `CreateOrder` y adapters.

**AC:** filtros combinables; tests corren.

---

## 6) Reglas de extensibilidad (para no romper nada)
- **No cambies contratos** de endpoints ni esquemas; cuando sea necesario, **versiona** (`/api/v2/...`).  
- Agrega nuevas features tras **flags**.  
- **Use Cases** sin dependencia de frameworks (pura TS); adapters traducen al mundo externo.  
- DB: cambios con **migraciones** y **campos opcionales** antes de obligatorios.  
- UI: componentes atómicos reutilizables (`Card`, `Button`, `ProductTile`).

---

## 7) Scripts sugeridos
- `pnpm db:push` – aplicar schema/migraciones  
- `pnpm db:seed` – cargar 20 productos demo  
- `pnpm dev` – entorno local  
- `pnpm test` – unit tests básicos

---

## 8) Checklist final (demo)
- [ ] Fase 3: Webpay sandbox OK (aprobado/rechazado).  
- [ ] Fase 4: MP demo detrás de flag.  
- [ ] Páginas de estado muestran `orderId`, `amount`, `provider`, `status`.  
- [ ] README explica **modo test** y tarjetas de prueba.

> **Nota para la IA:** Mantener **contratos y carpetas** tal cual; cualquier mejora debe ser **aditiva**. Si necesitas romper un contrato, crea una variante versionada y deja *compat layer* temporal.