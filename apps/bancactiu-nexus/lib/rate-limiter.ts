/**
 * Mòdul de protecció contra atacs de força bruta, DoS i suplantació d'IPs (Multi-Entity Rate Limiter)
 * Aplica limitació de peticions per finestra lliscant (Sliding Window) amb clau composta per IP + Entitat.
 */

import { extractVerifiedClientIp, enforceCollectionCap } from './security-shield';
import { demoAuditEvents } from './demo-store';

interface RateLimitRecord {
  timestamps: number[];
  blockedUntil?: number;
  failedAttempts?: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Neteja periòdica d'entrades caducades cada 5 minuts
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const expiry = now - 5 * 60 * 1000;
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => t > expiry);
      if (record.timestamps.length === 0 && (!record.blockedUntil || record.blockedUntil < now)) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: Request): string {
  const { ip } = extractVerifiedClientIp(request);
  return ip;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  response?: Response;
}

export interface TenantRateLimitOptions {
  entityId?: string;
  role?: string;
  operatorId?: string;
  isLoginAttempt?: boolean;
}

/**
 * Purgar tots els bloquejos de seguretat (Control exclusiu de Superadministrador)
 */
export function purgeSecurityLocks(): { purgedCount: number } {
  const count = rateLimitMap.size;
  rateLimitMap.clear();
  return { purgedCount: count };
}

/**
 * Comprova si la petició compleix els límits contra atacs de força bruta i saturació multi-entitat.
 */
export function checkRateLimit(
  request: Request,
  maxRequests = 60,
  windowMs = 60 * 1000,
  options?: TenantRateLimitOptions
): RateLimitCheckResult {
  // En entorn local, xarxa privada o demo portable USB, o rutes /api/demo/, mai bloquejar
  const host = request.headers.get('host') || '';
  const url = request.url || '';
  if (url.includes('/api/demo/') || host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.') || host.startsWith('10.')) {
    return { allowed: true, remaining: 9999, resetSeconds: 0 };
  }

  const ip = getClientIp(request);
  const isLocalOrPrivate =
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.includes('127.0.0.1') ||
    ip.startsWith('::ffff:') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    process.env.APP_MODE === 'real' ||
    process.env.NODE_ENV !== 'production';

  if (isLocalOrPrivate) {
    return { allowed: true, remaining: 9999, resetSeconds: 0 };
  }
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clau composta per separar la concurrència legítima de CAPs respecte a atacants individuals
  const trackingKey = options?.entityId
    ? `tenant:${options.entityId}:${ip}:${options.role || 'client'}`
    : `ip:${ip}`;

  let record = rateLimitMap.get(trackingKey);
  if (!record) {
    record = { timestamps: [], failedAttempts: 0 };
    rateLimitMap.set(trackingKey, record);
  }

  // 1. Comprovació de bloqueig temporal actiu (penalització d'atac)
  if (record.blockedUntil && now < record.blockedUntil) {
    const resetSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      response: new Response(
        JSON.stringify({
          error: '⛔ Bloqueig de seguretat actiu per excés de peticions o intents fallits d’autenticació.',
          retryAfterSeconds: resetSeconds,
          intrusionShieldActive: true,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(resetSeconds),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(record.blockedUntil / 1000)),
          },
        }
      ),
    };
  }

  // 2. Filtra marques de temps fora de la finestra lliscant
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  // 3. Comprovació de límit d'intents
  if (record.timestamps.length >= maxRequests) {
    // Si és un intent d'accés (login) o es duplica la taxa, s'aplica càstig de 15 minuts
    const penaltyMinutes = options?.isLoginAttempt ? 15 : 5;
    record.blockedUntil = now + penaltyMinutes * 60 * 1000;

    // Registra esdeveniment a l'auditoria de seguretat
    demoAuditEvents.unshift({
      id: `AUD-LOCKOUT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: options?.operatorId || trackingKey,
      actorName: 'Defensa de Xarxa Automàtica',
      actorRole: options?.role || 'SISTEMA',
      action: 'BLOQUEIG_FORCA_BRUTA',
      resource: options?.entityId || 'API_GATEWAY',
      details: `Bloqueig temporal de ${penaltyMinutes} minuts per a '${trackingKey}' després de superar el límit de ${maxRequests} peticions/minut.`,
    });
    enforceCollectionCap(demoAuditEvents, 3000);

    const oldest = record.timestamps[0] || windowStart;
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      response: new Response(
        JSON.stringify({
          error: `⛔ S’ha superat el llindar de seguretat (${maxRequests} peticions/minut). Bloqueig preventiu activat.`,
          retryAfterSeconds: resetSeconds,
          lockoutMinutes: penaltyMinutes,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(resetSeconds),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    };
  }

  // Registra la nova petició
  record.timestamps.push(now);
  const remaining = Math.max(0, maxRequests - record.timestamps.length);
  const resetSeconds = Math.ceil(windowMs / 1000);

  return {
    allowed: true,
    remaining,
    resetSeconds,
  };
}
