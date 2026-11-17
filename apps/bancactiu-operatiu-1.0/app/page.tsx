'use client';

import React, { useState } from 'react';
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
  HardDrive
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

export default function BancActiuOperatiuPage() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanSimulated, setScanSimulated] = useState(false);

  const [prestecsLlista, setPrestecsLlista] = useState([
    { id: 'op-01', expedient: 'BA-2026-00891', ciutada: 'Antònia Riera Gómez', material: 'Cadira de Rodes Autopropulsable Alumini', codiQR: 'QR-CR-001', estat: 'LLIURAT_ACTIU', retorn: '2026-12-01' },
    { id: 'op-02', expedient: 'BA-2026-00892', ciutada: 'Joan Puigdemunt Vidal', material: 'Caminador 4 Rodes amb Fre i Seient', codiQR: 'QR-CAM-002', estat: 'LLIURAT_ACTIU', retorn: '2026-12-05' },
    { id: 'op-03', expedient: 'BA-2026-00894', ciutada: 'Josep Maria Almirall', material: 'Parell de Bastons Anglesos Antilliscants', codiQR: 'QR-BST-003', estat: 'RETORNAT', retorn: '2026-11-10' },
  ]);

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
    window.location.href = resolveAppTargetUrl(app);
  };

  return (
    <RadialAuraBackground variant="operatiu">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <GlassHeader
          appName="BancActiu Operatiu 1.0 (Core Diari UAC)"
          badgeText="Atenció Presencial & Taulell"
          badgeVariant="blue"
          userNom="Laura Esteve (Administrativa Sanitària UAC)"
          userRol="Taulell d'Atenció Ciutadana CAP Sant Ildefons"
          onOpenLauncher={() => setIsLauncherOpen(true)}
        />

        <main className="flex-1 my-4 space-y-6">
          <GlassCard variant="glow" glowColor="cyan" className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <LayoutDashboard className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Tauler d'Operacions Ràpides de Préstecs i Devolucions
                  </h2>
                  <GlassBadge variant="blue">Core Operatiu</GlassBadge>
                </div>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Terminal de treball àgil per a administratius d'atenció primària (UAC) i voluntaris de magatzem.
                  Permet la lectura instantània de codis QR, lliurament immediat amb signatura digital i registre de
                  retorn de material ortopèdic.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <GlassButton
                  variant="primary"
                  onClick={handleSimulateScan}
                  icon={<ScanLine size={16} />}
                >
                  {scanSimulated ? 'Escanejant...' : 'Escanejar Codi QR'}
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  onClick={() => alert('Registre Ciutadà ràpid activat amb idCAT Mòbil')}
                  icon={<UserPlus size={16} />}
                >
                  Alta Ciutadana Ràpida
                </GlassButton>
              </div>
            </div>
          </GlassCard>

          {/* Cerca ràpida i taula de préstecs actius */}
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck size={18} className="text-cyan-400" />
                Expedients de Préstec en Curs
              </h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cercar per expedient o pacient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900/80 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-white/15 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Expedient / Codi QR</th>
                    <th className="p-3">Ciutadà Beneficiari</th>
                    <th className="p-3">Material Assignat</th>
                    <th className="p-3">Data Límit Retorn</th>
                    <th className="p-3">Estat Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {prestecsLlista
                    .filter(p => p.ciutada.toLowerCase().includes(searchTerm.toLowerCase()) || p.expedient.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-cyan-300">
                          {item.expedient}
                          <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                            <QrCode size={11} /> {item.codiQR}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-white">{item.ciutada}</td>
                        <td className="p-3 text-slate-200">{item.material}</td>
                        <td className="p-3 font-mono text-slate-300">{item.retorn}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.estat === 'LLIURAT_ACTIU'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {item.estat === 'LLIURAT_ACTIU' ? 'En Préstec Actiu' : 'Retornat al Magatzem'}
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
              currentAppId="bancactiu-operatiu-1.0"
              currentUserRole="ADMINISTRATIU_OPERATIU"
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
            currentAppId="bancactiu-operatiu-1.0"
            currentUserRole="ADMINISTRATIU_OPERATIU"
            onSelectApp={handleAppSelect}
          />
        </GlassModal>

        <footer className="mt-6 pt-3 border-t border-white/10 text-center text-xs text-slate-500">
          BancActiu Operatiu 1.0 &middot; Core d'Atenció Ciutadana UAC & Magatzem &middot; Cornellà de Llobregat
        </footer>
      </div>
    </RadialAuraBackground>
  );
}
