# VEREDICTO revisor-visual — Hoy (M0)
Fecha: 2026-09-29 00:00
Screenshot: docs/revisiones/hoy-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Zona entre la card "Completa 7 días seguidos..." y la TabBar, visible en este mismo screenshot — estado día 1 / racha 0] Sigue quedando un solo bloque de vacío (~20-25% de la altura de pantalla) porque `racha > 0` oculta por completo la línea "Llevas N días seguidos" justo en el escenario MÁS común (usuario nuevo, aún sin racha) — el fix de la ronda anterior (agregar la racha) no se materializa aquí porque la condición la esconde en el caso de uso más frecuente → dar a racha=0 un mensaje neutro que SÍ se renderice siempre (ej. "Aún no llevas racha — hoy es un buen comienzo"), así la fila ocupa su espacio en todos los casos en vez de solo cuando racha>0.
2. [`app/hoy/page.tsx` línea 194, modo "Día difícil"] El headline de 24px concatena `${habito.nombre} — solo un poco cuenta` en una sola línea sin control de longitud (nombres reales como "Estirar 5 minutos al despertar" ya rondan 30 caracteres); con hábitos más largos el sufijo puede producir un título de 3+ líneas desbalanceado en el elemento visualmente más pesado de la pantalla → mover el sufijo a una línea propia más chica debajo del nombre del hábito, en vez de concatenarlo al display de 24px.
3. [Card blanca del hábito — franja de días L-M-M-J-V-S-D] Encaje óptico: el badge de la mascota (`-top-4 right-3`) se posiciona por encima del borde superior de la card con un solapamiento parcial que depende del `border-box` gradiente de la card — en pantallas más angostas de 375px (o con nombres de hábito de 2 líneas que empujan el layout) puede llegar a pisar el chip de categoría; no se ve roto en este screenshot pero no tiene ningún margen de seguridad verificado en código → fijar un `z-index`/gap explícito o usar `top-0 -translate-y-1/2` con un cálculo que no dependa de que el contenido de arriba sea siempre corto.
4. [Pantalla completa — heurística 7] No hay ningún atajo/eficiencia para el uso repetido diario más allá del único CTA (aceptable para una app mobile de "un solo paso", pero cero: sin swipe-to-complete, sin recordar la última elección de "Día difícil" entre sesiones) → bajo impacto, no bloquea el gate, pero es la heurística más floja de las 10.
