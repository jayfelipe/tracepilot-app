"use client";
import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldCheck, Play, ArrowRight, Layers, Cpu, GitFork, 
  Settings, HelpCircle, Code2, AlertTriangle, ShieldAlert, Sparkles, 
  RotateCcw, DollarSign, Users, Briefcase, Zap, CheckCircle2, ChevronRight,
  Database, Hourglass, Menu, X, ArrowUpRight, Lock, Mail, 
  Ticket, QrCode, LogOut, Award, Check, Eye, EyeOff
} from 'lucide-react';
import DashboardMockup from '../components/DashboardMockup';
import TimelineVisualizer from '../components/TimelineVisualizer';
import LiveDebuggingVisual from '../components/LiveDebuggingVisual';
import DevExperience from '../components/DevExperience';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@/lib/supabase/client';

const logoPng = "/logo.png";

// Inline safe SVG icon components to prevent version mismatch in user Next.js projects
const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.397 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Chrome = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.39-5c.87-.64,1.71-1.32,2.51-2a75.43,75.43,0,0,0,72.6,0c.8,2,1.64,1.38,2.51,2a68.43,68.43,0,0,1-10.39,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,54.65,123.6,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36s11.5,5.68,11.41,12.63S48.71,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.19,46,96.1,53,91,65.69,84.69,65.69Z" />
  </svg>
);

// Define trust platform logos
const TRUST_PLATFORMS = [
  { name: 'OpenAI Compatible', desc: 'gpts-v2 hook' },
  { name: 'LangChain Ready', desc: 'callback handler' },
  { name: 'CrewAI Support', desc: 'task runtime' },
  { name: 'MCP Compatible', desc: 'protocol standard' }
];

// Define Section 2 (The Problem) simulated terminal error cards
const PROBLEM_CARDS = [
  {
    error: 'API Prompt Loop',
    code: 'Loop Warning',
    icon: RotateCcw,
    desc: 'Agent gets stuck in a loop calling the same search tool repeatedly, exhausting your token quota and causing timeouts.',
    metric: '154 retries • $11.20 wasted',
    statusClass: 'text-red-400 bg-red-950/20'
  },
  {
    error: 'Prompt Bloat',
    code: 'Bloated Context',
    icon: DollarSign,
    desc: 'Agent injects hundreds of raw system logs into the prompt context, causing an exponential surge in API costs.',
    metric: '1.2M tokens • $45.10 / sec',
    statusClass: 'text-yellow-400 bg-yellow-950/20'
  },
  {
    error: 'Hallucination',
    code: 'DB Exception',
    icon: ShieldAlert,
    desc: 'Agent hallucinated a database field "battery_charge" and crashed production queries with null entries.',
    metric: 'PG_QUERY • 500 ERROR',
    statusClass: 'text-red-400 bg-red-950/20'
  },
  {
    error: 'Agent Deadlock',
    code: 'Stalled Thread',
    icon: AlertTriangle,
    desc: 'Two dependent models wait indefinitely for each other to coordinate, resulting in an infinite stall.',
    metric: '0 metrics/s • Idle 14min',
    statusClass: 'text-zinc-400 bg-zinc-950'
  }
];

// Define Section 4 (How It Works) features
const HOW_IT_WORKS = [
  {
    icon: Code2,
    title: '1. Production SDK',
    desc: 'Import our single-line tracer wrapper. It wraps model routes silently without modifying standard async execution times.'
  },
  {
    icon: Layers,
    title: '2. Branching Graph',
    desc: 'Trace variables, system messages, database schemas, and tool outcomes displayed on a single, high-fidelity tree timeline.'
  },
  {
    icon: GitFork,
    title: '3. Time-Travel Replay',
    desc: 'Open failed traces, hot-swap values in our interactive sandbox console, and replay the agent execution onwards instantly.'
  }
];

const PROBLEM_CARDS_ES = [
  {
    error: 'Bucle de Prompts de API',
    code: 'Alerta Bucle',
    desc: 'El agente se atasca en un bucle llamando a la misma herramienta repetidamente, agotando tu cuota de tokens y causando tiempos de espera.',
    metric: '154 intentos • $11.20 descarrilados',
  },
  {
    error: 'Saturación de Prompt',
    code: 'Contexto Saturado',
    desc: 'El agente inyecta cientos de logs de sistema sin procesar en el contexto, provocando una escalada exponencial en costes de API.',
    metric: '1.2M tokens • $45.10 / seg',
  },
  {
    error: 'Alucinación',
    code: 'Excepción de BD',
    desc: 'El agente alucinó un campo de base de datos "battery_charge" y rompió las consultas de producción con registros nulos.',
    metric: 'PG_QUERY • ERROR 500',
  },
  {
    error: 'Punto Muerto de Agente',
    code: 'Hilo Estancado',
    desc: 'Dos modelos dependientes se esperan mutuamente de forma indefinida, resultando en un estancamiento infinito.',
    metric: '0 métricas/s • Inactivo 14min',
  }
];

const HOW_IT_WORKS_ES = [
  {
    title: '1. SDK de Producción',
    desc: 'Importa nuestro trazador de una sola línea. Envuelve las rutas de modelo de forma silenciosa sin alterar tiempos de respuesta estándar.'
  },
  {
    title: '2. Grafo de Bifurcación',
    desc: 'Rastrea variables, mensajes de sistema, esquemas y llamadas a herramientas en una única línea de tiempo con alta fidelidad.'
  },
  {
    title: '3. Rebobinado Temporal',
    desc: 'Abre trazas fallidas, edita valores en nuestra con solas de pruebas interactivas y relanza la ejecución con los datos reparados.'
  }
];

