import { json, cookieHeader } from './_util.js'

export async function onRequestPost() {
  const setCookie = cookieHeader('wg_session', '', { httpOnly: true, secure: false, sameSite: 'Lax', path: '/', maxAge: 0 })
  return json({ ok: true }, { headers: { 'set-cookie': setCookie } })
}
