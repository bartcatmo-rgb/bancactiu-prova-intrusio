/**
 * BANC ACTIU 1.0 - GESTIÓ PERSISTENT D'USUARIS I PERMISOS GRANULARS
 * Servei Català de la Salut (CatSalut)
 */

import { UsuariBancActiu, CATALEG_PERMISOS_SISTEMA } from '@/types/auth';
import { cloudRepository } from '@/lib/cloud-repository';

export const STORAGE_KEY_USUARIS_BANCACTIU = 'bancactiu_usuaris_cornella_v1';
export const STORAGE_KEY_COPYRIGHT_GLOBAL = 'bancactiu_academic_license_accepted';

export const INITIAL_USUARIS_BANCACTIU: UsuariBancActiu[] = [
  {
    id: 'usr-superadmin-52622304y',
    dni: '52622304Y',
    nomComplet: 'Bartomeu (Superadministrador Global)',
    email: 'superadmin.52622304y@salut.cat',
    rol: 'SUPERADMIN',
    centreId: undefined,
    regioSanitaria: 'Totes les Regions (Catalunya)',
    gerenciaId: 'ALL',
    actiu: true,
    permisos: CATALEG_PERMISOS_SISTEMA.map((p) => p.codi),
    permisosPersonalitzats: ['SUPERVISIO_TOTAL_CATALUNYA', 'BYPASS_AUDITORIA_CRITICA'],
    copyrightAcceptat: true,
    dataAcceptacioCopyright: '2026-01-15T08:00:00.000Z',
    versioCopyrightAcceptada: '1.0',
    dataCreacio: '2026-01-01T00:00:00.000Z',
    ultimAcces: '2026-11-08T12:00:00.000Z',
  },
  {
    id: 'usr-superadmin-48956602z',
    dni: '48956602Z',
    nomComplet: 'Administrador Tècnic Junior (48956602Z)',
    email: 'admin.junior.48956602z@salut.cat',
    rol: 'SUPERADMIN',
    centreId: undefined,
    regioSanitaria: 'Totes les Regions (Catalunya)',
    gerenciaId: 'ALL',
    actiu: true,
    permisos: CATALEG_PERMISOS_SISTEMA.map((p) => p.codi),
    permisosPersonalitzats: ['SUPERVISIO_TOTAL_CATALUNYA'],
    copyrightAcceptat: true,
    dataAcceptacioCopyright: '2026-01-15T08:00:00.000Z',
    versioCopyrightAcceptada: '1.0',
    dataCreacio: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-gapic-metro-sud',
    dni: '11111111H',
    nomComplet: 'Direcció GAPIC Metro Sud',
    email: 'gapic.metrosud@ics.gencat.cat',
    rol: 'GERENCIA_TERRITORIAL',
    centreId: undefined,
    regioSanitaria: 'RS_BCN_SUD',
    gerenciaId: 'GT_METRO_SUD',
    actiu: true,
    permisos: ['CONSULTA_CENS', 'INFORMES_CENTRE_CONSULTA', 'SUPERVISIO_EPIDEMIOLOGICA'],
    copyrightAcceptat: true,
    dataCreacio: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'usr-cap-sant-ildefons',
    dni: '22222222J',
    nomComplet: 'Direcció Mèdica CAP Sant Ildefons',
    email: 'direccio.santildefons@ics.gencat.cat',
    rol: 'DIRECCIO_CAP',
    centreId: 'CAP-SANT-ILDEFONS',
    regioSanitaria: 'RS_BCN_SUD',
    gerenciaId: 'GT_METRO_SUD',
    actiu: true,
    permisos: ['RESERVES_CONSULTA', 'RESERVES_CREACIO', 'RESERVES_ENTREGA', 'RESERVES_RETORN', 'USUARIS_LOCAL_GESTIO'],
    copyrightAcceptat: true,
    dataCreacio: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'usr-serveis-socials-cornella',
    dni: '33333333P',
    nomComplet: 'Serveis Socials Cornellà',
    email: 'serveis.socials@cornella.cat',
    rol: 'COORDINADOR_LOCAL',
    centreId: undefined,
    regioSanitaria: 'RS_BCN_SUD',
    gerenciaId: 'ENS-AJUNTAMENT-CORNELLA',
    actiu: true,
    permisos: ['RESERVES_CONSULTA', 'RESERVES_CREACIO'],
    copyrightAcceptat: true,
    dataCreacio: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'usr-creu-roja-cornella',
    dni: '44444444A',
    nomComplet: 'Responsable Creu Roja Cornellà',
    email: 'cornella@creuroja.org',
    rol: 'ADMIN_ENTITAT',
    centreId: 'ENT-CR-CORNELLA',
    regioSanitaria: 'RS_BCN_SUD',
    gerenciaId: 'GT_METRO_SUD',
    actiu: true,
    permisos: ['RESERVES_CONSULTA', 'RESERVES_ENTREGA', 'RESERVES_RETORN'],
    copyrightAcceptat: true,
    dataCreacio: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'usr-avv-gavarra',
    dni: '55555555B',
    nomComplet: 'Coordinador AVV La Gavarra',
    email: 'avv.lagavarra@gmail.com',
    rol: 'ADMIN_ENTITAT',
    centreId: 'ENT-AVV-GAVARRA',
    regioSanitaria: 'RS_BCN_SUD',
    gerenciaId: 'GT_METRO_SUD',
    actiu: true,
    permisos: ['RESERVES_CONSULTA', 'RESERVES_ENTREGA', 'RESERVES_RETORN'],
    copyrightAcceptat: true,
    dataCreacio: '2026-01-15T09:00:00.000Z',
  },
];

