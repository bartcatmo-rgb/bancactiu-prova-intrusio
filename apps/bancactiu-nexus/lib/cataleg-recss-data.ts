export const REGIONS_SANITARIES = [
  { id: 'RS_BCN', nom: 'Barcelona Ciutat' },
  { id: 'RS_METRO_SUD', nom: 'Barcelona Metropolitana Sud' },
  { id: 'RS_METRO_NORD', nom: 'Barcelona Metropolitana Nord' },
  { id: 'RS_GIRONA', nom: 'Girona' },
  { id: 'RS_CAMP_TARRAGONA', nom: 'Camp de Tarragona' },
  { id: 'RS_TERRES_EBRE', nom: 'Terres de l\'Ebre' },
  { id: 'RS_LLEIDA', nom: 'Lleida i Alt Pirineu' },
  { id: 'RS_CAT_CENTRAL', nom: 'Catalunya Central' },
];

/**
 * CATÀLEG OFICIAL DE CENTRES SANITARIS DE CATALUNYA (RECSS / SISCAT / DADES OBERTES GENCAT)
 * Registre d'Entitats, Centres i Serveis Sanitaris del Departament de Salut de la Generalitat de Catalunya
 */

export interface RECSSCenter {
  id: string;
  regio_sanitaria_id: string;
  regio_nom: string;
  gerencia_id: string;
  gerencia_nom: string;
  sector_id: string;
  cap_id: string;
  cap_nom: string;
  codi_recss: string;
  municipi: string;
  adreca: string;
  actiu: boolean;
}

export interface GerenciaTerritorialRecord {
  id: string;
  nom: string;
  regio_id: string;
  regio_nom: string;
  hospital_referencia: string;
  responsable: string;
  adreca: string;
  actiu: boolean;
}

// ============================================================================
// GERÈNCIES TERRITORIALS OFICIALS (ICS I CONSORCIS SANITARIS DE CATALUNYA)
// ============================================================================
export const INITIAL_GERENCIES: GerenciaTerritorialRecord[] = [
  {
    id: 'GT_GIRONA',
    nom: 'Gerència Territorial Girona (ICS)',
    regio_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    hospital_referencia: 'Hospital Universitari Dr. Josep Trueta',
    responsable: 'Dra. Meritxell Masó i Carrera',
    adreca: 'Carrer de Santa Clara 33, Girona',
    actiu: true,
  },
  {
    id: 'GT_METRO_SUD',
    nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    regio_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    hospital_referencia: 'Hospital Universitari de Bellvitge',
    responsable: 'Dr. Xavier Fontanet Valls',
    adreca: 'Feixa Llarga s/n, L\'Hospitalet de Llobregat',
    actiu: true,
  },
  {
    id: 'GT_BCN_CIUTAT',
    nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    regio_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    hospital_referencia: 'Hospital Universitari Vall d\'Hebron',
    responsable: 'Dr. Jaume Estany i Ricart',
    adreca: 'Passeig de la Vall d\'Hebron 119, Barcelona',
    actiu: true,
  },
  {
    id: 'GT_METRO_NORD',
    nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    regio_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    hospital_referencia: 'Hospital Universitari Germans Trias i Pujol',
    responsable: 'Dra. Anna Aran i Solé',
    adreca: 'Carretera de Canyet s/n, Badalona',
    actiu: true,
  },
  {
    id: 'GT_TARRAGONA',
    nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    regio_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    hospital_referencia: 'Hospital Universitari Joan XXIII',
    responsable: 'Dr. Rafael Gómez i Gómez',
    adreca: 'Carrer Dr. Mallafrè Guasch 4, Tarragona',
    actiu: true,
  },
  {
    id: 'GT_TERRES_EBRE',
    nom: 'Gerència Territorial Terres de l\'Ebre (ICS)',
    regio_id: 'RS_TERRES_EBRE',
    regio_nom: 'Terres de l\'Ebre',
    hospital_referencia: 'Hospital de Tortosa Verge de la Cinta',
    responsable: 'Dra. Maria Ferré i Gras',
    adreca: 'Carrer Esplanetes 14, Tortosa',
    actiu: true,
  },
  {
    id: 'GT_LLEIDA',
    nom: 'Gerència Territorial Lleida i Alt Pirineu (ICS)',
    regio_id: 'RS_LLEIDA',
    regio_nom: 'Lleida',
    hospital_referencia: 'Hospital Universitari Arnau de Vilanova',
    responsable: 'Dr. Alfons Segarra i Medrano',
    adreca: 'Avinguda Alcalde Rovira Roure 80, Lleida',
    actiu: true,
  },
  {
    id: 'GT_CAT_CENTRAL',
    nom: 'Gerència Territorial Catalunya Central (ICS)',
    regio_id: 'RS_CAT_CENTRAL',
    regio_nom: 'Catalunya Central',
    hospital_referencia: 'Hospital de Sant Joan de Déu (Althaia)',
    responsable: 'Dra. Montserrat Vilella i Cuadrada',
    adreca: 'Carrer Pica d\'Estats 13, Manresa',
    actiu: true,
  },
];

