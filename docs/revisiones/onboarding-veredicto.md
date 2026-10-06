# VEREDICTO revisor-visual — onboarding (pantalla de preguntas)
Fecha: 2026-10-04 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) P3 con "Otra cosa" abierta (onboarding-p3-otra-375.png): al aparecer scrollbar el ancho útil baja y la 1ª opción vuelve a partirse en 2 líneas; el pie "Tu avance se guarda solo" queda pegado al borde inferior (y~806 de 812). Fix: acortar el copy a "Las rachas rotas me hacían sentir mal" -> "Las rachas rotas me hacían sentir mal" con px-3 + text-[15px], o reducir el icono a 32px. (2) Texto de error/pie a 12px sobre fondo crema: legibilidad justa; subir a 13px o sumar peso 600. (3) Franja mascota+ayuda a 16px compite en peso con las opciones (mismo tamaño y casi mismo contraste): bajar la ayuda a 14px/ tono terciario para que el N2 (título) y N3 (opciones) manden. (4) En P3 la 1ª opción llega a ~12px del borde derecho de la tarjeta: padding derecho casi nulo, desencaje óptico leve. (5) Movimiento e identidad sin novedades; mascota clara y círculos terracota correctos con FICHA-ARTE (Baloo 2 + Nunito, radio 22px, #BD5227).
Verificado en código: aria-live, aria-label, atajos de teclado 1-N, candado anti doble toque, guardado por respuesta, volver/cerrar visibles, reduced-motion presente.
