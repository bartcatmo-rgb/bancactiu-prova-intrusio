import {
  RegioSanitaria,
  GerenciaTerritorial,
  SectorSanitari,
  AreaBasicaSalut,
  CentreSanitari,
  RegioSanitariaNom,
  TipusCentreSanitari,
  EstatCentreSanitari,
} from '@/types/salut';
import {
  CENS_OFICIAL_CENTRES_ICS,
  STORAGE_KEY_CATALEG_COMPLET,
  searchPredictiveCentresICS,
} from '@/lib/seedCentresICS';

// ============================================================================
// 1. LES 9 REGIONS SANITÀRIES OFICIALS DE CATALUNYA (CatSalut)
// ============================================================================
export const REGIONS_SANITARIES_CATALUNYA: RegioSanitaria[] = [
  { id: 'RS_BCN_SUD', codi: '01', nom: 'Barcelona Metropolitana Sud', poblacioAproximada: 1350000, gerenciesIds: ['GT_METRO_SUD'] },
  { id: 'RS_BCN_CIUTAT', codi: '02', nom: 'Barcelona Ciutat', poblacioAproximada: 1660000, gerenciesIds: ['GT_BCN_CIUTAT'] },
  { id: 'RS_BCN_NORD', codi: '03', nom: 'Barcelona Metropolitana Nord', poblacioAproximada: 1420000, gerenciesIds: ['GT_METRO_NORD'] },
  { id: 'RS_CAMP_TARRAGONA', codi: '04', nom: 'Camp de Tarragona', poblacioAproximada: 620000, gerenciesIds: ['GT_CAMP_TARRAGONA'] },
  { id: 'RS_TERRES_EBRE', codi: '05', nom: 'Terres de l\'Ebre', poblacioAproximada: 180000, gerenciesIds: ['GT_TERRES_EBRE'] },
  { id: 'RS_GIRONA', codi: '06', nom: 'Girona', poblacioAproximada: 780000, gerenciesIds: ['GT_GIRONA'] },
  { id: 'RS_LLEIDA', codi: '07', nom: 'Lleida', poblacioAproximada: 370000, gerenciesIds: ['GT_LLEIDA'] },
  { id: 'RS_CAT_CENTRAL', codi: '08', nom: 'Catalunya Central', poblacioAproximada: 520000, gerenciesIds: ['GT_CAT_CENTRAL'] },
  { id: 'RS_ALT_PIRINEU_ARAN', codi: '09', nom: 'Alt Pirineu i Aran', poblacioAproximada: 72000, gerenciesIds: ['GT_ALT_PIRINEU_ARAN'] },
];

// ============================================================================
// 2. GERÈNCIES D'ATENCIÓ PRIMÀRIA I A LA COMUNITAT (GAPiC / ICS)
// ============================================================================
export const GERENCIES_TERRITORIALS_CATALUNYA: GerenciaTerritorial[] = [
  {
    id: 'GT_METRO_SUD',
    codi: 'GT-01',
    nom: 'Gerència Territorial Barcelona Metropolitana Sud (ICS)',
    regioId: 'RS_BCN_SUD',
    regioNom: 'Barcelona Metropolitana Sud',
    hospitalReferencia: 'Hospital Universitari de Bellvitge / H. Viladecans',
    adreca: 'Feixa Llarga s/n, L\'Hospitalet de Llobregat',
    responsable: 'Dr. Xavier Fontanet Valls',
    sectorsIds: ['SEC_BAIX_LLOBREGAT_LITORAL', 'SEC_BAIX_LLOBREGAT_CENTRE_NORD', 'SEC_L_HOSPITALET', 'SEC_GARRAF_PENEDES'],
    actiu: true,
  },
  {
    id: 'GT_BCN_CIUTAT',
    codi: 'GT-02',
    nom: 'Gerència Territorial Barcelona Ciutat (ICS)',
    regioId: 'RS_BCN_CIUTAT',
    regioNom: 'Barcelona Ciutat',
    hospitalReferencia: 'Hospital Universitari Vall d\'Hebron / H. Clínic',
    adreca: 'Carrer de Balmes 22, Barcelona',
    responsable: 'Dra. Montserrat Puigdemont',
    sectorsIds: ['SEC_BCN_ESQUERRA_EIXAMPLE', 'SEC_BCN_DRETA_EIXAMPLE', 'SEC_BCN_LITORAL', 'SEC_BCN_NORD_HORTA'],
    actiu: true,
  },
  {
    id: 'GT_METRO_NORD',
    codi: 'GT-03',
    nom: 'Gerència Territorial Barcelona Metropolitana Nord (ICS)',
    regioId: 'RS_BCN_NORD',
    regioNom: 'Barcelona Metropolitana Nord',
    hospitalReferencia: 'Hospital Universitari Germans Trias i Pujol (Can Ruti)',
    adreca: 'Carretera de Canyet s/n, Badalona',
    responsable: 'Dr. Jordi Casabona i Barbarà',
    sectorsIds: ['SEC_BARCELONES_NORD', 'SEC_MARESME_CENTRE', 'SEC_VALLES_OCCIDENTAL', 'SEC_VALLES_ORIENTAL'],
    actiu: true,
  },
  {
    id: 'GT_CAMP_TARRAGONA',
    codi: 'GT-04',
    nom: 'Gerència Territorial Camp de Tarragona (ICS)',
    regioId: 'RS_CAMP_TARRAGONA',
    regioNom: 'Camp de Tarragona',
    hospitalReferencia: 'Hospital Universitari Joan XXIII de Tarragona',
    adreca: 'Carrer Dr. Mallafrè Guasch 4, Tarragona',
    responsable: 'Dr. Rafael Gràcia i Martínez',
    sectorsIds: ['SEC_TARRAGONES', 'SEC_BAIX_CAMP', 'SEC_ALT_CAMP_CONCA'],
    actiu: true,
  },
  {
    id: 'GT_TERRES_EBRE',
    codi: 'GT-05',
    nom: 'Gerència Territorial Terres de l\'Ebre (ICS)',
    regioId: 'RS_TERRES_EBRE',
    regioNom: 'Terres de l\'Ebre',
    hospitalReferencia: 'Hospital de Tortosa Verge de la Cinta',
    adreca: 'Carrer de les Esplanetes 14, Tortosa',
    responsable: 'Dra. Maria Ferré i Solà',
    sectorsIds: ['SEC_BAIX_EBRE', 'SEC_MONTSIA', 'SEC_RIBERA_TERRA_ALTA'],
    actiu: true,
  },
  {
    id: 'GT_GIRONA',
    codi: 'GT-06',
    nom: 'Gerència Territorial Girona (ICS / IAS)',
    regioId: 'RS_GIRONA',
    regioNom: 'Girona',
    hospitalReferencia: 'Hospital Universitari Dr. Josep Trueta / H. Santa Caterina',
    adreca: 'Carrer Dr. Castany s/n (Parc Hospitalari Martí i Julià), Salt',
    responsable: 'Dra. Meritxell Masó i Carrera',
    sectorsIds: ['SEC_GIRONES_SALT', 'SEC_ALT_EMPORDA', 'SEC_BAIX_EMPORDA', 'SEC_SELVES_INTERIOR', 'SEC_GARROTXA_RIPOLL'],
    actiu: true,
  },
  {
    id: 'GT_LLEIDA',
    codi: 'GT-07',
    nom: 'Gerència Territorial Lleida (ICS / GSS)',
    regioId: 'RS_LLEIDA',
    regioNom: 'Lleida',
    hospitalReferencia: 'Hospital Universitari Arnau de Vilanova de Lleida',
    adreca: 'Avinguda Alcalde Rovira Roure 80, Lleida',
    responsable: 'Dr. Alfons Segarra i Medrano',
    sectorsIds: ['SEC_SEGRIA_CIUTAT', 'SEC_URGELL_PLA', 'SEC_NOGUERA'],
    actiu: true,
  },
  {
    id: 'GT_CAT_CENTRAL',
    codi: 'GT-08',
    nom: 'Gerència Territorial Catalunya Central (ICS)',
    regioId: 'RS_CAT_CENTRAL',
    regioNom: 'Catalunya Central',
    hospitalReferencia: 'Hospital Sant Joan de Déu (Althaia) / H. Vic',
    adreca: 'Carrer Pica d\'Estats 13, Manresa',
    responsable: 'Dra. Montserrat Vilella i Cuadrada',
    sectorsIds: ['SEC_BAGES_MANRESA', 'SEC_OSONA_VIC', 'SEC_BERGUEDA', 'SEC_ANOIA_IGUALADA'],
    actiu: true,
  },
  {
    id: 'GT_ALT_PIRINEU_ARAN',
    codi: 'GT-09',
    nom: 'Gerència Territorial Alt Pirineu i Aran (ICS/SGS)',
    regioId: 'RS_ALT_PIRINEU_ARAN',
    regioNom: 'Alt Pirineu i Aran',
    hospitalReferencia: 'Hospital de Cerdanya / Hospital Comarcal del Pallars',
    adreca: 'Plaça del Carme 1, Tremp',
    responsable: 'Dr. Miquel Serra i Lluís',
    sectorsIds: ['SEC_ALT_URGELL_CERDANYA', 'SEC_PALLARS_RIBAGORCA', 'SEC_VAL_D_ARAN'],
    actiu: true,
  },
];

