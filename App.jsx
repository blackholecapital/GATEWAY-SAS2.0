import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Landing from './routes/Landing.jsx'
import Home from './routes/Home.jsx'
import Vip from './routes/vip.jsx'
import Perks from './routes/Perks.jsx'
import PerksTier1 from './routes/PerksTier1.jsx'
import PerksTier2 from './routes/PerksTier2.jsx'
import PerksTier3 from './routes/PerksTier3.jsx'
import Account from './routes/Account.jsx'
import Admin from './routes/Admin.jsx'
import AdminReferrals from './routes/AdminReferrals.jsx'
import Denied from './routes/Denied.jsx'
import Legal from './routes/Legal.jsx'
import B2BTools from './routes/B2BTools.jsx'

export default function App() {
  const loc = useLocation()
  const isLanding = loc.pathname === '/'

    const bg = (() => {
    if (isLanding) return '/landing-wallpaper.svg'

    if (['/gate', '/vip', '/perks', '/perks/tier1', '/account'].includes(loc.pathname))
      return '/gateway-wallpaper.svg'

    if (loc.pathname === '/perks/tier2')
      return '/tier2-wallpaper.svg'

    if (loc.pathname === '/perks/tier3')
      return '/tier3-wallpaper.svg'

    return '/landing-wallpaper.svg'
  })()

  const shellStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${bg})`,
    backgroundSize: isLanding ? '100% 100%' : 'cover',
    backgroundPosition: 'center top',
    backgroundAttachment: 'scroll',
    backgroundRepeat: 'no-repeat',
  }
  
  return (
    <div className="app-shell" style={shellStyle}>
      {isLanding ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className="page-wrap">
            <Routes>
              <Route path="/gate" element={<Home />} />
              <Route path="/denied" element={<Denied />} />
              <Route path="/legal" element={<Legal />} />

                           <Route
                path="/vip"
                element={<Vip />}
              />
                           <Route
                path="/perks"
                element={<Perks />}
              />
              <Route
                path="/perks/tier1"
                element={<PerksTier1 />}
              />
              <Route
                path="/perks/tier2"
                element={<PerksTier2 />}
              />
              <Route
                path="/perks/tier3"
                element={<PerksTier3 />}
              />

                          <Route
                path="/account"
                element={<Account />}
              />
                           <Route
                path="/b2b-tools"
                element={<B2BTools />}
              />

                            <Route
                path="/admin"
                element={<Admin />}
              />

                           <Route
                path="/admin/referrals"
                element={<AdminReferrals />}
              />

              <Route path="*" element={<Navigate to="/gate" replace />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}
