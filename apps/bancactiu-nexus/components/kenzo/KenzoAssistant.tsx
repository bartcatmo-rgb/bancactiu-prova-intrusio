'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Minimize2,
  FileText,
  TrendingUp,
  Server,
  Database,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Presentation,
  Send,
  Building2,
  HeartPulse,
  Users,
  Boxes,
  Cpu,
  User,
  Palette,
  GripHorizontal,
  Minus
} from 'lucide-react';
import {
  GlassCard,
  GlassButton,
  GlassBadge
} from '@bancactiu/ui-glass';

export type AppearanceProfile = 'kenzo' | 'kenza' | 'core';

interface ProfileMeta {
  id: AppearanceProfile;
  name: string;
  role: string;
  article: string;
  badgeLabel: string;
  triggerGradient: string;
  triggerShadow: string;
  triggerTextGlow: string;
  avatarBg: string;
  glowColor: 'purple' | 'cyan' | 'emerald';
  accentText: string;
  chatBadge: string;
  iconType: 'masculine' | 'feminine' | 'cyber';
  greetingText: string;
}

const PROFILES: Record<AppearanceProfile, ProfileMeta> = {
  kenzo: {
    id: 'kenzo',
    name: 'Kenzo',
    role: 'Assistent Executiu',
    article: 'en Kenzo',
    badgeLabel: 'Executiu',
    triggerGradient: 'from-blue-600/90 via-indigo-600/90 to-purple-600/90',
    triggerShadow: 'shadow-indigo-500/40',
    triggerTextGlow: 'text-cyan-300',
    avatarBg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600',
    glowColor: 'purple',
    accentText: 'text-cyan-300',
    chatBadge: 'Kenzo AI',
    iconType: 'masculine',
    greetingText: "Hola, Mireia Valls. Sóc en Kenzo, l'assistent executiu d'intel·ligència artificial i ciberseguretat de BancActiu Nexus 3.0. Puc auditar el monorepo, analitzar les mètriques dels 4 mòduls o projectar la presentació executiva de diapositives."
  },
  kenza: {
    id: 'kenza',
    name: 'Kenza',
    role: 'Assistenta Executiva',
    article: 'la Kenza',
    badgeLabel: 'Executiva',
    triggerGradient: 'from-rose-600/90 via-purple-600/90 to-amber-600/90',
    triggerShadow: 'shadow-rose-500/40',
    triggerTextGlow: 'text-rose-300',
    avatarBg: 'bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600',
    glowColor: 'purple',
    accentText: 'text-rose-300',
    chatBadge: 'Kenza AI',
    iconType: 'feminine',
    greetingText: "Hola, Mireia Valls. Sóc la Kenza, l'assistenta executiva d'intel·ligència artificial i coordinació institucional de BancActiu Nexus 3.0. Puc auditar el monorepo, analitzar les mètriques dels 4 mòduls o projectar la presentació executiva de diapositives."
  },
  core: {
    id: 'core',
    name: 'Kenz Core',
    role: 'Nucli IA Hologràfic',
    article: 'Kenz Core',
    badgeLabel: 'Hologràfic',
    triggerGradient: 'from-emerald-600/90 via-teal-600/90 to-cyan-600/90',
    triggerShadow: 'shadow-teal-500/40',
    triggerTextGlow: 'text-emerald-300',
    avatarBg: 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600',
    glowColor: 'emerald',
    accentText: 'text-emerald-300',
    chatBadge: 'Kenz Core',
    iconType: 'cyber',
    greetingText: "Protocol d'enllaç actiu, Mireia Valls. Sóc Kenz Core, el nucli tecnològic hologràfic i motor analític de BancActiu Nexus 2.0. Puc executar diagnòstics de seguretat, monitorar concurrència de serveis o reproduir la memòria tècnica."
  }
};

function AssistantIcon({ type, size = 18 }: { type: 'masculine' | 'feminine' | 'cyber'; size?: number }) {
  if (type === 'masculine') {
    return <Bot size={size} className="text-cyan-200" />;
  }
  if (type === 'feminine') {
    return <Sparkles size={size} className="text-rose-200" />;
  }
  return <Cpu size={size} className="text-emerald-200" />;
}

