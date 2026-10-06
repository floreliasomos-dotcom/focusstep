'use client';

// Onboarding de FocusStep — quiz de 4 preguntas + reconocimiento + Primera Victoria (<60s)
// + loading "construyendo tu plan" (50-DISENO-ONBOARDING-PAYWALL.md). Copy derivado de
// FICHA-AVATAR.md. Backend real (guardar respuestas, crear usuario) llega en Sesión 6 —
// este flujo corre 100% en el navegador y pasa las respuestas al paywall por sessionStorage
// (mock honesto, ver C3ter del 50).

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  RotateCcw,
  Frown,
  Layers,
  Clock3,
  Sunrise,
  Briefcase,
  Moon,
  TrendingUp,
  PauseCircle,
  Snowflake,
  XCircle,
  Puzzle,
  PencilLine,
  AlertCircle,
  BellOff,
} from 'lucide-react';
import { useHidratado } from '@/lib/hidratado';
import { registrarEvento } from '@/lib/analitica';
import { BarraProgreso, BotonPrimario, Chip, FunnelShell, Mascota, PasoTransicion } from '@/components/funnel/ui';

const PREGUNTAS = [
  {
    id: 'problema',
    ayuda: 'Así empezamos por lo que más pesa hoy.',
    pregunta: '¿Qué es lo que más te cuesta ahora mismo?',
    opciones: [
      { label: 'Empezar y abandonar a la semana', icon: RotateCcw },
      { label: 'La culpa de fallar un día', icon: Frown },
      { label: 'Tener demasiadas cosas en la lista', icon: Layers },
      { label: 'Sentir que no me alcanza el tiempo', icon: Clock3 },
    ],
  },
  {
    id: 'paralisis',
    ayuda: 'Esto define cuántos pasos te mostramos a la vez.',
    pregunta: '¿Qué tanto te paraliza ver una lista larga de pendientes?',
    opciones: [
      { label: 'Un poco, pero avanzo', icon: TrendingUp },
      { label: 'Bastante — me cuesta arrancar', icon: PauseCircle },
      { label: 'Mucho, se me congela la cabeza', icon: Snowflake },
    ],
  },
  {
    id: 'fracasos',
    ayuda: 'Así evitamos repetir lo que te hizo dejarlas.',
    pregunta: '¿Qué te ha hecho dejar otras apps de hábitos?',
    opciones: [
      { label: 'Las rachas rotas me hacían sentir mal', icon: XCircle },
      { label: 'Eran complicadas de usar', icon: Puzzle },
      { label: 'Se me olvidaba entrar', icon: BellOff },
      { label: 'Otra cosa (escribe la tuya)', icon: PencilLine, escape: true },
    ],
  },
  {
    id: 'momento',
    ayuda: 'Ahí es donde pondremos tu recordatorio.',
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

type EstadoInicial = { respuestas: Respuestas; paso: number; modoEdicion: boolean; textoLibre: string };

// "Editar mis respuestas" desde el paywall vuelve aquí (?editar=1) y también se retoma tras salir con
// la X: se restaura lo ya contestado y se arranca en la primera pregunta sin responder. En modo
// edición, al terminar la última pregunta se vuelve directo al paywall (sin repetir pantallas).
function leerInicial(): EstadoInicial {
  const vacio: EstadoInicial = { respuestas: {}, paso: 0, modoEdicion: false, textoLibre: '' };
  try {
    const modoEdicion = new URLSearchParams(window.location.search).get('editar') === '1';
    const raw = sessionStorage.getItem('focusstep_onboarding');
    if (!raw) return { ...vacio, modoEdicion };
    const guardadas = JSON.parse(raw) as Respuestas;
    const siguiente = PREGUNTAS.findIndex((p) => !guardadas[p.id]);
    const conocidas = PREGUNTAS[2].opciones.map((o) => o.label as string);
    const f = guardadas.fracasos ?? '';
    return {
      respuestas: guardadas,
      paso: siguiente === -1 ? 0 : siguiente,
      modoEdicion,
      textoLibre: f && !conocidas.includes(f) ? f : '',
    };
  } catch {
    return vacio; // sin respuestas previas: arranca en blanco
  }
}

// 0..3 = preguntas · 4 = reconocimiento · 5 = primera victoria · 6 = loading
export default function Onboarding() {
  const hidratado = useHidratado();
  if (!hidratado) return <FunnelShell><div className="flex-1" /></FunnelShell>;
  return <Cuestionario />;
}

function Cuestionario() {
  const router = useRouter();
  const [inicial] = useState(leerInicial);
  const [paso, setPaso] = useState(inicial.paso);
  const [respuestas, setRespuestas] = useState<Respuestas>(inicial.respuestas);
  const [otraCosa, setOtraCosa] = useState(inicial.textoLibre);
  const [victoriaCompleta, setVictoriaCompleta] = useState(false);
  const modoEdicion = inicial.modoEdicion;

  const totalPasos = PREGUNTAS.length + 3; // + reconocimiento + victoria + loading
  const pct = Math.min(8 + (paso / totalPasos) * 92, 100);

  const eligiendo = useRef(false);

  function elegir(idPregunta: string, valor: string, conTeclado = false) {
    // Un doble toque o una tecla repetida durante los 300 ms de transición saltaba una pregunta.
    if (eligiendo.current) return;
    eligiendo.current = true;
    const nuevasRespuestas = { ...respuestas, [idPregunta]: valor };
    setRespuestas(nuevasRespuestas);
    // Se guarda en cada respuesta (no solo al final): un toque accidental en la X ya no borra el
    // avance — al volver, el cuestionario retoma donde quedó (defecto real de la 3ª revisión).
    try {
      sessionStorage.setItem('focusstep_onboarding', JSON.stringify(nuevasRespuestas));
    } catch {
      /* sin sessionStorage: el avance vive solo en memoria */
    }
    const esUltimaPregunta = idPregunta === PREGUNTAS[PREGUNTAS.length - 1].id;
    setTimeout(() => {
      if (modoEdicion && esUltimaPregunta) {
        sessionStorage.setItem('focusstep_onboarding', JSON.stringify(nuevasRespuestas));
        router.push('/paywall');
      } else {
        setPaso((p) => p + 1);
      }
      eligiendo.current = false;
    }, conTeclado ? 150 : 500);
  }

  function atras() {
    setPaso((p) => Math.max(0, p - 1));
  }

  useEffect(() => {
    if (paso === 6) {
      sessionStorage.setItem('focusstep_onboarding', JSON.stringify(respuestas));
      registrarEvento('onboarding_completado');
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
              onElegir={(v, conTeclado) => elegir(PREGUNTAS[paso].id, v, conTeclado)}
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
}: {
  pregunta: (typeof PREGUNTAS)[number];
  seleccionado?: string;
  otraCosa: string;
  onOtraCosa: (v: string) => void;
  onElegir: (v: string, conTeclado?: boolean) => void;
}) {
  const reduceMov = useReducedMotion();
  const [mostrarInput, setMostrarInput] = useState(
    () => Boolean(seleccionado) && pregunta.opciones.some((op) => 'escape' in op && op.escape) && !pregunta.opciones.some((op) => op.label === seleccionado),
  );
  const [intentoVacio, setIntentoVacio] = useState(false);
  const campoRef = useRef<HTMLInputElement>(null);
  const accionRef = useRef<HTMLDivElement>(null);

  // Con "Otra cosa" abierta el contenido pasa del alto de la pantalla: se asegura que el botón
  // "Continuar" quede completo a la vista (defecto real de la 4ª revisión).
  useEffect(() => {
    if (!mostrarInput) return;
    const t = setTimeout(() => accionRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 120);
    return () => clearTimeout(t);
  }, [mostrarInput]);

  function elegirOpcion(op: (typeof pregunta.opciones)[number], conTeclado = false) {
    if ('escape' in op && op.escape) setMostrarInput(true);
    else {
      setMostrarInput(false);
      onElegir(op.label, conTeclado);
    }
  }

  // Escucha en window: un onKeyDown sobre el div solo se dispara si el foco ya está dentro de él
  // (tras tocar una opción el foco queda en <body> y los atajos no respondían — bug real).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Los dígitos escritos dentro del campo "Otra cosa" no son atajos (bug real ya corregido antes).
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= pregunta.opciones.length) {
        // Sin esto, el dígito del atajo se escribía dentro del campo que el propio atajo abre ("Otra cosa").
        e.preventDefault();
        elegirOpcion(pregunta.opciones[n - 1], true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pregunta]);

  return (
    <div className="flex flex-1 flex-col pt-6">
      <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        {pregunta.pregunta}
      </h1>
      <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3">
        <motion.div
          className="shrink-0"
          animate={seleccionado && !reduceMov ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Mascota size={56} contenta={Boolean(seleccionado)} />
        </motion.div>
        <p className="text-[16px] leading-snug text-[var(--text-secondary)]">
          {pregunta.ayuda}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {pregunta.opciones.map((op, i) => (
          <Chip
            key={op.label}
            label={op.label}
            icon={'icon' in op ? op.icon : undefined}
            seleccionado={seleccionado === op.label || ('escape' in op && op.escape === true && mostrarInput)}
            indice={i}
            onClick={() => elegirOpcion(op)}
          />
        ))}
      </div>
      {mostrarInput && (
        <div ref={accionRef} className="mt-4 flex scroll-mb-6 flex-col gap-3">
          <input
            ref={campoRef}
            autoFocus
            value={otraCosa}
            onChange={(e) => {
              onOtraCosa(e.target.value);
              setIntentoVacio(false);
            }}
            placeholder="Cuéntame con tus palabras"
            aria-label="Escribe tu propia respuesta"
            className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]"
          />
          {!otraCosa.trim() && (
            <p
              aria-live="polite"
              className={`flex items-center gap-1.5 text-[12px] ${intentoVacio ? 'font-semibold text-[var(--error)]' : 'text-[var(--text-secondary)]'}`}
            >
              {intentoVacio && <AlertCircle size={14} />} Escribe algo para poder continuar.
            </p>
          )}
          <BotonPrimario
            onClick={() => {
              if (otraCosa.trim()) onElegir(otraCosa.trim());
              else {
                setIntentoVacio(true);
                campoRef.current?.focus();
              }
            }}
          >
            Continuar
          </BotonPrimario>
        </div>
      )}
      <p className="mt-auto pt-6 text-center text-[12px] text-[var(--text-tertiary)]">
        Tu avance se guarda solo
        <span className="hidden [@media(pointer:fine)]:inline">
          {' '}
          · Atajo: teclas 1-{pregunta.opciones.length}
        </span>
      </p>
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
  const OPCIONES_CONOCIDAS = PREGUNTAS[2].opciones.map((o) => o.label as string);
  const fracasos = respuestas.fracasos ?? '';
  const esTextoLibre = fracasos !== '' && !OPCIONES_CONOCIDAS.includes(fracasos);
  const textoLibre = fracasos.length > 60 ? fracasos.slice(0, 57).trimEnd() + '…' : fracasos;
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
            : esTextoLibre
              ? `fue porque ningún sistema se adaptó a lo que tú viviste: «${textoLibre}»`
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
        <p
          className="text-[12px] font-bold uppercase tracking-wide"
          style={{ color: 'color-mix(in oklab, var(--accent) 80%, var(--text-primary) 20%)' }}
        >
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
