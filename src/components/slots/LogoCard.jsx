import SlotBadge from '../mapping/SlotBadge.jsx'
import { executeAction } from '../../lib/mapping/actionResolver.js'

export default function LogoCard({ slot, zone, debug, cfg }) {
  const logo = slot.logoUrl || cfg?.assets?.logoUrl || ''
  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      {logo ? (
        <div className="logo-wrap">
          <img src={logo} alt={slot.title || 'Tenant logo'} className="slot-logo" />
        </div>
      ) : (
        <div className="logo-fallback">{cfg?.brand?.name || 'Brand'}</div>
      )}
      <div className="slot-card-body">{slot.body || 'Brand slot'}</div>
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
