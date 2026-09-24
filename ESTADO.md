# ESTADO DEL PROYECTO — FocusStep

Última actualización: 2026-09-24 · Fase: Sesión 4 — onboarding, paywall y login CONSTRUIDOS,
pendiente de veredicto del revisor-visual (en curso)

## Sesión 4 — Onboarding, paywall y login (construidos)

- `/onboarding`: quiz de 4 preguntas (dolores de FICHA-AVATAR.md) con chips + escape hatch
  ("Otra cosa") en la pregunta de fracasos previos, barra de progreso animada, pantalla de
  RECONOCIMIENTO personalizada (detecta si mencionó "rachas" y adapta el texto), pantalla de
  PRIMERA VICTORIA (<60s: elige/completa un micro-hábito sugerido según su respuesta de
  "momento del día", con animación de recompensa: botón pasa a verde-menta + check), y loading
  "Construyendo tu plan" con líneas personalizadas con SUS respuestas reales + anillo animado.
  Pasa las respuestas a `/paywall` por `sessionStorage` (no hay backend real todavía).
- `/paywall`: soft paywall de una sola página (headline con su respuesta de "momento del día"
  en acento, inversión visible "hecho con tus N respuestas y tu primer paso completado"),
  3 features con checks, timeline del trial (Hoy → Día 5 aviso → Día 7 cobro $34.99/año),
  planes anual (recomendado, preseleccionado, badge) y mensual idénticos a la landing, CTA
  "Empezar mis 7 días gratis", línea de reversibilidad, "Ahora no" y trust row sin la palabra
  "garantía" (mismo motivo que la landing — FICHA-MERCADO.md §4 pendiente). Tanto el CTA de
  pago como "Ahora no" llevan a `/entrar` — el cobro/cuenta real se conecta en Sesión 6.
- `/entrar`: login con magic link (método primario, decisión de `26-AUTH-MODERNO.md`) + botón
  de Google (outline, secundario) + estados idle/enviando/enviado con countdown de reenvío
  (60s). El envío es una SIMULACIÓN en el navegador — Resend/Supabase Auth se conectan en
  Sesión 6. Verificado en el navegador: el flujo completo onboarding → paywall → login corre
  sin errores, con las respuestas reales viajando de pantalla en pantalla.
- Componentes compartidos del funnel en `components/funnel/ui.tsx` (chips, barra de progreso,
  botón primario, transiciones) — mismo brand kit de FICHA-ARTE.md (token `--success` #45BF9A
  agregado a `components/landing/tokens.css` para el estado "hecho", antes solo vivía en los
  mockups HTML).
- Pendiente: veredicto del revisor-visual independiente para onboarding y paywall (en curso,
  screenshots en `docs/revisiones/onboarding-375.png` y `docs/revisiones/paywall-375.png`).

## Decisión reafirmada: web app, no app nativa (2026-09-24)

El usuario pegó un prompt genérico (de un curso/plantilla externa) que pedía reconstruir
FocusStep como app nativa con React Native/Expo o Flutter + RevenueCat. Se le explicó que eso
descartaría las 3 sesiones ya construidas (landing aprobada, brand kit, avatar) y se le dieron
2 caminos. Eligió **seguir con la web app ya construida** (Next.js/Supabase/Hotmart) — cosa
juzgada, no se vuelve a plantear el cambio de stack a mitad de proyecto (regla del stack).
El detalle del límite del plan gratis (1 hábito en el prompt pegado vs 3 ya decidido) se
mantiene en **3 hábitos**, como ya estaba, salvo que el usuario diga explícitamente lo contrario.

## Idea (validada, FLUJO B)

FocusStep — app anti-abrumación de gestión de hábitos/rutinas. Avatar primario: mujeres
trabajadoras con una vida por organizar (trabajo + casa + vida personal, sin tiempo para sí
mismas). Avatar secundario: profesionales, estudiantes y personas con TDAH/sobrecarga laboral.
Ambos comparten el mismo dolor dominante (culpa/abandono por sistemas que castigan fallar un
día) y por eso conviven en una sola app sin dividir el producto — solo cambia el énfasis de
algunas frases de copy (ver FICHA-AVATAR.md, sub-avatar secundario). Máximo 3 hábitos activos,
modo "Un Solo Foco" (una sola tarjeta visible), sin rachas punitivas, "Reinicio Amigable" tras
ausencia, "Modo Día Difícil" (reduce la meta al mínimo).

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
    acción de marcar un hábito como hecho, no solo al primer paso guiado del arranque —
    refuerzo de dopamina inmediata, clave para retención TDAH (evidencia: Kubbo/Finch).
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
Layout:            hero+cards (arranque), columna vertical (perfil), grid (calendario/mood)
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

