import type { InventariItem, Reserva } from '@/types/api';
import type { CitizenDocument, DemoAccount, DemoAuditEvent, DemoChatAbsence, DemoChatAcknowledgement, DemoChatGroup, DemoChatMessage, DemoChatPresence, DemoEntity, DemoHelpDocument, DemoNotification, DemoStation, HardwareSettings } from '@/types/demo-user';

export type DemoSecuritySettings = {
  maintenanceMode: boolean;
  passwordExpirationDays: number;
  sessionTimeoutMinutes: number;
  requireComplexPassword: boolean;
  anonymizedCount: number;
};

export const DEFAULT_HARDWARE_SETTINGS: HardwareSettings = {
  signaturePadEnabled: false,      // FASE 1: Deshabilitat per defecte (activable a demanda)
  documentScannerEnabled: false,   // FASE 1: Deshabilitat per defecte (activable a demanda)
  rfidScannerEnabled: false,       // FASE 1: Deshabilitat per defecte
  implementationPhase: 'FASE_1',
};

type DemoStore = typeof globalThis & {
  __ecapDemoReservas?: Reserva[];
  __ecapDemoInventari?: InventariItem[];
  __ecapDemoAccounts?: DemoAccount[];
  __ecapDemoAudit?: DemoAuditEvent[];
  __ecapDemoStations?: DemoStation[];
  __ecapDemoEntities?: DemoEntity[];
  __ecapDemoNotifications?: DemoNotification[];
  __ecapDemoHelpDocuments?: DemoHelpDocument[];
  __ecapDemoChatPresence?: DemoChatPresence[];
  __ecapDemoChatAbsences?: DemoChatAbsence[];
  __ecapDemoChatAcknowledgements?: DemoChatAcknowledgement[];
  __ecapDemoChatGroups?: DemoChatGroup[];
  __ecapDemoChatMessages?: DemoChatMessage[];
  __ecapDemoSecuritySettings?: DemoSecuritySettings;
  __ecapDemoInstitutionalSettings?: InstitutionalSettings;
  __ecapDemoHardwareSettings?: HardwareSettings;
  __ecapDemoCitizenDocuments?: CitizenDocument[];
};

export type InstitutionalSettings = {
  platformName: string;
  subPlatformName: string;
  sponsoringEntity: string;
  healthCenterLabel: string;
  subtitleBanner: string;
  loginHeaderTitle: string;
  loginSubheader: string;
  securityStandardLabel: string;
  terminalLabel: string;
};

export const DEFAULT_INSTITUTIONAL_SETTINGS: InstitutionalSettings = {
  platformName: "BancActiu 1.0 · Salut Local",
  subPlatformName: "Plataforma de Gestió d'Autonomia i Préstec Comunitari",
  sponsoringEntity: "",
  healthCenterLabel: "CAP Sant Ildefons (Cornellà)",
  subtitleBanner: "Banc de Productes de Suport (BPS) · Pilot Cornellà de Llobregat",
  loginHeaderTitle: "BancActiu 1.0 · SISTEMA D'AUTONOMIA I PRÉSTEC COMUNITARI",
  loginSubheader: "BancActiu 1.0 · Banc de Productes de Suport i Mobilitat (Projecte Pilot Independent)",
  securityStandardLabel: "Normativa de seguretat estàndard (RGPD / ISO 27001): 90 dies",
  terminalLabel: "Terminal Segur Estació de Treball",
};

const demoStore = globalThis as DemoStore;

export const demoInstitutionalSettings: InstitutionalSettings = (demoStore.__ecapDemoInstitutionalSettings ??= { ...DEFAULT_INSTITUTIONAL_SETTINGS });

export const demoSecuritySettings: DemoSecuritySettings = (demoStore.__ecapDemoSecuritySettings ??= {
  maintenanceMode: false,
  passwordExpirationDays: 90,
  sessionTimeoutMinutes: 15,
  requireComplexPassword: true,
  anonymizedCount: 0,
});

export const demoHardwareSettings: HardwareSettings = (demoStore.__ecapDemoHardwareSettings ??= { ...DEFAULT_HARDWARE_SETTINGS });
export const demoCitizenDocuments: CitizenDocument[] = (demoStore.__ecapDemoCitizenDocuments ??= []);

export const initialDemoReservas: Reserva[] = [];

