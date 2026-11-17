'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Activity,
  Users,
  Building2,
  Server,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Grid,
  CheckCircle2,
  Globe,
  FileText,
  Share2,
  Boxes,
  Download,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  PackagePlus,
  Hammer,
  Wrench,
  Stethoscope,
  HeartHandshake
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
  SensitiveActionAuthModal
} from '@bancactiu/ui-glass';
import { sharedDb } from '@bancactiu/db';
import { resolveAppTargetUrl, isProductionEnvironment } from '@/lib/navigation';
import { SuperAdminStressAndSecurityLabWorkspace } from '@/components/workspaces/SuperAdminStressAndSecurityLabWorkspace';
import { SuperAdminSimulationsAndAuditWorkspace } from '@/components/workspaces/SuperAdminSimulationsAndAuditWorkspace';
import { SuperAdminAiAgentWorkspace } from '@/components/workspaces/SuperAdminAiAgentWorkspace';
import { GerenciaOnboardingWorkspace } from '@/components/workspaces/GerenciaOnboardingWorkspace';
import { SuperAdminRolesAndServicesWorkspace } from '@/components/workspaces/SuperAdminRolesAndServicesWorkspace';
import { SuperAdminInteroperabilityWorkspace } from '@/components/workspaces/SuperAdminInteroperabilityWorkspace';
import { WorkshopAndRepairsWorkspace } from '@/components/workspaces/WorkshopAndRepairsWorkspace';
import { SocialServicesWorkspace } from '@/components/workspaces/SocialServicesWorkspace';
import { NewLoanModal, NewLoanData } from '@/components/loans/NewLoanModal';
import { KenzoAssistant } from '@/components/kenzo/KenzoAssistant';
import { IntellectualPropertyModal } from '@/components/legal/IntellectualPropertyModal';
import { INSTITUTIONAL_MODULE_FLAGS, isModuleActive } from '@/lib/modules-feature-flags';
import { SessionLockManager } from '@/components/security/SessionLockManager';

interface BancActiuNexusClientProps {
  initialUser?: {
    dni?: string;
    name?: string;
    role?: string;
    roleLabel?: string;
    institution?: string;
    userId?: string;
    email?: string;
  } | null;
}

