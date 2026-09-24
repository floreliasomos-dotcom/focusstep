'use client';

// Paywall de FocusStep — 50-DISENO-ONBOARDING-PAYWALL.md §C. Onboarding-first (ESTADO.md):
// el CTA de pago y el "Ahora no" llevan AMBOS a /entrar — el cobro real y la cuenta se
// resuelven en Sesión 6 (Hotmart + Supabase). Aquí el estado es local (mock honesto, C3ter).
//
// Sin lenguaje de "garantía": el plazo de reembolso no está verificado con Hotmart todavía
// (FICHA-MERCADO.md §4, pendiente Sesión 6) — ver la misma nota en app/page.tsx.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { BotonPrimario, FunnelShell } from '@/components/funnel/ui';

const FEATURES = [
  'Hábitos ilimitados (no solo 3)',
  'Modo Día Difícil siempre disponible',
  'Frases motivacionales de tu mascota',
];

const MOMENTO_LABEL: Record<string, string> = {
  'Mis mañanas': 'tus mañanas',
  'Mi trabajo': 'tu trabajo',
  'Mi descanso': 'tu descanso',
};

export default function Paywall() {
  const router = useRouter();
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [respuestasN, setRespuestasN] = useState(0);
  const [momento, setMomento] = useState<string | undefined>();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('focusstep_onboarding');
      if (raw) {
        const r = JSON.parse(raw) as Record<string, string>;
        setRespuestasN(Object.keys(r).length);
        setMomento(r.momento);
      }
    } catch {
      /* sin respuestas guardadas — se usa el genérico */
    }
  }, []);

  const metaLabel = (momento && MOMENTO_LABEL[momento]) || 'tu día a día';

  function continuar() {
    sessionStorage.setItem('focusstep_plan_elegido', plan);
    router.push('/entrar?origen=paywall');
  }

  function ahoraNo() {
    sessionStorage.setItem('focusstep_plan_elegido', 'gratis');
    router.push('/entrar?origen=paywall_gratis');
  }

  return (
    <FunnelShell>
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={ahoraNo}
          aria-label="Cerrar y seguir con el plan gratis"
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"
        >
          <X size={20} />
        </button>
      </div>

      <motion.div
        initial="oculto"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-1 flex-col"
      >
        <Bloque>
          <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
            Tu plan para <span className="text-[var(--accent)]">{metaLabel}</span> está listo
          </h1>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
            Hecho con tus {respuestasN || 4} respuestas y tu primer paso ya completado.
          </p>
        </Bloque>

        <Bloque className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-4">
          <ul className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[16px] font-medium">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
                  <Check size={14} color="var(--accent)" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Bloque>

        <Bloque className="mt-6">
          <Timeline />
        </Bloque>

        <Bloque className="mt-6 flex flex-col gap-3">
          <PlanCard
            nombre="Anual"
            badge="MÁS POPULAR"
            precioMes="$2.92"
            totalAnual="Se cobra $34.99/año · 5 meses gratis"
            seleccionado={plan === 'anual'}
            onClick={() => setPlan('anual')}
          />
          <PlanCard
            nombre="Mensual"
            precioMes="$4.99"
            totalAnual={undefined}
            seleccionado={plan === 'mensual'}
            onClick={() => setPlan('mensual')}
          />
        </Bloque>

        <Bloque className="mt-6">
          <BotonPrimario onClick={continuar}>Empezar mis 7 días gratis</BotonPrimario>
          <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
            Hoy no pagas nada · te avisamos antes del cobro · cancela cuando quieras
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[12px] font-medium text-[var(--text-secondary)]">
            <button type="button" onClick={ahoraNo} className="underline">
              Ahora no
            </button>
          </div>
          <p className="mt-4 text-center text-[12px] text-[var(--text-tertiary)]">
            Pago seguro procesado por Hotmart
          </p>
        </Bloque>
      </motion.div>
    </FunnelShell>
  );
}

function Bloque({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{ oculto: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className={className}>
      {children}
    </motion.div>
  );
}

function PlanCard({
  nombre,
  badge,
  precioMes,
  totalAnual,
  seleccionado,
  onClick,
}: {
  nombre: string;
  badge?: string;
  precioMes: string;
  totalAnual?: string;
  seleccionado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-[var(--radius-card)] border-2 p-4 text-left transition-colors ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_20%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-semibold">{nombre}</span>
        <span className="text-[24px] font-bold tabular-nums">
          {precioMes}
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      {totalAnual && <p className="mt-1 text-[12px] text-[var(--accent)]">{totalAnual}</p>}
    </button>
  );
}

function Timeline() {
  const nodos = [
    { titulo: 'Hoy — acceso completo', sub: 'Todo tu plan, sin límites', activo: true },
    { titulo: 'Día 5 — te avisamos', sub: 'Correo antes de cualquier cobro', activo: true },
    { titulo: 'Día 7 — primer cobro', sub: 'Cancela antes sin costo', activo: false },
  ];
  return (
    <div className="flex flex-col gap-1">
      {nodos.map((n, i) => (
        <div key={n.titulo} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`flex size-3 shrink-0 items-center justify-center rounded-full ${
                n.activo ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-[var(--bg)]'
              }`}
            />
            {i < nodos.length - 1 && <span className="w-px flex-1 bg-[color-mix(in_oklab,var(--accent)_30%,transparent)]" />}
          </div>
          <div className="pb-4">
            <p className="text-[16px] font-semibold">{n.titulo}</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{n.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
