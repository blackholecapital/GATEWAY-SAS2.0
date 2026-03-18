import '../styles/Page.css'
import './B2BToolsMobile.css'

const SECTIONS = [
  {
    title: 'Core Infrastructure',
    items: [
      { title: 'Gateway Engine', url: 'https://gateway.xyz-labs.xyz/vip', blurb: 'Tokenless sign-in + gating layer. Turn any route into VIP, partner, employee, or subscriber access with allowlist / ERC20 / NFT / signed-credential rules.' },
      { title: 'Referral Engine', url: 'https://refferals-xyz-labs.pages.dev/', blurb: 'Referral links + codes, tracked signups, and reward routing. Use it for affiliate campaigns, waitlists, or invite-only drops.' },
      { title: 'Points / Rewards', url: 'https://points.xyz-labs.xyz/', blurb: 'Points, redemptions, tiers, and loyalty. Connect it to Perks, coupons, and marketplace eligibility.' },
      { title: 'Airdrop Generator', url: 'https://airdrop.xyz-labs.xyz/', blurb: 'Build and run airdrops: allowlists, claim pages, and distribution runs with audit-friendly exports.' },
      { title: 'EngageFi Quests', url: 'https://engage.xyz-labs.xyz/quests', blurb: 'Quests and engagement tools: missions, check-ins, and growth loops tied to points + VIP unlocks.' }
    ]
  },
  {
    title: 'Capital Infrastructure',
    items: [
      { title: 'Swap (1inch)', url: 'https://swap.mktmaker.xyz/', blurb: 'Swap tokens via 1inch with a clean UX. Great inside VIP labs and partner dashboards.' },
      { title: 'Bridge', url: 'https://bridge.mktmaker.xyz/', blurb: 'Move assets cross-chain with guardrails. Ideal for onboarding, payouts, and treasury ops.' },
      { title: 'Vaults', url: 'https://vaults.mktmaker.xyz/vaults', blurb: 'Deposit and manage vaults. Use gated access for high-trust operators and customer segments.' },
      { title: 'Portfolio Inspector', url: 'https://portfolio.mktmaker.xyz/', blurb: 'Inspect holdings and PnL. Useful for power users, whales, and internal ops views.' },
      { title: 'SC Tools Studio', url: 'https://sctools.xyz-labs.xyz/', blurb: 'Smart contract utilities: reads, writes, and helpers for operators and builders.' },
      { title: 'PayMe v1', url: 'https://payments.xyz-labs.xyz/', icon: '💳', blurb: 'Accept USDC for invoices or generate a direct payment link. Lightweight version for fast payment requests.' },
      { title: 'PayMe V2', url: 'https://payme.xyz-labs.xyz/', icon: '💳', blurb: 'Full billing stack: customers, invoices, stablecoin payments, confirmations, alerts, and reporting. Built for real ops.' }
    ]
  },
  {
    title: 'Node Infrastructure',
    items: [{ title: 'GotNodes', url: 'https://gotnodes.xyz/', blurb: 'Node tools and access.' }]
  }
]

const SECTION_ICONS = {
  'Core Infrastructure': '🧩',
  'Capital Infrastructure': '💱',
  'Node Infrastructure': '🛰️'
}

const MOBILE_SECTION_LABELS = {
  'Core Infrastructure': 'Core',
  'Capital Infrastructure': 'Capital',
  'Node Infrastructure': 'Nodes'
}

export default function B2BToolsMobile() {
  return (
    <div className="page">
      <div className="card page-card b2b-hero">
        <div className="b2b-hero-top">
          <div className="b2b-hero-title-inline">
            <span className="card-title">*** Tools Lab ***</span>
             </div>

        </div>

        <div className="b2b-mobile-list">
          {SECTIONS.map(sec => (
            <div className="b2b-mobile-section" key={sec.title}>
              <div className="b2b-mobile-section-title">
                {MOBILE_SECTION_LABELS[sec.title] ?? sec.title}
              </div>

              {sec.items.map(it => (
                <div className="b2b-mobile-tool" key={it.url}>
                  <div className="b2b-mobile-tool-row">
                    <div className="b2b-mobile-tool-icon" aria-hidden="true">
                      {it.icon ?? SECTION_ICONS[sec.title]}
                    </div>
                    <div>
                      <a className="b2b-mobile-tool-name" href={it.url} target="_blank" rel="noreferrer">
                        {it.title}
                      </a>
                      <div className="b2b-mobile-tool-blurb">{it.blurb}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
   </div>
  )
}
