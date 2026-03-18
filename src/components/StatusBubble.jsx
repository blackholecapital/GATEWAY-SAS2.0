import '../styles/StatusBubble.css'

export default function StatusBubble({ state = 'idle', title, detail }) {
  // state: idle | ok | bad | warn
  const cls = `sb sb-${state}`
  return (
    <div className={cls} role="status" aria-live="polite">
      <div className="sb-screen" aria-hidden="true" />
      <div className="sb-inner">
        <div className="sb-title">{title || 'STATUS'}</div>
        {detail ? <div className="sb-detail">{detail}</div> : null}
      </div>
    </div>
  )
}
