import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Guardia de la app interna: sin sesión válida, /hoy /habitos /progreso /perfil mandan a /entrar.
// Usa getUser() (valida el token con Supabase) — nunca confía solo en la cookie.
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.search = '?origen=sesion';
    return NextResponse.redirect(url);
  }
  return respuesta;
}

export const config = {
  // Debe ser literal (Next lo lee al compilar): las 4 pantallas de la app interna.
  matcher: ['/hoy/:path*', '/habitos/:path*', '/progreso/:path*', '/perfil/:path*'],
};
