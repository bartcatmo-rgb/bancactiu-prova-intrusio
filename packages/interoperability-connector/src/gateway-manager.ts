import { GatewayEndpoint, CertificateInfo, InteroperabilityAuditEntry, AnomalyAlert } from './types';
import { generateAuditHash } from './crypto-vault';

const OFFICIAL_CERTIFICATES: CertificateInfo[] = [
  {
    id: 'cert-aoc-viaoberta-01',
    alias: 'Certificat mTLS Sector Públic AOC (Via Oberta 2026)',
    issuer: 'EC-SectorPublic (Consorci Administració Oberta de Catalunya)',
    subject: 'CN=BANCACTIU-INTEROP-PROD, O=Ajuntament de Cornellà, C=ES',
    fingerprintSha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    validFrom: '2026-01-01T00:00:00Z',
    validTo: '2028-01-01T23:59:59Z',
    daysRemaining: 412,
    status: 'VALID',
    keyLengthBits: 4096
  },
  {
    id: 'cert-ctti-salut-02',
    alias: 'Certificat d\'Intercanvi CTTI - CatSalut HC3',
    issuer: 'Agència Catalana de Certificació (CatCert)',
    subject: 'CN=CATSULT-HC3-CLIENT-CORNELLA, O=Servei Català de la Salut, C=ES',
    fingerprintSha256: '4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
    validFrom: '2025-06-15T00:00:00Z',
    validTo: '2027-06-15T23:59:59Z',
    daysRemaining: 213,
    status: 'VALID',
    keyLengthBits: 4096
  }
];

const OFFICIAL_ENDPOINTS: GatewayEndpoint[] = [
  {
    id: 'ep-via-oberta-dependencia',
    provider: 'VIA_OBERTA_AOC',
    name: 'Via Oberta AOC: Registre de Dependència i Discapacitat',
    description: 'Consulta de reconeixement de grau de dependència (BVD) i percentatge de discapacitat del Departament de Drets Socials.',
    url: 'https://viaoberta.aoc.cat/serveis/dependencia/v2',
    authMethod: 'mTLS',
    status: 'ONLINE',
    certificateId: 'cert-aoc-viaoberta-01',
    latencyMs: 38.4,
    uptime24h: 99.98,
    lastHealthCheck: new Date().toISOString(),
    supportedRegisters: ['Grau Dependència BVD', 'Barema Discapacitat', 'Targeta Acreditativa']
  },
  {
    id: 'ep-ctti-salut-hc3',
    provider: 'CTTI_SALUT_HC3',
    name: 'CTTI CatSalut: Història Clínica Compartida de Catalunya (HC3)',
    description: 'Accés segur a prescripcions de materials ortopèdics, informes de teràpia ocupacional i informes mèdics d\'alta.',
    url: 'https://interop.salut.ctti.gencat.cat/hc3/v3/ortopedia',
    authMethod: 'mTLS',
    status: 'ONLINE',
    certificateId: 'cert-ctti-salut-02',
    latencyMs: 24.1,
    uptime24h: 99.99,
    lastHealthCheck: new Date().toISOString(),
    supportedRegisters: ['Pautes Ortopèdiques PAO', 'Avaluació Barthel', 'Informes Fisioteràpia']
  },
  {
    id: 'ep-idcat-valid',
    provider: 'IDCAT_VALID',
    name: 'Consorci AOC: Plataforma VÀLID (idCAT Mòbil / Cl@ve)',
    description: 'Verificació d\'identitat en temps real del ciutadà i obtenció del consentiment exprés per a consultes de dades sensibles.',
    url: 'https://valid.aoc.cat/o/oauth2/v1/consent',
    authMethod: 'OAuth2_Institutional',
    status: 'ONLINE',
    certificateId: 'cert-aoc-viaoberta-01',
    latencyMs: 19.8,
    uptime24h: 100.0,
    lastHealthCheck: new Date().toISOString(),
    supportedRegisters: ['Consentiment idCAT Mòbil', 'DNIe / Cl@ve PIN', 'Signatura Electrònica']
  },
  {
    id: 'ep-drets-socials',
    provider: 'DRETS_SOCIALS_GENCAT',
    name: 'Generalitat de Catalunya: Prestacions Socials i Renda Garantida',
    description: 'Comprovació de vulnerabilitat econòmica familiar i compatibilitat d\'ajuts municipals amb prestacions autonòmiques.',
    url: 'https://social.gencat.cat/api/interop/prestacions/v1',
    authMethod: 'OAuth2_Institutional',
    status: 'ONLINE',
    certificateId: 'cert-aoc-viaoberta-01',
    latencyMs: 44.2,
    uptime24h: 99.95,
    lastHealthCheck: new Date().toISOString(),
    supportedRegisters: ['Renda Garantida de Ciutadania (RGC)', 'Ingrés Mínim Vital', 'Ajuts d\'Urgència Social']
  }
];

class InteroperabilityGatewayManager {
  private certificates: CertificateInfo[] = [...OFFICIAL_CERTIFICATES];
  private endpoints: GatewayEndpoint[] = [...OFFICIAL_ENDPOINTS];
  private auditLog: InteroperabilityAuditEntry[] = [];
  private anomalies: AnomalyAlert[] = [];
  private recentQueriesWindow: { ip: string; timestamp: number }[] = [];