export const demoReservas: Reserva[] = (demoStore.__ecapDemoReservas ??= [...initialDemoReservas]);
if (demoReservas.length === 0) {
  demoReservas.push(...initialDemoReservas);
}
export const demoAccounts: DemoAccount[] = (demoStore.__ecapDemoAccounts ??= [
  { id: 'user-superadmin-52622304y', nombre: 'Bartomeu (Superadministrador Global)', rol: 'SUPER_ADMIN', roles: ['SUPER_ADMIN', 'DIRECCIO_GENERAL', 'CAP_REFERENT', 'CAP_ADMIN', 'ADMIN_TECNIC', 'ADMIN_ENTITAT'], entitat: 'ALL', activo: true, email: 'superadmin.52622304y@salut.cat' },
  { id: 'user-superadmin-48956602z', nombre: 'Administrador Tècnic Junior (48956602Z)', rol: 'SUPER_ADMIN', roles: ['SUPER_ADMIN'], entitat: 'ALL', activo: true, email: 'admin.junior.48956602z@salut.cat' },
  { id: 'user-gapic-metro-sud', nombre: 'Direcció GAPIC Metro Sud', rol: 'GERENCIA_TERRITORIAL', roles: ['GERENCIA_TERRITORIAL'], entitat: 'ENS-GAPIC-METRO-SUD', activo: true, email: 'gapic.metrosud@ics.gencat.cat' },
  { id: 'user-cap-sant-ildefons', nombre: 'Direcció Mèdica CAP Sant Ildefons', rol: 'DIRECCIO_CAP', roles: ['DIRECCIO_CAP', 'CAP_ADMIN'], entitat: 'CAP-SANT-ILDEFONS', activo: true, email: 'direccio.santildefons@ics.gencat.cat' },
  { id: 'user-serveis-socials-cornella', nombre: 'Serveis Socials Cornellà', rol: 'COORDINADOR_LOCAL', roles: ['COORDINADOR_LOCAL'], entitat: 'ENS-AJUNTAMENT-CORNELLA', activo: true, email: 'serveis.socials@cornella.cat' },
  { id: 'user-creu-roja-cornella', nombre: 'Responsable Creu Roja Cornellà', rol: 'ADMIN_ENTITAT', roles: ['ADMIN_ENTITAT'], entitat: 'ENT-CR-CORNELLA', activo: true, email: 'cornella@creuroja.org' },
  { id: 'user-avv-gavarra', nombre: 'Coordinador AVV La Gavarra', rol: 'ADMIN_ENTITAT', roles: ['ADMIN_ENTITAT', 'BARRI'], entitat: 'ENT-AVV-GAVARRA', activo: true, email: 'avv.lagavarra@gmail.com' },
]);

for (const account of demoAccounts) {
  if (!Array.isArray(account.roles)) account.roles = [account.rol];
}

const initialAuditEvents: DemoAuditEvent[] = [
  {
    id: 'AUD-INIT-01',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    actorId: 'user-cap-doctor',
    actorName: 'Dr. Jordi Gutiérrez',
    actorRole: 'CAP_ADMIN',
    action: 'INICI_SESSIO',
    resource: 'Fitxer de receptes i prescripcions mèdiques',
    details: 'Autenticació al lloc de treball Centro de Atención Primaria i verificació d’estació de treball',
  },
  {
    id: 'AUD-INIT-02',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    actorId: 'user-cap-doctor',
    actorName: 'Dr. Jordi Gutiérrez',
    actorRole: 'CAP_ADMIN',
    action: 'CONSULTA_DATOS',
    resource: 'Expedient sanitari CIP MART780512M01',
    details: 'Visualització de dades personals per a indicació de cadira de rodes',
  },
  {
    id: 'AUD-INIT-03',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actorId: 'user-neighborhood',
    actorName: 'Carles Soler',
    actorRole: 'BARRI',
    action: 'CONSULTA_DATOS',
    resource: 'Llistat de reserves pendents ENT-01',
    details: 'Comprovació de dades del ciutadà per a tramitació de lliurament',
  },
  {
    id: 'AUD-INIT-04',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    actorId: 'user-entity',
    actorName: 'Marta Puig',
    actorRole: 'ADMIN_ENTITAT',
    action: 'AMPLIACIO_PRESTEC',
    resource: 'Préstec #20260001',
    details: 'Aprovació de pròrroga temporal de material ortopèdic per necessitat clínica',
  },
];

export const demoAuditEvents = (demoStore.__ecapDemoAudit ??= [...initialAuditEvents]);

