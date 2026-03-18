import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useSignMessage } from 'wagmi'
import PerkCard from '../components/PerkCard.jsx'
import { useTenantConfig } from '../hooks/useTenantConfig.js'
import { pickTenantText, pickTenantUrl } from '../lib/tenantConfig.js'
import '../styles/Page.css'
import '../styles/Perks.css'
import '../styles/GatewayPages.css'

export default function Perks() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync, isPending } = useSignMessage()
  const [unlocked, setUnlocked] = useState({ 1: true, 2: false, 3: false })
  const nav = useNavigate()
  const { cfg } = useTenantConfig()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gw_perks_unlock')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setUnlocked((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch {
      // no-op
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('gw_perks_unlock', JSON.stringify(unlocked))
    } catch {
      // no-op
    }
  }, [unlocked])

  const links = useMemo(
    () => ({
      x: pickTenantUrl(cfg?.socials?.x, 'https://x.com/Mktmakerxyz'),
      youtube: pickTenantUrl(cfg?.socials?.youtube, 'https://www.youtube.com/@xyz-Labs-xyz'),
      discord: pickTenantUrl(cfg?.socials?.discord, 'https://discord.com/invite/35mmdNVyEe'),
      engage: pickTenantUrl(cfg?.socials?.engage, 'https://engage.xyz-labs.xyz/quests')
    }),
    [cfg]
  )

  const perksHeroTitle = pickTenantText(cfg?.pages?.perks?.hero?.title, 'Perks are the “why” behind the gate 🎁🔐', { minChars: 6 })
  const perksHeroSubtitle = pickTenantText(
    cfg?.pages?.perks?.hero?.subtitle,
    'Tier 1, 2, 3… each tier unlocks something different. Today we simulate unlocks with a message signature. Tomorrow it can be NFT ownership, token balances, allowlists, or even employee access roles.',
    { minChars: 40 }
  )
  const heroBadges = Array.isArray(cfg?.pages?.perks?.hero?.kickerBadges) ? cfg.pages.perks.hero.kickerBadges : []
  const topLinks = Array.isArray(cfg?.pages?.perks?.topLinks) ? cfg.pages.perks.topLinks : []
  const tierCards = Array.isArray(cfg?.pages?.perks?.tierCards) ? cfg.pages.perks.tierCards : []
  const marketplaceItems = Array.isArray(cfg?.pages?.perks?.marketplaceItems) ? cfg.pages.perks.marketplaceItems : []
  const campaignItems = Array.isArray(cfg?.pages?.perks?.campaigns?.items) ? cfg.pages.perks.campaigns.items : []

  async function unlockTier(tier) {
    if (!isConnected) {
      localStorage.setItem('wg_toast', 'CONNECT WALLET FIRST')
      window.dispatchEvent(new Event('wg:toast'))
      return
    }
    try {
      const msg = `XYZ Labs Perks Demo\n\nUnlock Tier ${tier} (simulation)\nWallet: ${address}\nTime: ${new Date().toISOString()}`
      await signMessageAsync({ message: msg })
      setUnlocked((p) => ({ ...p, [tier]: true }))

      localStorage.setItem('wg_toast', `TIER ${tier} UNLOCKED (DEMO) ✅`)
      window.dispatchEvent(new Event('wg:toast'))

      if (tier === 2) nav('/perks/tier2')
      if (tier === 3) nav('/perks/tier3')
    } catch {
      localStorage.setItem('wg_toast', 'SIGNATURE REJECTED')
      window.dispatchEvent(new Event('wg:toast'))
    }
  }

  const fallbackTopLinks = [
    { label: 'Want points + quests?', desc: 'Try EngageFi missions and turn this into a growth machine.', href: links.engage, cta: 'EngageFi' },
    { label: 'Need support?', desc: 'Open a ticket in Discord for fast help.', href: links.discord, cta: 'Discord' }
  ]

  const fallbackMarketplaceItems = [
    { title: 'VIP Pass', body: 'Redeem points for upgraded access, VIP lines, or private sessions.', costLabel: '300 pts' },
    { title: 'Merch Coupon', body: 'Physical perks are sticky. Digital perks are instant. Do both.', costLabel: '120 pts' },
    { title: 'Priority support token', body: 'Want to white-label? Make a support token that routes to higher SLA.', costLabel: '500 pts' }
  ]

  const fallbackCampaignItems = [
    { title: 'Follow on X', body: 'Like a post, earn points, unlock the next tier.', ctaLabel: 'Open X', href: links.x },
    { title: 'Watch a demo', body: 'Give customers a quick “what is this?” walkthrough.', ctaLabel: 'Watch', href: links.youtube },
    { title: 'Referral link', body: 'Create a referral code for points and rewards.', ctaLabel: 'Coming soon', href: '' }
  ]

  return (
    <div className="page gw">
      <div className="card page-card panel page-hero">
        <div className="hero-left">
          <div className="hero-kicker">
            <img className="drop" src="/favicon-32x32.png" alt="" aria-hidden="true" />
            {(heroBadges.length ? heroBadges : ['Perks', 'Tier rules', 'Gated actions']).slice(0, 3).map((badge, idx) => (
              <div className="badge" key={`${badge}-${idx}`}>{badge}</div>
            ))}
          </div>

          <div className="hero-title">{perksHeroTitle}</div>
          <div className="hero-sub">{perksHeroSubtitle}</div>

          <div className="callouts">
            {(topLinks.length ? topLinks : fallbackTopLinks).slice(0, 3).map((item, idx) => (
              <div className="callout" key={`${item?.label || item?.title || 'top-link'}-${idx}`}>
                <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🧩' : idx === 1 ? '🎫' : '🔗'}</div>
                <div>
                  <div className="callout-title">
                    {pickTenantText(item?.label || item?.title, idx === 0 ? 'Want points + quests?' : idx === 1 ? 'Need support?' : 'Open resource', { minChars: 4 })}
                  </div>
                  <div className="callout-sub">
                    {pickTenantText(item?.desc || item?.body || item?.blurb, idx === 0 ? 'Try EngageFi missions and turn this into a growth machine.' : idx === 1 ? 'Open a ticket in Discord for fast help.' : 'Open this member resource.', { minChars: 10 })}
                  </div>
                </div>
                <a className="pill" href={pickTenantUrl(item?.href || item?.url, idx === 0 ? links.engage : links.discord)} target="_blank" rel="noreferrer">
                  {pickTenantText(item?.cta, idx === 0 ? 'EngageFi' : idx === 1 ? 'Discord' : 'Open', { minChars: 2 })}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="card-title">*** DEMO CONTROLS ***</div>
          <div className="hero-stats">
            <div className="stat">
              <div className="k">Tier 1</div>
              <div className="v">{unlocked[1] ? 'UNLOCKED' : 'LOCKED'}</div>
            </div>
            <div className="stat">
              <div className="k">Tier 2</div>
              <div className="v">{unlocked[2] ? 'UNLOCKED' : 'LOCKED'}</div>
            </div>
            <div className="stat">
              <div className="k">Tier 3</div>
              <div className="v">{unlocked[3] ? 'UNLOCKED' : 'LOCKED'}</div>
            </div>
          </div>
          <div className="hero-sub" style={{ marginTop: 12 }}>
            Tip: press Tier 2 or Tier 3 card button to sign a message and simulate an unlock.
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 14 }}>
        <PerkCard
          title={pickTenantText(tierCards?.[0]?.title, 'Tier 1: Member Billing   *** PayMee Demo ***', { minChars: 4 })}
          tier={pickTenantText(tierCards?.[0]?.tierLabel, 'TIER 1', { minChars: 2 }).toUpperCase()}
          locked={!unlocked[1]}
          actionLabel={unlocked[1] ? pickTenantText(tierCards?.[0]?.buttonLabel, 'Enter', { minChars: 2 }) : 'Unlock'}
          onAction={() => {
            if (!unlocked[1]) {
              localStorage.setItem('wg_toast', 'TIER 1 LOCKED 🔒 (DEMO)')
              window.dispatchEvent(new Event('wg:toast'))
              return
            }
            nav('/perks/tier1')
          }}
        >
          {pickTenantText(tierCards?.[0]?.body || tierCards?.[0]?.blurb, 'View open invoices. PayMe adds usdc payment rails for invoicing.', { minChars: 10 })}
        </PerkCard>

        <PerkCard
          title={pickTenantText(tierCards?.[1]?.title, 'Tier 2: Download', { minChars: 4 })}
          tier={pickTenantText(tierCards?.[1]?.tierLabel, 'TIER 2', { minChars: 2 }).toUpperCase()}
          locked={!unlocked[2]}
          actionLabel={unlocked[2] ? pickTenantText(tierCards?.[1]?.buttonLabel, 'Reveal', { minChars: 2 }) : isPending ? 'Signing…' : 'Unlock (sign message)'}
          onAction={unlocked[2] ? () => nav('/perks/tier2') : () => unlockTier(2)}
        >
          {pickTenantText(tierCards?.[1]?.body || tierCards?.[1]?.blurb, 'Tier 2 unlocks a download placeholder. Great for templates, coupons, access to internal tools, or early drops.', { minChars: 10 })}
        </PerkCard>

        <PerkCard
          title={pickTenantText(tierCards?.[2]?.title, 'Tier 3: Discord Invite', { minChars: 4 })}
          tier={pickTenantText(tierCards?.[2]?.tierLabel, 'TIER 3', { minChars: 2 }).toUpperCase()}
          locked={!unlocked[3]}
          actionLabel={unlocked[3] ? pickTenantText(tierCards?.[2]?.buttonLabel, 'Reveal', { minChars: 2 }) : isPending ? 'Signing…' : 'Unlock (sign message)'}
          onAction={unlocked[3] ? () => nav('/perks/tier3') : () => unlockTier(3)}
        >
          {pickTenantText(tierCards?.[2]?.body || tierCards?.[2]?.blurb, 'Tier 3 unlocks VIP support, a private channel, and concierge style help.', { minChars: 10 })}
        </PerkCard>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.perks?.marketplace?.title, 'Points Marketplace', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="card-sub">Example items (points-based). Hook this to your rewards engine.</div>
          <div className="mini-feed" style={{ marginTop: 12 }}>
            {(marketplaceItems.length ? marketplaceItems : fallbackMarketplaceItems).slice(0, 3).map((item, idx) => (
              <div className="feed-item" key={`${item?.title || 'market'}-${idx}`}>
                <div className="feed-top">
                  <div className="feed-title">{pickTenantText(item?.title, idx === 0 ? 'VIP Pass' : idx === 1 ? 'Merch Coupon' : 'Priority support token', { minChars: 4 })}</div>
                  <div className="feed-time">{pickTenantText(item?.costLabel, '—', { minChars: 1 })}</div>
                </div>
                <div className="feed-body">
                  {pickTenantText(item?.body || item?.blurb, idx === 0 ? 'Redeem points for upgraded access, VIP lines, or private sessions.' : idx === 1 ? 'Physical perks are sticky. Digital perks are instant. Do both.' : 'Want to white-label? Make a support token that routes to higher SLA.', { minChars: 10 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card page-card panel">
          <div className="card-title">*** {pickTenantText(cfg?.pages?.perks?.campaigns?.title, 'Featured Campaigns', { minChars: 4 }).toUpperCase()} ***</div>
          <div className="card-sub">Perks can drive engagement, retention, referrals, and sales.</div>
          <div className="callouts" style={{ marginTop: 12 }}>
            {(campaignItems.length ? campaignItems : fallbackCampaignItems).slice(0, 3).map((item, idx) => {
              const href = pickTenantUrl(item?.href || item?.url, idx === 0 ? links.x : idx === 1 ? links.youtube : '')
              const cta = pickTenantText(item?.ctaLabel || item?.cta, idx === 0 ? 'Open X' : idx === 1 ? 'Watch' : 'Coming soon', { minChars: 2 })
              return (
                <div className="callout" key={`${item?.title || 'campaign'}-${idx}`}>
                  <div className="callout-ic" aria-hidden="true">{idx === 0 ? '🐦' : idx === 1 ? '📺' : '🧑‍💻'}</div>
                  <div>
                    <div className="callout-title">
                      {pickTenantText(item?.title, idx === 0 ? 'Follow on X' : idx === 1 ? 'Watch a demo' : 'Referral link', { minChars: 4 })}
                    </div>
                    <div className="callout-sub">
                      {pickTenantText(item?.body || item?.blurb, idx === 0 ? 'Like a post, earn points, unlock the next tier.' : idx === 1 ? 'Give customers a quick “what is this?” walkthrough.' : 'Create a referral code for points and rewards.', { minChars: 10 })}
                    </div>
                  </div>
                  {href ? (
                    <a className="pill" href={href} target="_blank" rel="noreferrer">{cta}</a>
                  ) : (
                    <span className="badge">{cta}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
