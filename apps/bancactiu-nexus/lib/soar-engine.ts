/**
 * MOTOR SOAR (Security Orchestration, Automation, and Response) I ANÀLISI DE COMPORTAMENT
 * BancActiu 3.0 Enterprise - Grau Militar / Sector Financer & Sociosanitari (ENS Nivell Alt)
 *
 * Funcionalitats:
 * 1. Detecció d'anomalies de comportament de trànsit (velocitat d'accés no humana, burst attacks, seqüències anòmales).
 * 2. Orquestració i resposta automàtica: Quarantena dinàmica d'IPs/subxarxes perimetrals.
 * 3. Registre de telemetria forense per a la consola de Superadministració.
 */

import { recordIpSuspiciousActivity, isIpBlocked } from '@/lib/security-lockdown';

export interface SoarIncident {
  id: string;
  timestamp: string;
  clientIp: string;
  subnet: string;
  category: 'BURST_TRAFFIC_ANOMALY' | 'BRUTE_FORCE_CREDENTIALS' | 'NON_HUMAN_NAVIGATION' | 'PARAM_PROBING';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  confidenceScore: number; // 0 - 100
  details: string;
  actionTaken: 'IP_QUARANTINE_15M' | 'CHALLENGE_REQUIRED' | 'AUDIT_LOGGED';
  fingerprint: string;
}

export interface SoarEvaluationResult {
  allowed: boolean;
  blockReason?: string;
  incident?: SoarIncident;
  rateLimitRemaining: number;
}

interface RequestTrackerEntry {
  timestamps: number[];
  lastPath: string;
  rapidRequestsCount: number;
  quarantinedUntil?: number;
}

// Map en memòria cau per a anàlisi de comportament en temps real
const BEHAVIOR_TRACKER = new Map<string, RequestTrackerEntry>();
const SOAR_INCIDENTS_LOG: SoarIncident[] = [];
const MAX_LOG_SIZE = 100;

// Paràmetres del motor SOAR
const BURST_WINDOW_MS = 2000; // Finestra de 2 segons
const MAX_REQUESTS_BURST = 18; // Màxim de peticions en 2 segons abans d'anomalia
const MIN_INTERVAL_HUMAN_MS = 35; // Menys de 35ms entre pàgines consecutives es considera bot
const QUARANTINE_DURATION_MS = 15 * 60 * 1000; // 15 minuts

function extractSubnet(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }
  return ip;
}

/**
 * Avalua si una petició presenta comportaments anòmals o intents d'explotació
 */
