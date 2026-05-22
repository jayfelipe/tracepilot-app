import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  // Creamos un cliente de Supabase con acceso a las cookies del usuario logueado
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  // Obtenemos el usuario actual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Usamos el cliente ADMIN para buscar la API Key de este usuario
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // LLAVE MAESTRA
    {
      cookies: { getAll() { return [] }, setAll() {} } // Dummy para admin
    }
  );

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('api_key')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });
  }

  return NextResponse.json({ api_key: data.api_key });
}