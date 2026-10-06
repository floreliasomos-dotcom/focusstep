import { beforeEach, describe, expect, it } from 'vitest';

// Almacenamiento falso: la capa de datos solo usa localStorage/sessionStorage.
function almacen() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    get length() {
      return m.size;
    },
    key: (i: number) => [...m.keys()][i] ?? null,
  };
}

const g = globalThis as unknown as Record<string, unknown>;

function dia(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

beforeEach(() => {
  g.window = {};
  g.localStorage = almacen();
  g.sessionStorage = almacen();
});

describe('marcarHechoHoy', () => {
  it('suma la racha al completar y no duplica el mismo día', async () => {
    const h = await import('@/lib/habitos');
    const [habito] = h.inicializarDatos();
    const a = h.marcarHechoHoy(habito.id);
    expect(a.perfil.rachaActual).toBe(1);
    const b = h.marcarHechoHoy(habito.id);
    expect(b.yaEstaba).toBe(true);
    expect(h.obtenerRegistros()).toHaveLength(1);
  });

  it('gana un pase libre al llegar a 7 días seguidos', async () => {
    const h = await import('@/lib/habitos');
    const [habito] = h.inicializarDatos();
    localStorage.setItem('focusstep_perfil', JSON.stringify({ rachaActual: 6, congeladores: 0, ultimaActividadOn: dia(1), tz: 'America/Bogota' }));
    expect(h.marcarHechoHoy(habito.id).perfil.congeladores).toBe(1);
  });

  it('un pase libre cubre un día perdido sin romper la racha', async () => {
    const h = await import('@/lib/habitos');
    const [habito] = h.inicializarDatos();
    localStorage.setItem('focusstep_perfil', JSON.stringify({ rachaActual: 3, congeladores: 1, ultimaActividadOn: dia(2), tz: 'America/Bogota' }));
    const r = h.marcarHechoHoy(habito.id).perfil;
    expect(r.rachaActual).toBe(4);
    expect(r.congeladores).toBe(0);
  });

  it('tras varios días sin entrar recomienza en 1, sin castigo', async () => {
    const h = await import('@/lib/habitos');
    const [habito] = h.inicializarDatos();
    localStorage.setItem('focusstep_perfil', JSON.stringify({ rachaActual: 9, congeladores: 0, ultimaActividadOn: dia(5), tz: 'America/Bogota' }));
    expect(h.marcarHechoHoy(habito.id).perfil.rachaActual).toBe(1);
  });
});

describe('límite del plan gratis y Reinicio Amigable', () => {
  it('no deja crear más de 3 hábitos activos en el plan gratis', async () => {
    const h = await import('@/lib/habitos');
    h.inicializarDatos();
    const datos = { momentoDia: 'Mi trabajo' as const, color: '#F2A65A' };
    expect(h.crearHabito({ ...datos, nombre: 'Leer 5 minutos' }).ok).toBe(true);
    expect(h.crearHabito({ ...datos, nombre: 'Caminar 10 minutos' }).ok).toBe(true);
    const cuarto = h.crearHabito({ ...datos, nombre: 'Meditar un minuto' });
    expect(cuarto.ok).toBe(false);
  });

  it('rechaza nombres de menos de 2 letras', async () => {
    const h = await import('@/lib/habitos');
    h.inicializarDatos();
    expect(h.crearHabito({ nombre: 'a', momentoDia: 'Mi trabajo', color: '#F2A65A' }).ok).toBe(false);
  });

  it('ofrece el reinicio solo tras 3+ días sin actividad', async () => {
    const h = await import('@/lib/habitos');
    h.inicializarDatos();
    localStorage.setItem('focusstep_perfil', JSON.stringify({ rachaActual: 2, congeladores: 0, ultimaActividadOn: dia(2), tz: 'America/Bogota' }));
    expect(h.necesitaReinicioAmigable()).toBe(false);
    localStorage.setItem('focusstep_perfil', JSON.stringify({ rachaActual: 2, congeladores: 0, ultimaActividadOn: dia(4), tz: 'America/Bogota' }));
    expect(h.necesitaReinicioAmigable()).toBe(true);
    h.marcarReinicioVisto();
    expect(h.necesitaReinicioAmigable()).toBe(false);
  });
});

describe('privacidad', () => {
  it('borrarTodosLosDatos limpia todo lo de FocusStep', async () => {
    const h = await import('@/lib/habitos');
    const a = await import('@/lib/analitica');
    const [habito] = h.inicializarDatos();
    h.marcarHechoHoy(habito.id);
    a.registrarEvento('habito_completado', { racha: 1 });
    h.borrarTodosLosDatos();
    expect((localStorage as unknown as { length: number }).length).toBe(0);
  });
});
