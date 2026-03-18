import { useEffect, useState } from 'react'
import '../../styles/Admin.css'

function normalizeList(text) {
  return text
    .split(/\s|,|\n/g)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

export default function AllowlistEditor({ title, value = [], onChange, hint }) {
  const [raw, setRaw] = useState((value || []).join('\n'))

  useEffect(() => { setRaw((value || []).join('\n')) }, [value])

  function apply() {
    onChange(normalizeList(raw))
  }

  return (
    <div className="list-editor card">
      <div className="card-title">{title}</div>
      <textarea value={raw} onChange={e => setRaw(e.target.value)} placeholder="0xabc… one per line" />
      <div className="row">
        <button className="pill" onClick={apply}>Apply</button>
        <div className="hint">{hint}</div>
      </div>
    </div>
  )
}
