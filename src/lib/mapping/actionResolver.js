export function resolveActionHref(action = {}) {
  if (action.type === 'openFeed' || action.type === 'openVideo' || action.type === 'openDiscord' || action.type === 'openExternal' || action.type === 'link') {
    return action.url || '#'
  }
  return '#'
}

export function executeAction(action = {}, { onLogin } = {}) {
  const href = resolveActionHref(action)
  if (action.type === 'login') {
    if (typeof onLogin === 'function') onLogin(action)
    return
  }

  if (action.type === 'connectWallet' || action.type === 'unlockTier') {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gateway-slot-action', { detail: action }))
    }
    return
  }

  if (typeof window !== 'undefined' && href && href !== '#') {
    if (href.startsWith('/')) {
      window.location.assign(href)
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }
}
