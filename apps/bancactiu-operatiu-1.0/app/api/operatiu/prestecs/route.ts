import { NextResponse } from 'next/server';
import { sharedDb } from '@bancactiu/db';

export async function GET() {
  const prestecs = await sharedDb.getPrestecs();
  return NextResponse.json({
    ok: true,
    totalActius: prestecs.length,
    prestecs: prestecs
  });
}
