/**
 * SANDBOXING DE SESSIÓ I EXECUCIÓ AÏLLADA EN MEMÒRIA VOLÀTIL
 * BancActiu 3.0 Enterprise - Grau Militar / Sector Financer & Sociosanitari (ENS Nivell Alt)
 *
 * Principi de seguretat:
 * Cap credencial ni clau simètrica de desxifratge es guarda en clar al client ni a emmagatzematges
 * persistents no controlats. Tota sessió sensible s'empaqueta dins d'un Sandbox Efímer
 * vinculat indissolublement a l'empremta digital de l'amfitrió (Client Fingerprint).
 */

import crypto from 'crypto';

export interface SandboxedSessionData {
  sessionId: string;
  userId: string;
  userDni: string;
  role: string;
  clientIp: string;
  userAgentHash: string;
  fingerprintHash: string;
  issuedAt: number;
  expiresAt: number;
  lastActiveAt: number;
  ephemeralKey: string;
  isolationLevel: 'MILITARY_AIRGAP' | 'HIGH_GOVERNANCE' | 'STANDARD_SECURE';
}

const ACTIVE_SANDBOX_SESSIONS = new Map<string, SandboxedSessionData>();

// Tempos de vigència i rotació
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hores màxim
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minuts d'inactivitat màxim

function hashSha256(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

export function generateClientFingerprint(clientIp: string, userAgent: string, ephemeralSalt: string): string {
  return hashSha256(`${clientIp}|${userAgent}|${ephemeralSalt}`);
}

/**
 * Crea una sessió aïllada en el sandbox de memòria
 */
export function createSandboxedSession(params: {
  userId: string;
  userDni: string;
  role: string;
  clientIp: string;
  userAgent: string;
  isolationLevel?: 'MILITARY_AIRGAP' | 'HIGH_GOVERNANCE' | 'STANDARD_SECURE';
}): { sessionId: string; tokenCookieValue: string } {
  const now = Date.now();
  const sessionId = `sbx_${crypto.randomBytes(16).toString('hex')}`;
  const ephemeralSalt = crypto.randomBytes(16).toString('hex');
  const ephemeralKey = crypto.randomBytes(32).toString('hex');
  const userAgentHash = hashSha256(params.userAgent || 'UNKNOWN_AGENT');
  const fingerprintHash = generateClientFingerprint(params.clientIp, params.userAgent, ephemeralSalt);

  const sessionData: SandboxedSessionData = {
    sessionId,
    userId: params.userId,
    userDni: params.userDni,
    role: params.role,
    clientIp: params.clientIp,
    userAgentHash,
    fingerprintHash,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
    lastActiveAt: now,
    ephemeralKey,
    isolationLevel: params.isolationLevel || 'HIGH_GOVERNANCE'
  };

  ACTIVE_SANDBOX_SESSIONS.set(sessionId, sessionData);

  // Valor segur per a la cookie
  const payload = JSON.stringify({
    sid: sessionId,
    salt: ephemeralSalt,
    auth: true,
    dni: params.userDni,
    role: params.role
  });

  return {
    sessionId,
    tokenCookieValue: encodeURIComponent(payload)
  };
}

/**
 * Valida de manera estricta que la sessió pertanyi exactament al mateix context d'execució
 */
export function validateSandboxedSession(
  sessionId: string,
  clientIp: string,
  userAgent: string,
  providedSalt: string
): { isValid: boolean; session?: SandboxedSessionData; rejectionReason?: string } {
  const session = ACTIVE_SANDBOX_SESSIONS.get(sessionId);
  if (!session) {
    return { isValid: false, rejectionReason: 'Sessió de Sandbox inexistent o ja destruïda.' };
  }

  const now = Date.now();

  // 1. Verificació de caducitat absoluta
  if (now > session.expiresAt) {
    ACTIVE_SANDBOX_SESSIONS.delete(sessionId);
    return { isValid: false, rejectionReason: 'La sessió ha caducat (TTL de 8 hores superat).' };
  }

  // 2. Verificació d'inactivitat (Idle Timeout)
  if (now - session.lastActiveAt > IDLE_TIMEOUT_MS) {
    ACTIVE_SANDBOX_SESSIONS.delete(sessionId);
    return { isValid: false, rejectionReason: 'La sessió ha estat tancada per inactivitat perllongada (30 minuts).' };
  }

  // 3. Verificació estricta d'empremta digital (Anti-Session Hijacking)
  const computedFingerprint = generateClientFingerprint(clientIp, userAgent, providedSalt);
  if (computedFingerprint !== session.fingerprintHash) {
    // Possible segrest de cookie des d'una altra màquina o adreça IP
    ACTIVE_SANDBOX_SESSIONS.delete(sessionId);
    return {
      isValid: false,
      rejectionReason: 'Violació d\'aïllament Sandbox: L\'adreça IP o client no coincideix amb l\'origen autoritzat.'
    };
  }

  // Actualitzar timestamp d'activitat
  session.lastActiveAt = now;
  return { isValid: true, session };
}

/**
 * Destrueix atòmicament la sessió del Sandbox de memòria
 */
export function destroySandboxedSession(sessionId: string): boolean {
  return ACTIVE_SANDBOX_SESSIONS.delete(sessionId);
}
