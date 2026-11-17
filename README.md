# BancActiu 2.0: Ecosistema Descentralitzat de Salut i Benestar

> **Plataforma Enterprise de Gestió d'Ajudes Tècniques i Suport a la Dependència**  
> Generalitat de Catalunya &middot; Departament de Salut &middot; Ajuntament de Cornellà de Llobregat &middot; GAPIC

---

## 1. Visió General de l'Arquitectura

BancActiu 2.0 és un monorepo modular de nova generació que desacobla la gestió comunitària i clínica en **5 micro-aplicacions independents**, alimentades per una **base de dades compartida en memòria i transaccional** (`@bancactiu/db`) i una llibreria corporativa amb estètica **Glassmorphism / Fluent Design** (`@bancactiu/ui-glass`):

```
BancActiu_2.0_Separacion_Entidades/
├── apps/
│   ├── bancactiu-nexus/       # (Port 3000) Gateway Launcher, Superadministració, Kenzo AI & Interoperabilitat
│   ├── bancactiu-salut/       # (Port 3001) Àmbit Sanitari, Prescripció Clínica i Validació CAP/Hospital
│   ├── bancactiu-municipal/   # (Port 3002) Ajuntament de Cornellà, Padró i Subvencions d'Accessibilitat
│   ├── bancactiu-social/      # (Port 3003) Serveis Socials, Expedients de Dependència (Llei 39/2006)
│   └── bancactiu-operatiu/    # (Port 3004) Logística UAC, Magatzem Central, Creu Roja i Reparacions
├── packages/
│   ├── db/                    # Base de dades compartida, seeds oficials, models i registre AuditLog
│   ├── ui-glass/              # Llibreria UI Glassmorphism (RadialAuraBackground, GlassCard, GlassHeader...)
│   └── interoperability-connector/ # Pasarel·les mTLS, AOC / Via Oberta, xifratge AES-256
└── docs/                      # Manuals tècnics i d'operació del sistema
```

---

## 2. Seguretat Perimetral i Accés Superadministrador

### 2.1. Identitat Oficial del Superadministrador
* **DNI Acreditat**: `52622304Y` (Titular: Mireia Valls i Grau - GAPIC / Salut).
* **Control d'Accés Basat en Rols (RBAC)**: Nivell 5 · Control Total Catalunya.

### 2.2. Login Net ("Clean Login") i Primer Inici ("First-Time Setup")
* **Camps Buits per Defecte**: Per estrictes protocols de ciberseguretat, els camps del formulari d'accés a `/login` apareixen **completament buits** (`value=""`), amb `autoComplete="off"` i sense botons d'autofill de prova.
* **Mecanisme de Primer Accés**: Si el Superadministrador no té contrasenya establerta a la base de dades (`mustChangePassword: true`), el sistema commuta automàticament cap a la **Configuració Inicial de Clau**:
  * Exigeix una contrasenya robusta amb mínim 8 caràcters, majúscules, minúscules, números i caràcters especials (ENS Nivell Alt).
  * Valida la coincidència i persisteix la contrasenya a `@bancactiu/db` registrant l'auditoria forense.
* **Autenticació per Certificat Digital Oficial**: Suport integrat per a certificats **idCAT**, **T-CAT** corporatiu de Salut i **DNI Electrònic** emesos per l'Agència Catalana de Certificació (EC-ACC).
* **Middleware Perimetral & SSR**: Qualsevol petició sense sessió vàlida és redirigida immediatament a `/login` amb codi `307 Temporary Redirect`.

---

## 3. Assistent Intel·ligent "Kenzo"

Situat a la cantonada inferior dreta del Gateway Launcher (`apps/bancactiu-nexus`), l'assistent flotant **Kenzo** ofereix:

1. **Auditoria de Sistemes en Temps Real**:
   * Estat de desplegament del monorepo i verificació de les 5 micro-aplicacions.
   * Estat de la identitat del Superadministrador (DNI: `52622304Y`).
   * Compliment de l'Esquema Nacional de Seguretat (ENS) i RGPD.
2. **Mètriques per Mòdul**:
   * **BancActiu Salut**: 1.420 prescripcions clíniques validades per metges d'atenció primària.
   * **BancActiu Municipal**: 892 ajudes aprovades amb verificació de padró a Cornellà.
   * **BancActiu Social**: 430 expedients de dependència i 320 intervencions de suport familiar.
   * **BancActiu Operatiu**: 2.150 materials en estoc amb una taxa de reutilització del 94.2%.
3. **Mode Presentació de Diapositives (Slides Mode)**:
   * Visualitzador interactiu de diapositives executives amb control de navegació, punts selectors i dades consolidades per a comissions i reunions directives.
4. **Xat i Diagnòstic Ràpid**:
   * Consulta directa en llenguatge natural per auditar dependències, concurrència i pasarel·les AOC.

---

## 4. Gestió Dual de Xarxa i Enllaços Adaptatius (Local vs Vercel Cloud)

La plataforma incorpora una arquitectura de navegació adaptativa mitjançant `resolveAppTargetUrl`:

* **Desenvolupament Local (`localhost`)**:
  * Gateway Nexus: `http://localhost:3000`
  * Salut: `http://localhost:3001`
  * Municipal: `http://localhost:3002`
  * Social: `http://localhost:3003`
  * Operatiu: `http://localhost:3004`
* **Producció al Núvol (Vercel Cloud)**:
  * Gateway Nexus (SuperAdmin): `https://banc-actiu-2-0-separacion-entidades.vercel.app/`
  * Salut (CatSalut / ICS): `https://banc-actiu-2-0-separacion-entidades.vercel.app/salut`
  * Municipal (Cornellà): `https://banc-actiu-2-0-separacion-entidades.vercel.app/municipal`
  * Social (Creu Roja): `https://banc-actiu-2-0-separacion-entidades.vercel.app/social`
  * Operatiu (UAC / Magatzem): `https://banc-actiu-2-0-separacion-entidades.vercel.app/operatiu`
  * **Zero Fallades Localhost**: Es bloqueja qualsevol intent de cridar ports locals quan s'executa a Vercel Cloud, garantint navegació fluida i segura.

---

## 5. Desplegament i Producció

* **URL Oficial de Producció a Vercel**:  
  **https://banc-actiu-2-0-separacion-entidades.vercel.app**
* **Portal d'Accés Segur (Login)**:  
  **https://banc-actiu-2-0-separacion-entidades.vercel.app/login**

Comandament de desplegament executiu:
```bash
npx vercel --prod --yes
```

---

## 6. Manuals de Documentació

* [Manual del Superadministrador Nexus](./docs/MANUAL_SUPERADMIN_NEXUS.md)
* [Manual de Ciberseguretat i Autenticació Zero-Trust](./docs/MANUAL_SEGURETAT_AUTENTICACIO.md)
* [Manual de l'Assistent Intel·ligent Kenzo](./docs/MANUAL_ASSISTENT_KENZO.md)