// ============================================================================
// 3. SECTORS TERRITORIALS GAPiC / ÀMBITS INTEGRALS DE SALUT (AIS)
// ============================================================================
export const SECTORS_SANITARIS_CATALUNYA: SectorSanitari[] = [
  {
    "id": "SEC_BAIX_LLOBREGAT_LITORAL",
    "codi": "SEC-BAIX_LLOBREGAT_LITORAL",
    "nom": "Sector Baix Llobregat Litoral / Delta",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "absIds": [
      "ABS_GAVA",
      "ABS_VILADECANS",
      "ABS_CASTELLDEFELS",
      "ABS_SANT_BOI",
      "ABS_EL_PRAT"
    ]
  },
  {
    "id": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "codi": "SEC-BAIX_LLOBREGAT_CENTRE_NORD",
    "nom": "Sector Baix Llobregat Centre - Nord",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "absIds": [
      "ABS_CORNELLA",
      "ABS_ESPLUGUES",
      "ABS_SANT_FELIU",
      "ABS_SANT_JOAN_DESPI",
      "ABS_SANT_JUST",
      "ABS_SANT_VICENC",
      "ABS_MOLINS_REI",
      "ABS_MARTORELL",
      "ABS_OLESA_ESPARREGUERA"
    ]
  },
  {
    "id": "SEC_L_HOSPITALET",
    "codi": "SEC-L_HOSPITALET",
    "nom": "Sector L'Hospitalet de Llobregat",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "absIds": [
      "ABS_BELLVITGE",
      "ABS_FLORIDA",
      "ABS_COLLBLANC",
      "ABS_PUBILLA_CASES",
      "ABS_JUST_OLIVERAS"
    ]
  },
  {
    "id": "SEC_GARRAF_PENEDES",
    "codi": "SEC-GARRAF_PENEDES",
    "nom": "Sector Garraf - Alt Penedès",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "absIds": [
      "ABS_VILANOVA",
      "ABS_VILAFRANCA"
    ]
  },
  {
    "id": "SEC_BCN_ESQUERRA_EIXAMPLE",
    "codi": "SEC-BCN_ESQUERRA_EIXAMPLE",
    "nom": "AIS Barcelona Esquerra - Sants - Les Corts",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "absIds": [
      "ABS_MANSO",
      "ABS_BORRELL_CASANOVA",
      "ABS_LES_CORTS_SARRIÀ"
    ]
  },
  {
    "id": "SEC_BCN_DRETA_EIXAMPLE",
    "codi": "SEC-BCN_DRETA_EIXAMPLE",
    "nom": "AIS Barcelona Dreta - Eixample - Gràcia",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "absIds": [
      "ABS_SAGRADA_FAMILIA",
      "ABS_VALLCARCA_GRACIA"
    ]
  },
  {
    "id": "SEC_BCN_LITORAL",
    "codi": "SEC-BCN_LITORAL",
    "nom": "AIS Barcelona Litoral - Ciutat Vella - Sant Martí",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "absIds": [
      "ABS_CIUTAT_VELLA",
      "ABS_POBLENOU"
    ]
  },
  {
    "id": "SEC_BCN_NORD_HORTA",
    "codi": "SEC-BCN_NORD_HORTA",
    "nom": "AIS Barcelona Nord - Horta - Nou Barris - Sant Andreu",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "absIds": [
      "ABS_HORTA_GUINARDO",
      "ABS_NOU_BARRIS_SANT_ANDREU"
    ]
  },
  {
    "id": "SEC_BARCELONES_NORD",
    "codi": "SEC-BARCELONES_NORD",
    "nom": "Sector Barcelonès Nord - Badalona / Santa Coloma",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "absIds": [
      "ABS_BADALONA",
      "ABS_SANTA_COLOMA"
    ]
  },
  {
    "id": "SEC_MARESME_CENTRE",
    "codi": "SEC-MARESME_CENTRE",
    "nom": "Sector Maresme Centre & Litoral - Mataró",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "absIds": [
      "ABS_MARESME_SUD",
      "ABS_MATARO"
    ]
  },
  {
    "id": "SEC_VALLES_OCCIDENTAL",
    "codi": "SEC-VALLES_OCCIDENTAL",
    "nom": "Sector Vallès Occidental - Sabadell / Terrassa / Rubí / Cerdanyola / Sant Cugat",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "absIds": [
      "ABS_SABADELL",
      "ABS_TERRASSA",
      "ABS_VALLES_ALTRES"
    ]
  },
  {
    "id": "SEC_VALLES_ORIENTAL",
    "codi": "SEC-VALLES_ORIENTAL",
    "nom": "Sector Vallès Oriental - Granollers / Mollet",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "absIds": [
      "ABS_GRANOLLERS"
    ]
  },
  {
    "id": "SEC_BAGES_MANRESA",
    "codi": "SEC-BAGES_MANRESA",
    "nom": "Sector Bages - Manresa / Moianès",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "absIds": [
      "ABS_MANRESA"
    ]
  },
  {
    "id": "SEC_OSONA_VIC",
    "codi": "SEC-OSONA_VIC",
    "nom": "Sector Osona - Vic",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "absIds": [
      "ABS_VIC"
    ]
  },
  {
    "id": "SEC_BERGUEDA",
    "codi": "SEC-BERGUEDA",
    "nom": "Sector Berguedà - Berga",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "absIds": [
      "ABS_BERGA"
    ]
  },
  {
    "id": "SEC_ANOIA_IGUALADA",
    "codi": "SEC-ANOIA_IGUALADA",
    "nom": "Sector Anoia - Igualada",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "absIds": [
      "ABS_IGUALADA"
    ]
  },
  {
    "id": "SEC_GIRONES_SALT",
    "codi": "SEC-GIRONES_SALT",
    "nom": "Sector Gironès - Salt - Pla de l'Estany",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "absIds": [
      "ABS_SALT",
      "ABS_GIRONA_CIUTAT",
      "ABS_BANYOLES"
    ]
  },
  {
    "id": "SEC_ALT_EMPORDA",
    "codi": "SEC-ALT_EMPORDA",
    "nom": "Sector Alt Empordà - Figueres",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "absIds": [
      "ABS_FIGUERES"
    ]
  },
  {
    "id": "SEC_BAIX_EMPORDA",
    "codi": "SEC-BAIX_EMPORDA",
    "nom": "Sector Baix Empordà - Palamós / Palafrugell",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "absIds": [
      "ABS_BAIX_EMPORDA"
    ]
  },
  {
    "id": "SEC_SELVES_INTERIOR",
    "codi": "SEC-SELVES_INTERIOR",
    "nom": "Sector La Selva - Blanes / Santa Coloma",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "absIds": [
      "ABS_SELVA"
    ]
  },
  {
    "id": "SEC_GARROTXA_RIPOLL",
    "codi": "SEC-GARROTXA_RIPOLL",
    "nom": "Sector Garrotxa - Ripollès",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "absIds": [
      "ABS_GARROTXA_RIPOLL"
    ]
  },
  {
    "id": "SEC_TARRAGONES",
    "codi": "SEC-TARRAGONES",
    "nom": "Sector Tarragonès - Tarragona / Salou",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "absIds": [
      "ABS_TARRAGONA_CIUTAT"
    ]
  },
  {
    "id": "SEC_BAIX_CAMP",
    "codi": "SEC-BAIX_CAMP",
    "nom": "Sector Baix Camp - Reus / Cambrils",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "absIds": [
      "ABS_REUS_CAMBRILS"
    ]
  },
  {
    "id": "SEC_ALT_CAMP_CONCA",
    "codi": "SEC-ALT_CAMP_CONCA",
    "nom": "Sector Alt Camp - Conca de Barberà - Baix Penedès",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "absIds": [
      "ABS_VALLS_VENDRELL"
    ]
  },
  {
    "id": "SEC_BAIX_EBRE",
    "codi": "SEC-BAIX_EBRE",
    "nom": "Sector Baix Ebre - Tortosa",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "absIds": [
      "ABS_TORTOSA"
    ]
  },
  {
    "id": "SEC_MONTSIA",
    "codi": "SEC-MONTSIA",
    "nom": "Sector Montsià - Amposta / La Ràpita",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "absIds": [
      "ABS_MONTSIA"
    ]
  },
  {
    "id": "SEC_RIBERA_TERRA_ALTA",
    "codi": "SEC-RIBERA_TERRA_ALTA",
    "nom": "Sector Ribera d'Ebre - Terra Alta",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "absIds": [
      "ABS_MORA_GANDESA"
    ]
  },
  {
    "id": "SEC_SEGRIA_CIUTAT",
    "codi": "SEC-SEGRIA_CIUTAT",
    "nom": "Sector Segrià - Lleida Ciutat",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "absIds": [
      "ABS_LLEIDA_CIUTAT"
    ]
  },
  {
    "id": "SEC_URGELL_PLA",
    "codi": "SEC-URGELL_PLA",
    "nom": "Sector Urgell - Pla d'Urgell - Mollerussa / Tàrrega",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "absIds": [
      "ABS_MOLLERUSSA_TARREGA"
    ]
  },
  {
    "id": "SEC_NOGUERA",
    "codi": "SEC-NOGUERA",
    "nom": "Sector Noguera - Balaguer / Segarra",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "absIds": [
      "ABS_BALAGUER_CERVERA"
    ]
  },
  {
    "id": "SEC_ALT_URGELL_CERDANYA",
    "codi": "SEC-ALT_URGELL_CERDANYA",
    "nom": "Sector Alt Urgell - Cerdanya",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "absIds": [
      "ABS_LA_SEU_PUIGCERDA"
    ]
  },
  {
    "id": "SEC_PALLARS_RIBAGORCA",
    "codi": "SEC-PALLARS_RIBAGORCA",
    "nom": "Sector Pallars Jussà / Sobirà / Alta Ribagorça",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "absIds": [
      "ABS_PALLARS"
    ]
  },
  {
    "id": "SEC_VAL_D_ARAN",
    "codi": "SEC-VAL_D_ARAN",
    "nom": "Sector Val d'Aran",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "absIds": [
      "ABS_VAL_D_ARAN"
    ]
  }
];

