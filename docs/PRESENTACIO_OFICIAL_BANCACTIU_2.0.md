# Dossier de Presentació Oficial: BancActiu 2.0 Enterprise

> **Plataforma Integral de Gestió d'Ajudes Tècniques, Suport a la Dependència i Ciberseguretat Hospitalària**  
> Presentació Institucional davant la Generalitat de Catalunya &middot; Departament de Salut &middot; Ajuntament de Cornellà &middot; Creu Roja

---

## Índex de Diapositives Executives

1. [Diapositiva 1: Portada i Visió Estratègica](#diapositiva-1-portada-i-visió-estratègica)
2. [Diapositiva 2: El Repte de l'Accessibilitat i la Dependència a Catalunya](#diapositiva-2-el-repte-de-laccessibilitat-i-la-dependència-a-catalunya)
3. [Diapositiva 3: Arquitectura Modular Descentralitzada (5 Micro-Aplicacions)](#diapositiva-3-arquitectura-modular-descentralitzada-5-micro-aplicacions)
4. [Diapositiva 4: Base de Dades Compartida i Traçabilitat Forense (@bancactiu/db)](#diapositiva-4-base-de-dades-compartida-i-traçabilitat-forense-bancactiudb)
5. [Diapositiva 5: Blindatge de Seguretat Zero-Trust i Compliment ENS Nivell Alt](#diapositiva-5-blindatge-de-seguretat-zero-trust-i-compliment-ens-nivell-alt)
6. [Diapositiva 6: Mòdul Salut (Prescripció Mèdica i Escala Barthel a CAPs)](#diapositiva-6-mòdul-salut-prescripció-mèdica-i-escala-barthel-a-caps)
7. [Diapositiva 7: Mòdul Municipal (Ajuntament de Cornellà, Padró i SAD)](#diapositiva-7-mòdul-municipal-ajuntament-de-cornellà-padró-i-sad)
8. [Diapositiva 8: Mòdul Social & Operatiu (Creu Roja, Llei 39/2006 i Magatzem)](#diapositiva-8-mòdul-social--operatiu-creu-roja-llei-392006-i-magatzem)
9. [Diapositiva 9: Assistent Intel·ligent Kenzo / Kenza / Kenz Core & Simulació](#diapositiva-9-assistent-intel·ligent-kenzo--kenza--kenz-core--simulació)
10. [Diapositiva 10: Full de Ruta, Pasarel·les AOC i Model d'Homologació 2026](#diapositiva-10-full-de-ruta-pasarel·les-aoc-i-model-dhomologació-2026)

---

### Diapositiva 1: Portada i Visió Estratègica

* **Títol**: BancActiu 2.0: Ecosistema Descentralitzat de Salut i Benestar
* **Subtítol**: Transformació digital de la prescripció, recuperació i préstec comunitari d'ajudes tècniques a Catalunya
* **Emissors**: Departament de Salut &middot; CatSalut &middot; Gerència Metropolitana Sud &middot; Ajuntament de Cornellà &middot; Creu Roja
* **Punts Clau**:
  * Superació del model fragmentat tradicional.
  * Connexió directa entre atenció primària (CAPs), serveis socials municipals i voluntariat.
  * Traçabilitat biomètrica i documental integral de cada recurs mèdic (cadires de rodes, llits articulats, caminadors).
* **Notes de l'Orador**: *"BancActiu 2.0 no és només un programa informàtic, sinó un nou model de governança col·laborativa pública i comunitària que garanteix que cap ciutadà en situació de dependència es quedi sense recurs per motius burocràtics."*

---

### Diapositiva 2: El Repte de l'Accessibilitat i la Dependència a Catalunya

* **Dades Demogràfiques**:
  * Més d'un 19% de la població de Catalunya supera els 65 anys; a l'Àrea Metropolitana el creixement d'octogenaris és exponencial.
  * Termini mitjà històric d'obtenció d'una ajuda tècnica per via ordinària: 4 a 9 mesos.
  * BancActiu 2.0 redueix aquest temps a **menys de 48 hores** en casos d'urgència residencial o alta hospitalària post-ictus.
* **Impacte Econòmic i Ambiental**:
  * Model d'economia circular: Taxa de reutilització d'ajudes tècniques assolida del **94.2%**.
  * Estalvi estimat per gerència sanitària: més de 420.000 € anuals en compres no recurrents.

---

### Diapositiva 3: Arquitectura Modular Descentralitzada (5 Micro-Aplicacions)

* **Estructura Monorepo 2.0**:
  1. **BancActiu Nexus (Port 3000 / `/`)**: Gateway Launcher, Superadministració arrel (DNI `52622304Y`), Kenzo AI i auditoria.
  2. **BancActiu Salut (Port 3001 / `/salut`)**: Validació mèdica per a facultatius de CAPs i hospitals, escala Barthel.
  3. **BancActiu Municipal (Port 3002 / `/municipal`)**: Gestió d'accessibilitat municipal, subvencions i padró a Cornellà.
  4. **BancActiu Social (Port 3003 / `/social`)**: Llei de Dependència 39/2006, Creu Roja i taller de manteniment.
  5. **BancActiu Operatiu (Port 3004 / `/operatiu`)**: Logística UAC de taulell, impressió QR i control d'estoc.
* **Benefici d'Arquitectura**: Cada aplicació pot escalar, actualitzar-se i desplegar-se de forma independent sense caiguda del conjunt del sistema.

---

### Diapositiva 4: Base de Dades Compartida i Traçabilitat Forense (@bancactiu/db)

* **Paquet Central `@bancactiu/db`**:
  * Model de dades compartit en memòria i persistent que unifica l'expedient ciutadà entre entitats.
  * Eliminació de duplicitats: el CIP sanitari de CatSalut i el NIF del padró municipal s'enllacen de manera transparent.
* **AuditLog Forense Immutable**:
  * Registre criptogràfic de totes les intervencions amb identificador únic, DNI del professional, timestamp ISO i signatura de conformitat RGPD.

---

### Diapositiva 5: Blindatge de Seguretat Zero-Trust i Compliment ENS Nivell Alt

* **Mecanismes de Seguretat**:
  * **Edge Middleware**: Intercepta qualsevol petició a la xarxa de Vercel i exigeix cookie signada `bancactiu_session`.
  * **Identitat Arrel Superadmin**: Vinculada exclusivament al DNI `52622304Y` (Mireia Valls i Grau).
  * **Login Net**: Prohibició absoluta d'autofill o credencials hardcoded.
  * **Certificats Digitals Oficials**: Validació automàtica amb idCAT, T-CAT de CatSalut i DNIe.
* **Aïllament de Xarxa Dual**:
  * En local: navegació per ports aïllats `localhost:3000-3004`.
  * En producció Vercel Cloud: rutes unificades relatives sense cap dependència de localhost.

---

### Diapositiva 6: Mòdul Salut (Prescripció Mèdica i Escala Barthel a CAPs)

* **Funcionalitats Clíniques**:
  * Cua de prescripcions ortopèdiques pendents d'avaluació en temps real.
  * Calculadora interactiva d'autonomia funcional mitjançant l'Escala de Barthel (0 a 100 punts).
  * Validació en un sol clic amb signatura facultativa i derivació automàtica al magatzem de recursos.
* **Centres Integrats**:
  * CAP Sant Ildefons, CAP Bellvitge, CAP Just Oliveras, Hospital Universitari de Bellvitge.

---

### Diapositiva 7: Mòdul Municipal (Ajuntament de Cornellà, Padró i SAD)

* **Acció Social Local**:
  * Connexió amb el Padró Municipal d'Habitants per verificar residència immediata.
  * Tramitació d'ajuts econòmics d'urgència per a la fiança de materials d'alta gamma.
  * Coordinació amb el Servei d'Atenció Domiciliària (SAD) per a l'entrega i instal·lació a domicilis vulnerables.

---

### Diapositiva 8: Mòdul Social & Operatiu (Creu Roja, Llei 39/2006 i Magatzem)

* **Tercer Sector & Solidaritat**:
  * Fitxa d'intervenció familiar sota la Llei de Dependència 39/2006 amb pla individualitzat d'atenció (PIA).
  * Gestió del taller mecànic solidari de Creu Roja: desinfecció, reparació de frens, canvi de bateries i posada a punt.
* **Taulell UAC & Logística**:
  * Lectura ràpida de codis QR i barres amb càmera o lector làser.
  * Préstecs presencials amb signatura digital idCAT Mòbil i alertes automàtiques de data de devolució.

---

### Diapositiva 9: Assistent Intel·ligent Kenzo / Kenza / Kenz Core & Simulació

* **Tres Perfils d'Aparència Selectables**:
  * **Kenzo**: Assistent executiu masculí (ciberseguretat, governança, blau/cian).
  * **Kenza**: Assistenta executiva femenina (acció comunitària, relacions institucionals, rosa/fúcsia).
  * **Kenz Core**: Nucli hologràfic (rendiment analític, maragda/teal).
* **Laboratori d'Estrès (Stress & Security Lab)**:
  * Simulació de càrrega massiva a escala de Catalunya: 250.000 operacions simultànies provades amb èxit (temps de resposta mitjà de 16.4 ms).

---

### Diapositiva 10: Full de Ruta, Pasarel·les AOC i Model d'Homologació 2026

* **Propers Passos**:
  * Integració amb la plataforma Via Oberta de l'Administració Oberta de Catalunya (AOC).
  * Homologació amb el Catàleg d'Ajudes Tècniques de l'Institut Català d'Assistència i Serveis Socials (ICASS).
  * Desplegament de la xarxa a les comarques del Baix Llobregat, Vallès Occidental i Barcelonès.
* **Estat Actual del Desplegament**:
  * Producció activa a Vercel Cloud: `https://banc-actiu-2-0-separacion-entidades.vercel.app`
  * Codi font auditat i sincronitzat a GitHub (`bartcatmo-rgb`).
