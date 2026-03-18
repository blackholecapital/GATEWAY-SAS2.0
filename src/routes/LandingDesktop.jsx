import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { apiGet, apiPost } from '../lib/api.js'
import { tenantFromPathname, withTenant } from '../lib/tenant.js'
import '../styles/Landing.css'

export default function LandingDesktop() {
  const nav = useNavigate()
  const loc = useLocation()
  const tenant = tenantFromPathname(loc.pathname) || 'default'

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const pendingEnter = useRef(false)
  const pendingDest = useRef('/members')
  
  const heroCopy = useMemo(
    () => (
      <>
        <div className="landing-kicker">Wallet gate, perks, referrals, payments, rewards.</div>
        <div className="landing-title">
          Gateway is your
          <br />
          member entry layer.
        </div>
        <div className="landing-sub">
          Replace logins with a wallet signature. Then unlock tiers based on allowlist, ERC-20 balance, or NFT ownership.
          <br />
          ***Gateway unlocks the power of Web-3***.<br />
        </div>
      </>
    ),
    []
   )
 
   async function doEnter(destPath) {
     if (!address) return
 
     const safeChainId = Number.isFinite(chainId) ? chainId : 1
 
     try {
       const nonceResp = await apiGet(
         `/api/nonce?tenant=${encodeURIComponent(tenant)}&address=${encodeURIComponent(address)}&chainId=${safeChainId}`
       )
       const msg =
         nonceResp?.message ||
         nonceResp?.siweMessage ||
         nonceResp?.siwe_message ||
         nonceResp?.payload?.message
       if (!msg) throw new Error('Bad nonce response (missing message)')
 
       const signature = await signMessageAsync({ message: msg })
       await apiPost('/api/verify', { tenant, address, signature, chainId: safeChainId })
 
       const dest = withTenant(destPath || '/members', tenant)
       nav(dest, { replace: true })
 
       setTimeout(() => {
         if (window.location.pathname !== dest) window.location.assign(dest)
       }, 0)
     } catch (e) {
      console.error('ENTER LAB failed:', e)
      localStorage.setItem('wg_toast', e?.message ? `SIGN-IN FAILED: ${e.message}` : 'SIGN-IN FAILED • PLEASE TRY AGAIN')
      window.dispatchEvent(new Event('wg:toast'))
    }
  }

   async function onEnter(destPath, openConnectModal) {
     pendingDest.current = destPath
     if (!isConnected) {
       pendingEnter.current = true
       openConnectModal?.()
       return
     }
     await doEnter(destPath)
   }
 
   useEffect(() => {
     if (pendingEnter.current && isConnected) {
       pendingEnter.current = false
       doEnter(pendingDest.current)
     }
   }, [isConnected])
  return (
    <div className="landing landing-desktop">
      <div className="landing-panel">
         {heroCopy}

        <div className="landing-actions">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <>
                <button className="btn landing-link" onClick={() => onEnter('/members', openConnectModal)}>
                  Enter the demo using a Web3 wallet (simulates clicking Connect Wallet)
                </button>

                <button className="btn btn-ghost landing-link" onClick={() => onEnter('/admin', openConnectModal)}>
                  Enter the admin demo using a Web3 wallet (simulates wallet login + admin check)
                </button>

                <button className="btn btn-ghost landing-link" onClick={() => nav(withTenant('/members', tenant))}>
                  If you don&apos;t have a Web3 wallet, use this to enter the main demo
                </button>

                <button className="btn btn-ghost landing-link" onClick={() => nav(withTenant('/admin-demo', tenant))}>
                  If you don&apos;t have a Web3 wallet, use this to enter the admin demo
                </button>
              </>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  )
}
