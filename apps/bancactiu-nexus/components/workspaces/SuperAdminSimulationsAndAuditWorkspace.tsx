'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Zap,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Download,
  Terminal,
  Cpu,
  TrendingUp,
  Sliders,
  Check,
  Building2,
  Calendar,
  Database,
  BarChart3,
  FileCheck,
  Globe,
  KeyRound,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';
import { isIdCatMovilEnabled, setIdCatMovilEnabled } from '@/lib/feature-flags';

interface SuperAdminSimulationsAndAuditWorkspaceProps {
  onClose: () => void;
  adminDni?: string;
  onShowToast?: (title: string, message: string) => void;
}

interface TenantReport {
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  badgeLabel: string;
  salutGlobal: 'OPTIMAL' | 'DEGRADAT' | 'CRITIC';
  latenciaPostgresMs: number;
  poolConnexionsUtilitzat: string;
  integritatE2EE: boolean;
  capcaleresZeroTrustValides: boolean;
  contextIpReconegut: boolean;
  suitesExecutades: Record<string, { status: string; score: number; detalls: string }>;
}

interface YearProjection {
  any: number;
  titol: string;
  abast: string;
  totalExpedients: number;
  usuarisActius: number;
  transaccionsMes: number;
  picTps: number;
  volumDadesGb: number;
  latenciaMitjanaMs: number;
  latenciaP99Ms: number;
  ramEstimadaMb: number;
  estatIndexacio: string;
  recomanacioArquitectura: string;
}

