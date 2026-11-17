import type { InventariItem, Reserva } from '@/types/api';
import type { DemoEntity } from '@/types/demo-user';
import { getCensEntitatsComunitaries, entitatColaboradoraToDemoEntity } from '@/lib/seedEntitatsComunitaries';
import { cloudRepository } from '@/lib/cloud-repository';

export const TALLER_STORAGE_KEY = 'bancactiu_taller_ortopedic_cache_v1';
export const TALLER_INVENTARI_KEY = 'bancactiu_taller_inventari_v1';
export const TALLER_RESERVAS_KEY = 'bancactiu_taller_reservas_v1';
export const TALLER_ENTITATS_KEY = 'bancactiu_taller_entitats_v1';

export const DEFAULT_OFFLINE_ENTITIES: DemoEntity[] = [
  { id: 'CAP', name: 'Centro de Atención Primaria', kind: 'CAP', location: 'Atención Primaria', contact: 'uac@salut.cat', phone: '972 00 00 01', active: true },
  { id: 'ENT-01', name: 'Associació Veïnal Nord', kind: 'ENTIDAD_VECINAL', location: 'Salt Nord', contact: 'veinalnord@bancactiu.cat', phone: '972 11 22 33', active: true },
  { id: 'ENT-02', name: 'Creu Roja', kind: 'ENTIDAD_COLABORADORA', location: 'Salt Centre', contact: 'creuroja@bancactiu.cat', phone: '972 44 55 66', active: true },
  { id: 'TALLER-CENTRAL', name: 'Taller Ortopèdic Central', kind: 'TECNICA', location: 'Polígon Sanitari Salt', contact: 'taller@salut.cat', phone: '972 77 88 99', active: true },
];

export const DEFAULT_OFFLINE_INVENTARI: InventariItem[] = [
  { id: 'SR-01', tipo: 'Cadira de rodes', estado: 'Prestat', id_entitat: 'ENT-01', obs: 'Interior, rodes posteriors petites, ample estàndard 42cm' },
  { id: 'SR-02', tipo: 'Cadira de rodes', estado: 'Prestat', id_entitat: 'ENT-02', obs: 'Exterior, rodes grans autopropulsables, xassís alumini lleuger' },
  { id: 'SR-03', tipo: 'Cadira de rodes', estado: 'Disponible', id_entitat: 'ENT-02', obs: 'Exterior reforçada bariàtrica, ample especial >100 kg' },
  { id: 'SR-04', tipo: 'Cadira de rodes', estado: 'En Manteniment', id_entitat: 'TALLER-CENTRAL', obs: 'Revisió i canvi de rodaments davanters i ajustament de frens' },
  { id: 'CM-01', tipo: 'Caminador', estado: 'Disponible', id_entitat: 'TALLER-CENTRAL', obs: 'Caminador 4 rodes amb reposapeus i seient entapissat' },
  { id: 'CM-02', tipo: 'Caminador', estado: 'Prestat', id_entitat: 'ENT-01', obs: 'Pas a pas plegable, alçada regulable amb empunyadures anatòmiques' },
  { id: 'CM-03', tipo: 'Caminador', estado: 'Reservat', id_entitat: 'ENT-02', obs: 'Dues rodes davanteres amb tacs posteriors antilliscants' },
  { id: 'CR-01', tipo: 'Crosses', estado: 'En Manteniment', id_entitat: 'TALLER-CENTRAL', obs: 'Substitució de conteres de cautxú i reajustament de clips' },
  { id: 'CR-02', tipo: 'Crosses', estado: 'Disponible', id_entitat: 'ENT-01', obs: 'Crosses alumini mida adult amb recolzabraços anatòmic' },
  { id: 'CR-03', tipo: 'Crosses', estado: 'Disponible', id_entitat: 'ENT-02', obs: 'Bastó anglès amb amortiment i adherència d’alta seguretat' },
  { id: 'PR-01', tipo: 'Pròtesi / Ortesi', estado: 'En Manteniment', id_entitat: 'TALLER-CENTRAL', obs: 'Pròtesi tibial provisional: alineació dinàmica i ajustament d’encaix' },
  { id: 'ORT-01', tipo: 'Pròtesi / Ortesi', estado: 'En Manteniment', id_entitat: 'TALLER-CENTRAL', obs: 'Ortesi de genoll regulable KAFO amb bloqueig d’extensió' },
  { id: 'ORT-02', tipo: 'Pròtesi / Ortesi', estado: 'Disponible', id_entitat: 'TALLER-CENTRAL', obs: 'Fèrula postural antiequí termoconformada tipus Rancho Los Amigos' },
  { id: 'ORT-03', tipo: 'Pròtesi / Ortesi', estado: 'Disponible', id_entitat: 'TALLER-CENTRAL', obs: 'Cotilla bivalva d’immobilització dorsolumbar CatSalut' },
  { id: 'LL-01', tipo: 'Llit articulat', estado: 'Prestat', id_entitat: 'ENT-01', obs: 'Llit assistencial elèctric de 4 plans amb carro elevador' },
  { id: 'GR-01', tipo: 'Grua de transferència', estado: 'Disponible', id_entitat: 'ENT-02', obs: 'Grua hidràulica de trasllat domiciliari amb arnès universal' },
  { id: 'CX-01', tipo: 'Coixí antiescares', estado: 'Disponible', id_entitat: 'ENT-01', obs: 'Coixí de cel·les d’aire interconnectades alta prevenció' },
];

