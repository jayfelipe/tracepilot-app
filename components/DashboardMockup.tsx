"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitFork, Play, RotateCcw, AlertTriangle, CheckCircle, Cpu, 
  Terminal, Code2, Hourglass, Database, RefreshCw, ChevronRight,
  ChevronDown, Search, ArrowRight, Layers, HelpCircle
} from 'lucide-react';

interface TraceStep {
  id: string;
  name: string;
  type: 'init' | 'llm' | 'tool' | 'error' | 'success';
  status: 'success' | 'failed' | 'running' | 'idle' | 'forked';
  time: string;
  duration: number;
  tokens?: number;
  cost?: number;
  description: string;
  details: {
    input?: string;
    output?: string;
    prompt?: string;
    tool_name?: string;
    error_message?: string;
  };
}

const INITIAL_STEPS: TraceStep[] = [
  {
    id: '1',
    name: 'Agent Initiated',
    type: 'init',
    status: 'success',
    time: '12:04:15.112',
    duration: 15,
    description: 'System prompt loaded with tools: WeatherAPI, SerperSearch, PostgresDB',
    details: {
      input: 'Determine if the solar output in New York is optimal for panels, check storage levels from Postgres, and send slack notification.',
      output: 'Authorized agent context created. Plan generated: 1. Fetch live coordinates. 2. Fetch solar radiation forecasts. 3. Query PG storage capacity. 4. Run calculations.'
    }
  },
  {
    id: '2',
    name: 'LLM Call — Step 1 Plan',
    type: 'llm',
    status: 'success',
    time: '12:04:15.845',
    duration: 730,
    tokens: 1420,
    cost: 0.021,
    description: 'Models: gemini-2.5-pro — Resolving parameters',
    details: {
      prompt: 'System: You are an autonomous pilot. User asks for solar metrics in New York, check Postgres database, notify on Slack.\nAgent State: Initialised.\nDetermine action.',
      output: '{"tool": "PostgresDB", "action": "query", "arguments": {"query": "SELECT charge_level, capacity FROM battery_storage WHERE location_id = \'NYC-01\'"}}'
    }
  },
  {
    id: '3',
    name: 'Tool Execution — PostgresDB',
    type: 'tool',
    status: 'success',
    time: '12:04:16.611',
    duration: 180,
    description: 'Query success: 1 row returned',
    details: {
      input: 'SELECT charge_level, capacity FROM battery_storage WHERE location_id = \'NYC-01\'',
      output: '[{"charge_level": 45.2, "capacity": 1200.0}]'
    }
  },
  {
    id: '4',
    name: 'LLM Call — Fetching Forecast',
    type: 'llm',
    status: 'success',
    time: '12:04:16.920',
    duration: 890,
    tokens: 1845,
    cost: 0.027,
    description: 'Models: gemini-2.1-flash — Determining solar factors',
    details: {
      prompt: 'Agent State: Battery level lies at 45.2%. Capacity 1200kWh. Next, check solar weather forecast for New York.',
      output: '{"tool": "WeatherAPI", "action": "forecast", "arguments": {"city": "New York, France"}}'
    }
  },
  {
    id: '5',
    name: 'Tool Execution — WeatherAPI',
    type: 'error',
    status: 'failed',
    time: '12:04:17.842',
    duration: 1250,
    description: '404 Geographic entity exception',
    details: {
      tool_name: 'WeatherAPI',
      input: '{"city": "New York, France"}',
      error_message: 'HTTP-404: No weather station matched geographic parameters of [New York, France]. Did you mean New York City, NY?'
    }
  },
  {
    id: '6',
    name: 'LLM Response — Endless Loop',
    type: 'llm',
    status: 'running',
    time: '12:04:19.120',
    duration: 1100,
    tokens: 3500,
    cost: 0.052,
    description: 'High entropy reasoning detected (Runaway Loop)',
    details: {
      prompt: 'Weather tool returned error HTTP-404. What is the weather in New York, France? Retry with city: "New York, France".',
      output: '{"tool": "WeatherAPI", "action": "forecast", "arguments": {"city": "New York, France"}}'
    }
  }
];

