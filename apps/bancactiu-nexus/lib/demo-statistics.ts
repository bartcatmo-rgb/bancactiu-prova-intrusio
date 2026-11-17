import type { Reserva } from '@/types/api';

export function getMonthlyReservationActivity(reservations: Reserva[], now = new Date()) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      key,
      label: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(date),
      value: reservations.filter((item) => item.data_indicacio?.slice(0, 7) === key).length,
    };
  });
}
