import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { me, loading } = useAuth()
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname)

  if (loading) return <div className="card page-card">Loading…</div>

  if (!me?.authed && !me?.ok) return <Navigate to={withTenant('/gate', tenant)} replace state={{ from: loc }} />

  if (requireAdmin && !(me?.isAdmin || me?.admin)) return <Navigate to={withTenant('/denied', tenant)} replace state={{ reason: 'Admin access required.' }} />

  return children
}
