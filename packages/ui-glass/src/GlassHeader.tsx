'use client';

import React from 'react';
import { Shield, Sparkles, Grid, ArrowLeft, LogOut } from 'lucide-react';
import { GlassButton } from './GlassButton';
import { GlassBadge } from './GlassBadge';

export interface GlassHeaderProps {
  appName: string;
  badgeText: string;
  badgeVariant?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
  userNom?: string;
  userRol?: string;
  tenantSubtext?: string;
  onOpenLauncher?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  appName,
  badgeText,
  badgeVariant = 'blue',
  userNom = 'Mireia Valls',
  userRol = 'SuperAdmin GAPIC',
  tenantSubtext,
  onOpenLauncher,
  onLogout,
  onBack
}) => {
  return (
    <header className="shrink-0 mb-4 pb-3 border-b border-slate-200/80 flex justify-between items-center gap-3">
      {/* Left: Branding & App title */}
      <div className="flex items-center gap-3">
        {onBack && (
          <GlassButton variant="secondary" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
            Tornar
          </GlassButton>
        )}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10 border border-slate-200">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              BancActiu <span className="text-cyan-600">3.0</span>
            </h1>
            <GlassBadge variant={badgeVariant} pulse>
              {badgeText}
            </GlassBadge>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate">
            {appName} &middot; {tenantSubtext || "Plataforma de Governança i Serveis"}
          </p>
        </div>
      </div>

      {/* Right: User Profile & Gateway Launcher Trigger */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex flex-col text-right mr-1">
          <span className="text-xs font-bold text-slate-900">{userNom}</span>
          <span className="text-[10px] text-cyan-700 font-mono font-semibold">{userRol}</span>
        </div>

        {onOpenLauncher && (
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onOpenLauncher}
            icon={<Grid size={14} />}
            title="Obrir Gateway Launcher per canviar d'aplicació"
          >
            <span className="hidden sm:inline">Gateway Launcher</span>
          </GlassButton>
        )}

        {onLogout && (
          <GlassButton variant="secondary" size="sm" onClick={onLogout} icon={<LogOut size={14} />} title="Tancar Sessió" />
        )}
      </div>
    </header>
  );
};
