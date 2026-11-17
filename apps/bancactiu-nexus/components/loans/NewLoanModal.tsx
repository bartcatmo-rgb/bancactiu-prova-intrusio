'use client';

import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  User,
  Phone,
  CreditCard,
  QrCode,
  Calendar,
  Building2,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';

export interface NewLoanData {
  id: string;
  expedient: string;
  ciutada: string;
  dniCip: string;
  telefon: string;
  material: string;
  codiQR: string;
  centreOrigen: string;
  dataInici: string;
  retorn: string;
  estat: 'LLIURAT_ACTIU' | 'RETORNAT' | 'PENDENT_TALLER';
  observacions?: string;
  signaturaDigitalIdCat: boolean;
}

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated: (loan: NewLoanData) => void;
  defaultCentre?: string;
}

const MATERIALS_CATALOG = [
  { id: 'CR-ALUMINI', nom: 'Cadira de Rodes Autopropulsable Alumini', prefix: 'QR-CR' },
  { id: 'CR-TRANSIT', nom: 'Cadira de Rodes de Trànsit / Acompanyant', prefix: 'QR-CRT' },
  { id: 'CAM-4RODES', nom: 'Caminador 4 Rodes amb Fre i Seient', prefix: 'QR-CAM' },
  { id: 'CAM-2RODES', nom: 'Caminador 2 Rodes Anterior', prefix: 'QR-CA2' },
  { id: 'BASTONS-ANG', nom: 'Parell de Bastons Anglesos Antilliscants (Crosses)', prefix: 'QR-BST' },
  { id: 'LLIT-ARTICULAT', nom: 'Llit Articulat Elèctric amb Carro Elevador', prefix: 'QR-LLIT' },
  { id: 'GRUA-TRANSFER', nom: 'Grua de Transferència Mèdica Hospitalària (150 kg)', prefix: 'QR-GRU' },
  { id: 'MATALAS-ANTIESCARES', nom: 'Matalàs Antiescares amb Compressor Dinàmic', prefix: 'QR-MAT' },
];

