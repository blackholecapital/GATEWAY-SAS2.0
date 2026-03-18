import { json } from '../_util.js'
import { loadLogs, normTenant } from '../_store.js'
import { requireAdminAccess } from './_auth.js'

export async function onRequestGet(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const limit = Number(url.searchParams.get('limit') || 25)
  const rows = await loadLogs(env, tenant)
  return json({ logs: rows.slice(0, Number.isFinite(limit) ? limit : 25) })
}
