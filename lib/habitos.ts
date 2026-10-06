// Capa de datos local de FocusStep — Sesión 5 (app interna sin backend todavía).
// Misma FORMA que tendrá en Supabase (ver ESTADO.md → "Los 3 pilares técnicos"), para que
// migrar a Sesión 6 no obligue a reescribir la UI: la UI nunca toca `racha`/`congeladores`
// directo, siempre pasa por `marcarHechoHoy()` — el equivalente local de la RPC
// `marcar_habito_hecho` que hará el servidor.

import { CLAVE_EVENTOS_LOCAL } from './analitica';

export type MomentoDia = 'Mis mañanas' | 'Mi trabajo' | 'Mi descanso';

export interface Habito {
  id: string;
  nombre: string;
  color: string;
  momentoDia: MomentoDia;
  activo: boolean;
  creadoEn: string;
}

export interface RegistroHabito {
  habitoId: string;
  fecha: string; // 'YYYY-MM-DD' en la zona del usuario
  completadoEn: string;
}

export interface Perfil {
  rachaActual: number;
  congeladores: number;
  ultimaActividadOn: string | null;
  tz: string;
}

const CLAVE_HABITOS = 'focusstep_habitos';
const CLAVE_REGISTROS = 'focusstep_registros';
const CLAVE_PERFIL = 'focusstep_perfil';
const CLAVE_DESHACER = 'focusstep_deshacer';
const CLAVE_VERSION = 'focusstep_version';
// Versión del formato de los datos locales: si cambia su forma, aquí se migra en vez de romper lo guardado.
const VERSION_DATOS = 1;

interface Deshacer {
  habitoId: string;
  fecha: string;
  perfilAnterior: Perfil;
}

// Colores de etiqueta por hábito: cálidos y SIN verde menta (el menta es exclusivamente "hecho", FICHA-ARTE.md).
const PALETA_TAGS = ['#F2A65A', '#E8795A', '#B98AA8'] as const; // ámbar, coral, malva

const HABITO_SUGERIDO: Record<MomentoDia, string> = {
  'Mis mañanas': 'Estirar 5 minutos al despertar',
  'Mi trabajo': 'Respirar 1 minuto antes de tu primera reunión',
  'Mi descanso': 'Anotar 1 cosa buena del día antes de dormir',
};

function tzUsuario(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota';
  } catch {
    return 'America/Bogota';
  }
}

export function hoyLocal(tz: string = tzUsuario()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function leer<T>(clave: string, valorDefecto: T): T {
  if (typeof window === 'undefined') return valorDefecto;
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : valorDefecto;
  } catch {
    return valorDefecto;
  }
}

function escribir<T>(clave: string, valor: T): boolean {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false; // almacenamiento no disponible (privado/lleno) — el llamador decide qué avisar
  }
}

export function obtenerHabitos(): Habito[] {
  return leer<Habito[]>(CLAVE_HABITOS, []);
}

export function obtenerRegistros(): RegistroHabito[] {
  return leer<RegistroHabito[]>(CLAVE_REGISTROS, []);
}

export function obtenerPerfil(): Perfil {
  return leer<Perfil>(CLAVE_PERFIL, {
    rachaActual: 0,
    congeladores: 0,
    ultimaActividadOn: null,
    tz: tzUsuario(),
  });
}

function migrarDatos() {
  const guardada = leer<number | null>(CLAVE_VERSION, null);
  if (guardada === VERSION_DATOS) return;
  // v0 → v1: sin cambios de forma; solo se marca la versión. Futuras migraciones van aquí, en orden.
  escribir(CLAVE_VERSION, VERSION_DATOS);
}

// Migra la respuesta del onboarding (sessionStorage) a un hábito real la primera vez que se
// abre la app interna. Si no hay respuestas de onboarding ni hábitos guardados, siembra un
// hábito de ejemplo — la app nunca se enseña vacía (32-DEL-MVP-AL-PRODUCTO.md).
export function inicializarDatos(): Habito[] {
  migrarDatos();
  const existentes = obtenerHabitos();
  if (existentes.length > 0) return existentes;

  let momento: MomentoDia = 'Mis mañanas';
  try {
    const raw = sessionStorage.getItem('focusstep_onboarding');
    if (raw) {
      const r = JSON.parse(raw) as { momento?: MomentoDia };
      if (r.momento) momento = r.momento;
    }
  } catch {
    /* sin respuestas de onboarding — se usa el momento por defecto */
  }

  const habito: Habito = {
    id: crypto.randomUUID(),
    nombre: HABITO_SUGERIDO[momento],
    color: PALETA_TAGS[0],
    momentoDia: momento,
    activo: true,
    creadoEn: new Date().toISOString(),
  };
  const habitos = [habito];
  escribir(CLAVE_HABITOS, habitos);
  return habitos;
}

