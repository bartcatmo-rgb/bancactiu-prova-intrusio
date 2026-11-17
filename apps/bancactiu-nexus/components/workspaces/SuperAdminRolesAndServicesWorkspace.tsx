'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  Layers,
  Settings,
  Users,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Lock,
  Sparkles,
  Building2,
  Sliders,
  Check,
  ToggleLeft,
  ToggleRight,
  Briefcase
} from 'lucide-react';
import type { ManagedRole } from '@/types/demo-user';

interface SuperAdminRolesAndServicesWorkspaceProps {
  onClose: () => void;
  onShowToast?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  onRequestSensitiveAction?: (actionTitle: string, actionDescription: string, onAuthorized: () => void) => void;
}

export interface SystemServiceItem {
  id: string;
  nom: string;
  descripcio: string;
  categoria: 'SALUT' | 'COMUNITARI' | 'LOGISTICA' | 'SEGURETAT';
  estat: 'ACTIU' | 'EN_PROVES' | 'DESACTIVAT';
  entitatsAdherides: number;
}

export interface RolePermissionMatrixItem {
  rol: string;
  titol: string;
  ambit: 'SANITARI' | 'COMUNITARI' | 'GLOBAL' | 'LOGISTICA';
  descripcio: string;
  permisos: string[];
}

const DEFAULT_SERVICES: SystemServiceItem[] = [
  {
    id: 'SRV_DISPENSACIO_PAO',
    nom: 'Dispensació i Validació Mèdica PAO',
    descripcio: 'Prescripció clínica de material ortoprotèsic i validació mèdica CatSalut.',
    categoria: 'SALUT',
    estat: 'ACTIU',
    entitatsAdherides: 28,
  },
  {
    id: 'SRV_TALLER_LOGISTICA',
    nom: 'Logística de Taller Ortopèdic i Higienització',
    descripcio: 'Comandes de fabricació, reparació i traçabilitat d\'estocs a tallers.',
    categoria: 'LOGISTICA',
    estat: 'ACTIU',
    entitatsAdherides: 14,
  },
  {
    id: 'SRV_PRESTEC_AGIL',
    nom: 'Préstec Àgil Comunitari (Entitats Socials)',
    descripcio: 'Gestió de lliuraments immediats i suport domiciliari amb Creu Roja i AVV.',
    categoria: 'COMUNITARI',
    estat: 'ACTIU',
    entitatsAdherides: 42,
  },
  {
    id: 'SRV_ONBOARDING_IDP',
    nom: 'Passarel·la Multi-IdP (idCAT Mòbil / Cl@ve)',
    descripcio: 'Autenticació ciutadana i professional mitjançant passarel·la AOC i Red SARA.',
    categoria: 'SEGURETAT',
    estat: 'ACTIU',
    entitatsAdherides: 50,
  },
  {
    id: 'SRV_DADES_OBERTES',
    nom: 'Sincronització Dades Obertes Gencat (Cron 24h)',
    descripcio: 'Connexió diària amb els censos oficials RECSS i MUNICAT de la Generalitat.',
    categoria: 'SALUT',
    estat: 'ACTIU',
    entitatsAdherides: 9,
  },
  {
    id: 'SRV_AUDITORIA_RGPD',
    nom: 'Traçabilitat Forense i Auditoria RGPD',
    descripcio: 'Registre immutable d\'accessos i operacions sobre dades sanitàries protegides.',
    categoria: 'SEGURETAT',
    estat: 'ACTIU',
    entitatsAdherides: 50,
  },
  {
    id: 'SRV_EMERGENCIA_LOCKDOWN',
    nom: 'Blindatge Perimetral i Lockdown de Seguretat',
    descripcio: 'Protocol d\'aïllament davant atacs distribuïts i contingència dades sanitàries.',
    categoria: 'SEGURETAT',
    estat: 'ACTIU',
    entitatsAdherides: 50,
  },
];

