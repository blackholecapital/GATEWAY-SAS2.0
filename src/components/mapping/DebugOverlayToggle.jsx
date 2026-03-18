import { useEffect, useState } from 'react'

const KEY = 'gw_debug_overlay'

export default function DebugOverlayToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(KEY) === '1')
    } catch {
      setEnabled(false)
    }
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(KEY, next ? '1' : '0')
    } catch {
      // no-op
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gateway-debug-overlay', { detail: { enabled: next } }))
    }
  }

  return (
    <button type="button" className={`debug-toggle ${enabled ? 'on' : ''}`} onClick={toggle}>
      {enabled ? 'Hide map' : 'Show map'}
    </button>
  )
}
