import { useTenant } from '../context/TenantContext.jsx'

export function useTenantConfig() {
  const { tenant, tenantConfig, isLoading, error } = useTenant()
  return { tenant, cfg: tenantConfig, isLoading, error }
}