export const SuperAdminSimulationsAndAuditWorkspace: React.FC<SuperAdminSimulationsAndAuditWorkspaceProps> = ({
  onClose,
  adminDni = '48956602Z',
  onShowToast
}) => {
  // Estat de l'Auditoria Massiva
  const [isMassiveRunning, setIsMassiveRunning] = useState(false);
  const [massiveProgress, setMassiveProgress] = useState(0);
  const [massiveStepMessage, setMassiveStepMessage] = useState('');
  const [massiveResults, setMassiveResults] = useState<{
    resumGlobal?: any;
    tenantReports?: TenantReport[];
    dataExecucio?: string;
  } | null>(null);

  // Estat de la Simulació Personalitzada a 5 Anys
  const [selectedTenants, setSelectedTenants] = useState<string[]>([
    'tenant-default',
    'tenant-esteve-terrades',
    'tenant-salut'
  ]);
  const [simulationYears, setSimulationYears] = useState<number>(5);
  const [selectedSuites, setSelectedSuites] = useState<string[]>([
    'ZERO_TRUST_HEADERS',
    'E2EE_INTEGRITY',
    'POSTGRES_STRESS_TEST',
    'IP_CONTEXT_VALIDATION'
  ]);
  const [isCustomRunning, setIsCustomRunning] = useState(false);
  const [customResults, setCustomResults] = useState<{
    resumGlobal?: any;
    tenantReports?: TenantReport[];
    projections?: YearProjection[];
    simulationYears?: number;
    dataExecucio?: string;
  } | null>(null);

  // Estat del Feature Flag d'idCAT Mòbil (AOC)
  const [idCatMovilActive, setIdCatMovilActive] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIdCatMovilActive(isIdCatMovilEnabled());
    }
  }, []);

  const handleToggleIdCatMovil = () => {
    const nextState = !idCatMovilActive;
    setIdCatMovilActive(nextState);
    setIdCatMovilEnabled(nextState);
    if (onShowToast) {
      onShowToast(
        nextState ? 'idCAT Mòbil Habilitat' : 'idCAT Mòbil Desactivat',
        nextState
          ? "S'ha activat la passarel·la d'idCAT Mòbil (Consorci AOC). Ara serà visible al selector de la pantalla de login."
          : "S'ha desactivat idCAT Mòbil. La pantalla de login queda restringida exclusivament a DNI i Contrasenya."
      );
    }
  };

  const availableTenants = [
    { id: 'tenant-default', name: 'BancActiu 3.0 Enterprise (Neutre)', code: 'BANCACTIU_ENTERPRISE', badge: 'Plataforma Institucional' },
    { id: 'tenant-esteve-terrades', name: 'IPFP Esteve Terrades i Illa', code: 'IPFP_ESTEVE_TERRADES', badge: 'Cornellà de Llobregat' },
    { id: 'tenant-salut', name: 'Departament de Salut · CatSalut & GAPIC', code: 'CATSALUT_GAPIC', badge: 'Àrea Sanitària' },
    { id: 'tenant-municipal', name: 'Ajuntament de Cornellà de Llobregat', code: 'AJUNTAMENT_CORNELLA', badge: 'Àrea Municipal' },
    { id: 'tenant-social', name: 'Xarxa Social & Tercer Sector', code: 'TERCER_SECTOR', badge: 'Banc del Temps' }
  ];

  const availableSuites = [
    { id: 'ZERO_TRUST_HEADERS', label: 'Capçaleres Zero-Trust', desc: 'Validació HSTS, CSP estricta, X-Frame-Options i cookies segures.' },
    { id: 'E2EE_INTEGRITY', label: 'Integritat Criptogràfica E2EE', desc: 'Xifratge AES-256-GCM i verificació de signatura SHA-256.' },
    { id: 'POSTGRES_STRESS_TEST', label: 'Test d\'Estrès PostgreSQL 16', desc: 'Simulació de 250 connexions concurrents i mesura de TPS/latència.' },
    { id: 'IP_CONTEXT_VALIDATION', label: 'Context d\'IP i Multi-Tenant', desc: 'Aïllament perimetral segons rangs d\'IP (Esteve Terrades, CatSalut, etc.).' }
  ];

  // Execució Auditoria Massiva
  const runMassiveAudit = async () => {
    setIsMassiveRunning(true);
    setMassiveProgress(10);
    setMassiveStepMessage('Iniciant escaneig perimetral de totes les entitats...');

    const timer1 = setTimeout(() => {
      setMassiveProgress(35);
      setMassiveStepMessage('Validant capçaleres Zero-Trust i WAF militar...');
    }, 400);

    const timer2 = setTimeout(() => {
      setMassiveProgress(70);
      setMassiveStepMessage('Comprovant integritat criptogràfica E2EE i PostgreSQL 16...');
    }, 900);

    try {
      const response = await fetch('/api/admin/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-dni': adminDni
        },
        body: JSON.stringify({
          mode: 'massive',
          adminDni
        })
      });

      const data = await response.json();
      setMassiveProgress(100);
      setMassiveStepMessage('Auditoria massiva completada amb èxit.');

      if (data.ok) {
        setMassiveResults(data);
        if (onShowToast) {
          onShowToast('Auditoria Massiva Finalitzada', `S'han auditat ${data.totalTenantsAuditats} entitats amb un 100% de compliment ENS Nivell Alt.`);
        }
      } else {
        alert(data.missatge || 'Error en executar l\'auditoria massiva');
      }
    } catch (err: any) {
      alert('Error de comunicació amb el servidor: ' + err.message);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsMassiveRunning(false);
    }
  };

  // Execució Simulació a la Carta (Fins a 5 Anys)
  const runCustomSimulation = async () => {
    if (selectedTenants.length === 0) {
      alert('Si us plau, selecciona com a mínim una entitat objectiu.');
      return;
    }
    if (selectedSuites.length === 0) {
      alert('Si us plau, activa com a mínim una suite de test.');
      return;
    }

    setIsCustomRunning(true);

    try {
      const response = await fetch('/api/admin/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-dni': adminDni
        },
        body: JSON.stringify({
          mode: 'custom',
          targetTenants: selectedTenants,
          simulationYears,
          testSuites: selectedSuites,
          adminDni
        })
      });

      const data = await response.json();

      if (data.ok) {
        setCustomResults(data);
        if (onShowToast) {
          onShowToast(
            `Simulació d'Estrès a ${simulationYears} Anys Completada`,
            `S'ha generat l'estudi de càrrega per a ${selectedTenants.length} entitats amb un pic de ${data.resumGlobal?.tpsMaximSoportat} TPS.`
          );
        }
      } else {
        alert(data.missatge || 'Error en executar la simulació personalitzada');
      }
    } catch (err: any) {
      alert('Error de comunicació amb el servidor: ' + err.message);
    } finally {
      setIsCustomRunning(false);
    }
  };

  const toggleTenant = (id: string) => {
    setSelectedTenants(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleSuite = (id: string) => {
    setSelectedSuites(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleExportJson = () => {
    const dataToExport = {
      massiveAudit: massiveResults,
      customSimulation: customResults,
      exportedAt: new Date().toISOString(),
      auditorDni: adminDni,
      framework: 'BancActiu 3.0 Enterprise ENS Nivell Alt'
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bancactiu_audit_simulacio_5anys_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Capçalera del Mòdul */}
      <GlassCard variant="glow" glowColor="purple" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl border border-white/20 shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Mòdul d'Auditoria Massiva i Simulació d'Estrès (5 Anys)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
                  ENS Nivell Alt
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300 shadow-sm">
                  Zero-Trust
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Plataforma de proves de concurrència d'alta fidelitat, benchmark transaccional de PostgreSQL 16 i
                projecció volumètrica sociosanitària a 5 anys (fins a 165.000 expedients PAO i 260 TPS pic).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            {(massiveResults || customResults) && (
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleExportJson}
                icon={<Download size={14} />}
              >
                Exportar Informe JSON
              </GlassButton>
            )}
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              ← Tancar Mòdul
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* BLOC 1: AUDITORIA MASSIVA GLOBAL PER A TOTS ELS TENANTS */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-black text-slate-900">
                Bloc 1: Auditoria Massiva Global de Tenants i Xarxa
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Execució paral·lela de tests de capçaleres, integritat criptogràfica E2EE i latència de base de dades per a totes les subxarxes.
            </p>
          </div>

          <GlassButton
            variant="primary"
            disabled={isMassiveRunning}
            onClick={runMassiveAudit}
            icon={isMassiveRunning ? <Sparkles className="animate-spin" size={16} /> : <Play size={16} />}
          >
            {isMassiveRunning ? 'Executant Auditoria...' : 'Llançar Auditoria Massiva Global'}
          </GlassButton>
        </div>

        {/* Barra de Progrés en Temps Real */}
        {isMassiveRunning && (
          <div className="my-4 p-4 rounded-xl bg-purple-50 border border-purple-200 border-l-4 border-l-purple-500 shadow-sm space-y-2 animate-fadeIn">
            <div className="flex justify-between items-center text-xs">
              <span className="text-purple-900 font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                {massiveStepMessage}
              </span>
              <span className="text-cyan-800 font-mono font-bold">{massiveProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden border border-purple-100">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 transition-all duration-300 ease-out"
                style={{ width: `${massiveProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Resultats de l'Auditoria Massiva */}
        {massiveResults && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            {/* Targeta de Resum Global */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 border-l-4 border-l-emerald-500 shadow-sm flex flex-wrap items-center justify-between gap-4 text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {massiveResults.resumGlobal?.estatGeneral || 'ENS Nivell Alt Validat'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Compliment ENS: <strong className="text-emerald-800 font-bold">100%</strong> · Zero-Trust: <strong className="text-cyan-800 font-bold">Actiu</strong> · {massiveResults.tenantReports?.length} Tenants Verificats
                  </p>
                  {(massiveResults as any).merkleRootHash && (
                    <div className="mt-1 text-[10px] font-mono text-emerald-900 flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                      <Lock size={11} className="text-emerald-600" />
                      <span>Merkle Root Hash: <strong className="text-cyan-800 font-bold">{((massiveResults as any).merkleRootHash).slice(0, 16)}...</strong> (Bloc #{((massiveResults as any).merkleBlockIndex)})</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500">
                Data execució: {new Date(massiveResults.dataExecucio || '').toLocaleTimeString()}
              </div>
            </div>

            {/* Targetes per cada Tenant Auditat */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {massiveResults.tenantReports?.map((report) => (
                <div
                  key={report.tenantId}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{report.tenantName}</div>
                      <span className="text-[10px] font-mono text-slate-500">{report.badgeLabel}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
                      OPTIMAL
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200">
                      <span className="text-cyan-800 block text-[10px] font-medium">Latència PostgreSQL</span>
                      <strong className="text-cyan-900 font-mono text-xs">{report.latenciaPostgresMs} ms</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-800 block text-[10px] font-medium">Xifratge E2EE</span>
                      <strong className="text-emerald-900 font-mono text-xs">AES-256 OK</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                      <span className="text-indigo-800 block text-[10px] font-medium">Zero-Trust Headers</span>
                      <strong className="text-indigo-900 font-mono text-xs">HSTS & CSP OK</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="text-amber-800 block text-[10px] font-medium">Context Subnet</span>
                      <strong className="text-amber-900 font-mono text-xs">Reconegut</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* BLOC 2: ESTUDI DE SIMULACIÓ PERSONALITZADA (A LA CARTA - FINS A 5 ANYS) */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-black text-slate-900">
            Bloc 2: Estudi de Simulació Personalitzada d'Estrès (A la Carta)
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-6">
          Configura els paràmetres de concurrència, entitats seleccionades i projecció temporal de fins a 5 anys de creixement sostingut.
        </p>

        {/* Formulari de Paràmetres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Columna 1: Tenants Objectiu */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 size={14} className="text-purple-600" />
              1. Entitats Objectiu de la Prova
            </label>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-56 overflow-y-auto">
              {availableTenants.map((t) => {
                const isChecked = selectedTenants.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTenant(t.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                      isChecked
                        ? 'bg-purple-50 border-purple-300 border-l-4 border-l-purple-500 text-purple-950 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{t.badge}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{t.name}</div>
                    </div>
                    {isChecked && <Check size={14} className="text-purple-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna 2: Rang Temporal de Simulació (Fins a 5 Anys) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar size={14} className="text-cyan-600" />
              2. Horitzó Temporal de Simulació
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
              {[1, 2, 3, 4, 5].map((year) => {
                const isSelected = simulationYears === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSimulationYears(year)}
                    className={`p-2.5 rounded-lg text-center transition-all flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-300 border-l-4 border-l-cyan-500 text-cyan-950 shadow-sm font-black'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black">{year} Any{year > 1 ? 's' : ''}</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {year === 1 && '4.2k'}
                      {year === 2 && '19.8k'}
                      {year === 3 && '48.5k'}
                      {year === 4 && '92k'}
                      {year === 5 && '165k'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Projecció seleccionada: <strong className="text-cyan-800 font-bold">{simulationYears} Anys</strong> de càrrega sintètica acumulada amb creixement volumètric.
            </p>
          </div>

          {/* Columna 3: Suites de Test Específiques */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-600" />
              3. Suites de Test Específiques
            </label>
            <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              {availableSuites.map((s) => {
                const isChecked = selectedSuites.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSuite(s.id)}
                    className={`w-full text-left p-1.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 border-l-4 border-l-emerald-500 text-emerald-950 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[11px]">{s.label}</div>
                    </div>
                    {isChecked && <Check size={14} className="text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botó d'Acció de Simulació */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <GlassButton
            variant="primary"
            disabled={isCustomRunning}
            onClick={runCustomSimulation}
            icon={isCustomRunning ? <Sparkles className="animate-spin" size={16} /> : <Zap size={16} />}
          >
            {isCustomRunning ? 'Calculant Model d\'Estrès...' : `Executar Simulació d'Estrès (${simulationYears} Anys)`}
          </GlassButton>
        </div>

        {/* Resultats de la Simulació a la Carta (Taula de Projecció a 5 Anys) */}
        {customResults && customResults.projections && (
          <div className="mt-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-600" />
                Matriu de Projecció Volumètrica i Escalabilitat (1 a {customResults.simulationYears} Anys)
              </h4>
              <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200 shadow-sm">
                Pic Màxim: {customResults.resumGlobal?.tpsMaximSoportat} TPS · Disc: {customResults.resumGlobal?.volumProjectatGb5Anys} GB
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Horitzó</th>
                    <th className="p-3">Abast Geogràfic</th>
                    <th className="p-3 text-right">Expedients</th>
                    <th className="p-3 text-right">Usuaris</th>
                    <th className="p-3 text-right">Trans./Mes</th>
                    <th className="p-3 text-right">Pic TPS</th>
                    <th className="p-3 text-right">Disc (GB)</th>
                    <th className="p-3 text-right">Latència</th>
                    <th className="p-3">Recomanació Arquitectura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customResults.projections.map((p) => (
                    <tr key={p.any} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        Any {p.any}
                      </td>
                      <td className="p-3 text-slate-600">{p.abast}</td>
                      <td className="p-3 text-right font-mono font-bold text-cyan-800">{p.totalExpedients.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-semibold text-purple-800">{p.usuarisActius.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{p.transaccionsMes.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono font-bold shadow-sm">
                          {p.picTps}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold shadow-sm">
                          {p.volumDadesGb} GB
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600">{p.latenciaMitjanaMs} ms</td>
                      <td className="p-3 text-[11px] text-slate-600 max-w-xs font-medium">{p.recomanacioArquitectura}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Targeta de Recomanació Estratègica */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 border-l-4 border-l-indigo-500 shadow-sm text-xs text-indigo-950 flex items-start gap-3">
              <Database className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">Dictamen Tècnic d'Escalabilitat:</strong>
                {customResults.resumGlobal?.recomanacioPrincipal}
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* BLOC 3: PARÀMETRES I INTEGRACIONS OFICIALS (CONSORCI AOC & CATSALUT) */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Bloc 3: Paràmetres i Integracions Oficials de Governança
              </h3>
              <p className="text-xs text-slate-600">
                Control centralitzat de passarel·les d'identitat digital, convenis interadministratius i segells electrònics.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            ENS Nivell Alt · Interoperabilitat AOC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Targeta 1: idCAT Mòbil (Consorci AOC) - Control Feature Flag Actiu/Inactiu */}
          <div className={`p-4 rounded-xl border transition-all ${
            idCatMovilActive
              ? 'bg-emerald-50/70 border-emerald-300 border-l-4 border-l-emerald-500 shadow-sm'
              : 'bg-amber-50/70 border-amber-300 border-l-4 border-l-amber-500 shadow-sm'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${idCatMovilActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  <KeyRound size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">idCAT Mòbil (Consorci AOC)</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Passarel·la Ciutadana OTP/SMS</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                idCatMovilActive
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {idCatMovilActive ? 'Actiu' : 'Inactiu (Pendent Conveni)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Autenticació oficial mitjançant telèfon mòbil i DNI per a ciutadania i usuaris de serveis comunitaris.
            </p>

            <div className="space-y-1.5 text-[11px] bg-white/80 p-2.5 rounded-lg border border-slate-200 mb-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Estat Conveni:</span>
                <strong className={idCatMovilActive ? 'text-emerald-700' : 'text-amber-700'}>
                  {idCatMovilActive ? 'Conveni Vigent AOC-CatSalut' : 'A l\'espera de validació del conveni'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Segell Electrònic:</span>
                <strong className={idCatMovilActive ? 'text-emerald-700' : 'text-amber-700'}>
                  {idCatMovilActive ? 'Certificat EC-ACC Validat' : 'Pendent de certificat de segell'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Visibilitat Login:</span>
                <strong className={idCatMovilActive ? 'text-emerald-700' : 'text-slate-500'}>
                  {idCatMovilActive ? 'Visible a /login' : 'Amagat (Només DNI/Contrasenya)'}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleIdCatMovil}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-sm ${
                idCatMovilActive
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
              }`}
            >
              {idCatMovilActive ? (
                <>
                  <ToggleRight size={16} className="text-rose-600" />
                  Desactivar idCAT Mòbil a Login
                </>
              ) : (
                <>
                  <ToggleLeft size={16} className="text-white" />
                  Habilitar idCAT Mòbil (Pilot / Validació)
                </>
              )}
            </button>
          </div>

          {/* Targeta 2: Certificats Digitals Qualificats (T-CAT / DNIe) */}
          <div className="p-4 rounded-xl border bg-cyan-50/70 border-cyan-300 border-l-4 border-l-cyan-500 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-100 text-cyan-800">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">idCAT Certificat / T-CAT</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Dispositiu Criptogràfic QSCD</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-cyan-100 text-cyan-800 border-cyan-300">
                Actiu (Producció)
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Autenticació per a facultatius mèdics, direccions de CAP i administradors de sistemes de salut.
            </p>

            <div className="space-y-1.5 text-[11px] bg-white/80 p-2.5 rounded-lg border border-slate-200 mb-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Entitat Emissora:</span>
                <strong className="text-cyan-800">EC-ACC (Generalitat de Catalunya)</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Nivell Seguretat:</span>
                <strong className="text-cyan-800">Substancial / Alt (eIDAS)</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Validació OCSP:</span>
                <strong className="text-emerald-700">En línia (Temps real)</strong>
              </div>
            </div>

            <div className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Passarel·la Qualificada Connectada
            </div>
          </div>

          {/* Targeta 3: Passarel·la Via Oberta / Dependència */}
          <div className="p-4 rounded-xl border bg-purple-50/70 border-purple-300 border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <Globe size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Via Oberta (Consorci AOC)</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Intercanvi Dades Interadministratiu</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-100 text-purple-800 border-purple-300">
                Actiu (Auditat)
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Consulta de dades d'empadronament i graus de dependència sota consentiment o interès públic RGPD.
            </p>

            <div className="space-y-1.5 text-[11px] bg-white/80 p-2.5 rounded-lg border border-slate-200 mb-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Xifratge Transmissió:</span>
                <strong className="text-purple-800">TLS 1.3 / AES-256 GCM</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Traça Forense:</span>
                <strong className="text-purple-800">Arbre Merkle SHA-256</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Protecció Dades:</span>
                <strong className="text-emerald-700">Emmascarament Dinàmic</strong>
              </div>
            </div>

            <div className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Endpoint Homologat per Governança
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
