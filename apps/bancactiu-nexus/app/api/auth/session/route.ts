import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('bancactiu_session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie));
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
