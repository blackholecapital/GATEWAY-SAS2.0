import { useEffect, useMemo, useState } from 'react'
import { slotRegistry } from '../../config/spine/slotRegistry.js'
import './AdminPanel.css'

const PAGES = ['gate', 'vip', 'perks', 'account']
const FIELDS = ['title', 'body', 'mediaUrl', 'logoUrl', 'feedHandle']

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export default function PageEditorPanel({ config, onSaveConfig, loading }) {
  const [active, setActive] = useState('gate')
  const [draft, setDraft] = useState(config?.tenantContent || { pages: {} })

  useEffect(() => {
    setDraft(config?.tenantContent || { pages: {} })
  }, [config])

  const manifest = slotRegistry[active]
  const slots = useMemo(() => manifest?.debugLegendInfo || [], [manifest])

  function updateSlot(slotId, key, value) {
    setDraft((prev) => ({
      ...(prev || {}),
      pages: {
        ...(prev?.pages || {}),
        [active]: {
          ...(prev?.pages?.[active] || {}),
          slots: {
            ...(prev?.pages?.[active]?.slots || {}),
            [slotId]: {
              ...(prev?.pages?.[active]?.slots?.[slotId] || {}),
              slotId,
              page: active,
              [key]: value
            }
          }
        }
      }
    }))
  }

  async function save() {
    await onSaveConfig({ ...(config || {}), tenantContent: clone(draft) })
  }

  function download() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tenant-content-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <div className="admin-panel-title">Slot content editor</div>
          <div className="admin-panel-sub">Schema lives in config/spine. Admin only edits values against stable slot IDs.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={download}>Export tenant content</button>
          <button className="btn" onClick={save} disabled={loading}>Save tenant content</button>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 0 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {PAGES.map((page) => (
            <button key={page} className="btn btn-ghost" onClick={() => setActive(page)}>
              {page.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {slots.map((slotMeta) => {
            const slot = draft?.pages?.[active]?.slots?.[slotMeta.slotId] || {}
            return (
              <div key={slotMeta.slotId} className="field" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 12 }}>
                <div className="k">{slotMeta.slotId} · {slotMeta.label}</div>
                <div className="hint" style={{ marginBottom: 12 }}>{slotMeta.zone} · {slotMeta.type}</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {FIELDS.map((field) => (
                    <label key={field} style={{ display: 'grid', gap: 6 }}>
                      <span className="k">{field}</span>
                      {field === 'body' ? (
                        <textarea rows={3} value={slot?.[field] || ''} onChange={(e) => updateSlot(slotMeta.slotId, field, e.target.value)} />
                      ) : (
                        <input value={slot?.[field] || ''} onChange={(e) => updateSlot(slotMeta.slotId, field, e.target.value)} />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
