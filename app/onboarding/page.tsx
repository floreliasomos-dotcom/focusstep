'use client';

// Onboarding de FocusStep — quiz de 4 preguntas + reconocimiento + Primera Victoria (<60s)
// + loading "construyendo tu plan" (50-DISENO-ONBOARDING-PAYWALL.md). Copy derivado de
// FICHA-AVATAR.md. Backend real (guardar respuestas, crear usuario) llega en Sesión 6 —
// este flujo corre 100% en el navegador y pasa las respuestas al paywall por sessionStorage
// (mock honesto, ver C3ter del 50).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  RotateCcw,
  Frown,
  ListTodo,
  Clock3,
  Sunrise,
  Briefcase,
  Moon,
  TrendingUp,
  PauseCircle,
  Snowflake,
  XCircle,
  Puzzle,
  BellOff,
} from 'lucide-react';
import { BarraProgreso, BotonPrimario, Chip, FunnelShell, Mascota, PasoTransicion } from '@/components/funnel/ui';

const PREGUNTAS = [
  {
    id: 'problema',
    pregunta: '¿Qué es lo que más te cuesta ahora mismo?',
    opciones: [
      { label: 'Empezar y abandonar a la semana', icon: RotateCcw },
      { label: 'La culpa de fallar un día', icon: Frown },
      { label: 'Tener demasiadas cosas en la lista', icon: ListTodo },
      { label: 'Sentir que no me alcanza el tiempo', icon: Clock3 },
    ],
  },
  {
    id: 'paralisis',
    pregunta: '¿Qué tanto te paraliza ver una lista larga de pendientes?',
    opciones: [
      { label: 'Un poco, pero avanzo', icon: TrendingUp },
      { label: 'Bastante — me cuesta arrancar', icon: PauseCircle },
      { label: 'Mucho, se me congela la cabeza', icon: Snowflake },
    ],
  },
  {
    id: 'fracasos',
    pregunta: '¿Qué te ha hecho dejar otras apps de hábitos?',
    opciones: [
      { label: 'Las rachas rotas me hacían sentir mal', icon: XCircle },
      { label: 'Eran complicadas de usar', icon: Puzzle },
      { label: 'Se me olvidaba entrar', icon: BellOff },
      { label: 'Otra cosa (escribe la tuya)', escape: true },
    ],
  },
  {
    id: 'momento',
    pregunta: '¿En qué momento del día más lo necesitas?',
    opciones: [
      { label: 'Mis mañanas', icon: Sunrise },
      { label: 'Mi trabajo', icon: Briefcase },
      { label: 'Mi descanso', icon: Moon },
    ],
  },
] as const;

const HABITO_SUGERIDO: Record<string, string> = {
  'Mis mañanas': 'Estirar 5 minutos al despertar',
  'Mi trabajo': 'Respirar 1 minuto antes de tu primera reunión',
  'Mi descanso': 'Anotar 1 cosa buena del día antes de dormir',
};

type Respuestas = Record<string, string>;

