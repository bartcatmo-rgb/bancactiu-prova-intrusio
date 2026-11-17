/**
 * SERVEI DE BLINDATGE I MODE SEGURETAT AUTOMÀTIC (SYSTEM LOCKDOWN)
 * BancActiu 1.0 - Protecció Defensiva de Dades Mèdiques i Ortoprotèsiques
 *
 * Quan s'activa el Mode Seguretat:
 * 1. Es bloqueja l'accés a les IPs atacants.
 * 2. Els endpoints d'escriptura/modificació de dades personals es posen en mode només-lectura.
 * 3. Es manté actiu l'accés d'emergència exclusiu per als Superadministradors (52622304Y / 48956602Z).
 */

import fs from 'fs';
import path from 'path';
import { sendSecurityAlert } from '@/lib/alert-notifier';

export interface BlockedIpRecord {
  ip: string;
  blockedAt: string;
  reason: string;
  attackCount: number;
  expiresAt: string;
}

export interface SecurityLockdownState {
  isLockdownActive: boolean;
  lockdownReason: string;
  activatedAt: string | null;
  activatedBy: string | null;
  blockedIps: Record<string, BlockedIpRecord>;
  autoLockdownThresholdAttacks: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'security_lockdown_state.json');

const DEFAULT_STATE: SecurityLockdownState = {
  isLockdownActive: false,
  lockdownReason: '',
  activatedAt: null,
  activatedBy: null,
  blockedIps: {},
  autoLockdownThresholdAttacks: 4,
};

// Memòria cau ràpida en procés per evitar I/O excessiu en cada petició
let inMemoryState: SecurityLockdownState | null = null;
const ipAttackTracker: Map<string, { count: number; firstAttempt: number }> = new Map();

/**
 * Llegeix l'estat del Lockdown des de disc / memòria
 */
export function getLockdownState(): SecurityLockdownState {
  if (inMemoryState) {
    cleanExpiredBlockedIps(inMemoryState);
    return inMemoryState;
  }

  try {
    if (!fs.existsSync(STATE_FILE)) {
      inMemoryState = { ...DEFAULT_STATE };
      saveLockdownState(inMemoryState);
      return inMemoryState;
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as SecurityLockdownState;
    cleanExpiredBlockedIps(parsed);
    inMemoryState = parsed;
    return inMemoryState;
  } catch (err) {
    console.error('[SecurityLockdown] Error llegint estat de lockdown:', err);
    return DEFAULT_STATE;
  }
}

/**
 * Neteja les IPs bloquejades que ja hagin complert el temps de càstig
 */
function cleanExpiredBlockedIps(state: SecurityLockdownState): void {
  const now = Date.now();
  let modified = false;
  for (const [ip, record] of Object.entries(state.blockedIps)) {
    if (record.expiresAt && new Date(record.expiresAt).getTime() < now) {
      delete state.blockedIps[ip];
      modified = true;
    }
  }
  if (modified) {
    saveLockdownState(state);
  }
}

/**
 * Desa l'estat del Lockdown a disc
 */
export function saveLockdownState(state: SecurityLockdownState): void {
  inMemoryState = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SecurityLockdown] Error guardant estat de lockdown:', err);
  }
}

/**
 * Comprova si una IP concreta està actualment bloquejada
 */
export function isIpBlocked(ip: string): boolean {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return false;
  const state = getLockdownState();
  const record = state.blockedIps[ip];
  if (!record) return false;

  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
    delete state.blockedIps[ip];
    saveLockdownState(state);
    return false;
  }
  return true;
}

/**
 * Bloqueja una IP temporalment o permanent
 */
export function blockIp(ip: string, reason: string, durationMinutes = 60): void {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return;
  const state = getLockdownState();
  const existing = state.blockedIps[ip];
  const attackCount = existing ? existing.attackCount + 1 : 1;
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

  state.blockedIps[ip] = {
    ip,
    blockedAt: new Date().toISOString(),
    reason,
    attackCount,
    expiresAt,
  };

  saveLockdownState(state);

  sendSecurityAlert({
    threatType: 'RATE_LIMIT_EXCEEDED',
    severity: 'WARNING',
    sourceIp: ip,
    targetPath: 'WAF_FILTER',
    details: `IP afegida a la llista de bloqueig per ${durationMinutes} minuts. Motiu: ${reason}`,
    actionTaken: `IP Bloquejada fins a ${expiresAt}`,
  });
}

