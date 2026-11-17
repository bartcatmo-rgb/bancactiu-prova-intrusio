export type DPOEvaluationMode = 'FRANGES' | 'PROPORCIONAL';

export interface DPOAchievementTier {
  id: string;
  nom: string;
  minPrestecs: number; // Nombre mínim de préstecs tramitats pactats
  maxPrestecs: number; // Nombre màxim de préstecs tramitats pactats
  minPercent: number;  // % sobre l'objectiu de referència
  maxPercent: number;  // % sobre l'objectiu de referència
  consecucioDPOPercent: number; // % de compliment DPO reconegut a aquest tram (ex: 70%, 85%, 100%, 110%)
  badgeIcon: string;
  color: string;
  bgLight: string;
  border: string;
  descripcio: string;
}

export interface DPOConfiguration {
  evaluationMode: DPOEvaluationMode; // 'FRANGES' (trams pactats de préstecs) o 'PROPORCIONAL' (lineal directe segons préstecs)
  targetLoansPerWorker: number; // Objectiu pactat de préstecs per administratiu (ex: 30 préstecs / període)
  bpsPoints: number; // Ponderació per préstec BPS curta convalescència
  paoPoints: number; // Ponderació per derivació PAO CatSalut oficial
  returnPoints: number; // Ponderació per devolució i revisió tècnica
  alertThresholdLoans: number; // Llindar mínim d'atenció de préstecs
  daysRemaining: number; // Dies que resten per tancar el període
  tiers: DPOAchievementTier[];
  // Dades reservades exclusivament per a Gerència i Superadministrador
  annualBaseDPOAmount: number;
  weightInTotalDPO: number;
}

export interface DPOCalculatedResult {
  assignedTier: DPOAchievementTier | null;
  prestecsRealitzats: number;
  objectiuPactat: number;
  assolimentPercent: number; // % de préstecs aconseguit sobre l'objectiu
  consecucioDPOPercent: number; // % de DPO reconegut a l'acord
  status: 'ASSOLIT' | 'OPTIM' | 'RISC';
  modeUsed: DPOEvaluationMode;
  // Només visible per a perfils de Direcció / Superadministrador
  maxBancActiuAmount?: number;
  payoutAmount?: number;
}

export const DEFAULT_COMMUNITY_TIERS: DPOAchievementTier[] = [
  {
    id: 'tier-0',
    nom: 'Franja 0 · Activitat Inicial Pendent',
    minPrestecs: 0,
    maxPrestecs: 19,
    minPercent: 0,
    maxPercent: 69.9,
    consecucioDPOPercent: 0,
    badgeIcon: '⚠️',
    color: '#b91c1c',
    bgLight: '#fef2f2',
    border: '#fecaca',
    descripcio: 'Menys de 20 préstecs tramitats en el període (per sota del llindar pactat).',
  },
  {
    id: 'tier-1',
    nom: 'Franja 1 · Tram Inicial Pactat',
    minPrestecs: 20,
    maxPrestecs: 24,
    minPercent: 70,
    maxPercent: 79.9,
    consecucioDPOPercent: 75,
    badgeIcon: '⚡',
    color: '#c2410c',
    bgLight: '#fff7ed',
    border: '#ffedd5',
    descripcio: 'Entre 20 i 24 préstecs tramitats (Assoliment del 75% de l’objectiu de servei).',
  },
  {
    id: 'tier-2',
    nom: 'Franja 2 · Tram Mitjà de Cobertura',
    minPrestecs: 25,
    maxPrestecs: 27,
    minPercent: 80,
    maxPercent: 89.9,
    consecucioDPOPercent: 85,
    badgeIcon: '✓',
    color: '#1d4ed8',
    bgLight: '#eff6ff',
    border: '#dbeafe',
    descripcio: 'Entre 25 i 27 préstecs tramitats (Bona cobertura de la demanda ciutadana, 85%).',
  },
  {
    id: 'tier-3',
    nom: 'Franja 3 · Objectiu Pactat Assolit',
    minPrestecs: 28,
    maxPrestecs: 32,
    minPercent: 90,
    maxPercent: 104.9,
    consecucioDPOPercent: 100,
    badgeIcon: '⭐',
    color: '#15803d',
    bgLight: '#f0fdf4',
    border: '#bbf7d0',
    descripcio: 'Entre 28 i 32 préstecs tramitats (Objectiu comunitari 100% assolit amb èxit).',
  },
  {
    id: 'tier-4',
    nom: 'Franja 4 · Excel·lència Assistencial',
    minPrestecs: 33,
    maxPrestecs: 999,
    minPercent: 105,
    maxPercent: 999,
    consecucioDPOPercent: 110,
    badgeIcon: '🏆',
    color: '#6d28d9',
    bgLight: '#faf5ff',
    border: '#e9d5ff',
    descripcio: 'Més de 32 préstecs tramitats (Màxima dedicació i atenció a la comunitat, 110%).',
  },
];

