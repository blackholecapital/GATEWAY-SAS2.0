import { json } from './_util.js'
import { loadConfig, normTenant } from './_store.js'

function pickCdnBase(env) {
  return (
    env?.TENANT_CDN_BASE_URL ||
    env?.TENANT_CDN_BASE ||
    env?.TENANT_CDN_URL ||
    ''
  )
}

function joinUrl(base, path) {
  if (!base) return ''
  const b = String(base).replace(/\/+$/, '')
  const p = String(path || '').replace(/^\/+/, '')
  return `${b}/${p}`
}

function toPublicCfgFromTenantJson(tenant, json, cdnBaseUrl) {
  const assets = json.assets || {}
  const socials = json.socials || {}
  const pages = json.pages || {}

  const absolutize = (p) => {
    if (!p) return ''
    if (/^https?:\/\//i.test(p)) return p
    if (!cdnBaseUrl) return p
    const base = String(cdnBaseUrl).replace(/\/+$/, '')
    const path = String(p).startsWith('/') ? p : `/${p}`
    return `${base}${path}`
  }

  // Normalize asset keys (tenant factory emits logoUrl/faviconUrl)
  const logo = assets.logo || assets.logoUrl || ''
  const favicon = assets.favicon || assets.faviconUrl || ''
  const wallpaper = assets.wallpaper || assets.wallpaperUrl || ''
  const heroImage = assets.heroImage || assets.heroImageUrl || ''

  return {
    tenant,
    gateMode: json.gateMode || 'SIGN_ONLY',
    layoutTemplate: Number(json.layoutTemplate || 1),

    // brand fields
    brandName: json.brandName || json.brand?.name || tenant,
    websiteUrl: json.websiteUrl || json.brand?.websiteUrl || '',
    tagline: json.tagline || json.brand?.tagline || json.brand?.vibeLine || '',
    vibeLine: json.vibeLine || json.brand?.vibeLine || json.brand?.tagline || '',

    colors: json.colors || {},

    // socials (include all the ones you asked for + safe extras)
    socials: {
      x: socials.x || socials.twitter || '',
      youtube: socials.youtube || '',
      discord: socials.discord || '',
      instagram: socials.instagram || '',
      tiktok: socials.tiktok || '',
      facebook: socials.facebook || '',
      linkedin: socials.linkedin || '',
      github: socials.github || '',
      telegram: socials.telegram || '',
      rumble: socials.rumble || '',
      twitch: socials.twitch || '',
      reddit: socials.reddit || ''
    },

    // assets (absolutize relative tenant paths to CDN if base exists)
    assets: {
      logo: absolutize(logo),
      favicon: absolutize(favicon),
      wallpaper: absolutize(wallpaper),
      heroImage: absolutize(heroImage)
    },

    // ✅ IMPORTANT: include the actual generated demo payload
    pages
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const tenant = normTenant(url.searchParams.get('tenant') || url.searchParams.get('t') || 'default')

  // 1) Prefer tenant-cdn Worker/R2 if configured
  const cdnBase = pickCdnBase(env)
  if (cdnBase) {
    try {
      const upstream = joinUrl(cdnBase, `/tenants/${encodeURIComponent(tenant)}.json`)
      const res = await fetch(upstream, {
        headers: {
          'accept': 'application/json'
        }
      })
      if (res.ok) {
        const tjson = await res.json().catch(() => null)
        if (tjson) {
          return json(toPublicCfgFromTenantJson(tenant, tjson, cdnBase))
        }
      }
      // If upstream 404/500, fall through to KV below
    } catch {
      // fall through to KV
    }
  }

  // 2) Fallback: existing KV-backed config
  const cfg = await loadConfig(env, tenant)

  // Public summary used by GateCard / theming
  return json({
    tenant,
    gateMode: cfg.gateMode || 'SIGN_ONLY',
    layoutTemplate: cfg.layoutTemplate || 1,
    brandName: cfg.brandName || 'Gateway',
    websiteUrl: cfg.websiteUrl || '',
    colors: cfg.colors || {},
    socials: cfg.socials || {},
    assets: cfg.assets || {},
    connected: false,
    chain: null
  })
}
