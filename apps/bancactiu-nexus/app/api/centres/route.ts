import { NextResponse } from 'next/server';
import dbCloud from '@/lib/db/cloud-database';
import type { CentreSanitariCloud } from '@/types/cloud-database';
import { guardApiAccess } from '@/lib/security-api-guard';

/**
 * PUT /api/centres
 * Actualització de dades operatives d'un centre sanitari per part del Superadministrador o Gerència
 */
export async function PUT(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request, {
    requiredRoles: ['SUPER_ADMIN', 'GERENCIA_TERRITORIAL', 'TECNIC_SALUT_GERENCIA'],
    isWriteOperation: true,
  });
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const body = await request.json();
    const { codiRecss, actorDni, ...updates } = body;

    if (!codiRecss) {
      return NextResponse.json(
        { ok: false, missatge: 'Cal indicar el codi RECSS del centre a actualitzar.' },
        { status: 400 }
      );
    }

    const cleanCod = codiRecss.trim();
    const centreExistent = dbCloud.centres.findByRecss(cleanCod);
    if (!centreExistent) {
      return NextResponse.json(
        { ok: false, missatge: `No s'ha trobat cap centre amb codi RECSS ${cleanCod}.` },
        { status: 404 }
      );
    }

    const actorRol = guard.actorRol || (request.headers.get('x-user-role') || '').trim();
    const actorTerritori = (request.headers.get('x-user-territori') || '').trim();

    // Validació de jurisdicció si no és SuperAdmin
    if (actorRol === 'GERENCIA_TERRITORIAL' || actorRol === 'TECNIC_SALUT_GERENCIA') {
      if (actorTerritori && centreExistent.gapicId && !centreExistent.gapicId.toLowerCase().includes(actorTerritori.toLowerCase()) && !actorTerritori.toLowerCase().includes(centreExistent.gapicId.toLowerCase())) {
        return NextResponse.json(
          { ok: false, missatge: `Una Gerència Territorial només pot modificar centres sota la seva demarcació (${actorTerritori}).` },
          { status: 403 }
        );
      }
    }

    const actualitzat = dbCloud.centres.update(cleanCod, updates);

    // Auditoria
    dbCloud.auditoria.log(
      actorDni || guard.actorDni || 'SISTEMA',
      'MODIFICACIO_CENTRE_SANITARI',
      'CentresSanitaris',
      { codiRecss: cleanCod, campsModificats: Object.keys(updates) }
    );

    return NextResponse.json({
      ok: true,
      missatge: 'Centre sanitari actualitzat correctament.',
      centre: actualitzat,
    });
  } catch (error) {
    console.error('Error PUT /api/centres:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error actualitzant el centre sanitari.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/centres
 * Donar de baixa o suspendre operativament un centre sanitari
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  const guard = guardApiAccess(request, {
    requiredRoles: ['SUPER_ADMIN', 'GERENCIA_TERRITORIAL'],
    isWriteOperation: true,
  });
  if (!guard.allowed && guard.response) {
    return guard.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const codiRecss = searchParams.get('codiRecss');

    if (!codiRecss) {
      return NextResponse.json(
        { ok: false, missatge: 'Cal especificar el paràmetre codiRecss.' },
        { status: 400 }
      );
    }

    const cleanCod = codiRecss.trim();
    const centre = dbCloud.centres.findByRecss(cleanCod);
    if (!centre) {
      return NextResponse.json(
        { ok: false, missatge: `Centre ${cleanCod} no trobat.` },
        { status: 404 }
      );
    }

    const actualitzat = dbCloud.centres.update(cleanCod, {
      estatOperatiu: 'INACTIU',
      estatConveni: 'BAIXA',
    });

    dbCloud.auditoria.log(
      guard.actorDni || 'SISTEMA',
      'BAIXA_CENTRE_SANITARI',
      'CentresSanitaris',
      { codiRecss: cleanCod }
    );

    return NextResponse.json({
      ok: true,
      missatge: `Centre ${cleanCod} donat de baixa correctament.`,
      centre: actualitzat,
    });
  } catch (error) {
    console.error('Error DELETE /api/centres:', error);
    return NextResponse.json(
      { ok: false, missatge: 'Error desactivant el centre sanitari.' },
      { status: 500 }
    );
  }
}