export const DEFAULT_OFFLINE_RESERVAS: Reserva[] = [
  {
    id_reserva: 20260001,
    cip: 'MART780512M01',
    nom_ciutada: 'Maria Martorell Valls',
    telefon: '600112233',
    email: 'maria.martorell@exemple.cat',
    tipo_material: 'Cadira de rodes',
    id_entitat_actual: 'ENT-01',
    estat_reserva: 'Lliurat al veí',
    empleat_cap: 'Mireia Vidal Soler (UAC Pilot)',
    data_indicacio: '2026-10-15',
    data_entrega: '2026-10-16',
    data_venciment: '2026-12-15',
    durada_mesos: 2,
    id_producte_assignat: 'SR-01',
    producte_descripcio: 'Cadira de rodes interior estàndard 42cm',
    motiu_categoria: 'POST_QUIRURGIC_TRAUMA',
    motiu_descripcio: 'Fractura coll de fèmur esquerre - Postquirúrgic recent',
    motiu_origen: 'CAP_CLINIC',
  },
  {
    id_reserva: 20260002,
    cip: 'GOME520114D01',
    nom_ciutada: 'Dolors Gómez Garriga',
    telefon: '611223344',
    email: 'dolors.gomez@exemple.cat',
    tipo_material: 'Cadira de rodes',
    id_entitat_actual: 'ENT-02',
    estat_reserva: 'Lliurat al veí',
    empleat_cap: 'Dr. Jordi Gutiérrez (Facultatiu CAP)',
    data_indicacio: '2026-09-20',
    data_entrega: '2026-09-22',
    data_venciment: '2026-12-20',
    durada_mesos: 3,
    id_producte_assignat: 'SR-02',
    producte_descripcio: 'Cadira de rodes exterior alumini lleuger',
    motiu_categoria: 'NEUROLOGIC_ICTUS',
    motiu_descripcio: 'Ictus isquèmic amb hemiparèsia dreta en rehabilitació',
    motiu_origen: 'CAP_CLINIC',
  },
  {
    id_reserva: 20260003,
    cip: 'RODR640921H02',
    nom_ciutada: 'Jordi Rodríguez Font',
    telefon: '622334455',
    email: 'jordi.rodriguez@exemple.cat',
    tipo_material: 'Caminador',
    id_entitat_actual: 'ENT-01',
    estat_reserva: 'Lliurat al veí',
    empleat_cap: 'Mireia Vidal Soler (UAC Pilot)',
    data_indicacio: '2026-10-02',
    data_entrega: '2026-10-04',
    data_venciment: '2026-11-02',
    durada_mesos: 1,
    id_producte_assignat: 'CM-02',
    producte_descripcio: 'Caminador pas a pas regulable',
    motiu_categoria: 'DETERIORAMENT_FRAGILITAT',
    motiu_descripcio: 'Dificultat per caminar i síndrome de por a la marxa post-caiguda',
    motiu_origen: 'ENTITAT_COMUNITARI',
  },
  {
    id_reserva: 20260006,
    cip: 'SERR710819H01',
    nom_ciutada: 'Antoni Serra Blanch',
    telefon: '655667788',
    email: 'antoni.serra@exemple.cat',
    tipo_material: 'Caminador',
    id_entitat_actual: 'ENT-02',
    estat_reserva: 'Pendent de recollida',
    empleat_cap: 'Mireia Vidal Soler (UAC Pilot)',
    data_indicacio: '2026-11-01',
    data_venciment: '2026-12-01',
    durada_mesos: 1,
    id_producte_assignat: 'CM-03',
    producte_descripcio: 'Caminador dues rodes davanteres',
    motiu_categoria: 'CONVALESCENCIA_AGUTA',
    motiu_descripcio: 'Convalescència post-ingrés hospitalari',
    motiu_origen: 'ENTITAT_COMUNITARI',
  },
  {
    id_reserva: 20260010,
    cip: 'PONS500318H01',
    nom_ciutada: 'Salvador Pons Ribas',
    telefon: '688990011',
    email: 'salvador.pons@exemple.cat',
    tipo_material: 'Llit articulat',
    id_entitat_actual: 'ENT-01',
    estat_reserva: 'Lliurat al veí',
    empleat_cap: 'Dr. Jordi Gutiérrez (Facultatiu CAP)',
    data_indicacio: '2026-10-18',
    data_entrega: '2026-10-20',
    data_venciment: '2027-01-20',
    durada_mesos: 3,
    id_producte_assignat: 'LL-01',
    producte_descripcio: 'Llit assistencial elèctric amb carro elevador',
    motiu_categoria: 'TRAMIT_PAO_TRANSITORI',
    motiu_descripcio: 'Prescripció PAO CatSalut Catàleg Oficial en tràmit urgent',
    motiu_origen: 'CAP_CLINIC',
  },
];