// ============================================================================
// 4. ÀREES BÀSIQUES DE SALUT (ABS)
// ============================================================================
export const ABS_CATALUNYA: AreaBasicaSalut[] = [
  {
    "id": "ABS_GAVA",
    "codi": "ABS-GAVA",
    "nom": "ABS Gavà",
    "sectorId": "SEC_BAIX_LLOBREGAT_LITORAL",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Gavà",
    "centresIds": [
      "CAP_GAVA_1",
      "CAP_GAVA_2"
    ]
  },
  {
    "id": "ABS_VILADECANS",
    "codi": "ABS-VILADECANS",
    "nom": "ABS Viladecans",
    "sectorId": "SEC_BAIX_LLOBREGAT_LITORAL",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Viladecans",
    "centresIds": [
      "CAP_VILADECANS_MONTBAIG",
      "CAP_VILADECANS_BERNADAS",
      "CUAP_VILADECANS"
    ]
  },
  {
    "id": "ABS_CASTELLDEFELS",
    "codi": "ABS-CASTELLDEFELS",
    "nom": "ABS Castelldefels",
    "sectorId": "SEC_BAIX_LLOBREGAT_LITORAL",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Castelldefels",
    "centresIds": [
      "CAP_CASTELLDEFELS_CASTELL",
      "CAP_CASTELLDEFELS_CAN_BOU"
    ]
  },
  {
    "id": "ABS_SANT_BOI",
    "codi": "ABS-SANT_BOI",
    "nom": "ABS Sant Boi de Llobregat",
    "sectorId": "SEC_BAIX_LLOBREGAT_LITORAL",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Sant Boi de Llobregat",
    "centresIds": [
      "CAP_MONTCLAR",
      "CAP_PUJALTA",
      "CAP_MOLI_NOU",
      "CUAP_SANT_BOI"
    ]
  },
  {
    "id": "ABS_EL_PRAT",
    "codi": "ABS-EL_PRAT",
    "nom": "ABS El Prat de Llobregat",
    "sectorId": "SEC_BAIX_LLOBREGAT_LITORAL",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "El Prat de Llobregat",
    "centresIds": [
      "CAP_RAMON_TURRO",
      "CAP_RAMONA_VIA",
      "CUAP_EL_PRAT"
    ]
  },
  {
    "id": "ABS_CORNELLA",
    "codi": "ABS-CORNELLA",
    "nom": "ABS Cornellà de Llobregat",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Cornellà de Llobregat",
    "centresIds": [
      "CAP_MARTI_JULIA",
      "CAP_CORNELLA_BELLVITGE",
      "CAP_SANT_ILDEFONS"
    ]
  },
  {
    "id": "ABS_ESPLUGUES",
    "codi": "ABS-ESPLUGUES",
    "nom": "ABS Esplugues de Llobregat",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Esplugues de Llobregat",
    "centresIds": [
      "CAP_LLUIS_MILLET",
      "CAP_CAN_VIDALET"
    ]
  },
  {
    "id": "ABS_SANT_FELIU",
    "codi": "ABS-SANT_FELIU",
    "nom": "ABS Sant Feliu de Llobregat",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Sant Feliu de Llobregat",
    "centresIds": [
      "CAP_RAMBLA_SANT_FELIU",
      "CAP_EL_PLA"
    ]
  },
  {
    "id": "ABS_SANT_JOAN_DESPI",
    "codi": "ABS-SANT_JOAN_DESPI",
    "nom": "ABS Sant Joan Despí",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Sant Joan Despí",
    "centresIds": [
      "CAP_VERGE_MERCE"
    ]
  },
  {
    "id": "ABS_SANT_JUST",
    "codi": "ABS-SANT_JUST",
    "nom": "ABS Sant Just Desvern",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Sant Just Desvern",
    "centresIds": [
      "CAP_SANT_JUST"
    ]
  },
  {
    "id": "ABS_SANT_VICENC",
    "codi": "ABS-SANT_VICENC",
    "nom": "ABS Sant Vicenç dels Horts",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Sant Vicenç dels Horts",
    "centresIds": [
      "CAP_EL_SERRAL"
    ]
  },
  {
    "id": "ABS_MOLINS_REI",
    "codi": "ABS-MOLINS_REI",
    "nom": "ABS Molins de Rei",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Molins de Rei",
    "centresIds": [
      "CAP_MOLINS_DE_REI"
    ]
  },
  {
    "id": "ABS_MARTORELL",
    "codi": "ABS-MARTORELL",
    "nom": "ABS Martorell Rural & Urbà",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Martorell",
    "centresIds": [
      "CAP_MARTORELL",
      "CUAP_BAIX_LLOBREGAT_NORD"
    ]
  },
  {
    "id": "ABS_OLESA_ESPARREGUERA",
    "codi": "ABS-OLESA_ESPARREGUERA",
    "nom": "ABS Olesa - Esparreguera",
    "sectorId": "SEC_BAIX_LLOBREGAT_CENTRE_NORD",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Olesa de Montserrat",
    "centresIds": [
      "CAP_OLESA",
      "CAP_ESPARREGUERA",
      "CAP_ABRERA",
      "CAP_SANT_ANDREU_BARCA"
    ]
  },
  {
    "id": "ABS_BELLVITGE",
    "codi": "ABS-BELLVITGE",
    "nom": "ABS Bellvitge - Gornal",
    "sectorId": "SEC_L_HOSPITALET",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "L'Hospitalet de Llobregat",
    "centresIds": [
      "CAP_BELLVITGE",
      "CAP_GORNAL"
    ]
  },
  {
    "id": "ABS_FLORIDA",
    "codi": "ABS-FLORIDA",
    "nom": "ABS Florida - Les Planes",
    "sectorId": "SEC_L_HOSPITALET",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "L'Hospitalet de Llobregat",
    "centresIds": [
      "CAP_FLORIDA"
    ]
  },
  {
    "id": "ABS_COLLBLANC",
    "codi": "ABS-COLLBLANC",
    "nom": "ABS Collblanc - La Torrassa",
    "sectorId": "SEC_L_HOSPITALET",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "L'Hospitalet de Llobregat",
    "centresIds": [
      "CAP_COLLBLANC"
    ]
  },
  {
    "id": "ABS_PUBILLA_CASES",
    "codi": "ABS-PUBILLA_CASES",
    "nom": "ABS Pubilla Cases",
    "sectorId": "SEC_L_HOSPITALET",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "L'Hospitalet de Llobregat",
    "centresIds": [
      "CAP_PUBILLA_CASES"
    ]
  },
  {
    "id": "ABS_JUST_OLIVERAS",
    "codi": "ABS-JUST_OLIVERAS",
    "nom": "ABS Centre - Just Oliveras",
    "sectorId": "SEC_L_HOSPITALET",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "L'Hospitalet de Llobregat",
    "centresIds": [
      "CAP_JUST_OLIVERAS",
      "CAP_SANTA_EULALIA",
      "CUAP_PURA_FERNANDEZ"
    ]
  },
  {
    "id": "ABS_VILANOVA",
    "codi": "ABS-VILANOVA",
    "nom": "ABS Vilanova i la Geltrú",
    "sectorId": "SEC_GARRAF_PENEDES",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Vilanova i la Geltrú",
    "centresIds": [
      "CAP_JAUME_I_VILANOVA",
      "CAP_SANT_JOAN_VILANOVA"
    ]
  },
  {
    "id": "ABS_VILAFRANCA",
    "codi": "ABS-VILAFRANCA",
    "nom": "ABS Vilafranca del Penedès",
    "sectorId": "SEC_GARRAF_PENEDES",
    "gerenciaId": "GT_METRO_SUD",
    "regioId": "RS_BCN_SUD",
    "municipiPrincipal": "Vilafranca del Penedès",
    "centresIds": [
      "CAP_VILAFRANCA_NORD"
    ]
  },
  {
    "id": "ABS_MANSO",
    "codi": "ABS-MANSO",
    "nom": "ABS Manso",
    "sectorId": "SEC_BCN_ESQUERRA_EIXAMPLE",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_MANSO",
      "CUAP_MANSO"
    ]
  },
  {
    "id": "ABS_BORRELL_CASANOVA",
    "codi": "ABS-BORRELL_CASANOVA",
    "nom": "ABS Borrell - Casanova",
    "sectorId": "SEC_BCN_ESQUERRA_EIXAMPLE",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_BORRELL",
      "CAP_CASANOVA"
    ]
  },
  {
    "id": "ABS_LES_CORTS_SARRIÀ",
    "codi": "ABS-LES_CORTS_SARRIÀ",
    "nom": "ABS Les Corts - Sarrià",
    "sectorId": "SEC_BCN_ESQUERRA_EIXAMPLE",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_LES_CORTS",
      "CAP_SARRIA",
      "CAP_SANTS"
    ]
  },
  {
    "id": "ABS_SAGRADA_FAMILIA",
    "codi": "ABS-SAGRADA_FAMILIA",
    "nom": "ABS Sagrada Família - Sant Joan",
    "sectorId": "SEC_BCN_DRETA_EIXAMPLE",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_SAGRADA_FAMILIA",
      "CAP_ROGER_DE_FLOR",
      "CAP_PASSEIG_SANT_JOAN"
    ]
  },
  {
    "id": "ABS_VALLCARCA_GRACIA",
    "codi": "ABS-VALLCARCA_GRACIA",
    "nom": "ABS Vallcarca - Gràcia",
    "sectorId": "SEC_BCN_DRETA_EIXAMPLE",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_VALLCARCA",
      "CUAP_DOS_DE_MAIG",
      "CUAP_GRACIA"
    ]
  },
  {
    "id": "ABS_CIUTAT_VELLA",
    "codi": "ABS-CIUTAT_VELLA",
    "nom": "ABS Casc Antic - Drassanes",
    "sectorId": "SEC_BCN_LITORAL",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_CASC_ANTIC",
      "CAP_DRASSANES",
      "CAP_BARCELONETA"
    ]
  },
  {
    "id": "ABS_POBLENOU",
    "codi": "ABS-POBLENOU",
    "nom": "ABS Poblenou - Vila Olímpica",
    "sectorId": "SEC_BCN_LITORAL",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_POBLENOU",
      "CAP_VILA_OLIMPICA",
      "CAP_BESOS"
    ]
  },
  {
    "id": "ABS_HORTA_GUINARDO",
    "codi": "ABS-HORTA_GUINARDO",
    "nom": "ABS Horta - Guinardó",
    "sectorId": "SEC_BCN_NORD_HORTA",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_HORTA",
      "CUAP_HORTA",
      "CAP_VALL_HEBRON"
    ]
  },
  {
    "id": "ABS_NOU_BARRIS_SANT_ANDREU",
    "codi": "ABS-NOU_BARRIS_SANT_ANDREU",
    "nom": "ABS Nou Barris - Sant Andreu",
    "sectorId": "SEC_BCN_NORD_HORTA",
    "gerenciaId": "GT_BCN_CIUTAT",
    "regioId": "RS_BCN_CIUTAT",
    "municipiPrincipal": "Barcelona",
    "centresIds": [
      "CAP_GUINEUETA",
      "CAP_RIO_DE_JANEIRO",
      "CAP_CHAFARINAS",
      "CAP_CASERNES_SANT_ANDREU"
    ]
  },
  {
    "id": "ABS_BADALONA",
    "codi": "ABS-BADALONA",
    "nom": "ABS Badalona",
    "sectorId": "SEC_BARCELONES_NORD",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Badalona",
    "centresIds": [
      "CAP_DR_ROBERT",
      "CAP_NOVA_LLOREDA",
      "CAP_MORERA",
      "CUAP_BADALONA"
    ]
  },
  {
    "id": "ABS_SANTA_COLOMA",
    "codi": "ABS-SANTA_COLOMA",
    "nom": "ABS Santa Coloma de Gramenet",
    "sectorId": "SEC_BARCELONES_NORD",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Santa Coloma de Gramenet",
    "centresIds": [
      "CAP_SANTA_COLOMA",
      "CAP_SINGUERLIN"
    ]
  },
  {
    "id": "ABS_MARESME_SUD",
    "codi": "ABS-MARESME_SUD",
    "nom": "ABS Masnou - Premià - Vilassar",
    "sectorId": "SEC_MARESME_CENTRE",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "El Masnou",
    "centresIds": [
      "CAP_EL_MASNOU",
      "CAP_PREMIA_DE_MAR",
      "CAP_VILASSAR_DE_MAR"
    ]
  },
  {
    "id": "ABS_MATARO",
    "codi": "ABS-MATARO",
    "nom": "ABS Mataró Centre i Barris",
    "sectorId": "SEC_MARESME_CENTRE",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Mataró",
    "centresIds": [
      "CAP_GATASSA",
      "CAP_RONDA_PRIM",
      "CAP_ROCAFONDA",
      "CUAP_MATARO",
      "CAP_ARENYS_DE_MAR"
    ]
  },
  {
    "id": "ABS_SABADELL",
    "codi": "ABS-SABADELL",
    "nom": "ABS Sabadell",
    "sectorId": "SEC_VALLES_OCCIDENTAL",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Sabadell",
    "centresIds": [
      "CAP_CAN_RULL",
      "CAP_CONCORDIA",
      "CUAP_SANT_FELIX"
    ]
  },
  {
    "id": "ABS_TERRASSA",
    "codi": "ABS-TERRASSA",
    "nom": "ABS Terrassa",
    "sectorId": "SEC_VALLES_OCCIDENTAL",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Terrassa",
    "centresIds": [
      "CAP_TERRASSA_NORD",
      "CAP_TERRASSA_EST",
      "CAP_TERRASSA_SUD",
      "CAP_TERRASSA_OEST"
    ]
  },
  {
    "id": "ABS_VALLES_ALTRES",
    "codi": "ABS-VALLES_ALTRES",
    "nom": "ABS Rubí - Cerdanyola - Sant Cugat",
    "sectorId": "SEC_VALLES_OCCIDENTAL",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Rubí",
    "centresIds": [
      "CAP_RUBI_MUTUA",
      "CAP_CERDANYOLA_SERRAPARERA",
      "CAP_SANT_CUGAT"
    ]
  },
  {
    "id": "ABS_GRANOLLERS",
    "codi": "ABS-GRANOLLERS",
    "nom": "ABS Granollers",
    "sectorId": "SEC_VALLES_ORIENTAL",
    "gerenciaId": "GT_METRO_NORD",
    "regioId": "RS_BCN_NORD",
    "municipiPrincipal": "Granollers",
    "centresIds": [
      "CAP_GRANOLLERS_CENTRE",
      "CAP_MOLLET_CAN_PANTIQUET"
    ]
  },
  {
    "id": "ABS_MANRESA",
    "codi": "ABS-MANRESA",
    "nom": "ABS Manresa",
    "sectorId": "SEC_BAGES_MANRESA",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "municipiPrincipal": "Manresa",
    "centresIds": [
      "CAP_BAGES_MANRESA",
      "CAP_SAGRADA_FAMILIA_MANRESA",
      "CAP_SANTPEDOR",
      "CAP_MOIA"
    ]
  },
  {
    "id": "ABS_VIC",
    "codi": "ABS-VIC",
    "nom": "ABS Vic i Voltants",
    "sectorId": "SEC_OSONA_VIC",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "municipiPrincipal": "Vic",
    "centresIds": [
      "CAP_VIC_NORD",
      "CAP_VIC_SUD",
      "CAP_MANLLEU",
      "CAP_TORELLO"
    ]
  },
  {
    "id": "ABS_BERGA",
    "codi": "ABS-BERGA",
    "nom": "ABS Berga",
    "sectorId": "SEC_BERGUEDA",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "municipiPrincipal": "Berga",
    "centresIds": [
      "CAP_BERGA"
    ]
  },
  {
    "id": "ABS_IGUALADA",
    "codi": "ABS-IGUALADA",
    "nom": "ABS Igualada",
    "sectorId": "SEC_ANOIA_IGUALADA",
    "gerenciaId": "GT_CAT_CENTRAL",
    "regioId": "RS_CAT_CENTRAL",
    "municipiPrincipal": "Igualada",
    "centresIds": [
      "CAP_IGUALADA_NORD",
      "CAP_IGUALADA_URBA",
      "CAP_SANTA_MARGARIDA_MONTBUI"
    ]
  },
  {
    "id": "ABS_SALT",
    "codi": "ABS-SALT",
    "nom": "ABS Salt (Jordi Nadal)",
    "sectorId": "SEC_GIRONES_SALT",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Salt",
    "centresIds": [
      "CAP_SALT",
      "CL_SALT_VEINAT"
    ]
  },
  {
    "id": "ABS_GIRONA_CIUTAT",
    "codi": "ABS-GIRONA_CIUTAT",
    "nom": "ABS Girona Ciutat",
    "sectorId": "SEC_GIRONES_SALT",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Girona",
    "centresIds": [
      "CAP_SANTA_CLARA",
      "CAP_CAN_GIBERT",
      "CAP_MONTILIVI",
      "CUAP_GUELL"
    ]
  },
  {
    "id": "ABS_BANYOLES",
    "codi": "ABS-BANYOLES",
    "nom": "ABS Banyoles",
    "sectorId": "SEC_GIRONES_SALT",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Banyoles",
    "centresIds": [
      "CAP_BANYOLES"
    ]
  },
  {
    "id": "ABS_FIGUERES",
    "codi": "ABS-FIGUERES",
    "nom": "ABS Figueres - Roses",
    "sectorId": "SEC_ALT_EMPORDA",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Figueres",
    "centresIds": [
      "CAP_FIGUERES",
      "CAP_ROSES"
    ]
  },
  {
    "id": "ABS_BAIX_EMPORDA",
    "codi": "ABS-BAIX_EMPORDA",
    "nom": "ABS Baix Empordà",
    "sectorId": "SEC_BAIX_EMPORDA",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Palamós",
    "centresIds": [
      "CAP_PALAMOS",
      "CAP_PALAFRUGELL",
      "CAP_SANT_FELIU_GUIXOLS"
    ]
  },
  {
    "id": "ABS_SELVA",
    "codi": "ABS-SELVA",
    "nom": "ABS La Selva",
    "sectorId": "SEC_SELVES_INTERIOR",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Blanes",
    "centresIds": [
      "CAP_BLANES",
      "CAP_SANTA_COLOMA_FARNERS"
    ]
  },
  {
    "id": "ABS_GARROTXA_RIPOLL",
    "codi": "ABS-GARROTXA_RIPOLL",
    "nom": "ABS Garrotxa - Ripollès",
    "sectorId": "SEC_GARROTXA_RIPOLL",
    "gerenciaId": "GT_GIRONA",
    "regioId": "RS_GIRONA",
    "municipiPrincipal": "Olot",
    "centresIds": [
      "CAP_OLOT",
      "CAP_RIPOLL"
    ]
  },
  {
    "id": "ABS_TARRAGONA_CIUTAT",
    "codi": "ABS-TARRAGONA_CIUTAT",
    "nom": "ABS Tarragona Ciutat",
    "sectorId": "SEC_TARRAGONES",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "municipiPrincipal": "Tarragona",
    "centresIds": [
      "CAP_JAUME_I_TARRAGONA",
      "CAP_TORREFORTA",
      "CAP_SALOU",
      "CAP_TORREDEMBARRA"
    ]
  },
  {
    "id": "ABS_REUS_CAMBRILS",
    "codi": "ABS-REUS_CAMBRILS",
    "nom": "ABS Reus - Cambrils",
    "sectorId": "SEC_BAIX_CAMP",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "municipiPrincipal": "Reus",
    "centresIds": [
      "CAP_SANT_PERE_REUS",
      "CAP_LLIBERTAT_REUS",
      "CAP_CAMBRILS"
    ]
  },
  {
    "id": "ABS_VALLS_VENDRELL",
    "codi": "ABS-VALLS_VENDRELL",
    "nom": "ABS Valls - El Vendrell",
    "sectorId": "SEC_ALT_CAMP_CONCA",
    "gerenciaId": "GT_CAMP_TARRAGONA",
    "regioId": "RS_CAMP_TARRAGONA",
    "municipiPrincipal": "Valls",
    "centresIds": [
      "CAP_VALLS",
      "CAP_MONTBLANC",
      "CAP_EL_VENDRELL"
    ]
  },
  {
    "id": "ABS_TORTOSA",
    "codi": "ABS-TORTOSA",
    "nom": "ABS Tortosa",
    "sectorId": "SEC_BAIX_EBRE",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "municipiPrincipal": "Tortosa",
    "centresIds": [
      "CAP_BAIX_EBRE_TORTOSA",
      "CAP_ROQUETES",
      "CAP_DELTEBRE"
    ]
  },
  {
    "id": "ABS_MONTSIA",
    "codi": "ABS-MONTSIA",
    "nom": "ABS Montsià",
    "sectorId": "SEC_MONTSIA",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "municipiPrincipal": "Amposta",
    "centresIds": [
      "CAP_AMPOSTA",
      "CAP_LA_RAPITA"
    ]
  },
  {
    "id": "ABS_MORA_GANDESA",
    "codi": "ABS-MORA_GANDESA",
    "nom": "ABS Móra d'Ebre - Gandesa",
    "sectorId": "SEC_RIBERA_TERRA_ALTA",
    "gerenciaId": "GT_TERRES_EBRE",
    "regioId": "RS_TERRES_EBRE",
    "municipiPrincipal": "Móra d'Ebre",
    "centresIds": [
      "CAP_MORA_D_EBRE",
      "CAP_GANDESA"
    ]
  },
  {
    "id": "ABS_LLEIDA_CIUTAT",
    "codi": "ABS-LLEIDA_CIUTAT",
    "nom": "ABS Lleida Ciutat",
    "sectorId": "SEC_SEGRIA_CIUTAT",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "municipiPrincipal": "Lleida",
    "centresIds": [
      "CAP_PRIMER_DE_MAIG",
      "CAP_RAMBLA_FERRAN",
      "CAP_BALAFIA",
      "CAP_BORDETA",
      "CAP_CAPPONT",
      "CUAP_PRAT_DE_LA_RIBA"
    ]
  },
  {
    "id": "ABS_MOLLERUSSA_TARREGA",
    "codi": "ABS-MOLLERUSSA_TARREGA",
    "nom": "ABS Mollerussa - Tàrrega",
    "sectorId": "SEC_URGELL_PLA",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "municipiPrincipal": "Mollerussa",
    "centresIds": [
      "CAP_MOLLERUSSA",
      "CAP_TARREGA"
    ]
  },
  {
    "id": "ABS_BALAGUER_CERVERA",
    "codi": "ABS-BALAGUER_CERVERA",
    "nom": "ABS Balaguer - Cervera",
    "sectorId": "SEC_NOGUERA",
    "gerenciaId": "GT_LLEIDA",
    "regioId": "RS_LLEIDA",
    "municipiPrincipal": "Balaguer",
    "centresIds": [
      "CAP_BALAGUER",
      "CAP_CERVERA"
    ]
  },
  {
    "id": "ABS_LA_SEU_PUIGCERDA",
    "codi": "ABS-LA_SEU_PUIGCERDA",
    "nom": "ABS La Seu d'Urgell - Puigcerdà",
    "sectorId": "SEC_ALT_URGELL_CERDANYA",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "municipiPrincipal": "La Seu d'Urgell",
    "centresIds": [
      "CAP_LA_SEU_D_URGELL",
      "CAP_PUIGCERDA"
    ]
  },
  {
    "id": "ABS_PALLARS",
    "codi": "ABS-PALLARS",
    "nom": "ABS Pallars - Ribagorça",
    "sectorId": "SEC_PALLARS_RIBAGORCA",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "municipiPrincipal": "Tremp",
    "centresIds": [
      "CAP_TREMP",
      "CAP_LA_POBLA_DE_SEGUR",
      "CAP_SORT",
      "CAP_PONT_DE_SUERT"
    ]
  },
  {
    "id": "ABS_VAL_D_ARAN",
    "codi": "ABS-VAL_D_ARAN",
    "nom": "ABS Vielha (Aran)",
    "sectorId": "SEC_VAL_D_ARAN",
    "gerenciaId": "GT_ALT_PIRINEU_ARAN",
    "regioId": "RS_ALT_PIRINEU_ARAN",
    "municipiPrincipal": "Vielha e Mijaran",
    "centresIds": [
      "CAP_VIELHA"
    ]
  }
];