const GRANULAR_PERMISSIONS = [
  { id: 'ACCES_TOTAL', label: 'Accés Total (SuperAdmin)' },
  { id: 'ADMIN_USUARIS', label: 'Gestió d\'Usuaris i Credencials' },
  { id: 'ADMIN_CENTRES', label: 'Alta i Edició de Centres Sanitaris' },
  { id: 'ADMIN_PAO', label: 'Gestió Integral Expedients PAO' },
  { id: 'ADMIN_ENTITATS', label: 'Gestió d\'Entitats Col·laboradores' },
  { id: 'DISPENSACIO_PAO', label: 'Dispensació i Lliurament d\'Actius' },
  { id: 'CONSULTA_CENS', label: 'Consulta Cens RECSS / Dades Obertes' },
  { id: 'PRESTEC_AGIL', label: 'Préstec Àgil Comunitari' },
  { id: 'COORDINACIO_COMUNITARIA', label: 'Coordinació Serveis Socials' },
  { id: 'GESTIO_TALLER', label: 'Ordres de Reparació a Taller' },
  { id: 'SIGNATURA_BIOMETRICA', label: 'Captura Signatura Digital / Wacom' },
  { id: 'AUDITORIA_SISTEMA', label: 'Consulta d\'Auditoria Forense' },
];

const DEFAULT_ROLES: RolePermissionMatrixItem[] = [
  {
    rol: 'SUPER_ADMIN',
    titol: 'Superadministrador TI Global',
    ambit: 'GLOBAL',
    descripcio: 'Govern corporatiu de tot el sistema, configuració de passarel·les i seguretat.',
    permisos: ['ACCES_TOTAL', 'ADMIN_USUARIS', 'ADMIN_CENTRES', 'ADMIN_PAO', 'ADMIN_ENTITATS', 'AUDITORIA_SISTEMA'],
  },
  {
    rol: 'GERENCIA_TERRITORIAL',
    titol: 'Gerència Territorial (GAPIC)',
    ambit: 'SANITARI',
    descripcio: 'Adhesió i alta descentralitzada de centres del territori, supervisió d\'expedients.',
    permisos: ['ADMIN_CENTRES', 'CONSULTA_CENS', 'ADMIN_PAO', 'AUDITORIA_SISTEMA'],
  },
  {
    rol: 'DIRECCIO_CAP',
    titol: 'Direcció Mèdica de CAP',
    ambit: 'SANITARI',
    descripcio: 'Validació clínica i govern del centre d\'atenció primària.',
    permisos: ['ADMIN_PAO', 'DISPENSACIO_PAO', 'CONSULTA_CENS'],
  },
  {
    rol: 'REFERENT_CAP',
    titol: 'Referent Social / Gestió CAP',
    ambit: 'SANITARI',
    descripcio: 'Tramitació directa amb pacients i derivació a la xarxa comunitària.',
    permisos: ['DISPENSACIO_PAO', 'PRESTEC_AGIL', 'CONSULTA_CENS', 'SIGNATURA_BIOMETRICA'],
  },
  {
    rol: 'ADMINISTRATIU_SANITARI',
    titol: 'Administratiu UAC / Admissió',
    ambit: 'SANITARI',
    descripcio: 'Atenció de taulell, recollida de documentació i recepció de material.',
    permisos: ['DISPENSACIO_PAO', 'SIGNATURA_BIOMETRICA', 'CONSULTA_CENS'],
  },
  {
    rol: 'COORDINADOR_LOCAL',
    titol: 'Coordinador Serveis Socials (Ajuntament)',
    ambit: 'COMUNITARI',
    descripcio: 'Articulació comunitària amb entitats locals de voluntariat.',
    permisos: ['COORDINACIO_COMUNITARIA', 'CONSULTA_CENS', 'ADMIN_ENTITATS'],
  },
  {
    rol: 'TECNIC_TALLER',
    titol: 'Tècnic de Taller Ortopèdic',
    ambit: 'LOGISTICA',
    descripcio: 'Fabricació a mida, reparació de xassís, higienització i control de qualitat.',
    permisos: ['GESTIO_TALLER', 'CONSULTA_CENS'],
  },
  {
    rol: 'VOLUNTARI_ENTITAT',
    titol: 'Voluntari d\'Entitat Col·laboradora',
    ambit: 'COMUNITARI',
    descripcio: 'Repartiment de cadires i crosses a domicili per a persones vulnerables.',
    permisos: ['PRESTEC_AGIL', 'SIGNATURA_BIOMETRICA'],
  },
];

