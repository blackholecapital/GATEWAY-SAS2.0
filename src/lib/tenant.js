export function sanitizeTenant(raw) {
  const t = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
  return t || ''
}

export function tenantFromPathname(pathname) {
  const p = String(pathname || '/')
  const seg = p.split('?')[0].split('#')[0].split('/').filter(Boolean)[0] || ''
  // If first segment matches known top-level routes, treat as non-tenant
  const known = new Set(['gate','vip','perks','account','admin','admin-demo','denied','legal','b2b','b2b-tools','tools','members','enter'])
  const s = sanitizeTenant(seg)
  if (!s || known.has(s)) return ''
  return s
}

export function withTenant(path, tenant) {
  const t = sanitizeTenant(tenant)
  const p = path.startsWith('/') ? path : `/${path}`
  return t ? `/${t}${p}` : p
}
