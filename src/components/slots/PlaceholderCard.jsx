import SlotBadge from '../mapping/SlotBadge.jsx'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function PlaceholderCard({ slot, zone, debug }) {
  return (
    <article className="slot-card placeholder-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className="slot-card-body">{slot.body || slot.fallback?.body || 'Placeholder slot'}</div>
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
