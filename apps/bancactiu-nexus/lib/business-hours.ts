/**
 * Càlcul de Temps i Terminis en Hores Hàbils (Catalunya / Estat)
 * Normativa: Llei 39/2015 del Procediment Administratiu Comú.
 * Exclou de manera estricta:
 *  - Dissabtes i Diumenges (caps de setmana)
 *  - Festius oficials estatals i autonòmics de Catalunya
 */

// Festius fixos de Catalunya (MM-DD)
const FIXED_HOLIDAYS_CATALONIA: string[] = [
  '01-01', // Any Nou
  '01-06', // Reis d'Orient
  '05-01', // Festa del Treball
  '06-24', // Sant Joan (Festa autonòmica de Catalunya)
  '08-15', // L'Assumpció
  '09-11', // Diada Nacional de Catalunya
  '10-12', // Festa Nacional d'Espanya
  '11-01', // Tots Sants
  '12-06', // Dia de la Constitució
  '12-08', // La Immaculada Concepció
  '12-25', // Nadal
  '12-26', // Sant Esteve (Festa tradicional catalana)
];

/**
 * Càlcul de la Pasqua (Algorisme de Butcher / Meeus)
 * Retorna l'objecte Date del Diumenge de Pasqua per a l'any donat
 */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed (2 = March, 3 = April)
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month, day));
}

/**
 * Retorna els festius mòbils de Setmana Santa per a Catalunya:
 *  - Divendres Sant (Good Friday: -2 dies de Pasqua)
 *  - Dilluns de Pasqua (Easter Monday: +1 dia de Pasqua)
 */
function getEasterHolidaysCatalonia(year: number): string[] {
  const easter = getEasterSunday(year);

  const goodFriday = new Date(easter);
  goodFriday.setUTCDate(goodFriday.getUTCDate() - 2);

  const easterMonday = new Date(easter);
  easterMonday.setUTCDate(easterMonday.getUTCDate() + 1);

  const format = (d: Date) => {
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${m}-${day}`;
  };

  return [format(goodFriday), format(easterMonday)];
}

/**
 * Comprova si una data determinada és un dia hàbil (dilluns a divendres no festiu)
 */
export function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = Diumenge, 6 = Dissabte
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  const year = date.getFullYear();
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // Comprova festius fixos
  if (FIXED_HOLIDAYS_CATALONIA.includes(monthDay)) {
    return false;
  }

  // Comprova festius de Pasqua
  const easterHolidays = getEasterHolidaysCatalonia(year);
  if (easterHolidays.includes(monthDay)) {
    return false;
  }

  return true;
}

/**
 * Calcula les hores hàbils transcorregudes entre dues dates
 * Excloent estrictament caps de setmana i dies festius.
 * Per a cada dia hàbil, compta les hores reals transcorregudes (fins a 24h/dia hàbil).
 */
export function calculateBusinessHoursElapsed(startDate: Date, endDate: Date = new Date()): number {
  if (endDate <= startDate) return 0;

  let totalMs = 0;
  const cursor = new Date(startDate.getTime());

  // Iterar dia a dia per calcular fragments exactes
  while (cursor < endDate) {
    const currentYear = cursor.getFullYear();
    const currentMonth = cursor.getMonth();
    const currentDay = cursor.getDate();

    // Inici i final del dia natural actual
    const startOfDay = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    const endOfDay = new Date(currentYear, currentMonth, currentDay, 24, 0, 0, 0);

    if (isBusinessDay(cursor)) {
      // Període vàlid d'aquest dia hàbil
      const segmentStart = Math.max(cursor.getTime(), startOfDay.getTime());
      const segmentEnd = Math.min(endDate.getTime(), endOfDay.getTime());

      if (segmentEnd > segmentStart) {
        totalMs += (segmentEnd - segmentStart);
      }
    }

    // Avançar al següent dia a les 00:00:00
    cursor.setTime(endOfDay.getTime());
  }

  return totalMs / (1000 * 60 * 60);
}

/**
 * Comprova si un missatge ha superat el límit de 48 hores hàbils sense atendre
 */
export function isMessageOverdue48BusinessHours(createdAtIso: string, now: Date = new Date()): boolean {
  const createdDate = new Date(createdAtIso);
  if (Number.isNaN(createdDate.getTime())) return false;

  const hoursElapsed = calculateBusinessHoursElapsed(createdDate, now);
  return hoursElapsed >= 48;
}

/**
 * Calcula una data en el passat que estigui exactament a `businessHours` hores hàbils enrere.
 * Útil per al botó de simulació ràpida en demostracions en directe.
 */
export function getPastDateForBusinessHours(businessHours: number, referenceDate: Date = new Date()): Date {
  const targetMs = businessHours * 3600 * 1000;
  let elapsedMs = 0;
  const cursor = new Date(referenceDate.getTime());

  // Retrocedir pas a pas fins a assolir targetMs
  while (elapsedMs < targetMs) {
    const currentYear = cursor.getFullYear();
    const currentMonth = cursor.getMonth();
    const currentDay = cursor.getDate();

    const startOfDay = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);

    if (isBusinessDay(cursor)) {
      const availableMsInThisDay = cursor.getTime() - startOfDay.getTime();
      const neededMs = targetMs - elapsedMs;

      if (availableMsInThisDay >= neededMs) {
        cursor.setTime(cursor.getTime() - neededMs);
        elapsedMs += neededMs;
        break;
      } else {
        elapsedMs += availableMsInThisDay;
        cursor.setTime(startOfDay.getTime() - 1); // Pas al dia anterior (23:59:59.999)
      }
    } else {
      cursor.setTime(startOfDay.getTime() - 1);
    }
  }

  return cursor;
}
