"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitCommit, GitMerge, FileCode, CheckCircle, ArrowRight, Sparkles, 
  Trash2, Edit3, HelpCircle, CornerDownRight, PlayCircle, Layers
} from 'lucide-react';

interface TimelineStep {
  phase: number;
  label: string;
  badge: string;
  title: string;
  description: string;
  originalCode: string;
  fixedCode: string;
  visualState: 'fail' | 'empty' | 'diff' | 'success';
}

const TIMELINE_PHASES: TimelineStep[] = [
  {
    phase: 1,
    label: '1. Production Failure',
    badge: 'CRITICAL WARNING',
    title: 'The Agent Fails in Production',
    description: 'An autonomous agent performing multi-step data consolidation is running. Suddenly, a weather API is queried using a relative lookup. The target returns invalid data formats, throwing a runtime GeographyException and stalling the agent in an infinite loop.',
    originalCode: '{\n  "tool": "WeatherAPI",\n  "action": "forecast",\n  "arguments": {\n    "city": "New York, France"\n  }\n}',
    fixedCode: '{\n  "tool": "WeatherAPI",\n  "action": "forecast",\n  "arguments": {\n    "city": "New York, France"\n  }\n}',
    visualState: 'fail'
  },
  {
    phase: 2,
    label: '2. Open Execution Trace',
    badge: 'STATE REHYDRATED',
    title: 'Inspect Trace Tree',
    description: 'Engineering logs into TracePilot AI. The entire history is mapped inside a state snapshot. We can visualize prompt variables, state variables, cost summaries, and system environments exactly at the failure packet line.',
    originalCode: '// Trace is standard JSON-serializable state.\n{\n  "session_id": "tp_sesh_98ef1",\n  "error_node": "step_5_weather_lookup",\n  "system_prompts": ["system_prompt.jinja"],\n  "env": { "model": "gemini-2.5-pro" }\n}',
    fixedCode: '// Trace is standard JSON-serializable state.\n{\n  "session_id": "tp_sesh_98ef1",\n  "error_node": "step_5_weather_lookup",\n  "system_prompts": ["system_prompt.jinja"],\n  "env": { "model": "gemini-2.5-pro" }\n}',
    visualState: 'diff'
  },
  {
    phase: 3,
    label: '3. Fork State Live',
    badge: 'BRANCH CREATED',
    title: 'Fork and Isolate Environment',
    description: 'By hitting the "Fork" button on the failing node, we create a parallel sandbox container. It copies the entire prompt, tools array, database contexts, and historical memory, isolating the runtime safely without restarting the entire task or affecting main users.',
    originalCode: 'git-pilot checkout -b hotfix-run-4\n// Sandbox VM starts pointing to isolated replica of memories',
    fixedCode: 'git-pilot checkout -b hotfix-run-4\n// Sandbox VM starts pointing to isolated replica of memories',
    visualState: 'empty'
  },
  {
    phase: 4,
    label: '4. Edit State & Prompt',
    badge: 'PATCH PREPARED',
    title: 'Rectify State Variables',
    description: 'Developers swap inaccurate parameters inside the sandbox environment. We specify the true target variable to prevent model hallucinations and correct tool parameters in a modern inline JSON editor.',
    originalCode: '-   "city": "New York, France"',
    fixedCode: '+   "city": "New York City, NY"',
    visualState: 'diff'
  },
  {
    phase: 5,
    label: '5. Rerun & Merge Fix',
    badge: 'REPLAY SUCCESS',
    title: 'Hot Reload with Green Light',
    description: 'TracePilot replays the rest of the execution from this exact patch step onwards. The system prompt incorporates correct information, tools output cleanly, and the agent completes its automated summary correctly in 210ms without infinite iteration loops.',
    originalCode: '// original status: RUNAWAY_LOOP_FATAL',
    fixedCode: '// final status: WORKFLOW_COMPLETED_SUCCESS\n// saved battery charge metrics, completed Slack report successfully!',
    visualState: 'success'
  }
];

