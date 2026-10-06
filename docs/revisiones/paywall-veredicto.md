# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-04 13:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: (1) Margen minimo sobre el gate en las tres rubricas: cualquier regresion lo tumba. (2) Promesa "te avisamos antes del cobro" sin mecanismo en codigo (solo mock a /entrar): implementar el aviso o quitar la frase antes de cobrar de verdad (pendiente obligatorio Sesion 6); sin garantia nombrada con plazo cerca del CTA (aceptado por regla hasta verificar Hotmart). (3) Titular con acento en "tu trabajo": el articulo "tu" no debe resaltarse, dejar solo "trabajo" (span en h1 de app/paywall/page.tsx). (4) Tarjetas de plan con 3 formatos de precio (precio/mes, linea de cobro, precio por dia): unificar a 2 lineas con el mismo patron. (5) CTA en y~790 del lienzo, bajo el pliegue a 667px de alto, y shell sin <main>: compactar beneficios o CTA sticky; envolver en <main>. Correccion verificada: la linea de cobro de las tarjetas usa terracota oscurecido (color-mix 75% acento + 25% texto primario) en semibold, visiblemente mas oscuro en el screenshot, contraste AA cumplido. Verificado en codigo: error con var(--error)+AlertCircle y aria-live; Enter ignorado en BUTTON/A; CTA habilitado por defecto, 48px+, whileTap; stagger, conteo de precio y useReducedMotion presentes; sin celebracion de hito (no aplica al paywall). Paleta terracota + Baloo 2/Nunito + blob coincide con FICHA-ARTE; no es clon de los ejemplos vetados.
