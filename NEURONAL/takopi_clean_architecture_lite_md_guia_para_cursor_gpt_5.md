# Takopi — Clean Architecture “Lite” (Guía para Cursor/GPT‑5)
> **Objetivo:** separar **lógica de negocio** de **UI/infra**, habilitar **mocks** y **cambio de proveedor de BD** (Mongo ↔ SQL) solo tocando el wiring. Esta guía instruye a la IA (Cursor/GPT‑5) para **generar** y **modificar** el proyecto en fases, sin romper contratos.

---

## 0) Principios
- **Dominio y Casos de uso**: TypeScript puro (sin Next/Mongoose/SDKs).
- **Puertos (ports)**: interfaces **mínimas** donde existan variantes (DB, storage, pagos).
- **Adaptadores (infra)**: implementaciones concretas de esos puertos (Mongo, Prisma/SQL, Cloudinary, Webpay...).
- **UI (Next.js App Router)**: orquesta; llama casos de uso; no contiene reglas de negocio.
- **Flags/ENV**: `DB_PROVIDER=mongo|sql|mock`, `STORAGE_PROVIDER=cloudinary|mock`, `PAYMENTS_MODE=off|test`.
- **Compatibilidad hacia atrás**: cambios **aditivos**; versionar endpoints si se rompen contratos.

---

## 1) Estructura de carpetas (generar)
```
src/
  app/                         # UI + server actions (borde)
  components/
  lib/
    core/                      # Dominio puro
      entities/                # Product.ts, Order.ts, User.ts, Asset.ts
      value-objects/           # Money.ts, Slug.ts, Provider.ts
    usecases/                  # Casos de uso
      ports/                   # Interfaces mínimas
        UserRepo.ts
        ProductRepo.ts
        AssetStorage.ts
        PaymentsPort.ts
    infra/                     # Adaptadores
      db/
        mongo/                 # Mongoose
          models/
            UserModel.ts
            ProductModel.ts
            AssetModel.ts
            OrderModel.ts
          MongoUserRepo.ts
          MongoProductRepo.ts
          MongoOrderRepo.ts
        sql/                   # Prisma (placeholder para futuro)
          SqlUserRepo.ts
          SqlProductRepo.ts
          SqlOrderRepo.ts
      storage/
        CloudinaryStorage.ts
        MockStorage.ts
      payments/
        WebpayAdapter.ts
        MercadoPagoAdapter.ts
        MockPayments.ts
    config/
      env.ts                   # lectura de ENV y flags
      container.ts             # inyector de dependencias por entorno
    testing/
      fakes/                   # Repos fakes para mocks
        MockUserRepo.ts
        MockProductRepo.ts
        MockOrderRepo.ts
  types/
```

---

