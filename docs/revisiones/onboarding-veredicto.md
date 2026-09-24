# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 9/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [código: app/onboarding/page.tsx + components/funnel/ui.tsx] Ninguna animación del funnel (chips, PasoTransicion, BarraProgreso, celebración de la Primera Victoria) usa useReducedMotion — cero manejo de prefers-reduced-motion en todo el onboarding → importar useReducedMotion de motion/react y anular x/scale/springs conservando el fade, igual que ya hace components/landing/ui.tsx.
2. [pantalla de pregunta, mitad inferior] Con 4 chips el ~45-50% inferior del viewport (375x812) queda completamente vacío sin ilustración ni relleno → agregar la mascota blob (dispositivo ownable) u otro elemento de apoyo bajo los chips para eliminar el vacío muerto.
3. [identidad, todo el onboarding] La mascota "blob" declarada en FICHA-ARTE.md como dispositivo ownable NO aparece en ningún punto del código: reconocimiento usa el ícono genérico CircleHelp de Lucide y primera-victoria usa un círculo liso sin personaje → implementar el blob al menos en reconocimiento y primera-victoria, el kit visual es intercambiable con cualquier otra app sin él.
4. [BarraProgreso, arriba de la pantalla] Solo se ve una barra sin texto — no dice "Pregunta 1 de 4" ni cuántas faltan → agregar label textual de progreso para que el usuario reconozca en vez de memorizar/adivinar cuánto falta.
5. [components/funnel/ui.tsx, Chip] Cero atajos de teclado más allá del focus nativo del botón — sin selección numérica (1-4) para el usuario que prefiere teclado, sin listeners adicionales en el código → agregar navegación por número como mejora de eficiencia para el usuario experto.
