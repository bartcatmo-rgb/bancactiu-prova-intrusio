// Resolució Dinàmica de Multi-Tenant per IP & Host (Edge & Runtime Compatible)
export {
  INSTITUTIONAL_TENANTS,
  getAllTenants,
  registerCustomTenant,
  resolveTenant
} from '@bancactiu/db';
export type { TenantConfig } from '@bancactiu/db';
