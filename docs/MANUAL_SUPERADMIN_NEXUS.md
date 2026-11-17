# Manual d'Operació del Superadministrador - BancActiu Nexus 3.0

> **Guia Oficial de Gestió, Governança, Navegació Adaptativa i Administració de la Plataforma**  
> BancActiu 3.0 Enterprise &middot; Arquitectura Multi-Tenant Contextual &middot; Versió 3.0 Production

---

## 1. Credencials i Identitat Acreditada

El rol de Superadministrador (`SUPERADMIN`) és el màxim nivell de privilegi del sistema (**Nivell 5: Control Total Catalunya & IETI**). Tota la governança, seguretat i polítiques d'interoperabilitat estan centralitzades sota aquesta identitat.

* **Superadministradors Oficials i Arquitectes Principals**:
  * **Bartolomé Cachinero Baranda**: Co-Superadministrador & Arquitecte Principal (DNI Únic: `48956602Z`, Email: `bartolocachinero@gmail.com`)
  * **Marc Cachinero Baranda**: Co-Superadministrador & Director de Projecte (DNI Únic: `48956602Z`, Email: `marccachinero@gmail.com`)
  * **Centre Acreditat**: Institut Esteve Terrades i Illa (Cornellà de Llobregat) / Consorci Sanitari Metropolità Sud
* **Usuari Professor / Coordinador**: `Administrador`
  * **ID d'accés**: `Administrador` / `ADMIN`
  * **Clau inicial per defecte**: `1234` (Requeriment obligatori `must_change_password = true`)
  * **Àmbit**: Supervisió pedagògica, pentesting i ciberseguretat aplicada.
* **Entorn de Governança**: `bancactiu-nexus` (Port `3000` en desenvolupament local o domini oficial a Vercel Cloud).

---

## 2. Protocol d'Accés Segur (Zero-Trust)

BancActiu 3.0 no permet accessos anònims ni credencials compartides. L'accés està regit per l'arquitectura Zero-Trust auditada sota l'Esquema Nacional de Seguretat (ENS Nivell Alt).

### 2.1. Formulari Net d'Inici de Sessió ("Clean Login")
A la ruta `/login`:
1. Tots els camps d'identificació i contrasenya es presenten completament buits (`value=""`, `autoComplete="off"`), sense valors per defecte ni autofill per prevenir atacs d'infiltració.
2. Introduïu el vostre DNI: `48956602Z` (Marc Cachinero Baranda) o `Administrador`.
3. Introduïu la vostra clau d'accés.

### 2.2. Flux de Primer Accés i Canvi Obligatori de Contrasenya
En cas que s'accedeixi com a usuari docent `Administrador` amb clau inicial `1234`, o un compte nou:
1. El sistema commuta automàticament a la pantalla de **Configuració Inicial de Clau**.
2. Definiu una nova contrasenya que compleixi els criteris ENS Nivell Alt:
   * Longitud mínima de 8 caràcters.
   * Almenys una lletra majúscula i una minúscula.
   * Almenys un dígit numèric (0-9).
   * Almenys un símbol o caràcter especial (`!@#$%^&*`).
3. Confirmeu la nova clau i premeu **Confirmar i Accedir a Nexus**.
4. La contrasenya queda persistida a `@bancactiu/db` xifrada amb hash criptogràfic, s'anul·la la marca `mustChangePassword = false` i es genera la cookie de sessió segura `bancactiu_session`.

### 2.3. Avís Ineludible de Drets de Propietat Intel·lectual
En el primer inici de sessió de qualsevol usuari (Superadmin, Administrador o facultatiu), s'activa un **modal obligatori i ineludible de Drets de Propietat Intel·lectual**:
1. No es pot descartar amb teclat ESC ni clicant fora de la finestra.
2. L'usuari ha de declarar formalment haver llegit i acceptar les condicions legals (RDL 1/1996, secret professional RGPD Art. 9 i prohibició de descompilació o ús comercial).
3. L'acceptació queda registrada a `localStorage` i vinculada a l'adreça IP d'accés en pistes d'auditoria Zero-Trust.

