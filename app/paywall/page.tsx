'use client';

// Paywall de FocusStep — 50-DISENO-ONBOARDING-PAYWALL.md §C. Onboarding-first (ESTADO.md):
// el CTA de pago y el "Ahora no" llevan AMBOS a /entrar — el cobro real y la cuenta se
// resuelven en Sesión 6 (Hotmart + Supabase). Aquí el estado es local (mock honesto, C3ter).
//
// Sin lenguaje de "garantía": el plazo de reembolso no está verificado con Hotmart todavía
// (FICHA-MERCADO.md §4, pendiente Sesión 6) — ver la misma nota en app/page.tsx.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { BotonPrimario, FunnelShell, Mascota } from '@/components/funnel/ui';

// Copy trazado a FICHA-AVATAR.md: cada feature ancla al dolor/deseo que resuelve,
// no una lista de funciones genérica (defecto real de revisor-visual, ver docs/revisiones).
const FEATURES = [
  'Hábitos ilimitados — sin límite de 3 cuando ya no sientas que te abruma',
  'Modo Día Difícil — reduce tu meta a 1 toque cuando sea necesario',
  'Frases de tu mascota en los 3 momentos clave de tu día, sin presión',
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
  const [errorEnvio, setErrorEnvio] = useState(false);
  const salvavidasRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (salvavidasRef.current) clearTimeout(salvavidasRef.current);
  }, []);

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
    setErrorEnvio(false);
    try {
      sessionStorage.setItem('focusstep_plan_elegido', plan);
      router.push('/entrar?origen=paywall');
    } catch {
      setEnviando(false);
      setErrorEnvio(true);
      return;
    }
    // Salvavidas: si la navegación no resuelve en unos segundos (conexión lenta,
    // error de router), no dejamos el botón congelado en "Un momento…" para siempre.
    // Se limpia si el componente se desmonta antes (navegación exitosa).
    salvavidasRef.current = setTimeout(() => setEnviando(false), 4000);
  }

  function ahoraNo() {
    sessionStorage.setItem('focusstep_plan_elegido', 'gratis');
    router.push('/entrar?origen=paywall_gratis');
  }

  // Atajos de teclado — mismo principio de eficiencia que el onboarding (1/2 elige plan,
  // Enter confirma), detectado como inconsistencia real por el revisor-visual.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === '1') setPlan('anual');
      else if (e.key === '2') setPlan('mensual');
      else if (e.key === 'Enter') continuar();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  return (
    <FunnelShell>
      <div className="flex items-center justify-between py-2">
        <motion.button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Salir"
          whileTap={reduce ? undefined : { scale: 0.9 }}
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"
        >
          <X size={20} />
        </motion.button>
        <p className="text-[12px] text-[var(--text-tertiary)]">Tip: usa 1, 2 y Enter</p>
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
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: reduce ? 0 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduce ? 0.1 : 0.3, delay: reduce ? 0 : 0.3 + i * 0.15 }}
                className="flex items-center gap-3 text-[16px] font-medium"
              >
                <motion.span
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: reduce ? 0.1 : 0.3, delay: reduce ? 0 : 0.45 + i * 0.15 }}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
                >
                  <Check size={14} color="var(--accent)" strokeWidth={3} />
                </motion.span>
                {f}
              </motion.li>
            ))}
          </ul>
        </Bloque>

        <Bloque className="mt-6 flex flex-col gap-3">
          <PlanCard
            nombre="Anual"
            badge="MÁS POPULAR"
            precioMesNumero={2.92}
            totalAnual="Se cobra $34.99/año el Día 7 · 5 meses gratis"
            precioDia="Menos de $0.10 al día"
            seleccionado={plan === 'anual'}
            onClick={() => setPlan('anual')}
          />
          <PlanCard
            nombre="Mensual"
            precioMesNumero={4.99}
            totalAnual="Primer cobro el Día 7"
            precioDia="$0.17 al día"
            seleccionado={plan === 'mensual'}
            onClick={() => setPlan('mensual')}
          />
        </Bloque>

        <Bloque className="mt-6">
          <BotonPrimario onClick={continuar} disabled={enviando}>
            {enviando ? 'Un momento…' : 'Empezar mis 7 días gratis'}
          </BotonPrimario>
          {errorEnvio && (
            <p aria-live="polite" className="mt-2 text-center text-[12px] font-semibold text-[var(--accent)]">
              No pudimos guardar tu plan. Revisa tu conexión e intenta de nuevo.
            </p>
          )}
          <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
            Hoy no pagas nada · te avisamos antes del cobro
          </p>
          <p className="text-center text-[12px] font-semibold text-[var(--text-secondary)]">
            Cancela cuando quieras, sin preguntas ni letra chica
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[12px] text-[var(--text-secondary)]">
            <motion.button
              type="button"
              onClick={ahoraNo}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="font-semibold underline"
            >
              Ahora no
            </motion.button>
            <span aria-hidden="true">·</span>
            <motion.button
              type="button"
              onClick={() => router.push('/onboarding?editar=1')}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="font-normal text-[var(--text-tertiary)]"
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

function usarConteo(valor: number, activo: boolean) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce || !activo ? valor : 0);

  useEffect(() => {
    if (reduce || !activo) {
      setN(valor);
      return;
    }
    let frame: number;
    const inicio = performance.now();
    const duracion = 600;
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      setN(valor * t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [valor, activo, reduce]);

  return n;
}

function PlanCard({
  nombre,
  badge,
  precioMesNumero,
  totalAnual,
  precioDia,
  seleccionado,
  onClick,
}: {
  nombre: string;
  badge?: string;
  precioMesNumero: number;
  totalAnual: string;
  precioDia: string;
  seleccionado: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  const precioMostrado = usarConteo(precioMesNumero, seleccionado);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className="relative w-full rounded-[var(--radius-card)] border-2 border-transparent p-4 text-left transition-[background,border-color] duration-200 ease-out"
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
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Check size={14} strokeWidth={3} />
            </span>
          )}
        </span>
        <span
          className={`text-[16px] font-bold tabular-nums ${seleccionado ? 'text-[var(--accent)]' : ''}`}
        >
          ${precioMostrado.toFixed(2)}
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      <p className="mt-1 text-[12px] text-[var(--accent)]">{totalAnual}</p>
      <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{precioDia}</p>
    </motion.button>
  );
}
