import { NextResponse } from 'next/server';
import { sharedDb } from '@bancactiu/db';

export async function GET() {
  const centres = await sharedDb.getCentres('ger-1');
  const prestecs = await sharedDb.getPrestecs('cen-1');
  return NextResponse.json({
    ok: true,
    centresSalut: centres,
    prescripcionsPendents: prestecs.filter(p => p.estat === 'SOL_LICITAT' || p.estat === 'VALIDAT_CLINIC'),
    dataActualitzacio: new Date().toISOString()
  });
}
