/**
 * BANC ACTIU 1.0 - ESQUEMA D'AUTENTICACIÓ, USUARIS I PERMISOS GRANULARS
 * Departament de Salut de la Generalitat de Catalunya / CatSalut
 */

export interface UsuariBancActiu {
  id: string;
  dni: string;
  nomComplet: string;
  email: string;
  rol: 'SUPERADMIN' | 'REFERENT_CENTRE' | 'ADMINISTRATIU_LOCAL' | 'CONSULTOR' | string;
  centreId?: string; // ID del CAP al que pertany (Ex: CAP_SALT)
  regioSanitaria?: string; // Ex: RS_GIRONA
  gerenciaId?: string; // Ex: GT_GIRONA
  sectorId?: string;
  absId?: string;
  actiu: boolean;
  permisos: string[]; // Llista de codis de permisos assignats manualment (sense paquets fixos)
  permisosPersonalitzats?: string[]; // Permisos addicionals afegits ad-hoc dinàmicament
  copyrightAcceptat: boolean;
  dataAcceptacioCopyright?: string;
  versioCopyrightAcceptada?: string;
  dataCreacio?: string;
  ultimAcces?: string;
}

export interface PermisDefinicio {
  codi: string;
  nom: string;
  descripcio: string;
  categoria: 'ATENCIO_PRIMARIA' | 'GESTOR_CENTRE' | 'GERENCIA' | 'SUPERADMIN';
  nivellMinim: 'OPERATIU' | 'CENTRE' | 'GERENCIA' | 'GLOBAL';
}

/**
 * Catàleg Oficial de Permisos Granulars del Sistema BancActiu 1.0
 */
