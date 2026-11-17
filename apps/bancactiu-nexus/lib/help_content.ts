export interface HelpTopic {
  id: string;
  title: Record<'ca' | 'es' | 'en', string>;
  summary: Record<'ca' | 'es' | 'en', string>;
  content: Record<'ca' | 'es' | 'en', string[]>;
}

export const helpTopics: HelpTopic[] = [
  {
    id: 'peripherals',
    title: {
      ca: "Gestió de Perifèrics i DNIe (Fase 2)",
      es: "Gestión de Periféricos y DNIe (Fase 2)",
      en: "Peripherals & eID Management (Phase 2)"
    },
    summary: {
      ca: "Guia per connectar i validar lectors de targeta sanitària, DNI electrònic i tauletes de signatura biomètrica.",
      es: "Guía para conectar y validar lectores de tarjeta sanitaria, DNI electrónico y tabletas de firma biométrica.",
      en: "Guide to connect and validate health card readers, electronic IDs, and biometric signature pads."
    },
    content: {
      ca: [
        "1. Assegureu-vos que el dispositiu USB (DNIe o Wacom) està connectat al port USB-C autoritzat.",
        "2. El sistema reconeixerà automàticament el VID/PID del fabricant sota estàndards FIPS-201.",
        "3. Realitzeu el test de connectivitat des del panell de SuperAdmin per verificar el certificat de signatura."
      ],
      es: [
        "1. Asegúrese de que el dispositivo USB (DNIe o Wacom) está conectado al puerto USB-C autorizado.",
        "2. El sistema reconocerá automáticamente el VID/PID del fabricante bajo estándares FIPS-201.",
        "3. Realice el test de conectividad desde el panel de SuperAdmin para verificar el certificado de firma."
      ],
      en: [
        "1. Ensure the USB device (eID or Wacom pad) is connected to the authorized USB-C port.",
        "2. The system will automatically recognize the manufacturer's VID/PID under FIPS-201 standards.",
        "3. Perform the connectivity test from the SuperAdmin panel to verify the signing certificate."
      ]
    }
  },
  {
    id: 'inventory',
    title: {
      ca: "Control d'Inventari Ortopèdic",
      es: "Control de Inventario Ortopédico",
      en: "Orthopedic Inventory Control"
    },
    summary: {
      ca: "Procediment d'alta, baixa i assignació de material tècnic a expedients de ciutadans.",
      es: "Procedimiento de alta, baja y asignación de material técnico a expedientes de ciudadanos.",
      en: "Procedure for registering, decommissioning, and assigning technical equipment to citizen files."
    },
    content: {
      ca: [
        "1. Accediu al mòdul d'Inventari des del SuperAdmin Hub.",
        "2. Utilitzeu el botó '+ Donar d'Alta Actiu' per registrar nous productes (cadires de rodes, llits articulats).",
        "3. Cada actiu queda vinculat unívocament al número de sèrie i a l'expedient del ciutadà receptor."
      ],
      es: [
        "1. Acceda al módulo de Inventario desde el SuperAdmin Hub.",
        "2. Utilice el botón '+ Dar de Alta Activo' para registrar nuevos productos (sillas de ruedas, camas articuladas).",
        "3. Cada activo queda vinculado unívocamente al número de serie y al expediente del ciudadano receptor."
      ],
      en: [
        "1. Access the Inventory module from the SuperAdmin Hub.",
        "2. Use the '+ Register New Asset' button to log new items (wheelchairs, adjustable beds).",
        "3. Each asset is uniquely linked to its serial number and the recipient citizen's file."
      ]
    }
  },
  {
    id: 'onboarding',
    title: {
      ca: "Onboarding i Credencials (idCAT / Cl@ve)",
      es: "Onboarding y Credenciales (idCAT / Cl@ve)",
      en: "Onboarding & Credentials (idCAT / Cl@ve)"
    },
    summary: {
      ca: "Emissió d'avisos multicanal (SMS/Email) i validació d'identitat digital segura.",
      es: "Emisión de avisos multicanal (SMS/Email) y validación de identidad digital segura.",
      en: "Issuance of multichannel notices (SMS/Email) and secure digital identity validation."
    },
    content: {
      ca: [
        "1. Introduïu les dades del ciutadà al mòdul de Comunicacions.",
        "2. Seleccioneu el mètode d'autenticació (idCAT Mòbil, Cl@ve o DNIe).",
        "3. El sistema genera un identificador de traçabilitat auditable sota normativa RGPD i ENS."
      ],
      es: [
        "1. Introduzca los datos del ciudadano en el módulo de Comunicaciones.",
        "2. Seleccione el método de autenticación (idCAT Mòbil, Cl@ve o DNIe).",
        "3. El sistema genera un identificador de trazabilidad auditable bajo normativa RGPD y ENS."
      ],
      en: [
        "1. Enter the citizen's details in the Communications module.",
        "2. Select the authentication method (idCAT Mòbil, Cl@ve, or eID).",
        "3. The system generates an auditable traceability identifier under GDPR and ENS regulations."
      ]
    }
  }
];