// 0..3 = preguntas · 4 = reconocimiento · 5 = primera victoria · 6 = loading
export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [otraCosa, setOtraCosa] = useState('');
  const [victoriaCompleta, setVictoriaCompleta] = useState(false);

  const totalPasos = PREGUNTAS.length + 3; // + reconocimiento + victoria + loading
  const pct = Math.min(8 + (paso / totalPasos) * 92, 100);

  function elegir(idPregunta: string, valor: string) {
    setRespuestas((r) => ({ ...r, [idPregunta]: valor }));
    setTimeout(() => setPaso((p) => p + 1), 300);
  }

  function atras() {
    setPaso((p) => Math.max(0, p - 1));
  }

  useEffect(() => {
    if (paso === 6) {
      sessionStorage.setItem('focusstep_onboarding', JSON.stringify(respuestas));
      const t = setTimeout(() => router.push('/paywall'), 4800);
      return () => clearTimeout(t);
    }
  }, [paso, respuestas, router]);

  const habito = HABITO_SUGERIDO[respuestas.momento] ?? 'Beber 1 vaso de agua';

  return (
    <FunnelShell>
      <BarraProgreso
        pct={pct}
        onAtras={paso > 0 && paso < 6 ? atras : undefined}
        onSalir={paso < 6 ? () => router.push('/') : undefined}
        pasoActual={paso < PREGUNTAS.length ? paso + 1 : undefined}
        totalPasos={paso < PREGUNTAS.length ? PREGUNTAS.length : undefined}
      />

      <AnimatePresence mode="wait">
        {paso < PREGUNTAS.length && (
          <PasoTransicion k={paso}>
            <PantallaPregunta
              pregunta={PREGUNTAS[paso]}
              seleccionado={respuestas[PREGUNTAS[paso].id]}
              otraCosa={otraCosa}
              onOtraCosa={setOtraCosa}
              onElegir={(v) => elegir(PREGUNTAS[paso].id, v)}
              esUltima={paso === PREGUNTAS.length - 1}
            />
          </PasoTransicion>
        )}

        {paso === PREGUNTAS.length && (
          <PasoTransicion k="reconocimiento">
            <PantallaReconocimiento
              respuestas={respuestas}
              onContinuar={() => setPaso((p) => p + 1)}
            />
          </PasoTransicion>
        )}

        {paso === PREGUNTAS.length + 1 && (
          <PasoTransicion k="victoria">
            <PantallaPrimeraVictoria
              habito={habito}
              completa={victoriaCompleta}
              onCompletar={() => setVictoriaCompleta(true)}
              onContinuar={() => setPaso((p) => p + 1)}
            />
          </PasoTransicion>
        )}

        {paso === PREGUNTAS.length + 2 && (
          <PasoTransicion k="loading">
            <PantallaLoading respuestas={respuestas} habito={habito} />
          </PasoTransicion>
        )}
      </AnimatePresence>
    </FunnelShell>
  );
}

function PantallaPregunta({
  pregunta,
  seleccionado,
  otraCosa,
  onOtraCosa,
  onElegir,
  esUltima,
}: {
  pregunta: (typeof PREGUNTAS)[number];
  seleccionado?: string;
  otraCosa: string;
  onOtraCosa: (v: string) => void;
  onElegir: (v: string) => void;
  esUltima: boolean;
}) {
  const [mostrarInput, setMostrarInput] = useState(false);
  const tieneEscape = pregunta.opciones.some((op) => 'escape' in op && op.escape);

  function elegirOpcion(op: (typeof pregunta.opciones)[number]) {
    if ('escape' in op && op.escape) setMostrarInput(true);
    else onElegir(op.label);
  }

  return (
    <div
      className="flex flex-1 flex-col pt-6"
      onKeyDown={
        tieneEscape
          ? undefined
          : (e) => {
              const n = Number(e.key);
              if (n >= 1 && n <= pregunta.opciones.length) elegirOpcion(pregunta.opciones[n - 1]);
            }
      }
    >
      <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        {pregunta.pregunta}
      </h1>
      {!tieneEscape && (
        <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">Tip: puedes usar las teclas 1-{pregunta.opciones.length}</p>
      )}
      <div className="mt-8 flex flex-col gap-3">
        {pregunta.opciones.map((op, i) => (
          <Chip
            key={op.label}
            label={op.label}
            icon={'icon' in op ? op.icon : undefined}
            seleccionado={seleccionado === op.label}
            indice={i}
            onClick={() => elegirOpcion(op)}
          />
        ))}
      </div>
      {mostrarInput && (
        <div className="mt-4 flex flex-col gap-3">
          <input
            autoFocus
            value={otraCosa}
            onChange={(e) => onOtraCosa(e.target.value)}
            placeholder="Cuéntame con tus palabras"
            className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]"
          />
          {!otraCosa.trim() && (
            <p className="text-[12px] text-[var(--text-secondary)]">Escribe algo para poder continuar.</p>
          )}
          <BotonPrimario disabled={!otraCosa.trim()} onClick={() => onElegir(otraCosa.trim())}>
            Continuar
          </BotonPrimario>
        </div>
      )}
      <div className="flex-1" aria-hidden="true" />
      <div className="flex h-40 shrink-0 flex-col items-center justify-center gap-2 opacity-90">
        <Mascota size={64} />
        <p className="text-[12px] font-medium text-[var(--text-secondary)]">
          {esUltima ? 'Ya casi terminas' : 'Te acompaño en esto'}
        </p>
      </div>
    </div>
  );
}

