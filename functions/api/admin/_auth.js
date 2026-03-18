import { json, getCookie, verifyJwt } from '../_util.js'
import { loadConfig } from '../_store.js'

function getSecret(env) {
  return env.WG_SESSION_SECRET || env.WG_JWT_SECRET || env.JWT_SECRET || 'WG_DEV_INSECURE_SECRET_CHANGE_ME'
}

function listFromEnv(env) {
  return (env.WG_ADMIN_ADDRESSES || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function listFromConfig(cfg) {
  return Array.isArray(cfg?.adminWallets)
    ? cfg.adminWallets.map((s) => String(s || '').trim().toLowerCase()).filter(Boolean)
    : []
}

function urlTenant(request) {
  const url = new URL(request.url)
  return (url.searchParams.get('tenant') || 'default').toLowerCase()
}

export async function requireAdminAccess({ request, env }) {
  const url = new URL(request.url)
  const demo = url.searchParams.get('demo') === '1'
  if (demo) return { ok: true, demo: true, payload: { tenant: urlTenant(request), address: 'demo-admin' } }

  const token = getCookie(request, 'wg_session')
  const payload = await verifyJwt(token, getSecret(env))
  if (!payload?.address) return { ok: false, res: json({ ok: false, reason: 'Unauthorized' }, { status: 401 }) }

  const cfg = await loadConfig(env, payload.tenant || 'default')
  const envAdmins = listFromEnv(env)
  const cfgAdmins = listFromConfig(cfg)
  const bootstrapAdminOpen = envAdmins.length === 0 && cfgAdmins.length === 0
  const addr = String(payload.address || '').toLowerCase()

  const ok = bootstrapAdminOpen || payload?.admin || payload?.isAdmin || envAdmins.includes(addr) || cfgAdmins.includes(addr)
  if (!ok) return { ok: false, res: json({ ok: false, reason: 'Admin required' }, { status: 403 }) }
  return { ok: true, demo: false, payload }
}
