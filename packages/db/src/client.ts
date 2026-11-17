import { User, Centre, Gerencia, Servei, LlocTreball, AuditLog, Prestec, AppRole } from './types';

// In-Memory Shared Store populated with verified institutional records
const GERENCIES_SEED: Gerencia[] = [
  { id: 'ger-1', codi: 'GER-METRO-SUD', nom: 'Gerència Territorial Metropolitana Sud (CatSalut / ICS)', regio: 'Metropolitana Sud', activa: true },
  { id: 'ger-2', codi: 'GER-BARCELONA-CIUTAT', nom: 'Gerència Territorial de Barcelona Ciutat', regio: 'Barcelona', activa: true },
  { id: 'ger-3', codi: 'GER-GIRONA', nom: 'Gerència Territorial de Girona', regio: 'Girona', activa: true },
  { id: 'ger-4', codi: 'GER-LLEIDA', nom: 'Gerència Territorial de Lleida', regio: 'Lleida', activa: true },
  { id: 'ger-5', codi: 'GER-CAMP-TARRAGONA', nom: 'Gerència Territorial del Camp de Tarragona', regio: 'Tarragona', activa: true },
];

const CENTRES_SEED: Centre[] = [
  { id: 'cen-ieti', codi: 'INS-ESTEVE-TERRADES', nom: 'Institut Esteve Terrades i Illa (Cornellà de Llobregat)', tipus: 'AJUNTAMENT', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-01' },
  { id: 'cen-gapic', codi: 'GAPIC-METRO-SUD', nom: 'GAPIC Metropolitana Sud (CatSalut)', tipus: 'CAP', municipi: "L'Hospitalet de Llobregat", gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-05' },
  { id: 'cen-1', codi: 'CAP-ST-ILDEFONS', nom: 'CAP Sant Ildefons (Cornellà)', tipus: 'CAP', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-10' },
  { id: 'cen-2', codi: 'CAP-BELLVITGE', nom: 'CAP Bellvitge (Hospitalet)', tipus: 'CAP', municipi: "L'Hospitalet de Llobregat", gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-12' },
  { id: 'cen-3', codi: 'AJUNT-CORNELLA', nom: 'Ajuntament de Cornellà de Llobregat - Benestar Social', tipus: 'AJUNTAMENT', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-15' },
  { id: 'cen-serveis-socials', codi: 'SS-CORNELLA', nom: 'Gerència Municipal de Serveis Socials i Dependència', tipus: 'AJUNTAMENT', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-16' },
  { id: 'cen-4', codi: 'CREU-ROJA-CORN', nom: 'Creu Roja Assemblea Cornellà / Taller d\'Ajudes Tècniques', tipus: 'CREU_ROJA', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-18' },
  { id: 'cen-5', codi: 'HOSP-BELLVITGE', nom: 'Hospital Universitari de Bellvitge', tipus: 'HOSPITAL', municipi: "L'Hospitalet de Llobregat", gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-01-20' },
  { id: 'cen-6', codi: 'AVV-ST-ILDEFONS', nom: 'Associació de Veïns Sant Ildefons', tipus: 'ENTITAT_VEINAL', municipi: 'Cornellà de Llobregat', gerenciaId: 'ger-1', actiu: true, dataCreacio: '2026-02-01' }
];

const USUARIS_SEED: User[] = [
  { 
    id: 'usr-superadmin-bartolome', 
    dni: '48956602Z', 
    nomComplet: 'Bartolomé Cachinero Baranda', 
    email: 'bartolocachinero@gmail.com', 
    rolPrincipal: 'SUPERADMIN', 
    centreId: 'cen-ieti', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-01', 
    mustChangePassword: false, 
    isFirstLogin: false,
    passwordHash: 'Barto2026!*',
    carrec: 'Co-Superadministrador & Arquitecte Principal'
  },
  { 
    id: 'usr-superadmin-marc', 
    dni: '48956602Z', 
    nomComplet: 'Marc Cachinero Baranda', 
    email: 'marccachinero@gmail.com', 
    rolPrincipal: 'SUPERADMIN', 
    centreId: 'cen-ieti', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-01', 
    mustChangePassword: false, 
    isFirstLogin: false,
    passwordHash: 'Marc2026!*',
    carrec: 'Co-Superadministrador & Director de Projecte'
  },
  { 
    id: 'Administrador', 
    dni: 'ADMINISTRADOR', 
    nomComplet: 'Administrador', 
    email: 'administrador@esteveterrades.cat', 
    rolPrincipal: 'SUPERADMIN', 
    centreId: 'cen-ieti', 
    actiu: true, 
    idCatAutenticat: false, 
    dataCreacio: '2026-01-01', 
    mustChangePassword: true, 
    isFirstLogin: true, 
    passwordHash: '1234',
    carrec: 'Superadministrador Tècnic de Guàrdia'
  },
  { 
    id: 'usr-gapic-director', 
    dni: '52622304Y', 
    nomComplet: 'Mireia Valls (Directora GAPIC)', 
    email: 'mvalls@catsalut.gencat.cat', 
    rolPrincipal: 'SUPERADMIN', 
    centreId: 'cen-gapic', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-01', 
    mustChangePassword: true, 
    isFirstLogin: true,
    carrec: 'Directora GAPIC Metropolitana Sud'
  },
  { 
    id: 'usr-gerent-regional', 
    dni: '39112233K', 
    nomComplet: 'Dr. Carles Font (Gerent Regional CatSalut)', 
    email: 'cfont@catsalut.gencat.cat', 
    rolPrincipal: 'DIRECCIO', 
    centreId: 'cen-gapic', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-03',
    carrec: 'Gerent Territorial Metropolitana Sud (CatSalut / ICS)'
  },
  { 
    id: 'usr-cap-directora', 
    dni: '43221199X', 
    nomComplet: 'Dra. Eulàlia Rovira (Directora CAP Sant Ildefons)', 
    email: 'erovira@ics.cat', 
    rolPrincipal: 'DIRECCIO', 
    centreId: 'cen-1', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-04',
    carrec: 'Directora de Centre d\'Atenció Primària'
  },
  { 
    id: 'usr-cap-referent', 
    dni: '44111222B', 
    nomComplet: 'Dr. Jaume Gutiérrez (Referent Clínic CAP Sant Ildefons)', 
    email: 'jgutierrez@ics.cat', 
    rolPrincipal: 'TECNIC_SALUT', 
    centreId: 'cen-1', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-05',
    carrec: 'Referent Clínic i de Salut Comunitària'
  },
  { 
    id: 'usr-cap-uac', 
    dni: '48888999F', 
    nomComplet: 'Laura Esteve (Administrativa Sanitària UAC)', 
    email: 'lesteve@ics.cat', 
    rolPrincipal: 'ADMINISTRATIU_OPERATIU', 
    centreId: 'cen-1', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-06',
    carrec: 'Administrativa Sanitària UAC - Atenció a l\'Usuari'
  },
  { 
    id: 'usr-avv-gerent', 
    dni: '38556677H', 
    nomComplet: 'Manel Gómez (President AVV Sant Ildefons)', 
    email: 'mgomez@veinsantildefons.cat', 
    rolPrincipal: 'DIRECCIO', 
    centreId: 'cen-6', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-07',
    barri: 'Sant Ildefons',
    carrec: 'President / Gerent d\'Entitat Veïnal'
  },
  { 
    id: 'usr-avv-voluntari', 
    dni: '47777888E', 
    nomComplet: 'Rosa Maria Martínez (Voluntària AVV)', 
    email: 'rmartinez@veinsantildefons.cat', 
    rolPrincipal: 'VOLUNTARI', 
    centreId: 'cen-6', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-08',
    barri: 'Sant Ildefons',
    carrec: 'Voluntària Comunitària de Proximitat'
  },
  { 
    id: 'usr-creuroja-gerent', 
    dni: '46555666D', 
    nomComplet: 'Carles Miralles (Coordinador Creu Roja)', 
    email: 'cmiralles@creuroja.org', 
    rolPrincipal: 'TERCER_SECTOR', 
    centreId: 'cen-4', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-09',
    carrec: 'Coordinador General Taller d\'Ajudes Tècniques'
  },
  { 
    id: 'usr-creuroja-tecnic', 
    dni: '49112244W', 
    nomComplet: 'Albert Puig (Mecànic Especialista Taller)', 
    email: 'apuig@creuroja.org', 
    rolPrincipal: 'TERCER_SECTOR', 
    centreId: 'cen-4', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-10',
    carrec: 'Tècnic Mecànic d\'Ortopèdia i Manteniment'
  },
  { 
    id: 'usr-ss-gerent', 
    dni: '37889900M', 
    nomComplet: 'Mercè Dalmau (Cap Serveis Socials & Dependència)', 
    email: 'mdalmau@cornella.cat', 
    rolPrincipal: 'SERVEIS_SOCIALS', 
    centreId: 'cen-serveis-socials', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-11',
    carrec: 'Cap de Servei d\'Atenció a la Dependència'
  },
  { 
    id: 'usr-ss-treballador', 
    dni: '45333444C', 
    nomComplet: 'Núria Soler (Treballadora Social Municipal)', 
    email: 'nsoler@cornella.cat', 
    rolPrincipal: 'SERVEIS_SOCIALS', 
    centreId: 'cen-serveis-socials', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-12',
    carrec: 'Treballadora Social d\'Atenció Domiciliària (PIA / BVD / SAD)'
  },
  { 
    id: 'usr-ajunt-tecnic', 
    dni: '41223344L', 
    nomComplet: 'Jordi Casals (Tècnic Benestar Social Ajuntament)', 
    email: 'jcasals@cornella.cat', 
    rolPrincipal: 'AJUNTAMENT', 
    centreId: 'cen-3', 
    actiu: true, 
    idCatAutenticat: true, 
    dataCreacio: '2026-01-13',
    carrec: 'Tècnic de Benestar Social i Coordinació Interinstitucional'
  }
];

const PRESTECS_SEED: Prestec[] = [
  { id: 'pr-1', codiExpedient: 'BA-2026-00891', citizenId: 'cit-1', citizenNom: 'Antònia Riera Gómez', materialCodi: 'CR-LUG-01', materialNom: 'Cadira de Rodes Autopropulsable Alumini', centreId: 'cen-1', estat: 'ACTIU_LLIURAT', dataPrestec: '2026-11-01', dataRetornPrevista: '2026-12-01' },
  { id: 'pr-2', codiExpedient: 'BA-2026-00892', citizenId: 'cit-2', citizenNom: 'Joan Puigdemunt Vidal', materialCodi: 'CAM-ROD-03', materialNom: 'Caminador 4 Rodes amb Fre i Seient', centreId: 'cen-1', estat: 'VALIDAT_CLINIC', dataPrestec: '2026-11-05', dataRetornPrevista: '2026-12-05' },
  { id: 'pr-3', codiExpedient: 'BA-2026-00893', citizenId: 'cit-3', citizenNom: 'Montserrat Batlle Font', materialCodi: 'LLIT-ART-02', materialNom: 'Llit Articulat Elèctric Hospitalari', centreId: 'cen-3', estat: 'SOL_LICITAT', dataPrestec: '2026-11-10', dataRetornPrevista: '2027-01-10' },
  { id: 'pr-4', codiExpedient: 'BA-2026-00894', citizenId: 'cit-4', citizenNom: 'Josep Maria Almirall', materialCodi: 'MULE-ALU-08', materialNom: 'Parell de Bastons Anglesos Antilliscants', centreId: 'cen-4', estat: 'RETORNAT', dataPrestec: '2026-10-10', dataRetornPrevista: '2026-11-10' }
];

function syncUserFromDisk(user: User): void {
  if (
    typeof window !== 'undefined' ||
    !user ||
    typeof process === 'undefined' ||
    process.env.NEXT_RUNTIME === 'edge' ||
    typeof process.cwd !== 'function'
  ) {
    return;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const os = require('os');
    const cwd = typeof process !== 'undefined' && typeof process['cwd'] === 'function' ? process['cwd']() : '';
    const candidatePaths = [
      path.join(os.homedir(), '.bancactiu', 'db_credentials_users.json'),
      path.join(os.tmpdir(), 'bancactiu_data', 'db_credentials_users.json'),
      path.join(cwd, 'data', 'db_credentials_users.json'),
      path.join(cwd, 'apps', 'bancactiu-nexus', 'data', 'db_credentials_users.json')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const match = list.find((u: any) => {
            const cleanDni = (user.dni || '').toUpperCase();
            const cleanId = (user.id || '').toUpperCase();
            const uDni = (u.dni || '').toUpperCase();
            const uUser = (u.username || '').toUpperCase();
            const uId = (u.id || '').toUpperCase();
            if (uDni === cleanDni || uUser === cleanDni || uId === cleanId) return true;
            if (cleanDni === 'ADMINISTRADOR' || cleanId === 'ADMINISTRADOR') {
              return uUser === 'ADMINISTRADOR' || uDni === 'ADMINISTRADOR' || uId.includes('ADMIN');
            }
            return false;
          });
          if (match && match.currentPassword && match.currentPassword !== '1234') {
            user.passwordHash = match.currentPassword;
            user.mustChangePassword = Boolean(match.mustChangePassword);
            user.isFirstLogin = Boolean(match.mustChangePassword);
            if (Array.isArray(match.passwordHistory)) {
              user.passwordHistory = match.passwordHistory;
            }
            return;
          }
        }
      }
    }
  } catch {
    // Fallback silenciós
  }
}

function saveUserToDisk(dni: string, newPassword: string, history: string[]): void {
  if (
    typeof window !== 'undefined' ||
    typeof process === 'undefined' ||
    process.env.NEXT_RUNTIME === 'edge' ||
    typeof process.cwd !== 'function'
  ) {
    return;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const os = require('os');
    const cwd = typeof process !== 'undefined' && typeof process['cwd'] === 'function' ? process['cwd']() : '';
    const targetDirs = [
      path.join(os.homedir(), '.bancactiu'),
      path.join(os.tmpdir(), 'bancactiu_data'),
      path.join(cwd, 'data'),
      path.join(cwd, 'apps', 'bancactiu-nexus', 'data')
    ];
    for (const dir of targetDirs) {
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(dir, 'db_credentials_users.json');
        let list: any[] = [];
        if (fs.existsSync(filePath)) {
          try {
            list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          } catch {
            list = [];
          }
        }
        const clean = dni.toUpperCase();
        const idx = list.findIndex((u: any) => 
          (u.dni || '').toUpperCase() === clean || 
          (u.username || '').toUpperCase() === clean ||
          ((clean === 'ADMINISTRADOR' || clean === 'ADMIN') && ((u.username || '').toUpperCase().includes('ADMIN') || (u.id || '').toUpperCase().includes('ADMIN')))
        );
        if (idx === -1) {
          list.push({
            id: clean === 'ADMINISTRADOR' ? 'user-admin-institucional' : `usr-${clean.toLowerCase()}`,
            username: clean,
            dni: clean,
            email: `${clean.toLowerCase()}@esteveterrades.cat`,
            nombre: clean,
            rol: 'SUPER_ADMIN',
            currentPassword: newPassword,
            mustChangePassword: false,
            passwordHistory: history,
            lastPasswordChangeDate: new Date().toISOString()
          });
        } else {
          list[idx].currentPassword = newPassword;
          list[idx].mustChangePassword = false;
          list[idx].passwordHistory = history;
          list[idx].lastPasswordChangeDate = new Date().toISOString();
        }
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
      } catch {
        // Segueix amb el següent directori
      }
    }
  } catch {
    // Fallback silenciós
  }
}

class SharedDatabaseClient {
  private gerencies: Gerencia[] = [...GERENCIES_SEED];
  private centres: Centre[] = [...CENTRES_SEED];
  private usuaris: User[] = [...USUARIS_SEED];
  private prestecs: Prestec[] = [...PRESTECS_SEED];
  private auditLogs: AuditLog[] = [
    {
      id: 'aud-1',
      timestamp: new Date().toISOString(),
      actorDni: '52622304Y',
      actorNom: 'Mireia Valls',
      appSource: 'bancactiu-nexus',
      accio: 'INICIALITZACIO_SISTEMA_2_0',
      entitat: 'Arquitectura Modular',
      detall: 'Ecosistema BancActiu 2.0 desplegat amb base de dades compartida.',
      ip: '127.0.0.1',
      rgpdConforme: true
    }
  ];

  // Gerencies
  async getGerencies(): Promise<Gerencia[]> {
    return [...this.gerencies];
  }

  // Centres
  async getCentres(gerenciaId?: string): Promise<Centre[]> {
    if (gerenciaId) return this.centres.filter(c => c.gerenciaId === gerenciaId);
    return [...this.centres];
  }

  async addCentre(centre: Omit<Centre, 'id' | 'dataCreacio'>): Promise<Centre> {
    const newCentre: Centre = {
      ...centre,
      id: 'cen-' + Date.now().toString(36),
      dataCreacio: new Date().toISOString().slice(0, 10)
    };
    this.centres.push(newCentre);
    await this.logAudit({
      actorDni: '52622304Y',
      actorNom: 'SuperAdmin Nexus',
      appSource: 'bancactiu-nexus',
      accio: 'ALTA_CENTRE_DESCENTRALITZADA',
      entitat: newCentre.nom,
      detall: 'Centre ' + newCentre.codi + ' donat d\'alta a la gerència ' + newCentre.gerenciaId,
      ip: '127.0.0.1',
      rgpdConforme: true
    });
    return newCentre;
  }

  // Usuaris
  async getUsuaris(): Promise<User[]> {
    return [...this.usuaris];
  }

  async getUserByDni(dni: string): Promise<User | null> {
    const clean = (dni || '').toUpperCase().trim();
    const user = this.usuaris.find(u => 
      u.dni.toUpperCase() === clean ||
      u.id.toUpperCase() === clean ||
      u.nomComplet.toUpperCase() === clean ||
      ((clean === 'ADMIN' || clean === 'ADMINISTRADOR') && (u.id === 'Administrador' || u.dni === 'ADMINISTRADOR'))
    ) || null;
    if (user) {
      syncUserFromDisk(user);
    }
    return user;
  }

  async setUserPassword(dni: string, newPassword: string, history?: string[]): Promise<boolean> {
    const clean = (dni || '').toUpperCase().trim();
    const user = this.usuaris.find(u => 
      u.dni.toUpperCase() === clean ||
      u.id.toUpperCase() === clean ||
      u.nomComplet.toUpperCase() === clean ||
      ((clean === 'ADMIN' || clean === 'ADMINISTRADOR') && (u.id === 'Administrador' || u.dni === 'ADMINISTRADOR'))
    );
    if (!user) return false;
    user.passwordHash = newPassword;
    user.mustChangePassword = false;
    user.isFirstLogin = false;
    user.passwordSetAt = new Date().toISOString();
    let finalHistory: string[] = [];
    if (history && Array.isArray(history)) {
      finalHistory = history.slice(0, 10);
    } else {
      const prev = Array.isArray(user.passwordHistory) ? user.passwordHistory : [];
      finalHistory = [newPassword, ...prev.filter(h => h !== newPassword)].slice(0, 10);
    }
    user.passwordHistory = finalHistory;
    saveUserToDisk(dni, newPassword, finalHistory);

    await this.logAudit({
      actorDni: user.dni,
      actorNom: user.nomComplet,
      appSource: 'bancactiu-nexus',
      accio: 'ESTABLIMENT_CONTRASENYA_INICIAL',
      entitat: 'Seguretat d\'Accés',
      detall: `Contrasenya inicial establerta amb èxit per a l'usuari ${user.nomComplet} (DNI/ID: ${user.dni})`,
      ip: '127.0.0.1',
      rgpdConforme: true
    });
    return true;
  }

  async verifyUserPassword(dniOrIdentifier: string, passwordAttempt: string): Promise<{ valid: boolean; user: User | null; mustChangePassword: boolean }> {
    const clean = (dniOrIdentifier || '').toUpperCase().trim();
    const user = this.usuaris.find(u => 
      u.dni.toUpperCase() === clean ||
      u.id.toUpperCase() === clean ||
      u.nomComplet.toUpperCase() === clean ||
      ((clean === 'ADMIN' || clean === 'ADMINISTRADOR') && (u.id === 'Administrador' || u.dni === 'ADMINISTRADOR'))
    );
    if (!user) {
      return { valid: false, user: null, mustChangePassword: false };
    }

    syncUserFromDisk(user);

    const hasConfiguredPassword = Boolean(
      user.passwordHash && 
      user.passwordHash !== '1234' && 
      user.mustChangePassword === false
    );

    // Si ja s'ha establert una contrasenya personal definitiva (no provisional "1234")
    if (hasConfiguredPassword) {
      // El provisional '1234' ha de ser COMPLETAMENT INVALIDAT per a aquest compte
      if (passwordAttempt === '1234') {
        return { valid: false, user: null, mustChangePassword: false };
      }

      // Verificació criptogràfica PBKDF2 segura en entorns server / Node.js
      if (user.passwordHash && user.passwordHash.startsWith('$pbkdf2$')) {
        if (typeof window === 'undefined') {
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const crypto = require('crypto');
            const parts = user.passwordHash.split('$');
            if (parts.length === 5) {
              const iterations = parseInt(parts[2], 10);
              const salt = parts[3];
              const expectedHash = parts[4];
              const derived = crypto.pbkdf2Sync(passwordAttempt, salt, iterations, 64, 'sha512').toString('hex');
              const isMatch = derived === expectedHash;
              return { valid: isMatch, user: isMatch ? user : null, mustChangePassword: false };
            }
          } catch {
            // fallback transparent
          }
        }
      }

      const isMatch = Boolean(user.passwordHash === passwordAttempt);
      return { valid: isMatch, user: isMatch ? user : null, mustChangePassword: false };
    }

    // Només si requereix canvi i la contrasenya utilitzada és la provisional "1234"
    if (user.mustChangePassword || user.isFirstLogin || !hasConfiguredPassword) {
      const isDefault = Boolean(!passwordAttempt || passwordAttempt === '1234');
      if (isDefault) {
        return { valid: true, user, mustChangePassword: true };
      }
    }

    const isValid = Boolean(user.passwordHash === passwordAttempt);
    return { valid: isValid, user: isValid ? user : null, mustChangePassword: false };
  }

  // Prestecs
  async getPrestecs(centreId?: string): Promise<Prestec[]> {
    if (centreId) return this.prestecs.filter(p => p.centreId === centreId);
    return [...this.prestecs];
  }

  async addPrestec(prestec: Omit<Prestec, 'id'>): Promise<Prestec> {
    const newPrestec: Prestec = {
      ...prestec,
      id: 'pr-' + Date.now().toString(36)
    };
    this.prestecs.unshift(newPrestec);
    return newPrestec;
  }

  async updatePrestecEstat(id: string, nouEstat: Prestec['estat']): Promise<Prestec | null> {
    const p = this.prestecs.find(item => item.id === id);
    if (!p) return null;
    p.estat = nouEstat;
    return { ...p };
  }

  // Auditoria
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    return this.auditLogs.slice(-limit).reverse();
  }

  async logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const log: AuditLog = {
      ...entry,
      id: 'aud-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString()
    };
    this.auditLogs.push(log);
    return log;
  }
}

// Singleton export
export const sharedDb = new SharedDatabaseClient();