export function habitoDeHoy(): Habito | null {
  const activos = obtenerHabitos().filter((h) => h.activo);
  return activos[0] ?? null;
}

export function yaCompletadoHoy(habitoId: string): boolean {
  const hoy = hoyLocal();
  return obtenerRegistros().some((r) => r.habitoId === habitoId && r.fecha === hoy);
}

function diferenciaDias(desde: string, hasta: string): number {
  const a = new Date(desde + 'T00:00:00');
  const b = new Date(hasta + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

// Equivalente local de la RPC `marcar_habito_hecho` (SECURITY DEFINER) que hará el servidor
// en Sesión 6 — inserta el registro y recalcula la racha en un solo lugar, nunca desde la UI.
// El perfil ANTERIOR se persiste (CLAVE_DESHACER, no solo en memoria) para que "deshacer" siga
// funcionando aunque la pantalla se remonte entre medias — navegar a otra pestaña y volver con
// la TabBar y regresar rompía el deshacer porque vivía solo en useState (bug real detectado por
// el revisor-visual). `guardado` avisa si el almacenamiento falló en vez de mostrar "hecho" en
// silencio sobre un guardado que no ocurrió (otro defecto real ya corregido).
export function marcarHechoHoy(habitoId: string): { perfil: Perfil; perfilAnterior: Perfil; yaEstaba: boolean; guardado: boolean } {
  const hoy = hoyLocal();
  const registros = obtenerRegistros();
  const perfilAnterior = obtenerPerfil();
  if (registros.some((r) => r.habitoId === habitoId && r.fecha === hoy)) {
    return { perfil: perfilAnterior, perfilAnterior, yaEstaba: true, guardado: true };
  }

  registros.push({ habitoId, fecha: hoy, completadoEn: new Date().toISOString() });
  const guardadoRegistro = escribir(CLAVE_REGISTROS, registros);

  const p = perfilAnterior;
  let nuevaRacha: number;
  let congeladores = p.congeladores;

  if (p.ultimaActividadOn === null) {
    nuevaRacha = 1;
  } else {
    const dias = diferenciaDias(p.ultimaActividadOn, hoy);
    if (dias <= 1) {
      nuevaRacha = p.rachaActual + 1;
    } else {
      const diasPerdidos = dias - 1;
      if (diasPerdidos <= congeladores) {
        congeladores -= diasPerdidos;
        nuevaRacha = p.rachaActual + 1;
      } else {
        nuevaRacha = 1; // Reinicio Amigable: nunca se muestra en rojo, solo se recomienza
      }
    }
  }

  // Pase libre GANADO (no regalado): uno por cada 7 días seguidos, con tope de 2 guardados (24-GAMIFICACION).
  if (nuevaRacha > 0 && nuevaRacha % 7 === 0 && nuevaRacha !== p.rachaActual) {
    congeladores = Math.min(2, congeladores + 1);
  }

  const perfil: Perfil = { ...p, rachaActual: nuevaRacha, congeladores, ultimaActividadOn: hoy };
  const guardadoPerfil = escribir(CLAVE_PERFIL, perfil);
  escribir(CLAVE_DESHACER, { habitoId, fecha: hoy, perfilAnterior } satisfies Deshacer);
  return { perfil, perfilAnterior, yaEstaba: false, guardado: guardadoRegistro && guardadoPerfil };
}

// El deshacer solo es válido para EL MISMO hábito y EL MISMO día en que se completó — pasado
// eso (día siguiente, u otro hábito) no hay nada que deshacer.
export function obtenerDeshacerDisponible(habitoId: string): Perfil | null {
  const d = leer<Deshacer | null>(CLAVE_DESHACER, null);
  if (!d || d.habitoId !== habitoId || d.fecha !== hoyLocal()) return null;
  return d.perfilAnterior;
}

// Deshace un toque accidental de "Completar" — quita el registro de hoy y restaura el perfil
// exacto de antes (racha/congeladores), en vez de recalcular hacia atrás.
export function desmarcarHechoHoy(habitoId: string, perfilAnterior: Perfil) {
  const hoy = hoyLocal();
  const registros = obtenerRegistros().filter((r) => !(r.habitoId === habitoId && r.fecha === hoy));
  escribir(CLAVE_REGISTROS, registros);
  escribir(CLAVE_PERFIL, perfilAnterior);
  escribir(CLAVE_DESHACER, null);
}

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export interface DiaSemana {
  letra: string;
  fecha: string;
  hecho: boolean;
  esHoy: boolean;
  esFuturo: boolean;
}

// Semana de lunes a domingo que contiene "hoy", con qué días ya se completó el hábito —
// la representación de "% de cumplimiento semanal" (nunca racha lineal punitiva, Sesión 1).
export function semanaDeHoy(habitoId: string): { dias: DiaSemana[]; completados: number } {
  const hoy = hoyLocal();
  const registros = new Set(obtenerRegistros().filter((r) => r.habitoId === habitoId).map((r) => r.fecha));
  const hoyDate = new Date(hoy + 'T00:00:00');
  const diaSemanaISO = (hoyDate.getDay() + 6) % 7; // 0 = lunes
  const lunes = new Date(hoyDate);
  lunes.setDate(hoyDate.getDate() - diaSemanaISO);

  const dias: DiaSemana[] = DIAS_SEMANA.map((letra, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    const fecha = new Intl.DateTimeFormat('en-CA').format(d);
    return {
      letra,
      fecha,
      hecho: registros.has(fecha),
      esHoy: fecha === hoy,
      esFuturo: fecha > hoy,
    };
  });

  return { dias, completados: dias.filter((d) => d.hecho).length };
}

// ───────────────────────── Gestión de hábitos (pantalla /habitos) ─────────────────────────
// Plan gratis: máx. 3 hábitos ACTIVOS; con plan de pago (trial/anual/mensual) no hay límite.
// En Sesión 6 el límite se valida también en servidor (RPC); aquí es el mismo contrato en local.

export const LIMITE_GRATIS = 3;
export const COLORES_HABITO = [
  { valor: PALETA_TAGS[0], nombre: 'Ámbar' },
  { valor: PALETA_TAGS[1], nombre: 'Coral' },
  { valor: PALETA_TAGS[2], nombre: 'Malva' },
] as const;

export function esPro(): boolean {
  try {
    const plan = sessionStorage.getItem('focusstep_plan_elegido');
    return plan === 'anual' || plan === 'mensual';
  } catch {
    return false;
  }
}

export function contarActivos(habitos: Habito[] = obtenerHabitos()): number {
  return habitos.filter((h) => h.activo).length;
}

export function puedeActivarOtro(habitos: Habito[] = obtenerHabitos()): boolean {
  return esPro() || contarActivos(habitos) < LIMITE_GRATIS;
}

export type ResultadoHabito = { ok: true; habitos: Habito[] } | { ok: false; error: 'limite' | 'guardado' | 'nombre' };

export function crearHabito(datos: { nombre: string; momentoDia: MomentoDia; color: string }): ResultadoHabito {
  const nombre = datos.nombre.trim();
  if (nombre.length < 2) return { ok: false, error: 'nombre' };
  const habitos = obtenerHabitos();
  if (!puedeActivarOtro(habitos)) return { ok: false, error: 'limite' };
  const nuevo: Habito = {
    id: crypto.randomUUID(),
    nombre: nombre.slice(0, 60),
    color: datos.color,
    momentoDia: datos.momentoDia,
    activo: true,
    creadoEn: new Date().toISOString(),
  };
  const lista = [...habitos, nuevo];
  return escribir(CLAVE_HABITOS, lista) ? { ok: true, habitos: lista } : { ok: false, error: 'guardado' };
}

export function actualizarHabito(
  id: string,
  cambios: Partial<Pick<Habito, 'nombre' | 'momentoDia' | 'color'>>,
): ResultadoHabito {
  if (cambios.nombre !== undefined && cambios.nombre.trim().length < 2) return { ok: false, error: 'nombre' };
  const lista = obtenerHabitos().map((h) =>
    h.id === id ? { ...h, ...cambios, nombre: (cambios.nombre ?? h.nombre).trim().slice(0, 60) } : h,
  );
  return escribir(CLAVE_HABITOS, lista) ? { ok: true, habitos: lista } : { ok: false, error: 'guardado' };
}

// Archivar nunca borra: el historial de ese hábito se conserva y se puede reactivar (si hay cupo).
export function alternarActivo(id: string): ResultadoHabito {
  const actuales = obtenerHabitos();
  const objetivo = actuales.find((h) => h.id === id);
  if (!objetivo) return { ok: true, habitos: actuales };
  if (!objetivo.activo && !puedeActivarOtro(actuales)) return { ok: false, error: 'limite' };
  const lista = actuales.map((h) => (h.id === id ? { ...h, activo: !h.activo } : h));
  return escribir(CLAVE_HABITOS, lista) ? { ok: true, habitos: lista } : { ok: false, error: 'guardado' };
}

// "Un Solo Foco": /hoy muestra el primer hábito ACTIVO de la lista; elegir el foco = ponerlo primero.
export function ponerComoFoco(id: string): ResultadoHabito {
  const actuales = obtenerHabitos();
  const objetivo = actuales.find((h) => h.id === id && h.activo);
  if (!objetivo) return { ok: true, habitos: actuales };
  const lista = [objetivo, ...actuales.filter((h) => h.id !== id)];
  return escribir(CLAVE_HABITOS, lista) ? { ok: true, habitos: lista } : { ok: false, error: 'guardado' };
}

// ───────────────────────── Historial (pantalla /progreso) ─────────────────────────
// Un día cuenta si se completó AL MENOS un hábito ese día. Sin lenguaje punitivo: es un conteo
// de días cumplidos por semana, nunca "días perdidos".

export interface SemanaHistorial {
  inicio: string; // lunes, 'YYYY-MM-DD'
  etiqueta: string; // "12 oct"
  dias: number; // 0-7
  esActual: boolean;
}

function lunesDe(fecha: string): string {
  const d = new Date(fecha + 'T00:00:00');
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return new Intl.DateTimeFormat('en-CA').format(d);
}

export function historialSemanas(cantidad = 8): { semanas: SemanaHistorial[]; totalDias: number; mejorSemana: number } {
  const fechas = new Set(obtenerRegistros().map((r) => r.fecha));
  const porSemana = new Map<string, number>();
  fechas.forEach((f) => {
    const l = lunesDe(f);
    porSemana.set(l, (porSemana.get(l) ?? 0) + 1);
  });
  const lunesActual = lunesDe(hoyLocal());
  const semanas: SemanaHistorial[] = [];
  for (let i = cantidad - 1; i >= 0; i--) {
    const d = new Date(lunesActual + 'T00:00:00');
    d.setDate(d.getDate() - 7 * i);
    const inicio = new Intl.DateTimeFormat('en-CA').format(d);
    semanas.push({
      inicio,
      etiqueta: new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(d).replace('.', ''),
      dias: porSemana.get(inicio) ?? 0,
      esActual: i === 0,
    });
  }
  const mejorSemana = Math.max(0, ...Array.from(porSemana.values()));
  return { semanas, totalDias: fechas.size, mejorSemana };
}

// ───────────────────────── Datos de la persona (pantalla /perfil) ─────────────────────────
// Derechos de privacidad prometidos en /privacidad, ejecutables hoy sobre los datos locales.

export function exportarDatos() {
  return {
    exportadoEn: new Date().toISOString(),
    version: VERSION_DATOS,
    habitos: obtenerHabitos(),
    registros: obtenerRegistros(),
    perfil: obtenerPerfil(),
  };
}

export function borrarTodosLosDatos(): void {
  try {
    [CLAVE_HABITOS, CLAVE_REGISTROS, CLAVE_PERFIL, CLAVE_DESHACER, CLAVE_VERSION, CLAVE_REINICIO_VISTO, CLAVE_EVENTOS_LOCAL].forEach((c) => localStorage.removeItem(c));
    ['focusstep_onboarding', 'focusstep_plan_elegido'].forEach((c) => sessionStorage.removeItem(c));
  } catch {
    /* almacenamiento no disponible: no hay nada que borrar */
  }
}

export function planActualEtiqueta(): { etiqueta: string; esDePago: boolean } {
  try {
    const plan = sessionStorage.getItem('focusstep_plan_elegido');
    if (plan === 'anual') return { etiqueta: 'Prueba de 7 días · plan anual', esDePago: true };
    if (plan === 'mensual') return { etiqueta: 'Prueba de 7 días · plan mensual', esDePago: true };
  } catch {
    /* sin sessionStorage: se trata como plan gratis */
  }
  return { etiqueta: 'Plan gratis', esDePago: false };
}

// ───────────────────────── Reinicio Amigable ─────────────────────────
// Tras 3+ días sin dar un paso, /hoy recibe a la persona con una bienvenida sin culpa (momento M6 de
// 56-MOMENTOS-EMOCIONALES.md): nada en rojo, nada que "reiniciar". Se muestra una vez por día de regreso.

const CLAVE_REINICIO_VISTO = 'focusstep_reinicio_visto';
export const DIAS_PARA_REINICIO = 3;

export function necesitaReinicioAmigable(): boolean {
  const p = obtenerPerfil();
  if (p.ultimaActividadOn === null) return false;
  const hoy = hoyLocal();
  if (leer<string | null>(CLAVE_REINICIO_VISTO, null) === hoy) return false;
  return diferenciaDias(p.ultimaActividadOn, hoy) >= DIAS_PARA_REINICIO;
}

export function marcarReinicioVisto(): void {
  escribir(CLAVE_REINICIO_VISTO, hoyLocal());
}
