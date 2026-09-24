# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Fondo completo, FunnelShell] El mesh radial agregado es casi imperceptible en el screenshot y no existe ninguna superficie hundida (solo base cream + surface blanca); el bloque del timeline vive pegado al fondo base sin distinguirse → subir la opacidad del mesh o dar al timeline un fondo hundido sutil para completar los 3 niveles de profundidad de DESIGN-CORE.
2. [Card de features y línea del timeline] Cero hairline degradé real (1-2px, gradiente padding-box/border-box) en toda la vista — el borde de la card y la línea del timeline son sólidos con color-mix, no degradé → aplicar un hairline degradé en al menos 1 elemento clave (ej. borde de la card "Anual · MÁS POPULAR"), gate de conversión del 55.
3. [PlanCard, componente de selección de plan Anual/Mensual] Es un `<button>` plano sin `motion.button` ni `whileTap`, a diferencia de `Chip` y `BotonPrimario` que sí animan el tap — el usuario no percibe respuesta táctil al elegir plan → agregar `whileTap={{ scale: 0.97 }}` igual que en `Chip` (components/funnel/ui.tsx).
4. [Timeline, nodo "Día 7 — primer cobro"] Es el dato que más le importa a la objeción de precio de Camila (FICHA-AVATAR, objeción #4) pero pesa visualmente igual que los otros dos nodos (mismo tamaño/color) → destacar la fecha de cobro real con el color de acento o mayor peso para que no se lea como letra chica.
5. [Debajo del CTA, "Pago seguro procesado por Hotmart"] La garantía sigue ausente (decisión ya documentada, no es hallazgo nuevo) y el único elemento de confianza cercano al CTA es un texto terciario de 12px gris — cuando se resuelva el plazo con Hotmart en Sesión 6, nombrar la garantía con su plazo junto al CTA, no dejar solo el sello de "pago seguro".
