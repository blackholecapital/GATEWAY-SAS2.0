import { useState } from 'react'
import './AdminPanel.css'

export default function LayoutPanel({ config, onSaveConfig, loading }) {
  const [val, setVal] = useState(Number(config?.layoutTemplate || 1))

  async function save() {
    await onSaveConfig({ ...(config || {}), layoutTemplate: val })
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <div className="admin-panel-title">Layout template</div>
          <div className="admin-panel-sub">Pick 1, 2, or 3. This swaps framing (without changing your data).</div>
        </div>
        <button className="btn" onClick={save} disabled={loading}>
          Save layout
        </button>
      </div>

      <div className="admin-card" style={{ marginTop: 0 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[1, 2, 3].map((n) => (
            <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" name="layoutTemplate" checked={val === n} onChange={() => setVal(n)} />
              <span>Template {n}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
