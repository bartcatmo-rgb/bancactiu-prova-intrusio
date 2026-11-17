import { NextResponse } from 'next/server';
import { processDeltaBatch, DeltaSyncBatch } from '@/lib/offline-sync-engine';
import { guardApiAccess } from '@/lib/security-api-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request, { isWriteOperation: true });
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const batch: DeltaSyncBatch = await request.json();

    if (!batch || !batch.batchId || !Array.isArray(batch.operations)) {
      return NextResponse.json(
        { ok: false, missatge: 'Estructura de lot Delta no vàlida.' },
        { status: 400 }
      );
    }

    const result = processDeltaBatch(batch, guard.clientIp);

    return NextResponse.json({
      ok: true,
      missatge: `Sincronització Delta completada: ${result.processedCount} operacions consolidades amb èxit.`,
      result
    });
  } catch (error: any) {
    console.error('Error POST /api/sync/delta:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error processant la sincronització delta: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/sync/delta',
    descripcio: 'Porta de Sincronització Atòmica Delta per a Clients Offline-First (ENS Nivell Alt)',
    protocolVersion: '3.0.0-PROD',
    conflictResolutionStrategy: 'LAST_WRITE_WINS_WITH_MERKLE_AUDIT'
  });
}
