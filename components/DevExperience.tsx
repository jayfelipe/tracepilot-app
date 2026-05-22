"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, Check, Copy, Terminal, TerminalSquare, RefreshCw, 
  Settings, Puzzle, HeartHandshake, ShieldCheck, HelpCircle
} from 'lucide-react';

interface CodeSample {
  id: string;
  lang: string;
  filename: string;
  code: string;
}

const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'ts',
    lang: 'TypeScript',
    filename: 'agent_pilot.ts',
    code: `import { TracePilot } from '@tracepilot/sdk';
import { GoogleGenAI } from '@google/genai';

// Initialize with zero-overhead tracing middleware
const tp = new TracePilot({
  apiKey: process.env.TRACE_PILOT_KEY,
  environment: 'production'
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runAutonomousBroker(userInput: string) {
  // Spawn trace context holding system variables & states
  return await tp.trace('broker-sales-run', async (context) => {
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: userInput,
      // Track model tools & outputs natively
      tools: [{ functionDeclarations: [ fetchPortfolios ] }]
    });

    // Automatically records tool invocations, tokens, latency
    context.logToolCall({
      name: 'fetchPortfolios',
      args: { location: 'BOG-01' },
      output: response
    });

    return response.text;
  });
}`
  },
  {
    id: 'py',
    lang: 'Python SDK',
    filename: 'agent_pilot.py',
    code: `from tracepilot import TracePilotClient
from google import genai
import os

# Create standard wrapper
tp = TracePilotClient(
    api_key=os.environ["TRACE_PILOT_KEY"],
    environment="production"
)

def handle_request(prompt: str):
    # Context managers rehydrate memory stacks automatically
    with tp.trace_session("valuation-broker") as ctx:
        ctx.set_metadata({"user_tier": "enterprise"})
        
        client = genai.Client()
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=prompt,
        )
        
        ctx.log_llm_call(
            model='gemini-2.5-pro',
            prompt=prompt,
            response=response.text,
            token_count=response.usage_metadata.total_token_count
        )
        return response.text`
  },
  {
    id: 'json',
    lang: 'Raw JSON Schema',
    filename: 'trace_payload.json',
    code: `{
  "$schema": "https://tracepilot.ai/schemas/v1/trace.json",
  "sessionId": "sesh_df293c",
  "sessionTimestamp": 1716293060,
  "environment": {
    "node_version": "v22.2.0",
    "region": "us-east-1"
  },
  "metrics": {
    "totalCyclesCost": 0.048,
    "totalDurationMs": 1420
  },
  "edges": [
    { "from": "state_init", "to": "llm_routing_call" },
    { "from": "llm_routing_call", "to": "weather_api_call" }
  ]
}`
  }
];

interface DevExperienceProps {
  lang?: 'en' | 'es';
}

