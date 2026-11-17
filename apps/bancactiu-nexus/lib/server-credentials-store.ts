/**
 * Magatzem de Persistència de Credencials al Servidor / Backend (Render / Node.js / Vercel Serverless)
 * Assegura que la contrasenya del Superadministrador (52622304Y), Administrador institucional
 * i resta d'usuaris persisteixi de forma immutable i xifrada (PBKDF2 SHA-512) segons RGPD / ENS Nivell Alt.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import type { SystemUser } from '@/lib/auth-security';
import { INITIAL_SYSTEM_USERS, validatePasswordSecurity } from '@/lib/auth-security';
import { hashPassword, verifyPassword } from '@/lib/crypto-security';

declare global {
  // eslint-disable-next-line no-var
  var __bancactiu_server_users__: SystemUser[] | undefined;
}

const CANDIDATE_DIRS = [
  path.join(os.homedir(), '.bancactiu'),
  path.join(os.tmpdir(), 'bancactiu_data'),
  path.join(process.cwd(), 'data'),
  path.join(process.cwd(), 'apps', 'bancactiu-nexus', 'data'),
];

/**
 * Funció de concordança d'identificador estricta i sense col·lisions
 */
export function matchesIdentifier(u: SystemUser, identifier: string): boolean {
  if (!u || !identifier) return false;
  const clean = identifier.trim().toUpperCase();
  const uDni = (u.dni || '').trim().toUpperCase();
  const uUser = (u.username || '').trim().toUpperCase();
  const uEmail = (u.email || '').trim().toUpperCase();
  const uId = (u.id || '').trim().toUpperCase();

  if (uDni === clean || uUser === clean || uEmail === clean || uId === clean) {
    return true;
  }

  // Concordança específica per al compte Administrador Institucional
  if (clean === 'ADMINISTRADOR' || clean === 'ADMIN') {
    return (
      uUser === 'ADMINISTRADOR' ||
      uDni === 'ADMINISTRADOR' ||
      uId === 'ADMINISTRADOR' ||
      uId === 'USER-ADMIN-INSTITUCIONAL'
    );
  }

  return false;
}

/**
 * Retorna un objecte d'usuari sanititzat (sense contrasenya ni historial de hashes en text pla)
 */
export function sanitizeUser(user: SystemUser): Omit<SystemUser, 'currentPassword' | 'passwordHistory'> {
  const { currentPassword: _p, passwordHistory: _h, ...safe } = user;
  return safe;
}

/**
 * Inicialitza i llegeix els usuaris persistits al servidor
 */
export function getServerUsers(): SystemUser[] {
  try {
    // 1. Si ja tenim memòria viva a la instància/procés Node.js amb contrasenyes actualitzades
    if (globalThis.__bancactiu_server_users__ && globalThis.__bancactiu_server_users__.length > 0) {
      const hasCustomPassInMemory = globalThis.__bancactiu_server_users__.some(
        (u) => u.mustChangePassword === false && u.currentPassword && u.currentPassword !== '1234'
      );
      if (hasCustomPassInMemory) {
        return globalThis.__bancactiu_server_users__;
      }
    }

    let parsed: SystemUser[] | null = null;

    // 2. Cercar a tots els directoris candidats un fitxer amb contrasenyes personalitzades guardades
    for (const dir of CANDIDATE_DIRS) {
      const candidateFile = path.join(dir, 'db_credentials_users.json');
      if (fs.existsSync(candidateFile)) {
        try {
          const content = fs.readFileSync(candidateFile, 'utf-8');
          const list = JSON.parse(content) as SystemUser[];
          if (Array.isArray(list) && list.length > 0) {
            const hasCustom = list.some(
              (u) => u.mustChangePassword === false && u.currentPassword && u.currentPassword !== '1234'
            );
            if (hasCustom) {
              parsed = list;
              break; // Trobada la versió més recent amb contrasenyes personalitzades
            } else if (!parsed) {
              parsed = list;
            }
          }
        } catch (err) {
          console.warn(`[ServerCredentialsStore] Error llegint ${candidateFile}:`, err);
        }
      }
    }

    // 3. Si no hi ha cap fitxer de persistència, inicialitzar amb els usuaris de base
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      parsed = INITIAL_SYSTEM_USERS.map((u) => ({
        ...u,
        currentPassword: u.currentPassword.startsWith('$pbkdf2$')
          ? u.currentPassword
          : hashPassword(u.currentPassword),
      }));
    }

    // 4. Garantir que els comptes claus existeixin sempre (Administrador, 52622304Y, 48956602Z)
    const criticalAccounts = ['ADMINISTRADOR', '52622304Y', '48956602Z'];
    for (const crit of criticalAccounts) {
      const exists = parsed.some((u) => matchesIdentifier(u, crit));
      if (!exists) {
        const initial = INITIAL_SYSTEM_USERS.find((u) => matchesIdentifier(u, crit));
        if (initial) {
          parsed.unshift({
            ...initial,
            currentPassword: initial.currentPassword.startsWith('$pbkdf2$')
              ? initial.currentPassword
              : hashPassword(initial.currentPassword),
          });
        }
      }
    }

    globalThis.__bancactiu_server_users__ = parsed;
    saveServerUsers(parsed);
    return parsed;
  } catch (error) {
    console.error('[ServerCredentialsStore] Error fatal a getServerUsers:', error);
    const fallback = INITIAL_SYSTEM_USERS.map((u) => ({
      ...u,
      currentPassword: u.currentPassword.startsWith('$pbkdf2$')
        ? u.currentPassword
        : hashPassword(u.currentPassword),
    }));
    globalThis.__bancactiu_server_users__ = fallback;
    return fallback;
  }
}

