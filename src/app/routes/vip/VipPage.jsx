import PageShell from '../PageShell.jsx'
import { vipManifest } from './vip.slots.js'
import VipLayout from './vip.layout.jsx'
import '../../../styles/overlay-theme.css'
import '../../../styles/slot-cards.css'
import '../../../styles/mapping-debug.css'

export default function VipPage() {
  return <PageShell manifest={vipManifest} Layout={VipLayout} />
}
