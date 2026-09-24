'use client';

// Piezas compartidas del funnel (onboarding + paywall + login) — 50-DISENO-ONBOARDING-PAYWALL.md.
// Mismos tokens de FICHA-ARTE.md que la landing (components/landing/tokens.css ya está
// importado globalmente en app/globals.css).

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, type LucideIcon } from 'lucide-react';

export function FunnelShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[var(--bg)] px-4 pb-8 pt-4 text-[var(--text-primary)] [font-family:var(--font-body)]">
      {children}
    </div>
  );
}

export function BarraProgreso({ pct, onAtras }: { pct: number; onAtras?: () => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
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
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function Chip({
  label,
  seleccionado,
  onClick,
  icon: Icon,
}: {
  label: string;
  seleccionado?: boolean;
  onClick: () => void;
  icon?: LucideIcon;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3 text-left text-[16px] font-medium transition-colors ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_22%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {Icon && (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
        >
          <Icon size={18} color="var(--accent)" />
        </span>
      )}
      <span className="flex-1">{label}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
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
  const clases =
    'flex h-14 w-full items-center justify-center rounded-[var(--radius-btn)] bg-[var(--accent)] text-[16px] font-bold text-white shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--accent)_45%,transparent)] disabled:opacity-50';
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
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={clases}
    >
      {children}
    </motion.button>
  );
}

export function PasoTransicion({ children, k }: { children: ReactNode; k: string | number }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
