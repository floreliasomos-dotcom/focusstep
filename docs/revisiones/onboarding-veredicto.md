# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 38/40
Craft: 18/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Fondo global, FunnelShell] El mesh radial (26%/24%) sigue leyéndose casi plano porque acento y --bg comparten la misma familia cálida — sube a 32-34% en el radial superior o añade un segundo stop más frío para que el tinte se perciba sin lupa → mejora EJE 2 (hoy 3/4).
2. [Pantalla Primera Victoria, botón circular "Completar"] No tiene atajo de teclado anunciado (las preguntas sí dicen "Tip: teclas 1-N") — añadir un hint sutil "o presiona Espacio" o dejarlo así está bien, pero es la única pantalla del flujo sin ese refuerzo → detalle menor de flexibilidad (h7).
3. [Todo el flujo, app/onboarding/page.tsx] Cero manejo de error visible para fallos reales (sessionStorage bloqueado en modo privado, router.push fallido): no rompe la experiencia feliz pero un QA técnico lo detecta de inmediato → agregar try/catch con fallback silencioso antes de escalar tráfico.
4. [Mascota, components/funnel/ui.tsx] El blob sigue siendo geométrico simple (2 puntos + arco); es reconocible pero no tan distintivo como podría con un detalle de firma adicional (textura, sombra propia) → EJE 3 pasa el test anti-clon pero no es un 4.
5. [PantallaLoading] Las 4 líneas de "construyendo tu plan" entran todas ya visibles con solo opacity, sin stagger de entrada propio (dependen del check que se activa después) — un stagger iniical de 60-80ms entre líneas reforzaría el EJE 4.

GATE: Usabilidad 38/40 (≥36 ✓) y Craft 18/20 (≥16 ✓) — CRUZA el gate doble. Los 3 fixes de la pasada anterior quedan confirmados: mesh de fondo ahora perceptible en pantalla completa (aunque sigue siendo el punto más débil del craft), contraste del eyebrow calculado en ~4.73:1 sobre --surface-2 (pasa AA 4.5:1), y el botón "Continuar" del campo de texto libre nunca queda disabled — solo no reacciona si el input está vacío, con el hint ya visible explicando por qué. No quedan bloqueantes para declarar esta pantalla LISTA.
