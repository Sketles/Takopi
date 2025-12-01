# Plan Maestro de Integración IA 3D (Takopi)

Este documento define la arquitectura técnica para integrar **Meshy AI** en el ecosistema **Takopi** (Next.js, Vercel, Neon Postgres, Vercel Blob), priorizando seguridad, escalabilidad y persistencia de datos.

---

## 1. Arquitectura del Sistema

### Flujo de Datos (Pipeline)
El proceso es asíncrono para evitar timeouts en Vercel (las Serverless Functions mueren a los 10-60s, la generación 3D tarda más).

1.  **Solicitud (Client):** Usuario envía prompt ("Un pato cyberpunk") -> `POST /api/ai/generate`.
2.  **Validación & Rate Limit:** Backend verifica sesión y cuota diaria en **Neon DB**.
3.  **Disparo (Meshy):** Backend llama a `Meshy API (Create Task)` y obtiene un `taskId`.
4.  **Registro (DB):** Se crea un registro en la tabla `Generation` con estado `PENDING`.
5.  **Polling (Client):** Frontend consulta `GET /api/ai/status/[id]` cada 2-3 segundos.
6.  **Finalización & Persistencia (Critical):**
    *   Cuando Meshy responde `SUCCEEDED`:
    *   Backend descarga el archivo `.glb` de Meshy (temporal).
    *   Backend sube el archivo a **Vercel Blob** (permanente).
    *   Backend actualiza la DB con la URL de Vercel Blob y marca como `COMPLETED`.
7.  **Visualización:** Frontend muestra el modelo cargado desde Vercel Blob.

---

## 2. Modelo de Datos (Prisma / Neon)

Necesitamos rastrear las generaciones para historial y control de costos.

```prisma
// Agregar a schema.prisma

model Generation {
  id          String   @id @default(cuid())
  userId      String
  prompt      String
  provider    String   @default("MESHY") // Por si agregamos otro en el futuro
  taskId      String   // ID externo de Meshy
  status      GenStatus @default(PENDING)
  progress    Int      @default(0)
  modelUrl    String?  // URL final en Vercel Blob
  thumbnailUrl String? // Preview 2D (si Meshy lo entrega)
  cost        Int      @default(1) // Créditos consumidos
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
}

enum GenStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 3. Seguridad y Validaciones

### A. Validación de Entrada (Zod)
No enviaremos nada sucio a la API.

```typescript
const GenerateSchema = z.object({
  prompt: z.string().min(3).max(500),
  style: z.enum(['REALISTIC', 'CARTOON', 'LOW_POLY']).optional(),
  art_style: z.string().optional(), // Parameter tuning de Meshy
});
```

### B. Rate Limiting (Anti-Abuso)
Antes de llamar a Meshy, consultamos la BD:
> *"¿Cuántas generaciones ha hecho el `userId` en las últimas 24 horas?"*

Si `count > 5` (ejemplo para Free Tier), rechazamos la petición con `429 Too Many Requests`.

### C. Protección de API Key
La variable `MESHY_API_KEY` solo vive en el servidor (`.env.local` en dev, Environment Variables en Vercel). Nunca se expone al cliente.

---

## 4. Endpoints de API (Next.js App Router)

### `POST /api/ai/generate`
*   **Input:** `{ prompt: string, style: string }`
*   **Lógica:**
    1.  `auth()` check.
    2.  Validar Zod.
    3.  Check Rate Limit en Neon.
    4.  `fetch('https://api.meshy.ai/v2/text-to-3d', ...)`
    5.  `prisma.generation.create(...)`
*   **Output:** `{ generationId: string, status: 'PENDING' }` (Ojo: devolvemos nuestro ID de DB, no el de Meshy, para abstraer).

### `GET /api/ai/poll/[id]`
*   **Input:** `id` (nuestro ID de base de datos).
*   **Lógica:**
    1.  Buscar generación en DB.
    2.  Si estado es `COMPLETED` -> devolver URL.
    3.  Si es `PENDING/PROCESSING` -> Consultar API Meshy usando el `taskId` guardado.
    4.  **Si Meshy dice DONE:**
        *   Disparar proceso de "Sincronización" (Descargar GLB -> Subir a Blob -> Update DB). Esto puede tardar, así que en la primera llamada devolvemos "Saving..." y en la siguiente la URL final.
*   **Output:** `{ status: 'PROCESSING', progress: 65 }` o `{ status: 'COMPLETED', url: 'blob:...' }`.

---

## 5. Plan de Trabajo (Fases)

### Fase 1: Configuración y Base de Datos
1.  Actualizar `schema.prisma` con la tabla `Generation`.
2.  Ejecutar `npx prisma migrate dev`.
3.  Configurar variables de entorno en `.env`:
    *   `MESHY_API_KEY`
    *   `BLOB_READ_WRITE_TOKEN` (Ya debería estar si usas Vercel Blob).

### Fase 2: Servicio de Backend (Lib)
Crear `src/lib/meshy-service.ts` para encapsular la lógica:
*   `createGenerationTask(prompt)`
*   `checkTaskStatus(taskId)`
*   `saveToBlob(url)`

### Fase 3: API Routes
Implementar los endpoints en `src/app/api/ai/...` integrando las validaciones de Zod y el servicio de Meshy.

### Fase 4: Frontend UI
1.  Crear hook `use3DGenerator`.
2.  Interfaz de Chat/Prompt en `/takopi-ia`.
3.  Integración con tu `ModelViewer3D` existente para mostrar el resultado final.

### Fase 5: Optimización (Post-MVP)
*   Implementar Webhooks de Meshy (para no hacer polling desde el cliente, aunque requiere endpoint público).
*   Galería de "Mis Generaciones" en el perfil del usuario.

---
*Estrategia generada para Takopi - Noviembre 2025*