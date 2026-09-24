# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 12/20
Copy (si vende): 13/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Circulo negro con "N" superpuesto entre la card Mensual y el CTA (zona inferior del screenshot) — parece el indicador de dev de Next.js filtrado en la captura, se ve como un elemento roto/flotante sin funcion → recapturar el screenshot desde un build de produccion (next build && next start) antes de aprobar, confirmando que no aparece en produccion.
2. Codigo: components/funnel/ui.tsx y app/paywall/page.tsx animan con motion (stagger, whileTap) sin ningun guard de prefers-reduced-motion (a diferencia de components/landing/ui.tsx que si lo tiene) → envolver las animaciones con useReducedMotion() de motion/react o el mismo patron ya usado en landing/tokens.css.
3. Copy de los 3 bullets y el subtitulo no usa el lexico obligatorio de FICHA-AVATAR.md ("sin culpa", "un mal dia no es el final", "reinicio") — quedan genericos ("Hábitos ilimitados", "Modo Día Difícil siempre disponible") sin anclar al dolor #1/#3 de Camila → reescribir al menos el bullet de "Modo Día Difícil" como "Modo Día Difícil — para cuando un mal día no es el final".
4. Fondo (zona completa detras de header/hero) es un fill plano #FBF2E9 sin tinte ni superficie hundida — Eje profundidad de craft en 0-2 → agregar gradiente sutil detras del hero o un nivel hundido en el bloque del timeline, siguiendo los 3 niveles de DESIGN-CORE.
5. El boton "X" (esquina superior) y el link "Ahora no" (debajo del CTA) hacen exactamente lo mismo (ir a /entrar con plan gratis) y conviven con el CTA principal — dos salidas redundantes en la misma pantalla diluyen la jerarquía de 1 accion primaria → dejar solo una salida secundaria (recomendado: el link "Ahora no", quitar la X o convertirla en el mismo control con un solo aria-label consistente).
