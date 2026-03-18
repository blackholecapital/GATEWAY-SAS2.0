import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { tenantFromPathname } from '../lib/tenant.js'
import { loadTenantConfig } from '../lib/tenantConfig.js'

const TenantContext = createContext({ tenant: 'default', tenantConfig: null, isLoading: false, error: null })

export function TenantProvider({ children }) {
  const loc = useLocation()
  const tenant = useMemo(() => tenantFromPathname(loc.pathname) || 'default', [loc.pathname])
  const [tenantConfig, setTenantConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setError(null)

    loadTenantConfig(tenant)
      .then((cfg) => {
        if (!alive) return
        setTenantConfig(cfg)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!alive) return
        setTenantConfig(null)
        setError(err)
        setIsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [tenant])

  const value = useMemo(() => ({ tenant, tenantConfig, isLoading, error }), [tenant, tenantConfig, isLoading, error])
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  return useContext(TenantContext)
}
