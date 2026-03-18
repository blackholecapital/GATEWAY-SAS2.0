import '../styles/Perks.css'

export default function PerkCard({ title, tier, children, actionLabel = 'Open', onAction, locked }) {
  return (
    <div className={`perk card ${locked ? 'perk-locked' : ''}`}>
      <div className="perk-top">
        <div className="perk-title">{title}</div>
        <div className={`perk-tier t${tier}`}>TIER {tier}</div>
      </div>
      <div className="perk-body">{children}</div>
      <button
        className={`pill ${locked ? 'perk-pill-locked' : 'perk-pill-open'}`}
        disabled={!onAction}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  )
}
