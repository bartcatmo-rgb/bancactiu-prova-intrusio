/**
 * BancActiu 3.0 Enterprise - Tipus i Catàlegs per al Stress & Security Lab
 * Totalment segur per al client (sense dependències Node.js com 'fs' o 'crypto')
 */

export interface CustomCenterBreakdown {
  centreId: string;
  centreNom: string;
  tpsAssignats: number;
  latenciaMitjanaMs: number;
  latenciaMaxMs: number;
  transaccionsProcessades: number;
  incidenciesMitigades: number;
  taxaErrors: number;
  salut: 'OPTIMAL' | 'EXCELLENT' | 'ESTABLE';
}

export interface CustomServiceBreakdown {
  serveiId: string;
  serveiNom: string;
  tpsAssignats: number;
  latenciaMitjanaMs: number;
  integritatPercent: number;
  bloquejosSoar: number;
}

export interface CustomStressReport {
  id: string;
  dataExecucio: string;
  duradaConfigurada: '30s' | '1m' | '5m' | '15m';
  duradaSegons: number;
  centresSeleccionats: string[];
  esTestGlobal: boolean;
  serveisSeleccionats: string[];
  rendiment: {
    tpsMitja: number;
    tpsPic: number;
    totalTransaccions: number;
    latenciaMitjanaMs: number;
    latenciaMaxMs: number;
    taxaErrorsPercent: number;
    errorsTotals: number;
  };
  merkleChain: {
    estat: 'VERIFICAT_INALTERABLE' | 'OPTIM';
    blocsMinats: number;
    arrelMerkleHash: string;
    integritatCriptografica: boolean;
    tempsValidacioMs: number;
  };
  motorSoar: {
    incidenciesDetectades: number;
    incidenciesBloquejades: number;
    intentsForcaBrutaAturats: number;
    colisionsOptimistesResoltes: number;
    tempsMitigacioMitjaMs: number;
    estatPerimetre: 'BLINDAT_100%' | 'ZERO_TRUST_ACTIU';
  };
  desglossamentCentres: CustomCenterBreakdown[];
  desglossamentServeis: CustomServiceBreakdown[];
}

export interface StressTestRunOptions {
  duration?: '30s' | '1m' | '5m' | '15m';
  selectedCenters?: string[];
  selectedServices?: string[];
  isGlobal?: boolean;
}

export interface StressTestErrorIncident {
  id: string;
  timestamp: string;
  tipus: 'TIMEOUT_API_EXTERNA' | 'CONCURRENCIA_OPTIMISTA' | 'VALIDACIO_FORMAT_CIP' | 'SATURACIO_POOL_CONNEXIONS';
  origen: string;
  descripcio: string;
  impacteUsuari: string;
  mecanismeReparacio: string;
  tempsResolucioMs: number;
  estat: 'RESOLT_EN_CALENT' | 'MITIGAT_AUTOMATICAMENT';
}

export interface StressTestSecurityIncident {
  id: string;
  timestamp: string;
  tipus: 'FORCA_BRUTA_LOGIN' | 'ESCALADA_PRIVILEGIS_NO_AUTORITZADA' | 'SONDEIG_CROSS_TERRITORIAL' | 'INJECCIO_SQL_NOSQL';
  ipAtacant: string;
  vector: string;
  reglaPerimetral: string;
  accioDefensiva: string;
  estat: 'BLOCAT_100%' | 'IP_AILLADA';
}

export interface StressTestYearMetrics {
  any: 1 | 2 | 3;
  titol: string;
  abastGeografic: string;
  regionsSanitariesActives: number;
  totalCentresSanitaris: number;
  totalEntitatsLocals: number;
  totalUsuarisProfessionals: number;
  expedientsPaoAcumulats: number;
  prestecsActius: number;
  reparacionsTaller: number;
  transaccionsTotals: number;
  concurrenciaPicTps: number;
  latenciaMitjanaMs: number;
  latenciaP99Ms: number;
  disponibilitatPercent: number;
  consumMemoriaMb: number;
  incidenciesSistemaResoltes: StressTestErrorIncident[];
  intrusionsCiberseguretatAturades: StressTestSecurityIncident[];
}

export interface StressTestExecutionResult {
  dataExecucio: string;
  duradaSimulacioMs: number;
  simulacioCompletada: boolean;
  any1: StressTestYearMetrics;
  any2: StressTestYearMetrics;
  any3: StressTestYearMetrics;
  resumExecutiu: {
    transaccionsTotals3Anys: number;
    taxesDefensivesExit: string;
    tempsAutoreparacioMitjaMs: number;
    conclusioArquitectura: string;
  };
  customExecution?: CustomStressReport;
}

export const STRESS_AVAILABLE_CENTERS = [
  { id: 'cen-all', nom: 'Xarxa Completa Catalunya (Test Global · 420 CAPs i Hospitals)', curts: 'Global Cat', tpsBase: 4200 },
  { id: 'cen-1', nom: 'CAP Sant Ildefons (Cornellà de Llobregat)', curts: 'CAP St Ildefons', tpsBase: 380 },
  { id: 'cen-2', nom: 'CAP Just Oliveras (L\'Hospitalet de Llobregat)', curts: 'CAP Oliveras', tpsBase: 320 },
  { id: 'cen-3', nom: 'CAP Bellvitge (Hospitalet de Llobregat)', curts: 'CAP Bellvitge', tpsBase: 290 },
  { id: 'cen-4', nom: 'CAP Can Bou (Castelldefels)', curts: 'CAP Can Bou', tpsBase: 240 },
  { id: 'cen-5', nom: 'Creu Roja Assemblea Cornellà (Taller Central)', curts: 'Creu Roja Cornellà', tpsBase: 190 },
  { id: 'cen-ieti', nom: 'Institut Esteve Terrades i Illa (Laboratori Dual)', curts: 'IETI Dual', tpsBase: 150 },
];

export const STRESS_AVAILABLE_SERVICES = [
  { id: 'loans', nom: 'Préstecs d\'Ajudes Tècniques (Expedients PAO)', codi: 'SRV-PAO', pes: 0.35 },
  { id: 'workshop', nom: 'Taller de Creu Roja (Reparacions i Recondicionament)', codi: 'SRV-TALLER', pes: 0.25 },
  { id: 'auth', nom: 'Autenticació, OIDC i Middleware Zero-Trust', codi: 'SRV-AUTH', pes: 0.20 },
  { id: 'merkle', nom: 'Cadena Immutabilitat Merkle i Traçabilitat Forense', codi: 'SRV-MERKLE', pes: 0.20 },
];
