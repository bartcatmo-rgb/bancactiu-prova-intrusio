'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  FileCheck2,
  Users,
  ShieldCheck,
  Building2,
  Stethoscope,
  Wrench,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Home,
  PhoneCall,
  Activity,
  Award,
  Sparkles,
  ChevronRight,
  ArrowRight,
  FileText,
  UserCheck,
  BadgeAlert,
  Send
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';

export type GrauDependencia = 'SENSE_GRAU' | 'GRAU_I_MODERADA' | 'GRAU_II_SEVERA' | 'GRAU_III_GRAN_DEPENDENCIA';
export type EstatPIA = 'PENDENT_VALORACIO' | 'EN_TRAMITACIO' | 'APROVAT_VIGENT' | 'EN_REVISIO';

export interface ExpedientDependencia {
  id: string;
  codiExpedient: string;
  ciutadaNom: string;
  ciutadaDni: string;
  edat: number;
  adreca: string;
  municipi: string;
  barri: string;
  puntuacioBVD: number; // 0 a 100 (64 punts escala reglamentària)
  grau: GrauDependencia;
  estatPia: EstatPIA;
  treballadorSocial: string;
  capReferent: string;
  recursosAssignats: {
    sadHoresSetmana: number;
    teleassistencia: boolean;
    teleassistenciaTipus?: 'BASICA' | 'AVANCADA_PERIFERICS';
    ajudesTecniquesSollicitades: string[];
    centreDeDia: boolean;
    prestacioEconomicaCuidador?: number; // €/mes
  };
  dataSollicitud: string;
  darreraActualitzacio: string;
  observacions: string;
}

interface SocialServicesWorkspaceProps {
  onClose?: () => void;
  onShowToast?: (title: string, message: string) => void;
}

