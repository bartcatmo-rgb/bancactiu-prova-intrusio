import type { ManagedRole } from '@/types/demo-user';

export type ManualCategory =
  | 'ATENCIO_PRIMARIA'        // Atenció Primària & Assistencial (UAC / CAP)
  | 'COMUNITARI_TERCER_SECTOR' // Comunitari & Tercer Sector (Entitats de Barri & Creu Roja)
  | 'SERVEIS_INFORMATICS_TI'   // Serveis Informàtics & Enginyeria (Arquitectura & PWA)
  | 'ADMINISTRACIO_GLOBAL_TI'  // Administració Global & Governança (Superadministrador TI)
  | 'INSTITUCIONAL_DIRECCIO'   // Marc Institucional & Direcció (Projecte Pilot Independent)
  | 'CIUTADANIA_PORTAL'        // Ciutadania & Pacients (Portal Ciutadà Mòbil)
  | 'TALLER_ORTOPEDIC';        // Taller Ortopèdic & Calibratge de Material

export type ManualMode = 'PDF_READONLY' | 'EDITABLE_SOURCE';

export interface ManagedManual {
  id: string;
  title: string;
  category: ManualCategory;
  categoryLabel: string;
  categoryIcon: string;
  description: string;
  icon: string;
  pdfPath: string;             // Ruta al PDF o visualitzador
  htmlPath: string;            // Ruta a la versió visual HTML
  sourcePath?: string;         // Ruta al fitxer font Markdown / editable
  allowedRoles: (ManagedRole | string)[]; // Rols amb permís d'accés
  mode: ManualMode;            // PDF_READONLY (consultiu protegit) vs EDITABLE_SOURCE (editable)
  lastUpdated: string;
  version: string;
  requiresSpecialAuthorization?: boolean;
}

