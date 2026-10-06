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
import { X, Check, AlertCircle } from 'lucide-react';
import { BotonPrimario, FunnelShell, Mascota } from '@/components/funnel/ui';
import { useHidratado } from '@/lib/hidratado';
import { registrarEvento } from '@/lib/analitica';

// Copy trazado a FICHA-AVATAR.md: cada feature ancla al dolor/deseo que resuelve,
// no una lista de funciones genérica (defecto real de revisor-visual, ver docs/revisiones).
const FEATURES = [
  'Reinicio Amigable: si faltas unos días, retomas sin historial en rojo ni culpa',
  'Modo Día Difícil: en los días pesados tu meta baja a 1 toque',
  'Hábitos ilimitados: sin tope de 3 cuando quieras sumar más',
];

const MOMENTO_LABEL: Record<string, string> = {
  'Mis mañanas': 'tus mañanas',
  'Mi trabajo': 'tu trabajo',
  'Mi descanso': 'tu descanso',
};

function leerRespuestas(): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem('focusstep_onboarding');
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null; // sin respuestas guardadas: se usa el texto genérico
  }
}

export default function Paywall() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(false);
  const salvavidasRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    registrarEvento('paywall_visto');
  }, []);

  useEffect(() => () => {
    if (salvavidasRef.current) clearTimeout(salvavidasRef.current);
  }, []);

  // Respuestas del cuestionario (sessionStorage): se leen derivadas, ya hidratado, sin setState en un efecto.
  const hidratado = useHidratado();
  const respuestas = hidratado ? leerRespuestas() : null;
  const respuestasN = respuestas ? Object.keys(respuestas).length : 0;
  const momento = respuestas?.momento;

  const metaLabel = (momento && MOMENTO_LABEL[momento]) || 'tu día a día';

  function continuar() {
    setEnviando(true);
    setErrorEnvio(false);
    try {
      sessionStorage.setItem('focusstep_plan_elegido', plan);
      registrarEvento('plan_elegido', { plan });
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
    registrarEvento('plan_gratis_elegido');
    router.push('/entrar?origen=paywall_gratis');
  }

  // Atajos de teclado — mismo principio de eficiencia que el onboarding (1/2 elige plan,
  // Enter confirma), detectado como inconsistencia real por el revisor-visual.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === '1') setPlan('anual');
      else if (e.key === '2') setPlan('mensual');
      else if (e.key === 'Enter') {
        // Enter sobre un botón/enlace ("Ahora no", "Editar", la X) ya activa ese control: no debe disparar además el pago.
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'BUTTON' || tag === 'A') return;
        continuar();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  return (
    <FunnelShell>
      <div className="flex items-center justify-between">
        <motion.button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Salir"
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
          <div className="flex items-center gap-3">
            <motion.div
              animate={reduce ? undefined : { rotate: [0, -10, 8, -4, 0] }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
              className="shrink-0"
            >
              <Mascota size={64} />
            </motion.div>
            <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
              Tu plan <span className="text-[var(--accent)]">sin culpa</span> está listo
            </h1>
          </div>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
            Pensado para {metaLabel}, con tus {respuestasN || 4} respuestas y tu primer paso ya hecho.
          </p>
        </Bloque>

        <Bloque
          className="mt-4 rounded-[var(--radius-card)] border border-transparent p-4"
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
                className="flex items-start gap-3 text-[16px] font-medium"
              >
                <motion.span
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: reduce ? 0.1 : 0.3, delay: reduce ? 0 : 0.45 + i * 0.15 }}
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
                >
                  <Check size={14} color="var(--accent)" strokeWidth={3} />
                </motion.span>
                {f}
              </motion.li>
            ))}
          </ul>
        </Bloque>

        <Bloque className="mt-5">
          <div role="radiogroup" aria-label="Elige tu plan" className="flex flex-col gap-3">
          <PlanCard
            nombre="Anual"
            badge="MEJOR PRECIO"
            precioMesNumero={2.92}
            totalAnual="Se cobra US$34.99/año el Día 7 · 5 meses gratis"
            precioDia="Menos de US$0.10 al día"
            seleccionado={plan === 'anual'}
            onClick={() => setPlan('anual')}
          />
          <PlanCard
            nombre="Mensual"
            precioMesNumero={4.99}
            totalAnual="Primer cobro el Día 7"
            precioDia="US$0.17 al día"
            seleccionado={plan === 'mensual'}
            onClick={() => setPlan('mensual')}
          />
          </div>
        </Bloque>

        <Bloque className="mt-4">
          <BotonPrimario onClick={continuar} disabled={enviando}>
            {enviando ? 'Un momento…' : 'Empezar mis 7 días gratis'}
          </BotonPrimario>
          {errorEnvio && (
            <p aria-live="polite" className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
              <AlertCircle size={14} /> No pudimos guardar tu plan. Revisa tu conexión e intenta de nuevo.
            </p>
          )}
          <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
            Hoy no pagas nada · cancela cuando quieras<br />Pago seguro con Hotmart
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center text-[12px] text-[var(--text-secondary)]">
            <motion.button
              type="button"
              onClick={ahoraNo}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="flex min-h-11 items-center px-3 font-semibold underline"
            >
              Ahora no: seguir gratis con 3 hábitos
            </motion.button>
            <motion.button
              type="button"
              onClick={() => router.push('/onboarding?editar=1')}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="flex min-h-11 items-center px-3 font-normal text-[var(--text-secondary)]"
            >
              Editar mis respuestas
            </motion.button>
          </div>
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

// Conteo animado del precio al seleccionar un plan; sin animación (o plan no seleccionado) muestra el valor directo.
function useConteoPrecio(valor: number, activo: boolean) {
  const reduce = useReducedMotion();
  const animar = !reduce && activo;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!animar) return;
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
  }, [valor, animar]);

  return animar ? n : valor;
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
  const precioMostrado = useConteoPrecio(precioMesNumero, seleccionado);
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={seleccionado}
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
          className={`text-[24px] font-bold leading-none tabular-nums [font-family:var(--font-display)] ${seleccionado ? 'text-[var(--accent)]' : ''}`}
        >
          US${precioMostrado.toFixed(2)}
          <span className="text-[12px] font-semibold text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      <p className="mt-1 text-[12px] font-semibold text-[color-mix(in_oklab,var(--accent)_75%,var(--text-primary))]">{totalAnual}</p>
      <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{precioDia}</p>
    </motion.button>
  );
}
