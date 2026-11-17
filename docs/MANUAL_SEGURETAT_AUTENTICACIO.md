# Manual de Ciberseguretat, Autenticació i Protecció de Dades - BancActiu 3.0

> **Directrius Oficials de Seguretat Perimetral, Esquema Nacional de Seguretat (ENS Nivell Alt) i RGPD**  
> Centre de Seguretat de la Informació de Catalunya (CESICAT) &middot; Departament de Salut &middot; Institut Esteve Terrades i Illa &middot; Versió 3.0 Enterprise

---

## 1. Model de Seguretat Zero-Trust

BancActiu 3.0 implementa una arquitectura integral **Zero-Trust**: cap petició interna o externa és considerada de confiança per defecte; qualsevol accés a dades clíniques o administratives requereix autenticació prèvia, resolució de context institucional i verificació criptogràfica d'identitat.

### 1.1. Capes de Verificació
1. **Edge Middleware (`middleware.ts`)**:
   * S'executa a la xarxa perimetral de Vercel abans de servir qualsevol recurs dinàmic o pàgina.
   * Resol de manera contextual el tenant segons la IP d'accés (ex: xarxa de l'Institut Esteve Terrades i Illa `10.151.0.0/16`, `10.152.0.0/16`, `84.88.151.0/24`, etc.) i el Host.
   * Injecta capçaleres institucionals d'auditoria: `x-tenant-id`, `x-tenant-code`, `x-tenant-name`, `x-tenant-badge` i `x-centre-nom`.
   * Verifica la signatura i integritat de la cookie `bancactiu_session`.
   * Si no hi ha sessió acreditada, respon amb `HTTP 307 Temporary Redirect` cap a `/login` preservant el paràmetre `redirect` de retorn segur.
2. **Server-Side Session Check (SSR a `app/page.tsx`)**:
   * El Server Component llegeix directament les galetes xifrades del servidor (`await cookies()`).
   * Valida estrictament l'accés autoritzant el rol `SUPERADMIN` (vinculat als DNI `48956602Z` i `52622304Y`, o a l'usuari `Administrador`).
3. **Control d'Accés per Rol Granular (RBAC)**:
   * Cada recurs està assignat als rols autoritzats (`SUPERADMIN`, `GERENCIA_TERRITORIAL`, `DIRECCIO_CAP`, `REFERENT_CAP`, `ADMINISTRATIU_SANITARI`, `COORDINADOR_LOCAL`, `TECNIC_TALLER`, `VOLUNTARI_ENTITAT`).

---

## 2. Autenticació Estricta del Superadministrador i Usuari Docent

### 2.1. Vinculació d'Identitat al Superadministrador Oficial
L'administrador suprem i autor de referència acreditat al Gateway Launcher de Nexus és:
* **DNI**: `48956602Z`
* **Usuari**: Marc Cachinero Baranda (Governança i Control Central)
* **Email**: `marccachinero@gmail.com`
* **Rol**: `SUPERADMIN` (Nivell 5 · Control Total)

Compte de governança addicional institucional:
* **DNI**: `52622304Y` / Mireia Valls i Grau (CatSalut / GAPIC)

### 2.2. Usuari Professor "Administrador" (Canvi Obligatori de Clau)
Configurat amb les màximes garanties per a docència i laboratoris:
* **Identificador**: `Administrador`
* **Contrasenya Inicial**: `1234`
* **Estat de Seguretat**: `must_change_password: true`, `isFirstLogin: true`
* **Centre Associat**: `INS-ESTEVE-TERRADES` (Cornellà de Llobregat)
* **Flux de Bloqueig**: L'endpoint `/api/auth/login` retorna `requirePasswordSetup: true`, obligant a definir immediatament una nova contrasenya robusta abans de permetre qualsevol accés.

