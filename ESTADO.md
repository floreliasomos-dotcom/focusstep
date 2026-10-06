# ESTADO DEL PROYECTO — FocusStep

Última actualización: 2026-10-05 · Fase: Sesión 5 EN PAUSA — AUDITORÍA 10/10 ENTREGADA, ESPERANDO
APROBACIÓN DEL USUARIO (regla: no se toca nada hasta que apruebe). Las 4 pantallas del dinero pasaron
el gate (hoy 37/40 · landing 36/40 · onboarding 36/40 · paywall 36/40, tres por margen mínimo).
Puntaje de la auditoría: 5/10 como producto vendible (frontend ~7.5/10; cuentas, datos, pagos,
seguridad y medición ~1-2/10 porque aún no existen — todo es simulación en el navegador).
`/habitos` (+ `components/app/FormularioHabito.tsx` + funciones nuevas en `lib/habitos.ts`) quedó
ESCRITA A MEDIAS: compila y el formulario abre, pero NO pasó medición/checklist ni pruebas de
límite/edición; `/progreso` y `/perfil` siguen como "próximamente". El usuario también pidió el
paso a paso de las cuentas externas (GitHub, Supabase, Vercel, Resend, Hotmart, dominio) — entregado
en el chat, aún sin ejecutar.

## Idea y avatar (Sesión 1 — cosa juzgada, detalle completo en las fichas)

FocusStep — app anti-abrumación/anti-culpa de hábitos. Avatar primario: mujeres trabajadoras
con vida por organizar; sub-avatar: profesionales/TDAH con sobrecarga — mismo dolor dominante
(culpa por sistemas que castigan fallar un día), un solo producto. Máximo 3 hábitos activos
(plan gratis), modo "Un Solo Foco" (una tarjeta visible), **% de cumplimiento semanal en vez
de racha lineal punitiva** (corrige la queja #1 de Streaks), "Reinicio Amigable" tras ausencia,
"Modo Día Difícil" (reduce la meta al mínimo). Detalle completo, fuentes y evidencia en
`FICHA-MODELO.md` (app modelo: Finch) y `FICHA-AVATAR.md` (Camila, 32, aprobada 2026-09-21).

**Monetización:** onboarding-first / freemium con feature-gate (3 hábitos gratis, Pro
ilimitados). Planes $4.99/mes o $34.99/año, trial 7 días.

**Regla "nunca" del producto:** cero rojo/mensaje que castigue fallar un día · cero
notificaciones con culpa · cero compartir datos con terceros.

## Decisión reafirmada: web app, no nativa (2026-09-24)

El usuario pegó un prompt de una plantilla externa pidiendo React Native/Expo. Se le explicaron
los 2 caminos; eligió **seguir con la web app** (Next.js/Supabase/Hotmart) — cosa juzgada.
Límite del plan gratis confirmado en **3 hábitos**.

## Arquitectura / Framework (DECIDE-INFORMA-AVANZA)

Web app responsive (PWA instalable), no app nativa de stores — comunicado al usuario. Next.js
App Router (landing con SEO + app integrada). Backend: Supabase (Postgres + Auth + RLS). Venta:
Hotmart + webhook. Emails: Resend.

## Dirección de arte — cosa juzgada (detalle completo en `FICHA-ARTE.md`)

Referencia parcial del usuario (screenshot "Habitz") fusionada con Streaks (minimalismo del
Home) y Finch (calidez de mascota, sin su sobrecarga de opciones). Brand kit CERRADO y
APROBADO (2026-09-21): `--accent` terracota **#BD5227** (ajustado desde #E2703F por contraste
AA), ámbar #F2A65A, menta #45BF9A (solo "hecho"), Baloo 2 (display) + Nunito (body), mascota
blob, radio 22px/pill. Color-POR-HÁBITO (no por sección): CTA/mascota/nav siempre en terracota;
cada uno de los hasta 3 hábitos activos lleva su propio tag de color — decisión del usuario tras
proponerle la alternativa. `direcciones-abc.html` y `vista-previa-app.html` archivados en
`docs/revisiones/`.

## Sesión 3 — Landing

