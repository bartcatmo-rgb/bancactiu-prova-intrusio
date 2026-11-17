/**
 * Generador de Dades & Motor de Simulació de 6 Mesos de Treball
 * BancActiu · Sistema d'Autonomia i Préstec Comunitari
 * 
 * Genera 140 préstecs, devolucions, inspeccions de taller, auditories RGPD
 * i incidències reals distribuïdes al llarg de 6 mesos (Novembre 2026 - Abril 2027).
 */

import type { Reserva, InventariItem } from '@/types/api';
import type { DemoEntity, DemoAuditEvent } from '@/types/demo-user';
import type { MotiuCodi } from '@/types/motius-salut';

export interface MonthSimulationStage {
  monthIndex: number;
  monthName: string;
  calendarMonth: string;
  theme: string;
  description: string;
  newLoansCount: number;
  returnedLoansCount: number;
  activeLoansCount: number;
  hospitalDaysSaved: number;
  dpoScore: number;
  operationalIncident: {
    title: string;
    description: string;
    mitigation: string;
    resolved: boolean;
    badgeColor: string;
  };
  rolesActivity: {
    capUac: string;
    referent: string;
    entitat: string;
    taller: string;
    tecnicSalut: string;
    gerencia: string;
    superadmin: string;
  };
}

export const SIX_MONTH_STAGES: MonthSimulationStage[] = [
  {
    monthIndex: 1,
    monthName: 'Mes 1',
    calendarMonth: 'Novembre 2026',
    theme: 'Arrencada Territorial & Circuit de Fiança 50 €',
    description: 'Desplegament del model pilot a la xarxa del CAP i entitats veïnals. Integració del protocol de dipòsit de garantia de 50 € a taulell UAC.',
    newLoansCount: 18,
    returnedLoansCount: 3,
    activeLoansCount: 15,
    hospitalDaysSaved: 160,
    dpoScore: 92,
    operationalIncident: {
      title: 'Ciutadà sol·licita exempció de fiança per vulnerabilitat',
      description: 'Usuària amb ingrés mínim vital sol·licita cadira de rodes sense poder avançar els 50 € de dipòsit de garantia.',
      mitigation: 'L\'administrativa UAC activa la casella oficial "Exempció Social CatSalut" vinculant l\'informe de la Treballadora Social.',
      resolved: true,
      badgeColor: '#0284c7',
    },
    rolesActivity: {
      capUac: '18 sol·licituds picades a mà; emissió de volants oficials amb RGPD.',
      referent: 'Validació del circuit BPS vs PAO i obertura del còmput DPO.',
      entitat: 'Lliurament presencial a l\'AV Nord i Creu Roja amb signatura en paper.',
      taller: 'Recepció de l\'estoc inicial (8 unitats) i certificació d\'ITV 100% apta.',
      tecnicSalut: 'Primer mostreig de dades: 44% traumatologia postquirúrgica.',
      gerencia: 'Aprovació del protocol territorial i validació del conveni municipal.',
      superadmin: 'Supervisió de logs de traçabilitat i paràmetres de xarxa.',
    },
  },
  {
    monthIndex: 2,
    monthName: 'Mes 2',
    calendarMonth: 'Desembre 2026',
    theme: 'Onada de Fred & Pic de Demanda de Caminadors',
    description: 'Les baixes temperatures i glaçades provoquen un augment sobtat de caigudes en gent gran (+75 anys) amb pèrdua aguda de marxa autònoma.',
    newLoansCount: 26,
    returnedLoansCount: 8,
    activeLoansCount: 33,
    hospitalDaysSaved: 240,
    dpoScore: 96,
    operationalIncident: {
      title: 'Tensió d\'estoc de caminadors a l\'Associació Veïnal Nord',
      description: 'L\'AV Nord es queda sense caminadors disponibles davant l\'allau de derivacions mèdiques post-caiguda.',
      mitigation: 'El sistema alerta del trencament d\'estoc i coordina el trasllat logístic de 3 unitats des de la seu comarcal de Creu Roja.',
      resolved: true,
      badgeColor: '#ea580c',
    },
    rolesActivity: {
      capUac: 'Triatge intensiu de curt termini per a gent gran post-caiguda a domicili.',
      referent: 'Gestió de reassignació de punts de recollida entre entitats de barri.',
      entitat: 'Creu Roja activa voluntaris de suport logístic a domicili.',
      taller: 'Ajust exprés d\'alçada i gomes de subjecció per a 4 caminadors nous.',
      tecnicSalut: 'Pujada de la categoria "Deteriorament Funcional Agut / Post-caiguda" al 38%.',
      gerencia: 'Seguiment de la disminució de reingressos a urgències per mobilitat.',
      superadmin: 'Monitorització del trànsit de xarxa i rendiment de les estacions.',
    },
  },
  {
    monthIndex: 3,
    monthName: 'Mes 3',
    calendarMonth: 'Gener 2027',
    theme: 'Primer Cicle de Retorns & Filtre Mecànic de Taller',
    description: 'Finalitzen els primers préstecs de curta convalescència (fase aguda). Es posa a prova el circuit de reintegrament de la fiança i l\'ITV.',
    newLoansCount: 28,
    returnedLoansCount: 21,
    activeLoansCount: 40,
    hospitalDaysSaved: 280,
    dpoScore: 101,
    operationalIncident: {
      title: 'Devolució de cadira amb desgast mecànic i fre destensat',
      description: 'Ciutadà retorna la cadira SR-02 després de 3 mesos amb folgança a la roda dreta i pèrdua de tensió de frenada.',
      mitigation: 'L\'entitat registra "Desgaste Normal / Revisió Tècnica", retorna la fiança i deriva la unitat al taller central per a ITV.',
      resolved: true,
      badgeColor: '#d97706',
    },
    rolesActivity: {
      capUac: 'Gestió d\'avisos de venciment automàtics i recepció de pròrrogues.',
      referent: 'Aprovació de 4 pròrrogues d\'1 mes addicional per necessitat clínica.',
      entitat: 'Liquidació de 21 devolucions amb reintegrament de fiances (1.050 € retornats).',
      taller: 'Albert Roca desinfecta 19 unitats i substitueix frens a 2 cadires.',
      tecnicSalut: 'Càlcul de durada real: mitjana de 42 dies d\'ús per procés traumatològic.',
      gerencia: 'Primer informe d\'impacte: 98% de satisfacció ciutadana reportada.',
      superadmin: 'Verificació d\'auditoria: 0 duplicacions de préstec detectades.',
    },
  },
  {
    monthIndex: 4,
    monthName: 'Mes 4',
    calendarMonth: 'Febrer 2027',
    theme: 'Extensió de Xarxa & Custòdia Històrica de Baixes pel Superadmin',
    description: 'Incorporació d\'un nou municipi col·laborador i tancament d\'un punt provisional amb custòdia total de dades segons RGPD Art. 89.',
    newLoansCount: 22,
    returnedLoansCount: 20,
    activeLoansCount: 42,
    hospitalDaysSaved: 210,
    dpoScore: 104,
    operationalIncident: {
      title: 'Punt de distribució veïnal provisional finalitza conveni d\'ús',
      description: 'L\'espai municipal cedit temporalment tanca per reformes i l\'entitat ha de ser donada de baixa del directori actiu.',
      mitigation: 'El Superadmin executa la "Baixa amb Custòdia Històrica": es preserven tots els préstecs i s\'activa l\'arxiu de consulta.',
      resolved: true,
      badgeColor: '#9333ea',
    },
    rolesActivity: {
      capUac: 'Emissió de volants derivats al nou punt de préstec consolidat.',
      referent: 'Revisió de fites DPO semestrals: tots els administratius superen el 95%.',
      entitat: 'El nou punt solidari assumeix la custòdia física de 10 cadires reassignades.',
      taller: 'Marc Pons emet informes tècnics d\'aptitud per a material reassignat.',
      tecnicSalut: 'Anàlisi de mobilitat per codis postals i zones bàsiques de salut.',
      gerencia: 'Avaluació del cost evitat en comparació amb compres PAO directes.',
      superadmin: 'Alta d\'entitat ENT-03 i baixa custodiada de l\'entitat provisional.',
    },
  },
  {
    monthIndex: 5,
    monthName: 'Mes 5',
    calendarMonth: 'Març 2027',
    theme: 'Interconnexió PAO CatSalut & Recuperació Post-Ictus',
    description: 'Consolidació del circuit pont per a pacients amb seqüeles neurològiques severes en espera de cadira definitiva per prescripció del CatSalut.',
    newLoansCount: 24,
    returnedLoansCount: 22,
    activeLoansCount: 44,
    hospitalDaysSaved: 230,
    dpoScore: 102,
    operationalIncident: {
      title: 'Intent de sol·licitud duplicada detectat a la xarxa',
      description: 'Un familiar intenta reservar una cadira a Creu Roja tenint ja un expedient obert al CAP pel mateix pacient.',
      mitigation: 'El motor antiduplicitat de BancActiu bloqueja la sol·licitud en 8 ms mostrant l\'expedient existent al CAP.',
      resolved: true,
      badgeColor: '#dc2626',
    },
    rolesActivity: {
      capUac: 'Gestió coordinada amb Treball Social per a la transició al catàleg PAO.',
      referent: 'Validació d\'expedients PAO CatSalut tramitats des de l\'eCAP.',
      entitat: 'Seguiment telefònic d\'estat de recuperació dels veïns en préstec.',
      taller: 'Pla de manteniment preventiu trimestral completat al 100%.',
      tecnicSalut: 'Extracció de dades semestrals: 24 pacients amb ictus atesos sense demora.',
      gerencia: 'Comparativa de despesa sanitària: estalvi estimat de més de 55.000 €.',
      superadmin: 'Test d\'estrès i simulació de concurrència (1.200 peticions/min).',
    },
  },
  {
    monthIndex: 6,
    monthName: 'Mes 6',
    calendarMonth: 'Abril 2027',
    theme: 'Balanç Semestral Consolidat & Retorn a la Societat (SROI)',
    description: 'Avaluació executiva dels 6 mesos d\'operació territorial: retorn social, estalvi d\'estades hospitalàries d\'aguts i informe gerencial.',
    newLoansCount: 22,
    returnedLoansCount: 24,
    activeLoansCount: 42,
    hospitalDaysSaved: 220,
    dpoScore: 105,
    operationalIncident: {
      title: 'Retard de 15 dies en la devolució d\'un caminador per hospitalització',
      description: 'Un ciutadà no es presenta a la data de venciment a causa d\'un reingrés mèdic imprevist.',
      mitigation: 'El sistema envia alerta escalada; el Referent de Gestió contacta la família i s\'autoritza pròrroga sense penalització.',
      resolved: true,
      badgeColor: '#10b981',
    },
    rolesActivity: {
      capUac: 'Consolidació del primer semestre de funcionament: 140 préstecs gestionats.',
      referent: 'Liquidació formal de les fites DPO no monetàries per volum de servei.',
      entitat: 'Taxa de devolució del 98.4% de fiances custodiades sense conflictes.',
      taller: 'Auditoria de parcs de material: índex de vida útil augmentat un 45%.',
      tecnicSalut: 'Generació de l\'Informe Epidemiològic Semestral per a CatSalut.',
      gerencia: 'Presentació del Retorn a la Societat: Ràtio SROI de 4,21 € per cada 1 €.',
      superadmin: 'Còpia de seguretat certificada de la base de dades i arxius històrics.',
    },
  },
];

