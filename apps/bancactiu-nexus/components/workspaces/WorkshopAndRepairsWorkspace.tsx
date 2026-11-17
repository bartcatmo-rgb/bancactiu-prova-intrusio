'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Hammer,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  FileText,
  Search,
  Filter,
  User,
  QrCode,
  ArrowRight,
  ClipboardList,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Building,
  History
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';

export type RepairStatus = 'PENDENT' | 'EN_REPARACIO' | 'VERIFICACIO_SEGURETAT' | 'REPARADA_RETORNADA';

export interface RepairIncident {
  id: string;
  codiAvaria: string;
  material: string;
  codiQR: string;
  origenEntitat: string; // Ex: "AVV Sant Ildefons (Entitat Veïnal)", "Retorn Ciutadà CAP Just Oliveras"
  dataEntrada: string;
  prioritat: 'ALTA' | 'MITJANA' | 'URGENT';
  diagnosiInicial: string;
  estat: RepairStatus;
  tecnicAssignat?: string;
  intervencions?: {
    data: string;
    tecnic: string;
    descripcio: string;
    pecesCanviades: string[];
    horesBancTemps: number;
    testSeguretatOk: boolean;
  }[];
}

interface WorkshopAndRepairsWorkspaceProps {
  onClose?: () => void;
  onShowToast?: (title: string, message: string) => void;
}

const INITIAL_INCIDENTS: RepairIncident[] = [
  {
    id: 'inc-01',
    codiAvaria: 'AV-2026-041',
    material: 'Cadira de Rodes Autopropulsable Alumini Invacare',
    codiQR: 'QR-CR-001',
    origenEntitat: 'AVV Sant Ildefons (Entitat Veïnal)',
    dataEntrada: '2026-11-12',
    prioritat: 'ALTA',
    diagnosiInicial: 'Fre dret completament desgastat amb pèrdua de pressió; rodament davanter esquerre encallat.',
    estat: 'EN_REPARACIO',
    tecnicAssignat: 'Albert Puig (Mecànic Creu Roja)',
    intervencions: [
      {
        data: '2026-11-14',
        tecnic: 'Albert Puig',
        descripcio: 'Desmuntatge complet de la forqueta davantera i neteja d\'eix per ultrasons.',
        pecesCanviades: ['Coixinet segellat 608RS', 'Cablejat de tensió de fre'],
        horesBancTemps: 2.0,
        testSeguretatOk: false,
      }
    ]
  },
  {
    id: 'inc-02',
    codiAvaria: 'AV-2026-042',
    material: 'Caminador 4 Rodes amb Fre i Seient Forta',
    codiQR: 'QR-CAM-002',
    origenEntitat: 'Retorn de Préstec Ciutadà (CAP Sant Ildefons)',
    dataEntrada: '2026-11-13',
    prioritat: 'MITJANA',
    diagnosiInicial: 'Tacs de goma antilliscants posteriors gastats i cargols del seient amb joc.',
    estat: 'VERIFICACIO_SEGURETAT',
    tecnicAssignat: 'Marta Soler (Voluntària Tècnica Creu Roja)',
    intervencions: [
      {
        data: '2026-11-15',
        tecnic: 'Marta Soler',
        descripcio: 'Substitució de gomes d\'adherència i estrenyiment dinamomètric de xassís.',
        pecesCanviades: ['Joc de 4 tacs de cautxú antilliscant', 'Tornilleria acer inoxidable M6'],
        horesBancTemps: 1.5,
        testSeguretatOk: true,
      }
    ]
  },
  {
    id: 'inc-03',
    codiAvaria: 'AV-2026-043',
    material: 'Llit Articulat Elèctric Medilux 90cm',
    codiQR: 'QR-LLIT-004',
    origenEntitat: 'Creu Roja Baix Llobregat (Donació Comunitària)',
    dataEntrada: '2026-11-14',
    prioritat: 'URGENT',
    diagnosiInicial: 'Pistó elèctric del carro elevador amb fallada de connexió a 220V; comandament de llit descalibrat.',
    estat: 'PENDENT',
    tecnicAssignat: 'Pendent d\'assignació tècnica',
    intervencions: []
  },
  {
    id: 'inc-04',
    codiAvaria: 'AV-2026-039',
    material: 'Parell de Bastons Anglesos Antilliscants (Crosses)',
    codiQR: 'QR-BST-012',
    origenEntitat: 'Associació de Veïns Almeda',
    dataEntrada: '2026-11-08',
    prioritat: 'MITJANA',
    diagnosiInicial: 'Revisió de clips d\'ajust telescòpic i canvi de ventoses de suport.',
    estat: 'REPARADA_RETORNADA',
    tecnicAssignat: 'Joan Carles Vidal (Taller Creu Roja)',
    intervencions: [
      {
        data: '2026-11-10',
        tecnic: 'Joan Carles Vidal',
        descripcio: 'Desinfecció hospitalària, canvi de coneres de goma i test de resistència 120 kg.',
        pecesCanviades: ['Coneres d\'alta fricció', 'Empunyadures anatòmiques toves'],
        horesBancTemps: 1.0,
        testSeguretatOk: true,
      }
    ]
  }
];