### 2.3. Modal Ineludible de Propietat Intel·lectual
En el primer accés de qualsevol usuari (incloent Superadministradors):
* Salta el component [`IntellectualPropertyModal`](file:///apps/bancactiu-nexus/components/legal/IntellectualPropertyModal.tsx).
* Bloqueja el desplaçament i la tecla `Escape`.
* Requereix l'acceptació explícita dels drets d'autor i propietat intel·lectual (RDL 1/1996, RGPD Art. 9 i ENS Nivell Alt).
* Persisteix l'estat a `localStorage` i cookies segures.

### 2.4. Re-Autenticació Sensible per a Rols Crítics (2FA / Double Verification)
El component [`SensitiveActionAuthModal`](file:///packages/ui-glass/src/SensitiveActionAuthModal.tsx) està **restringit estrictament** perquè NOMÉS s'activi davant de tres accions crítiques:
1. **`SUPERADMIN_ROLE_CHANGE`**: Concessió o alteració de privilegis del rol Superadministrador a la matriu RBAC.
2. **`MASS_DATA_EXPORT`**: Extracció massiva xifrada de logs d'auditoria o expedients clínics protegits sota RGPD Art. 9.
3. **`AUDIT_LAB_NETWORK`**: Accés al laboratori d'estrès, escàner de seguretat o modificació de paràmetres de xarxa perimetral.

La navegació ordinària (centres, serveis, assistent Kenzo, intercanvi d'aplicacions) s'executa fluidament sense demanar 2FA.

---

## 3. Reconeixement Dinàmic Multi-Tenant per IP (Institut Esteve Terrades i Illa)

El middleware perimetral detecta de manera autònoma les subxarxes autoritzades:
* `10.151.0.0/16` & `10.152.0.0/16` (Xarxes docents i administratives IETI)
* `192.168.151.0/24` & `192.168.100.0/24` (Aules i laboratoris)
* `172.16.50.0/24` (Serveis del centre)
* `84.88.151.0/24` & `80.39.151.0/24` (IPs públiques educatives)
* `194.179.x.x` & `84.88.x.x` & `213.73.x.x` (Anella Científica i CSUC)

En reconèixer la xarxa, el sistema injecta la marca oficial:
* **Nom**: `Institut Esteve Terrades i Illa (Cornellà de Llobregat)`
* **Acrònim**: `IPFP Esteve Terrades i Illa`
* **Capçaleres**: `x-centre-nom` i `x-tenant-badge: IPFP Esteve Terrades i Illa`

---

## 4. Xifratge E2EE, Capçaleres HTTP i Compliment ENS

* **Dades en Trànsit (E2EE)**: Canals xifrats TLS 1.3 amb Perfect Forward Secrecy (PFS).
* **Dades en Repòs**: Xifratge AES-256-GCM per a expedients PAO i registres sensibles.
* **Capçaleres de Seguretat**:
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  * `X-Frame-Options: DENY` (Anti-clickjacking)
  * `X-Content-Type-Options: nosniff`
  * `Content-Security-Policy: default-src 'self' ...`
* **AuditLog Forense Immutable**: Registre criptogràfic de totes les operacions crítiques amb marca de temps ISO-8601, IP d'origen i identificador únic d'auditoria.

---

## 5. Registre d'Auditoria Immutable Merkle Tree (Hash Chaining SHA-256)

Per assolir l'estàndard de grau bancari i forense davant tribunals o inspeccions de l'Agència Espanyola de Protecció de Dades (AEPD), BancActiu 3.0 no empra taules d'auditoria editables ordinàries. En el seu lloc, implementa una **cadena Merkle encadenada criptogràficament**:

* **Fórmula de Bloc**:
  $$\text{BlockHash}_n = \text{SHA-256}(\text{Index}_n \parallel \text{Timestamp}_n \parallel \text{ActorDNI}_n \parallel \text{Action}_n \parallel \text{ClientIP}_n \parallel \text{PayloadHash}_n \parallel \text{BlockHash}_{n-1})$$
* **Immunitat davant Manipulacions**: Si un atacant o administrador deshonest manipula un registre antic de la base de dades, el hash del bloc canvia, trencant la concordança amb tots els blocs posteriors.
* **Verificació Automàtica**: El sistema executa `verifyMerkleChainIntegrity()` periòdicament. Si es detecta qualsevol discrepància, el sistema entra en estat de bloqueig defensiu i alerta immediatament el Superadministrador.

---

## 6. Sandboxing de Sessió & Execució Aïllada en Memòria

Per evitar atacs de *Session Hijacking*, robatori de cookies o fuites en terminals compartits:
1. **Empremta Digital de Client (Fingerprint)**: Cada sessió vincula criptogràficament la IP del client, el hash del seu `User-Agent` i un salt efímer d'un sol ús generat al servidor.
2. **Rotació de Claus Efímeres en Memòria**: Cap clau simètrica de desxifratge es guarda en clar a `localStorage` o `sessionStorage`. Les estructures de sessió viuen exclusivament en l'espai de memòria aïllat del Sandbox del servidor.
3. **Invalidació Immediata**: Si una petició presenta una discrepància en la seva empremta digital respecte al Sandbox autoritzat, la sessió queda destruïda a l'instant i s'activa un incident al motor SOAR.

---

## 7. Resiliència Offline-First amb Sincronització Delta Atòmica

BancActiu 3.0 garanteix la continuïtat del servei sociosanitari en situacions de catàstrofe o caiguda de la xarxa:
* **Mode Desconnectat**: Els clients de camp emmagatzemen operacions en una cua xifrada local (`DeltaOperation`).
* **Sincronització Atòmica (`/api/sync/delta`)**: Quan es recupera la connectivitat a Internet, el paquet Delta s'envia en bloc al servidor central.
* **Resolució de Conflictes**: El motor aplica una estratègia determinista *Last-Write-Wins amb Auditoria Merkle*, consolidant l'historial i generant nous blocs immutables per a cadascun dels canvis aplicats.

---

## 8. Blindatge de la Pantalla de Login i Prevenció d'Autologin Residual

Per complir les directrius més exigents de l'Esquema Nacional de Seguretat (ENS Nivell Alt) sobre estacions d'accés públiques o aules docents:
1. **Neteja Imperativa d'Estat Residual a `/login`**:
   * En accedir a la ruta `/login`, el sistema executa de forma immediata la purga de `sessionStorage` i claus de memòria a `localStorage`.
   * S'emet una invalidació estricta de la cookie de sessió (`Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0`), evitant redireccions automàtiques o bucles de canvi de contrasenya no desitjats.
2. **Desactivació Absoluta d'Autocompletat (`autocomplete="off"`, `data-lpignore="true"`)**:
   * Tots els formularis d'autenticació (DNI, contrasenya, primer inici i modal de doble verificació 2FA) implementen marcadors anti-emplenament automàtic per evitar que gestors de claus corporatius o del navegador introdueixin credencials antigues.
3. **Disseny d'Interfície Compacta i Adaptativa ("Bogons")**:
   * Els components interactius del Dashboard i Gateway Launcher estan optimitzats amb graelles compactes fluides (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5`, padding adaptatiu `p-3`, mides tipogràfiques contingudes `text-xs / text-sm`) garantint una visualització completa i scroll fluid vertical en resolucions d'escriptori i portàtils.

---

## 9. Laboratori d'Estrès i Simulació de Seguretat Personalitzable (Stress & Security Lab)

BancActiu 3.0 Enterprise incorpora una eina avançada de simulació de fatiga i estrès a la carta accessible exclusivament des de la consola de Superadministració:

1. **Configuració Dinàmica de Paràmetres**:
   * **Selector de Temps / Durada**: Ajustable de forma interactiva (30 segons per a ràfega inicial, 1 minut per a auditoria estàndard, 5 minuts per a saturació de concurrència i 15 minuts per a fatiga de màxima resistència).
   * **Àmbit Territorial de Centres**: Possibilitat d'executar el test sobre la xarxa global de Catalunya (420 CAPs, CUAPs i Hospitals) o sobre un conjunt acotat de centres sanitaris seleccionats manualment (CAP Sant Ildefons, CAP Just Oliveras, CAP Bellvitge, CAP Can Bou, Creu Roja Cornellà, IETI Dual).
   * **Filtratge de Mòduls Operatius**: Selecció granular dels serveis a sotmetre a càrrega: Préstecs d'Ajudes Tècniques (Expedients PAO), Taller de Creu Roja (Reparacions i Recondicionament), Autenticació/Middleware Zero-Trust i Cadena Merkle de Traçabilitat Forense.

2. **Informe Multidimensional d'Auditoria**:
   * **Mètriques Transaccionals**: Mesurament en temps real de transaccions per segon (TPS mitjà i pic), temps de latència mitjà i màxim (p99), i taxa d'errors de sistema (0.00% d'errors de dades).
   * **Integritat Criptogràfica Merkle**: Generació i verificació del hash SHA-256 d'arrel de cadena en calent durant el pic de concurrència, garantint la condició d'inalterabilitat del registre forense.
   * **Resposta Defensiva del Motor SOAR**: Recompte i registre d'incidències bloquejades (atacs de força bruta, credential stuffing, sondeig territorial) i resolució automàtica de col·lisions d'inventari mitjançant bloqueig optimista, amb temps de mitigació inferiors a 5 ms.
   * **Desglossament per Centre i Servei**: Taules analítiques independents amb els TPS, transaccions, latències i estat de salut (ÒPTIM) per a cadascun dels nodes avaluats.
   * **Exportació Executiva Oficial**: Descàrrega directa de l'informe complet en PDF per a acreditació d'auditories ENS i RGPD.

3. **Governança Pura de Superadministració**:
   * La barra i el panell de comandament del Superadministrador s'han alliberat de funcionalitats clíniques menors com el botó "Nou Préstamo", reservant aquest accés exclusivament als rols d'atenció primària (Treballadors del CAP) per preservar una estricta separació de funcions (Segregation of Duties).



