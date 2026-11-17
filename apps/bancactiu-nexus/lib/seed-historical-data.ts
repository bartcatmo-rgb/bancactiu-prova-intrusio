import { PAORecord } from '@/types/pao';
import { GERENCIES_TERRITORIALS, INITIAL_DEMO_PAO_DATA } from './pao-data';

export const HISTORICAL_STORAGE_KEY = 'bancactiu_historic_12m_v1';
export const LEGACY_STORAGE_KEY = 'bancactiu_pao_records';

export interface MonthlyStats {
  mesKey: string; // YYYY-MM
  nomMes: string;
  any: number;
  estacio: 'HIVERN' | 'PRIMAVERA' | 'ESTIU' | 'TARDOR';
  totalPrescripcions: number;
  despesaOficialPAO: number;
  estalviBancActiu: number;
  taxaReutilitzacio: number;
  diesEsperaOficialMitjana: number;
  diesEsperaBancActiuMitjana: number;
  diesDemoraEstalviats: number;
  co2EstalviatKg: number;
  topCategoria: string;
}

export interface TargetGerenciaConfig {
  id: string;
  nom: string;
  regio_id: string;
  regio_nom: string;
  caps: { id: string; nom: string; sector: string }[];
  baseMonthlyVolume: number;
}

export const TARGET_GERENCIES_CONFIG: TargetGerenciaConfig[] = [
  {
    id: 'GT_GIRONA',
    nom: 'Gerència Territorial Girona (ICS)',
    regio_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    baseMonthlyVolume: 28,
    caps: [
      { id: 'CAP_SALT', nom: 'CAP Salt (Jordi Nadal)', sector: 'SEC_GIRONES_SALT' },
      { id: 'CAP_CAN_GIBERT', nom: 'CAP Can Gibert del Pla', sector: 'SEC_GIRONA_SUD' },
      { id: 'CAP_SANTA_CLARA', nom: 'CAP Santa Clara (Girona)', sector: 'SEC_GIRONA_CENTRE' },
      { id: 'CAP_MONTILIVI', nom: 'CAP Montilivi', sector: 'SEC_GIRONA_EST' },
      { id: 'CAP_SARRIA', nom: 'CAP Sarrià de Ter', sector: 'SEC_GIRONES_NORD' },
    ],
  },
  {
    id: 'GT_METRO_SUD',
    nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    regio_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    baseMonthlyVolume: 36,
    caps: [
      { id: 'CAP_BELLVITGE', nom: 'CAP Bellvitge', sector: 'SEC_L_HOSPITALET_1' },
      { id: 'CAP_COLLBLANC', nom: 'CAP Collblanc', sector: 'SEC_L_HOSPITALET_2' },
      { id: 'CAP_EL_PRAT', nom: 'CAP Ramona Via (El Prat)', sector: 'SEC_BAIX_LLOBREGAT_LITORAL' },
      { id: 'CAP_SANT_BOI', nom: 'CAP Montclar (Sant Boi)', sector: 'SEC_SANT_BOI' },
      { id: 'CAP_VILADECANS', nom: 'CAP Maria Bernades (Viladecans)', sector: 'SEC_DELTA_LLOBREGAT' },
    ],
  },
  {
    id: 'GT_BCN_CIUTAT',
    nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    regio_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    baseMonthlyVolume: 42,
    caps: [
      { id: 'CAP_MANSO', nom: 'CAP Manso (Eixample)', sector: 'SEC_BCN_EIXAMPLE' },
      { id: 'CAP_ROQUETES', nom: 'CAP Roquetes (Nou Barris)', sector: 'SEC_BCN_NOU_BARRIS' },
      { id: 'CAP_SANT_ANDREU', nom: 'CAP Sant Andreu', sector: 'SEC_BCN_SANT_ANDREU' },
      { id: 'CAP_GRACIA', nom: 'CAP Pare Claret (Gràcia)', sector: 'SEC_BCN_GRACIA' },
    ],
  },
  {
    id: 'GT_CAMP_TARRAGONA',
    nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    regio_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    baseMonthlyVolume: 24,
    caps: [
      { id: 'CAP_TARRACO', nom: 'CAP Tarraco (Tarragona Centre)', sector: 'SEC_TARRAGONA_CENTRE' },
      { id: 'CAP_REUS', nom: 'CAP Sant Pere (Reus)', sector: 'SEC_REUS' },
    ],
  },
];

