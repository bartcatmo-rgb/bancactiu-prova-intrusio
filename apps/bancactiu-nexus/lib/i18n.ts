export type Language = 'ca' | 'es' | 'en';

export const translations = {
  ca: {
    splashSubtitle: "Iniciant entorn segur de coordinació sociosanitària...",
    splashFooter: "Ajuntament de Cornellà · GAPIC Metropolitana Sud",
    hubSubtitle: "Clean UI · Sistema Operatiu Sociosanitari",
    backToLaunchpad: "Tornar al Launchpad",
    closeModule: "Tancar Mòdul",
    activeModulePrefix: "Mòdul Actiu:",
    defaultModuleNotice: "Mòdul operatiu sota protocol RGPD de CatSalut / Ajuntament de Cornellà.",
    footerText: "BancActiu 1.0 · Cornellà de Llobregat / GAPIC Metropolitana Sud",
    modules: {
      users: { title: "Usuaris i Rols", shortTitle: "Usuaris", description: "Control RBAC i permisos Multi-IdP." },
      docs: { title: "Biblioteca Institucional", shortTitle: "Manuals", description: "Manualística, PDFs i guies oficials." },
      peripherals: { title: "Perifèrics (Fase 2)", shortTitle: "Perifèrics", description: "Lectors biomètrics, targetes i DNIe." },
      inventory: { title: "Inventari de Material", shortTitle: "Inventari", description: "Altes, baixes i estoc ortopèdic." },
      institutions: { title: "Governança i Rols", shortTitle: "Governança", description: "Gerència, Salut, Ajuntament i GAPIC." },
      comms: { title: "Comunicacions", shortTitle: "Avisos", description: "Onboarding SMS/Email i idCAT/Cl@ve." },
      sync: { title: "Dades Obertes & Sync", shortTitle: "Dades Obertes", description: "Cens Gencat (Cron 24h RECSS) i rèplica als mirrors." },
      security: { title: "Auditoria i RGPD", shortTitle: "Auditoria", description: "Registre d'accessos i passarel·les OIDC." },
      settings: { title: "Configuració Zero-Code", shortTitle: "Ajustos", description: "Paràmetres globals i desplegament." }
    },
    peripheralsView: {
      title: "Estat de Perifèrics Biomètrics i DNIe (Fase 2)",
      subtitle: "Connexió directa amb lectors d'admissió i signatura de documents oficials.",
      testBtn: "Test de Connectivitat",
      devices: {
        dnie: "Lector DNIe / Targeta Sanitària USB-C",
        wacom: "Tauleta Captura Signatura Digital Wacom",
        biometric: "Sensor Biomètric Òptic FIPS-201"
      }
    },
    inventoryView: {
      title: "Inventari de Material Tècnic Ortopèdic",
      subtitle: "Control i traçabilitat d'actius comunitaris per als sectors de salut.",
      addBtn: "+ Donar d'Alta Actiu",
      cols: { code: "Codi", item: "Material", serial: "Núm. de Sèrie", location: "Ubicació Actual", status: "Estat" },
      statuses: { AVAILABLE: "DISPONIBLE", LOANED: "PRESTAT", MAINTENANCE: "MANTENIMENT", DECOMMISSIONED: "BAIXA" },
      locations: {
        cornella: "Magatzem Central Cornellà",
        citizenHome: "Domicili Ciutadà (SJD Baix Llobregat)",
        gapic: "Magatzem GAPIC Metropolitana"
      }
    },
    commsView: {
      title: "Disparador d'Onboarding Ciutadà (SMS / Email)",
      subtitle: "Emissió automàtica de credencials i avisos de signatura institucional.",
      successMsg: "Notificació tramitada correctament. ID Seguiment:",
      citizenNameLabel: "Nom complet del Ciutadà",
      citizenNamePlaceholder: "Ex. Maria Garcia Lopez",
      phoneLabel: "Mòbil d'avís (SMS / Cl@ve)",
      phonePlaceholder: "Ex. +34 600 000 000",
      emailLabel: "Correu electrònic institucional / ciutadà",
      emailPlaceholder: "ciutada@gencat.cat",
      authMethodLabel: "Mètode d'Autenticació Preferent",
      submitBtn: "Emetre Avís Segur d'Onboarding"
    },
    securityView: {
      title: "Auditoria de Seguretat i Compliment RGPD",
      subtitle: "Registre històric d'accessos i validació de passarel·les d'identitat OIDC.",
      verifyBtn: "Verificar Certificats",
      cols: { timestamp: "Marca de Temps", user: "Identificador / Rol", action: "Acció Registrada", ip: "Origen IP", status: "Estat RGPD" }
    }
  },
  es: {
    splashSubtitle: "Iniciando entorno seguro de coordinación sociosanitaria...",
    splashFooter: "Ayuntamiento de Cornellà · GAPIC Metropolitana Sud",
    hubSubtitle: "Clean UI · Sistema Operativo Sociosanitario",
    backToLaunchpad: "Volver al Launchpad",
    closeModule: "Cerrar Módulo",
    activeModulePrefix: "Módulo Activo:",
    defaultModuleNotice: "Módulo operativo bajo protocolo RGPD de CatSalut / Ayuntamiento de Cornellà.",
    footerText: "BancActiu 1.0 · Cornellà de Llobregat / GAPIC Metropolitana Sud",
    modules: {
      users: { title: "Usuarios y Roles", shortTitle: "Usuarios", description: "Control RBAC y permisos Multi-IdP." },
      docs: { title: "Biblioteca Institucional", shortTitle: "Manuales", description: "Manualística, PDFs y guías oficiales." },
      peripherals: { title: "Periféricos (Fase 2)", shortTitle: "Periféricos", description: "Lectores biométricos, tarjetas y DNIe." },
      inventory: { title: "Inventario de Material", shortTitle: "Inventario", description: "Altas, bajas y stock ortopédico." },
      institutions: { title: "Gobernanza y Roles", shortTitle: "Gobernanza", description: "Gerencia, Salud, Ayuntamiento y GAPIC." },
      comms: { title: "Comunicaciones", shortTitle: "Avisos", description: "Onboarding SMS/Email e idCAT/Cl@ve." },
      sync: { title: "Datos Abiertos y Sync", shortTitle: "Datos Abiertos", description: "Censo Gencat (Cron 24h RECSS) y réplica en mirrors." },
      security: { title: "Auditoría y RGPD", shortTitle: "Auditoría", description: "Registro de accesos y pasarelas OIDC." },
      settings: { title: "Configuración Zero-Code", shortTitle: "Ajustes", description: "Parámetros globales y despliegue." }
    },
    peripheralsView: {
      title: "Estado de Periféricos Biométricos y DNIe (Fase 2)",
      subtitle: "Conexión directa con lectores de admisión y firma de documentos oficiales.",
      testBtn: "Test de Conectividad",
      devices: {
        dnie: "Lector DNIe / Tarjeta Sanitaria USB-C",
        wacom: "Tableta Captura Firma Digital Wacom",
        biometric: "Sensor Biométrico Óptico FIPS-201"
      }
    },
    inventoryView: {
      title: "Inventario de Material Técnico Ortopédico",
      subtitle: "Control y trazabilidad de activos comunitarios para los sectores de salud.",
      addBtn: "+ Dar de Alta Activo",
      cols: { code: "Código", item: "Material", serial: "Núm. de Serie", location: "Ubicación Actual", status: "Estado" },
      statuses: { AVAILABLE: "DISPONIBLE", LOANED: "PRESTADO", MAINTENANCE: "MANTENIMIENTO", DECOMMISSIONED: "BAJA" },
      locations: {
        cornella: "Almacén Central Cornellà",
        citizenHome: "Domicilio Ciudadano (SJD Baix Llobregat)",
        gapic: "Almacén GAPIC Metropolitana"
      }
    },
    commsView: {
      title: "Disparador de Onboarding Ciudadano (SMS / Email)",
      subtitle: "Emisión automática de credenciales y avisos de firma institucional.",
      successMsg: "Notificación tramitada correctamente. ID Seguimiento:",
      citizenNameLabel: "Nombre completo del Ciudadano",
      citizenNamePlaceholder: "Ej. María García López",
      phoneLabel: "Móvil de aviso (SMS / Cl@ve)",
      phonePlaceholder: "Ej. +34 600 000 000",
      emailLabel: "Correo electrónico institucional / ciudadano",
      emailPlaceholder: "ciudadano@gencat.cat",
      authMethodLabel: "Método de Autenticación Preferente",
      submitBtn: "Emitir Aviso Seguro de Onboarding"
    },
    securityView: {
      title: "Auditoría de Seguridad y Cumplimiento RGPD",
      subtitle: "Registro histórico de accesos y validación de pasarelas de identidad OIDC.",
      verifyBtn: "Verificar Certificados",
      cols: { timestamp: "Marca de Tiempo", user: "Identificador / Rol", action: "Acción Registrada", ip: "Origen IP", status: "Estado RGPD" }
    }
  },
  en: {
    splashSubtitle: "Initializing secure socio-sanitary coordination environment...",
    splashFooter: "City Council of Cornellà · GAPIC Metropolitana Sud",
    hubSubtitle: "Clean UI · Socio-Sanitary Operating System",
    backToLaunchpad: "Back to Launchpad",
    closeModule: "Close Module",
    activeModulePrefix: "Active Module:",
    defaultModuleNotice: "Operational module under GDPR protocol of CatSalut / Cornellà City Council.",
    footerText: "BancActiu 1.0 · Cornellà de Llobregat / GAPIC Metropolitana Sud",
    modules: {
      users: { title: "Users & Roles", shortTitle: "Users", description: "RBAC control and Multi-IdP permissions." },
      docs: { title: "Institutional Library", shortTitle: "Manuals", description: "Documentation, PDFs, and official guides." },
      peripherals: { title: "Peripherals (Phase 2)", shortTitle: "Hardware", description: "Biometric readers, smartcards, and eID." },
      inventory: { title: "Equipment Inventory", shortTitle: "Inventory", description: "Check-in, check-out, and orthopedic stock." },
      institutions: { title: "Governance & Roles", shortTitle: "Governance", description: "Management, Health, City Council & GAPIC." },
      comms: { title: "Communications", shortTitle: "Notices", description: "SMS/Email onboarding & idCAT/Cl@ve." },
      sync: { title: "Open Data & Sync", shortTitle: "Open Data", description: "Gencat Census (24h RECSS Cron) and mirror sync." },
      security: { title: "Audit & GDPR", shortTitle: "Audit", description: "Access logs and OIDC gateways." },
      settings: { title: "Zero-Code Settings", shortTitle: "Settings", description: "Global parameters and deployment." }
    },
    peripheralsView: {
      title: "Biometric & eID Peripherals Status (Phase 2)",
      subtitle: "Direct connection with admission readers and official document signing pads.",
      testBtn: "Connectivity Test",
      devices: {
        dnie: "USB-C eID / Health Card Reader",
        wacom: "Wacom Digital Signature Pad",
        biometric: "FIPS-201 Optical Biometric Sensor"
      }
    },
    inventoryView: {
      title: "Orthopedic Technical Equipment Inventory",
      subtitle: "Control and traceability of community assets for healthcare districts.",
      addBtn: "+ Register New Asset",
      cols: { code: "Code", item: "Equipment", serial: "Serial No.", location: "Current Location", status: "Status" },
      statuses: { AVAILABLE: "AVAILABLE", LOANED: "LOANED", MAINTENANCE: "MAINTENANCE", DECOMMISSIONED: "DECOMMISSIONED" },
      locations: {
        cornella: "Cornellà Central Warehouse",
        citizenHome: "Citizen Home (SJD Baix Llobregat)",
        gapic: "GAPIC Metropolitana Warehouse"
      }
    },
    commsView: {
      title: "Citizen Onboarding Dispatcher (SMS / Email)",
      subtitle: "Automated issuance of credentials and institutional signature notifications.",
      successMsg: "Notification processed successfully. Tracking ID:",
      citizenNameLabel: "Citizen Full Name",
      citizenNamePlaceholder: "E.g. Maria Garcia Lopez",
      phoneLabel: "Notification Mobile (SMS / Cl@ve)",
      phonePlaceholder: "E.g. +34 600 000 000",
      emailLabel: "Institutional / Citizen Email",
      emailPlaceholder: "citizen@gencat.cat",
      authMethodLabel: "Preferred Authentication Method",
      submitBtn: "Dispatch Secure Onboarding Notice"
    },
    securityView: {
      title: "Security Audit & GDPR Compliance",
      subtitle: "Historical access log and validation of OIDC identity gateways.",
      verifyBtn: "Verify Certificates",
      cols: { timestamp: "Timestamp", user: "Identifier / Role", action: "Logged Action", ip: "IP Origin", status: "GDPR Status" }
    }
  }
};