### 2.3. Accés mitjançant Certificat Digital (idCAT / T-CAT)
1. Al formulari de login, seleccioneu la pestanya **idCAT / T-CAT**.
2. El sistema valida la infraestructura de clau pública de l'Agència Catalana de Certificació (EC-ACC) vinculada al DNI `52622304Y`.
3. Premeu **Validar Certificat Digital (52622304Y)** per a l'accés biomètric/criptogràfic directe.

---

## 3. Gestió Dual de Xarxa i Navegació Adaptativa (Local vs Vercel Cloud)

La plataforma incorpora un motor de resolució dinàmica d'adreces (`resolveAppTargetUrl`) que commuta automàticament segons l'entorn de treball:

### 3.1. Entorn de Desenvolupament Local (`localhost`)
Quan s'executa a l'equip local del desenvolupador:
* **Nexus (SuperAdmin)**: `http://localhost:3000`
* **Salut (CatSalut / ICS)**: `http://localhost:3001`
* **Municipal (Cornellà)**: `http://localhost:3002`
* **Social (Creu Roja)**: `http://localhost:3003`
* **Operatiu (UAC / Magatzem)**: `http://localhost:3004`
* El Launcher identifica automàticament `localhost` o `127.0.0.1` i enllaça directament als ports respectius.

### 3.2. Entorn de Producció al Núvol (Vercel Cloud)
Quan s'executa a la xarxa pública (`https://banc-actiu-2-0-separacion-entidades.vercel.app`):
* Els enllaços utilitzen rutes relatives unificades o dominis gestionats per variables d'entorn, **evitant qualsevol intent d'accedir a localhost**:
  * **Nexus**: `/`
  * **Salut**: `/salut` (o `NEXT_PUBLIC_SALUT_URL`)
  * **Municipal**: `/municipal` (o `NEXT_PUBLIC_MUNICIPAL_URL`)
  * **Social**: `/social` (o `NEXT_PUBLIC_SOCIAL_URL`)
  * **Operatiu**: `/operatiu` (o `NEXT_PUBLIC_OPERATIU_URL`)
* Totes les rutes de producció estan blindades pel mateix `middleware.ts` perimetral amb comprovació estricta de la sessió del Superadministrador.

---

## 4. Barra d'Administració Superior Exclusiva (DNI 52622304Y)

Amb la release 2.0 de BancActiu s'integra a la part superior de la consola de governança Nexus una **Barra de Control Exclusiva**, visible únicament quan l'usuari autenticat disposa del **DNI 52622304Y** (Mireia Valls · Nivell 5 Catalunya).

### 4.1. Característiques de Disseny i Usabilitat
* **Estil Glassmorphism d'Alta Gamma**: Capa translúcida amb desenfocament profund (`backdrop-blur-2xl bg-slate-950/85`), vora amb degradat porpra (`border-purple-500/30`) i acompanyament d'ombra flotant.
* **Fixació Pinned / Sticky (`sticky top-0 z-50`)**: Roman accessible permanentment al capdamunt mentre es navega pel tauler, sense tapar cap element inferior.
* **Scroll Fluid i Confort Visual**: Configuració de contenidor `overflow-x-hidden overflow-y-auto min-h-screen`, suprimint qualsevol confinament de pantalla ("zero scroll") i assegurant que totes les targetes, mètriques i panells es puguin consultar amb comoditat total.

### 4.2. Botons d'Accés Ràpid Directe
1. **Gestió d'Usuaris i Rols (`roles-services`)**:
   * Obertura immediata de l'espai d'administració de perfils per assignar rols a administratius, facultatius sanitaris i entitats veïnals o del tercer sector.
2. **Auditoria Zero-Trust (`security-lab`)**:
   * Accés directe al banc de proves d'estrès, monitoratge de xarxa perimetral i estat del compliment ENS Nivell Alt.
3. **Gestió de Xarxa i Préstecs (Enllaç Social & Operatiu)**:
   * **Xarxa Social**: Salt immediat al mòdul Social (`/social` o port `3003` en local) per gestionar la xarxa ciutadana i el Banc del Temps.
   * **Gestió de Préstecs**: Salt directe al mòdul Operatiu (`/operatiu` o port `3004` en local) per a la traçabilitat de material ortoprotèsic i gestió logística de magatzem.
