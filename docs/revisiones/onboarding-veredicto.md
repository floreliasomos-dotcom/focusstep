# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [components/funnel/ui.tsx:170, BotonPrimario — usado en TODO el funnel: onboarding, paywall, login] `rounded-[var(--radius-btn)]` referencia un token que NO EXISTE (tokens.css solo define `--radius-button`, nunca `--radius-btn`) → el navegador descarta la declaración de border-radius completa y el CTA primario queda con esquinas cuadradas mientras chips, mascota e íconos usan la familia pill (`--radius-button: 999px`) — rompe la consistencia de forma en el componente MÁS visible de toda la app → cambiar `var(--radius-btn)` por `var(--radius-button)`.
2. [PantallaPregunta, app/onboarding/page.tsx:215-218] El bloque mascota+texto ahora tiene altura fija (`h-40`) pero sigue sin estar anclado al fondo: no hay spacer con `flex-1` entre las opciones y el bloque, así que su posición vertical en pantalla todavía depende de cuántas opciones tenga la pregunta (3 vs 4) — el fix resolvió el cambio de ALTURA del bloque, no el cambio de POSICIÓN → agregar un `<div className="flex-1" />` antes del bloque mascota, o anclarlo con `mt-auto`.
3. [BarraProgreso / atras(), app/onboarding/page.tsx:94-100] Salir desde el paso 0 ahora navega directo a "/" sin ningún aviso — funciona pero es una salida silenciosa del embudo de conversión (no hay diferencia visible entre "volver una pregunta" y "abandonar el onboarding completo"), un usuario puede tocarlo sin querer y perder el progreso sin previo aviso → diferenciar visualmente o con confirmación breve cuando el back del paso 0 implica salir del flujo, no solo retroceder.
4. [Chip, components/funnel/ui.tsx] El atajo de teclado 1-4 fue eliminado por completo junto con el bug — correcto para la seguridad del input, pero deja la heurística de eficiencia/flexibilidad en su piso mínimo (sin ningún atajo ni default para el usuario avanzado) → no bloqueante, pero es la heurística más floja de la pantalla.
5. [PantallaPregunta, opciones] Con 4 opciones (pregunta 1) el bloque de chips ocupa casi toda la altura media de la pantalla y dejaba solo aire entre "Ya casi terminas" y el borde inferior — sensación de desbalance vertical leve, consistente con el defecto 2 (falta un ancla de layout consistente) → mismo fix del punto 2 resuelve ambos.
