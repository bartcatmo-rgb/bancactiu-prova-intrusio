'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Wrench,
  Gift,
  Users,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileText,
  Hammer,
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
import { BancActiuSocialWorkspace } from '@/components/workspaces/BancActiuSocialWorkspace';
import { WorkshopAndRepairsWorkspace } from '@/components/workspaces/WorkshopAndRepairsWorkspace';
import { resolveAppTargetUrl } from '@/lib/navigation';

export default function BancActiuSocialUnifiedPage() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fitxa-social' | 'taller-solidari'>('fitxa-social');

  const reparacionsTaller = [
    { id: 'rep-1', codi: 'CR-LUG-04', element: 'Cadira de Rodes Autopropulsable', accio: 'Ajust de rodaments i frens bilaterals', voluntari: 'Albert Puig (Mecànic Voluntari)', estat: 'PUNT_A_PUNT' },
    { id: 'rep-2', codi: 'CAM-ROD-09', element: 'Caminador 4 Rodes', accio: 'Substitució de gomes antilliscants i seient', voluntari: 'Josep Maria Almirall', estat: 'PUNT_A_PUNT' },
    { id: 'rep-3', codi: 'LLIT-ART-01', element: 'Llit Articulat Elèctric', accio: 'Revisió de motor de pujada i comandament', voluntari: 'Carles Miralles', estat: 'EN_TALLER' },
  ];

  const handleAppSelect = (app: AppDefinition) => {
    if (app.id === 'bancactiu-social') {
      setIsLauncherOpen(false);
      return;
    }
    window.location.href = resolveAppTargetUrl(app.id, app.port);
  };

  return (
    <RadialAuraBackground variant="social">
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
            <GlassBadge variant="purple" pulse>Mòdul Social Actiu (Vercel Cloud)</GlassBadge>
          </div>

          <GlassHeader
            appName="BancActiu Social (Creu Roja & Serveis Socials)"
            badgeText="Tercer Sector &middot; Xarxa Comunitària"
            badgeVariant="purple"
            userNom="Laia Soldevila (Coordinadora Voluntariat Creu Roja)"
            userRol="Responsable Taller d'Ajudes Tècniques · Superadmin DNI 52622304Y"
            onOpenLauncher={() => setIsLauncherOpen(true)}
          />

          <main className="flex-1 my-6 space-y-6">
            <GlassCard variant="glow" glowColor="rose" className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HeartHandshake className="w-6 h-6 text-rose-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Xarxa de Voluntariat, Suport Comunitari i Taller Solidari
                    </h2>
                    <GlassBadge variant="purple">Creu Roja Cornellà</GlassBadge>
                  </div>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    Espai per a treballadors socials, voluntaris i tècnics de manteniment.
                    Incorpora la fitxa d'intervenció familiar segons la Llei de Dependència 39/2006
                    i la gestió del taller mecànic per a la posada a punt d'ajudes tècniques donades.
                  </p>
                </div>
                <div className="flex gap-2">
                  <GlassButton
                    variant={activeTab === 'fitxa-social' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('fitxa-social')}
                    icon={<FileText size={16} />}
                  >
                    Fitxa Social & Dependència
                  </GlassButton>
                  <GlassButton
                    variant={activeTab === 'taller-solidari' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('taller-solidari')}
                    icon={<Wrench size={16} />}
                  >
                    Taller Mecànic Solidari
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {activeTab === 'fitxa-social' && (
              <div className="space-y-4">
                <BancActiuSocialWorkspace />
              </div>
            )}

            {activeTab === 'taller-solidari' && (
              <WorkshopAndRepairsWorkspace />
            )}
          </main>
        </div>

        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 2.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-social"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Social &middot; Creu Roja &middot; Tercer Sector Catalunya &middot; Monorepo BancActiu 2.0
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
