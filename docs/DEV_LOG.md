# Bitácora de Desarrollo (Dev Log) - Takopi

Este archivo mantiene el historial de decisiones, progreso y contexto del desarrollo, permitiendo a cualquier agente de IA o desarrollador retomar el trabajo inmediatamente.

## [2025-11-28] Inicialización de Integración IA

### Estado del Proyecto
- **Takopi v1.0** está funcional (Marketplace + Impresión).
- Se ha iniciado el desarrollo del módulo **"Takopi IA"**.

### Cambios Realizados
1.  **Nueva Página:** Creada ruta `/takopi-ia` (`src/app/takopi-ia/page.tsx`) como laboratorio de pruebas.
2.  **Navegación:** Añadido enlace "Takopi IA" al `Header` (Desktop y Mobile).
3.  **Documentación:** Creada guía técnica en `docs/GUIA_INTEGRACION_IA_3D.md`.

### Decisiones de Arquitectura (IA)
- **Chatbot:** Se utilizará **Google Gemini 1.5 Flash** (Free Tier) vía `Vercel AI SDK`.
- **Generación 3D:** Se utilizará **Meshy AI API** (Plan Estudiante/Pro).
  - *Justificación:* Meshy ofrece la mejor API text-to-3d accesible para el presupuesto del proyecto de tesis.
  - *Integración:* Backend proxy en Next.js -> Meshy API -> Frontend Viewer.

### Tareas Pendientes (Roadmap Inmediato)
- [ ] **Instalación:** `npm install ai @ai-sdk/google zod`
- [ ] **Backend:** Crear endpoint `api/chat/route.ts` para Gemini.
- [ ] **Backend:** Crear endpoint `api/ai/3d` para proxy de Meshy.
- [ ] **Frontend:** Implementar componente de chat funcional en `/takopi-ia`.
- [ ] **Frontend:** Conectar respuesta de Meshy al `<model-viewer>`.

---
