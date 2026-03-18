import SlotBadge from '../mapping/SlotBadge.jsx'
import { mediaPreview } from '../../lib/mapping/mediaResolver.js'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function MediaEmbedCard({ slot, zone, debug }) {
  const preview = mediaPreview(slot.mediaUrl, { title: slot.title, body: slot.body })
  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className={`media-preview media-kind-${preview.kind}`}>
        <div className="media-chip">{preview.kind}</div>
        <div className="slot-card-body">{slot.body || preview.body}</div>
        {preview.url ? (
          <a className="media-link" href={preview.url} target="_blank" rel="noreferrer">
            {preview.url}
          </a>
        ) : null}
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
