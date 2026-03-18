export const accountSlots = [
  { slotId: 'ACCOUNT-01', zone: 'top-left', type: 'textBubble', label: 'Editable Account Overview Card' },
  { slotId: 'ACCOUNT-02', zone: 'top-right', type: 'status', label: 'Status Session Utility Card' },
  { slotId: 'ACCOUNT-03', zone: 'bottom-left', type: 'mediaEmbed', label: 'YouTube Or Media Card' },
  { slotId: 'ACCOUNT-04', zone: 'bottom-middle', type: 'xFeed', label: 'X Or Social Card' },
  { slotId: 'ACCOUNT-05', zone: 'bottom-right', type: 'logo', label: 'Editable Notes Logo Or Text Card' }
]

export const accountManifest = {
  page: 'account',
  title: 'Account',
  slotOrder: accountSlots.map((slot) => slot.slotId),
  layoutZones: ['top-left', 'top-right', 'bottom-left', 'bottom-middle', 'bottom-right'],
  mountPoints: ['header-extra', 'mid-stack', 'footer-utility'],
  debugLegendInfo: accountSlots
}
