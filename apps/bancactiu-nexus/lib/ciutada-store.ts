/**
 * GESTIÓ I PERSISTÈNCIA DE DADES DEL PORTAL CIUTADÀ
 * BancActiu 1.0 - CatSalut / Institut Català de la Salut
 *
 * Implementa la regla sanitària estricta:
 * - 1a pròrroga: Concedida de suport social comunitari (+30 dies).
 * - 2a pròrroga: Bloqueig estricte i derivació institucional a PAO CatSalut (CAP de referència).
 */

import { PrestecCiutada, CiutadaPerfil, SollicitudProrrogaResponse } from '@/types/ciutada';

const STORAGE_KEY_CIUTADANS = 'bancactiu_ciutadans_perfils_v1';
const STORAGE_KEY_PRESTECS = 'bancactiu_ciutadans_prestecs_v1';

// Cens inicial llavor de ciutadans
export const INITIAL_CIUTADANS: CiutadaPerfil[] = [
  {
    dni: '43218765K',
    nom: 'Maria Dolors',
    cognoms: 'Prat i Rovira',
    telefon: '612 345 678',
    email: 'mdolors.prat@gencat.cat',
    municipi: 'Cornellà de Llobregat',
    adreca: 'Av. Sant Ildefons 24, 2n 1a',
    capReferenciaId: 'CAP-CORNELLA-01',
    mustChangePassword: true,
    consentimentRgpdAcceptat: false,
    versioRgpd: 'RGPD-2026.11',
  },
  {
    dni: '38129482X',
    nom: 'Joan',
    cognoms: 'Garcia i Soler',
    telefon: '654 987 321',
    email: 'joan.garcia.soler@email.cat',
    municipi: "L'Hospitalet de Llobregat",
    adreca: 'Carrer de la Florida 88, Baixos',
    capReferenciaId: 'CAP-HOSPITALET-02',
    mustChangePassword: false,
    consentimentRgpdAcceptat: true,
    dataAcceptacioRgpd: '2026-10-15T10:30:00Z',
    versioRgpd: 'RGPD-2026.11',
  },
  {
    dni: '48956602Z',
    nom: 'Administrador Tècnic Junior',
    cognoms: 'BancActiu Suport',
    telefon: '688 112 233',
    email: 'admin.junior.48956602z@salut.cat',
    municipi: 'Barcelona',
    adreca: 'Gran Via de les Corts Catalanes 585',
    capReferenciaId: 'CAP-BCN-01',
    mustChangePassword: true,
    consentimentRgpdAcceptat: false,
    versioRgpd: 'RGPD-2026.11',
  },
];

// Cens inicial llavor de préstecs
export const INITIAL_PRESTECS: PrestecCiutada[] = [
  {
    id: 'EXP-2026-BCN-001',
    dniCiutada: '43218765K',
    nomCiutada: 'Maria Dolors Prat i Rovira',
    articleNom: 'Cadira de rodes plegable d’alumini (autopropulsable)',
    codiCatSalutPao: 'SRM 000A',
    categoria: 'MOBILITAT',
    entitatNom: 'Creu Roja - Assemblea Comarcal Baix Llobregat Centre',
    entitatTipus: 'CREU_ROJA',
    entitatTelefon: '93 474 12 34',
    entitatAdreca: 'Carrer de Mossèn Andreu 18, Cornellà de Llobregat',
    dataPrestec: '2026-09-20',
    dataRetornPrevista: '2026-11-20',
    estat: 'ACTIU',
    prorroguesDemanades: 0, // Encara pot demanar 1a pròrroga
    diesRestants: 13,
    capReferencia: {
      nom: 'CAP Sant Ildefons',
      municipi: 'Cornellà de Llobregat',
      adreca: 'Avinguda de Sant Ildefons s/n, 08940 Cornellà de Llobregat',
      telefon: '93 377 15 22',
      enllacCitaPrevia: 'https://citasalut.gencat.cat/',
    },
  },
  {
    id: 'EXP-2026-BCN-002',
    dniCiutada: '43218765K',
    nomCiutada: 'Maria Dolors Prat i Rovira',
    articleNom: 'Caminador articulat amb seient i frens ergonòmics',
    codiCatSalutPao: 'AND 010B',
    categoria: 'MOBILITAT',
    entitatNom: 'Associació de Veïns Sant Ildefons (Banc Solidari)',
    entitatTipus: 'ASSOCIACIO_VEINS',
    entitatTelefon: '93 375 88 90',
    entitatAdreca: 'Plaça Carles Navales 3, Cornellà de Llobregat',
    dataPrestec: '2026-07-15',
    dataRetornPrevista: '2026-10-15',
    estat: 'PRORROGAT',
    prorroguesDemanades: 1, // Ja té 1 pròrroga: la propera activarà la DERIVACIÓ PAO ESTRICTA!
    diesRestants: -23,
    capReferencia: {
      nom: 'CAP Sant Ildefons',
      municipi: 'Cornellà de Llobregat',
      adreca: 'Avinguda de Sant Ildefons s/n, 08940 Cornellà de Llobregat',
      telefon: '93 377 15 22',
      enllacCitaPrevia: 'https://citasalut.gencat.cat/',
    },
    motiuUltimaProrroga: 'Recuperació postoperatòria prolongada de pròtesi de maluc.',
  },
  {
    id: 'EXP-2026-BCN-003',
    dniCiutada: '38129482X',
    nomCiutada: 'Joan Garcia i Soler',
    articleNom: 'Llit articulat elèctric amb baranes i matalàs viscoelàstic',
    codiCatSalutPao: 'LLT 020C',
    categoria: 'CURA_LLIT',
    entitatNom: 'Creu Roja - Hospitalet de Llobregat',
    entitatTipus: 'CREU_ROJA',
    entitatTelefon: '93 431 55 66',
    entitatAdreca: 'Carrer de la Florida 22, L’Hospitalet de Llobregat',
    dataPrestec: '2026-06-01',
    dataRetornPrevista: '2026-08-01',
    estat: 'RETORNAT',
    prorroguesDemanades: 1,
    diesRestants: 0,
    dataRetornReal: '2026-08-02',
    capReferencia: {
      nom: 'CAP Florida Nord',
      municipi: "L'Hospitalet de Llobregat",
      adreca: 'Carrer del Parc s/n, 08905 L’Hospitalet',
      telefon: '93 440 22 11',
      enllacCitaPrevia: 'https://citasalut.gencat.cat/',
    },
  },
];

