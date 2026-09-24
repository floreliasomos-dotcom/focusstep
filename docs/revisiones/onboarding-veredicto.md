# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [pantalla pregunta, mitad inferior] Persiste un vacío de ~180-200px entre el último chip y la mascota (chips terminan ~y=517, mascota empieza ~y=707 en 812px de alto) — la mascota ayuda pero no cierra el hueco, un usuario lo nota sin buscarlo → reducir el espacio (menos mt-auto/pt-8) o agrandar la mascota/agregar un micro-texto de apoyo bajo ella.
2. [components/funnel/ui.tsx, lista de Chips en PantallaPregunta] Los 4 chips aparecen todos a la vez sin stagger de entrada — la baseline de animación #1 (entrada escalonada 50-80ms) sigue sin cumplirse en la primera pantalla del funnel → envolver el contenedor de chips en un variants de Motion con staggerChildren ~60-80ms.
3. [app/onboarding/page.tsx, array PREGUNTAS] Inconsistencia real de componente: las preguntas 1 y 4 dan `icon` a sus opciones (chip con contenedor de ícono) y las preguntas 2 y 3 no — el mismo Chip luce distinto entre pasos consecutivos, rompe consistencia (h4) → dar ícono a todas las opciones o quitarlo de todas.
4. [components/funnel/ui.tsx, Chip] Sin atajo de teclado (selección por número 1-4) para el usuario que prefiere teclado — sigue sin implementarse desde la pasada anterior → agregar onKeyDown en el contenedor de PantallaPregunta que mapee dígitos a `onElegir`.
5. [BarraProgreso, header] El botón Atrás (ChevronLeft) ya funciona y tiene aria-label, pero no hay forma visible de salir del onboarding por completo (cerrar/volver a landing) desde el paso 0 — verificar en código que `atras()` en paso 0 tiene destino definido, o agregar una salida explícita.

Nota: los 4 puntos de la pasada anterior (reduced-motion, mascota ausente, label de progreso ausente) quedaron corregidos y verificados en código/screenshot — no se repiten como defectos nuevos.