export default function BancActiuNexusClient({ initialUser }: BancActiuNexusClientProps) {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(initialUser?.role || 'SUPERADMIN');
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const handleOpenNewLoanModal = () => setIsNewLoanModalOpen(true);
  const [moduleFlags, setModuleFlags] = useState<Record<string, boolean>>(INSTITUTIONAL_MODULE_FLAGS);

  const toggleModuleFlag = (moduleId: string) => {
    setModuleFlags(prev => {
      const updated = { ...prev, [moduleId]: !prev[moduleId] };
      showToast(
        updated[moduleId] ? "Mòdul Activat Sota Demanda" : "Mòdul Desactivat",
        `El mòdul ${moduleId} ara està ${updated[moduleId] ? "ACTIU" : "INACTIU"}.`
      );
      return updated;
    });
  };

  // Context dinàmic de Tenant (IP & Host resolution)
  const [tenantContext, setTenantContext] = useState<{
    id: string;
    code: string;
    name: string;
    shortName: string;
    description: string;
    badgeLabel: string;
    badgeVariant: 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';
    themeColor: string;
    allowedModules: string[];
    isDefault?: boolean;
    clientIp?: string;
  }>({
    id: 'tenant-default',
    code: 'BANCACTIU_ENTERPRISE',
    name: 'BancActiu 3.0 Enterprise',
    shortName: 'BancActiu 3.0',
    description: 'Plataforma Unificada de Governança i Serveis Sociosanitaris',
    badgeLabel: 'Plataforma Institucional',
    badgeVariant: 'purple',
    themeColor: '#9333ea',
    allowedModules: ['bancactiu-nexus', 'bancactiu-salut', 'bancactiu-municipal', 'bancactiu-social', 'bancactiu-operatiu'],
    isDefault: true,
  });

  React.useEffect(() => {
    try {
      const match = typeof document !== 'undefined' ? document.cookie.split('; ').find(r => r.startsWith('bancactiu_tenant=')) : null;
      if (match) {
        const val = decodeURIComponent(match.split('=')[1]);
        const parsed = JSON.parse(val);
        if (parsed && parsed.id) setTenantContext(parsed);
      }
    } catch {
      // Fallback a neutre
    }
  }, []);

  // Re-autenticació sensible per a rols d'alt nivell (Superadmin, Gerència, Direcció)
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    actionTitle: string;
    actionDescription: string;
    actionSeverity: 'critical' | 'high' | 'warning';
    onAuthorized: (data?: any) => void;
  }>({
    isOpen: false,
    actionTitle: '',
    actionDescription: '',
    actionSeverity: 'critical',
    onAuthorized: () => {},
  });

  const [notificationToast, setNotificationToast] = useState<{
    visible: boolean;
    title: string;
    message: string;
  } | null>(null);

  const showToast = (title: string, message: string) => {
    setNotificationToast({ visible: true, title, message });
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const isCriticalRole =
    activeRole === 'SUPERADMIN' ||
    activeRole === 'GERENCIA' ||
    activeRole === 'DIRECCIO' ||
    initialUser?.role === 'SUPERADMIN';

  // Lògica de dispar estricta: NÚMÉS s'activa per a les 3 accions crítiques de governança i seguretat
  // (1: Concessió/modificació rols superadmin, 2: Exportació massiva RGPD, 3: Laboratori d'auditoria/xarxa)
  // Qualssevol altra acció rutinària o navegació ordinària no ha de disparar el modal.
  const requestSensitiveAction = (
    actionType: 'SUPERADMIN_ROLE_CHANGE' | 'MASS_DATA_EXPORT' | 'AUDIT_LAB_NETWORK',
    actionTitle: string,
    actionDescription: string,
    onAuthorized: (data?: any) => void
  ) => {
    const isAllowedCriticalAction =
      actionType === 'SUPERADMIN_ROLE_CHANGE' ||
      actionType === 'MASS_DATA_EXPORT' ||
      actionType === 'AUDIT_LAB_NETWORK';

    if (isCriticalRole && isAllowedCriticalAction) {
      setAuthModalConfig({
        isOpen: true,
        actionTitle,
        actionDescription,
        actionSeverity: 'critical',
        onAuthorized: (data) => {
          showToast(
            'Acció Crítica Autoritzada (ENS Nivell Alt)',
            `Autorització confirmada per [${actionTitle}]. Audit ID: ${data?.auditId || 'ENS-AUDIT'}`
          );
          onAuthorized(data);
        },
      });
    } else {
      // Qualsevol altra navegació o acció s'executa immediatament sense modal
      onAuthorized();
    }
  };

  const isSuperAdminAuthorized =
    initialUser?.role === 'SUPERADMIN' ||
    initialUser?.dni === '48956602Z' ||
    initialUser?.dni === '52622304Y' ||
    initialUser?.userId === 'Administrador' ||
    initialUser?.userId === 'usr-superadmin-marc';

  const [showIpModal, setShowIpModal] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userKey = initialUser?.dni || initialUser?.name || 'current_user';
      const hasAccepted = localStorage.getItem(`bancactiu_ip_accepted_${userKey}`) || localStorage.getItem('bancactiu_ip_global_accepted');
      if (!hasAccepted) {
        setShowIpModal(true);
      }
    }
  }, [initialUser]);

  const isInternalAppSwitching = useRef(false);

  // FASE 1: Destrucció Automàtica de Sessió al Tancar Pestanya o Finestra (Beacon API / beforeunload / pagehide)
  useEffect(() => {
    const handleTabOrWindowClose = () => {
      if (isInternalAppSwitching.current) return;

      try {
        // Enviar senyal de destrucció de sessió al servidor de forma asíncrona no bloquejant
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon('/api/auth/logout');
        } else {
          fetch('/api/auth/logout', { method: 'POST', keepalive: true }).catch(() => {});
        }

        // Invalida la cookie localment de manera síncrona
        document.cookie = 'bancactiu_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; SameSite=Lax;';

        // Netejar emmagatzematge de sessió
        sessionStorage.clear();
        localStorage.removeItem('bancactiu_session_cache');
      } catch (e) {
        console.warn('[SESSION-DESTRUCTION] Error en tancar pestanya:', e);
      }
    };

    window.addEventListener('pagehide', handleTabOrWindowClose);
    window.addEventListener('beforeunload', handleTabOrWindowClose);

    return () => {
      window.removeEventListener('pagehide', handleTabOrWindowClose);
      window.removeEventListener('beforeunload', handleTabOrWindowClose);
    };
  }, []);

  const handleNavigateModule = (appId: string, defaultPort: number) => {
    isInternalAppSwitching.current = true;
    const targetUrl = resolveAppTargetUrl(appId, defaultPort);
    window.location.href = targetUrl;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // fallback
    }
    document.cookie = 'bancactiu_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; SameSite=Lax;';
    sessionStorage.clear();
    localStorage.removeItem('bancactiu_session_cache');
    window.location.href = '/login';
  };

  const handleAppSelect = (app: AppDefinition) => {
    if (app.id === 'bancactiu-nexus') {
      setIsLauncherOpen(false);
      return;
    }
    isInternalAppSwitching.current = true;
    // Resolució intel·ligent d'URL: Localhost amb ports vs Vercel Cloud amb rutes relatives/dominis
    const targetUrl = resolveAppTargetUrl(app.id, app.port);
    window.location.href = targetUrl;
  };

  const handleSessionReauthenticate = async (pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/reauthenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: initialUser?.dni || '48956602Z',
          password: pass,
          actionName: 'SESSION_UNLOCK',
          actionDetails: 'Desbloqueig de sessió per inactivitat de 5 minuts (ENS Nivell Alt)',
          module: 'bancactiu-nexus'
        })
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  return (
    <SessionLockManager onReauthenticate={handleSessionReauthenticate}>
      <RadialAuraBackground variant="nexus" className="min-h-screen w-full flex flex-col overflow-y-auto">
      {/* 1. Barra Superior Exclusiva de Superadministrador */}
      {isSuperAdminAuthorized && (
        <aside
          aria-label="Barra de Control SuperAdministrador"
          className="sticky top-0 z-50 w-full border-b border-purple-200 bg-white/95 backdrop-blur-xl shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
            {/* Esquerra: Identitat SuperAdmin */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-md border border-purple-200">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                    Consola Exclusiva SuperAdmin
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    DNI / ID: {initialUser?.dni || '48956602Z'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{initialUser?.name || "Marc Cachinero Baranda"} · Governança i Control Central</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Centre: {tenantContext.shortName}
                  </span>
                </p>
              </div>
            </div>

            {/* Centre: Accions Ràpides Exclusives amb Re-Autenticació */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Botó 1: Gestió d'Usuaris i Rols (Navegació ordinària) */}
              <button
                type="button"
                onClick={() => {
                  setActiveWorkspace(activeWorkspace === 'roles-services' ? null : 'roles-services');
                }}
                title="Gestió de perfils, serveis i llocs de treball"
                className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border ${
                  activeWorkspace === 'roles-services'
                    ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-purple-500/10'
                    : 'bg-white hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-300'
                }`}
              >
                <Users size={14} className="text-purple-600 group-hover:scale-110 transition-transform" />
                <span>Gestió d'Usuaris i Rols</span>
              </button>

              {/* Botó 1.5: Mòdul d'Auditoria Massiva i Simulació d'Estrès (5 Anys) */}
              <button
                type="button"
                onClick={() => {
                  setActiveWorkspace(activeWorkspace === 'simulations-audit' ? null : 'simulations-audit');
                }}
                title="Auditoria Massiva de Tenants i Simulació d'Estrès a 5 Anys"
                className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border ${
                  activeWorkspace === 'simulations-audit'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-emerald-500/10'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <Activity size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Auditoria & Estrès (5 Anys)</span>
              </button>

              {/* Botó 2: Auditoria Zero-Trust (Accés explícit al laboratori d'auditoria/paràmetres de xarxa) */}
              <button
                type="button"
                onClick={() => {
                  if (activeWorkspace === 'security-lab') {
                    setActiveWorkspace(null);
                  } else {
                    requestSensitiveAction(
                      'AUDIT_LAB_NETWORK',
                      "Accés al Laboratori d'Auditoria i Paràmetres de Xarxa",
                      "Accés a mètriques d'auditoria immutable, escàner de seguretat en temps real i laboratoris d'estrès.",
                      () => setActiveWorkspace('security-lab')
                    );
                  }
                }}
                title="Estat de ciberseguretat militar i escàner de vulnerabilitats ENS (Requereix Doble Verificació)"
                className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border ${
                  activeWorkspace === 'security-lab'
                    ? 'bg-cyan-100 text-cyan-900 border-cyan-300 shadow-cyan-500/10'
                    : 'bg-white hover:bg-cyan-50 text-slate-700 border-slate-200 hover:border-cyan-300'
                }`}
              >
                <Lock size={14} className="text-cyan-600 group-hover:scale-110 transition-transform" />
                <span>Auditoria Zero-Trust</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono font-bold">2FA</span>
              </button>

              {/* Botó 3: Exportació Massiva de Dades Protegides (sota RGPD) */}
              <button
                type="button"
                onClick={() => {
                  requestSensitiveAction(
                    'MASS_DATA_EXPORT',
                    "Exportació Massiva de Dades Protegides (RGPD/ENS)",
                    "Extracció i descàrrega xifrada del registre d'auditoria forense i expedients d'ajudes tècniques.",
                    (data) => {
                      showToast(
                        "Exportació Forense Autoritzada",
                        `Extracció completada amb èxit sota protocols RGPD i ENS. Ref: ${data?.auditId || 'EXP-RGPD-2026'}`
                      );
                    }
                  );
                }}
                title="Exportació de dades sensibles protegida per doble verificació"
                className="group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300"
              >
                <Download size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Exportació Protegida</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">2FA</span>
              </button>

              {/* Botó 2.6: Taller Creu Roja (FASE 3) */}
              <button
                type="button"
                onClick={() => setActiveWorkspace(activeWorkspace === 'workshop-repairs' ? null : 'workshop-repairs')}
                title="Taller Tècnic de Creu Roja i Reparacions d'Ajudes Tècniques"
                className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border ${
                  activeWorkspace === 'workshop-repairs'
                    ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-rose-500/10'
                    : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                <Wrench size={14} className="text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Taller Creu Roja</span>
              </button>

              {/* Botó 2.7: Serveis Socials & Dependència (Feature Flag) */}
              {moduleFlags.SOCIAL_SERVICES_ENABLED ? (
                <button
                  type="button"
                  onClick={() => setActiveWorkspace(activeWorkspace === 'social-services' ? null : 'social-services')}
                  title="Espai de Gestió de Dependència, BVD, SAD i Teleassistència"
                  className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm border ${
                    activeWorkspace === 'social-services'
                      ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-purple-500/10'
                      : 'bg-white hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <HeartHandshake size={14} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <span>Serveis Socials & Dependència</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    toggleModuleFlag('SOCIAL_SERVICES_ENABLED');
                    setActiveWorkspace('social-services');
                  }}
                  title="Mòdul desactivat per defecte. Clica per activar sota demanda."
                  className="group px-2.5 py-1.5 rounded-xl text-xs font-medium text-purple-700 hover:bg-purple-100 transition-all flex items-center gap-1.5 border border-dashed border-purple-300 bg-purple-50"
                >
                  <HeartHandshake size={13} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold">Serveis Socials (Activar)</span>
                </button>
              )}

              {/* Botó 3: Gestió de Xarxa i Préstecs (Social + Operatiu) */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleNavigateModule('bancactiu-social', 3003)}
                  title="Enllaç directe al mòdul Social (Banc del Temps i Xarxa Ciutadana)"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-rose-50 transition-all flex items-center gap-1"
                >
                  <Share2 size={13} className="text-rose-600" />
                  <span>Xarxa Social</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleNavigateModule('bancactiu-operatiu', 3004)}
                  title="Enllaç directe al mòdul Operatiu (Logística de Préstecs i Ortopèdia)"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-blue-50 transition-all flex items-center gap-1"
                >
                  <Boxes size={13} className="text-blue-600" />
                  <span>Gestió de Préstecs</span>
                </button>
              </div>
            </div>

            {/* Dreta: Accés ràpid Manuals i Estat */}
            <div className="flex items-center gap-2">
              <Link
                href="/docs"
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-cyan-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center gap-1.5"
              >
                <FileText size={13} className="text-cyan-600" />
                <span>Manuals & PDFs</span>
              </Link>
            </div>
          </div>
        </aside>
      )}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 flex flex-col min-h-0">
        {/* Capçalera institucional Glassmorphism amb acció de Tancar Sessió */}
        <GlassHeader
          appName="BancActiu Nexus (Consola SuperAdmin)"
          badgeText={tenantContext.isDefault ? "SuperAdmin · Màxima Seguretat" : tenantContext.badgeLabel}
          badgeVariant={tenantContext.badgeVariant || "purple"}
          userNom={initialUser?.name || "SuperAdmin"}
          userRol={initialUser?.roleLabel || "Nivell 5 · Control Total"}
          tenantSubtext={tenantContext.name || "Plataforma de Governança i Serveis"}
          onOpenLauncher={() => setIsLauncherOpen(true)}
          onLogout={handleLogout}
        />

        {/* FASE 2: BARRA DE SEPARACIÓ D'ACCESSOS PER ROLS OPERATIUS */}
        <div className="my-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/95 border border-purple-200 backdrop-blur-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 pl-2">
            <ShieldCheck size={16} className="text-purple-600 shrink-0" />
            <div>
              <span className="text-xs font-black tracking-wide text-slate-900 uppercase block">
                Separació d'Accessos per Rols Operatius:
              </span>
              <span className="text-[10px] text-slate-500">
                Pestanyes i visió del sistema adaptades per a cada rol d'intervenció
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {/* Rol 1: Treballador del CAP */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('TECNIC_SALUT');
                showToast("Rol Actiu: Treballador del CAP", "Gestió clínica, validació Barthel i prescripció mèdica d'ortopèdia.");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                activeRole === 'TECNIC_SALUT'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-emerald-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <Stethoscope size={14} className={activeRole === 'TECNIC_SALUT' ? 'text-white' : 'text-emerald-600'} />
              <span>Treballador del CAP</span>
              <span className="text-[10px] opacity-80 hidden lg:inline">(Prescripció Mèdica)</span>
            </button>

            {/* Accés exclusiu de prescripció per al personal clínic del CAP */}
            {activeRole === 'TECNIC_SALUT' && (
              <button
                type="button"
                onClick={handleOpenNewLoanModal}
                title="Alta interactiva de Nou Préstec Clínic d'Ortopèdia Comunitària"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 border shadow-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-500 shadow-emerald-500/20 animate-fadeIn"
              >
                <PackagePlus size={14} className="text-white" />
                <span>+ Nou Préstec Clínic</span>
              </button>
            )}

            {/* Rol 2: Voluntari / Entitat Veïnal */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('VOLUNTARI');
                showToast("Rol Actiu: Voluntari / Entitat Veïnal", "Peticions de suport veïnal, acompanyament i derivacions.");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                activeRole === 'VOLUNTARI'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500 shadow-amber-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <HeartHandshake size={14} className={activeRole === 'VOLUNTARI' ? 'text-white' : 'text-amber-600'} />
              <span>Voluntari / Entitat Veïnal</span>
              <span className="text-[10px] opacity-80 hidden lg:inline">(Peticions i Suport)</span>
            </button>

            {/* Rol 3: Centre de Reparació (Creu Roja) */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('TERCER_SECTOR');
                setActiveWorkspace('workshop-repairs');
                showToast("Rol Actiu: Centre de Reparació (Creu Roja)", "Accés directe al workspace tècnic de tallers i recondicionament.");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                activeWorkspace === 'workshop-repairs' || activeRole === 'TERCER_SECTOR'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-500 shadow-rose-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-rose-300'
              }`}
            >
              <Wrench size={14} className={activeWorkspace === 'workshop-repairs' ? 'text-white' : 'text-rose-600'} />
              <span>Centre de Reparació (Creu Roja)</span>
              <span className="text-[10px] opacity-80 hidden lg:inline">(Gestió Tècnica)</span>
            </button>

            {/* Rol 4: Serveis Socials & Dependència (FASE 2) */}
            <button
              type="button"
              onClick={() => {
                if (!moduleFlags.SOCIAL_SERVICES_ENABLED) {
                  setModuleFlags(prev => ({ ...prev, SOCIAL_SERVICES_ENABLED: true }));
                }
                setActiveRole('SERVEIS_SOCIALS');
                setActiveWorkspace('social-services');
                showToast("Rol Actiu: Serveis Socials (Dependència)", "Mòdul activat sota demanda. Gestió d'expedients BVD (64 punts), SAD i PIAs.");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                activeWorkspace === 'social-services' || activeRole === 'SERVEIS_SOCIALS'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-purple-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300'
              }`}
            >
              <HeartHandshake size={14} className={activeWorkspace === 'social-services' ? 'text-white' : 'text-purple-600'} />
              <span>Serveis Socials</span>
              <span className="text-[10px] opacity-80 hidden lg:inline">
                {moduleFlags.SOCIAL_SERVICES_ENABLED ? '(Dependència & PIA)' : '(Activar)'}
              </span>
            </button>

            {/* Rol SuperAdmin Global */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('SUPERADMIN');
                setActiveWorkspace(null);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeRole === 'SUPERADMIN' && !activeWorkspace
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              SuperAdmin
            </button>
          </div>
        </div>

        {/* Zona de Treball Dinàmica o Launchpad */}
        {!activeWorkspace ? (
          <main className="flex-1 my-3 sm:my-4 space-y-4 sm:space-y-6">
            {/* Banner de Benvinguda i Ecosistema 3.0 */}
            <GlassCard variant="glow" glowColor="purple" className="p-4 sm:p-6 bg-white/95">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      Panell Central de Comandament BancActiu Nexus
                    </h2>
                    <GlassBadge variant="emerald">Sessió Verificada</GlassBadge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                    Benvingut al nucli de governança institucional. Des d'aquest espai tens accés a l'auditoria forense, a l'alta descentralitzada de centres i serveis, a la simulació de concurrència d'alta escala (fins a 250.000 ciutadans i 5 anys) i a la consola de l'Enginyer Agent IA autònom.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/docs">
                    <GlassButton
                      variant="primary"
                      size="sm"
                      icon={<FileText size={15} />}
                    >
                      Manuals & PDFs
                    </GlassButton>
                  </Link>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveWorkspace('simulations-audit')}
                    icon={<Activity size={15} />}
                  >
                    Auditoria & Estrès (5 Anys)
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      requestSensitiveAction(
                        'AUDIT_LAB_NETWORK',
                        "Accés al Laboratori d'Auditoria i Paràmetres de Xarxa",
                        "Simulació de concurrència d'alta escala (250k ciutadans) i escaneig de vulnerabilitats.",
                        () => setActiveWorkspace('security-lab')
                      )
                    }
                    icon={<Shield size={15} />}
                  >
                    Stress & Security (2FA)
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveWorkspace('ai-agent')}
                    icon={<Bot size={15} />}
                  >
                    Agent IA Codi
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveWorkspace('interoperability')}
                    icon={<Globe size={15} />}
                  >
                    Pasarel·les AOC
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveWorkspace('workshop-repairs')}
                    icon={<Wrench size={15} />}
                  >
                    Taller Creu Roja
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {/* Quadrícula de 5 Mòduls Operatius i SuperAdmin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {/* Mòdul 1: Alta Descentralitzada de Centres (Navegació ordinària) */}
              <GlassCard
                variant="interactive"
                glowColor="purple"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() => setActiveWorkspace('centres-onboarding')}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-md border border-purple-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Alta Descentralitzada de Centres
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Configuració i alta jeràrquica de CAPs, hospitals i entitats per cada gerència territorial.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-purple-700 pt-2 border-t border-slate-100">
                  <span>Gestionar Centres</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>

              {/* Mòdul 2: Rols, Serveis i Llocs de Treball (Navegació ordinària) */}
              <GlassCard
                variant="interactive"
                glowColor="purple"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() => setActiveWorkspace('roles-services')}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white mb-3 shadow-md border border-indigo-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Rols, Serveis i Puestos
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Superadministració del catàleg de serveis, rols RBAC i estructura de llocs de treball.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 pt-2 border-t border-slate-100">
                  <span>Configurar Rols</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>

              {/* Mòdul 3: Stress & Security Lab (Accés explícit al laboratori d'auditoria/xarxa: Requereix 2FA) */}
              <GlassCard
                variant="interactive"
                glowColor="purple"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() =>
                  requestSensitiveAction(
                    'AUDIT_LAB_NETWORK',
                    "Accés al Laboratori d'Auditoria i Paràmetres de Xarxa",
                    "Simulació de concurrència (1-3 anys Catalunya) i escaneig de vulnerabilitats en temps real.",
                    () => setActiveWorkspace('security-lab')
                  )
                }
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-emerald-600 flex items-center justify-center text-white mb-3 shadow-md border border-emerald-200">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Stress & Security Lab
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Simulació de concurrència (fins a 250k ciutadans) i escaneig continu ENS (Score 99%).
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
                  <span>Obrir Lab (2FA)</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>

              {/* Mòdul 4: Consola Agent IA de Codi (Navegació ordinària) */}
              <GlassCard
                variant="interactive"
                glowColor="purple"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() => setActiveWorkspace('ai-agent')}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-md border border-cyan-200">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Consola Enginyer Agent IA
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Modificacions a demanda mitjançant prompts en llenguatge natural amb generació de diff i auditoria.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-cyan-700 pt-2 border-t border-slate-100">
                  <span>Executar Agent</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>

              {/* Mòdul 5: Taller & Reparacions Creu Roja (FASE 3) */}
              <GlassCard
                variant="interactive"
                glowColor="rose"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() => setActiveWorkspace('workshop-repairs')}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 flex items-center justify-center text-white mb-3 shadow-md border border-rose-200">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Taller & Reparacions (Creu Roja)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Gestió del cicle de vida d'avaries (Pendent, Taller, Verificació de Seguretat i Retorn a Estoc).
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 pt-2 border-t border-slate-100">
                  <span>Gestionar Taller</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>

              {/* Mòdul 6: Serveis Socials & Dependència (FASE 2 & Feature Flag) */}
              <GlassCard
                variant="interactive"
                glowColor="purple"
                className="p-4 sm:p-5 flex flex-col justify-between"
                onClick={() => {
                  if (!moduleFlags.SOCIAL_SERVICES_ENABLED) {
                    toggleModuleFlag('SOCIAL_SERVICES_ENABLED');
                  }
                  setActiveWorkspace('social-services');
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-md border border-purple-200">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <GlassBadge variant={moduleFlags.SOCIAL_SERVICES_ENABLED ? "purple" : "slate"}>
                      {moduleFlags.SOCIAL_SERVICES_ENABLED ? "Actiu" : "Activable sota demanda"}
                    </GlassBadge>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    Serveis Socials & Dependència
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Gestió d'expedients de dependència, barems BVD (escala 64 punts), PIAs, SAD i teleassistència municipal.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-purple-700 pt-2 border-t border-slate-100">
                  <span>{moduleFlags.SOCIAL_SERVICES_ENABLED ? "Gestionar Dependència" : "Activar Mòdul Sota Demanda"}</span>
                  <ArrowRight size={14} />
                </div>
              </GlassCard>
            </div>

            {/* Launcher Embolicat per saltar a altres aplicacions */}
            <div className="mt-6 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Grid size={16} className="text-cyan-600" />
                  Ecosistema de Micro-Aplicacions BancActiu 3.0
                </h3>
                <span className="text-xs text-slate-500">
                  Base de Dades Compartida (@bancactiu/db)
                </span>
              </div>
              <GatewayLauncher
                currentAppId="bancactiu-nexus"
                currentUserRole={activeRole}
                onChangeRole={setActiveRole}
                onSelectApp={handleAppSelect}
              />
            </div>
          </main>
        ) : (
          /* Sub-workspaces estancs */
          <main className="flex-1 my-4 w-full overflow-y-auto custom-scrollbar pr-1">
            <div className="flex justify-between items-center mb-4">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => setActiveWorkspace(null)}
              >
                ← Tornar al Tauler Principal
              </GlassButton>
              <GlassBadge variant="purple">
                Espai de Treball Actiu: {activeWorkspace}
              </GlassBadge>
            </div>

            {activeWorkspace === 'interoperability' && (
              <SuperAdminInteroperabilityWorkspace onClose={() => setActiveWorkspace(null)} />
            )}

            {activeWorkspace === 'simulations-audit' && (
              <SuperAdminSimulationsAndAuditWorkspace
                onClose={() => setActiveWorkspace(null)}
                adminDni={initialUser?.dni || '48956602Z'}
                onShowToast={(title, msg) => showToast(title, msg)}
              />
            )}

            {activeWorkspace === 'security-lab' && (
              <SuperAdminStressAndSecurityLabWorkspace onClose={() => setActiveWorkspace(null)} />
            )}

            {activeWorkspace === 'ai-agent' && (
              <SuperAdminAiAgentWorkspace onClose={() => setActiveWorkspace(null)} />
            )}

            {activeWorkspace === 'centres-onboarding' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <GerenciaOnboardingWorkspace
                  onClose={() => setActiveWorkspace(null)}
                />
              </div>
            )}

            {activeWorkspace === 'roles-services' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <SuperAdminRolesAndServicesWorkspace
                  onClose={() => setActiveWorkspace(null)}
                  onShowToast={(type, title, msg) => showToast(title, msg)}
                  onRequestSensitiveAction={(title, desc, onAuth) =>
                    requestSensitiveAction('SUPERADMIN_ROLE_CHANGE', title, desc, onAuth)
                  }
                />
              </div>
            )}

            {activeWorkspace === 'workshop-repairs' && (
              <WorkshopAndRepairsWorkspace
                onClose={() => setActiveWorkspace(null)}
                onShowToast={(title, msg) => showToast(title, msg)}
              />
            )}

            {activeWorkspace === 'social-services' && (
              <SocialServicesWorkspace
                onClose={() => setActiveWorkspace(null)}
                onShowToast={(title, msg) => showToast(title, msg)}
              />
            )}
          </main>
        )}

        {/* Modal Flotant del Gateway Launcher */}
        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 3.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-nexus"
            currentUserRole={activeRole}
            onChangeRole={setActiveRole}
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        {/* Peu de pàgina institucional neutre i dinàmic */}
        <footer className="mt-6 pt-3 border-t border-slate-200 text-center text-xs text-slate-500">
          BancActiu Nexus 3.0 &middot; Sistema de Superadministració i Seguretat Perimetral &middot; {tenantContext.isDefault ? "Arquitectura Distribuïda i Zero-Trust" : tenantContext.name}
        </footer>
        {/* Assistent Flotant Kenzo AI */}
        <KenzoAssistant />

        {/* Notificació Toast de Seguretat ENS Nivell Alt */}
        {notificationToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white/95 border border-emerald-500 shadow-xl backdrop-blur-xl flex items-center gap-3 animate-fadeIn text-slate-900 max-w-md">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800">{notificationToast.title}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notificationToast.message}</p>
            </div>
          </div>
        )}

        {/* Modal de Re-Autenticació per a Rols Crítics (ENS Nivell Alt) */}
        <SensitiveActionAuthModal
          isOpen={authModalConfig.isOpen}
          onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
          onSuccess={(data) => {
            authModalConfig.onAuthorized(data);
          }}
          actionTitle={authModalConfig.actionTitle}
          actionDescription={authModalConfig.actionDescription}
          actionSeverity={authModalConfig.actionSeverity}
          currentUserDni={initialUser?.dni || '48956602Z'}
          currentUserName={initialUser?.name || 'Marc Cachinero Baranda'}
          currentUserRole={activeRole}
          moduleName="bancactiu-nexus"
        />

        {/* Modal Interactiu de Nou Préstamo d'Ortopèdia Comunitària (FASE 1) */}
        <NewLoanModal
          isOpen={isNewLoanModalOpen}
          onClose={() => setIsNewLoanModalOpen(false)}
          onLoanCreated={(newLoan) => {
            showToast(
              'Préstec d\'Ortopèdia Lliurat amb Èxit',
              `Expedient ${newLoan.expedient} assignat a ${newLoan.ciutada} (${newLoan.material}). Codi QR: ${newLoan.codiQR}`
            );
          }}
        />

        {/* Modal Ineludible de Drets de Propietat Intel·lectual (Primer Login) */}
        <IntellectualPropertyModal
          isOpen={showIpModal}
          onAccept={() => setShowIpModal(false)}
          user={initialUser}
        />
      </div>
    </RadialAuraBackground>
    </SessionLockManager>
  );
}
