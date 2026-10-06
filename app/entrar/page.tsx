'use client';

// Login de FocusStep — 50-DISENO-ONBOARDING-PAYWALL.md §E. Acceso SIN contraseña (decisión de
// 26-AUTH-MODERNO.md): Supabase Auth manda un correo con un enlace de un solo uso y un código de
// 6 dígitos; la persona usa el que le quede más cómodo. Los errores son genéricos a propósito
// (no revelan si un correo ya existe). El botón de Google queda para una mejora posterior.

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Mail, AlertCircle } from 'lucide-react';
import { BotonPrimario, FunnelShell } from '@/components/funnel/ui';
import { crearClienteNavegador } from '@/lib/supabase/client';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error' | 'fallo';

export default function Entrar() {
  // useSearchParams exige Suspense en páginas que se prerenderizan.
  return (
    <Suspense fallback={<FunnelShell><div className="flex-1" /></FunnelShell>}>
      <EntrarContenido />
    </Suspense>
  );
}

function EntrarContenido() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [enlaceVencido, setEnlaceVencido] = useState(Boolean(params.get('error')));
  const [reenvioEn, setReenvioEn] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [codigoMalo, setCodigoMalo] = useState(false);

  // Cuenta regresiva del reenvío (una sola, sin acumular temporizadores).
  useEffect(() => {
    if (reenvioEn <= 0) return;
    const t = setTimeout(() => setReenvioEn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [reenvioEn]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setEstado('error');
      return;
    }
    setEstado('enviando');
    const { error } = await crearClienteNavegador().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true },
    });
    if (error) {
      setEstado('fallo');
      return;
    }
    setEstado('enviado');
    setReenvioEn(60);
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (codigo.trim().length < 6) {
      setCodigoMalo(true);
      return;
    }
    setVerificando(true);
    setCodigoMalo(false);
    const { error } = await crearClienteNavegador().auth.verifyOtp({ email: email.trim(), token: codigo.trim(), type: 'email' });
    if (error) {
      setVerificando(false);
      setCodigoMalo(true);
      return;
    }
    router.replace('/auth/listo');
  }

  return (
    <FunnelShell>
      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <Link href="/" className="flex items-center gap-2 self-start text-[16px] font-semibold">
          <span aria-hidden="true" className="size-6 rounded-[8px] bg-[var(--accent)]" />
          FocusStep
        </Link>

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
                  setEnlaceVencido(false);
                  if (estado === 'error' || estado === 'fallo') setEstado('idle');
                }}
                placeholder="tu@correo.com"
                aria-invalid={estado === 'error'}
                className={`h-14 w-full rounded-[var(--radius-card)] border bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)] ${
                  estado === 'error'
                    ? 'border-[var(--error)]'
                    : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
                }`}
              />
              {enlaceVencido && estado === 'idle' && (
                <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                  <AlertCircle size={14} /> Ese enlace ya se usó o venció. Pide uno nuevo aquí abajo.
                </p>
              )}
              {estado === 'fallo' && (
                <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                  <AlertCircle size={14} /> No pudimos enviar el enlace. Espera un minuto e intenta de nuevo.
                </p>
              )}
              {estado === 'error' && (
                <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                  <AlertCircle size={14} /> Ese correo no se ve completo — revísalo e intenta de nuevo.
                </p>
              )}
              <BotonPrimario type="submit" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
              </BotonPrimario>
            </form>

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
            <form onSubmit={verificarCodigo} className="flex w-full flex-col gap-3">
              <label htmlFor="codigo" className="text-[12px] font-semibold text-[var(--text-secondary)]">
                ¿Prefieres escribir el código de 6 dígitos?
              </label>
              <input
                id="codigo"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.replace(/D/g, ''));
                  setCodigoMalo(false);
                }}
                placeholder="123456"
                aria-invalid={codigoMalo}
                className={`h-14 w-full rounded-[var(--radius-card)] border bg-[var(--surface)] px-4 text-center text-[24px] tracking-[0.3em] outline-none focus:border-[var(--accent)] ${
                  codigoMalo ? 'border-[var(--error)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
                }`}
              />
              {codigoMalo && (
                <p aria-live="polite" className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
                  <AlertCircle size={14} /> Ese código no es válido o ya venció. Pide uno nuevo.
                </p>
              )}
              <BotonPrimario type="submit" disabled={verificando}>
                {verificando ? 'Entrando…' : 'Entrar con el código'}
              </BotonPrimario>
            </form>
            <button
              type="button"
              disabled={reenvioEn > 0}
              onClick={() => {
                setCodigo('');
                setEstado('idle');
              }}
              className="flex min-h-11 items-center px-3 text-[12px] font-semibold text-[var(--accent)] disabled:text-[var(--text-tertiary)]"
            >
              {reenvioEn > 0 ? `Reenviar en ${reenvioEn}s` : 'Reenviar enlace'}
            </button>
          </motion.div>
        )}
      </div>
    </FunnelShell>
  );
}
