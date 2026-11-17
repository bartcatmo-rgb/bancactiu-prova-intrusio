import { NextResponse } from 'next/server';
import {
  getIntrusionEvents,
  recordIntrusionEvent,
  clearIntrusionEvents,
  extractClientIp,
  IntrusionEvent
} from '@/lib/intrusion-store';

export async function GET(request: Request) {
  try {
    const logs = getIntrusionEvents();
    const uniqueIps = Array.from(new Set(logs.map(l => l.ip)));
    const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;
    const honeypotCount = logs.filter(l => l.status === 'HONEYPOT_TRIGGERED').length;

    return NextResponse.json({
      success: true,
      data: {
        logs,
        summary: {
          totalIntrusions: logs.length,
          uniqueIpsCount: uniqueIps.length,
          criticalCount,
          honeypotTriggeredCount: honeypotCount,
          lastDetectedIp: logs.length > 0 ? logs[0].ip : 'Cap detectada',
          lastTimestamp: logs.length > 0 ? logs[0].displayTime : 'N/A'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const clientIp = extractClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Desconegut';

    // Simulation trigger
    if (body.simulate) {
      const simulatedIps = [
        '185.220.101.5',
        '45.154.255.89',
        '194.26.29.112',
        '89.248.165.71',
        '193.32.162.24',
        clientIp !== '127.0.0.1' ? clientIp : '84.88.201.12'
      ];
      const randomIp = simulatedIps[Math.floor(Math.random() * simulatedIps.length)];
      const attackTypes: Array<IntrusionEvent['attemptType']> = [
        'Força Bruta',
        'Sondeig Maliciós (Honeypot)',
        'Accés No Autoritzat',
        'Injecció Sospitosa',
        'Login Fallit'
      ];
      const chosenType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const routes = [
        '/api/auth/login',
        '/admin/config.env',
        '/wp-login.php',
        '/api/v1/users/dump',
        '/phpmyadmin/index.php',
        '/actuator/health'
      ];
      const chosenRoute = routes[Math.floor(Math.random() * routes.length)];

      const newLog = recordIntrusionEvent({
        ip: randomIp,
        route: chosenRoute,
        method: 'POST',
        attemptType: chosenType,
        userAgent: 'SimulatedIntruder/3.0 (SecurityLab-PenTest)',
        details: `Simulació interactiva en temps real disparada per demostració (${chosenType})`,
        severity: chosenType === 'Força Bruta' || chosenType === 'Injecció Sospitosa' ? 'CRITICAL' : 'HIGH',
        status: 'HONEYPOT_TRIGGERED',
        locationInfo: 'Xarxa Externa d\'Intrusió'
      });

      return NextResponse.json({ success: true, message: 'Simulació afegida correctament', log: newLog });
    }

    // Standard log entry
    const newLog = recordIntrusionEvent({
      ip: body.ip || clientIp,
      route: body.route || '/unknown',
      method: body.method || request.method || 'GET',
      attemptType: body.attemptType || 'Petició Anòmala',
      userAgent: body.userAgent || userAgent,
      details: body.details || 'Intent d\'accés registrat pel motor de detecció',
      severity: body.severity || 'HIGH',
      status: body.status || 'RECORDED',
      locationInfo: body.locationInfo || 'Xarxa d\'origen'
    });

    return NextResponse.json({ success: true, log: newLog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearIntrusionEvents();
    return NextResponse.json({ success: true, message: 'Registre d\'intrusions buidat correctament' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
