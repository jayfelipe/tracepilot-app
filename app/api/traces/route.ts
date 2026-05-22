import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();

  // 1. Cliente con contexto de cookies para saber QUIÉN está pidiendo los datos
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );

  // Obtener el usuario actual de forma segura
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Cliente Admin para hacer las consultas (Service Role)
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return [] }, setAll() {} } }
  );

  // 3. Obtener SOLO las trazas de este usuario
  const { data: traces, error: tracesError } = await supabaseAdmin
    .from('traces')
    .select('*')
    .eq('user_id', user.id) // <--- EL FILTRO MÁGICO DE SEGURIDAD
    .order('created_at', { ascending: false })
    .limit(10);

  if (tracesError) return NextResponse.json({ error: tracesError.message }, { status: 500 });

  // 4. Obtener los spans de esas trazas
  const traceIds = traces?.map(t => t.trace_id) || [];
  const { data: spans, error: spansError } = await supabaseAdmin
    .from('spans')
    .select('*')
    .in('trace_id', traceIds)
    .eq('user_id', user.id); // <--- DOBLE FILTRO EN SPANS TAMBIÉN

  if (spansError) return NextResponse.json({ error: spansError.message }, { status: 500 });

  // 5. Construir el árbol
  const buildTree = (traceId: string) => {
    const traceSpans = spans?.filter(s => s.trace_id === traceId) || [];
    const map = new Map();
    const roots: any[] = [];

    traceSpans.forEach(span => {
      map.set(span.span_id, { ...span, children: [] });
    });

    traceSpans.forEach(span => {
      if (span.parent_span_id && map.has(span.parent_span_id)) {
        map.get(span.parent_span_id).children.push(map.get(span.span_id));
      } else {
        roots.push(map.get(span.span_id));
      }
    });

    return roots;
  };

  const result = traces?.map(trace => ({
    ...trace,
    spans: buildTree(trace.trace_id)
  }));

  return NextResponse.json(result);
}