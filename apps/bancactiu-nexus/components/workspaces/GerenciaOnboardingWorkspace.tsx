'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast, ToastContainer } from './ToastNotification';
import { searchPredictiveCentresICS } from '@/lib/seedCentresICS';
import type { CentreSanitari } from '@/types/salut';

interface GerenciaOnboardingWorkspaceProps {
  onClose: () => void;
  currentUser?: {
    dni?: string;
    role?: string;
    name?: string;
    ambitTerritorial?: string;
    workplace?: string;
  };
}

interface AdheredCentreRecord {
  codiRecss: string;
  nom: string;
  municipi: string;
  tipus: string;
  directorDni: string;
  directorNom: string;
  dataAdhesio: string;
}

export const GerenciaOnboardingWorkspace: React.FC<GerenciaOnboardingWorkspaceProps> = ({
  onClose,
  currentUser,
}) => {
  const { toasts, addToast, removeToast } = useToast();

  // Determinació de l'àmbit territorial exclusiu
  const territorialGerencia = useMemo(() => {
    const raw = currentUser?.ambitTerritorial || currentUser?.workplace || 'Girona';
    if (raw.toLowerCase().includes('barcelona') || raw.toLowerCase().includes('ciutat')) {
      return { id: 'GT_BCN_CIUTAT', nom: 'Gerència Territorial Barcelona Ciutat', zona: 'Barcelona Ciutat' };
    }
    if (raw.toLowerCase().includes('sud')) {
      return { id: 'GT_METRO_SUD', nom: 'Gerència Territorial Barcelona Metropolitana Sud', zona: 'Barcelona Metropolitana Sud' };
    }
    if (raw.toLowerCase().includes('nord')) {
      return { id: 'GT_METRO_NORD', nom: 'Gerència Territorial Barcelona Metropolitana Nord', zona: 'Barcelona Metropolitana Nord' };
    }
    if (raw.toLowerCase().includes('tarragona')) {
      return { id: 'GT_CAMP_TARRAGONA', nom: 'Gerència Territorial Camp de Tarragona', zona: 'Camp de Tarragona' };
    }
    if (raw.toLowerCase().includes('lleida')) {
      return { id: 'GT_LLEIDA', nom: 'Gerència Territorial de Lleida', zona: 'Lleida' };
    }
    if (raw.toLowerCase().includes('central')) {
      return { id: 'GT_CAT_CENTRAL', nom: 'Gerència Territorial Catalunya Central', zona: 'Catalunya Central' };
    }
    return { id: 'GT_METRO_SUD', nom: "Gerència d'Atenció Primària i Comunitària (GAPIC) - Metropolitana Sud", zona: 'Barcelona Metropolitana Sud - Cornellà' };
  }, [currentUser]);

  // Cerca Dades Obertes (Socrata)
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CentreSanitari[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<CentreSanitari | null>(null);

  // Formulari Direcció CAP
  const [directorDni, setDirectorDni] = useState('');
  const [directorNom, setDirectorNom] = useState('');
  const [directorCognoms, setDirectorCognoms] = useState('');
  const [directorEmail, setDirectorEmail] = useState('');
  const [directorTelefon, setDirectorTelefon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llistat de centres ja adherits a la seva gerència
  
  // Modal d'alta manual descentralitzada de centre per part de la gerència
  const [isManualCreateModalOpen, setIsManualCreateModalOpen] = useState(false);
  const [manualCodiRecss, setManualCodiRecss] = useState('');
  const [manualNom, setManualNom] = useState('');
  const [manualTipus, setManualTipus] = useState<'CAP' | 'CUAP' | 'CL' | 'ADMIN'>('CAP');
  const [manualAdreca, setManualAdreca] = useState('');
  const [manualMunicipi, setManualMunicipi] = useState('');
  const [manualSector, setManualSector] = useState('');

  // Modal d'edició de centre existent
  const [editingCentre, setEditingCentre] = useState<AdheredCentreRecord | null>(null);
  const [editNom, setEditNom] = useState('');
  const [editAdreca, setEditAdreca] = useState('');
  const [editMunicipi, setEditMunicipi] = useState('');
  const [editEstatOperatiu, setEditEstatOperatiu] = useState<'OPERATIU' | 'REFORMA' | 'INACTIU'>('OPERATIU');

  const [adheredCentres, setAdheredCentres] = useState<AdheredCentreRecord[]>([
    {
      codiRecss: 'CAP-JAUME-SOLER',
      nom: 'CAP Jaume Soler',
      municipi: 'Cornellà de Llobregat',
      tipus: 'CAP Principal',
      directorDni: '33221100P',
      directorNom: 'Dra. Montserrat Soler',
      dataAdhesio: '2026-02-01',
    },
    {
      codiRecss: 'CAP-SANT-ILDEFONS',
      nom: 'CAP Sant Ildefons',
      municipi: 'Cornellà de Llobregat',
      tipus: 'CAP Principal',
      directorDni: '22222222J',
      directorNom: 'Direcció Mèdica CAP Sant Ildefons',
      dataAdhesio: '2026-01-10',
    },
    {
      codiRecss: 'CAP-MARTI-JULIA',
      nom: 'CAP Martí Julià',
      municipi: 'Cornellà de Llobregat',
      tipus: 'CAP Principal',
      directorDni: '11111111H',
      directorNom: 'Direcció GAPIC Metro Sud',
      dataAdhesio: '2026-01-10',
    },
    {
      codiRecss: 'CUAP-CORNELLA',
      nom: 'CUAP Cornellà',
      municipi: 'Cornellà de Llobregat',
      tipus: 'CUAP',
      directorDni: '11111111H',
      directorNom: 'Direcció GAPIC Metro Sud',
      dataAdhesio: '2026-01-10',
    },
  ]);

  // Tecla ESC per sortir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Cerca de centres a Dades Obertes / Socrata limitada a la zona de la gerència
  
  // Alta manual d'un nou centre per la Gerència
  const handleManualCreateCentre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodiRecss || !manualNom) {
      addToast('error', 'Camps requerits', 'Indiqueu el Codi RECSS i el Nom del centre.');
      return;
    }

    try {
      const payload = {
        codiRecss: manualCodiRecss.trim().toUpperCase(),
        nom: manualNom.trim(),
        tipus: manualTipus === 'ADMIN' ? 'CAP' : manualTipus,
        gapicId: territorialGerencia.zona,
        sectorId: manualSector.trim() || 'SEC_CENTRAL',
        adreca: manualAdreca.trim() || 'Adreça corporativa s/n',
        municipi: manualMunicipi.trim() || territorialGerencia.zona,
        estatOperatiu: 'OPERATIU',
        estatConveni: 'ACTIU_PILOT',
        faseDesplegament: 2,
        actorDni: currentUser?.dni || '47896521A',
      };

      const res = await fetch('/api/centres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
          'x-user-dni': currentUser?.dni || '47896521A',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast('success', 'Centre donat d\'alta', `S'ha donat d'alta el centre "${payload.nom}" a la Gerència.`);
        setAdheredCentres((prev) => [
          {
            codiRecss: payload.codiRecss,
            nom: payload.nom,
            municipi: payload.municipi,
            tipus: manualTipus,
            directorDni: currentUser?.dni || '11111111H',
            directorNom: currentUser?.name || 'Direcció Gerència',
            dataAdhesio: new Date().toISOString().split('T')[0],
          },
          ...prev,
        ]);
        setIsManualCreateModalOpen(false);
        setManualCodiRecss('');
        setManualNom('');
        setManualAdreca('');
        setManualMunicipi('');
      } else {
        const err = await res.json();
        addToast('error', 'Error en l\'alta', err.missatge || 'No s\'ha pogut registrar el centre.');
      }
    } catch {
      addToast('error', 'Error de xarxa', 'No s\'ha pogut contactar amb el servidor.');
    }
  };

  // Edició de dades d'un centre
  const handleOpenEditCentre = (c: AdheredCentreRecord) => {
    setEditingCentre(c);
    setEditNom(c.nom);
    setEditMunicipi(c.municipi);
    setEditAdreca('Adreça de referència');
    setEditEstatOperatiu('OPERATIU');
  };

  const handleSaveEditCentre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCentre) return;

    try {
      const res = await fetch('/api/centres', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
          'x-user-dni': currentUser?.dni || '47896521A',
        },
        body: JSON.stringify({
          codiRecss: editingCentre.codiRecss,
          nom: editNom.trim(),
          municipi: editMunicipi.trim(),
          adreca: editAdreca.trim(),
          estatOperatiu: editEstatOperatiu,
        }),
      });

      if (res.ok) {
        addToast('success', 'Centre actualitzat', `El centre ${editingCentre.codiRecss} ha estat actualitzat.`);
        setAdheredCentres((prev) =>
          prev.map((c) =>
            c.codiRecss === editingCentre.codiRecss
              ? { ...c, nom: editNom.trim(), municipi: editMunicipi.trim() }
              : c
          )
        );
        setEditingCentre(null);
      } else {
        const err = await res.json();
        addToast('error', 'Error actualitzant', err.missatge || 'No s\'ha pogut desar el canvi.');
      }
    } catch {
      addToast('error', 'Error de connexió', 'No s\'ha pogut contactar amb el servidor.');
    }
  };

  // Donar de baixa
  const handleDeactivateCentre = async (codiRecss: string) => {
    if (!confirm(`Segur que voleu donar de baixa el centre ${codiRecss} de la Gerència?`)) return;

    try {
      const res = await fetch(`/api/centres?codiRecss=${encodeURIComponent(codiRecss)}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
        },
      });

      if (res.ok) {
        addToast('info', 'Centre desactivat', `El centre ${codiRecss} ha passat a estat inactiu.`);
        setAdheredCentres((prev) => prev.filter((c) => c.codiRecss !== codiRecss));
      }
    } catch {
      addToast('error', 'Error desactivant', 'No s\'ha pogut processar la baixa.');
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchTerm(query);
    const clean = query.trim().toLowerCase();
    if (!clean || clean.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // 1. Cercar a l'API oficial de centres del servidor
      const res = await fetch(`/api/centres?q=${encodeURIComponent(clean)}`, {
        headers: {
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
          'x-user-dni': currentUser?.dni || '47896521A',
        },
      });

      let found: CentreSanitari[] = [];

      if (res.ok) {
        const data = await res.json();
        if (data.centres && Array.isArray(data.centres)) {
          found = data.centres.map((c: any) => ({
            id: c.codiRecss,
            codiRecss: c.codiRecss,
            nom: c.nom,
            tipus: c.tipus || 'CAP Principal',
            estat: 'Actiu',
            absId: c.absId || '',
            absNom: '',
            sectorId: c.sectorId || '',
            sectorNom: '',
            gerenciaId: territorialGerencia.id,
            gerenciaNom: territorialGerencia.nom,
            regioId: '',
            regioNom: territorialGerencia.zona as any,
            municipi: c.municipi,
            adreca: c.adreca,
          }));
        }
      }

      // Si no hi ha resultats a l'API o per garantir cobertura local (USB), complementem amb el cens ICS
      if (found.length === 0) {
        const localMatches = searchPredictiveCentresICS(clean, 10);
        found = localMatches.map((c) => ({
          ...c,
          gerenciaId: territorialGerencia.id,
          gerenciaNom: territorialGerencia.nom,
        }));
      }

      setSearchResults(found);
    } catch {
      // Fallback robust a la base de dades local de centres
      const localMatches = searchPredictiveCentresICS(clean, 10);
      setSearchResults(localMatches);
    } finally {
      setIsSearching(false);
    }
  }, [currentUser?.dni, territorialGerencia]);

  // Confirmar selecció de centre
  const handleSelectCentre = (centre: CentreSanitari) => {
    setSelectedCentre(centre);
    // Suggerir email del centre
    const slug = centre.nom.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12);
    setDirectorEmail(`direccio.${slug}@salut.cat`);
    addToast('info', 'Centre seleccionat', `Heu seleccionat "${centre.nom}". Completeu les dades de Direcció.`);
  };

  // Enviar formulari: Adhesió de Centre + Alta Direcció CAP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCentre) {
      addToast('warning', 'Cap centre seleccionat', 'Heu de triar un equipament sanitari a la cerca.');
      return;
    }

    if (!directorDni.trim() || !directorNom.trim()) {
      addToast('error', 'Camps requerits', 'Indiqueu el DNI i el Nom de la persona que exercirà la Direcció.');
      return;
    }

    const cleanDni = directorDni.trim().toUpperCase();
    const dniRegex = /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/;
    if (!dniRegex.test(cleanDni)) {
      addToast('warning', 'Format DNI/NIE invàlid', 'El DNI o NIE ha de tenir 8 dígits i una lletra.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Assegurar registre / adhesió del centre a /api/centres
      const centrePayload = {
        codiRecss: selectedCentre.codiRecss,
        nom: selectedCentre.nom,
        tipus: selectedCentre.tipus === 'CUAP' ? 'CUAP' : 'CAP',
        gapicId: territorialGerencia.zona,
        sectorId: selectedCentre.sectorId || 'SEC_CENTRAL',
        absId: selectedCentre.absId || 'ABS_01',
        adreca: selectedCentre.adreca || 'Carrer Major s/n',
        municipi: selectedCentre.municipi || territorialGerencia.zona,
        estatOperatiu: 'OPERATIU',
        estatConveni: 'ACTIU_PILOT',
        faseDesplegament: 1,
        actorDni: currentUser?.dni || '47896521A',
      };

      await fetch('/api/centres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
          'x-user-dni': currentUser?.dni || '47896521A',
        },
        body: JSON.stringify(centrePayload),
      });

      // 2. Donar d'alta l'usuari DIRECCIO_CAP
      const userPayload = {
        dni: cleanDni,
        nom: directorNom.trim(),
        cognoms: directorCognoms.trim() || 'Direcció EAP',
        rol: 'DIRECCIO_CAP',
        centreId: selectedCentre.codiRecss,
        ambitTerritorial: territorialGerencia.zona,
        permisosGranulars: ['ADMIN_PAO', 'GESTIO_PERSONAL_CENTRE', 'DISPENSACIO_PAO', 'CONSULTA_CENS'],
        password: '1234',
        actorDni: currentUser?.dni || '47896521A',
      };

      const userRes = await fetch('/api/usuaris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'GERENCIA_TERRITORIAL',
          'x-user-territori': territorialGerencia.zona,
          'x-user-dni': currentUser?.dni || '47896521A',
        },
        body: JSON.stringify(userPayload),
      });

      if (userRes.ok) {
        addToast(
          'success',
          'Centre adherit i Direcció donada d’alta',
          `El centre "${selectedCentre.nom}" ha quedat adherit i s'ha creat l'usuari DIRECCIO_CAP per a ${cleanDni}.`
        );

        // Afegir a la llista d'adherits local
        const newRecord: AdheredCentreRecord = {
          codiRecss: selectedCentre.codiRecss,
          nom: selectedCentre.nom,
          municipi: selectedCentre.municipi,
          tipus: selectedCentre.tipus,
          directorDni: cleanDni,
          directorNom: `${directorNom.trim()} ${directorCognoms.trim()}`.trim(),
          dataAdhesio: new Date().toISOString().split('T')[0],
        };
        setAdheredCentres((prev) => [newRecord, ...prev]);

        // Netejar
        setSelectedCentre(null);
        setDirectorDni('');
        setDirectorNom('');
        setDirectorCognoms('');
        setDirectorEmail('');
        setDirectorTelefon('');
        setSearchTerm('');
        setSearchResults([]);
      } else {
        const err = await userRes.json();
        addToast('error', 'Error en l’alta', err.missatge || 'No s’ha pogut crear l’usuari de Direcció.');
      }
    } catch (error) {
      console.error(error);
      addToast('error', 'Error de comunicació', 'No s’ha pogut connectar amb el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-800 flex flex-col overflow-y-auto custom-scrollbar font-sans">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* ===================================================================== */}
      {/* CAPÇALERA AMB IDENTITAT EXCLUSIVA DE LA GERÈNCIA                     */}
      {/* ===================================================================== */}
      <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer border border-slate-300/80 shadow-xs"
          >
            <span>← Tornar</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 border border-slate-300">
              ESC
            </kbd>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Espai d'Enfocament · Gerència Territorial
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Connexió a Dades Obertes Catalunya, Adhesió d'Equipaments i Alta de Direcció de CAP
            </p>
          </div>
        </div>

        {/* IDENTIFICADOR TERRITORIAL BLINDAT */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl">
          <span className="text-sm">📍</span>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Territori Exclusiu</div>
            <div className="text-xs font-bold text-blue-900">{territorialGerencia.nom}</div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* COS: CERCA SOCRATA + FORMULARI DIRECCIÓ + LLISTAT DE CENTRES          */}
      {/* ===================================================================== */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* CARD 1: CERCA A DADES OBERTES (SOCRATA / RECSS) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>📡</span> Connexió a Dades Obertes Catalunya (API Socrata · Cens RECSS)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cerca centres sanitaris oficials del vostre àmbit territorial per adherir-los al conveni del BancActiu.
                </p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                API Socrata Activa
              </span>
            </div>

            {/* BARRA DE CERCA */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => void handleSearch(e.target.value)}
                placeholder="Introduïu el nom del CAP, CUAP, municipi o codi RECSS (ex: Salt, Girona, C001)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* RESULTATS DE LA CERCA */}
            {isSearching && (
              <p className="text-xs text-slate-500 py-2 text-center animate-pulse">
                Consultant cens oficial de salut a la regió {territorialGerencia.zona}...
              </p>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchResults.map((c) => {
                  const isSelected = selectedCentre?.codiRecss === c.codiRecss;
                  return (
                    <div
                      key={c.codiRecss}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{c.nom}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                            {c.codiRecss}
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                            {c.tipus}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          📍 {c.municipi} · {c.adreca}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCentre(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ Seleccionat' : 'Adherir aquest Centre →'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CARD 2: FORMULARI D'ALTA DE DIRECCIÓ DE CAP (ES MOSTRA EN SELECCIONAR CENTRE) */}
          {selectedCentre && (
            <div className="bg-white rounded-2xl border-2 border-blue-300 shadow-md p-6 sm:p-7 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>👤</span> Alta de Direcció de CAP per a: <span className="text-blue-700">{selectedCentre.nom}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigna el càrrec de Direcció d'Equip d'Atenció Primària (DIRECCIO_CAP) al centre seleccionat.
                  </p>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded">
                  {selectedCentre.codiRecss}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      DNI / NIE de la Direcció *
                    </label>
                    <input
                      type="text"
                      value={directorDni}
                      onChange={(e) => setDirectorDni(e.target.value.toUpperCase())}
                      placeholder="Ex: 43218765K..."
                      maxLength={9}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={directorNom}
                      onChange={(e) => setDirectorNom(e.target.value)}
                      placeholder="Ex: Mireia, Joan..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cognoms
                    </label>
                    <input
                      type="text"
                      value={directorCognoms}
                      onChange={(e) => setDirectorCognoms(e.target.value)}
                      placeholder="Ex: Vidal Soler"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correu Electrònic Corporatiu
                    </label>
                    <input
                      type="email"
                      value={directorEmail}
                      onChange={(e) => setDirectorEmail(e.target.value)}
                      placeholder="direccio.cap@salut.cat"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telèfon Directe
                    </label>
                    <input
                      type="tel"
                      value={directorTelefon}
                      onChange={(e) => setDirectorTelefon(e.target.value)}
                      placeholder="Ex: 972234000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rol Assignat
                    </label>
                    <input
                      type="text"
                      value="DIRECCIO_CAP (Direcció Mèdica EAP)"
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCentre(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  >
                    Cancel·lar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirmant adhesió...' : 'Confirmar Adhesió del Centre i Crear Direcció'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CARD 3: LLISTAT DE CENTRES ADHERITS A LA GERÈNCIA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>🏥</span> Centres Adherits a la vostra Gerència ({adheredCentres.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Equipaments que ja operen sota el conveni de la xarxa BancActiu
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adheredCentres.map((centre) => (
                <div
                  key={centre.codiRecss}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{centre.nom}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      {centre.codiRecss}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] space-y-0.5">
                    <div>📍 Municipi: <span className="font-medium text-slate-700">{centre.municipi}</span> · Tipus: <span className="font-medium text-slate-700">{centre.tipus}</span></div>
                    <div>👤 Direcció: <span className="font-medium text-slate-800">{centre.directorNom} ({centre.directorDni})</span></div>
                    <div>📅 Data d'adhesió: <span className="text-slate-600">{centre.dataAdhesio}</span></div>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Actiu i Operatiu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
