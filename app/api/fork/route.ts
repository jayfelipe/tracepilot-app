import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!messages || !model) {
      return NextResponse.json({ error: "Missing messages or model" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Ejecutamos la llamada a OpenAI con el input modificado
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });

    return NextResponse.json({ 
      newOutput: completion.choices[0]?.message || "No response" 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}