interface CatalogItemSeed {
  codiPAO: string;
  descripcio: string;
  categoria: 'CADIRA_RODES' | 'CAMINADOR' | 'MULETES' | 'LLIT_ARTICULAT' | 'ALTRES';
  basePrice: number;
  co2Kg: number;
  weightWinter: number;
  weightSpring: number;
  weightSummer: number;
  weightAutumn: number;
}

const SEED_CATALOG: CatalogItemSeed[] = [
  {
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes estàndard plegable d\'autopropulsió',
    categoria: 'CADIRA_RODES',
    basePrice: 420,
    co2Kg: 38.5,
    weightWinter: 0.35,
    weightSpring: 0.25,
    weightSummer: 0.30,
    weightAutumn: 0.28,
  },
  {
    codiPAO: 'PAO-060406',
    descripcio: 'Cadira de rodes lleugera d\'alumini per a exterior',
    categoria: 'CADIRA_RODES',
    basePrice: 485,
    co2Kg: 42.0,
    weightWinter: 0.20,
    weightSpring: 0.28,
    weightSummer: 0.35,
    weightAutumn: 0.25,
  },
  {
    codiPAO: 'PAO-040603',
    descripcio: 'Caminador articulat d\'alumini amb dues rodes davanteres',
    categoria: 'CAMINADOR',
    basePrice: 145,
    co2Kg: 14.2,
    weightWinter: 0.40,
    weightSpring: 0.25,
    weightSummer: 0.18,
    weightAutumn: 0.28,
  },
  {
    codiPAO: 'PAO-040606',
    descripcio: 'Caminador rollator de 4 rodes amb seient i frens per a adults',
    categoria: 'CAMINADOR',
    basePrice: 185,
    co2Kg: 18.0,
    weightWinter: 0.38,
    weightSpring: 0.30,
    weightSummer: 0.28,
    weightAutumn: 0.32,
  },
  {
    codiPAO: 'PAO-040306',
    descripcio: 'Parell de crosses / bastons anglesos amb recolzament d\'avantbraç',
    categoria: 'MULETES',
    basePrice: 45,
    co2Kg: 4.8,
    weightWinter: 0.25,
    weightSpring: 0.35,
    weightSummer: 0.30,
    weightAutumn: 0.30,
  },
  {
    codiPAO: 'PAO-181203',
    descripcio: 'Llit articulat elèctric hospitalari amb baranes plegables',
    categoria: 'LLIT_ARTICULAT',
    basePrice: 1150,
    co2Kg: 84.5,
    weightWinter: 0.30,
    weightSpring: 0.20,
    weightSummer: 0.15,
    weightAutumn: 0.22,
  },
  {
    codiPAO: 'PAO-091803',
    descripcio: 'Coixí viscoelàstic de prevenció d\'úlceres per pressió (antiescares)',
    categoria: 'ALTRES',
    basePrice: 210,
    co2Kg: 16.5,
    weightWinter: 0.28,
    weightSpring: 0.22,
    weightSummer: 0.20,
    weightAutumn: 0.24,
  },
];

// Mesos del cicle històric complet de 12 mesos (Novembre 2025 - Novembre 2026)
export const HISTORICAL_MONTHS = [
  { key: '2025-11', any: 2025, mes: 11, nom: 'Novembre 2025', estacio: 'TARDOR' as const, seasonalFactor: 1.00 },
  { key: '2025-12', any: 2025, mes: 12, nom: 'Desembre 2025', estacio: 'HIVERN' as const, seasonalFactor: 1.35 },
  { key: '2026-01', any: 2026, mes: 1, nom: 'Gener 2026', estacio: 'HIVERN' as const, seasonalFactor: 1.40 },
  { key: '2026-02', any: 2026, mes: 2, nom: 'Febrer 2026', estacio: 'HIVERN' as const, seasonalFactor: 1.25 },
  { key: '2026-03', any: 2026, mes: 3, nom: 'Març 2026', estacio: 'PRIMAVERA' as const, seasonalFactor: 1.10 },
  { key: '2026-04', any: 2026, mes: 4, nom: 'Abril 2026', estacio: 'PRIMAVERA' as const, seasonalFactor: 1.05 },
  { key: '2026-05', any: 2026, mes: 5, nom: 'Maig 2026', estacio: 'PRIMAVERA' as const, seasonalFactor: 1.15 },
  { key: '2026-06', any: 2026, mes: 6, nom: 'Juny 2026', estacio: 'ESTIU' as const, seasonalFactor: 1.20 },
  { key: '2026-07', any: 2026, mes: 7, nom: 'Juliol 2026', estacio: 'ESTIU' as const, seasonalFactor: 1.25 },
  { key: '2026-08', any: 2026, mes: 8, nom: 'Agost 2026', estacio: 'ESTIU' as const, seasonalFactor: 1.18 },
  { key: '2026-09', any: 2026, mes: 9, nom: 'Setembre 2026', estacio: 'TARDOR' as const, seasonalFactor: 1.12 },
  { key: '2026-10', any: 2026, mes: 10, nom: 'Octubre 2026', estacio: 'TARDOR' as const, seasonalFactor: 1.15 },
  { key: '2026-11', any: 2026, mes: 11, nom: 'Novembre 2026', estacio: 'TARDOR' as const, seasonalFactor: 1.10 },
];

