export type GatewayProvider = 
  | 'VIA_OBERTA_AOC'
  | 'CTTI_SALUT_HC3'
  | 'IDCAT_VALID'
  | 'DRETS_SOCIALS_GENCAT'
  | 'INSS_SEG_SOCIAL';

export type GatewayStatus = 'ONLINE' | 'DEGRADED' | 'MAINTENANCE' | 'BLOCKED';

export interface CertificateInfo {
  id: string;
  alias: string;
  issuer: string; // Ex: "EC-SectorPublic (Consorci AOC)"
  subject: string;
  fingerprintSha256: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED';
  keyLengthBits: number;
}

export interface GatewayEndpoint {
  id: string;
  provider: GatewayProvider;
  name: string;
  description: string;
  url: string;
  authMethod: 'mTLS' | 'OAuth2_Institutional' | 'SAML2_Gencat';
  status: GatewayStatus;
  certificateId: string;
  latencyMs: number;
  uptime24h: number;
  lastHealthCheck: string;
  supportedRegisters: string[];
}

export interface InteroperabilityQueryPayload {
  citizenIdentifier: string; // DNI or CIP
  legalBasis: 'CONSENTIMENT_EXPRES_IDCAT' | 'MISSIO_INTERES_PUBLIC_RGPD_6_1_E' | 'OBLIGACIO_LEGAL_SANITARIA';
  requestedRegistry: string;
  professionalDni: string;
  professionalName: string;
  professionalRole: string;
}

export interface MaskedCitizenRecord {
  citizenIdentifierMasked: string;
  fullNameMasked: string;
  birthDateMasked: string;
  addressMasked: string;
  disabilityGradePercent?: number;
  dependencyLevel?: string;
  benefitsSummary?: string;
  unmaskedAvailableForSuperAdmin: boolean;
}

export interface InteroperabilityAuditEntry {
  id: string;
  timestamp: string;
  professionalDni: string;
  professionalName: string;
  professionalRole: string;
  gatewayProvider: GatewayProvider;
  queriedRegistry: string;
  citizenIdentifierMasked: string;
  legalBasis: string;
  ip: string;
  status: 'PERMITTED' | 'ANOMALY_BLOCKED' | 'RATE_LIMITED';
  tamperProofHash: string;
}

export interface AnomalyAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  reason: string;
  sourceIp: string;
  targetRegistry: string;
  actionTaken: 'TEMPORARY_LOCKOUT' | 'NOTIFIED_DPO' | 'FLAGGED';
}
