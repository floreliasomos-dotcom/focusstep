# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 18/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA "Empezar mis 7 días gratis", app/paywall/page.tsx L53-57] continuar() hace setEnviando(true) y router.push sin try/catch ni timeout de seguridad — si la navegación no resuelve, el botón queda congelado en "Un momento…" para siempre, sin mensaje de error ni forma de reintentar → envolver en try/catch, y si tarda más de ~4s, revertir enviando y mostrar "Algo falló, intenta de nuevo".
2. [Pantalla completa] 8 bloques apilados (mascota, título, features, timeline, 2 planes, CTA, microcopy, links, trust line) sin agrupación visual clara entre "informativo" y "decisión" — un ojo entrenado nota que compiten por atención antes del CTA → fusionar visualmente features+timeline en una sola tarjeta o reducir el espacio vertical entre secciones.
3. [Timeline, Día 7] El aviso de cobro es solo texto informativo sin ninguna acción asociada (ni recordatorio, ni enlace a "cómo cancelo") → agregar un micro-enlace "¿Cómo cancelo?" cerca del nodo clave para reforzar ayuda contextual.
4. [Toda la pantalla, verificado en código] Ningún elemento ofrece atajo o eficiencia extra para el usuario que repite el flujo (todo depende del tap nativo) — no es bloqueante en un paywall mobile pero deja el criterio de flexibilidad en la media tabla.
5. Pendiente ya conocido y fuera de alcance de esta pasada (no recontar como nuevo): manejo de error de pago real y copy de garantía — diferidos a Sesión 6 según nota en el propio código.
