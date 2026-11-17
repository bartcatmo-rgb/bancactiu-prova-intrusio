import type { Reserva } from '@/types/api';

type LoanUsage = {
  device: string;
  delivered: number;
  plannedDurationsDays: number[];
  returnedDurationsDays: number[];
  activeDurationsDays: number[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DELIVERED_STATUSES = ['Lliurat al veí', 'Préstec Ampliat', 'Retornat'];
const ACTIVE_STATUSES = ['Lliurat al veí', 'Préstec Ampliat'];

function elapsedDays(start: string, end: string): number | undefined {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime < startTime) return undefined;
  return (endTime - startTime) / DAY_MS;
}

function plannedDays(start: string, dueDate: string): number | undefined {
  const startDay = new Date(`${start.slice(0, 10)}T00:00:00.000Z`).getTime();
  const dueDay = new Date(`${dueDate}T00:00:00.000Z`).getTime();
  if (!Number.isFinite(startDay) || !Number.isFinite(dueDay) || dueDay < startDay) return undefined;
  return (dueDay - startDay) / DAY_MS;
}

export function getLoanUsageByDevice(reservations: Reserva[], now = new Date()): LoanUsage[] {
  const byDevice = new Map<string, LoanUsage>();

  for (const reservation of reservations) {
    const device = reservation.producte_descripcio?.trim() || reservation.tipo_material;
    const usage = byDevice.get(device) ?? { device, delivered: 0, plannedDurationsDays: [], returnedDurationsDays: [], activeDurationsDays: [] };
    if (DELIVERED_STATUSES.includes(reservation.estat_reserva)) usage.delivered += 1;

    if (reservation.data_entrega) {
      const planned = plannedDays(reservation.data_entrega, reservation.data_venciment);
      if (planned !== undefined) usage.plannedDurationsDays.push(planned);
    }
    if (reservation.estat_reserva === 'Retornat' && reservation.data_entrega && reservation.devolucion_fecha) {
      const duration = elapsedDays(reservation.data_entrega, reservation.devolucion_fecha);
      if (duration !== undefined) usage.returnedDurationsDays.push(duration);
    }
    if (ACTIVE_STATUSES.includes(reservation.estat_reserva) && reservation.data_entrega) {
      const duration = elapsedDays(reservation.data_entrega, now.toISOString());
      if (duration !== undefined) usage.activeDurationsDays.push(duration);
    }
    byDevice.set(device, usage);
  }

  return [...byDevice.values()].sort((left, right) => right.delivered - left.delivered || left.device.localeCompare(right.device));
}

export function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
