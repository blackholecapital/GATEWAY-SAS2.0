export const SLOT_TYPES = ['textBubble', 'mediaEmbed', 'xFeed', 'logo', 'login', 'videoGrid', 'placeholder', 'status']

export const ACTION_TYPES = ['link', 'openFeed', 'openVideo', 'connectWallet', 'unlockTier', 'login', 'openDiscord', 'openExternal']

export const SLOT_EDITABLE_FIELDS = [
  'title',
  'body',
  'ctaLabel',
  'ctaUrl',
  'mediaUrl',
  'logoUrl',
  'feedHandle',
  'theme'
]

export const BASE_ACTION_SCHEMA = {
  actionId: '',
  label: '',
  type: 'link',
  url: ''
}

export const BASE_SLOT_SCHEMA = {
  slotId: '',
  page: '',
  label: '',
  type: 'placeholder',
  visible: true,
  title: '',
  body: '',
  ctaLabel: '',
  ctaUrl: '',
  mediaUrl: '',
  logoUrl: '',
  feedHandle: '',
  theme: '',
  sourcePath: '',
  fallback: {},
  actions: []
}

export const pageSchema = {
  gate: { pageKey: 'gate', route: '/gate' },
  vip: { pageKey: 'vip', route: '/vip' },
  perks: { pageKey: 'perks', route: '/perks' },
  account: { pageKey: 'account', route: '/account' }
}
