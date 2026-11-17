import fs from 'fs';
import path from 'path';
import os from 'os';

export interface IntrusionEvent {
  id: string;
  timestamp: string;
  displayTime: string;
  ip: string;
  route: string;
  method: string;
  attemptType: 'Força Bruta' | 'Login Fallit' | 'Sondeig Maliciós (Honeypot)' | 'Accés No Autoritzat' | 'Injecció Sospitosa' | 'Petició Anòmala';
  userAgent: string;
  details: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'BLOCKED' | 'HONEYPOT_TRIGGERED' | 'RECORDED';
  locationInfo?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __bancactiu_intrusion_logs__: IntrusionEvent[] | undefined;
}

const PERSISTENCE_FILE = path.join(
  process.env.TEMP || process.env.TMP || os.tmpdir(),
  'bancactiu_intrusions.json'
);

function loadPersistedLogs(): IntrusionEvent[] {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const data = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore read errors
  }
  return [];
}

function persistLogs(logs: IntrusionEvent[]) {
  try {
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(logs.slice(0, 500), null, 2), 'utf-8');
  } catch (e) {
    // Ignore write errors (e.g. serverless read-only fallback)
  }
}

// Initial seed if empty
if (!globalThis.__bancactiu_intrusion_logs__) {
  const persisted = loadPersistedLogs();
  if (persisted.length > 0) {
    globalThis.__bancactiu_intrusion_logs__ = persisted;
  } else {
    // Initial sample entries for immediate visibility
    globalThis.__bancactiu_intrusion_logs__ = [
      {
        id: 'int-init-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        displayTime: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('ca-ES', { hour12: false }) + ' ' + new Date().toLocaleDateString('ca-ES'),
        ip: '194.38.20.15',
        route: '/wp-admin/setup-config.php',
        method: 'GET',
        attemptType: 'Sondeig Maliciós (Honeypot)',
        userAgent: 'Mozilla/5.0 (Hydra/v9.5; Linux x86_64)',
        details: 'Exploració automatitzada de panells d\'administració externs',
        severity: 'HIGH',
        status: 'HONEYPOT_TRIGGERED',
        locationInfo: 'Xarxa Externa Desconeguda'
      },
      {
        id: 'int-init-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        displayTime: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString('ca-ES', { hour12: false }) + ' ' + new Date().toLocaleDateString('ca-ES'),
        ip: '85.62.198.44',
        route: '/api/auth/login',
        method: 'POST',
        attemptType: 'Força Bruta',
        userAgent: 'curl/8.4.0 (AttackSimulator/2.0)',
        details: 'Intent de força bruta amb diccionari (DNI 48956602Z, 5 intents repetits)',
        severity: 'CRITICAL',
        status: 'BLOCKED',
        locationInfo: 'IP de Laboratori Educatiu'
      }
    ];
    persistLogs(globalThis.__bancactiu_intrusion_logs__);
  }
}

export function recordIntrusionEvent(event: Omit<IntrusionEvent, 'id' | 'timestamp' | 'displayTime'>): IntrusionEvent {
  const now = new Date();
  const newEvent: IntrusionEvent = {
    ...event,
    id: 'int-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: now.toISOString(),
    displayTime: now.toLocaleTimeString('ca-ES', { hour12: false }) + ' ' + now.toLocaleDateString('ca-ES')
  };

  if (!globalThis.__bancactiu_intrusion_logs__) {
    globalThis.__bancactiu_intrusion_logs__ = [];
  }

  // Prepend to show latest first
  globalThis.__bancactiu_intrusion_logs__.unshift(newEvent);

  // Keep max 500 events
  if (globalThis.__bancactiu_intrusion_logs__.length > 500) {
    globalThis.__bancactiu_intrusion_logs__ = globalThis.__bancactiu_intrusion_logs__.slice(0, 500);
  }

  persistLogs(globalThis.__bancactiu_intrusion_logs__);
  return newEvent;
}

export function getIntrusionEvents(): IntrusionEvent[] {
  if (!globalThis.__bancactiu_intrusion_logs__) {
    globalThis.__bancactiu_intrusion_logs__ = loadPersistedLogs();
  }
  return globalThis.__bancactiu_intrusion_logs__ || [];
}

export function clearIntrusionEvents() {
  globalThis.__bancactiu_intrusion_logs__ = [];
  persistLogs([]);
}

export function extractClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}
