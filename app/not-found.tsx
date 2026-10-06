import Link from 'next/link';
import { Mascota } from '@/components/funnel/ui';

export const metadata = { title: 'No encontramos esa página — FocusStep' };

export default function NoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-4 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Mascota size={72} />
      <h1 className="text-balance text-[32px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        Esta página no existe
      </h1>
      <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">
        No pasa nada: volvamos a tu único paso de hoy.
      </p>
      <Link
        href="/hoy"
        className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-bold text-white"
      >
        Ir a mi día
      </Link>
      <Link href="/" className="text-[12px] font-bold text-[var(--text-secondary)] underline">
        Volver al inicio
      </Link>
    </main>
  );
}
