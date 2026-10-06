import { createBrowserClient } from '@supabase/ssr';

// Cliente para el navegador: usa SOLO la clave pública (anon). La seguridad real la da RLS en la base.
export function crearClienteNavegador() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
