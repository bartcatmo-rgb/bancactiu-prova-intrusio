export interface TerritorialNode {
  regio_sanitaria_id: string;
  regio_sanitaria_nom: string;
  gerencia_id: string;
  gerencia_nom: string;
  sector_id: string;
  sector_nom: string;
  cap_id: string;
  cap_nom: string;
}

export interface PAORecord {
  id: string;
  codiPAO: string;
  descripcio: string;
  categoria: 'CADIRA_RODES' | 'CAMINADOR' | 'MULETES' | 'LLIT_ARTICULAT' | 'ALTRES';
  importOficialCatSalut: number; // Import oficial finançat per CatSalut (€)
  dataPrescripcio: string; // YYYY-MM-DD
  capOrigen: string;
  cap_id: string;
  sector_id: string;
  gerencia_id: string;
  regio_sanitaria_id: string;
  regioSanitaria: string;
  diesEsperaOficial: number; // Dies oficials de tramitació CatSalut/PAO
  reutilitzatBancActiu: boolean; // Si s'ha cobert mitjançant préstec BancActiu
  tempsLliuramentBancActiuHores: number; // Temps BancActiu (habitualment 24h = 1 dia)
  estalviGenerat: number; // € d'estalvi efectiu
}

export interface PAOCostBenefitSummary {
  totalPrescripcions: number;
  totalDespesaOficialPAO: number;
  totalEstalviBancActiu: number;
  mitjanaDiesEsperaOficial: number;
  mitjanaDiesEsperaBancActiu: number;
  diesEsperaEstalviats: number;
  taxaReutilitzacioPercentatge: number;
  co2EstalviatKg: number;
  repartimentPerCap: Record<string, { total: number; estalvi: number; prescripcions: number }>;
  repartimentPerGerencia: Record<string, { total: number; estalvi: number; taxa: number; prescripcions: number }>;
  repartimentPerRegio: Record<string, { total: number; estalvi: number; taxa: number; prescripcions: number }>;
}
