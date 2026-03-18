import SlotBadge from '../mapping/SlotBadge.jsx'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function FeedCard({ slot, zone, debug }) {
  const handle = slot.feedHandle || 'gateway_xyz'
  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className="feed-card">
        <div className="feed-header">@{handle.replace(/^@/, '')}</div>
        <div className="feed-post">Feed preview placeholder. Use this card for X profile links or post-style content when a live embed is too brittle.</div>
        <div className="feed-post alt">{slot.body || 'Admin can control this copy from slot data.'}</div>
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
