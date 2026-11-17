'use client';

import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Landmark,
  HeartHandshake,
  LayoutDashboard,
  ArrowRight,
  Lock,
  CheckCircle2,
  Sparkles,
  Bot,
  UserCheck,
  Server,
  KeyRound
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassBadge } from './GlassBadge';
import { GlassButton } from './GlassButton';

export interface AppDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  port: number;
  url: string;
  productionPath: string;
  icon: React.ReactNode;
  theme: 'nexus' | 'salut' | 'municipal' | 'social' | 'operatiu';
  glowColor: 'purple' | 'emerald' | 'cyan' | 'rose' | 'amber';
  gradient: string;
  allowedRoles: string[];
  tag: string;
}

export function isProductionEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return false;
    }
    return true;
  }
  return process.env.NODE_ENV === 'production';
}

export function resolveAppTargetUrl(app: AppDefinition): string {
  const isProd = isProductionEnvironment();
  if (!isProd) {
    return `http://localhost:${app.port}`;
  }

  if (typeof process !== 'undefined' && process.env) {
    if (app.id === 'bancactiu-nexus' && process.env.NEXT_PUBLIC_NEXUS_URL) return process.env.NEXT_PUBLIC_NEXUS_URL;
    if (app.id === 'bancactiu-salut' && process.env.NEXT_PUBLIC_SALUT_URL) return process.env.NEXT_PUBLIC_SALUT_URL;
    if (app.id === 'bancactiu-municipal' && process.env.NEXT_PUBLIC_MUNICIPAL_URL) return process.env.NEXT_PUBLIC_MUNICIPAL_URL;
    if (app.id === 'bancactiu-social' && process.env.NEXT_PUBLIC_SOCIAL_URL) return process.env.NEXT_PUBLIC_SOCIAL_URL;
    if ((app.id === 'bancactiu-operatiu' || app.id === 'bancactiu-operatiu-1.0') && process.env.NEXT_PUBLIC_OPERATIU_URL) return process.env.NEXT_PUBLIC_OPERATIU_URL;
  }

  return app.productionPath || `/${app.id.replace('bancactiu-', '')}`;
}

export const ECOSYSTEM_APPS: AppDefinition[] = [
  {
    id: 'bancactiu-nexus',
    name: 'BancActiu Nexus',
    subtitle: 'Consola SuperAdmin & Ciberseguretat',
    description: 'Auditories forenses, simulador d\'estrès a escala Catalunya (1-3 anys), escàner de vulnerabilitats 99% i Enginyer Agent IA autònom.',
    port: 3000,
    url: 'http://localhost:3000',
    productionPath: '/',
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    theme: 'nexus',
    glowColor: 'purple',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    allowedRoles: ['SUPERADMIN'],
    tag: 'Accés Restringit'
  },
  {
    id: 'bancactiu-salut',
    name: 'BancActiu Salut',
    subtitle: 'Portal Tècnics de Salut (CatSalut / GAPIC)',
    description: 'Validació clínica de prescripcions ortopèdiques, avaluació funcional Barthel, coordinació amb CAPs i historial mèdic de pacients.',
    port: 3001,
    url: 'http://localhost:3001',
    productionPath: '/salut',
    icon: <Activity className="w-8 h-8 text-emerald-400" />,
    theme: 'salut',
    glowColor: 'emerald',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    allowedRoles: ['SUPERADMIN', 'TECNIC_SALUT'],
    tag: 'CatSalut / ICS'
  },
  {
    id: 'bancactiu-municipal',
    name: 'BancActiu Municipal',
    subtitle: 'Ajuntaments i Serveis Socials',
    description: 'Gestió municipal de vulnerabilitat residencial, ajuts d\'urgència social, subvencions i convenis amb entitats locals de Cornellà.',
    port: 3002,
    url: 'http://localhost:3002',
    productionPath: '/municipal',
    icon: <Landmark className="w-8 h-8 text-blue-400" />,
    theme: 'municipal',
    glowColor: 'cyan',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    allowedRoles: ['SUPERADMIN', 'AJUNTAMENT', 'SERVEIS_SOCIALS'],
    tag: 'Entitats Locals'
  },
  {
    id: 'bancactiu-social',
    name: 'BancActiu Social',
    subtitle: 'Creu Roja & Tercer Sector',
    description: 'Xarxa de voluntariat, taller tècnic de reparació d\'ajudes tècniques (cadires/caminadors) i recepció ciutadana de donacions.',
    port: 3003,
    url: 'http://localhost:3003',
    productionPath: '/social',
    icon: <HeartHandshake className="w-8 h-8 text-rose-400" />,
    theme: 'social',
    glowColor: 'rose',
    gradient: 'from-rose-600 via-amber-600 to-orange-600',
    allowedRoles: ['SUPERADMIN', 'TERCER_SECTOR', 'VOLUNTARI'],
    tag: 'Creu Roja / AVV'
  },
  {
    id: 'bancactiu-operatiu-1.0',
    name: 'BancActiu Operatiu 1.0',
    subtitle: 'Core Diari UAC & Voluntaris',
    description: 'Gestió àgil de préstecs al taulell, escaneig per codi de barres i QR, registre ciutadà idCAT Mòbil i traçabilitat immediata d\'estoc.',
    port: 3004,
    url: 'http://localhost:3004',
    productionPath: '/operatiu',
    icon: <LayoutDashboard className="w-8 h-8 text-cyan-400" />,
    theme: 'operatiu',
    glowColor: 'cyan',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    allowedRoles: ['SUPERADMIN', 'TECNIC_SALUT', 'AJUNTAMENT', 'TERCER_SECTOR', 'ADMINISTRATIU_OPERATIU', 'VOLUNTARI'],
    tag: 'Taulell i Magatzem'
  }
];