export default function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<'traces' | 'graph' | 'diff'>('traces');
  const [steps, setSteps] = useState<TraceStep[]>(INITIAL_STEPS);
  const [selectedStepId, setSelectedStepId] = useState<string>('5');
  const [isForked, setIsForked] = useState<boolean>(false);
  const [forkedValue, setForkedValue] = useState<string>('{"city": "New York City, NY"}');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [originalValue, setOriginalValue] = useState<string>('{"city": "New York, France"}');

  // Find the selected step
  const selectedStep = steps.find(s => s.id === selectedStepId) || steps[4];

  // Auto-pulse background things to simulate active systems
  const [pulseMetric, setPulseMetric] = useState<number>(98.2);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseMetric(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleForkAndRun = () => {
    setIsSimulating(true);
    
    // Simulate fork-and-rerun process
    setTimeout(() => {
      setIsForked(true);
      setIsSimulating(false);
      
      // Transform steps into the fixed successful branch
      const updatedSteps = steps.map(step => {
        if (step.id === '5') {
          return {
            ...step,
            name: 'Tool Execution — WeatherAPI (FORKED)',
            status: 'success' as const,
            description: '200 OK — Extracted weather variables',
            details: {
              ...step.details,
              input: forkedValue,
              output: '{"average_solar_irradiance": "6.1 kWh/m²/day", "coordinates": "40.7128° N, 74.0060° W", "status": "optimal"}'
            }
          };
        }
        if (step.id === '6') {
          return {
            ...step,
            name: 'LLM Call — Final Assessment',
            type: 'success' as const,
            status: 'success' as const,
            duration: 410,
            description: 'Synthesis Successful — Generated Slack Report',
            details: {
              prompt: 'Weather tool returned solar irradiance 6.1 kWh/m²/day. Battery level is 45.2%. Run slack update to storage team.',
              output: 'Slack payload: "Solar irradiance is 6.1 kWh/m²/day (Optimal conditions). Battery at 45.2% capacity. Solar intake meets battery recharge standards for location NYC-01."'
            }
          };
        }
        return step;
      });
      
      // Add final success step
      const finalStep: TraceStep = {
        id: '7',
        name: 'Workflow Succeeded',
        type: 'success',
        status: 'success',
        time: '12:04:20.150',
        duration: 90,
        description: 'Slack hook return STATUS: 200 SUCCESS',
        details: {
          input: 'Slack notify payload',
          output: '{"ok": true, "timestamp": "1716293060"}'
        }
      };

      setSteps([...updatedSteps, finalStep]);
      setSelectedStepId('5'); // Keep selected weather step to show fixed code
    }, 2000);
  };

  const handleReset = () => {
    setSteps(INITIAL_STEPS);
    setSelectedStepId('5');
    setIsForked(false);
    setForkedValue('{"city": "New York City, NY"}');
  };

  return (
    <div className="w-full bg-[#050505] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Glow highlight inside */}
      <div className="absolute top-0 left-12 w-[300px] h-1 bg-cyan-500/30 blur" />
      
      {/* Panel Top Nav */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* Active indicator dot */}
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono font-medium text-neutral-300">Trace Replay Console</span>
          </div>
          <span className="text-xs text-neutral-700 font-mono">/</span>
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-neutral-500" /> active-trace-rehydrate
          </span>
        </div>
        
        {/* Branch Info / Controller */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-neutral-955 px-2 py-0.5 rounded border border-neutral-800 text-[11px] font-mono">
            <GitFork className="w-3 h-3 text-cyan-400" />
            <span className="text-neutral-400">{isForked ? 'fix-nyc-weather' : 'main'}</span>
          </div>
        </div>
      </div>

      {/* Mockup Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-neutral-950 p-3 gap-2 border-b border-neutral-800">
        <div className="flex items-center space-x-1 bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 flex-wrap">
          {['traces', 'graph', 'diff'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} View
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {isForked ? (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Trace</span>
            </button>
          ) : (
            <button
              onClick={handleForkAndRun}
              disabled={isSimulating}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                isSimulating 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-950/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Replaying...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Interactive Fork & Rerun</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 font-sans">
        
        {/* Left Column: Trace Navigation list (4 cols) */}
        <div className="lg:col-span-5 bg-neutral-950/40 p-4 overflow-y-auto max-h-[480px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 font-mono uppercase tracking-wider">Execution Steps</span>
            <span className="text-[10px] font-mono text-neutral-500">{steps.length} Nodes</span>
          </div>

          <div className="space-y-2">
            {steps.map((step) => {
              const isSelected = step.id === selectedStepId;
              
              // Define tag styles depending on status/type
              let statusColor = 'bg-neutral-800 text-neutral-400';
              let indicatorDot = 'bg-neutral-500';
              
              if (step.status === 'success') {
                statusColor = 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40';
                indicatorDot = 'bg-emerald-500';
              } else if (step.status === 'failed') {
                statusColor = 'bg-red-950/50 text-red-400 border border-red-900/40 animate-pulse';
                indicatorDot = 'bg-red-500';
              } else if (step.status === 'running') {
                statusColor = 'bg-cyan-950/50 text-cyan-400 border border-cyan-900/40';
                indicatorDot = 'bg-cyan-400 animate-pulse';
              }

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-neutral-900/90 border-cyan-500/40 shadow-inner'
                      : 'bg-[#0a0a0a] border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${indicatorDot}`} />
                      <h4 className="text-xs font-semibold text-neutral-200 mt-[-1px] font-mono">
                        {step.name}
                      </h4>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">{step.time}</span>
                  </div>

                  <p className="text-xs text-neutral-400 mt-1.5 truncate max-w-[280px]">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-900">
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">{step.type}</span>
                      <span>•</span>
                      <span>{step.duration}ms</span>
                    </div>

                    {step.tokens && (
                      <span className="text-[10px] border border-neutral-800 px-1 py-0.2 rounded bg-neutral-900">
                        {step.tokens} tkn
                      </span>
                    )}
                  </div>

                  {/* Forked branch visual indicator */}
                  {step.name.includes('(FORKED)') && (
                    <div className="absolute right-3 top-7 text-[9px] font-mono uppercase bg-cyan-950/80 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      Forked Success
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-[#0a0a0a] border border-neutral-900 rounded-lg">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">PRO-TIP INTERACTION</span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Step 5 yields a <span className="text-red-400 font-mono">HTTP-404 Geographic exception</span>. 
              Click <strong>Interactive Fork & Rerun</strong> in the upper right to mock fixing the payload to <code className="text-cyan-400">"New York City, NY"</code> and witness execution replay.
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer / Playground (8 cols) */}
        <div className="lg:col-span-7 bg-neutral-950/10 p-4 overflow-y-auto max-h-[480px]">
          <AnimatePresence mode="wait">
            {activeTab === 'traces' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Header variables */}
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">NODE DETAILS</span>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 font-mono">
                      {selectedStep.name}
                    </h3>
                  </div>

                  {selectedStep.status === 'failed' && (
                    <div className="flex items-center space-x-1 text-xs text-red-400 bg-red-950/20 px-2.5 py-1 rounded border border-red-900/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Failed Execution</span>
                    </div>
                  )}
                  {selectedStep.status === 'success' && (
                    <div className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Passed Trace</span>
                    </div>
                  )}
                </div>

                {/* Main Code Playgrounds / Blocks */}
                <div className="grid grid-cols-1 gap-4">
                  
                  {/* Prompt Block (if present) */}
                  {selectedStep.details.prompt && (
                    <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-[#070707]">
                      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/60 border-b border-neutral-800">
                        <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-cyan-400" /> input_system_prompt.jinja
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">Read-Only</span>
                      </div>
                      <pre className="p-3 text-xs text-neutral-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[140px]">
                        {selectedStep.details.prompt}
                      </pre>
                    </div>
                  )}

                  {/* Input Code Block with live edit fallback */}
                  <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-[#070707]">
                    <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/60 border-b border-neutral-800">
                      <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                        <Code2 className="w-3 h-3 text-cyan-400" /> tool_input.json
                      </span>
                      {selectedStepId === '5' ? (
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> Interactive Input
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-500 font-medium">Read-Only</span>
                      )}
                    </div>

                    {selectedStepId === '5' ? (
                      <div className="p-3">
                        <p className="text-[11px] text-neutral-500 font-mono mb-2">
                          Edit variables directly to mock a correction:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={forkedValue}
                            onChange={(e) => setForkedValue(e.target.value)}
                            className="bg-neutral-950 text-neutral-200 border border-neutral-700/60 rounded px-3 py-1.5 font-mono text-xs flex-1 outline-none focus:border-cyan-500 transition-colors"
                            placeholder='{"city": "New York City, NY"}'
                          />
                          {!isForked && (
                            <button
                              onClick={handleForkAndRun}
                              disabled={isSimulating}
                              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-850 disabled:text-neutral-500 text-black text-xs font-mono px-3 rounded hover:cursor-pointer font-bold transition flex items-center"
                            >
                              Update & Sync
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <pre className="p-3 text-xs text-neutral-300 font-mono overflow-x-auto">
                        {selectedStep.details.input || JSON.stringify({ payload: selectedStep.description }, null, 2)}
                      </pre>
                    )}
                  </div>

                  {/* Output Code Block */}
                  <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-[#070707]">
                    <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/60 border-b border-neutral-800">
                      <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-emerald-400" /> returned_payload
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Stream Output</span>
                    </div>
                    
                    {selectedStep.details.error_message ? (
                      <div className="p-3 border-l-2 border-red-500 bg-red-950/10 text-xs font-mono text-red-400 space-y-1.5">
                        <div className="font-bold">❌ GeoRequestException</div>
                        <p className="text-[11px] leading-relaxed text-neutral-300">{selectedStep.details.error_message}</p>
                      </div>
                    ) : (
                      <pre className="p-3 text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed bg-[#020202]">
                        {selectedStep.details.output || '// Empty state output.'}
                      </pre>
                    )}
                  </div>
                  
                </div>
              </motion.div>
            )}

            {activeTab === 'graph' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-[430px] flex flex-col justify-between items-center py-4 bg-neutral-950 relative"
              >
                {/* Visual Graph showing fork lineages */}
                <div className="absolute inset-0 bg-dot-pattern opacity-40" />

                <div className="text-center z-10">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Runtime Lineage Graph</span>
                  <p className="text-xs text-neutral-400 mt-1">Branch visualization of real-time trace state</p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6 z-10 w-full max-w-sm">
                  {/* Root Initiator */}
                  <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-2">
                    <span className="w-2 h-2 rounded bg-emerald-500" />
                    <span className="text-neutral-300">Init_Session</span>
                  </div>

                  <div className="w-0.5 h-6 bg-neutral-800" />

                  {/* Database Step */}
                  <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-2">
                    <span className="w-2 h-2 rounded bg-emerald-500" />
                    <span className="text-neutral-300">PG_Query: NYC-01</span>
                  </div>

                  {/* Branching Split */}
                  <div className="w-full relative flex justify-between items-stretch px-4">
                    {/* SVG Connector lines for clean rendering */}
                    <div className="absolute top-0 bottom-0 left-12 right-12 flex justify-between select-none pointer-events-none">
                      <svg className="w-full h-full text-neutral-800" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 50 0 C 50 40, 20 60, 20 100" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 50 0 C 50 40, 80 60, 80 100" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="w-5" />
                    <div className="w-0.5 h-16 bg-neutral-800 self-center hidden" />
                  </div>

                  <div className="flex w-full justify-between gap-6 relative px-2">
                    
                    {/* Original Branch: Failed and Terminated */}
                    <div className="flex-1 flex flex-col items-center space-y-4">
                      <div className="bg-red-950/40 border border-red-900 px-3 py-1.5 rounded text-xs font-mono text-neutral-400 text-center w-full relative">
                        <span className="w-2 h-2 rounded bg-red-500 absolute top-2 right-2" />
                        <span className="block font-semibold text-red-400">Main Branch</span>
                        <span className="text-[10px] text-neutral-500 block">weather_api [Fail 404]</span>
                      </div>
                      <div className="w-0.5 h-6 bg-red-900/60" />
                      <div className="bg-neutral-900/50 border border-neutral-800 p-2 rounded text-center w-full text-[10px] font-mono text-neutral-500 line-through">
                        Loop_Reasoning (Killed)
                      </div>
                    </div>

                    {/* Forked Branch: Corrected and Succeeded */}
                    <div className="flex-1 flex flex-col items-center space-y-4">
                      {isForked ? (
                        <>
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-cyan-950/80 border border-cyan-500 px-3 py-1.5 rounded text-xs font-mono text-center w-full relative shadow-lg shadow-cyan-950/40"
                          >
                            <span className="w-2 h-2 rounded bg-cyan-400 absolute top-2 right-2 animate-pulse" />
                            <span className="block font-semibold text-cyan-300">fork-nyc</span>
                            <span className="text-[10px] text-neutral-400 block">weather_api [200 OK]</span>
                          </motion.div>
                          <div className="w-0.5 h-6 bg-cyan-800" />
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-emerald-950/40 border border-emerald-500 p-2 rounded text-center w-full text-[10px] font-mono text-emerald-400"
                          >
                            Slack Report Succeeded
                          </motion.div>
                        </>
                      ) : (
                        <div className="border border-dashed border-neutral-800 rounded bg-transparent p-4 text-center text-xs text-neutral-600 font-mono w-full self-center">
                          Waiting for Fork Rerun...
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="z-10 text-center">
                  <span className="text-[10px] text-neutral-500 font-mono">Original Lineage: 2-stage execution tree | Fork Lineage: Active override path</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'diff' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">INTERACTIVE COMPARISON</span>
                    <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1">
                      Prompt State Differences
                    </h3>
                  </div>
                  <span className="text-xs text-cyan-400 bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 font-mono">
                    Type-Safe Diff
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#0a0a0a] rounded-lg border border-neutral-800">
                    <p className="text-[11px] text-neutral-500 uppercase mb-2">Original Execution Output (Main Branch)</p>
                    <div className="space-y-1 bg-[#050505] p-3 rounded border border-neutral-900 text-red-400">
                      <div>- "arguments": &#123;</div>
                      <div className="bg-red-950/20 px-1 py-0.5 font-bold">-   "city": "New York, France"</div>
                      <div>- &#125;</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0a0a0a] rounded-lg border border-neutral-800">
                    <p className="text-[11px] text-neutral-500 uppercase mb-2">Fork & Fix Execution Output (Active Branch)</p>
                    <div className="space-y-1 bg-[#050505] p-3 rounded border border-neutral-900 text-emerald-400">
                      <div>+ "arguments": &#123;</div>
                      <div className="bg-emerald-950/20 px-1 py-0.5 font-bold">+   "city": "New York City, NY"</div>
                      <div>+ &#125;</div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-400 text-xs leading-relaxed">
                    <span className="font-semibold text-neutral-200 block mb-1">State Merges</span>
                    Whenever an agent execution fails in production, saving trace dumps lets your engineering team 
                    rehydrate state on sandbox clusters, apply diff overrides directly on our CLI, and merge changes 
                    back into system prompt templates.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Metrics readout */}
      <div className="bg-[#030303]/90 p-3.5 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-500 font-mono gap-3">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>Trace listeners connected</span>
          </span>
          <span className="text-neutral-800">|</span>
          <span className="text-[11px]">
            Mode: <strong className="text-neutral-400">Sandbox Rehydrate</strong>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-[11px]">
          <span>State: <strong className="text-emerald-500">Synced</strong></span>
        </div>
      </div>
    </div>
  );
}
