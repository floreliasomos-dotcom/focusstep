'use client';

// Piezas compartidas del funnel (onboarding + paywall + login) — 50-DISENO-ONBOARDING-PAYWALL.md.
// Mismos tokens de FICHA-ARTE.md que la landing (components/landing/tokens.css ya está
// importado globalmente en app/globals.css).

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, type LucideIcon } from 'lucide-react';

// Mascota blob — el dispositivo ownable de FICHA-ARTE.md (el mismo de direcciones-abc.html /
// vista-previa-app.html), reconstruido aquí en código real para que el onboarding no pierda
// la identidad de marca.
export function Mascota({ size = 64, contenta = false }: { size?: number; contenta?: boolean }) {
  return (
    <span
      role="img"
      aria-label={contenta ? 'Mascota de FocusStep sonriendo' : 'Mascota de FocusStep'}
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size * 0.92,
        borderRadius: '61% 39% 55% 45% / 45% 55% 42% 58%',
        background: contenta ? 'var(--success)' : 'var(--mascota)',
      }}
    >
      <span className="absolute rounded-full bg-[var(--text-primary)]" style={{ width: size * 0.1, height: size * 0.1, left: '34%', top: '40%' }} />
      <span className="absolute rounded-full bg-[var(--text-primary)]" style={{ width: size * 0.1, height: size * 0.1, left: '58%', top: '40%' }} />
      <span
        className="absolute rounded-b-full border-b-2 border-[var(--text-primary)]"
        style={{ width: size * 0.18, height: size * 0.1, left: '41%', top: '54%' }}
      />
    </span>
  );
}

export function FunnelShell({ children }: { children: ReactNode }) {
  return (
    <main
      className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden px-4 pb-8 pt-4 text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(720px 460px at 50% -10%, color-mix(in oklab, var(--accent) 60%, transparent) 0%, transparent 62%), ' +
            'radial-gradient(600px 420px at 100% 105%, color-mix(in oklab, var(--accent-2) 50%, transparent) 0%, transparent 58%)',
        }}
      />
      {children}
    </main>
  );
}

export function BarraProgreso({
  pct,
  onAtras,
  onSalir,
  pasoActual,
  totalPasos,
}: {
  pct: number;
  onAtras?: () => void;
  /** Salida global del funnel (siempre visible, distinta del "Atrás" por pregunta). */
  onSalir?: () => void;
  pasoActual?: number;
  totalPasos?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-center gap-3">
        {onAtras ? (
          <button
            type="button"
            onClick={onAtras}
            aria-label="Atrás"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div className="size-11 shrink-0" aria-hidden="true" />
        )}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-secondary)_15%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 18 }}
          />
        </div>
        {onSalir && (
          <button
            type="button"
            onClick={onSalir}
            aria-label="Salir del recorrido"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {pasoActual && totalPasos && (
        <p aria-live="polite" className="text-center text-[12px] font-semibold text-[var(--text-secondary)]">
          Pregunta {pasoActual} de {totalPasos}
        </p>
      )}
    </div>
  );
}

export function Chip({
  label,
  seleccionado,
  onClick,
  icon: Icon,
  indice = 0,
}: {
  label: string;
  seleccionado?: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  indice?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.25, delay: reduce ? 0 : indice * 0.07 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`flex min-h-16 w-full items-center gap-3 rounded-[var(--radius-card)] border px-3 py-3 text-left text-[16px] font-medium transition-colors ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_22%,transparent)] bg-[var(--surface)] shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]'
      }`}
    >
      {Icon && (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)]"
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
        >
          <Icon size={18} color="var(--accent)" />
        </span>
      )}
      <span className="min-w-0 flex-1 text-balance">{label}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: reduce ? 1 : 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0.1 : 0.2 }}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

export function BotonPrimario({
  children,
  onClick,
  href,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const reduce = useReducedMotion();
  const clases =
    'flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-white shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--accent)_45%,transparent)] disabled:opacity-50';
  if (href && !disabled) {
    return (
      <a href={href} className={clases}>
        {children}
      </a>
    );
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled || reduce ? undefined : { scale: 0.98 }}
      className={clases}
    >
      {children}
    </motion.button>
  );
}

export function PasoTransicion({ children, k }: { children: ReactNode; k: string | number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, x: reduce ? 0 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : -24 }}
      transition={{ duration: reduce ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
