/**
 * Client Repository Unificat "Cloud-First" per a BancActiu 1.0
 * Connecta totes les operacions de la interfície amb la base de dades centralitzada a la núvol (Render)
 * Implementa cua de sincronització resilient per a contingència offline.
 */

import type {
  UsuariCloud,
  CentreSanitariCloud,
  ExpedientPAOCloud,
  ComandaTallerOrtoCloud,
  EntitatComunitariaCloud,
  AuditoriaLogCloud,
} from '@/types/cloud-database';

interface QueuedMutation {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload?: unknown;
}

const QUEUE_STORAGE_KEY = 'bancactiu_offline_mutation_queue';
const CACHE_PREFIX = 'bancactiu_cloud_cache_';

// Gestió de la Cua de Mutacions Offline
function getOfflineQueue(): QueuedMutation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: QueuedMutation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    notifyQueueChange();
  } catch (err) {
    console.error('[CloudRepository] Error desant cua offline:', err);
  }
}

function enqueueMutation(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload?: unknown): void {
  const queue = getOfflineQueue();
  queue.push({
    id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    payload,
  });
  saveOfflineQueue(queue);
}

// Caching local transparent per a lectura en cas de desconnexió
function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
  } catch {
    // Si la quota està plena o mode privat
  }
}

function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

// Subscripció a canvis d'estat de connectivitat
type StatusListener = (connected: boolean, pendingCount: number) => void;
const listeners = new Set<StatusListener>();

function notifyQueueChange() {
  const pending = getOfflineQueue().length;
  listeners.forEach((fn) => fn(true, pending));
}

export function subscribeCloudStatus(callback: StatusListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Motor de Sincronització Automàtica de la Cua de Mutacions
 */
export async function syncOfflineQueue(): Promise<{ processed: number; remaining: number }> {
  if (typeof window === 'undefined') return { processed: 0, remaining: 0 };
  const queue = getOfflineQueue();
  if (queue.length === 0) return { processed: 0, remaining: 0 };

  const remaining: QueuedMutation[] = [];
  let processed = 0;

  for (const item of queue) {
    try {
      const res = await fetch(item.endpoint, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: item.payload ? JSON.stringify(item.payload) : undefined,
      });

      if (res.ok || res.status === 409) {
        processed++;
      } else if (res.status >= 500) {
        remaining.push(item);
      } else {
        processed++;
      }
    } catch {
      remaining.push(item);
      break; // Interrupció de xarxa persistent
    }
  }

  saveOfflineQueue(remaining);
  return { processed, remaining: remaining.length };
}

// Auto-sync quan es recupera la connexió
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineQueue();
  });
}

// ---------------------------------------------------------------------------
// REPOSITORI CLOUD-FIRST
// ---------------------------------------------------------------------------

