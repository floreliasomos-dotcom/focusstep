# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Bloque de pago/CTA] No hay estado de error implementado ni en código para un pago fallido o sin conexión (continuar() siempre redirige, es mock honesto) → al conectar Hotmart en Sesión 6, diseñar el estado de error con qué-pasó+qué-hacer antes de declarar esta pantalla completa (heurística 9, actualmente en 2/4).
2. [PlanCard Anual/Mensual] La card seleccionada no lleva el mismo indicador de selección (checkmark) que usa `Chip` en el resto del funnel — el patrón de "esto está elegido" varía entre pantallas → agregar un checkmark consistente con `Chip` en la esquina de la card activa.
3. [Botón "X" cerrar y enlace "Ahora no"] Siguen sin `whileTap`/feedback de tap, a diferencia de PlanCard y BotonPrimario que ya lo tienen tras esta pasada → añadir `whileTap={{scale:0.95}}` para que el feedback táctil sea parejo en toda la pantalla.
4. [Debajo del CTA, "Pago seguro procesado por Hotmart"] La garantía sigue sin nombre ni plazo cerca del CTA (decisión ya documentada, no es hallazgo nuevo) — sigue bajando el sub-check binario "Garantía nombrada" de la rúbrica de conversión → resolver en cuanto el plazo esté confirmado con Hotmart.
5. [Pantalla completa, scroll] 8 bloques apilados (mascota+headline, features, timeline, 2 plan cards, CTA+disclaimers, footer) superan el límite de 4-5 ítems del gate de carga cognitiva antes de pedir scroll — esperable en el género paywall, pero ningún agrupamiento (acordeón/colapsar timeline) alivia la densidad si en producción se siente pesado.
