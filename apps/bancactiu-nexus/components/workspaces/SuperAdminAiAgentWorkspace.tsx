'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Code2,
  CheckCircle2,
  Shield,
  FileCode,
  Layers,
  Zap,
  ArrowLeft,
  Clock,
  RotateCcw,
  Check,
  Terminal,
  Play,
  Sliders,
  AlertCircle
} from 'lucide-react';
import type { AIAgentExecutionResult, AIAgentHistoryItem } from '@/lib/ai-agent-engine';

interface SuperAdminAiAgentWorkspaceProps {
  onClose: () => void;
  onShowToast?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
}

const QUICK_PROMPTS = [
  'Añadir un nuevo campo de validación de gerencia en el formulario de centros',
  'Optimizar la consulta de expedientes de CAP Sant Ildefons',
  'Auditar y asegurar rutas de autenticación OIDC e idCAT Mòbil',
  'Auto-reparar alertas de seguretat i reforçar blindatge perimetral',
];

export const SuperAdminAiAgentWorkspace: React.FC<SuperAdminAiAgentWorkspaceProps> = ({
  onClose,
  onShowToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<AIAgentExecutionResult | null>(null);
  const [history, setHistory] = useState<AIAgentHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'console' | 'history'>('console');
  const [executionStep, setExecutionStep] = useState<number>(0);

  // Carregar històric inicial
  useEffect(() => {
    fetch('/api/admin/ai-agent')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.history) {
          setHistory(d.history);
        }
      })
      .catch(() => {});
  }, []);

  // Tecla ESC per tancar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Execució de la instrucció d'IA
  const handleExecutePrompt = async (selectedPrompt?: string) => {
    const textToExecute = selectedPrompt || prompt;
    if (!textToExecute.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      setExecutionStep(1);

      const stepTimer1 = setTimeout(() => setExecutionStep(2), 600);
      const stepTimer2 = setTimeout(() => setExecutionStep(3), 1200);
      const stepTimer3 = setTimeout(() => setExecutionStep(4), 1800);

      const res = await fetch('/api/admin/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToExecute,
          mode: 'EXECUTE_PATCH',
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await res.json();
      if (res.ok && data.ok) {
        setExecutionStep(5);
        setExecutionResult(data.result);
        if (onShowToast) {
          onShowToast(
            'success',
            'Modificació IA Executada',
            `S'han analitzat ${data.result.fitxersAfectats.length} fitxers i aplicat els pegats necessaris.`
          );
        }
        // Refrescar històric
        fetch('/api/admin/ai-agent')
          .then((r) => r.json())
          .then((d) => {
            if (d.ok && d.history) setHistory(d.history);
          });
      } else {
        if (onShowToast) {
          onShowToast('error', 'Error en processar', data.missatge || 'No s\'ha pogut completar.');
        }
      }
    } catch (err: any) {
      if (onShowToast) {
        onShowToast('error', 'Error de Comunicació', err.message || 'Error inesperat.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-indigo-400/30 shadow-2xl p-4 sm:p-6 md:p-8 space-y-6 text-slate-100 select-none">
      {/* IL·LUMINACIÓ AMBIENTAL FLUIDA I AURAS RADIALS */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* CAPÇALERA DE LA CONSOLA D'IA */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900/80 backdrop-blur-md rounded-[14px] flex items-center justify-center text-cyan-300">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-200 via-violet-100 to-cyan-200 bg-clip-text text-transparent">
                IA Agent Console · Manteniment a Demanda
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-300" />
                Autonomous Engine
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Instruccions en llenguatge natural per a l'anàlisi, generació de codi TypeScript/React i manteniment del sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Consola IA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Històric Intervencions
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Tancar</span>
            <kbd className="hidden md:inline-block bg-slate-900 px-1 py-0.5 rounded text-[10px] text-slate-400 font-mono">
              ESC
            </kbd>
          </button>
        </div>
      </div>

      {activeTab === 'console' && (
        <div className="relative z-10 space-y-6">
          {/* BARRA D'ENTRADA DE LLENGUATGE NATURAL (ESTIL WINDOWS GLASSMORPHISM) */}
          <div className="p-5 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-indigo-500/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Terminal size={14} className="text-cyan-400" />
                Instrucció en Llenguatge Natural per a la IA
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Workspace actiu: <strong className="text-slate-200">Sistem_Base</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isProcessing) handleExecutePrompt();
                  }}
                  placeholder="Escriu la teva petició (ex: 'Añadir un nuevo campo de validación de gerencia en el formulario de centros')..."
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition font-sans"
                />
              </div>

              <button
                type="button"
                onClick={() => handleExecutePrompt()}
                disabled={isProcessing || !prompt.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Analitzant i Aplicant...' : 'Executar Instrucció'}</span>
              </button>
            </div>

            {/* BOTONS D'INSTRUCCIONS RÀPIDES PRE-CONFIGURADES */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Exemples de Manteniment Evolutiu a Demanda:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(qp);
                      handleExecutePrompt(qp);
                    }}
                    disabled={isProcessing}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/60 border border-white/10 hover:border-indigo-400/40 text-slate-300 hover:text-white transition cursor-pointer text-left"
                  >
                    ⚡ {qp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PIPELINE DE PROCESSAMENT PER PASSOS EN TEMPS REAL */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-blue-950/50 backdrop-blur-xl border border-indigo-500/30 shadow-xl space-y-3 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Zap size={14} className="animate-bounce" />
                <span>Pipeline de Modificació Autònoma en Curs...</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                <div className={`p-2.5 rounded-xl border ${executionStep >= 1 ? 'bg-indigo-900/60 border-indigo-400 text-white' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                  1. Anàlisi Codi
                </div>
                <div className={`p-2.5 rounded-xl border ${executionStep >= 2 ? 'bg-indigo-900/60 border-indigo-400 text-white' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                  2. Generació TypeScript
                </div>
                <div className={`p-2.5 rounded-xl border ${executionStep >= 3 ? 'bg-indigo-900/60 border-indigo-400 text-white' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                  3. Verificació Seguretat
                </div>
                <div className={`p-2.5 rounded-xl border ${executionStep >= 4 ? 'bg-indigo-900/60 border-indigo-400 text-white' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                  4. Aplicació Pegat
                </div>
                <div className={`p-2.5 rounded-xl border ${executionStep >= 5 ? 'bg-teal-900/60 border-teal-400 text-white' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                  5. Registre Auditoria
                </div>
              </div>
            </div>
          )}

          {/* RESULTAT DE L'EXECUCIÓ: CODI GENERAT I FITXERS MODIFICATS */}
          {executionResult && !isProcessing && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="font-bold text-white">{executionResult.missatge}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {executionResult.intencioDetectada}
                </span>
              </div>

              {/* FITXERS MODIFICATS I DETALL DE PEGATS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Panell Esquerre: Passos de la Tasca */}
                <div className="p-5 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileCode size={14} className="text-indigo-400" />
                    Traçabilitat d'Accions Executades per l'Agent
                  </h4>
                  <div className="space-y-2 text-xs">
                    {executionResult.passosExecutats.map((p) => (
                      <div key={p.fase} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2">
                        <Check size={14} className="text-teal-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-white">{p.nom}</div>
                          <div className="text-[11px] text-slate-400">{p.descripcio}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panell Dret: Snippet de Codi Generat */}
                <div className="p-5 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Code2 size={14} className="text-teal-400" />
                    Pegat Generat i Aplicat a Sistem_Base
                  </h4>
                  {executionResult.codiProposat.map((cp, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-cyan-300 font-bold">{cp.fitxer}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Aplicat</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cp.explicacio}</p>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto">
                        <code>{cp.diffSnippet}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTANYA 2: HISTÒRIC D'INTERVENCIONS DE L'AGENT */}
      {activeTab === 'history' && (
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-400" />
              Registre Històric d'Intervencions Autònomes ({history.length})
            </span>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/60 backdrop-blur-xl text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Instrucció Prompt</th>
                  <th className="p-3">Intenció</th>
                  <th className="p-3">Fitxers Involucrats</th>
                  <th className="p-3">Estat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {h.timestamp.slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="p-3 font-semibold text-white max-w-xs truncate">
                      {h.prompt}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {h.intencio}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {h.fitxers.length} fitxers
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        APLICAT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAiAgentWorkspace;
