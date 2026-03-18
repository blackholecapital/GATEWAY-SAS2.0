import { useEffect, useMemo, useState } from 'react'
import DebugOverlayToggle from '../../components/mapping/DebugOverlayToggle.jsx'
import PageMapLegend from '../../components/mapping/PageMapLegend.jsx'
import { useTenantConfig } from '../../hooks/useTenantConfig.js'
import { normalizeSlot } from '../../lib/mapping/slotNormalizer.js'

export default function PageShell({ manifest, Layout }) {
  const { cfg } = useTenantConfig()
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    const sync = () => {
      try {
        setDebug(localStorage.getItem('gw_debug_overlay') === '1')
      } catch {
        setDebug(false)
      }
    }
    sync()
    window.addEventListener('gateway-debug-overlay', sync)
    return () => window.removeEventListener('gateway-debug-overlay', sync)
  }, [])

  const slotMap = useMemo(() => {
    const pageSlots = cfg?.tenantContent?.pages?.[manifest.page]?.slots || {}
    return manifest.debugLegendInfo.reduce((acc, item) => {
      acc[item.slotId] = normalizeSlot(pageSlots[item.slotId], item)
      return acc
    }, {})
  }, [cfg, manifest])

  return (
    <div className={`page gw overlay-page overlay-page-${manifest.page}`}>
      <div className="overlay-page-toolbar">
        <div>
          <div className="overlay-page-title">{cfg?.brand?.name || 'Gateway'} · {manifest.title}</div>
          <div className="overlay-page-sub">Pages render slots. Slots own content. Actions own behavior.</div>
        </div>
        <DebugOverlayToggle />
      </div>

      <PageMapLegend manifest={manifest} enabled={debug} />
      <Layout manifest={manifest} slotMap={slotMap} debug={debug} cfg={cfg} />
    </div>
  )
}
