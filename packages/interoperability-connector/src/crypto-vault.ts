import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const DEFAULT_SECRET = process.env.INTEROP_AES_SECRET || 'bancactiu_enterprise_master_key_2026_gencat_aoc_secret!';

// Derive 32-byte key
const KEY = crypto.createHash('sha256').update(DEFAULT_SECRET).digest();

export interface EncryptedPayload {
  ivHex: string;
  authTagHex: string;
  ciphertextHex: string;
}

/**
 * Encripta dades sensibles de ciutadans mitjançant AES-256-GCM amb vector d'inicialització únic.
 */
export function encryptSensitiveData(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
    ciphertextHex: ciphertext
  };
}

/**
 * Desencripta de forma segura dades sensibles validant l'etiqueta d'autenticació criptogràfica (MAC).
 */
export function decryptSensitiveData(payload: EncryptedPayload): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(payload.ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(payload.authTagHex, 'hex'));

  let decrypted = decipher.update(payload.ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Genera una signatura inmutable SHA-256 per al registre d'auditoria RGPD.
 */
export function generateAuditHash(payload: Record<string, any>): string {
  const dataString = JSON.stringify(payload);
  return crypto.createHash('sha256').update(dataString + 'BANCACTIU_RGPD_FORENSIC_SALT_2026').digest('hex');
}
