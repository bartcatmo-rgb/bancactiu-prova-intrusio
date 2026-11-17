import { NextResponse } from 'next/server';
import { runVulnerabilityScan } from '@/lib/ai-agent-engine';
import { guardApiAccess } from '@/lib/security-api-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/security-scan
 * Retorna l'informe en temps real de l'escaneig de vulnerabilitats i protecció perimetral.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request);
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const scanResult = await runVulnerabilityScan();
    return NextResponse.json({
      ok: true,
      scanResult,
    });
  } catch (error: any) {
    console.error('Error GET /api/admin/security-scan:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error executant l\'escàner de vulnerabilitats.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/security-scan
 * Llança un escaneig forçat en temps real i audita la traça
 */
export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
