function pad32(hexNo0x) {
  return hexNo0x.padStart(64, '0')
}

function strip0x(h) {
  return (h || '').toLowerCase().startsWith('0x') ? h.slice(2) : (h || '')
}

export function encAddress(addr) {
  return pad32(strip0x(addr))
}

// method selectors (keccak-256)
const SEL_BALANCE_OF = '70a08231' // balanceOf(address)
const SEL_ERC1155_BALANCE_OF = '00fdd58e' // balanceOf(address,uint256)

export function dataBalanceOf(address) {
  return '0x' + SEL_BALANCE_OF + encAddress(address)
}

export function dataErc1155BalanceOf(address, tokenId) {
  const tid = BigInt(tokenId || 0n).toString(16)
  return '0x' + SEL_ERC1155_BALANCE_OF + encAddress(address) + pad32(tid)
}

export async function ethCall(rpcUrl, to, data) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to, data }, 'latest'] })
  })
  const j = await res.json().catch(() => ({}))
  if (j?.error) throw new Error(j.error?.message || 'RPC error')
  return j?.result || '0x0'
}

export function hexToBigInt(hex) {
  try { return BigInt(hex || '0x0') } catch { return 0n }
}

export function parseRpcUrls(env) {
  try {
    const raw = env.WG_RPC_URLS || env.GW_RPC_URLS || '{}'
    const j = JSON.parse(raw)
    return j && typeof j === 'object' ? j : {}
  } catch {
    return {}
  }
}
