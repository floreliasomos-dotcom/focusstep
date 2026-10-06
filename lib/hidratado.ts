'use client';

// true solo en el navegador, ya hidratado; false en el servidor y en el primer render del cliente.
// Permite leer localStorage/sessionStorage SIN setState dentro de un efecto: la pantalla se parte
// en un envoltorio (espera a estar hidratado) y un contenido que arranca ya con sus datos reales.
import { useSyncExternalStore } from 'react';

const sinSuscripcion = () => () => {};

export function useHidratado(): boolean {
  return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}