const TIMELINE_PHASES_ES = [
  {
    phase: 1,
    label: '1. Fallo de Producción',
    badge: 'ALERTA CRÍTICA',
    title: 'El agente falla en producción',
    description: 'Un agente autónomo que consolida datos se está ejecutando. De repente, consulta una API meteorológica mediante una búsqueda de coordenadas relativas. El destino devuelve formatos no válidos, lo que provoca una excepción GeographyException y estanca al agente en un bucle infinito.'
  },
  {
    phase: 2,
    label: '2. Analizar Trazas',
    badge: 'ESTADO REHIDRATADO',
    title: 'Inspeccionar el árbol de trazas',
    description: 'El equipo de ingeniería inicia sesión en TracePilot AI. Toda la historia de llamadas queda mapeada dentro de una captura de estado. Podemos visualizar variables de prompt, costes, dependencias y el entorno del sistema exactamente en la línea de fallo.'
  },
  {
    phase: 3,
    label: '3. Bifurcar Estado',
    badge: 'RAMA CREADA',
    title: 'Bifurcar y aislar el entorno',
    description: 'Al presionar el botón "Fork" en el nodo con error, creamos un contenedor de sandbox en paralelo. Éste duplica el prompt exacto, las herramientas, el contexto de BD y el historial, aislando la sesión de forma segura sin afectar a los usuarios reales ni reiniciar el proceso.'
  },
  {
    phase: 4,
    label: '4. Editar Estado',
    badge: 'PARCHE PREPARADO',
    title: 'Rectificar variables de prompt',
    description: 'Los desarrolladores corrigen los parámetros erróneos desde el entorno aislado de sandbox. Especificamos el valor real de destino para detener la alucinación del modelo y reescribimos el JSON en un editor de código interactivo integrado.'
  },
  {
    phase: 5,
    label: '5. Ejecutar y Unir',
    badge: 'REPLAY CON ÉXITO',
    title: 'Completado con luz verde',
    description: 'TracePilot reproduce el resto de la ejecución desde el parche en adelante. El prompt del sistema incorpora la información real, las herramientas se ejecutan de manera limpia y el agente finaliza su tarea con éxito en 210ms sin bucles de consultas.'
  }
];

interface TimelineVisualizerProps {
  lang?: 'en' | 'es';
}

