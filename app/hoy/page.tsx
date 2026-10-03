'use client';

// M0 — El ritual diario ("Un Solo Foco"), la pantalla más vista de la app (56-MOMENTOS-
// EMOCIONALES.md). Una de las 4 pantallas del dinero: pasa por el mismo gate del revisor-visual
// que landing/onboarding/paywall. Composición heredada del tour aprobado por el usuario
// (vista-previa-app.html, V1 Home) — aquí con datos y lógica reales sobre localStorage
// (lib/habitos.ts), sin backend todavía (Sesión 6 lo conecta a Supabase).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Undo2, Snowflake, ChevronRight, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/app/AppShell';
import { BotonPrimario, Mascota } from '@/components/funnel/ui';
import {
  type Habito,
  type DiaSemana,
  type Perfil,
  inicializarDatos,
  obtenerPerfil,
  obtenerDeshacerDisponible,
  yaCompletadoHoy,
  marcarHechoHoy,
  desmarcarHechoHoy,
  semanaDeHoy,
} from '@/lib/habitos';

// Frases del mecanismo (la mascota) — rotan por día para que la pantalla no se sienta idéntica
// cada vez. Voz derivada de FICHA-ARTE.md (cálido, acompañante, sin culpa) — nunca genéricas.
const FRASES_MASCOTA = [
  'Un paso pequeño hoy también cuenta.',
  'No hace falta un gran día — solo este paso.',
  'Estás aquí de nuevo. Eso ya es algo.',
  'Un mal día no borra los buenos que vienen.',
  'Hoy no es sobre ser perfecta, es sobre seguir.',
];

function saludoDelMomento(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function fraseDelDia(fecha: string): string {
  let hash = 0;
  for (const c of fecha) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return FRASES_MASCOTA[hash % FRASES_MASCOTA.length];
}

// Conteo animado (mismo patrón que el paywall) — respeta prefers-reduced-motion.
function useConteo(valor: number, reduce: boolean | null): number {
  const [n, setN] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) {
      setN(valor);
      return;
    }
    let frame: number;
    const inicio = performance.now();
    const duracion = 500;
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      setN(Math.round(valor * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, reduce]);
  return n;
}