/**
 * Desbloqueja una IP manualment
 */
export function unblockIp(ip: string): boolean {
  const state = getLockdownState();
  if (state.blockedIps[ip]) {
    delete state.blockedIps[ip];
    saveLockdownState(state);
    return true;
  }
  return false;
}

/**
 * Registra una activitat sospitosa d'una IP. Si supera el llindar, bloqueja la IP
 * i activa automàticament el Mode Seguretat (System Lockdown).
 */
export function recordIpSuspiciousActivity(
  ip: string,
  reason: string,
  weight = 1
): { blocked: boolean; lockdownTriggered: boolean } {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { blocked: false, lockdownTriggered: false };
  }

  const now = Date.now();
  const tracker = ipAttackTracker.get(ip) || { count: 0, firstAttempt: now };

  // Reseteja el comptador si han passat més de 10 minuts
  if (now - tracker.firstAttempt > 10 * 60 * 1000) {
    tracker.count = 0;
    tracker.firstAttempt = now;
  }

  tracker.count += weight;
  ipAttackTracker.set(ip, tracker);

  let blocked = false;
  let lockdownTriggered = false;

  // Llindar 1: Bloqueig d'IP als 3 intents sospitosos
  if (tracker.count >= 3 && !isIpBlocked(ip)) {
    blockIp(ip, `Superat llindar d'activitat sospitosa (${tracker.count} intents): ${reason}`, 120);
    blocked = true;
  }

  // Llindar 2: Activació automàtica de SYSTEM LOCKDOWN als 5 intents maliciosos
  const state = getLockdownState();
  if (tracker.count >= state.autoLockdownThresholdAttacks && !state.isLockdownActive) {
    activateLockdown(
      `Activació automàtica per atac continuat des de la IP ${ip}. Motiu: ${reason} (Recompte: ${tracker.count})`,
      'AUTOMATIC_DEFENSE'
    );
    lockdownTriggered = true;
  }

  return { blocked, lockdownTriggered };
}

/**
 * Activa el Mode Seguretat (System Lockdown)
 */
export function activateLockdown(reason: string, actorDni = 'SISTEMA_AUTOMATIC'): SecurityLockdownState {
  const state = getLockdownState();
  state.isLockdownActive = true;
  state.lockdownReason = reason;
  state.activatedAt = new Date().toISOString();
  state.activatedBy = actorDni;

  saveLockdownState(state);

  sendSecurityAlert({
    threatType: 'SYSTEM_LOCKDOWN_ACTIVATED',
    severity: 'EMERGENCY',
    sourceIp: 'INTERN_DEFENSA',
    targetPath: 'ALL_ENDPOINTS',
    details: `El sistema ha entrat en MODE SEGURETAT (Lockdown). Operacions de modificació restringides a només-lectura. Motiu: ${reason}`,
    actionTaken: 'MODE_SEGURETAT_ACTIVAT',
  });

  return state;
}

/**
 * Desactiva el Mode Seguretat i restableix l'operativa normal
 */
export function deactivateLockdown(actorDni: string): SecurityLockdownState {
  const state = getLockdownState();
  state.isLockdownActive = false;
  state.lockdownReason = '';
  state.activatedAt = null;
  state.activatedBy = null;

  saveLockdownState(state);

  sendSecurityAlert({
    threatType: 'SYSTEM_LOCKDOWN_ACTIVATED',
    severity: 'INFO',
    sourceIp: 'CONSOLA_ADMIN',
    targetPath: 'ALL_ENDPOINTS',
    details: `Mode Seguretat desactivat manualment pel Superadministrador (${actorDni}). Sistema restablert a operativa normal.`,
    actionTaken: 'SISTEMA_RESTABLERT_NORMAL',
  });

  return state;
}

/**
 * Verifica si l'actor disposa de permís d'emergència per sobrepassar el mode Lockdown
 * (Exclusiu per a Superadministradors 52622304Y i 48956602Z)
 */
export function isSuperAdminEmergencyActor(actorDni?: string | null): boolean {
  if (!actorDni) return false;
  const clean = actorDni.trim().toUpperCase();
  return clean === '52622304Y' || clean === '48956602Z';
}