CONSTRUIDA y LISTA (revisor-visual, 3ª pasada): 36/40 usabilidad, 19/20 craft, 18/20 copy.
Veredicto en `docs/revisiones/landing-veredicto.md`. Pendientes no bloqueantes: nombrar
garantía con plazo real (Sesión 6), sumar prueba social cuando existan usuarios reales,
count-up en precios de Oferta.

## Sesión 4 — Onboarding, paywall y login

- `/onboarding`: quiz de 4 preguntas + escape hatch de texto libre, reconocimiento
  personalizado, Primera Victoria (<60s, micro-hábito sugerido + animación de recompensa),
  loading con líneas personalizadas. "Editar mis respuestas" (`?editar=1`) restaura el
  progreso y en modo edición vuelve directo al paywall sin repetir pantallas. **LISTA**
  (9ª pasada): 38/40 usabilidad, 18/20 craft — veredicto en `docs/revisiones/onboarding-veredicto.md`.
- `/paywall`: soft paywall de una página, precio-por-día bajo cada plan, fecha de cobro
  fusionada al pie de cada `PlanCard`, atajos de teclado 1/2/Enter. Sin la palabra "garantía"
  (pendiente Sesión 6). CTA y "Ahora no" llevan a `/entrar` — cobro real en Sesión 6. **LISTA**
  (15ª pasada, 2026-09-26): 38/40 usabilidad, 16/20 craft, 17/20 copy — historial completo de
  las 15 rondas en `docs/revisiones/paywall-veredicto.md`. Defectos menores no bloqueantes
  para una futura pasada de pulido: garantía sin plazo (estructural), 3 formatos de precio por
  card (podría bajar a 2), acento del headline incluye el posesivo "tu", CTA fuera del primer
  viewport en pantallas muy cortas, falta `<main>`/`<header>` semántico en `FunnelShell`.
- `/entrar`: login con magic link (primario) + Google (secundario), estados
  idle/error/enviando/enviado con countdown de reenvío. Envío SIMULADO — Resend/Supabase Auth
  en Sesión 6. Pantalla secundaria (no una de las 4 del dinero): verificada con medición +
  checklist manual. Corregido un gap real: el estado `error` no se usaba (correo inválido sin
  feedback) — ahora valida y muestra mensaje.
- Componentes compartidos: `components/funnel/ui.tsx` (mismo brand kit de `FICHA-ARTE.md`).

## Sesión 5 — Los 3 pilares técnicos (decisión interna, Regla 6 de CLAUDE.md)

Definidos ANTES de tocar código de la app interna — implementación técnica, no se presentan
al usuario como elección a aprobar.

**(a) Loop de retención + D1-D7 + ritual diario M0:**
```
GATILLO   → interno: "voy a fallar de nuevo" que la app calma sin castigar. Externo:
            recordatorio a la hora ancla del onboarding (su "momento del día").
ACCIÓN    → 1 tap: marcar el hábito de hoy como hecho ("Un Solo Foco").
RECOMPENSA→ variable: animación + una de N frases de la mascota (rotan) + insight ocasional.
INVERSIÓN → % de cumplimiento semanal acumulado + el tono de "Reinicio Amigable" aprendido.
            TEST BINARIO: si se borra el historial, ¿la app de mañana es idéntica? NO.
```
Diferenciador (Sesión 1): **% semanal, nunca racha lineal punitiva** — se registra
`racha_actual` internamente (para ofrecer "Reinicio Amigable"), pero la UI protagonista es
el % semanal. Número mágico (hipótesis sin datos): 3 registros en los primeros 3 días.
```
D1 = onboarding + primera victoria (YA construido). D2 = primera vez que se muestra el %
semanal (nunca antes). D3-D4 = primer "Reinicio Amigable" + insight + prompt de passkey tras
un éxito. D7 = hito emocional de semana + mejor momento para upgrade a anual.
```
**Ritual M0** (una de las 4 pantallas del dinero — mismo gate del revisor-visual): 1) el dato
de hoy (qué cambió desde ayer) · 2) la acción de 1 tap · 3) el % semanal, visible no
protagonista · 4) el insight en voz de la mascota bautizada.