function PantallaReconocimiento({
  respuestas,
  onContinuar,
}: {
  respuestas: Respuestas;
  onContinuar: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
      <Mascota size={72} />
      <h2 className="text-balance text-[24px] font-bold leading-[1.2] [font-family:var(--font-display)]">
        Tus respuestas te describen
      </h2>
      <p className="max-w-[32ch] rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-[16px] leading-relaxed text-[var(--text-secondary)]">
        Cada vez que lo dejaste, no fue por falta de voluntad —{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {respuestas.fracasos?.toLowerCase().includes('rachas')
            ? 'fue porque justo el día que más lo necesitabas, la app te mostró un cero'
            : 'fue porque el sistema te pedía más de lo que un mal día te permite'}
        </span>
        . Eso termina hoy: un solo paso a la vez, sin castigo por los días difíciles.
      </p>
      <div className="w-full pt-4">
        <BotonPrimario onClick={onContinuar}>Continuar</BotonPrimario>
      </div>
    </div>
  );
}

function PantallaPrimeraVictoria({
  habito,
  completa,
  onCompletar,
  onContinuar,
}: {
  habito: string;
  completa: boolean;
  onCompletar: () => void;
  onContinuar: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
      <Mascota size={56} contenta={completa} />
      <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--accent)]">
          Tu primer paso — menos de 60 segundos
        </p>
        <h2 className="text-balance text-[24px] font-bold leading-[1.2] [font-family:var(--font-display)]">
          {habito}
        </h2>
        <p className="max-w-[32ch] text-[16px] text-[var(--text-secondary)]">
          Pruébalo ahora mismo. Así se siente completar tu único paso del día.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onCompletar}
        disabled={completa}
        whileTap={{ scale: 0.96 }}
        animate={completa ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="flex size-32 items-center justify-center rounded-full text-white shadow-[0_16px_32px_-10px_color-mix(in_oklab,var(--accent)_50%,transparent)]"
        style={{
          background: completa
            ? 'var(--success)'
            : 'linear-gradient(180deg, color-mix(in oklab, var(--accent) 86%, white), var(--accent))',
        }}
      >
        {completa ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <span className="text-[16px] font-bold">Completar</span>
        )}
      </motion.button>

      {completa && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-4 pt-2"
        >
          <p className="font-semibold text-[var(--accent)]">Así de simple es un día con FocusStep</p>
          <BotonPrimario onClick={onContinuar}>Continuar</BotonPrimario>
        </motion.div>
      )}
    </div>
  );
}

function PantallaLoading({ respuestas, habito }: { respuestas: Respuestas; habito: string }) {
  const lineas = [
    `Analizando tu mayor freno: ${respuestas.problema?.toLowerCase() ?? 'tu situación'}`,
    `Ajustando tu plan a ${respuestas.momento ?? 'tu día'}`,
    `Guardando tu primer paso: ${habito}`,
    'Preparando tu Reinicio Amigable para los días difíciles',
  ];
  const [activa, setActiva] = useState(0);
  const [pct, setPct] = useState(8);

  useEffect(() => {
    const intervalos = lineas.map((_, i) => setTimeout(() => setActiva(i + 1), 700 + i * 900));
    // Un último tick para que la línea final también pase a "hecho" (check) antes de
    // transicionar al paywall, en vez de quedarse pulsando indefinidamente (bug real
    // detectado por el revisor-visual).
    intervalos.push(setTimeout(() => setActiva(lineas.length + 1), 700 + lineas.length * 900 + 500));
    const barra = setInterval(() => setPct((p) => Math.min(100, p + 4)), 160);
    return () => {
      intervalos.forEach(clearTimeout);
      clearInterval(barra);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center" aria-live="polite" aria-busy="true">
      <div className="relative flex size-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r="48" fill="none" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" strokeWidth="9" />
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={2 * Math.PI * 48 * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 200ms ease-out' }}
          />
        </svg>
        <span className="absolute text-[24px] font-bold tabular-nums">{pct}%</span>
      </div>
      <h2 className="text-[24px] font-bold [font-family:var(--font-display)]">Construyendo tu plan…</h2>
      <ul className="flex w-full flex-col gap-3 text-left">
        {lineas.map((linea, i) => (
          <li key={linea} className={`flex items-center gap-3 text-[16px] ${i < activa ? 'opacity-100' : 'opacity-40'}`}>
            {i < activa - 1 ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            ) : i === activa - 1 ? (
              <span className="size-5 shrink-0 animate-pulse rounded-full bg-[var(--accent)]" />
            ) : (
              <span className="size-5 shrink-0 rounded-full border border-[var(--text-secondary)]" />
            )}
            {linea}
          </li>
        ))}
      </ul>
    </div>
  );
}
