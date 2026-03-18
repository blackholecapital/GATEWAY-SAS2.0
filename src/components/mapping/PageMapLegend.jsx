export default function PageMapLegend({ manifest, enabled = false }) {
  if (!enabled || !manifest) return null

  return (
    <aside className="page-map-legend">
      <div className="page-map-legend-title">{manifest.title} Map</div>
      <div className="page-map-legend-list">
        {manifest.debugLegendInfo.map((item) => (
          <div key={item.slotId} className="page-map-legend-row">
            <strong>{item.slotId}</strong>
            <span>{item.zone}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
