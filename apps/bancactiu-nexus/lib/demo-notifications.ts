import type { Reserva } from '@/types/api';
import type { DemoEntity, DemoNotification } from '@/types/demo-user';
import { demoNotifications } from '@/lib/demo-store';

type NoticeKind = DemoNotification['kind'];

function createId(): string {
  return `AV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSpanishDate(isoDateStr?: string): string {
  if (!isoDateStr) return new Date().toLocaleDateString('es-ES');
  const d = new Date(isoDateStr.includes('T') ? isoDateStr : `${isoDateStr}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? isoDateStr
    : new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}

function createNotice(
  reservation: Reserva,
  entity: DemoEntity | undefined,
  kind: NoticeKind,
  channel: DemoNotification['channel'],
  status: DemoNotification['status'],
  scheduledAt: string,
  customMessage?: string,
): DemoNotification {
  const entityName = entity?.name ?? reservation.id_entitat_actual;
  const entityPhone = entity?.phone || 'el telèfon d’atenció de la seu';
  const deliveryDateFormatted = formatSpanishDate(reservation.data_entrega || new Date().toISOString().slice(0, 10));
  const dueDateFormatted = formatSpanishDate(reservation.data_venciment);

  let message = customMessage ?? '';

  if (!message) {
    if (kind === 'SOLICITUD') {
      message = channel === 'SMS'
        ? `[BPS] Hola ${reservation.nom_ciutada}: Hem registrat la sol·licitud de '${reservation.tipo_material}' (#${reservation.id_reserva}). Us avisarem quan estigui llest a ${entityName}.`
        : `Apreciat/da ${reservation.nom_ciutada}:\n\nUs comuniquem que s’ha registrat la prescripció sanitària de '${reservation.tipo_material}' (Expedient #${reservation.id_reserva}). L’entitat gestora '${entityName}' us notificarà tan bon punt el material hagi estat revisat pel taller i estigui preparat per a la recollida.\n\nAtentament,\nXarxa de Banc de Productes de Suport (BPS)`;
    } else if (kind === 'RECOGIDA') {
      message = channel === 'SMS'
        ? `[BPS] Hola ${reservation.nom_ciutada}: Confirmem la recollida de '${reservation.tipo_material}' (#${reservation.id_reserva}) el dia ${deliveryDateFormatted}. Data límit de retorn: ${dueDateFormatted}. Per a consultes, contacteu amb ${entityName} (Tel. ${entityPhone}).`
        : `Benvolgut/da ${reservation.nom_ciutada}:\n\nConfirmem que en data ${deliveryDateFormatted} heu recollit el material '${reservation.tipo_material}' (Núm. Reserva #${reservation.id_reserva}) a la seu de ${entityName}.\n\n• Data límit de retorn convinguda: ${dueDateFormatted}\n• Seu de devolució: ${entityName} (${entity?.location || 'Localitat assignada'})\n• Telèfon per a consultes i incidències: ${entityPhone}\n• Garantia dipositada: Se us reintegrarà íntegrament en retornar l’article en bon estat (el desgast habitual per ús diligent no penalitza).\n\nRecordeu que si necessiteu una ampliació per prescripció clínica abans del venciment, podeu sol·licitar-la presencialment o per telèfon.\n\nSalutacions cordials,\n${entityName} · Banc de Productes de Suport`;
    } else if (kind === 'VENCIMIENTO' || kind === 'CADUCIDAD') {
      message = channel === 'SMS'
        ? `[BPS] Recordatori de caducitat: El préstec de '${reservation.tipo_material}' (#${reservation.id_reserva}) venç el proper ${dueDateFormatted}. Contacteu amb ${entityName} (Tel. ${entityPhone}) per al retorn o ampliació.`
        : `Apreciat/da ${reservation.nom_ciutada}:\n\nUs recordem que el període de préstec de l’article '${reservation.tipo_material}' (#${reservation.id_reserva}) arriba al seu venciment el proper ${dueDateFormatted}.\n\nSi us plau, poseu-vos en contacte amb ${entityName} (Telèfon: ${entityPhone}) per concertar la devolució de l’article o tramitar una ampliació si el vostre metge del CAP considera que el continueu necessitant.\n\nGràcies per la vostra col·laboració,\n${entityName}`;
    } else if (kind === 'INCIDENCIA') {
      message = channel === 'SMS'
        ? `[BPS] Avís d’incidència: En la devolució de '${reservation.tipo_material}' (#${reservation.id_reserva}) s’han observat danys que requereixen revisió del taller. La fianza queda retinguda temporalment. Info: ${entityPhone}.`
        : `Benvolgut/da ${reservation.nom_ciutada}:\n\nEn relació amb la devolució de '${reservation.tipo_material}' (#${reservation.id_reserva}) registrada a la seu de ${entityName}, us informem que la inspecció tècnica ha detectat desperfectes o anomalies que requereixen derivació al taller ortopèdic.\n\nD’acord amb la clàusula 4 del contracte de préstec, la fiança dipositada queda cautelarment retinguda fins a l’emissió de l’informe de valoració. Si els danys responen a desgast normal o vici ocult del material, la garantia serà reintegrada íntegrament.\n\nPer a qualsevol aclariment, podeu contactar amb ${entityName} al telèfon ${entityPhone}.\n\nAtentament,\nResponsable de Gestió de Préstecs · ${entityName}`;
    } else {
      message = `[BPS] Comunicació de ${entityName}: ${reservation.nom_ciutada}, ens posem en contacte respecte al vostre préstec de ${reservation.tipo_material} (#${reservation.id_reserva}). Telèfon de contacte: ${entityPhone}.`;
    }
  }

  return {
    id: createId(),
    reservationId: reservation.id_reserva,
    entityId: reservation.id_entitat_actual,
    citizenName: reservation.nom_ciutada,
    email: reservation.email ?? '',
    phone: reservation.telefon,
    entityPhone: entity?.phone ?? '',
    kind,
    channel,
    scheduledAt,
    createdAt: new Date().toISOString(),
    status,
    message,
    deliveredAt: status === 'ENTREGADO' || status === 'ENVIADO' ? new Date().toISOString() : undefined,
  };
}