/**
 * Genera el conjunt complet de registres històrics PAO per als 12 mesos d'activitat sanitària
 */
export function generate12MonthsHistoricalPAO(): PAORecord[] {
  const records: PAORecord[] = [];
  let recordCounter = 1;

  for (const m of HISTORICAL_MONTHS) {
    for (const g of TARGET_GERENCIES_CONFIG) {
      // Nombre de prescripcions d'aquest mes ajustat pel factor estacional
      const targetCount = Math.round(g.baseMonthlyVolume * m.seasonalFactor);

      for (let i = 0; i < targetCount; i++) {
        // Selecció aleatòria determinista del centre del CAP adscrit a la gerència
        const cap = g.caps[i % g.caps.length];

        // Selecció del material segons l'estació de l'any
        const catalogItem = pickItemBySeason(m.estacio, i);

        // Preu amb petita variació realista (+- 5%)
        const priceVariation = 1 + (((i * 7) % 11) - 5) * 0.01;
        const importOficial = Math.round(catalogItem.basePrice * priceVariation);

        // Dies d'espera oficial CatSalut (entre 35 i 62 dies)
        const diesEsperaOficial = 36 + ((i * 13) % 27);

        // 88% de taxa de reutilització mitjançant circuit BancActiu
        const isReutilitzat = (i % 8) !== 0;

        // Temps de lliurament ràpid BancActiu (entre 12h i 36h)
        const tempsLliuramentHores = isReutilitzat ? (16 + ((i * 5) % 24)) : (diesEsperaOficial * 24);

        // Dia del mes
        const day = 1 + ((i * 3 + (m.mes * 2)) % 28);
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const dataPrescripcio = `${m.key}-${dayStr}`;

        const estalvi = isReutilitzat ? importOficial : 0;

        records.push({
          id: `PAO-HIST-${m.key.replace('-', '')}-${g.id}-${String(recordCounter++).padStart(4, '0')}`,
          codiPAO: catalogItem.codiPAO,
          descripcio: catalogItem.descripcio,
          categoria: catalogItem.categoria,
          importOficialCatSalut: importOficial,
          dataPrescripcio,
          capOrigen: cap.nom,
          cap_id: cap.id,
          sector_id: cap.sector,
          gerencia_id: g.id,
          regio_sanitaria_id: g.regio_id,
          regioSanitaria: g.regio_nom,
          diesEsperaOficial,
          reutilitzatBancActiu: isReutilitzat,
          tempsLliuramentBancActiuHores: tempsLliuramentHores,
          estalviGenerat: estalvi,
        });
      }
    }
  }

  return records;
}

function pickItemBySeason(estacio: 'HIVERN' | 'PRIMAVERA' | 'ESTIU' | 'TARDOR', index: number): CatalogItemSeed {
  // Ajust ponderat segons estacionalitat clínica
  if (estacio === 'HIVERN') {
    // Més cadires i caminadors per fractures i caigudes
    const winterPool = [
      SEED_CATALOG[0], // Cadira estàndard
      SEED_CATALOG[2], // Caminador 2 rodes
      SEED_CATALOG[3], // Rollator
      SEED_CATALOG[5], // Llit articulat
      SEED_CATALOG[0],
      SEED_CATALOG[2],
      SEED_CATALOG[6], // Antiescares
    ];
    return winterPool[index % winterPool.length];
  } else if (estacio === 'PRIMAVERA') {
    const springPool = [
      SEED_CATALOG[1], // Cadira lleugera
      SEED_CATALOG[4], // Muletes
      SEED_CATALOG[2], // Caminador
      SEED_CATALOG[3], // Rollator
      SEED_CATALOG[0], // Cadira estàndard
      SEED_CATALOG[4], // Muletes
    ];
    return springPool[index % springPool.length];
  } else if (estacio === 'ESTIU') {
    const summerPool = [
      SEED_CATALOG[1], // Cadira lleugera exterior
      SEED_CATALOG[0], // Cadira estàndard
      SEED_CATALOG[4], // Muletes
      SEED_CATALOG[3], // Rollator
      SEED_CATALOG[1],
    ];
    return summerPool[index % summerPool.length];
  } else {
    // TARDOR: distribució equilibrada
    return SEED_CATALOG[index % SEED_CATALOG.length];
  }
}

