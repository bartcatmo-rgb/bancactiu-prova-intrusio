/**
 * Gestor i Seeder del Cens d'Entitats Col·laboradores Externes per a BancActiu 1.0
 * (Creu Roja i Associacions de Veïns amb banc de material ortoprotèsic)
 */

import type { EntitatColaboradora, EstatConveniEntitat, TipusEntitat } from '@/types/entitatsColaboradores';
import type { DemoEntity } from '@/types/demo-user';

// Importació de dades llavor oficials
import censAssociacionsJson from '@/public/data/cens_associacions_veins_catalunya.json';
import censCreuRojaJson from '@/public/data/cens_creu_roja_banc_orto.json';

export const STORAGE_KEY_ENTITATS_COMUNITARIES = 'bancactiu_cens_entitats_comunitaries';

/**
 * Llista llavor combinada d'entitats
 */
export const CENS_OFICIAL_ENTITATS_BASE: EntitatColaboradora[] = [
  ...(censCreuRojaJson as EntitatColaboradora[]),
  ...(censAssociacionsJson as EntitatColaboradora[])
];

/**
 * Converteix una EntitatColaboradora a DemoEntity per a la compatibilitat amb el sistema de permisos i mòduls
 */
export function entitatColaboradoraToDemoEntity(ent: EntitatColaboradora): DemoEntity {
  const kind: DemoEntity['kind'] = ent.tipus === 'ASSOCIACIO_VEINS' 
    ? 'ENTIDAD_VECINAL' 
    : 'ENTIDAD_COLABORADORA';

  const capabilities: string[] = [];
  if (ent.serveisDisponibles.bancMaterialOrtoprotesic) {
    capabilities.push('Préstecs Comunitaris', 'Custòdia & Dipòsits de Garantia');
  }
  if (ent.serveisDisponibles.suportComunitari) {
    capabilities.push('Atenció d’Urgència & Vulnerabilitat');
  }
  if (ent.serveisDisponibles.mantenimentBasic) {
    capabilities.push('Manteniment & ITV Ortopèdica');
  }
  if (ent.serveisDisponibles.recollidaDonacions) {
    capabilities.push('Recollida i Triatge de Donacions');
  }

  return {
    id: ent.id,
    name: ent.nomOficial,
    kind,
    location: `${ent.adrecaSeu}, ${ent.municipi} (${ent.comarca})`,
    contact: ent.responsableNom ? `${ent.responsableNom}${ent.emailContacte ? ` - ${ent.emailContacte}` : ''}` : (ent.emailContacte || 'Coordinació Comunitària'),
    phone: ent.telefonContacte || 'Sense telèfon registrat',
    active: ent.estatConveni === 'CONVENI_ACTIU',
    capabilities: capabilities.length > 0 ? capabilities : ['Préstecs Comunitaris'],
  };
}

/**
 * Inicialitza i obté el cens complet d'entitats amb persistència a localStorage
 */
export function getCensEntitatsComunitaries(): EntitatColaboradora[] {
  if (typeof window === 'undefined') {
    return CENS_OFICIAL_ENTITATS_BASE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTITATS_COMUNITARIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ENTITATS_COMUNITARIES, JSON.stringify(CENS_OFICIAL_ENTITATS_BASE));
      return CENS_OFICIAL_ENTITATS_BASE;
    }
    const parsed = JSON.parse(raw) as EntitatColaboradora[];
    
    // Assegurar que si s'han afegit noves entitats al cens base, no es perdin
    const existingIds = new Set(parsed.map(e => e.id));
    let hasNew = false;
    for (const baseEnt of CENS_OFICIAL_ENTITATS_BASE) {
      if (!existingIds.has(baseEnt.id)) {
        parsed.push(baseEnt);
        hasNew = true;
      }
    }
    if (hasNew) {
      localStorage.setItem(STORAGE_KEY_ENTITATS_COMUNITARIES, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.warn('[CensEntitats] Error llegint localStorage:', err);
    return CENS_OFICIAL_ENTITATS_BASE;
  }
}

/**
 * Guarda o actualitza el cens complet
 */
export function guardarCensEntitatsComunitaries(entitats: EntitatColaboradora[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ENTITATS_COMUNITARIES, JSON.stringify(entitats));
  } catch (err) {
    console.error('[CensEntitats] Error desant a localStorage:', err);
  }
}

/**
 * Cerca predictiva sobre el cens oficial (cerca per nom, municipi, comarca o adreça seu)
 */
export function searchPredictiveEntitats(
  query: string,
  filterTipus?: TipusEntitat,
  filterEstat?: EstatConveniEntitat
): EntitatColaboradora[] {
  const all = getCensEntitatsComunitaries();
  const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return all.filter((ent) => {
    if (filterTipus && ent.tipus !== filterTipus) return false;
    if (filterEstat && ent.estatConveni !== filterEstat) return false;

    if (!q) return true;

    const nomNorm = ent.nomOficial.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nomCurtNorm = (ent.nomCurt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const municipiNorm = ent.municipi.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const comarcaNorm = ent.comarca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const adrecaNorm = ent.adrecaSeu.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const idNorm = ent.id.toLowerCase();

    return (
      nomNorm.includes(q) ||
      nomCurtNorm.includes(q) ||
      municipiNorm.includes(q) ||
      comarcaNorm.includes(q) ||
      adrecaNorm.includes(q) ||
      idNorm.includes(q)
    );
  });
}

/**
 * Activa o actualitza el conveni d'una entitat i la incorpora amb plenes capacitats al sistema
 */
export function activarConveniEntitat(
  entitatId: string,
  actualitzacio?: Partial<EntitatColaboradora>
): { entitat: EntitatColaboradora; demoEntity: DemoEntity } | null {
  const all = getCensEntitatsComunitaries();
  const idx = all.findIndex((e) => e.id === entitatId);

  if (idx === -1) {
    console.error(`[CensEntitats] No s'ha trobat l'entitat amb id ${entitatId}`);
    return null;
  }

  const dataAvui = new Date().toISOString().split('T')[0];
  const entitatActualitzada: EntitatColaboradora = {
    ...all[idx],
    ...actualitzacio,
    estatConveni: 'CONVENI_ACTIU',
    dataConveni: actualitzacio?.dataConveni || all[idx].dataConveni || dataAvui,
  };

  all[idx] = entitatActualitzada;
  guardarCensEntitatsComunitaries(all);

  const demoEntity = entitatColaboradoraToDemoEntity(entitatActualitzada);
  return { entitat: entitatActualitzada, demoEntity };
}

/**
 * Obté les entitats que disposen de conveni actiu i servei de préstec ortoprotèsic
 * (utilitzat per prescripcions PAO i punts de recollida de taller ortopèdic)
 */
export function getPuntsRecollidaComunitarisActius(): {
  id: string;
  nom: string;
  adreca: string;
  municipi: string;
  telefon?: string;
  tipus: TipusEntitat;
}[] {
  const cens = getCensEntitatsComunitaries();
  return cens
    .filter(
      (e) =>
        e.estatConveni === 'CONVENI_ACTIU' &&
        e.serveisDisponibles.bancMaterialOrtoprotesic
    )
    .map((e) => ({
      id: e.id,
      nom: e.nomOficial,
      adreca: e.adrecaSeu,
      municipi: e.municipi,
      telefon: e.telefonContacte,
      tipus: e.tipus,
    }));
}