// ============================================================================
// 5. CENS INICIAL DE CENTRES SANITARIS (ICS / SISCAT)
// ============================================================================
export const CENTRES_SANITARIS_INICIALS: CentreSanitari[] = CENS_OFICIAL_CENTRES_ICS;

// ============================================================================
// 6. FUNCIONS D'UTILITAT AUXILIARS (SINGLE SOURCE OF TRUTH)
// ============================================================================

export const STORAGE_KEY_CATALEG = STORAGE_KEY_CATALEG_COMPLET;

export function getAllRegioSanitaries(): RegioSanitaria[] {
  return REGIONS_SANITARIES_CATALUNYA;
}

export function getAllGerencies(): GerenciaTerritorial[] {
  return GERENCIES_TERRITORIALS_CATALUNYA;
}

export function getAllSectors(): SectorSanitari[] {
  return SECTORS_SANITARIS_CATALUNYA;
}

export function getAllABS(): AreaBasicaSalut[] {
  return ABS_CATALUNYA;
}

export function getAllCentres(): CentreSanitari[] {
  return loadCentresWithPersistence();
}

export function getRegioById(regioId: string): RegioSanitaria | undefined {
  return REGIONS_SANITARIES_CATALUNYA.find((r) => r.id === regioId || r.nom === regioId || r.codi === regioId);
}

