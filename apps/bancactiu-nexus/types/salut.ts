/**
 * TIPUS OFICIALS DEL CATÀLEG SANITARI DE CATALUNYA (CatSalut / SISCAT / RECSS)
 * Model de dades transversal per a BancActiu 1.0
 */

export type TipusCentreSanitari = 'CAP Principal' | 'Consultori Local (CL)' | 'CUAP';

export type EstatCentreSanitari = 'Actiu' | 'En Manteniment' | 'Simulació de Càrrega';

export type EstatConveni = 'PENDENT_CONVENI' | 'ACTIU_PILOT' | 'EN_PAUSA' | 'BAIXA';

export type RegioSanitariaNom =
  | 'Barcelona Metropolitana Sud'
  | 'Barcelona Ciutat'
  | 'Barcelona Metropolitana Nord'
  | 'Camp de Tarragona'
  | 'Terres de l\'Ebre'
  | 'Girona'
  | 'Lleida'
  | 'Catalunya Central'
  | 'Alt Pirineu i Aran';

export interface RegioSanitaria {
  id: string;
  codi: string;
  nom: RegioSanitariaNom;
  poblacioAproximada?: number;
  gerenciesIds: string[];
}

export interface GerenciaTerritorial {
  id: string;
  codi: string;
  nom: string;
  regioId: string;
  regioNom: RegioSanitariaNom;
  hospitalReferencia: string;
  adreca: string;
  responsable: string;
  sectorsIds: string[];
  actiu: boolean;
}

export interface SectorSanitari {
  id: string;
  codi: string;
  nom: string;
  gerenciaId: string;
  regioId: string;
  absIds: string[];
}

export interface AreaBasicaSalut {
  id: string;
  codi: string;
  nom: string;
  sectorId: string;
  gerenciaId: string;
  regioId: string;
  municipiPrincipal: string;
  centresIds: string[];
}

export interface CentreSanitari {
  id: string;
  codiRecss: string;
  nom: string;
  tipus: TipusCentreSanitari;
  estat: EstatCentreSanitari;
  absId: string;
  absNom: string;
  sectorId: string;
  sectorNom: string;
  gerenciaId: string;
  gerenciaNom: string;
  regioId: string;
  regioNom: RegioSanitariaNom;
  municipi: string;
  adreca: string;
  codiPostal?: string;
  telefon?: string;
  horari?: string;
  actiu: boolean;
  estatConveni?: EstatConveni;
  dataActivacio?: string;
  faseDesplegament?: number;
}

export interface TerritorialSelectionValue {
  regioId?: string;
  regioNom?: string;
  gerenciaId?: string;
  gerenciaNom?: string;
  sectorId?: string;
  sectorNom?: string;
  absId?: string;
  absNom?: string;
  centreId?: string;
  centreNom?: string;
  codiRecss?: string;
  tipusCentre?: TipusCentreSanitari;
  estatCentre?: EstatCentreSanitari;
}
