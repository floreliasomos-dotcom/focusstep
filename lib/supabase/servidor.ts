import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente para código de servidor (rutas /auth): lee y escribe la sesión en cookies.
export async function crearClienteServidor() {
  const almacen = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          /* llamado desde un Server Component: el proxy ya refresca la sesión */
        }
      },
    },
  });
}