/**
 * Carrega els usuaris persistits des de localStorage amb suport de contingència offline
 */
export function loadUsuarisBancActiu(): UsuariBancActiu[] {
  if (typeof window === 'undefined') {
    return INITIAL_USUARIS_BANCACTIU;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USUARIS_BANCACTIU);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(INITIAL_USUARIS_BANCACTIU));
      return INITIAL_USUARIS_BANCACTIU;
    }
    const parsed = JSON.parse(raw) as UsuariBancActiu[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Assegurar sempre la presència dels superadministradors del sistema
      let needsSave = false;
      const hasSuper = parsed.some((u) => u.dni.toUpperCase() === '52622304Y');
      if (!hasSuper) {
        const superAdmin = INITIAL_USUARIS_BANCACTIU.find((u) => u.dni === '52622304Y');
        if (superAdmin) {
          parsed.unshift(superAdmin);
          needsSave = true;
        }
      }

      const hasJunior = parsed.some((u) => u.dni.toUpperCase() === '48956602Z');
      if (!hasJunior) {
        const juniorAdmin = INITIAL_USUARIS_BANCACTIU.find((u) => u.dni === '48956602Z');
        if (juniorAdmin) {
          parsed.push(juniorAdmin);
          needsSave = true;
        }
      }

      if (needsSave) {
        localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(parsed));
      }
      return parsed;
    }
    return INITIAL_USUARIS_BANCACTIU;
  } catch (err) {
    console.error('Error carregant usuaris BancActiu:', err);
    return INITIAL_USUARIS_BANCACTIU;
  }
}

/**
 * Guarda o actualitza un usuari al catàleg persistent
 */
export function saveUsuariBancActiu(user: UsuariBancActiu): UsuariBancActiu[] {
  const current = loadUsuarisBancActiu();
  const existsIdx = current.findIndex((u) => u.id === user.id || u.dni.toUpperCase() === user.dni.toUpperCase());
  let updated: UsuariBancActiu[];

  if (existsIdx >= 0) {
    updated = [...current];
    updated[existsIdx] = {
      ...updated[existsIdx],
      ...user,
      dni: user.dni.trim().toUpperCase(),
    };
  } else {
    updated = [
      {
        ...user,
        dni: user.dni.trim().toUpperCase(),
        dataCreacio: user.dataCreacio || new Date().toISOString(),
      },
      ...current,
    ];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bancactiu_usuaris_updated', { detail: updated }));
      // Persistència asíncrona a la base de dades en el núvol (Render)
      void cloudRepository.usuaris.create({
        dni: user.dni.trim().toUpperCase(),
        nom: user.nomComplet,
        cognoms: '',
        rol: user.rol,
        ambitTerritorial: user.regioSanitaria || 'Catalunya',
        centreId: user.centreId,
        permisosGranulars: user.permisos,
        actiu: user.actiu,
        dataCreacio: user.dataCreacio || new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error desant usuaris a la base de dades:', err);
    }
  }
  return updated;
}

/**
 * Elimina un usuari del sistema (protegint el superadministrador principal)
 */
export function deleteUsuariBancActiu(idOrDni: string): UsuariBancActiu[] {
  const current = loadUsuarisBancActiu();
  const target = current.find((u) => u.id === idOrDni || u.dni.toUpperCase() === idOrDni.toUpperCase());

  if (target?.dni.toUpperCase() === '52622304Y' || target?.dni.toUpperCase() === '48956602Z') {
    alert('Acció denegada: Els Superadministradors del sistema no poden ser eliminats.');
    return current;
  }

  const updated = current.filter((u) => u.id !== idOrDni && u.dni.toUpperCase() !== idOrDni.toUpperCase());

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bancactiu_usuaris_updated', { detail: updated }));
      // Persistència asíncrona a la base de dades en el núvol (Render)
      void cloudRepository.usuaris.delete(target?.dni || idOrDni);
    } catch (err) {
      console.error('Error eliminant usuari a la base de dades:', err);
    }
  }
  return updated;
}

