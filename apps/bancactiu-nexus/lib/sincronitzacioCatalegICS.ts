/**
 * SISTEMA DE SINCRONITZACIÓ I VERIFICACIÓ AUTOMÀTICA DEL CATÀLEG TERRITORIAL ICS
 * BancActiu 1.0 - CatSalut / ICS
 */

import { CENS_OFICIAL_CENTRES_ICS } from '@/lib/seedCentresICS';
import type { CentreSanitari } from '@/types/salut';

export interface CatalegManifest {
  versio: string;
  dataActualitzacio: string;
  totalCentres: number;
  checksum: string;
}

export interface SincronitzacioResult {
  actualitzat: boolean;
  versio: string;
  totalCentres: number;
  origen: 'xarxa' | 'cache_local' | 'estatic_fallback';
  error?: string;
}

export const STORAGE_KEY_VERSIO_INSTALADA = 'bancactiu_ics_versio_instalada';
export const STORAGE_KEY_CATALEG_COMPLET = 'bancactiu_cataleg_centres_complet';
export const EVENT_CATALEG_ACTUALITZAT = 'bancactiu_cataleg_actualitzat';

/**
 * Consulta de forma ultralleugera el manifest de versions del catàleg.
 * Si hi ha una nova versió o no existeix còpia local, descarrega en segon pla
 * l'organigrama complet, valida la integritat del JSON, actualitza localStorage
 * i emet un esdeveniment reactiu per actualitzar la interfície a l'instant.
 * Si l'entorn és offline, manté de forma resilient la còpia existent sense fallar.
 */
export async function verificarIActualitzarCatalegICS(): Promise<SincronitzacioResult> {
  if (typeof window === 'undefined') {
    return {
      actualitzat: false,
      versio: '2026.11.1',
      totalCentres: CENS_OFICIAL_CENTRES_ICS.length,
      origen: 'estatic_fallback',
    };
  }

  try {
    const versioInstalada = localStorage.getItem(STORAGE_KEY_VERSIO_INSTALADA);

    // 1. Consulta lleugera del manifest amb prevenció de memòria cau
    const manifestRes = await fetch('/data/cataleg_manifest.json', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!manifestRes.ok) {
      throw new Error(`El manifest no s'ha pogut obtenir (estat ${manifestRes.status})`);
    }

    const manifest: CatalegManifest = await manifestRes.json();

    // 2. Comprovació de versió instal·lada i presència de dades
    const coincideix = versioInstalada === manifest.versio || versioInstalada === manifest.checksum;
    const rawLocal = localStorage.getItem(STORAGE_KEY_CATALEG_COMPLET) || localStorage.getItem('bancactiu_cataleg_centres_complet_v2');
    let teDadesValides = false;

    if (rawLocal) {
      try {
        const parsed = JSON.parse(rawLocal);
        teDadesValides = Array.isArray(parsed) && parsed.length >= manifest.totalCentres;
      } catch {
        teDadesValides = false;
      }
    }

    if (coincideix && teDadesValides) {
      return {
        actualitzat: false,
        versio: manifest.versio,
        totalCentres: manifest.totalCentres,
        origen: 'cache_local',
      };
    }

    // 3. Descàrrega en segon pla de l'organigrama complet
    const dataRes = await fetch('/data/organigrama_ics_centres.json', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!dataRes.ok) {
      throw new Error(`No s'ha pogut descarregar el cens complet (estat ${dataRes.status})`);
    }

    const data = await dataRes.json();
    if (!data || !Array.isArray(data.centres) || data.centres.length === 0) {
      throw new Error("L'arxiu organigrama_ics_centres.json no conté un cens vàlid.");
    }

    // 4. Preservació de centres personalitzats afegits per l'administrador
    let centresLocals: CentreSanitari[] = [];
    if (rawLocal) {
      try {
        centresLocals = JSON.parse(rawLocal);
      } catch {
        centresLocals = [];
      }
    }

    const customCentres = centresLocals.filter(
      (local) => !data.centres.some((c: CentreSanitari) => c.id === local.id)
    );

    const centresFinals: CentreSanitari[] = [...data.centres, ...customCentres];

    // 5. Sobreescriptura atòmica de la memòria cau local
    localStorage.setItem(STORAGE_KEY_CATALEG_COMPLET, JSON.stringify(centresFinals));
    localStorage.setItem('bancactiu_cataleg_centres_complet_v2', JSON.stringify(centresFinals));
    localStorage.setItem(STORAGE_KEY_VERSIO_INSTALADA, manifest.versio);

    // 6. Emissió d'esdeveniments per sincronitzar en calent tots els components actius
    window.dispatchEvent(
      new CustomEvent(EVENT_CATALEG_ACTUALITZAT, {
        detail: {
          versio: manifest.versio,
          total: centresFinals.length,
          dataActualitzacio: manifest.dataActualitzacio,
        },
      })
    );
    window.dispatchEvent(new Event(EVENT_CATALEG_ACTUALITZAT));
    window.dispatchEvent(new CustomEvent('territorial-catalog-updated', { detail: centresFinals }));
    window.dispatchEvent(new CustomEvent('bancactiu-cataleg-updated', { detail: centresFinals }));

    return {
      actualitzat: true,
      versio: manifest.versio,
      totalCentres: centresFinals.length,
      origen: 'xarxa',
    };
  } catch (error) {
    // Mode resilient / contingència: utilitza la còpia local o el cens estàtic integrat
    try {
      if (!localStorage.getItem(STORAGE_KEY_CATALEG_COMPLET)) {
        localStorage.setItem(STORAGE_KEY_CATALEG_COMPLET, JSON.stringify(CENS_OFICIAL_CENTRES_ICS));
        localStorage.setItem('bancactiu_cataleg_centres_complet_v2', JSON.stringify(CENS_OFICIAL_CENTRES_ICS));
        localStorage.setItem(STORAGE_KEY_VERSIO_INSTALADA, '2026.11.1');
      }
    } catch {
      // ignore
    }

    const versioRetorn = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_VERSIO_INSTALADA)) || '2026.11.1';
    return {
      actualitzat: false,
      versio: versioRetorn,
      totalCentres: CENS_OFICIAL_CENTRES_ICS.length,
      origen: 'estatic_fallback',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Retorna la versió instal·lada del catàleg sanitari.
 */
export function getVersioInstaladaICS(): string {
  if (typeof window === 'undefined') return '2026.11.1';
  return localStorage.getItem(STORAGE_KEY_VERSIO_INSTALADA) || '2026.11.1';
}
