/**
 * Tipus i models per a les Entitats Col·laboradores Externes de BancActiu 1.0
 * (Associacions de Veïns, Seus de la Creu Roja i Tercer Sector amb banc de material ortoprotèsic)
 */

export type TipusEntitat = 'ASSOCIACIO_VEINS' | 'CREU_ROJA' | 'ENTITAT_TERCER_SECTOR';

export type EstatConveniEntitat = 'CONVENI_ACTIU' | 'EN_TRAMITACIO' | 'DISPONIBLE_PER_ALTA';

export interface ServeisDisponiblesEntitat {
  bancMaterialOrtoprotesic: boolean;
  suportComunitari: boolean;
  recollidaDonacions: boolean;
  mantenimentBasic?: boolean;
}

export interface EntitatColaboradora {
  id: string; // Codi únic (ex: AVV-BCN-BEL, CR-CORNELLA-01) o NIF
  nomOficial: string;
  nomCurt?: string;
  tipus: TipusEntitat;
  municipi: string;
  comarca: string;
  codiPostal?: string;
  regioSanitaria?: string;
  gapicAssignada?: string; // GAPiC de referència ICS
  adrecaSeu: string;
  telefonContacte?: string;
  emailContacte?: string;
  responsableNom?: string;
  carrecResponsable?: string;
  estatConveni: EstatConveniEntitat;
  dataConveni?: string;
  serveisDisponibles: ServeisDisponiblesEntitat;
  observacions?: string;
  inventariAssignatIds?: string[];
}