// ============================================================================
// MOSTRA EXTENSA DE CENTRES SANITARIS RECSS (SISCAT)
// ============================================================================
export const INITIAL_RECSS_CENTERS: RECSSCenter[] = [
  // --- GIRONA ---
  {
    id: 'RECSS-GI-01',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GIRONES_SALT',
    cap_id: 'CAP_SALT',
    cap_nom: 'CAP Salt (Jordi Nadal)',
    codi_recss: 'E17001201',
    municipi: 'Salt',
    adreca: 'Carrer Francesc Macià 15, Salt',
    actiu: true,
  },
  {
    id: 'RECSS-GI-02',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GIRONA_SUD',
    cap_id: 'CAP_CAN_GIBERT',
    cap_nom: 'CAP Can Gibert del Pla',
    codi_recss: 'E17001202',
    municipi: 'Girona',
    adreca: 'Carrer de la Creu 44, Girona',
    actiu: true,
  },
  {
    id: 'RECSS-GI-03',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GIRONA_CENTRE',
    cap_id: 'CAP_SANTA_CLARA',
    cap_nom: 'CAP Santa Clara (Girona)',
    codi_recss: 'E17001203',
    municipi: 'Girona',
    adreca: 'Carrer Santa Clara 33, Girona',
    actiu: true,
  },
  {
    id: 'RECSS-GI-04',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GIRONA_EST',
    cap_id: 'CAP_MONTILIVI',
    cap_nom: 'CAP Montilivi',
    codi_recss: 'E17001204',
    municipi: 'Girona',
    adreca: 'Carrer Castell de Bellcaire 12, Girona',
    actiu: true,
  },
  {
    id: 'RECSS-GI-05',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GIRONES_NORD',
    cap_id: 'CAP_SARRIA',
    cap_nom: 'CAP Sarrià de Ter',
    codi_recss: 'E17001205',
    municipi: 'Sarrià de Ter',
    adreca: 'Carrer Major 78, Sarrià de Ter',
    actiu: true,
  },
  {
    id: 'RECSS-GI-06',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_PLA_ESTANY',
    cap_id: 'CAP_BANYOLES',
    cap_nom: 'CAP Banyoles',
    codi_recss: 'E17001206',
    municipi: 'Banyoles',
    adreca: 'Plaça de les Rodes 2, Banyoles',
    actiu: true,
  },
  {
    id: 'RECSS-GI-07',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_ALT_EMPORDÀ',
    cap_id: 'CAP_FIGUERES',
    cap_nom: 'CAP Figueres (Ernest Lluch)',
    codi_recss: 'E17001207',
    municipi: 'Figueres',
    adreca: 'Ronda Sud s/n, Figueres',
    actiu: true,
  },
  {
    id: 'RECSS-GI-08',
    regio_sanitaria_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    gerencia_id: 'GT_GIRONA',
    gerencia_nom: 'Gerència Territorial Girona (ICS)',
    sector_id: 'SEC_GARROTXA',
    cap_id: 'CAP_OLOT',
    cap_nom: 'CAP Olot (Garrotxa)',
    codi_recss: 'E17001208',
    municipi: 'Olot',
    adreca: 'Avinguda Països Catalans 89, Olot',
    actiu: true,
  },

  // --- BARCELONA METROPOLITANA SUD ---
  {
    id: 'RECSS-MS-01',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_L_HOSPITALET_1',
    cap_id: 'CAP_BELLVITGE',
    cap_nom: 'CAP Bellvitge',
    codi_recss: 'E08001301',
    municipi: 'L\'Hospitalet de Llobregat',
    adreca: 'Rambla Marina 161, L\'Hospitalet',
    actiu: true,
  },
  {
    id: 'RECSS-MS-02',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_L_HOSPITALET_2',
    cap_id: 'CAP_COLLBLANC',
    cap_nom: 'CAP Collblanc',
    codi_recss: 'E08001302',
    municipi: 'L\'Hospitalet de Llobregat',
    adreca: 'Carrer de Mas 12, L\'Hospitalet',
    actiu: true,
  },
  {
    id: 'RECSS-MS-03',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_BAIX_LLOBREGAT_LITORAL',
    cap_id: 'CAP_EL_PRAT',
    cap_nom: 'CAP Ramona Via (El Prat)',
    codi_recss: 'E08001303',
    municipi: 'El Prat de Llobregat',
    adreca: 'Carrer Narcís Monturiol 22, El Prat',
    actiu: true,
  },
  {
    id: 'RECSS-MS-04',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_SANT_BOI',
    cap_id: 'CAP_SANT_BOI',
    cap_nom: 'CAP Montclar (Sant Boi)',
    codi_recss: 'E08001304',
    municipi: 'Sant Boi de Llobregat',
    adreca: 'Carrer Murillo 14, Sant Boi',
    actiu: true,
  },
  {
    id: 'RECSS-MS-05',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_DELTA_LLOBREGAT',
    cap_id: 'CAP_VILADECANS',
    cap_nom: 'CAP Maria Bernades (Viladecans)',
    codi_recss: 'E08001305',
    municipi: 'Viladecans',
    adreca: 'Avinguda Josep Tarradellas 4, Viladecans',
    actiu: true,
  },
  {
    id: 'RECSS-MS-06',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    gerencia_id: 'GT_METRO_SUD',
    gerencia_nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    sector_id: 'SEC_CORNELLA',
    cap_id: 'CAP_CORNELLA',
    cap_nom: 'CAP Martí i Julià (Cornellà)',
    codi_recss: 'E08001306',
    municipi: 'Cornellà de Llobregat',
    adreca: 'Avinguda Parc 28, Cornellà',
    actiu: true,
  },

  // --- BARCELONA CIUTAT ---
  {
    id: 'RECSS-BCN-01',
    regio_sanitaria_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    gerencia_id: 'GT_BCN_CIUTAT',
    gerencia_nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    sector_id: 'SEC_BCN_EIXAMPLE',
    cap_id: 'CAP_MANSO',
    cap_nom: 'CAP Manso (Eixample)',
    codi_recss: 'E08001401',
    municipi: 'Barcelona',
    adreca: 'Carrer de Manso 19, Barcelona',
    actiu: true,
  },
  {
    id: 'RECSS-BCN-02',
    regio_sanitaria_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    gerencia_id: 'GT_BCN_CIUTAT',
    gerencia_nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    sector_id: 'SEC_BCN_NOU_BARRIS',
    cap_id: 'CAP_ROQUETES',
    cap_nom: 'CAP Roquetes (Nou Barris)',
    codi_recss: 'E08001402',
    municipi: 'Barcelona',
    adreca: 'Carrer de les Roquetes 18, Barcelona',
    actiu: true,
  },
  {
    id: 'RECSS-BCN-03',
    regio_sanitaria_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    gerencia_id: 'GT_BCN_CIUTAT',
    gerencia_nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    sector_id: 'SEC_BCN_SANT_ANDREU',
    cap_id: 'CAP_SANT_ANDREU',
    cap_nom: 'CAP Sant Andreu',
    codi_recss: 'E08001403',
    municipi: 'Barcelona',
    adreca: 'Avinguda Meridiana 428, Barcelona',
    actiu: true,
  },
  {
    id: 'RECSS-BCN-04',
    regio_sanitaria_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    gerencia_id: 'GT_BCN_CIUTAT',
    gerencia_nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    sector_id: 'SEC_BCN_GRACIA',
    cap_id: 'CAP_GRACIA',
    cap_nom: 'CAP Pare Claret (Gràcia)',
    codi_recss: 'E08001404',
    municipi: 'Barcelona',
    adreca: 'Carrer Sant Antoni Maria Claret 19, Barcelona',
    actiu: true,
  },
  {
    id: 'RECSS-BCN-05',
    regio_sanitaria_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    gerencia_id: 'GT_BCN_CIUTAT',
    gerencia_nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    sector_id: 'SEC_BCN_CIUTAT_VELLA',
    cap_id: 'CAP_RAVAL_SUD',
    cap_nom: 'CAP Dr. Lluís Sayé (Raval)',
    codi_recss: 'E08001405',
    municipi: 'Barcelona',
    adreca: 'Carrer Torres i Amat 8, Barcelona',
    actiu: true,
  },

  // --- BARCELONA METROPOLITANA NORD ---
  {
    id: 'RECSS-MN-01',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    gerencia_id: 'GT_METRO_NORD',
    gerencia_nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    sector_id: 'SEC_BADALONA_CENTRE',
    cap_id: 'CAP_DR_ROBERT',
    cap_nom: 'CAP Dr. Robert (Badalona)',
    codi_recss: 'E08001501',
    municipi: 'Badalona',
    adreca: 'Plaça del Doctor Robert 1, Badalona',
    actiu: true,
  },
  {
    id: 'RECSS-MN-02',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    gerencia_id: 'GT_METRO_NORD',
    gerencia_nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    sector_id: 'SEC_SANTA_COLOMA',
    cap_id: 'CAP_SANTA_COLOMA',
    cap_nom: 'CAP Santa Coloma de Gramenet',
    codi_recss: 'E08001502',
    municipi: 'Santa Coloma de Gramenet',
    adreca: 'Carrer Major 49, Santa Coloma',
    actiu: true,
  },
  {
    id: 'RECSS-MN-03',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    gerencia_id: 'GT_METRO_NORD',
    gerencia_nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    sector_id: 'SEC_VALLES_ORIENTAL',
    cap_id: 'CAP_GRANOLLERS',
    cap_nom: 'CAP Granollers Centre',
    codi_recss: 'E08001503',
    municipi: 'Granollers',
    adreca: 'Carrer Museu 19, Granollers',
    actiu: true,
  },
  {
    id: 'RECSS-MN-04',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    gerencia_id: 'GT_METRO_NORD',
    gerencia_nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    sector_id: 'SEC_MARESME',
    cap_id: 'CAP_MATARO',
    cap_nom: 'CAP Mataró Centre',
    codi_recss: 'E08001504',
    municipi: 'Mataró',
    adreca: 'Carrer Lepant 11, Mataró',
    actiu: true,
  },

  // --- CAMP DE TARRAGONA ---
  {
    id: 'RECSS-TG-01',
    regio_sanitaria_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    gerencia_id: 'GT_TARRAGONA',
    gerencia_nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    sector_id: 'SEC_TARRAGONA_CENTRE',
    cap_id: 'CAP_TARRACO',
    cap_nom: 'CAP Tarraco (Tarragona Centre)',
    codi_recss: 'E43001601',
    municipi: 'Tarragona',
    adreca: 'Carrer Doctor Mallafrè Guasch 4, Tarragona',
    actiu: true,
  },
  {
    id: 'RECSS-TG-02',
    regio_sanitaria_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    gerencia_id: 'GT_TARRAGONA',
    gerencia_nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    sector_id: 'SEC_REUS',
    cap_id: 'CAP_REUS',
    cap_nom: 'CAP Sant Pere (Reus)',
    codi_recss: 'E43001602',
    municipi: 'Reus',
    adreca: 'Carrer Cambrils s/n, Reus',
    actiu: true,
  },
  {
    id: 'RECSS-TG-03',
    regio_sanitaria_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    gerencia_id: 'GT_TARRAGONA',
    gerencia_nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    sector_id: 'SEC_TORREFORTA',
    cap_id: 'CAP_TORREFORTA',
    cap_nom: 'CAP Torreforta - La Granja',
    codi_recss: 'E43001603',
    municipi: 'Tarragona',
    adreca: 'Carrer Illa de Menorca s/n, Tarragona',
    actiu: true,
  },

  // --- TERRES DE L\'EBRE ---
  {
    id: 'RECSS-TE-01',
    regio_sanitaria_id: 'RS_TERRES_EBRE',
    regio_nom: 'Terres de l\'Ebre',
    gerencia_id: 'GT_TERRES_EBRE',
    gerencia_nom: 'Gerència Territorial Terres de l\'Ebre (ICS)',
    sector_id: 'SEC_TORTOSA',
    cap_id: 'CAP_TORTOSA',
    cap_nom: 'CAP Tortosa Est (El Temple)',
    codi_recss: 'E43001701',
    municipi: 'Tortosa',
    adreca: 'Plaça de la Corona d\'Aragó s/n, Tortosa',
    actiu: true,
  },
  {
    id: 'RECSS-TE-02',
    regio_sanitaria_id: 'RS_TERRES_EBRE',
    regio_nom: 'Terres de l\'Ebre',
    gerencia_id: 'GT_TERRES_EBRE',
    gerencia_nom: 'Gerència Territorial Terres de l\'Ebre (ICS)',
    sector_id: 'SEC_AMPOSTA',
    cap_id: 'CAP_AMPOSTA',
    cap_nom: 'CAP Amposta',
    codi_recss: 'E43001702',
    municipi: 'Amposta',
    adreca: 'Carrer Miquel Granell 75, Amposta',
    actiu: true,
  },

  // --- LLEIDA I ALT PIRINEU ---
  {
    id: 'RECSS-LL-01',
    regio_sanitaria_id: 'RS_LLEIDA',
    regio_nom: 'Lleida',
    gerencia_id: 'GT_LLEIDA',
    gerencia_nom: 'Gerència Territorial Lleida i Alt Pirineu (ICS)',
    sector_id: 'SEC_LLEIDA_URBA',
    cap_id: 'CAP_EIXAMPLE_LLEIDA',
    cap_nom: 'CAP Eixample (Lleida)',
    codi_recss: 'E25001801',
    municipi: 'Lleida',
    adreca: 'Carrer Balmes 41, Lleida',
    actiu: true,
  },
  {
    id: 'RECSS-LL-02',
    regio_sanitaria_id: 'RS_LLEIDA',
    regio_nom: 'Lleida',
    gerencia_id: 'GT_LLEIDA',
    gerencia_nom: 'Gerència Territorial Lleida i Alt Pirineu (ICS)',
    sector_id: 'SEC_NOGUERA',
    cap_id: 'CAP_BALAGUER',
    cap_nom: 'CAP Balaguer',
    codi_recss: 'E25001802',
    municipi: 'Balaguer',
    adreca: 'Passeig de l\'Estació 34, Balaguer',
    actiu: true,
  },
  {
    id: 'RECSS-LL-03',
    regio_sanitaria_id: 'RS_LLEIDA',
    regio_nom: 'Lleida',
    gerencia_id: 'GT_LLEIDA',
    gerencia_nom: 'Gerència Territorial Lleida i Alt Pirineu (ICS)',
    sector_id: 'SEC_URGELL',
    cap_id: 'CAP_TARREGA',
    cap_nom: 'CAP Tàrrega',
    codi_recss: 'E25001803',
    municipi: 'Tàrrega',
    adreca: 'Carrer Salvador Espriu 14, Tàrrega',
    actiu: true,
  },

  // --- CATALUNYA CENTRAL ---
  {
    id: 'RECSS-CC-01',
    regio_sanitaria_id: 'RS_CAT_CENTRAL',
    regio_nom: 'Catalunya Central',
    gerencia_id: 'GT_CAT_CENTRAL',
    gerencia_nom: 'Gerència Territorial Catalunya Central (ICS)',
    sector_id: 'SEC_BAGES',
    cap_id: 'CAP_BAGES',
    cap_nom: 'CAP Bages (Manresa)',
    codi_recss: 'E08001901',
    municipi: 'Manresa',
    adreca: 'Carrer Soler i March 6, Manresa',
    actiu: true,
  },
  {
    id: 'RECSS-CC-02',
    regio_sanitaria_id: 'RS_CAT_CENTRAL',
    regio_nom: 'Catalunya Central',
    gerencia_id: 'GT_CAT_CENTRAL',
    gerencia_nom: 'Gerència Territorial Catalunya Central (ICS)',
    sector_id: 'SEC_OSONA',
    cap_id: 'CAP_VIC',
    cap_nom: 'CAP Osona (Vic Nord)',
    codi_recss: 'E08001902',
    municipi: 'Vic',
    adreca: 'Plaça de la Divina Pastora 7, Vic',
    actiu: true,
  },
  {
    id: 'RECSS-CC-03',
    regio_sanitaria_id: 'RS_CAT_CENTRAL',
    regio_nom: 'Catalunya Central',
    gerencia_id: 'GT_CAT_CENTRAL',
    gerencia_nom: 'Gerència Territorial Catalunya Central (ICS)',
    sector_id: 'SEC_ANOIA',
    cap_id: 'CAP_IGUALADA',
    cap_nom: 'CAP Igualada Nord',
    codi_recss: 'E08001903',
    municipi: 'Igualada',
    adreca: 'Carrer Belis 2, Igualada',
    actiu: true,
  },
];

