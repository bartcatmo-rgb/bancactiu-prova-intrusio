import { PAORecord, PAOCostBenefitSummary } from '@/types/pao';

// ============================================================================
// CATÀLEG TERRITORIAL OFICIAL CATSALUT / SISCAT
// ============================================================================
export interface GerenciaTerritorialInfo {
  id: string;
  nom: string;
  regio_id: string;
  regio_nom: string;
  hospital_referencia: string;
  adreca_central: string;
  centres_vinculats: { id: string; nom: string; sector: string }[];
}

export const GERENCIES_TERRITORIALS: GerenciaTerritorialInfo[] = [
  {
    id: 'GT_GIRONA',
    nom: 'Gerència Territorial Girona (ICS)',
    regio_id: 'RS_GIRONA',
    regio_nom: 'Girona',
    hospital_referencia: 'Hospital Universitari de Girona Dr. Josep Trueta',
    adreca_central: 'C/ Santa Clara 33, Girona',
    centres_vinculats: [
      { id: 'CAP_SALT', nom: 'CAP Salt (Jordi Nadal)', sector: 'SEC_GIRONES_SALT' },
      { id: 'CAP_CAN_GIBERT', nom: 'CAP Can Gibert del Pla', sector: 'SEC_GIRONA_SUD' },
      { id: 'CAP_SANTA_CLARA', nom: 'CAP Santa Clara (Girona)', sector: 'SEC_GIRONA_CENTRE' },
      { id: 'CAP_MONTILIVI', nom: 'CAP Montilivi', sector: 'SEC_GIRONA_EST' },
      { id: 'CAP_SARRIA', nom: 'CAP Sarrià de Ter', sector: 'SEC_GIRONES_NORD' },
    ],
  },
  {
    id: 'GT_METRO_SUD',
    nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    regio_id: 'RS_METRO_SUD',
    regio_nom: 'Barcelona Metropolitana Sud',
    hospital_referencia: 'Hospital Universitari de Bellvitge',
    adreca_central: 'Feixa Llarga s/n, L\'Hospitalet de Llobregat',
    centres_vinculats: [
      { id: 'CAP_BELLVITGE', nom: 'CAP Bellvitge', sector: 'SEC_L_HOSPITALET_1' },
      { id: 'CAP_COLLBLANC', nom: 'CAP Collblanc', sector: 'SEC_L_HOSPITALET_2' },
      { id: 'CAP_EL_PRAT', nom: 'CAP Ramona Via (El Prat)', sector: 'SEC_BAIX_LLOBREGAT_LITORAL' },
      { id: 'CAP_SANT_BOI', nom: 'CAP Montclar (Sant Boi)', sector: 'SEC_SANT_BOI' },
      { id: 'CAP_VILADECANS', nom: 'CAP Maria Bernades (Viladecans)', sector: 'SEC_DELTA_LLOBREGAT' },
    ],
  },
  {
    id: 'GT_BCN_CIUTAT',
    nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    regio_id: 'RS_BCN',
    regio_nom: 'Barcelona Ciutat',
    hospital_referencia: 'Hospital Universitari Vall d\'Hebron',
    adreca_central: 'Passeig de la Vall d\'Hebron 119, Barcelona',
    centres_vinculats: [
      { id: 'CAP_MANSO', nom: 'CAP Manso (Eixample)', sector: 'SEC_BCN_EIXAMPLE' },
      { id: 'CAP_ROQUETES', nom: 'CAP Roquetes (Nou Barris)', sector: 'SEC_BCN_NOU_BARRIS' },
      { id: 'CAP_SANT_ANDREU', nom: 'CAP Sant Andreu', sector: 'SEC_BCN_SANT_ANDREU' },
      { id: 'CAP_GRACIA', nom: 'CAP Pare Claret (Gràcia)', sector: 'SEC_BCN_GRACIA' },
    ],
  },
  {
    id: 'GT_METRO_NORD',
    nom: 'Gerència Territorial Metropolitana Nord (ICS)',
    regio_id: 'RS_METRO_NORD',
    regio_nom: 'Barcelona Metropolitana Nord',
    hospital_referencia: 'Hospital Universitari Germans Trias i Pujol',
    adreca_central: 'Carretera de Canyet s/n, Badalona',
    centres_vinculats: [
      { id: 'CAP_DR_ROBERT', nom: 'CAP Dr. Robert (Badalona)', sector: 'SEC_BADALONA_CENTRE' },
      { id: 'CAP_SANTA_COLOMA', nom: 'CAP Santa Coloma de Gramenet', sector: 'SEC_SANTA_COLOMA' },
    ],
  },
  {
    id: 'GT_TARRAGONA',
    nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    regio_id: 'RS_CAMP_TARRAGONA',
    regio_nom: 'Camp de Tarragona',
    hospital_referencia: 'Hospital Universitari Joan XXIII',
    adreca_central: 'C/ Dr. Mallafrè Guasch 4, Tarragona',
    centres_vinculats: [
      { id: 'CAP_TARRACO', nom: 'CAP Tarraco (Tarragona Centre)', sector: 'SEC_TARRAGONA_CENTRE' },
      { id: 'CAP_REUS', nom: 'CAP Sant Pere (Reus)', sector: 'SEC_REUS' },
    ],
  },
  {
    id: 'GT_LLEIDA',
    nom: 'Gerència Territorial Lleida i Alt Pirineu (ICS)',
    regio_id: 'RS_LLEIDA',
    regio_nom: 'Lleida',
    hospital_referencia: 'Hospital Universitari Arnau de Vilanova',
    adreca_central: 'Av. Alcalde Rovira Roure 80, Lleida',
    centres_vinculats: [
      { id: 'CAP_EIXAMPLE_LLEIDA', nom: 'CAP Eixample (Lleida)', sector: 'SEC_LLEIDA_URBA' },
      { id: 'CAP_BALAGUER', nom: 'CAP Balaguer', sector: 'SEC_NOGUERA' },
    ],
  },
  {
    id: 'GT_CAT_CENTRAL',
    nom: 'Gerència Territorial Catalunya Central (ICS)',
    regio_id: 'RS_CAT_CENTRAL',
    regio_nom: 'Catalunya Central',
    hospital_referencia: 'Hospital de Sant Joan de Déu de Manresa (Althaia)',
    adreca_central: 'C/ Pica d\'Estats 13, Manresa',
    centres_vinculats: [
      { id: 'CAP_BAGES', nom: 'CAP Bages (Manresa)', sector: 'SEC_BAGES' },
      { id: 'CAP_VIC', nom: 'CAP Osona (Vic)', sector: 'SEC_OSONA' },
    ],
  },
];

