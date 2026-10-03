# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-26 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 38/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. [Bajo el CTA "Empezar mis 7 días gratis"] Sigue sin garantía nombrada con plazo cerca del CTA de compra — límite estructural aceptado (FICHA-MERCADO.md aún no tiene el plazo de reembolso verificado con Hotmart, Sesión 6; nombrar uno ahora violaría el gate de integridad fail-closed). No se penaliza como descuido corregible hoy, pero sigue topando la objeción #4 de FICHA-AVATAR.md ("precio por día + garantía + trial") → nombrar la garantía con plazo real en cuanto Hotmart lo confirme.
2. [Cada `PlanCard`, ej. "Anual"] Cada tarjeta muestra el precio en 3 formatos distintos (equivalente mensual "$2.92/mes" arriba, total anual "Se cobra $34.99/año..." al medio, precio diario "Menos de $0.10 al día" abajo) — mejoró vs. la ronda anterior (ya no hay bloque duplicado aparte) pero dentro de la misma card sigue siendo denso para una app que se vende "anti-abrumo" → conservar máximo 2 de los 3 formatos por card (p. ej. mensual + diario, mover el total anual a un tooltip o al resumen del checkout).
3. [Headline, línea 2 "tu trabajo está listo"] El resaltado en acento cubre "tu trabajo", incluyendo el posesivo "tu" — la regla de énfasis pide resaltar solo la palabra clave que vende ("trabajo"), nunca partículas gramaticales → acotar el `<span className="text-[var(--accent)]">` solo a la palabra sustantiva (ej. envolver únicamente `{metaLabel.split(' ').slice(1).join(' ')}` si aplica, o resaltar solo el sustantivo final).
4. [Recorrido completo hero → CTA] El scroll se acortó de forma real (se eliminó la tira de timeline), pero en dispositivos de viewport corto (iPhone SE ~667px, Android gama media compacta) el CTA sigue quedando fuera del primer pantallazo por la suma hero + features + 2 plan cards → en pantallas ≤700px de alto, considerar colapsar el tip de teclado (ya no aporta en touch-only) o reducir el padding vertical del `Bloque` de features.
5. [Estructura DOM de `FunnelShell`] La pantalla completa es un único `div` sin `<main>`/`<header>` semánticos (regla UX #9 del SO) — no es exclusivo de este paywall (patrón compartido con onboarding), pero conviene resolverlo a nivel de componente compartido → envolver el contenido de `FunnelShell` en `<main>` y el bloque superior (X + tip) en `<header>`.
