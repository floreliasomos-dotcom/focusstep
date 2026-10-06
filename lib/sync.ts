'use client';

// Sincronización entre el dispositivo (localStorage) y Supabase. La UI sigue leyendo local (rápido,
// funciona sin conexión); la nube es la copia de respaldo y lo que permite ver los hábitos en otro
// dispositivo. Reglas:
//  - Al iniciar sesión: si la cuenta ya tiene hábitos en la nube, ganan esos; si no, se sube lo local.
//  - Cada cambio local se sube con un pequeño retraso (varios toques seguidos = 1 subida).
//  - El plan (gratis/pro) NUNCA se escribe desde aquí: solo lo cambia el servidor (migración 0002).

import { crearClienteNavegador } from '@/lib/supabase/client';
import {
  type Habito,
  type Perfil,
  type RegistroHabito,
  obtenerHabitos,
  obtenerPerfil,
  obtenerRegistros,
  observarCambios,
  reemplazarDatosLocales,
} from '@/lib/habitos';

const CLAVE_DUENO = 'focusstep_usuario';
const DIAS_A_SUBIR = 35;
let temporizador: ReturnType<typeof setTimeout> | null = null;

function fechaLimite(): string {
  const d = new Date();
  d.setDate(d.getDate() - DIAS_A_SUBIR);
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

async function subir(userId: string, todo = false): Promise<boolean> {
  const supabase = crearClienteNavegador();
  const habitos = obtenerHabitos();
  const perfil = obtenerPerfil();
  const limite = fechaLimite();
  const registros = todo ? obtenerRegistros() : obtenerRegistros().filter((r) => r.fecha >= limite);

  // Primero el perfil: las demás tablas apuntan al usuario, no al perfil, pero el orden es predecible.
  const p = await supabase.from('profiles').upsert({
    id: userId,
    racha_actual: perfil.rachaActual,
    congeladores: perfil.congeladores,
    ultima_actividad_on: perfil.ultimaActividadOn,
    tz: perfil.tz,
  });
  if (p.error) return false;

  if (habitos.length > 0) {
    const h = await supabase.from('habits').upsert(
      habitos.map((x, i) => ({
        id: x.id,
        user_id: userId,
        nombre: x.nombre,
        color: x.color,
        momento_dia: x.momentoDia,
        activo: x.activo,
        creado_en: x.creadoEn,
        orden: i,
      })),
    );
    if (h.error) return false;
  }
  if (registros.length > 0) {
    const l = await supabase.from('habit_logs').upsert(
      registros.map((r) => ({ habit_id: r.habitoId, user_id: userId, fecha: r.fecha, completado_en: r.completadoEn })),
      { onConflict: 'habit_id,fecha' },
    );
    if (l.error) return false;
  }
  return true;
}

// Se llama una vez justo después de entrar. Devuelve false si algo falló (la app sigue en local).
export async function sincronizarAlEntrar(): Promise<boolean> {
  try {
    const supabase = crearClienteNavegador();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return false;

    // Otra cuenta usó antes este dispositivo: sus datos locales no se mezclan con los de esta.
    const dueno = localStorage.getItem(CLAVE_DUENO);
    if (dueno && dueno !== user.id) {
      reemplazarDatosLocales({ habitos: [], registros: [], perfil: { rachaActual: 0, congeladores: 0, ultimaActividadOn: null, tz: obtenerPerfil().tz } });
    }
    localStorage.setItem(CLAVE_DUENO, user.id);

    const { data: remotos, error } = await supabase.from('habits').select('*').eq('user_id', user.id).order('orden');
    if (error) return false;

    if (remotos && remotos.length > 0) {
      const habitos: Habito[] = remotos.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        color: r.color,
        momentoDia: r.momento_dia,
        activo: r.activo,
        creadoEn: r.creado_en,
      }));
      const { data: logs, error: errLogs } = await supabase.from('habit_logs').select('habit_id, fecha, completado_en').eq('user_id', user.id);
      if (errLogs) return false;
      const registros: RegistroHabito[] = (logs ?? []).map((l) => ({ habitoId: l.habit_id, fecha: l.fecha, completadoEn: l.completado_en }));
      const { data: pr } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      const perfil: Perfil = pr
        ? { rachaActual: pr.racha_actual, congeladores: pr.congeladores, ultimaActividadOn: pr.ultima_actividad_on, tz: pr.tz }
        : obtenerPerfil();
      reemplazarDatosLocales({ habitos, registros, perfil });
      return true;
    }
    // La cuenta es nueva en la nube: se sube lo que ya hizo en este dispositivo.
    return await subir(user.id, true);
  } catch {
    return false;
  }
}

// Engancha la subida automática a cada cambio local. Devuelve la función para desengancharla.
export function iniciarSubidaAutomatica(): () => void {
  const supabase = crearClienteNavegador();
  observarCambios(() => {
    if (temporizador) clearTimeout(temporizador);
    temporizador = setTimeout(async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) await subir(data.user.id);
    }, 1200);
  });
  return () => {
    observarCambios(null);
    if (temporizador) clearTimeout(temporizador);
  };
}

// Derecho a borrar: elimina los datos de la cuenta en la nube (los registros caen en cascada).
// Borrar la CUENTA de acceso en sí requiere el servidor (Sesión 6, con la clave secreta).
export async function borrarDatosEnLaNube(): Promise<boolean> {
  try {
    const supabase = crearClienteNavegador();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return true;
    const a = await supabase.from('habits').delete().eq('user_id', data.user.id);
    const b = await supabase.from('profiles').delete().eq('id', data.user.id);
    localStorage.removeItem(CLAVE_DUENO);
    return !a.error && !b.error;
  } catch {
    return false;
  }
}

export async function cerrarSesion(): Promise<void> {
  try {
    await crearClienteNavegador().auth.signOut();
  } catch {
    /* sin conexión: la cookie se limpia al próximo ingreso */
  }
}