// ============================================================================
// DADES DEMOSTRATIVES OFICIALS PAO MULTI-TERRITORI
// ============================================================================
export const INITIAL_DEMO_PAO_DATA: PAORecord[] = [
  // --- GERÈNCIA TERRITORIAL GIRONA (GT_GIRONA) ---
  {
    id: 'PAO-GI-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes manual plegable d\'acer standard',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 385.00,
    dataPrescripcio: '2026-02-10',
    capOrigen: 'CAP Salt (Jordi Nadal)',
    cap_id: 'CAP_SALT',
    sector_id: 'SEC_GIRONES_SALT',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 42,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 385.00,
  },
  {
    id: 'PAO-GI-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador articulat de 4 rodes amb seient i frens',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 145.50,
    dataPrescripcio: '2026-02-12',
    capOrigen: 'CAP Salt (Jordi Nadal)',
    cap_id: 'CAP_SALT',
    sector_id: 'SEC_GIRONES_SALT',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 35,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 145.50,
  },
  {
    id: 'PAO-GI-003',
    codiPAO: 'PAO-060700',
    descripcio: 'Parell de crosses canadenques amb colzera tova',
    categoria: 'MULETES',
    importOficialCatSalut: 48.00,
    dataPrescripcio: '2026-02-14',
    capOrigen: 'CAP Can Gibert del Pla',
    cap_id: 'CAP_CAN_GIBERT',
    sector_id: 'SEC_GIRONA_SUD',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 28,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 18,
    estalviGenerat: 48.00,
  },
  {
    id: 'PAO-GI-004',
    codiPAO: 'PAO-181200',
    descripcio: 'Llit hospitalari articulat elèctric amb baranes',
    categoria: 'LLIT_ARTICULAT',
    importOficialCatSalut: 920.00,
    dataPrescripcio: '2026-02-15',
    capOrigen: 'CAP Santa Clara (Girona)',
    cap_id: 'CAP_SANTA_CLARA',
    sector_id: 'SEC_GIRONA_CENTRE',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 56,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 920.00,
  },
  {
    id: 'PAO-GI-005',
    codiPAO: 'PAO-060406',
    descripcio: 'Cadira de rodes lleugera d\'alumini transferència',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 495.00,
    dataPrescripcio: '2026-02-18',
    capOrigen: 'CAP Montilivi',
    cap_id: 'CAP_MONTILIVI',
    sector_id: 'SEC_GIRONA_EST',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 45,
    reutilitzatBancActiu: false,
    tempsLliuramentBancActiuHores: 0,
    estalviGenerat: 0.00,
  },
  {
    id: 'PAO-GI-006',
    codiPAO: 'PAO-060100',
    descripcio: 'Caminador simple d\'interior sense rodes',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 89.00,
    dataPrescripcio: '2026-02-20',
    capOrigen: 'CAP Salt (Jordi Nadal)',
    cap_id: 'CAP_SALT',
    sector_id: 'SEC_GIRONES_SALT',
    gerencia_id: 'GT_GIRONA',
    regio_sanitaria_id: 'RS_GIRONA',
    regioSanitaria: 'Girona',
    diesEsperaOficial: 31,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 89.00,
  },

  // --- GERÈNCIA TERRITORIAL BARCELONA METROPOLITANA SUD (GT_METRO_SUD) ---
  {
    id: 'PAO-MS-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes standard reforçada bariàtrica',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 540.00,
    dataPrescripcio: '2026-02-05',
    capOrigen: 'CAP Bellvitge',
    cap_id: 'CAP_BELLVITGE',
    sector_id: 'SEC_L_HOSPITALET_1',
    gerencia_id: 'GT_METRO_SUD',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regioSanitaria: 'Barcelona Metropolitana Sud',
    diesEsperaOficial: 48,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 540.00,
  },
  {
    id: 'PAO-MS-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador articulat d\'alumini amb seient călid',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 155.00,
    dataPrescripcio: '2026-02-08',
    capOrigen: 'CAP Collblanc',
    cap_id: 'CAP_COLLBLANC',
    sector_id: 'SEC_L_HOSPITALET_2',
    gerencia_id: 'GT_METRO_SUD',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regioSanitaria: 'Barcelona Metropolitana Sud',
    diesEsperaOficial: 36,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 20,
    estalviGenerat: 155.00,
  },
  {
    id: 'PAO-MS-003',
    codiPAO: 'PAO-181200',
    descripcio: 'Llit assistencial articulat amb matalàs antiescares',
    categoria: 'LLIT_ARTICULAT',
    importOficialCatSalut: 980.00,
    dataPrescripcio: '2026-02-11',
    capOrigen: 'CAP Ramona Via (El Prat)',
    cap_id: 'CAP_EL_PRAT',
    sector_id: 'SEC_BAIX_LLOBREGAT_LITORAL',
    gerencia_id: 'GT_METRO_SUD',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regioSanitaria: 'Barcelona Metropolitana Sud',
    diesEsperaOficial: 60,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 980.00,
  },
  {
    id: 'PAO-MS-004',
    codiPAO: 'PAO-060700',
    descripcio: 'Parell de bastons anglesos amb empunyadura anatòmica',
    categoria: 'MULETES',
    importOficialCatSalut: 52.00,
    dataPrescripcio: '2026-02-14',
    capOrigen: 'CAP Montclar (Sant Boi)',
    cap_id: 'CAP_SANT_BOI',
    sector_id: 'SEC_SANT_BOI',
    gerencia_id: 'GT_METRO_SUD',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regioSanitaria: 'Barcelona Metropolitana Sud',
    diesEsperaOficial: 25,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 16,
    estalviGenerat: 52.00,
  },
  {
    id: 'PAO-MS-005',
    codiPAO: 'PAO-060406',
    descripcio: 'Cadira de rodes lleugera plegable transferència',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 460.00,
    dataPrescripcio: '2026-02-19',
    capOrigen: 'CAP Maria Bernades (Viladecans)',
    cap_id: 'CAP_VILADECANS',
    sector_id: 'SEC_DELTA_LLOBREGAT',
    gerencia_id: 'GT_METRO_SUD',
    regio_sanitaria_id: 'RS_METRO_SUD',
    regioSanitaria: 'Barcelona Metropolitana Sud',
    diesEsperaOficial: 40,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 460.00,
  },

  // --- GERÈNCIA TERRITORIAL BARCELONA CIUTAT (GT_BCN_CIUTAT) ---
  {
    id: 'PAO-BCN-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes manual estàndard plegable',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 390.00,
    dataPrescripcio: '2026-02-02',
    capOrigen: 'CAP Manso (Eixample)',
    cap_id: 'CAP_MANSO',
    sector_id: 'SEC_BCN_EIXAMPLE',
    gerencia_id: 'GT_BCN_CIUTAT',
    regio_sanitaria_id: 'RS_BCN',
    regioSanitaria: 'Barcelona Ciutat',
    diesEsperaOficial: 44,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 390.00,
  },
  {
    id: 'PAO-BCN-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador d\'alumini 4 rodes amb cistella',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 150.00,
    dataPrescripcio: '2026-02-06',
    capOrigen: 'CAP Roquetes (Nou Barris)',
    cap_id: 'CAP_ROQUETES',
    sector_id: 'SEC_BCN_NOU_BARRIS',
    gerencia_id: 'GT_BCN_CIUTAT',
    regio_sanitaria_id: 'RS_BCN',
    regioSanitaria: 'Barcelona Ciutat',
    diesEsperaOficial: 38,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 150.00,
  },
  {
    id: 'PAO-BCN-003',
    codiPAO: 'PAO-181200',
    descripcio: 'Llit articulat assistencial amb baranes abatibles',
    categoria: 'LLIT_ARTICULAT',
    importOficialCatSalut: 950.00,
    dataPrescripcio: '2026-02-12',
    capOrigen: 'CAP Sant Andreu',
    cap_id: 'CAP_SANT_ANDREU',
    sector_id: 'SEC_BCN_SANT_ANDREU',
    gerencia_id: 'GT_BCN_CIUTAT',
    regio_sanitaria_id: 'RS_BCN',
    regioSanitaria: 'Barcelona Ciutat',
    diesEsperaOficial: 52,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 950.00,
  },
  {
    id: 'PAO-BCN-004',
    codiPAO: 'PAO-060700',
    descripcio: 'Parell de crosses d\'alumini regulables',
    categoria: 'MULETES',
    importOficialCatSalut: 45.00,
    dataPrescripcio: '2026-02-16',
    capOrigen: 'CAP Pare Claret (Gràcia)',
    cap_id: 'CAP_GRACIA',
    sector_id: 'SEC_BCN_GRACIA',
    gerencia_id: 'GT_BCN_CIUTAT',
    regio_sanitaria_id: 'RS_BCN',
    regioSanitaria: 'Barcelona Ciutat',
    diesEsperaOficial: 27,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 18,
    estalviGenerat: 45.00,
  },

  // --- GERÈNCIA TERRITORIAL METROPOLITANA NORD (GT_METRO_NORD) ---
  {
    id: 'PAO-MN-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes d\'acer plegable de transport',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 380.00,
    dataPrescripcio: '2026-02-04',
    capOrigen: 'CAP Dr. Robert (Badalona)',
    cap_id: 'CAP_DR_ROBERT',
    sector_id: 'SEC_BADALONA_CENTRE',
    gerencia_id: 'GT_METRO_NORD',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regioSanitaria: 'Barcelona Metropolitana Nord',
    diesEsperaOficial: 43,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 380.00,
  },
  {
    id: 'PAO-MN-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador plegable de 2 rodes amb suport',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 110.00,
    dataPrescripcio: '2026-02-10',
    capOrigen: 'CAP Santa Coloma de Gramenet',
    cap_id: 'CAP_SANTA_COLOMA',
    sector_id: 'SEC_SANTA_COLOMA',
    gerencia_id: 'GT_METRO_NORD',
    regio_sanitaria_id: 'RS_METRO_NORD',
    regioSanitaria: 'Barcelona Metropolitana Nord',
    diesEsperaOficial: 32,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 110.00,
  },

  // --- GERÈNCIA TERRITORIAL CAMP DE TARRAGONA (GT_TARRAGONA) ---
  {
    id: 'PAO-TG-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes plegable estàndard d\'autopropulsió',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 395.00,
    dataPrescripcio: '2026-02-07',
    capOrigen: 'CAP Tarraco (Tarragona Centre)',
    cap_id: 'CAP_TARRACO',
    sector_id: 'SEC_TARRAGONA_CENTRE',
    gerencia_id: 'GT_TARRAGONA',
    regio_sanitaria_id: 'RS_CAMP_TARRAGONA',
    regioSanitaria: 'Camp de Tarragona',
    diesEsperaOficial: 46,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 395.00,
  },
  {
    id: 'PAO-TG-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador d\'alumini articulat amb seient',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 148.00,
    dataPrescripcio: '2026-02-13',
    capOrigen: 'CAP Sant Pere (Reus)',
    cap_id: 'CAP_REUS',
    sector_id: 'SEC_REUS',
    gerencia_id: 'GT_TARRAGONA',
    regio_sanitaria_id: 'RS_CAMP_TARRAGONA',
    regioSanitaria: 'Camp de Tarragona',
    diesEsperaOficial: 34,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 148.00,
  },

  // --- GERÈNCIA TERRITORIAL LLEIDA (GT_LLEIDA) ---
  {
    id: 'PAO-LL-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes manual d\'acer',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 375.00,
    dataPrescripcio: '2026-02-09',
    capOrigen: 'CAP Eixample (Lleida)',
    cap_id: 'CAP_EIXAMPLE_LLEIDA',
    sector_id: 'SEC_LLEIDA_URBA',
    gerencia_id: 'GT_LLEIDA',
    regio_sanitaria_id: 'RS_LLEIDA',
    regioSanitaria: 'Lleida',
    diesEsperaOficial: 41,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 375.00,
  },
  {
    id: 'PAO-LL-002',
    codiPAO: 'PAO-060700',
    descripcio: 'Parell de crosses canadenques',
    categoria: 'MULETES',
    importOficialCatSalut: 46.00,
    dataPrescripcio: '2026-02-15',
    capOrigen: 'CAP Balaguer',
    cap_id: 'CAP_BALAGUER',
    sector_id: 'SEC_NOGUERA',
    gerencia_id: 'GT_LLEIDA',
    regio_sanitaria_id: 'RS_LLEIDA',
    regioSanitaria: 'Lleida',
    diesEsperaOficial: 29,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 18,
    estalviGenerat: 46.00,
  },

  // --- GERÈNCIA TERRITORIAL CATALUNYA CENTRAL (GT_CAT_CENTRAL) ---
  {
    id: 'PAO-CC-001',
    codiPAO: 'PAO-060403',
    descripcio: 'Cadira de rodes plegable estàndard',
    categoria: 'CADIRA_RODES',
    importOficialCatSalut: 388.00,
    dataPrescripcio: '2026-02-08',
    capOrigen: 'CAP Bages (Manresa)',
    cap_id: 'CAP_BAGES',
    sector_id: 'SEC_BAGES',
    gerencia_id: 'GT_CAT_CENTRAL',
    regio_sanitaria_id: 'RS_CAT_CENTRAL',
    regioSanitaria: 'Catalunya Central',
    diesEsperaOficial: 45,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 388.00,
  },
  {
    id: 'PAO-CC-002',
    codiPAO: 'PAO-060103',
    descripcio: 'Caminador articulat de 4 rodes',
    categoria: 'CAMINADOR',
    importOficialCatSalut: 142.00,
    dataPrescripcio: '2026-02-16',
    capOrigen: 'CAP Osona (Vic)',
    cap_id: 'CAP_VIC',
    sector_id: 'SEC_OSONA',
    gerencia_id: 'GT_CAT_CENTRAL',
    regio_sanitaria_id: 'RS_CAT_CENTRAL',
    regioSanitaria: 'Catalunya Central',
    diesEsperaOficial: 37,
    reutilitzatBancActiu: true,
    tempsLliuramentBancActiuHores: 24,
    estalviGenerat: 142.00,
  },
];