4. **Accés Directe a Manuals & PDFs (`/docs`)**:
   * Botó per descarregar en un sol clic els expedients oficials en PDF vectorial A4.

---

## 5. Espais de Treball del Superadministrador

Des del tauler de control principal de Nexus es pot operar sobre 5 espais clau:

### 5.1. Alta Descentralitzada de Centres (`centres-onboarding`)
* Alta i configuració de CAPs, hospitals d'aguts, àrees bàsiques de salut (ABS) i dependències municipals vinculades a les 5 gerències territorials de Catalunya (Metropolitana Sud, Barcelona Ciutat, Girona, Lleida i Camp de Tarragona).

### 5.2. Rols, Serveis i Llocs de Treball (`roles-services`)
* Administració de l'arbre de permisos RBAC per a facultatius mèdics, treballadors socials, operaris de magatzem i voluntaris comunitaris.

### 5.3. Stress & Security Lab (`security-lab`)
* Banc de proves de simulació de concurrència massiva (fins a 250.000 operacions simultànies projectades a 1-3 anys a Catalunya) i escàner de vulnerabilitats en temps real (Score 99.4% d'eficiència).

### 5.4. Consola de l'Enginyer Agent IA de Codi (`ai-agent`)
* Entorn interactiu per a la generació i adaptació de components i rutes mitjançant instruccions en llenguatge natural, amb validació de diffs abans d'aplicar canvis.

### 5.5. Pasarel·les AOC & Interoperabilitat (`interoperability`)
* Configuració de canals mTLS, validació de certificats digitals i connexió als registres del Padró Municipal i Dependència de la Generalitat de Catalunya.

---

## 6. Gateway Launcher (Navegador de Micro-Aplicacions)

El commutador flotant i accessible a la capçalera permet saltar de forma immediata entre les 5 micro-aplicacions del monorepo, adaptant-se a l'entorn de producció o desenvolupament i oferint simulació de rols per auditar accessos.

---

## 7. Assistent Intel·ligent Flotant (Kenzo / Kenza / Kenz Core)

Nexus incorpora a la cantonada inferior dreta l'assistent d'intel·ligència artificial per a tasques d'auditoria, consulta i presentació executiva:
* **Selector d'Aparència Interactiu**:
  * **Kenzo**: Perfil masculí / executiu amb estètica blau/índigo/cian.
  * **Kenza**: Perfil femení / executiva amb estètica rosa/porpra/ambre.
  * **Kenz Core**: Perfil neutre / hologràfic tecnològic amb estètica maragda/teal/cian.
* **Persistència en Navegador**: El perfil escollit es desa a `localStorage` sota la clau `bancactiu_kenzo_appearance` vinculada a la sessió del Superadministrador (DNI `52622304Y`).
* **Mode Presentació de Diapositives (Slides Mode)**: Carrusel d'alta definició per projectar el resum executiu, auditories ENS i mètriques en reunions institucionals.

---

## 8. Protocol de Tancament de Sessió Segur

Per garantir la inviolabilitat del perímetre en finalitzar la jornada:
1. Feu clic al botó **Tancar Sessió** (`LogOut`) situat a la capçalera superior dreta.
2. La cookie `bancactiu_session` serà invalidada immediatament al navegador i al servidor.
3. El sistema redirigirà a `/login`, impedint qualsevol accés mitjançant l'historial del navegador.

---

## 9. Sistema Multi-Tenant Dinàmic per Context d'IP i Host (White-Labeling)

Amb la finalitat de preservar la privadesa, neutralitat i seguretat de les institucions adherides, BancActiu 2.0 implementa una arquitectura de **White-Labeling contextual dinàmic** gestionada a la capa de límit (*Edge Middleware*).

### 9.1. Principi de Disseny Neutre i Desacoblament Institucional
* **Eliminació de Hardcoding**: Cap interfície pública o no autenticada conté referències corporatives fixes a organismes com la Generalitat de Catalunya, CatSalut, Ajuntament de Cornellà o Creu Roja.
* **Aspecte Corporatiu Neutre**: Per defecte, qualsevol client extern o auditoria pública rep la marca neutra **BancActiu 2.0 Enterprise** ("Plataforma de Governança i Interoperabilitat Descentralitzada").
* **No Exposició de DNI**: El DNI acreditat del Superadministrador no s'imprimeix mai com a plantilla o text visible abans de l'autenticació.

### 9.2. Mecanisme de Resolució Contextual Automàtica
El fitxer `apps/bancactiu-nexus/middleware.ts` avalua cada petició HTTP en temps real abans d'arribar a les pàgines o API endpoints:
1. **Inspecció de Capçaleres de Xarxa**: S'analitza `X-Forwarded-For`, `X-Real-IP` i la capçalera `Host`.
2. **Coincidència de Rangs CIDR Corporatius**:
   * **CatSalut / Departament de Salut**: Rangs `10.200.0.0/16`, `172.16.100.0/24`, `192.168.10.0/24` o subdomini `salut.*` / `catsalut.*`.
   * **Ajuntament de Cornellà**: Rangs `10.150.0.0/16`, `192.168.20.0/24` o subdomini `cornella.*` / `municipal.*`.
   * **Tercer Sector / Creu Roja**: Rangs `10.180.0.0/16`, `192.168.30.0/24` o subdomini `social.*` / `creuroja.*`.
3. **Injecció de Capçaleres i Cookie Segura**:
   * El Middleware injecta automàticament les capçaleres `x-tenant-id`, `x-tenant-code`, `x-tenant-name`, `x-tenant-badge` i la cookie `bancactiu_tenant` (format JSON codificat, `SameSite=Lax`, `Path=/`).
   * Els components de client (`useTenantContext`) llegeixen aquest context per personalitzar els logotips, colors de targetes i títols sense recarregar la pàgina.

### 9.3. Matriu de Perfils Tenant Suportats

| Tenant ID | Codi Institucional | Nom Corporatiu | Rangs IP / Hosts Associats | Mòdul d'Operació |
| :--- | :--- | :--- | :--- | :--- |
| `tenant-esteve-terrades` | `IPFP_ESTEVE_TERRADES` | Institut Esteve Terrades i Illa (Cornellà) | `10.151.0.0/16`, `esteveterrades.cat` | Nexus & Tots els Mòduls |
| `tenant-enterprise` | `BANCACTIU_ENTERPRISE` | BancActiu 2.0 Enterprise | *Per defecte (Internet oberta / Auditories)* | Nexus Governança Central |
| `tenant-catsalut` | `CATSALUT_GAPIC` | Servei Català de la Salut &middot; GAPIC | `10.200.0.0/16`, `salut.bancactiu.cat` | `/salut` (ICS / XHUP) |
| `tenant-cornella` | `AJUNTAMENT_CORNELLA` | Ajuntament de Cornellà de Llobregat | `10.150.0.0/16`, `cornella.bancactiu.cat` | `/municipal` (Serveis Socials) |
| `tenant-social` | `TERCER_SECTOR` | Xarxa Comunitària &middot; Tercer Sector | `10.180.0.0/16`, `social.bancactiu.cat` | `/social` (Banc del Temps) |
| `tenant-logistica` | `MAGATZEM_UAC` | Centre Logístic &middot; Magatzem UAC | `10.190.0.0/16`, `logistica.bancactiu.cat` | `/operatiu` (Ortoprotèsica) |

### 9.4. Sobreescriptura per a Proves i Homologació (`?tenant=`)
Per a equips d'auditoria o proves en entorns sandbox, és possible provar qualsevol context de tenant mitjançant el paràmetre de consulta:
* `https://banc-actiu-2-0-separacion-entidades.vercel.app/login?tenant=esteveterrades`
* `https://banc-actiu-2-0-separacion-entidades.vercel.app/login?tenant=catsalut`
* `https://banc-actiu-2-0-separacion-entidades.vercel.app/login?tenant=cornella`
* `https://banc-actiu-2-0-separacion-entidades.vercel.app/login?tenant=social`
* `https://banc-actiu-2-0-separacion-entidades.vercel.app/login?tenant=enterprise`

---

## 10. Mòdul d'Auditoria Massiva i Simulació d'Estrès (Fins a 5 Anys)

La versió 3.0 Enterprise incorpora directament a la Consola de Superadministrador un mòdul avançat per a l'auditoria perimetral massiva i l'estudi de càrrega a llarg termini (fins a 5 anys de creixement sostingut).

### 10.1. Endpoint de Backend (`/api/admin/simulations`)
Protegit estrictament per la identitat acreditada del Superadministrador (`48956602Z` / Marc Cachinero Baranda):
* **Mètode**: `POST /api/admin/simulations`
* **Modes d'Operació**:
  * **Mode Massiu (`mode: "massive"`)**: Executa tests automatitzats en paral·lel per a totes les entitats i subxarxes registrades (Salut, Municipal, Social, Esteve Terrades i Default Neutral). Avalua latències de PostgreSQL 16 (pool de connexions), integritat criptogràfica E2EE AES-256-GCM, capçaleres Zero-Trust (HSTS, CSP, X-Frame-Options) i aïllament multi-tenant.
  * **Mode Personalitzat (`mode: "custom"`)**: Permet configurar a la carta l'array d'entitats objectiu (`targetTenants`), l'horitzó temporal de simulació (d'1 a 5 anys) i la combinació de suites de test a activar.

