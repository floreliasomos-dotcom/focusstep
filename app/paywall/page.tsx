'use client';

// Paywall de FocusStep — 50-DISENO-ONBOARDING-PAYWALL.md §C. Onboarding-first (ESTADO.md):
// el CTA de pago y el "Ahora no" llevan AMBOS a /entrar — el cobro real y la cuenta se
// resuelven en Sesión 6 (Hotmart + Supabase). Aquí el estado es local (mock honesto, C3ter).
//
// Sin lenguaje de "garantía": el plazo de reembolso no está verificado con Hotmart todavía
// (FICHA-MERCADO.md §4, pendiente Sesión 6) — ver la misma nota en app/page.tsx.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { BotonPrimario, FunnelShell, Mascota } from '@/components/funnel/ui';

// Copy trazado a FICHA-AVATAR.md: cada feature ancla al dolor/deseo que resuelve,
// no una lista de funciones genérica (defecto real de revisor-visual, ver docs/revisiones).
const FEATURES = [
  'Hábitos ilimitados — sin límite de 3 cuando ya no sientas que te abruma',
  'Modo Día Difícil — para cuando un mal día no sea el final',
  'Frases de tu mascota que te acompañan, sin presión',
];

const MOMENTO_LABEL: Record<string, string> = {
  'Mis mañanas': 'tus mañanas',
  'Mi trabajo': 'tu trabajo',
  'Mi descanso': 'tu descanso',
};

export default function Paywall() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [respuestasN, setRespuestasN] = useState(0);
  const [momento, setMomento] = useState<string | undefined>();
  const [enviando, setEnviando] = useState(false);

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
    setEnviando(true);
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
        <motion.button
          type="button"
          onClick={ahoraNo}
          aria-label="Cerrar y seguir con el plan gratis"
          whileTap={reduce ? undefined : { scale: 0.9 }}
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"
        >
          <X size={20} />
        </motion.button>
      </div>

      <motion.div
        initial="oculto"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } } }}
        className="flex flex-1 flex-col"
      >
        <Bloque>
          <Mascota size={48} />
          <h1 className="mt-3 text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
            Tu plan para <span className="text-[var(--accent)]">{metaLabel}</span> está listo
          </h1>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
            Hecho con tus {respuestasN || 4} respuestas y tu primer paso ya completado.
          </p>
        </Bloque>

        <Bloque
          className="mt-6 rounded-[var(--radius-card)] border border-transparent p-4"
          style={{
            background:
              'linear-gradient(var(--surface), var(--surface)) padding-box, ' +
              'linear-gradient(135deg, color-mix(in oklab, var(--accent) 40%, transparent), transparent 60%) border-box',
          }}
        >
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

        <Bloque className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4">
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
          <BotonPrimario onClick={continuar} disabled={enviando}>
            {enviando ? 'Un momento…' : 'Empezar mis 7 días gratis'}
          </BotonPrimario>
          <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
            Hoy no pagas nada · te avisamos antes del cobro · cancela cuando quieras
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[12px] font-medium text-[var(--text-secondary)]">
            <motion.button
              type="button"
              onClick={ahoraNo}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="underline"
            >
              Ahora no
            </motion.button>
            <span aria-hidden="true">·</span>
            <motion.button
              type="button"
              onClick={() => router.push('/onboarding')}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="underline"
            >
              Editar mis respuestas
            </motion.button>
          </div>
          <p className="mt-4 text-center text-[12px] text-[var(--text-tertiary)]">
            Pago seguro procesado por Hotmart
          </p>
        </Bloque>
      </motion.div>
    </FunnelShell>
  );
}

function Bloque({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{ oculto: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }}
      className={className}
      style={style}
    >
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
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className="relative w-full rounded-[var(--radius-card)] border-2 border-transparent p-4 text-left"
      style={
        seleccionado
          ? {
              background:
                'linear-gradient(color-mix(in oklab, var(--accent) 6%, var(--surface)), color-mix(in oklab, var(--accent) 6%, var(--surface))) padding-box, ' +
                'linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 30%, transparent)) border-box',
            }
          : {
              background: 'var(--surface)',
              borderColor: 'color-mix(in oklab, var(--text-secondary) 20%, transparent)',
            }
      }
    >
      {badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[16px] font-semibold">
          {nombre}
          {seleccionado && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
        </span>
        <span className="text-[24px] font-bold tabular-nums">
          {precioMes}
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      {totalAnual && <p className="mt-1 text-[12px] text-[var(--accent)]">{totalAnual}</p>}
    </motion.button>
  );
}

function Timeline() {
  const nodos = [
    { titulo: 'Hoy — acceso completo', sub: 'Todo tu plan, sin límites', activo: true, clave: false },
    { titulo: 'Día 5 — te avisamos', sub: 'Correo antes de cualquier cobro', activo: true, clave: false },
    { titulo: 'Día 7 — primer cobro: $34.99/año', sub: 'Cancela antes sin costo', activo: false, clave: true },
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
            <p className={`text-[16px] font-semibold ${n.clave ? 'text-[var(--accent)]' : ''}`}>{n.titulo}</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{n.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