/**
 * Obtenir perfil del ciutadà pel DNI (amb fallback dinàmic)
 */
export function getCiutadaByDni(dni: string): CiutadaPerfil {
  const cleanDni = dni.trim().toUpperCase();
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_CIUTADANS);
    if (raw) {
      try {
        const list: CiutadaPerfil[] = JSON.parse(raw);
        const found = list.find((c) => c.dni.toUpperCase() === cleanDni);
        if (found) return found;
      } catch (err) {
        console.error('Error llegint perfils ciutadans:', err);
      }
    }
  }

  const seeded = INITIAL_CIUTADANS.find((c) => c.dni.toUpperCase() === cleanDni);
  if (seeded) return seeded;

  // Fallback automàtic per a nous usuaris ciutadans
  return {
    dni: cleanDni,
    nom: 'Usuari Ciutadà',
    cognoms: `Sol·licitant (${cleanDni})`,
    telefon: '600 000 000',
    email: `ciutada.${cleanDni.toLowerCase()}@salut.cat`,
    municipi: 'Barcelona',
    adreca: 'Adreça registrada al CatSalut',
    capReferenciaId: 'CAP-CENTRAL-01',
    mustChangePassword: true,
    consentimentRgpdAcceptat: false,
    versioRgpd: 'RGPD-2026.11',
  };
}

/**
 * Carrega els préstecs associats a un DNI
 */
export function getPrestecsCiutada(dni: string): PrestecCiutada[] {
  const cleanDni = dni.trim().toUpperCase();
  let prestecs = [...INITIAL_PRESTECS];

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_PRESTECS);
    if (raw) {
      try {
        prestecs = JSON.parse(raw);
      } catch (err) {
        console.error('Error llegint préstecs ciutadans:', err);
      }
    }
  }

  // Si no té préstecs, creem un préstec d'exemple perquè pugui interactuar
  const userPrestecs = prestecs.filter((p) => p.dniCiutada.toUpperCase() === cleanDni);
  if (userPrestecs.length === 0) {
    const mockPrestec: PrestecCiutada = {
      id: `EXP-2026-${cleanDni.slice(0, 4)}-01`,
      dniCiutada: cleanDni,
      nomCiutada: `Ciutadà ${cleanDni}`,
      articleNom: 'Cadira de rodes lleugera plegable',
      codiCatSalutPao: 'SRM 000A',
      categoria: 'MOBILITAT',
      entitatNom: 'Creu Roja - Assemblea Local',
      entitatTipus: 'CREU_ROJA',
      entitatTelefon: '93 200 20 20',
      entitatAdreca: 'Carrer Major 1, Barcelona',
      dataPrestec: new Date().toISOString().slice(0, 10),
      dataRetornPrevista: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      estat: 'ACTIU',
      prorroguesDemanades: 0,
      diesRestants: 30,
      capReferencia: {
        nom: 'CAP de Referència Territorial ICS',
        municipi: 'Barcelona',
        adreca: 'Passeig de Gràcia 105, Barcelona',
        telefon: '93 482 41 00',
        enllacCitaPrevia: 'https://citasalut.gencat.cat/',
      },
    };
    prestecs.push(mockPrestec);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PRESTECS, JSON.stringify(prestecs));
    }
    return [mockPrestec];
  }

  return userPrestecs;
}

