'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Building,
  Users2,
  Euro,
  FileCheck,
  MapPin,
  CheckCircle2,
  FolderOpen,
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

export default function BancActiuMunicipalUnifiedPage() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  const expedients = [
    { id: 'mun-01', titular: 'Família Gómez Riera', barri: 'Sant Ildefons', ajut: 'Subvenció Fiança Cadira Elèctrica', import: '350 €', estat: 'RESOLT_FAVORABLE' },
    { id: 'mun-02', titular: 'Família Vidal Font', barri: 'Fontsanta - Fatjó', ajut: 'Adaptació Domiciliària i Llit Hospitalari', import: '720 €', estat: 'EN_TRAMITACIO' },
    { id: 'mun-03', titular: 'Família Batlle Puig', barri: 'La Gavarra', ajut: 'Fons Municipal de Pobresa i Mobilitat', import: '200 €', estat: 'RESOLT_FAVORABLE' },
  ];

  const handleAppSelect = (app: AppDefinition) => {
    if (app.id === 'bancactiu-municipal') {
      setIsLauncherOpen(false);
      return;
    }
    window.location.href = resolveAppTargetUrl(app.id, app.port);
  };

  return (
    <RadialAuraBackground variant="municipal">
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
            <GlassBadge variant="blue" pulse>Mòdul Municipal Actiu (Vercel Cloud)</GlassBadge>
          </div>

          <GlassHeader
            appName="BancActiu Municipal (Serveis Socials i Entitats Locals)"
            badgeText="Ajuntament de Cornellà"
            badgeVariant="blue"
            userNom="Núria Soler (Treballadora Social Coordinadora)"
            userRol="Àrea d'Acció Social i Comunitària · Superadmin DNI 52622304Y"
            onOpenLauncher={() => setIsLauncherOpen(true)}
          />

          <main className="flex-1 my-6 space-y-6">
            <GlassCard variant="glow" glowColor="cyan" className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Gestió Municipal de Vulnerabilitat i Ajuts Socials
                    </h2>
                    <GlassBadge variant="blue">Cornellà de Llobregat</GlassBadge>
                  </div>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    Control d'expedients d'emergència social, subvencions locals per a persones en situació
                    de dependència i convenis directes de préstec comunitari amb la Creu Roja i associacions veïnals.
                  </p>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="primary" icon={<FolderOpen size={16} />}>
                    Nou Expedient Municipal
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                    <Building size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Barris Actius</div>
                    <div className="text-xl font-black text-white">5 Districtes</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300">Sant Ildefons, La Gavarra, Fontsanta, Centre, Almeda.</div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Euro size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Fons Municipal Liquidat</div>
                    <div className="text-xl font-black text-white">42.850 €</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300">892 ajuts concedits en l'exercici actual.</div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Users2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Ciutadans Beneficiaris</div>
                    <div className="text-xl font-black text-white">1.140 Persones</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300">Padró creuat amb el Servei d'Atenció Domiciliària (SAD).</div>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FileCheck size={18} className="text-blue-400" />
                Expedients d'Ajut d'Urgència Social en Curs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Codi Expedient</th>
                      <th className="p-3">Titular / Família</th>
                      <th className="p-3">Districte / Barri</th>
                      <th className="p-3">Concepte Ajut</th>
                      <th className="p-3">Import Fiança</th>
                      <th className="p-3">Estat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {expedients.map((e) => (
                      <tr key={e.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-blue-300">{e.id}</td>
                        <td className="p-3 font-semibold text-white">{e.titular}</td>
                        <td className="p-3 text-slate-300 flex items-center gap-1.5">
                          <MapPin size={12} className="text-blue-400" />
                          {e.barri}
                        </td>
                        <td className="p-3 text-slate-200">{e.ajut}</td>
                        <td className="p-3 font-bold text-emerald-400">{e.import}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            e.estat === 'RESOLT_FAVORABLE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {e.estat === 'RESOLT_FAVORABLE' ? 'Resolució Favorable' : 'En Tramitació'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </main>
        </div>

        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 2.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-municipal"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Municipal &middot; Ajuntament de Cornellà de Llobregat &middot; Serveis Socials &middot; Monorepo BancActiu 2.0
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