export const demoEntities = (demoStore.__ecapDemoEntities ??= [
  { id: 'CAP-SANT-ILDEFONS', name: 'CAP Sant Ildefons', kind: 'CAP', location: 'Av. República Argentina, s/n, Cornellà', contact: 'santildefons@salut.cat', phone: '933771100', active: true },
  { id: 'CAP-MARTI-JULIA', name: 'CAP Martí Julià', kind: 'CAP', location: 'Av. de la Línia Elèctrica, 11-15, Cornellà', contact: 'martijulia@salut.cat', phone: '933772200', active: true },
  { id: 'CUAP-CORNELLA', name: 'CUAP Cornellà', kind: 'CAP', location: 'Bellaterra, 39, Cornellà', contact: 'cuap.cornella@salut.cat', phone: '933773300', active: true },
  { id: 'ENT-CR-CORNELLA', name: 'Creu Roja Cornellà de Llobregat', kind: 'ENTIDAD_COLABORADORA', location: 'Carrer Rubió i Ors, 104, Cornellà', contact: 'cornella@creuroja.org', phone: '933771122', active: true },
  { id: 'ENT-AVV-GAVARRA', name: 'Associació de Veïns La Gavarra', kind: 'ENTIDAD_VECINAL', location: "Plaça d'Europa, Cornellà", contact: 'avv.lagavarra@gmail.com', phone: '933754455', active: true },
]);
if (!demoEntities.some((e) => e.id === 'ENT-PROV')) {
  demoEntities.push({
    id: 'ENT-PROV',
    name: 'Punt Comunitari Barri Vell (Baixa Custodiada)',
    kind: 'ENTIDAD_VECINAL',
    location: 'Salt Barri Vell',
    contact: 'barrivell@salut.cat',
    phone: '972 11 22 33',
    active: false,
  });
}

export const demoStations = (demoStore.__ecapDemoStations ??= [
  { id: 'ST-CAP-ILDEFONS', entity: 'CAP-SANT-ILDEFONS', name: 'Puesto CAP Sant Ildefons', type: 'PUESTO', location: 'Recepció CAP Sant Ildefons', status: 'ACTIVO', deviceType: '', ipAddress: '10.120.4.15', macAddress: '00:1B:44:11:3A:B7', lastPing: 'Fa 2s', latencyMs: 14 },
  { id: 'ST-CAP-MARTI', entity: 'CAP-MARTI-JULIA', name: 'Puesto CAP Martí Julià', type: 'PUESTO', location: 'Recepció CAP Martí Julià', status: 'ACTIVO', deviceType: '', ipAddress: '10.120.4.22', macAddress: '00:1B:44:2A:8C:01', lastPing: 'Fa 5s', latencyMs: 18 },
  { id: 'ST-CUAP-CORNELLA', entity: 'CUAP-CORNELLA', name: 'Puesto CUAP Cornellà', type: 'PUESTO', location: 'Urgències CUAP Cornellà', status: 'ACTIVO', deviceType: '', ipAddress: '10.120.4.30', macAddress: '00:1B:44:3A:11:02', lastPing: 'Fa 1s', latencyMs: 10 },
  { id: 'ST-CR-CORNELLA', entity: 'ENT-CR-CORNELLA', name: 'Punt Creu Roja Cornellà', type: 'PUESTO', location: 'Seu Creu Roja Cornellà', status: 'ACTIVO', deviceType: '', ipAddress: '192.168.1.101', macAddress: 'B8:27:EB:55:12:F4', lastPing: 'Fa 8s', latencyMs: 24 },
  { id: 'ST-AVV-GAVARRA', entity: 'ENT-AVV-GAVARRA', name: 'Punt Veïnal La Gavarra', type: 'PUESTO', location: 'Local AVV La Gavarra', status: 'ACTIVO', deviceType: '', ipAddress: '192.168.1.145', macAddress: 'CC:2D:E0:41:88:99', lastPing: 'Fa 3s', latencyMs: 32 },
]);

export const demoNotifications = (demoStore.__ecapDemoNotifications ??= []);
export const demoHelpDocuments = (demoStore.__ecapDemoHelpDocuments ??= []);
export const demoChatPresence = (demoStore.__ecapDemoChatPresence ??= []);
export const demoChatAbsences = (demoStore.__ecapDemoChatAbsences ??= []);
export const demoChatAcknowledgements = (demoStore.__ecapDemoChatAcknowledgements ??= []);
export const demoChatGroups = (demoStore.__ecapDemoChatGroups ??= []);
export const demoChatMessages = (demoStore.__ecapDemoChatMessages ??= []);