/**
 * Carrega els registres PAO des del magatzem local (localStorage) o recorre al seeder si no n'hi ha
 */

/**
 * Auto-recuperació síncrona / singleton:
 * Comprova si el dataset històric de 12 mesos ja és present a localStorage.
 * Si està buit (primer llançament en un PC net), executa una injecció automàtica silent.
 */
export function ensureHistoricalPersistence(): PAORecord[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_PAO_DATA;
  try {
    // 1. Comprova clau versionada actual
    let raw = localStorage.getItem(HISTORICAL_STORAGE_KEY);
    if (!raw) {
      // 2. Fallback a clau anterior
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // 3. Primer arrenc absolut: injecció automàtica silent
    const generated = generate12MonthsHistoricalPAO();
    localStorage.setItem(HISTORICAL_STORAGE_KEY, JSON.stringify(generated));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(generated));
    return generated;
  } catch (err) {
    console.error('Error assegurant la persistència PAO a localStorage:', err);
    return INITIAL_DEMO_PAO_DATA;
  }
}

/**
 * Restableix les dades de simulació a l'estat net de fàbrica i recarrega l'aplicació
 */
export function resetHistoricalDataToFactory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORICAL_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem('bancactiu_territorial_state');
    
    // Genera de nou el conjunt sencer
    const cleanRecords = generate12MonthsHistoricalPAO();
    localStorage.setItem(HISTORICAL_STORAGE_KEY, JSON.stringify(cleanRecords));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(cleanRecords));
    
    // Recarrega immediatament per netejar qualsevol estat reactiu en memòria
    window.location.reload();
  } catch (err) {
    console.error('Error restablint les dades de fàbrica:', err);
    window.location.reload();
  }
}

export function loadStoredPAORecords(): PAORecord[] {
  return ensureHistoricalPersistence();
}

/**
 * Guarda els registres PAO i notifica al sistema
 */
export function saveStoredPAORecords(records: PAORecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORICAL_STORAGE_KEY, JSON.stringify(records));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('bancactiu-pao-updated', { detail: records }));
  } catch (e) {
    console.error('Error desant PAO a localStorage:', e);
  }
}

/**
 * Executa la càrrega massiva d'històric de 12 mesos per a les 4 Gerències Territorials
 */
export function seedHistorical12MonthsData(): {
  count: number;
  totalEstalvi: number;
  totalDespesa: number;
  co2Tons: number;
  gerenciesCount: number;
  monthsCount: number;
} {
  const records = generate12MonthsHistoricalPAO();

  let totalEstalvi = 0;
  let totalDespesa = 0;
  let totalCo2Kg = 0;

  for (const r of records) {
    totalDespesa += r.importOficialCatSalut;
    if (r.reutilitzatBancActiu) {
      totalEstalvi += r.estalviGenerat;
      // Càlcul de CO2 segons categoria
      if (r.categoria === 'CADIRA_RODES') totalCo2Kg += 40;
      else if (r.categoria === 'LLIT_ARTICULAT') totalCo2Kg += 84;
      else if (r.categoria === 'CAMINADOR') totalCo2Kg += 16;
      else if (r.categoria === 'MULETES') totalCo2Kg += 5;
      else totalCo2Kg += 18;
    }
  }

  saveStoredPAORecords(records);

  return {
    count: records.length,
    totalEstalvi,
    totalDespesa,
    co2Tons: Math.round((totalCo2Kg / 1000) * 10) / 10,
    gerenciesCount: TARGET_GERENCIES_CONFIG.length,
    monthsCount: HISTORICAL_MONTHS.length,
  };
}

/**
 * Calcula l'evolució mensual per a una Gerència concreta o agregada per a tota la xarxa
 */