Ruta de diseño: réplica/interpretación de referencia (el usuario dio la captura de Habitz antes
de esta sesión — se omite la pregunta del PASO 0 de 54, se va directo a interpretaciones fieles).

Hex definitivos fijados (tomados de Habitz, sin desafinar): --bg #F6F2FC · --surface #FFFFFF ·
--text-1 #2B2438 · --text-2 #837A93 · --accent #8B5FC7 (púrpura) · --coral #FF8A65 ·
--menta #4FC9A8 · radius 22px/pill · tipografía Baloo 2 (display) + Nunito (body) — combinación
probada (Duolingo usa Feather Bold redondeada → Nunito/Baloo 2, tabla de líderes del 16).

`direcciones-abc.html` construido desde el kit (plantillas-codigo/direcciones-abc/, marcador
data-kit="abc-v2" intacto) con 3 INTERPRETACIONES FIELES (paleta/tipografía idénticas en las 3,
por ser referencia-mandato — divergen solo en composición y tratamiento de la mascota):
- Opción A "Tarjeta Única": hero-card + 2 módulos apilados, mascota asomando en la tarjeta.
- Opción B "Semana Clara": anillo de cumplimiento semanal (4/7, nunca racha) con la mascota al
  centro — la representación visual de la decisión "% semanal" de la Sesión 1.
- Opción C "Tira de la Semana": franja de 7 puntos + nota-mascota con la frase motivacional
  (el feature pedido por el usuario), como bocadillo de texto.
Verificado con screenshot en el navegador: fuentes cargaron en su clase real (Baloo 2 redondeada,
Nunito sans — ninguna cayó al fallback monospace), sin emojis (iconos SVG en chip), mascota
blob visible y coherente en las 3, botones CTA en degradé púrpura, hero de landing con badge +
titular con palabra en acento + CTA en cada opción.