const CENTRES_CATALOG = [
  'CAP Sant Ildefons (Cornellà de Llobregat)',
  'CAP Just Oliveras (L\'Hospitalet)',
  'CAP Can Bou (Castelldefels)',
  'CAP Bellvitge (L\'Hospitalet)',
  'Creu Roja Baix Llobregat (Cornellà)',
  'Unitat Atenció Ciutadana (UAC Cornellà)',
  'Institut Esteve Terrades i Illa (Laboratori Dual)',
];

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  onClose,
  onLoanCreated,
  defaultCentre = 'CAP Sant Ildefons (Cornellà de Llobregat)',
}) => {
  const [ciutada, setCiutada] = useState('');
  const [dniCip, setDniCip] = useState('');
  const [telefon, setTelefon] = useState('');
  const [material, setMaterial] = useState(MATERIALS_CATALOG[0].nom);
  const [centreOrigen, setCentreOrigen] = useState(defaultCentre);
  const [dataInici, setDataInici] = useState(new Date().toISOString().split('T')[0]);
  
  // Data de retorn per defecte: +60 dies
  const defaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  };
  const [retorn, setRetorn] = useState(defaultReturnDate());

  // Generació automàtica del codi QR i número d'expedient
  const [codiQR, setCodiQR] = useState(() => `QR-CR-${Math.floor(100 + Math.random() * 900)}`);
  const [observacions, setObservacions] = useState('');
  const [signaturaIdCat, setSignaturaIdCat] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Actualitzar codi QR quan canvia el material
  const handleMaterialChange = (selectedNom: string) => {
    setMaterial(selectedNom);
    const item = MATERIALS_CATALOG.find(m => m.nom === selectedNom);
    const prefix = item ? item.prefix : 'QR-MAT';
    setCodiQR(`${prefix}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleQuickDuration = (days: number) => {
    const start = new Date(dataInici);
    start.setDate(start.getDate() + days);
    setRetorn(start.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciutada.trim()) {
      setErrorMsg('Si us plau, introdueix el nom complet del ciutadà beneficiari.');
      return;
    }
    if (!dniCip.trim()) {
      setErrorMsg('El DNI o CIP de CatSalut és obligatori per a la traçabilitat clínica.');
      return;
    }

    const newLoan: NewLoanData = {
      id: `op-${Date.now()}`,
      expedient: `BA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ciutada: ciutada.trim(),
      dniCip: dniCip.trim().toUpperCase(),
      telefon: telefon.trim() || '600 000 000',
      material,
      codiQR,
      centreOrigen,
      dataInici,
      retorn,
      estat: 'LLIURAT_ACTIU',
      observacions: observacions.trim(),
      signaturaDigitalIdCat: signaturaIdCat,
    };

    onLoanCreated(newLoan);
    onClose();

    // Reset formulari
    setCiutada('');
    setDniCip('');
    setTelefon('');
    setObservacions('');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-900 relative">
        {/* Botó de tancament */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          aria-label="Tancar formulari"
        >
          <X size={18} />
        </button>

        {/* Capçalera del Modal */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Alta de Nou Préstec d'Ortopèdia Comunitària
              </h2>
              <GlassBadge variant="blue">Core Operatiu</GlassBadge>
            </div>
            <p className="text-xs text-slate-500">
              Registre de lliurament immediat amb traçabilitat per codi QR i consentiment digital.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" autoCapitalize="off" spellCheck={false} data-lpignore="true" className="space-y-4">
          {/* Secció 1: Dades del Beneficiari */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} /> 1. Dades del Ciutadà / Beneficiari
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nom i Cognoms *
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mercè Rodoreda Gurgui"
                    value={ciutada}
                    onChange={(e) => setCiutada(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  DNI / NIE o CIP CatSalut *
                </label>
                <div className="relative">
                  <CreditCard size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: 47891234X / RODO0230491"
                    value={dniCip}
                    onChange={(e) => setDniCip(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Telèfon de Contacte
                </label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Ex: 612 345 678"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secció 2: Material i Identificador QR */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode size={14} /> 2. Material Sol·licitat i Identificador d'Estoc
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tipus de Material Ortopèdic *
                </label>
                <select
                  value={material}
                  onChange={(e) => handleMaterialChange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {MATERIALS_CATALOG.map((mat) => (
                    <option key={mat.id} value={mat.nom}>
                      {mat.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Identificador QR / Codi de Barres
                </label>
                <div className="relative">
                  <QrCode size={13} className="absolute left-3 top-2.5 text-cyan-600" />
                  <input
                    type="text"
                    value={codiQR}
                    onChange={(e) => setCodiQR(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-cyan-400 rounded-xl text-xs font-mono font-bold text-cyan-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Centre d'Origen / CAP Prescriptor
                </label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={centreOrigen}
                    onChange={(e) => setCentreOrigen(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {CENTRES_CATALOG.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Secció 3: Dates i Terminis */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} /> 3. Període de Préstec
              </h3>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-500 font-medium">Ràpid:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDuration(30)}
                  className="px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold transition"
                >
                  30d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDuration(60)}
                  className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold border border-cyan-300 transition"
                >
                  60d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDuration(90)}
                  className="px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold transition"
                >
                  90d
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Data d'Inici (Lliurament)
                </label>
                <input
                  type="date"
                  value={dataInici}
                  onChange={(e) => setDataInici(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Data Prevista de Retorn
                </label>
                <input
                  type="date"
                  value={retorn}
                  onChange={(e) => setRetorn(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-cyan-400 rounded-xl text-xs text-cyan-800 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Observacions / Indicacions Clíniques (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pacient intervingut de pròtesi de maluc al mes de novembre. Es programa revisió de seguretat a les 4 setmanes."
                  value={observacions}
                  onChange={(e) => setObservacions(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Secció 4: Consentiment i idCAT Mòbil */}
          <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="idcat-check"
              checked={signaturaIdCat}
              onChange={(e) => setSignaturaIdCat(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="idcat-check" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold text-slate-900">Verificació d'Identitat i idCAT Mòbil / Signatura Digital</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                El ciutadà accepta expressament les condicions de custòdia responsable del material ortopèdic i el tractament de dades sota RGPD i ENS Nivell Alt.
              </p>
            </label>
          </div>

          {/* Accions del Modal */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel·lar
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              icon={<CheckCircle2 size={16} />}
            >
              Confirmar i Lliurar Préstec
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
};