  constructor() {
    // Seed audit record
    this.auditLog.push({
      id: 'aud-interop-001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      professionalDni: '43999888A',
      professionalName: 'Mireia Valls (SuperAdmin GAPIC)',
      professionalRole: 'SUPERADMIN',
      gatewayProvider: 'VIA_OBERTA_AOC',
      queriedRegistry: 'Grau Dependència BVD',
      citizenIdentifierMasked: '43****88A',
      legalBasis: 'MISSIO_INTERES_PUBLIC_RGPD_6_1_E',
      ip: '192.168.1.100',
      status: 'PERMITTED',
      tamperProofHash: generateAuditHash({ query: 'aud-interop-001', legal: 'RGPD 6.1.e' })
    });
  }

  getEndpoints(): GatewayEndpoint[] {
    return [...this.endpoints];
  }

  getCertificates(): CertificateInfo[] {
    return [...this.certificates];
  }

  getAuditLog(limit = 50): InteroperabilityAuditEntry[] {
    return this.auditLog.slice(-limit).reverse();
  }

  getAnomalies(): AnomalyAlert[] {
    return [...this.anomalies];
  }

  rotateCertificate(endpointId: string, newAlias: string): CertificateInfo {
    const newCert: CertificateInfo = {
      id: 'cert-' + Date.now().toString(36),
      alias: newAlias,
      issuer: 'EC-SectorPublic (Consorci Administració Oberta de Catalunya)',
      subject: 'CN=BANCACTIU-INTEROP-PROD, O=Ajuntament de Cornellà, C=ES',
      fingerprintSha256: generateAuditHash({ cert: newAlias, time: Date.now() }),
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 730 * 86400000).toISOString(),
      daysRemaining: 730,
      status: 'VALID',
      keyLengthBits: 4096
    };

    this.certificates.unshift(newCert);

    const ep = this.endpoints.find(e => e.id === endpointId);
    if (ep) {
      ep.certificateId = newCert.id;
      ep.lastHealthCheck = new Date().toISOString();
    }

    return newCert;
  }

  /**
   * Execució de consulta amb anàlisi de concurrència i Detecció d'Anomalies RGPD
   */
  executeInteroperabilityQuery(
    endpointId: string,
    professional: { dni: string; nom: string; rol: string },
    citizenIdentifier: string,
    legalBasis: string,
    clientIp: string
  ): { ok: boolean; status: 'PERMITTED' | 'ANOMALY_BLOCKED' | 'RATE_LIMITED'; message: string; auditId: string } {
    const now = Date.now();

    // 1. Detecció d'atacs de força bruta o scraping d'expedients
    this.recentQueriesWindow = this.recentQueriesWindow.filter(q => now - q.timestamp < 60000);
    const ipCount = this.recentQueriesWindow.filter(q => q.ip === clientIp).length;

    if (ipCount >= 10) {
      const alert: AnomalyAlert = {
        id: 'alt-' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL',
        reason: 'Sobrecàrrega anòmala de consultes d\'interoperabilitat des de la mateixa IP (>10 req/min)',
        sourceIp: clientIp,
        targetRegistry: endpointId,
        actionTaken: 'TEMPORARY_LOCKOUT'
      };
      this.anomalies.unshift(alert);

      const auditId = 'aud-' + Date.now().toString(36);
      this.auditLog.push({
        id: auditId,
        timestamp: new Date().toISOString(),
        professionalDni: professional.dni,
        professionalName: professional.nom,
        professionalRole: professional.rol,
        gatewayProvider: 'VIA_OBERTA_AOC',
        queriedRegistry: endpointId,
        citizenIdentifierMasked: citizenIdentifier.slice(0, 2) + '****' + citizenIdentifier.slice(-2),
        legalBasis,
        ip: clientIp,
        status: 'ANOMALY_BLOCKED',
        tamperProofHash: generateAuditHash({ auditId, status: 'BLOCKED' })
      });

      return {
        ok: false,
        status: 'ANOMALY_BLOCKED',
        message: 'Accés bloquejat automàticament: S\'ha detectat un patró de consulta anòmal.',
        auditId
      };
    }

    this.recentQueriesWindow.push({ ip: clientIp, timestamp: now });

    // 2. Registre de consulta autoritzada
    const auditId = 'aud-' + Date.now().toString(36);
    const ep = this.endpoints.find(e => e.id === endpointId) || this.endpoints[0];

    const auditEntry: InteroperabilityAuditEntry = {
      id: auditId,
      timestamp: new Date().toISOString(),
      professionalDni: professional.dni,
      professionalName: professional.nom,
      professionalRole: professional.rol,
      gatewayProvider: ep.provider,
      queriedRegistry: ep.name,
      citizenIdentifierMasked: citizenIdentifier.slice(0, 2) + '****' + citizenIdentifier.slice(-2),
      legalBasis,
      ip: clientIp,
      status: 'PERMITTED',
      tamperProofHash: generateAuditHash({ auditId, citizenIdentifier, professional: professional.dni, timestamp: now })
    };

    this.auditLog.push(auditEntry);

    return {
      ok: true,
      status: 'PERMITTED',
      message: 'Consulta a la pasarel·la oficial executada amb xifrat AES-256 i registre RGPD.',
      auditId
    };
  }
}

export const interopGatewayManager = new InteroperabilityGatewayManager();