export function queueReservationNotice(
  reservation: Reserva,
  entity: DemoEntity | undefined,
  kind: NoticeKind,
  status: 'PENDIENTE_PROVEEDOR' | 'PROGRAMADO' | 'ENTREGADO' | 'ENVIADO',
  scheduledAt = new Date().toISOString(),
  customMessage?: string,
): DemoNotification[] {
  const notifications = (['EMAIL', 'SMS'] as const).map((channel) =>
    createNotice(reservation, entity, kind, channel, status, scheduledAt, customMessage),
  );
  demoNotifications.unshift(...notifications);
  return notifications;
}

export function scheduleExpiryNotices(reservation: Reserva, entity: DemoEntity | undefined): DemoNotification[] {
  const reminderDate = new Date(`${reservation.data_venciment}T09:00:00.000Z`);
  reminderDate.setUTCDate(reminderDate.getUTCDate() - 3); // Avís 3 dies abans del venciment
  return queueReservationNotice(reservation, entity, 'CADUCIDAD', 'PROGRAMADO', reminderDate.toISOString());
}

export function cancelScheduledExpiryNotices(reservationId: number): void {
  for (const notice of demoNotifications) {
    if (notice.reservationId === reservationId && (notice.kind === 'VENCIMIENTO' || notice.kind === 'CADUCIDAD') && notice.status === 'PROGRAMADO') {
      notice.status = 'CANCELADO';
    }
  }
}

export function activateDueExpiryNotices(now = new Date()): void {
  for (const notice of demoNotifications) {
    if ((notice.kind === 'VENCIMIENTO' || notice.kind === 'CADUCIDAD') && notice.status === 'PROGRAMADO' && new Date(notice.scheduledAt) <= now) {
      notice.status = 'ENTREGADO';
      notice.deliveredAt = new Date().toISOString();
    }
  }
}
