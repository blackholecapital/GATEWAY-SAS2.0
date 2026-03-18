// Cloudflare Pages Functions helpers for gateway
// Minimal SIWE-style auth + httpOnly session cookie

const MEM_NONCES = globalThis.__WG_MEM_NONCES || (globalThis.__WG_MEM_NONCES = new Map())

function b64url(bytes) {
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64urlJson(obj) {
  return b64url(new TextEncoder().encode(JSON.stringify(obj)))
}

async function hmacSha256(keyStr, dataStr) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyStr),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataStr))
  return new Uint8Array(sig)
}

export async function signJwt(payload, secret, ttlSec) {
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + ttlSec }
  const header = { alg: 'HS256', typ: 'JWT' }
  const head = b64urlJson(header)
  const pay = b64urlJson(body)
  const data = `${head}.${pay}`
  const sig = await hmacSha256(secret, data)
  return `${data}.${b64url(sig)}`
}

export async function verifyJwt(token, secret) {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [head, pay, sig] = parts
  const data = `${head}.${pay}`
  const expected = await hmacSha256(secret, data)
  const expectedB64 = b64url(expected)
  if (expectedB64 !== sig) return null
  const payload = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(
        atob(pay.replace(/-/g, '+').replace(/_/g, '/')),
        (c) => c.charCodeAt(0)
      )
    )
  )
  const now = Math.floor(Date.now() / 1000)
  if (payload?.exp && now > payload.exp) return null
  return payload
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
    ...init
  })
}

export function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || ''
  const parts = cookie.split(';').map((p) => p.trim())
  for (const p of parts) {
    const i = p.indexOf('=')
    if (i === -1) continue
    if (p.slice(0, i) === name) return decodeURIComponent(p.slice(i + 1))
  }
  return ''
}

export function cookieHeader(name, value, opts = {}) {
  const { httpOnly = true, secure = false, sameSite = 'Lax', path = '/', maxAge } = opts
  const parts = [`${name}=${encodeURIComponent(value)}`]
  if (path) parts.push(`Path=${path}`)
  if (maxAge != null) parts.push(`Max-Age=${maxAge}`)
  if (httpOnly) parts.push('HttpOnly')
  if (secure) parts.push('Secure')
  if (sameSite) parts.push(`SameSite=${sameSite}`)
  return parts.join('; ')
}

export async function storeNonce(env, key, value, ttlSec) {
  if (env?.WG_KV?.put) {
    await env.WG_KV.put(key, JSON.stringify(value), { expirationTtl: ttlSec })
    return
  }
  MEM_NONCES.set(key, { value, exp: Date.now() + ttlSec * 1000 })
}

export async function loadNonce(env, key) {
  if (env?.WG_KV?.get) {
    const v = await env.WG_KV.get(key)
    return v ? JSON.parse(v) : null
  }
  const hit = MEM_NONCES.get(key)
  if (!hit) return null
  if (Date.now() > hit.exp) {
    MEM_NONCES.delete(key)
    return null
  }
  return hit.value
}

export async function deleteNonce(env, key) {
  if (env?.WG_KV?.delete) {
    await env.WG_KV.delete(key)
    return
  }
  MEM_NONCES.delete(key)
}
