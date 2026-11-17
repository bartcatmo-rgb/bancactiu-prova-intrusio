# BancActiu 3.0 — Arquitectura de Seguretat Zero-Trust
**Versió:** 3.0 | **Data:** 16 de Novembre de 2026 | **Classificació:** CONFIDENCIAL - ENS Nivell Alt

## 1. Principis Fonamentals Zero-Trust
L'arquitectura de BancActiu 3.0 es fonamenta en la premissa: *Mai confiar, sempre verificar* (Never trust, always verify).
- **Verificació Contínua d'Identitat i Context**: Cada petició és avaluada en temps real pel middleware perimetral.
- **Accés de Mínim Privilegi (PoLP)**: Els perfils només accedeixen a les rutes i accions estrictament necessàries per al seu rol.
- **Microsegmentació de Xarxa i Aïllament de Tenants**: Separació lògica i estanca de les dades segons el centre o institució.
- **Registre Forense Immutable**: Auditoria criptogràfica d'accions sensibles (`AuditLog`).

## 2. Arquitectura del Gateway Nexus
El mòdul Nexus actua com a portal unificat i passarel·la perimetral:
1. **Resolució de Multi-Tenant Contextual**:
   - Detecta la IP del client o el host de la petició.
   - Si la IP prové de l'Institut Esteve Terrades i Illa (`10.151.0.0/16`, `10.152.0.0/16`, `84.88.151.0/24`, etc.), injecta automàticament el nom oficial i branding a les capçaleres `x-centre-nom` i `x-tenant-*`.
   - En cas d'accés genèric o no reconegut, aplica el tenant neutre per defecte: **BancActiu 3.0 Enterprise**.
2. **Validació Criptogràfica de Sessions**:
   - Cookies amb atributs de seguretat màxima (`HttpOnly`, `SameSite=Lax`, `Secure`).
   - TTL de sessió controlat i revocació en calent.

## 3. Flux de Re-Autenticació Sensible per a Rols Crítics (2FA)
A fi d'evitar interrupcions innecessàries en la navegació rutinària, el component `SensitiveActionAuthModal` s'ha acotat estrictament a tres operacions crítiques:

| Codi d'Acció | Tipus d'Operació | Descripció | Nivell de Risc |
|---|---|---|---|
| `SUPERADMIN_ROLE_CHANGE` | Governança RBAC | Concessió o alteració de privilegis del rol Superadministrador | Crític |
| `MASS_DATA_EXPORT` | Protecció RGPD | Extracció massiva de dades sanitàries protegides o registre d'auditoria | Crític |
| `AUDIT_LAB_NETWORK` | Ciberseguretat | Accés al laboratori d'auditoria, simulador d'estrès o paràmetres de xarxa | Crític |

Qualsevol altra navegació ordinària (alta de centres, catàleg de serveis, assistent Kenzo, llançador de micro-apps) roman transparent i no demana re-autenticació.

## 4. Mapeig de Subxarxes — Institut Esteve Terrades i Illa (Cornellà de Llobregat)
| CIDR / Subxarxa | Àmbit | Ús Autoritzat |
|---|---|---|
| `10.151.0.0/16` | Xarxa Docent | Aules informàtiques, alumnes i entorn formatiu |
| `10.152.0.0/16` | Xarxa Administrativa | Gestió acadèmica i docència |
| `192.168.151.0/24` | Laboratori Local | Aules de desenvolupament i ciberseguretat |
| `192.168.100.0/24` | VLAN Gestió | Servidors i passarel·les locals |
| `172.16.50.0/24` | VLAN Serveis | Infraestructura interna de suport |
| `84.88.151.0/24` | IP Pública Primària | Sortida a Internet corporativa IETI |
| `80.39.151.0/24` | IP Pública Secundària | Connexió de contingència |
| `194.179.0.0/16` | RedIRIS Educació | Anella Científica de Catalunya |
| `84.88.0.0/16` | CSUC General | Consorci de Serveis Universitaris |
| `213.73.0.0/16` | Proveïdor Institucional | Sortida d'alta velocitat |

## 5. Rols i Credencials de Referència (v3.0)
- **Superadministrador Principal**: Marc Cachinero Baranda (DNI: `48956602Z`, Email: `marccachinero@gmail.com`)
- **Superadministrador Institucional**: Mireia Valls i Grau (DNI: `52622304Y`)
- **Usuari Professor Administrador**: Identificador `Administrador`, clau inicial `1234` amb canvi obligatori en el primer inici (`must_change_password: true`).

## 6. Motor SOAR i Behavioral Middleware (Detecció d'Anomalies de Trànsit)
A la capa d'Edge Middleware (`middleware.ts` i `lib/soar-engine.ts`), BancActiu 3.0 implementa un motor de **Security Orchestration, Automation, and Response (SOAR)** basat en telemetria de comportament en temps real:
- **Detecció de Navegació No Humana**: Identifica transicions ultra-ràpides entre rutes protegides (<35 ms) típiques d'scripts d'extracció o brossa automatitzada.
- **Rate-Limiting Adaptatiu per Ràfega (Burst Window)**: Limita ràfegues sobtades a un màxim de 18 peticions per finestra de 2 segons.
- **Orquestració de Quarantena Automàtica (15 Minuts)**: Quan es detecta una violació de patró, la IP o subxarxa `/24` és posada immediatament en aïllament temporal sense intervenció humana, emetent un incident SOAR al panell del Superadmin.
- **Capçaleres de Resposta Perimetrals**:
  - `X-SOAR-Protection`: `ACTIVE-MILITARY-GRADE`
  - `X-Audit-Merkle`: `SHA-256-CHAINED`
  - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy`: `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; frame-ancestors 'none';`

## 7. Compliment Esquema Nacional de Seguretat (ENS Nivell Alt)
Tots els controls tècnics implementats s'alineen amb les mesures de seguretat de l'annex II del Reial Decret 311/2022 (ENS):
- **[mp.info.3] Traçabilitat de l'activitat de l'usuari**: Registre d'auditoria continu.
- **[mp.per.2] Segregació de funcions**: Separació estricta entre usuaris, facultatius i Superadministrador.
- **[mp.com.1] Protecció de la confidencialitat**: Xifratge E2EE en trànsit i repòs.
- **[op.exp.8] Protecció contra denegació de servei**: Filtres de ràfega i quarantena automàtica SOAR.
