# FICHA DE DIRECCIÓN DE ARTE — FocusStep

## Referencia del usuario (CONTRATO)
- ¿Hay imagen(es) de referencia?: SÍ → screenshot de la app "Habitz" (pantallas de onboarding,
  selección de objetivo, humor, calendario, perfil), dada en el chat de esta sesión.
- Extracción (mirando la imagen):
  - Modo: claro · Fondo (wrapper): lavanda pastel · Superficie/card: blanco
  - Texto 1º/2º: gris casi negro / gris medio
  - Acento(s): púrpura (CTA/teclado) — sustituido después por decisión explícita del usuario
    (ver "Brand kit final") · coral y menta en mascotas/tags (SÍ se conservan)
  - Display: geométrica redondeada (candidatas: Quicksand, Nunito, Baloo 2, Poppins Rounded)
  - Radio: cards ~20-24px, botones full pill · Espaciado: aireado · Sombras: ninguna/sutil
  - Bordes: no — color-block plano
  - Detalle firma a replicar: mascotas "blob" (forma de ameba) con carita simple de 2 puntos+línea
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna (la referencia no usa neón/glass/oscuro)
- ⚠️ El usuario pidió explícitamente NO clonar solo esta referencia: investigar y fusionar con
  otros líderes del nicho (ver siguiente sección) — por eso el protocolo aplicado es
  INTERPRETACIONES FIELES (3 opciones), no réplica fiel única.

## Identidad derivada (fusión con líderes, sobre la base de la referencia)
- TABLA DE LÍDERES: Habitz (paleta cálida + mascota blob — la ANCLA) · Streaks (minimalismo
  extremo de la pantalla Home/Un Solo Foco — una tarjeta, un botón, cero desorden) · Finch
  (calidez emocional del mecanismo mascota — SIN heredar su sobrecarga de opciones/settings)
- Combinación tipográfica probada usada: Baloo 2 (display) + Nunito (body) — fila de Duolingo
  ("Feather Bold redondeada → Nunito/Baloo 2") en la tabla de líderes del 16 · validada: SÍ
- Arquetipo: Cuidador/Inocente · Mundo del sujeto: micro-hábitos de bajo compromiso, un solo
  paso, sin listas — el "blob" como personaje que acompaña, no que juzga
- Dispositivo ownable: la mascota blob reacciona con un gesto propio de bienvenida en el
  "Reinicio Amigable" (no disponible en ningún líder investigado) · Paleta base tomada de Habitz

## Personalidad compilada
- 3 adjetivos de personalidad: cálido, acompañante, sin culpa
- Compilación: spring suave con overshoot mínimo (cálido, no agresivo) · duración base ~280ms ·
  exclamaciones máx 1/pantalla (la frase motivacional) · celebración nivel medio (animación al
  completar, sin fuegos artificiales) · radio tendencial 20-24px

## Brand kit final
- Fondo: #FBF2E9 · Superficie: #FFFFFF · Texto 1º/2º/3º: #3A2418 / #6D5849 / #75604F
- Acento: #BD5227 terracota cálido — AJUSTADO desde el #E2703F del tour (mirando la pantalla
  se ve casi igual, pero #E2703F daba solo 3.17:1 de contraste con texto blanco encima, por
  debajo del mínimo AA de 4.5:1; #BD5227 da 4.77:1). Mismo hue, un poco más profundo — el
  cambio es imperceptible a simple vista pero SÍ importa para accesibilidad y para que el
  texto sobre los botones se lea bien. Ver verificación en "Contraste AA" abajo.
  Uso: SOLO en CTA, mascota, dato activo, tab activo · 2ª nota: #F2A65A ámbar cálido
  (badges/detalles — NUNCA con texto encima, no pasa AA)
- Semánticos: éxito/hecho #45BF9A menta (ÚNICO uso — universal "hecho", nunca ambiguo con el
  acento) · error #B3261E rojo cálido (definido en Sesión 5 al construir `/hoy` — 6.5:1 con
  texto blanco, 5.9:1 sobre el fondo; SIEMPRE con ícono, nunca solo color, regla daltonismo)
- Display: Baloo 2 (pesos 600/700/800) · Body: Nunito (pesos 400/600/700)
- Radio: 22px cards / pill botones · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: mascota blob (SVG/CSS propio, sin assets de terceros) — receta en
  `direcciones-abc.html` (clase `.blob`)
- Motion signature: ease-out suave, sin bounce agresivo · stagger ~60ms entre cards

