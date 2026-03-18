import { useCallback, useMemo, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export function useAdmin({ demoMode = false } = {}) {
  const [tenant, setTenant] = useState('default')
  const [config, setConfig] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadAll = useCallback(
    async (t = tenant) => {
      const ten = (t || 'default').toLowerCase()
      setTenant(ten)
      setLoading(true)
      setError('')
      try {
        const demo = demoMode ? '&demo=1' : ''
        const [cfg, met, lg] = await Promise.all([
          apiGet(`/api/admin/config?tenant=${encodeURIComponent(ten)}${demo}`),
          apiGet(`/api/admin/metrics?tenant=${encodeURIComponent(ten)}${demo}`),
          apiGet(`/api/admin/logs?tenant=${encodeURIComponent(ten)}&limit=25${demo}`)
        ])
        setConfig(cfg)
        setMetrics(met)
        setLogs(lg?.logs || [])
      } catch (e) {
        setError(e?.message || 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    },
    [tenant, demoMode]
  )

  const saveConfig = useCallback(
    async (next) => {
      const ten = (tenant || 'default').toLowerCase()
      setLoading(true)
      setError('')
      try {
        const demo = demoMode ? '&demo=1' : ''
        const saved = await apiPost(`/api/admin/config?tenant=${encodeURIComponent(ten)}${demo}`, next)
        setConfig(saved)
        return saved
      } catch (e) {
        setError(e?.message || 'Failed to save config')
        throw e
      } finally {
        setLoading(false)
      }
    },
    [tenant, demoMode]
  )

  const saveAsset = useCallback(
    async ({ kind, dataUrl }) => {
      const ten = (tenant || 'default').toLowerCase()
      const demo = demoMode ? '&demo=1' : ''
      return await apiPost(`/api/admin/asset?tenant=${encodeURIComponent(ten)}${demo}`, { kind, dataUrl })
    },
    [tenant, demoMode]
  )

  const loadAsset = useCallback(
    async (kind) => {
      const ten = (tenant || 'default').toLowerCase()
      const demo = demoMode ? '&demo=1' : ''
      return await apiGet(`/api/admin/asset?tenant=${encodeURIComponent(ten)}&kind=${encodeURIComponent(kind)}${demo}`)
    },
    [tenant, demoMode]
  )

  return useMemo(
    () => ({ tenant, setTenant, config, metrics, logs, loading, error, loadAll, saveConfig, saveAsset, loadAsset }),
    [tenant, config, metrics, logs, loading, error, loadAll, saveConfig, saveAsset, loadAsset]
  )
}