export function getMonthlyEvolution(
  records: PAORecord[],
  gerenciaId?: string
): MonthlyStats[] {
  const filtered = gerenciaId && gerenciaId !== 'ALL'
    ? records.filter(r => r.gerencia_id === gerenciaId || (gerenciaId === 'GT_CAMP_TARRAGONA' && r.gerencia_id === 'GT_TARRAGONA'))
    : records;

  return HISTORICAL_MONTHS.map(m => {
    const monthRecords = filtered.filter(r => r.dataPrescripcio.startsWith(m.key));
    const totalPrescripcions = monthRecords.length;

    let despesaOficialPAO = 0;
    let estalviBancActiu = 0;
    let sumaDiesOficial = 0;
    let sumaDiesBancActiu = 0;
    let co2EstalviatKg = 0;
    let reutilitzats = 0;
    const catCounts: Record<string, number> = {};

    for (const r of monthRecords) {
      despesaOficialPAO += r.importOficialCatSalut;
      sumaDiesOficial += r.diesEsperaOficial;
      catCounts[r.categoria] = (catCounts[r.categoria] || 0) + 1;

      if (r.reutilitzatBancActiu) {
        reutilitzats++;
        estalviBancActiu += r.estalviGenerat;
        sumaDiesBancActiu += Math.max(1, Math.round(r.tempsLliuramentBancActiuHores / 24));

        if (r.categoria === 'CADIRA_RODES') co2EstalviatKg += 40;
        else if (r.categoria === 'LLIT_ARTICULAT') co2EstalviatKg += 84;
        else if (r.categoria === 'CAMINADOR') co2EstalviatKg += 16;
        else if (r.categoria === 'MULETES') co2EstalviatKg += 5;
        else co2EstalviatKg += 18;
      } else {
        sumaDiesBancActiu += r.diesEsperaOficial;
      }
    }

    const taxaReutilitzacio = totalPrescripcions > 0
      ? Math.round((reutilitzats / totalPrescripcions) * 100)
      : 0;

    const diesEsperaOficialMitjana = totalPrescripcions > 0
      ? Math.round(sumaDiesOficial / totalPrescripcions)
      : 42;

    const diesEsperaBancActiuMitjana = totalPrescripcions > 0
      ? Math.round(sumaDiesBancActiu / totalPrescripcions)
      : 1;

    const diesDemoraEstalviats = Math.max(0, diesEsperaOficialMitjana - diesEsperaBancActiuMitjana);

    // Top categoria del mes
    let topCategoria = 'CADIRA_RODES';
    let maxCount = -1;
    for (const [cat, cnt] of Object.entries(catCounts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        topCategoria = cat;
      }
    }

    return {
      mesKey: m.key,
      nomMes: m.nom,
      any: m.any,
      estacio: m.estacio,
      totalPrescripcions,
      despesaOficialPAO,
      estalviBancActiu,
      taxaReutilitzacio,
      diesEsperaOficialMitjana,
      diesEsperaBancActiuMitjana,
      diesDemoraEstalviats,
      co2EstalviatKg,
      topCategoria,
    };
  });
}

/**
 * Genera l'informe epidemiològic sectorial en format CSV descarregable per al Tècnic de Salut
 */
export function exportGerenciaEpidemiologicalCSV(records: PAORecord[], gerenciaId: string): string {
  const filtered = records.filter(r => r.gerencia_id === gerenciaId);
  const headers = [
    'ID_REGISTRE',
    'DATA_PRESCRIPCIO',
    'GERENCIA_ID',
    'REGIO_SANITARIA',
    'CAP_ORIGEN',
    'CODI_PAO',
    'DESCRIPCIO_MATERIAL',
    'CATEGORIA',
    'IMPORT_OFICIAL_CATSALUT_EUR',
    'REUTILITZAT_BANCACTIU',
    'ESTALVI_GENERAT_EUR',
    'DIES_ESPERA_OFICIAL',
    'TEMPS_BANCACTIU_HORES',
    'DIES_DEMORA_ESTALVIATS'
  ];

  const rows = filtered.map(r => {
    const diesBancActiu = r.reutilitzatBancActiu ? Math.round(r.tempsLliuramentBancActiuHores / 24) : r.diesEsperaOficial;
    const demoraEstalviada = Math.max(0, r.diesEsperaOficial - diesBancActiu);
    return [
      r.id,
      r.dataPrescripcio,
      r.gerencia_id,
      `"${r.regioSanitaria}"`,
      `"${r.capOrigen}"`,
      r.codiPAO,
      `"${r.descripcio}"`,
      r.categoria,
      r.importOficialCatSalut.toFixed(2),
      r.reutilitzatBancActiu ? 'SI' : 'NO',
      r.estalviGenerat.toFixed(2),
      r.diesEsperaOficial,
      r.tempsLliuramentBancActiuHores,
      demoraEstalviada
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\r\n');
}
