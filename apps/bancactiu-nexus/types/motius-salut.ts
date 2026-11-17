/**
 * Catàleg de Classificació Dual de Motius Clínics i Comunitaris de Suport a la Mobilitat
 * BancActiu · Sistema d'Autonomia i Préstec Comunitari
 * 
 * Aquest mòdul defineix la taxonomia unificada que connecta:
 * - El vocabulari clínic i diagnòstic per a l'Atenció Primària (CAP UAC / Metges)
 * - El llenguatge senzill, quotidià i comprensible per al Voluntariat de Barri i Entitats
 * - La codificació epidemiològica estandarditzada per a Tècnics de Salut Pública, Gerència i CatSalut
 */

export type MotiuCodi =
  | 'POST_QUIRURGIC_TRAUMA'
  | 'NEUROLOGIC_ICTUS'
  | 'DETERIORAMENT_FRAGILITAT'
  | 'TRAMIT_PAO_TRANSITORI'
  | 'CONVALESCENCIA_AGUTA';

export interface MotiuSalutConfig {
  codi: MotiuCodi;
  categoria_estandard: string;
  etiqueta_clinica: string;      // Per a personal sanitari i administratiu del CAP
  etiqueta_comunitaria: string;  // Per a voluntaris d'entitats veïnals i Creu Roja
  icona: string;
  color: string;
  badge_color: string;
  descripcio_epidemiologica: string;
  prioritat_recomanada: 'ALTA' | 'MITJANA' | 'ESTÀNDARD';
  durada_recomanada_mesos: number;
}

export const MOTIUS_SALUT_CATALEG: MotiuSalutConfig[] = [
  {
    codi: 'POST_QUIRURGIC_TRAUMA',
    categoria_estandard: 'Traumatologia & Postquirúrgic',
    etiqueta_clinica: 'Traumatologia & Postquirúrgic (fractura fèmur/tíbia, pròtesi maluc o genoll)',
    etiqueta_comunitaria: '🦵 Lesió o operació recent (fractura, cama enguixada, sortida d\'hospital)',
    icona: '🩹',
    color: '#0284c7', // Sky
    badge_color: 'rgba(2, 132, 199, 0.15)',
    descripcio_epidemiologica: 'Rehabilitació motora aguda postquirúrgica o post-traumàtica amb mobilitat reduïda transitòria.',
    prioritat_recomanada: 'ALTA',
    durada_recomanada_mesos: 2,
  },
  {
    codi: 'NEUROLOGIC_ICTUS',
    categoria_estandard: 'Neurologia & Ictus',
    etiqueta_clinica: 'Neurologia & Recuperació funcional (Ictus, AVC, hemiparèsia, pèrdua d\'equilibri)',
    etiqueta_comunitaria: '🧠 Recuperació neurològica / Ictus (falta d\'equilibri o coordinació motora)',
    icona: '🧠',
    color: '#7c3aed', // Purple
    badge_color: 'rgba(124, 58, 237, 0.15)',
    descripcio_epidemiologica: 'Afectació neurològica central o vascular que requereix reeducació de la marxa i prevenció de caigudes.',
    prioritat_recomanada: 'ALTA',
    durada_recomanada_mesos: 4,
  },
  {
    codi: 'DETERIORAMENT_FRAGILITAT',
    categoria_estandard: 'Fragilitat & Post-caiguda',
    etiqueta_clinica: 'Deteriorament funcional agut / Síndrome post-caiguda en gent gran',
    etiqueta_comunitaria: '👴 Manca de força o dificultat per caminar (gent gran / recuperació d\'una caiguda)',
    icona: '🚶',
    color: '#d97706', // Amber
    badge_color: 'rgba(217, 119, 6, 0.15)',
    descripcio_epidemiologica: 'Pèrdua de deambulació autònoma per descondicionament físic agut o por a la marxa post-traumàtica a domicili.',
    prioritat_recomanada: 'MITJANA',
    durada_recomanada_mesos: 3,
  },
  {
    codi: 'TRAMIT_PAO_TRANSITORI',
    categoria_estandard: 'Pont Prestació PAO CatSalut',
    etiqueta_clinica: 'Puntual en espera de resolució PAO CatSalut (urgència social de mobilitat)',
    etiqueta_comunitaria: '⏳ Mentre arriba l\'ajuda de la Generalitat / CatSalut (tràmit de cadira definitiva)',
    icona: '⏳',
    color: '#059669', // Emerald
    badge_color: 'rgba(5, 150, 105, 0.15)',
    descripcio_epidemiologica: 'Recurs pal·liatiu temporal per cobrir el temps d\'espera fins a l\'adquisició de la prestació ortoprotètica del CatSalut.',
    prioritat_recomanada: 'ALTA',
    durada_recomanada_mesos: 3,
  },
  {
    codi: 'CONVALESCENCIA_AGUTA',
    categoria_estandard: 'Convalescència & Altres',
    etiqueta_clinica: 'Convalescència mèdica / Post-ingrés hospitalari per patologia aguda',
    etiqueta_comunitaria: '🤝 Altre suport comunitari de barri o convalescència general',
    icona: '🏥',
    color: '#0891b2', // Cyan
    badge_color: 'rgba(8, 145, 178, 0.15)',
    descripcio_epidemiologica: 'Convalescència general derivada de procés agut no traumatològic o demanda de proximitat veïnal.',
    prioritat_recomanada: 'ESTÀNDARD',
    durada_recomanada_mesos: 1,
  },
];

export function getMotiuConfig(codi?: string): MotiuSalutConfig {
  const found = MOTIUS_SALUT_CATALEG.find((m) => m.codi === codi);
  return found ?? MOTIUS_SALUT_CATALEG[4]; // Default to CONVALESCENCIA_AGUTA
}