export function getGerenciesByRegio(regioIdOrNom: string): GerenciaTerritorial[] {
  const regio = getRegioById(regioIdOrNom);
  if (!regio) {
    return GERENCIES_TERRITORIALS_CATALUNYA.filter(
      (g) => g.regioId === regioIdOrNom || g.regioNom === regioIdOrNom
    );
  }
  return GERENCIES_TERRITORIALS_CATALUNYA.filter((g) => g.regioId === regio.id || g.regioNom === regio.nom);
}

export function getGerenciaById(gerenciaId: string): GerenciaTerritorial | undefined {
  return GERENCIES_TERRITORIALS_CATALUNYA.find((g) => g.id === gerenciaId || g.nom === gerenciaId);
}

export function getSectorsByGerencia(gerenciaId: string): SectorSanitari[] {
  return SECTORS_SANITARIS_CATALUNYA.filter((s) => s.gerenciaId === gerenciaId);
}

export function getSectorById(sectorId: string): SectorSanitari | undefined {
  return SECTORS_SANITARIS_CATALUNYA.find((s) => s.id === sectorId);
}

export function getABSBySector(sectorId: string): AreaBasicaSalut[] {
  return ABS_CATALUNYA.filter((a) => a.sectorId === sectorId);
}

export function getABSById(absId: string): AreaBasicaSalut | undefined {
  return ABS_CATALUNYA.find((a) => a.id === absId);
}

