/**
 * Model de Dades per a la Simulació d'Alta Concurrència i Resiliència de Seguretat
 * BancActiu Enterprise · Xarxa Sanitària i Comunitària
 * 
 * Configura:
 * - 5 Centres d'Atenció Primària (CAP) amb 10 administratius UAC cadascun + Referent propi + Direcció pròpia.
 * - 5 Entitats Veïnals i Comunitàries amb 5 voluntaris actius cadascuna.
 * - Total de 80 operadors simultanis en temps real.
 * - Telemetria de picos de càrrega màxima (12.450 peticions concurrents).
 * - Simulador d'intrusió de força bruta amb bloqueig automàtic (HTTP 429 & Account Lockout).
 */

export interface CapWorker {
  id: string;
  name: string;
  dni: string;
  station: string;
  role: string;
  activeTodayLoans: number;
  status: 'ONLINE' | 'PROCESSANT_CIP' | 'LLIURANT_MATERIAL' | 'STANDBY';
}

export interface CapCenterDetail {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  gerencia: string;
  directorName: string;
  referent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    dpoScore: number;
    dpoTargetMet: boolean;
  };
  workers: CapWorker[];
  activeLoans: number;
  monthlyPrescriptions: number;
  stockInHub: number;
}

export interface EntityVolunteer {
  id: string;
  name: string;
  dni: string;
  phone: string;
  shift: string;
  completedDeliveries: number;
  status: 'ONLINE' | 'SIGNATURA_ACTIVA' | 'REVISIO_MATERIAL' | 'STANDBY';
}

export interface NeighborhoodEntityDetail {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  coordinator: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  volunteers: EntityVolunteer[];
  activeLoans: number;
  totalHistoricalLoans: number;
  stockInWarehouse: number;
  depositsSafeguardedEur: number;
}

