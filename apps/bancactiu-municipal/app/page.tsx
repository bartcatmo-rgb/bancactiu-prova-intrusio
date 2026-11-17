'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Building,
  Users2,
  Euro,
  FileCheck,
  MapPin,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import {
  RadialAuraBackground,
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassHeader,
  GlassModal,
  GatewayLauncher,
  AppDefinition,
  resolveAppTargetUrl
} from '@bancactiu/ui-glass';

export default function BancActiuMunicipalPage() {
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
    window.location.href = resolveAppTargetUrl(app);
  };

  return (
    <RadialAuraBackground variant="municipal">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <GlassHeader
          appName="BancActiu Municipal (Serveis Socials i Entitats Locals)"
          badgeText="Ajuntament de Cornellà"
          badgeVariant="blue"
          userNom="Núria Soler (Treballadora Social Coordinadora)"
          userRol="Àrea d'Acció Social i Comunitària"
          onOpenLauncher={() => setIsLauncherOpen(true)}
        />

        <main className="flex-1 my-4 space-y-6">
          <GlassCard variant="glow" glowColor="cyan" className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Gestió Municipal de Serveis Socials i Cohesió Comunitària
                  </h2>
                  <GlassBadge variant="blue">Cornellà de Llobregat</GlassBadge>
                </div>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Plataforma municipal per a la coordinació d'ajuts d'urgència social en ajudes tècniques.
                  Permet gestionar subvencions per a persones en situació de vulnerabilitat residencial i articular
                  la coordinació amb els districtes de Sant Ildefons, La Gavarra, Almeda, Fontsanta i Centre.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Mètriques municipals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                <Euro size={22} />
              </div>
              <div>
                <div className="text-xl font-black text-white">48.500 €</div>
                <div className="text-xs text-slate-400">Fons Municipal d'Ajudes Tècniques</div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                <FileCheck size={22} />
              </div>
              <div>
                <div className="text-xl font-black text-white">142</div>
                <div className="text-xs text-slate-400">Expedients Socials Resolts</div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
                <MapPin size={22} />
              </div>
              <div>
                <div className="text-xl font-black text-white">5 Districtes</div>
                <div className="text-xs text-slate-400">Xarxa de Barris de Cornellà</div>
              </div>
            </GlassCard>
          </div>

          {/* Llista d'expedients */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FolderOpen size={18} className="text-blue-400" />
              Expedients d'Ajuts d'Urgència Social en Tràmit
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Titular / Unitat Convivencial</th>
                    <th className="p-3">Districte / Barri</th>
                    <th className="p-3">Tipologia d'Ajut</th>
                    <th className="p-3">Import Assignat</th>
                    <th className="p-3">Estat Resolució</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {expedients.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-semibold text-white">{exp.titular}</td>
                      <td className="p-3 text-slate-300">{exp.barri}</td>
                      <td className="p-3 text-blue-300">{exp.ajut}</td>
                      <td className="p-3 font-mono font-bold text-white">{exp.import}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          exp.estat === 'RESOLT_FAVORABLE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {exp.estat === 'RESOLT_FAVORABLE' ? 'Resolució Favorable' : 'En Tramitació Tècnica'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="mt-8">
            <GatewayLauncher
              currentAppId="bancactiu-municipal"
              currentUserRole="AJUNTAMENT"
              onSelectApp={handleAppSelect}
            />
          </div>
        </main>

        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 2.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-municipal"
            currentUserRole="AJUNTAMENT"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-6 pt-3 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Municipal 2.0 &middot; Ajuntament de Cornellà de Llobregat &middot; Serveis Socials i Cohesió Comunitària
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
