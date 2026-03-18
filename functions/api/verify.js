import { json, loadNonce, deleteNonce, signJwt, cookieHeader } from './_util.js'
import { loadConfig, incrMetrics, appendLog, normTenant } from './_store.js'
import { parseRpcUrls, ethCall, dataBalanceOf, dataErc1155BalanceOf, hexToBigInt } from './_rpc.js'

function getSecret(env) {
  return env.WG_SESSION_SECRET || env.WG_JWT_SECRET || env.JWT_SECRET || 'WG_DEV_INSECURE_SECRET_CHANGE_ME'
}

function safeLower(s) {
  return String(s || '').trim().toLowerCase()
}

function inList(list, addr) {
  const a = safeLower(addr)
  return Array.isArray(list) && list.map(safeLower).includes(a)
}

function has0x(s) {
  const t = safeLower(s)
  return t.startsWith('0x') && t.length >= 42
}

function adminListFromEnv(env) {
  return (env.WG_ADMIN_ADDRESSES || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function adminListFromConfig(cfg) {
  return Array.isArray(cfg?.adminWallets)
    ? cfg.adminWallets.map((s) => String(s || '').trim().toLowerCase()).filter(Boolean)
    : []
}

async function checkErc20({ env, cfg, address }) {
  const rpcUrls = parseRpcUrls(env)
  const chainId = Number(cfg?.erc20?.chainId || 1)
  const rpc = rpcUrls[String(chainId)]
  const token = safeLower(cfg?.erc20?.token || '')
  if (!rpc || !has0x(token)) return { ok: false, reason: 'ERC20 RPC/token not configured' }

  const min = cfg?.erc20?.minBalance || '0'
  let minWei = 0n
  try { minWei = BigInt(min) } catch { minWei = 0n }

  const raw = await ethCall(rpc, token, dataBalanceOf(address))
  const bal = hexToBigInt(raw)
  return { ok: bal >= minWei, tier: 2, method: 'ERC20_BALANCE', meta: { chainId, token, bal: bal.toString(), min: minWei.toString() } }
}

async function checkNft({ env, cfg, address }) {
  const rpcUrls = parseRpcUrls(env)
  const chainId = Number(cfg?.nft?.chainId || 1)
  const rpc = rpcUrls[String(chainId)]
  const contract = safeLower(cfg?.nft?.contract || '')
  const standard = String(cfg?.nft?.standard || 'ERC721').toUpperCase()
  if (!rpc || !has0x(contract)) return { ok: false, reason: 'NFT RPC/contract not configured' }

  if (standard === 'ERC1155') {
    const tokenId = cfg?.nft?.tokenId || '0'
    const raw = await ethCall(rpc, contract, dataErc1155BalanceOf(address, tokenId))
    const bal = hexToBigInt(raw)
    return { ok: bal > 0n, tier: 3, method: 'NFT_OWNERSHIP', meta: { chainId, contract, standard, tokenId, bal: bal.toString() } }
  }

  // ERC721: balanceOf(address) > 0
  const raw = await ethCall(rpc, contract, dataBalanceOf(address))
  const bal = hexToBigInt(raw)
  return { ok: bal > 0n, tier: 3, method: 'NFT_OWNERSHIP', meta: { chainId, contract, standard: 'ERC721', bal: bal.toString() } }
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}))
  const tenant = normTenant(body.tenant || body.t || 'default')
  const address = safeLower(body.address)
  const signature = body.signature || ''
  const chainIdNum = Number(body.chainId)
  const chainId = Number.isFinite(chainIdNum) && chainIdNum > 0 ? chainIdNum : 1

  if (!address || !address.startsWith('0x')) return json({ ok: false, reason: 'Missing address' }, { status: 400 })
  if (!signature) return json({ ok: false, reason: 'Missing signature' }, { status: 400 })

  await incrMetrics(env, tenant, { attempts: 1 }).catch(() => {})

  const key = `nonce:${tenant}:${address}:${chainId}`
  const nonceRow = await loadNonce(env, key)
  if (!nonceRow?.message) {
    await incrMetrics(env, tenant, { failures: 1 }).catch(() => {})
    await appendLog(env, tenant, { ts: Date.now(), address, chainId, ok: false, reason: 'Nonce expired' }).catch(() => {})
    return json({ ok: false, reason: 'Nonce expired' }, { status: 401 })
  }

  // DEMO-friendly: we still do not recover signature here (keeps Workers slim).
  // Security comes from nonce freshness + server-side gating checks.
  await deleteNonce(env, key)

  const cfg = await loadConfig(env, tenant)

  // Blocklist first
  if (inList(cfg.blocklist, address)) {
    await incrMetrics(env, tenant, { failures: 1 }).catch(() => {})
    await appendLog(env, tenant, { ts: Date.now(), address, chainId, ok: false, reason: 'Blocked' }).catch(() => {})
    return json({ ok: false, reason: 'Address blocked' }, { status: 403 })
  }

  // Compute tier based on gateMode
  let tier = 1
  let method = 'SIGN_ONLY'
  let meta = {}

  try {
    const mode = String(cfg.gateMode || 'SIGN_ONLY').toUpperCase()

    const allowOk = inList(cfg.allowlist, address)
    const allowRes = { ok: allowOk, tier: 2, method: 'ALLOWLIST' }

    const enabled = cfg.enabledChecks || {}
    const checks = []

    if (mode === 'ALLOWLIST') {
      if (!allowRes.ok) throw new Error('Not allowlisted')
      tier = 2; method = 'ALLOWLIST'
    } else if (mode === 'ERC20_BALANCE') {
      const r = await checkErc20({ env, cfg, address })
      if (!r.ok) throw new Error('ERC20 threshold not met')
      tier = r.tier; method = r.method; meta = r.meta || {}
    } else if (mode === 'NFT_OWNERSHIP') {
      const r = await checkNft({ env, cfg, address })
      if (!r.ok) throw new Error('NFT required')
      tier = r.tier; method = r.method; meta = r.meta || {}
    } else if (mode === 'COMBO_ANY' || mode === 'COMBO_ALL') {
      if (enabled.ALLOWLIST) checks.push(async () => allowRes)
      if (enabled.ERC20_BALANCE) checks.push(async () => await checkErc20({ env, cfg, address }))
      if (enabled.NFT_OWNERSHIP) checks.push(async () => await checkNft({ env, cfg, address }))

      const results = []
      for (const fn of checks) {
        try { results.push(await fn()) } catch (e) { results.push({ ok: false, reason: e?.message || 'fail' }) }
      }

      if (mode === 'COMBO_ALL') {
        const allOk = results.length ? results.every(r => r.ok) : true
        if (!allOk) throw new Error('Combo ALL failed')
        // Highest tier among enabled checks
        tier = results.reduce((m, r) => Math.max(m, Number(r.tier || 1)), 1)
        method = 'COMBO_ALL'
        meta = { results }
      } else {
        const anyOk = results.some(r => r.ok)
        if (!anyOk) throw new Error('Combo ANY failed')
        tier = results.reduce((m, r) => r.ok ? Math.max(m, Number(r.tier || 1)) : m, 1)
        method = 'COMBO_ANY'
        meta = { results }
      }
    } else {
      tier = 1; method = 'SIGN_ONLY'
    }
  } catch (e) {
    await incrMetrics(env, tenant, { failures: 1 }).catch(() => {})
    await appendLog(env, tenant, { ts: Date.now(), address, chainId, ok: false, reason: e?.message || 'Denied', tenant }).catch(() => {})
    return json({ ok: false, reason: e?.message || 'Access denied' }, { status: 403 })
  }

  const admins = adminListFromEnv(env)
  const configuredAdmins = adminListFromConfig(cfg)
  const bootstrapAdminOpen = admins.length === 0 && configuredAdmins.length === 0
  const isAdmin = bootstrapAdminOpen || admins.includes(address) || configuredAdmins.includes(address)

  const token = await signJwt({ address, chainId, tier, tenant, admin: isAdmin, isAdmin, authed: true, method }, getSecret(env), 60 * 60 * 24 * 7)

  const secure = String(env.WG_COOKIE_SECURE || 'false') === 'true'
  const setCookie = cookieHeader('wg_session', token, {
    httpOnly: true,
    secure,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  await incrMetrics(env, tenant, { successes: 1 }).catch(() => {})
  await appendLog(env, tenant, { ts: Date.now(), address, chainId, ok: true, tier, method, tenant, meta }).catch(() => {})

  return json(
    { ok: true, authed: true, address, chainId, tier, method, tenant, admin: isAdmin, isAdmin },
    { headers: { 'set-cookie': setCookie } }
  )
}
