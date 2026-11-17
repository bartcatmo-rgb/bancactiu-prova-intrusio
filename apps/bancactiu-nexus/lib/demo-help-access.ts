import type { DemoHelpDocument, ManagedRole } from '@/types/demo-user';

export const MANAGEMENT_HELP_ROLES: ManagedRole[] = [
  'CAP_REFERENT',
  'ADMIN_ENTITAT',
  'ADMIN_TECNIC',
  'DIRECCIO_GENERAL',
  'SUPER_ADMIN',
];

const MANAGED_AUDIENCES: Partial<Record<ManagedRole, ManagedRole[]>> = {
  CAP_REFERENT: ['CAP_REFERENT', 'CAP_ADMIN'],
  ADMIN_ENTITAT: ['ADMIN_ENTITAT', 'BARRI'],
  ADMIN_TECNIC: ['ADMIN_TECNIC', 'TECNIC'],
  DIRECCIO_GENERAL: ['DIRECCIO_GENERAL'],
  SUPER_ADMIN: ['SUPER_ADMIN'],
};

export function isManagedRole(value: string): value is ManagedRole {
  return [
    'CAP_ADMIN',
    'CAP_REFERENT',
    'ADMIN_ENTITAT',
    'BARRI',
    'ADMIN_TECNIC',
    'TECNIC',
    'DIRECCIO_GENERAL',
    'SUPER_ADMIN',
  ].includes(value);
}

export function manageableHelpAudiences(role: ManagedRole): ManagedRole[] {
  return MANAGED_AUDIENCES[role] ?? [];
}

export function canManageHelpAudience(role: ManagedRole, entity: string, audience: string, documentEntity = entity): boolean {
  return entity === documentEntity && isManagedRole(audience) && manageableHelpAudiences(role).includes(audience);
}

export function canViewHelpDocument(role: ManagedRole, entity: string, document: DemoHelpDocument): boolean {
  if (document.entity !== entity) return false;
  if (document.audience === 'ALL') return !MANAGEMENT_HELP_ROLES.includes(role);
  if (!isManagedRole(document.audience)) return false;
  if (MANAGEMENT_HELP_ROLES.includes(document.audience)) return document.audience === role;
  if (MANAGEMENT_HELP_ROLES.includes(role)) return manageableHelpAudiences(role).includes(document.audience);
  return document.audience === role;
}