export const CATALEG_PERMISOS_SISTEMA: PermisDefinicio[] = [
  // 1. Atenció Primària & Taulell (Àmbit Operatiu Local CAP)
  {
    codi: 'RESERVES_CONSULTA',
    nom: 'Consulta de Reserves i Llista d’Espera',
    descripcio: 'Permet visualitzar les sol·licituds i préstecs actius del CAP.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'RESERVES_CREACIO',
    nom: 'Creació de Noves Reserves Ortoprotètiques',
    descripcio: 'Permet iniciar tràmits de préstec solidari per a pacients amb CIP.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'RESERVES_ENTREGA',
    nom: 'Formalització d’Entregues Presencials',
    descripcio: 'Permet registrar l’entrega de material físic i recepció de dipòsits.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'RESERVES_RETORN',
    nom: 'Recepció i Tancament de Retorns',
    descripcio: 'Permet registrar el retorn de material, revisió d’estat i tancament.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'INVENTARI_LOCAL_CONSULTA',
    nom: 'Consulta d’Estoc i Magatzem del CAP',
    descripcio: 'Permet veure la disponibilitat immediata al magatzem de planta del centre.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'INVENTARI_LOCAL_AJUST',
    nom: 'Ajustament d’Estoc Local',
    descripcio: 'Permet registrar altes puntuals o canvis d’estat de recursos al CAP.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },
  {
    codi: 'FITXA_PACIENT_CONSULTA',
    nom: 'Consulta de Dades Administratives Pacient',
    descripcio: 'Permet accedir a la fitxa de contacte i telèfon associada al tràmit.',
    categoria: 'ATENCIO_PRIMARIA',
    nivellMinim: 'OPERATIU',
  },

  // 2. Gestió i Coordinació de Centre (Referent de Gestió)
  {
    codi: 'USUARIS_LOCAL_GESTIO',
    nom: 'Gestió d’Usuaris Operatius del CAP',
    descripcio: 'Permet donar d’alta i editar el personal administratiu del propi centre.',
    categoria: 'GESTOR_CENTRE',
    nivellMinim: 'CENTRE',
  },
  {
    codi: 'INFORMES_CENTRE_CONSULTA',
    nom: 'Mètriques i DPO de Centre',
    descripcio: 'Permet consultar la consecució d’objectius DPO i activitat del CAP.',
    categoria: 'GESTOR_CENTRE',
    nivellMinim: 'CENTRE',
  },
  {
    codi: 'PAO_DERIVACIO_TRAMIT',
    nom: 'Derivació a Prestació Oficial PAO (CatSalut)',
    descripcio: 'Permet tramitar el pont de transició solidària cap a CatSalut.',
    categoria: 'GESTOR_CENTRE',
    nivellMinim: 'CENTRE',
  },
  {
    codi: 'SOLICITUD_MATERIAL_REFORC',
    nom: 'Peticions de Reabastiment Territorial',
    descripcio: 'Permet demanar lots addicionals al Taller Central o Gerència.',
    categoria: 'GESTOR_CENTRE',
    nivellMinim: 'CENTRE',
  },

  // 3. Demarcació Territorial (Gerència)
  {
    codi: 'GERENCIA_CONSOLIDAT',
    nom: 'Supervisió Consolidada Demarcació',
    descripcio: 'Permet consultar tots els centres dependents de la Gerència Territorial.',
    categoria: 'GERENCIA',
    nivellMinim: 'GERENCIA',
  },
  {
    codi: 'EPIDEMIOLOGIA_SECTORIAL',
    nom: 'Mineria de Dades Epidemiològiques',
    descripcio: 'Extracció anonimitzada RGPD Art. 89 per a tècnics de salut pública.',
    categoria: 'GERENCIA',
    nivellMinim: 'GERENCIA',
  },
  {
    codi: 'PAO_VALIDACIO_GERENCIA',
    nom: 'Validació d’Expedients PAO Territorial',
    descripcio: 'Aprovació i assignació pressupostària CatSalut a nivell gerencial.',
    categoria: 'GERENCIA',
    nivellMinim: 'GERENCIA',
  },

  // 4. Consola Central Superadministrador (CatSalut Global)
  {
    codi: 'SUPERADMIN_GLOBAL',
    nom: 'Governança Total Plataforma BancActiu',
    descripcio: 'Control complet de paràmetres, auditories i seguretat de Catalunya.',
    categoria: 'SUPERADMIN',
    nivellMinim: 'GLOBAL',
  },
  {
    codi: 'XARXA_TERRITORIAL_ALTA',
    nom: 'Administració de la Xarxa Territorial RECSS',
    descripcio: 'Alta i baixa de Regions Sanitàries, Gerències i Centres CAP.',
    categoria: 'SUPERADMIN',
    nivellMinim: 'GLOBAL',
  },
  {
    codi: 'USUARIS_GLOBAL_GESTIO',
    nom: 'Alta i Nomenament de Referents a tot Catalunya',
    descripcio: 'Permet assignar referents administratius i qualsevol rol global.',
    categoria: 'SUPERADMIN',
    nivellMinim: 'GLOBAL',
  },
  {
    codi: 'AUDITORIA_SISTEMA',
    nom: 'Consulta de Logs d’Auditoria de Seguretat',
    descripcio: 'Traçabilitat estricta d’accessos, bloquejos i canvis de contrasenya.',
    categoria: 'SUPERADMIN',
    nivellMinim: 'GLOBAL',
  },
  {
    codi: 'CATALEG_RECSS_IMPORT',
    nom: 'Sincronització i Importació Oficial RECSS',
    descripcio: 'Càrrega massiva des de Dades Obertes Gencat i CatSalut.',
    categoria: 'SUPERADMIN',
    nivellMinim: 'GLOBAL',
  },
];

/**
 * Permisos que el Referent de Centre té autoritat delegada per concedir a usuaris locals.
 * Blindatge RGPD: Un Referent de Centre mai pot atorgar permisos de Gerència ni de Superadmin.
 */
export const PERMISOS_DELEGABLES_REFERENT = [
  'RESERVES_CONSULTA',
  'RESERVES_CREACIO',
  'RESERVES_ENTREGA',
  'RESERVES_RETORN',
  'INVENTARI_LOCAL_CONSULTA',
  'INVENTARI_LOCAL_AJUST',
  'FITXA_PACIENT_CONSULTA',
  'PAO_DERIVACIO_TRAMIT',
];
