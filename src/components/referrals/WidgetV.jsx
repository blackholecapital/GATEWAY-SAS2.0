import React, { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { loadStore, upsertReferrer, addLinkToReferrer, setSettings } from '../../lib/referralStore.js'
import './WidgetShared.css'
import './WidgetV.css'

const makeLink = (baseUrl, param, code) => {
  try {
    const u = new URL(baseUrl)
    u.searchParams.set(param, code)
    return u.toString()
  } catch {
    const s = baseUrl.includes('?') ? '&' : '?'
    return baseUrl + s + encodeURIComponent(param) + '=' + encodeURIComponent(code)
  }
}

const mkCode = (prefix = 'r') => {
  // short, human-ish, collision-resistant enough for local storage
  return prefix + '_' + Math.random().toString(16).slice(2, 10)
}

export default function WidgetV() {
  const { address, isConnected } = useAccount()
  const [email, setEmail] = useState('')
  const [out, setOut] = useState('')
  const [who, setWho] = useState('')

  // If the referral store is still in default/example mode, auto-point it at this app's VIP route (one-time).
  useMemo(() => {
    try {
      const s = loadStore()
      if (s?.settings?.baseUrl === 'https://example.com/signup') {
        const nextBase = window.location.origin + '/vip'
        setSettings({ baseUrl: nextBase, param: s.settings?.param || 'ref' })
      }
    } catch {}
  }, [])

  function writeRef(refId, label, walletVal, emailVal, codePrefix) {
    const code = mkCode(codePrefix)
    const s = loadStore()
    const baseUrl = s.settings?.baseUrl || (window.location.origin + '/vip')
    const param = s.settings?.param || 'ref'
    const url = makeLink(baseUrl, param, code)

    const r = upsertReferrer({ id: refId, label, wallet: walletVal, email: emailVal })
    addLinkToReferrer(r.id, url)

    setOut(url)
    setWho(r.label || r.id)
  }

  return (
    <div className="w-wrap">
            <div className="mm-card"><div className="mm-cardInner">
        <div className="wV-top">
          <div>
            <div className="wV-hdr">*** REFFERAL WIDGET ***</div>
          </div>

          <div className="wV-connect">
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          </div>
        </div>

        {null}

        <div className="wV-grid">
          <div className="wV-row">
            <div className="wV-pill">Wallet: <strong>{isConnected ? (address?.slice(0, 6) + '…' + address?.slice(-4)) : 'not connected'}</strong></div>
          </div>

          <div className="wV-row">
            <input
              className="w-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email (bonus)"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div className="w-row">
            <button
              className={`w-btn w-btn-wallet ${isConnected ? 'is-connected' : 'is-disconnected'}`}
              disabled={!isConnected || !address}
              onClick={() => {
                if (!address) return
                const id = 'wallet:' + address.toLowerCase()
                writeRef(id, address, address.toLowerCase(), '', 'w')
              }}
              title={!isConnected ? 'Connect wallet to generate' : 'Generate link from wallet'}
            >
              Generate (Wallet)
            </button>

            <button
              className="w-btn"
              disabled={!email.trim()}
              onClick={() => {
                const em = email.trim()
                const id = 'email:' + em.toLowerCase()
                writeRef(id, em, '', em, 'e')
              }}
              title="Generate link from email"
            >
              Generate (Email)
            </button>
          </div>

          <div className="wV-outTitle">*** Refferal Widget ***</div>
          <div className="w-out" title={out}>{out || 'output…'}</div>
        </div>
      </div></div>
    </div>
  )
}
