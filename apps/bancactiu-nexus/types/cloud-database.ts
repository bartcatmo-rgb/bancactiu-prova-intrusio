/**
 * Esquema de Dades Centralitzat en el Núvol (Render / PostgreSQL / Cloud Storage)
 * BancActiu 1.0 - Departament de Salut / Institut Català de la Salut
 */

export interface UsuariCloud {
  dni: string; // PK: DNI o NIE (ex: 52622304Y)
  passwordHash: string;
  nom: string;
  cognoms: string;
  rol: 'SUPER_ADMIN' | 'GAPIC_ADMIN' | 'REFERENT_CAP' | 'ADMINISTRATIU' | 'VOLUNTARI' | 'TECNIC_TALLER' | string;
  ambitTerritorial?: string; // GAPiC assignada
  centreId?: string; // Codi RECSS del centre sanitari
  permisosGranulars: string[]; // Llista de permisos
  actiu: boolean;
  mustChangePassword?: boolean;
  dataCreacio: string;
  dataActualitzacio?: string;
}

export interface CentreSanitariCloud {
  codiRecss: string; // PK
  nom: string;
  tipus: 'CAP' | 'CUAP' | 'CL';
  gapicId: string;
  sectorId: string;
  absId?: string;
  adreca: string;
  municipi: string;
  estatOperatiu: 'OPERATIU' | 'REFORMA' | 'INACTIU';
  estatConveni?: 'PENDENT_CONVENI' | 'ACTIU_PILOT' | 'EN_PAUSA' | 'BAIXA';
  dataActivacio?: string;
  faseDesplegament?: number;
  dataCreacio?: string;
  ensTitularId?: string; // ID relacional de l'Ens Titular (Branca Sanitària / ICS)
}

export type EstatExpedientPAO = 'SOL·LICITAT' | 'APROVAT' | 'DISPENSAT' | 'RETORNAT';

export interface ExpedientPAOCloud {
  id: string; // PK
  cipPacient: string;
  tipusArticle: string; // CADIRA_RODES, CAMINADOR, MULETES, LLIT_ARTICULAT, MATALAS_ANTIESCARES, etc.
  codiCatSalut: string;
  estat: EstatExpedientPAO;
  centreOrigenId: string; // Codi RECSS
  dataPrestec: string;
  dataRetornPrevista?: string;
  observacions?: string;
  dataCreacio: string;
  dataActualitzacio?: string;
}

export type EstatFabricacioTaller =
  | 'PENDENT'
  | 'EN_REVISIO'
  | 'REPARACIO'
  | 'EN_FABRICACIO'
  | 'DISPONIBLE_LLIURAMENT'
  | 'LLIURAT';

export interface ComandaTallerOrtoCloud {
  id: string; // PK
  expedientPaoId: string;
  estatFabricacio: EstatFabricacioTaller;
  dataLliurament?: string;
  centreDestiId: string;
  observacions?: string;
  dataCreacio: string;
  dataActualitzacio?: string;
}

export interface EntitatComunitariaCloud {
  id: string; // PK
  nomOficial: string;
  tipus: 'ASSOCIACIO_VEINS' | 'CREU_ROJA' | 'ENTITAT_TERCER_SECTOR' | 'ONG' | 'ENTITAT_VEINAL' | string;
  municipi: string;
  gapicAssignada: string;
  estatConveni?: 'PENDENT_CONVENI' | 'ACTIU_PILOT' | 'EN_PAUSA' | 'BAIXA' | 'ACTIU' | 'SUSPES';
  dataActivacio?: string;
  faseDesplegament?: number;
  bancOrtoprotesicActiu: boolean;
  contacteTelefon?: string;
  contacteEmail?: string;
  adreca?: string;
  dataCreacio: string;
  dataActualitzacio?: string;
  ensTitularId?: string; // ID relacional de l'Ens Titular (Branca Comunitària / Ajuntament)
}

export interface AuditoriaLogCloud {
  id: string; // PK
  timestamp: string;
  actorDni: string;
  accio: string;
  entitatAfectada: string;
  detallJson: string;
}

