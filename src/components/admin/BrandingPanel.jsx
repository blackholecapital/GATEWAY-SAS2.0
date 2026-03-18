import { useMemo, useState } from 'react'
import '../admin/AdminPanel.css'

function safeStr(v) {
  return String(v || '')
}

export default function BrandingPanel({ tenant, config, onSaveConfig, saveAsset, loading }) {
  const [draft, setDraft] = useState(null)
  const data = draft || config || {}

  const logoUrl = data?.assets?.logo || (tenant ? `/api/asset/logo?tenant=${encodeURIComponent(tenant)}` : '')
  const wallUrl = data?.assets?.wallpaper || (tenant ? `/api/asset/wallpaper?tenant=${encodeURIComponent(tenant)}` : '')

  const snippetBaseUrl = useMemo(() => 'https://gateway.xyz', [])

  function set(path, val) {
    setDraft((prev) => {
      const base = { ...(prev || config || {}) }
      const parts = path.split('.')
      let cur = base
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i]
        cur[k] = { ...(cur[k] || {}) }
        cur = cur[k]
      }
      cur[parts[parts.length - 1]] = val
      return base
    })
  }

  async function onSave() {
    const next = draft || config
    if (!next) return
    await onSaveConfig(next)
    setDraft(null)
  }

  async function onUpload(kind, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = String(reader.result || '')
      await saveAsset({ kind, dataUrl })
      const assetUrl = `/api/asset/${kind}?tenant=${encodeURIComponent(tenant)}`
      set(`assets.${kind}`, assetUrl)
    }
    reader.readAsDataURL(file)
  }

  const embedSnippet = useMemo(() => {
    const t = tenant || 'default'
    return (
      `<div id="xyz-gateway-button"></div>\n` +
      `<script\n` +
      `  data-xyz-gateway\n` +
      `  data-tenant="${t}"\n` +
      `  data-base-url="${snippetBaseUrl}"\n` +
      `  data-mount-id="xyz-gateway-button"\n` +
      `  data-button-text="Enter Members"\n` +
      `  data-redirect="/members"\n` +
      `  src="${snippetBaseUrl}/embed/gateway.js"></script>`
    )
  }, [tenant, snippetBaseUrl])

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <div className="admin-panel-title">Company info & branding</div>
          <div className="admin-panel-sub">This feeds client.json (tenant config) and the embed snippet.</div>
        </div>

        <button className="btn" onClick={onSave} disabled={loading || !draft}>
          Save branding
        </button>
      </div>

      <div className="admin-grid">
        <div className="admin-field">
          <label>Brand name</label>
          <input value={safeStr(data.brandName)} onChange={(e) => set('brandName', e.target.value)} placeholder="Acme Gateway" />
        </div>

        <div className="admin-field">
          <label>Website URL</label>
          <input value={safeStr(data.websiteUrl)} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="https://acme.com" />
        </div>

        <div className="admin-field">
          <label>Primary</label>
          <input value={safeStr(data?.colors?.primary)} onChange={(e) => set('colors.primary', e.target.value)} placeholder="#00ff66" />
        </div>
        <div className="admin-field">
          <label>Secondary</label>
          <input value={safeStr(data?.colors?.secondary)} onChange={(e) => set('colors.secondary', e.target.value)} placeholder="#00ccff" />
        </div>
        <div className="admin-field">
          <label>Accent</label>
          <input value={safeStr(data?.colors?.accent)} onChange={(e) => set('colors.accent', e.target.value)} placeholder="#ffcc00" />
        </div>

        <div className="admin-field">
          <label>X</label>
          <input value={safeStr(data?.socials?.x)} onChange={(e) => set('socials.x', e.target.value)} placeholder="https://x.com/..." />
        </div>
        <div className="admin-field">
          <label>YouTube</label>
          <input value={safeStr(data?.socials?.youtube)} onChange={(e) => set('socials.youtube', e.target.value)} placeholder="https://youtube.com/..." />
        </div>
        <div className="admin-field">
          <label>Discord</label>
          <input value={safeStr(data?.socials?.discord)} onChange={(e) => set('socials.discord', e.target.value)} placeholder="https://discord.gg/..." />
        </div>
        <div className="admin-field">
          <label>Telegram</label>
          <input value={safeStr(data?.socials?.telegram)} onChange={(e) => set('socials.telegram', e.target.value)} placeholder="https://t.me/..." />
        </div>
      </div>

      <div className="admin-split">
        <div className="admin-card">
          <div className="admin-card-title">Logo</div>
          <div className="admin-card-sub">Upload once, served at /api/asset/logo?tenant=…</div>
          <input type="file" accept="image/*" onChange={(e) => onUpload('logo', e.target.files?.[0])} />
          <div className="admin-asset-preview">
            <img src={logoUrl} alt="logo preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-title">Wallpaper</div>
          <div className="admin-card-sub">Upload once, served at /api/asset/wallpaper?tenant=…</div>
          <input type="file" accept="image/*" onChange={(e) => onUpload('wallpaper', e.target.files?.[0])} />
          <div className="admin-asset-preview">
            <img src={wallUrl} alt="wallpaper preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Embed snippet</div>
        <div className="admin-card-sub">Paste this anywhere on the client’s site. Clicking the button signs, then redirects to /{tenant}/members.</div>
        <textarea className="admin-codebox" value={embedSnippet} readOnly rows={8} />
      </div>
    </section>
  )
}
