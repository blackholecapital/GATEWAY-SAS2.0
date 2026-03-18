import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/Navbar.css'

export default function Navbar() {
  const { me, logout } = useAuth()
  const nav = useNavigate()
  const { address } = useAccount()
  const adminMode = (address || '').toLowerCase() === '0x3a71f0695dacde00ccecc622556f711e2b4d50a0'

  const [toast, setToast] = useState('')
  const [vipGlow, setVipGlow] = useState(false)

  useEffect(() => {
    function syncFromStorage() {
      const t = localStorage.getItem('wg_toast') || ''
      if (t) {
        setToast(t)
        localStorage.removeItem('wg_toast')
      }

      const until = Number(localStorage.getItem('wg_vip_glow_until') || '0')
      setVipGlow((me?.authed || me?.ok) ? true : (until > Date.now()))
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
      setVipGlow((me?.authed || me?.ok) ? true : (until > Date.now()))
    }, 400)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('wg:toast', onToast)
      window.removeEventListener('wg:vipglow', onGlow)
      clearInterval(iv)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    // VIP glow should pulse continuously while logged in
    if (me?.authed || me?.ok) setVipGlow(true)
  }, [me])

  const vipClass = useMemo(
    () => ({ isActive }) => (isActive ? (vipGlow ? 'vip-glow active' : 'active') : vipGlow ? 'vip-glow' : undefined),
    [vipGlow]
  )

  async function onLogout() {
    await logout()
    localStorage.removeItem('wg_vip_glow_until')
    nav('/gate')
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
            <div className="brand-title">Web 3 Biz-tools</div>
            <div className="brand-sub">*** .xyz Labs ***</div>
          </div>
        </div>

        <div className="nav-mid">
          <nav className="links">
            <NavLink to="/gate">
              Gate
            </NavLink>
            <NavLink to="/vip" className={vipClass}>
              VIP
            </NavLink>
            <NavLink to="/perks">Perks</NavLink>
                        <NavLink to="/account">Account</NavLink>
            <NavLink to="/b2b-tools">W-3 Tools</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </div>

        <div className="nav-right">
          {adminMode ? (
            <div className="pill admin-badge" title="Admin wallet connected">
              Admin Mode Enabled
            </div>
          ) : null}
          <div className="connect-wrap">
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          </div>
          {me?.authed || me?.ok ? (
            <button className="pill" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
