# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [`components/funnel/ui.tsx` `BarraProgreso`, header de todo el funnel] Sigue sin existir ninguna forma de SALIR del funnel completo (solo "Atrás" pregunta por pregunta) → agrega un ícono X discreto junto al botón Atrás que muestre "¿Seguro que quieres salir? Tu progreso no se guardó" y lleve a la landing; heurística de Control y libertad sin resolver desde la pasada anterior.
2. [Craft — profundidad, toda la pantalla Primera Victoria y el resto del onboarding] Sigue habiendo solo 2 niveles reales (fondo con degradé radial + sombra del CTA circular); no hay ninguna superficie elevada/hundida que enmarque texto o mascota → envuelve el bloque eyebrow+título+subtítulo (o el área de la mascota) en una superficie sutil (`--surface` con sombra mínima o un tinte hundido `--surface-sunken`) para completar el sistema de 3 niveles que exige FICHA-ARTE.md.
3. [Pantalla Primera Victoria, `app/onboarding/page.tsx` `PantallaPrimeraVictoria`] Al ocultar el pill "Continuar" antes de completar (el fix correcto para el defecto anterior), quedó un hueco vertical grande y desbalanceado: mucho aire muerto arriba (barra de progreso → mascota) y abajo (placeholder `h-14`) sin nada que lo llene → sube la mascota, reduce el `py-8`/gaps o agrega un elemento de apoyo (ej. micro-copy bajo el círculo tipo "Toca para probarlo") para que la composición se sienta llena, no vacía.
4. [`app/onboarding/page.tsx` `PantallaPregunta`, las 3 preguntas 100% de opciones sin texto libre] Sin atajos de teclado (números 1-4) para seleccionar chips → agrega un listener de teclado limitado a las preguntas sin `escape:true` (evita el riesgo ya identificado con el campo "Otra cosa"), sube Flexibilidad y eficiencia de 2 a 3.
5. [`app/onboarding/page.tsx` `PantallaLoading`, línea 364] La condición que decide checkmark vs. punto pulsante (`i < activa - 1 || (i === activa - 1 && i === lineas.length - 1)`) hace que el ÚLTIMO ítem de la lista salte directo a check sin pasar nunca por el estado "en progreso" (pulso) que sí ven los otros tres → normaliza la condición para que todos los ítems, incluido el último, pasen por pulso antes de check; consistencia del feedback de estado.
