import { useEffect, useState } from 'react'
import '../../styles/Admin.css'

const MODES = ['SIGN_ONLY','ALLOWLIST','ERC20_BALANCE','NFT_OWNERSHIP','COMBO_ANY','COMBO_ALL']

export default function AdminConfigPanel({ config, onSave, saving }) {
  const [draft, setDraft] = useState(config)

  // keep in sync when config loads
  useEffect(() => { setDraft(config) }, [config])

  if (!draft) return null

  function set(patch) {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  function setErc20(patch) {
    setDraft(prev => ({ ...prev, erc20: { ...(prev.erc20 || {}), ...patch } }))
  }

  function setNft(patch) {
    setDraft(prev => ({ ...prev, nft: { ...(prev.nft || {}), ...patch } }))
  }

  function setWebhook(patch) {
    setDraft(prev => ({ ...prev, webhook: { ...(prev.webhook || {}), ...patch } }))
  }

  return (
    <div className="admin-panel card">
      <div className="card-title">*** GATE CONFIG ***</div>

      <div className="admin-grid">
        <label className="field">
          <div className="k">Gate Mode</div>
          <select value={draft.gateMode} onChange={e => set({ gateMode: e.target.value })}>
            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <div className="field">
          <div className="k">Enabled Checks</div>
          <div className="checks">
            {['ALLOWLIST','ERC20_BALANCE','NFT_OWNERSHIP'].map(chk => (
              <label key={chk} className="chk">
                <input
                  type="checkbox"
                  checked={!!draft.enabledChecks?.[chk]}
                  onChange={e => set({ enabledChecks: { ...(draft.enabledChecks||{}), [chk]: e.target.checked } })}
                />
                <span>{chk}</span>
              </label>
            ))}
          </div>
          <div className="hint">Used by COMBO_ANY / COMBO_ALL.</div>
        </div>

        <label className="field">
          <div className="k">ERC20 chainId</div>
          <input value={draft.erc20?.chainId || 1} onChange={e => setErc20({ chainId: Number(e.target.value || 1) })} />
        </label>
        <label className="field">
          <div className="k">ERC20 token</div>
          <input placeholder="0x…" value={draft.erc20?.tokenAddress || ''} onChange={e => setErc20({ tokenAddress: e.target.value })} />
        </label>
        <label className="field">
          <div className="k">ERC20 minBalance</div>
          <input placeholder="e.g. 100" value={draft.erc20?.minBalance || ''} onChange={e => setErc20({ minBalance: e.target.value })} />
        </label>

        <label className="field">
          <div className="k">NFT chainId</div>
          <input value={draft.nft?.chainId || 1} onChange={e => setNft({ chainId: Number(e.target.value || 1) })} />
        </label>
        <label className="field">
          <div className="k">NFT contract</div>
          <input placeholder="0x…" value={draft.nft?.contractAddress || ''} onChange={e => setNft({ contractAddress: e.target.value })} />
        </label>
        <label className="field">
          <div className="k">NFT type</div>
          <select value={draft.nft?.type || 'ERC721'} onChange={e => setNft({ type: e.target.value })}>
            <option value="ERC721">ERC721</option>
            <option value="ERC1155">ERC1155</option>
          </select>
        </label>
        <label className="field">
          <div className="k">ERC1155 tokenId</div>
          <input placeholder="optional" value={draft.nft?.tokenId ?? ''} onChange={e => setNft({ tokenId: e.target.value === '' ? null : Number(e.target.value) })} />
        </label>


        <label className="field">
          <div className="k">Admin wallets</div>
          <input
            placeholder="0xabc...,0xdef..."
            value={Array.isArray(draft.adminWallets) ? draft.adminWallets.join(',') : ''}
            onChange={(e) =>
              set({
                adminWallets: e.target.value
                  .split(',')
                  .map((v) => v.trim().toLowerCase())
                  .filter(Boolean)
              })
            }
          />
          <div className="hint">Comma-separated wallet addresses that can access /admin.</div>
        </label>

        <div className="field">
          <div className="k">Webhook</div>
          <label className="chk">
            <input type="checkbox" checked={!!draft.webhook?.enabled} onChange={e => setWebhook({ enabled: e.target.checked })} />
            <span>Enabled</span>
          </label>
          <input placeholder="https://…" value={draft.webhook?.url || ''} onChange={e => setWebhook({ url: e.target.value })} />
          <div className="hint">Best-effort POST on successful login.</div>
        </div>
      </div>

      <div className="admin-actions">
        <button className="pill" disabled={saving} onClick={() => onSave(draft)}>
          {saving ? 'Saving…' : 'Save Config'}
        </button>
      </div>
    </div>
  )
}
