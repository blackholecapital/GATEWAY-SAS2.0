import { apiGet } from './api.js'
import { tenantContentDefaults } from '../config/spine/tenantContent.defaults.js'
import { bridgeDemoGeneratorLegacy } from '../config/spine/demoGeneratorBridge.js'
import { exportSlotMap } from '../config/spine/mapExport.js'

const tenantCache = new Map()
const DEFAULT_TAGLINE = 'VIP ACCESS'

function asText(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\}\}"\s*id\s*=.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toWords(value) {
  return asText(value).split(/\s+/).filter(Boolean)
}

export function hasEnoughText(value, { minChars = 0, minWords = 0 } = {}) {
  const text = asText(value)
  if (!text) return false
  const words = toWords(text)
  if (minChars && text.length < minChars) return false
  if (minWords && words.length < minWords) return false
  return true
}

export function pickTenantText(value, fallback, rules) {
  return hasEnoughText(value, rules) ? asText(value) : fallback
}

export function isValidHttpUrl(url) {
  return /^https?:\/\//i.test(asText(url))
}

export function pickTenantUrl(value, fallback = '') {
  return isValidHttpUrl(value) ? asText(value) : fallback
}

function toCardArray(items = []) {
  if (!Array.isArray(items)) return []
  return items.map((item = {}) => ({
    ...item,
    blurb: asText(item.blurb || item.body),
    body: asText(item.body || item.blurb),
    href: asText(item.href || item.url),
    url: asText(item.url || item.href)
  }))
}

function normalizeLinks(raw = {}) {
  return {
    gate: Array.isArray(raw.gate) ? raw.gate : [],
    vip: Array.isArray(raw.vip) ? raw.vip : [],
    perks: Array.isArray(raw.perks) ? raw.perks : [],
    account: Array.isArray(raw.account) ? raw.account : [],
    members: Array.isArray(raw.members) ? raw.members : []
  }
}

function normalizePages(pages = {}) {
  const gate = pages?.gate || {}
  const vip = pages?.vip || {}
  const perks = pages?.perks || {}
  const account = pages?.account || {}
  const members = pages?.members || {}

  return {
    gate: { ...gate, quickLinks: toCardArray(gate.quickLinks) },
    vip: {
      ...vip,
      announcements: toCardArray(vip.announcements),
      quickLinks: toCardArray(vip.quickLinks),
      partyBoard: { ...(vip.partyBoard || {}), items: toCardArray(vip?.partyBoard?.items) },
      announcementsBoard: { ...(vip.announcementsBoard || {}), items: toCardArray(vip?.announcementsBoard?.items) }
    },
    perks: {
      ...perks,
      topLinks: toCardArray(perks.topLinks),
      tierCards: toCardArray(perks.tierCards),
      marketplace: { ...(perks.marketplace || {}), items: toCardArray(perks?.marketplace?.items) },
      marketplaceItems: toCardArray(perks.marketplaceItems || perks?.marketplace?.items),
      campaigns: { ...(perks.campaigns || {}), items: toCardArray(perks?.campaigns?.items) }
    },
    account: {
      ...account,
      actions: Array.isArray(account.actions) ? account.actions : toCardArray(account.quickActions?.items),
      rewards: { ...(account.rewards || {}), rows: toCardArray(account?.rewards?.rows) },
      referralWidget: { ...(account.referralWidget || {}) },
      rewardsFeed: toCardArray(account.rewardsFeed || account.notes?.items),
      quickActions: { ...(account.quickActions || {}), items: toCardArray(account?.quickActions?.items) },
      socialsPanel: { ...(account.socialsPanel || {}), items: toCardArray(account?.socialsPanel?.items) },
      notes: { ...(account.notes || {}), items: toCardArray(account?.notes?.items) }
    },
    members: { ...members, sections: toCardArray(members.sections) }
  }
}

function scoreTenant(cfg) {
  let score = 0
  if (asText(cfg?.brand?.name).length) score += 10
  if (hasEnoughText(cfg?.brand?.tagline, { minChars: 6 })) score += 10
  if (asText(cfg?.assets?.logoUrl).length) score += 15
  if (asText(cfg?.assets?.faviconUrl).length) score += 5

  const socialsCount = ['x', 'youtube', 'discord', 'instagram', 'facebook', 'linkedin', 'tiktok']
    .map((k) => cfg?.socials?.[k])
    .filter((v) => isValidHttpUrl(v)).length
  if (socialsCount >= 3) score += 10
  if (cfg?.tenantContent?.pages?.gate?.slots?.['GATE-01']) score += 10
  if (cfg?.tenantContent?.pages?.vip?.slots?.['VIP-01']) score += 10
  if (cfg?.tenantContent?.pages?.perks?.slots?.['PERKS-03']) score += 15
  if (cfg?.tenantContent?.pages?.account?.slots?.['ACCOUNT-03']) score += 15

  return Math.min(100, score)
}

