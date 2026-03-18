import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { useLocation } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api.js'
import { tenantFromPathname } from '../lib/tenant.js'
import '../styles/GateCard.css'

export default function GateCard({ onAuthed }) {
  const { address } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname) || 'default'

  const [gateSummary, setGateSummary] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const cfg = await apiGet(`/api/config?tenant=${encodeURIComponent(tenant)}`)
        setGateSummary(cfg)
      } catch {
        setGateSummary(null)
      }
    })()
  }, [tenant])

  const readableMode = useMemo(() => {
    if (!gateSummary) return 'SIGN_ONLY (default)'
    return gateSummary.gateMode || 'SIGN_ONLY'
  }, [gateSummary])

  async function signIn() {
    if (!address) return
    setBusy(true)
    try {
      const nonceResp = await apiGet(
        `/api/nonce?tenant=${encodeURIComponent(tenant)}&address=${encodeURIComponent(address)}&chainId=${encodeURIComponent(chainId)}`
      )
      const msg =
        nonceResp?.message ||
        nonceResp?.siweMessage ||
        nonceResp?.siwe_message ||
        nonceResp?.payload?.message
      if (!msg) throw new Error('Bad nonce response (missing message)')

      const signature = await signMessageAsync({ message: msg })

      await apiPost('/api/verify', { tenant, address, signature, chainId })

      const me = await apiGet('/api/me').catch(() => null)

      if (me?.authed || me?.ok) {
        localStorage.setItem('wg_toast', 'WELCOME • SESSION ACTIVE • ENTERING VIP')
        window.dispatchEvent(new Event('wg:toast'))
        onAuthed?.({ ok: true, authed: true, me })
      } else {
        localStorage.setItem('wg_toast', 'SIGN-IN COMPLETE • REFRESHING SESSION…')
        window.dispatchEvent(new Event('wg:toast'))
      }
    } catch (e) {
      localStorage.setItem('wg_toast', (e?.message || 'Sign-in failed').toUpperCase())
      window.dispatchEvent(new Event('wg:toast'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="gate-card">
      <div className="gate-head">
        <div>
          <div className="gate-title">GATEWAY ACCESS</div>
          <div className="gate-sub">
            Mode: <b>{readableMode}</b> • Tenant: <b>{tenant}</b>
          </div>
        </div>

        <button className={`btn ${busy ? 'btn-disabled' : ''}`} onClick={signIn} disabled={busy || !address}>
          {busy ? 'Signing…' : address ? 'Sign Message' : 'Connect wallet first'}
        </button>
      </div>

      <div className="gate-body">
        <div className="gate-hint">
          Connect your wallet, then sign the message to enter the members area. Your tier determines which perks unlock.
        </div>
      </div>
    </div>
  )
}
