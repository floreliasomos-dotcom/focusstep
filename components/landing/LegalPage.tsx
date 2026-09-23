import type { ReactNode } from 'react';

// Shell mínimo y reutilizable para las páginas legales del footer (19 §10 / 47).
// Usa SOLO la escala tipográfica y de espaciado estándar de Tailwind — nada
// arbitrario — y los tokens de FICHA-ARTE vía las variables de tokens.css.

export function LegalPage({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[var(--text-primary)]">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">{titulo}</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: {actualizado}</p>
      <div className="mt-8 space-y-6 text-base leading-7 text-[var(--text-secondary)]">
        {children}
      </div>
    </main>
  );
}

export function LegalSection({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{titulo}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
