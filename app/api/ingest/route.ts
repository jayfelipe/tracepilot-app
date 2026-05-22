import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener la API Key del header del SDK
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }
    const apiKey = authHeader.split(' ')[1];

    // 2. Conectar a Supabase con privilegios de ADMIN (Service Role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // <--- CLAVE SECRETA AQUÍ
    );

    // 3. Validar si la API Key existe y está activa
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, is_active, user_id') // <--- AÑADIMOS user_id AQUÍ
      .eq('api_key', apiKey)
      .single();

    if (keyError || !keyData || !keyData.is_active) {
      return NextResponse.json({ error: "Invalid or inactive API Key" }, { status: 403 });
    }

    // 4. Si la key es válida, procesar los datos
    const body = await req.json();
    const { type, payload } = body;

    // INYECTAR EL USER_ID AUTOMÁTICAMENTE DESDE LA API KEY
    // Así el SDK no necesita saber quién es el usuario, lo resuelve el backend
    payload.user_id = keyData.user_id; 

    if (type === 'trace') {
      const { error: insertError } = await supabase.from('traces').insert(payload);
      if (insertError) throw insertError;
    } else if (type === 'span') {
      const { error: insertError } = await supabase.from('spans').insert(payload);
      if (insertError) throw insertError;
    } else {
      return NextResponse.json({ error: "Invalid payload type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}