export function evaluateBehavioralAnomaly(
  clientIp: string,
  pathname: string,
  userAgent: string = ''
): SoarEvaluationResult {
  const now = Date.now();
  const subnet = extractSubnet(clientIp);

  // 1. Comprovació d'IP prèviament bloquejada o en quarantena
  if (isIpBlocked(clientIp)) {
    return {
      allowed: false,
      blockReason: `IP ${clientIp} bloquejada de manera permanent pel filtre perimetral WAF.`,
      rateLimitRemaining: 0
    };
  }

  let tracker = BEHAVIOR_TRACKER.get(clientIp);
  if (!tracker) {
    tracker = {
      timestamps: [now],
      lastPath: pathname,
      rapidRequestsCount: 0
    };
    BEHAVIOR_TRACKER.set(clientIp, tracker);
    return { allowed: true, rateLimitRemaining: MAX_REQUESTS_BURST };
  }

  // Comprovar si està en quarantena temporal SOAR
  if (tracker.quarantinedUntil && now < tracker.quarantinedUntil) {
    const remainingSecs = Math.ceil((tracker.quarantinedUntil - now) / 1000);
    return {
      allowed: false,
      blockReason: `IP ${clientIp} en quarantena automàtica SOAR per comportament anòmal. Temps restant: ${remainingSecs}s.`,
      rateLimitRemaining: 0
    };
  } else if (tracker.quarantinedUntil && now >= tracker.quarantinedUntil) {
    // Quarantena expirada
    tracker.quarantinedUntil = undefined;
    tracker.timestamps = [now];
    tracker.rapidRequestsCount = 0;
  }

  // Filtrar timestamps que cauen fora de la finestra d'anàlisi
  tracker.timestamps = tracker.timestamps.filter(t => now - t < BURST_WINDOW_MS);
  
  // Calcular interval amb la petició prèvia
  const lastTimestamp = tracker.timestamps[tracker.timestamps.length - 1] || now;
  const interval = now - lastTimestamp;
  tracker.timestamps.push(now);

  // 2. Detecció de navegació no humana (Velocitat de transició impossibilitada per a un humà)
  if (interval > 0 && interval < MIN_INTERVAL_HUMAN_MS && tracker.lastPath !== pathname) {
    tracker.rapidRequestsCount++;
  } else {
    tracker.rapidRequestsCount = Math.max(0, tracker.rapidRequestsCount - 1);
  }
  tracker.lastPath = pathname;

  // Si acumula múltiples salts ultra-ràpids consecutius entre rutes sensibles
  if (tracker.rapidRequestsCount >= 5) {
    tracker.quarantinedUntil = now + QUARANTINE_DURATION_MS;
    recordIpSuspiciousActivity(clientIp, 'NON_HUMAN_NAVIGATION_BURST');

    const incident: SoarIncident = {
      id: `SOAR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      clientIp,
      subnet,
      category: 'NON_HUMAN_NAVIGATION',
      severity: 'HIGH',
      confidenceScore: 98,
      details: `Velocitat de transició anòmala (<${MIN_INTERVAL_HUMAN_MS}ms entre rutes). Possibles scripts automatitzats o scrapers.`,
      actionTaken: 'IP_QUARANTINE_15M',
      fingerprint: `${clientIp}::${userAgent.slice(0, 40)}`
    };

    SOAR_INCIDENTS_LOG.unshift(incident);
    if (SOAR_INCIDENTS_LOG.length > MAX_LOG_SIZE) SOAR_INCIDENTS_LOG.pop();

    return {
      allowed: false,
      blockReason: 'Comportament de navegació no humà detectat. L\'accés ha estat posat en quarantena defensiva preventiva (SOAR Protocol).',
      incident,
      rateLimitRemaining: 0
    };
  }

  // 3. Detecció de ràfega excessiva (Burst Rate-Limiting)
  if (tracker.timestamps.length > MAX_REQUESTS_BURST) {
    tracker.quarantinedUntil = now + QUARANTINE_DURATION_MS;
    recordIpSuspiciousActivity(clientIp, 'TRAFFIC_BURST_ATTACK');

    const incident: SoarIncident = {
      id: `SOAR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      clientIp,
      subnet,
      category: 'BURST_TRAFFIC_ANOMALY',
      severity: 'CRITICAL',
      confidenceScore: 99,
      details: `Ràfega de ${tracker.timestamps.length} peticions en menys de ${BURST_WINDOW_MS}ms. Intent de saturació o sondeig no autoritzat.`,
      actionTaken: 'IP_QUARANTINE_15M',
      fingerprint: `${clientIp}::${userAgent.slice(0, 40)}`
    };

    SOAR_INCIDENTS_LOG.unshift(incident);
    if (SOAR_INCIDENTS_LOG.length > MAX_LOG_SIZE) SOAR_INCIDENTS_LOG.pop();

    return {
      allowed: false,
      blockReason: 'Ràfega de peticions anòmala detectada pel tallafocs SOAR. IP aïllada automàticament.',
      incident,
      rateLimitRemaining: 0
    };
  }

  const remaining = Math.max(0, MAX_REQUESTS_BURST - tracker.timestamps.length);
  return { allowed: true, rateLimitRemaining: remaining };
}

/**
 * Consulta la llista d'incidents SOAR detectats i mitigats pel sistema
 */
export function getSoarIncidents(): SoarIncident[] {
  return [...SOAR_INCIDENTS_LOG];
}

/**
 * Desbloqueja una IP de la quarantena SOAR (acció de Superadmin)
 */
export function liftSoarQuarantine(clientIp: string): boolean {
  const tracker = BEHAVIOR_TRACKER.get(clientIp);
  if (tracker) {
    tracker.quarantinedUntil = undefined;
    tracker.timestamps = [];
    tracker.rapidRequestsCount = 0;
    return true;
  }
  return false;
}
