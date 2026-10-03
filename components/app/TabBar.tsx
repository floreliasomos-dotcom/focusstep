'use client';

// Barra de navegación de la app interna — 4 destinos (regla de UX #3: 3-5 secciones).
// Mismo brand kit de FICHA-ARTE.md; visual heredado de vista-previa-app.html (V1 Home).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, LayoutGrid, CircleUserRound } from 'lucide-react';

const DESTINOS = [
  { href: '/hoy', label: 'Hoy', icon: Home },
  { href: '/progreso', label: 'Progreso', icon: TrendingUp },
  { href: '/habitos', label: 'Hábitos', icon: LayoutGrid },
  { href: '/perfil', label: 'Perfil', icon: CircleUserRound },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-10 mt-auto flex items-stretch justify-around border-t border-[color-mix(in_oklab,var(--text-secondary)_15%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      {DESTINOS.map(({ href, label, icon: Icon }) => {
        const activo = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? 'page' : undefined}
            className={`flex min-w-11 flex-col items-center gap-1 px-3 py-1 text-[12px] font-semibold ${
              activo ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <span
              className={`flex h-6 w-9 items-center justify-center rounded-[8px] ${
                activo ? 'bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]' : ''
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
