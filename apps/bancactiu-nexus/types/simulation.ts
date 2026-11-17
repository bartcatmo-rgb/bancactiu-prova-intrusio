import type { DemoAccount, DemoEntity } from '@/types/demo-user';

export type SimulationRole =
  | 'CAP_ADMIN'
  | 'CAP_REFERENT'
  | 'ADMIN_ENTITAT'
  | 'BARRI'
  | 'ADMIN_TECNIC'
  | 'TECNIC'
  | 'DIRECCIO_GENERAL'
  | 'TECNIC_SALUT'
  | 'SUPER_ADMIN';

export interface SimulationTarget {
  id: string;
  role: SimulationRole;
  entity: string;
  entityName: string;
  name: string;
  title: string;
  workplace: string;
  description: string;
  avatarColor: string;
  initials: string;
  icon: string;
  badgeColor: string;
  isCustom?: boolean;
}

export const INITIAL_SIMULATION_TARGETS: SimulationTarget[] = [
  {
    id: 'sim-cap-admin',
    role: 'CAP_ADMIN',
    entity: 'CAP',
    entityName: 'Centre d\'Atenció Primària Model Pilot',
    name: 'Mireia Vidal Soler',
    title: 'Administrativa Sanitària · Taulell UAC',
    workplace: 'Taulell d\'Atenció a la Ciutadania (UAC) · CAP Model Pilot',
    description: 'Atenció ciutadana al taulell del CAP, recepció de derivacions facultatives, tramitació de sol·licituds de material i lliurament de documents.',
    avatarColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    initials: 'MV',
    icon: '🏢',
    badgeColor: '#0284c7',
  },
  {
    id: 'sim-cap-referent',
    role: 'CAP_REFERENT',
    entity: 'CAP',
    entityName: 'Centro de Atención Primaria',
    name: 'Referent de Gestió - Centro de Atención Primaria',
    title: 'Referent de Gestió CAP & Control DPO',
    workplace: 'Gestió Operativa & Demanda · Centro de Atención Primaria',
    description: 'Aprovació de demandes, coordinació de préstecs, seguiment de fites DPO administratius i liquidació en €.',
    avatarColor: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    initials: 'RG',
    icon: '📋',
    badgeColor: '#7c3aed',
  },
  {
    id: 'sim-admin-entitat-nord',
    role: 'ADMIN_ENTITAT',
    entity: 'ENT-01',
    entityName: 'Associació Veïnal Nord',
    name: 'Marta Puig',
    title: 'Coordinadora d’Entitat Veïnal',
    workplace: 'Direcció · Associació Veïnal Nord',
    description: 'Gestió d’estocs locals, control d’entregues veïnals i recepció de donacions comunitàries.',
    avatarColor: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    initials: 'MP',
    icon: '🤝',
    badgeColor: '#d97706',
  },
  {
    id: 'sim-admin-entitat-creuroja',
    role: 'ADMIN_ENTITAT',
    entity: 'ENT-02',
    entityName: 'Creu Roja',
    name: 'Coordinació Creu Roja',
    title: 'Coordinadora Entitat Col·laboradora',
    workplace: 'Sede Creu Roja · Logística Sanitària',
    description: 'Coordinació d’atenció a famílies d’alta vulnerabilitat social i préstecs sociosanitaris.',
    avatarColor: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    initials: 'CR',
    icon: '🏥',
    badgeColor: '#dc2626',
  },
  {
    id: 'sim-barri-nord',
    role: 'BARRI',
    entity: 'ENT-01',
    entityName: 'Associació Veïnal Nord',
    name: 'Carles Soler',
    title: 'Voluntari de Barri & Magatzem',
    workplace: 'Voluntariat de Barri · Magatzem AV Nord',
    description: 'Lliurament directe de material al ciutadà, recollida de signatures digitals i recepció de devolucions.',
    avatarColor: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    initials: 'CS',
    icon: '📦',
    badgeColor: '#059669',
  },
  {
    id: 'sim-barri-creuroja',
    role: 'BARRI',
    entity: 'ENT-02',
    entityName: 'Creu Roja',
    name: 'Voluntariat Creu Roja',
    title: 'Voluntari de Magatzem i Suport',
    workplace: 'Magatzem de Suport · Creu Roja',
    description: 'Distribució logística de cadires i caminadors a domicili i suport de proximitat.',
    avatarColor: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    initials: 'VR',
    icon: '🚚',
    badgeColor: '#ea580c',
  },
  {
    id: 'sim-admin-tecnic',
    role: 'ADMIN_TECNIC',
    entity: 'TALLER-CENTRAL',
    entityName: 'Taller Ortopèdic Central',
    name: 'Marc Pons',
    title: 'Direcció Tècnica de Taller',
    workplace: 'Direcció Tècnica · Taller Ortopèdic Central',
    description: 'Planificació de manteniments preventius, compres de recanvis i certificació de seguretat tècnica.',
    avatarColor: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    initials: 'MP',
    icon: '⚙️',
    badgeColor: '#475569',
  },
  {
    id: 'sim-tecnic',
    role: 'TECNIC',
    entity: 'TALLER-CENTRAL',
    entityName: 'Taller Ortopèdic Central',
    name: 'Albert Roca',
    title: 'Tècnic de Manteniment & Reparació',
    workplace: 'Tècnic Ortopèdic · Manteniment d’Equips',
    description: 'Reparació física d’equips, desinfecció, ajustos de frens i marcatge d’aptitud operativa.',
    avatarColor: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    initials: 'AR',
    icon: '🔧',
    badgeColor: '#0891b2',
  },
  {
    id: 'sim-direccio-general',
    role: 'DIRECCIO_GENERAL',
    entity: 'ALL',
    entityName: 'Tota la Xarxa Sanitària',
    name: 'Direcció de Gestió Sanitària',
    title: 'Supervisió Estratègica de Xarxa',
    workplace: 'Gerència de Salut · Xarxa Sanitària CatSalut',
    description: 'Mètriques globals de servei, impacte econòmic, estalvis en ortopèdia i compliment sanitari.',
    avatarColor: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    initials: 'DG',
    icon: '🏛️',
    badgeColor: '#4f46e5',
  },
  {
    id: 'sim-tecnic-salut',
    role: 'TECNIC_SALUT',
    entity: 'ALL',
    entityName: 'Servei de Salut Pública & Epidemiologia Territorial',
    name: 'Dra. Laia Miralles Puig',
    title: 'Tècnica de Salut Pública & Epidemiologia',
    workplace: 'Àrea d\'Avaluació i Dades Sanitàries · CatSalut / Direcció de Salut',
    description: 'Anàlisi de dades sanitàries, extracció d’indicadors territorials, catalogació de patologies i informes per a Gerència i CatSalut.',
    avatarColor: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    initials: 'LM',
    icon: '🔬',
    badgeColor: '#0d9488',
  },
];

