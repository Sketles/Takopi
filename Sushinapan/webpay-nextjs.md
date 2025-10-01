# Integración de Webpay Plus (Transbank) en Next.js

## 1. Sandbox: datos críticos
- **Ambientes**  
  - Integración: `https://webpay3gint.transbank.cl`  
  - Producción: `https://webpay3g.transbank.cl`

- **Credenciales de integración Webpay Plus**  
  - `COMMERCE_CODE`: `597055555532`  
  - `API_KEY_SECRET`: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`

- **Tarjetas de prueba**  
  - Visa: `4051 8856 0044 6623`, CVV `123`, exp. cualquier fecha  
  - Redcompra: `4051 8842 3993 7763`  
  - Autenticación: RUT `11.111.111-1`, clave `123`

- **Reglas del flujo**  
  - `create` devuelve `{ url, token }` → **POSTear** `token_ws` a esa `url`.  
  - Webpay redirige a tu `return_url` → usar `token_ws` para **commit**.  
  - Venta válida si `response_code === 0` y `status === "AUTHORIZED"`.

---

## 2. Librería y configuración
```bash
npm i transbank-sdk
```

**.env**
```
TBK_ENV=integration
TBK_COMMERCE_CODE=597055555532
TBK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
APP_BASE_URL=http://localhost:3000
```

---

## 3. Arquitectura mínima
- API Routes:
  - `POST /api/webpay/create` → inicia transacción.
  - `GET /api/webpay/commit` → confirma con `token_ws`.
- Páginas:
  - `/checkout` → botón pagar, llama a create y auto-envía formulario a Webpay.
  - `/webpay/return` → return_url de Transbank, reenvía token a commit.

---

## 4. Código crítico

### /app/api/webpay/create/route.ts
```ts
import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus } from "transbank-sdk";

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  const buyOrder = `order-${Date.now()}`;
  const sessionId = `session-${crypto.randomUUID()}`;
  const returnUrl = `${process.env.APP_BASE_URL}/webpay/return`;

  const tx = WebpayPlus.Transaction.buildForIntegration(
    process.env.TBK_COMMERCE_CODE!,
    process.env.TBK_API_KEY!
  );

  const resp = await tx.create(buyOrder, sessionId, amount, returnUrl);
  return NextResponse.json({ url: resp.url, token: resp.token });
}
```

### /app/checkout/page.tsx
```tsx
"use client";
export default function Checkout() {
  async function pagar() {
    const r = await fetch("/api/webpay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 19990 }),
    });
    const { url, token } = await r.json();

    const form = document.createElement("form");
    form.method = "POST"; form.action = url;
    const input = document.createElement("input");
    input.type = "hidden"; input.name = "token_ws"; input.value = token;
    form.appendChild(input); document.body.appendChild(form); form.submit();
  }

  return <button onClick={pagar}>Pagar con Webpay</button>;
}
```

### /app/webpay/return/route.ts
```ts
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token_ws") ?? "");
  if (!token) return NextResponse.redirect("/result?ok=0", 302);
  return NextResponse.redirect(`/api/webpay/commit?token_ws=${token}`, 302);
}
```

### /app/api/webpay/commit/route.ts
```ts
import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus } from "transbank-sdk";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token_ws");
  const tx = WebpayPlus.Transaction.buildForIntegration(
    process.env.TBK_COMMERCE_CODE!,
    process.env.TBK_API_KEY!
  );
  const resp = await tx.commit(token!);
  const approved = resp.response_code === 0 && resp.status === "AUTHORIZED";
  return NextResponse.json({ approved, ...resp });
}
```

---

## 5. Pruebas y consideraciones
- Token expira en ~5 min, `buy_order` debe ser único.  
- Siempre POST `token_ws` a la URL de Webpay (form auto-submit).  
- Maneja abandono: variables `TBK_TOKEN`, `TBK_ORDEN_COMPRA`, etc.  
- Para producción → cambiar credenciales, return_url HTTPS y pasar certificación Transbank.

---

## 6. Checklist producción
1. Cambiar credenciales sandbox → productivas.  
2. Guardar resultado de `commit` en tu BD.  
3. Manejar expiraciones y rechazos.  
4. Pasar pruebas de certificación de Transbank.
