import '../styles/Page.css'
import './B2BTools.css'

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
    items: [
      { title: 'GotNodes', url: 'https://gotnodes.xyz/', blurb: 'Node tools and access.' }
    ]
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

export default function B2BTools() {
       const allItems = SECTIONS.flatMap(sec => sec.items.map(it => ({ ...it, section: sec.title, icon: (it.icon ?? SECTION_ICONS[sec.title]), blurb: it.blurb })))
    const itemsByTitle = Object.fromEntries(allItems.map(it => [it.title, it]))

       // 8-column layout:
    // Core (3) | spacer (1) | Capital (3) | Node (1)
    // Row 1: Wallet, Referral, Points | _ | Swap, Bridge, Vaults | GotNodes
    // Row 2: Airdrop, EngageFi, _     | _ | Portfolio, SC Tools, Payments | _
      const displayItems = [
      // row 1
      itemsByTitle['Gateway Engine'],
      itemsByTitle['Referral Engine'],
      itemsByTitle['Points / Rewards'],
      itemsByTitle['Swap (1inch)'],
      itemsByTitle['Bridge'],
      itemsByTitle['Vaults'],
      itemsByTitle['GotNodes'],
        null,      
           // row 2
      itemsByTitle['Airdrop Generator'],
      itemsByTitle['EngageFi Quests'],
      null,
      itemsByTitle['Portfolio Inspector'],
      itemsByTitle['SC Tools Studio'],
      { title: 'PayMe v1', url: 'https://payments.xyz-labs.xyz/', icon: '💳', blurb: 'Accept USDC for invoices or generate a direct payment link. Lightweight version for fast payment requests.' },
      { title: 'PayMe V2', url: 'https://payme.xyz-labs.xyz/', icon: '💳', blurb: 'Full billing stack: customers, invoices, stablecoin payments, confirmations, alerts, and reporting. Built for real ops.' }
    ]

  const isMobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 980px)')?.matches
  return (
    <div className="page">
      <div className="card page-card b2b-hero">
                <div className="b2b-hero-top">
          <div className="b2b-hero-title-inline">
            <span className="b2b-hero-span">***</span>
            <span className="card-title">Business Tools Lab</span>
            <span className="b2b-hero-span">***</span>
          </div>

          <div className="b2b-hero-icons">
            <span title="Core Infrastructure">🧩 Core</span>
            <span title="Capital Infrastructure">💱 Capital</span>
            <span title="Node Infrastructure">🛰️ Node</span>
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
           
        {!isMobile && (
        <div className="b2b-columns">
          {SECTIONS.map(sec => (
            <div className="b2b-col" key={sec.title}>
              <div className="section-title">{sec.title}</div>
                <ul className={`b2b-bullets ${sec.title === 'Capital Infrastructure' ? 'b2b-bullets-capital' : ''} ${sec.title === 'Core Infrastructure' ? 'b2b-bullets-core' : ''}`}>
                {sec.items.map(it => (
                  <li key={it.url}>
                    <span className="b2b-bullet-icon" aria-hidden="true">{SECTION_ICONS[sec.title]}</span>
                    <span>{it.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        )}

        {!isMobile && (
        <div className="b2b-upgrades">
          Think of each <b>cartridge</b> as an upgrade module you can snap into your Gateway-powered app as you grow.
          Start with simple VIP access, then add revenue, engagement, and ops tools without rebuilding your member system.

          <ul className="mini-list" style={{ marginTop: 10, textAlign: 'left', maxWidth: 980, marginInline: 'auto' }}>
            <li><b>Gateway Engine</b>: gate routes by NFT / ERC20 balance / allowlist / signed credential (employee, subscriber, partner).</li>
            <li><b>Referral Engine</b>: invite links, affiliate tracking, campaign codes, and rewards (points or USDC payouts).</li>
            <li><b>Points / Rewards</b>: loyalty tiers, redemptions, coupons, perks marketplace eligibility, and retention loops.</li>
            <li><b>PayMe</b>: invoice portals, stablecoin checkout, payment confirmations, receipts, and alerts (perfect for B2B).</li>
            <li><b>Capital tools</b>: swap + bridge + vault workflows for onboarding, treasury ops, and power-user dashboards.</li>
          </ul>
        </div>
         </div>
        )}

        {!isMobile && (
      <div className="b2b-cartridge-grid">
        {displayItems.map((it, idx) => (
          it ? (
            <a
              key={it.url}
              className="b2b-cartridge"
              href={it.url}
              target="_blank"
              rel="noreferrer"
              aria-label={it.title}
              title={it.url}
            >
              <div className="b2b-cartridge-top">
                <span className="b2b-cartridge-title">{it.title}</span>
              </div>

              <div className="b2b-cartridge-mid">
                <span className="b2b-cartridge-icon" aria-hidden="true">{it.icon}</span>
              </div>

              <div className="b2b-cartridge-bottom">
                <div className="b2b-cartridge-blurb">{it.blurb}</div>
              </div>
            </a>
          ) : (
            <div key={`spacer-${idx}`} className="b2b-cartridge b2b-cartridge-spacer" aria-hidden="true" />
          )
        ))}
      </div>
        )}
    </div>
  )
}      itemsByTitle['Vaults'],
      itemsByTitle['GotNodes'],
        null,      
           // row 2
      itemsByTitle['Airdrop Generator'],
      itemsByTitle['EngageFi Quests'],
      null,
      itemsByTitle['Portfolio Inspector'],
      itemsByTitle['SC Tools Studio'],
      { title: 'PayMe v1', url: 'https://payments.xyz-labs.xyz/', icon: '💳', blurb: 'Accept USDC for invoices or generate a direct payment link. Lightweight version for fast payment requests.' },
      { title: 'PayMe V2', url: 'https://payme.xyz-labs.xyz/', icon: '💳', blurb: 'Full billing stack: customers, invoices, stablecoin payments, confirmations, alerts, and reporting. Built for real ops.' }
    ]

  return (
    <div className="page">
      <div className="card page-card b2b-hero">
                <div className="b2b-hero-top">
          <div className="b2b-hero-title-inline">
            <span className="b2b-hero-span">***</span>
            <span className="card-title">Business Tools Lab</span>
            <span className="b2b-hero-span">***</span>
          </div>

          <div className="b2b-hero-icons">
            <span title="Core Infrastructure">🧩 Core</span>
            <span title="Capital Infrastructure">💱 Capital</span>
            <span title="Node Infrastructure">🛰️ Node</span>
          </div>
        </div>
           
             {isMobile && (
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
             )}
             {!isMobile && (
        <>
          <div className="b2b-columns">
            {SECTIONS.map(sec => (
              <div className="b2b-col" key={sec.title}>
                <div className="section-title">{sec.title}</div>
                  <ul className={`b2b-bullets ${sec.title === 'Capital Infrastructure' ? 'b2b-bullets-capital' : ''} ${sec.title === 'Core Infrastructure' ? 'b2b-bullets-core' : ''}`}>
                  {sec.items.map(it => (
                    <li key={it.url}>
                      <span className="b2b-bullet-icon" aria-hidden="true">{SECTION_ICONS[sec.title]}</span>
                      <span>{it.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="b2b-upgrades">
            Think of each <b>cartridge</b> as an upgrade module you can snap into your Gateway-powered app as you grow.
            Start with simple VIP access, then add revenue, engagement, and ops tools without rebuilding your member system.

            <ul className="mini-list" style={{ marginTop: 10, textAlign: 'left', maxWidth: 980, marginInline: 'auto' }}>
              <li><b>Gateway Engine</b>: gate routes by NFT / ERC20 balance / allowlist / signed credential (employee, subscriber, partner).</li>
              <li><b>Referral Engine</b>: invite links, affiliate tracking, campaign codes, and rewards (points or USDC payouts).</li>
              <li><b>Points / Rewards</b>: loyalty tiers, redemptions, coupons, perks marketplace eligibility, and retention loops.</li>
              <li><b>PayMe</b>: invoice portals, stablecoin checkout, payment confirmations, receipts, and alerts (perfect for B2B).</li>
              <li><b>Capital tools</b>: swap + bridge + vault workflows for onboarding, treasury ops, and power-user dashboards.</li>
            </ul>
          </div>
        </>
        )}

        {!isMobile && (
       <div className="b2b-cartridge-grid">
        {displayItems.map((it, idx) => (
          it ? (
            <a
              key={it.url}
              className="b2b-cartridge"
              href={it.url}
              target="_blank"
              rel="noreferrer"
              aria-label={it.title}
              title={it.url}
            >
              <div className="b2b-cartridge-top">
                <span className="b2b-cartridge-title">{it.title}</span>
              </div>

              <div className="b2b-cartridge-mid">
                <span className="b2b-cartridge-icon" aria-hidden="true">{it.icon}</span>
              </div>

              <div className="b2b-cartridge-bottom">
                <div className="b2b-cartridge-blurb">{it.blurb}</div>
              </div>
            </a>
          ) : (
            <div key={`spacer-${idx}`} className="b2b-cartridge b2b-cartridge-spacer" aria-hidden="true" />
          )
        ))}
      </div>
       )}
     </div>

    