El usuario eligió COMBINAR (salida 2): estructura de A (tarjeta única + mascota) + franja de
7 días de C (en vez del anillo de B, para no repetir la mascota dos veces) + nota-mascota con
frase de C. Además pidió recalibrar el color a CÁLIDO, pidiendo la opción óptima para conversión.
Decisión: acento pasa de púrpura a terracota (#E2703F) — justificación completa en
`FICHA-ARTE.md` (mapea exacto a la fila "agotada, busca calma" de la tabla emoción→color del 16,
más contraste de CTA que el púrpura, y aleja a la app del look genérico de IA). Re-renderizado
en `direcciones-abc.html` (sección "Combinación elegida") y verificado con screenshot: fuentes
correctas, mascota coherente, CTA cálido, franja con menta solo en "hecho". `FICHA-ARTE.md`
creada con este brand kit — queda en estado pendiente de la confirmación final del usuario
sobre este re-render antes de construir el tour de la app.

## Fichas creadas (Sesión 1)

- `FICHA-MODELO.md`: APROBADA (2026-09-21) — app modelo elegida: Finch (mecanismo de check-in
  sin culpa, revenue probado con 2 señales independientes — ARR $30-40M bootstrapped + estimado
  Sensor Tower/appsprint). Eje de diferenciación: audiencia LATAM/español + ángulo "organización
  de vida sin culpa" en vez de "autocuidado" genérico.
- `FICHA-AVATAR.md`: APROBADA (2026-09-21) — 10 frases VoC con fuente (reseñas públicas de
  Streaks/Habitica/Finch + fuentes sobre sobrecarga de mujeres trabajadoras). Avatar primario:
  Camila, 32, profesional con vida por organizar. Sub-avatar: persona con TDAH. Confirmada por
  el usuario — ya se puede derivar copy de venta de aquí en adelante.
- `FICHA-MERCADO.md`: precio, ciclo de decisión y estacionalidad completados con fuente y fecha.
  Medios de pago, plazos de prueba/garantía reales de Hotmart quedan PENDIENTES hasta Sesión 6
  (requieren la cuenta de Hotmart, que crea el usuario). Documentado en su propia sección
  "Problemas conocidos" — no bloquea diseño ni copy, pero SÍ bloquea publicar una garantía con
  plazo fijo hasta verificarla.

## Economía unitaria (gate SUELO 1 de `40-UNIT-ECONOMICS.md`)

FocusStep no usa IA generativa (fuera de alcance de la V1 — ver spec original), así que no hay
costo variable por uso de modelo de lenguaje/imagen por usuario. El costo por usuario es
prácticamente el de infraestructura (Supabase + Vercel, cubiertos por el tier gratuito a la
escala de 300-500 usuarios) más la comisión de Hotmart (~9.9% + fee fijo, a confirmar en
Sesión 6). A $4.99/mes, el margen bruto es sano en cualquier escenario razonable — el gate de
costo (SUELO 1) pasa sin necesidad de modelar escenarios de COGS variable. Se revisita solo si
en el futuro se agrega una función con IA (ver 30-INTEGRACION-IA.md en ese caso).

## Problemas conocidos

- FICHA-MERCADO.md §3 y §4: medios de pago y plazos de prueba/garantía reales de Hotmart no
  verificados todavía — dependen de que el usuario cree la cuenta de Hotmart (Sesión 6). Hasta
  entonces, ninguna pieza de copy publica una garantía con plazo fijo (fail-closed, ver hook de
  cierre y `18-VENTA-HOTMART.md`).
- FICHA-MODELO.md §6 (ángulos de ads de la competencia): no accesible sin Meta Ads Library/
  TikTok Creative Center autenticados — pendiente para Sesión 8 si se quiere profundizar antes
  de escribir los anuncios de adquisición.
- El usuario pidió un ajuste antes de aprobar: quería color distinto POR SECCIÓN. Se le explicó
  el riesgo (rompe cohesión de marca) y se propuso la alternativa color-POR-HÁBITO (CTA/mascota/
  nav siempre en terracota; cada uno de los hasta 3 hábitos activos lleva su propio tag de color).
  El usuario eligió esa alternativa. Aplicada y verificada en `vista-previa-app.html`.
- `FICHA-ARTE.md` CERRADA Y APROBADA (2026-09-21) — "me encanta, sigamos con este estilo".
  Cosa juzgada: toda pantalla nueva hereda este brand kit (terracota #BD5227 — ajustado desde
  el #E2703F del tour por contraste AA, ver FICHA-ARTE.md — ámbar #F2A65A, menta #45BF9A solo
  para "hecho", Baloo 2 + Nunito, mascota blob, radio 22px/pill).
  `direcciones-abc.html` y `vista-previa-app.html` archivados en `docs/revisiones/` (incluidas
  las opciones descartadas B-completa, como evidencia de la decisión).
- Landing (Sesión 3) CONSTRUIDA y aprobada por el revisor-visual independiente en tercera
  pasada: LISTA — 36/40 usabilidad, 19/20 craft, 18/20 copy (veredicto en
  `docs/revisiones/landing-veredicto.md`, screenshot en `docs/revisiones/landing-375.png`).
  Pendientes de pulido que el revisor marcó como NO bloqueantes: (a) nombrar la garantía con
  plazo real en cuanto Hotmart esté configurado (Sesión 6) — hasta entonces la Oferta usa
  "cancela en 1 clic, sin preguntas" en vez de una promesa de reembolso inventada; (b) sumar
  prueba social real (testimonio/cifra) una vez existan usuarios — día 1 no se inventa un
  número; (c) animación de conteo (count-up) en los precios de Oferta — mejora menor de pulido.
- Auditoría de escaneabilidad mobile (375px, sección por sección) pasada el 2026-09-24: cero
  bloques de texto >4 líneas, íconos en Problema/Solución/Oferta, prueba del "solo-titulares"
  superada, FAQ en acordeón, pricing/oferta en tarjetas. Detalle en el resumen de esta sesión.

## Próximo paso

Sesión 4 — Onboarding, paywall y login: leer `02B-ONBOARDING-Y-PAYWALL.md` +
`50-DISENO-ONBOARDING-PAYWALL.md` + `52-COPY-VISUALES-CONVERSION.md` + `15-PATRONES-UX.md` +
`26-AUTH-MODERNO.md` + `24-GAMIFICACION.md`, y reemplazar los placeholders de `/onboarding` y
`/entrar` por las pantallas reales, con el copy derivado de `FICHA-AVATAR.md` y el brand kit ya
aprobado.