// ============================================================================
// MOTOR DE SEGREGACIÓ I FILTRATGE PER ÀMBIT TERRITORIAL
// ============================================================================
export interface TerritorialFilterOptions {
  regio_sanitaria_id?: string;
  gerencia_id?: string;
  cap_id?: string;
}

export function filterPAORecordsByScope(records: PAORecord[], scope?: TerritorialFilterOptions): PAORecord[] {
  if (!scope) return records;

  return records.filter(r => {
    if (scope.cap_id && scope.cap_id !== 'ALL' && r.cap_id !== scope.cap_id) {
      return false;
    }
    if (scope.gerencia_id && scope.gerencia_id !== 'ALL' && r.gerencia_id !== scope.gerencia_id) {
      return false;
    }
    if (scope.regio_sanitaria_id && scope.regio_sanitaria_id !== 'ALL' && r.regio_sanitaria_id !== scope.regio_sanitaria_id) {
      return false;
    }
    return true;
  });
}

// ============================================================================
// VALIDACIÓ D\'IMPORTACIÓ AMB AISLAMENT ESTRICTE DE GERÈNCIA
// ============================================================================
export interface ValidationResult {
  acceptedRecords: PAORecord[];
  rejectedRecordsCount: number;
  foreignCenters: string[];
}

export function validatePAOImportForGerencia(
  incomingRecords: PAORecord[],
  targetGerenciaId: string
): ValidationResult {
  const gerencia = GERENCIES_TERRITORIALS.find(g => g.id === targetGerenciaId);
  const allowedCapIds = new Set(gerencia ? gerencia.centres_vinculats.map(c => c.id) : []);

  const accepted: PAORecord[] = [];
  let rejectedCount = 0;
  const foreignCentersSet = new Set<string>();

  incomingRecords.forEach(rec => {
    // Si coincideix el gerencia_id o el centre està adscrit a la gerència
    if (rec.gerencia_id === targetGerenciaId || allowedCapIds.has(rec.cap_id)) {
      accepted.push({
        ...rec,
        gerencia_id: targetGerenciaId,
        regio_sanitaria_id: gerencia ? gerencia.regio_id : rec.regio_sanitaria_id,
        regioSanitaria: gerencia ? gerencia.regio_nom : rec.regioSanitaria,
      });
    } else {
      rejectedCount++;
      foreignCentersSet.add(rec.capOrigen || rec.cap_id || 'Centre Desconegut');
    }
  });

  return {
    acceptedRecords: accepted,
    rejectedRecordsCount: rejectedCount,
    foreignCenters: Array.from(foreignCentersSet),
  };
}

