// Multi-Tenant Context Resolution by IP & Host for BancActiu 3.0
// ENS Nivell Alt & Zero-Trust Architecture

export interface TenantConfig {
  id: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  badgeLabel: string;
  badgeVariant: 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';
  themeColor: string;
  allowedModules: string[];
  ipRanges: string[];
  hosts: string[];
  isDefault?: boolean;
}

export const INSTITUTIONAL_TENANTS: TenantConfig[] = [
  {
    id: 'tenant-esteve-terrades',
    code: 'IPFP_ESTEVE_TERRADES',
    name: 'Institut Esteve Terrades i Illa (Cornellà de Llobregat)',
    shortName: 'IPFP Esteve Terrades i Illa',
    description: 'Institut Politècnic de Formació Professional i Innovació · Cornellà de Llobregat',
    badgeLabel: 'IPFP Esteve Terrades i Illa',
    badgeVariant: 'blue',
    themeColor: '#0284c7',
    allowedModules: [
      'bancactiu-nexus',
      'bancactiu-salut',
      'bancactiu-municipal',
      'bancactiu-social',
      'bancactiu-operatiu'
    ],
    ipRanges: [
      '10.151.',
      '10.152.',
      '192.168.151.',
      '192.168.100.',
      '172.16.50.',
      '84.88.151.',
      '80.39.151.',
      '194.179.',
      '84.88.',
      '213.73.'
    ],
    hosts: [
      'esteveterrades.cat',
      'insesteveterrades.cat',
      'ieti.cat',
      'esteveterrades.bancactiu.cat',
      'ieti.bancactiu.cat'
    ]
  },
  {
    id: 'tenant-salut',
    code: 'CATSALUT_GAPIC',
    name: 'Departament de Salut · CatSalut & GAPIC',
    shortName: 'CatSalut / Salut',
    description: 'Xarxa Sanitària i Gestió Clínica d\'Ajudes Tècniques Públiques',
    badgeLabel: 'CatSalut · Àrea Sanitària',
    badgeVariant: 'emerald',
    themeColor: '#059669',
    allowedModules: ['bancactiu-nexus', 'bancactiu-salut', 'bancactiu-operatiu'],
    ipRanges: [
      '10.20.',
      '10.100.',
      '172.20.',
      '192.168.10.',
      '84.88.'
    ],
    hosts: [
      'salut.bancactiu.cat',
      'catsalut.gencat.cat',
      'salut-nexus.vercel.app'
    ]
  },
  {
    id: 'tenant-municipal',
    code: 'AJUNTAMENT_CORNELLA',
    name: 'Ajuntament de Cornellà de Llobregat',
    shortName: 'Ajuntament de Cornellà',
    description: 'Governança Local, Serveis Socials i Mediació Ciutadana',
    badgeLabel: 'Àrea Municipal Cornellà',
    badgeVariant: 'blue',
    themeColor: '#2563eb',
    allowedModules: ['bancactiu-nexus', 'bancactiu-municipal', 'bancactiu-social'],
    ipRanges: [
      '10.200.',
      '172.21.',
      '192.168.20.',
      '80.24.'
    ],
    hosts: [
      'cornella.bancactiu.cat',
      'ajuntament.cornella.cat',
      'municipal-nexus.vercel.app'
    ]
  },
  {
    id: 'tenant-social',
    code: 'TERCER_SECTOR',
    name: 'Xarxa Comunitària & Entitats del Tercer Sector',
    shortName: 'Creu Roja & Tercer Sector',
    description: 'Banc del Temps, Voluntariat Actiu i Inclusió Social',
    badgeLabel: 'Xarxa Social & Tercer Sector',
    badgeVariant: 'rose',
    themeColor: '#e11d48',
    allowedModules: ['bancactiu-nexus', 'bancactiu-social', 'bancactiu-operatiu'],
    ipRanges: [
      '10.300.',
      '172.22.',
      '192.168.30.',
      '193.144.'
    ],
    hosts: [
      'social.bancactiu.cat',
      'creuroja.org',
      'social-nexus.vercel.app'
    ]
  },
  {
    id: 'tenant-default',
    code: 'BANCACTIU_ENTERPRISE',
    name: 'BancActiu 3.0 Enterprise',
    shortName: 'BancActiu 3.0',
    description: 'Plataforma Unificada de Governança i Serveis Sociosanitaris',
    badgeLabel: 'Plataforma Institucional',
    badgeVariant: 'purple',
    themeColor: '#9333ea',
    allowedModules: [
      'bancactiu-nexus',
      'bancactiu-salut',
      'bancactiu-municipal',
      'bancactiu-social',
      'bancactiu-operatiu'
    ],
    ipRanges: ['*'],
    hosts: ['*'],
    isDefault: true
  }
];