### 10.2. Suites de Test Específiques
1. **`ZERO_TRUST_HEADERS`**: Verificació estricta de capçaleres de seguretat HSTS (`max-age=31536000; includeSubDomains; preload`), CSP defensiva, polítiques anti-clickjacking `DENY` i cookies amb atributs `Secure; SameSite=Lax`.
2. **`E2EE_INTEGRITY`**: Validació de la integritat criptogràfica en 1.000 mostres d'expedients PAO i documentació clínica mitjançant AES-256-GCM i checksum SHA-256 sense alteracions.
3. **`POSTGRES_STRESS_TEST`**: Prova de concurrència d'alta fidelitat amb 250 connexions concurrents contra PostgreSQL 16, registrant latències mitjanes inferiors a 5 ms (p95 < 17 ms) i mesura de rendiment transaccional (TPS).
4. **`IP_CONTEXT_VALIDATION`**: Comprovació de resolució dinàmica de context multi-tenant segons les adreces IP d'origen i subxarxes corporatives associades (Esteve Terrades, Cornellà, CatSalut, etc.).

### 10.3. Matriu Volumètrica de Projecció a 5 Anys

| Horitzó | Abast Geogràfic | Expedients PAO | Usuaris Actius | Transaccions/Mes | Pic TPS | Volum Disc | Latència Mitjana | Recomanació Arquitectura |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Any 1** | Cornellà & Xarxa IETI | 4.200 | 140 | 14.500 | 22 TPS | 2.8 GB | 1.8 ms | Pool estàndard PostgreSQL 16 (max 50 connexions). |
| **Any 2** | Regió Metropolitana Sud | 19.800 | 520 | 68.000 | 58 TPS | 11.4 GB | 2.3 ms | Activació de memòria cau Redis Edge per a sessions. |
| **Any 3** | AMB i Consorcis Sanitaris | 48.500 | 1.380 | 185.000 | 110 TPS | 28.6 GB | 3.1 ms | Particionament de taules d'auditoria per trimestre (RANGE). |
| **Any 4** | Catalunya (9 Regions Sanitàries) | 92.000 | 2.450 | 390.000 | 175 TPS | 54.2 GB | 3.9 ms | Rèpliques Read-Only de lectura distribuïda PostgreSQL 16. |
| **Any 5** | Ecosistema Total & Big Data | 165.000 | 4.200 | 780.000 | 260 TPS | 98.5 GB | 4.6 ms | Particionament anual, taules fredes i Multi-Regió 99.99%. |