// ============================================================================
// MOTOR DE CÀLCUL COSTE-BENEFICI I RETORN SOCIAL (SROI)
// ============================================================================
export function calculatePAOCostBenefit(records: PAORecord[], scope?: TerritorialFilterOptions): PAOCostBenefitSummary {
  const filtered = filterPAORecordsByScope(records, scope);
  const total = filtered.length;

  if (total === 0) {
    return {
      totalPrescripcions: 0,
      totalDespesaOficialPAO: 0,
      totalEstalviBancActiu: 0,
      mitjanaDiesEsperaOficial: 0,
      mitjanaDiesEsperaBancActiu: 0,
      diesEsperaEstalviats: 0,
      taxaReutilitzacioPercentatge: 0,
      co2EstalviatKg: 0,
      repartimentPerCap: {},
      repartimentPerGerencia: {},
      repartimentPerRegio: {},
    };
  }

  let totalDespesa = 0;
  let totalEstalvi = 0;
  let sumaDiesOficial = 0;
  let sumaDiesBancActiu = 0;
  let totalReutilitzats = 0;

  const repartimentCap: Record<string, { total: number; estalvi: number; prescripcions: number }> = {};
  const repartimentGerencia: Record<string, { total: number; estalvi: number; taxa: number; prescripcions: number }> = {};
  const repartimentRegio: Record<string, { total: number; estalvi: number; taxa: number; prescripcions: number }> = {};

  filtered.forEach(r => {
    totalDespesa += r.importOficialCatSalut;
    sumaDiesOficial += r.diesEsperaOficial;

    const daysBancActiu = r.reutilitzatBancActiu ? Math.ceil(r.tempsLliuramentBancActiuHores / 24) : r.diesEsperaOficial;
    sumaDiesBancActiu += daysBancActiu;

    if (r.reutilitzatBancActiu) {
      totalEstalvi += r.estalviGenerat;
      totalReutilitzats++;
    }

    // Per CAP
    const capKey = r.capOrigen || r.cap_id;
    if (!repartimentCap[capKey]) {
      repartimentCap[capKey] = { total: 0, estalvi: 0, prescripcions: 0 };
    }
    repartimentCap[capKey].total += r.importOficialCatSalut;
    repartimentCap[capKey].estalvi += r.estalviGenerat;
    repartimentCap[capKey].prescripcions++;

    // Per Gerència
    const gtKey = r.gerencia_id || 'GT_DESCONEGUDA';
    if (!repartimentGerencia[gtKey]) {
      repartimentGerencia[gtKey] = { total: 0, estalvi: 0, taxa: 0, prescripcions: 0 };
    }
    repartimentGerencia[gtKey].total += r.importOficialCatSalut;
    repartimentGerencia[gtKey].estalvi += r.estalviGenerat;
    repartimentGerencia[gtKey].prescripcions++;

    // Per Regió
    const regKey = r.regioSanitaria || r.regio_sanitaria_id;
    if (!repartimentRegio[regKey]) {
      repartimentRegio[regKey] = { total: 0, estalvi: 0, taxa: 0, prescripcions: 0 };
    }
    repartimentRegio[regKey].total += r.importOficialCatSalut;
    repartimentRegio[regKey].estalvi += r.estalviGenerat;
    repartimentRegio[regKey].prescripcions++;
  });

  // Calcular taxes
  Object.keys(repartimentGerencia).forEach(k => {
    const item = repartimentGerencia[k];
    item.taxa = item.total > 0 ? Math.round((item.estalvi / item.total) * 100) : 0;
  });

  Object.keys(repartimentRegio).forEach(k => {
    const item = repartimentRegio[k];
    item.taxa = item.total > 0 ? Math.round((item.estalvi / item.total) * 100) : 0;
  });

  const mitjanaDiesOficial = Math.round(sumaDiesOficial / total);
  const mitjanaDiesBancActiu = Math.round(sumaDiesBancActiu / total);
  const diesEstalviats = sumaDiesOficial - sumaDiesBancActiu;
  const taxaReutilitzacio = Math.round((totalReutilitzats / total) * 100);

  // Estimació de petjada ecològica estalviada: ~42 kg CO2 per cada recurs recondicionat
  const co2Estalviat = totalReutilitzats * 42;

  return {
    totalPrescripcions: total,
    totalDespesaOficialPAO: Math.round(totalDespesa * 100) / 100,
    totalEstalviBancActiu: Math.round(totalEstalvi * 100) / 100,
    mitjanaDiesEsperaOficial: mitjanaDiesOficial,
    mitjanaDiesEsperaBancActiu: mitjanaDiesBancActiu,
    diesEsperaEstalviats: diesEstalviats,
    taxaReutilitzacioPercentatge: taxaReutilitzacio,
    co2EstalviatKg: co2Estalviat,
    repartimentPerCap: repartimentCap,
    repartimentPerGerencia: repartimentGerencia,
    repartimentPerRegio: repartimentRegio,
  };
}

