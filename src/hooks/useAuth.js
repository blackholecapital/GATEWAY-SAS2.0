import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export function useAuth() {
  const [me, setMe] = useState({ authed: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/me')
      setMe(data)
    } catch (e) {
      setMe({ authed: false })
      setError(e?.message || 'Failed to load session')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    setError('')
    try {
      await apiPost('/api/logout', {})
    } finally {
      await refresh()
    }
  }, [refresh])

  const value = useMemo(() => ({ me, loading, error, refresh, logout }), [me, loading, error, refresh, logout])
  return value
}