export function getCentresByABS(absId: string): CentreSanitari[] {
  const all = getAllCentres();
  return all.filter((c) => c.absId === absId);
}

export function getCentresBySector(sectorId: string): CentreSanitari[] {
  const all = getAllCentres();
  return all.filter((c) => c.sectorId === sectorId);
}

export function getCentresByGerencia(gerenciaId: string): CentreSanitari[] {
  const all = getAllCentres();
  return all.filter((c) => c.gerenciaId === gerenciaId);
}

export function getCentresByRegio(regioId: string): CentreSanitari[] {
  const all = getAllCentres();
  return all.filter((c) => c.regioId === regioId);
}

export function getCentreById(centreId: string): CentreSanitari | undefined {
  const all = getAllCentres();
  return all.find((c) => c.id === centreId || c.codiRecss === centreId || c.nom === centreId);
}

export function searchCentres(term: string): CentreSanitari[] {
  const clean = term.trim().toLowerCase();
  if (!clean) return getAllCentres();
  return getAllCentres().filter(
    (c) =>
      c.nom.toLowerCase().includes(clean) ||
      c.codiRecss.toLowerCase().includes(clean) ||
      c.municipi.toLowerCase().includes(clean) ||
      c.gerenciaNom.toLowerCase().includes(clean) ||
      c.absNom.toLowerCase().includes(clean) ||
      c.sectorNom.toLowerCase().includes(clean) ||
      c.adreca.toLowerCase().includes(clean)
  );
}

