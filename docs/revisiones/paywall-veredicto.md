# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Fila "Ahora no · Editar mis respuestas", líneas 143-156 de app/paywall/page.tsx] El nuevo enlace "Editar mis respuestas" es un `<a href>` plano sin `motion`/`whileTap`, mientras "Ahora no" a su lado sí es `motion.button` con `whileTap scale 0.95` — dos acciones del mismo tipo visual con feedback táctil distinto → envolver el link en el mismo patrón (`motion.button` + `router.push('/onboarding')` o `next/link` con `whileTap`) para que ambas respondan igual al tap.
2. [Mismo enlace] Usa `<a href="/onboarding">` (navegación de documento completo) en vez de `router.push`/`next/link` como el resto del flujo (`continuar`, `ahoraNo` usan `router.push`) → cambiar a navegación SPA para consistencia de heurística 4 y evitar un reload innecesario.
3. [Bloque de pago, botón "Empezar mis 7 días gratis"] Estado de error de pago sigue sin implementar — no hay endpoint real que pueda fallar todavía (Sesión 6). Heurística 9 se mantiene en 2/4 por esto, no por deuda de esta sesión; no repetir como hallazgo nuevo, solo como techo estructural.
4. [Footer, bajo "Pago seguro procesado por Hotmart"] Garantía sin nombre ni plazo — pendiente de Sesión 6 (verificación con Hotmart, FICHA-MERCADO §4). Mantiene bajo el sub-check binario "Garantía nombrada" de la rúbrica de conversión; no mueve el /40 pero sí el techo de "pantalla que vende completa".
5. [Craft y copy] Sin cambios visuales ni de texto en esta ronda respecto a la pasada anterior — 18/20 y 17/20 se mantienen; no son cuello de botella para el gate.

Confirmación directa a la pregunta del cierre: el fix de "Editar mis respuestas" está implementado y confirmado en código (línea 153-155) y en el screenshot (junto a "Ahora no", bajo el CTA principal) — sube heurística 3 (control y libertad) de 3/4 a 4/4, y el total de usabilidad sube de 33/40 a 34/40. La pantalla TODAVÍA NO cruza el gate (≥36/40 y ≥16/20): craft (18/20) ya lo cruza, pero usabilidad se queda 2 puntos por debajo de 36. El techo restante es estructural y depende exclusivamente de Sesión 6: (a) heurística 1 sigue en 3/4 porque el X y "Ahora no" no tienen feedback propio antes de navegar (menor, acciones de salida), (b) heurística 9 sigue en 2/4 porque no existe estado de error de pago real sin el endpoint de Hotmart, y (c) la garantía sin nombre/plazo sigue bajando el techo de copy de venta completa. Ningún hallazgo de esta lista es deuda nueva de esta sesión salvo los puntos 1 y 2 (inconsistencia de feedback/navegación en el link recién agregado), que sí son accionables hoy sin backend.
