export function getSlotPath(pageKey, slotId) {
  return `tenantContent.pages.${pageKey}.slots.${slotId}`
}

export function getSlotValue(source, pageKey, slotId) {
  return source?.pages?.[pageKey]?.slots?.[slotId] || null
}
