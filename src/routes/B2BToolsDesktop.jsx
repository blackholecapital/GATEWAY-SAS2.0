import '../styles/Page.css'
import './B2BTools.css'

const SECTIONS = [
     {
    title: 'Core Infrastructure',
    items: [
      { title: 'gateway Engine', url: 'https://gateway.xyz-labs.xyz/vip', blurb: 'Gate access + VIP flows.' },
      { title: 'Referral Engine', url: 'https://refferals-xyz-labs.pages.dev/', blurb: 'Track and manage referrals.' },
      { title: 'Airdrop Generator', url: 'https://airdrop.xyz-labs.xyz/', blurb: 'Build and run airdrops.' },
      { title: 'EngageFi Quests', url: 'https://engagefi-xyz-labs.pages.dev/quests', blurb: 'Quests and engagement tools.' },
      { title: 'Points / Rewards', url: 'https://points.xyz-labs.xyz/', blurb: 'Points, rewards, and status.' },
    ]
  },
  {
    title: 'Capital Infrastructure',
        items: [
      { title: 'Swap (1inch)', url: 'https://swap.mktmaker.xyz/', blurb: 'Swap tokens via 1inch.' },
      { title: 'Bridge', url: 'https://bridge.mktmaker.xyz/', blurb: 'Move assets cross-chain.' },
      { title: 'Portfolio Inspector', url: 'https://portfolio.mktmaker.xyz/', blurb: 'Inspect holdings and PnL.' },
      { title: 'SC Tools Studio', url: 'https://sctools.xyz-labs.xyz/', blurb: 'Smart contract utilities.' },
      { title: 'Vaults', url: 'https://vaults.mktmaker.xyz/vaults', blurb: 'Deposit and manage vaults.' },
    ]
  },
  {
    title: 'Payments Infrastructure',
    items: [
      { title: 'PayMe LTE', url: 'https://payments.xyz-labs.xyz/', icon: '💳', blurb: 'Accept payments in USDC for invoices or send a direct payment link. Lte version send instant pmt request links' },
      { title: 'PayMe V2', url: 'https://payme.xyz-labs.xyz/', icon: '💳', blurb: 'Accept payments in USDC and other stablecoins. Includes customer database, invoicing, payment confirmations, and alerting.' }
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
  'Node Infrastructure': '🛰️',
  'Payments Infrastructure': '💳'
}

function sectionClass(title){
  if (title === 'Core Infrastructure') return 'section-core'
  if (title === 'Capital Infrastructure') return 'section-capital'
  if (title === 'Node Infrastructure') return 'section-node'
  return ''
}

function cardClass(it){
  if (!it?.title) return ''
  const t = it.title
  if (t === 'PayMe LTE' || t === 'PayMe V2') return 'b2b-payme'
  if (t === 'GotNodes') return 'b2b-node'
  // Capital
  if (t === 'Swap (1inch)' || t === 'Bridge' || t === 'Vaults' || t === 'Portfolio Inspector' || t === 'SC Tools Studio') return 'b2b-capital'
  // Core
  return 'b2b-core'
}


 

export default function B2BTools() {
       const allItems = SECTIONS.flatMap(sec => sec.items.map(it => ({ ...it, section: sec.title, icon: (it.icon ?? SECTION_ICONS[sec.title]), blurb: it.blurb })))
    const itemsByTitle = Object.fromEntries(allItems.map(it => [it.title, it]))

       // 8-column layout:
    // Core (3) | spacer (1) | Capital (3) | Node (1)
    // Row 1: Wallet, Referral, Points | _ | Swap, Bridge, Vaults | GotNodes
    // Row 2: Airdrop, EngageFi, _     | _ | Portfolio, SC Tools, Payments | _
      const displayItems = [
      // row 1 (Core | spacer | Capital | Node)
      itemsByTitle['gateway Engine'],
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
      itemsByTitle['PayMe LTE'],
      itemsByTitle['PayMe V2']
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
            <span title="Payments Infrastructure">💳 Payments</span>
            <span title="Node Infrastructure">🛰️ Node</span>
          </div>
        </div>

        <div className="b2b-columns">
          {SECTIONS.map(sec => (
            <div className={`b2b-col ${sectionClass(sec.title)}`} key={sec.title}>
              <div className={`section-title ${sec.title === 'Payments Infrastructure' ? 'section-title-payments' : ''}`}>{sec.title}</div>
                <ul className={`b2b-bullets ${sec.title === 'Capital Infrastructure' ? 'b2b-bullets-capital' : ''} ${sec.title === 'Core Infrastructure' ? 'b2b-bullets-core' : ''}`}>
                {sec.items.map(it => (
                  <li key={`${it.title}-${it.url}`}>
                    <span className="b2b-bullet-icon" aria-hidden="true">{SECTION_ICONS[sec.title]}</span>
                    <span>{it.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
         </div>

      <div className="card page-card b2b-upgrades-card">
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

      <div className="b2b-mobile-list">
        {SECTIONS.map(sec => (
          <div className="b2b-mobile-section" key={sec.title}>
            <div className="section-title">{sec.title}</div>
            {sec.items.map(it => (
              <a
                key={`${it.title}-${it.url}`}
                className="b2b-mobile-item"
                href={it.url}
                target="_blank"
                rel="noreferrer"
                aria-label={it.title}
                title={it.url}
              >
                <div className="b2b-mobile-item-title">
                  <span aria-hidden="true">{(it.icon ?? SECTION_ICONS[sec.title])}</span>{' '}
                  {it.title}
                </div>
                <div className="b2b-mobile-item-blurb">{it.blurb}</div>
                <div className="b2b-mobile-item-meta">{it.url}</div>
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="b2b-cartridge-grid">
        {displayItems.map((it, idx) => (
          it ? (
            <a
              key={`${it.title}-${it.url}`}
              className={`b2b-cartridge ${cardClass(it)}`}
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
    </div>
  )
}
