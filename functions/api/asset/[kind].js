import { normTenant } from '../_store.js'

function assetKey(tenant, kind) {
  return `asset:${normTenant(tenant)}:${String(kind || '').toLowerCase()}`
}

async function kvGet(env, key) {
  if (env?.WG_KV?.get) return await env.WG_KV.get(key)
  globalThis.__GW_ASSETS = globalThis.__GW_ASSETS || new Map()
  return globalThis.__GW_ASSETS.get(key) || null
}

function parseDataUrl(dataUrl) {
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl || '')
  if (!m) return null
  return { mime: m[1], b64: m[2] }
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || 'default')
  const kind = params.kind || 'asset'
  const raw = await kvGet(env, assetKey(tenant, kind))
  const parsed = parseDataUrl(raw || '')
  if (!parsed) return new Response('Not found', { status: 404 })
  const bin = Uint8Array.from(atob(parsed.b64), (c) => c.charCodeAt(0))
  return new Response(bin, {
    headers: {
      'content-type': parsed.mime,
      'cache-control': 'public, max-age=3600'
    }
  })
}