const initialInventory: InventariItem[] = [
  { id: 'SR-01', tipo: 'Cadira de rodes', estado: 'Disponible', id_entitat: 'ENT-CR-CORNELLA', obs: 'Interior, rodes posteriors petites, ample estàndard' },
  { id: 'SR-02', tipo: 'Cadira de rodes', estado: 'Disponible', id_entitat: 'ENT-CR-CORNELLA', obs: 'Exterior, rodes posteriors grans, alumini lleuger' },
  { id: 'CM-03', tipo: 'Caminador', estado: 'Disponible', id_entitat: 'ENT-AVV-GAVARRA', obs: 'Amb dues rodes davanteres, alçada regulable' },
  { id: 'CM-02', tipo: 'Caminador', estado: 'Disponible', id_entitat: 'ENT-CR-CORNELLA', obs: 'Pas a pas, plegable, alçada regulable' },
  { id: 'SR-03', tipo: 'Cadira de rodes', estado: 'Disponible', id_entitat: 'ENT-AVV-GAVARRA', obs: 'Exterior, rodes grans, ample especial per a més de 100 kg' },
  { id: 'CR-01', tipo: 'Crosses', estado: 'En Manteniment', id_entitat: 'TALLER-CENTRAL', obs: 'Revisió de frens' },
  { id: 'CR-02', tipo: 'Crosses', estado: 'Disponible', id_entitat: 'ENT-CR-CORNELLA', obs: 'Alumini, mida adulta' },
  { id: 'CR-03', tipo: 'Crosses', estado: 'Disponible', id_entitat: 'ENT-AVV-GAVARRA', obs: 'Alumini, altura regulable' },
];

export const demoInventari = (demoStore.__ecapDemoInventari ??= []);
for (const item of initialInventory) {
  const existing = demoInventari.find((entry) => entry.id === item.id);
  if (!existing) demoInventari.push(item);
  else if (['Estàndard adult', 'Alumini lleuger', 'Amb rodes', 'Plegable, alçada regulable', 'Respatller ajustable'].includes(existing.obs)) {
    existing.obs = item.obs;
  }
}

const uniqueInventory = [...new Map(demoInventari.map((item) => [item.id, item])).values()];
demoInventari.splice(0, demoInventari.length, ...uniqueInventory);
demoReservas.splice(0, demoReservas.length, ...demoReservas.filter(
  (reserva) => !['DEMO-0001', 'DEMO-0002', 'DEMO-0003'].includes(reserva.cip),
));

for (const item of demoInventari) {
  if (item.estado === 'En Manteniment') continue;
  const assignedReservation = demoReservas.find(
    (reserva) =>
      reserva.id_producte_assignat === item.id &&
      reserva.estat_reserva === 'Pendent de recollida',
  );
  const activeReservation = demoReservas.find(
    (reserva) =>
      reserva.id_producte_assignat === item.id &&
      ['Lliurat al veí', 'Préstec Ampliat'].includes(reserva.estat_reserva),
  );
  item.estado = assignedReservation ? 'Reservat' : activeReservation ? 'Prestat' : 'Disponible';
}

export function getDemoStoreSnapshot() {
  return {
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    reservas: demoReservas,
    inventari: demoInventari,
    accounts: demoAccounts,
    audit: demoAuditEvents,
    stations: demoStations,
    entities: demoEntities,
    securitySettings: demoSecuritySettings,
  };
}

export function restoreDemoStoreSnapshot(snapshot: {
  reservas?: Reserva[];
  inventari?: InventariItem[];
  accounts?: DemoAccount[];
  audit?: DemoAuditEvent[];
  stations?: DemoStation[];
  entities?: DemoEntity[];
  securitySettings?: DemoSecuritySettings;
}) {
  if (Array.isArray(snapshot.reservas)) demoReservas.splice(0, demoReservas.length, ...snapshot.reservas);
  if (Array.isArray(snapshot.inventari)) demoInventari.splice(0, demoInventari.length, ...snapshot.inventari);
  if (Array.isArray(snapshot.accounts)) demoAccounts.splice(0, demoAccounts.length, ...snapshot.accounts);
  if (Array.isArray(snapshot.audit)) demoAuditEvents.splice(0, demoAuditEvents.length, ...snapshot.audit);
  if (Array.isArray(snapshot.stations)) demoStations.splice(0, demoStations.length, ...snapshot.stations);
  if (Array.isArray(snapshot.entities)) demoEntities.splice(0, demoEntities.length, ...snapshot.entities);
  if (snapshot.securitySettings) Object.assign(demoSecuritySettings, snapshot.securitySettings);
}

export function resetDemoStoreToFactory() {
  demoReservas.splice(0, demoReservas.length);
  demoInventari.splice(0, demoInventari.length, ...initialInventory);
  demoAuditEvents.splice(0, demoAuditEvents.length, ...initialAuditEvents);
  demoSecuritySettings.maintenanceMode = false;
  demoSecuritySettings.passwordExpirationDays = 90;
  demoSecuritySettings.sessionTimeoutMinutes = 15;
  demoSecuritySettings.requireComplexPassword = true;
  demoSecuritySettings.anonymizedCount = 0;
}