export const cloudRepository = {
  // === GESTIÓ D'USUARIS ===
  usuaris: {
    async getAll(): Promise<UsuariCloud[]> {
      try {
        const res = await fetch('/api/usuaris');
        if (res.ok) {
          const data = await res.json();
          const list = (data.usuaris || []) as UsuariCloud[];
          setCache('usuaris', list);
          return list;
        }
      } catch (err) {
        console.warn('[CloudRepo] Mode contingència per a usuaris:', err);
      }
      return getCache<UsuariCloud[]>('usuaris') || [];
    },

    async create(usuari: Partial<UsuariCloud>): Promise<boolean> {
      try {
        const res = await fetch('/api/usuaris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuari),
        });
        if (res.ok) {
          return true;
        }
      } catch (err) {
        console.warn('[CloudRepo] Xarxa no disponible, emmagatzemant usuari a cua offline:', err);
        enqueueMutation('/api/usuaris', 'POST', usuari);
        return true;
      }
      return false;
    },

    async update(dni: string, updates: Partial<UsuariCloud>): Promise<boolean> {
      try {
        const res = await fetch('/api/usuaris', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dni, ...updates }),
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('[CloudRepo] Xarxa no disponible, cua offline per a actualització:', err);
        enqueueMutation('/api/usuaris', 'PUT', { dni, ...updates });
        return true;
      }
      return false;
    },

    async delete(dni: string, actorDni?: string): Promise<boolean> {
      try {
        const res = await fetch(`/api/usuaris?dni=${encodeURIComponent(dni)}&actorDni=${encodeURIComponent(actorDni || '')}`, {
          method: 'DELETE',
        });
        if (res.ok) return true;
      } catch (err) {
        enqueueMutation(`/api/usuaris?dni=${encodeURIComponent(dni)}`, 'DELETE');
        return true;
      }
      return false;
    },
  },

  // === CENTRES SANITARIS ===
  centres: {
    async getAll(filters?: { gapicId?: string; q?: string }): Promise<CentreSanitariCloud[]> {
      const params = new URLSearchParams();
      if (filters?.gapicId) params.append('gapicId', filters.gapicId);
      if (filters?.q) params.append('q', filters.q);

      const url = `/api/centres${params.toString() ? `?${params.toString()}` : ''}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const list = (data.centres || []) as CentreSanitariCloud[];
          setCache('centres', list);
          return list;
        }
      } catch (err) {
        console.warn('[CloudRepo] Mode contingència per a centres sanitaris:', err);
      }
      return getCache<CentreSanitariCloud[]>('centres') || [];
    },

    async create(centre: CentreSanitariCloud): Promise<boolean> {
      try {
        const res = await fetch('/api/centres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(centre),
        });
        if (res.ok) return true;
      } catch {
        enqueueMutation('/api/centres', 'POST', centre);
        return true;
      }
      return false;
    },
  },

  // === EXPEDIENTS PAO ===
  pao: {
    async getAll(filters?: { cipPacient?: string; estat?: string }): Promise<ExpedientPAOCloud[]> {
      const params = new URLSearchParams();
      if (filters?.cipPacient) params.append('cipPacient', filters.cipPacient);
      if (filters?.estat) params.append('estat', filters.estat);

      const url = `/api/pao${params.toString() ? `?${params.toString()}` : ''}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const list = (data.expedients || []) as ExpedientPAOCloud[];
          setCache('expedients_pao', list);
          return list;
        }
      } catch (err) {
        console.warn('[CloudRepo] Mode contingència per a expedients PAO:', err);
      }
      return getCache<ExpedientPAOCloud[]>('expedients_pao') || [];
    },

    async create(exp: Omit<ExpedientPAOCloud, 'id' | 'dataCreacio'>): Promise<ExpedientPAOCloud | null> {
      try {
        const res = await fetch('/api/pao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exp),
        });
        if (res.ok) {
          const data = await res.json();
          return data.expedient as ExpedientPAOCloud;
        }
      } catch {
        enqueueMutation('/api/pao', 'POST', exp);
      }
      return null;
    },

    async update(id: string, updates: Partial<ExpedientPAOCloud>): Promise<boolean> {
      try {
        const res = await fetch('/api/pao', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });
        if (res.ok) return true;
      } catch {
        enqueueMutation('/api/pao', 'PUT', { id, ...updates });
        return true;
      }
      return false;
    },
  },

  // === TALLER ORTOPÈDIC ===
  taller: {
    async getAll(filters?: { estatFabricacio?: string }): Promise<ComandaTallerOrtoCloud[]> {
      const params = new URLSearchParams();
      if (filters?.estatFabricacio) params.append('estatFabricacio', filters.estatFabricacio);

      const url = `/api/taller${params.toString() ? `?${params.toString()}` : ''}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const list = (data.comandes || []) as ComandaTallerOrtoCloud[];
          setCache('taller_comandes', list);
          return list;
        }
      } catch (err) {
        console.warn('[CloudRepo] Mode contingència per a comandes de taller:', err);
      }
      return getCache<ComandaTallerOrtoCloud[]>('taller_comandes') || [];
    },

    async create(cmd: Omit<ComandaTallerOrtoCloud, 'id' | 'dataCreacio'>): Promise<ComandaTallerOrtoCloud | null> {
      try {
        const res = await fetch('/api/taller', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cmd),
        });
        if (res.ok) {
          const data = await res.json();
          return data.comanda as ComandaTallerOrtoCloud;
        }
      } catch {
        enqueueMutation('/api/taller', 'POST', cmd);
      }
      return null;
    },

    async update(id: string, updates: Partial<ComandaTallerOrtoCloud>): Promise<boolean> {
      try {
        const res = await fetch('/api/taller', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });
        if (res.ok) return true;
      } catch {
        enqueueMutation('/api/taller', 'PUT', { id, ...updates });
        return true;
      }
      return false;
    },
  },

  // === ENTITATS COMUNITÀRIES ===
  entitats: {
    async getAll(filters?: { tipus?: string; municipi?: string }): Promise<EntitatComunitariaCloud[]> {
      const params = new URLSearchParams();
      if (filters?.tipus) params.append('tipus', filters.tipus);
      if (filters?.municipi) params.append('municipi', filters.municipi);

      const url = `/api/entitats${params.toString() ? `?${params.toString()}` : ''}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const list = (data.entitats || []) as EntitatComunitariaCloud[];
          setCache('entitats_comunitaries', list);
          return list;
        }
      } catch (err) {
        console.warn('[CloudRepo] Mode contingència per a entitats comunitàries:', err);
      }
      return getCache<EntitatComunitariaCloud[]>('entitats_comunitaries') || [];
    },

    async create(entitat: EntitatComunitariaCloud): Promise<boolean> {
      try {
        const res = await fetch('/api/entitats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entitat),
        });
        if (res.ok) return true;
      } catch {
        enqueueMutation('/api/entitats', 'POST', entitat);
        return true;
      }
      return false;
    },

    async update(id: string, updates: Partial<EntitatComunitariaCloud>): Promise<boolean> {
      try {
        const res = await fetch('/api/entitats', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });
        if (res.ok) return true;
      } catch {
        enqueueMutation('/api/entitats', 'PUT', { id, ...updates });
        return true;
      }
      return false;
    },
  },

  // === AUDITORIA ===
  auditoria: {
    async getRecent(limit = 100): Promise<AuditoriaLogCloud[]> {
      try {
        const res = await fetch(`/api/auditoria?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          return (data.logs || []) as AuditoriaLogCloud[];
        }
      } catch (err) {
        console.warn('[CloudRepo] Error consultant auditoria:', err);
      }
      return [];
    },
  },

  // Helper d'estat
  getPendingSyncCount(): number {
    return getOfflineQueue().length;
  },
};

export default cloudRepository;