export interface SixMonthConsolidatedResults {
  totalPrescripcions: number;
  totalDevolucions: number;
  totalActiusFinal: number;
  totalFiancesCustodiades: number;
  totalFiancesRetornades: number;
  totalDiesHospitalEstalviats: number;
  costEstadesHospitalEvitat: number;
  despesaPaoEvitada: number;
  inversioOperativaTotal: number;
  retornSocialNet: number;
  ratioSroi: number;
  assolimentDpoMitja: number;
  taxaConservacioEquips: number;
  distribucioPatologies: Record<MotiuCodi, number>;
  distribucioMaterials: Record<string, number>;
  incidenciesRegistrades: number;
  incidenciesResoltes: number;
}

export const CONSOLIDATED_RESULTS_6_MONTHS: SixMonthConsolidatedResults = {
  totalPrescripcions: 140,
  totalDevolucions: 98,
  totalActiusFinal: 42,
  totalFiancesCustodiades: 7000, // 140 * 50 €
  totalFiancesRetornades: 4900, // 98 * 50 € (100% de les devolucions)
  totalDiesHospitalEstalviats: 1240, // Dies d'ingrés hospitalari estalviats
  costEstadesHospitalEvitat: 68200, // 1.240 dies x 55 €/dia d'estalvi marginal
  despesaPaoEvitada: 28400, // Compres d'articles ortoprotètics nous evitades
  inversioOperativaTotal: 22900, // Despeses de taller, manteniment, logística i gestió
  retornSocialNet: 73700, // Valor social i sanitari net generat
  ratioSroi: 4.21, // 4,21 € retornats a la societat per cada 1 € invertit
  assolimentDpoMitja: 101.2, // 101.2% sobre objectiu de gestió administrativa
  taxaConservacioEquips: 98.4, // % d'equips que es mantenen en perfecte estat
  distribucioPatologies: {
    POST_QUIRURGIC_TRAUMA: 52,
    NEUROLOGIC_ICTUS: 32,
    DETERIORAMENT_FRAGILITAT: 31,
    TRAMIT_PAO_TRANSITORI: 18,
    CONVALESCENCIA_AGUTA: 7,
  },
  distribucioMaterials: {
    'Cadira de rodes': 58,
    'Caminador': 52,
    'Crosses': 24,
    'Llit articulat': 6,
  },
  incidenciesRegistrades: 6,
  incidenciesResoltes: 6,
};
