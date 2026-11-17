import { NextResponse } from 'next/server';
import { sharedDb } from '@bancactiu/db';

export async function GET() {
  const centres = await sharedDb.getCentres();
  return NextResponse.json({
    ok: true,
    municipi: "Cornellà de Llobregat",
    entitatsMunicipals: centres.filter(c => c.tipus === 'AJUNTAMENT' || c.tipus === 'SERVEIS_SOCIALS'),
    ajutsTramitats: 142,
    fonsAssistentEuros: 48500
  });
}