### 10.4. Interfície Visual i Exportació
El panell ofereix:
* Barra de progrés amb percentatge en temps real durant l'auditoria massiva.
* Matriu dinàmica de resultats amb estat `OPTIMAL` per entitat.
* Selectors de rang temporal d'1 a 5 anys amb previsualització de volumetria.
* Botó d'**Exportació JSON** per descarregar l'informe complet d'auditoria sota protocols ENS Nivell Alt.

### 10.5. Panell d'Incidents SOAR i Verificació Merkle (`/api/admin/soar`)
El Superadministrador disposa de control total sobre les mitigacions automàtiques del sistema:
* **Inspecció de Quarantenes**: Consulta d'IPs posades en quarantena automàtica pel Behavioral Middleware i opció d'aixecament manual (`LIFT_QUARANTINE`).
* **Verificació Criptogràfica de la Cadena Merkle**: Auditoria contínua de la integritat de la cadena amb confirmació de l'últim hash arrel (`merkleRootHash`).

---

## 11. Mòdul de Taller & Reparacions (Creu Roja) i Separació d'Accessos per Rols Operatius

A la versió 3.0 Enterprise, s'ha implementat una especialització operativa completa per garantir la separació d'accessos i la traçabilitat del cicle de vida del material ortopèdic comunitari entre atenció sanitària, voluntariat veïnal i tallers mecànics.

