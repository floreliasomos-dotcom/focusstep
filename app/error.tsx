'use client';

// Límite de error de la app: nunca pantalla blanca ni mensaje técnico (regla UX #18).
import { Mascota } from '@/components/funnel/ui';

export default function ErrorApp({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-4 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Mascota size={72} />
      <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        Algo salió mal de nuestro lado
      </h1>
      <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">
        Tu progreso está a salvo. Intenta de nuevo; si sigue igual, vuelve en unos minutos.
      </p>
      <button
        type="button"
        onClick={reset}
        className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-white"
      >
        Intentar de nuevo
      </button>
    </main>
  );
}
