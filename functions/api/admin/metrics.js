import { json } from '../_util.js'
import { loadMetrics, normTenant } from '../_store.js'
import { requireAdminAccess } from './_auth.js'

export async function onRequestGet(ctx) {
  const { request, env } = ctx
  const auth = await requireAdminAccess(ctx)
  if (!auth.ok) return auth.res

  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || auth?.payload?.tenant || 'default')
  const met = await loadMetrics(env, tenant)
  return json(met)
}
