import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAuth } from '../hooks/useAuth.js'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import '../styles/Navbar.css'

export default function Navbar() {
  const { me, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname)
   const { cfg } = useTenantConfig()

  const brandTitleRaw = cfg?.brand?.shortName || cfg?.brand?.name || 'GATEWAY'
  const brandTitle = String(brandTitleRaw).trim().slice(0, 64)

  const brandTaglineRaw = cfg?.brand?.tagline || 'VIP ACCESS'
  const brandTagline = String(brandTaglineRaw).trim().slice(0, 80)
  const { address } = useAccount()
  const adminMode = (address || '').toLowerCase() === '0x3a71f0695dacde00ccecc622556f711e2b4d50a0'

  const [toast, setToast] = useState('')
  const [vipGlow, setVipGlow] = useState(false)

  const toPath = useMemo(() => (p) => withTenant(p, tenant), [tenant])

  useEffect(() => {
    function syncFromStorage() {
      const t = localStorage.getItem('wg_toast') || ''
      if (t) {
        setToast(t)
        localStorage.removeItem('wg_toast')
      }

      const until = Number(localStorage.getItem('wg_vip_glow_until') || '0')
      setVipGlow(me?.authed || me?.ok ? true : until > Date.now())
    }

    syncFromStorage()
    const onStorage = (e) => {
      if (e?.key === 'wg_toast' || e?.key === 'wg_vip_glow_until') syncFromStorage()
    }
    window.addEventListener('storage', onStorage)
    const onToast = () => syncFromStorage()
    const onGlow = () => syncFromStorage()
    window.addEventListener('wg:toast', onToast)
    window.addEventListener('wg:vipglow', onGlow)

    const iv = setInterval(() => {
      const until = Number(localStorage.getItem('wg_vip_glow_until') || '0')
      setVipGlow(me?.authed || me?.ok ? true : until > Date.now())
    }, 400)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('wg:toast', onToast)
      window.removeEventListener('wg:vipglow', onGlow)
      clearInterval(iv)
    }
  }, [me])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (me?.authed || me?.ok) setVipGlow(true)
  }, [me])

  const vipClass = useMemo(
    () => ({ isActive }) => {
      const classes = ['nav-link']
      if (vipGlow) classes.push('vip-glow')
      if (isActive) classes.push('active')
      return classes.join(' ')
    },
    [vipGlow]
  )

  async function onLogout() {
    await logout()
    localStorage.removeItem('wg_vip_glow_until')
    nav(toPath('/gate'))
  }

  return (
    <header className="nav">
      {toast ? (
        <div className="toast-vip toast-global" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}

      <div className="nav-row">
        <div className="nav-left">
          <div className="brand">
            {cfg?.assets?.logoUrl ? <img src={cfg.assets.logoUrl} alt={cfg?.brand?.name || 'logo'} style={{ height: 24, width: 'auto', marginRight: 10, borderRadius: 6 }} /> : null}
              <span className="brand-title">{brandTitle}</span>
              <span className="brand-sub">{brandTagline}</span>
          </div>

          <nav className="nav-links">
            <NavLink to={toPath('/gate')} className="nav-link">
              Gate
            </NavLink>
            <NavLink to={toPath('/vip')} className={vipClass}>
              VIP
            </NavLink>
            <NavLink to={toPath('/perks')} className="nav-link">
              Perks
            </NavLink>
            <NavLink to={toPath('/account')} className="nav-link">
              Account
            </NavLink>
          </nav>
        </div>

        <div className="nav-right">
          {adminMode ? <div className="pill pill-warn">Admin mode</div> : null}
          {me?.authed || me?.ok ? (
            <button className="pill pill-danger" onClick={onLogout}>
              Logout
            </button>
          ) : null}
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  )
}