**(b) Auth:** ya construido en Sesión 4 — magic link/OTP primario (Hotmart-first) + Google
secundario. Passkey se ofrece tras la primera victoria (D1-D3), nunca en el primer login.
Pendiente para Sesión 6 (Supabase Auth real): mostrar también el campo de código de 6 dígitos
visible en `/entrar` (el combo completo), no solo el enlace.

**(c) Modelo de datos + RLS:** diseñado para que Sesión 5 (local, `localStorage`) use la misma
forma que tendrá en Supabase:
```
profiles   — id, plan, tz, momento_dia, problema_principal, racha_actual, congeladores,
             ultima_actividad_on.
habits     — id, user_id, nombre, color (por hábito), momento_dia, activo, orden. Máx 3
             activos en plan gratis.
habit_logs — id, habit_id, user_id, fecha (zona del usuario), completado_en, unique
             (habit_id, fecha) — de aquí sale el % semanal y el insight de M0.
```
RLS futura: `racha_actual`/`congeladores` de solo lectura para el cliente, mutados vía RPC
`marcar_habito_hecho` (SECURITY DEFINER). En Sesión 5 esto se refleja como regla de código: la
UI nunca escribe `racha_actual` directo, siempre pasa por una función central
`marcarHechoHoy()` — así migra a la RPC sin reescribir la UI.

**(d) IA:** no aplica — FocusStep no usa IA generativa en la V1.

## Economía unitaria

Sin IA generativa → sin costo variable por uso de modelo. Costo ≈ infraestructura (cubierta por
tiers gratuitos a escala de 300-500 usuarios) + comisión Hotmart (~9.9%, a confirmar Sesión 6).
Margen sano a $4.99/mes — gate de costo (SUELO 1) pasa sin modelar escenarios.

## Problemas conocidos

- [veredicto:onboarding] LISTA por margen mínimo (2026-10-04, 9ª pasada de este ciclo: 30→31→32→33→34→35→
  36/40; craft 16/20). Errores REALES corregidos en el camino: la X borraba el avance (ahora se guarda por
  respuesta y retoma), doble toque saltaba una pregunta (candado), atajos 1-N no respondían tras tocar
  una opción (listener en window), la tecla 4 escribía "4" en "Otra cosa" (preventDefault), "Otra cosa"
  no se cerraba ni reabría con lo escrito, "Continuar" vacío sin feedback (ahora enfoca el campo y
  muestra error --error con ícono), la 1ª opción de P3 partida (padding px-3, cabe en 1 línea a 375px),
  el botón Continuar quedaba fuera de pantalla con el campo abierto (scrollIntoView), campo sin etiqueta
  accesible (aria-label), espera de 500ms lenta con teclado (150ms con atajo). NO se subió el texto de
  12px a 13-14px (la escala 4·8·12·16·24·32·48·64 del linter solo admite 12 o 16). Pulido abierto no
  bloqueante: con la barra de scroll visible o a 360px la 1ª opción de P3 puede volver a partirse; ayuda
  de 16px compite algo con las opciones; textos de 12px justos; sin celebración de hito en las preguntas.
- [veredicto:landing] LISTA (36/40, 18/20, 18/20) tras corregir el resaltado: la 1ª versión tenía ~45%
  del texto en negrita (35/40); ahora una frase clave por párrafo, `[b]` en `--text-primary` y el
  acento en "castigan tus días difíciles". Notas menores abiertas: "fojas cero" es modismo regional
  (el revisor sugiere "empezar de cero"; es copy del usuario, se dejó), count-up de precios.
- [pendiente Sesión 6, OBLIGATORIO antes de cobrar] El paywall dice "te avisamos antes del cobro" y
  "cancela cuando quieras", pero hoy es un mock a `/entrar`: el aviso por correo y la cancelación no
  existen. Hay que implementarlos (Resend + Hotmart) o quitar esas frases antes de vender de verdad.
- [veredicto:landing] y [veredicto:paywall] se marcan CADUCADOS cada
  vez que se toca cualquier `.tsx` compartido del funnel (`app/entrar/page.tsx`,
  `components/funnel/ui.tsx`) por la heurística de frescura del hook — son falsos positivos:
  esos archivos no cambian el render de `/`, `/onboarding` ni `/paywall`. Los tres veredictos
  LISTA siguen vigentes (36+/40, 16+/20 cada uno).