interface Slide {
  id: number;
  title: string;
  badge: string;
  subtitle: string;
  content: React.ReactNode;
}

export function KenzoAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'metrics' | 'slides' | 'chat'>('audit');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Capacitat de finestra arrossegable (Draggable) amb memòria de posició
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  // Perfil d'aparença seleccionable per l'usuari (Kenzo, Kenza, Kenz Core)
  const [appearance, setAppearance] = useState<AppearanceProfile>('kenzo');

  // Recuperar la preferència des de localStorage vinculada al Superadmin (DNI 52622304Y)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bancactiu_kenzo_appearance') as AppearanceProfile;
      if (saved && (saved === 'kenzo' || saved === 'kenza' || saved === 'core')) {
        setAppearance(saved);
        setMessages(prev => {
          if (prev.length === 1 && prev[0].sender === 'kenzo') {
            return [{ sender: 'kenzo', text: PROFILES[saved].greetingText, time: 'Ara' }];
          }
          return prev;
        });
      }

      const savedPos = localStorage.getItem('bancactiu_kenzo_pos');
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          setPosition(parsed);
        }
      }
    } catch {
      // Ignorar errors en entorns SSR
    }
  }, []);

  // Lògica de moviment draggable
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullScreen) return;
    // Evitar disparar si clica en un botó
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    const initialRect = windowRef.current?.getBoundingClientRect();
    const currentX = position?.x ?? (initialRect ? initialRect.left : Math.max(10, window.innerWidth - 530));
    const currentY = position?.y ?? (initialRect ? initialRect.top : Math.max(10, window.innerHeight - 620));

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentX,
      posY: currentY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;

      const newX = Math.max(10, Math.min(window.innerWidth - 320, dragStartRef.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, dragStartRef.current.posY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (position) {
          try {
            localStorage.setItem('bancactiu_kenzo_pos', JSON.stringify(position));
          } catch {}
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  const currentProfile = PROFILES[appearance];

  // Gestor del canvi d'aparença interactiva
  const handleSelectAppearance = (newProfile: AppearanceProfile) => {
    setAppearance(newProfile);
    try {
      localStorage.setItem('bancactiu_kenzo_appearance', newProfile);
    } catch {
      // Ignorar
    }

    const target = PROFILES[newProfile];
    setMessages(prev => [
      ...prev,
      {
        sender: 'kenzo',
        text: `Aparença actualitzada a ${target.name} (${target.role}). Interfície visual, paleta cromàtica i identificadors adaptats per a la sessió del Superadministrador (52622304Y).`,
        time: 'Ara'
      }
    ]);
  };

  // Estat del mode Slides
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Estat de mètriques per mòdul
  const [selectedModule, setSelectedModule] = useState<'salut' | 'municipal' | 'social' | 'operatiu'>('salut');

  // Xat amb Kenzo / Kenza / Kenz Core
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'kenzo'; text: string; time: string }>>([
    {
      sender: 'kenzo',
      text: PROFILES.kenzo.greetingText,
      time: 'Ara'
    }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Ara' };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Resposta contextualitzada de l'assistent segons perfil
    setTimeout(() => {
      let reply = `He registrat la vostra consulta al registre d'auditoria del Superadministrador via ${currentProfile.name}.`;
      const lower = userText.toLowerCase();

      if (lower.includes('aparença') || lower.includes('perfil') || lower.includes('kenza') || lower.includes('kenzo') || lower.includes('core')) {
        reply = `Podeu canviar d'aparença en qualsevol moment utilitzant el selector superior: Kenzo (Masculí/Executiu), Kenza (Femenina/Executiva) o Kenz Core (Hologràfic/Tecnològic). La vostra preferència es manté guardada.`;
      } else if (lower.includes('auditoria') || lower.includes('seguretat') || lower.includes('vulnerabilitat')) {
        reply = `Auditoria completada (${currentProfile.name}): Perímetre protegit amb Zero-Trust. Comptes acreditats: Marc Cachinero Baranda (DNI 48956602Z) i Administrador (IETI). Middleware actiu a Vercel Producció amb compliment ENS Nivell Alt (99.4%) i RGPD.`;
      } else if (lower.includes('metrica') || lower.includes('salut') || lower.includes('dades')) {
        reply = 'Mètriques actuals: 2.150 ajudes tècniques en circulació, taxa de reutilització comunitària del 94.2% i temps de resposta d\'interoperabilitat de 16.4ms.';
      } else if (lower.includes('slide') || lower.includes('presentacio') || lower.includes('diapositiva')) {
        setActiveTab('slides');
        reply = 'He activat el mode de Presentació de Diapositives (Slides Mode) a la pantalla principal per visualitzar el resum executiu.';
      } else if (lower.includes('centres') || lower.includes('gerencia')) {
        reply = 'Estat dels centres: 6 CAPs de la Gerència Metropolitana Sud integrats (Sant Ildefons, Bellvitge), Hospital de Bellvitge i Serveis Socials de Cornellà operatius.';
      } else if (lower.includes('enllaç') || lower.includes('ruta') || lower.includes('local') || lower.includes('produccio') || lower.includes('vercel')) {
        reply = 'Navegació dinàmica adaptativa activa: En local s\'apunta als ports 3000-3004, i a Vercel Cloud s\'utilitzen les rutes unificades (/salut, /municipal, /social, /operatiu) garantint zero fallades per localhost.';
      }

      setMessages(prev => [...prev, { sender: 'kenzo', text: reply, time: 'Ara' }]);
    }, 500);
  };

  // Diapositives per a la presentació executiva
  const slides: Slide[] = [
    {
      id: 1,
      title: 'BancActiu 2.0: Ecosistema Descentralitzat',
      badge: 'Resum Executiu',
      subtitle: 'Plataforma unificada per a la gestió descentralitzada d\'ajudes tècniques a Catalunya',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-2xl font-black text-white">5 Micro-Apps</span>
              <p className="text-xs text-purple-300 mt-1">Nexus, Salut, Municipal, Social, Operatiu</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <span className="text-2xl font-black text-white">100% Shared DB</span>
              <p className="text-xs text-cyan-300 mt-1">Paquet central @bancactiu/db</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-2xl font-black text-white">Zero-Trust</span>
              <p className="text-xs text-emerald-300 mt-1">SuperAdmin DNI 48956602Z</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            L'arquitectura modular permet que centres sanitaris (CAPs, hospitals), ajuntaments, serveis socials i entitats del tercer sector col·laborin en temps real sense dependències monolítiques, garantint la traçabilitat integral de cada recurs mèdic i social.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: 'Auditoria de Seguretat i Compliment ENS',
      badge: 'Ciberseguretat & ENS',
      subtitle: 'Blindatge perimetral segons l\'Esquema Nacional de Seguretat (Nivell Alt)',
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Identitat d'Accés Superadmin</div>
                  <div className="text-[10px] text-slate-400">Vinculada a Marc Cachinero Baranda (48956602Z) i Administrador</div>
                </div>
              </div>
              <GlassBadge variant="emerald">Validat 100%</GlassBadge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-white">Middleware Perimetral & SSR</div>
                  <div className="text-[10px] text-slate-400">Redirecció 307 estricta si no existeix sessió</div>
                </div>
              </div>
              <GlassBadge variant="purple">Actiu</GlassBadge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white">Xifrat de Dades & Traçabilitat RGPD</div>
                  <div className="text-[10px] text-slate-400">TLS 1.3, AES-256 i AuditLog immutable</div>
                </div>
              </div>
              <GlassBadge variant="blue">Auditat</GlassBadge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Mètriques d\'Impacte dels 4 Mòduls',
      badge: 'Rendiment Operatiu',
      subtitle: 'Indicadors clau de salut, atenció social, logística i administració',
      content: (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold mb-1">
              <HeartPulse size={14} /> BancActiu Salut
            </div>
            <div className="text-xl font-black text-white">1.420</div>
            <div className="text-[10px] text-slate-300">Prescripcions clíniques validades</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1">
              <Building2 size={14} /> BancActiu Municipal
            </div>
            <div className="text-xl font-black text-white">892</div>
            <div className="text-[10px] text-slate-300">Ajuts tècnics aprovats a Cornellà</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
              <Users size={14} /> BancActiu Social
            </div>
            <div className="text-xl font-black text-white">430</div>
            <div className="text-[10px] text-slate-300">Expedients de dependència tramitats</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
              <Boxes size={14} /> BancActiu Operatiu
            </div>
            <div className="text-xl font-black text-white">94.2%</div>
            <div className="text-[10px] text-slate-300">Taxa de reutilització de materials</div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Projecció de Concurrència (1-3 Anys Catalunya)',
      badge: 'Escalabilitat Massiva',
      subtitle: 'Simulació de càrrega territorial sobre la xarxa de CAPs i Hospitals',
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white">Concurrència Simultània Simulada</span>
              <span className="text-xs font-mono text-cyan-300">250.000 operacions</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full w-[99.8%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Disponibilitat: 99.85%</span>
              <span>Temps de resposta: 18.2ms</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            La segmentació en 5 micro-aplicacions independents evita el bloqueig de base de dades sota pics d'alta demanda com campanyes estacionals o emergències sociosanitàries.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: 'Full de Ruta i Pasarel·les AOC / Via Oberta',
      badge: 'Interoperabilitat Pública',
      subtitle: 'Integració amb serveis públics de Catalunya i l\'Administració Oberta',
      content: (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Connexió mTLS i Certificats Digitals idCAT / T-CAT
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Padró Municipal d'Habitants (Ajuntament de Cornellà)
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Registre de Dependència i Discapacitat (Generalitat de Catalunya)
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 font-medium">
            Sistema preparat per a homologació i certificació oficial.
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Botó Flotant inferior dret */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${currentProfile.triggerGradient} backdrop-blur-xl border border-white/25 shadow-2xl ${currentProfile.triggerShadow} hover:scale-105 active:scale-95 transition-all text-white`}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <AssistantIcon type={currentProfile.iconType} size={18} />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                {currentProfile.name} AI <Sparkles size={11} className={currentProfile.triggerTextGlow} />
              </div>
              <div className="text-[10px] text-white/80 font-medium">
                {currentProfile.role}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Caixa flotant de l'assistent Kenzo (Arrossegable / Draggable) */}
      {isOpen && (
        <div
          ref={windowRef}
          style={
            !isFullScreen && position
              ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
              : undefined
          }
          className={`fixed z-50 transition-shadow ${
            isFullScreen
              ? 'inset-4 md:inset-8'
              : position
              ? 'w-[94vw] sm:w-[500px] max-h-[88vh]'
              : 'bottom-6 right-6 w-[94vw] sm:w-[500px] max-h-[88vh]'
          }`}
        >
          <GlassCard
            variant="glow"
            glowColor={currentProfile.glowColor}
            className="w-full h-full flex flex-col backdrop-blur-3xl shadow-2xl border-white/20 p-4 sm:p-5 select-none"
          >
            {/* Capçalera de l'assistent (Barra arrossegable) */}
            <div
              onMouseDown={handleMouseDown}
              className={`flex items-center justify-between pb-3 border-b border-slate-200 shrink-0 select-none ${
                !isFullScreen ? 'cursor-move' : ''
              }`}
              title={!isFullScreen ? 'Fes clic i arrossega per moure la finestra' : ''}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl ${currentProfile.avatarBg} flex items-center justify-center text-white shadow-md`}>
                  <AssistantIcon type={currentProfile.iconType} size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{currentProfile.name} Assistant</h3>
                    <GlassBadge variant={appearance === 'kenza' ? 'purple' : appearance === 'core' ? 'emerald' : 'blue'} pulse>Online</GlassBadge>
                    {!isFullScreen && (
                      <span className="hidden sm:inline-flex items-center text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 gap-0.5">
                        <GripHorizontal size={11} className="text-slate-400" /> Arrossega
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {currentProfile.role} &middot; DNI / ID: <span className="text-cyan-700 font-mono font-semibold">48956602Z / Administrador</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                {/* Botó Minimitzar Ràpid */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Minimitzar ràpidament"
                >
                  <Minus size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title={isFullScreen ? 'Reduir' : 'Pantalla completa'}
                >
                  {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Tancar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Selector d'Aparència Interactiu (Kenzo, Kenza, Kenz Core) */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 rounded-xl border border-slate-200 shrink-0 my-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                <Palette size={13} className={currentProfile.accentText} />
                <span>Aparença:</span>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <button
                  onClick={() => handleSelectAppearance('kenzo')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                    appearance === 'kenzo'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Kenzo: Aparença masculina / Executiu"
                >
                  <Bot size={11} className={appearance === 'kenzo' ? 'text-cyan-200' : ''} />
                  Kenzo
                </button>
                <button
                  onClick={() => handleSelectAppearance('kenza')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                    appearance === 'kenza'
                      ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Kenza: Aparença femenina / Executiva"
                >
                  <Sparkles size={11} className={appearance === 'kenza' ? 'text-rose-200' : ''} />
                  Kenza
                </button>
                <button
                  onClick={() => handleSelectAppearance('core')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                    appearance === 'core'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Kenz Core: Aparença neutra / Hologràfica tecnològica"
                >
                  <Cpu size={11} className={appearance === 'core' ? 'text-emerald-200' : ''} />
                  Kenz Core
                </button>
              </div>
            </div>

            {/* Pestañes de Funcionalitat */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-3 shrink-0">
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'audit'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield size={12} />
                Auditoria
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'metrics'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity size={12} />
                Mètriques
              </button>
              <button
                onClick={() => setActiveTab('slides')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'slides'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Presentation size={12} />
                Slides
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot size={12} />
                Consultes
              </button>
            </div>

            {/* Contingut Dinàmic segons Pestaña */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 min-h-[260px]">
              {/* PESTANYA 1: AUDITORIA DE SISTEMES */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Server size={14} className="text-purple-400" />
                        Monorepo BancActiu 2.0
                      </span>
                      <GlassBadge variant="emerald">5 Apps Operatives</GlassBadge>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      El sistema opera amb arquitectura de micro-aplicacions amb el paquet compartit <code className="text-cyan-300">@bancactiu/db</code> i <code className="text-cyan-300">@bancactiu/ui-glass</code>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock size={14} className="text-cyan-400" />
                      Estat de Seguretat i Accés Superadmin
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400">DNI Superadmin:</span>
                        <div className="font-mono text-cyan-300 font-bold">48956602Z</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400">Control Perimetral:</span>
                        <div className="text-emerald-400 font-bold">Zero-Trust Actiu</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400">ENS Certificació:</span>
                        <div className="text-purple-300 font-bold">Nivell Alt (99.4%)</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400">Vercel Producció:</span>
                        <div className="text-emerald-400 font-bold">Aliased & Ready</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>Tots els serveis i pasarel·les responen amb normalitat.</span>
                  </div>
                </div>
              )}

              {/* PESTANYA 2: MÈTRIQUES PER MÒDUL */}
              {activeTab === 'metrics' && (
                <div className="space-y-3">
                  {/* Selector de Mòdul */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/10">
                    <button
                      onClick={() => setSelectedModule('salut')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                        selectedModule === 'salut' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Salut
                    </button>
                    <button
                      onClick={() => setSelectedModule('municipal')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                        selectedModule === 'municipal' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Municipal
                    </button>
                    <button
                      onClick={() => setSelectedModule('social')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                        selectedModule === 'social' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Social
                    </button>
                    <button
                      onClick={() => setSelectedModule('operatiu')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                        selectedModule === 'operatiu' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Operatiu
                    </button>
                  </div>

                  {/* Dades del mòdul seleccionat */}
                  {selectedModule === 'salut' && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">BancActiu Salut (CatSalut)</span>
                        <GlassBadge variant="rose">Port 3001</GlassBadge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Validacions Clíniques:</span>
                          <div className="text-base font-black text-rose-300">1.420</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Centres Connectats:</span>
                          <div className="text-base font-black text-white">6 CAPs + Hosp.</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Integració directa amb la història clínica electrònica UAC i validació per metges d'atenció primària.
                      </p>
                    </div>
                  )}

                  {selectedModule === 'municipal' && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">BancActiu Municipal (Cornellà)</span>
                        <GlassBadge variant="blue">Port 3002</GlassBadge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Ajudes Aprovades:</span>
                          <div className="text-base font-black text-blue-300">892</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Sincronització Padró:</span>
                          <div className="text-base font-black text-emerald-400">100% OK</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Gestió de subvencions municipals d'accessibilitat i coordinació territorial amb entitats veïnals.
                      </p>
                    </div>
                  )}

                  {selectedModule === 'social' && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">BancActiu Social (Benestar)</span>
                        <GlassBadge variant="amber">Port 3003</GlassBadge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Expedients Dependència:</span>
                          <div className="text-base font-black text-amber-300">430</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Intervencions Socials:</span>
                          <div className="text-base font-black text-white">320 Fars</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Avaluació sociodemogràfica de la llar, seguiment de vulnerabilitat i aplicació de la Llei 39/2006.
                      </p>
                    </div>
                  )}

                  {selectedModule === 'operatiu' && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">BancActiu Operatiu (Logística)</span>
                        <GlassBadge variant="emerald">Port 3004</GlassBadge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Materials en Stock:</span>
                          <div className="text-base font-black text-emerald-300">2.150</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <span className="text-slate-400 text-[10px]">Taxa Reutilització:</span>
                          <div className="text-base font-black text-cyan-300">94.2%</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Gestió de magatzem central, assignació de transport, control de números de sèrie i manteniment Creu Roja.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PESTANYA 3: MODE PRESENTACIÓ DE DIAPOSITIVES (SLIDES MODE) */}
              {activeTab === 'slides' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-white/15 shadow-xl min-h-[240px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <GlassBadge variant="purple">
                          {slides[currentSlideIndex].badge}
                        </GlassBadge>
                        <span className="text-xs font-mono text-cyan-300">
                          {currentSlideIndex + 1} / {slides.length}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white tracking-tight mb-1">
                        {slides[currentSlideIndex].title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mb-3">
                        {slides[currentSlideIndex].subtitle}
                      </p>
                      {slides[currentSlideIndex].content}
                    </div>

                    {/* Controls de Navegació de Slides */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
                      <button
                        onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentSlideIndex === 0}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft size={14} /> Anterior
                      </button>

                      {/* Punts selectors de diapositiva */}
                      <div className="flex items-center gap-1.5">
                        {slides.map((s, idx) => (
                          <button
                            key={s.id}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              currentSlideIndex === idx ? 'w-5 bg-cyan-400' : 'w-2 bg-white/20'
                            }`}
                            title={`Anar a diapositiva ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                        disabled={currentSlideIndex === slides.length - 1}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white flex items-center gap-1 transition-all"
                      >
                        Següent <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTANYA 4: XAT INTEL·LIGENT AMB KENZO / KENZA / KENZ CORE */}
              {activeTab === 'chat' && (
                <div className="space-y-3 flex flex-col h-[280px]">
                  <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-slate-950/50 rounded-xl border border-white/10 text-xs">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl max-w-[88%] leading-relaxed ${
                          m.sender === 'user'
                            ? 'ml-auto bg-purple-600/30 border border-purple-500/40 text-white'
                            : 'mr-auto bg-slate-900/80 border border-white/10 text-slate-200'
                        }`}
                      >
                        <div className={`text-[10px] ${m.sender === 'user' ? 'text-cyan-300' : currentProfile.accentText} font-bold mb-0.5`}>
                          {m.sender === 'user' ? 'Superadmin (52622304Y)' : `${currentProfile.name} AI`}
                        </div>
                        {m.text}
                      </div>
                    ))}
                  </div>

                  {/* Accions ràpides suggerides */}
                  <div className="flex gap-1.5 overflow-x-auto py-1 text-[10px]">
                    <button
                      onClick={() => {
                        setChatInput('Auditar estat general del sistema');
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 whitespace-nowrap"
                    >
                      Auditar estat
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('slides');
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 whitespace-nowrap"
                    >
                      Presentar Slides
                    </button>
                    <button
                      onClick={() => {
                        setChatInput('Mètriques de concurrència');
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 whitespace-nowrap"
                    >
                      Concurrència
                    </button>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Pregunta a ${currentProfile.name} sobre el sistema...`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                    />
                    <GlassButton type="submit" variant="primary" size="sm" icon={<Send size={13} />}>
                      Enviar
                    </GlassButton>
                  </form>
                </div>
              )}
            </div>

            {/* Peu de la targeta */}
            <div className="pt-2.5 mt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
              <span>{currentProfile.name} Assistant v2.0 &middot; BancActiu AI</span>
              <span className="font-mono text-cyan-300">Generalitat de Catalunya</span>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
