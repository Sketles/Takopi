
# Takopi — Plan de Avances y Respuestas APT

Este documento resume la planificación del proyecto **Takopi** para cumplir con los tres avances requeridos en el semestre (documentación, MVP funcionando, versión final), además de responder a las 15 preguntas de la pauta APT.

---

## 📅 Fases y Avances

### Avance 1 (ya realizado) — Documentación fundacional
**Objetivo:** fijar el marco de negocio y el alcance técnico del MVP.  
**Entregables:**
- One-pager + Especificación Copilot (`Takopi_Spec_for_Copilot.md`).
- Canvas/brief de producto (problema, propuesta de valor, usuarios, diferenciadores).
- Mapa funcional MVP (lista de features “in / out”).
- Borrador inicial respuestas 15 preguntas APT.
**Evidencias GitHub:** 5–10 commits (README inicial, docs, estructura base del proyecto vacía).

---

### Avance 2 (Semana 2–6) — Producto funcionando “end-to-end” (aún por pulir)
**Objetivo:** que Takopi funcione de punta a punta en modo MVP (comprar digital, ver 3D, like/guardar, perfiles, ranking, mapa, orbes).  

**Backlog priorizado:**

- **Semana 2 — Base viva (auth + catálogo + layouts):**
  - Auth + perfiles (avatar, bio, roles visibles).
  - Modelos: Usuario, Producto, Licencia, Like, Guardado.
  - Home grid con Tailwind+DaisyUI+AOS.
  - Datos semilla (10–20 productos demo, 5 DVOs).

- **Semana 3 — Núcleo e-commerce digital:**
  - Ficha de producto con visor 3D (`<model-viewer>`).
  - Checkout sandbox (crear, redirigir, commit).
  - Descarga protegida + recibo con hash.

- **Semana 4 — Social + Personalización básica:**
  - Likes + Guardados (colecciones simples).
  - Galería popular (ranking por corazones).
  - Perfiles con pestañas Creaciones/Guardados/Likes.

- **Semana 5 — Diferenciadores Takopi:**
  - Roles (chips de color) + contadores (ventas, pines, modelos).
  - Orbes v1 (teaser → revela contenido tras compra).
  - Mapa cultural v1 (Leaflet, crear/ver pines con filtro).

- **Semana 6 — Pulido funcional + checklist APT:**
  - Textos legales de licencia + política IP/takedown.
  - Estados mínimos de impresión (PREPARING/IN_PRODUCTION/OUT_FOR_DELIVERY/DELIVERED).
  - Chatbot v1 (intents: estado_pedido, licencias, top_votados, pines_cercanos).

**Evidencias GitHub:** commits con features, PRs por módulo, capturas y demo GIFs en README.

**Criterio de aprobación Avance 2:**  
- Usuario puede crear cuenta, subir modelo, verlo en 3D, comprarlo (sandbox) y descargar.  
- Likes/Guardados modifican galería popular y feed.  
- Perfiles muestran roles y contadores.  
- Mapa cultural permite ver/agregar pines.  
- Orbe comprado se revela correctamente.  

---

### Avance 3 (Semana 7–8) — Versión final para evaluación
**Objetivo:** performance, estética, contenido y presentación.  

**Tareas clave:**
- Tema final “takopi” en DaisyUI, micro-animaciones, accesibilidad mínima.
- Purge de Tailwind (build real) y optimización de descargas tokenizadas.
- Logs de eventos (compra, revelado de orbe, pines).
- Impresión 3D (si entra): estados con timeline en `/orders/{id}` + chatbot de estado.
- Curar Home con 20+ productos de muestra y 10–15 pines culturales (ferias, conciertos, VR, tribus).  
- Documentación final: respuestas completas a las 15 preguntas APT, manual de despliegue, demo vídeo 3–5 min.

**Evidencias GitHub:**  
- 30–60 commits totales, PRs descriptivos, issues cerrados.  
- Releases/tags: `v0.1-avance2`, `v1.0-final`.  
- Kanban de fases en GitHub Projects.  

---

## 📊 Carta Gantt simplificada

```
Semana 1–2: [########] Avance 1 — Documentación
Semana 2–6: [########################] Avance 2 — MVP funcionando
Semana 7–8: [########] Avance 3 — Final
```

---

## ✅ Respuestas a las 15 Preguntas APT

1. **Antecedentes y motivación:** Takopi surge como propuesta para unificar el comercio de modelos 3D y objetos digitales con capas sociales y culturales, generando un espacio donde la creatividad y la tecnología se encuentren en 2025.
2. **Problema a resolver:** La fragmentación actual de assets digitales y la falta de visibilidad comunitaria para creadores y microculturas urbanas.
3. **Relevancia:** El aporte es un ecosistema donde comercio, arte digital, música y cultura se integran, simulando impacto real en creadores, makers y comunidades.
4. **Objetivos:** General: desarrollar un MVP funcional de marketplace creativo. Específicos: visor 3D, checkout sandbox, galería popular, orbes, mapa cultural, roles con stats.
5. **Perfil de egreso:** Aplicación de competencias en desarrollo web, integración de APIs, UX, metodologías ágiles y gestión de proyectos.
6. **Metodología:** Ágil, porque permite iterar y validar rápido, frente a cascada que es rígida.
7. **Metodología ágil aplicada:** Scrum adaptado en sprints semanales, con entregables y demos en cada fase.
8. **Roles en el equipo:** Uno se enfoca en backend, otro en frontend/UX, ambos en documentación y QA compartida.
9. **Planificación:** Basada en fases con sprints cortos (2–3 semanas), commits constantes en GitHub y releases por avance.
10. **Factibilidad:** Riesgos: tiempo limitado, piratería, IP. Mitigación: alcance definido, previews con marca de agua, política de takedown, contenido semilla.
11. **Recursos:** Django, TailwindCSS+DaisyUI, AOS, `<model-viewer>`, Leaflet, Webpay sandbox, S3-like storage.
12. **Evidencias:** Commits, PRs, releases, issues cerrados, demo vídeo, deploy accesible.
13. **Carta Gantt:** Representada arriba, fases críticas: auth, PDP con 3D, checkout, feed/galería, mapa cultural.
14. **Intereses profesionales:** Conexión con desarrollo de e-commerce creativo, tech cultural y uso de IA ligera en UX.
15. **Escalabilidad y futuro:** Puede evolucionar a una solución real con impresión 3D bajo demanda, chat avanzado, analíticas de uso y planes pro para creadores.

---

> **Nota:** Este documento debe mantenerse actualizado en el repositorio (`/docs/PLAN_APT.md`) y servir como guía de desarrollo para cumplir con los avances.