- FICHA-MERCADO.md §3-4: medios de pago y plazos de garantía/reembolso de Hotmart no
  verificados — dependen de crear la cuenta en Sesión 6. Hasta entonces ninguna pieza de copy
  publica una garantía con plazo fijo (fail-closed).
- FICHA-MODELO.md §6 (ángulos de ads de competencia): pendiente para Sesión 8, requiere Meta
  Ads Library/TikTok Creative Center autenticados.
- [veredicto:hoy] **LISTA** (2026-09-29, 6ª pasada): 37/40 usabilidad, 16/20 craft. Pasó por
  6 rondas del revisor-visual independiente — detalle completo de cada una en
  `docs/revisiones/hoy-veredicto.md`. El bug más relevante encontrado en el camino: el botón
  "Marqué esto sin querer" (deshacer) guardaba su snapshot solo en memoria (`useState`), así
  que al navegar a otra pestaña y volver (el flujo normal con la TabBar) quedaba visible pero
  sin efecto — se corrigió persistiendo el snapshot en `localStorage`
  (`obtenerDeshacerDisponible`, válido solo para el mismo hábito y el mismo día). También se
  definió el token `--error` (#B3261E, pendiente desde Sesión 2), se unificó la voz de la
  mascota a 2ª persona, y se movió la animación de entrada a `AppShell` para que las 4 pestañas
  compartan la misma transición. Defectos menores no bloqueantes para una futura pasada de
  pulido: (a) la racha en 0 no muestra ninguna línea (vacío solo en el caso más común, día 1);
  (b) el título del "Modo Día Difícil" puede desbordar a 3 líneas con nombres de hábito largos;
  (c) sin atajos de eficiencia para el uso diario repetido (swipe-to-complete, etc.).

## Auditoría 10/10 (2026-10-05) — hallazgos pendientes de aprobación

**Críticos:** (1) todo es simulación: login sin envío, botón Google sin acción, paywall sin cobro, datos solo
en localStorage, app accesible sin pagar; (2) Next 16.3.5 con falla crítica (GHSA-vcvr-r3jv-pc5j, next/og)
→ actualizar a 16.3.8 antes de publicar; (3) promesas de copy sin respaldo: "prueba de 7 días no pide
tarjeta" (hero) vs "primer cobro Día 7" (paywall), "te avisamos antes del cobro", "cancela cuando
quieras", correo soporte@focusstep.app inexistente; (4) Progreso/Perfil "próximamente", sin cancelar/
cerrar sesión/borrar datos (la política de privacidad lo promete).
**Importantes:** Reinicio Amigable sin pantalla; "gana un pase libre a los 7 días" pero `congeladores` nunca
sube; barra de navegación se encoge a ~300px con poco contenido (falta w-full en AppShell); botón Google
muerto; sin recordatorios; sin analítica; 11 errores de lint (hook `usarConteo` en paywall, setState en
efectos, `<a>` en vez de Link) y 0 tests/CI; sin cabeceras de seguridad; sin OG/sitemap/robots/manifest;
notas abiertas de revisores (3 formatos de precio, CTA bajo pliegue a 667px, sin `<main>`).
**Pulido:** 404/error por defecto en inglés; menta duplicada (hecho vs color de hábito); "1 activos"; datos
locales sin versión; peso de JS ~870 KB sin medir con Lighthouse.
**Top 3 para 10/10:** Sesión 6 completa (Supabase + auth + RLS + Hotmart + puertas de plan) · cumplir lo
prometido (Reinicio Amigable, pases reales, Progreso, Perfil, recordatorios) · limpiar antes de publicar
(Next, claims, tests, cabeceras, medición).

## Próximo paso

Sesión 5 — app interna: las 4 pantallas del dinero (landing, onboarding, paywall, hoy) ya
pasaron el gate del revisor-visual. Seguir con `/habitos` (crear/editar hasta 3 hábitos) y
`/progreso` (% semanal histórico) — ambas son secundarias, les basta medición + checklist, no
revisor-visual completo. Antes de cada pantalla, releer `PREFLIGHT-PANTALLA.md` + `FICHA-ARTE.md`.
