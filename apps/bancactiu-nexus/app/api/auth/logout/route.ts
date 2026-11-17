import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Sessió tancada correctament.'
  });

  response.cookies.delete('bancactiu_session');
  response.cookies.set({
    name: 'bancactiu_session',
    value: '',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: 'Sessió tancada correctament.'
  });

  response.cookies.delete('bancactiu_session');
  response.cookies.set({
    name: 'bancactiu_session',
    value: '',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
