'use client';

// Envoltorio de la app interna (post-login) — distinto de FunnelShell: sin el mesh radial de
// venta, con 3 niveles de profundidad (fondo/superficie/hundido) y la TabBar siempre al fondo.
// Usa min-h-dvh (nunca la clase de altura completa que ignora la barra de UI del navegador).
// La transición de entrada vive AQUÍ (no en cada pantalla) para que las 4 pestañas de la app
// interna compartan la misma animación al cambiar de tab (defecto real detectado por el
// revisor-visual: faltaba una transición entre pantallas/tabs).

import { useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TabBar } from './TabBar';
import { iniciarSubidaAutomatica } from '@/lib/sync';

export function AppShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Mientras la app interna está abierta, cada cambio se respalda en la cuenta (si hay sesión).
  useEffect(() => iniciarSubidaAutomatica(), []);
  return (
    <div
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden text-[var(--text-primary)] [font-family:var(--font-body)]"
      style={{ background: 'var(--bg)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(560px 320px at 50% -8%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 62%)',
        }}
      />
      <motion.main
        initial={{ opacity: 0, y: reduce ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.1 : 0.18 }}
        className="flex flex-1 flex-col px-4 pb-4 pt-6"
      >
        {children}
      </motion.main>
      <TabBar />
    </div>
  );
}