/**
 * Carrega els centres assegurant que si l'emmagatzematge local conté una versió antiga
 * o amb només mostres testimonials, es re-sembra automàticament el cens complet oficial.
 */

/**
 * Garanteix que cada centre sanitari tingui estat de conveni i fase de desplegament
 */
export function ensureCentreConveni(c: CentreSanitari): CentreSanitari {
  if (c.estatConveni) return c;
  const isPilot =
    c.municipi === 'Salt' ||
    c.nom.toLowerCase().includes('salt') ||
    c.nom.toLowerCase().includes('güell') ||
    c.nom.toLowerCase().includes('manso') ||
    c.id === 'CAP_GAVA_1';

  return {
    ...c,
    estatConveni: isPilot ? 'ACTIU_PILOT' : 'PENDENT_CONVENI',
    faseDesplegament: isPilot ? 1 : 2,
    dataActivacio: isPilot ? '2026-01-01' : undefined,
  };
}

export function loadCentresWithPersistence(): CentreSanitari[] {
  if (typeof window === 'undefined') {
    return CENS_OFICIAL_CENTRES_ICS.map(ensureCentreConveni);
  }
  try {
    let raw = localStorage.getItem(STORAGE_KEY_CATALEG);
    if (!raw) {
      raw = localStorage.getItem('bancactiu_cataleg_centres_complet');
    }
    if (!raw) {
      raw = localStorage.getItem('bancactiu_cataleg_salut_v1');
    }

    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATALEG, JSON.stringify(CENS_OFICIAL_CENTRES_ICS));
      return CENS_OFICIAL_CENTRES_ICS;
    }

    const parsed = JSON.parse(raw) as CentreSanitari[];
    if (!Array.isArray(parsed) || parsed.length < CENS_OFICIAL_CENTRES_ICS.length) {
      const customCentres = (Array.isArray(parsed) ? parsed : []).filter(
        (p) => !CENS_OFICIAL_CENTRES_ICS.some((c) => c.id === p.id)
      );
      const merged = [...CENS_OFICIAL_CENTRES_ICS, ...customCentres];
      localStorage.setItem(STORAGE_KEY_CATALEG, JSON.stringify(merged));
      return merged.map(ensureCentreConveni);
    }

    return parsed.map(ensureCentreConveni);
  } catch {
    return CENS_OFICIAL_CENTRES_ICS;
  }
}

export function saveCustomCentre(newCentre: CentreSanitari): CentreSanitari[] {
  const current = loadCentresWithPersistence();
  const existsIdx = current.findIndex((c) => c.id === newCentre.id || c.codiRecss === newCentre.codiRecss);
  let updated: CentreSanitari[];
  if (existsIdx >= 0) {
    updated = [...current];
    updated[existsIdx] = newCentre;
  } else {
    updated = [newCentre, ...current];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_CATALEG, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('territorial-catalog-updated', { detail: updated }));
      window.dispatchEvent(new CustomEvent('bancactiu-cataleg-updated', { detail: updated }));
    } catch (e) {
      console.error('Error desant catàleg sanitari a localStorage:', e);
    }
  }
  return updated;
}

export function updateCentreEstat(centreId: string, nouEstat: EstatCentreSanitari): boolean {
  const current = loadCentresWithPersistence();
  const target = current.find((c) => c.id === centreId || c.codiRecss === centreId);
  if (!target) return false;
  target.estat = nouEstat;
  target.actiu = nouEstat !== 'En Manteniment';
  saveCustomCentre(target);
  return true;
}
