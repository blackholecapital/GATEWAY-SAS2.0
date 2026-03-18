import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { apiPost } from '../lib/api.js'
import { sanitizeTenant } from '../lib/tenant.js'
import '../styles/Page.css'

function parseHash(hash) {
  const h = String(hash || '').replace(/^#/, '')
  const sp = new URLSearchParams(h)
  return {
    address: sp.get('address') || '',
    signature: sp.get('signature') || '',
    chainId: sp.get('chainId') || '1',
    redirect: sp.get('redirect') || '/members'
  }
}

export default function Enter() {
  const { tenant: tenantParam } = useParams()
  const tenant = sanitizeTenant(tenantParam) || 'default'
  const loc = useLocation()
  const nav = useNavigate()
  const [msg, setMsg] = useState('Verifying…')

  useEffect(() => {
    const { address, signature, chainId, redirect } = parseHash(loc.hash)
    if (!address || !signature) {
      setMsg('Missing signature payload. Please try again.')
      return
    }

    ;(async () => {
      try {
        await apiPost('/api/verify', { tenant, address, signature, chainId })
        // First-party redirect into members
        const dest = `/${tenant}${redirect.startsWith('/') ? redirect : `/${redirect}`}`
        window.location.replace(dest)
      } catch (e) {
        setMsg(e?.message || 'Access denied')
        setTimeout(() => nav(`/${tenant}/gate`, { replace: true }), 1400)
      }
    })()
  }, [tenant, loc.hash])

  return (
    <div className="page">
      <div className="card page-card">
        <div className="card-title">ENTERING MEMBERS</div>
        <div className="card-sub">{msg}</div>
      </div>
    </div>
  )
}
