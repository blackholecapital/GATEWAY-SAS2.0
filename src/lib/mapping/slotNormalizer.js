import { BASE_SLOT_SCHEMA } from '../../config/spine/tenantContent.schema.js'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function normalizeAction(action = {}, index = 0, slotId = 'ACTION') {
  return {
    actionId: action.actionId || `${slotId}-ACT-${index + 1}`,
    label: action.label || 'Open',
    type: action.type || 'link',
    url: action.url || ''
  }
}

export function normalizeSlot(slot = {}, manifestItem = null) {
  const base = clone(BASE_SLOT_SCHEMA)
  const merged = {
    ...base,
    ...(manifestItem || {}),
    ...(slot || {})
  }

  const fallback = merged.fallback && typeof merged.fallback === 'object' ? merged.fallback : {}
  return {
    ...merged,
    title: merged.title || '',
    body: merged.body || '',
    ctaLabel: merged.ctaLabel || '',
    ctaUrl: merged.ctaUrl || '',
    mediaUrl: merged.mediaUrl || '',
    logoUrl: merged.logoUrl || '',
    feedHandle: merged.feedHandle || '',
    theme: merged.theme || '',
    sourcePath: merged.sourcePath || '',
    visible: merged.visible !== false,
    fallback,
    actions: Array.isArray(merged.actions) ? merged.actions.map((item, index) => normalizeAction(item, index, merged.slotId)) : []
  }
}
