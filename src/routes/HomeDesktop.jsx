import { useMemo } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useLocation } from 'react-router-dom'
import GateCard from '../components/GateCard.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import { pickTenantText, pickTenantUrl } from '../lib/tenantConfig.js'
import '../styles/Page.css'
import '../styles/GatewayPages.css'

export default function HomeDesktop() {
  const { refresh } = useAuth()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname)
  const { cfg } = useTenantConfig()

  const links = useMemo(
    () => ({
      x: pickTenantUrl(cfg?.socials?.x, 'https://x.com/Mktmakerxyz'),
      youtube: pickTenantUrl(cfg?.socials?.youtube, 'https://www.youtube.com/@xyz-Labs-xyz'),
      discord: pickTenantUrl(cfg?.socials?.discord, 'https://discord.com/invite/35mmdNVyEe'),
      instagram: pickTenantUrl(cfg?.socials?.instagram, ''),
      tiktok: pickTenantUrl(cfg?.socials?.tiktok, ''),
      facebook: pickTenantUrl(cfg?.socials?.facebook, ''),
      linkedin: pickTenantUrl(cfg?.socials?.linkedin, ''),
      engage: pickTenantUrl(cfg?.socials?.engage, 'https://engage.xyz-labs.xyz/quests'),
      b2bTools: withTenant('/b2b-tools', tenant)
    }),
    [tenant, cfg]
  )

  const gateHeroTitle = pickTenantText(cfg?.pages?.gate?.hero?.title, 'Gateway is your member entry layer. 🧪✨', { minChars: 6 })
  const gateQuickLinks = Array.isArray(cfg?.pages?.gate?.quickLinks) ? cfg.pages.gate.quickLinks : []
  const gateHeroSubtitle = pickTenantText(
    cfg?.pages?.gate?.hero?.subtitle,
    'Replace logins with a wallet signature. Then unlock tiers based on allowlist, ERC-20 balance, or NFT ownership. This is the living room for your members. Gateway lets customers enter using a Web3 wallet. No usernames to remember, no passwords to leak, no "reset link" purgatory. Use it for VIP content, member perks, token gated tools, employee access tiers, partner portals, coupons, drops, and loyalty points.',
    { minChars: 40 }
  )

  async function onAuthed() {
    await refresh()
    localStorage.setItem('wg_toast', 'SESSION ACTIVE • YOU MAY ENTER PERKS / TOOLS')
    window.dispatchEvent(new Event('wg:toast'))
  }

  return (
    <div className="page gw">
      <div className="card page-card panel page-hero">
        <div className="hero-left">
          <div className="hero-kicker">
            <img className="drop" src="/favicon-32x32.png" alt="" aria-hidden="true" />
            <div className="badge">{cfg?.brand?.name || "Gateway"}</div>
            <div className="badge">Unlocks the power of Web-3</div>
            <div className="badge">No passwords</div>
          </div>

          <div className="hero-title">{gateHeroTitle}</div>
          <div className="hero-sub">{gateHeroSubtitle}</div>

          <div className="callouts">
            {(gateQuickLinks.length ? gateQuickLinks : [{ label: 'Follow us on X', desc: 'Drop a like, steal a vibe, earn points later.', href: links.x, cta: 'Open X' }, { label: 'YouTube walkthroughs', desc: 'Short demos, shipping updates, feature drops.', href: links.youtube, cta: 'Watch' }, { label: 'Social missions', desc: 'Want points + quests? Try EngageFi missions.', href: links.engage || links.discord, cta: 'Open' }]).slice(0, 3).map((item, idx) => {
              const href = pickTenantUrl(item?.href || item?.url, idx === 0 ? links.x : idx === 1 ? links.youtube : links.engage)
              const cta = pickTenantText(item?.cta, idx === 0 ? 'Open X' : idx === 1 ? 'Watch' : 'Open', { minChars: 2 })
              return (
                <div className="callout" key={`${item?.label || 'ql'}-${idx}`}>
                  <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🐦' : idx === 1 ? '📺' : '🧩'}</div>
                  <div>
                    <div className="callout-title">{pickTenantText(item?.label, idx === 0 ? 'Follow us on X' : idx === 1 ? 'YouTube walkthroughs' : 'Social missions', { minChars: 6 })}</div>
                    <div className="callout-sub">{pickTenantText(item?.desc || item?.body, idx === 0 ? 'Drop a like, steal a vibe, earn points later.' : idx === 1 ? 'Short demos, shipping updates, feature drops.' : 'Want points + quests? Try EngageFi missions.', { minChars: 20 })}</div>
                  </div>
                  <a className="pill" href={href} target="_blank" rel="noreferrer">{cta}</a>
                </div>
              )
            })}

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
              <div className="win-title">Web 3 Tools</div>
              <div className="win-body">Payments, Rewards, DeFi, Invoicing, Refferal links, Track signups and more! Business tools, addons available in the admin area.</div>
            </div>
            <div className="win">
              <div className="win-title">Gateway unlocks the power of Web-3</div>
              <div className="win-body">Points, gated acess, perks, referrals, payments, rewards. Controll gates + allowlists + employee roles. Turn routes on/off without redeploying.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card page-card panel">
          <div className="card-title">(Tennant) title</div>
          <div className="card-sub">
            Sign a short message to activate a server-verified session cookie. Once active, VIP routes can unlock based on allowlist,
            token balance (ERC-20), and/or NFT ownership.
          </div>
          <div style={{ marginTop: 14 }}>
            <GateCard onAuthed={onAuthed} />
          </div>
          <div className="hint">Tip: You can also show this as a "Connect wallet" step inside an existing customer portal.</div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">(Tennant) EXISTING CUSTOMER LOG IN</div>
          <div className="card-sub">
            Want traditional accounts too? No problem. Let customers login with username/password, then link their wallet for VIP perks and
            token access.
          </div>

          <div className="mini-feed" style={{ marginTop: 14 }}>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">Login bridge 🔗</div>
                <div className="feed-time">demo</div>
              </div>
              <div className="feed-body">
                1) User logs in normally. 2) Connect wallet. 3) Gateway writes a VIP session. 4) Your app checks tier rules and unlocks routes.
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">CRM sync 🗂️</div>
                <div className="feed-time">optional</div>
              </div>
              <div className="feed-body">Map wallet → customer record. Add points, purchases, referrals, and rewards history.</div>
            </div>
            <div className="feed-item">
              <div className="feed-top">
                <div className="feed-title">Explore tools 🚀</div>
                <div className="feed-time">live</div>
              </div>
              <div className="feed-body">Want a quick preview? Jump to the B2B Tools catalog and open demos.</div>
              <div style={{ marginTop: 10 }}>
                <a className="pill" href={links.b2bTools}>
                  Open B2B Tools
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
