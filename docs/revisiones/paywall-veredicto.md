# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA "Empezar mis 7 días gratis"] `continuar()` (línea 52-55 de app/paywall/page.tsx) llama `router.push` sin ningún estado de "procesando" — si la navegación real tarda >100ms el usuario no sabe si el tap registró → agregar un estado local `enviando` que muestre spinner/texto de carga en `BotonPrimario` mientras resuelve. Esto SÍ es accionable ahora, sin backend.
2. [Bloque de pago] Estado de error de pago sigue sin implementar — confirmado, sin cambios desde la pasada anterior. Pendiente real de Sesión 6 (no hay endpoint de Hotmart que pueda fallar todavía); el mock actual no tiene ninguna ruta de error que mostrar. Sin backend no hay error real que diseñar, pero mientras no exista, la heurística 9 se queda tope en 2/4.
3. [Footer, bajo "Pago seguro procesado por Hotmart"] Garantía sin nombre ni plazo — confirmado, documentado en el código (líneas 6-8) como pendiente de verificar el plazo real con Hotmart en Sesión 6. Sigue bajando el sub-check binario "Garantía nombrada" de la rúbrica de conversión.
4. [X arriba / "Ahora no"] Ambas salidas llevan al mismo destino (plan gratis) sin posibilidad de volver a revisar o editar las respuestas del onboarding ya dadas — control y libertad se queda en 3/4. Es una decisión de producto (¿se permite reabrir el onboarding sin perder el paywall generado?), no un bug de esta sesión; si el negocio lo permite, un enlace discreto "Editar mis respuestas" sube esta heurística a 4/4 sin tocar backend.
5. [Selector de plan Anual/Mensual] RESUELTO esta pasada: el checkmark ahora aparece después del nombre del plan (mismo orden que `Chip`: label → check), confirmado en código (línea 219-227) y en el screenshot. Sube heurística 4 (consistencia) de 3 a 4/4. Ya no es un defecto — se deja registrado como el cambio verificado, no como pendiente.

Techo real de esta pantalla sin tocar backend: con el fix del punto 1 (loading state del CTA) y una decisión de producto sobre el punto 4, el máximo alcanzable ronda 34/40 — los puntos 2 y 3 dependen estructuralmente de Hotmart (Sesión 6) y mantienen un tope duro por debajo del umbral de 36/40 hasta entonces. Craft (18/20) y copy (17/20) ya están dentro de rango aceptable y no son el cuello de botella; el gate que falla es exclusivamente usabilidad, y es un gate de backend, no de diseño.
