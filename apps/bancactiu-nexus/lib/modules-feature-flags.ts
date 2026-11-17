/**
 * BancActiu 3.0 Enterprise - Institutional Modules Feature Flags
 * Controla l'activació sota demanda dels mòduls sense eliminar el codi font.
 */

export interface SystemModuleConfig {
  id: string;
  name: string;
  description: string;
  enabledByDefault: boolean;
  category: 'clinical' | 'social' | 'technical' | 'administrative';
}

export const INSTITUTIONAL_MODULE_FLAGS: Record<string, boolean> = {
  // Mòdul d'Integració idCAT Mòbil (AOC): Desactivat per defecte a l'espera de validació del conveni i certificat de segell
  IDCAT_MOVIL_ENABLED: false,

  // Mòdul de Serveis Socials i Dependència: Present al codi però desactivat per defecte (activable sota demanda)
  SOCIAL_SERVICES_ENABLED: false,

  // Mòduls operatius principals: Actius per defecte
  CAP_MEDICAL_LOANS_ENABLED: true,
  WORKSHOP_REPAIRS_ENABLED: true,
  SUPERADMIN_AUDIT_ENABLED: true,
  SOAR_SECURITY_ENGINE_ENABLED: true,
};

export const SYSTEM_MODULES_CATALOG: SystemModuleConfig[] = [
  {
    id: 'IDCAT_MOVIL_ENABLED',
    name: 'idCAT Mòbil (Consorci AOC)',
    description: 'Autenticació ciutadana via OTP/SMS del Consorci AOC (requereix conveni institucional).',
    enabledByDefault: false,
    category: 'administrative',
  },
  {
    id: 'SOCIAL_SERVICES_ENABLED',
    name: 'Serveis Socials & Expedients de Dependència',
    description: 'Gestió d’ajuts no monetàries, barems socials i atenció domiciliària.',
    enabledByDefault: false,
    category: 'social',
  },
  {
    id: 'CAP_MEDICAL_LOANS_ENABLED',
    name: 'Préstecs d’Ajudes Tècniques & CAP',
    description: 'Prescripció d’ortopèdia, control de pacients i generació de codis QR.',
    enabledByDefault: true,
    category: 'clinical',
  },
  {
    id: 'WORKSHOP_REPAIRS_ENABLED',
    name: 'Taller & Reparacions (Creu Roja)',
    description: 'Cicle de vida de 4 estats per a avaries i homologació de seguretat.',
    enabledByDefault: true,
    category: 'technical',
  },
];

export function isModuleActive(moduleId: string): boolean {
  return INSTITUTIONAL_MODULE_FLAGS[moduleId] ?? false;
}
