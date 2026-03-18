import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { apiGet } from '../lib/api.js'
import { useAuth } from '../hooks/useAuth.js'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import VipIdentityCard from '../components/VipIdentityCard.jsx'
import { tenantFromPathname } from '../lib/tenant.js'
import { pickTenantText, pickTenantUrl } from '../lib/tenantConfig.js'
import '../styles/Page.css'
import '../styles/Vip.css'
import '../styles/GatewayPages.css'

export default function Vip() {
  const { me } = useAuth()
  const [recent, setRecent] = useState([])
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname)
  const { cfg } = useTenantConfig()

  const links = useMemo(
    () => ({
      x: pickTenantUrl(cfg?.socials?.x, 'https://x.com/Mktmakerxyz'),
      youtube: pickTenantUrl(cfg?.socials?.youtube, 'https://www.youtube.com/@xyz-Labs-xyz'),
      discord: pickTenantUrl(cfg?.socials?.discord, 'https://discord.com/invite/35mmdNVyEe')
    }),
    [cfg]
  )

  const vipHeroTitle = pickTenantText(cfg?.pages?.vip?.hero?.title, 'VIP IS WHERE THE BRAND FEELS ALIVE', { minChars: 6 })
  const vipHeroSubtitle = pickTenantText(
    cfg?.pages?.vip?.hero?.subtitle,
    'Announcements, rewards, drops, partner links, invite only tools. This is where you make customers feel like they found the hidden door behind the bookshelf.',
    { minChars: 40 }
  )
  const announcements = Array.isArray(cfg?.pages?.vip?.announcements) ? cfg.pages.vip.announcements : []
  const vipQuickLinks = Array.isArray(cfg?.pages?.vip?.quickLinks) ? cfg.pages.vip.quickLinks : []
  const partyItems = Array.isArray(cfg?.pages?.vip?.partyBoard?.items) ? cfg.pages.vip.partyBoard.items : []
  const boardItems = Array.isArray(cfg?.pages?.vip?.announcementsBoard?.items) ? cfg.pages.vip.announcementsBoard.items : []
  const ann1 = announcements[0] || {}
  const ann2 = announcements[1] || {}

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiGet('/api/activity')
        setRecent(res?.logs || [])
      } catch {
        // non-admins won't have access; show local activity placeholder
        setRecent([])
      }
    })()
  }, [])

  return (
    <div className="page gw vip-page" data-tenant={tenant || 'default'}>
      <div className="card page-card panel page-hero">
        <div className="hero-left">
          <div className="hero-kicker">
            {cfg?.assets?.logoUrl ? (
              <img
                src={cfg.assets.logoUrl}
                alt={cfg?.brand?.name || 'logo'}
                style={{ height: 22, width: 'auto', marginRight: 10, borderRadius: 6 }}
              />
            ) : null}
            <img className="drop" src="/favicon-32x32.png" alt="" aria-hidden="true" />
            <div className="badge">VIP lounge</div>
            <div className="badge">Tier {me?.tier || '—'}</div>
            <div className="badge">Session cookie</div>
          </div>

          <div className="hero-title">
            {vipHeroTitle} {cfg?.pages?.vip?.hero?.emoji || '🎛️🟢'}
          </div>
          <div className="hero-sub">
            {vipHeroSubtitle}
          </div>

          <div className="callouts">
            <div className="callout">
              <div className="callout-ic" aria-hidden="true">📣</div>
              <div>
                <div className="callout-title">{pickTenantText(ann1.title, "Announcement", { minChars: 6 })}</div>
                <div className="callout-sub">{pickTenantText(ann1.body, "New perks drop this week. Tier 2 gets early access.", { minChars: 40 })}</div>
              </div>
              <span className="badge">LIVE</span>
            </div>
            <div className="callout">
              <div className="callout-ic" aria-hidden="true">🗓️</div>
              <div>
                <div className="callout-title">{pickTenantText(ann2.title, "Meetup", { minChars: 6 })}</div>
                <div className="callout-sub">{pickTenantText(ann2.body, "Next week: Web3 for real businesses mini demo night.", { minChars: 40 })}</div>
              </div>
              <span className="badge">RSVP</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="card-title">*** QUICK LINKS ***</div>
          <div className="callouts" style={{ marginTop: 10 }}>
            {(vipQuickLinks.length ? vipQuickLinks : [{ label: 'X feed', desc: 'See updates, demos, and drops.', href: links.x, cta: 'Open' }, { label: 'YouTube', desc: 'Short walkthroughs for clients.', href: links.youtube, cta: 'Watch' }, { label: 'Support desk', desc: 'Need help? Open a Discord ticket.', href: links.discord, cta: 'Discord' }]).slice(0, 3).map((item, idx) => {
              const href = pickTenantUrl(item?.href || item?.url, idx === 0 ? links.x : idx === 1 ? links.youtube : links.discord)
              return (
                <div className="callout" key={`${item?.label || 'vip-ql'}-${idx}`}>
                  <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🐦' : idx === 1 ? '📺' : '🎫'}</div>
                  <div>
                    <div className="callout-title">{pickTenantText(item?.label, idx === 0 ? 'X feed' : idx === 1 ? 'YouTube' : 'Support desk', { minChars: 4 })}</div>
                    <div className="callout-sub">{pickTenantText(item?.desc || item?.body, idx === 0 ? 'See updates, demos, and drops.' : idx === 1 ? 'Short walkthroughs for clients.' : 'Need help? Open a Discord ticket.', { minChars: 20 })}</div>
                  </div>
                  <a className="pill" href={href} target="_blank" rel="noreferrer">{pickTenantText(item?.cta, idx === 1 ? 'Watch' : 'Open', { minChars: 2 })}</a>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <VipIdentityCard me={me} />

        <div className="card page-card panel">
          <div className="card-title">*** RECENT ACTIVITY ***</div>

          {recent.length ? (
            <div className="activity" style={{ marginTop: 12 }}>
              {recent.slice(0, 8).map((l, i) => (
                <div key={i} className="kv">
                  <div className="k">{new Date(l.ts).toLocaleTimeString()}</div>
                  <div className="v">{l.ok ? 'LOGIN OK' : 'FAIL'} • {l.reason || '—'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mini-feed" style={{ marginTop: 12 }}>
              <div className="feed-item">
                <div className="feed-top">
                  <div className="feed-title">Signed in ✅</div>
                  <div className="feed-time">just now</div>
                </div>
                <div className="feed-body">Server verified signature, issued an httpOnly session cookie.</div>
              </div>
              <div className="feed-item">
                <div className="feed-top">
                  <div className="feed-title">Perks check 🎁</div>
                  <div className="feed-time">1m</div>
                </div>
                <div className="feed-body">Tier rules evaluated. Locked items stay locked, unlocked items sparkle.</div>
              </div>
              <div className="feed-item">
                <div className="feed-top">
                  <div className="feed-title">Invite sent ✉️</div>
                  <div className="feed-time">demo</div>
                </div>
                <div className="feed-body">Admin could issue a VIP invite link or mint an NFT pass.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid-3">
        <div className="card page-card panel">
          <div className="card-title">{pickTenantText(cfg?.pages?.vip?.partyBoard?.title, 'Party Board', { minChars: 4 })}</div>
          <div className="card-sub">A rotating wall of stuff members actually care about.</div>
          <div className="mini-feed" style={{ marginTop: 12 }}>
            {(partyItems.length ? partyItems : [{ title: '🔥 Drop of the week', body: '"Gateway Starter" template pack. Claim in Perks.', when: 'Fri' }]).slice(0, 3).map((item, idx) => (
              <div className="feed-item" key={`party-${idx}`}>
                <div className="feed-top"><div className="feed-title">{pickTenantText(item?.title, 'Update', { minChars: 4 })}</div><div className="feed-time">{pickTenantText(item?.when, 'live', { minChars: 2 })}</div></div>
                <div className="feed-body">{pickTenantText(item?.body || item?.blurb, 'Member update available now.', { minChars: 20 })}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">{pickTenantText(cfg?.pages?.vip?.announcementsBoard?.title, 'Announcements Board', { minChars: 4 })}</div>
          <div className="mini-feed" style={{ marginTop: 12 }}>
            {(boardItems.length ? boardItems : [{ title: '🎟️ Event', body: 'VIP members get early RSVP links, discounts, and private replays.', when: 'next week' }]).slice(0, 3).map((item, idx) => (
              <div className="feed-item" key={`board-${idx}`}>
                <div className="feed-top"><div className="feed-title">{pickTenantText(item?.title, 'Announcement', { minChars: 4 })}</div><div className="feed-time">{pickTenantText(item?.when, 'live', { minChars: 2 })}</div></div>
                <div className="feed-body">{pickTenantText(item?.body || item?.blurb, 'Announcements are live.', { minChars: 20 })}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">{pickTenantText(cfg?.pages?.vip?.postWidget?.title, 'Post to VIP Feed', { minChars: 4 })}</div>
          <div className="card-sub">Imagine embedding your latest post, campaign, or highlight.</div>
          <div className="toy" style={{ marginTop: 12, minHeight: 190 }}>
            <div className="toy-title">{pickTenantText(cfg?.pages?.vip?.postWidget?.pinnedTitle, 'Pinned vibe', { minChars: 4 })}</div>
            <div className="toy-sub">{pickTenantText(cfg?.pages?.vip?.postWidget?.pinnedBody, 'Liquidity is inevitable. Rewards are negotiable.', { minChars: 20 })}</div>
            <div className="beaker" aria-hidden="true" />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <a className="pill" href={links.x} target="_blank" rel="noreferrer">View on X</a>
            <a className="pill" href={links.youtube} target="_blank" rel="noreferrer">Watch demo</a>
          </div>
        </div>
      </div>
    </div>
  )
}