export default function TimelineVisualizer({ lang = 'en' }: TimelineVisualizerProps) {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const activeStep = TIMELINE_PHASES.find(t => t.phase === currentPhase) || TIMELINE_PHASES[0];
  const esStep = TIMELINE_PHASES_ES.find(t => t.phase === currentPhase) || TIMELINE_PHASES_ES[0];

  const displayLabel = lang === 'es' ? esStep.label : activeStep.label;
  const displayBadge = lang === 'es' ? esStep.badge : activeStep.badge;
  const displayTitle = lang === 'es' ? esStep.title : activeStep.title;
  const displayDesc = lang === 'es' ? esStep.description : activeStep.description;

  return (
    <div className="w-full bg-[#070707] border border-neutral-800 rounded-xl overflow-hidden shadow-xl p-5 sm:p-6 text-left relative">
      <div className="absolute top-0 right-12 w-64 h-16 bg-brand-cyan/5 blur-xl rounded-full" />
      
      {/* Upper Grid header info */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
            {lang === 'es' ? 'Guía Interactiva de Pasos' : 'Interactive Walkthrough'}
          </span>
          <h3 className="text-xl font-bold font-display text-white mt-1">
            {lang === 'es' ? 'Proceso de Depuración de Rebobinado Temporal' : 'Time-Travel Troubleshooting Process'}
          </h3>
        </div>
        
        {/* Step progress summary */}
        <div className="flex items-center space-x-1.5 self-start md:self-auto bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
          <span className="text-xs font-mono text-neutral-400">
            {lang === 'es' ? 'Progreso de Etapa:' : 'Step Progression:'}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">{currentPhase} / 5</span>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-6">
        {TIMELINE_PHASES.map((step, idx) => {
          const isActive = step.phase === currentPhase;
          const isDone = step.phase < currentPhase;
          const stepES = TIMELINE_PHASES_ES[idx];
          const tabLabel = lang === 'es' ? stepES.label.slice(3) : step.label.slice(3);

          return (
            <button
              key={step.phase}
              onClick={() => setCurrentPhase(step.phase)}
              className={`px-2 py-2.5 rounded-lg border text-center transition hover:cursor-pointer flex flex-col justify-between h-16 text-left ${
                isActive 
                  ? 'bg-neutral-900 border-cyan-500/60 shadow-lg' 
                  : isDone
                  ? 'bg-neutral-950/40 border-neutral-800/40 text-neutral-400'
                  : 'bg-neutral-950 border-neutral-900 text-neutral-500 hover:border-neutral-850'
              }`}
            >
              <span className={`text-[9px] font-mono uppercase tracking-wider ${isActive ? 'text-cyan-400 font-bold' : isDone ? 'text-emerald-500' : 'text-neutral-500'}`}>
                {isDone ? (lang === 'es' ? '✓ ETAPA ' : '✓ PHASE ') + step.phase : (lang === 'es' ? 'PASO ' : 'STEP ') + step.phase}
              </span>
              <span className="text-[11px] font-semibold truncate text-neutral-200">{tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Grid: 2 columns workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left pane: Description & visual state metadata */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <span className={`inline-block text-[9px] font-semibold font-mono px-2 py-0.5 rounded ${
                currentPhase === 1 
                  ? 'bg-red-950 text-red-400 border border-red-900/40' 
                  : currentPhase === 5 
                  ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-900/40'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-900/40'
              }`}>
                {displayBadge}
              </span>

              <h4 className="text-lg font-bold font-display text-white">{displayTitle}</h4>
              
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {displayDesc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Prompt / Branch lineage tracker */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">
              {lang === 'es' ? 'Linaje de Sesiones en Sandbox' : 'Historical Sandbox Lineage'}
            </span>
            
            <div className="space-y-1 bg-[#0a0a0a] p-3 rounded-lg border border-neutral-900 font-mono text-xs text-neutral-400">
              <div className="flex items-center space-x-2 text-cyan-400 text-[11px] font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>ENVIRONMENT SNAPSHOT</span>
              </div>
              <div className="mt-1.5 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Parent Trace ID:</span>
                  <span className="text-neutral-200">trc_node_master_v90</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Sandbox:</span>
                  <span className={`${currentPhase >= 3 ? 'text-cyan-400 font-semibold' : 'text-neutral-500'}`}>
                    {currentPhase >= 3 ? 'sandbox_active_node_5' : 'production_master'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Branch state:</span>
                  <span className="text-neutral-200">
                    {currentPhase === 5 
                      ? (lang === 'es' ? 'Completado y Fusionado' : 'Merged & Solved') 
                      : (lang === 'es' ? 'Aislamiento de Pruebas' : 'Isolated Debug')}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper buttons (Next & Previous) */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setCurrentPhase(prev => Math.max(1, prev - 1))}
                disabled={currentPhase === 1}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 text-neutral-300 px-3 py-1.5 rounded text-xs border border-neutral-800 hover:cursor-pointer font-medium"
              >
                {lang === 'es' ? 'Paso Anterior' : 'Previous Step'}
              </button>
              <button
                onClick={() => setCurrentPhase(prev => Math.min(5, prev + 1))}
                disabled={currentPhase === 5}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-900 disabled:text-neutral-600 border border-neutral-850 text-black px-3 py-1.5 rounded text-xs px-4 text-center hover:cursor-pointer font-bold transition flex items-center space-x-1"
              >
                <span>
                  {currentPhase === 5 
                    ? (lang === 'es' ? 'Completado' : 'Completed') 
                    : (lang === 'es' ? 'Avanzar Etapa' : 'Advance Stage')}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right pane: Beautiful simulated code terminal / graph changes */}
        <div className="lg:col-span-7 bg-[#050505] rounded-xl border border-neutral-800 p-4 font-mono text-xs flex flex-col justify-between max-h-[380px] min-h-[310px]">
          
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              <span className="text-[10px] text-zinc-500 ml-2">sandbox-editor :/usr/src/app</span>
            </div>
            
            <div className="bg-neutral-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-neutral-850">
              {currentPhase === 4 ? 'PROMPT_DIFF' : 'CODE_VIEWER'}
            </div>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col justify-between"
              >
                {activeStep.visualState === 'fail' && (
                  <div className="space-y-4">
                    <div className="text-red-400 bg-red-950/20 border-l-2 border-red-500 p-3 rounded">
                      <div className="font-bold flex items-center gap-1">
                        <span>❌ GeoRequestException : {lang === 'es' ? 'Variable geográfica no válida' : 'Invalid geography variable'}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-1">
                        {lang === 'es' 
                          ? 'No se puede localizar la estación metereológica dentro de la entidad: "New York, France". ¿Quiso decir New York City, NY?'
                          : 'Cannot locate weather station inside entity: "New York, France". Did you mean New York City, NY?'}
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-3 rounded border border-neutral-900">
                      <span className="text-[10px] text-neutral-500 block mb-1 uppercase">
                        {lang === 'es' ? 'Parámetros Enviados' : 'Parameters Sent'}
                      </span>
                      <pre className="text-neutral-300">{activeStep.originalCode}</pre>
                    </div>
                  </div>
                )}

                {activeStep.visualState === 'diff' && (
                  <div className="space-y-3">
                    {currentPhase === 4 ? (
                      <div className="space-y-2 bg-[#020202] p-3 rounded border border-neutral-900">
                        <div className="text-slate-500 text-[10px] uppercase mb-1">
                          {lang === 'es' ? 'Anulaciones de Código Aplicadas:' : 'Interactive Code Overrides Applied:'}
                        </div>
                        <div className="text-red-400 bg-red-950/20 px-2 py-1 rounded">
                          {activeStep.originalCode}
                        </div>
                        <div className="text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded">
                          {activeStep.fixedCode}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-neutral-950 p-3 rounded border border-neutral-900">
                        <span className="text-[10px] text-neutral-500 block mb-1 uppercase">
                          {lang === 'es' ? 'Volcado de Trazas de Manifiesto' : 'Trace Manifest Dump'}
                        </span>
                        <pre className="text-zinc-300 max-h-[160px] overflow-auto whitespace-pre">{activeStep.originalCode}</pre>
                      </div>
                    )}
                  </div>
                )}

                {activeStep.visualState === 'empty' && (
                  <div className="space-y-3">
                    <div className="text-cyan-400 bg-cyan-950/25 border-l-2 border-cyan-500 p-3 rounded">
                      <p className="font-bold">✓ checkout new-pilot sandbox branch: "fixed-bogota-run"</p>
                      <p className="text-[11px] text-neutral-300 mt-1">
                        {lang === 'es'
                          ? 'Instancia cargada exitosamente. Las variables de estado, simulaciones de base de datos y memoria están listas en el sandbox de ejecución virtual.'
                          : 'Snapshot instantiated. State variables, database query mocks, and context are fully hot-loaded on sandbox virtual runner.'}
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-3 rounded border border-neutral-900">
                      <span className="text-[10px] text-neutral-500 block mb-1">TERMINAL SHELL</span>
                      <pre className="text-neutral-400">{activeStep.originalCode}</pre>
                    </div>
                  </div>
                )}

                {activeStep.visualState === 'success' && (
                  <div className="space-y-3">
                    <div className="text-emerald-400 bg-emerald-950/10 border-l-2 border-emerald-500 p-3 rounded">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {lang === 'es' ? '¡Éxito de traza fusionado a producción!' : 'Trace success merged to master!'}
                      </p>
                      <p className="text-[11px] text-neutral-300 mt-1">
                        {lang === 'es' ? 'Costo de API de red ahorrado: ' : 'Total Saved API Cost: '}<strong>{lang === 'es' ? '$0.52 (Bucle detenido)' : '$0.52 (Killed loop)'}</strong> | {lang === 'es' ? 'Duración de Reejecución: ' : 'Rerun Duration: '}<strong>1.22s</strong> ({lang === 'es' ? '91% caída de latencia' : '91% latency drop'}).
                      </p>
                    </div>

                    <div className="bg-[#020202] p-3 rounded border border-neutral-900 text-emerald-400">
                      <pre className="text-emerald-400 text-xs overflow-auto">{activeStep.fixedCode}</pre>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick status metrics footer */}
          <div className="border-t border-neutral-900 pt-2.5 mt-2 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> {lang === 'es' ? 'hot-reload activo' : 'hot-reload active'}
            </span>
            <span>{lang === 'es' ? 'CONSOLA DE SISTEMA: ACTIVA' : 'SYSTEM CONSOLE: LIVE'}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
