import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import '../styles/Page.css'
import '../styles/GatewayPages.css'
import '../styles/PerksTier1.css'

const WIDGET_BASE = 'https://payme.xyz-labs.xyz/?embed=1&size=md'

export default function PerksTier1() {
  const { address, isConnected } = useAccount()
  const [selected, setSelected] = useState(null)

  const invoices = useMemo(
    () => [
      { id: 'INV-1001', amount: '1.11', due: 'Feb 21' },
      { id: 'INV-1002', amount: '1.37', due: 'Feb 24' },
      { id: 'INV-1003', amount: '1.88', due: 'Feb 28' },
      { id: 'INV-1004', amount: '1.52', due: 'Mar 02' }
    ],
    []
  )

  const onSelect = (inv) => setSelected(inv)

  const widgetSrc = useMemo(() => {
    const inv = selected ?? invoices[0]
    const u = new URL(WIDGET_BASE)
    u.searchParams.set('inv', inv.id)
    u.searchParams.set('amt', inv.amount)
    return u.toString()
  }, [selected, invoices])

  return (
    <div className="page gateway-page">
      <div className="card page-card tier1-shell">
        <div className="tier1-top">
          <div>
            <div className="tier1-title">Member Billing</div>
            <div className="tier1-sub">
            Your members can access their billing portal here to review open invoices and make a payment. Click <b>Pay</b> on any invoice to auto-import it into the embedded <b>PayMe</b> widget. The invoice ID and USDC amount are locked from the invoice (Base network), so the user can only confirm and pay — no edits, no mistakes.
            </div>
          </div>

          <div className="tier1-wallet">
            <div className="tier1-wallet-label">Wallet</div>
            <div className={`tier1-wallet-pill ${isConnected ? 'ok' : 'no'}`}>
              {isConnected && address ? address : 'Not connected'}
            </div>
          </div>
        </div>

        <div className="tier1-grid">
          <div className="tier1-left">
            <div className="tier1-panel">
            <div className="tier1-panel-title center"><span className="stars">***</span><span>Invoices</span><span className="stars">***</span></div>
              <div className="tier1-invoices">
                {invoices.map(inv => (
                  <div key={inv.id} className={`tier1-invoice ${selected?.id === inv.id ? 'active' : ''}`}>
                    <button className="tier1-invoice-main" onClick={() => onSelect(inv)}>
                      <div className="tier1-invoice-id">{inv.id}</div>
                      <div className="tier1-invoice-meta">
                        <span>Due {inv.due}</span>
                        <span className="tier1-invoice-amt">${inv.amount}</span>
                      </div>
                    </button>

                    <button className="tier1-pay" onClick={() => onSelect(inv)}>
                      Pay
                    </button>
                  </div>
                ))}
              </div>

              <div className="tier1-note">
                These are live demo invoices. Press <b>Pay</b> and you'll see a transaction call in your Web3 wallet.
              </div>
            </div>
          </div>

          <div className="tier1-right">
            <div className="tier1-panel tier1-panel-pay">
                          <iframe
                src={widgetSrc}
                style={{ width: '100%', maxWidth: 360, height: 640, border: 0, borderRadius: 18, overflow: 'hidden' }}
                allow="clipboard-write"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
