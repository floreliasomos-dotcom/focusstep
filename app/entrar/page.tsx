'use client';

// Login de FocusStep — 50-DISENO-ONBOARDING-PAYWALL.md §E. Magic link como método primario
// (sin contraseñas, decisión Hotmart-first de 26-AUTH-MODERNO.md). El envío real (Resend +
// Supabase Auth) se conecta en Sesión 6 — aquí el estado ENVIANDO/ENVIADO/ERROR es una
// simulación honesta en el navegador (mock, ver C3ter del 50), nunca un envío real todavía.

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { BotonPrimario, FunnelShell } from '@/components/funnel/ui';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [reenvioEn, setReenvioEn] = useState(0);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setEstado('error');
      return;
    }
    setEstado('enviando');
    setTimeout(() => {
      setEstado('enviado');
      setReenvioEn(60);
      const iv = setInterval(() => {
        setReenvioEn((s) => {
          if (s <= 1) {
            clearInterval(iv);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }, 900);
  }

  return (
    <FunnelShell>
      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <a href="/" className="flex items-center gap-2 self-start text-[16px] font-semibold">
          <span aria-hidden="true" className="size-6 rounded-[8px] bg-[var(--accent)]" />
          FocusStep
        </a>

        {estado !== 'enviado' ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.06 }}
          >
            <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
              Entra a tu plan
            </h1>
            <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
              Para guardarlo y verlo en cualquier dispositivo.
            </p>

            <form onSubmit={enviar} className="mt-8 flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (estado === 'error') setEstado('idle');
                }}
                placeholder="tu@correo.com"
                aria-invalid={estado === 'error'}
                className={`h-14 w-full rounded-[var(--radius-card)] border bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)] ${
                  estado === 'error'
                    ? 'border-[var(--accent)]'
                    : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
                }`}
              />
              {estado === 'error' && (
                <p aria-live="polite" className="text-[12px] font-semibold text-[var(--accent)]">
                  Ese correo no se ve completo — revísalo e intenta de nuevo.
                </p>
              )}
              <BotonPrimario type="submit" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
              </BotonPrimario>
            </form>

            <button
              type="button"
              className="mt-3 flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--surface)] text-[16px] font-semibold"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/google-g.svg" alt="" width={18} height={18} aria-hidden="true" />
              Continuar con Google
            </button>

            <p className="mt-4 text-center text-[12px] text-[var(--text-tertiary)]">
              Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <span
              className="flex size-16 items-center justify-center rounded-full"
              style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
            >
              <Mail size={28} color="var(--accent)" />
            </span>
            <h1 className="text-[24px] font-bold [font-family:var(--font-display)]">Revisa tu correo</h1>
            <p className="max-w-[32ch] text-[16px] text-[var(--text-secondary)]">
              Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
            </p>
            <button
              type="button"
              disabled={reenvioEn > 0}
              onClick={() => setEstado('idle')}
              className="text-[12px] font-semibold text-[var(--accent)] disabled:text-[var(--text-tertiary)]"
            >
              {reenvioEn > 0 ? `Reenviar en ${reenvioEn}s` : 'Reenviar enlace'}
            </button>
          </motion.div>
        )}
      </div>
    </FunnelShell>
  );
}
