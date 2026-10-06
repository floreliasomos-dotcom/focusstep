import { NextResponse, type NextRequest } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/servidor';

// Destino del enlace del correo: canjea el código por una sesión y manda a /auth/listo.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  if (code) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/auth/listo`);
  }
  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}
