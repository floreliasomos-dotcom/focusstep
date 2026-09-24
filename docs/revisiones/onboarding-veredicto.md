# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [components/funnel/ui.tsx — onKeyDown en el contenedor de PantallaPregunta, app/onboarding/page.tsx pregunta "fracasos"] Bug real introducido por el atajo de teclado: al escribir un dígito (1-9) dentro del input de texto libre "Otra cosa", el evento burbujea al div contenedor y dispara `elegirOpcion`, seleccionando una opción y abandonando lo que el usuario estaba escribiendo a medias → excluir el listener cuando `mostrarInput` esté activo, o `e.stopPropagation()` en el input, o filtrar por `e.target instanceof HTMLInputElement`.
2. [BarraProgreso, paso 0 / primera pregunta] Sigue sin existir una salida visible del onboarding en el primer paso (el spacer reemplaza al botón Atrás; no hay X ni "salir") — persiste desde la pasada anterior → agregar un cierre explícito desde el paso 0 con confirmación antes de abandonar.
3. [components/funnel/ui.tsx, Chip — contenedor de ícono] El contenedor del ícono usa `rounded-[12px]` hardcodeado mientras el resto de la pantalla usa `var(--radius-card)` (22px según FICHA-ARTE) — familia de radios no idéntica en la misma pantalla → usar el mismo token o un valor de la escala, no un número mágico.
4. [Chip, atajo de teclado 1-4] El atajo agregado no tiene ninguna pista visual (número/badge en el chip) — ningún usuario descubrirá que existe, queda como funcionalidad muerta en la práctica → mostrar el número sutilmente en el chip o retirarlo si no se va a señalizar.
5. [PantallaPregunta, mitad inferior] El bloque mascota+texto sigue posicionado con `flex-1 justify-center` sobre el espacio restante, así que su posición vertical cambia según cuántas opciones tenga cada pregunta (3 vs 4) — composición inconsistente entre pasos → fijar un offset constante en vez de depender del espacio flex sobrante.
