# 🚀 Features Próximas - Takopi

> **Última actualización:** 4 de Diciembre de 2025  
> **Estado:** Planificación

---

## 📋 Resumen

| Feature | Prioridad | Complejidad | Estado |
|---------|-----------|-------------|--------|
| 🔔 Notificaciones | Alta | Media | Pendiente |
| 💎 Suscripciones/Planes | Alta | Alta | Pendiente |
| 💬 Chat/Mensajes | Media | Alta | Pendiente |

---

## 1. 🔔 Sistema de Notificaciones

### Descripción
Sistema de notificaciones en tiempo real para mantener a los usuarios informados de actividad relevante.

### Componentes UI
- Icono de campana 🔔 en el Header con badge contador
- Dropdown con lista de notificaciones recientes
- Página `/profile/notifications` con historial completo
- Marcar como leídas (individual y todas)

### Tipos de Notificaciones

| Tipo | Evento | Mensaje Ejemplo |
|------|--------|-----------------|
| `PURCHASE` | Te compraron | "🛒 **@usuario** compró tu modelo 'Dragon Épico'" |
| `FOLLOW` | Nuevo seguidor | "👤 **@artista3d** comenzó a seguirte" |
| `LIKE` | Like en contenido | "❤️ **@fan** le gustó 'Textura PBR Metal'" |
| `COMMENT` | Comentario nuevo | "💬 **@cliente** comentó en 'Avatar VTuber'" |
| `PRINT_ORDER` | Orden de impresión | "🖨️ Nueva orden de impresión: 'Figura Anime'" |
| `SYSTEM` | Anuncios | "📢 Nuevo: Ahora puedes generar modelos con IA" |

### Modelo de Datos

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String           // A quién va dirigida
  type      NotificationType
  title     String
  message   String
  link      String?          // URL destino al hacer click
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
  
  // Metadata opcional para contexto
  actorId   String?          // Quién generó la notificación
  contentId String?          // Contenido relacionado
  
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, read])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  PURCHASE
  FOLLOW
  LIKE
  COMMENT
  PRINT_ORDER
  SYSTEM
}
```

### API Endpoints

```
GET    /api/notifications          - Listar notificaciones del usuario
POST   /api/notifications/read     - Marcar como leídas
DELETE /api/notifications/:id      - Eliminar notificación
GET    /api/notifications/count    - Contador de no leídas (para badge)
```

### Integración
- Crear notificación automáticamente en:
  - `POST /api/likes` → Notificar al autor del contenido
  - `POST /api/follow` → Notificar al usuario seguido
  - `POST /api/comments` → Notificar al autor del contenido
  - Webpay commit exitoso → Notificar al vendedor

---

## 2. 💎 Sistema de Suscripciones/Planes + Créditos IA

### Descripción
Sistema de membresías con diferentes niveles de beneficios, incluyendo créditos mensuales para generación de modelos 3D con IA.

### Planes

| Plan | Precio | Créditos IA/mes | Comisión Ventas | Beneficios |
|------|--------|-----------------|-----------------|------------|
| **Free** | $0 | 5 créditos | 15% | Acceso básico |
| **Creator** | $4.990 CLP/mes | 50 créditos | 10% | Badge verificado, prioridad soporte |
| **Pro** | $9.990 CLP/mes | 200 créditos | 5% | Analytics avanzados, sin publicidad |

### Sistema de Créditos

| Acción | Costo en Créditos |
|--------|-------------------|
| Text-to-3D | 1 crédito |
| Image-to-3D | 2 créditos |
| Refinamiento | 1 crédito |
| Retexturizado | 1 crédito |

### Packs de Créditos Adicionales

| Pack | Créditos | Precio |
|------|----------|--------|
| Starter | 20 | $1.490 CLP |
| Medium | 50 | $2.990 CLP |
| Large | 150 | $7.990 CLP |

### Modelo de Datos

```prisma
model Subscription {
  id          String    @id @default(cuid())
  userId      String    @unique
  plan        PlanType  @default(FREE)
  status      SubStatus @default(ACTIVE)
  credits     Int       @default(5)    // Créditos actuales disponibles
  renewsAt    DateTime?                // Próxima renovación
  cancelledAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

enum PlanType {
  FREE
  CREATOR
  PRO
}

enum SubStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PAST_DUE
}