### 11.1. Separació d'Accessos per Rols Operatius
La consola central incorpora una barra de selecció ràpida de perspectiva operativa que adapta les mètriques, accions i permisos per a cadascun dels tres actors fonamentals:
1. **Treballador del CAP (Gestió i Prescripció Mèdica)**:
   * **Perfil**: Metges d'atenció primària, diplomats d'infermeria i administratius sanitaris (UAC).
   * **Capacitats**: Validació clínica de prescripcions PAO, avaluació funcional de dependència (escala Barthel), emissió d'etiquetes d'inventari QR i alta directa de préstecs ciutadans.
2. **Voluntari / Entitat Veïnal (Peticions de Suport i Derivacions)**:
   * **Perfil**: Coordinadors d'Associacions de Veïns (AVV Sant Ildefons, Almeda, etc.) i xarxa ciutadana.
   * **Capacitats**: Canalització de peticions d'ajudes tècniques per a famílies en situació de vulnerabilitat, notificació d'avaries o desperfectes del material prestat i coordinació amb el Banc del Temps.
3. **Centre de Reparació - Creu Roja (Gestió Tècnica de Tallers)**:
   * **Perfil**: Responsables de manteniment, mecànics voluntaris de Creu Roja Baix Llobregat i tècnics d'ortoprotèsica.
   * **Capacitats**: Gestió integral del taller solidari, recepció d'incidències, execució del cicle de vida de reparacions de 4 etapes, registre de recanvis i emissió del certificat de seguretat biomecànica abans del retorn a l'estoc actiu.

