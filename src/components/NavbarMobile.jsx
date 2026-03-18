import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import '../styles/NavbarMobile.css'

export default function NavbarMobile() {
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname)
  const toPath = useMemo(() => (p) => withTenant(p, tenant), [tenant])
  const { cfg } = useTenantConfig()

  const links = [
    { to: toPath('/gate'), label: 'Gate' },
    { to: toPath('/vip'), label: 'VIP' },
    { to: toPath('/perks'), label: 'Perks' },
  ]

  const [showToast, setShowToast] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    function onToast() {
      try {
        const t = localStorage.getItem('wg_toast')
        if (t) {
          setToast(t)
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2600)
          localStorage.removeItem('wg_toast')
        }
      } catch {
        // no-op
      }
    }
    window.addEventListener('wg:toast', onToast)
    onToast()
    return () => window.removeEventListener('wg:toast', onToast)
  }, [])

  return (
    <div className="navbar navbar-mobile">
      <div className="nav-links">
        {cfg?.brand?.name ? <span className="nav-link" style={{ pointerEvents: "none" }}>{cfg.brand.name}</span> : null}
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {l.label}
          </NavLink>
        ))}

        <ConnectButton.Custom>
          {({ account, mounted, openAccountModal, openConnectModal }) => {
            const ready = mounted
            const connected = ready && account

            return (
              <button
                type="button"
                className="nav-link nav-connect-pill"
                onClick={connected ? openAccountModal : openConnectModal}
                aria-label="Wallet"
              >
                {connected ? account.displayName : 'Connect'}
              </button>
            )
          }}
        </ConnectButton.Custom>
      </div>

      {showToast && (
        <div className="nav-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}
