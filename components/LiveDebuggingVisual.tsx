"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldAlert, Play, CheckCircle2, RefreshCw, 
  Settings, ArrowRight, CornerDownRight, Zap, Info, Shield, HelpCircle
} from 'lucide-react';

export interface LiveDebuggingVisualProps {
  lang?: 'en' | 'es';
}

export default function LiveDebuggingVisual({ lang = 'en' }: LiveDebuggingVisualProps) {
  const [stage, setStage] = useState<'fail' | 'intervene' | 'fixed'>('fail');
  const [optionSelected, setOptionSelected] = useState<string>('cache');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const triggerRerun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStage('fixed');
    }, 2000);
  };

  const handleReset = () => {
    setStage('fail');
    setOptionSelected('cache');
  };

  return (
    <div className="w-full bg-[#040404] border border-neutral-800 rounded-2xl p-5 md:p-8 overflow-hidden shadow-2xl relative text-left">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 select-none pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-cyan-950/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-[250px] h-[250px] bg-emerald-950/5 blur-[90px] rounded-full pointer-events-none animate-pulse" />

      {/* Grid header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-neutral-900 pb-5 mb-8 gap-4 relative z-10">
        <div>
          <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> {lang === 'es' ? 'Simulador de Intercepción en Vivo' : 'Live Interception Simulator'}
          </span>
          <h3 className="text-2xl font-bold font-display text-white mt-1">
            {lang === 'es' ? 'Depuración por Intercepción en Tiempo Real' : 'Live Interception Sandbox Simulator'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans">
            {lang === 'es' 
              ? 'Observa un hilo activo de un agente mientras se detiene ante fallos de recursos. Intercepta la ejecución, anula el estado de variables y reestablece el flujo en verde.'
              : 'Observe an active agent thread as it stalls under resource failures. Intercept execution, override variable state, and forge green pathways.'}
          </p>
        </div>

        <div>
          <button
            onClick={stage === 'fixed' ? handleReset : undefined}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition ${
              stage === 'fixed' 
                ? 'bg-[#111] border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:cursor-pointer' 
                : 'bg-neutral-950 border-neutral-900/60 text-neutral-500'
            }`}
          >
            {stage === 'fixed' 
              ? (lang === 'es' ? 'Reiniciar Simulador' : 'Reset Simulator') 
              : (lang === 'es' ? 'Simulación ACTIVA' : 'Simulation ACTIVE')}
          </button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left: Beautiful Node execution flow mapping (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-neutral-800 rounded-xl bg-neutral-950/90 p-5 relative overflow-hidden">
            <div className="absolute top-2 right-3 font-mono text-[9px] text-neutral-600 uppercase">Interactive Flow</div>
            
            <div className="space-y-6 relative">
              
              {/* Node 1: Input Session (Always success) */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs shadow-lg shadow-emerald-950/50">
                  01
                </div>
                <div className="flex-1 bg-[#0a0a0a] border border-neutral-900 px-4 py-2.5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-300 font-mono">
                      {lang === 'es' ? 'INICIADOR: INICIO_SESION' : 'INITIATOR: SESSION_START'}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono">{lang === 'es' ? 'Éxito [200]' : 'Success [200]'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                    {lang === 'es'
                      ? 'Entrada: "Consolidar rendimiento de acciones competidoras y generar reporte analítico ejecutivo."'
                      : 'Input: "Aggregate current competitor stocks & generate executive briefing."'}
                  </p>
                </div>
              </div>

              {/* Connector line 1 */}
              <div className="w-0.5 h-6 bg-emerald-500 ml-5" />

              {/* Node 2: Reasoning Models (Success) */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs shadow-lg shadow-emerald-950/30">
                  02
                </div>
                <div className="flex-1 bg-[#0a0a0a] border border-neutral-900 px-4 py-2.5 rounded-lg">
                  <div className="flex items-center justify-between flex-wrap">
                    <span className="text-[11px] font-bold text-neutral-300 font-mono">
                      {lang === 'es' ? 'LLAMADA_MODELO: RAZONAMIENTO_AGENTE' : 'MODEL_CALL: AGENT_REASONING'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">1.2s • 1,510 tokens</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                    {lang === 'es'
                      ? 'Lógica de decisión: Invocar herramienta SearchFinanceAPI con parámetros "MSFT", "AAPL", "NVDA"'
                      : 'Decision logic: Invoke SearchFinanceAPI tool with parameters "MSFT", "AAPL", "NVDA"'}
                  </p>
                </div>
              </div>

              {/* Connector line 2 */}
              <div className="relative">
                <div className={`w-0.5 h-8 ml-5 transition-colors duration-500 ${
                  stage === 'fixed' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <div className="absolute top-1/2 left-7 transform -translate-y-1/2 text-[9px] font-mono text-neutral-600 uppercase">
                  {lang === 'es' ? 'Canal de Datos' : 'Data Stream Link'}
                </div>
              </div>

              {/* Node 3: Tool Execution (Failing block or Override redirect) */}
              <div className="flex items-center space-x-4">
                
                {/* Visual state change triggers relative styling */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs shadow-lg transition-all duration-500 ${
                  stage === 'fixed' 
                    ? 'bg-emerald-950/30 border border-emerald-500 text-emerald-400'
                    : stage === 'intervene'
                    ? 'bg-cyan-950/30 border border-cyan-400 text-cyan-400 animate-pulse'
                    : 'bg-red-950/20 border-2 border-red-500 text-red-400 animate-pulse'
                }`}>
                  03
                </div>

                <div className={`flex-1 border px-4 py-2.5 rounded-lg transition-all duration-500 ${
                  stage === 'fixed'
                    ? 'bg-[#0a0a0a] border-neutral-900'
                    : 'bg-neutral-950 border-red-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-300 font-mono">
                      {lang === 'es' ? 'EJEC_HERRAMIENTA: FINANCE_SEARCH_API' : 'TOOL_EXEC: FINANCE_SEARCH_API'}
                    </span>
                    
                    {stage === 'fixed' ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        {lang === 'es' ? 'ÉXITO SOBREESCRITO [Caché]' : 'OVERRIDDEN SUCCESS [Cache]'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-500 font-mono font-bold animate-pulse">429 RATE_LIMIT EXCEEDED</span>
                    )}
                  </div>
                  
                  {stage === 'fixed' ? (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {lang === 'es'
                        ? 'Anulación con éxito: Redirigido a réplica local en caché de Postgres. Datos de precios extraídos limpiamente.'
                        : 'Override success: Redirected to locally cached Postgres price arrays. Response extracted cleanly.'}
                    </p>
                  ) : (
                    <p className="text-[11px] text-red-300 mt-1">
                      {lang === 'es'
                        ? 'Límites de API Yahoo Finance agotados (429). El agente autónomo reintenta 100 veces consecutivas sin pausas. Bucle costoso detectado.'
                        : 'Yahoo Finance API limits exhausted (429). The autonomous agent is attempting to retry 100 times without backoff intervals. Cost spiral detected.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Branching Connection */}
              <AnimatePresence>
                {stage !== 'fixed' ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col space-y-4"
                  >
                    <div className="w-0.5 h-6 bg-red-900/60 ml-5" />
                    
                    {/* Node 4 Runaway Loop alert */}
                    <div className="flex items-center space-x-4 pl-6 relative">
                      <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-dashed border-l border-red-900/40" />
                      <CornerDownRight className="w-4 h-4 text-red-500 z-10 ml-[-20px]" />
                      
                      <div className="flex-1 bg-red-950/10 border border-red-900/40 p-3 rounded-lg flex items-center space-x-3 text-left">
                        <ShiftAlertsWrapper />
                        <div className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                          {lang === 'es' ? (
                            <>
                              <strong>BUCLE CRÍTICO:</strong> Agente atrapado en ciclo descontrolado: <code className="text-red-400 font-mono font-semibold">YahooFinance &rarr; Reintentar</code>. 14 llamadas sucesivas en 4 segundos. Proyección de gasto: <strong className="text-red-400 font-mono">$0.84 / min</strong>.
                            </>
                          ) : (
                            <>
                              <strong>DANGER LOOP:</strong> Agent entered runaway status tracking loop: <code className="text-red-400 font-mono font-semibold">YahooFinance &rarr; Retry</code>. 14 consecutive calls made. Current cost warning: <strong className="text-red-400 font-mono">$0.84 / min</strong>.
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col space-y-4"
                  >
                    <div className="w-0.5 h-6 bg-emerald-500 ml-5" />
                    
                    {/* Success Final Node */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs">
                        04
                      </div>
                      <div className="flex-1 bg-[#0a0a0a] border border-neutral-900 px-4 py-2.5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-neutral-300 font-mono">
                            {lang === 'es' ? 'FINALIZAR: RESUMEN_MODELO' : 'FINALIZE: MODEL_SUMMARY'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {lang === 'es' ? 'Flujo de Trabajo Exitoso' : 'Workflow Saved Success'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          {lang === 'es'
                            ? 'Resumen ejecutivo consolidado y enviado al almacenamiento. Se evitaron 86 llamadas redundantes al modelo.'
                            : 'Briefing synthesized and dispatched to storage. Saved 86 failed tokens cycles.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* Right: Controller Interface / Intervention Card (5 Cols) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between h-full space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> {lang === 'es' ? 'CONSOLA DE INTERCEPCIÓN' : 'INTERCEPT CONSOLE'}
                </span>
                <span className="text-[9px] bg-red-950/80 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30 font-mono">
                  {stage === 'fail' 
                    ? (lang === 'es' ? 'ESTANCAMIENTO DETECTADO' : 'STALL DETECTED') 
                    : stage === 'intervene' 
                    ? (lang === 'es' ? 'ESPERANDO REPLAY' : 'AWAITING REPLAY') 
                    : (lang === 'es' ? 'COMPLETADO' : 'COMPLETED')}
                </span>
              </div>

              {stage === 'fail' && (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {lang === 'es'
                      ? 'El agente ha agotado la cuota en el Nodo 03 de Yahoo Finance. En lugar de permitir que siga reintentando de forma infinita, puedes interceptar la traza en vivo, definir un fallback o simular resultados.'
                      : 'The agent has run into a throttling quota on Node 03 Yahoo Finance. Rather than letting it retry blindly, you can intercept the execution trace live and mock the result or direct it to mock fallbacks.'}
                  </p>
                  
                  <div className="p-3 bg-[#0a0a0a] rounded border border-neutral-900 text-xs text-red-400 font-mono leading-relaxed">
                    YahooFinanceRateLimitException: 429 Too Many Requests. <br />
                    {lang === 'es'
                      ? 'Ejecución detenida en step_3_finance_search_api (Bifurcación rehidratada).'
                      : 'Execution halted at step_3_finance_search_api (Fork point rehydrated).'}
                  </div>

                  <button
                    onClick={() => setStage('intervene')}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-2.5 rounded hover:cursor-pointer transition shadow-lg shadow-cyan-950/20 flex items-center justify-center space-x-1.5 mt-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{lang === 'es' ? 'Interceptar y Bifurcar Estado' : 'Intercept & Fork State Live'}</span>
                  </button>
                </div>
              )}

              {stage === 'intervene' && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {lang === 'es'
                      ? 'Selecciona tu estrategia de anulación antes de reiniciar la reproducción:'
                      : 'Select your override strategy for the failing YahooFinanceAPI input before initiating replay:'}
                  </p>

                  <div className="space-y-2">
                    {/* Option 1: Cache db */}
                    <div 
                      onClick={() => setOptionSelected('cache')}
                      className={`p-3 rounded border text-left cursor-pointer transition flex items-start gap-2.5 ${
                        optionSelected === 'cache' 
                          ? 'bg-neutral-900/90 border-cyan-500/40 text-neutral-200' 
                          : 'bg-[#0a0a0a] border-neutral-900 text-neutral-500 hover:border-neutral-850'
                      }`}
                    >
                      <input 
                        type="radio" 
                        checked={optionSelected === 'cache'} 
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-semibold block text-neutral-200 font-mono">
                          {lang === 'es' ? 'Usar Réplica Local Postgres' : 'Fallback to Local DB Replica'}
                        </span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {lang === 'es'
                            ? 'Redirigir parámetros de consulta hacia el set en caché de base de datos local'
                            : 'Redirect query parameters to database query battery_levels'}
                        </span>
                      </div>
                    </div>

                    {/* Option 2: Mock custom object */}
                    <div 
                      onClick={() => setOptionSelected('mock')}
                      className={`p-3 rounded border text-left cursor-pointer transition flex items-start gap-2.5 ${
                        optionSelected === 'mock' 
                          ? 'bg-neutral-900/90 border-cyan-500/40 text-neutral-200' 
                          : 'bg-[#0a0a0a] border-neutral-900 text-neutral-500 hover:border-neutral-850'
                      }`}
                    >
                      <input 
                        type="radio" 
                        checked={optionSelected === 'mock'} 
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-xs font-semibold block text-neutral-200 font-mono">
                          {lang === 'es' ? 'Simular Payload de Retorno' : 'Mock Output Payload Raw'}
                        </span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {lang === 'es'
                            ? 'Especificar de forma manual: { status: "optimal", irradiance: 6.1 }'
                            : 'Specify manually: { status: "optimal", irradiance: 6.1 }'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={triggerRerun}
                    disabled={isSimulating}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded hover:cursor-pointer transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-950/20"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'es' ? 'Reproduciendo en sandbox...' : 'Replaying sandbox cluster...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>{lang === 'es' ? 'Ejecutar Reproducción Reconfigurada' : 'Run Rerun Override Flow'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {stage === 'fixed' && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-emerald-950/15 border border-emerald-900/65 rounded-lg">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                    <h4 className="text-sm font-bold text-[#f5f5f5] mt-2 font-display">
                      {lang === 'es' ? 'Flujo Terminado con Éxito' : 'Workflow Complete Successfully'}
                    </h4>
                    <p className="text-[11px] text-emerald-300 mt-1">
                      {lang === 'es'
                        ? '¡Intervención aplicada! No se alteraron los clientes de producción.'
                        : 'Intervention applied! No production clients were harmed.'}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed text-neutral-400 font-sans">
                    <p>
                      <strong>{lang === 'es' ? 'Métricas consolidadas:' : 'Summary statistics:'}</strong>{' '}
                      {lang === 'es'
                        ? 'Al redirigir los bucles fallidos hacia la caché local de postgres, el agente finalizó su ejecución y evitó 86 llamadas de razonamiento LLM adicionales.'
                        : 'By redirecting raw tool failure loops to the local postgres cache, the agent finalized execution and skipped 86 additional LLM reasoning calls.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 bg-[#0a0a0a] border border-neutral-900 p-3 rounded text-[11px] font-mono">
                      <div>
                        <span className="text-neutral-500 block">{lang === 'es' ? 'AHORRO EN COSTOS' : 'COSTS SAVED'}</span>
                        <strong className="text-emerald-400">$12.40 / run</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{lang === 'es' ? 'TIEMPO EXTREMO' : 'RESOLVED TIME'}</span>
                        <strong className="text-emerald-400">0.4 secs</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full bg-[#121212] hover:bg-neutral-850 text-neutral-200 text-xs py-2 rounded border border-neutral-800 hover:cursor-pointer font-semibold transition"
                  >
                    {lang === 'es' ? 'Reiniciar y Simular de Nuevo' : 'Reset & Simulate Again'}
                  </button>
                </div>
              )}

            </div>

            <div className="text-[10px] text-zinc-500 font-mono pt-3 border-t border-neutral-900 flex items-center gap-1.5 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
              <span>
                {lang === 'es'
                  ? 'TracePilot permite configurar disparadores automáticos para levantar sandboxes de depuración al detectar límites de alerta.'
                  : 'TracePilot AI lets your dev team set custom auto-triggers to spawn sandboxes on alert limits.'}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Simple internal helper wrapper to satisfy imports
function ShiftAlertsWrapper() {
  return <ShieldAlert className="w-5 h-5 text-red-400 min-w-4 flex-shrink-0" />;
}
