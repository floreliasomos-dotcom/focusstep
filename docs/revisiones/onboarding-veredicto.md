# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [app/onboarding/page.tsx:218, PantallaPregunta — mascota+caption] El texto "Ya casi terminas" es IDÉNTICO en las 4 preguntas y NO depende del índice de la pregunta — en el screenshot (Pregunta 1 de 4) le dice al usuario que casi termina cuando apenas empieza, un desajuste que cualquier usuario nota de inmediato → condicionar el texto al progreso real (ej. solo mostrarlo en la última pregunta) o usar una frase neutra que no dependa de cuánto falta.
2. [app/onboarding/page.tsx:94-100, atras()] Tocar el back en el paso 0 saca al usuario del embudo completo hacia "/" sin ninguna confirmación ni diferencia visual respecto de "retroceder una pregunta" — pérdida de progreso irreversible sin aviso, viola la regla de confirmación en acciones irreversibles → mostrar un confirm breve o cambiar el ícono/label cuando el back implica abandonar el flujo, no solo retroceder un paso.
3. [components/funnel/ui.tsx, Chip] Cero atajos de teclado tras el retiro del bug anterior (correcto quitarlo roto, pero quedó sin reemplazo) — cada opción solo responde a click/tap, ningún soporte de flechas+Enter ni teclas numéricas → reintroducir un atajo de teclado seguro (sin el bug que lo forzó a eliminarse).
4. [app/onboarding/page.tsx:210, input "otra cosa"] La validación solo deshabilita "Continuar" sin explicar por qué — quien escribe y borra el campo no recibe ningún mensaje ("escribe al menos una palabra") → agregar un hint visible bajo el input cuando está vacío.
5. [Craft — screenshot, Pregunta 1 de 4] El tramo entre el último chip y el bloque mascota queda como aire sin propósito mientras arriba la pantalla está densa (título + 4 chips) — sensación de reparto desigual del espacio → usar ese tramo con padding simétrico o mover ahí un elemento secundario (contador, tip) en vez de dejarlo vacío.
