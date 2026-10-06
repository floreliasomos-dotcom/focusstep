'use client';

// Parada intermedia después de entrar: baja (o sube) los hábitos de la cuenta ANTES de abrir la
// app, para que /hoy ya nazca con los datos correctos y no haya un parpadeo de datos viejos.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FunnelShell, Mascota } from '@/components/funnel/ui';
import { sincronizarAlEntrar } from '@/lib/sync';

export default function Listo() {
  const router = useRouter();
  useEffect(() => {
    let cancelado = false;
    sincronizarAlEntrar().finally(() => {
      if (!cancelado) router.replace('/hoy');
    });
    return () => {
      cancelado = true;
    };
  }, [router]);

  return (
    <FunnelShell>
      <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Mascota size={64} />
        <p className="text-[16px] text-[var(--text-secondary)]">Preparando tu espacio…</p>
      </div>
    </FunnelShell>
  );
}
