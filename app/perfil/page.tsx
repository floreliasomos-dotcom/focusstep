'use client';

// /perfil — plan, cómo cancelar, y los derechos de privacidad prometidos en /privacidad
// (descargar y borrar mis datos), ejecutables hoy sobre los datos locales. Cerrar sesión llega con
// la cuenta real (Sesión 6). Pantalla secundaria: medición + checklist.

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Download, Trash2, ChevronRight, AlertCircle, CreditCard } from 'lucide-react';
import { AppShell } from '@/components/app/AppShell';
import { BotonPrimario, Mascota } from '@/components/funnel/ui';
import { useHidratado } from '@/lib/hidratado';
import { borrarTodosLosDatos, exportarDatos, planActualEtiqueta } from '@/lib/habitos';

const LEGALES = [
  { href: '/privacidad', texto: 'Política de privacidad' },
  { href: '/terminos', texto: 'Términos y condiciones' },
  { href: '/reembolsos', texto: 'Reembolsos y cancelación' },
  { href: '/aviso-ia', texto: 'Aviso de inteligencia artificial' },
];

function EsqueletoPerfil() {
  return (
    <AppShell>
      <div className="h-8 w-40 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]" />
      <div className="mt-4 h-28 animate-pulse rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]" />
    </AppShell>
  );
}

export default function Perfil() {
  return useHidratado() ? <PerfilContenido /> : <EsqueletoPerfil />;
}

function PerfilContenido() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [plan] = useState(planActualEtiqueta);
  const [confirmando, setConfirmando] = useState(false);
  const [errorExportar, setErrorExportar] = useState(false);

  function descargar() {
    try {
      const blob = new Blob([JSON.stringify(exportarDatos(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mis-datos-focusstep.json';
      a.click();
      URL.revokeObjectURL(url);
      setErrorExportar(false);
    } catch {
      setErrorExportar(true);
    }
  }

  function borrar() {
    borrarTodosLosDatos();
    router.push('/');
  }

  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <Mascota size={44} />
        <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tu perfil</h1>
      </div>

      <section aria-label="Tu plan" className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]">
        <p className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-secondary)]">
          <CreditCard size={14} /> Tu plan
        </p>
        <p className="mt-1 text-[16px] font-bold">{plan.etiqueta}</p>
        {plan.esDePago ? (
          <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
            Puedes cancelar cuando quieras desde tu área de compras de Hotmart (Mis compras → tu suscripción), antes
            de que termine la prueba, y no se te cobra. ¿Dudas? Mira{' '}
            <Link href="/reembolsos" className="font-bold text-[var(--text-primary)] underline">
              reembolsos y cancelación
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3">
            <Link href="/paywall">
              <BotonPrimario>Ver planes</BotonPrimario>
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Tus datos" className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4">
        <p className="text-[12px] font-bold text-[var(--text-secondary)]">Tus datos</p>
        <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
          Hoy tus hábitos viven en este dispositivo. Son tuyos: puedes llevártelos o borrarlos cuando quieras.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Accion icono={<Download size={16} />} texto="Descargar mis datos" onClick={descargar} />
          {errorExportar && (
            <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
              <AlertCircle size={14} /> No pudimos preparar la descarga. Intenta de nuevo.
            </p>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {!confirmando ? (
              <motion.div key="pedir" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.1 : 0.15 }}>
                <Accion icono={<Trash2 size={16} />} texto="Borrar mis datos" onClick={() => setConfirmando(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="confirmar"
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.1 : 0.2 }}
                role="alertdialog"
                aria-label="Confirmar borrado"
                className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--surface)] p-3"
              >
                <p className="flex items-start gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" /> Esto borra tus hábitos y todo tu historial en este
                  dispositivo. No se puede deshacer.
                </p>
                <button
                  type="button"
                  onClick={borrar}
                  className="h-11 rounded-[var(--radius-button)] bg-[var(--error)] text-[12px] font-bold text-white"
                >
                  Sí, borrar todo
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="h-11 text-[12px] font-bold text-[var(--text-secondary)] underline"
                >
                  Cancelar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <nav aria-label="Información legal" className="mt-3 flex flex-col rounded-[var(--radius-card)] bg-[var(--surface)] px-4 shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]">
        {LEGALES.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex h-12 items-center justify-between text-[16px] ${
              i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-secondary)_15%,transparent)]' : ''
            }`}
          >
            {l.texto} <ChevronRight size={16} color="var(--text-secondary)" />
          </Link>
        ))}
      </nav>
    </AppShell>
  );
}

function Accion({ icono, texto, onClick }: { icono: React.ReactNode; texto: string; onClick: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--surface)] text-[12px] font-bold text-[var(--text-secondary)]"
    >
      {icono} {texto}
    </motion.button>
  );
}
