import { json } from '../_util.js'
import { loadConfig, saveConfig, normTenant } from '../_store.js'
import { requireAdminAccess } from './_auth.js'

export async function onRequestGet(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const cfg = await loadConfig(env, tenant)
  return json(cfg)
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const body = await request.json().catch(() => ({}))
  const saved = await saveConfig(env, tenant, body)
  return json(saved)
}