## Cambio de color respecto a la referencia (decisión explícita del usuario + criterio del agente)
- El usuario pidió una paleta CÁLIDA, con la mejor opción para conversión/acción. Se cambió el
  acento de púrpura (Habitz original) a terracota cálido (#E2703F).
- Justificación (16 PASO 0.5, tabla emoción→color): el avatar de FocusStep ("profesional/mujer
  trabajadora agotada que busca calma") mapea EXACTAMENTE a la fila "Femenina, bienestar, llega
  agotada, busca calma → Cuidador/Inocente → durazno/coral, cálida, saturación media-baja" — no
  es una preferencia estética suelta, es la paleta que la propia tabla de este SO indica para
  este avatar.
- Matiz cultural LATAM (16): naranja/terracota se lee cercano y cálido, nunca corporativo-frío;
  además contrasta más contra el fondo claro que el púrpura, lo que ayuda al CTA a destacar.
- El púrpura/índigo es, adicionalmente, el acento por defecto más repetido en apps hechas con
  IA — moverse a terracota también aleja a FocusStep de ese look genérico.
- El verde-menta se reserva EXCLUSIVAMENTE para el estado "hecho" (nunca decorativo) — refuerzo
  de reconocimiento consistente (BJ Fogg: un color de éxito fijo motiva más que una cifra).

## Contraste AA (verificado con fórmula WCAG, no a ojo)
- Texto 1º #3A2418 vs fondo #FBF2E9: 13.1:1 · vs superficie #FFFFFF: 14.5:1 → pasa sobrado
- Texto 2º #6D5849 vs fondo: 6.0:1 · vs superficie: 6.7:1 · vs hundido #F3E3D3: 5.3:1 → pasa
- Texto 3º #75604F vs fondo: 5.4:1 · vs superficie: 5.9:1 · vs hundido: 4.7:1 → pasa
- Acento #BD5227 con texto blanco encima (botones): 4.8:1 → pasa (mínimo 4.5:1)
- Acento vs fondo (uso como ícono/dato, umbral UI 3:1): 4.3:1 → pasa sobrado

## Cambios pedidos por el usuario (2026-10)
- Íconos-azulejo de colores (estilo "Popular Sessions") probados en el cuestionario y DESCARTADOS por
  el usuario tras 4 rondas de revisión (35→34→33→30/40): las opciones vuelven al círculo terracota
  con glifo de 18px (la versión LISTA 38/40). Las 6 caritas de ánimo también quedaron fuera.
- Mascota más clara (se conserva): cuerpo `--mascota` = terracota mezclado 58% con blanco
  (≈ #D99B82), en vez del terracota pleno. Un solo token, aplicado en `Mascota`
  (`components/funnel/ui.tsx`) → cambia en onboarding, paywall, Hoy y pantallas "próximamente".
  Estado "contenta" sigue en menta.


## Color por hábito (ajuste pedido por el usuario tras ver el tour)
- El usuario preguntó si cada SECCIÓN de la app podía tener un color distinto. Se recomendó en
  cambio color por HÁBITO (no por sección): mantiene el CTA, la mascota y la barra de navegación
  siempre en terracota (consistencia de marca — "esto es lo que se toca"), y cada uno de los
  hasta 3 hábitos activos lleva un tag/etiqueta de color propio (ej. coral, menta, ámbar) sobre
  su tarjeta. El usuario eligió esta opción (1) sobre recolorear secciones completas (2).
- Verificado en `vista-previa-app.html` (V1 Home): tag "Rutina de mañana" en ámbar, CTA y
  mascota siguen en terracota.

## Trazabilidad y vetos
- Ruta de diseño: interpretaciones fieles (referencia parcial + pedido explícito de fusión)
- Protocolo A/B/C: opción elegida = COMBINACIÓN (estructura de A + franja de C + nota-mascota
  de C, sin el anillo de B para no duplicar la mascota) · descartadas: B completa (anillo
  grande — se consideró redundante con la mascota ya presente en el hero) · página comparativa:
  `direcciones-abc.html` (sección "Combinación elegida" al inicio + A/B/C archivadas debajo) ·
  verificado con screenshot en el navegador (fuentes en su clase real, sin emojis, mascota
  coherente, CTA en degradé cálido)
- Tour de la app: `vista-previa-app.html` (5 vistas: Home con color-por-hábito, onboarding,
  paywall, Reinicio Amigable, Modo Día Difícil) · aprobado por el usuario: SÍ (2026-09-21,
  "me encanta — sigamos con este estilo", tras el ajuste de color por hábito)
- Paleta derivada de: referencia del usuario (Habitz, paleta base) recalibrada a cálido por
  petición explícita + criterio de la tabla emoción→color del 16 · Dispositivo ownable: mascota
  blob propia
- Registro anti-repetición: paleta terracota/ámbar/menta + par Baloo 2/Nunito — anotado en
  ESTADO.md como vetado para futuros proyectos de este SO
- Modo (claro/oscuro): claro — derivado de la referencia del usuario (Habitz es clara) y del
  nicho (hábitos/bienestar rinde mejor en claro, ver 16 §0.5 regla 3)

## Idioma UI: español (LATAM, tuteo neutro) · Fecha de cierre: 2026-09-21 · Aprobada por el
usuario: SÍ — cosa juzgada desde aquí (no se renegocia pantalla a pantalla)
