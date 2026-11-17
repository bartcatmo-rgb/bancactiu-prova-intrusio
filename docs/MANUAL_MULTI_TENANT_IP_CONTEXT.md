# Arquitectura Multi-Tenant Dinàmic per Context d'IP i Host (White-Labeling) - BancActiu 3.0

> **Documentació Tècnica d'Arquitectura i Desplegament de Marca Blanca Contextual**  
> BancActiu 3.0 Enterprise &middot; Capa d'Orquestració Edge &middot; Compliment ENS Nivell Alt

---

## 1. Resum Executiu

La plataforma **BancActiu 3.0** opera com un ecosistema federat utilitzat per múltiples organitzacions independents:
* Administració sanitària de la Generalitat de Catalunya (CatSalut / ICS).
* Administracions municipals (com l'Ajuntament de Cornellà de Llobregat).
* Entitats del Tercer Sector i xarxes ciutadanes (Creu Roja, voluntariat, Banc del Temps).
* Operadors logístics i magatzems ortoprotèsics (UAC).

Per preservar la sobirania institucional, la privadesa en auditories públiques i prevenir la fuga d'informació en portals accessibles per Internet, s'ha implementat un **sistema de Multi-Tenant Dinàmic basat en Context d'IP d'Origen i Host HTTP**.

---

## 2. Objectius d'Enginyeria

1. **Eliminació Total de Hardcoding Institucional**: Cap fitxer de codi font a la capa de presentació pública o login conté referències estàtiques a organismes particulars.
2. **Disseny Corporatiu Neutre per Defecte**: Qualsevol petició procedent d'adreces IP no assignades o adreces públiques d'auditoria rep la identitat neutra **BancActiu 3.0 Enterprise**.
3. **Resolució Automàtica a l'Edge (Zero Latency)**: La resolució es produeix directament al middleware de Next.js mitjançant avaluació de rangs CIDR i capçaleres HTTP en memòria (< 1 ms d'impacte).
4. **Protecció de Credencials i DNI**: El portal d'accés no exposa mai DNI o identificadors privats a les etiquetes o camps del formulari.

---

## 3. Matriu de Mapeig de Xarxa i Identitats

| Identificador Tenant | Codi Canònic | Organització Institucional | Adreces IP / Rangs CIDR | Hosts / Subdominis | Mòdul Associat |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenant-esteve-terrades` | `IPFP_ESTEVE_TERRADES` | Institut Esteve Terrades i Illa (Cornellà) | `10.151.0.0/16`, `192.168.151.0/24`, `84.88.151.0/24` | `esteveterrades.cat`, `ieti.cat` | Nexus & Tots els Mòduls |
| `tenant-enterprise` | `BANCACTIU_ENTERPRISE` | BancActiu 3.0 Enterprise | *Resta d'Internet / 0.0.0.0/0* | `*`, `nexus.*`, `localhost:3000` | Gateway Central |
| `tenant-catsalut` | `CATSALUT_GAPIC` | Servei Català de la Salut &middot; GAPIC | `10.200.0.0/16`, `172.16.100.0/24`, `192.168.10.0/24` | `salut.*`, `catsalut.*`, `localhost:3001` | `/salut` (ICS) |
| `tenant-cornella` | `AJUNTAMENT_CORNELLA` | Ajuntament de Cornellà de Llobregat | `10.150.0.0/16`, `192.168.20.0/24` | `cornella.*`, `municipal.*`, `localhost:3002` | `/municipal` |
| `tenant-social` | `TERCER_SECTOR` | Xarxa Social &middot; Tercer Sector | `10.180.0.0/16`, `192.168.30.0/24` | `social.*`, `creuroja.*`, `localhost:3003` | `/social` |
| `tenant-logistica` | `MAGATZEM_UAC` | Centre Logístic &middot; Magatzem UAC | `10.190.0.0/16`, `192.168.40.0/24` | `logistica.*`, `operatiu.*`, `localhost:3004` | `/operatiu` |

---

## 4. Implementació Tècnica

### 4.1. Mòdul `@bancactiu/db/tenant.ts`
El paquet comú de base de dades conté la definició d'estructures TypeScript i les funcions de concordança:
* `TenantConfig`: Interfície que defineix `id`, `name`, `shortCode`, `allowedIpRanges`, `hosts`, `themeColor`, `badgeText` i `logoUrl`.
* `resolveTenant(ip, host, tenantParam)`: Algorisme d'avaluació en cascada:
  1. Paràmetre explícit de sobreescriptura (`?tenant=...` per a proves).
  2. Coincidència de nom de domini / subdomini (`host`).
  3. Coincidència de rang IP mitjançant l'analitzador CIDR integrat.
  4. Retorn del perfil neutre per defecte si no hi ha coincidència.

### 4.2. Middleware Perimetral (`apps/bancactiu-nexus/middleware.ts`)
* Intercepta totes les sol·licituds entrants a les rutes de l'aplicació.
* Extreu la IP real del client considerant proxys inversos (`X-Forwarded-For`, `X-Real-IP`).
* Injecta capçaleres a la petició:
  * `x-tenant-id`: ID de la instància tenant resolta.
  * `x-tenant-code`: Codi identificador intern.
  * `x-tenant-name`: Nom de la marca per a la vista.
  * `x-tenant-badge`: Etiqueta contextual.
  * `x-client-ip`: Adreça IP detectada del client.
* Injecta la cookie segura `bancactiu_tenant` per permetre la hidratació immediata del client sense crides API addicionals.

### 4.3. Consum des de Components React Client (`useTenantContext`)
Els components interactius com `login/page.tsx` i `BancActiuNexusClient.tsx` incorporen el hook lleuger `useTenantContext()`:
* Llegeix la cookie `bancactiu_tenant` en temps de muntatge.
* Modifica de manera transparent el títol del sistema, colors d'accent, badges i peus de pàgina.

---

## 5. Verificació i Proves de Penetració

1. **Prova per Defecte (Marca Neutra)**:
   Accedir a `/login` sense paràmetres ni adreça corporativa. La interfície mostra `BancActiu 2.0 Enterprise` amb badge blau cian neutre i sense cap menció a institucions particulars.
2. **Prova de Tenant Específic (Exemple CatSalut)**:
   Navegar a `/login?tenant=catsalut`. La interfície adapta la seva insígnia a `CatSalut · GAPIC` amb esquema cromàtic blau marí.
3. **Prova de Tenant Municipal (Exemple Cornellà)**:
   Navegar a `/login?tenant=cornella`. La interfície adapta la insígnia a `Ajuntament de Cornellà` amb tons maragda.
4. **Verificació de Seguretat**:
   Cap valor de DNI o contrasenya es troba codificat al DOM públic o en bundles JavaScript estàtics generats per Webpack.
