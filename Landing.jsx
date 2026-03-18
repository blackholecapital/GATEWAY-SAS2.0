import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { useConnectModal, ConnectButton } from '@rainbow-me/rainbowkit'
import { apiGet, apiPost } from '../lib/api.js'
import './Landing.css'

export default function Landing() {
  const nav = useNavigate()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const pendingEnter = useRef(false)
  const entering = useRef(false)

  // Lock scroll on landing (remove right scrollbar)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (!pendingEnter.current) return
    if (!isConnected || !address) return
    if (!Number.isFinite(chainId)) return
    if (entering.current) return
    entering.current = true

    ;(async () => {
      try {
        await doEnter()
      } finally {
        pendingEnter.current = false
        entering.current = false
      }
    })()
  }, [isConnected, address, chainId])
   const notes = useMemo(() => (
    <>
      <div className="t"><span>***</span> Gateway <span>***</span></div>
      <div className="p">
        Welcome to Gateway, our premiere Web-3 product.<br />
        Gateway is your business’s portal to plug into Web-3 infrastructure allowing customers log in without credentials into a gated member area via any web-3 wallet.<br />
        Examples: VIP content, member perks, token-gated tools, partner access, and exclusive content/drops.<br />
        URL: https://demo.xyz-labs.xyz/b2b-tools<br />
        If you don&apos;t have a Web3 wallet available, <a href="/b2b-tools">click here to view demo.</a>
        <div className="sub">System Notes</div>
        Connect a Web-3 wallet to enter the lab.<br />
        After connecting sign a message to enter the vip area.<br />
        Bonus: generate a referral link using wallet and email.<br />
        Referral data will be visible in the Admin panel.
      </div>
    </>
  ), [])

    async function doEnter() {
    if (!address) return

    const safeChainId = Number.isFinite(chainId) ? chainId : 1

    try {
      const nonceResp = await apiGet(`/api/nonce?address=${encodeURIComponent(address)}&chainId=${safeChainId}`)
      const msg =
        nonceResp?.message ||
        nonceResp?.siweMessage ||
        nonceResp?.siwe_message ||
        nonceResp?.payload?.message
      if (!msg) throw new Error('Bad nonce response (missing message)')

      const signature = await signMessageAsync({ message: msg })
      await apiPost('/api/verify', { address, signature, chainId: safeChainId })

           nav('/gate', { replace: true })

      // hard fallback in case routing shell doesn't mount due to state / effect races
      setTimeout(() => {
        if (window.location.pathname !== '/gate') window.location.assign('/gate')
      }, 0)
       } catch (e) {
      console.error('ENTER LAB failed:', e)
      localStorage.setItem(
        'wg_toast',
        e?.message ? `SIGN-IN FAILED: ${e.message}` : 'SIGN-IN FAILED • PLEASE TRY AGAIN'
      )
      window.dispatchEvent(new Event('wg:toast'))
    }
  }

   async function onEnter() {
    // If not connected: open modal and continue automatically after connect.
    if (!isConnected) {
      pendingEnter.current = true
      openConnectModal?.()
      return
    }
    await doEnter()
  }

return (
  <>
    <div className="landing">
      <div className="landing-connect">
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </div>


      <div className="landing-mid">
        <div className="landing-logo">
          <img className="landing-drop" src="/drop.png" alt="XYZ Labs" />
          <div className="landing-mark">
            <div className="landing-title">.xyz Labs</div>
            <div className="landing-sub">• Web-3 Design Studio •</div>
          </div>
        </div>
      </div>

      <div className="landing-gateway">
        <div className="sys-notes">{notes}</div>
      </div>
    </div>

    <div className="enter-wrap">
      <button className="enter-btn" onClick={onEnter}>
        ENTER THE LAB
      </button>
    </div>
  </>
)
}
