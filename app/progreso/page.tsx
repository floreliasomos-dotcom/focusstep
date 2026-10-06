'use client';

// /progreso — cumplimiento semanal a lo largo del tiempo (el diferenciador: % semanal, NUNCA racha
// punitiva). Un día cuenta si se completó al menos un hábito; una semana en cero se muestra neutra,
// nunca en rojo ni como "días perdidos". Pantalla secundaria: medición + checklist.

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AppShell } from '@/components/app/AppShell';
import { BotonPrimario, Mascota } from '@/components/funnel/ui';
import { useHidratado } from '@/lib/hidratado';
import { historialSemanas, obtenerPerfil, type SemanaHistorial } from '@/lib/habitos';

const SEMANAS = 6;

function leerProgreso() {
  const h = historialSemanas(SEMANAS);
  return { ...h, racha: obtenerPerfil().rachaActual };
}

function insight(actual: number, total: number): string {
  if (total === 0) return 'Cuando completes tu primer paso, aquí empieza a dibujarse tu semana.';
  if (actual >= 5) return `Semana sólida: ${actual} de 7. Así se construye un hábito, sin prisa.`;
  if (actual > 0) return `Cada día cuenta: llevas ${actual} esta semana.`;
  return 'Una semana tranquila también es parte del camino. Hoy puedes retomar con un solo paso.';
}

function EsqueletoProgreso() {
  return (
    <AppShell>
      <div className="h-8 w-40 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]" />
      <div className="mt-4 h-28 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
      <div className="mt-3 h-44 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
    </AppShell>
  );
}

export default function Progreso() {
  return useHidratado() ? <ProgresoContenido /> : <EsqueletoProgreso />;
}

function ProgresoContenido() {
  const reduce = useReducedMotion();
  const [d] = useState(leerProgreso);
  const actual = d.semanas.find((s) => s.esActual)?.dias ?? 0;

  if (d.totalDias === 0) {
    return (
      <AppShell>
        <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tu progreso</h1>
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Mascota size={64} />
          <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">{insight(0, 0)}</p>
          <div className="w-full">
            <Link href="/hoy">
              <BotonPrimario>Hacer mi primer paso</BotonPrimario>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tu progreso</h1>
      <p className="mt-1 text-[12px] font-bold text-[var(--text-secondary)]">Días en los que diste tu paso, semana a semana</p>

      <section
        aria-label="Esta semana"
        className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
      >
        <p className="text-[12px] font-bold text-[var(--text-secondary)]">Esta semana</p>
        <p className="text-[32px] font-bold leading-none [font-family:var(--font-display)]">
          {actual} <span className="text-[16px] text-[var(--text-secondary)]">de 7 días</span>
        </p>
        <p className="mt-3 flex items-start gap-2 text-[12px] italic text-[var(--text-secondary)]">
          <Sparkles size={14} className="mt-0.5 shrink-0" color="var(--accent)" />
          {insight(actual, d.totalDias)}
        </p>
      </section>

      <section aria-label={`Últimas ${SEMANAS} semanas`} className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4">
        <p className="text-[12px] font-bold text-[var(--text-secondary)]">Últimas {SEMANAS} semanas</p>
        <ol className="mt-3 flex h-36 items-end gap-2">
          {d.semanas.map((s, i) => (
            <Barra key={s.inicio} semana={s} indice={i} reduce={reduce} />
          ))}
        </ol>
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Dato valor={d.totalDias} etiqueta="días en total" />
        <Dato valor={d.mejorSemana} etiqueta="mejor semana" sufijo="/7" />
        <Dato valor={d.racha} etiqueta={d.racha === 1 ? 'día seguido' : 'días seguidos'} />
      </div>
    </AppShell>
  );
}

function Barra({ semana, indice, reduce }: { semana: SemanaHistorial; indice: number; reduce: boolean | null }) {
  const alto = Math.max(6, (semana.dias / 7) * 100);
  return (
    <li className="flex h-full flex-1 flex-col items-center justify-end gap-1" aria-label={`${semana.etiqueta}: ${semana.dias} de 7 días`}>
      <span className="text-[12px] font-bold text-[var(--text-secondary)]">{semana.dias > 0 ? semana.dias : ''}</span>
      <div className="flex w-full flex-1 items-end">
        <motion.div
          className="w-full rounded-t-[8px]"
          style={{
            background: semana.esActual ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 35%, transparent)',
            minHeight: 6,
          }}
          initial={{ height: reduce ? `${alto}%` : '6%' }}
          animate={{ height: `${alto}%` }}
          transition={{ duration: reduce ? 0.1 : 0.5, delay: reduce ? 0 : indice * 0.06, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[12px] text-[var(--text-secondary)]">{semana.esActual ? 'Esta sem.' : semana.etiqueta}</span>
    </li>
  );
}

function Dato({ valor, etiqueta, sufijo }: { valor: number; etiqueta: string; sufijo?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-3 text-center shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]">
      <p className="text-[24px] font-bold leading-none [font-family:var(--font-display)]">
        {valor}
        {sufijo && <span className="text-[12px] text-[var(--text-secondary)]">{sufijo}</span>}
      </p>
      <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{etiqueta}</p>
    </div>
  );
}
