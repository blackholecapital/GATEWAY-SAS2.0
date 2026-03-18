export async function apiGet(path) {
  const res = await fetch(path, { credentials: 'include' })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json')
    ? await res.json().catch(() => ({}))
    : await res
        .text()
        .then((t) => ({ message: t }))
        .catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error || data?.reason || res.statusText
    throw new Error(msg || 'Request failed')
  }
  return data
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {})
    })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json')
    ? await res.json().catch(() => ({}))
    : await res
        .text()
        .then((t) => ({ message: t }))
        .catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error || data?.reason || res.statusText

    throw new Error(msg || 'Request failed')
  }
  return data
}
