import SlotRenderer from '../../../components/slots/SlotRenderer.jsx'

export default function AccountLayout({ manifest, slotMap, debug, cfg }) {
  return (
    <div className="overlay-grid overlay-grid-account">
      {manifest.debugLegendInfo.map((item) => (
        <section key={item.slotId} className={`zone zone-${item.zone}`}>
          <SlotRenderer slot={slotMap[item.slotId]} zone={item.zone} debug={debug} cfg={cfg} />
        </section>
      ))}
    </div>
  )
}