/**
 * Activa o desactiva un usuari
 */
export function toggleUsuariActiu(idOrDni: string): UsuariBancActiu[] {
  const current = loadUsuarisBancActiu();
  const updated = current.map((u) => {
    if (u.id === idOrDni || u.dni.toUpperCase() === idOrDni.toUpperCase()) {
      if (u.dni.toUpperCase() === '52622304Y' || u.dni.toUpperCase() === '48956602Z') return u; // Mai desactivar superadmin
      return { ...u, actiu: !u.actiu };
    }
    return u;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bancactiu_usuaris_updated', { detail: updated }));
      // Persistència asíncrona a la base de dades en el núvol (Render)
      const targetUser = current.find((u) => u.id === idOrDni || u.dni.toUpperCase() === idOrDni.toUpperCase());
      if (targetUser) {
        void cloudRepository.usuaris.update(targetUser.dni, { actiu: !targetUser.actiu });
      }
    } catch (err) {
      console.error('Error alternant estat usuari a la base de dades:', err);
    }
  }
  return updated;
}

/**
 * Comprova si un usuari concret (o el dispositiu globalment) ja té acceptat el copyright
 */
export function hasCopyrightAcceptat(userIdOrDni?: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    // 1. Comprovació global persistent
    const globalLicense = localStorage.getItem(STORAGE_KEY_COPYRIGHT_GLOBAL);
    if (globalLicense) {
      const parsed = JSON.parse(globalLicense);
      if (parsed && parsed.acceptedAt) {
        return true;
      }
    }

    // 2. Si es proporciona un usuari específic, comprova el seu camp copyrightAcceptat
    if (userIdOrDni) {
      const users = loadUsuarisBancActiu();
      const clean = userIdOrDni.trim().toUpperCase();
      const user = users.find((u) => u.id === clean || u.dni.toUpperCase() === clean);
      if (user && user.copyrightAcceptat === true) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Registra de forma definitiva l'acceptació del copyright per a un usuari
 */
export function acceptarCopyrightPerUsuari(userIdOrDni: string, auditorName?: string): UsuariBancActiu | null {
  const users = loadUsuarisBancActiu();
  const clean = userIdOrDni.trim().toUpperCase();
  const index = users.findIndex((u) => u.id === clean || u.dni.toUpperCase() === clean);

  const now = new Date().toISOString();
  const verificationCode = `BA-CR-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const licenseRecord = {
    acceptedAt: now,
    auditorName: auditorName || (index >= 0 ? users[index].nomComplet : 'Auditor CatSalut'),
    verificationCode,
    licenseVersion: '1.0-PRODUCTION-OFFICIAL',
    ownerId: '52622304Y',
    terms: 'Acceptació formal de Copyright, Propietat Intel·lectual i Confidencialitat de Dades de Salut (RGPD Art. 89).',
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_COPYRIGHT_GLOBAL, JSON.stringify(licenseRecord));
      sessionStorage.setItem('bancactiu_copyright_confirmed_session', 'true');
    } catch (e) {
      console.warn('Storage error on copyright accept:', e);
    }
  }

  if (index >= 0) {
    users[index].copyrightAcceptat = true;
    users[index].dataAcceptacioCopyright = now;
    users[index].versioCopyrightAcceptada = '1.0';

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_USUARIS_BANCACTIU, JSON.stringify(users));
        window.dispatchEvent(new CustomEvent('bancactiu_usuaris_updated', { detail: users }));
      } catch (e) {
        console.error('Error guardant acceptació d usuari:', e);
      }
    }
    return users[index];
  }

  return null;
}
