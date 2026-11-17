import { NextResponse } from 'next/server';
import { interopGatewayManager } from '@bancactiu/interoperability-connector';
import { guardApiAccess } from '@/lib/security-api-guard';

export async function GET(request: Request) {
  const guard = guardApiAccess(request, { requiredRoles: ['SUPERADMIN', 'SUPER_ADMIN'] });
  if (!guard.allowed) return guard.response!;

  const endpoints = interopGatewayManager.getEndpoints();
  const certificates = interopGatewayManager.getCertificates();
  const auditLogs = interopGatewayManager.getAuditLog(50);
  const anomalies = interopGatewayManager.getAnomalies();

  return NextResponse.json({
    ok: true,
    endpoints,
    certificates,
    auditLogs,
    anomalies,
    summary: {
      totalEndpoints: endpoints.length,
      onlineEndpoints: endpoints.filter(e => e.status === 'ONLINE').length,
      activeCertificates: certificates.filter(c => c.status === 'VALID').length,
      securityStatus: anomalies.length > 0 ? 'ALERTA_ACTIVA' : 'PERFECTE_RGPD'
    }
  });
}

export async function POST(request: Request) {
  const guard = guardApiAccess(request, { requiredRoles: ['SUPERADMIN', 'SUPER_ADMIN'], isWriteOperation: true });
  if (!guard.allowed) return guard.response!;

  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'ROTATE_CERTIFICATE') {
      const { endpointId, newAlias } = body;
      const newCert = interopGatewayManager.rotateCertificate(
        endpointId || 'ep-via-oberta-dependencia',
        newAlias || 'Certificat mTLS Renovat AOC 2026-2028'
      );
      return NextResponse.json({
        ok: true,
        missatge: 'Certificat digital mTLS rotat i verificat amb èxit.',
        certificate: newCert
      });
    }

    return NextResponse.json({ ok: false, error: 'Acció no reconeguda' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
