import { json, getCookie, verifyJwt } from './_util.js'

function getSecret(env) {
  return env.WG_SESSION_SECRET || env.WG_JWT_SECRET || env.JWT_SECRET || 'WG_DEV_INSECURE_SECRET_CHANGE_ME'
}

export async function onRequestGet({ request, env }) {
  const token = getCookie(request, 'wg_session')
  const payload = await verifyJwt(token, getSecret(env))
  if (!payload?.address) return json({ ok: false }, { status: 401 })
  return json({ ok: true, authed: true, isAdmin: !!(payload?.admin || payload?.isAdmin), ...payload })
}