const INITIAL_EXPEDIENTS: ExpedientDependencia[] = [
  {
    id: 'exp-01',
    codiExpedient: 'EXP-DEP-2026-081',
    ciutadaNom: 'Maria Dolors Carrió Soldevila',
    ciutadaDni: '38112233M',
    edat: 82,
    adreca: 'Carrer de la Florida, 14, 2n 1a',
    municipi: 'Cornellà de Llobregat',
    barri: 'Sant Ildefons',
    puntuacioBVD: 74,
    grau: 'GRAU_III_GRAN_DEPENDENCIA',
    estatPia: 'APROVAT_VIGENT',
    treballadorSocial: 'Núria Soler (Treballadora Social Municipal)',
    capReferent: 'CAP Sant Ildefons (Dr. Jaume Gutiérrez)',
    recursosAssignats: {
      sadHoresSetmana: 16,
      teleassistencia: true,
      teleassistenciaTipus: 'AVANCADA_PERIFERICS',
      ajudesTecniquesSollicitades: ['Llit Articulat Elèctric Hospitalari', 'Grua de Transferència Elèctrica'],
      centreDeDia: false,
      prestacioEconomicaCuidador: 387.64
    },
    dataSollicitud: '2026-01-15',
    darreraActualitzacio: '2026-11-10',
    observacions: 'Deteriorament cognitiu moderat i limitació severa de mobilitat. Coordinat amb Creu Roja per a instal·lació de llit.'
  },
  {
    id: 'exp-02',
    codiExpedient: 'EXP-DEP-2026-082',
    ciutadaNom: 'Josep Oriol Fontanals Ribes',
    ciutadaDni: '40889911K',
    edat: 76,
    adreca: 'Avinguda Sant Ildefons, 45, 4t 2a',
    municipi: 'Cornellà de Llobregat',
    barri: 'Sant Ildefons',
    puntuacioBVD: 58,
    grau: 'GRAU_II_SEVERA',
    estatPia: 'APROVAT_VIGENT',
    treballadorSocial: 'Núria Soler (Treballadora Social Municipal)',
    capReferent: 'CAP Sant Ildefons (Dra. Eulàlia Rovira)',
    recursosAssignats: {
      sadHoresSetmana: 10,
      teleassistencia: true,
      teleassistenciaTipus: 'BASICA',
      ajudesTecniquesSollicitades: ['Cadira de Rodes Autopropulsable Alumini', 'Cadira de Dutxa Giratòria'],
      centreDeDia: true,
      prestacioEconomicaCuidador: 268.79
    },
    dataSollicitud: '2026-02-01',
    darreraActualitzacio: '2026-11-12',
    observacions: 'Rehabilitació post-ictús. Suport veïnal per baixada d\'escales gràcies a l\'AVV Sant Ildefons.'
  },
  {
    id: 'exp-03',
    codiExpedient: 'EXP-DEP-2026-083',
    ciutadaNom: 'Carmen Salgado Morales',
    ciutadaDni: '51223344P',
    edat: 69,
    adreca: 'Carrer Montsant, 8, Baixos',
    municipi: 'Cornellà de Llobregat',
    barri: 'Almeda',
    puntuacioBVD: 34,
    grau: 'GRAU_I_MODERADA',
    estatPia: 'EN_TRAMITACIO',
    treballadorSocial: 'Jordi Casals (Tècnic Benestar Social)',
    capReferent: 'CAP Bellvitge',
    recursosAssignats: {
      sadHoresSetmana: 6,
      teleassistencia: true,
      teleassistenciaTipus: 'BASICA',
      ajudesTecniquesSollicitades: ['Caminador 4 Rodes amb Fre i Seient'],
      centreDeDia: false
    },
    dataSollicitud: '2026-09-20',
    darreraActualitzacio: '2026-11-14',
    observacions: 'Avaluació inicial BVD realitzada. Proposta de PIA en fase d\'audiència prèvia amb la família.'
  },
  {
    id: 'exp-04',
    codiExpedient: 'EXP-DEP-2026-084',
    ciutadaNom: 'Antoni Rovira Casanova',
    ciutadaDni: '36998877B',
    edat: 88,
    adreca: 'Carrer de la Miranda, 22, 1r',
    municipi: 'Cornellà de Llobregat',
    barri: 'El Pedró',
    puntuacioBVD: 88,
    grau: 'GRAU_III_GRAN_DEPENDENCIA',
    estatPia: 'EN_REVISIO',
    treballadorSocial: 'Núria Soler (Treballadora Social Municipal)',
    capReferent: 'CAP Sant Ildefons (Dr. Jaume Gutiérrez)',
    recursosAssignats: {
      sadHoresSetmana: 20,
      teleassistencia: true,
      teleassistenciaTipus: 'AVANCADA_PERIFERICS',
      ajudesTecniquesSollicitades: ['Llit Hospitalari Elèctric', 'Coixí Antiescares de Flotació Líquida'],
      centreDeDia: false,
      prestacioEconomicaCuidador: 450.00
    },
    dataSollicitud: '2025-11-10',
    darreraActualitzacio: '2026-11-15',
    observacions: 'Agudització de malaltia respiratòria crònica. Requereix revisió d\'hores SAD i reforç de material ortopèdic.'
  }
];