/**
 * Desa la col·lecció d'usuaris tant en memòria global com a tots els directoris candidats persistents
 */
export function saveServerUsers(users: SystemUser[]): void {
  try {
    globalThis.__bancactiu_server_users__ = users;

    for (const dir of CANDIDATE_DIRS) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(dir, 'db_credentials_users.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
      } catch {
        // En entorns de només lectura (com Vercel Serverless /var/task), continua amb els directoris escrivibles
      }
    }
  } catch (error) {
    console.error('[ServerCredentialsStore] Error desant usuaris al servidor:', error);
  }
}

/**
 * Desa directament la nova contrasenya d'un usuari regularitzat (primer inici)
 */
export function saveUserPasswordDirect(
  identifier: string,
  newHash: string,
  history: string[]
): boolean {
  try {
    const users = getServerUsers();
    let userIdx = users.findIndex((u) => matchesIdentifier(u, identifier));

    if (userIdx === -1) {
      const initialMatch = INITIAL_SYSTEM_USERS.find((u) => matchesIdentifier(u, identifier));
      if (initialMatch) {
        users.push({ ...initialMatch });
        userIdx = users.length - 1;
      }
    }

    if (userIdx !== -1) {
      const rawHistory = Array.isArray(history) ? history : [];
      // Assegurar que el nou hash sigui el primer i un màxim de 10
      const cleanHistory = [newHash, ...rawHistory.filter((h) => h !== newHash)].slice(0, 10);

      users[userIdx] = {
        ...users[userIdx],
        currentPassword: newHash,
        mustChangePassword: false,
        passwordHistory: cleanHistory,
        lastPasswordChangeDate: new Date().toISOString(),
        failedLoginAttempts: 0,
        lockoutUntil: null,
      };

      saveServerUsers(users);
      return true;
    }
    return false;
  } catch (err) {
    console.error('[ServerCredentialsStore] Error a saveUserPasswordDirect:', err);
    return false;
  }
}

/**
 * Actualitza la contrasenya d'un usuari al servidor aplicant hash criptogràfic PBKDF2
 */
export function updateServerUserPassword(
  dniOrUsername: string,
  passwordActual: string,
  passwordNova: string
): { ok: boolean; missatge: string; user?: Omit<SystemUser, 'currentPassword' | 'passwordHistory'> } {
  const users = getServerUsers();
  const userIdx = users.findIndex((u) => matchesIdentifier(u, dniOrUsername));

  if (userIdx === -1) {
    return {
      ok: false,
      missatge: `No s'ha trobat cap usuari amb DNI/Identificador ${dniOrUsername} a la base de dades.`,
    };
  }

  const user = users[userIdx];

  // Comprova que la contrasenya actual sigui correcta mitjançant comparació segura
  const isMatch = verifyPassword(passwordActual.trim(), user.currentPassword);
  if (!isMatch) {
    return {
      ok: false,
      missatge: 'La contrasenya actual proporcionada no és correcta.',
    };
  }

  // Valida la seguretat de la nova contrasenya
  const history = Array.isArray(user.passwordHistory) ? user.passwordHistory : [];
  const validation = validatePasswordSecurity(passwordNova, history);
  if (!validation.isValid) {
    return {
      ok: false,
      missatge: validation.errors[0] || 'La contrasenya no compleix els criteris de seguretat.',
    };
  }

  // Xifratge criptogràfic PBKDF2 segons RGPD
  const newHashed = hashPassword(passwordNova.trim());

  // Afegeix la contrasenya a l'historial (fins a 10)
  const updatedHistory = [newHashed, ...history.filter((h) => h !== newHashed)].slice(0, 10);

  const updatedUser: SystemUser = {
    ...user,
    currentPassword: newHashed,
    mustChangePassword: false,
    lastPasswordChangeDate: new Date().toISOString(),
    passwordHistory: updatedHistory,
    failedLoginAttempts: 0,
    lockoutUntil: null,
  };

  users[userIdx] = updatedUser;
  saveServerUsers(users);

  return {
    ok: true,
    missatge: 'Contrasenya actualitzada i xifrada correctament a la base de dades central de BancActiu.',
    user: sanitizeUser(updatedUser),
  };
}

