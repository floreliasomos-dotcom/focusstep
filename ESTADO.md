# ESTADO DEL PROYECTO — FocusStep

Última actualización: 2026-09-21 · Fase: Sesión 1 (Validación, Avatar, Monetización, Arquitectura) — en curso, previo a B5 (Plan Maestro)

## Idea (validada, FLUJO B)

FocusStep — app anti-abrumación de gestión de hábitos/rutinas para profesionales, estudiantes y
personas con TDAH/sobrecarga laboral que abandonan sistemas de organización tradicionales por
fatiga mental. Máximo 3 hábitos activos, modo "Un Solo Foco" (una sola tarjeta visible), sin
rachas punitivas, "Reinicio Amigable" tras ausencia, "Modo Día Difícil" (reduce la meta al mínimo).

Spec original completa del usuario (PRD + avatar Jim Edwards) recibida y usada como base — ver
historial de conversación para el documento fuente completo.

## Reporte de validación (B2) — resumen

- Veredicto: Excelente oportunidad.
- Competencia: Streaks (4.82★, 27k+ reseñas — queja dominante: culpa/vergüenza por racha rota,
  y que solo cuenta días consecutivos, no cumplimiento semanal) · Habitica (queja dominante:
  interfaz abrumadora, "overwhelming for non-gamers") · Finch (self-care pet, $30-40M ARR
  bootstrapped, $9.99/mes — diseño cálido con mascota ilustrada, pero UX criticada por
  sobrecarga de opciones en settings/quests — lección: progressive disclosure).
- Brecha LATAM: ninguna app en español con tracción usa el ángulo anti-culpa/anti-racha punitiva.
- Mercado: habit-tracking apps proyectado a ~$14.9B en 2026, CAGR >14%.
- Precio de referencia competencia: $4.99-9.99/mes, $35-70/año.

## Avatar y posicionamiento (B3, refinado con evidencia de reseñas)

- Promesa central: "Ayudo a profesionales abrumados y personas con TDAH a cumplir sus metas
  diarias sin listas infinitas de tareas — y sin que un mal día se sienta como un fracaso."
- Razón de compra dominante: escapar del dolor mental (culpa/ansiedad por rachas rotas) —
  confirmado textualmente por reseñas reales de Streaks.
- Razón secundaria: evitar esfuerzo (fatiga por decisión) + ahorrar tiempo (inicio <60s).
- Refinamiento de producto vs spec original:
  - Pantalla "Progreso Amigable": cambia de calendario de racha lineal a **% de cumplimiento
    semanal** (ej. "4 de 7 días esta semana") — corrige el error #1 de Streaks (castigar por
    no ser consecutivo).
  - La animación de gratificación visual de la "Primera Victoria" se extiende a CADA
    "Completar", no solo el onboarding — refuerzo de dopamina inmediata, clave para retención TDAH
    (evidencia: Kubbo/Finch).
  - Nueva función (pedida por el usuario): **frases motivacionales/inspiracionales** — se
    entregan en 3 momentos: (1) rotación diaria en el header del Home, (2) tras completar un
    hábito (parte del momento de gratificación), (3) tono más suave en "Modo Día Difícil".
    Voz derivada del mundo del sujeto (ver Dirección de Arte) — no genérica tipo calendario de frases.
- Regla "nunca" (derivada, pendiente de confirmación del usuario si quiere ajustarla): nunca
  mostrar número/color/mensaje que castigue por fallar un día (cero rojo, cero "perdiste tu
  racha") · nunca notificaciones con culpa/presión · nunca compartir datos del usuario con terceros.

## Monetización (decisión — DECIDE-INFORMA-AVANZA)

- Modelo: **Onboarding-first / freemium con feature-gate** — ya implícito en el PRD original del
  usuario (3 hábitos gratis, Pro desbloquea ilimitados + notificaciones avanzadas). No es hard
  paywall: el usuario prueba la app real (su propio hábito) antes de pagar.
- Planes: $4.99/mes o $34.99/año, trial de 7 días — tal cual el PRD original, coherente con
  benchmarks de mercado ($4.99-9.99/mes).

## Arquitectura / Framework (decisión — DECIDE-INFORMA-AVANZA)

- ⚠️ **Punto de expectativas importante, comunicado al usuario:** este SO construye WEB APPS
  (Next.js/Vercel/Supabase), no apps nativas compiladas para App Store/Play Store. FocusStep se
  construirá como web app responsive optimizada para móvil (instalable como PWA en pantalla de
  inicio). Si el usuario necesita presencia nativa real en las stores, eso requiere un paso
  adicional fuera del alcance de este SO (ej. Capacitor/wrapper nativo) — se lo planteamos si
  surge, no ahora.
- Framework: Next.js App Router (regla del stack: landing con SEO + app integrada → Next.js).
- Backend: Supabase (Postgres + Auth + RLS). Venta: Hotmart + webhook. Emails: Resend.

## Dirección de arte (B4 — preliminar, hex definitivos en Sesión 2)

Referencia dada por el usuario: screenshot de app "Habitz" (ver imagen adjunta en conversación).
Tratada como REFERENCIA-MANDATO PARCIAL: el usuario fijó mood/paleta/tipografía/mascota-firma,
pero pidió explícitamente NO clonarla sola — investigar y fusionar con otros líderes del nicho.

TABLA DE EXTRACCIÓN (Habitz):
```
Modo:              claro
Fondo (wrapper):   lavanda pastel
Superficie/card:   blanco
Texto 1º/2º:       gris casi negro / gris medio
Acentos:           púrpura (CTA, teclado) · coral/naranja (mascotas, tags) · menta (mascotas, tags)
Display/Body:      geométrica redondeada — candidatas: Quicksand, Nunito, Poppins Rounded
Radio:             cards ~20-24px, botones full pill
Espaciado:         aireado
Sombras:           ninguna/sutil — flat color-block
Íconos/detalle:    mascotas "blob" ilustradas (forma de ameba) con carita simple —
                   detalle firma a adoptar y adaptar
Layout:            hero+cards (onboarding), lista (perfil), grid (calendario/mood)
Mood:              cálido, juguetón, amable
```

Fusión decidida:
- ANCLA (de Habitz): paleta lavanda+coral+menta, tipografía redondeada cálida, mascotas
  blob como sistema de personalidad (adaptadas a hábitos/estados de ánimo/"Modo Día Difícil").
- DE STREAKS: extremo minimalismo para la pantalla Home/Un Solo Foco — una tarjeta, un botón,
  cero desorden. Las mascotas e ilustraciones de Habitz se reservan para onboarding, estados
  vacíos y momentos de celebración — NUNCA compiten con la tarjeta de foco único.
  Corrige exactamente la queja de Finch (settings/quests sobrecargados): progressive disclosure.
- DE FINCH: calidez emocional del mecanismo mascota, sin heredar su sobrecarga de opciones.
- Diferenciador propio (mundo del sujeto): la mascota reacciona al "Reinicio Amigable" con un
  gesto propio de bienvenida (no disponible en ningún líder — dispositivo ownable).

Pendiente Sesión 2: PASO 0 completo de 16-DIRECCION-DE-ARTE.md, hex definitivos, tokens CSS,
3 interpretaciones fieles (protocolo 54), FICHA-ARTE.md, tour de la app.

## Próximo paso

Presentar Plan Maestro (B5) al usuario y esperar aprobación para arrancar Sesión 1 completa.
