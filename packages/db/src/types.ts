// Types for BancActiu 2.0 Shared Database

export type AppRole = 
  | 'SUPERADMIN'
  | 'DIRECCIO'
  | 'TECNIC_SALUT'
  | 'AJUNTAMENT'
  | 'SERVEIS_SOCIALS'
  | 'TERCER_SECTOR'
  | 'ADMINISTRATIU_OPERATIU'
  | 'VOLUNTARI';

export type CentreTipus = 
  | 'CAP'
  | 'HOSPITAL'
  | 'AJUNTAMENT'
  | 'SERVEIS_SOCIALS'
  | 'CREU_ROJA'
  | 'ENTITAT_VEINAL'
  | 'MAGATZEM_CENTRAL';

export type PrestecEstat =
  | 'SOL_LICITAT'
  | 'VALIDAT_CLINIC'
  | 'ACTIU_LLIURAT'
  | 'RETORNAT'
  | 'EN_MANTENIMENT'
  | 'RETARDAT';

export interface User {
  id: string;
  dni: string;
  nomComplet: string;
  email: string;
  telefon?: string;
  rolPrincipal: AppRole;
  centreId?: string;
  barri?: string;
  carrec?: string;
  actiu: boolean;
  idCatAutenticat: boolean;
  dataCreacio: string;
  passwordHash?: string;
  mustChangePassword?: boolean;
  isFirstLogin?: boolean;
  passwordSetAt?: string;
  passwordHistory?: string[];
}

export interface Centre {
  id: string;
  codi: string;
  nom: string;
  tipus: CentreTipus;
  municipi: string;
  adreca?: string;
  gerenciaId: string;
  actiu: boolean;
  dataCreacio: string;
}

export interface Gerencia {
  id: string;
  codi: string;
  nom: string;
  regio: string;
  activa: boolean;
}

export interface Servei {
  id: string;
  codi: string;
  nom: string;
  descripcio?: string;
  centreId: string;
  actiu: boolean;
}

export interface LlocTreball {
  id: string;
  codi: string;
  nom: string;
  serveiId: string;
  rolRequerit: AppRole;
  actiu: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorDni: string;
  actorNom: string;
  appSource: string;
  accio: string;
  entitat: string;
  detall: string;
  ip: string;
  rgpdConforme: boolean;
}

export interface Prestec {
  id: string;
  codiExpedient: string;
  citizenId: string;
  citizenNom: string;
  materialCodi: string;
  materialNom: string;
  centreId: string;
  estat: PrestecEstat;
  dataPrestec: string;
  dataRetornPrevista: string;
}
