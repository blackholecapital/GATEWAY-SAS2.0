export const vipSlots = [
  { slotId: 'VIP-01', zone: 'hero', type: 'textBubble', label: 'Top Hero Editable Intro Box' },
  { slotId: 'VIP-02', zone: 'center-left', type: 'xFeed', label: 'Center Left X Feed Card' },
  { slotId: 'VIP-03', zone: 'center-right', type: 'status', label: 'Center Right Editable Info Card' },
  { slotId: 'VIP-04', zone: 'lower-left', type: 'textBubble', label: 'Lower Left Party Board Text Bubbles' },
  { slotId: 'VIP-05', zone: 'lower-middle', type: 'logo', label: 'Lower Middle Branding Logo Card' },
  { slotId: 'VIP-06', zone: 'lower-right', type: 'textBubble', label: 'Lower Right Posts Or Text Card' }
]

export const vipManifest = {
  page: 'vip',
  title: 'VIP',
  slotOrder: vipSlots.map((slot) => slot.slotId),
  layoutZones: ['hero', 'center-left', 'center-right', 'lower-left', 'lower-middle', 'lower-right'],
  mountPoints: ['header-extra', 'mid-stack', 'footer-utility'],
  debugLegendInfo: vipSlots
}
