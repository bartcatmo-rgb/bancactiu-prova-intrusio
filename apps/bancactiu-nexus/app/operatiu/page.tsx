'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  QrCode,
  ScanLine,
  UserPlus,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  HardDrive,
  ArrowLeft,
  Stethoscope,
  HeartHandshake,
  Wrench,
  Building2,
  ShieldCheck,
  PackagePlus,
  PlusCircle,
  Check
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
import { NewLoanModal, NewLoanData } from '@/components/loans/NewLoanModal';
import { WorkshopAndRepairsWorkspace } from '@/components/workspaces/WorkshopAndRepairsWorkspace';

export type OperationalRole = 'TREBALLADOR_CAP' | 'VOLUNTARI_VEINAL' | 'TALLER_CREU_ROJA';

const DEFAULT_PRESTECS = [
  { id: 'op-01', expedient: 'BA-2026-00891', ciutada: 'Antònia Riera Gómez', material: 'Cadira de Rodes Autopropulsable Alumini', codiQR: 'QR-CR-001', estat: 'LLIURAT_ACTIU', retorn: '2026-12-01', centre: 'CAP Sant Ildefons' },
  { id: 'op-02', expedient: 'BA-2026-00892', ciutada: 'Joan Puigdemunt Vidal', material: 'Caminador 4 Rodes amb Fre i Seient', codiQR: 'QR-CAM-002', estat: 'LLIURAT_ACTIU', retorn: '2026-12-05', centre: 'CAP Just Oliveras' },
  { id: 'op-03', expedient: 'BA-2026-00894', ciutada: 'Josep Maria Almirall', material: 'Parell de Bastons Anglesos Antilliscants', codiQR: 'QR-BST-003', estat: 'RETORNAT', retorn: '2026-11-10', centre: 'CAP Can Bou' },
  { id: 'op-04', expedient: 'BA-2026-00901', ciutada: 'Dolors Valls Solé', material: 'Llit Articulat Elèctric amb Carro', codiQR: 'QR-LLIT-008', estat: 'LLIURAT_ACTIU', retorn: '2027-01-15', centre: 'Creu Roja Baix Llobregat' },
];