export const DEFAULT_MANAGED_MANUALS: ManagedManual[] = [
  // 1. SUPERADMINISTRACIÓ GLOBAL, PATRÓ LAUNCHPAD & GOVERNANÇA DUAL
  {
    id: 'man-adm-01',
    title: 'Manual de Superadministració Global, Patró Launchpad & Governança Dual (52622304Y / 48956602Z)',
    category: 'ADMINISTRACIO_GLOBAL_TI',
    categoryLabel: 'Administració Global & Governança (Superadministradors TI)',
    categoryIcon: '👑',
    description: 'Arquitectura Launchpad centralitzada amb zero scroll vertical i navegació estanca modular. Protocol d\'activació per fases de convenis territorials, governança dual simètrica per a l\'arrel 52622304Y i el suport júnior 48956602Z, cens d\'usuaris RBAC, auditories RGPD/LOPDGDD immutables i manteniment de la base de dades PostgreSQL al núvol.',
    icon: '🛡️',
    pdfPath: '/docs/manual_superadministrador_onboarding.pdf',
    htmlPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    sourcePath: '/docs/MANUAL_WORKSPACES_CLEAN_UI.md',
    allowedRoles: ['SUPER_ADMIN'],
    mode: 'EDITABLE_SOURCE',
    lastUpdated: '09/11/2026',
    version: '4.5 Launchpad & Zero Scroll',
  },

  // 1B. GESTIÓ DEL CENS D'USUARIS I ROLS RBAC
  {
    id: 'man-users-01',
    title: 'Manual de Gestió del Cens d\'Usuaris, Rols i Permisos Granulars (SuperAdminUsersWorkspace)',
    category: 'ADMINISTRACIO_GLOBAL_TI',
    categoryLabel: 'Administració Global & Governança (Superadministradors TI)',
    categoryIcon: '👥',
    description: 'Guia d\'administració del cens d\'usuaris sota la navegació estanca de SuperAdminUsersWorkspace. Alta d\'operadors per DNI/NIE, assignació de rols sanitaris (CAP, CUAP, GAPIC, CatSalut), municipals (Coordinador Local de Polítiques Socials) i comunitaris (Creu Roja, AVV). Control d\'activació/pausa de comptes i restabliment de claus temporals.',
    icon: '👥',
    pdfPath: '/docs/manual_superadministrador_onboarding.pdf',
    htmlPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    sourcePath: '/docs/MANUAL_WORKSPACES_CLEAN_UI.md',
    allowedRoles: ['SUPER_ADMIN'],
    mode: 'EDITABLE_SOURCE',
    lastUpdated: '09/11/2026',
    version: '4.5 RBAC Workspace',
  },

  // 1C. BIBLIOTECA INSTITUCIONAL I PRESENTACIÓ DEL PILOT DE CORNELLÀ
  {
    id: 'man-docs-01',
    title: 'Biblioteca Documental Institucional i Guions Oficials del Pilot de Cornellà',
    category: 'INSTITUCIONAL_DIRECCIO',
    categoryLabel: 'Marc Institucional & Direcció (Projecte Pilot)',
    categoryIcon: '🏛️',
    description: 'Repositori d\'actius per a la defensa institucional del projecte a l\'Ajuntament de Cornellà de Llobregat, CatSalut i GAPIC Metropolitana Sud. Descàrrega directa de la Presentació Oficial en PowerPoint (BancActiu_Presentacio_Cornella_Oficial.pptx) i del Guió de la Reunió en PDF (guio_presentacio_cornella.pdf).',
    icon: '📚',
    pdfPath: '/docs/guio_presentacio_cornella.pdf',
    htmlPath: '/presentacions_corporatives/index.html',
    sourcePath: '/docs/DEPLOY_PILOT_CORNELLA.md',
    allowedRoles: ['SUPER_ADMIN', 'GERENCIA_TERRITORIAL', 'CATSALUT', 'DIRECCIO_GENERAL', 'COORDINADOR_LOCAL'],
    mode: 'PDF_READONLY',
    lastUpdated: '09/11/2026',
    version: '4.5 Cornellà Official',
  },

  // 1D. SINCRONITZACIÓ D'ENTORNS I MIRROR-SYNC DE LES 6 CARPETES
  {
    id: 'man-sync-01',
    title: 'Manual de Sincronització d\'Entorns i Protocol Mirror-Sync de les 6 Carpetes',
    category: 'SERVEIS_INFORMATICS_TI',
    categoryLabel: 'Serveis Informàtics & Enginyeria (Arquitectura & PWA)',
    categoryIcon: '💻',
    description: 'Auditoria de coherència i protocol de paritat forçada per als 6 entorns del repositori (Sistem Base, eCAP Enterprise, Entorn Controlat, Distribucions USB i Aplicació Mòbil). Monitorització dels 76+ components crítics, manuals Markdown i rutes d\'integració OIDC.',
    icon: '🔄',
    pdfPath: '/docs/manual_deploy_pilot_cornella.pdf',
    htmlPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    sourcePath: '/docs/MANUAL_WORKSPACES_CLEAN_UI.md',
    allowedRoles: ['SUPER_ADMIN'],
    mode: 'EDITABLE_SOURCE',
    lastUpdated: '09/11/2026',
    version: '4.5 Mirror Sync',
  },

  // 1E. COMUNICACIONS AUTOMATITZADES I CREDENCIALS DE CIUTADANIA
  {
    id: 'man-comm-01',
    title: 'Manual de Comunicacions Automatitzades i Emissió de Credencials a la Ciutadania (Email & SMS)',
    category: 'CIUTADANIA_PORTAL',
    categoryLabel: 'Ciutadania & Pacients (Portal Ciutadà Mòbil)',
    categoryIcon: '📱',
    description: 'Protocol d\'emissió d\'avisos asíncrons post-registre i generació de credencials segures (OTP 72h). Mapeig de paràmetres ([Nom_Ciutadà], [Usuari_Assignat], [Contrasenya_Temporal], [Enllaç_Accés_Portal], [Link_Descàrrega_App]), plantilles HTML i SMS corporatives, i compliment estricte RGPD/LOPDGDD.',
    icon: '✉️',
    pdfPath: '/docs/manual_serveis_socials_cornella.pdf',
    htmlPath: '/presentacions_corporatives/index.html',
    sourcePath: '/docs/MANUAL_COMUNICACIONS_CIUTADANIA.md',
    allowedRoles: ['SUPER_ADMIN', 'CAP_ADMIN', 'CAP_REFERENT', 'REFERENT_GESTIO_CAP', 'DIRECCIO_CAP', 'GERENCIA_TERRITORIAL', 'ADMIN_ENTITAT', 'COORDINADOR_LOCAL'],
    mode: 'EDITABLE_SOURCE',
    lastUpdated: '09/11/2026',
    version: '1.0 Automatització d\'Avisos',
  },

  // 2. ATENCIÓ PRIMÀRIA (CAP/CUAP) · OPERATIVA CENTRADA EN LA TASCA PRINCIPAL
  {
    id: 'man-uac-01',
    title: 'Manual d\'Atenció Primària (CAP/CUAP) · Operativa Centrada en la Tasca Principal',
    category: 'ATENCIO_PRIMARIA',
    categoryLabel: 'Atenció Primària & Assistencial (CAP / UAC)',
    categoryIcon: '🏥',
    description: 'Guia completa per a administratius i referents sanitaris d\'atenció primària. Operativa àgil a través de CapTaskWorkspace: cerca immediata de ciutadà per DNI/NIE, diagnòstic funcional, selecció de circuit clínic (BPS Solidari d\'Emergència vs Prestació PAO Oficial), generació directa de la reserva i impressió del document oficial de préstec amb opció de signatura digital.',
    icon: '📋',
    pdfPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    htmlPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    allowedRoles: ['SUPER_ADMIN', 'CAP_ADMIN', 'CAP_REFERENT', 'REFERENT_GESTIO_CAP', 'DIRECCIO_CAP', 'DIRECCIO_GENERAL'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Task-Focused UI',
  },

  // 3. PROTOCOL CLÍNIC DE DERIVACIÓ OFICIAL PAO CATSALUT A LA SEGONA PRÒRROGA
  {
    id: 'man-uac-02',
    title: 'Protocol Clínic de Derivació Oficial a PAO CatSalut a la Segona Pròrroga',
    category: 'ATENCIO_PRIMARIA',
    categoryLabel: 'Atenció Primària & Assistencial (CAP / UAC)',
    categoryIcon: '🏥',
    description: 'Criteris clínics i administratius per al control temporal de recursos. Regla estricta de negoci: concessió d\'una única pròrroga solidària de 30 dies per a recuperació transitòria. Si la necessitat funcional esdevé continuada o crònica, el sistema bloqueja automàticament noves pròrrogues comunitàries i activa el protocol d\'emissió de recepta i derivació preferent al CatSalut per a la Prestació d\'Articles Ortoprotèsics oficial.',
    icon: '⚖️',
    pdfPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    htmlPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    allowedRoles: ['SUPER_ADMIN', 'CAP_ADMIN', 'CAP_REFERENT', 'DIRECCIO_CAP', 'DIRECCIO_GENERAL'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Derivació PAO',
  },

  // 4. ENTITATS COL·LABORADORES (AVV I CREU ROJA) · LLIURAMENT I DEVOLUCIÓ
  {
    id: 'man-ent-01',
    title: 'Manual d\'Entitats Col·laboradores (AVV i Creu Roja) · Lliurament i Devolució',
    category: 'COMUNITARI_TERCER_SECTOR',
    categoryLabel: 'Àmbit Comunitari & Voluntariat (Entitats & Creu Roja)',
    categoryIcon: '🤝',
    description: 'Manual d\'operativa comunitària mitjançant EntityTaskWorkspace. Selector àgil de mode Lliurament / Recepció, cerca per expedient o DNI, checklist de verificació de neteja i funcionalitat mecànica, custòdia i devolució de la fiança solidària de 50 €, confirmació digital de tràmit i emissió de justificant oficial de devolució.',
    icon: '👥',
    pdfPath: '/manuales/Manual_Voluntariat_Entitats_Veinals.html',
    htmlPath: '/manuales/Manual_Voluntariat_Entitats_Veinals.html',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN_ENTITAT', 'BARRI', 'VOLUNTARI', 'CAP_REFERENT'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Entitats',
  },

  // 5. TALLER ORTOPROTÈSIC · ORDRES DE TREBALL, CALIBRATGE I REPARACIÓ
  {
    id: 'man-tall-01',
    title: 'Manual de Taller Ortoprotèsic · Ordres de Treball i Calibratge Mecànic',
    category: 'TALLER_ORTOPEDIC',
    categoryLabel: 'Taller Ortopèdic & Manteniment Especialitzat',
    categoryIcon: '🛠️',
    description: 'Gestió operativa del taller tècnic amb WorkshopTaskWorkspace. Monitoratge directe de les ordres de treball actives (OTs), protocol d\'higienització homologada, adaptacions biomecàniques, registre de notes d\'intervenció tècnica i transició d\'estat immediata a "Calibrat / Disponible per a préstec" per a la seva redistribució a la xarxa d\'entitats.',
    icon: '🔧',
    pdfPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    htmlPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN_TECNIC', 'TECNIC'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Taller Orto',
  },

  // 6. PORTAL DEL CIUTADÀ · ACCÉS MÒBIL I GESTIÓ DEL PRÉSTEC SOLIDARI
  {
    id: 'man-ciut-01',
    title: 'Manual del Ciutadà · Accés Mòbil i Gestió del Préstec Solidari',
    category: 'CIUTADANIA_PORTAL',
    categoryLabel: 'Portal Ciutadà & Pacients',
    categoryIcon: '📱',
    description: 'Guia d\'accés mòbil i tauleta per al ciutadà. Identificació per DNI i contrasenya temporal d\'activació (1234), canvi obligatori de seguretat, targeta única neta del material en préstec amb comptador de dies restants, sol·licitud telemàtica de la 1a pròrroga de 30 dies, targeta de contacte directe exclusiu amb l\'entitat custodiadora activa i circuit de derivació a PAO en cas de límit temporal.',
    icon: '♿',
    pdfPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    htmlPath: '/manuales/Manual_Administratiu_Sanitari_UAC.html',
    allowedRoles: ['SUPER_ADMIN', 'CAP_ADMIN', 'ADMIN_ENTITAT', 'CIUTADA'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Ciutadania',
  },

  // 7. SERVEIS INFORMÀTICS · PWA, MULTIPLATAFORMA I CONTINGÈNCIA USB OFFLINE
  {
    id: 'man-pwa-01',
    title: 'Manual Tècnic d\'Instal·lació PWA, Multiplataforma i Contingència USB Offline',
    category: 'SERVEIS_INFORMATICS_TI',
    categoryLabel: 'Serveis Informàtics & Enginyeria TI (BancActiu Pilot)',
    categoryIcon: '💻',
    description: 'Arquitectura d\'arrencada universal responsive amb Splash Screen corporativa respirant, instal·lació d\'aplicació nativa PWA amb un sol clic a iOS i Android sense llicències de botiga, persistència de sessió en sessionStorage blindada davant F5 i pull-to-refresh mòbil, i desplegament d\'emergència 100% autònom offline en memòria USB mitjançant INICIAR_BANCACTIU_USB.html per a centres educatius i zones sense cobertura.',
    icon: '📲',
    pdfPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    htmlPath: '/manuales/Manual_Enginyeria_Sistemes_TI.html',
    sourcePath: '/manuales/MANUAL_TECNIC_ENGINYERIA_TI_BANCACTIU.md',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN_TECNIC', 'TECNIC'],
    mode: 'EDITABLE_SOURCE',
    lastUpdated: '08/11/2026',
    version: '4.0 PWA & USB',
  },

  // 8. CUSTÒDIA DE MATERIAL, DESINFECCIÓ HOMOLOGADA I TRAÇABILITAT
  {
    id: 'man-ent-02',
    title: 'Guia de Custòdia de Material, Desinfecció Homologada i Traçabilitat',
    category: 'COMUNITARI_TERCER_SECTOR',
    categoryLabel: 'Àmbit Comunitari & Voluntariat (Entitats & Creu Roja)',
    categoryIcon: '🤝',
    description: 'Protocol homologat de neteja, desinfecció amb solucions neutres per a la protecció d\'aliatges metàl·lics i tapisseria sanitària, comprovació de seguretat funcional abans de la reassignació i traçabilitat completa per expedient comunitari blindant la cadena de custòdia segons normatives sanitàries vigents.',
    icon: '🔒',
    pdfPath: '/manuales/Manual_Voluntariat_Entitats_Veinals.html',
    htmlPath: '/manuales/Manual_Voluntariat_Entitats_Veinals.html',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN_ENTITAT', 'BARRI', 'VOLUNTARI'],
    mode: 'PDF_READONLY',
    lastUpdated: '08/11/2026',
    version: '4.0 Custòdia & Neteja',
  },
];