/**
 * REGLA DE NEGOCI SANITÀRIA ESTRICTA DE PRÒRROGUES I DERIVACIÓ PAO
 */
export function processarSollicitudProrroga(prestecId: string, motiu: string): SollicitudProrrogaResponse {
  let prestecs = [...INITIAL_PRESTECS];
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_PRESTECS);
    if (raw) {
      try {
        prestecs = JSON.parse(raw);
      } catch (err) {
        console.error('Error llegint préstecs per a pròrroga:', err);
      }
    }
  }

  const idx = prestecs.findIndex((p) => p.id === prestecId);
  if (idx === -1) {
    return { ok: false, missatge: "No s'ha trobat el préstec indicat." };
  }

  const prestec = prestecs[idx];

  // REGLA ESTRICTA 2a PRÒRROGA (>1 pròrroga sol·licitada)
  if (prestec.prorroguesDemanades >= 1) {
    // Bloqueig immediat i obligació de derivació a PAO
    prestecs[idx].estat = 'BLOQUEJAT_DERIVACIO_PAO';
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PRESTECS, JSON.stringify(prestecs));
    }

    const missatgeInstitucional =
      "Aquest material supera el límit temporal del préstec de suport social comunitari. En tractar-se d'una necessitat continuada o de llarga durada, heu de tramitar la Prestació d'Articles Ortoprotèsics (PAO) oficial del CatSalut.";

    return {
      ok: false,
      bloquejatPAO: true,
      missatge: missatgeInstitucional,
      derivacioPaoInfo: {
        missatgeInstitucional,
        capReferencia: prestec.capReferencia,
        codiCatSalut: prestec.codiCatSalutPao,
        articleNom: prestec.articleNom,
        enllacCitaPrevia: prestec.capReferencia.enllacCitaPrevia || 'https://citasalut.gencat.cat/',
      },
      prestecActualitzat: prestecs[idx],
    };
  }

  // 1a PRÒRROGA: Concessió de 30 dies addicionals
  const dataActual = new Date(prestec.dataRetornPrevista || Date.now());
  dataActual.setDate(dataActual.getDate() + 30);
  const novaDataRetorn = dataActual.toISOString().slice(0, 10);

  prestec.prorroguesDemanades = 1;
  prestec.dataRetornPrevista = novaDataRetorn;
  prestec.estat = 'PRORROGAT';
  prestec.diesRestants += 30;
  prestec.motiuUltimaProrroga = motiu || 'Sol·licitud de continuïtat del préstec social';
  prestecs[idx] = prestec;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PRESTECS, JSON.stringify(prestecs));
  }

  return {
    ok: true,
    bloquejatPAO: false,
    missatge: 'Pròrroga social ordinària de 30 dies concedida correctament. Recordeu que només es permet 1 pròrroga.',
    prestecActualitzat: prestec,
  };
}

/**
 * Guarda l'acceptació del consentiment informat i actualització de perfil RGPD
 */
export function completarOnboardingCiutada(
  dni: string,
  acceptatRgpd: boolean
): { ok: boolean; missatge: string; perfil: CiutadaPerfil } {
  const perfil = getCiutadaByDni(dni);
  perfil.mustChangePassword = false;
  perfil.consentimentRgpdAcceptat = acceptatRgpd;
  perfil.dataAcceptacioRgpd = new Date().toISOString();
  perfil.versioRgpd = 'RGPD-2026.11';

  if (typeof window !== 'undefined') {
    let list: CiutadaPerfil[] = [...INITIAL_CIUTADANS];
    const raw = localStorage.getItem(STORAGE_KEY_CIUTADANS);
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error('Error desant perfil ciutadà:', err);
      }
    }
    const idx = list.findIndex((c) => c.dni.toUpperCase() === dni.trim().toUpperCase());
    if (idx >= 0) {
      list[idx] = perfil;
    } else {
      list.push(perfil);
    }
    localStorage.setItem(STORAGE_KEY_CIUTADANS, JSON.stringify(list));
  }

  return {
    ok: true,
    missatge: 'Onboarding i consentiment RGPD completats correctament.',
    perfil,
  };
}
