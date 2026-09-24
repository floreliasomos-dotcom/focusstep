# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla Primera Victoria, bajo el círculo "Completar"] El pill "Continuar" se muestra desde el inicio en estado disabled/opacity-50, compitiendo visualmente con el círculo "Completar" (dos CTAs simultáneos) → oculta el pill (opacity 0 / no renderizar) hasta que `completa` sea true, y hazlo aparecer con fade-in junto al mensaje de celebración, en vez de mostrarlo muerto desde el arranque.
2. [Pantalla Primera Victoria, pill "Continuar" deshabilitado] El contraste de texto blanco sobre el fondo salmón claro (accent al 50% de opacidad) se ve por debajo de 3:1 a simple vista → si decides mantenerlo visible en estado disabled, usa un fondo neutro/gris translúcido en vez de bajar la opacidad del acento (que se lee como "botón roto"), o aplica el fix del punto 1.
3. [Craft — profundidad, toda la pantalla] Solo hay 2 niveles reales (fondo con degradé + CTA con sombra); falta una superficie "hundida" o elevada que enmarque el bloque de texto/eyebrow para completar el sistema de 3 niveles de FICHA-ARTE → envuelve el bloque eyebrow+título+subtítulo en una superficie sutilmente elevada (`--surface` con sombra mínima) o dale al fondo detrás de la mascota un tinte hundido.
4. [Header de todo el onboarding, `components/funnel/ui.tsx` `BarraProgreso`] No existe ningún control de salida/cierre del funnel completo (solo hay "Atrás" pregunta por pregunta) → agrega una acción discreta de salir (ej. ícono X que confirme "¿Seguro que quieres salir? tu progreso no se guardó") para cumplir control y libertad de Nielsen.
5. [`app/onboarding/page.tsx` `PantallaPregunta`, preguntas de opción múltiple] Sin atajos de teclado (decisión documentada por el bug del campo libre) — la falta es razonable para la pregunta con "Otra cosa", pero las otras 3 preguntas son 100% chips sin texto libre y podrían tener números 1-4 sin ese riesgo → si se retoma, limitar el listener solo a las preguntas sin `escape:true`.
