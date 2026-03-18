import { json } from '../_util.js'
import { normTenant } from '../_store.js'
import { requireAdminAccess } from './_auth.js'

function assetKey(tenant, kind) {
  return `asset:${normTenant(tenant)}:${String(kind || '').toLowerCase()}`
}

async function kvPut(env, key, value) {
  if (env?.WG_KV?.put) {
    await env.WG_KV.put(key, value)
    return true
  }
  globalThis.__GW_ASSETS = globalThis.__GW_ASSETS || new Map()
  globalThis.__GW_ASSETS.set(key, value)
  return true
}

async function kvGet(env, key) {
  if (env?.WG_KV?.get) return await env.WG_KV.get(key)
  globalThis.__GW_ASSETS = globalThis.__GW_ASSETS || new Map()
  return globalThis.__GW_ASSETS.get(key) || null
}

export async function onRequestGet(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const kind = url.searchParams.get('kind') || ''
  const raw = await kvGet(env, assetKey(tenant, kind))
  return json({ ok: true, tenant, kind, dataUrl: raw || '' })
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const body = await request.json().catch(() => ({}))
  const kind = String(body.kind || url.searchParams.get('kind') || '').toLowerCase()
  const dataUrl = String(body.dataUrl || '')
  if (!kind) return json({ ok: false, reason: 'Missing kind' }, { status: 400 })
  if (!dataUrl.startsWith('data:')) return json({ ok: false, reason: 'Expected data URL' }, { status: 400 })

  await kvPut(env, assetKey(tenant, kind), dataUrl)
  return json({ ok: true, tenant, kind })
}
