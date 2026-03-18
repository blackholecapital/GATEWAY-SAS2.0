import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useAuth } from '../hooks/useAuth.js'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import { pickTenantText, pickTenantUrl } from '../lib/tenantConfig.js'
import '../styles/Page.css'
import '../styles/GatewayPages.css'

export default function Account() {
  const { logout, refresh, me } = useAuth()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [refCode, setRefCode] = useState('')
  const [frameColor, setFrameColor] = useState('#00ff66')
  const [frameBrightness, setFrameBrightness] = useState(1)
  const { cfg } = useTenantConfig()

  useEffect(() => {
    try {
      const c = localStorage.getItem('gw_frame_color')
      const b = Number(localStorage.getItem('gw_frame_brightness') || '1')
      if (c) setFrameColor(c)
      if (!Number.isNaN(b)) setFrameBrightness(Math.max(0.4, Math.min(1.8, b)))
    } catch {
      // no-op
    }
  }, [])

  useEffect(() => {
    const hex = frameColor.replace('#', '')
    const chunk = hex.length === 3 ? hex.split('').map((x) => x + x).join('') : hex
    const r = parseInt(chunk.slice(0, 2), 16) || 0
    const g = parseInt(chunk.slice(2, 4), 16) || 255
    const b = parseInt(chunk.slice(4, 6), 16) || 102
    try {
      document.documentElement.style.setProperty('--wire-rgb', `${r}, ${g}, ${b}`)
      document.documentElement.style.setProperty('--wire-alpha', String(frameBrightness))
      localStorage.setItem('gw_frame_color', frameColor)
      localStorage.setItem('gw_frame_brightness', String(frameBrightness))
    } catch {
      // no-op
    }
  }, [frameColor, frameBrightness])

  useEffect(() => {
    try {
      const existing = localStorage.getItem('gw_ref')
      if (existing) setRefCode(existing)
    } catch {
      // no-op
    }
  }, [])

  useEffect(() => {
    try {
      if (refCode) localStorage.setItem('gw_ref', refCode)
    } catch {
      // no-op
    }
  }, [refCode])

  const links = useMemo(
    () => ({
      x: pickTenantUrl(cfg?.socials?.x, 'https://x.com/Mktmakerxyz'),
      youtube: pickTenantUrl(cfg?.socials?.youtube, 'https://www.youtube.com/@xyz-Labs-xyz'),
      discord: pickTenantUrl(cfg?.socials?.discord, 'https://discord.com/invite/35mmdNVyEe'),
      portfolio: pickTenantUrl(cfg?.links?.account?.[0]?.url, 'https://portfolio.xyz-labs.xyz'),
      engage: pickTenantUrl(cfg?.socials?.engage, 'https://engage.xyz-labs.xyz/quests'),
      referral: pickTenantUrl(cfg?.links?.members?.[0]?.url, 'https://referraltest.xyz-labs.xyz')
    }),
    [cfg]
  )

  const accountHeroTitle = pickTenantText(cfg?.pages?.account?.hero?.title, 'Your member dashboard 🧾🧠', { minChars: 6 })
  const accountHeroSubtitle = pickTenantText(
    cfg?.pages?.account?.hero?.subtitle,
    'Everything a customer expects: status, rewards, history, and quick actions. Everything Web3 adds: wallet identity, tiers, and gated tools.',
    { minChars: 40 }
  )
  const accountBadges = Array.isArray(cfg?.pages?.account?.hero?.kickerBadges) ? cfg.pages.account.hero.kickerBadges : []
  const actions = Array.isArray(cfg?.pages?.account?.actions) ? cfg.pages.account.actions : []
  const rewardRows = Array.isArray(cfg?.pages?.account?.rewards?.rows) ? cfg.pages.account.rewards.rows : []
  const rewardsFeed = Array.isArray(cfg?.pages?.account?.rewardsFeed) ? cfg.pages.account.rewardsFeed : []
  const quickActions = Array.isArray(cfg?.pages?.account?.quickActions?.items) ? cfg.pages.account.quickActions.items : []
  const socialItems = Array.isArray(cfg?.pages?.account?.socialsPanel?.items) ? cfg.pages.account.socialsPanel.items : []
  const noteItems = Array.isArray(cfg?.pages?.account?.notes?.items) ? cfg.pages.account.notes.items : []

  function makeRef() {
    const code = `XYZ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    setRefCode(code)
    localStorage.setItem('wg_toast', `REFERRAL CODE READY: ${code}`)
    window.dispatchEvent(new Event('wg:toast'))
  }

  function copyRef() {
    const url = `${links.referral}/?ref=${encodeURIComponent(refCode || '')}`
    navigator.clipboard?.writeText(url)
    localStorage.setItem('wg_toast', 'COPIED REFERRAL LINK ✅')
    window.dispatchEvent(new Event('wg:toast'))
  }

  const fallbackRewardRows = [
    { label: 'Tier', value: me?.tier || '—' },
    { label: 'Points', value: '0' },
    { label: 'Referrals', value: '0' }
  ]

  const fallbackRewardsFeed = [
    { title: 'Welcome', body: 'Complete your profile to unlock bonus perks.' },
    { title: 'Status', body: 'You are currently signed in.' }
  ]

  const fallbackQuickActions = [
    { title: 'Complete missions', body: 'Earn points in EngageFi and unlock perks.', cta: 'EngageFi', href: links.engage },
    { title: 'Portfolio inspector', body: 'Show customers extra value inside VIP.', cta: 'Open', href: links.portfolio }
  ]

  const fallbackSocials = [
    { title: 'Follow on X', body: 'Demos and shipping updates.', cta: 'Open', href: links.x },
    { title: 'YouTube', body: 'Tutorials and walkthroughs.', cta: 'Watch', href: links.youtube },
    { title: 'Discord support', body: 'Tickets + private channels.', cta: 'Join', href: links.discord }
  ]

  const fallbackNotes = [
    { title: 'Security', body: 'Wallet sign-in can reduce credential attacks. Tier checks live on the server.', badge: 'core' },
    { title: 'Identity', body: 'Link wallets to existing accounts for a smooth bridge from Web2 to Web3.', badge: 'optional' }
  ]

  return (
    <div className="page gw">
      <div className="card page-card panel page-hero">
        <div className="hero-left">
          <div className="hero-kicker">
            <img className="drop" src="/favicon-32x32.png" alt="" aria-hidden="true" />
            {(accountBadges.length ? accountBadges : ['Account', 'Rewards', 'Referrals']).slice(0, 3).map((badge, idx) => (
              <div className="badge" key={`${badge}-${idx}`}>{badge}</div>
            ))}
          </div>

          <div className="hero-title">{accountHeroTitle}</div>
          <div className="hero-sub">{accountHeroSubtitle}</div>

          <div className="mini-feed" style={{ marginTop: 14 }}>
            <div className="feed-item">
              <div className="feed-top"><div className="feed-title">Frame color</div><div className="feed-time">picker</div></div>
              <div className="feed-body">
                <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} style={{ width: 56, height: 36 }} />
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-top"><div className="feed-title">Frame brightness</div><div className="feed-time">{Math.round(frameBrightness * 100)}%</div></div>
              <div className="feed-body">
                <input type="range" min="0.4" max="1.8" step="0.05" value={frameBrightness} onChange={(e) => setFrameBrightness(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="pill" onClick={refresh}>{pickTenantText(actions?.[0]?.label, 'Refresh Session', { minChars: 4 })}</button>
            <button className="pill" onClick={logout}>{pickTenantText(actions?.[1]?.label, 'Log Out', { minChars: 3 })}</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="card-title">*** ACCOUNT ***</div>
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
              <div className="k">Tier</div>
              <div className="v">{me?.tier || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.account?.rewards?.title, 'Rewards Snapshot', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="card-sub">{pickTenantText(cfg?.pages?.account?.rewards?.subtitle, 'Your current earning metrics.', { minChars: 8 })}</div>

          <div className="hero-stats" style={{ marginTop: 12 }}>
            {(rewardRows.length ? rewardRows : fallbackRewardRows).slice(0, 3).map((row, idx) => (
              <div className="stat" key={`${row?.label || 'reward'}-${idx}`}>
                <div className="k">{pickTenantText(row?.label, idx === 0 ? 'Tier' : idx === 1 ? 'Points' : 'Referrals', { minChars: 2 })}</div>
                <div className="v">{pickTenantText(row?.value, idx === 0 ? String(me?.tier || '—') : '0', { minChars: 1 })}</div>
              </div>
            ))}
          </div>

          <div className="mini-feed" style={{ marginTop: 12 }}>
            {(rewardsFeed.length ? rewardsFeed : fallbackRewardsFeed).slice(0, 3).map((item, idx) => (
              <div className="feed-item" key={`${item?.title || 'feed'}-${idx}`}>
                <div className="feed-top">
                  <div className="feed-title">{pickTenantText(item?.title, idx === 0 ? 'Welcome' : 'Status', { minChars: 3 })}</div>
                  <div className="feed-time">{idx === 0 ? 'today' : idx === 1 ? 'recent' : 'history'}</div>
                </div>
                <div className="feed-body">{pickTenantText(item?.body, idx === 0 ? 'Complete your profile to unlock bonus perks.' : 'You are currently signed in.', { minChars: 10 })}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.account?.referralWidget?.title, 'Referral Link', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="card-sub">{pickTenantText(cfg?.pages?.account?.referralWidget?.subtitle, 'Share your personal invite and earn rewards.', { minChars: 10 })}</div>

          <div className="mini-feed" style={{ marginTop: 12 }}>
            <div className="feed-item">
              <div className="feed-top"><div className="feed-title">{pickTenantText(cfg?.pages?.account?.referralWidget?.inputLabel, 'Your referral URL', { minChars: 4 })}</div><div className="feed-time">demo</div></div>
              <div className="feed-body">
                <div className="row" style={{ gap: 10, marginTop: 10 }}>
                  <input
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    placeholder={pickTenantText(cfg?.pages?.account?.referralWidget?.generateCta, 'Generate Link', { minChars: 4 })}
                    style={{ flex: 1, minWidth: 180 }}
                  />
                  <button className="pill" onClick={makeRef}>{pickTenantText(cfg?.pages?.account?.referralWidget?.generateCta, 'Generate Link', { minChars: 4 })}</button>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <button className="pill" disabled={!refCode} onClick={copyRef}>
                    {pickTenantText(cfg?.pages?.account?.referralWidget?.buttons?.[0]?.label, 'Copy Link', { minChars: 4 })}
                  </button>
                  <a className="pill" href={links.referral} target="_blank" rel="noreferrer">
                    {pickTenantText(cfg?.pages?.account?.referralWidget?.buttons?.[1]?.label, 'Share', { minChars: 2 })}
                  </a>
                </div>
              </div>
            </div>

            <div className="feed-item">
              <div className="feed-top"><div className="feed-title">Stats</div><div className="feed-time">demo</div></div>
              <div className="feed-body">Visits: 41 • Signups: 3 • Conversion: 7.3%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 14 }}>
        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.account?.quickActions?.title, 'Quick Actions', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="callouts" style={{ marginTop: 12 }}>
            {(quickActions.length ? quickActions : fallbackQuickActions).slice(0, 3).map((item, idx) => (
              <div className="callout" key={`${item?.title || 'qa'}-${idx}`}>
                <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🧩' : idx === 1 ? '📊' : '🔗'}</div>
                <div>
                  <div className="callout-title">{pickTenantText(item?.title, idx === 0 ? 'Complete missions' : idx === 1 ? 'Portfolio inspector' : 'Open resource', { minChars: 4 })}</div>
                  <div className="callout-sub">{pickTenantText(item?.body || item?.blurb, idx === 0 ? 'Earn points in EngageFi and unlock perks.' : idx === 1 ? 'Show customers extra value inside VIP.' : 'Open this member tool.', { minChars: 10 })}</div>
                </div>
                <a className="pill" href={pickTenantUrl(item?.href, idx === 0 ? links.engage : links.portfolio)} target="_blank" rel="noreferrer">
                  {pickTenantText(item?.cta, idx === 0 ? 'EngageFi' : idx === 1 ? 'Open' : 'Open', { minChars: 2 })}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.account?.socialsPanel?.title, 'Social Accounts', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="callouts" style={{ marginTop: 12 }}>
            {(socialItems.length ? socialItems : fallbackSocials).slice(0, 3).map((item, idx) => (
              <div className="callout" key={`${item?.title || 'social'}-${idx}`}>
                <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🐦' : idx === 1 ? '📺' : '🎫'}</div>
                <div>
                  <div className="callout-title">{pickTenantText(item?.title, idx === 0 ? 'Follow on X' : idx === 1 ? 'YouTube' : 'Discord support', { minChars: 4 })}</div>
                  <div className="callout-sub">{pickTenantText(item?.body || item?.blurb, idx === 0 ? 'Demos and shipping updates.' : idx === 1 ? 'Tutorials and walkthroughs.' : 'Tickets + private channels.', { minChars: 8 })}</div>
                </div>
                <a className="pill" href={pickTenantUrl(item?.href, idx === 0 ? links.x : idx === 1 ? links.youtube : links.discord)} target="_blank" rel="noreferrer">
                  {pickTenantText(item?.cta, idx === 0 ? 'Open' : idx === 1 ? 'Watch' : 'Join', { minChars: 2 })}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.account?.notes?.title, 'Account Notes', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="mini-feed" style={{ marginTop: 12 }}>
            {(noteItems.length ? noteItems : fallbackNotes).slice(0, 3).map((item, idx) => (
              <div className="feed-item" key={`${item?.title || 'note'}-${idx}`}>
                <div className="feed-top">
                  <div className="feed-title">{pickTenantText(item?.title, idx === 0 ? 'Security' : 'Identity', { minChars: 3 })}</div>
                  <div className="feed-time">{pickTenantText(item?.badge, idx === 0 ? 'core' : 'optional', { minChars: 2 })}</div>
                </div>
                <div className="feed-body">{pickTenantText(item?.body, idx === 0 ? 'Wallet sign-in can reduce credential attacks. Tier checks live on the server.' : 'Link wallets to existing accounts for a smooth bridge from Web2 to Web3.', { minChars: 10 })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
