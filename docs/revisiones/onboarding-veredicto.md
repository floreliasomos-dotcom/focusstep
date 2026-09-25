# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-25 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [`components/funnel/ui.tsx` `FunnelShell`, fondo de toda la pantalla] Los degradés radiales de profundidad (`accent 16%`/`accent-2 14%`) son casi imperceptibles a 375px — en el screenshot el fondo se lee como un fill plano de un solo tono → sube la opacidad a ~24-28% o añade un segundo tono de mancha más cerca del centro para que el nivel "base" se distinga a simple vista del `--surface-2` de la card; hoy el sistema de 3 niveles existe en el código pero no se VE en el render, que es lo que puntúa el eje de profundidad.
2. [`app/onboarding/page.tsx` `PantallaPrimeraVictoria`, eyebrow "TU PRIMER PASO — MENOS DE 60 SEGUNDOS"] Texto en `--accent` a 12px bold sobre `--surface-2`: la ficha reporta 4.3:1 de acento contra fondo, por debajo del 4.5:1 AA que exige texto pequeño (el eyebrow no califica como "texto grande") → oscurece un tick el acento SOLO para este uso de texto (o sube el tamaño/peso a un umbral que califique como texto grande) para no fallar contraste en un elemento que se lee en cada pantalla de victoria.
3. [`app/onboarding/page.tsx` `PantallaPregunta`, botón "Continuar" tras "Otra cosa (escribe la tuya)"] Sigue naciendo `disabled` por defecto hasta que el usuario escribe algo (pill al 50% de opacidad) → conviértelo en habilitado siempre y, si el usuario lo toca vacío, muestra el hint de "Escribe algo para continuar" con foco en el input (el patrón de pill-muerto-esperando-el-form-perfecto es justo el que la rúbrica de CTA vivo prohíbe, incluso en un CTA secundario).
4. [`app/onboarding/page.tsx` `PantallaPregunta`, tip "Tip: puedes usar las teclas 1-N"] Vive en 12px gris terciario debajo del título, fácil de pasar por alto la primera vez que aparece el atajo → dale un tratamiento de chip pequeño (fondo `--surface-2` + ícono teclado) la PRIMERA vez que se muestra en la sesión, para que el atajo se note sin tener que leer letra chica.
5. [`app/onboarding/page.tsx` `PantallaLoading`, líneas del checklist] Las líneas de "análisis" muestran el mismo copy en cada sesión sin variación real por respuesta más allá de interpolar el string — el usuario que ya vio el flujo una vez reconoce que es texto de relleno más que un análisis genuino → no es bloqueante pero es la brecha entre "3, ojo entrenado" y "4, ejemplar" en Ayuda contextual/Errores; se resuelve solo con más ramas de copy condicional, no es un cambio de una línea.

Nota para la siguiente pasada: los 5 defectos previos (salida global, profundidad, hueco vertical,
atajos de teclado, bug del check final) están correctamente resueltos y verificados en código +
screenshot. Los 5 de ARRIBA son nuevos y SÍ son accionables sin tocar backend — en particular los
ítems 1-3 son cambios de una línea/token (opacidad del gradiente, un tono de acento, quitar un
`disabled`) que deberían bastar para cruzar 36/40. El ítem 5 es el único que requiere trabajo de
copy no trivial; no es necesario para el gate de usabilidad pero sí para acercarse a un 4 ejemplar.
