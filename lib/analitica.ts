// Medición del camino de venta y del hábito. HOY solo guarda los últimos eventos en este
// dispositivo (cero terceros, regla "nunca" del producto); en Sesión 6 `enviar()` los manda a
// nuestra propia tabla `events` en Supabase. Nunca se registra texto libre del usuario.

const CLAVE_EVENTOS = 'focusstep_eventos';
const MAXIMO = 200;

export type EventoNombre =
  | 'onboarding_completado'
  | 'paywall_visto'
  | 'plan_elegido'
  | 'plan_gratis_elegido'
  | 'habito_completado'
  | 'reinicio_amigable_aceptado';

interface Evento {
  nombre: EventoNombre;
  props: Record<string, string | number | boolean>;
  en: string;
}

export function registrarEvento(nombre: EventoNombre, props: Evento['props'] = {}): void {
  try {
    const previos: Evento[] = JSON.parse(localStorage.getItem(CLAVE_EVENTOS) ?? '[]');
    previos.push({ nombre, props, en: new Date().toISOString() });
    localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(previos.slice(-MAXIMO)));
  } catch {
    /* sin almacenamiento: medir nunca debe romper la app */
  }
}

export const CLAVE_EVENTOS_LOCAL = CLAVE_EVENTOS;