// ============================================================================
// PARSER ROBUST DE FITXERS PAO (.CSV I .JSON) AMB VINCULACIÓ TERRITORIAL
// ============================================================================
export function parsePAOFileContent(content: string, fileName: string): PAORecord[] {
  const isJson = fileName.toLowerCase().endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{');

  if (isJson) {
    try {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : (parsed.registres || parsed.data || [parsed]);
      return items.map((item: any, idx: number) => mapRawItemToPAORecord(item, idx));
    } catch (e) {
      console.error('Error parsejant fitxer JSON PAO:', e);
      return [];
    }
  }

  // Parse CSV
  try {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/["']/g, ''));

    const records: PAORecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(p => p.trim().replace(/["']/g, ''));
      if (parts.length < 3) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] || '';
      });

      const raw = {
        id: row.id || row.codi || `PAO-IMP-${i}`,
        codiPAO: row.codipao || row.codi_pao || row.codi || 'PAO-GEN-01',
        descripcio: row.descripcio || row.article || row.material || 'Article Ortoprotètic',
        importOficialCatSalut: parseFloat((row.import || row.preu || row.importoficialcatsalut || '0').replace(',', '.')) || 250,
        dataPrescripcio: row.data || row.dataprescripcio || new Date().toISOString().slice(0, 10),
        capOrigen: row.cap || row.caporigen || row.centre || 'CAP Salt (Jordi Nadal)',
        cap_id: row.cap_id || row.capid || '',
        gerencia_id: row.gerencia_id || row.gerenciaid || '',
        regio_sanitaria_id: row.regio_sanitaria_id || row.regioid || '',
        regioSanitaria: row.regio || row.regiosanitaria || 'Girona',
        diesEsperaOficial: parseInt(row.dies || row.diesesperaoficial || '40', 10) || 40,
        reutilitzatBancActiu: row.reutilitzat === 'true' || row.reutilitzat === '1' || row.bancactiu === 'true' || true,
        tempsLliuramentBancActiuHores: parseInt(row.temps || row.tempslliurament || '24', 10) || 24,
        estalviGenerat: parseFloat((row.estalvi || row.estalvigenerat || '0').replace(',', '.')) || 250,
      };

      records.push(mapRawItemToPAORecord(raw, i));
    }

    return records;
  } catch (e) {
    console.error('Error parsejant CSV PAO:', e);
    return [];
  }
}

function mapRawItemToPAORecord(item: any, idx: number): PAORecord {
  const capOrigen = item.capOrigen || item.cap || item.centre || 'CAP Salt (Jordi Nadal)';
  let cap_id = item.cap_id || '';
  let gerencia_id = item.gerencia_id || '';
  let regio_sanitaria_id = item.regio_sanitaria_id || '';
  let regioSanitaria = item.regioSanitaria || item.regio || 'Girona';
  let sector_id = item.sector_id || 'SEC_LOCAL';

  // Resolució automàtica de jerarquia territorial segons nom del centre
  for (const g of GERENCIES_TERRITORIALS) {
    const foundCap = g.centres_vinculats.find(c =>
      capOrigen.toLowerCase().includes(c.nom.toLowerCase()) ||
      c.nom.toLowerCase().includes(capOrigen.toLowerCase()) ||
      (cap_id && c.id === cap_id)
    );
    if (foundCap) {
      cap_id = foundCap.id;
      sector_id = foundCap.sector;
      gerencia_id = g.id;
      regio_sanitaria_id = g.regio_id;
      regioSanitaria = g.regio_nom;
      break;
    }
  }

  // Fallback si no s'ha trobat
  if (!gerencia_id) {
    gerencia_id = 'GT_GIRONA';
    regio_sanitaria_id = 'RS_GIRONA';
    cap_id = cap_id || 'CAP_SALT';
  }

  const importOficial = typeof item.importOficialCatSalut === 'number'
    ? item.importOficialCatSalut
    : (parseFloat(String(item.importOficialCatSalut || item.import || 250).replace(',', '.')) || 250);

  const reutilitzat = item.reutilitzatBancActiu !== undefined
    ? Boolean(item.reutilitzatBancActiu)
    : true;

  const estalvi = reutilitzat
    ? (typeof item.estalviGenerat === 'number' ? item.estalviGenerat : importOficial)
    : 0;

  return {
    id: item.id || `PAO-REC-${idx + 1}`,
    codiPAO: item.codiPAO || item.codi || 'PAO-060403',
    descripcio: item.descripcio || 'Recurs ortoprotètic d\'autonomia',
    categoria: item.categoria || 'CADIRA_RODES',
    importOficialCatSalut: importOficial,
    dataPrescripcio: item.dataPrescripcio || new Date().toISOString().slice(0, 10),
    capOrigen,
    cap_id,
    sector_id,
    gerencia_id,
    regio_sanitaria_id,
    regioSanitaria,
    diesEsperaOficial: item.diesEsperaOficial || 42,
    reutilitzatBancActiu: reutilitzat,
    tempsLliuramentBancActiuHores: item.tempsLliuramentBancActiuHores || 24,
    estalviGenerat: estalvi,
  };
}
