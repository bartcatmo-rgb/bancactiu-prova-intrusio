import { NextResponse } from 'next/server';
import { processAgentInstruction, getAIAgentHistory } from '@/lib/ai-agent-engine';
import { guardApiAccess } from '@/lib/security-api-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/ai-agent
 * Retorna l'històric d'intervencions de l'Assistent de IA per al Superadministrador.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request);
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const history = getAIAgentHistory();
    return NextResponse.json({
      ok: true,
      history,
    });
  } catch (error: any) {
    console.error('Error GET /api/admin/ai-agent:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error consultant l\'històric de la IA.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ai-agent
 * Executa una instrucció en llenguatge natural mitjançant l'Agente de IA autònom.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request, {
    requiredRoles: ['SUPER_ADMIN'],
    isWriteOperation: true,
  });
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const body = await request.json();
    const { prompt, mode } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { ok: false, missatge: 'Cal proporcionar una instrucció en llenguatge natural.' },
        { status: 400 }
      );
    }

    const result = await processAgentInstruction(prompt, { mode });

    return NextResponse.json({
      ok: true,
      missatge: result.missatge,
      result,
    });
  } catch (error: any) {
    console.error('Error POST /api/admin/ai-agent:', error);
    return NextResponse.json(
      {
        ok: false,
        missatge: 'Error executant la instrucció de la IA.',
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
