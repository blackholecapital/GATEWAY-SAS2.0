import { useEnsName } from 'wagmi'
import { shortAddr, badgeTier } from '../lib/format.js'
import { chainName } from '../lib/chains.js'
import '../styles/Vip.css'

export default function VipIdentityCard({ me }) {
  const address = me?.address
  const { data: ens } = useEnsName({ address, chainId: 1, query: { enabled: !!address } })

  return (
    <div className="vip-id card">
      <div className="card-title">*** MEMBER ID ***</div>
      <div className="vip-id-grid">
        <div className="kv"><div className="k">ENS</div><div className="v">{ens || '—'}</div></div>
        <div className="kv"><div className="k">Wallet</div><div className="v">{shortAddr(address)}</div></div>
        <div className="kv"><div className="k">Tier</div><div className="v"><span className={`tier t${me?.tier || 1}`}>{badgeTier(me?.tier)}</span></div></div>
        <div className="kv"><div className="k">Chain</div><div className="v">{chainName(me?.chainId)}</div></div>
        <div className="kv"><div className="k">Method</div><div className="v">{me?.method || 'SIGN_ONLY'}</div></div>
      </div>
    </div>
  )
}
