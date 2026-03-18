import { loadNonce, storeNonce } from './_util.js'

// KV keys
const CFG_PREFIX = 'cfg:'     // cfg:{tenant}
const LOGS_PREFIX = 'logs:'   // logs:{tenant}  (json array)
const MET_PREFIX  = 'met:'    // met:{tenant}   ({ attempts, successes, failures, uniqueWallets })

export function normTenant(raw) {
  const t = String(raw || 'default').trim().toLowerCase()
  // keep it URL-safe-ish
  return t.replace(/[^a-z0-9_-]/g, '') || 'default'
}

export function cfgKey(tenant) {
  return `${CFG_PREFIX}${normTenant(tenant)}`
}

export function logsKey(tenant) {
  return `${LOGS_PREFIX}${normTenant(tenant)}`
}

export function metricsKey(tenant) {
  return `${MET_PREFIX}${normTenant(tenant)}`
}

export function defaultConfig(tenant = 'default') {
  return {
    tenant: normTenant(tenant),

    // Branding / client.json fields
    brandName: 'Gateway',
    websiteUrl: '',
    colors: { primary: '#00ff66', secondary: '#00ccff', accent: '#ffcc00' },
    socials: { x: '', youtube: '', discord: '', telegram: '' },
    assets: { logo: '', wallpaper: '' }, // URLs or /api/asset/... endpoints
    layoutTemplate: 1, // 1|2|3

    // Gate config
    gateMode: 'SIGN_ONLY',
    enabledChecks: { ALLOWLIST: false, ERC20_BALANCE: false, NFT_OWNERSHIP: false },
    allowlist: [],
    blocklist: [],
    erc20: { chainId: 1, token: '', minBalance: '0' },
    nft: { chainId: 1, contract: '', tokenId: '', standard: 'ERC721' },

    // Optional webhook config (kept from panel)
    webhook: { url: '', secret: '' },

    // Admin access controls
    adminWallets: []
  }
}

async function kvGet(env, key) {
  if (env?.WG_KV?.get) return await env.WG_KV.get(key)
  return null
}

async function kvPut(env, key, value) {
  if (env?.WG_KV?.put) {
    await env.WG_KV.put(key, value)
    return true
  }
  // no KV in dev: reuse nonce in-memory map (cheap) by storing as a nonce value
  await storeNonce(env, `memstore:${key}`, { value }, 60 * 60 * 24 * 365)
  return true
}

async function kvDel(env, key) {
  if (env?.WG_KV?.delete) {
    await env.WG_KV.delete(key)
    return true
  }
  return true
}

async function memGet(env, key) {
  const row = await loadNonce(env, `memstore:${key}`)
  return row?.value || null
}

export async function loadConfig(env, tenant) {
  const t = normTenant(tenant)
  const key = cfgKey(t)
  let raw = await kvGet(env, key)
  if (!raw) raw = await memGet(env, key)
  if (!raw) return defaultConfig(t)
  try {
    const parsed = JSON.parse(raw)
    return { ...defaultConfig(t), ...parsed, tenant: t }
  } catch {
    return defaultConfig(t)
  }
}

export async function saveConfig(env, tenant, next) {
  const t = normTenant(tenant)
  const key = cfgKey(t)
  const merged = { ...defaultConfig(t), ...(next || {}), tenant: t }
  await kvPut(env, key, JSON.stringify(merged))
  return merged
}

export async function loadLogs(env, tenant) {
  const t = normTenant(tenant)
  const key = logsKey(t)
  let raw = await kvGet(env, key)
  if (!raw) raw = await memGet(env, key)
  if (!raw) return []
  try { return JSON.parse(raw) || [] } catch { return [] }
}

export async function appendLog(env, tenant, row) {
  const t = normTenant(tenant)
  const key = logsKey(t)
  const list = await loadLogs(env, t)
  list.unshift(row)
  // cap
  const capped = list.slice(0, 200)
  await kvPut(env, key, JSON.stringify(capped))
  return capped
}

export async function loadMetrics(env, tenant) {
  const t = normTenant(tenant)
  const key = metricsKey(t)
  let raw = await kvGet(env, key)
  if (!raw) raw = await memGet(env, key)
  if (!raw) return { attempts: 0, successes: 0, failures: 0, uniqueWallets: 0 }
  try { return JSON.parse(raw) || { attempts: 0, successes: 0, failures: 0, uniqueWallets: 0 } } catch { return { attempts: 0, successes: 0, failures: 0, uniqueWallets: 0 } }
}

export async function saveMetrics(env, tenant, next) {
  const t = normTenant(tenant)
  const key = metricsKey(t)
  const merged = { attempts: 0, successes: 0, failures: 0, uniqueWallets: 0, ...(next || {}) }
  await kvPut(env, key, JSON.stringify(merged))
  return merged
}

export async function incrMetrics(env, tenant, patch) {
  const cur = await loadMetrics(env, tenant)
  const next = { ...cur }
  for (const [k, v] of Object.entries(patch || {})) {
    next[k] = (Number(next[k] || 0) + Number(v || 0))
  }
  return await saveMetrics(env, tenant, next)
}
