function safeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function detectMediaKind(url = '') {
  const value = safeText(url)
  if (!value) return 'empty'
  if (/youtube\.com|youtu\.be/i.test(value)) return 'youtube'
  if (/instagram\.com/i.test(value)) return 'instagram'
  if (/(twitter|x)\.com/i.test(value)) return 'x'
  if (/\.(png|jpe?g|gif|svg|webp)(\?|$)/i.test(value)) return 'image'
  return 'external'
}

export function mediaPreview(url = '', fallback = {}) {
  const kind = detectMediaKind(url)
  if (!safeText(url)) {
    return {
      kind: 'empty',
      title: fallback.title || 'Add media URL',
      body: fallback.body || 'No media URL configured yet.'
    }
  }

  return {
    kind,
    title: fallback.title || kind.toUpperCase(),
    body: fallback.body || url,
    url
  }
}