// In-Memory store for dynamically registered tenants
let dynamicTenants: TenantConfig[] = [...INSTITUTIONAL_TENANTS];

export function getAllTenants(): TenantConfig[] {
  return [...dynamicTenants];
}

export function registerCustomTenant(newTenant: TenantConfig): void {
  const index = dynamicTenants.findIndex(t => t.id === newTenant.id);
  if (index >= 0) {
    dynamicTenants[index] = newTenant;
  } else {
    // Add before the default fallback tenant
    const defaultIndex = dynamicTenants.findIndex(t => t.isDefault);
    if (defaultIndex >= 0) {
      dynamicTenants.splice(defaultIndex, 0, newTenant);
    } else {
      dynamicTenants.push(newTenant);
    }
  }
}

/**
 * Resolució Dinàmica de Tenant basada en IP i Host
 */
export function resolveTenant(
  clientIp?: string | null,
  requestHost?: string | null,
  explicitParam?: string | null
): TenantConfig {
  const defaultTenant = dynamicTenants.find(t => t.isDefault) || dynamicTenants[dynamicTenants.length - 1];

  // 1. Resolució per paràmetre explícit (p.ex. /?tenant=salut o /?tenant=esteveterrades)
  if (explicitParam) {
    const cleanParam = explicitParam.trim().toLowerCase();
    const matched = dynamicTenants.find(t => 
      t.id.toLowerCase() === cleanParam ||
      t.code.toLowerCase() === cleanParam ||
      t.shortName.toLowerCase().includes(cleanParam) ||
      t.name.toLowerCase().includes(cleanParam) ||
      (cleanParam.includes('ieti') && t.code === 'IPFP_ESTEVE_TERRADES') ||
      (cleanParam.includes('terrades') && t.code === 'IPFP_ESTEVE_TERRADES')
    );
    if (matched) return matched;
  }

  // 2. Resolució per Host / Subdomini
  if (requestHost) {
    const cleanHost = requestHost.toLowerCase().split(':')[0].trim();
    for (const tenant of dynamicTenants) {
      if (tenant.isDefault) continue;
      for (const hostPattern of tenant.hosts) {
        if (cleanHost === hostPattern.toLowerCase() || cleanHost.endsWith('.' + hostPattern.toLowerCase())) {
          return tenant;
        }
        // Subdomain matching (e.g. salut.bancactiu... or cornella.bancactiu...)
        const sub = hostPattern.split('.')[0];
        if (cleanHost.startsWith(sub + '.') || cleanHost.includes('-' + sub + '-')) {
          return tenant;
        }
      }
    }
  }

  // 3. Resolució per Rang d'IP d'Accés
  if (clientIp) {
    const cleanIp = clientIp.split(',')[0].trim();
    for (const tenant of dynamicTenants) {
      if (tenant.isDefault) continue;
      for (const ipPattern of tenant.ipRanges) {
        if (ipPattern === '*') continue;
        if (cleanIp.startsWith(ipPattern) || cleanIp === ipPattern) {
          return tenant;
        }
      }
    }
  }

  // 4. Retorn del Tenant Institucional Neutre per defecte
  return defaultTenant;
}