export function SocialServicesWorkspace({ onClose, onShowToast }: SocialServicesWorkspaceProps) {
  const [expedients, setExpedients] = useState<ExpedientDependencia[]>(INITIAL_EXPEDIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrau, setFilterGrau] = useState<string>('TOTS');
  const [selectedExpedient, setSelectedExpedient] = useState<ExpedientDependencia | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'EXPEDIENTS' | 'SAD_TELEASSISTENCIA' | 'INTEROPERABILITAT'>('EXPEDIENTS');

  // Formulari de nou expedient
  const [newNom, setNewNom] = useState('');
  const [newDni, setNewDni] = useState('');
  const [newEdat, setNewEdat] = useState<number>(75);
  const [newAdreca, setNewAdreca] = useState('');
  const [newBarri, setNewBarri] = useState('Sant Ildefons');
  const [newBvd, setNewBvd] = useState<number>(55);
  const [newSadHores, setNewSadHores] = useState<number>(8);
  const [newTeleassistencia, setNewTeleassistencia] = useState(true);
  const [newAjudes, setNewAjudes] = useState('Caminador 4 Rodes');

  const calcularGrau = (bvd: number): GrauDependencia => {
    if (bvd >= 75) return 'GRAU_III_GRAN_DEPENDENCIA';
    if (bvd >= 50) return 'GRAU_II_SEVERA';
    if (bvd >= 25) return 'GRAU_I_MODERADA';
    return 'SENSE_GRAU';
  };

  const handleCrearExpedient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom || !newDni) {
      if (onShowToast) onShowToast('Dades Incompletes', 'Si us plau, omple el nom i el DNI del ciutadà.');
      return;
    }

    const grauCalculat = calcularGrau(newBvd);
    const codi = `EXP-DEP-2026-0${expedients.length + 85}`;

    const nouExp: ExpedientDependencia = {
      id: `exp-${Date.now()}`,
      codiExpedient: codi,
      ciutadaNom: newNom,
      ciutadaDni: newDni.toUpperCase(),
      edat: Number(newEdat),
      adreca: newAdreca || 'Cornellà de Llobregat',
      municipi: 'Cornellà de Llobregat',
      barri: newBarri,
      puntuacioBVD: Number(newBvd),
      grau: grauCalculat,
      estatPia: 'EN_TRAMITACIO',
      treballadorSocial: 'Núria Soler (Treballadora Social Municipal)',
      capReferent: 'CAP Sant Ildefons (Dr. Jaume Gutiérrez)',
      recursosAssignats: {
        sadHoresSetmana: Number(newSadHores),
        teleassistencia: newTeleassistencia,
        teleassistenciaTipus: newBvd >= 75 ? 'AVANCADA_PERIFERICS' : 'BASICA',
        ajudesTecniquesSollicitades: newAjudes.split(',').map(a => a.trim()),
        centreDeDia: false
      },
      dataSollicitud: new Date().toISOString().slice(0, 10),
      darreraActualitzacio: new Date().toISOString().slice(0, 10),
      observacions: 'Expedient d\'alta ciutadana creat des de la Consola de Serveis Socials.'
    };

    setExpedients([nouExp, ...expedients]);
    setIsNewModalOpen(false);
    // Reset
    setNewNom('');
    setNewDni('');
    if (onShowToast) {
      onShowToast('Expedient de Dependència Creat', `${codi} registrat per a ${nouExp.ciutadaNom} amb ${grauCalculat.replace(/_/g, ' ')}.`);
    }
  };

  const handleAprovarPia = (expId: string) => {
    setExpedients(prev =>
      prev.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            estatPia: 'APROVAT_VIGENT',
            darreraActualitzacio: new Date().toISOString().slice(0, 10)
          };
        }
        return exp;
      })
    );
    if (onShowToast) {
      onShowToast('PIA Aprovat Institucionalment', 'Programa Individual d\'Atenció validat i notificat a CatSalut i Benestar Social.');
    }
    if (selectedExpedient?.id === expId) {
      setSelectedExpedient(prev => prev ? { ...prev, estatPia: 'APROVAT_VIGENT' } : null);
    }
  };

  const filteredExpedients = expedients.filter(exp => {
    const matchSearch =
      exp.ciutadaNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.ciutadaDni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.codiExpedient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.barri.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrau = filterGrau === 'TOTS' || exp.grau === filterGrau;
    return matchSearch && matchGrau;
  });

  const totalSADHores = expedients.reduce((acc, curr) => acc + curr.recursosAssignats.sadHoresSetmana, 0);
  const totalTeleassistencia = expedients.filter(e => e.recursosAssignats.teleassistencia).length;
  const totalGranDependencia = expedients.filter(e => e.grau === 'GRAU_III_GRAN_DEPENDENCIA').length;

  return (
    <div className="space-y-6">
      {/* Capçalera del Mòdul */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/30 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg border border-white/20">
            <HeartHandshake className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Espai de Serveis Socials & Atenció a la Dependència
              </h2>
              <GlassBadge variant="purple">ENS Nivell Alt</GlassBadge>
              <GlassBadge variant="emerald">RGPD Protegit</GlassBadge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Gestió d'expedients de dependència, barems BVD (escala 64 punts), PIAs, hores de SAD i coordinació ortopèdica amb CAPs i Creu Roja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            icon={<PlusCircle size={15} />}
          >
            Nou Expedient Dependència
          </GlassButton>
          {onClose && (
            <GlassButton variant="secondary" size="sm" onClick={onClose}>
              Tancar
            </GlassButton>
          )}
        </div>
      </div>

      {/* KPI Cards de Resum Executiu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <GlassCard variant="glow" glowColor="purple" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expedients Actius</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{expedients.length}</span>
            <span className="text-[11px] text-purple-300 font-medium">BVD & PIA</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span>100% traçabilitat RGPD / ENS</span>
          </div>
        </GlassCard>

        <GlassCard variant="glow" glowColor="cyan" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hores SAD Setmanals</span>
            <Home className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalSADHores} h</span>
            <span className="text-[11px] text-cyan-300 font-medium">Atenció a la Llar</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock size={12} className="text-cyan-400" />
            <span>Mitjana: {(totalSADHores / expedients.length).toFixed(1)} h / usuari</span>
          </div>
        </GlassCard>

        <GlassCard variant="glow" glowColor="emerald" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teleassistència</span>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalTeleassistencia}</span>
            <span className="text-[11px] text-emerald-300 font-medium">Connexions 24/7</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            <span>Sensors perifèrics actius</span>
          </div>
        </GlassCard>

        <GlassCard variant="glow" glowColor="amber" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gran Dependència</span>
            <BadgeAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalGranDependencia}</span>
            <span className="text-[11px] text-amber-300 font-medium">Grau III (BVD &gt; 74)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} className="text-amber-400" />
            <span>Coordinació clínica prioritària</span>
          </div>
        </GlassCard>
      </div>

      {/* Navegació de Sub-pestanyes */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('EXPEDIENTS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'EXPEDIENTS'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <FileText size={14} />
          <span>Expedients & Barem BVD</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{expedients.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SAD_TELEASSISTENCIA')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'SAD_TELEASSISTENCIA'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Home size={14} />
          <span>Gestió SAD & Teleassistència</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INTEROPERABILITAT')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'INTEROPERABILITAT'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Activity size={14} />
          <span>Interoperabilitat CAP & Creu Roja</span>
        </button>
      </div>

      {/* VISTA 1: EXPEDIENTS I BAREM BVD */}
      {activeTab === 'EXPEDIENTS' && (
        <div className="space-y-4">
          {/* Barra de Filtratge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cercar per ciutadà, DNI, expedient o barri..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">Filtrar per Grau:</span>
              <select
                value={filterGrau}
                onChange={e => setFilterGrau(e.target.value)}
                aria-label="Filtrar expedients de dependència per grau"
                className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-400"
              >
                <option value="TOTS">Tots els Graus</option>
                <option value="GRAU_III_GRAN_DEPENDENCIA">Grau III · Gran Dependència</option>
                <option value="GRAU_II_SEVERA">Grau II · Severa</option>
                <option value="GRAU_I_MODERADA">Grau I · Moderada</option>
                <option value="SENSE_GRAU">Sense Grau Reconegut</option>
              </select>
            </div>
          </div>

          {/* Llistat d'Expedients en Graella */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredExpedients.map(exp => {
              const grauColors = {
                GRAU_III_GRAN_DEPENDENCIA: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
                GRAU_II_SEVERA: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                GRAU_I_MODERADA: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
                SENSE_GRAU: 'border-slate-500/40 bg-slate-950/20 text-slate-300'
              };

              const estatPiaBadge = {
                APROVAT_VIGENT: { label: 'PIA Aprovat', variant: 'emerald' as const },
                EN_TRAMITACIO: { label: 'PIA en Tràmit', variant: 'blue' as const },
                EN_REVISIO: { label: 'PIA en Revisió', variant: 'amber' as const },
                PENDENT_VALORACIO: { label: 'Pendent BVD', variant: 'rose' as const }
              };

              return (
                <GlassCard
                  key={exp.id}
                  variant="interactive"
                  glowColor="purple"
                  className="p-4 sm:p-5 flex flex-col justify-between"
                  onClick={() => setSelectedExpedient(exp)}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                            {exp.codiExpedient}
                          </span>
                          <GlassBadge variant={estatPiaBadge[exp.estatPia].variant}>
                            {estatPiaBadge[exp.estatPia].label}
                          </GlassBadge>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1.5">{exp.ciutadaNom}</h3>
                        <p className="text-xs text-slate-400">
                          DNI: {exp.ciutadaDni} · {exp.edat} anys · Barri {exp.barri}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${grauColors[exp.grau]}`}>
                          BVD: {exp.puntuacioBVD}/100
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                          {exp.grau.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Recursos Assignats */}
                    <div className="my-3 p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Home size={13} className="text-blue-400" />
                          Servei d'Atenció Domiciliària (SAD):
                        </span>
                        <span className="font-bold text-white">{exp.recursosAssignats.sadHoresSetmana} h / setmana</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <PhoneCall size={13} className="text-emerald-400" />
                          Teleassistència Domiciliària:
                        </span>
                        <span className="font-bold text-emerald-300">
                          {exp.recursosAssignats.teleassistencia
                            ? (exp.recursosAssignats.teleassistenciaTipus === 'AVANCADA_PERIFERICS' ? 'Avançada (Perifèrics)' : 'Bàsica 24/7')
                            : 'No sol·licitada'}
                        </span>
                      </div>

                      {exp.recursosAssignats.ajudesTecniquesSollicitades.length > 0 && (
                        <div className="pt-1.5 border-t border-white/5">
                          <span className="text-[11px] text-slate-400 block mb-1">Ajudes Tècniques Vinculades:</span>
                          <div className="flex flex-wrap gap-1">
                            {exp.recursosAssignats.ajudesTecniquesSollicitades.map((ajuda, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-200 border border-purple-500/20 text-[10px] font-medium">
                                {ajuda}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Referent: {exp.treballadorSocial}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExpedient(exp);
                      }}
                      className="text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1"
                    >
                      <span>Veure Detall & PIA</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 2: GESTIO SAD & TELEASSISTENCIA */}
      {activeTab === 'SAD_TELEASSISTENCIA' && (
        <GlassCard variant="solid" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Home size={18} className="text-blue-400" />
                Planificació del Servei d'Atenció Domiciliària (SAD) i Teleassistència
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assignació horària de treballadors familiars, neteja de la llar i sensors biomètrics a domicili.
              </p>
            </div>
            <GlassBadge variant="blue">Total: {totalSADHores} hores / setmana</GlassBadge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-black/40 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Expedient & Ciutadà</th>
                  <th className="py-2.5 px-3">Grau Dependència</th>
                  <th className="py-2.5 px-3">Hores SAD</th>
                  <th className="py-2.5 px-3">Teleassistència</th>
                  <th className="py-2.5 px-3">Prestació Econòmica</th>
                  <th className="py-2.5 px-3">Accions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expedients.map(exp => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-white block">{exp.ciutadaNom}</span>
                      <span className="text-[10px] text-purple-300 font-mono">{exp.codiExpedient}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10">
                        {exp.grau.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {exp.recursosAssignats.sadHoresSetmana} h/setm.
                    </td>
                    <td className="py-2.5 px-3">
                      {exp.recursosAssignats.teleassistencia ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {exp.recursosAssignats.teleassistenciaTipus === 'AVANCADA_PERIFERICS' ? 'Avançada' : 'Bàsica'}
                        </span>
                      ) : (
                        <span className="text-slate-500">Sense servei</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">
                      {exp.recursosAssignats.prestacioEconomicaCuidador ? `${exp.recursosAssignats.prestacioEconomicaCuidador.toFixed(2)} €/m` : '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => setSelectedExpedient(exp)}
                        className="text-purple-300 hover:text-white font-bold text-[11px]"
                      >
                        Ajustar Rangs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* VISTA 3: INTEROPERABILITAT AMB CAP I CREU ROJA */}
      {activeTab === 'INTEROPERABILITAT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard variant="glow" glowColor="emerald" className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Canal Clínic: CAP Sant Ildefons (ICS)</h3>
                <p className="text-xs text-slate-400">Intercanvi bidireccional d'informes de salut i escala Barthel</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La valoració BVD de Serveis Socials es complementa automàticament amb la prescripció mèdica d'ortopèdia emesa pels facultatius del CAP (Dr. Jaume Gutiérrez). Això garanteix que cap expedient pateixi demores burocràtiques.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={13} /> Interoperabilitat HL7 / FHIR Activa
              </span>
              <span className="text-slate-400">Latència: &lt; 14ms</span>
            </div>
          </GlassCard>

          <GlassCard variant="glow" glowColor="rose" className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400/40 flex items-center justify-center text-rose-300">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Canal Tècnic: Taller Creu Roja</h3>
                <p className="text-xs text-slate-400">Comanda directa d'ajudes tècniques prescrites al PIA</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quan un PIA s'aprova amb ajudes tècniques (llits articulats, grues, cadires), la sol·licitud entra immediatament a la cua de recondicionament del Taller de Creu Roja (Albert Puig i Carles Miralles) per a la seva desinfecció i instal·lació a domicili.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={13} /> Sincronització en Temps Real
              </span>
              <span className="text-slate-400">Taller Cornellà actiu</span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* MODAL DETALL D'EXPEDIENT I PIA */}
      {selectedExpedient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/30">
                    {selectedExpedient.codiExpedient}
                  </span>
                  <GlassBadge variant={selectedExpedient.estatPia === 'APROVAT_VIGENT' ? 'emerald' : 'blue'}>
                    {selectedExpedient.estatPia.replace(/_/g, ' ')}
                  </GlassBadge>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{selectedExpedient.ciutadaNom}</h3>
                <p className="text-xs text-slate-400">DNI: {selectedExpedient.ciutadaDni} · {selectedExpedient.adreca}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpedient(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Barem BVD Detall */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 block">Puntuació Barem BVD:</span>
                <span className="text-lg font-black text-white">{selectedExpedient.puntuacioBVD} / 100 punts</span>
                <span className="text-[10px] text-purple-300 block">Escala reglamentària de 64 punts</span>
              </div>
              <div>
                <span className="text-slate-400 block">Grau de Dependència:</span>
                <span className="text-sm font-bold text-amber-300 block">{selectedExpedient.grau.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-slate-400">Aprovat per resolució institucional</span>
              </div>
            </div>

            {/* Contingut del PIA */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 size={14} className="text-emerald-400" />
                Programa Individual d'Atenció (PIA)
              </h4>

              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Hores de SAD aprovades:</span>
                  <span className="font-bold text-white">{selectedExpedient.recursosAssignats.sadHoresSetmana} hores / setmana</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Servei de Teleassistència:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedExpedient.recursosAssignats.teleassistencia ? 'Actiu (Connexió 24h)' : 'No assignat'}
                  </span>
                </div>
                {selectedExpedient.recursosAssignats.prestacioEconomicaCuidador && (
                  <div className="flex justify-between text-slate-300">
                    <span>Prestació econòmica cuidador no professional:</span>
                    <span className="font-bold text-purple-300">{selectedExpedient.recursosAssignats.prestacioEconomicaCuidador.toFixed(2)} € / mes</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-slate-400 block mb-1">Ajudes tècniques d'ortopèdia aprovades:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExpedient.recursosAssignats.ajudesTecniquesSollicitades.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-400/30 text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Observacions */}
            <div className="text-xs">
              <span className="text-slate-400 block mb-1 font-semibold">Observacions i Valoració Social:</span>
              <p className="p-3 rounded-xl bg-black/40 border border-white/5 text-slate-300 leading-relaxed">
                {selectedExpedient.observacions}
              </p>
            </div>

            {/* Botons d'acció */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-[11px] text-slate-500">
                Darrera actualització: {selectedExpedient.darreraActualitzacio}
              </span>
              <div className="flex items-center gap-2">
                {selectedExpedient.estatPia !== 'APROVAT_VIGENT' && (
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleAprovarPia(selectedExpedient.id)}
                    icon={<CheckCircle2 size={14} />}
                  >
                    Aprovar PIA Oficialment
                  </GlassButton>
                )}
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedExpedient(null)}
                >
                  Tancar
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREACIÓ NOU EXPEDIENT */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleCrearExpedient}
            className="w-full max-w-lg bg-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle size={18} className="text-purple-400" />
                Alta de Nou Expedient de Dependència & BVD
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nom i Cognoms del Ciutadà:</label>
                <input
                  type="text"
                  required
                  value={newNom}
                  onChange={e => setNewNom(e.target.value)}
                  placeholder="Ex: Pere Martí i Font"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">DNI / NIE:</label>
                  <input
                    type="text"
                    required
                    value={newDni}
                    onChange={e => setNewDni(e.target.value)}
                    placeholder="Ex: 48956602Z"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white uppercase focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Edat:</label>
                  <input
                    type="number"
                    value={newEdat}
                    onChange={e => setNewEdat(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Adreça:</label>
                  <input
                    type="text"
                    value={newAdreca}
                    onChange={e => setNewAdreca(e.target.value)}
                    placeholder="Ex: Carrer Miranda, 10"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Barri:</label>
                  <select
                    value={newBarri}
                    onChange={e => setNewBarri(e.target.value)}
                    aria-label="Seleccionar barri del municipi"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Sant Ildefons">Sant Ildefons</option>
                    <option value="Almeda">Almeda</option>
                    <option value="El Pedró">El Pedró</option>
                    <option value="Fontsanta-Fatjó">Fontsanta-Fatjó</option>
                    <option value="Centre">Centre</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Puntuació Barem BVD (0 a 100):</label>
                  <span className="font-bold text-white font-mono">{newBvd} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newBvd}
                  onChange={e => setNewBvd(Number(e.target.value))}
                  aria-label="Puntuació Barem BVD de 0 a 100"
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="text-[11px] text-purple-300 font-medium">
                  Grau Resultant: <span className="font-bold text-white">{calcularGrau(newBvd).replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Hores SAD / setmana:</label>
                  <input
                    type="number"
                    value={newSadHores}
                    onChange={e => setNewSadHores(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="chk-teleassistencia"
                    checked={newTeleassistencia}
                    onChange={e => setNewTeleassistencia(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                  <label htmlFor="chk-teleassistencia" className="text-slate-300 font-semibold cursor-pointer">
                    Teleassistència 24h
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Ajudes Tècniques Prescrites (separades per coma):</label>
                <input
                  type="text"
                  value={newAjudes}
                  onChange={e => setNewAjudes(e.target.value)}
                  placeholder="Ex: Caminador 4 Rodes, Cadira de Dutxa"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <GlassButton variant="secondary" size="sm" type="button" onClick={() => setIsNewModalOpen(false)}>
                Cancel·lar
              </GlassButton>
              <GlassButton variant="primary" size="sm" type="submit" icon={<Send size={14} />}>
                Registrar Expedient
              </GlassButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
