import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import Navbar from './components/Navbar.jsx'
import Landing from './routes/Landing.jsx'
import GatePage from './app/routes/gate/GatePage.jsx'
import VipPage from './app/routes/vip/VipPage.jsx'
import Members from './routes/Members.jsx'
import Enter from './routes/Enter.jsx'
import PerksPage from './app/routes/perks/PerksPage.jsx'
import PerksTier1 from './routes/PerksTier1.jsx'
import PerksTier2 from './routes/PerksTier2.jsx'
import PerksTier3 from './routes/PerksTier3.jsx'
import AccountPage from './app/routes/account/AccountPage.jsx'
import Admin from './routes/Admin.jsx'
import AdminReferrals from './routes/AdminReferrals.jsx'
import Denied from './routes/Denied.jsx'
import Legal from './routes/Legal.jsx'
import B2BTools from './routes/B2BTools.jsx'
import { useTenant } from './context/TenantContext.jsx'

export default function App() {
  const loc = useLocation()
  const { tenant, tenantConfig } = useTenant()
  const tenantPrefix = tenant && tenant !== 'default' ? `/${tenant}` : ''

  const effectivePath = useMemo(() => {
    if (!tenantPrefix) return loc.pathname
    const p = loc.pathname.startsWith(tenantPrefix) ? loc.pathname.slice(tenantPrefix.length) : loc.pathname
    return p || '/'
  }, [loc.pathname, tenantPrefix])

  const isLanding = effectivePath === '/'

  const isMobile =
    typeof window !== 'undefined' &&
    ((window.matchMedia?.('(pointer: coarse)')?.matches && window.matchMedia?.('(max-width: 980px)')?.matches) ||
      (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)))

  useEffect(() => {
    const cfg = tenantConfig
    if (!cfg) return
    if (cfg?.colors?.primary) document.documentElement.style.setProperty('--brand-primary', cfg.colors.primary)
    if (cfg?.colors?.secondary) document.documentElement.style.setProperty('--brand-secondary', cfg.colors.secondary)
    if (cfg?.colors?.accent) document.documentElement.style.setProperty('--brand-accent', cfg.colors.accent)

    const current = document.querySelector("link[rel='icon']") || document.createElement('link')
    current.setAttribute('rel', 'icon')
    current.setAttribute('href', cfg?.assets?.faviconUrl || cfg?.assets?.favicon || '/favicon-32x32.png')
    if (!current.parentNode) document.head.appendChild(current)
  }, [tenantConfig])

  const bg = tenantConfig?.assets?.wallpaper || '/neutral-wallpaper.svg'

  const layoutTemplate = Number(tenantConfig?.layoutTemplate || 1)
  const shellStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'var(--wallpaper-size, cover)',
    backgroundPosition: isLanding && !isMobile ? 'center 37%' : 'var(--wallpaper-position, center)',
    backgroundAttachment: 'var(--wallpaper-attachment, fixed)'
  }

  const Shell = ({ children }) => (
    <div className={`app-shell layout-${layoutTemplate}`} style={shellStyle}>
      {children}
    </div>
  )

  return (
    <Shell>
      {isLanding ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:tenant" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className="page-wrap">
            <Routes>
              <Route path="/gate" element={<GatePage />} />
              <Route path="/enter" element={<Enter />} />
              <Route path="/members" element={<Members />} />
              <Route path="/denied" element={<Denied />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/vip" element={<VipPage />} />
              <Route path="/perks" element={<PerksPage />} />
              <Route path="/perks/tier1" element={<PerksTier1 />} />
              <Route path="/perks/tier2" element={<PerksTier2 />} />
              <Route path="/perks/tier3" element={<PerksTier3 />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/b2b-tools" element={<B2BTools />} />
              <Route path="/tools" element={<B2BTools />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-demo" element={<Admin demoBypass />} />
              <Route path="/admin/referrals" element={<AdminReferrals />} />
              <Route path="/:tenant/gate" element={<GatePage />} />
              <Route path="/:tenant/enter" element={<Enter />} />
              <Route path="/:tenant/members" element={<Members />} />
              <Route path="/:tenant/denied" element={<Denied />} />
              <Route path="/:tenant/legal" element={<Legal />} />
              <Route path="/:tenant/vip" element={<VipPage />} />
              <Route path="/:tenant/perks" element={<PerksPage />} />
              <Route path="/:tenant/perks/tier1" element={<PerksTier1 />} />
              <Route path="/:tenant/perks/tier2" element={<PerksTier2 />} />
              <Route path="/:tenant/perks/tier3" element={<PerksTier3 />} />
              <Route path="/:tenant/account" element={<AccountPage />} />
              <Route path="/:tenant/b2b-tools" element={<B2BTools />} />
              <Route path="/:tenant/tools" element={<B2BTools />} />
              <Route path="/:tenant/admin" element={<Admin />} />
              <Route path="/:tenant/admin-demo" element={<Admin demoBypass />} />
              <Route path="/:tenant/admin/referrals" element={<AdminReferrals />} />
              <Route path="*" element={<Navigate to="/gate" replace />} />
            </Routes>
          </div>
        </>
      )}
    </Shell>
  )
}
