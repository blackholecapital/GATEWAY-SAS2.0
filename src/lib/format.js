export function shortAddr(addr) {
  if (!addr) return ''
  const a = String(addr)
  return a.slice(0, 6) + '…' + a.slice(-4)
}

export function fmtTs(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return String(ts)
  }
}

export function badgeTier(tier) {
  const t = Number(tier || 1)
  if (t === 3) return 'TIER 3'
  if (t === 2) return 'TIER 2'
  return 'TIER 1'
}