// ============================================================================
// FUNCIONS DE PERSISTÈNCIA DINÀMICA (LOCALSTORAGE + ESDEVENIMENT DE WINDOWS)
// ============================================================================
const STORAGE_KEY_GERENCIES = 'bancactiu_territorial_gerencies_v1';
const STORAGE_KEY_CENTERS = 'bancactiu_territorial_centers_v1';

export function loadTerritorialState(): { gerencies: GerenciaTerritorialRecord[]; centers: RECSSCenter[] } {
  if (typeof window === 'undefined') {
    return { gerencies: INITIAL_GERENCIES, centers: INITIAL_RECSS_CENTERS };
  }

  try {
    const rawG = localStorage.getItem(STORAGE_KEY_GERENCIES);
    const rawC = localStorage.getItem(STORAGE_KEY_CENTERS);

    const gerencies: GerenciaTerritorialRecord[] = rawG ? JSON.parse(rawG) : INITIAL_GERENCIES;
    const centers: RECSSCenter[] = rawC ? JSON.parse(rawC) : INITIAL_RECSS_CENTERS;

    return { gerencies, centers };
  } catch (e) {
    console.error('Error al carregar estat territorial:', e);
    return { gerencies: INITIAL_GERENCIES, centers: INITIAL_RECSS_CENTERS };
  }
}

