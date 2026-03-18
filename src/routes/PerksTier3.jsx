import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import '../styles/Page.css'
import '../styles/GatewayPages.css'

export default function PerksTier3() {
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
          <div className="gw-title">🧬 Welcome to Tier 3</div>
          <div className="gw-sub">
            Tier 3 is the “inner lab”. Think: admin-grade tools, vault access, premium marketplaces,
            or high-trust employee systems.
          </div>
          <div className="gw-badges">
            <span className="gw-badge">🔐 Highest Trust</span>
            <span className="gw-badge">🛡️ Role + Proof</span>
            <span className="gw-badge">🏦 Marketplaces</span>
          </div>
        </div>

        <div className="gw-windows">
          <div className="win">
            <div className="win-title">Ops console</div>
            <div className="win-body">Tier 3 is where you put higher-trust tools: admin actions, approvals, audit logs, and vault routing.</div>
            <div className="win-kv">
              <div><span className="k">Approvals</span><span className="v">7</span></div>
              <div><span className="k">Alerts</span><span className="v">1</span></div>
            </div>
          </div>
          <div className="win">
            <div className="win-title">Vault + Marketplace</div>
            <div className="win-body">Unlock vault access, premium marketplaces, and partner portals using NFT + role proofs + server attestation.</div>
            <div className="win-tags">
              <span className="tag">VAULT</span>
              <span className="tag">ADMIN</span>
              <span className="tag">ATTEST</span>
            </div>
          </div>
          <div className="holo-drop violet" aria-hidden="true" />
        </div>
      </div>

      <div className="gw-grid">
        <div className="panel block">
          <div className="block-title">🚀 Tier 3 use-cases</div>
          <ul className="mini-list">
            <li>Employee-only apps, internal dashboards, secure documents.</li>
            <li>Premium customer club with drops, early access, marketplaces.</li>
            <li>Multi-tier rewards engines tied to points + on-chain proofs.</li>
          </ul>
        </div>

        <div className="panel block">
          <div className="block-title">🪪 Lived-in admin widgets (Tier 3 examples)</div>
          <div className="card-sub">These are the kinds of “inner lab” windows teams actually use day-to-day.</div>

          <div className="mini-cards" style={{ marginTop: 10 }}>
            <div className="mini-card">
              <div className="mini-card-top"><b>Approval queue</b> <span className="pill small">1 urgent</span></div>
              <div className="mini-card-body">Pending: partner payout • 1,250 USDC • requires 2 signatures</div>
              <div className="mini-card-actions">
                <button className="pill small">Approve</button>
                <button className="pill small ghost">Review</button>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-card-top"><b>Audit log</b> <span className="pill small ghost">last 24h</span></div>
              <div className="mini-card-body">11 events • role changes, invoice payments, vault transfers</div>
              <div className="mini-card-actions">
                <button className="pill small ghost">Open</button>
                <button className="pill small ghost">Export</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel block">
          <div className="block-title">🧾 Demo identity</div>
          <div style={{ display: 'grid', gap: 8, fontSize: 12, opacity: .88 }}>
            <div><b>Wallet:</b> {isConnected ? address : 'Not connected'}</div>
            <div><b>Chain:</b> Base (8453) recommended</div>
            <div><b>Status:</b> Tier 3 Verified ✅</div>
          </div>
        </div>

        <div className="panel block warn">
          <div className="block-title">🧩 Upgrade path</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, opacity: .9 }}>
            Gateway can mint an NFT after an off-chain purchase, or check existing holdings.
            Tier 3 can also require a server-side signature or time-based attestation.
          </div>
        </div>
      </div>
    </div>
  )
}