export const SIMULATION_TARGETS = INITIAL_SIMULATION_TARGETS;

export function getRoleMetadata(role: SimulationRole, entityKind?: string) {
  switch (role) {
    case 'CAP_ADMIN':
      return {
        icon: '🏢',
        title: 'Administrativa Sanitària · Taulell UAC',
        description: 'Atenció ciutadana al taulell del CAP, recepció de derivacions facultatives, tramitació de sol·licituds de material i lliurament de documents.',
        badgeColor: '#0284c7',
        avatarColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      };
    case 'CAP_REFERENT':
      return {
        icon: '📋',
        title: 'Referent de Gestió CAP & Control DPO',
        description: 'Aprovació de demandes, coordinació de préstecs, seguiment de fites DPO administratius i liquidació en €.',
        badgeColor: '#7c3aed',
        avatarColor: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      };
    case 'ADMIN_ENTITAT':
      return {
        icon: entityKind === 'ENTIDAD_COLABORADORA' ? '🏥' : '🤝',
        title: entityKind === 'ENTIDAD_COLABORADORA' ? 'Coordinació Entitat Col·laboradora' : 'Coordinació d’Entitat Veïnal',
        description: 'Gestió d’estocs locals, control d’entregues veïnals i recepció de donacions comunitàries.',
        badgeColor: entityKind === 'ENTIDAD_COLABORADORA' ? '#dc2626' : '#d97706',
        avatarColor: entityKind === 'ENTIDAD_COLABORADORA'
          ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
          : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      };
    case 'BARRI':
      return {
        icon: entityKind === 'ENTIDAD_COLABORADORA' ? '🚚' : '📦',
        title: entityKind === 'ENTIDAD_COLABORADORA' ? 'Voluntariat Logístic & Suport' : 'Voluntariat de Barri & Magatzem',
        description: 'Lliurament directe de material al ciutadà, recollida de signatures digitals i recepció de devolucions.',
        badgeColor: entityKind === 'ENTIDAD_COLABORADORA' ? '#ea580c' : '#059669',
        avatarColor: entityKind === 'ENTIDAD_COLABORADORA'
          ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
          : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      };
    case 'ADMIN_TECNIC':
      return {
        icon: '⚙️',
        title: 'Direcció Tècnica de Taller',
        description: 'Planificació de manteniments preventius, compres de recanvis i certificació de seguretat tècnica.',
        badgeColor: '#475569',
        avatarColor: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
      };
    case 'TECNIC':
      return {
        icon: '🔧',
        title: 'Tècnic de Manteniment & Reparació',
        description: 'Reparació física d’equips, desinfecció, ajustos de frens i marcatge d’aptitud operativa.',
        badgeColor: '#0891b2',
        avatarColor: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      };
    case 'DIRECCIO_GENERAL':
      return {
        icon: '🏛️',
        title: 'Supervisió Estratègica de Xarxa',
        description: 'Mètriques globals de servei, impacte econòmic, estalvis en ortopèdia i compliment sanitari.',
        badgeColor: '#4f46e5',
        avatarColor: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
      };
    case 'TECNIC_SALUT':
      return {
        icon: '🔬',
        title: 'Tècnica de Salut Pública & Epidemiologia',
        description: 'Anàlisi de dades sanitàries, extracció d’indicadors territorials, catalogació de patologies i informes per a Gerència i CatSalut.',
        badgeColor: '#0d9488',
        avatarColor: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      };
    default:
      return {
        icon: '👤',
        title: 'Usuari de Gestió',
        description: 'Accés operatiu a la plataforma BancActiu.',
        badgeColor: '#64748b',
        avatarColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      };
  }
}

