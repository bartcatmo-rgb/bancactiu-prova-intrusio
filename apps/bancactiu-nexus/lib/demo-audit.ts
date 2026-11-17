import type { DemoAccount } from '@/types/demo-user';

export async function recordDemoAudit(
  actor: Pick<DemoAccount, 'id' | 'nombre' | 'rol'>,
  action: string,
  resource: string,
  details: string,
): Promise<void> {
  try {
    const response = await fetch('/api/demo/auditoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bancactiu-csrf': '1',
      },
      body: JSON.stringify({
        actorId: actor.id,
        actorName: actor.nombre,
        actorRole: actor.rol,
        action,
        resource,
        details,
      }),
    });
    if (!response.ok) throw new Error(`La API de auditoría respondió con el estado ${response.status}.`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('demo-audit-updated'));
    }
  } catch (cause) {
    console.error('No se pudo registrar el evento de auditoría de demostración.', cause);
  }
}