export function saveTerritorialState(gerencies: GerenciaTerritorialRecord[], centers: RECSSCenter[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_GERENCIES, JSON.stringify(gerencies));
    localStorage.setItem(STORAGE_KEY_CENTERS, JSON.stringify(centers));
    window.dispatchEvent(new Event('territorial-catalog-updated'));
  } catch (e) {
    console.error('Error al desar estat territorial:', e);
  }
}

export function resetTerritorialState(): { gerencies: GerenciaTerritorialRecord[]; centers: RECSSCenter[] } {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_GERENCIES);
    localStorage.removeItem(STORAGE_KEY_CENTERS);
    window.dispatchEvent(new Event('territorial-catalog-updated'));
  }
  return { gerencies: INITIAL_GERENCIES, centers: INITIAL_RECSS_CENTERS };
}

// ============================================================================
// PARSER DE FITXERS OFICIALS RECSS (.CSV I .JSON)
// ============================================================================
export function parseRECSSFile(content: string, fileName: string): RECSSCenter[] {
  const isJson = fileName.toLowerCase().endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{');

  if (isJson) {
    try {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : (parsed.centres || parsed.data || [parsed]);
      return items.map((item: any, idx: number) => ({
        id: item.id || `RECSS-IMP-${idx + 1}`,
        regio_sanitaria_id: item.regio_sanitaria_id || item.regio_id || 'RS_GIRONA',
        regio_nom: item.regio_nom || item.regio || 'Girona',
        gerencia_id: item.gerencia_id || 'GT_GIRONA',
        gerencia_nom: item.gerencia_nom || 'Gerència Territorial Girona (ICS)',
        sector_id: item.sector_id || 'SEC_LOCAL',
        cap_id: item.cap_id || `CAP_IMP_${idx + 1}`,
        cap_nom: item.cap_nom || item.nom || 'Centre d\'Atenció Primària',
        codi_recss: item.codi_recss || item.codi || `E${17000000 + idx}`,
        municipi: item.municipi || 'Municipi CatSalut',
        adreca: item.adreca || 'Adreça oficial',
        actiu: item.actiu !== undefined ? Boolean(item.actiu) : true,
      }));
    } catch (e) {
      console.error('Error parsejant JSON RECSS:', e);
      return [];
    }
  }

  // Parse CSV
  try {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/["']/g, ''));

    const centers: RECSSCenter[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(p => p.trim().replace(/["']/g, ''));
      if (parts.length < 3) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] || '';
      });

      const capNom = row.nom || row.cap_nom || row.centre || 'Centre d\'Atenció Primària';
      const gerenciaId = row.gerencia_id || row.gerencia || 'GT_GIRONA';

      centers.push({
        id: row.id || `RECSS-CSV-${i}`,
        regio_sanitaria_id: row.regio_sanitaria_id || row.regio_id || 'RS_GIRONA',
        regio_nom: row.regio_nom || row.regio || 'Girona',
        gerencia_id: gerenciaId,
        gerencia_nom: row.gerencia_nom || 'Gerència Territorial ICS',
        sector_id: row.sector_id || 'SEC_LOCAL',
        cap_id: row.cap_id || `CAP_${i}`,
        cap_nom: capNom,
        codi_recss: row.codi_recss || row.codi || `E0800${i}`,
        municipi: row.municipi || 'Municipi',
        adreca: row.adreca || 'Adreça Centre',
        actiu: row.actiu === 'false' || row.actiu === '0' ? false : true,
      });
    }

    return centers;
  } catch (e) {
    console.error('Error parsejant CSV RECSS:', e);
    return [];
  }
}
