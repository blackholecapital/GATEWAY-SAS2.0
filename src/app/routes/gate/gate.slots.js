export const gateSlots = [
  { slotId: 'GATE-01', zone: 'top-left', type: 'mediaEmbed', label: 'Top Left Social Card' },
  { slotId: 'GATE-02', zone: 'top-right', type: 'status', label: 'Top Right Session Card' },
  { slotId: 'GATE-03', zone: 'bottom-left', type: 'textBubble', label: 'Bottom Left Editable Text Card' },
  { slotId: 'GATE-04', zone: 'bottom-right', type: 'login', label: 'Bottom Right Customer Login Card' }
]

export const gateManifest = {
  page: 'gate',
  title: 'Gate',
  slotOrder: gateSlots.map((slot) => slot.slotId),
  layoutZones: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  mountPoints: ['header-extra', 'mid-stack', 'footer-utility'],
  debugLegendInfo: gateSlots
}
