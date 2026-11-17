import { NextResponse } from 'next/server';
import { generateStressTestMetrics, runLiveStressTest, generateCustomStressReport } from '@/lib/stress-test-engine';
import { guardApiAccess } from '@/lib/security-api-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/stress-test
 * Retorna els resultats complets de la prova d'estrès a escala de Catalunya (1, 2 i 3 anys)
 */
export async function GET(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request);
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const data = generateStressTestMetrics();
    data.customExecution = generateCustomStressReport();
    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    console.error('Error GET /api/admin/stress-test:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error consultant resultats de prova d\'estrès.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/stress-test
 * Força una nova execució de la prova d'estrès amb concurrència i registre d'auditoria
 */
export async function POST(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request, {
    requiredRoles: ['SUPER_ADMIN', 'GERENCIA_TERRITORIAL'],
    isWriteOperation: true,
  });
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const data = await runLiveStressTest(body);

    return NextResponse.json({
      ok: true,
      missatge: 'Prova d\'estrès a escala de Catalunya executada i auditada amb èxit.',
      data,
    });
  } catch (error: any) {
    console.error('Error POST /api/admin/stress-test:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error executant la prova d\'estrès massiva.' },
      { status: 500 }
    );
  }
}
