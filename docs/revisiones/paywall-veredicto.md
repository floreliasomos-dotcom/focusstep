# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Selector de plan Anual/Mensual] El check de selección ahora replica el patrón de `Chip`, pero se ubica a la IZQUIERDA del nombre del plan mientras que en `Chip` (usado en el resto del funnel) va a la DERECHA del texto → homologar la posición (derecha) para que la consistencia sea exacta, no solo "cercana" (heurística 4 sube de 2 a 3, pero no llega a 4).
2. [CTA "Empezar mis 7 días gratis"] Al tocar, `continuar()` llama `router.push` sin ningún estado de "procesando" — si la navegación real tarda, el usuario no sabe si el tap registró → agregar spinner o texto de carga breve mientras resuelve la navegación.
3. [Bloque de pago] Estado de error de pago sigue sin implementar (pendiente Sesión 6/Hotmart) — confirmado, sin cambios desde la pasada anterior, sigue bajando heurística 9 (errores claros con solución).
4. [Footer, bajo "Pago seguro procesado por Hotmart"] Garantía sin nombre ni plazo, pendiente Sesión 6 — confirmado, sigue bajando el sub-check binario "Garantía nombrada" de la rúbrica de conversión.
5. [X arriba / "Ahora no"] Ambas salidas llevan al mismo destino (plan gratis) sin posibilidad de volver a revisar o editar las respuestas del onboarding ya dadas — control y libertad se queda en 3/4; si el negocio lo permite, agregar un enlace discreto "Editar mis respuestas".

Cambios verificados esta pasada (los 3 declarados por la sesión, confirmados en código + screenshot):
- CTA "Empezar mis 7 días gratis" ahora se ve en pill/cápsula real (bug de `--radius-btn` corregido) — sube el eje de encaje óptico de craft.
- "Ahora no" (línea 140-147 de app/paywall/page.tsx) ahora es `motion.button` con `whileTap={{scale:0.95}}` — feedback táctil parejo en toda la pantalla.
- `PlanCard` (línea 219-227 de app/paywall/page.tsx) muestra un checkmark circular junto al nombre del plan seleccionado, mismo estilo visual que `Chip` — mejora la consistencia aunque la posición (izquierda vs derecha) todavía difiere (ver defecto 1).