/**
 * Genera dinàmicament la llista de targets de simulació a partir dels usuaris
 * i de les entitats registrades al sistema en temps real.
 */
export function buildDynamicSimulationTargets(
  accounts: DemoAccount[] = [],
  entities: DemoEntity[] = []
): SimulationTarget[] {
  const targets: SimulationTarget[] = [];
  const processedKeys = new Set<string>();

  // 1. Afegeix tots els usuaris actius del directori (excloent el Superadministrador)
  for (const acc of accounts) {
    if (!acc.activo || acc.rol === 'SUPER_ADMIN') continue;

    const entObj = entities.find((e) => e.id === acc.entitat || e.name === acc.entitat);
    const entityName = entObj ? entObj.name : acc.entitat === 'ALL' ? 'Tota la Xarxa Sanitària' : acc.entitat === 'CAP' ? 'Centro de Atención Primaria' : acc.entitat;
    const meta = getRoleMetadata(acc.rol as SimulationRole, entObj?.kind);
    const initials = acc.nombre
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const key = `${acc.rol}:${acc.entitat}:${acc.nombre}`;
    processedKeys.add(key);

    targets.push({
      id: acc.id,
      role: acc.rol as SimulationRole,
      entity: acc.entitat,
      entityName,
      name: acc.nombre,
      title: meta.title,
      workplace: `${meta.title} · ${entityName}`,
      description: meta.description,
      avatarColor: meta.avatarColor,
      initials: initials || 'US',
      icon: meta.icon,
      badgeColor: meta.badgeColor,
      isCustom: true,
    });
  }

  // 2. Per a cada entitat existent al sistema, assegura que hi ha opcions per provar-la
  for (const ent of entities) {
    if (!ent.active) continue;

    if (ent.kind === 'ENTIDAD_VECINAL' || ent.kind === 'ENTIDAD_COLABORADORA') {
      const hasCoord = targets.some((t) => t.role === 'ADMIN_ENTITAT' && t.entity === ent.id);
      if (!hasCoord) {
        const meta = getRoleMetadata('ADMIN_ENTITAT', ent.kind);
        targets.push({
          id: `sim-coord-${ent.id}`,
          role: 'ADMIN_ENTITAT',
          entity: ent.id,
          entityName: ent.name,
          name: `Coordinació (${ent.name})`,
          title: meta.title,
          workplace: `${meta.title} · ${ent.name}`,
          description: `Gestió d'estocs, entregues i recepció de material a la seu de ${ent.name}.`,
          avatarColor: meta.avatarColor,
          initials: ent.name.slice(0, 2).toUpperCase(),
          icon: meta.icon,
          badgeColor: meta.badgeColor,
          isCustom: true,
        });
      }

      const hasBarri = targets.some((t) => t.role === 'BARRI' && t.entity === ent.id);
      if (!hasBarri) {
        const meta = getRoleMetadata('BARRI', ent.kind);
        targets.push({
          id: `sim-barri-${ent.id}`,
          role: 'BARRI',
          entity: ent.id,
          entityName: ent.name,
          name: `Voluntariat (${ent.name})`,
          title: meta.title,
          workplace: `${meta.title} · ${ent.name}`,
          description: `Lliurament al veí i gestió de magatzem a la seu de ${ent.name}.`,
          avatarColor: meta.avatarColor,
          initials: ent.name.slice(0, 2).toUpperCase(),
          icon: meta.icon,
          badgeColor: meta.badgeColor,
          isCustom: true,
        });
      }
    } else if (ent.kind === 'CAP') {
      const hasCapAdmin = targets.some((t) => t.role === 'CAP_ADMIN' && (t.entity === ent.id || t.entity === 'CAP'));
      if (!hasCapAdmin) {
        const meta = getRoleMetadata('CAP_ADMIN', ent.kind);
        targets.push({
          id: `sim-cap-${ent.id}`,
          role: 'CAP_ADMIN',
          entity: ent.id,
          entityName: ent.name,
          name: `Metge / Infermer (${ent.name})`,
          title: meta.title,
          workplace: `${meta.title} · ${ent.name}`,
          description: `Prescripció clínica de material ortopèdic i revisió de pacients a ${ent.name}.`,
          avatarColor: meta.avatarColor,
          initials: 'CAP',
          icon: meta.icon,
          badgeColor: meta.badgeColor,
          isCustom: true,
        });
      }

      const hasReferent = targets.some((t) => t.role === 'CAP_REFERENT' && (t.entity === ent.id || t.entity === 'CAP'));
      if (!hasReferent) {
        const meta = getRoleMetadata('CAP_REFERENT', ent.kind);
        targets.push({
          id: `sim-referent-${ent.id}`,
          role: 'CAP_REFERENT',
          entity: ent.id,
          entityName: ent.name,
          name: `Referent de Gestió (${ent.name})`,
          title: meta.title,
          workplace: `${meta.title} · ${ent.name}`,
          description: `Circuit de demandes, liquidació DPO en € i coordinació amb el territori a ${ent.name}.`,
          avatarColor: meta.avatarColor,
          initials: 'RG',
          icon: meta.icon,
          badgeColor: meta.badgeColor,
          isCustom: true,
        });
      }
    } else if (ent.kind === 'TECNICA') {
      const hasTecnic = targets.some((t) => (t.role === 'TECNIC' || t.role === 'ADMIN_TECNIC') && t.entity === ent.id);
      if (!hasTecnic) {
        const meta = getRoleMetadata('TECNIC', ent.kind);
        targets.push({
          id: `sim-taller-${ent.id}`,
          role: 'TECNIC',
          entity: ent.id,
          entityName: ent.name,
          name: `Tècnic de Taller (${ent.name})`,
          title: meta.title,
          workplace: `${meta.title} · ${ent.name}`,
          description: `Manteniment, reparació i revisió de material a ${ent.name}.`,
          avatarColor: meta.avatarColor,
          initials: 'TC',
          icon: meta.icon,
          badgeColor: meta.badgeColor,
          isCustom: true,
        });
      }
    }
  }

  // Si no hi ha cap usuari a la llista, retorna com a mínim els inicials
  if (targets.length === 0) {
    return INITIAL_SIMULATION_TARGETS;
  }

  return targets;
}