export const SuperAdminRolesAndServicesWorkspace: React.FC<SuperAdminRolesAndServicesWorkspaceProps> = ({
  onClose,
  onShowToast,
  onRequestSensitiveAction,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'roles' | 'workplaces'>('roles');
  const [services, setServices] = useState<SystemServiceItem[]>(DEFAULT_SERVICES);
  const [roles, setRoles] = useState<RolePermissionMatrixItem[]>(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState<string>('SUPER_ADMIN');

  // Formulari de nou servei
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'SALUT' | 'COMUNITARI' | 'LOGISTICA' | 'SEGURETAT'>('SALUT');

  // Formulari de nou rol
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleAmbit, setNewRoleAmbit] = useState<'SANITARI' | 'COMUNITARI' | 'GLOBAL' | 'LOGISTICA'>('SANITARI');

  // Tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isNewServiceModalOpen) setIsNewServiceModalOpen(false);
        else if (isNewRoleModalOpen) setIsNewRoleModalOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewServiceModalOpen, isNewRoleModalOpen, onClose]);

  // Toggle de permís granular per rol (Restringit estrictament: re-autenticació NOMÉS en modificar SuperAdmin)
  const handleTogglePermission = (permissionId: string) => {
    const isSuperAdminRole = selectedRole === 'SUPER_ADMIN';

    const executeToggle = () => {
      setRoles((prev) =>
        prev.map((r) => {
          if (r.rol === selectedRole) {
            const has = r.permisos.includes(permissionId);
            const updatedPerms = has
              ? r.permisos.filter((p) => p !== permissionId)
              : [...r.permisos, permissionId];
            return { ...r, permisos: updatedPerms };
          }
          return r;
        })
      );

      if (onShowToast) {
        onShowToast('info', 'Permís Actualitzat', `Matriu RBAC actualitzada per al rol ${selectedRole}.`);
      }
    };

    if (isSuperAdminRole && onRequestSensitiveAction) {
      onRequestSensitiveAction(
        'Modificació de Rols de Superadministrador',
        `Alteració crítica de la matriu de privilegis del rol Superadministrador TI (${permissionId}) sota directrius ENS Nivell Alt.`,
        executeToggle
      );
    } else {
      executeToggle();
    }
  };

  // Guardar nou rol (Restringit estrictament: re-autenticació NOMÉS en concedir rol SuperAdmin o àmbit Global)
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleId || !newRoleTitle) return;

    const formattedId = newRoleId.trim().toUpperCase().replace(/\s+/g, '_');
    const isGrantingSuperAdmin = formattedId.includes('SUPER') || formattedId.includes('ADMIN_TOTAL') || newRoleAmbit === 'GLOBAL';

    const executeCreate = () => {
      const newRoleItem: RolePermissionMatrixItem = {
        rol: formattedId,
        titol: newRoleTitle.trim(),
        ambit: newRoleAmbit,
        descripcio: newRoleDesc || 'Rol específic assignat pel Superadministrador.',
        permisos: ['CONSULTA_CENS'],
      };

      setRoles((prev) => [...prev, newRoleItem]);
      setSelectedRole(formattedId);
      setIsNewRoleModalOpen(false);
      setNewRoleId('');
      setNewRoleTitle('');
      setNewRoleDesc('');

      if (onShowToast) {
        onShowToast('success', 'Nou Rol Donat d’Alta', `S'ha creat el rol ${formattedId} correctament.`);
      }
    };

    if (isGrantingSuperAdmin && onRequestSensitiveAction) {
      onRequestSensitiveAction(
        'Concessió de Rol de Superadministrador',
        `Creació i concessió de privilegis de governança global per al nou rol ${formattedId}.`,
        executeCreate
      );
    } else {
      executeCreate();
    }
  };

  // Guardar nou servei
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const id = `SRV_${newServiceName.trim().toUpperCase().replace(/\s+/g, '_')}`;
    const newService: SystemServiceItem = {
      id,
      nom: newServiceName.trim(),
      descripcio: newServiceDesc.trim() || 'Servei institucional del sistema.',
      categoria: newServiceCategory,
      estat: 'ACTIU',
      entitatsAdherides: 1,
    };

    setServices((prev) => [...prev, newService]);
    setIsNewServiceModalOpen(false);
    setNewServiceName('');
    setNewServiceDesc('');

    if (onShowToast) {
      onShowToast('success', 'Servei Donat d’Alta', `Servei ${newService.nom} afegit al catàleg.`);
    }
  };

  const activeRoleData = roles.find((r) => r.rol === selectedRole) || roles[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-blue-400/30 shadow-2xl p-4 sm:p-6 md:p-8 space-y-6 text-slate-100 select-none">
      {/* IL·LUMINACIÓ AMBIENTAL FLUIDA I AURAS RADIALS */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* CAPÇALERA */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-teal-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900/80 backdrop-blur-md rounded-[14px] flex items-center justify-center text-teal-300">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-200 via-blue-100 to-teal-200 bg-clip-text text-transparent">
                SuperAdmin · Serveis, Rols i Accessos
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Govern TI Granular
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Configuració centralitzada del catàleg de serveis, matriu RBAC i assignació de permisos per lloc de treball
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pestanyes */}
          <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Matriu de Rols
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Catàleg de Serveis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workplaces')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'workplaces'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Llocs de Treball
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Tancar</span>
            <kbd className="hidden md:inline-block bg-slate-900 px-1 py-0.5 rounded text-[10px] text-slate-400 font-mono">
              ESC
            </kbd>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PESTANYA 1: MATRIU DE ROLS I PERMISOS GRANULARS                           */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* COLUMNA ESQUERRA: LLISTAT DE ROLS AMB SELECTOR */}
          <div className="p-4 rounded-xl bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-indigo-400" />
                Rols del Sistema ({roles.length})
              </span>
              <button
                type="button"
                onClick={() => setIsNewRoleModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-bold shadow-sm cursor-pointer flex items-center gap-1"
              >
                <Plus size={12} />
                <span>Nou Rol</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {roles.map((r) => {
                const isSelected = selectedRole === r.rol;
                return (
                  <button
                    key={r.rol}
                    type="button"
                    onClick={() => setSelectedRole(r.rol)}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/50 border-indigo-400/50 text-white shadow-md'
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{r.titol}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-white/10 text-slate-200">
                        {r.ambit}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-indigo-300 mt-0.5 truncate">
                      {r.rol}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {r.descripcio}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DRETA: MATRIU DE PERMISOS GRANULARS DEL ROL SELECCIONAT */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{activeRoleData.titol}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeRoleData.rol}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeRoleData.descripcio}
                </p>
              </div>

              <div className="text-[11px] font-bold text-teal-300 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-500/30 shrink-0">
                {activeRoleData.permisos.length} Permisos Atorgats
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Permisos Granulars Disponibles
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GRANULAR_PERMISSIONS.map((perm) => {
                  const isChecked = activeRoleData.permisos.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                        isChecked
                          ? 'bg-gradient-to-r from-indigo-950/50 to-blue-950/50 border-indigo-400/40 text-white shadow-xs'
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-900/70 hover:text-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-semibold truncate">{perm.label}</div>
                        <div className="text-[10px] font-mono text-slate-400">{perm.id}</div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                          isChecked
                            ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-xs'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTANYA 2: CATÀLEG DE SERVEIS DEL SISTEMA                               */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-teal-400" />
              Serveis Institucionals Disponibles ({services.length})
            </span>
            <button
              type="button"
              onClick={() => setIsNewServiceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-teal-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Alta Nou Servei</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-4 rounded-xl bg-slate-950/60 backdrop-blur-xl border border-white/10 hover:border-teal-500/40 transition shadow-lg space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{srv.nom}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {srv.estat}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300">{srv.id}</div>
                  <p className="text-xs text-slate-400 leading-snug">{srv.descripcio}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Categoria: <strong className="text-slate-200">{srv.categoria}</strong></span>
                  <span className="font-mono text-teal-300 font-bold">{srv.entitatsAdherides} entitats</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTANYA 3: LLOCS DE TREBALL I ESTACIONS OPERATIVES                       */}
      {/* ========================================================================= */}
      {activeTab === 'workplaces' && (
        <div className="relative z-10 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 backdrop-blur-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Briefcase size={14} className="text-blue-400" />
              Assignació de Rols i Serveis per Lloc de Treball Territorial
            </h3>

            <div className="rounded-xl border border-white/10 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-3">Lloc de Treball</th>
                    <th className="p-3">Centre / Seu</th>
                    <th className="p-3">Rol Perfilat</th>
                    <th className="p-3">Serveis Actius</th>
                    <th className="p-3">Estat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">Mostrador Atenció UAC 01</td>
                    <td className="p-3 text-slate-300">CAP Sant Ildefons (Cornellà)</td>
                    <td className="p-3 font-mono text-blue-300">ADMINISTRATIU_SANITARI</td>
                    <td className="p-3 text-slate-400">PAO, Signatura Wacom, Onboarding</td>
                    <td className="p-3"><span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">ACTIU</span></td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">Despatx Direcció Mèdica</td>
                    <td className="p-3 text-slate-300">CAP Martí Julià (Cornellà)</td>
                    <td className="p-3 font-mono text-blue-300">DIRECCIO_CAP</td>
                    <td className="p-3 text-slate-400">Validació PAO, Gestió Personal, Dades Obertes</td>
                    <td className="p-3"><span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">ACTIU</span></td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">Banc Solidari Ortoprotèsic</td>
                    <td className="p-3 text-slate-300">Creu Roja Cornellà de Llobregat</td>
                    <td className="p-3 font-mono text-blue-300">VOLUNTARI_ENTITAT</td>
                    <td className="p-3 text-slate-400">Préstec Àgil, Signatura Digital</td>
                    <td className="p-3"><span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">ACTIU</span></td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">Mecànica i Banc de Proves</td>
                    <td className="p-3 text-slate-300">Taller Central Ortopèdic L'Hospitalet</td>
                    <td className="p-3 font-mono text-blue-300">TECNIC_TALLER</td>
                    <td className="p-3 text-slate-400">Reparació, Control Qualitat, RFID</td>
                    <td className="p-3"><span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">ACTIU</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ALTA NOU ROL                                                       */}
      {/* ========================================================================= */}
      {isNewRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-indigo-400/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound size={16} className="text-indigo-400" />
                Alta Nou Rol Específic
              </h3>
              <button
                type="button"
                onClick={() => setIsNewRoleModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Codi Identificador del Rol</label>
                <input
                  type="text"
                  required
                  placeholder="EX: TREBALLADOR_SOCIAL_CLINIC"
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Títol Oficial del Rol</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Treballador/a Social Clínic"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Àmbit d'Aplicació</label>
                <select
                  value={newRoleAmbit}
                  onChange={(e: any) => setNewRoleAmbit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="SANITARI">SANITARI (Atenció Primària / ICS)</option>
                  <option value="COMUNITARI">COMUNITARI (Ajuntament / Voluntariat)</option>
                  <option value="LOGISTICA">LOGÍSTICA (Tallers Ortopèdics)</option>
                  <option value="GLOBAL">GLOBAL (Govern TI)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRoleModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Crear Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ALTA NOU SERVEI                                                    */}
      {/* ========================================================================= */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-teal-400/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-teal-400" />
                Alta Nou Servei Institucional
              </h3>
              <button
                type="button"
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom del Servei</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Teledermatologia Ortoprotèsica"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripció Funcional</label>
                <textarea
                  placeholder="Finalitat clínica o comunitària del servei..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-400 h-20"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Categoria</label>
                <select
                  value={newServiceCategory}
                  onChange={(e: any) => setNewServiceCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="SALUT">SALUT</option>
                  <option value="COMUNITARI">COMUNITARI</option>
                  <option value="LOGISTICA">LOGÍSTICA</option>
                  <option value="SEGURETAT">SEGURETAT</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Desar Servei
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRolesAndServicesWorkspace;
