/**
 * BancActiu 2.0 - Sistema de Navegació i Enllaços Adaptatius
 * 
 * Gestiona de forma automàtica la resolució d'URLs entre entorns:
 * - Local (desenvolupament): Apunta als ports locals (3000, 3001, 3002, 3003, 3004).
 * - Producció Vercel Cloud: Utilitza rutes relatives unificades (/salut, /municipal, /social, /operatiu)
 *   o dominis configurats via variables d'entorn (NEXT_PUBLIC_*_URL), evitant qualsevol fallada per localhost.
 */

export interface AppNavigationTarget {
  id: string;
  name: string;
  localPort: number;
  localUrl: string;
  productionPath: string;
  envVarKey: string;
}

export const APP_TARGETS: Record<string, AppNavigationTarget> = {
  'bancactiu-nexus': {
    id: 'bancactiu-nexus',
    name: 'BancActiu Nexus',
    localPort: 3000,
    localUrl: 'http://localhost:3000',
    productionPath: '/',
    envVarKey: 'NEXT_PUBLIC_NEXUS_URL'
  },
  'bancactiu-salut': {
    id: 'bancactiu-salut',
    name: 'BancActiu Salut',
    localPort: 3001,
    localUrl: 'http://localhost:3001',
    productionPath: '/salut',
    envVarKey: 'NEXT_PUBLIC_SALUT_URL'
  },
  'bancactiu-municipal': {
    id: 'bancactiu-municipal',
    name: 'BancActiu Municipal',
    localPort: 3002,
    localUrl: 'http://localhost:3002',
    productionPath: '/municipal',
    envVarKey: 'NEXT_PUBLIC_MUNICIPAL_URL'
  },
  'bancactiu-social': {
    id: 'bancactiu-social',
    name: 'BancActiu Social',
    localPort: 3003,
    localUrl: 'http://localhost:3003',
    productionPath: '/social',
    envVarKey: 'NEXT_PUBLIC_SOCIAL_URL'
  },
  'bancactiu-operatiu': {
    id: 'bancactiu-operatiu',
    name: 'BancActiu Operatiu',
    localPort: 3004,
    localUrl: 'http://localhost:3004',
    productionPath: '/operatiu',
    envVarKey: 'NEXT_PUBLIC_OPERATIU_URL'
  },
  'bancactiu-operatiu-1.0': {
    id: 'bancactiu-operatiu-1.0',
    name: 'BancActiu Operatiu 1.0',
    localPort: 3004,
    localUrl: 'http://localhost:3004',
    productionPath: '/operatiu',
    envVarKey: 'NEXT_PUBLIC_OPERATIU_URL'
  }
};

/**
 * Determina si l'execució actual és en entorn de producció (núvol Vercel o domini públic)
 */
export function isProductionEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Si el navegador és a localhost o 127.0.0.1, estem en entorn de proves local
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return false;
    }
    // Qualsevol altre domini (.vercel.app o corporatiu) és producció
    return true;
  }

  // Comprovació en SSR
  return process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}

/**
 * Resol la URL de destí d'una aplicació adaptant-se automàticament a l'entorn
 */
export function resolveAppTargetUrl(appId: string, customPort?: number): string {
  const target = APP_TARGETS[appId];
  const isProd = isProductionEnvironment();

  if (!isProd) {
    // Mode Local: Fes servir els ports de desenvolupament
    const port = customPort || target?.localPort || 3000;
    return `http://localhost:${port}`;
  }

  // Mode Producció (Vercel Cloud):
  // 1. Prioritat: Variables d'entorn explícites si s'utilitzen dominis separats
  if (typeof process !== 'undefined' && process.env) {
    if (appId === 'bancactiu-nexus' && process.env.NEXT_PUBLIC_NEXUS_URL) {
      return process.env.NEXT_PUBLIC_NEXUS_URL;
    }
    if (appId === 'bancactiu-salut' && process.env.NEXT_PUBLIC_SALUT_URL) {
      return process.env.NEXT_PUBLIC_SALUT_URL;
    }
    if (appId === 'bancactiu-municipal' && process.env.NEXT_PUBLIC_MUNICIPAL_URL) {
      return process.env.NEXT_PUBLIC_MUNICIPAL_URL;
    }
    if (appId === 'bancactiu-social' && process.env.NEXT_PUBLIC_SOCIAL_URL) {
      return process.env.NEXT_PUBLIC_SOCIAL_URL;
    }
    if ((appId === 'bancactiu-operatiu' || appId === 'bancactiu-operatiu-1.0') && process.env.NEXT_PUBLIC_OPERATIU_URL) {
      return process.env.NEXT_PUBLIC_OPERATIU_URL;
    }
  }

  // 2. Ruta relativa unificada sobre el mateix domini de producció
  return target?.productionPath || `/${appId.replace('bancactiu-', '')}`;
}
