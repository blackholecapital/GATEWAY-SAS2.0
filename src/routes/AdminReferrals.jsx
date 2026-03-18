import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { loadStore } from '../lib/referralStore.js'
import '../styles/Page.css'
import './AdminReferrals.css'

function flattenLinks(store) {
  const out = []
  const refs = store?.referrers || {}
  for (const id of Object.keys(refs)) {
    const r = refs[id]
    const links = r?.links || []
    for (const l of links) {
      out.push({
        referrerId: id,
        label: r?.label || id,
        link: l?.link || '',
        createdAt: l?.createdAt || ''
      })
    }
  }
  out.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return out
}

export default function AdminReferrals() {
  const [store, setStore] = useState(() => loadStore())
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const iv = setInterval(() => setStore(loadStore()), 700)
    return () => clearInterval(iv)
  }, [])

  const rows = useMemo(() => flattenLinks(store), [store])

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(''), 1200)
    } catch {}
  }

  return (
    <div className="page ref-page">
      <div className="card page-card">
        <div className="hdr">
          <div>
            <div className="title">*** REFERRALS ***</div>
            <div className="card-sub">Stored locally (same key used by homepage widget).</div>
          </div>
          <div className="row">
            <NavLink className="pill" to="/admin">Back</NavLink>
          </div>
        </div>
      </div>

      <div className="card page-card">
        {rows.length ? (
          <div className="ref-list">
            {rows.map((r, idx) => (
              <div className="ref-row" key={idx}>
                <div className="ref-meta">
                  <div className="ref-code">Code: {r.referrerId}</div>
                  <div className="card-sub">{r.label}</div>
                </div>
                <div className="ref-url" title={r.link}>{r.link}</div>
                <div className="ref-actions">
                  <button className="pill" onClick={() => copy(r.link)}>{copied === r.link ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-sub">No referral links yet.</div>
        )}
      </div>
    </div>
  )
}