export const DEFAULT_DPO_CONFIG: DPOConfiguration = {
  evaluationMode: 'FRANGES', // Per defecte s'aplica el model de franges de préstecs pactades
  targetLoansPerWorker: 30, // 30 préstecs de material per administratiu de taulell com a referència
  bpsPoints: 1.0,
  paoPoints: 1.0,
  returnPoints: 0.5,
  alertThresholdLoans: 20,
  daysRemaining: 12,
  tiers: DEFAULT_COMMUNITY_TIERS,
  annualBaseDPOAmount: 2200, // Reservat només per a Gerència
  weightInTotalDPO: 20, // Reservat només per a Gerència
};

const STORAGE_KEY = 'bancactiu_dpo_config_loans_v3';

export function loadDPOConfig(): DPOConfiguration {
  if (typeof window === 'undefined') return DEFAULT_DPO_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DPO_CONFIG;
    const parsed = JSON.parse(raw) as Partial<DPOConfiguration>;
    return {
      ...DEFAULT_DPO_CONFIG,
      ...parsed,
      targetLoansPerWorker: typeof parsed.targetLoansPerWorker === 'number' && parsed.targetLoansPerWorker > 0
        ? parsed.targetLoansPerWorker
        : 30,
      tiers: Array.isArray(parsed.tiers) && parsed.tiers.length > 0 ? parsed.tiers : DEFAULT_COMMUNITY_TIERS,
    };
  } catch {
    return DEFAULT_DPO_CONFIG;
  }
}

export function saveDPOConfig(config: DPOConfiguration): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('bancactiu_dpo_config_updated', { detail: config }));
  } catch (err) {
    console.error('Error desant configuració DPO a localStorage:', err);
  }
}

/**
 * Càlcul de consecució DPO basat estrictament en préstecs tramitats (sense diners)
 */
export function calculateDPOWorkerAchievement(
  prestecsTramitats: number,
  config: DPOConfiguration,
  objectiuCustom?: number
): DPOCalculatedResult {
  const objectiuPactat = objectiuCustom || config.targetLoansPerWorker || 30;
  const assolimentPercent = Math.round((prestecsTramitats / objectiuPactat) * 100);

  let assignedTier: DPOAchievementTier | null = null;
  let consecucioDPOPercent = 0;

  if (config.evaluationMode === 'FRANGES') {
    // 1. Cercar primer per volum directe de préstecs
    for (const tier of config.tiers) {
      if (prestecsTramitats >= tier.minPrestecs && prestecsTramitats <= tier.maxPrestecs) {
        assignedTier = tier;
        consecucioDPOPercent = tier.consecucioDPOPercent;
        break;
      }
    }
    // 2. Si no ha encaixat per nombre absolut, cercar per percentatge
    if (!assignedTier) {
      for (const tier of config.tiers) {
        if (assolimentPercent >= tier.minPercent && assolimentPercent <= tier.maxPercent) {
          assignedTier = tier;
          consecucioDPOPercent = tier.consecucioDPOPercent;
          break;
        }
      }
    }
    // 3. Fallback als extrems
    if (!assignedTier && config.tiers.length > 0) {
      if (prestecsTramitats >= config.tiers[config.tiers.length - 1].minPrestecs) {
        assignedTier = config.tiers[config.tiers.length - 1];
        consecucioDPOPercent = assignedTier.consecucioDPOPercent;
      } else {
        assignedTier = config.tiers[0];
        consecucioDPOPercent = assignedTier.consecucioDPOPercent;
      }
    }
  } else {
    // Model proporcional directe segons préstecs tramitats
    consecucioDPOPercent = Math.min(120, assolimentPercent);
  }

  let status: 'ASSOLIT' | 'OPTIM' | 'RISC' = 'OPTIM';
  if (assolimentPercent >= 100) {
    status = 'ASSOLIT';
  } else if (prestecsTramitats < (config.alertThresholdLoans || 20)) {
    status = 'RISC';
  }

  // Dades financeres només com a referència interna si Direcció ho consulta
  const baseDPO = config.annualBaseDPOAmount || 2200;
  const weight = config.weightInTotalDPO || 20;
  const maxBancActiuAmount = Number(((baseDPO * weight) / 100).toFixed(2));
  const payoutAmount = Number(((maxBancActiuAmount * consecucioDPOPercent) / 100).toFixed(2));

  return {
    assignedTier,
    prestecsRealitzats: prestecsTramitats,
    objectiuPactat,
    assolimentPercent,
    consecucioDPOPercent,
    status,
    modeUsed: config.evaluationMode,
    maxBancActiuAmount,
    payoutAmount,
  };
}

// Mantenim l'antiga signatura per retrocompatibilitat interna
export const calculateDPOWorkerPayout = (
  assolimentPercent: number,
  config: DPOConfiguration
) => {
  const target = config.targetLoansPerWorker || 30;
  const estimatedLoans = Math.round((assolimentPercent * target) / 100);
  const result = calculateDPOWorkerAchievement(estimatedLoans, config, target);
  return {
    ...result,
    effectivePayoutPercent: result.consecucioDPOPercent,
    maxBancActiuAmount: result.maxBancActiuAmount ?? 440,
    payoutAmount: result.payoutAmount ?? 440,
    globalDPOContribution: Number(((result.consecucioDPOPercent * 20) / 100).toFixed(1)),
  };
};

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
