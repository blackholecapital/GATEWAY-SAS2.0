import { json, storeNonce } from './_util.js'
import { normTenant } from './_store.js'

function randNonce() {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('')
}

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '*'
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'vary': 'origin'
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || url.searchParams.get('t') || 'default')
  const address = (url.searchParams.get('address') || '').toLowerCase()
  const chainIdRaw = url.searchParams.get('chainId')
  const chainIdNum = Number(chainIdRaw)
  const chainId = Number.isFinite(chainIdNum) && chainIdNum > 0 ? chainIdNum : 1
  if (!address || !address.startsWith('0x')) return json({ error: 'Missing address' }, { status: 400, headers: corsHeaders(request) })

  const base = env.WG_BASE_URL || `${url.protocol}//${url.host}`
  const domain = new URL(base).host
  const nonce = randNonce()
  const issuedAt = new Date().toISOString()

  const message =
    `${domain} wants you to sign in with your Ethereum account:\n` +
    `${address}\n\n` +
      `Sign this message to enter the member's area.\nThere are no transaction fees. You are signing a message only.\n\n` +
    `URI: ${base}\n` +
    `Version: 1\n` +
    `Chain ID: ${chainId}\n` +
    `Nonce: ${nonce}\n` +
    `Issued At: ${issuedAt}`

  const key = `nonce:${tenant}:${address}:${chainId}`
  await storeNonce(env, key, { message, nonce, issuedAt, tenant }, 300)

  return json({ message, tenant }, { headers: corsHeaders(request) })
}
