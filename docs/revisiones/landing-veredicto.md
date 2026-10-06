# VEREDICTO revisor-visual — landing
Fecha: 2026-10-04 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Seccion Agitacion, parrafo 1] "vuelves a fojas cero" es modismo regional (mexicano) en una pagina de tuteo LATAM neutro; parte del avatar puede no entenderlo. Fix: "vuelves a empezar de cero".
2. [Seccion Oferta, cifras $2.92 / $34.99 / $99] Sin count-up al entrar en viewport (pendiente menor ya conocido). Fix: animar con useReveal + spring.
3. [Oferta / copy] Sin garantia nombrada ni testimonio real (aceptado por reglas del proyecto; techo de especificidad en 3/4).
4. [Pagina completa, ~7200px] CTA principal repetido 4 veces mas sticky; todos con la misma etiqueta y destino, sin competir, pero el CTA "Elegir mensual" es un segundo tipo de accion que baja un poco el foco (h8 en 3, no 4).
Notas de verificacion: fixes anteriores verificados en codigo. app/page.tsx lineas 71-73: una sola frase clave por parrafo, acento en "castigan tus dias dificiles", "causa" sin acento. MarkedCopy.tsx linea 105: strong con font-semibold text-[var(--text-primary)] (#3A2418 sobre cuerpo #6D5849), salto de contraste real. Enfasis ya no satura la seccion (~15% del texto). No se vieron regresiones en el resto de la pagina (screenshot leido a 360x7232 reducido; detalle tipografico confirmado en codigo, no a nivel de pixel). Paleta, Baloo 2/Nunito y radios coinciden con FICHA-ARTE. Margen del gate estrecho: usabilidad 36/40 en el umbral exacto.
