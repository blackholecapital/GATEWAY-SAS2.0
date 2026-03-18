export const perksSlots = [
  { slotId: 'PERKS-01', zone: 'hero', type: 'textBubble', label: 'Top Intro Editable Box' },
  { slotId: 'PERKS-02', zone: 'upper-left', type: 'status', label: 'Tier 1 Welcome Or Info Card' },
  { slotId: 'PERKS-03', zone: 'upper-right', type: 'videoGrid', label: 'Tier 2 Exclusive Content Grid' },
  { slotId: 'PERKS-04', zone: 'lower-left', type: 'placeholder', label: 'Tier 3 Billing Placeholder' },
  { slotId: 'PERKS-05', zone: 'lower-right', type: 'textBubble', label: 'Lower Support Text Or Branding Utility Card' }
]

export const perksManifest = {
  page: 'perks',
  title: 'Perks',
  slotOrder: perksSlots.map((slot) => slot.slotId),
  layoutZones: ['hero', 'upper-left', 'upper-right', 'lower-left', 'lower-right'],
  mountPoints: ['header-extra', 'mid-stack', 'footer-utility'],
  debugLegendInfo: perksSlots
}
