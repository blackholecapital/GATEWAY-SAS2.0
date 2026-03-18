import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import '../styles/Page.css'
import '../styles/GatewayPages.css'

export default function PerksTier2() {
  const { address, isConnected } = useAccount()
  const [scheme, setScheme] = useState('a')

  useEffect(() => {
    try {
      const s = localStorage.getItem('gw_scheme')
      if (s === 'a' || s === 'b' || s === 'c') setScheme(s)
    } catch {}
  }, [])

  return (
    <div className={`page gw gw-scheme-${scheme}`}>
      <div className="gw-top">
        <div className="gw-hero">
          <div className="gw-title">🔓 Welcome to Tier 2</div>
          <div className="gw-sub">
            This is a demo of <b>Gateway</b> tiered access. Tier 2 can be gated by an NFT,
            a token threshold, an employee allowlist, or a signed credential.
          </div>
          <div className="gw-badges">
            <span className="gw-badge">🎟️ Token / NFT Gate</span>
            <span className="gw-badge">🏢 Employee Access</span>
            <span className="gw-badge">📦 Exclusive Downloads</span>
          </div>
        </div>

        <div className="gw-windows">
          <div className="win">
            <div className="win-title">Customer Billing</div>
            <div className="win-body">Clients can view invoices, pay in USDC, download receipts, and manage billing contacts.</div>
            <div className="win-kv">
              <div><span className="k">Open invoices</span><span className="v">2</span></div>
              <div><span className="k">Next due</span><span className="v">Feb 28</span></div>
            </div>
          </div>
          <div className="win">
            <div className="win-title">Extra Credentials</div>
            <div className="win-body">Optional: employee badge, subscription status, allowlisted roles, or a signed credential issued by your server.</div>
            <div className="win-tags">
              <span className="tag">EMPLOYEE</span>
              <span className="tag">SUBSCRIBER</span>
              <span className="tag">ALLOWLIST</span>
            </div>
          </div>
          <div className="holo-drop" aria-hidden="true" />
        </div>
      </div>

      <div className="gw-grid">
        <div className="panel block">
          <div className="block-title">🏁 Why Tier 2 exists</div>
          <ul className="mini-list">
            <li>Unlock premium rewards, coupons, downloads, and gated pages.</li>
            <li>Use it for employee tools, partner portals, or VIP customer perks.</li>
            <li>Track membership status with on-chain proofs or off-chain roles.</li>
          </ul>
        </div>

        <div className="panel block">
          <div className="block-title">🧾 Demo identity</div>
         <div style={{ display:'grid', gap:8, fontSize:12, opacity:.88 }}>
            <div><b>Wallet:</b> {isConnected ? address : 'Not connected'}</div>
            <div><b>Chain:</b> Base (8453) recommended</div>
            <div><b>Status:</b> Tier 2 Verified ✅</div>
          </div>
        </div>


        <div className="panel block">
          <div className="block-title">💳 Customer account area (Tier 2 example)</div>
          <div className="card-sub">A realistic Tier 2 page often becomes a customer portal: billing, invoices, receipts, and account settings.</div>

          <div className="mini-cards" style={{ marginTop: 10 }}>
            <div className="mini-card">
              <div className="mini-card-top"><b>Invoice</b> INV-1042 <span className="pill small">Due</span></div>
              <div className="mini-card-body">Gateway Pro • Feb 2026 • 250 USDC</div>
              <div className="mini-card-actions">
                <button className="pill small">Pay now</button>
                <button className="pill small ghost">Download PDF</button>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-card-top"><b>Invoice</b> INV-1039 <span className="pill small">Paid</span></div>
              <div className="mini-card-body">VIP Access Layer • Jan 2026 • 250 USDC</div>
              <div className="mini-card-actions">
                <button className="pill small ghost">View receipt</button>
                <button className="pill small ghost">Download PDF</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel block warn">
          <div className="block-title">🧠 Implementation note</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, opacity: .9 }}>
            In production, Gateway checks a user&apos;s NFT/token/role and reveals Tier 2 content automatically.
            In this demo, Tier 2 is unlocked by a signed message on the Perks page.
          </div>
        </div>
      </div>
    </div>
  )
}
