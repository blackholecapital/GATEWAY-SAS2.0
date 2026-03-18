import SlotBadge from '../mapping/SlotBadge.jsx'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function VideoGridCard({ slot, zone, debug }) {
  const items = Array.isArray(slot.fallback?.items) ? slot.fallback.items.slice(0, 6) : []
  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className="slot-card-body">{slot.body || 'Video grid'}</div>
      <div className="video-grid">
        {items.map((item) => (
          <a key={item.id} href={item.mediaUrl} className="video-tile" target="_blank" rel="noreferrer">
            <div className="video-tile-label">{item.label}</div>
            <div className="video-tile-desc">{item.description}</div>
          </a>
        ))}
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
