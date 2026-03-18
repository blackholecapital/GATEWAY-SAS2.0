export default function SlotBadge({ slotId, type, zone, visible = true }) {
  return (
    <div className={`slot-badge ${visible ? '' : 'muted'}`}>
      <span>{slotId}</span>
      {zone ? <span>{zone}</span> : null}
      {type ? <span>{type}</span> : null}
    </div>
  )
}
