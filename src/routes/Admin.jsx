import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminConfigPanel from '../components/admin/AdminConfigPanel.jsx'
import AllowlistEditor from '../components/admin/AllowlistEditor.jsx'
import LogsTable from '../components/admin/LogsTable.jsx'
import BrandingPanel from '../components/admin/BrandingPanel.jsx'
import LayoutPanel from '../components/admin/LayoutPanel.jsx'
import PageEditorPanel from '../components/admin/PageEditorPanel.jsx'
import { useAdmin } from '../hooks/useAdmin.js'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'
import '../styles/Admin.css'

function useQueryTenant() {
  const loc = useLocation()
  const sp = new URLSearchParams(loc.search)
  return sp.get('tenant') || ''
}

export default function Admin({ demoBypass = false }) {
  if (demoBypass) return <AdminInner demoBypass />

  return (
    <ProtectedRoute requireAdmin>
      <AdminInner demoBypass={false} />
    </ProtectedRoute>
  )
}

function AdminInner({ demoBypass = false }) {
  const { tenant, setTenant, config, metrics, logs, loading, error, loadAll, saveConfig, saveAsset } = useAdmin({ demoMode: demoBypass })
  const loc = useLocation()
  const pathTenant = tenantFromPathname(loc.pathname)
  const toPath = (p) => withTenant(p, pathTenant)
  const qt = useQueryTenant()
  const [tenantInput, setTenantInput] = useState(qt || tenant || 'default')

  useEffect(() => {
    const initial = (qt || tenantInput || 'default').toLowerCase()
    loadAll(initial)
  }, [])

  const allow = useMemo(() => config?.allowlist || [], [config])
  const block = useMemo(() => config?.blocklist || [], [config])

  async function save(next) {
    await saveConfig(next)
    await loadAll(tenant)
  }

  async function onLoadTenant() {
    const t = (tenantInput || 'default').toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'default'
    setTenant(t)
    await loadAll(t)
  }

  return (
    <div className="page admin-page">
      <div className="card page-card admin-top">
        <div>
          <div className="admin-title">ADMIN</div>
          <div className="admin-sub">Tenant config, branding, embeds, and gate security.</div>
        </div>

        <div className="admin-actions">
          <div className="admin-tenant">
            <label>Tenant</label>
            <input value={tenantInput} onChange={(e) => setTenantInput(e.target.value)} placeholder="acme" />
            <button className="btn" onClick={onLoadTenant} disabled={loading}>
              Load
            </button>
          </div>

          <div className="admin-links">
            <Link to={toPath('/admin/referrals')} className="btn btn-ghost">
              Referral Admin
            </Link>
            <Link to={toPath('/b2b-tools')} className="btn btn-ghost">
              B2B Tools
            </Link>
          </div>
        </div>
      </div>

      {error ? <div className="card page-card admin-error">{error}</div> : null}

      {metrics ? (
        <div className="card page-card admin-metrics">
          <div className="metric">
            <div className="k">Attempts</div>
            <div className="v">{metrics.attempts}</div>
          </div>
          <div className="metric">
            <div className="k">Success</div>
            <div className="v">{metrics.successes}</div>
          </div>
          <div className="metric">
            <div className="k">Failures</div>
            <div className="v">{metrics.failures}</div>
          </div>
          <div className="metric">
            <div className="k">Unique</div>
            <div className="v">{metrics.uniqueWallets}</div>
          </div>
        </div>
      ) : null}

      {config ? (
        <>
          <BrandingPanel
            tenant={tenant}
            config={config}
            onSaveConfig={save}
            saveAsset={saveAsset}
            loading={loading}
          />

          <LayoutPanel config={config} onSaveConfig={save} loading={loading} />

          <PageEditorPanel config={config} onSaveConfig={save} loading={loading} />

          <AdminConfigPanel config={config} onSave={save} saving={loading} />

          <div className="admin-lists">
            <AllowlistEditor
              title="*** ALLOWLIST ***"
              value={allow}
              hint="Lowercased addresses. Used by ALLOWLIST mode and combo checks."
              onChange={(list) => save({ ...config, allowlist: list })}
            />
            <AllowlistEditor
              title="*** BLOCKLIST ***"
              value={block}
              hint="Blocklisted addresses always fail before any gate check."
              onChange={(list) => save({ ...config, blocklist: list })}
            />
          </div>

          <LogsTable logs={logs} />
        </>
      ) : (
        <div className="card page-card">Loading config…</div>
      )}
    </div>
  )
}