export interface GatewayLauncherProps {
  currentAppId?: string;
  onSelectApp?: (app: AppDefinition) => void;
  currentUserRole?: string;
  onChangeRole?: (role: string) => void;
}

export const GatewayLauncher: React.FC<GatewayLauncherProps> = ({
  currentAppId = 'bancactiu-nexus',
  onSelectApp,
  currentUserRole = 'SUPERADMIN',
  onChangeRole
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(currentUserRole);
  const isProd = isProductionEnvironment();

  const handleRoleSwitch = (newRole: string) => {
    setSelectedRole(newRole);
    if (onChangeRole) onChangeRole(newRole);
  };

  const isAppAllowed = (app: AppDefinition) => {
    if (selectedRole === 'SUPERADMIN') return true;
    return app.allowedRoles.includes(selectedRole);
  };

  const handleNavigate = (app: AppDefinition) => {
    if (onSelectApp) {
      onSelectApp(app);
    } else {
      window.location.href = resolveAppTargetUrl(app);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Header and RBAC Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-white/90 border border-slate-200 backdrop-blur-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Gateway Launcher Unificat
            </h2>
            <GlassBadge variant={isProd ? 'emerald' : 'purple'} pulse>
              {isProd ? 'Vercel Cloud' : 'Local'}
            </GlassBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ecosistema modular de 5 micro-aplicacions independents amb rutes adaptatives per entorn.
          </p>
        </div>

        {/* RBAC Role Selector Simulator */}
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
          <KeyRound size={14} className="text-cyan-600 ml-1" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">Rol Actiu:</span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="bg-white text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
          >
            <option value="SUPERADMIN">Superadministrador (5 Apps Completes)</option>
            <option value="TECNIC_SALUT">Treballador del CAP (Gestió i Prescripció Mèdica)</option>
            <option value="SERVEIS_SOCIALS">Treballador Social (BVD, Dependència i SAD)</option>
            <option value="VOLUNTARI">Voluntari / Entitat Veïnal (Peticions de Suport i Derivacions)</option>
            <option value="TERCER_SECTOR">Centre de Reparació - Creu Roja (Gestió Tècnica de Tallers)</option>
            <option value="AJUNTAMENT">Gestor Municipal (Municipal + Serveis Socials)</option>
            <option value="ADMINISTRATIU_OPERATIU">Administratiu UAC (Només Operatiu)</option>
          </select>
        </div>
      </div>

      {/* Grid of 5 Micro-Applications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {ECOSYSTEM_APPS.map((app) => {
          const allowed = isAppAllowed(app);
          const isCurrent = app.id === currentAppId;

          return (
            <GlassCard
              key={app.id}
              variant={allowed ? 'interactive' : 'default'}
              glowColor={app.glowColor}
              className={`p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-300 ${
                !allowed ? 'opacity-40 grayscale-[40%]' : ''
              } ${isCurrent ? 'ring-2 ring-cyan-500 bg-cyan-50/40' : ''}`}
              onClick={() => {
                if (allowed) handleNavigate(app);
              }}
            >
              <div>
                {/* Header card: Icon + Badge + Port / Cloud Route */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${app.gradient} shadow-md border border-white/20`}>
                    {React.isValidElement(app.icon)
                      ? React.cloneElement(app.icon as React.ReactElement<any>, { className: 'w-6 h-6 text-white' })
                      : app.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-cyan-800 border border-slate-200 font-semibold">
                      {isProd ? `${app.productionPath}` : `:${app.port}`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {app.tag}
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  {app.name}
                  {isCurrent && (
                    <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full border border-cyan-300">
                      Actual
                    </span>
                  )}
                </h3>
                <p className="text-xs font-semibold text-cyan-700 mb-1.5">
                  {app.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {app.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                {allowed ? (
                  <>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Autoritzat
                    </span>
                    <GlassButton
                      variant={isCurrent ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(app);
                      }}
                      icon={<ArrowRight size={13} />}
                    >
                      {isCurrent ? 'Dins l\'App' : 'Accedir'}
                    </GlassButton>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                      <Lock size={13} />
                      Requereix permisos
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Bloquejat RBAC
                    </span>
                  </>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
