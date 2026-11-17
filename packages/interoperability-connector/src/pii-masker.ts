import { MaskedCitizenRecord } from './types';

/**
 * Enmascara identificadors personals (DNI, NIE, Passaport)
 * Ex: 43999888A -> 43****88A
 */
export function maskIdentifier(id: string): string {
  if (!id || id.length < 4) return '****';
  const first = id.slice(0, 2);
  const last = id.slice(-2);
  return `${first}${'*'.repeat(Math.max(2, id.length - 4))}${last}`;
}

/**
 * Enmascara noms propis de ciutadans
 * Ex: "Antònia Riera Gómez" -> "A****** R**** G****"
 */
export function maskFullName(name: string): string {
  if (!name) return '***';
  return name
    .split(' ')
    .map(part => (part.length > 1 ? part[0] + '*'.repeat(part.length - 1) : part))
    .join(' ');
}

/**
 * Enmascara adreces residencials
 * Ex: "Carrer Major, 45, Cornellà de Llobregat" -> "Carrer M****, ** (Cornellà de Llobregat)"
 */
export function maskAddress(address: string): string {
  if (!address) return 'Adreça Protegida RGPD';
  const parts = address.split(',');
  const street = parts[0] || '';
  const city = parts[parts.length - 1] || 'Cornellà';
  return `${street.slice(0, 8)}****, **${city ? ' (' + city.trim() + ')' : ''}`;
}

/**
 * Genera el registre protegit conforme al principi de minimització de dades RGPD.
 */
export function maskCitizenRecord(
  rawCitizen: {
    dni: string;
    nom: string;
    adreca: string;
    dataNaixement: string;
    grauDiscapacitat?: number;
    grauDependencia?: string;
    prestacions?: string;
  },
  isSuperAdmin: boolean = false
): MaskedCitizenRecord {
  return {
    citizenIdentifierMasked: isSuperAdmin ? rawCitizen.dni : maskIdentifier(rawCitizen.dni),
    fullNameMasked: isSuperAdmin ? rawCitizen.nom : maskFullName(rawCitizen.nom),
    birthDateMasked: isSuperAdmin ? rawCitizen.dataNaixement : rawCitizen.dataNaixement.slice(0, 4) + '-**-**',
    addressMasked: isSuperAdmin ? rawCitizen.adreca : maskAddress(rawCitizen.adreca),
    disabilityGradePercent: rawCitizen.grauDiscapacitat,
    dependencyLevel: rawCitizen.grauDependencia,
    benefitsSummary: rawCitizen.prestacions,
    unmaskedAvailableForSuperAdmin: isSuperAdmin
  };
}