function deepMerge(base, extra) {
  if (Array.isArray(base) || Array.isArray(extra)) return extra !== undefined ? extra : base
  if (base && typeof base === 'object' && extra && typeof extra === 'object') {
    const next = { ...base }
    for (const key of Object.keys(extra)) next[key] = deepMerge(base?.[key], extra[key])
    return next
  }
  return extra !== undefined ? extra : base
}

function normalizeTenantContent(rawTenantContent = {}, legacyRaw = {}) {
  const bridged = bridgeDemoGeneratorLegacy(legacyRaw)
  return deepMerge(deepMerge(tenantContentDefaults, bridged), rawTenantContent)
}

export function normalizeTenantConfig(raw, tenant = 'default') {
  const cfg = raw || {}
  const brandName = asText(cfg?.brand?.name || cfg.brandName) || tenant
  const tagline = asText(cfg?.brand?.tagline || cfg?.brand?.vibeLine || cfg.tagline || cfg.vibeLine) || DEFAULT_TAGLINE
  const logoUrl = asText(cfg?.assets?.logoUrl || cfg?.assets?.logo || cfg?.assets?.logo_path || cfg?.brand?.logoUrl)
  const faviconUrl = asText(cfg?.assets?.faviconUrl || cfg?.assets?.favicon)

  const tenantContent = normalizeTenantContent(cfg?.tenantContent || {}, cfg)

  const normalized = {
    ...cfg,
    tenant,
    brand: {
      ...(cfg.brand || {}),
      name: brandName,
      tagline
    },
    brandName,
    tagline,
    assets: {
      ...(cfg.assets || {}),
      logoUrl,
      logo: logoUrl,
      faviconUrl,
      favicon: faviconUrl
    },
    socials: { ...(cfg.socials || {}) },
    links: normalizeLinks(cfg.links || {}),
    pages: normalizePages(cfg?.pages || {}),
    tenantContent
  }

  normalized.demoScore = scoreTenant(normalized)
  normalized.slotMapExport = exportSlotMap(tenantContent)
  return normalized
}

async function fetchFromTenantCdn(tenant) {
  const configuredBase = asText(
    import.meta.env.VITE_TENANT_CONFIG_BASE_URL ||
      import.meta.env.VITE_TENANT_CDN_BASE_URL ||
      import.meta.env.VITE_TENANT_CDN_BASE
  )

  const bases = []
  if (configuredBase) bases.push(configuredBase)
  if (typeof window !== 'undefined' && window.location?.origin) {
    bases.push(window.location.origin)
    if (/\.pages\.dev$/i.test(window.location.hostname)) {
      bases.push('https://gateway.xyz-labs.xyz')
    }
  }

  const seen = new Set()
  const uniqueBases = bases.map((b) => String(b || '').replace(/\/+$/, '')).filter((b) => b && !seen.has(b) && seen.add(b))

  for (const base of uniqueBases) {
    const url = `${base}/tenants/${encodeURIComponent(tenant)}.json`
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) continue
      const json = await res.json().catch(() => null)
      if (json && typeof json === 'object') return json
    } catch {
      // try next base
    }
  }

  return null
}

export async function loadTenantConfig(tenant) {
  const ten = asText(tenant) || 'default'
  if (tenantCache.has(ten)) return tenantCache.get(ten)

  let next = null
  try {
    const cdnCfg = await fetchFromTenantCdn(ten)
    if (cdnCfg) next = normalizeTenantConfig(cdnCfg, ten)
  } catch {
    next = null
  }

  if (!next) {
    try {
      const fallback = await apiGet(`/api/config?tenant=${encodeURIComponent(ten)}`)
      next = normalizeTenantConfig(fallback, ten)
    } catch {
      next = normalizeTenantConfig({}, ten)
    }
  }

  tenantCache.set(ten, next)
  return next
}

export function clearTenantConfigCache() {
  tenantCache.clear()
}
