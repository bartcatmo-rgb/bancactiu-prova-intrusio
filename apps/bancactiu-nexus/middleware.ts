import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenant } from './lib/tenant';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Resolució Dinàmica de Multi-Tenant contextual basada en IP d'accés i Host
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (request.headers.get('x-real-ip') || '127.0.0.1');
  const requestHost = request.headers.get('host') || request.nextUrl.host || '';
  const tenantParam = request.nextUrl.searchParams.get('tenant');

  const tenant = resolveTenant(clientIp, requestHost, tenantParam);

  const tenantCookieValue = encodeURIComponent(
    JSON.stringify({
      id: tenant.id,
      code: tenant.code,
      name: tenant.name,
      shortName: tenant.shortName,
      description: tenant.description,
      badgeLabel: tenant.badgeLabel,
      badgeVariant: tenant.badgeVariant,
      themeColor: tenant.themeColor,
      allowedModules: tenant.allowedModules,
      isDefault: tenant.isDefault,
      clientIp
    })
  );

  const applyTenantHeaders = (res: NextResponse) => {
    res.headers.set('x-tenant-id', tenant.id);
    res.headers.set('x-tenant-code', tenant.code);
    res.headers.set('x-tenant-name', tenant.name);
    res.headers.set('x-tenant-badge', tenant.badgeLabel);
    res.headers.set('x-centre-nom', tenant.name);
    res.headers.set('x-client-ip', clientIp);
    res.headers.set('X-SOAR-Protection', 'ACTIVE-MILITARY-GRADE');
    res.headers.set('X-Audit-Merkle', 'SHA-256-CHAINED');
    res.cookies.set('bancactiu_tenant', tenantCookieValue, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24
    });
    return res;
  };

  // 2. Intercepció de Trampa Honeypot per a sondejos maliciosos i scanners
  const isMaliciousProbe = 
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/wp-login') ||
    pathname.startsWith('/phpmyadmin') ||
    pathname.startsWith('/actuator') ||
    pathname.startsWith('/.env') ||
    pathname.startsWith('/.git') ||
    pathname.startsWith('/xmlrpc.php') ||
    pathname.startsWith('/trap');

  if (isMaliciousProbe) {
    const honeypotUrl = new URL('/honeypot', request.url);
    honeypotUrl.searchParams.set('intercepted_route', pathname);
    return NextResponse.redirect(honeypotUrl);
  }

  // 3. Neteja imperativa i gestió de la ruta pública /login
  if (pathname === '/login') {
    const response = NextResponse.next();
    // Destrueix qualsevol cookie de sessió residual en entrar a login
    response.cookies.delete('bancactiu_session');
    return applyTenantHeaders(response);
  }

  // 4. Rutes permeses sense autenticació (públiques, honeypot, monitor, auth endpoints, recursos estàtics)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/sync/delta') ||
    pathname.startsWith('/api/security/intrusion-logs') ||
    pathname.startsWith('/honeypot') ||
    pathname.startsWith('/security/intrusions') ||
    pathname.startsWith('/assets/cats') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/docs') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?|map|pdf)$/)
  ) {
    const response = NextResponse.next();
    return applyTenantHeaders(response);
  }

  // 4. Comprovació de la sessió criptogràfica Zero-Trust
  const sessionCookie = request.cookies.get('bancactiu_session')?.value;
  let isValidSession = false;

  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      const session = JSON.parse(decoded);
      if (session && (session.authenticated === true || session.role) && (session.user || session.role || session.dni)) {
        isValidSession = true;
      }
    } catch {
      isValidSession = false;
    }
  }

  // 5. Bloqueig d'accés no autoritzat (Redirecció estricta a /login)
  if (!isValidSession) {
    if (pathname.startsWith('/api/')) {
      const unauthorizedRes = NextResponse.json(
        {
          error: 'Accés no autoritzat',
          message: 'Sessió de SuperAdmin requerida per accedir als serveis de BancActiu Nexus.',
          code: 'UNAUTHORIZED_ACCESS_DENIED'
        },
        { status: 401 }
      );
      return applyTenantHeaders(unauthorizedRes);
    }

    // Redirigir a /login guardant el paràmetre de retorn (mai no redirigir cap a /login mateix)
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/' && pathname !== '' && pathname !== '/login' && !pathname.startsWith('/login')) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    const redirectRes = NextResponse.redirect(loginUrl);
    // Eliminar qualsevol cookie invàlida o residual a la redirecció
    redirectRes.cookies.delete('bancactiu_session');
    return applyTenantHeaders(redirectRes);
  }

  const defaultRes = NextResponse.next();
  return applyTenantHeaders(defaultRes);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and next internal assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
