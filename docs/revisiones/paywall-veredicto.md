# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Enlace "Ahora no", bajo el CTA] Sigue siendo un `<button>` plano sin `whileTap` — a diferencia de la X (ya corregida esta pasada) y de PlanCard/BotonPrimario, que sí responden al tap → añadir `whileTap={{scale:0.95}}` para que el feedback táctil sea parejo en TODA la pantalla, no solo en el botón de cerrar.
2. [PlanCard Anual/Mensual] Evaluado de nuevo: el borde degradé + tinte 6% del fondo SÍ comunica selección, y el argumento de no duplicar el badge "MÁS POPULAR" es válido (el badge no indica selección, así que no compiten visualmente). Pero el contraste de tinte es sutil en el screenshot — un ojo entrenado nota que el patrón de "elegido" difiere del checkmark explícito que usa `Chip` en el resto del funnel (heurística 4, consistencia, se queda en 2/4, no en 3/4). Es un defecto real pero de baja severidad — no bloquea por sí solo.
3. [Bloque de pago/CTA] Estado de error de pago sigue sin implementar (pendiente documentado de Sesión 6/Hotmart real) — no es un hallazgo nuevo, pero objetivamente sigue bajando la heurística 9 (errores claros) mientras la pantalla se declare "lista".
4. [Debajo del CTA, "Pago seguro procesado por Hotmart"] Garantía sin nombre ni plazo, pendiente documentado de Sesión 6 — sigue bajando el sub-check binario "Garantía nombrada" de la rúbrica de conversión.
5. [Pantalla completa, scroll] 8 bloques apilados (mascota+headline, features, timeline, 2 plan cards, CTA+disclaimers, footer) siguen exigiendo scroll largo — esperable en el género paywall, sin cambios desde la pasada anterior.
