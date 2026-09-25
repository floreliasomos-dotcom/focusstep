# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA "Empezar mis 7 días gratis"] RESUELTO esta pasada: `enviando` (línea 36, 53-56, 137-139 de app/paywall/page.tsx) deshabilita el botón y cambia el texto a "Un momento…" al tocarlo, confirmado en código y en el screenshot (BotonPrimario ya soporta `disabled` con opacidad + bloqueo de whileTap en components/funnel/ui.tsx línea 179-188). Sube heurística 1 (visibilidad del estado) de 2 a 3/4 — no llega a 4 porque el X y "Ahora no" (líneas 66-76 y 144-151) siguen sin ningún feedback propio antes de navegar, aunque el impacto es menor al ser acciones de salida, no de conversión.
2. [Bloque de pago] Estado de error de pago sigue sin implementar — sin cambios desde la pasada anterior. No hay endpoint de Hotmart que pueda fallar todavía (Sesión 6), así que no hay error real que diseñar ni catch que agregar con sentido hoy. Heurística 9 se mantiene tope en 2/4 por esto, no por descuido de esta sesión.
3. [Footer, bajo "Pago seguro procesado por Hotmart"] Garantía sin nombre ni plazo — confirmado, documentado en el propio código (líneas 6-8) como pendiente de verificar con Hotmart en Sesión 6. Mantiene bajo el sub-check binario "Garantía nombrada" de la rúbrica de conversión; no mueve el /40 pero sí el techo de "pantalla que vende completa".
4. [X arriba / "Ahora no"] Sigue sin implementarse — decisión de producto explícitamente diferida por el usuario, no un pendiente técnico. Ambas salidas llevan al mismo destino (plan gratis) sin opción de volver a las respuestas del onboarding. Heurística 3 (control y libertad) se mantiene en 3/4 por esto; un enlace discreto "Editar mis respuestas" la subiría a 4/4 sin tocar backend, pero no es bloqueante para craft ni para lo que sí depende de Sesión 6.
5. [Craft y copy] Sin cambios respecto a la pasada anterior (18/20 y 17/20) — no se tocó nada visual ni de texto en esta ronda, solo el estado de carga del CTA.

Confirmación directa a la pregunta del cierre: con el fix del punto 1 aplicado y el punto 4 diferido a propósito, la pantalla sube de 32 a 33/40 — no alcanza el techo de 34/40 que se había proyectado (ese número asumía AMBOS fixes, punto 1 y punto 4). El veredicto NO LISTA en esta pasada NO es un defecto de diseño o código de esta sesión: el 33/40 actual está limpio de deuda nueva. Lo que falta para cruzar el umbral de 36/40 son estructuralmente (a) el estado de error de pago real (heurística 9, depende del endpoint de Hotmart de Sesión 6), (b) el nombre y plazo real de la garantía (depende del mismo Sesión 6), y (c) opcionalmente subir heurística 3 con el enlace de editar respuestas si el negocio decide habilitarlo. Craft (18/20) y copy (17/20) ya están dentro de rango aceptable y no son cuello de botella.
