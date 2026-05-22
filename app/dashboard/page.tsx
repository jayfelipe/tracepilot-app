"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Mocking simple headless UI styles locally to prevent relative path build exceptions
const Badge = ({ children, className = "", variant = "outline", ...props }: any) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-medium transition-colors border ${className}`} {...props}>
    {children}
  </span>
);

const Card = ({ children, className = "", ...props }: any) => (
  <div className={`rounded-xl border border-white/[0.08] bg-[#0d0f14]/85 text-card-foreground shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }: any) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }: any) => (
  <div className={`p-5 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const ScrollArea = ({ children, className = "", ...props }: any) => (
  <div className={`overflow-y-auto h-full scrollbar-none ${className}`} {...props}>
    {children}
  </div>
);

// ─── SVG Icons ─────────────────────────────────────────────────────────────

function IconBrain({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-3 2.5 2.5 0 0 1 .09-3.53 2.5 2.5 0 0 1 0-4 2.5 2.5 0 0 1 3.44-3.5Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-3 2.5 2.5 0 0 0-.09-3.53 2.5 2.5 0 0 0 0-4 2.5 2.5 0 0 0-3.44-3.5Z"/>
    </svg>
  );
}

function IconTool({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

function IconAlertTriangle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}

// ─── Span config ───────────────────────────────────────────────────────────

type SpanType = "llm_call" | "tool_call" | "error";

interface SpanConfig {
  icon: React.ReactNode;
  label: string;
  dotColor: string;
  borderColor: string;
  badgeClass: string;
  headerBg: string;
}

const SPAN_CONFIG: Record<SpanType, SpanConfig> = {
  llm_call: {
    icon: <IconBrain className="text-cyan-400" />,
    label: "LLM Call",
    dotColor: "border-cyan-500/60 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    headerBg: "bg-cyan-500/[0.04]",
  },
  tool_call: {
    icon: <IconTool className="text-violet-400" />,
    label: "Tool Call",
    dotColor: "border-violet-500/60 bg-violet-500/10 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.15)]",
    borderColor: "border-violet-500/20 hover:border-violet-500/40",
    badgeClass: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
    headerBg: "bg-violet-500/[0.04]",
  },
  error: {
    icon: <IconAlertTriangle className="text-red-400" />,
    label: "Error",
    dotColor: "border-red-500/60 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
    borderColor: "border-red-500/20 hover:border-red-500/40",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    headerBg: "bg-red-500/[0.04]",
  },
};

// ─── SpanNode ──────────────────────────────────────────────────────────────

function SpanNode({ span }: { span: any; key?: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isForking, setIsForking] = useState(false);
  const [forkResult, setForkResult] = useState<any>(null);
  const [editableInput, setEditableInput] = useState("");
  
  const type = (span.span_type as SpanType) in SPAN_CONFIG ? (span.span_type as SpanType) : "error";
  const { icon, label, dotColor, borderColor, badgeClass, headerBg } = SPAN_CONFIG[type];

  const renderData = (data: any) => {
    if (!data) return "N/A";
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  const handleFork = async () => {
    setIsForking(true);
    setForkResult(null);
    
    try {
      console.log("Intentando hacer Fork de este texto:", editableInput);
      const parsedMessages = JSON.parse(editableInput);
      
      const res = await fetch("/api/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: parsedMessages,
          model: span.model
        })
      });
      
      const data = await res.json();
      
      if (!res.ok || data.error) {
        console.error("Error del servidor:", data.error);
        setForkResult({ error: data.error || "Server error" });
      } else {
        setForkResult(data.newOutput);
      }

    } catch (err: any) {
      console.error("Error crudo en el Fork:", err);
      setForkResult({ error: `Error real: ${err.message}` });
    } finally {
      setIsForking(false);
    }
  };

  const handleToggleExpand = () => {
    if (!isExpanded && !editableInput) {
      setEditableInput(renderData(span.input_data));
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative pl-8 pb-3 group">
      {/* Vertical connector line */}
      {span.children && span.children.length > 0 && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-white/[0.08] to-transparent group-last:bg-transparent" />
      )}

      {/* Timeline dot */}
      <div className={`absolute left-0 top-2 w-[22px] h-[22px] rounded-full border ${dotColor} flex items-center justify-center`}>
        {icon}
      </div>

      {/* Span card */}
      <div className={`rounded-lg border ${borderColor} bg-[#0d0f14] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.04)]`}>
        {/* Header */}
        <div 
          className={`px-3 py-2.5 border-b border-white/[0.06] ${headerBg} flex justify-between items-center cursor-pointer hover:bg-white/[0.02] transition-colors duration-200`}
          onClick={handleToggleExpand}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${badgeClass} text-[10px] font-mono px-2 py-0.5 rounded-md`}>
              {label}
            </Badge>
            {span.is_destructive && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                <IconAlertTriangle className="w-2.5 h-2.5" />
                Destructive
              </Badge>
            )}
            {span.model && (
              <span className="text-[10px] text-white/30 font-mono">{span.model}</span>
            )}
            <span className="text-[9px] text-white/20 font-mono ml-1">
              {isExpanded ? "▼ Collapse" : "► Expand"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-white/30">
            {span.tokens_used && (
              <span className="flex items-center gap-1 text-amber-400/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {span.tokens_used} tokens
              </span>
            )}
            {span.execution_time_ms && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {span.execution_time_ms}ms
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        {isExpanded && (
          <div className="px-3 py-2.5 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-mono tracking-widest text-white/20 uppercase">Input</span>
                {type === "llm_call" && Array.isArray(span.input_data) && (
                  <button 
                    onClick={handleFork} 
                    disabled={isForking}
                    className="text-[9px] font-mono px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-950/30 transition-all disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    {isForking ? "Forking..." : "⟳ Fork & Rerun"}
                  </button>
                )}
              </div>
              {/* Input editable si es LLM */}
              {type === "llm_call" ? (
                <div className="relative rounded-md overflow-hidden border border-white/[0.06]">
                  <div className="flex items-center justify-between px-2.5 py-1 bg-white/[0.02] border-b border-white/[0.06]">
                    <span className="text-[8px] font-mono text-white/25 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      tool_input.json
                    </span>
                    <span className="text-[8px] font-mono text-cyan-400/70 flex items-center gap-1">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                      Editable
                    </span>
                  </div>
                  <textarea 
                    value={editableInput}
                    onChange={(e) => setEditableInput(e.target.value)}
                    className="w-full text-[11px] font-mono text-emerald-300/70 bg-[#070707] p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-y min-h-[80px]"
                    rows={4}
                  />
                </div>
              ) : (
                <div className="relative rounded-md overflow-hidden border border-white/[0.06]">
                  <div className="flex items-center px-2.5 py-1 bg-white/[0.02] border-b border-white/[0.06]">
                    <span className="text-[8px] font-mono text-white/25 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      input.json
                    </span>
                    <span className="text-[8px] font-mono text-white/15 ml-auto">Read-Only</span>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-300/70 bg-[#070707] p-3 overflow-x-auto whitespace-pre-wrap break-words">
                    {renderData(span.input_data)}
                  </pre>
                </div>
              )}
            </div>
            
            <div>
              <span className="text-[9px] font-mono tracking-widest text-white/20 uppercase block mb-1.5">Original Output</span>
              <div className="relative rounded-md overflow-hidden border border-white/[0.06]">
                <div className="flex items-center justify-between px-2.5 py-1 bg-white/[0.02] border-b border-white/[0.06]">
                  <span className="text-[8px] font-mono text-white/25 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/></svg>
                    returned_payload
                  </span>
                  <span className="text-[8px] font-mono text-white/15">Read-Only</span>
                </div>
                <pre className="text-[11px] font-mono text-blue-300/50 bg-[#070707] p-3 overflow-x-auto whitespace-pre-wrap break-words opacity-50">
                  {renderData(span.output_data)}
                </pre>
              </div>
            </div>

            {/* Mostrar resultado del Fork si existe */}
            {forkResult && (
              <div className="border-t border-cyan-500/20 pt-3">
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase block mb-1.5">🚀 Forked Output (New)</span>
                <div className="relative rounded-md overflow-hidden border border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                  <div className="flex items-center justify-between px-2.5 py-1 bg-cyan-500/[0.06] border-b border-cyan-500/20">
                    <span className="text-[8px] font-mono text-cyan-400/60 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      forked_output.json
                    </span>
                    <span className="text-[8px] font-mono text-cyan-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                      New
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-cyan-300 bg-[#060808] p-3 overflow-x-auto whitespace-pre-wrap break-words">
                    {renderData(forkResult)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recursive children */}
      {span.children && span.children.length > 0 && (
        <div className="mt-2">
          {span.children.map((child: any) => (
            <SpanNode key={child.span_id} span={child} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Empty State Component (High Fidelity Landing Essence) ──────────────────

function EmptyState({ apiKey }: { apiKey: string | null }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      label: "1. Install the SDK:",
      code: "npm install tracepilot-sdk"
    },
    {
      label: "2. Add your API Key to your code:",
      code: `const tp = new TracePilot('${apiKey || 'tp_live_...'}')`
    },
    {
      label: "3. Wrap your OpenAI calls:",
      code: "await tp.wrapOpenAI(openai.chat.completions.create({\n  model: 'gpt-4o',\n  messages\n}))"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d12]/90 backdrop-blur-xl p-8 max-w-xl mx-auto my-12 shadow-[0_0_50px_rgba(6,182,212,0.03)] group">
      
      {/* Background ambient glow inside the card */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/[0.02] group-hover:bg-cyan-500/[0.04] blur-3xl transition-all duration-500 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/[0.01] group-hover:bg-violet-500/[0.02] blur-3xl transition-all duration-500 rounded-full pointer-events-none" />

      {/* Header section with brain emoji or glowing icon */}
      <div className="text-center space-y-4 mb-8 select-none">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold font-display text-white tracking-tight">
            No traces yet. Let's connect your first agent!
          </h3>
          <p className="text-[11px] text-neutral-400 font-sans max-w-sm mx-auto leading-relaxed">
            TracePilot listens in high fidelity. Get started by feeding telemetry from your favorite frameworks in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Copyable steps section */}
      <div className="space-y-5">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-300 font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
              {step.label}
            </h4>
            <div className="relative group/code flex items-center justify-between border border-white/[0.05] hover:border-white/[0.12] bg-[#040507] rounded-lg p-3.5 w-full transition-all duration-200">
              <pre className="text-left font-mono text-[10.5px] text-emerald-400/85 overflow-x-auto pr-12 scrollbar-none whitespace-pre-wrap break-all">
                {step.code}
              </pre>
              <button
                onClick={() => handleCopy(step.code, idx)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold bg-[#0d0f14] hover:bg-neutral-900 border border-white/[0.08] hover:border-white/[0.18] text-neutral-400 hover:text-white px-2.5 py-1 rounded cursor-pointer transition-all duration-150 active:scale-95"
              >
                {copiedIndex === idx ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        ))}
        
        {/* Dedicated API Key Section if exists */}
        {apiKey && (
          <div className="space-y-2 pt-4 border-t border-white/[0.05]">
            <h4 className="text-xs font-semibold text-neutral-300 font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              Your Personal API Key
            </h4>
            <div className="relative group/code flex items-center justify-between border border-cyan-500/10 hover:border-cyan-500/30 bg-[#040507] rounded-lg p-3.5 w-full transition-all duration-200">
              <pre className="text-left font-mono text-[10.5px] text-cyan-300/85 overflow-x-auto pr-12 scrollbar-none whitespace-pre-wrap break-all">
                {apiKey}
              </pre>
              <button
                onClick={() => handleCopy(apiKey, 3)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold bg-[#0d0f14] hover:bg-neutral-900 border border-white/[0.08] hover:border-white/[0.18] text-neutral-400 hover:text-white px-2.5 py-1 rounded cursor-pointer transition-all duration-150 active:scale-95"
              >
                {copiedIndex === 3 ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blinking Live pulse status */}
      <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </span>
          <span className="font-semibold">Waiting for incoming traces...</span>
        </div>

        {/* Back to website button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
          className="text-neutral-400 hover:text-white font-semibold font-sans tracking-wide text-[11px] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Exit Dashboard</span>
          <svg className="w-3.5 h-3.5 text-neutral-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [traces, setTraces] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── 1. Función aislada para obtener trazas ──
  const fetchTraces = useCallback(async () => {
    try {
      const traceRes = await fetch("/api/traces");
      const traceData = await traceRes.json();
      const newTraces = Array.isArray(traceData) ? traceData : [];

      // Evitar parpadeos: solo actualizamos el estado si las trazas son diferentes
      setTraces(prevTraces => {
        if (JSON.stringify(prevTraces) === JSON.stringify(newTraces)) {
          return prevTraces; // Mismo contenido, retornamos la referencia anterior (React no re-renderiza)
        }
        return newTraces; // Contenido nuevo, actualizamos el estado
      });
    } catch (err) {
      console.error("Dashboard trace poll error:", err);
    }
  }, []);

  // ── 2. Inicialización del Dashboard (Sesión y API Key) ──
  useEffect(() => {
    const initializeDashboard = async () => {
      // Verificar sesión
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
        return;
      }

      setUserEmail(session.user.email ?? null);

      // Obtener su API Key
      const keyRes = await fetch("/api/api-keys");
      if (keyRes.ok) {
        const keyData = await keyRes.json();
        setApiKey(keyData.api_key ?? null);
      }

      // Obtener trazas por primera vez
      await fetchTraces();
      
      setLoading(false);
    };

    initializeDashboard();
  }, [router, supabase, fetchTraces]);

  // ── 3. Polling: Auto-refresh cada 5 segundos ──
  useEffect(() => {
    // No iniciar el polling hasta que la carga inicial termine
    if (loading) return;

    const intervalId = setInterval(() => {
      fetchTraces();
    }, 5000); // 5000 milisegundos = 5 segundos

    // Limpiar el intervalo si el usuario sale de la página
    return () => clearInterval(intervalId);
  }, [loading, fetchTraces]);

  if (loading) return (
    <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center font-mono text-sm text-white/50 select-none">
      Loading Secure Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white flex font-sans relative select-none">

      {/* Ambient background glow matching landing page design */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-cyan-500/[0.015] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-violet-500/[0.01] rounded-full blur-[130px]" />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-60 border-r border-white/[0.06] bg-[#08090d] flex-col hidden md:flex relative z-10">

        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />

        {/* Logo */}
        <a href="#/" className="h-16 flex items-center px-5 border-b border-white/[0.06] relative overflow-hidden flex-shrink-0 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-transparent pointer-events-none" />
          <img
            src="/logo.png"
            alt="TracePilot AI"
            className="object-contain object-left w-auto h-24 relative z-10"
          />
        </a>

        {/* Workspace indicator */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
            <span className="text-[11px] font-mono text-white/50">Production</span>
            <span className="text-[9px] font-mono text-white/20 ml-auto">v0.1.0</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-0.5">
          <p className="px-2 pt-1 pb-2 text-[9px] font-mono tracking-widest text-white/20 uppercase">
            Observability
          </p>
          {[
            { label: "Traces", active: true, soon: false },
            { label: "Agents", active: false, soon: true },
            { label: "Costs", active: false, soon: true },
          ].map(({ label, active, soon }) => (
            <div
              key={label}
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                active
                  ? "bg-white/[0.06] text-white font-medium"
                  : soon 
                  ? "text-white/15 cursor-not-allowed"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.03] cursor-pointer"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              )}
              {label}
              {soon && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/25 ml-auto">
                  SOON
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Exit link in Sidebar footer */}
        <div className="px-4 py-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-900/40 transition cursor-pointer font-sans"
          >
            <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Exit Dashboard</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-mono text-white/30">All systems operational</span>
          </div>
          <p className="text-[9px] font-mono text-white/15">TracePilot AI · v0.1.0</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10">

        {/* Topbar */}
        <header className="h-14 border-b border-white/[0.06] flex items-center px-6 justify-between bg-[#08090d]/85 backdrop-blur-md shrink-0 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
          
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono text-white/40">Traces</h2>
            <span className="w-px h-3.5 bg-white/10" />
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              Live
            </span>
            <span className="w-px h-3.5 bg-white/10" />
            <span className="text-[10px] font-mono text-white/20">Last 10 traces · Auto-refreshing</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/25">
              <span className="flex items-center gap-1">
                <span className="text-cyan-400/65 font-bold">LAT:</span> 142ms
              </span>
              <span className="text-white/10">|</span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400/65 font-bold">RPS:</span> 98.2
              </span>
            </div>

            {/* Back to website button in top header */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="px-2.5 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/[0.18] bg-[#0c0d12] hover:bg-neutral-900 text-[10px] text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 font-mono cursor-pointer uppercase tracking-wider font-semibold"
            >
              <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Exit Console</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="flex-1 bg-[#050507]">
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">

            {!loading && traces.length === 0 && (
              <EmptyState apiKey={apiKey} />
            )}

            {!loading && traces.map((trace) => (
              <Card
                key={trace.trace_id}
                className="bg-[#0d0f14] border-white/[0.07] overflow-hidden rounded-xl hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-300"
              >
                {/* Trace header */}
                <CardHeader className="border-b border-white/[0.06] bg-[#0f1118] px-5 py-4 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold text-white leading-snug">
                        {trace.agent_name}
                      </CardTitle>
                      <p className="text-[10px] font-mono text-white/25 mt-1 truncate">
                        trace_id: {trace.trace_id}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md border-emerald-500/25 bg-emerald-500/10 text-emerald-400 font-semibold"
                    >
                      {trace.status}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Spans */}
                <CardContent className="px-5 pt-5 pb-4">
                  {trace.spans && trace.spans.length > 0 ? (
                    trace.spans.map((rootSpan: any) => (
                      <SpanNode key={rootSpan.span_id} span={rootSpan} />
                    ))
                  ) : (
                    <p className="text-xs font-mono text-white/20 py-2">
                      No activity recorded.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
