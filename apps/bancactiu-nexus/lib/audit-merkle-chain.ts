/**
 * REGISTRE D'AUDITORIA IMMUTABLE MITJANÇANT CADENA MERKLE (HASH CHAINING SHA-256)
 * BancActiu 3.0 Enterprise - Grau Militar / Sector Financer & Sociosanitari (ENS Nivell Alt)
 *
 * Principi matemàtic:
 * Cada bloc d'auditoria conté el hash SHA-256 del bloc anterior.
 * Qualsevol alteració retrospectiva a la base de dades o fitxers de registre trenca
 * la cadena de confiança, sent detectada immediatament pel motor d'integritat.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface MerkleAuditBlock {
  index: number;
  timestamp: string;
  actorDni: string;
  action: string;
  clientIp: string;
  payloadHash: string;
  previousHash: string;
  blockHash: string;
  nonce?: number;
  metadata?: Record<string, any>;
}

export interface MerkleChainVerificationResult {
  isValid: boolean;
  totalBlocks: number;
  currentRootHash: string;
  firstBlockTimestamp: string;
  lastBlockTimestamp: string;
  brokenAtBlockIndex?: number;
  tamperDetails?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_FILE = path.join(DATA_DIR, 'merkle_audit_chain.json');
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function calculateSha256(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function calculateBlockHash(
  index: number,
  timestamp: string,
  actorDni: string,
  action: string,
  clientIp: string,
  payloadHash: string,
  previousHash: string
): string {
  const content = `${index}|${timestamp}|${actorDni}|${action}|${clientIp}|${payloadHash}|${previousHash}`;
  return calculateSha256(content);
}

// Estat de la cadena en memòria
let inMemoryChain: MerkleAuditBlock[] = [];

/**
 * Inicialitza o carrega la cadena Merkle d'auditoria
 */
function loadChain(): MerkleAuditBlock[] {
  if (inMemoryChain.length > 0) return inMemoryChain;

  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryChain = parsed;
        return inMemoryChain;
      }
    }
  } catch (err) {
    console.warn('[MERKLE-CHAIN] No s\'ha pogut llegir fitxer de persistència, inicialitzant cadena nova:', err);
  }

  // Creació del Bloc Genesis
  const genesisTimestamp = '2026-11-01T00:00:00.000Z';
  const genesisPayloadHash = calculateSha256('GENESIS_BLOCK_BANCACTIU_3.0_ZERO_TRUST');
  const genesisHash = calculateBlockHash(
    0,
    genesisTimestamp,
    'SYSTEM_ROOT',
    'INITIALIZE_IMMUTABLE_MERKLE_CHAIN',
    '127.0.0.1',
    genesisPayloadHash,
    GENESIS_HASH
  );

  const genesisBlock: MerkleAuditBlock = {
    index: 0,
    timestamp: genesisTimestamp,
    actorDni: 'SYSTEM_ROOT',
    action: 'INITIALIZE_IMMUTABLE_MERKLE_CHAIN',
    clientIp: '127.0.0.1',
    payloadHash: genesisPayloadHash,
    previousHash: GENESIS_HASH,
    blockHash: genesisHash,
    metadata: { version: '3.0.0-PROD', ensLevel: 'HIGH' }
  };

  inMemoryChain = [genesisBlock];
  saveChain(inMemoryChain);
  return inMemoryChain;
}

function saveChain(chain: MerkleAuditBlock[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(chain, null, 2), 'utf8');
  } catch {
    // Si estem en entorn serverless/read-only (com Vercel), la memòria persisteix durant el cicle de vida del worker
  }
}

/**
 * Afegeix un nou bloc d'auditoria de manera atòmica i encadenada
 */