export interface TallerOfflinePackage {
  reservas: Reserva[];
  inventari: InventariItem[];
  entities: DemoEntity[];
  lastUpdated: string;
}

/**
 * Carrega les dades del taller ortopèdic i xarxa compartida des de localStorage amb fallback segur
 */
export function loadTallerOfflineData(): TallerOfflinePackage {
  if (typeof window === 'undefined') {
    return {
      reservas: DEFAULT_OFFLINE_RESERVAS,
      inventari: DEFAULT_OFFLINE_INVENTARI,
      entities: DEFAULT_OFFLINE_ENTITIES,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Combinem amb entitats comunitàries actives del cens de Catalunya
  const mergeAmbEntitatsComunitaries = (baseEntities: DemoEntity[]): DemoEntity[] => {
    try {
      const cens = getCensEntitatsComunitaries();
      const actives = cens.filter(e => e.estatConveni === 'CONVENI_ACTIU');
      const existingIds = new Set(baseEntities.map(e => e.id));
      const res = [...baseEntities];
      for (const ent of actives) {
        if (!existingIds.has(ent.id)) {
          res.push(entitatColaboradoraToDemoEntity(ent));
          existingIds.add(ent.id);
        }
      }
      return res;
    } catch {
      return baseEntities;
    }
  };

  try {
    const raw = localStorage.getItem(TALLER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.inventari) && Array.isArray(parsed?.reservas) && Array.isArray(parsed?.entities)) {
        return {
          reservas: parsed.reservas,
          inventari: parsed.inventari,
          entities: mergeAmbEntitatsComunitaries(parsed.entities),
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Error llegint memòria local del taller ortopèdic:', err);
  }

  // Inicialització per primer cop
  const initialEntities = mergeAmbEntitatsComunitaries(DEFAULT_OFFLINE_ENTITIES);
  const initialPackage: TallerOfflinePackage = {
    reservas: DEFAULT_OFFLINE_RESERVAS,
    inventari: DEFAULT_OFFLINE_INVENTARI,
    entities: initialEntities,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(TALLER_STORAGE_KEY, JSON.stringify(initialPackage));
  } catch {
    // ignore quota issues
  }

  return initialPackage;
}

/**
 * Desa el paquet complet de dades del taller a localStorage i notifica als components oberts
 */
export function saveTallerOfflineData(data: {
  reservas?: Reserva[];
  inventari?: InventariItem[];
  entities?: DemoEntity[];
}): TallerOfflinePackage {
  const current = loadTallerOfflineData();
  const updated: TallerOfflinePackage = {
    reservas: data.reservas ?? current.reservas,
    inventari: data.inventari ?? current.inventari,
    entities: data.entities ?? current.entities,
    lastUpdated: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TALLER_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bancactiu_taller_updated', { detail: updated }));
    } catch (err) {
      console.warn('Error desant paquet offline de taller:', err);
    }
  }

  return updated;
}

/**
 * Actualitza l'estat d'un article de l'inventari al magatzem local persistent
 */
export function updateTallerInventariItem(id: string, updates: Partial<InventariItem>): InventariItem {
  const current = loadTallerOfflineData();
  let updatedItem: InventariItem | null = null;

  const newInventari = current.inventari.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates };
      return updatedItem;
    }
    return item;
  });

  if (!updatedItem) {
    // Si no existia, el creem de contingència
    updatedItem = {
      id,
      tipo: updates.tipo || 'Material de Taller',
      estado: updates.estado || 'Disponible',
      id_entitat: updates.id_entitat || 'TALLER-CENTRAL',
      obs: updates.obs || 'Equip registrat al taller',
      ...updates,
    };
    newInventari.push(updatedItem);
  }

  saveTallerOfflineData({ inventari: newInventari });
  if (typeof window !== 'undefined') {
    void cloudRepository.taller.update(id, {
      estatFabricacio: updates.estado === 'En Manteniment' ? 'REPARACIO' : updates.estado === 'Disponible' ? 'DISPONIBLE_LLIURAMENT' : 'PENDENT',
      observacions: updates.obs,
    });
  }
  return updatedItem;
}

/**
 * Actualitza una reserva al magatzem local persistent
 */
export function updateTallerReserva(id_reserva: number, updates: Partial<Reserva>): Reserva {
  const current = loadTallerOfflineData();
  let updatedReserva: Reserva | null = null;

  const newReservas = current.reservas.map((reserva) => {
    if (reserva.id_reserva === id_reserva) {
      updatedReserva = { ...reserva, ...updates };
      return updatedReserva;
    }
    return reserva;
  });

  if (!updatedReserva) {
    throw new Error(`Reserva ${id_reserva} no trobada a la memòria local.`);
  }

  saveTallerOfflineData({ reservas: newReservas });
  if (typeof window !== 'undefined') {
    void cloudRepository.pao.update(`PAO-${id_reserva}`, {
      estat: updates.estat_reserva === 'Lliurat al veí' ? 'DISPENSAT' : updates.estat_reserva === 'Retornat' ? 'RETORNAT' : 'APROVAT',
      observacions: updates.motiu_descripcio,
    });
  }
  return updatedReserva;
}