/**
 * Autentica un usuari contra la base de dades central del servidor amb hash segur
 */
export function authenticateServerUser(
  identifier: string,
  passwordAttempt: string
): {
  ok: boolean;
  user?: SystemUser;
  sanitizedUser?: Omit<SystemUser, 'currentPassword' | 'passwordHistory'>;
  reason?: 'NOT_FOUND' | 'INVALID_PASSWORD' | 'MUST_CHANGE_PASSWORD' | 'EXPIRED_PASSWORD' | 'ACCOUNT_LOCKED';
  missatge?: string;
} {
  const users = getServerUsers();
  const cleanPass = passwordAttempt.trim();

  const userIdx = users.findIndex((u) => matchesIdentifier(u, identifier));

  if (userIdx === -1) {
    return {
      ok: false,
      reason: 'NOT_FOUND',
      missatge: 'Identificador o DNI no registrat al servidor.',
    };
  }

  const user = users[userIdx];

  // Comprova bloqueig temporal per atacs de força bruta
  if (user.lockoutUntil) {
    const lockoutExpiry = new Date(user.lockoutUntil).getTime();
    const now = Date.now();
    if (now < lockoutExpiry) {
      const minutesRemaining = Math.max(1, Math.ceil((lockoutExpiry - now) / (60 * 1000)));
      return {
        ok: false,
        sanitizedUser: sanitizeUser(user),
        reason: 'ACCOUNT_LOCKED',
        missatge: `Compte bloquejat al servidor per seguretat. Resten ${minutesRemaining} minuts.`,
      };
    } else {
      user.lockoutUntil = null;
      user.failedLoginAttempts = 0;
      saveServerUsers(users);
    }
  }

  // Si l'usuari ja té configurada una contrasenya definitiva, invalidar el "1234" provisional
  const hasCustomPassword = user.mustChangePassword === false && user.currentPassword !== '1234';
  if (hasCustomPassword && cleanPass === '1234') {
    return {
      ok: false,
      sanitizedUser: sanitizeUser(user),
      reason: 'INVALID_PASSWORD',
      missatge: "Clau d'accés incorrecta. La clau provisional 1234 ha quedat invalidada.",
    };
  }

  // Comprova contrasenya amb suport per hash PBKDF2
  const isMatch = verifyPassword(cleanPass, user.currentPassword);
  if (!isMatch) {
    const attempts = (user.failedLoginAttempts || 0) + 1;
    user.failedLoginAttempts = attempts;
    if (attempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      saveServerUsers(users);
      return {
        ok: false,
        sanitizedUser: sanitizeUser(user),
        reason: 'ACCOUNT_LOCKED',
        missatge: "S'ha superat el límit d'intents. Compte bloquejat 15 minuts al servidor.",
      };
    }
    saveServerUsers(users);
    return {
      ok: false,
      sanitizedUser: sanitizeUser(user),
      reason: 'INVALID_PASSWORD',
      missatge: `Contrasenya incorrecta. Intents restants: ${5 - attempts}.`,
    };
  }

  // Migració transparent a PBKDF2 si encara era en text pla
  if (!user.currentPassword.startsWith('$pbkdf2$')) {
    user.currentPassword = hashPassword(cleanPass);
    saveServerUsers(users);
  }

  // Reset intents fallits
  if (user.failedLoginAttempts || user.lockoutUntil) {
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    saveServerUsers(users);
  }

  // Primer inici o canvi obligatori
  if (user.mustChangePassword) {
    return {
      ok: false,
      user,
      sanitizedUser: sanitizeUser(user),
      reason: 'MUST_CHANGE_PASSWORD',
      missatge: 'Primer inici de sessió detectat. Cal canviar la contrasenya provisional.',
    };
  }

  return {
    ok: true,
    user,
    sanitizedUser: sanitizeUser(user),
    missatge: 'Autenticació correcta al servidor central.',
  };
}
