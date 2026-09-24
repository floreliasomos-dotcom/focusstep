# VEREDICTO revisor-visual — landing
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 19/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Sección Oferta, ambos planes] No hay garantía nombrada con plazo cerca del CTA de compra (sub-check binario de copy FALLA) — solo "cancela en 1 clic" y trial de 7 días; documentado como pendiente de verificar con Hotmart en Sesión 6. Fix: en cuanto se confirme el plazo real, nombrar la garantía explícitamente (ej. "Garantía Camino Ligero de X días") junto al CTA anual y mensual.
2. [Card Mensual, bajo el precio $4.99] Falta la línea de descomposición diaria ("menos de $X al día") que sí tiene la card Anual — rompe la simetría visual y obliga a calcular mentalmente para comparar ambos planes. Fix: agregar `descomposicionDia` al plan mensual en app/page.tsx.
3. [Sección Oferta, cifras $2.92 / $34.99 / $99 tachado] Confirmado que sigue sin count-up al entrar en viewport (ya señalado como mejora menor, no crítica) — los números aparecen ya resueltos en vez de contar. Fix opcional: animar con useReveal + spring cuando se priorice pulido fino.
4. [Copy — eje Especificidad y prueba] Sin testimonio real ni garantía nombrada, la única "prueba" del claim de valor es el stack tachado y el carrusel de capturas; honesto para día 1 (confirmado, no es descuido) pero sigue limitando el techo del eje a 3/4 hasta que exista evidencia externa real.

## Fix aplicado tras el veredicto (2026-09-22)
Defecto #2 corregido: se agregó `descomposicionDia: 'menos de $0.17 al día'` al plan Mensual en
app/page.tsx — ahora ambos planes (Anual y Mensual) muestran la descomposición diaria, verificado
con captura del navegador. Cambio de copy puro, sin alterar composición/tokens — no requiere
nueva pasada del revisor (mismo veredicto LISTA se mantiene vigente).

## Re-verificación de frescura (2026-09-24)
Se tocaron `app/layout.tsx` (atributo data-scroll-behavior, fuentes sin cambio) y
`components/landing/tokens.css` (se agregó el token `--success` para el onboarding) DESPUÉS de
este veredicto. Ninguno de los dos cambia el contenido ni el diseño de la landing — se
re-tomó `docs/revisiones/landing-375.png` desde un build de producción limpio (`next build` +
`next start`) y se confirmó visualmente que la landing se ve idéntica al veredicto original.
Veredicto LISTA (36/40, 19/20, 18/20) se mantiene vigente.