// English & Spanish translations dictionary for premium, clean developer copy
const T = {
  en: {
    heroSub: 'THE CONTROL LAYER FOR AUTONOMOUS IA',
    heroTitle_1: 'Debug AI Agents Like ',
    heroTitle_2: 'Software.',
    heroDesc: 'TracePilot lets engineering teams replay, fork, inspect and repair autonomous AI workflows in real time. Git-style branching meets runtime observability.',
    ctaGetStarted: 'Get Free API Key',
    ctaViewLive: 'View Live Replay',
    integrationStd: 'NATIVE INTEGRATION STANDARDS:',
    
    navProblem: 'The Problem',
    navTimeTravel: 'Time-Travel',
    navHowItWorks: 'How it works',
    navSdk: 'SDK Specs',
    navPrivateBeta: 'Instant Access',
    navNew: 'New',
    navSignIn: 'Sign In',
    navLogOut: 'Log Out',
    
    probBadge: 'THE OBSERVABILITY VOID',
    probTitle: 'AI Agents Fail in Ways Traditional Software Never Did',
    probDesc: 'Traditional monitoring telemetry can tell you your application is on fire. But it can\'t tell you why an LLM agent entered an endless prompt loop, hallucinated schemas, or wasted thousands in minutes.',
    probConclusion: '"Traditional metrics notify you when your stack breaks. TracePilot allows you to freeze the execution frame, rewind model states, correct variables, and replay securely."',
    probLearnLink: 'Learn about Time-Travel Debugging',
    
    howTitle: 'Three Steps to Full Agent Control',
    dxTitle: 'Built for Production AI Teams',
    dxDesc: 'Minimal setup. Maximum integration support. Hook models directly, stream variables, and export traces dynamically using high-scale standards.',
    
    portalBadge: 'Instant Access',
    portalCreator: 'Developer Profiles',
    portalHeader: 'Claim Your Free TracePilot API Key',
    portalDesc: 'Get immediate programmatic access. Over 200 developers have already generated active API keys to trace and debug agent executions in local and production environments.',
    portalCountLabel: 'active API keys generated',
    portalCountText: 'keys created today',
    portalPlaceholder: 'Work email address',
    portalBtn: 'Generate API Key',
    portalSuccess: 'API Key Created Successfully!',
    portalSuccessDesc: 'Your unique developer access token has been generated. Copy your credential on the right to start tracing executions.',
    
    passHeader: 'API KEY PASS',
    passBeta: 'DEVELOPER ACCESS',
    passLevel: 'ACCESS LEVEL',
    passLevelVal: 'Priority Team Seat',
    passSandboxVal: 'Developer Sandbox',
    passVerification: 'VERIFICATION',
    passUnverified: 'Awaiting Identity',
    passUser: 'MAPPED USER',
    passUnassigned: 'Unassigned',
    passStatus: 'STATUS',
    passStatusActive: 'Active & Verified',
    passStatusOffline: 'Offline',
    passAuthNotice: 'Link your GitHub or Google account to confirm your developer profile and fast-track access validation:',
    passGithubBtn: 'Verify GitHub',
    passGoogleBtn: 'Verify Google',
    passLinkedSuccess: 'Identity confirmed. Your profile details have been synchronized.',
    passOAuthSuccess: 'OAuth authentication successful.',
    
    modalHeader: 'Sign In to TracePilot AI',
    modalDesc: 'Authenticate your identity to view active telemetry logs, generate dynamic developer keys, and access tracing consoles.',
    modalGithubBtn: 'Authenticate with GitHub',
    modalGoogleBtn: 'Authenticate with Google Account',
    modalFooter: 'TracePilot respects standard OpenID & OAuth 2.0 specs. We do not store repository or personal tokens.',
    
    footerCopyright: '© 2026. All rights secured.',
    langLabel: 'Language / Idioma',
    langSelect: 'English'
  },
  es: {
    heroSub: 'LA CAPA DE CONTROL PARA IA AUTÓNOMA',
    heroTitle_1: 'Depura Agentes de IA Como ',
    heroTitle_2: 'Software.',
    heroDesc: 'TracePilot permite a los equipos de ingeniería reproducir, bifurcar, inspeccionar y reparar flujos de agentes de IA en tiempo real. Bifurcación estilo Git con observabilidad de ejecución.',
    ctaGetStarted: 'Obtener API Key Gratis',
    ctaViewLive: 'Ver Replay en Vivo',
    integrationStd: 'ESTÁNDARES DE INTEGRACIÓN NATIVA:',
    
    navProblem: 'El Problema',
    navTimeTravel: 'Time-Travel',
    navHowItWorks: 'Cómo funciona',
    navSdk: 'Especificaciones SDK',
    navPrivateBeta: 'Acceso Inmediato',
    navNew: 'Nuevo',
    navSignIn: 'Iniciar Sesión',
    navLogOut: 'Cerrar Sesión',
    
    probBadge: 'EL VACÍO DE OBSERVABILIDAD',
    probTitle: 'Agentes de IA fallan de formas que el software tradicional nunca lo hizo',
    probDesc: 'La telemetría de monitoreo tradicional te dice si tu aplicación se está quemando. Pero no te dice por qué un agente LLM entró en un ciclo infinito de prompts, alucinó esquemas o desperdició miles en minutos.',
    probConclusion: '"Las métricas tradicionales te notifican cuando tu infraestructura se rompe. TracePilot te permite congelar el marco de ejecución, rebobinar estados, corregir variables y reproducir con seguridad."',
    probLearnLink: 'Aprende sobre Depuración Time-Travel',
    
    howTitle: 'Tres Pasos para el Control Total del Agente',
    dxTitle: 'Creado para Equipos de IA en Producción',
    dxDesc: 'Configuración mínima. Máximo soporte de integración. Conecta modelos directamente, transmite variables y exporta trazas dinámicamente.',
    
    portalBadge: 'Acceso Inmediato',
    portalCreator: 'Perfiles de Desarrollador',
    portalHeader: 'Reclama tu API Key Gratis de TracePilot',
    portalDesc: 'Obtén acceso programático inmediato. Más de 1,482 desarrolladores ya han generado claves de API activas para rastrear y depurar agentes en entornos locales y producción.',
    portalCountLabel: 'claves de API activas generadas',
    portalCountText: 'creadas hoy',
    portalPlaceholder: 'Correo electrónico de trabajo',
    portalBtn: 'Generar API Key',
    portalSuccess: '¡API Key Creada con Éxito!',
    portalSuccessDesc: 'Tu token de acceso único para desarrollador ha sido generado. Copia tu credencial en la tarjeta de la derecha para comenzar el trazado.',
    
    passHeader: 'PASE DE API KEY',
    passBeta: 'ACCESO DESARROLLADOR',
    passLevel: 'NIVEL DE ACCESO',
    passLevelVal: 'Asiento de Equipo Prioritario',
    passSandboxVal: 'Sandbox de Desarrollador',
    passVerification: 'VERIFICACIÓN',
    passUnverified: 'Esperando Identidad',
    passUser: 'USUARIO VINCULADO',
    passUnassigned: 'Sin asignar',
    passStatus: 'ESTADO',
    passStatusActive: 'Activo y Verificado',
    passStatusOffline: 'Inactivo',
    passAuthNotice: 'Vincula tu cuenta de GitHub o Google para confirmar tu perfil de desarrollador y agilizar la validación de acceso:',
    passGithubBtn: 'Verificar GitHub',
    passGoogleBtn: 'Verificar Google',
    passLinkedSuccess: 'Identidad confirmada. Los detalles de tu perfil han sido sincronizados.',
    passOAuthSuccess: 'Autenticación OAuth exitosa.',
    
    modalHeader: 'Iniciar Sesión en TracePilot AI',
    modalDesc: 'Autentica tu identidad para ver registros de telemetría activos, generar claves de desarrollador dinámicas y acceder a consolas de trazado.',
    modalGithubBtn: 'Autenticarse con GitHub',
    modalGoogleBtn: 'Autenticarse con Cuenta de Google',
    modalFooter: 'TracePilot respeta las especificaciones estándar de OpenID y OAuth 2.0. No almacenamos repositorios ni tokens personales.',
    
    footerCopyright: '© 2026. Todos los derechos asegurados.',
    langLabel: 'Idioma / Language',
    langSelect: 'Español'
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const d = T[lang]; // active translation dictionary

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string>('');
  const [keyCopied, setKeyCopied] = useState(false);
  const [showFullApiKey, setShowFullApiKey] = useState(false);
  
  const [ticketData, setTicketData] = useState<{
    email: string;
    ticketNum: number;
    timestamp: string;
    boosted: boolean;
    provider?: 'github' | 'google';
    apiKey?: string;
  } | null>(null);
  const [waitlistCountCount, setWaitlistCountCount] = useState(1482);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState<'google' | 'github' | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    provider: 'github' | 'google';
  } | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Real GitHub Login using Popup
  const handleGitHubLogin = async () => {
    setAuthModalOpen(false);
    setIsAuthenticating(true); // Mostramos carga inmediatamente
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true, 
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      setIsAuthenticating(false);
      return;
    }

    if (data.url) {
      window.open(data.url, 'github-auth', 'width=600,height=800,left=200,top=100');
    }
  };

  // Real Google Login using Popup
  const handleGoogleLogin = async () => {
    setAuthModalOpen(false); 
    setIsAuthenticating(true); // Mostramos carga inmediatamente
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true, // La magia del Popup
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
      setIsAuthenticating(false);
      return;
    }

    // Abre la URL de Google en una ventanita pequeña
    if (data.url) {
      window.open(data.url, 'google-auth', 'width=600,height=800,left=200,top=100');
    }
  };

  // Función para buscar la API Key real en tu backend
  const fetchRealApiKey = async () => {
    try {
      const res = await fetch("/api/api-keys");
      if (res.ok) {
        const data = await res.json();
        setGeneratedApiKey(data.api_key);
        return data.api_key;
      }
    } catch (err) {
      console.error("Error fetching API key:", err);
    }
    return null;
  };

  // Listen for Supabase auth state changes & check initial session + handle focus
  useEffect(() => {
    const supabase = createClient();

    const setupUser = async (session: any) => {
      if (!session) return;
      
      const user = session.user;
      setCurrentUser({
        name: user.user_metadata.full_name || user.email || 'User',
        email: user.email!,
        avatar: user.user_metadata.avatar_url,
        provider: user.app_metadata.provider || 'github'
      });
      
      setIsJoined(true);
      setIsAuthenticating(false); // Quitamos el estado de carga
      
      const realKey = await fetchRealApiKey();
      
      setTicketData({
        email: user.email!,
        ticketNum: Math.floor(Math.random() * 1000) + 1, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        boosted: true,
        provider: user.app_metadata.provider || 'github',
        apiKey: realKey || 'Error loading key' 
      });
    };

    // 1. Revisar si ya hay sesión activa (para cuando recargas la página)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setupUser(session);
    });

    // 2. Escuchar cambios en tiempo real (cuando el popup cierra)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setupUser(session);
      }
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsJoined(false);
        setTicketData(null);
        setGeneratedApiKey('');
        setIsAuthenticating(false);
      }
    });

    // 3. BULLETPROOF: Fuerza chequeo de sesión cuando el usuario vuelve a la pestaña (cierra popup)
    const handleFocus = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && !currentUser) {
          setupUser(session);
        }
      });
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser]);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    
    const count = waitlistCountCount + 1;
    setWaitlistCountCount(count);
    setIsJoined(true);
    setTicketData({
      email: emailInput,
      ticketNum: count,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      boosted: false,
      provider: undefined,
      apiKey: undefined
    });
  };

  const copyApiKeyToClipboard = () => {
    const keyToCopy = generatedApiKey || ticketData?.apiKey || 'tp_live_sample982c7f42ae09';
    navigator.clipboard.writeText(keyToCopy);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#f5f5f5] font-sans antialiased selection:bg-cyan-500/30 selection:text-white">
      
      {/* Background Gradients & Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.25] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#0a182a]/30 via-transparent to-transparent pointer-events-none blur-3xl" />
      
      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#030303]/85 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-9">
            {/* Logo */}
            <a href="#" className="h-16 flex items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-transparent pointer-events-none" />
              <img
                src={typeof logoPng === 'string' ? logoPng : (logoPng as any)?.src || ''}
                alt="TracePilot AI"
                className="object-contain object-left w-auto h-24 relative z-10"
              />
            </a>
            
            {/* Nav links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-neutral-400 font-mono tracking-wider uppercase">
              <a href="#problem" className="hover:text-white transition">{d.navProblem}</a>
              <a href="#time-travel" className="hover:text-white transition">{d.navTimeTravel}</a>
              <a href="#how-it-works" className="hover:text-white transition">{d.navHowItWorks}</a>
              <a href="#sdk" className="hover:text-white transition">{d.navSdk}</a>
              <a href="#waitlist" className="hover:text-cyan-400 text-neutral-400 transition flex items-center space-x-1">
                <span>{d.navPrivateBeta}</span>
                <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-1 py-0.2 rounded text-[9px] uppercase font-bold">{d.navNew}</span>
              </a>
            </nav>
          </div>

          {/* Nav Right CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-2.5 bg-neutral-900 border border-neutral-800 rounded-full pl-2 pr-3 py-1 text-xs">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-5.5 h-5.5 rounded-full ring-1 ring-cyan-500" />
                <span className="font-mono text-neutral-200">{currentUser.name}</span>
                <button 
                  onClick={() => { 
                    const supabase = createClient(); 
                    supabase.auth.signOut(); 
                  }} 
                  className="text-[10px] text-red-400 hover:text-red-300 ml-1 font-mono hover:underline cursor-pointer"
                >
                  {d.navLogOut}
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setAuthModalOpen(true)} 
                  className="text-xs text-neutral-400 hover:text-white transition font-semibold cursor-pointer"
                >
                  {d.navSignIn}
                </button>
                <a 
                  href="#waitlist"
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs px-3.5 py-1.5 rounded-lg font-semibold transition animate-pulse"
                >
                  {d.ctaGetStarted}
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Open */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#040404] border-b border-neutral-900 px-4 py-4 space-y-3 font-mono text-xs uppercase tracking-wider">
            <a 
              href="#problem" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-neutral-400 hover:text-white py-1"
            >
              {d.navProblem}
            </a>
            <a 
              href="#time-travel" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-neutral-400 hover:text-white py-1"
            >
              {d.navTimeTravel}
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-neutral-400 hover:text-white py-1"
            >
              {d.navHowItWorks}
            </a>
            <a 
              href="#sdk" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-neutral-400 hover:text-white py-1"
            >
              {d.navSdk}
            </a>
            <a 
              href="#waitlist" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-cyan-400 hover:text-cyan-300 py-1"
            >
              {d.navPrivateBeta}
            </a>
            <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-neutral-200">{currentUser.name}</span>
                  <button onClick={() => { const supabase = createClient(); supabase.auth.signOut(); }} className="text-[10px] text-red-500">{d.navLogOut}</button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }} className="text-neutral-400">{d.navSignIn}</button>
                  <a 
                    href="#waitlist" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-cyan-500 text-black px-3.5 py-1.5 rounded font-bold"
                  >
                    {d.ctaGetStarted}
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative pt-12 md:pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left Glow Element */}
        <div className="absolute top-20 left-10 w-[240px] h-[240px] bg-cyan-950/20 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel text contents */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-neutral-900/60 border border-neutral-800 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-neutral-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{d.heroSub}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-none tracking-tight text-white">
              {d.heroTitle_1}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 font-bold">{d.heroTitle_2}</span>
            </h1>

            <p className="text-base text-neutral-400 leading-relaxed max-w-lg font-sans">
              {d.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="#waitlist" 
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-3 rounded-lg hover:cursor-pointer transition shadow-lg shadow-cyan-950/30 flex items-center space-x-1.5 font-sans"
              >
                <span>{d.ctaGetStarted}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard';
                  }
                }}
                className="bg-neutral-900 hover:bg-neutral-850 text-neutral-200 text-sm px-5 py-3 rounded-lg border border-neutral-800 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{d.ctaViewLive}</span>
              </button>
            </div>

            {/* Platform indicators */}
            <div className="pt-8 border-t border-neutral-900">
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mb-3.5">
                {d.integrationStd}
              </span>
              <div className="grid grid-cols-2 gap-4">
                {TRUST_PLATFORMS.map((plat) => (
                  <div key={plat.name} className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-neutral-300">{plat.name}</span>
                    <span className="text-[10px] font-mono text-neutral-600 italic mt-0.5">{plat.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right panel Mockup dashboard */}
          <div className="lg:col-span-7 w-full z-10">
            <DashboardMockup />
          </div>

        </div>

      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section id="problem" className="border-t border-neutral-900 bg-neutral-950/35 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block">{d.probBadge}</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {d.probTitle}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-sans">
            {d.probDesc}
          </p>
        </div>

        {/* Diagnostic Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEM_CARDS.map((card, index) => {
            const IconComp = card.icon;
            const esCard = PROBLEM_CARDS_ES[index];
            const displayError = lang === 'es' ? esCard.error : card.error;
            const displayCode = lang === 'es' ? esCard.code : card.code;
            const displayDesc = lang === 'es' ? esCard.desc : card.desc;
            const displayMetric = lang === 'es' ? esCard.metric : card.metric;
            
            return (
              <div 
                key={card.error} 
                className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl p-5 text-left flex flex-col justify-between h-[230px] transition relative group overflow-hidden"
              >
                {/* Card Glow accent */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/5 group-hover:bg-red-500/10 blur-xl rounded-full transition duration-300" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                      <IconComp className="w-4 h-4 text-neutral-300" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 font-bold">{displayCode}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-red-400 font-mono tracking-wider block uppercase mb-2">
                    {displayError}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {displayDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-900 mt-2 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                  <span>METRIC ERROR</span>
                  <span className="font-semibold text-neutral-300">{displayMetric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Problem conclusion line */}
        <div className="mt-12 bg-neutral-950 border border-neutral-900 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-sans">
            {d.probConclusion}
          </p>
          <a
            href="#time-travel"
            className="text-xs font-semibold font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 flex-shrink-0 group whitespace-nowrap"
          >
            <span>{d.probLearnLink}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </a>
        </div>

      </section>

      {/* SECTION 2B — BEFORE & AFTER */}
      <section className="py-16 border-t border-neutral-900 bg-[#050505]/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
          {/* Before column */}
          <div className="border border-neutral-900 bg-neutral-950/40 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 font-mono text-[9px] text-red-500 bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {lang === 'es' ? 'Depuración Tradicional' : 'Traditional Debugging'}
            </div>
            <h3 className="text-base font-bold font-display text-white mb-4">
              {lang === 'es' ? 'Antes de TracePilot' : 'Before TracePilot'}
            </h3>
            <ul className="space-y-4 text-xs font-sans text-neutral-400">
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold font-mono mt-0.5">✕</span>
                <span className="leading-relaxed">
                  {lang === 'es' 
                    ? 'Pasa 3 horas buscando en registros caóticos de terminales de servidor intentando adivinar por qué se atascó un bucle de agentes.'
                    : 'Spend 3 hours digging through chaotic logs across server terminals trying to guess why an agent loop stalled.'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold font-mono mt-0.5">✕</span>
                <span className="leading-relaxed">
                  {lang === 'es'
                    ? 'Reinicia todo el flujo del agente desde el paso uno, desperdiciando miles en credenciales de API y tokens de modelo.'
                    : 'Restart the entire multi-agent workflow from step one, wasting thousands of API credentials and model tokens.'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold font-mono mt-0.5">✕</span>
                <span className="leading-relaxed">
                  {lang === 'es'
                    ? 'Despliega parches especulativos a ciegas, esperando haber resuelto alucinaciones de memoria sin herramientas estándar de validación.'
                    : 'Deploy speculative hotfixes blindly, hoping you solved memory hallucinations without standard validation tools.'}
                </span>
              </li>
            </ul>
          </div>

          {/* After column */}
          <div className="border border-cyan-950/30 bg-neutral-950/60 p-6 rounded-xl relative overflow-hidden group shadow-lg shadow-cyan-950/5">
            <div className="absolute top-4 right-4 font-mono text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              TracePilot AI
            </div>
            <h3 className="text-base font-bold font-display text-white mb-4">
              {lang === 'es' ? 'Después de TracePilot' : 'After TracePilot'}
            </h3>
            <ul className="space-y-4 text-xs font-sans text-neutral-400">
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold font-mono mt-0.5">✓</span>
                <span className="leading-relaxed text-neutral-200">
                  {lang === 'es'
                    ? 'Reproduce, inspecciona e aísla ejecuciones fallidas de agentes de IA de forma instantánea en 20 segundos.'
                    : 'Replay, inspect, and isolate failed agent executions instantly in 20 seconds.'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold font-mono mt-0.5">✓</span>
                <span className="leading-relaxed text-neutral-200">
                  {lang === 'es'
                    ? 'Bifurca el nodo defectuoso exacto dentro de un sandbox local, reescribe los datos de entrada y continúa ejecutando.'
                    : 'Fork the exact failing node into a localized sandbox, rewrite the inputs, and play forward.'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold font-mono mt-0.5">✓</span>
                <span className="leading-relaxed text-neutral-200">
                  {lang === 'es'
                    ? 'Prueba correcciones con total seguridad y reubica indicaciones correctas en archivos de plantilla al instante.'
                    : 'Test corrections safely and deploy green path prompts back to template files instantly.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE CORE FEATURE (Time-Travel Debugging) */}
      <section id="time-travel" className="py-20 bg-neutral-900/10 border-t border-neutral-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            {lang === 'es' ? 'LA INNOVACIÓN CENTRAL' : 'THE CORE INNOVATION'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {lang === 'es' ? 'Detén Fallos con Depuración de Rebobinado Temporal' : 'Stop Failures with Time-Travel Debugging'}
          </h2>
          <p className="text-sm text-neutral-400 font-sans">
            {lang === 'es' 
              ? 'Reproduce cualquier ejecución de IA desde el paso exacto donde falló. Edita prompts, salidas de herramientas o estados de memoria, y relanza al instante.'
              : 'Replay any AI execution from the exact step where it failed. Edit prompts, tool outputs or memory state, then rerun instantly.'}
          </p>
        </div>

        {/* Time Travel Stepper component */}
        <div className="w-full relative z-10">
          <TimelineVisualizer lang={lang} />
        </div>

      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-neutral-900 bg-neutral-950/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            {lang === 'es' ? 'CÓMO FUNCIONA' : 'HOW IT WORKS'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {d.howTitle}
          </h2>
        </div>

        {/* Horizontal Three cards feature list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((work, idx) => {
            const IconObj = work.icon;
            const esWork = HOW_IT_WORKS_ES[idx];
            const displayTitle = lang === 'es' ? esWork.title : work.title;
            const displayDesc = lang === 'es' ? esWork.desc : work.desc;
            
            return (
              <div 
                key={work.title} 
                className="bg-[#050505] border border-neutral-900 rounded-xl p-6 text-left hover:border-neutral-800 transition relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-950/5 group-hover:bg-cyan-950/10 blur-2xl rounded-full transition" />
                
                <div className="w-12 h-12 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center mb-6">
                  <IconObj className="w-5 h-5 text-cyan-400" />
                </div>

                <h4 className="text-base font-bold text-white mb-2 font-display">{displayTitle}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">{displayDesc}</p>
                
                <div className="mt-6 text-[10px] font-mono text-neutral-600 block">
                  0{idx + 1} — {lang === 'es' ? 'ETAPA DE PIPELINE' : 'PIPELINE STAGE'}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* SECTION 5 — LIVE DEBUGGING VISUAL */}
      <section className="py-20 border-t border-neutral-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="w-full z-10 relative">
          <LiveDebuggingVisual lang={lang} />
        </div>

      </section>

      {/* SECTION 6 — DEVELOPER EXPERIENCE */}
      <section id="sdk" className="py-20 border-t border-neutral-900 bg-[#050505]/45 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.12] pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">{lang === 'es' ? 'EXPERIENCIA DE DESARROLLO' : 'DEVELOPER EXPERIENCE'}</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {d.dxTitle}
          </h2>
          <p className="text-sm text-neutral-400 font-sans">
            {d.dxDesc}
          </p>
        </div>

        {/* Code tabs section */}
        <div className="w-full relative z-10">
          <DevExperience lang={lang} />
        </div>

      </section>

      {/* SECTION 7 — WAITLIST PORTAL */}
      <section id="waitlist" className="py-24 border-t border-neutral-900 bg-[#050505]/40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        {/* Glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-cyan-950/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Panel: Conversion & Form */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-cyan-950/80 border border-cyan-850 text-cyan-400 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-bold uppercase">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>{d.portalBadge}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>{d.portalCreator}</span>
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold font-display text-white leading-tight tracking-tight">
              {d.portalHeader}
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans max-w-xl">
              {d.portalDesc}
            </p>

            {/* Authentication States CTA */}
            {isAuthenticating ? (
              <div className="space-y-4 max-w-md">
                <div className="bg-cyan-950/10 border border-cyan-500/20 p-4 rounded-xl flex items-center space-x-3 text-left">
                  <Hourglass className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-neutral-200 font-sans">
                      {lang === 'es' ? 'Verificando autenticación...' : 'Verifying authentication...'}
                    </h5>
                    <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                      {lang === 'es' ? 'Espera un momento mientras confirmamos tu identidad en el popup.' : 'Please wait a moment while we confirm your identity in the popup.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : !isJoined ? (
              <div className="space-y-4 max-w-md">
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-sans text-xs px-6 py-3.5 rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer shadow-xl shadow-cyan-950/40 w-full sm:w-auto"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Autenticarse para Generar API Key' : 'Authenticate to Generate API Key'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-neutral-500 font-mono leading-relaxed max-w-sm">
                  {lang === 'es' 
                    ? 'No se permiten registros anónimos. Requiere una cuenta instantánea y segura para evitar registros automatizados.' 
                    : 'Anonymous submissions are restricted. Secure OAuth login is required to prevent automated registration.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-w-md">
                <div className="bg-emerald-950/15 border border-emerald-900/45 p-4 rounded-xl flex items-start space-x-3 text-left">
                  <div className="p-1 px-1.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold mt-0.5">OK</div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-200 font-sans">{d.portalSuccess}</h5>
                    <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                      {d.portalSuccessDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Panel: Priority Access Pass */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[400px] relative">
              {/* Subtle ambient back-glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${isJoined && ticketData?.boosted ? 'from-emerald-500/10 to-cyan-500/10' : 'from-cyan-500/5 to-neutral-500/5'} blur-2xl rounded-2xl pointer-events-none`} />
              
              {/* Access Pass Container */}
              <div className={`relative bg-[#080808]/90 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 ${isJoined && (generatedApiKey || ticketData?.apiKey) ? 'border-cyan-500/30 shadow-2xl' : 'border-neutral-800'}`}>
                
                {/* Visual marker top block */}
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
                
                <div className="p-6 space-y-6">
                  
                  {/* Access Pass Header */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-cyan-400 text-[10px] font-mono">
                        P
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-neutral-300 block tracking-tight">TRACEPILOT</span>
                        <span className="text-[9px] font-mono text-neutral-500 block">{d.passBeta}</span>
                      </div>
                    </div>
                    <div>
                      <span className="inline-block bg-neutral-900 border border-neutral-800 rounded px-2.5 py-0.5 text-[9px] font-mono text-cyan-400 font-bold tracking-wider">
                        {isJoined ? (lang === 'es' ? 'CLAVE ACTIVA' : 'ACTIVE KEY PASS') : (lang === 'es' ? 'CLAVE DEMO' : 'DEMO KEY PASS')}
                      </span>
                    </div>
                  </div>

                  {/* Access Status fields */}
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase block">{d.passLevel}</span>
                        <span className="text-neutral-200 mt-0.5 block font-sans font-medium text-[11px] truncate">
                          {isJoined && ticketData?.boosted ? d.passLevelVal : d.passSandboxVal}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase block">{d.passVerification}</span>
                        <span className="text-neutral-200 font-sans mt-0.5 block font-medium text-[11px] flex items-center space-x-1">
                          {isJoined && ticketData?.boosted ? (
                            <>
                              {ticketData.provider === 'github' ? <Github className="w-3.5 h-3.5 text-neutral-400 inline" /> : <Chrome className="w-3.5 h-3.5 text-neutral-400 inline" />}
                              <span className="capitalize">{ticketData.provider} Linked</span>
                            </>
                          ) : d.passUnverified}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase block">{d.passUser}</span>
                        <span className="text-neutral-200 mt-0.5 block truncate font-sans font-medium text-[11px] max-w-[140px]" title={ticketData?.email || 'unassigned'}>
                          {isJoined ? ticketData?.email : d.passUnassigned}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase block">{d.passStatus}</span>
                        <span className="text-neutral-200 mt-0.5 block font-sans font-medium text-[11px] flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isJoined ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                          <span>{isJoined ? d.passStatusActive : d.passStatusOffline}</span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Divider line */}
                  <div className="border-t border-neutral-900" />

                  {/* Actions Area: Link OAuth or Show Generated API Key */}
                  <div className="space-y-4 pt-1 text-left">
                    {(isJoined && (generatedApiKey || ticketData?.apiKey)) ? (
                      <div className="space-y-3 animate-fade-in">
                        <div className="p-3.5 bg-neutral-950 border border-cyan-500/25 rounded-lg space-y-2.5 relative overflow-hidden group">
                          {/* Radial glowing overlay */}
                          <div className="absolute inset-0 bg-cyan-500/[0.02] pointer-events-none group-hover:bg-cyan-500/[0.04] transition" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
                              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                              <span>{lang === 'es' ? 'TU CLAVE DE API ACTIVADA:' : 'YOUR ACTIVE API KEY:'}</span>
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 select-none bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/30">live</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-neutral-900/90 border border-neutral-800 px-2.5 py-2 rounded font-mono text-xs text-[#eee] relative">
                            <span className="truncate flex-1 tracking-wider text-cyan-300 font-bold select-all">
                              {(() => {
                                const fullKey = generatedApiKey || ticketData?.apiKey || 'Error loading key';
                                if (showFullApiKey) return fullKey;
                                return `${fullKey.substring(0, 8)}••••••••••••••••${fullKey.slice(-4)}`;
                              })()}
                            </span>
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button 
                                onClick={() => setShowFullApiKey(!showFullApiKey)}
                                className="text-neutral-500 hover:text-neutral-300 p-1 rounded hover:bg-neutral-855 transition cursor-pointer"
                                title={showFullApiKey ? "Hide Key" : "Show Key"}
                              >
                                {showFullApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button 
                                onClick={copyApiKeyToClipboard}
                                className="text-neutral-400 hover:text-cyan-400 p-1 rounded hover:bg-neutral-850 transition cursor-pointer flex items-center"
                                title="Copy API Key"
                              >
                                {keyCopied ? <span className="text-[9px] bg-emerald-950/80 text-emerald-400 font-mono px-1 py-0.5 rounded border border-emerald-800">COPIED</span> : <Check className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <span className="text-[9px] text-neutral-500 font-mono block mt-1 leading-tight">
                            {lang === 'es' 
                              ? 'Úsala en tu terminal: export TRACEPILOT_API_KEY="tp_live_••••"'
                              : 'Run in terminal: export TRACEPILOT_API_KEY="tp_live_••••"'}
                          </span>
                        </div>

                        {currentUser && (
                          <div className="bg-cyan-950/10 border border-cyan-500/20 p-3 rounded-lg flex items-center space-x-2.5 text-left text-xs text-neutral-300 font-sans">
                            <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span>
                              {lang === 'es' 
                                ? `Identidad confirmada como ${currentUser.name} (${currentUser.provider}).` 
                                : `Identity confirmed as ${currentUser.name} (${currentUser.provider}).`}
                            </span>
                          </div>
                        )}

                        {/* Magical instant access dashboard trigger */}
                        <button 
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              window.location.href = '/dashboard';
                            }
                          }}
                          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-semibold text-xs py-2.5 rounded-lg transition shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-950/20 active:scale-98 font-mono tracking-wider uppercase font-bold"
                        >
                          <span>{lang === 'es' ? 'IR AL DASHBOARD DE TELEMETRÍA' : 'GO TO TELEMETRY DASHBOARD'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono text-neutral-400 leading-normal">
                          {d.passAuthNotice}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={handleGitHubLogin}
                            className="bg-neutral-900 hover:bg-neutral-850 text-neutral-250 border border-neutral-800 hover:border-neutral-700 font-medium font-sans text-xs py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Github className="w-3.5 h-3.5 text-neutral-300" />
                            <span>{d.passGithubBtn}</span>
                          </button>
                          <button 
                            onClick={handleGoogleLogin}
                            className="bg-neutral-900 hover:bg-neutral-850 text-neutral-250 border border-neutral-800 hover:border-neutral-700 font-medium font-sans text-xs py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Chrome className="w-3.5 h-3.5 text-neutral-300" />
                            <span>{d.passGoogleBtn}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AUTHENTICATION MODAL (GOOGLE/GITHUB POPUP) */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-[#020202]/85 backdrop-blur-sm hover:cursor-pointer"
            />
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-[#080808] border border-neutral-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl z-10 p-6 space-y-6"
            >
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-3 pb-2 select-none">
                <img 
                  src="/logo.png" 
                  alt="TracePilot AI" 
                  className="h-9 mx-auto object-contain"
                />
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Authenticate your identity to view active telemetry logs, fork execution replays, or claim premium waitlist slots.
                </p>
              </div>

              <div className="space-y-2">
                {/* GitHub OAuth Button - REAL POPUP */}
                <button 
                  onClick={handleGitHubLogin} 
                  className="w-full bg-[#111] hover:bg-neutral-900 text-neutral-250 border border-neutral-800 hover:border-neutral-700 hover:cursor-pointer font-semibold py-2.5 rounded-lg text-xs font-sans transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span>{d.modalGithubBtn}</span>
                </button>
                {/* Google OAuth Button - REAL POPUP */}
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-2.5 rounded-lg text-xs font-sans transition hover:cursor-pointer active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Chrome className="w-4 h-4 text-blue-500" />
                  <span>{d.modalGoogleBtn}</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-neutral-900"></div>
                <span className="flex-shrink mx-3 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                  Secure Developer Portal
                </span>
                <div className="flex-grow border-t border-neutral-900"></div>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-neutral-500 font-mono">
                  TracePilot respects standard OpenID & OAuth 2.0 specs. We do not store repository or personal tokens.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT MODAL */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactModalOpen(false)}
              className="absolute inset-0 bg-[#020202]/85 backdrop-blur-sm hover:cursor-pointer"
            />
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-[#080808]/95 border border-neutral-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl z-10 p-6 space-y-5"
            >
              <button 
                onClick={() => setContactModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 select-none">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs shadow-[0_0_12px_rgba(6,182,212,0.1)]">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold font-sans text-white tracking-tight">
                  {lang === 'es' ? 'Canales de Soporte' : 'Telemetry Support Channels'}
                </h3>
                <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  {lang === 'es' 
                    ? 'Conéctate con nuestro equipo central de ingeniería para resolver dudas o reportar incidentes.'
                    : 'Connect with our core engineering team to resolve questions or report incidents.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. DISCORD BUTTON - CHANGE Href HERE / CAMBIA EL LINK DE TU DISCORD AQUÍ */}
                <a 
                  href="https://discord.gg/ktYCtCA8D" // <-- DISCORD LINK (CHANGE THIS FOR REDIRECT)
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 rounded-lg text-xs font-sans transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/40 select-none cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <DiscordIcon className="w-4 h-4 text-white fill-current" />
                  <span>Join our discord</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                </a>

                {/* Separator / Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-neutral-900"></div>
                  <span className="flex-shrink mx-3 text-[9px] font-mono text-neutral-600 uppercase tracking-widest select-none">
                    {lang === 'es' ? 'O POR CORREO' : 'OR VIA EMAIL'}
                  </span>
                  <div className="flex-grow border-t border-neutral-900"></div>
                </div>

                {/* 2. EMAIL ADDRESS - CHANGE EMAIL HERE / CAMBIA EL CORREO AQUÍ */}
                <div className="bg-[#040404] hover:bg-[#060606] border border-neutral-850 rounded-lg p-3 text-center transition group">
                  <span className="block text-[10px] text-neutral-500 font-mono mb-1 uppercase tracking-wider select-none">
                    {lang === 'es' ? 'Correo de Contacto' : 'Direct Email Contact'}
                  </span>
                  <a 
                    href="mailto:support@tracepilot.ai" // <-- EMAIL ADDR (CHANGE THIS AS WELL)
                    className="font-mono text-xs text-cyan-400 hover:text-cyan-300 transition break-all underline select-all"
                  >
                    hello@tracepilotai.com
                  </a>
                </div>
              </div>

              <div className="text-center pt-2 select-none border-t border-neutral-900">
                <p className="text-[10px] text-neutral-600 font-mono leading-tight">
                  {lang === 'es' ? 'Tiempo de respuesta estimado: < 12 horas' : 'Estimated response latency: < 12 hours'}
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-[#020202] py-8 text-neutral-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png"
              alt="TracePilot" 
              className="h-15 object-contain"
            />
            <span className="text-neutral-800">|</span>
            <span>{d.footerCopyright}</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] flex-wrap justify-center font-sans">
            {/* Replaced The Problem & Time-Travel with Legal Links */}
            <a href="/terms" className="hover:text-neutral-300 transition">
              {lang === 'es' ? 'Términos' : 'Terms'}
            </a>
            <a href="/privacy" className="hover:text-neutral-300 transition">
              {lang === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <button 
              onClick={() => setContactModalOpen(true)}
              className="hover:text-neutral-300 transition cursor-pointer text-[11px]"
            >
              {lang === 'es' ? 'Contacto' : 'Contacts'}
            </button>
            <a href="#sdk" className="hover:text-neutral-300 transition">{d.navSdk}</a>
          </div>

          {/* Language Selector Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-neutral-500 uppercase">{d.langLabel}:</span>
            <div className="flex items-center bg-neutral-950 border border-neutral-850 p-0.5 rounded-lg">
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[9px] font-mono tracking-wider uppercase font-bold rounded transition-all cursor-pointer ${lang === 'en' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('es')}
                className={`px-2 py-1 text-[9px] font-mono tracking-wider uppercase font-bold rounded transition-all cursor-pointer ${lang === 'es' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                ES
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
