"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  ArrowUpDown,
  X,
  Loader2,
  CircleDot,
  GitBranch,
  Eye,
  EyeOff,
  GitFork,
} from "lucide-react";

// ============================================================
// TIPOS
// ============================================================
interface Span {
  id: string;
  trace_id: string;
  parent_id: string | null;
  name: string;
  kind: string;
  start_time: string;
  end_time: string;
  execution_time_ms: number;
  status_code: number;
  status_message: string;
  attributes: Record<string, any>;
  children: Span[];
  tokens_used?: number; // <-- NUEVO
  model?: string;       // <-- NUEVO
}

interface Trace {
  id: string;
  trace_id: string;
  name: string;
  kind: string;
  start_time: string;
  end_time: string;
  execution_time_ms: number;
  status_code: number;
  status_message: string;
  attributes: Record<string, any>;
  spans: Span[];
  created_at: string;
}

interface SpanNodeProps {
  span: Span;
  depth: number;
  traceStartTime: string;
  totalDurationMs: number;
  expandedSpans: Set<string>;
  toggleSpan: (id: string) => void;
}

// ============================================================
// HELPERS
// ============================================================
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch {
    return iso;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "";
  }
}

function getKindBadge(kind: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    CLIENT: {
      label: "CLIENT",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    SERVER: {
      label: "SERVER",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    PRODUCER: {
      label: "PRODUCER",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    CONSUMER: {
      label: "CONSUMER",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    INTERNAL: {
      label: "INTERNAL",
      color: "text-zinc-400",
      bg: "bg-zinc-500/10 border-zinc-500/20",
    },
  };
  return (
    map[kind?.toUpperCase()] || {
      label: kind || "UNKNOWN",
      color: "text-zinc-400",
      bg: "bg-zinc-500/10 border-zinc-500/20",
    }
  );
}

function getStatusCodeStyle(code: number) {
  if (code >= 200 && code < 300)
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      ring: "ring-emerald-500/30",
    };
  if (code >= 300 && code < 400)
    return {
      color: "text-sky-400",
      bg: "bg-sky-500/15",
      ring: "ring-sky-500/30",
    };
  if (code >= 400 && code < 500)
    return {
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      ring: "ring-amber-500/30",
    };
  return {
    color: "text-red-400",
    bg: "bg-red-500/15",
    ring: "ring-red-500/30",
  };
}

// ============================================================
// COMPONENTE: SpanNode (con renderData mejorado para LLMs)
// ============================================================
function SpanNode({
  span,
  depth,
  traceStartTime,
  totalDurationMs,
  expandedSpans,
  toggleSpan,
}: SpanNodeProps) {
  const hasChildren = span.children && span.children.length > 0;
  const isExpanded = expandedSpans.has(span.id);
  const kindBadge = getKindBadge(span.kind);
  const statusStyle = getStatusCodeStyle(span.status_code);

  // Cálculo de posición en la waterfall
  const spanStart = new Date(span.start_time).getTime();
  const traceStart = new Date(traceStartTime).getTime();
  const offsetMs = spanStart - traceStart;
  const leftPercent =
    totalDurationMs > 0 ? (offsetMs / totalDurationMs) * 100 : 0;
  const widthPercent =
    totalDurationMs > 0
      ? Math.max((span.execution_time_ms / totalDurationMs) * 100, 0.5)
      : 100;

  // Color de la barra según latencia
  const barColor =
    span.execution_time_ms > 800
      ? "bg-red-500/70"
      : span.execution_time_ms > 300
        ? "bg-amber-500/60"
        : "bg-cyan-500/50";

  // Función auxiliar para calcular costo estimado
  const calculateCost = (model: string | undefined, tokens: number | undefined) => {
    if (!tokens) return null;
    // Precios aproximados de OpenAI por 1 token
    const pricePerToken = model?.includes('gpt-4o') ? 0.000005 : 0.00000015; // GPT-4o vs Mini
    const cost = tokens * pricePerToken;
    return cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2);
  };

  // ============================================================
  // MEJORA: renderData inteligente para JSON y LLM Content
  // ============================================================
  const renderData = (data: any): React.ReactNode => {
    if (!data) return <span className="text-zinc-600 italic">N/A</span>;

    let parsed = data;

    // Intentar parsear si es string
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch {
        // Si no es JSON válido, devolverlo como texto con saltos de línea
        return (
          <span className="whitespace-pre-wrap break-words text-zinc-300">
            {data}
          </span>
        );
      }
    }

    // Si es un array, iterar recursivamente
    if (Array.isArray(parsed)) {
      return (
        <div className="space-y-3">
          {parsed.map((item, idx) => (
            <div key={idx}>{renderData(item)}</div>
          ))}
        </div>
      );
    }

    // Si es un objeto
    if (typeof parsed === "object" && parsed !== null) {
      // Detectar si es un mensaje tipo LLM (role + content)
      if ("role" in parsed && "content" in parsed) {
        const roleColors: Record<string, string> = {
          assistant:
            "bg-violet-500/15 text-violet-400 border-violet-500/30",
          user: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          system: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          tool: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
        const colorClass =
          roleColors[parsed.role] ||
          "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${colorClass}`}
              >
                {String(parsed.role).toUpperCase()}
              </span>
              {parsed.model && (
                <span className="text-[9px] font-mono text-zinc-600">
                  model: {parsed.model}
                </span>
              )}
              {parsed.refusal && (
                <span className="text-[9px] font-mono text-red-400">
                  ⚠ Refusal
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap break-words leading-relaxed bg-black/20 p-2.5 rounded border border-white/[0.04]">
              {String(parsed.content)}
            </div>
            {parsed.annotations && parsed.annotations.length > 0 && (
              <div className="text-[9px] text-zinc-600 mt-1">
                Annotations: {JSON.stringify(parsed.annotations)}
              </div>
            )}
          </div>
        );
      }

      // Objeto genérico: formatear como JSON bonito
      return (
        <pre className="whitespace-pre-wrap break-words text-zinc-400 text-[10px]">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    }

    // Fallback para primitivos
    return <span className="text-zinc-400">{String(parsed)}</span>;
  };

  return (
    <>
      <div
        className="group flex items-center gap-2 py-1.5 px-3 hover:bg-white/[0.02] transition-colors duration-150"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Toggle expandir/colapsar */}
        <button
          onClick={() => hasChildren && toggleSpan(span.id)}
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasChildren
              ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              : "text-transparent"
          }`}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            ))}
        </button>

        {/* Nombre del span */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-300 truncate">
            {span.name}
          </span>

          {/* Badge Kind */}
          <span
            className={`flex-shrink-0 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${kindBadge.bg} ${kindBadge.color}`}
          >
            {kindBadge.label}
          </span>

          {/* Status Code */}
          {span.status_code > 0 && (
            <span
              className={`flex-shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ring-1 ${statusStyle.bg} ${statusStyle.color} ${statusStyle.ring}`}
            >
              {span.status_code}
            </span>
          )}
        </div>

        {/* Waterfall bar */}
        <div className="w-48 flex-shrink-0 relative h-4">
          <div
            className={`absolute top-0.5 h-3 rounded-sm ${barColor} transition-all duration-300`}
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          />
        </div>

        {/* Duración */}
        <span
          className={`flex-shrink-0 text-[10px] font-mono w-20 text-right ${
            span.execution_time_ms > 800
              ? "text-red-400 font-bold"
              : span.execution_time_ms > 300
                ? "text-amber-400 font-semibold"
                : "text-zinc-500"
          }`}
        >
          {span.execution_time_ms.toFixed(1)}ms
        </span>
      </div>

      {/* Detalle expandido */}
      {isExpanded && (
        <div
          className="border-t border-b border-white/[0.04] bg-white/[0.01]"
          style={{ paddingLeft: `${depth * 24 + 44}px` }}
        >
          <div className="py-3 pr-4 space-y-3">
            {/* Tiempos */}
            <div className="flex gap-6 text-[10px] font-mono">
              <span className="text-zinc-600">
                Start:{" "}
                <span className="text-zinc-400">
                  {formatTime(span.start_time)}
                </span>
              </span>
              <span className="text-zinc-600">
                End:{" "}
                <span className="text-zinc-400">
                  {formatTime(span.end_time)}
                </span>
              </span>
              <span className="text-zinc-600">
                Duration:{" "}
                <span
                  className={
                    span.execution_time_ms > 800
                      ? "text-red-400 font-bold"
                      : span.execution_time_ms > 300
                        ? "text-amber-400"
                        : "text-cyan-400"
                  }
                >
                  {span.execution_time_ms.toFixed(2)}ms
                </span>
              </span>
            </div>

            {/* Status Message */}
            {span.status_message && (
              <div className="text-[10px] font-mono">
                <span className="text-zinc-600">Status: </span>
                <span
                  className={
                    span.status_code >= 400
                      ? "text-red-400"
                      : "text-zinc-400"
                  }
                >
                  {span.status_message}
                </span>
              </div>
            )}

            {/* Tokens y Costo Estimado */}
            {span.tokens_used && (
              <span className="flex items-center gap-1 text-amber-400/60 text-[10px] font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                ${calculateCost(span.model, span.tokens_used) || '0.00'} / {span.tokens_used} tokens
              </span>
            )}

            {/* Forked Output (Especial) */}
            {span.attributes?.forked_output && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-3 h-3 text-cyan-500/70" />
                  <span className="text-[9px] font-mono text-cyan-500/80 uppercase tracking-wider font-bold">
                    Forked Output
                  </span>
                </div>
                <div className="bg-cyan-500/[0.03] border border-cyan-500/10 rounded p-2.5 max-h-80 overflow-auto">
                  {renderData(span.attributes.forked_output)}
                </div>
              </div>
            )}

            {/* Attributes generales */}
            {span.attributes &&
              Object.keys(span.attributes).length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                    Attributes
                  </span>
                  <div className="bg-black/30 rounded border border-white/[0.04] p-2.5 max-h-64 overflow-auto">
                    {renderData(span.attributes)}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Hijos recursivos */}
      {hasChildren &&
        isExpanded &&
        span.children.map((child) => (
          <SpanNode
            key={child.id}
            span={child}
            depth={depth + 1}
            traceStartTime={traceStartTime}
            totalDurationMs={totalDurationMs}
            expandedSpans={expandedSpans}
            toggleSpan={toggleSpan}
          />
        ))}
    </>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: Dashboard
// ============================================================
export default function DashboardPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [latency, setLatency] = useState(0);
  const [rps, setRps] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKind, setFilterKind] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"time" | "duration" | "name">("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Calcular métricas en tiempo real
  // ============================================================
  useEffect(() => {
    if (traces.length === 0) {
      setLatency(0);
      setRps(0);
      return;
    }

    // 1. Calcular Latencia Promedio (LAT)
    let totalMs = 0;
    let spanCount = 0;

    const sumSpanTimes = (spans: Span[]) => {
      spans.forEach((span) => {
        totalMs += span.execution_time_ms || 0;
        spanCount++;
        if (span.children && span.children.length > 0) {
          sumSpanTimes(span.children);
        }
      });
    };

    traces.forEach((trace) => {
      if (trace.spans) sumSpanTimes(trace.spans);
    });

    const avgLatency = spanCount > 0 ? Math.round(totalMs / spanCount) : 0;
    setLatency(avgLatency);

    // 2. Calcular Requests Por Segundo (RPS)
    if (traces.length >= 2) {
      const oldestTraceTime = new Date(
        traces[traces.length - 1].created_at
      ).getTime();
      const newestTraceTime = new Date(traces[0].created_at).getTime();
      const diffSeconds = (newestTraceTime - oldestTraceTime) / 1000;

      if (diffSeconds > 0) {
        setRps(parseFloat((traces.length / diffSeconds).toFixed(1)));
      } else {
        setRps(traces.length);
      }
    } else {
      setRps(0.1);
    }
  }, [traces]);

  // Fetch traces
  const fetchTraces = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/traces");
      if (!res.ok) throw new Error("Error cargando trazas");
      const data = await res.json();
      setTraces(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTraces();
  }, [fetchTraces]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchTraces, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTraces]);

  // Toggle span expand/collapse
  const toggleSpan = (id: string) => {
    setExpandedSpans((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Expandir todos los spans de una traza
  const expandAllSpans = (spans: Span[], expand: boolean) => {
    const ids = new Set<string>();
    const collect = (s: Span[]) => {
      s.forEach((span) => {
        ids.add(span.id);
        if (span.children) collect(span.children);
      });
    };
    collect(spans);
    if (expand) {
      setExpandedSpans((prev) => new Set([...prev, ...ids]));
    } else {
      setExpandedSpans((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  // Filtrado y ordenación
  const filteredTraces = traces
    .filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name?.toLowerCase().includes(q);
        const matchTraceId = t.trace_id?.toLowerCase().includes(q);
        if (!matchName && !matchTraceId) return false;
      }
      if (filterKind !== "ALL" && t.kind?.toUpperCase() !== filterKind)
        return false;
      if (filterStatus === "OK" && t.status_code >= 400) return false;
      if (filterStatus === "ERROR" && t.status_code < 400) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "time") {
        cmp =
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime();
      } else if (sortBy === "duration") {
        cmp = b.execution_time_ms - a.execution_time_ms;
      } else {
        cmp = a.name.localeCompare(b.name);
      }
      return sortDir === "asc" ? -cmp : cmp;
    });

  // Helper: clase de color para latencia
  const getLatencyColorClass = (ms: number) => {
    if (ms > 800) return "text-red-400 font-bold animate-pulse";
    if (ms > 300) return "text-amber-400 font-semibold";
    if (ms >= 1) return "text-emerald-400";
    return "text-zinc-500";
  };

  // Contar spans totales de una traza
  const countSpans = (spans: Span[]): number => {
    let count = 0;
    spans.forEach((s) => {
      count++;
      if (s.children) count += countSpans(s.children);
    });
    return count;
  };

  // ============================================================
  // RENDER: Loading
  // ============================================================
  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="text-sm font-mono text-zinc-500">
            Cargando trazas...
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER: Dashboard
  // ============================================================
  return (
    <div className="h-screen bg-[#0a0a0b] flex flex-col overflow-hidden">
      {/* ======================================================== */}
      {/* TOPBAR */}
      {/* ======================================================== */}
      <header className="flex-shrink-0 border-b border-white/[0.06] bg-[#0d0d0f]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-11">
          {/* Left: Logo + Título */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <span className="text-xs font-semibold tracking-wide text-zinc-200">
                TraceViewer
              </span>
            </div>
            <span className="text-white/[0.06]">|</span>
            <span className="text-[10px] font-mono text-zinc-600">
              {filteredTraces.length} trazas
            </span>
          </div>

          {/* Métricas dinámicas LAT / RPS con colores */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/25">
            <span className="flex items-center gap-1">
              <span className="text-cyan-400/65 font-bold">LAT:</span>
              <span className={getLatencyColorClass(latency)}>
                {latency}ms
              </span>
            </span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-400/65 font-bold">RPS:</span>
              <span
                className={`${rps > 50 ? "text-amber-400 font-bold" : ""}`}
              >
                {rps}
              </span>
            </span>
          </div>

          {/* Right: Controles */}
          <div className="flex items-center gap-2">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                autoRefresh
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-zinc-600 bg-white/[0.03]"
              }`}
            >
              <Activity className="w-3 h-3" />
              <span className="hidden md:inline">Live</span>
            </button>

            {/* Refresh manual */}
            <button
              onClick={fetchTraces}
              className="text-zinc-600 hover:text-zinc-300 p-1 rounded hover:bg-white/5 transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* TOOLBAR: Búsqueda y filtros */}
      {/* ======================================================== */}
      <div className="flex-shrink-0 border-b border-white/[0.04] bg-[#0c0c0e]">
        <div className="flex items-center gap-2 px-4 h-10">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o trace ID..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded pl-8 pr-3 py-1.5 text-[11px] font-mono text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filtro Kind */}
          <select
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-1.5 text-[11px] font-mono text-zinc-400 focus:outline-none focus:border-cyan-500/30 appearance-none cursor-pointer"
          >
            <option value="ALL">Todo Kind</option>
            <option value="CLIENT">CLIENT</option>
            <option value="SERVER">SERVER</option>
            <option value="PRODUCER">PRODUCER</option>
            <option value="CONSUMER">CONSUMER</option>
            <option value="INTERNAL">INTERNAL</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-1.5 text-[11px] font-mono text-zinc-400 focus:outline-none focus:border-cyan-500/30 appearance-none cursor-pointer"
          >
            <option value="ALL">Todo Status</option>
            <option value="OK">OK (2xx-3xx)</option>
            <option value="ERROR">Error (4xx-5xx)</option>
          </select>

          {/* Sort */}
          <button
            onClick={() => {
              if (sortBy === "time") setSortBy("duration");
              else if (sortBy === "duration") setSortBy("name");
              else setSortBy("time");
            }}
            className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 px-2 py-1.5 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortBy === "time"
              ? "Tiempo"
              : sortBy === "duration"
                ? "Duración"
                : "Nombre"}
          </button>

          <button
            onClick={() =>
              setSortDir((d) => (d === "asc" ? "desc" : "asc"))
            }
            className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 px-2 py-1.5 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ====================================================== */}
        {/* LISTA DE TRAZAS (izquierda) */}
        {/* ====================================================== */}
        <div
          className={`${
            selectedTrace ? "w-72 lg:w-80" : "w-full"
          } flex-shrink-0 border-r border-white/[0.04] flex flex-col transition-all duration-300`}
        >
          {/* Error */}
          {error && (
            <div className="mx-3 mt-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {filteredTraces.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-700">
                <GitBranch className="w-8 h-8 mb-2" />
                <span className="text-xs font-mono">
                  {traces.length === 0
                    ? "Sin trazas disponibles"
                    : "Sin resultados"}
                </span>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03]">
                {filteredTraces.map((trace) => {
                  const isSelected = selectedTrace?.id === trace.id;
                  const spanCount = trace.spans
                    ? countSpans(trace.spans)
                    : 0;
                  const kindInfo = getKindBadge(trace.kind);
                  const statusInfo = getStatusCodeStyle(trace.status_code);
                  const isSlow = trace.execution_time_ms > 800;
                  const isWarning =
                    trace.execution_time_ms > 300 &&
                    trace.execution_time_ms <= 800;

                  return (
                    <button
                      key={trace.id}
                      onClick={() => {
                        setSelectedTrace(
                          isSelected ? null : trace
                        );
                        if (!isSelected) {
                          setExpandedSpans(new Set());
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 transition-all duration-150 group ${
                        isSelected
                          ? "bg-cyan-500/[0.06] border-l-2 border-l-cyan-500/60"
                          : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`text-[11px] font-mono truncate ${
                                isSelected
                                  ? "text-zinc-200"
                                  : "text-zinc-400 group-hover:text-zinc-300"
                              }`}
                            >
                              {trace.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[8px] font-mono font-semibold px-1 py-0.5 rounded border ${kindInfo.bg} ${kindInfo.color}`}
                            >
                              {kindInfo.label}
                            </span>
                            {trace.status_code > 0 && (
                              <span
                                className={`text-[8px] font-mono font-bold px-1 py-0.5 rounded ${statusInfo.bg} ${statusInfo.color}`}
                              >
                                {trace.status_code}
                              </span>
                            )}
                            {spanCount > 0 && (
                              <span className="text-[8px] font-mono text-zinc-700">
                                {spanCount} span{spanCount !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Duración + indicador visual */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`text-[11px] font-mono font-medium ${
                              isSlow
                                ? "text-red-400"
                                : isWarning
                                  ? "text-amber-400"
                                  : "text-zinc-500"
                            }`}
                          >
                            {trace.execution_time_ms.toFixed(1)}ms
                          </span>
                          {/* Mini waterfall */}
                          <div className="w-16 h-1 mt-1 bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isSlow
                                  ? "bg-red-500/60"
                                  : isWarning
                                    ? "bg-amber-500/50"
                                    : "bg-cyan-500/40"
                              }`}
                              style={{
                                width: `${Math.min(
                                  (trace.execution_time_ms / 2000) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Trace ID + tiempo */}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] font-mono text-zinc-700 truncate max-w-[140px]">
                          {trace.trace_id?.substring(0, 16)}...
                        </span>
                        <span className="text-[9px] font-mono text-zinc-700">
                          {formatTime(trace.created_at)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ====================================================== */}
        {/* DETALLE DE TRAZA (derecha) */}
        {/* ====================================================== */}
        {selectedTrace && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0b0b0d]">
            {/* Header del detalle */}
            <div className="flex-shrink-0 border-b border-white/[0.06] bg-[#0d0d0f] px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200 mb-1">
                    {selectedTrace.name}
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-zinc-600">
                      Trace:{" "}
                      <span className="text-zinc-400">
                        {selectedTrace.trace_id}
                      </span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-zinc-600">
                      {formatDate(selectedTrace.created_at)}{" "}
                      {formatTime(selectedTrace.start_time)} →{" "}
                      {formatTime(selectedTrace.end_time)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Expand/Collapse all */}
                  <button
                    onClick={() =>
                      expandAllSpans(selectedTrace.spans || [], true)
                    }
                    className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 px-2 py-1 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Expandir
                  </button>
                  <button
                    onClick={() =>
                      expandAllSpans(selectedTrace.spans || [], false)
                    }
                    className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 px-2 py-1 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    Colapsar
                  </button>
                  <button
                    onClick={() => setSelectedTrace(null)}
                    className="text-zinc-600 hover:text-zinc-300 p-1 rounded hover:bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Resumen de métricas */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <Clock className="w-3 h-3 text-cyan-500/50" />
                  <span className="text-zinc-600">Total:</span>
                  <span
                    className={
                      selectedTrace.execution_time_ms > 800
                        ? "text-red-400 font-bold"
                        : selectedTrace.execution_time_ms > 300
                          ? "text-amber-400 font-semibold"
                          : "text-emerald-400"
                    }
                  >
                    {selectedTrace.execution_time_ms.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <CircleDot className="w-3 h-3 text-violet-500/50" />
                  <span className="text-zinc-600">Spans:</span>
                  <span className="text-zinc-400">
                    {countSpans(selectedTrace.spans || [])}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <Zap className="w-3 h-3 text-amber-500/50" />
                  <span className="text-zinc-600">Status:</span>
                  <span
                    className={
                      selectedTrace.status_code >= 400
                        ? "text-red-400 font-bold"
                        : "text-emerald-400"
                    }
                  >
                    {selectedTrace.status_code || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Waterfall header */}
            <div className="flex-shrink-0 flex items-center gap-2 py-1.5 px-3 border-b border-white/[0.04] bg-[#0c0c0e]">
              <div className="w-5 flex-shrink-0" />
              <div className="flex-1 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                Span
              </div>
              <div className="w-48 flex-shrink-0 text-[9px] font-mono text-zinc-600 uppercase tracking-wider text-center">
                Timeline
              </div>
              <div className="w-20 flex-shrink-0 text-[9px] font-mono text-zinc-600 uppercase tracking-wider text-right">
                Duración
              </div>
            </div>

            {/* Spans */}
            <div className="flex-1 overflow-y-auto">
              {selectedTrace.spans && selectedTrace.spans.length > 0 ? (
                selectedTrace.spans.map((span) => (
                  <SpanNode
                    key={span.id}
                    span={span}
                    depth={0}
                    traceStartTime={selectedTrace.start_time}
                    totalDurationMs={selectedTrace.execution_time_ms}
                    expandedSpans={expandedSpans}
                    toggleSpan={toggleSpan}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-700">
                  <GitBranch className="w-6 h-6 mb-2" />
                  <span className="text-xs font-mono">
                    Sin spans en esta traza
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