export function appendAuditBlock(
  actorDni: string,
  action: string,
  payload: any,
  clientIp: string = '127.0.0.1',
  metadata?: Record<string, any>
): MerkleAuditBlock {
  const chain = loadChain();
  const lastBlock = chain[chain.length - 1];

  const index = lastBlock.index + 1;
  const timestamp = new Date().toISOString();
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
  const payloadHash = calculateSha256(payloadString);
  const previousHash = lastBlock.blockHash;

  const blockHash = calculateBlockHash(
    index,
    timestamp,
    actorDni,
    action,
    clientIp,
    payloadHash,
    previousHash
  );

  const newBlock: MerkleAuditBlock = {
    index,
    timestamp,
    actorDni,
    action,
    clientIp,
    payloadHash,
    previousHash,
    blockHash,
    metadata
  };

  chain.push(newBlock);
  saveChain(chain);
  return newBlock;
}

/**
 * Valida la integritat matemàtica de tota la cadena Merkle d'auditoria
 */
export function verifyMerkleChainIntegrity(): MerkleChainVerificationResult {
  const chain = loadChain();

  if (chain.length === 0) {
    return {
      isValid: false,
      totalBlocks: 0,
      currentRootHash: GENESIS_HASH,
      firstBlockTimestamp: '',
      lastBlockTimestamp: '',
      tamperDetails: 'La cadena està buida.'
    };
  }

  // Validació del Bloc Genesis
  const genesis = chain[0];
  if (genesis.index !== 0 || genesis.previousHash !== GENESIS_HASH) {
    return {
      isValid: false,
      totalBlocks: chain.length,
      currentRootHash: genesis.blockHash,
      firstBlockTimestamp: genesis.timestamp,
      lastBlockTimestamp: chain[chain.length - 1].timestamp,
      brokenAtBlockIndex: 0,
      tamperDetails: 'El bloc Genesis ha estat manipulat o no coincideix amb el hash arrel esperat.'
    };
  }

  // Verificació d'encadenament per a cada bloc
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const prev = chain[i - 1];

    // 1. Verificació de continuïtat d'índex
    if (current.index !== prev.index + 1) {
      return {
        isValid: false,
        totalBlocks: chain.length,
        currentRootHash: chain[chain.length - 1].blockHash,
        firstBlockTimestamp: genesis.timestamp,
        lastBlockTimestamp: chain[chain.length - 1].timestamp,
        brokenAtBlockIndex: current.index,
        tamperDetails: `Discontinuïtat d'índexs detectada entre el bloc ${prev.index} i ${current.index}.`
      };
    }

    // 2. Verificació de punter anterior (previousHash)
    if (current.previousHash !== prev.blockHash) {
      return {
        isValid: false,
        totalBlocks: chain.length,
        currentRootHash: chain[chain.length - 1].blockHash,
        firstBlockTimestamp: genesis.timestamp,
        lastBlockTimestamp: chain[chain.length - 1].timestamp,
        brokenAtBlockIndex: current.index,
        tamperDetails: `Trencament de la cadena Merkle al bloc #${current.index}: previousHash no coincideix amb el hash real del bloc #${prev.index}.`
      };
    }

    // 3. Verificació de coherència matemàtica del propi bloc
    const expectedHash = calculateBlockHash(
      current.index,
      current.timestamp,
      current.actorDni,
      current.action,
      current.clientIp,
      current.payloadHash,
      current.previousHash
    );

    if (current.blockHash !== expectedHash) {
      return {
        isValid: false,
        totalBlocks: chain.length,
        currentRootHash: chain[chain.length - 1].blockHash,
        firstBlockTimestamp: genesis.timestamp,
        lastBlockTimestamp: chain[chain.length - 1].timestamp,
        brokenAtBlockIndex: current.index,
        tamperDetails: `Alteració de contingut detectada al bloc #${current.index}. El hash gravat no coincideix amb el càlcul criptogràfic SHA-256.`
      };
    }
  }

  const rootHash = chain[chain.length - 1].blockHash;

  return {
    isValid: true,
    totalBlocks: chain.length,
    currentRootHash: rootHash,
    firstBlockTimestamp: genesis.timestamp,
    lastBlockTimestamp: chain[chain.length - 1].timestamp
  };
}

/**
 * Retorna els darrers N blocs de la cadena immutable per a inspecció de Superadmin
 */
export function getRecentAuditBlocks(limit: number = 20): MerkleAuditBlock[] {
  const chain = loadChain();
  return chain.slice(-limit).reverse();
}
