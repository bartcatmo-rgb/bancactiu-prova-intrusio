// Client Prisma resilient: si @prisma/client esta instal-lat i configurat s'usa la BD SQLite;
// si s'executa en entorn portable USB (sense binaris compilat), fa fallback transparent a les dades de demostracio (demo-store).

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __non_webpack_require__: any;

let prismaClientInstance: any = null;

try {
  // Utilitzem runtime require dinamic perque Webpack no generi advertencies si el modul no hi es
  const dynamicRequire = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : (typeof require === 'function' ? require : null);
  const prismaPkg = dynamicRequire ? dynamicRequire('@prisma/client') : null;
  if (prismaPkg && prismaPkg.PrismaClient) {
    const globalForPrisma = globalThis as unknown as { prisma: any };
    prismaClientInstance =
      globalForPrisma.prisma ??
      new prismaPkg.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
      });
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClientInstance;
  }
} catch {
  // En entorn portable o sense SQLite configurat
  prismaClientInstance = null;
}

// Proxy de seguretat: qualsevol crida que es faci llança error controlat que activa el catch {} dels endpoints
const fallbackHandler: ProxyHandler<any> = {
  get(_target, prop) {
    if (prop === 'then') return undefined;
    return new Proxy(() => Promise.reject(new Error('Prisma fallback mode activat')), fallbackHandler);
  },
  apply() {
    return Promise.reject(new Error('Prisma fallback mode activat'));
  },
};

export const prisma: any = prismaClientInstance ?? new Proxy({}, fallbackHandler);
export default prisma;
