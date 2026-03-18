import { slotRegistry } from './slotRegistry.js'

export function exportSlotMap(tenantContent = {}) {
  return Object.values(slotRegistry).map((manifest) => ({
    page: manifest.page,
    mountPoints: manifest.mountPoints,
    slots: manifest.debugLegendInfo.map((item) => {
      const slot = tenantContent?.pages?.[manifest.page]?.slots?.[item.slotId] || {}
      return {
        page: manifest.page,
        slotId: item.slotId,
        label: slot.label || item.label,
        type: slot.type || item.type,
        sourcePath: slot.sourcePath || `tenantContent.pages.${manifest.page}.slots.${item.slotId}`,
        actionIds: Array.isArray(slot.actions) ? slot.actions.map((action) => action.actionId) : [],
        adminEditableFields: ['title', 'body', 'ctaLabel', 'ctaUrl', 'mediaUrl', 'logoUrl', 'feedHandle', 'theme']
      }
    })
  }))
}
