'use client';

// /habitos — crear, editar, archivar y elegir el foco de los hasta 3 hábitos (plan gratis).
// Pantalla secundaria (no una de las 4 del dinero): medición + checklist, sin revisor completo.
// Datos reales sobre lib/habitos.ts (localStorage); Sesión 6 los conecta a Supabase.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Pencil, Target, Archive, ArchiveRestore, Plus, Lock, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/app/AppShell';
import { FormularioHabito, type DatosHabito } from '@/components/app/FormularioHabito';
import { BotonPrimario, Mascota } from '@/components/funnel/ui';
import {
  type Habito,
  type ResultadoHabito,
  COLORES_HABITO,
  LIMITE_GRATIS,
  actualizarHabito,
  alternarActivo,
  contarActivos,
  crearHabito,
  esPro,
  inicializarDatos,
  ponerComoFoco,
  puedeActivarOtro,
} from '@/lib/habitos';

const ETIQUETA_MOMENTO: Record<Habito['momentoDia'], string> = {
  'Mis mañanas': 'Mañana',
  'Mi trabajo': 'Trabajo',
  'Mi descanso': 'Descanso',
};

const MENSAJE_ERROR: Record<'limite' | 'guardado' | 'nombre', string> = {
  limite: `Ya tienes ${LIMITE_GRATIS} hábitos activos. Archiva uno o pasa a Pro para tener más.`,
  guardado: 'No pudimos guardar el cambio. Revisa el espacio de tu navegador e intenta de nuevo.',
  nombre: 'Escribe al menos 2 letras.',
};

export default function Habitos() {
  const reduce = useReducedMotion();
  const [habitos, setHabitos] = useState<Habito[] | null>(null);
  const [pro, setPro] = useState(false);
  const [modo, setModo] = useState<{ tipo: 'nuevo' } | { tipo: 'editar'; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHabitos(inicializarDatos());
    setPro(esPro());
  }, []);

  function aplicar(r: ResultadoHabito, alExito?: () => void) {
    if (r.ok) {
      setHabitos(r.habitos);
      setError(null);
      alExito?.();
    } else {
      setError(MENSAJE_ERROR[r.error]);
    }
  }

  if (habitos === null) {
    return (
      <AppShell>
        <div className="h-8 w-40 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]" />
        <div className="mt-4 h-28 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
        <div className="mt-3 h-28 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
      </AppShell>
    );
  }

  const activos = contarActivos(habitos);
  const hayCupo = puedeActivarOtro(habitos);
  const primerActivo = habitos.find((h) => h.activo)?.id;
  const editando = modo?.tipo === 'editar' ? habitos.find((h) => h.id === modo.id) : undefined;

  return (
    <AppShell>
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tus hábitos</h1>
      <p className="mt-1 text-[12px] font-bold text-[var(--text-secondary)]">
        {pro ? `${activos} activos · sin límite` : `${activos} de ${LIMITE_GRATIS} activos`}
      </p>

      {error && !modo && (
        <p aria-live="polite" className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {habitos.map((h) =>
            modo?.tipo === 'editar' && modo.id === h.id && editando ? (
              <FormularioHabito
                key={h.id}
                titulo="Editar hábito"
                textoGuardar="Guardar cambios"
                error={error}
                inicial={{ nombre: editando.nombre, momentoDia: editando.momentoDia, color: editando.color }}
                onCancelar={() => {
                  setModo(null);
                  setError(null);
                }}
                onGuardar={(d: DatosHabito) => aplicar(actualizarHabito(h.id, d), () => setModo(null))}
              />
            ) : (
              <motion.article
                key={h.id}
                layout={!reduce}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: h.activo ? 1 : 0.7, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.1 : 0.25 }}
                className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
              >
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-secondary)]">
                  <span className="size-3 rounded-full" style={{ background: h.color }} aria-hidden="true" />
                  {ETIQUETA_MOMENTO[h.momentoDia]}
                  {h.activo && h.id === primerActivo && (
                    <span className="ml-auto rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-1 text-[var(--text-primary)]">
                      Foco de hoy
                    </span>
                  )}
                  {!h.activo && (
                    <span className="ml-auto rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-3 py-1">
                      Archivado
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[16px] font-bold leading-snug">{h.nombre}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AccionHabito
                    icono={<Pencil size={16} />}
                    texto="Editar"
                    onClick={() => {
                      setError(null);
                      setModo({ tipo: 'editar', id: h.id });
                    }}
                  />
                  {h.activo && h.id !== primerActivo && (
                    <AccionHabito
                      icono={<Target size={16} />}
                      texto="Hacer foco"
                      onClick={() => aplicar(ponerComoFoco(h.id))}
                    />
                  )}
                  <AccionHabito
                    icono={h.activo ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                    texto={h.activo ? 'Archivar' : 'Reactivar'}
                    onClick={() => aplicar(alternarActivo(h.id))}
                  />
                </div>
              </motion.article>
            ),
          )}
        </AnimatePresence>

        {habitos.length > 0 && activos === 0 && !modo && (
          <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-center">
            <Mascota size={48} />
            <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">
              No tienes ningún hábito activo. Reactiva uno o crea uno nuevo para ver tu ritual de hoy.
            </p>
          </div>
        )}

        {modo?.tipo === 'nuevo' ? (
          <FormularioHabito
            titulo="Nuevo hábito"
            textoGuardar="Agregar hábito"
            error={error}
            inicial={{ nombre: '', momentoDia: 'Mis mañanas', color: COLORES_HABITO[Math.min(habitos.length, 2)].valor }}
            onCancelar={() => {
              setModo(null);
              setError(null);
            }}
            onGuardar={(d: DatosHabito) => aplicar(crearHabito(d), () => setModo(null))}
          />
        ) : !modo && hayCupo ? (
          <BotonPrimario
            onClick={() => {
              setError(null);
              setModo({ tipo: 'nuevo' });
            }}
          >
            <span className="flex items-center gap-2">
              <Plus size={18} strokeWidth={3} /> Agregar hábito
            </span>
          </BotonPrimario>
        ) : (
          !modo && (
            <div className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4">
              <p className="flex items-start gap-2 text-[16px] font-semibold">
                <Lock size={18} className="mt-0.5 shrink-0" color="var(--accent)" />
                Ya usas tus {LIMITE_GRATIS} hábitos gratis.
              </p>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Con Pro tienes hábitos ilimitados, sin presión. También puedes archivar uno para hacer espacio.
              </p>
              <Link href="/paywall">
                <BotonPrimario>Ver planes</BotonPrimario>
              </Link>
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}

function AccionHabito({ icono, texto, onClick }: { icono: React.ReactNode; texto: string; onClick: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className="flex h-11 items-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] px-4 text-[12px] font-bold text-[var(--text-secondary)]"
    >
      {icono} {texto}
    </motion.button>
  );
}
