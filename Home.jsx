import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import GateCard from '../components/GateCard.jsx'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/Page.css'
import '../styles/GatewayPages.css'

export default function Home() {
  const { refresh } = useAuth()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [scheme, setScheme] = useState('a')

  useEffect(() => {
    try {
      const s = localStorage.getItem('gw_scheme')
      if (s === 'a' || s === 'b' || s === 'c') setScheme(s)
    } catch {
      // no-op
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('gw_scheme', scheme)
    } catch {
      // no-op
    }
  }, [scheme])

  const links = useMemo(() => ({
    x: 'https://x.com/Mktmakerxyz',
    youtube: 'https://www.youtube.com/@xyz-Labs-xyz',
    discord: 'https://discord.com/invite/35mmdNVyEe',
    engage: 'https://engage.xyz-labs.xyz/quests',
    b2bTools: '/b2b-tools'
  }), [])

  async function onAuthed() {
    // ensure session state is synced for navbar + protected routes
    await refresh()
    localStorage.setItem('wg_toast', 'SESSION ACTIVE • YOU MAY ENTER PERKS / TOOLS')
    window.dispatchEvent(new Event('wg:toast'))
  }

  return (
    <div className={`page gw scheme-${scheme} ${scheme === 'a' ? '' : scheme === 'b' ? 'scheme-b' : 'scheme-c'}`}>
      <div className="card page-card panel page-hero">
        <div className="hero-left">
          <div className="hero-kicker">
           <img className="drop" src="/favicon-32x32.png" alt="" aria-hidden="true" />
            <div className="badge">Gateway</div>
            <div className="badge">VIP LAB</div>
            <div className="badge">No passwords</div>
          </div>

          <div className="hero-title">Welcome to XYZ Labs VIP Area 🧪✨</div>
          <div className="hero-sub">
            This is the <b>living room</b> for your members. Gateway lets customers enter using a Web3 wallet.
            No usernames to remember, no passwords to leak, no "reset link" purgatory.
            <br />
            Use it for <b>VIP content</b>, <b>member perks</b>, <b>token gated tools</b>, <b>employee access tiers</b>,
            partner portals, coupons, drops, and loyalty points.
          </div>

          <div className="scheme-switch" aria-label="Demo theme switcher">
            <button className={`scheme-btn ${scheme === 'a' ? 'active' : ''}`} onClick={() => setScheme('a')}>1️⃣ Neon Lab (green)</button>
            <button className={`scheme-btn ${scheme === 'b' ? 'active' : ''}`} onClick={() => setScheme('b')}>2️⃣ Nightclub (violet)</button>
            <button className={`scheme-btn ${scheme === 'c' ? 'active' : ''}`} onClick={() => setScheme('c')}>3️⃣ Golden Hour (amber)</button>
          </div>

          <div className="callouts">
            <div className="callout">
              <div className="callout-ic" aria-hidden="true">🐦</div>
              <div>
                <div className="callout-title">Follow us on X</div>
                <div className="callout-sub">Drop a like, steal a vibe, earn points later.</div>
              </div>
              <a className="pill" href={links.x} target="_blank" rel="noreferrer">Open X</a>
            </div>

            <div className="callout">
              <div className="callout-ic" aria-hidden="true">📺</div>
              <div>
                <div className="callout-title">YouTube walkthroughs</div>
                <div className="callout-sub">Short demos, shipping updates, feature drops.</div>
              </div>
              <a className="pill" href={links.youtube} target="_blank" rel="noreferrer">Watch</a>
            </div>

            <div className="callout">
              <div className="callout-ic" aria-hidden="true">🧩</div>
              <div>
                <div className="callout-title">Social missions</div>
                <div className="callout-sub">Want points + quests? Try EngageFi missions.</div>
              </div>
              <a className="pill" href={links.engage} target="_blank" rel="noreferrer">Try EngageFi</a>
            </div>

            <div className="callout">
              <div className="callout-ic" aria-hidden="true">🎫</div>
              <div>
                <div className="callout-title">Need support?</div>
                <div className="callout-sub">Open a ticket in Discord for fast help.</div>
              </div>
              <a className="pill" href={links.discord} target="_blank" rel="noreferrer">Discord</a>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="card-title">*** SESSION STATUS ***</div>
          <div className="hero-stats">
            <div className="stat">
              <div className="k">Wallet</div>
              <div className="v">{isConnected && address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Not connected'}</div>
            </div>
            <div className="stat">
              <div className="k">Chain</div>
              <div className="v">{chainId || '—'}</div>
            </div>
            <div className="stat">
              <div className="k">Gate mode</div>
              <div className="v">SIGN ONLY</div>
            </div>
          </div>

          <div className="hero-windows">
            <div className="win">
              <div className="win-title">Referral Engine</div>
              <div className="win-body">Generate links, track signups, and route rewards to points or USDC payouts.</div>
            </div>
            <div className="win">
              <div className="win-title">VIP Lab</div>
              <div className="win-body">Token gates + allowlists + employee roles. Turn routes on/off without redeploying.</div>
            </div>
            <div className="holo-drop" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card page-card panel">
          <div className="card-title">*** GATEWAY ***</div>
          <div className="card-sub">
            Sign a short message to activate a server-verified session cookie.
            Once active, VIP routes can unlock based on allowlist, token balance (ERC-20), and/or NFT ownership.
          </div>
          <div style={{ marginTop: 14 }}>
            <GateCard onAuthed={onAuthed} />
          </div>
          <div className="hint">
            Tip: You can also show this as a "Connect wallet" step inside an existing customer portal.
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">*** EXISTING CUSTOMERS (OPTIONAL) ***</div>
          <div className="card-sub">
            Want traditional accounts too? No problem.
            Let customers login with username/password, then link their wallet for VIP perks and token access.
          </div>

          <div className="mini-feed" style={{ marginTop: 14 }}>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">Login bridge 🔗</div>
                <div className="feed-time">demo</div>
              </div>
              <div className="feed-body">
                1) User logs in normally. 2) Connect wallet. 3) Gateway writes a VIP session.
                4) Your app checks tier rules and unlocks routes.
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">CRM sync 🗂️</div>
                <div className="feed-time">optional</div>
              </div>
              <div className="feed-body">
                Map wallet → customer record. Add points, purchases, referrals, and rewards history.
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">Explore tools 🚀</div>
                <div className="feed-time">live</div>
              </div>
              <div className="feed-body">
                Want a quick preview? Jump to the W-3 Tools catalog and open demos.
              </div>
              <div style={{ marginTop: 10 }}>
                <a className="pill" href={links.b2bTools}>Open W-3 Tools</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