export interface ConveniCloud {
  id: string; // PK ex: CONV-2026-001
  codiConveni: string;
  nomEnsTitular: string;
  tipusEns: 'SALUT_PUBLICA' | 'ENS_LOCAL' | 'AJUNTAMENT' | 'CONSORCI_SANITARI' | 'DIPUTACIO' | 'CREU_ROJA' | 'ENTITAT_COMUNITARIA' | 'GENERALITAT';
  modalitat: 'PILOT' | 'DEFINITIU';
  ambitTerritorial: string;
  estat: 'ACTIU' | 'PENDENT' | 'EN_REVISIO';
  gerenciaId?: string;
  gerenciaNom?: string;
  dataSignatura: string;
  centresAdheritsIds: string[];
  responsableDni?: string;
  responsableNom?: string;
  observacions?: string;
  dataCreacio?: string;
}


export type IdpEntorn = 'PREPRODUCCIO' | 'PRODUCCIO';

export interface IdpProviderConfig {
  isActive: boolean;
  entorn: IdpEntorn;
  clientId: string;
  clientSecret: string;
}

export interface IdpIntegrationConfig {
  idcat: IdpProviderConfig;
  clave: IdpProviderConfig;
}

// Compatibilitat amb codi AOC anterior
export type AocEntorn = IdpEntorn;
export type AocIntegrationConfig = IdpProviderConfig;


export interface OpenDataEndpointStatus {
  url: string;
  name: string;
  category: 'CENTRES_SANITARIS_RECSS' | 'ENS_LOCALS_MUNICAT';
  status: 'ONLINE' | 'FALLBACK_LOCAL' | 'DEGRADED' | 'ERROR';
  statusCode: number;
  recordsCount: number;
  responseTimeMs: number;
  lastChecked: string;
  error?: string;
}

export interface OpenDataSyncLog {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
  source: string;
  centresCount: number;
  entitatsCount: number;
  newCentres: number;
  updatedCentres: number;
  newEntitats: number;
  updatedEntitats: number;
  endpoints: OpenDataEndpointStatus[];
  durationMs: number;
  triggeredBy: 'CRON_AUTOMATIC' | 'MANUAL_SUPERADMIN' | 'SYSTEM_BOOT';
  message: string;
}

export interface OpenDataSyncConfig {
  autoSyncEnabled: boolean;
  frequencyHours: number;
  scheduledTimeUtc: string; // ex: '03:00'
  alertOnFailure: boolean;
  alertEmail: string;
  preferOfficialLive: boolean;
  recaptchaStrict?: boolean;
}

export interface OpenDataSyncMeta {
  lastSync?: string;
  nextScheduledSync?: string;
  lastStatus: 'SUCCESS' | 'PARTIAL' | 'ERROR' | 'IDLE';
  config: OpenDataSyncConfig;
  totalCentresInDb: number;
  totalEntitatsInDb: number;
  endpoints: OpenDataEndpointStatus[];
  history: OpenDataSyncLog[];
}

export interface OpenDataSyncResult {
  ok: boolean;
  timestamp: string;
  durationMs: number;
  triggeredBy: 'CRON_AUTOMATIC' | 'MANUAL_SUPERADMIN' | 'SYSTEM_BOOT';
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
  totalCentres: number;
  newCentres: number;
  updatedCentres: number;
  totalEntitats: number;
  newEntitats: number;
  updatedEntitats: number;
  endpoints: OpenDataEndpointStatus[];
  message: string;
  auditLogId?: string;
}

export interface CloudDatabaseData {
  usuaris: UsuariCloud[];
  centresSanitaris: CentreSanitariCloud[];
  expedientsPao: ExpedientPAOCloud[];
  comandesTallerOrto: ComandaTallerOrtoCloud[];
  entitatsComunitaries: EntitatComunitariaCloud[];
  auditoriaLogs: AuditoriaLogCloud[];
  convenis?: ConveniCloud[];
  aocConfig?: AocIntegrationConfig;
  idpConfig?: IdpIntegrationConfig;
  openDataSyncMeta?: OpenDataSyncMeta;
}
