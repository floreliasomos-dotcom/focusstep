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
- Fondo: #FBF2E9 · Superficie: #FFFFFF · Texto 1º/2º: #3A2418 / #8C7263
- Acento: #E2703F terracota cálido (SOLO en: CTA, mascota, dato activo, tab activo) ·
  2ª nota: #F2A65A ámbar cálido (badges/detalles secundarios)
- Semánticos: éxito/hecho #45BF9A menta (ÚNICO uso — universal "hecho", nunca ambiguo con el
  acento) · error: por definir en Sesión 5-6 con ícono, nunca solo color (regla daltonismo)
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

## Trazabilidad y vetos
- Ruta de diseño: interpretaciones fieles (referencia parcial + pedido explícito de fusión)
- Protocolo A/B/C: opción elegida = COMBINACIÓN (estructura de A + franja de C + nota-mascota
  de C, sin el anillo de B para no duplicar la mascota) · descartadas: B completa (anillo
  grande — se consideró redundante con la mascota ya presente en el hero) · página comparativa:
  `direcciones-abc.html` (sección "Combinación elegida" al inicio + A/B/C archivadas debajo) ·
  verificado con screenshot en el navegador (fuentes en su clase real, sin emojis, mascota
  coherente, CTA en degradé cálido)
- Tour de la app: PENDIENTE — se construye tras la confirmación final del usuario sobre esta
  combinación recoloreada (`vista-previa-app.html`)
- Paleta derivada de: referencia del usuario (Habitz, paleta base) recalibrada a cálido por
  petición explícita + criterio de la tabla emoción→color del 16 · Dispositivo ownable: mascota
  blob propia
- Registro anti-repetición: paleta terracota/ámbar/menta + par Baloo 2/Nunito — anotado en
  ESTADO.md como vetado para futuros proyectos de este SO
- Modo (claro/oscuro): claro — derivado de la referencia del usuario (Habitz es clara) y del
  nicho (hábitos/bienestar rinde mejor en claro, ver 16 §0.5 regla 3)

## Idioma UI: español (LATAM, tuteo neutro) · Fecha de cierre: PENDIENTE (falta confirmación
final del usuario sobre la combinación recoloreada) · Aprobada por el usuario: PENDIENTE
