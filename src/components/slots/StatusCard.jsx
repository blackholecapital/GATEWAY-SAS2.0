import { useAccount } from 'wagmi'
import SlotBadge from '../mapping/SlotBadge.jsx'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function StatusCard({ slot, zone, debug }) {
  const { address, isConnected } = useAccount()
  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className="slot-card-body">{slot.body || 'Status information'}</div>
      <div className="status-grid">
        <div>
          <span className="status-label">Wallet</span>
          <span className={`status-pill ${isConnected ? 'ok' : ''}`}>{isConnected ? address : 'Not connected'}</span>
        </div>
        <div>
          <span className="status-label">Visibility</span>
          <span className="status-pill">{slot.visible ? 'Visible' : 'Hidden'}</span>
        </div>
      </div>
      <div className="slot-actions">
        {slot.actions.map((action) => (
          <button key={action.actionId} className="slot-btn" type="button" onClick={() => executeAction(action)}>
            {action.label}
          </button>
        ))}
      </div>
    </article>
  )
}