export const FIVE_CAPS_DATA: CapCenterDetail[] = [
  {
    id: 'CAP-01-SALT',
    code: 'CAP-SALT',
    name: "Centre d'Atenció Primària Salt",
    address: 'Carrer Major 120',
    city: 'Salt',
    postalCode: '17190',
    phone: '972 24 50 11',
    gerencia: 'Gerència Territorial ICS Girona / Salt',
    directorName: 'Dra. Mercè Guixà Ballesta',
    referent: {
      id: 'ref-salt',
      name: 'Montserrat Casals Puig',
      email: 'mcasals.salt@gencat.cat',
      phone: '972 24 50 12',
      dpoScore: 102.4,
      dpoTargetMet: true,
    },
    activeLoans: 38,
    monthlyPrescriptions: 420,
    stockInHub: 12,
    workers: [
      { id: 'w-salt-01', name: 'Mireia Vidal Soler', dni: '40000001A', station: 'Taulell UAC 1', role: 'Administrativa Sanitària', activeTodayLoans: 6, status: 'ONLINE' },
      { id: 'w-salt-02', name: 'Pau Carbó Vinyals', dni: '40000002B', station: 'Taulell UAC 2', role: 'Administratiu Sanitari', activeTodayLoans: 4, status: 'PROCESSANT_CIP' },
      { id: 'w-salt-03', name: 'Laia Font Planella', dni: '40000003C', station: 'Taulell UAC 3', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'ONLINE' },
      { id: 'w-salt-04', name: 'Marc Bosch Prat', dni: '40000004D', station: 'Taulell UAC 4', role: 'Administratiu Sanitari', activeTodayLoans: 3, status: 'LLIURANT_MATERIAL' },
      { id: 'w-salt-05', name: 'Anna Serra Roig', dni: '40000005E', station: 'Taulell UAC 5', role: 'Administrativa Sanitària', activeTodayLoans: 7, status: 'ONLINE' },
      { id: 'w-salt-06', name: 'Joan Riera Blanch', dni: '40000006F', station: 'Taulell UAC 6', role: 'Administratiu Sanitari', activeTodayLoans: 4, status: 'STANDBY' },
      { id: 'w-salt-07', name: 'Carla Vila Oliveras', dni: '40000007G', station: 'Taulell UAC 7', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'PROCESSANT_CIP' },
      { id: 'w-salt-08', name: 'David Pons Comas', dni: '40000008H', station: 'Taulell UAC 8', role: 'Administratiu Sanitari', activeTodayLoans: 2, status: 'ONLINE' },
      { id: 'w-salt-09', name: 'Laura Prat Dalmau', dni: '40000009J', station: 'Taulell UAC 9', role: 'Administrativa Sanitària', activeTodayLoans: 6, status: 'ONLINE' },
      { id: 'w-salt-10', name: 'Sergi Valls Güell', dni: '40000010K', station: 'Taulell UAC 10', role: 'Administratiu Sanitari', activeTodayLoans: 3, status: 'LLIURANT_MATERIAL' },
    ],
  },
  {
    id: 'CAP-02-STACLAR',
    code: 'CAP-STACLARA',
    name: "Centre d'Atenció Primària Santa Clara",
    address: 'Carrer Santa Clara 34',
    city: 'Girona',
    postalCode: '17001',
    phone: '972 20 44 22',
    gerencia: 'Gerència Territorial ICS Girona Centre',
    directorName: 'Dr. Xavier Badosa Llorens',
    referent: {
      id: 'ref-staclara',
      name: 'Jordi Rovira Blanch',
      email: 'jrovira.staclara@gencat.cat',
      phone: '972 20 44 23',
      dpoScore: 99.8,
      dpoTargetMet: true,
    },
    activeLoans: 45,
    monthlyPrescriptions: 510,
    stockInHub: 15,
    workers: [
      { id: 'w-stc-01', name: 'Elena Costa Morera', dni: '41000001A', station: 'UAC Santa Clara 1', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'ONLINE' },
      { id: 'w-stc-02', name: 'Xavier Mas Tarrés', dni: '41000002B', station: 'UAC Santa Clara 2', role: 'Administratiu Sanitari', activeTodayLoans: 6, status: 'PROCESSANT_CIP' },
      { id: 'w-stc-03', name: 'Marta Soler Puig', dni: '41000003C', station: 'UAC Santa Clara 3', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-stc-04', name: 'Biel Roig Bosch', dni: '41000004D', station: 'UAC Santa Clara 4', role: 'Administratiu Sanitari', activeTodayLoans: 7, status: 'ONLINE' },
      { id: 'w-stc-05', name: 'Clàudia Rovira Mir', dni: '41000005E', station: 'UAC Santa Clara 5', role: 'Administrativa Sanitària', activeTodayLoans: 3, status: 'STANDBY' },
      { id: 'w-stc-06', name: 'Oriol Masó Casals', dni: '41000006F', station: 'UAC Santa Clara 6', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'LLIURANT_MATERIAL' },
      { id: 'w-stc-07', name: 'Sílvia Coll Darnés', dni: '41000007G', station: 'UAC Santa Clara 7', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-stc-08', name: 'Pol Torrent Oliver', dni: '41000008H', station: 'UAC Santa Clara 8', role: 'Administratiu Sanitari', activeTodayLoans: 6, status: 'PROCESSANT_CIP' },
      { id: 'w-stc-09', name: 'Irene Falgueras Prat', dni: '41000009J', station: 'UAC Santa Clara 9', role: 'Administrativa Sanitària', activeTodayLoans: 2, status: 'ONLINE' },
      { id: 'w-stc-10', name: 'Gerard Saura Vila', dni: '41000010K', station: 'UAC Santa Clara 10', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'ONLINE' },
    ],
  },
  {
    id: 'CAP-03-CANGIB',
    code: 'CAP-CANGIBERT',
    name: "Centre d'Atenció Primària Can Gibert del Pla",
    address: 'Plaça de la Solidaritat 2',
    city: 'Girona',
    postalCode: '17005',
    phone: '972 23 88 00',
    gerencia: 'Gerència Territorial ICS Girona Oest',
    directorName: 'Dra. Cristina Dalmau Teixidor',
    referent: {
      id: 'ref-cangibert',
      name: 'Núria Valls Codina',
      email: 'nvalls.cangibert@gencat.cat',
      phone: '972 23 88 01',
      dpoScore: 104.1,
      dpoTargetMet: true,
    },
    activeLoans: 32,
    monthlyPrescriptions: 390,
    stockInHub: 9,
    workers: [
      { id: 'w-cgb-01', name: 'Arnau Puig Massegur', dni: '42000001A', station: 'UAC Can Gibert 1', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'ONLINE' },
      { id: 'w-cgb-02', name: 'Berta Domènech Valls', dni: '42000002B', station: 'UAC Can Gibert 2', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-cgb-03', name: 'Roger Batlle Serra', dni: '42000003C', station: 'UAC Can Gibert 3', role: 'Administratiu Sanitari', activeTodayLoans: 6, status: 'PROCESSANT_CIP' },
      { id: 'w-cgb-04', name: 'Judit Oliveras Coma', dni: '42000004D', station: 'UAC Can Gibert 4', role: 'Administrativa Sanitària', activeTodayLoans: 3, status: 'STANDBY' },
      { id: 'w-cgb-05', name: 'Nil Alsius Franch', dni: '42000005E', station: 'UAC Can Gibert 5', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'ONLINE' },
      { id: 'w-cgb-06', name: 'Marina Güell Pujol', dni: '42000006F', station: 'UAC Can Gibert 6', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'LLIURANT_MATERIAL' },
      { id: 'w-cgb-07', name: 'Enric Masgrau Font', dni: '42000007G', station: 'UAC Can Gibert 7', role: 'Administratiu Sanitari', activeTodayLoans: 2, status: 'ONLINE' },
      { id: 'w-cgb-08', name: 'Cristina Dalmau Saura', dni: '42000008H', station: 'UAC Can Gibert 8', role: 'Administrativa Sanitària', activeTodayLoans: 7, status: 'ONLINE' },
      { id: 'w-cgb-09', name: 'Adrià Guitart Rius', dni: '42000009J', station: 'UAC Can Gibert 9', role: 'Administratiu Sanitari', activeTodayLoans: 3, status: 'PROCESSANT_CIP' },
      { id: 'w-cgb-10', name: 'Gemma Masó Vergés', dni: '42000010K', station: 'UAC Can Gibert 10', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'ONLINE' },
    ],
  },
  {
    id: 'CAP-04-TAIALA',
    code: 'CAP-TAIALA',
    name: "Centre d'Atenció Primària Taialà",
    address: 'Carrer de la Creu 8',
    city: 'Girona',
    postalCode: '17007',
    phone: '972 21 77 33',
    gerencia: 'Gerència Territorial ICS Girona Nord',
    directorName: 'Dr. Jaume Solà Piferrer',
    referent: {
      id: 'ref-taiala',
      name: 'Albert Fornés Riba',
      email: 'afornes.taiala@gencat.cat',
      phone: '972 21 77 34',
      dpoScore: 100.5,
      dpoTargetMet: true,
    },
    activeLoans: 29,
    monthlyPrescriptions: 340,
    stockInHub: 8,
    workers: [
      { id: 'w-tai-01', name: 'Ferran Solà Comas', dni: '43000001A', station: 'UAC Taialà 1', role: 'Administratiu Sanitari', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-tai-02', name: 'Clara Martí Roure', dni: '43000002B', station: 'UAC Taialà 2', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'PROCESSANT_CIP' },
      { id: 'w-tai-03', name: 'Martí Sabater Pons', dni: '43000003C', station: 'UAC Taialà 3', role: 'Administratiu Sanitari', activeTodayLoans: 3, status: 'ONLINE' },
      { id: 'w-tai-04', name: 'Sara Planas Vilar', dni: '43000004D', station: 'UAC Taialà 4', role: 'Administrativa Sanitària', activeTodayLoans: 6, status: 'ONLINE' },
      { id: 'w-tai-05', name: 'Guillem Pagès Mir', dni: '43000005E', station: 'UAC Taialà 5', role: 'Administratiu Sanitari', activeTodayLoans: 2, status: 'STANDBY' },
      { id: 'w-tai-06', name: 'Mariona Trias Coll', dni: '43000006F', station: 'UAC Taialà 6', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'LLIURANT_MATERIAL' },
      { id: 'w-tai-07', name: 'Dídac Camps Bosch', dni: '43000007G', station: 'UAC Taialà 7', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'ONLINE' },
      { id: 'w-tai-08', name: 'Andrea Noguera Sol', dni: '43000008H', station: 'UAC Taialà 8', role: 'Administrativa Sanitària', activeTodayLoans: 3, status: 'ONLINE' },
      { id: 'w-tai-09', name: 'Víctor Badosa Mas', dni: '43000009J', station: 'UAC Taialà 9', role: 'Administratiu Sanitari', activeTodayLoans: 5, status: 'PROCESSANT_CIP' },
      { id: 'w-tai-10', name: 'Júlia Casademont', dni: '43000010K', station: 'UAC Taialà 10', role: 'Administrativa Sanitària', activeTodayLoans: 4, status: 'ONLINE' },
    ],
  },
  {
    id: 'CAP-05-MONTIL',
    code: 'CAP-MONTILIVI',
    name: "Centre d'Atenció Primària Montilivi",
    address: 'Avinguda Lluís Pericot 45',
    city: 'Girona',
    postalCode: '17003',
    phone: '972 41 12 55',
    gerencia: 'Gerència Territorial ICS Girona Sud',
    directorName: 'Dra. Montserrat Serra Feliu',
    referent: {
      id: 'ref-montilivi',
      name: 'Cristina Mas Deulofeu',
      email: 'cmas.montilivi@gencat.cat',
      phone: '972 41 12 56',
      dpoScore: 103.2,
      dpoTargetMet: true,
    },
    activeLoans: 36,
    monthlyPrescriptions: 430,
    stockInHub: 11,
    workers: [
      { id: 'w-mon-01', name: 'Carles Vergés Vilar', dni: '44000001A', station: 'UAC Montilivi 1', role: 'Administratiu Sanitari', activeTodayLoans: 6, status: 'ONLINE' },
      { id: 'w-mon-02', name: 'Neus Ferrer Comas', dni: '44000002B', station: 'UAC Montilivi 2', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'PROCESSANT_CIP' },
      { id: 'w-mon-03', name: 'Aleix Prats Serra', dni: '44000003C', station: 'UAC Montilivi 3', role: 'Administratiu Sanitari', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-mon-04', name: 'Mireia Roura Bosch', dni: '44000004D', station: 'UAC Montilivi 4', role: 'Administrativa Sanitària', activeTodayLoans: 7, status: 'ONLINE' },
      { id: 'w-mon-05', name: 'Eloi Sala Oliveras', dni: '44000005E', station: 'UAC Montilivi 5', role: 'Administratiu Sanitari', activeTodayLoans: 3, status: 'STANDBY' },
      { id: 'w-mon-06', name: 'Teresa Viñas Pons', dni: '44000006F', station: 'UAC Montilivi 6', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'LLIURANT_MATERIAL' },
      { id: 'w-mon-07', name: 'Jan Morera Blanch', dni: '44000007G', station: 'UAC Montilivi 7', role: 'Administratiu Sanitari', activeTodayLoans: 4, status: 'ONLINE' },
      { id: 'w-mon-08', name: 'Sofia Boix Soler', dni: '44000008H', station: 'UAC Montilivi 8', role: 'Administrativa Sanitària', activeTodayLoans: 6, status: 'ONLINE' },
      { id: 'w-mon-09', name: 'Bernat Clarà Riera', dni: '44000009J', station: 'UAC Montilivi 9', role: 'Administratiu Sanitari', activeTodayLoans: 2, status: 'PROCESSANT_CIP' },
      { id: 'w-mon-10', name: 'Raquel Mir Güell', dni: '44000010K', station: 'UAC Montilivi 10', role: 'Administrativa Sanitària', activeTodayLoans: 5, status: 'ONLINE' },
    ],
  },
];

export const FIVE_NEIGHBORHOOD_ENTITIES_DATA: NeighborhoodEntityDetail[] = [
  {
    id: 'ENT-01-SALTNORD',
    code: 'ENT-SALTNORD',
    name: 'Associació Veïnal Salt Nord',
    address: 'Carrer Llarg 15',
    city: 'Salt',
    postalCode: '17190',
    phone: '972 24 01 99',
    coordinator: {
      id: 'coord-saltnord',
      name: 'Marta Puig Oliver',
      email: 'marta.puig@veinsalt.cat',
      phone: '655 12 34 56',
    },
    activeLoans: 46,
    totalHistoricalLoans: 142,
    stockInWarehouse: 18,
    depositsSafeguardedEur: 2300,
    volunteers: [
      { id: 'vol-sn-01', name: 'Carles Soler Darnés', dni: '45000001A', phone: '655 01 01 01', shift: 'Matí (09:00 - 13:00)', completedDeliveries: 34, status: 'ONLINE' },
      { id: 'vol-sn-02', name: 'Rosa Miró Massegur', dni: '45000002B', phone: '655 01 01 02', shift: 'Matí (10:00 - 14:00)', completedDeliveries: 28, status: 'SIGNATURA_ACTIVA' },
      { id: 'vol-sn-03', name: 'Pep Planas Comas', dni: '45000003C', phone: '655 01 01 03', shift: 'Tarda (16:00 - 19:30)', completedDeliveries: 42, status: 'REVISIO_MATERIAL' },
      { id: 'vol-sn-04', name: 'Dolors Font Blanch', dni: '45000004D', phone: '655 01 01 04', shift: 'Tarda (17:00 - 20:00)', completedDeliveries: 19, status: 'ONLINE' },
      { id: 'vol-sn-05', name: 'Jordi Baus Serra', dni: '45000005E', phone: '655 01 01 05', shift: 'Dissabte Matí', completedDeliveries: 25, status: 'STANDBY' },
    ],
  },
  {
    id: 'ENT-02-CREUROJA',
    code: 'ENT-CREUROJA',
    name: 'Creu Roja Gironès & Urgències',
    address: 'Carrer Bonastruc de Porta 12',
    city: 'Girona',
    postalCode: '17001',
    phone: '972 20 12 12',
    coordinator: {
      id: 'coord-creuroja',
      name: 'Enric Gallart Vinyals',
      email: 'enric.gallart@creuroja.org',
      phone: '655 22 33 44',
    },
    activeLoans: 38,
    totalHistoricalLoans: 118,
    stockInWarehouse: 25,
    depositsSafeguardedEur: 1900,
    volunteers: [
      { id: 'vol-cr-01', name: 'Marc Gómez Torrent', dni: '46000001A', phone: '655 02 02 01', shift: 'Matí (08:30 - 13:30)', completedDeliveries: 38, status: 'ONLINE' },
      { id: 'vol-cr-02', name: 'Sílvia Camps Bosch', dni: '46000002B', phone: '655 02 02 02', shift: 'Matí (09:00 - 14:00)', completedDeliveries: 31, status: 'ONLINE' },
      { id: 'vol-cr-03', name: 'Lluís Torras Prat', dni: '46000003C', phone: '655 02 02 03', shift: 'Tarda (15:30 - 19:30)', completedDeliveries: 45, status: 'SIGNATURA_ACTIVA' },
      { id: 'vol-cr-04', name: 'Anna Miralles Puig', dni: '46000004D', phone: '655 02 02 04', shift: 'Tarda (16:00 - 20:00)', completedDeliveries: 22, status: 'ONLINE' },
      { id: 'vol-cr-05', name: 'Joan Pera Masó', dni: '46000005E', phone: '655 02 02 05', shift: 'Cap de Setmana 24h', completedDeliveries: 29, status: 'REVISIO_MATERIAL' },
    ],
  },
  {
    id: 'ENT-03-STAEUGENIA',
    code: 'ENT-STAEUGENIA',
    name: 'Associació de Veïns Santa Eugènia de Ter',
    address: "Passeig d'Olot 54",
    city: 'Girona',
    postalCode: '17006',
    phone: '972 23 44 88',
    coordinator: {
      id: 'coord-staeugenia',
      name: 'Maria Àngels Bassets',
      email: 'mabassets@staeugeniaveins.cat',
      phone: '655 33 44 55',
    },
    activeLoans: 28,
    totalHistoricalLoans: 86,
    stockInWarehouse: 14,
    depositsSafeguardedEur: 1400,
    volunteers: [
      { id: 'vol-se-01', name: 'Quim Masó Oliveras', dni: '47000001A', phone: '655 03 03 01', shift: 'Matí (09:30 - 13:30)', completedDeliveries: 26, status: 'ONLINE' },
      { id: 'vol-se-02', name: 'Eva Sureda Comas', dni: '47000002B', phone: '655 03 03 02', shift: 'Matí (10:00 - 14:00)', completedDeliveries: 21, status: 'STANDBY' },
      { id: 'vol-se-03', name: 'Manel Rovira Serra', dni: '47000003C', phone: '655 03 03 03', shift: 'Tarda (16:30 - 19:30)', completedDeliveries: 35, status: 'ONLINE' },
      { id: 'vol-se-04', name: 'Teresa Casals Riera', dni: '47000004D', phone: '655 03 03 04', shift: 'Tarda (17:00 - 20:00)', completedDeliveries: 18, status: 'SIGNATURA_ACTIVA' },
      { id: 'vol-se-05', name: 'Pere Guitart Franch', dni: '47000005E', phone: '655 03 03 05', shift: 'Dissabte Matí', completedDeliveries: 23, status: 'ONLINE' },
    ],
  },
  {
    id: 'ENT-04-PONTMAJOR',
    code: 'ENT-PONTMAJOR',
    name: 'Casal Comunitari Pont Major',
    address: 'Carrer del Comerç 3',
    city: 'Girona',
    postalCode: '17007',
    phone: '972 21 00 44',
    coordinator: {
      id: 'coord-pontmajor',
      name: 'Ramon Teixidor Dalmau',
      email: 'rteixidor@pontmajor.cat',
      phone: '655 44 55 66',
    },
    activeLoans: 22,
    totalHistoricalLoans: 72,
    stockInWarehouse: 12,
    depositsSafeguardedEur: 1100,
    volunteers: [
      { id: 'vol-pm-01', name: 'Josep M. Blanch', dni: '48000001A', phone: '655 04 04 01', shift: 'Matí (09:00 - 13:00)', completedDeliveries: 24, status: 'ONLINE' },
      { id: 'vol-pm-02', name: 'Carmen Ortiz Solà', dni: '48000002B', phone: '655 04 04 02', shift: 'Matí (10:30 - 14:00)', completedDeliveries: 19, status: 'REVISIO_MATERIAL' },
      { id: 'vol-pm-03', name: 'Ignasi Bosch Vila', dni: '48000003C', phone: '655 04 04 03', shift: 'Tarda (16:00 - 19:30)', completedDeliveries: 31, status: 'ONLINE' },
      { id: 'vol-pm-04', name: 'Núria Triola Prat', dni: '48000004D', phone: '655 04 04 04', shift: 'Tarda (17:00 - 20:00)', completedDeliveries: 15, status: 'ONLINE' },
      { id: 'vol-pm-05', name: 'Pau Sabater Masó', dni: '48000005E', phone: '655 04 04 05', shift: 'Dissabte Matí', completedDeliveries: 20, status: 'STANDBY' },
    ],
  },
  {
    id: 'ENT-05-PLAPALAU',
    code: 'ENT-PLAPALAU',
    name: 'Associació Veïnal Pla de Palau - Sant Pau',
    address: 'Carrer Migdia 88',
    city: 'Girona',
    postalCode: '17003',
    phone: '972 41 99 22',
    coordinator: {
      id: 'coord-plapalau',
      name: 'Eulàlia Darnés Coll',
      email: 'edarnes@plapalau.cat',
      phone: '655 55 66 77',
    },
    activeLoans: 31,
    totalHistoricalLoans: 94,
    stockInWarehouse: 16,
    depositsSafeguardedEur: 1550,
    volunteers: [
      { id: 'vol-pp-01', name: 'Albert Viñas Morera', dni: '49000001A', phone: '655 05 05 01', shift: 'Matí (09:00 - 13:00)', completedDeliveries: 29, status: 'ONLINE' },
      { id: 'vol-pp-02', name: 'Glòria Vilar Torrent', dni: '49000002B', phone: '655 05 05 02', shift: 'Matí (10:00 - 14:00)', completedDeliveries: 25, status: 'SIGNATURA_ACTIVA' },
      { id: 'vol-pp-03', name: 'Santi Pujol Blanch', dni: '49000003C', phone: '655 05 05 03', shift: 'Tarda (16:30 - 19:30)', completedDeliveries: 33, status: 'ONLINE' },
      { id: 'vol-pp-04', name: 'Elisenda Solà Coma', dni: '49000004D', phone: '655 05 05 04', shift: 'Tarda (17:00 - 20:00)', completedDeliveries: 17, status: 'ONLINE' },
      { id: 'vol-pp-05', name: 'Xavier Ribas Güell', dni: '49000005E', phone: '655 05 05 05', shift: 'Dissabte Matí', completedDeliveries: 22, status: 'STANDBY' },
    ],
  },
];

export interface LoadSpikeResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  peakRps: number;
  averageLatencyMs: number;
  p99LatencyMs: number;
  concurrentThreads: number;
  activeCapCenters: number;
  activeEntities: number;
  dbLocksAcquired: number;
  raceConditionsPrevented: number;
  memoryUsageMb: number;
}

export const BENCHMARK_SPIKE_RESULTS: LoadSpikeResult = {
  totalRequests: 12450,
  successfulRequests: 12450,
  failedRequests: 0,
  peakRps: 582,
  averageLatencyMs: 14.2,
  p99LatencyMs: 38.6,
  concurrentThreads: 80,
  activeCapCenters: 5,
  activeEntities: 5,
  dbLocksAcquired: 140,
  raceConditionsPrevented: 18,
  memoryUsageMb: 84.5,
};

export interface BruteForceStep {
  step: number;
  timestamp: string;
  sourceIp: string;
  targetAccount: string;
  payloadTried: string;
  httpStatus: number;
  systemAction: string;
  rateLimitRemaining: number;
}

export const BRUTE_FORCE_ATTACK_TELEMETRY: BruteForceStep[] = [
  { step: 1, timestamp: '12:04:01.102', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: '123456', httpStatus: 401, systemAction: 'Credencial incorrecta. Intent 1/5 registrat.', rateLimitRemaining: 59 },
  { step: 2, timestamp: '12:04:01.215', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: 'admin2026', httpStatus: 401, systemAction: 'Credencial incorrecta. Intent 2/5 registrat.', rateLimitRemaining: 58 },
  { step: 3, timestamp: '12:04:01.340', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: 'salut123', httpStatus: 401, systemAction: 'Credencial incorrecta. Intent 3/5 registrat.', rateLimitRemaining: 57 },
  { step: 4, timestamp: '12:04:01.478', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: 'capgirona', httpStatus: 401, systemAction: 'Credencial incorrecta. Intent 4/5 registrat. Pre-alerta activa.', rateLimitRemaining: 56 },
  { step: 5, timestamp: '12:04:01.601', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: 'password', httpStatus: 401, systemAction: 'Llindar màxim assolit (5/5). Compte bloquejat (Account Lockout 15 min).', rateLimitRemaining: 55 },
  { step: 6, timestamp: '12:04:01.710', sourceIp: '192.168.1.189', targetAccount: 'uac_pilot', payloadTried: 'bancactiu2026', httpStatus: 423, systemAction: '⛔ Compte bloquejat: petició rebutjada immediatament.', rateLimitRemaining: 54 },
  { step: 7, timestamp: '12:04:01.835', sourceIp: '192.168.1.189', targetAccount: '52622304Y', payloadTried: 'root1234', httpStatus: 401, systemAction: 'Atac canvia a Superadmin. Detecció d’origen comú.', rateLimitRemaining: 53 },
  { step: 12, timestamp: '12:04:02.120', sourceIp: '192.168.1.189', targetAccount: 'api/v2/reservas', payloadTried: 'Bearer token_exploit', httpStatus: 401, systemAction: 'Intent d’extracció massiva API sense JWT vàlid.', rateLimitRemaining: 40 },
  { step: 25, timestamp: '12:04:02.890', sourceIp: '192.168.1.189', targetAccount: 'multiple_endpoints', payloadTried: 'Ràfega 60 req/s', httpStatus: 429, systemAction: '⛔ RATE LIMIT SUPERAT: HTTP 429 Too Many Requests.', rateLimitRemaining: 0 },
  { step: 50, timestamp: '12:04:03.950', sourceIp: '192.168.1.189', targetAccount: 'all_ports', payloadTried: 'Ràfega automatitzada', httpStatus: 429, systemAction: '🚨 BAN PERIMETRAL: IP bloquejada 5 minuts (Sliding Window Lockout). Alerta SIEM emesa.', rateLimitRemaining: 0 },
];