## 2) Variables de entorno (añadir al `.env.local`)
```
DB_PROVIDER=mongo   # mongo|sql|mock
STORAGE_PROVIDER=cloudinary  # cloudinary|mock
PAYMENTS_MODE=off   # off|test
MONGODB_URI="mongodb+srv://takopi_app:<PASS>@<cluster>.mongodb.net/takopi?retryWrites=true&w=majority"
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`DB_PROVIDER=mock` activa el **interceptor** (repos fakes) para correr local/offline sin Atlas.

---

## 3) Puertos (interfaces) — generar
```ts
// src/lib/usecases/ports/UserRepo.ts
import { User } from "@/lib/core/entities/User";
export interface UserRepo {
  findByEmail(email: string): Promise<User | null>;
  create(u: Omit<User, "id"|"createdAt">): Promise<User>;
}
```
```ts
// src/lib/usecases/ports/ProductRepo.ts
import { Product } from "@/lib/core/entities/Product";
export interface ProductRepo {
  search(q: { text?: string; tags?: string[]; page: number }): Promise<{items: Product[]; total: number}>;
  findBySlug(slug: string): Promise<Product | null>;
}
```
```ts
// src/lib/usecases/ports/AssetStorage.ts
export interface AssetStorage {
  getSignedUpload(
    kind: "image"|"audio"|"model",
    file: { name: string; mime: string }
  ): Promise<{ uploadUrl: string; storagePath: string; publicUrl?: string }>;
  getSignedRead(storagePath: string): Promise<{ url: string }>;
}
```
```ts
// src/lib/usecases/ports/PaymentsPort.ts
export interface PaymentsPort {
  create(amount: number, orderId: string): Promise<{ url: string; token: string }>;
  confirm(token: string): Promise<{ status: "AUTHORIZED"|"FAILED"; authorizationCode?: string }>;
}
```

---

## 4) Casos de uso — generar
```ts
// src/lib/usecases/RegisterUser.ts
import { UserRepo } from "./ports/UserRepo";
export class RegisterUser {
  constructor(private repo: UserRepo) {}
  async execute(input: { email: string; passwordHash: string }) {
    const exists = await this.repo.findByEmail(input.email);
    if (exists) throw new Error("EMAIL_TAKEN");
    return this.repo.create({ ...input, role: "user" });
  }
}
```
```ts
// src/lib/usecases/ListProducts.ts
import { ProductRepo } from "./ports/ProductRepo";
export class ListProducts {
  constructor(private repo: ProductRepo) {}
  async execute(q: { text?: string; tags?: string[]; page?: number }) {
    const page = q.page ?? 1; return this.repo.search({ ...q, page });
  }
}
```
```ts
// src/lib/usecases/CreateOrder.ts
import { PaymentsPort } from "./ports/PaymentsPort";
import { ProductRepo } from "./ports/ProductRepo";
export class CreateOrder {
  constructor(private payments: PaymentsPort, private products: ProductRepo) {}
  async execute(input: { items: { productId: string; qty: number }[]; orderId: string }) {
    // Recalcular monto server-side (simplificado)
    let amount = 0;
    for (const it of input.items) {
      const p = await this.products.findBySlug(it.productId); // o por id según tu modelo
      if (!p) throw new Error("PRODUCT_NOT_FOUND");
      amount += p.price * it.qty;
    }
    return this.payments.create(amount, input.orderId);
  }
}
```

---

## 5) Adaptadores — generar (ejemplos breves)
```ts
// src/lib/infra/db/mongo/MongoUserRepo.ts
import { UserRepo } from "@/lib/usecases/ports/UserRepo";
import { UserModel } from "./models/UserModel";
export class MongoUserRepo implements UserRepo {
  async findByEmail(email: string) { return UserModel.findOne({ email }).lean(); }
  async create(u: any) { const doc = await UserModel.create({ ...u, createdAt: new Date() }); return doc.toObject(); }
}
```
```ts
// src/lib/testing/fakes/MockUserRepo.ts
import { UserRepo } from "@/lib/usecases/ports/UserRepo";
const mem: any[] = [];
export class MockUserRepo implements UserRepo {
  async findByEmail(email: string) { return mem.find(u => u.email===email) ?? null; }
  async create(u: any) { const r = { ...u, id: crypto.randomUUID(), createdAt: new Date() }; mem.push(r); return r; }
}
```
```ts
// src/lib/infra/storage/MockStorage.ts
import { AssetStorage } from "@/lib/usecases/ports/AssetStorage";
export class MockStorage implements AssetStorage {
  async getSignedUpload(kind: any, file: any) {
    const storagePath = `${kind}/${Date.now()}-${file.name}`;
    return { uploadUrl: `mock://${storagePath}`, storagePath, publicUrl: `mock://${storagePath}` };
  }
  async getSignedRead(storagePath: string) { return { url: `mock://${storagePath}` }; }
}
```

---

## 6) ENV + Container — generar
```ts
// src/lib/config/env.ts
export const ENV = {
  DB_PROVIDER: process.env.DB_PROVIDER ?? "mongo",
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER ?? "cloudinary",
  PAYMENTS_MODE: process.env.PAYMENTS_MODE ?? "off",
};
```
```ts
// src/lib/config/container.ts
import { ENV } from "./env";
import { MongoUserRepo } from "@/lib/infra/db/mongo/MongoUserRepo";
import { MockUserRepo } from "@/lib/testing/fakes/MockUserRepo";
export const container = {
  makeUserRepo() {
    if (ENV.DB_PROVIDER === "mock") return new MockUserRepo();
    // TODO: if (ENV.DB_PROVIDER === "sql") return new SqlUserRepo();
    return new MongoUserRepo();
  },
};
```

---

## 7) Uso desde la UI / API (borde)
```ts
// src/app/api/user/register/route.ts
import { container } from "@/lib/config/container";
import { RegisterUser } from "@/lib/usecases/RegisterUser";
export async function POST(req: Request) {
  const body = await req.json();
  const uc = new RegisterUser(container.makeUserRepo());
  const user = await uc.execute(body);
  return Response.json(user, { status: 201 });
}
```

---

## 8) Fases para la IA (no romper contratos)
**Fase A**: crear carpetas, puertos `UserRepo`, `ProductRepo`, `AssetStorage`, container y mocks.  
**Fase B**: mover lógica existente a `usecases/` (RegisterUser, ListProducts, UploadAsset).  
**Fase C**: adaptar endpoints/server actions para que llamen casos de uso vía `container`.  
**Fase D**: añadir `PaymentsPort` + `WebpayAdapter` (modo `PAYMENTS_MODE=test`).  
**Fase E**: preparar `sql/*Repo.ts` (Prisma placeholder) sin tocar UI ni usecases.

---

## 9) Reglas de extensión
- Si cambias un contrato, **versiona**: `/api/v2/...`.
- Nuevos proveedores → crea **nuevo adapter** e inyecta por ENV.
- Tests de casos de uso con **fakes** (no dependas de Next ni Mongoose).

---

## 10) Checklist rápido
- [ ] `.env.local` con `DB_PROVIDER` y `MONGODB_URI`.
- [ ] `container.makeUserRepo()` devuelve **mock** si `DB_PROVIDER=mock`.
- [ ] `RegisterUser` no importa Next/Mongoose.
- [ ] UI llama **solo** casos de uso.
- [ ] Primer seed/listado crea colecciones automáticamente (Mongo).

> **IA (Cursor/GPT‑5):** genera exactamente estos archivos y rutas; respeta nombres/carpetas. Mantén cambios **aditivos** y provee mocks cuando `DB_PROVIDER=mock`.