export default function DevExperience({ lang = 'en' }: DevExperienceProps) {
  const [activeTab, setActiveTab] = useState<string>('ts');
  const [copied, setCopied] = useState<boolean>(false);
  const activeSample = CODE_SAMPLES.find(s => s.id === activeTab) || CODE_SAMPLES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#050505] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl text-left grid grid-cols-1 lg:grid-cols-12">
      
      {/* Code Area - 7 Columns */}
      <div className="lg:col-span-7 bg-[#020202] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
        
        {/* Editor tabs */}
        <div className="flex items-center justify-between bg-neutral-900/60 border-b border-neutral-800 px-4 py-2 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/20" />
            <span className="text-xs font-mono font-bold text-neutral-400">INTEPIN_MOCK_ENV</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {CODE_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setActiveTab(sample.id);
                  setCopied(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer ${
                  activeTab === sample.id
                    ? 'bg-neutral-800 text-cyan-400 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {sample.lang}
              </button>
            ))}
          </div>
        </div>

        {/* Selected file title panel */}
        <div className="bg-neutral-950 p-2 border-b border-neutral-900 flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs font-mono font-medium text-neutral-400">{activeSample.filename}</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 flex items-center space-x-1.5 transition hover:cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Copiar Código' : 'Copy Raw'}</span>
              </>
            )}
          </button>
        </div>

        {/* Pre block */}
        <div className="p-4 overflow-auto max-h-[360px] min-h-[300px] flex-1">
          <pre className="text-xs text-neutral-305 font-mono leading-relaxed whitespace-pre font-medium overflow-x-auto text-zinc-300">
            {activeSample.code.split('\n').map((line, idx) => {
              // Tiny mock syntax parsing for gorgeous style pairings
              const isComment = line.trim().startsWith('//') || line.trim().startsWith('#');
              const isImport = line.trim().startsWith('import') || line.trim().startsWith('from');
              
              let lineClass = 'text-neutral-300';
              if (isComment) lineClass = 'text-neutral-600 italic';
              else if (isImport) lineClass = 'text-cyan-400';
              else if (line.includes('TracePilot') || line.includes('const') || line.includes('def ')) lineClass = 'text-white';
              
              return (
                <div key={idx} className="flex">
                  <span className="text-neutral-700 w-6 select-none border-r border-neutral-900 pr-2 mr-3 text-right">{idx + 1}</span>
                  <span className={lineClass}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Footer info banner */}
        <div className="bg-neutral-950 px-4 py-2.5 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>{lang === 'es' ? 'Paquete SDK: ' : 'SDK package size: '}<b>2.1 kB bundled</b></span>
          <span>OpenTelemetry Compliant</span>
        </div>

      </div>

      {/* Overview stats - 5 Columns */}
      <div className="lg:col-span-5 p-5 sm:p-6 bg-neutral-950 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            {lang === 'es' ? 'INTEGRACIONES SIN SOBRECOSTOS' : 'ZERO OVERHEAD INTEGRATIONS'}
          </span>
          <h3 className="text-xl font-bold font-display text-white">
            {lang === 'es' ? 'Integra en Cuestión de Minutos' : 'Integrate in Minutes'}
          </h3>
          
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            {lang === 'es'
              ? 'Añade TracePilot mediante npm o pip. Nos acoplamos de forma nativa a la definición de tus herramientas, rastreando variables críticas sin interrumpir las evaluaciones activas.'
              : 'Add TracePilot via npm or pip. We hook natively into tool definition layers, tracking variables in asynchronous stacks without interrupting active prompt evaluations.'}
          </p>
        </div>

        {/* Beautiful diagnostic features check lines */}
        <div className="space-y-3.5">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 bg-cyan-950 p-1.5 rounded border border-cyan-900/40">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase font-mono">
                {lang === 'es' ? 'Menos de 5ms de latencia añadida' : 'Under 5ms tracing overhead'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                {lang === 'es'
                  ? 'Agrupamos lotes de ejecución mediante canales de alta velocidad, garantizando que el tiempo de respuesta del modelo se mantenga intacto.'
                  : 'We batch execution trees through high-speed UDP pipes, ensuring model execution latency is preserved.'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-0.5 bg-cyan-950 p-1.5 rounded border border-cyan-900/40">
              <RefreshCw className="w-4 h-4 text-cyan-400 font-bold" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase font-mono">
                {lang === 'es' ? 'Frameworks de Agentes Nativos' : 'Native Agentic Frameworks'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                {lang === 'es'
                  ? 'Compatible sin configuraciones adicionales con OpenAI Assistants, CrewAI, LangChain, Autogen y protocolos MCP.'
                  : 'Compatible out-of-the-box with OpenAI Assistants, CrewAI, LangChain, Autogen, and MCP integrations.'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-0.5 bg-cyan-950 p-1.5 rounded border border-cyan-900/40">
              <Puzzle className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase font-mono">
                {lang === 'es' ? 'Variables y Logs de Entorno' : 'Variables & Environment Logs'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                {lang === 'es'
                  ? 'Registra dependencias del sistema, semillas de modelo, límites de temperatura y capturas de bases de datos.'
                  : 'Records environment dependencies, model seed values, temperature limits, and database snapshots.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-900">
          <span className="text-[10px] text-neutral-500 font-mono block">
            {lang === 'es' ? 'ESTÁNDAR DE DESARROLLO' : 'DEVELOPMENT STANDARD'}
          </span>
          <p className="text-[11px] text-neutral-400 mt-1 font-sans">
            {lang === 'es'
              ? 'Sin reestructuración de código. Reemplazar tu SDK con TracePilot respeta las estructuras asíncronas de tu código.'
              : 'No code restructuring required. Swapping your SDK package to TracePilot preserves standard async-await structures.'}
          </p>
        </div>

      </div>

    </div>
  );
}