export default function Hoy() {
  const reduce = useReducedMotion();
  const [habito, setHabito] = useState<Habito | null | undefined>(undefined);
  const [completado, setCompletado] = useState(false);
  const [semana, setSemana] = useState<{ dias: DiaSemana[]; completados: number }>({ dias: [], completados: 0 });
  const [modoDificil, setModoDificil] = useState(false);
  const [perfilAnterior, setPerfilAnterior] = useState<Perfil | null>(null);
  const [congeladores, setCongeladores] = useState(0);
  const [racha, setRacha] = useState(0);
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    const habitos = inicializarDatos();
    const actual = habitos.find((h) => h.activo) ?? null;
    setHabito(actual);
    const perfil = obtenerPerfil();
    setCongeladores(perfil.congeladores);
    setRacha(perfil.rachaActual);
    if (actual) {
      const hechoHoy = yaCompletadoHoy(actual.id);
      setCompletado(hechoHoy);
      setSemana(semanaDeHoy(actual.id));
      // El deshacer solo puede ofrecerse si sigue disponible su snapshot de hoy — vivir solo
      // en useState se perdía al remontar (volver de otra pestaña), dejando el botón visible
      // pero sin efecto (bug real detectado por el revisor-visual).
      if (hechoHoy) setPerfilAnterior(obtenerDeshacerDisponible(actual.id));
    }
  }, []);

  function completar() {
    if (!habito || completado) return;
    const { perfil, perfilAnterior: anterior, guardado } = marcarHechoHoy(habito.id);
    if (!guardado) {
      setErrorGuardado(true);
      return;
    }
    setErrorGuardado(false);
    setPerfilAnterior(anterior);
    setCongeladores(perfil.congeladores);
    setRacha(perfil.rachaActual);
    setCompletado(true);
    setSemana(semanaDeHoy(habito.id));
  }

  function deshacer() {
    if (!habito || !perfilAnterior) return;
    desmarcarHechoHoy(habito.id, perfilAnterior);
    setCongeladores(perfilAnterior.congeladores);
    setRacha(perfilAnterior.rachaActual);
    setPerfilAnterior(null);
    setCompletado(false);
    setSemana(semanaDeHoy(habito.id));
  }

  const completadosMostrados = useConteo(semana.completados, reduce);
  const circunferencia = 2 * Math.PI * 18;

  if (habito === undefined) {
    // Primer render, antes de leer localStorage — un esqueleto real dentro del mismo shell
    // (con TabBar), nunca una pantalla en blanco (defecto real detectado por el revisor-visual).
    return (
      <AppShell>
        <div className="h-6 w-40 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]" />
        <div className="mt-4 h-40 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
      </AppShell>
    );
  }

  const hoy = semana.dias.find((d) => d.esHoy);
  const frase = hoy ? fraseDelDia(hoy.fecha) : FRASES_MASCOTA[0];

  return (
    <AppShell>
      <h1 className="text-balance text-[16px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        Hola de nuevo — {saludoDelMomento().toLowerCase()}
      </h1>

      {!habito ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Mascota size={56} />
          <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">
            Todavía no tienes un hábito activo. Empieza con uno para ver tu ritual de hoy.
          </p>
          <div className="w-full">
            <Link href="/habitos">
              <BotonPrimario>Crear mi primer hábito</BotonPrimario>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.3 }}
            className="relative rounded-[var(--radius-card)] border border-transparent p-4"
            style={{
              background:
                'linear-gradient(var(--surface), var(--surface)) padding-box, ' +
                `linear-gradient(135deg, color-mix(in oklab, ${habito.color} 45%, transparent), transparent 60%) border-box`,
            }}
          >
            <motion.span
              className="absolute -top-4 right-3"
              animate={completado && !reduce ? { scale: [1, 1.25, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Mascota size={38} contenta={completado} />
            </motion.span>
            <span
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] px-3 py-1 text-[12px] font-bold"
              style={{ color: habito.color, background: `color-mix(in oklab, ${habito.color} 14%, transparent)` }}
            >
              <span className="size-2 rounded-full" style={{ background: habito.color }} />
              {habito.momentoDia === 'Mis mañanas' ? 'Rutina de mañana' : habito.momentoDia === 'Mi trabajo' ? 'Rutina de trabajo' : 'Rutina de descanso'}
            </span>
            <p className="mt-2 text-[12px] font-bold text-[var(--text-secondary)]">
              {modoDificil ? 'Tu versión mínima de hoy' : 'Tu único paso de hoy'}
            </p>
            <p className="text-[24px] font-bold leading-[1.2] [font-family:var(--font-display)]">
              {modoDificil ? `${habito.nombre} — solo un poco cuenta` : habito.nombre}
            </p>
            <AnimatePresence mode="wait">
              {completado ? (
                <motion.p
                  key="hecho"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-[12px] font-bold text-[var(--accent)]"
                >
                  Ya diste tu paso de hoy — así de simple es.
                </motion.p>
              ) : (
                <motion.p
                  key="frase"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-start gap-1.5 text-[12px] italic text-[var(--text-secondary)]"
                >
                  <Sparkles size={13} className="mt-0.5 shrink-0" color={habito.color} />
                  &ldquo;{frase}&rdquo;
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-4 flex justify-between gap-1">
            {semana.dias.map((d, i) => (
              <motion.div
                key={d.fecha}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0.1 : 0.25, delay: reduce ? 0 : 0.1 + i * 0.05 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[12px] font-bold text-[var(--text-secondary)]">{d.letra}</span>
                <motion.span
                  animate={{ scale: d.hecho ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex size-6 items-center justify-center rounded-full"
                  style={{
                    background: d.hecho
                      ? 'var(--success)'
                      : d.esHoy
                        ? 'var(--accent)'
                        : 'color-mix(in oklab, var(--text-secondary) 14%, transparent)',
                    boxShadow: d.esHoy && !d.hecho ? '0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)' : undefined,
                  }}
                >
                  {d.hecho && <Check size={12} color="white" strokeWidth={3} />}
                </motion.span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            {completado ? (
              <div className="flex flex-col gap-2">
                <div className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--success)] text-[16px] font-bold text-white">
                  <Check size={18} strokeWidth={3} /> Hecho por hoy
                </div>
                {perfilAnterior && (
                  <motion.button
                    type="button"
                    onClick={deshacer}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] text-[12px] font-bold text-[var(--text-secondary)]"
                  >
                    <Undo2 size={16} /> Marqué esto sin querer
                  </motion.button>
                )}
              </div>
            ) : (
              <BotonPrimario onClick={completar}>
                {modoDificil ? 'Completar mi versión mínima' : 'Completar'}
              </BotonPrimario>
            )}
            {errorGuardado && (
              <p aria-live="polite" className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                <AlertCircle size={14} /> No pudimos guardar tu paso de hoy. Revisa el espacio de tu navegador e intenta de nuevo.
              </p>
            )}
            {!completado && (
              <motion.button
                type="button"
                onClick={() => setModoDificil((m) => !m)}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="mt-2 w-full text-center text-[12px] font-bold text-[var(--text-secondary)] underline"
              >
                {modoDificil ? 'Volver a mi meta normal' : '¿Día difícil? Reduce tu meta a lo mínimo'}
              </motion.button>
            )}
          </div>

          <Link
            href="/progreso"
            className="mt-4 flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4"
          >
            <div>
              <p className="text-[12px] font-bold text-[var(--text-secondary)]">Esta semana</p>
              <p className="text-[16px] font-bold [font-family:var(--font-display)]">
                {completadosMostrados} de 7 días
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex size-11 items-center justify-center">
                <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="color-mix(in oklab, var(--accent) 16%, transparent)" strokeWidth="4" />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circunferencia}
                    initial={{ strokeDashoffset: circunferencia }}
                    animate={{ strokeDashoffset: circunferencia * (1 - semana.completados / 7) }}
                    transition={{ duration: reduce ? 0.1 : 0.6, ease: 'easeOut' }}
                  />
                </svg>
              </div>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </div>
          </Link>

          <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-3 text-[12px] text-[var(--text-secondary)]">
            <Snowflake size={14} color="var(--accent)" />
            {congeladores > 0 ? (
              <p>
                Tienes {congeladores} {congeladores === 1 ? 'pase libre' : 'pases libres'} guardados para si un día
                se complica — no rompen tu progreso.
              </p>
            ) : (
              <p>Completa 7 días seguidos y ganas un pase libre para los días que se compliquen.</p>
            )}
          </div>

          {racha > 0 && (
            <p className="mt-3 text-center text-[12px] font-bold text-[var(--text-secondary)]">
              Llevas {racha} {racha === 1 ? 'día seguido' : 'días seguidos'}
            </p>
          )}
        </>
      )}
    </AppShell>
  );
}
