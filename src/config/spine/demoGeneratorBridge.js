function asText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function buildAction(actionId, label, type = 'link', url = '') {
  return { actionId, label, type, url }
}

function mapLegacyHero(pageKey, legacy = {}, fallbackSlotId) {
  return {
    slotId: fallbackSlotId,
    page: pageKey,
    label: legacy.label || 'Legacy Hero',
    type: 'textBubble',
    visible: true,
    title: asText(legacy.title || legacy.header),
    body: asText(legacy.subtitle || legacy.body || legacy.copy),
    sourcePath: `bridge.legacy.pages.${pageKey}.hero`,
    actions: legacy.ctaUrl
      ? [buildAction(`ACT-${fallbackSlotId}-PRIMARY`, legacy.ctaLabel || 'Open', 'link', legacy.ctaUrl)]
      : []
  }
}

export function bridgeDemoGeneratorLegacy(raw = {}) {
  const next = { pages: {} }
  const pages = raw?.pages || {}

  if (pages.gate?.hero) {
    next.pages.gate = { slots: { 'GATE-03': mapLegacyHero('gate', pages.gate.hero, 'GATE-03') } }
  }

  if (pages.vip?.hero) {
    next.pages.vip = { slots: { 'VIP-01': mapLegacyHero('vip', pages.vip.hero, 'VIP-01') } }
  }

  if (pages.perks?.hero) {
    next.pages.perks = { slots: { 'PERKS-01': mapLegacyHero('perks', pages.perks.hero, 'PERKS-01') } }
  }

  if (pages.account?.hero) {
    next.pages.account = { slots: { 'ACCOUNT-01': mapLegacyHero('account', pages.account.hero, 'ACCOUNT-01') } }
  }

  const feedHandle = asText(raw?.socials?.xHandle || raw?.socials?.x)
  if (feedHandle) {
    next.pages.vip ||= { slots: {} }
    next.pages.vip.slots ||= {}
    next.pages.vip.slots['VIP-02'] = {
      slotId: 'VIP-02',
      page: 'vip',
      label: 'Bridge Feed',
      type: 'xFeed',
      visible: true,
      title: 'Imported Feed',
      body: 'Mapped from legacy Demo Generator fields.',
      feedHandle,
      sourcePath: 'bridge.legacy.socials.x'
    }
  }

  return clone(next)
}