model CreditTransaction {
  id        String   @id @default(cuid())
  userId    String
  amount    Int      // Positivo = agregar, Negativo = gastar
  balance   Int      // Balance después de transacción
  reason    CreditReason
  metadata  Json?    // Info adicional (ej: generationId)
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("credit_transactions")
}

enum CreditReason {
  MONTHLY_REFILL    // Recarga mensual del plan
  GENERATION        // Usado en generación IA
  PURCHASE          // Compra de pack
  BONUS             // Bonus promocional
  REFUND            // Reembolso por error
}
```

### Páginas

- `/pricing` - Página de planes y precios
- `/profile/subscription` - Gestión de suscripción actual
- `/profile/credits` - Historial de créditos

### Flujo de Pago

1. Usuario selecciona plan en `/pricing`
2. Redirigir a Webpay para pago
3. En commit exitoso:
   - Crear/actualizar Subscription
   - Agregar créditos correspondientes
   - Crear CreditTransaction
4. Renovación automática mensual (o manual)

### Integración con Takopi-IA

- Antes de generar, verificar `subscription.credits >= costo`
- Descontar créditos al iniciar generación
- Mostrar balance de créditos en UI de Takopi-IA

---

## 3. 💬 Chat/Mensajes entre Usuarios

### Descripción
Sistema de mensajería directa para comunicación entre compradores y creadores.

### Casos de Uso
- Comprador pregunta detalles sobre un producto
- Negociar comisiones personalizadas
- Soporte post-compra
- Colaboraciones entre creadores

### Componentes UI

- **Inbox** (`/profile/messages`)
  - Lista de conversaciones ordenadas por último mensaje
  - Badge con contador de no leídos
  - Búsqueda de conversaciones

- **Chat View**
  - Historial de mensajes con scroll infinito
  - Input de texto con envío
  - Indicador de "visto" (opcional)
  - Info del otro usuario (avatar, nombre)

- **Acceso**
  - Botón "Enviar mensaje" en perfil público de usuarios
  - Link desde notificación de mensaje nuevo

### Modelo de Datos

```prisma
model Conversation {
  id            String    @id @default(cuid())
  participantIds String[] // Array con los 2 IDs de usuarios
  lastMessage   String?
  lastMessageAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  messages      Message[]

  @@index([participantIds])
  @@index([lastMessageAt])
  @@map("conversations")
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())
  
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
  @@map("messages")
}
```

### API Endpoints

```
GET    /api/messages/conversations           - Listar conversaciones
POST   /api/messages/conversations           - Crear/obtener conversación con usuario
GET    /api/messages/conversations/:id       - Obtener mensajes de conversación
POST   /api/messages/conversations/:id       - Enviar mensaje
PUT    /api/messages/conversations/:id/read  - Marcar como leídos
GET    /api/messages/unread-count            - Contador para badge
```

### Consideraciones

- **Sin tiempo real inicial**: Usar polling cada 10-30 segundos
- **Futuro**: Migrar a WebSockets o Server-Sent Events
- **Moderación**: Posibilidad de reportar/bloquear usuarios
- **Límites**: Usuarios Free limitados a X mensajes/día (anti-spam)

---

## 🗓️ Orden de Implementación Sugerido

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: Notificaciones                                     │
│  - Modelo en Prisma + migración                             │
│  - API endpoints                                            │
│  - Componente NotificationBell en Header                    │
│  - Integrar en likes, follows, comments, purchases          │
│  Tiempo estimado: 2-3 días                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: Suscripciones + Créditos                           │
│  - Modelos Subscription y CreditTransaction                 │
│  - Página /pricing con planes                               │
│  - Integrar créditos en Takopi-IA                           │
│  - Flujo de pago con Webpay                                 │
│  Tiempo estimado: 4-5 días                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: Chat/Mensajes                                      │
│  - Modelos Conversation y Message                           │
│  - Inbox UI                                                 │
│  - Chat view con polling                                    │
│  - Integrar con notificaciones                              │
│  Tiempo estimado: 4-5 días                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Notas

- Todas las features deben seguir el Design System existente (dark theme, purple accent)
- Usar Clean Architecture donde aplique
- Crear tests e2e para flujos críticos
- Documentar APIs en el código

---

*Documento de planificación - Sujeto a cambios según prioridades del proyecto*
