export const metadata = { title: 'Empieza — FocusStep' };

// Placeholder deliberado: el recorrido de inicio real (preguntas, primera victoria) se
// construye en la Sesión 4 (ver ESTADO.md). Esta pantalla existe SOLO para que los CTA de
// la landing no apunten a un enlace muerto mientras tanto.
export default function Onboarding() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center text-[var(--text-primary)]">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">
        Tu primer paso está por llegar
      </h1>
      <p className="mt-3 max-w-sm text-base text-[var(--text-secondary)]">
        Estamos terminando el recorrido de bienvenida de FocusStep. Vuelve pronto.
      </p>
    </main>
  );
}
