import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!messages || !model) {
      return NextResponse.json({ error: "Missing messages or model" }, { status: 400 });
    }

    // HACK DE SEGURIDAD: Si el último mensaje pide una herramienta, inyectamos respuestas falsas
    // para evitar el error 400 de OpenAI
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage?.tool_calls?.length > 0) {
      lastMessage.tool_calls.forEach((tool: any) => {
        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          content: `[TracePilot Mock] Tool execution simulated successfully.`
        });
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });

    const endTime = Date.now();

    // Devolvemos el output y las métricas REALES de esta ejecución
    return NextResponse.json({ 
      newOutput: completion.choices[0]?.message || "No response",
      newTokens: completion.usage?.total_tokens || 0,
      newTimeMs: endTime - startTime
    });

  } catch (error: any) {
    // Capturamos el error real de OpenAI y lo mostramos bonito en el Dashboard
    const errorMessage = error?.error?.message || error.message || "Unknown error";
    return NextResponse.json({ error: `OpenAI API Error: ${errorMessage}` }, { status: 500 });
  }
}
