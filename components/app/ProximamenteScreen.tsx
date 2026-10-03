// Estado "próximamente" honesto para las pestañas que la app interna aún no construye en esta
// sesión — nunca un ícono tapable sin acción (regla de UX #11).

import { Mascota } from '@/components/funnel/ui';

export function ProximamenteScreen({ titulo, mensaje }: { titulo: string; mensaje: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <Mascota size={56} />
      <h1 className="text-[24px] font-bold [font-family:var(--font-display)]">{titulo}</h1>
      <p className="max-w-[28ch] text-[16px] text-[var(--text-secondary)]">{mensaje}</p>
    </div>
  );
}