export default function BancActiuOperatiuUnifiedPage() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanSimulated, setScanSimulated] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [activeOperationalRole, setActiveOperationalRole] = useState<OperationalRole>('TREBALLADOR_CAP');

  const [prestecsLlista, setPrestecsLlista] = useState<any[]>(DEFAULT_PRESTECS);
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bancactiu_prestecs_operatiu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrestecsLlista(parsed);
        }
      }
    } catch {
      // Ignorar fallback
    }
  }, []);

  const handleOpenNewLoanModal = () => {
    setIsNewLoanModalOpen(true);
  };

  const handleLoanCreated = (newLoan: NewLoanData) => {
    const updated = [newLoan, ...prestecsLlista];
    setPrestecsLlista(updated);
    try {
      localStorage.setItem('bancactiu_prestecs_operatiu', JSON.stringify(updated));
    } catch {}

    setToastMsg({
      title: 'Préstec Registrat amb Èxit',
      desc: `Expedient ${newLoan.expedient} assignat a ${newLoan.ciutada} (${newLoan.material}). Codi: ${newLoan.codiQR}`
    });
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleSimulateScan = () => {
    setScanSimulated(true);
    setTimeout(() => {
      alert('Escàner QR/Codi de Barres: Material detectat correctament [CADIRA DE RODES CR-LUG-01]. Estat: DISPONIBLE.');
      setScanSimulated(false);
    }, 600);
  };

  const handleAppSelect = (app: AppDefinition) => {
    if (app.id === 'bancactiu-operatiu-1.0' || app.id === 'bancactiu-operatiu') {
      setIsLauncherOpen(false);
      return;
    }
    window.location.href = resolveAppTargetUrl(app.id, app.port);
  };

  const filteredPrestecs = prestecsLlista.filter(p =>
    p.ciutada.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.expedient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RadialAuraBackground variant="operatiu">
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
            <GlassBadge variant="blue" pulse>Mòdul Operatiu Actiu (BancActiu 3.0)</GlassBadge>
          </div>

          <GlassHeader
            appName="BancActiu Operatiu (Taulell UAC & Logística)"
            badgeText="Magatzem Central &middot; Lliuraments"
            badgeVariant="blue"
            userNom={
              activeOperationalRole === 'TREBALLADOR_CAP' ? "Dra. Carmen Morales (CAP Sant Ildefons)" :
              activeOperationalRole === 'VOLUNTARI_VEINAL' ? "Manel Gómez (AVV Sant Ildefons)" :
              "Jordi Prat (Cap Taller Creu Roja)"
            }
            userRol={
              activeOperationalRole === 'TREBALLADOR_CAP' ? "Prescripció Clínica & Atenció Sanitària" :
              activeOperationalRole === 'VOLUNTARI_VEINAL' ? "Xarxa de Suport Veïnal & Derivacions" :
              "Centre de Reparació & Homologació d'Ajudes Tècniques"
            }
            onOpenLauncher={() => setIsLauncherOpen(true)}
          />

          {/* FASE 2: BARRA DE SEPARACIÓ D'ACCESSOS PER ROLS OPERATIUS */}
          <div className="my-4 p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 pl-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span className="text-xs font-black tracking-wide text-white uppercase">
                  Rols Operatius del Sistema:
                </span>
              </div>

              {/* Botons diferenciats i clars per als 3 rols operatius */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {/* 1. Treballador del CAP */}
                <button
                  type="button"
                  onClick={() => setActiveOperationalRole('TREBALLADOR_CAP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    activeOperationalRole === 'TREBALLADOR_CAP'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-emerald-400/40'
                  }`}
                >
                  <Stethoscope size={14} className={activeOperationalRole === 'TREBALLADOR_CAP' ? 'text-white' : 'text-emerald-400'} />
                  <span>Treballador del CAP</span>
                  <span className="text-[10px] opacity-80 hidden md:inline">(Gestió i Prescripció)</span>
                </button>

                {/* 2. Voluntari / Entitat Veïnal */}
                <button
                  type="button"
                  onClick={() => setActiveOperationalRole('VOLUNTARI_VEINAL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    activeOperationalRole === 'VOLUNTARI_VEINAL'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-amber-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <HeartHandshake size={14} className={activeOperationalRole === 'VOLUNTARI_VEINAL' ? 'text-white' : 'text-amber-400'} />
                  <span>Voluntari / Entitat Veïnal</span>
                  <span className="text-[10px] opacity-80 hidden md:inline">(Peticions i Suport)</span>
                </button>

                {/* 3. Centre de Reparació (Creu Roja) */}
                <button
                  type="button"
                  onClick={() => setActiveOperationalRole('TALLER_CREU_ROJA')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    activeOperationalRole === 'TALLER_CREU_ROJA'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400 shadow-rose-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-rose-400/40'
                  }`}
                >
                  <Wrench size={14} className={activeOperationalRole === 'TALLER_CREU_ROJA' ? 'text-white' : 'text-rose-400'} />
                  <span>Centre de Reparació (Creu Roja)</span>
                  <span className="text-[10px] opacity-80 hidden md:inline">(Gestió Tècnica)</span>
                </button>
              </div>
            </div>
          </div>

          {/* VISTA 1 & 2: Visió per a Treballador del CAP i Voluntari Veïnal */}
          {activeOperationalRole !== 'TALLER_CREU_ROJA' ? (
            <main className="flex-1 my-4 space-y-6">
              <GlassCard variant="glow" glowColor="cyan" className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ScanLine className="w-6 h-6 text-cyan-400" />
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {activeOperationalRole === 'TREBALLADOR_CAP'
                          ? "Prescripció Sanitària i Lliurament Immediat d'Ortopèdia (CAP)"
                          : "Xarxa d'Entitats Veïnals i Gestió de Peticions Ciutadanes"}
                      </h2>
                      <GlassBadge variant={activeOperationalRole === 'TREBALLADOR_CAP' ? "emerald" : "amber"}>
                        {activeOperationalRole === 'TREBALLADOR_CAP' ? "Perfil Clínic CatSalut" : "Perfil Xarxa Comunitària"}
                      </GlassBadge>
                    </div>
                    <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                      {activeOperationalRole === 'TREBALLADOR_CAP'
                        ? "Mòdul dedicat a metges i treballadors d'atenció primària (UAC). Permet donar d'alta préstecs mèdics directes, imprimir etiquetes QR i validar necessitats funcionals."
                        : "Espai per a representants veïnals (AVV Sant Ildefons, Almeda, etc.). Permet tramitar sol·licituds de suport familiar, derivar material per reparar a Creu Roja i seguir la traçabilitat."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <GlassButton
                      variant="primary"
                      onClick={handleSimulateScan}
                      icon={<QrCode size={16} />}
                    >
                      {scanSimulated ? 'Escanejant...' : 'Escriure / Escanejar QR'}
                    </GlassButton>

                    {/* BOTÓ 1: NOU PRÉSTAMO CONNECTAT DIRECTAMENT */}
                    <GlassButton
                      variant="primary"
                      onClick={handleOpenNewLoanModal}
                      icon={<PackagePlus size={16} />}
                    >
                      Nou Préstamo
                    </GlassButton>

                    <GlassButton
                      variant="secondary"
                      onClick={handleOpenNewLoanModal}
                      icon={<UserPlus size={16} />}
                    >
                      Nou Préstec Ciutadà
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>

              {/* Mètriques Operatives */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <PackageCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Materials Disponibles</div>
                      <div className="text-xl font-black text-white">418 Unitats</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300">Cadires, caminadors, crosses, llits articulats.</div>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Préstecs Actius Registrats</div>
                      <div className="text-xl font-black text-white">{prestecsLlista.length} Expedients</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300">Temps mitjà de préstec comunitari: 42 dies.</div>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                      <HardDrive size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Taxa de Reutilització</div>
                      <div className="text-xl font-black text-white">94.2%</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300">Materials recondicionats per Creu Roja.</div>
                </GlassCard>
              </div>

              {/* Taula de Préstecs Vigents */}
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-cyan-400" />
                    <h3 className="text-base font-bold text-white">
                      Préstecs Vigents i Estat de Retorn
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {filteredPrestecs.length} actius
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cercar per pacient, CIP o expedient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={handleOpenNewLoanModal}
                      icon={<PlusCircle size={14} />}
                    >
                      Nou Préstamo
                    </GlassButton>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Expedient</th>
                        <th className="p-3">Ciutadà / Beneficiari</th>
                        <th className="p-3">Material Lliurat</th>
                        <th className="p-3">Identificador QR</th>
                        <th className="p-3">Centre Prescriptor</th>
                        <th className="p-3">Data Prevista Retorn</th>
                        <th className="p-3">Estat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-200">
                      {filteredPrestecs.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-mono font-bold text-cyan-300">{p.expedient}</td>
                          <td className="p-3 font-semibold text-white">
                            {p.ciutada}
                            {p.dniCip && <span className="block text-[10px] text-slate-400 font-mono">{p.dniCip}</span>}
                          </td>
                          <td className="p-3 text-slate-300">{p.material}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{p.codiQR}</td>
                          <td className="p-3 text-[11px] text-slate-300">{p.centre || p.centreOrigen || 'CAP Sant Ildefons'}</td>
                          <td className="p-3 text-slate-300 font-mono">{p.retorn}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.estat === 'LLIURAT_ACTIU'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {p.estat === 'LLIURAT_ACTIU' ? 'Lliurat i Actiu' : 'Retornat a Magatzem'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </main>
          ) : (
            /* VISTA 3: CENTRE DE REPARACIÓ (CREU ROJA) */
            <main className="flex-1 my-4 space-y-6">
              <WorkshopAndRepairsWorkspace
                onShowToast={(t, m) => {
                  setToastMsg({ title: t, desc: m });
                  setTimeout(() => setToastMsg(null), 5000);
                }}
              />
            </main>
          )}
        </div>

        {/* Modal de Nou Préstamo */}
        <NewLoanModal
          isOpen={isNewLoanModalOpen}
          onClose={() => setIsNewLoanModalOpen(false)}
          onLoanCreated={handleLoanCreated}
        />

        {/* Toast Notificació */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-2xl flex items-center gap-3 animate-fadeIn text-white max-w-md">
            <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-cyan-300">{toastMsg.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastMsg.desc}</p>
            </div>
          </div>
        )}

        <GlassModal
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          title="Navegador de Micro-Aplicacions BancActiu 3.0"
          maxWidth="4xl"
        >
          <GatewayLauncher
            currentAppId="bancactiu-operatiu-1.0"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Operatiu 3.0 &middot; UAC &middot; Magatzem Logístic Cornellà &middot; Monorepo BancActiu 3.0 Enterprise
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
