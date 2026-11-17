/**
 * SERVEI D'ALERTA I NOTIFICACIÓ DE CIBERSEGURETAT (BancActiu 1.0)
 * Notificació immediata al mòbil del Superadministrador (52622304Y / 48956602Z)
 * mitjançant Webhook / Telegram / SMS i cua persistent d'incidències per a la consola TI.
 */

import fs from 'fs';
import path from 'path';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITIC' | 'EMERGENCY';

export type ThreatType =
  | 'MULTIPLE_FAILED_LOGINS'
  | 'MALICIOUS_PAYLOAD_SQLI'
  | 'MALICIOUS_PAYLOAD_XSS'
  | 'PATH_TRAVERSAL_ATTEMPT'
  | 'COMMAND_INJECTION_ATTEMPT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SYSTEM_LOCKDOWN_ACTIVATED'
  | 'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT';

export interface SecurityIncident {
  id: string;
  threatType: ThreatType;
  severity: AlertSeverity;
  sourceIp: string;
  targetPath: string;
  details: string;
  actionTaken: string;
  timestamp: string;
  acknowledged?: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INCIDENTS_FILE = path.join(DATA_DIR, 'security_incidents.json');

/**
 * Llegeix els incidents de seguretat persistits
 */
export function getRecentSecurityIncidents(limit = 100): SecurityIncident[] {
  try {
    if (!fs.existsSync(INCIDENTS_FILE)) {
      return [];
    }
    const content = fs.readFileSync(INCIDENTS_FILE, 'utf-8');
    const parsed = JSON.parse(content) as SecurityIncident[];
    return parsed.slice(-limit).reverse();
  } catch (err) {
    console.error('[AlertNotifier] Error llegint security_incidents.json:', err);
    return [];
  }
}

/**
 * Desa un nou incident a disc
 */
function persistIncident(incident: SecurityIncident): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let list: SecurityIncident[] = [];
    if (fs.existsSync(INCIDENTS_FILE)) {
      try {
        list = JSON.parse(fs.readFileSync(INCIDENTS_FILE, 'utf-8'));
      } catch {
        list = [];
      }
    }
    list.push(incident);
    // Mantenim només els últims 300 incidents
    if (list.length > 300) {
      list = list.slice(-300);
    }
    fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AlertNotifier] Error desant incident:', err);
  }
}

/**
 * Envia la notificació d'alerta al canal mòbil configurat (Webhook / Telegram)
 * i la registra a la cua d'incidències del sistema.
 */
export async function sendSecurityAlert(params: {
  threatType: ThreatType;
  severity: AlertSeverity;
  sourceIp: string;
  targetPath: string;
  details: string;
  actionTaken: string;
}): Promise<SecurityIncident> {
  const incident: SecurityIncident = {
    id: `SEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    threatType: params.threatType,
    severity: params.severity,
    sourceIp: params.sourceIp,
    targetPath: params.targetPath,
    details: params.details,
    actionTaken: params.actionTaken,
    timestamp: new Date().toISOString(),
    acknowledged: false,
  };

  // 1. Registre persistent a disc
  persistIncident(incident);

  // 2. Format del missatge d'emergència per al Superadministrador
  const alertTitle =
    params.severity === 'EMERGENCY'
      ? '🚨 [EMERGÈNCIA CRÍTICA - BANCACTIU 1.0]'
      : params.severity === 'CRITIC'
      ? '⚠️ [ALERTA DE SEGURETAT - BANCACTIU 1.0]'
      : 'ℹ️ [AVÍS DE SEGURETAT - BANCACTIU 1.0]';

  const alertMessage = `${alertTitle}
- Amenaça: ${params.threatType}
- Gravetat: ${params.severity}
- IP Origen: ${params.sourceIp}
- Ruta Destí: ${params.targetPath}
- Acció presa: ${params.actionTaken}
- Detalls: ${params.details}
- Data/Hora: ${new Date(incident.timestamp).toLocaleString('ca-ES', { timeZone: 'Europe/Madrid' })}`;

  console.warn('[SECURITY DEFENSE ALERT]', alertMessage);

  // 3. Enviament Webhook genèric (Discord, Slack, Make, Zapier, Twilio SMS o Gateway Corporatiu)
  const webhookUrl = process.env.SECURITY_ALERT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: alertMessage,
          text: alertMessage,
          incident,
        }),
      }).catch((e) => console.warn('[AlertNotifier] Fallada connexió Webhook:', e));
    } catch (e) {
      console.warn('[AlertNotifier] Error enviant webhook:', e);
    }
  }

  // 4. Enviament directe a Telegram Bot si està configurat
  const telegramBotToken = process.env.TELEGRAM_ALERT_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (telegramBotToken && telegramChatId) {
    try {
      const tgUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: alertMessage,
          parse_mode: 'HTML',
        }),
      }).catch((e) => console.warn('[AlertNotifier] Fallada connexió Telegram:', e));
    } catch (e) {
      console.warn('[AlertNotifier] Error enviant Telegram:', e);
    }
  }

  return incident;
}

/**
 * Marca un incident com a revisat pel Superadministrador
 */
export function acknowledgeSecurityIncident(id: string): boolean {
  try {
    if (!fs.existsSync(INCIDENTS_FILE)) return false;
    const list = JSON.parse(fs.readFileSync(INCIDENTS_FILE, 'utf-8')) as SecurityIncident[];
    const item = list.find((i) => i.id === id);
    if (item) {
      item.acknowledged = true;
      fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[AlertNotifier] Error marcant incident:', err);
    return false;
  }
}
