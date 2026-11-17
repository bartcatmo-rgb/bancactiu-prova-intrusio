/**
 * TIPUS I MODELS PER AL PORTAL CIUTADÀ - BANCACTIU 1.0
 * CatSalut / Institut Català de la Salut
 */

export interface CapReferenciaCiutada {
  nom: string;
  municipi: string;
  adreca: string;
  telefon: string;
  enllacCitaPrevia: string;
}

export type EstatPrestecCiutada = 'ACTIU' | 'PRORROGAT' | 'RETORNAT' | 'BLOQUEJAT_DERIVACIO_PAO';

export interface PrestecCiutada {
  id: string; // Ex: "EXP-2026-BCN-001"
  dniCiutada: string;
  nomCiutada: string;
  articleNom: string;
  codiCatSalutPao: string; // Codi oficial PAO (ex: "SRM 000A" per a cadira de rodes)
  categoria: 'MOBILITAT' | 'CURA_LLIT' | 'BANY' | 'ALTRES';
  entitatNom: string;
  entitatTipus: 'CREU_ROJA' | 'ASSOCIACIO_VEINS';
  entitatTelefon: string;
  entitatAdreca: string;
  dataPrestec: string;
  dataRetornPrevista: string;
  estat: EstatPrestecCiutada;
  prorroguesDemanades: number; // 0 = cap, 1 = 1 pròrroga social concedida, >=2 = Bloqueig i derivació a PAO
  diesRestants: number;
  dataRetornReal?: string;
  capReferencia: CapReferenciaCiutada;
  motiuUltimaProrroga?: string;
}

export interface CiutadaPerfil {
  dni: string;
  nom: string;
  cognoms: string;
  telefon: string;
  email: string;
  municipi: string;
  adreca: string;
  capReferenciaId: string;
  mustChangePassword: boolean;
  consentimentRgpdAcceptat: boolean;
  dataAcceptacioRgpd?: string;
  versioRgpd?: string;
}

export interface SollicitudProrrogaResponse {
  ok: boolean;
  bloquejatPAO?: boolean;
  missatge: string;
  prestecActualitzat?: PrestecCiutada;
  derivacioPaoInfo?: {
    missatgeInstitucional: string;
    capReferencia: CapReferenciaCiutada;
    codiCatSalut: string;
    articleNom: string;
    enllacCitaPrevia: string;
  };
}