### 11.2. Mòdul d'Alta de "Nou Préstamo" (`NewLoanModal`)
El botó interactiu **Nou Préstamo** està present a la barra superior de Superadmin, al tauler de control operatiu i a la llista d'expedients:
* **Identificació del Pacient**: Nom i cognoms, DNI/NIE o CIP (Codi d'Identificació Personal CatSalut) i telèfon de contacte.
* **Selecció de Material Ortopèdic**: Catàleg complet (cadires autopropulsables d'alumini, cadires de trànsit, caminadors amb frens i seient, crosses, llits articulats elèctrics, grues de transferència hospitalària i matalassos antiescares).
* **Identificador QR Dinàmic**: Assignació o generació automàtica de codi QR (ex: `QR-CR-412`) per al marcatge físic del producte.
* **Període de Préstec i Retorn**: Selector ràpid de terminis (+30, +60, +90 dies) o data lliure, vinculat al CAP d'origen.
* **Verificació idCAT Mòbil**: Consentiment digital informat de custòdia responsable sota RGPD i ENS Nivell Alt.

### 11.3. Gestió del Cicle de Vida al Taller de Creu Roja (`WorkshopAndRepairsWorkspace`)
El nou workspace de gestió tècnica estructura el recondicionament d'ajudes tècniques en **4 estats estrictes**:
1. **`PENDENT` (Pendent d'Assignació)**: Recepció de l'avaria notificada per una Entitat Veïnal o retornada d'un préstec ciutadà. Diagnòstic preliminar dels desperfectes.
2. **`EN_REPARACIO` (En Reparació Tècnica)**: Assignació a un mecànic voluntari de Creu Roja. Desmuntatge, ajust dinamomètric de frens, desinfecció per ultrasons i soldadura de xassís.
3. **`VERIFICACIO_SEGURETAT` (Test Biomecànic)**: Prova de càrrega estàtica (fins a 150 kg), verificació d'estabilitat i homologació de seguretat europea UNE-EN 12183.
4. **`REPARADA_RETORNADA` (Reparada i Retornada)**: Reingrés automàtic del material a l'estoc operatiu de la UAC per a nous lliuraments.

* **Registre d'Intervencions i Canvi de Components**: Permet detallar el mecànic assignat, la relació de peces substituïdes (coixinets segellats, cables de fre, tacs de cautxú), les hores computades del Banc del Temps i el segell de test de seguretat superat.

---

## 12. Arbre Organitzacional Integral (12 Nivells) i Mòdul de Serveis Socials & Dependència

A la versió 3.0 Enterprise, s'ha consolidat i auditat formalment el **100% de l'arbre organitzacional i de control de rols (RBAC)** de BancActiu, garantint que cap baula de la cadena sociosanitària quedi desatesa o sense traçabilitat estricta sota l'Esquema Nacional de Seguretat (ENS Nivell Alt).

### 12.1. Matriu dels 12 Nivells de l'Arbre Institucional

| Nivell | Denominació Institucional | Rol RBAC | Responsabilitats i Privilegis Principals |
| :---: | :--- | :--- | :--- |
| **1** | **Superadministradors de Plataforma** | `SUPERADMIN` | Control total, arquitectura Zero-Trust, xifrat E2EE, auditories forenses i simulador d'estrès a 5 anys (Bartolomé i Marc Cachinero Baranda, `48956602Z`). |
| **2** | **Gerències Regionals i GAPICs** | `DIRECCIO` / `SUPERADMIN` | Planificació macroterritorial, provisió pressupostària CatSalut/ICS i governança regional (Mireia Valls i Dr. Carles Font). |
| **3** | **Direcció de CAP** | `DIRECCIO` | Supervisió mèdica de protocols clínics del centre, homologació d'ajudes tècniques i coordinació intersectorial (Dra. Eulàlia Rovira). |
| **4** | **Referents de CAP (Comunitaris i Mèdics)** | `TECNIC_SALUT` | Prescripció clínica d'ajudes tècniques, valoració funcional de Barthel i seguiment d'usuaris (Dr. Jaume Gutiérrez). |
| **5** | **Treballadors de CAP (Administratius UAC)** | `ADMINISTRATIU_OPERATIU` | Recepció d'usuaris a taulell, tramitació de sol·licituds, validació de documentació i lliurament de material (Laura Esteve). |
| **6** | **Gerents d'Entitats Veïnals** | `DIRECCIO` | Gestió i supervisió territorial de xarxes de proximitat per barris (Manel Gómez - AVV Sant Ildefons). |
| **7** | **Voluntaris d'Entitats Veïnals** | `VOLUNTARI` | Acompanyament veïnal solidari, detecció de situacions d'aïllament no desitjat i suport logístic (Rosa Maria Martínez). |
| **8** | **Gerència de Taller de Reparació (Creu Roja)** | `TERCER_SECTOR` | Coordinació de la logística de recondicionament, estoc de recanvis i cicle d'avaries (Carles Miralles). |
| **9** | **Treballadors i Mecànics de Taller** | `TERCER_SECTOR` | Revisió mecànica, calibratge, desinfecció hospitalària i emissió de segells de seguretat UNE-EN 12183 (Albert Puig). |
| **10** | **Gerència de Serveis Socials Municipals** | `SERVEIS_SOCIALS` | Planificació de la cartera municipal de benestar social, coordinació d'equips bàsics d'atenció social (Mercè Dalmau). |
| **11** | **Treballadors Socials de Dependència** | `SERVEIS_SOCIALS` | Valoració BVD (escala 64 punts), elaboració del Programa Individual d'Atenció (PIA), SAD i teleassistència (Núria Soler). |
| **12** | **Administració Local / Ajuntament** | `AJUNTAMENT` | Finançament municipal, supervisió de convenis de col·laboració i coordinació interinstitucional (Jordi Casals). |

### 12.2. Script d'Auditoria Automatitzada (`scripts/verify_organigram_rbac.js`)
L'script inspecciona el codi font, tipus de dades i components de la plataforma per garantir la coherència organitzativa:
```bash
node scripts/verify_organigram_rbac.js
```
* **Resultat d'Auditoria**: 12 de 12 nivells auditats amb **100.0% de cobertura** i zero errors o avisos.
* **Informe Criptogràfic Desat a**: `docs/audit/organigram_report.json`.

### 12.3. Espai de Treball de Serveis Socials & Dependència (`SocialServicesWorkspace`)
Integrat directament a la consola Nexus per al rol `SERVEIS_SOCIALS`:
1. **Gestió del Barem de Valoració de Dependència (BVD)**:
   * Avaluació basada en l'escala reglamentària de 64 punts (de 0 a 100), amb classificació automatitzada en **Grau I (Moderada)**, **Grau II (Severa)** i **Grau III (Gran Dependència)**.
2. **Programa Individual d'Atenció (PIA)**:
   * Concreció de prestacions no monetàries (hores setmanals de Servei d'Atenció Domiciliària - SAD, tipus de teleassistència bàsica o avançada amb sensors perifèrics) i ajudes econòmiques per a persones cuidadores no professionals.
3. **Interoperabilitat Bidireccional en Temps Real**:
   * **Canal Clínic (CAP Sant Ildefons)**: Creuament immediat d'informes de salut i escala Barthel amb facultatius mèdics.
   * **Canal Tècnic (Taller Creu Roja)**: Generació automàtica de comandes d'ajudes tècniques (llits hospitalaris, grues, cadires) per a la seva desinfecció, adaptació i lliurament immediat a la llar del ciutadà.

---

## 13. Disseny de la Interfície en Mode Clar (Light Mode) Institucional i Sanitari

Amb l'objectiu d'eliminar la fatiga visual, afavorir la llegibilitat en entorns clínics i administratius lluminosos i complir amb els estàndards d'accessibilitat WCAG 2.1 Nivell AA, BancActiu 3.0 Enterprise ha completat la transició des del tema fosc cap a un **entorn clar, lluminós, professional i altament amigable**:

* **Fons Llum i Neteja Institucional (`bg-slate-50` / `#f8fafc`)**: S'abandonen els fons negres saturats (`bg-slate-950`) en favor de bases suaus de pissarra clar amb aures radials en tons pastel suaus (lila, cian, maragda).
* **Targetes i Contenidors de Vidre Translúcid (`bg-white/95 border-slate-200 shadow-sm`)**: Fons blancs amb reflectància superior subtil, vores definides i ombres suaus que proporcionen jerarquia nítida sense estridències.
* **Tipografia d'Alt Contrast per a Treball al 100% Zoom**:
  * Títols i encapçalaments en `text-slate-900` per a màxima nitidesa.
  * Textos descriptius i subtítols en `text-slate-600` i `text-slate-500`.
  * Codis i identificadors mèdics en `text-cyan-700` o `text-purple-700` sobre fons pastel clars (`bg-cyan-50`, `bg-purple-50`).
* **Integritat Funcional Absoluta**:
  * Formulari interactiu de **Nou Préstamo** (`NewLoanModal`).
  * Consola tècnica de recondicionament del **Taller Creu Roja** (`WorkshopAndRepairsWorkspace`).
  * Assistent flotant intel·ligent **Kenzo / Kenza AI** arrossegable.
  * Gestió de dependència i activació sota demanda de **Serveis Socials** (`modules-feature-flags.ts`).
  * Scroll vertical fluid (`overflow-y-auto custom-scrollbar`) tant al tauler com a cadascun dels espais de treball.



