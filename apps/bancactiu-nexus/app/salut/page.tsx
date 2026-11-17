'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  ClipboardCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import {
  RadialAuraBackground,
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassHeader,
  GlassModal,
  GatewayLauncher,
  AppDefinition
} from '@bancactiu/ui-glass';
import { resolveAppTargetUrl } from '@/lib/navigation';

export default function BancActiuSalutUnifiedPage() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [barthelScore, setBarthelScore] = useState<number>(45);
  const [activeTab, setActiveTab] = useState<'prescripcions' | 'barthel' | 'centres'>('prescripcions');

  const [prescripcions, setPrescripcions] = useState([
    { id: 'presc-1', pacient: 'Antònia Riera Gómez', cip: 'RIEG540212001', diagnosi: 'Ictus isquèmic amb hemiparèsia dreta', material: 'Cadira de Rodes Autopropulsable Alumini', cap: 'CAP Sant Ildefons', estat: 'PENDENT_VALIDACIO', barthel: 45 },
    { id: 'presc-2', pacient: 'Joan Puigdemunt Vidal', cip: 'PUIV480905002', diagnosi: 'Artroplàstia total de maluc bilateral', material: 'Caminador 4 Rodes amb Fre i Seient', cap: 'CAP Bellvitge', estat: 'VALIDAT', barthel: 60 },
    { id: 'presc-3', pacient: 'Montserrat Batlle Font', cip: 'BATF390118003', diagnosi: 'Insuficiència respiratòria crònica avançada', material: 'Llit Articulat Elèctric Hospitalari', cap: 'CAP Sant Ildefons', estat: 'PENDENT_VALIDACIO', barthel: 25 },
  ]);

  const handleValidar = (id: string) => {
    setPrescripcions(prev => prev.map(p => p.id === id ? { ...p, estat: 'VALIDAT' } : p));
  };

  const handleAppSelect = (app: AppDefinition) => {
    if (app.id === 'bancactiu-salut') {
      setIsLauncherOpen(false);
      return;
    }
    window.location.href = resolveAppTargetUrl(app.id, app.port);
  };

  return (
    <RadialAuraBackground variant="salut">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-screen">
        <div>
          {/* Barra superior de retorn al Gateway Nexus */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all font-semibold"
            >
              <ArrowLeft size={14} />
              <span>← Tornar a BancActiu Nexus</span>
            </Link>
            <GlassBadge variant="emerald" pulse>Mòdul Salut Actiu (Vercel Cloud)</GlassBadge>
          </div>

          <GlassHeader
            appName="BancActiu Salut (Portal Tècnics de Salut)"
            badgeText="CatSalut / ICS · GAPIC"
            badgeVariant="emerald"
            userNom="Dr. Jaume Gutiérrez (Metge d'Atenció Primària)"
            userRol="Facultatiu CAP Sant Ildefons · Superadmin DNI 52622304Y"
            onOpenLauncher={() => setIsLauncherOpen(true)}
          />

          <main className="flex-1 my-6 space-y-6">
            {/* Banner de Benvinguda */}
            <GlassCard variant="glow" glowColor="emerald" className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Validació Clínica i Coordinació Ortopèdica d'Atenció Primària
                    </h2>
                    <GlassBadge variant="emerald">CatSalut Conforme</GlassBadge>
                  </div>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    Entorn clínic per a metges de família, rehabilitadors i infermeres comunitàries.
                    Permet avaluar l'autonomia funcional del pacient mitjançant l'escala Barthel, aprovar sol·licituds
                    d'ajudes tècniques i coordinar derivacions directes amb el banc de recursos de Cornellà.
                  </p>
                </div>
                <div className="flex gap-2">
                  <GlassButton
                    variant="success"
                    onClick={() => setActiveTab('prescripcions')}
                    icon={<ClipboardCheck size={16} />}
                  >
                    Prescripcions ({prescripcions.filter(p => p.estat === 'PENDENT_VALIDACIO').length})
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    onClick={() => setActiveTab('barthel')}
                    icon={<Stethoscope size={16} />}
                  >
                    Calculadora Barthel
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {/* Subvistes */}
            {activeTab === 'prescripcions' && (
              <GlassCard className="p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-400" />
                  Cua de Prescripcions Ortopèdiques Pendents
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Pacient / CIP</th>
                        <th className="p-3">Diagnosi Clínica</th>
                        <th className="p-3">Material Sol·licitat</th>
                        <th className="p-3">Centre CAP</th>
                        <th className="p-3">Estat</th>
                        <th className="p-3 text-right">Acció</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-200">
                      {prescripcions.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">
                            {p.pacient}
                            <div className="text-[10px] text-emerald-300 font-mono">{p.cip}</div>
                          </td>
                          <td className="p-3 text-slate-300">{p.diagnosi}</td>
                          <td className="p-3 font-medium text-emerald-200">{p.material}</td>
                          <td className="p-3 text-slate-400">{p.cap}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.estat === 'VALIDAT'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {p.estat === 'VALIDAT' ? 'Aprovat Clínic' : 'Pendent Avaluació'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {p.estat === 'PENDENT_VALIDACIO' ? (
                              <GlassButton
                                variant="success"
                                size="sm"
                                onClick={() => handleValidar(p.id)}
                                icon={<CheckCircle2 size={13} />}
                              >
                                Validar Prescripció
                              </GlassButton>
                            ) : (
                              <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                                <ShieldCheck size={14} /> Validada
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {activeTab === 'barthel' && (
              <GlassCard className="p-6">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Stethoscope size={18} className="text-emerald-400" />
                  Avaluació Funcional: Escala de Barthel
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Puntuació d'autonomia en les activitats bàsiques de la vida diària per a la idoneïtat de material ortopèdic.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="col-span-2 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                        <span>Nivell d'independència de deambulació:</span>
                        <span className="text-emerald-400">{barthelScore} / 100 punts</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={barthelScore}
                        onChange={(e) => setBarthelScore(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Classificació de Dependència:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          barthelScore < 20 ? 'bg-rose-500/20 text-rose-300' :
                          barthelScore < 60 ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {barthelScore < 20 ? 'Dependència Total' : barthelScore < 60 ? 'Dependència Severa / Moderada' : 'Autonomia Funcional'}
                        </span>
                      </div>
                      <p>
                        Criteri clínic CatSalut: Prescripció d'ajuda tècnica d'alta intensitat (llit articulat o cadira elèctrica) recomanada per a puntuacions Barthel &lt; 50.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 text-center flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{barthelScore}</span>
                    <span className="text-xs text-emerald-300 mt-1">Índex Barthel Global</span>
                  </div>
                </div>
              </GlassCard>
            )}
          </main>
        </div>

        {/* Modal Launcher */}
        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 2.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-salut"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Salut &middot; Departament de Salut &middot; Generalitat de Catalunya &middot; Monorepo BancActiu 2.0
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