export const WorkshopAndRepairsWorkspace: React.FC<WorkshopAndRepairsWorkspaceProps> = ({
  onClose,
  onShowToast,
}) => {
  const [incidents, setIncidents] = useState<RepairIncident[]>(INITIAL_INCIDENTS);
  const [filterEstat, setFilterEstat] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<RepairIncident | null>(null);

  // Formulari de Nova Incidència
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newCodiQR, setNewCodiQR] = useState('');
  const [newOrigen, setNewOrigen] = useState('AVV Sant Ildefons (Entitat Veïnal)');
  const [newPrioritat, setNewPrioritat] = useState<'ALTA' | 'MITJANA' | 'URGENT'>('MITJANA');
  const [newDiagnosi, setNewDiagnosi] = useState('');

  // Formulari de Nova Intervenció Tècnica
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [intervTecnic, setIntervTecnic] = useState('Albert Puig (Creu Roja)');
  const [intervDescripcio, setIntervDescripcio] = useState('');
  const [intervPeces, setIntervPeces] = useState('');
  const [intervHores, setIntervHores] = useState(1.5);
  const [intervTestOk, setIntervTestOk] = useState(true);

  // Transicions de cicle de vida
  const handleAdvanceStatus = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id !== incidentId) return item;
        let nextStatus: RepairStatus = item.estat;
        if (item.estat === 'PENDENT') nextStatus = 'EN_REPARACIO';
        else if (item.estat === 'EN_REPARACIO') nextStatus = 'VERIFICACIO_SEGURETAT';
        else if (item.estat === 'VERIFICACIO_SEGURETAT') nextStatus = 'REPARADA_RETORNADA';

        if (onShowToast) {
          onShowToast(
            'Estat de Reparació Actualitzat',
            `Avaria ${item.codiAvaria} moguda a [${nextStatus.replace('_', ' ')}] per Creu Roja.`
          );
        }
        return { ...item, estat: nextStatus };
      })
    );
  };

  const handleSetStatus = (incidentId: string, newStatus: RepairStatus) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id !== incidentId) return item;
        if (onShowToast) {
          onShowToast(
            'Transició de Cicle de Vida',
            `Incidència ${item.codiAvaria} ara està en [${newStatus}].`
          );
        }
        return { ...item, estat: newStatus };
      })
    );
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.trim() || !newDiagnosi.trim()) return;

    const newInc: RepairIncident = {
      id: `inc-${Date.now()}`,
      codiAvaria: `AV-2026-${Math.floor(100 + Math.random() * 900)}`,
      material: newMaterial.trim(),
      codiQR: newCodiQR.trim() || `QR-${Math.floor(100 + Math.random() * 900)}`,
      origenEntitat: newOrigen,
      dataEntrada: new Date().toISOString().split('T')[0],
      prioritat: newPrioritat,
      diagnosiInicial: newDiagnosi.trim(),
      estat: 'PENDENT',
      tecnicAssignat: 'Pendent d\'assignació (Creu Roja)',
      intervencions: []
    };

    setIncidents([newInc, ...incidents]);
    setIsNewIncidentModalOpen(false);
    setNewMaterial('');
    setNewCodiQR('');
    setNewDiagnosi('');
    if (onShowToast) {
      onShowToast('Nova Incidència Registrada', `Avaria ${newInc.codiAvaria} entrada al taller des de ${newOrigen}.`);
    }
  };

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !intervDescripcio.trim()) return;

    const novaInterv = {
      data: new Date().toISOString().split('T')[0],
      tecnic: intervTecnic.trim(),
      descripcio: intervDescripcio.trim(),
      pecesCanviades: intervPeces.split(',').map(p => p.trim()).filter(Boolean),
      horesBancTemps: Number(intervHores) || 1,
      testSeguretatOk: intervTestOk,
    };

    setIncidents(prev =>
      prev.map(item => {
        if (item.id !== selectedIncident.id) return item;
        const updatedInterventions = [...(item.intervencions || []), novaInterv];
        return {
          ...item,
          intervencions: updatedInterventions,
          estat: intervTestOk ? 'VERIFICACIO_SEGURETAT' : 'EN_REPARACIO',
          tecnicAssignat: intervTecnic.trim(),
        };
      })
    );

    setIsInterventionModalOpen(false);
    setIntervDescripcio('');
    setIntervPeces('');
    if (onShowToast) {
      onShowToast('Nota d\'Intervenció Desada', `Canvis i peces registrats per a ${selectedIncident.codiAvaria}.`);
    }
  };

  const filtered = incidents.filter(item => {
    const matchesEstat = filterEstat === 'ALL' || item.estat === filterEstat;
    const matchesSearch =
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codiAvaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.origenEntitat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codiQR.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEstat && matchesSearch;
  });

  const getStatusBadge = (estat: RepairStatus) => {
    switch (estat) {
      case 'PENDENT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">1. Pendent d'Assignació</span>;
      case 'EN_REPARACIO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">2. En Reparació Tècnica</span>;
      case 'VERIFICACIO_SEGURETAT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">3. Verificació Seguretat</span>;
      case 'REPARADA_RETORNADA':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">4. Reparada & Retornada</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Capçalera del Workspace */}
      <GlassCard variant="glow" glowColor="rose" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Hammer className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Taller Solidari & Gestió de Reparacions (Creu Roja)
              </h2>
              <GlassBadge variant="purple">Aliança Tercer Sector & Veïnal</GlassBadge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Consola tècnica de recondicionament d'ajudes tècniques. Centralitza la recepció d'avaries
              notificades per les Entitats Veïnals, l'assignació a mecànics voluntaris de Creu Roja,
              el cicle de vida de 4 etapes i el certificat de seguretat abans del reingrés a l'estoc operatiu.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <GlassButton
              variant="primary"
              onClick={() => setIsNewIncidentModalOpen(true)}
              icon={<PlusCircle size={16} />}
            >
              Registrar Avaria d'Entitat Veïnal
            </GlassButton>
            {onClose && (
              <GlassButton variant="secondary" onClick={onClose}>
                Tancar Workspace
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* KPI Cards de Taller */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400">Total Avaries Entrades</div>
          <div className="text-2xl font-black text-white my-1">{incidents.length}</div>
          <div className="text-[10px] text-slate-400">Rebudes per AVV i Serveis Socials</div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-amber-500/30">
          <div className="text-xs font-semibold text-amber-300">Pendents de Taller</div>
          <div className="text-2xl font-black text-amber-400 my-1">
            {incidents.filter(i => i.estat === 'PENDENT').length}
          </div>
          <div className="text-[10px] text-amber-200/70">Esperant diagnòstic inicial</div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-blue-500/30">
          <div className="text-xs font-semibold text-blue-300">En Reparació Activa</div>
          <div className="text-2xl font-black text-blue-400 my-1">
            {incidents.filter(i => i.estat === 'EN_REPARACIO').length}
          </div>
          <div className="text-[10px] text-blue-200/70">Banc del Temps Creu Roja</div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between border-emerald-500/30">
          <div className="text-xs font-semibold text-emerald-300">Reparades i Llestes</div>
          <div className="text-2xl font-black text-emerald-400 my-1">
            {incidents.filter(i => i.estat === 'REPARADA_RETORNADA').length}
          </div>
          <div className="text-[10px] text-emerald-200/70">Homologades i retornades a estoc</div>
        </GlassCard>
      </div>

      {/* Barra de Filtres i Cerca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-300 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filtrar Estat:
          </span>
          <button
            type="button"
            onClick={() => setFilterEstat('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterEstat === 'ALL' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Totes ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterEstat('PENDENT')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterEstat === 'PENDENT' ? 'bg-amber-500/30 text-amber-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendents ({incidents.filter(i => i.estat === 'PENDENT').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterEstat('EN_REPARACIO')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterEstat === 'EN_REPARACIO' ? 'bg-blue-500/30 text-blue-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            En Taller ({incidents.filter(i => i.estat === 'EN_REPARACIO').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterEstat('VERIFICACIO_SEGURETAT')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterEstat === 'VERIFICACIO_SEGURETAT' ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Verificació ({incidents.filter(i => i.estat === 'VERIFICACIO_SEGURETAT').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterEstat('REPARADA_RETORNADA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filterEstat === 'REPARADA_RETORNADA' ? 'bg-emerald-500/30 text-emerald-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Retornades ({incidents.filter(i => i.estat === 'REPARADA_RETORNADA').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cercar per avaria, material o entitat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Llista d'Incidències d'Avaria i Flux de Cicle de Vida */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <GlassCard key={item.id} className="p-4 sm:p-5 transition hover:border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                    {item.codiAvaria}
                  </span>
                  <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                    <QrCode size={12} className="text-cyan-400" /> {item.codiQR}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.prioritat === 'URGENT' ? 'bg-rose-600 text-white' :
                    item.prioritat === 'ALTA' ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {item.prioritat}
                  </span>
                  {getStatusBadge(item.estat)}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {item.material}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <Building size={13} className="text-amber-400 shrink-0" />
                    <span>Emès per: <strong className="text-white">{item.origenEntitat}</strong></span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">Data d'entrada: {item.dataEntrada}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-slate-300">
                  <span className="text-amber-300 font-semibold">Diagnòstic:</span> {item.diagnosiInicial}
                </div>

                {/* Històric d'intervencions tècniques */}
                {item.intervencions && item.intervencions.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <History size={12} className="text-rose-400" /> Últimes Intervencions del Taller ({item.intervencions.length}):
                    </span>
                    <div className="space-y-1">
                      {item.intervencions.map((intv, idx) => (
                        <div key={idx} className="text-[11px] p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <strong className="text-cyan-300">{intv.tecnic}</strong> ({intv.data}): {intv.descripcio}
                            {intv.pecesCanviades.length > 0 && (
                              <div className="text-[10px] text-emerald-300 mt-0.5">
                                Components substituïts: {intv.pecesCanviades.join(', ')} &bull; {intv.horesBancTemps}h
                              </div>
                            )}
                          </div>
                          {intv.testSeguretatOk && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                              <CheckCircle2 size={11} /> Test Seguretat OK
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botons d'acció de Cicle de Vida */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedIncident(item);
                    setIsInterventionModalOpen(true);
                  }}
                  icon={<Wrench size={14} />}
                >
                  Afegir Intervenció
                </GlassButton>

                {item.estat !== 'REPARADA_RETORNADA' ? (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <span>Següent Fase</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} /> Homologada per Retorn
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/10">
            <ClipboardList className="w-10 h-10 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-semibold">No s'han trobat avaries amb els criteris seleccionats.</p>
          </div>
        )}
      </div>

      {/* Modal 1: Registrar Nova Incidència / Avaria */}
      {isNewIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900/95 border border-rose-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Hammer size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registrar Nova Avaria d'Entitat Veïnal</h3>
                  <p className="text-xs text-slate-400">Recepció al taller mecànic solidari de Creu Roja.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewIncidentModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Material Avariat / Ajudes Tècniques *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cadira de Rodes Transitòria amb roda punxada"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Codi QR / Identificador
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: QR-CR-119"
                    value={newCodiQR}
                    onChange={(e) => setNewCodiQR(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Prioritat de Reparació
                  </label>
                  <select
                    value={newPrioritat}
                    onChange={(e) => setNewPrioritat(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
                  >
                    <option value="MITJANA">Mitjana (Revisió estàndard)</option>
                    <option value="ALTA">Alta (Assignada a pacient urgent)</option>
                    <option value="URGENT">Urgent (Crítica amb avaria elèctrica)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Entitat Veïnal o Origen del Report *
                </label>
                <select
                  value={newOrigen}
                  onChange={(e) => setNewOrigen(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="AVV Sant Ildefons (Entitat Veïnal)">AVV Sant Ildefons (Entitat Veïnal)</option>
                  <option value="AVV Almeda (Entitat Veïnal)">AVV Almeda (Entitat Veïnal)</option>
                  <option value="Creu Roja Baix Llobregat (Cornellà)">Creu Roja Baix Llobregat (Cornellà)</option>
                  <option value="CAP Sant Ildefons (Retorn de Préstec)">CAP Sant Ildefons (Retorn de Préstec)</option>
                  <option value="CAP Just Oliveras (L'Hospitalet)">CAP Just Oliveras (L'Hospitalet)</option>
                  <option value="Donació Particular de Ciutadà">Donació Particular de Ciutadà</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Descripció de l'Avaria o Desperfecte *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla els símptomes: joc a l'eix, frens no retenen, bateria esgotada, xassís vinclat..."
                  value={newDiagnosi}
                  onChange={(e) => setNewDiagnosi(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsNewIncidentModalOpen(false)}
                >
                  Cancel·lar
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 size={15} />}
                >
                  Registrar Avaria
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Registrar Intervenció Tècnica & Canvi de Components */}
      {isInterventionModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Wrench size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Nova Intervenció Tècnica Creu Roja</h3>
                  <p className="text-xs text-slate-400">
                    Avaria <span className="text-cyan-300 font-mono font-bold">{selectedIncident.codiAvaria}</span> &bull; {selectedIncident.material}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInterventionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tècnic Mecànic Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={intervTecnic}
                    onChange={(e) => setIntervTecnic(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Hores Invertides (Banc del Temps)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={intervHores}
                    onChange={(e) => setIntervHores(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Descripció del Treball Realitzat *
                </label>
                <textarea
                  required
                  rows={2.5}
                  placeholder="Detalla les operacions: ajust de frens, soldadura de travesser, canvi de pneumàtics..."
                  value={intervDescripcio}
                  onChange={(e) => setIntervDescripcio(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Components i Peces Substituïdes (Separats per comes)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2 cables d'acer, sabates de cautxú, greix de liti"
                  value={intervPeces}
                  onChange={(e) => setIntervPeces(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="test-ok"
                  checked={intervTestOk}
                  onChange={(e) => setIntervTestOk(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="test-ok" className="text-xs text-slate-300 cursor-pointer">
                  <span className="font-semibold text-white">Verificació de Seguretat Biomecànica Superada</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Certifica que el material compleix els paràmetres de frenada, càrrega màxima i estabilitat estructural per al seu lliurament segur a pacients.
                  </p>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsInterventionModalOpen(false)}
                >
                  Cancel·lar
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 size={15} />}
                >
                  Desar Intervenció
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
